//Explanation of the algorithm is from here: https://www.kaggle.com/phamvanvung/linucb-thompson-sampling?scriptVersionId=23942333
import {create, all} from "mathjs";

import * as d3 from "d3-random";

const config = {}
const math = create(all, config);

export class LinUCB {
    private alpha;
    private nArms;
    private nFeatures;
    private A;
    private b;

    constructor(alpha, nArms, nFeatures) {
        this.alpha = alpha;
        this.nArms = nArms;
        this.nFeatures = nFeatures;
        //Initialization
        this.A = [];
        this.b = [];
        for (let a = 0; a < nArms; a++) {
            this.A.push(math.identity(nFeatures));
            this.b.push(math.zeros(nFeatures));
        }
    }

    public setA(A) {
        this.A = A;
    }

    public setB(b) {
        this.b = b;
    }

    public saveAgent() {
        let jsonData = {};
        jsonData['alpha'] = this.alpha;
        jsonData['nArms'] = this.nArms;
        jsonData['nFeatures'] = this.nFeatures;
        jsonData['A'] = this.A;
        jsonData['b'] = this.b;
        return jsonData;
    }

    public static createAgentFromData(jsonData) {
        let alpha = jsonData.alpha;
        let nArms = jsonData.nArms;
        let nFeatures = jsonData.nFeatures;
        let A = jsonData.A;
        let b = jsonData.b;
        let agent = new LinUCB(alpha, nArms, nFeatures);
        agent.setA(A);
        agent.setB(b);
        return agent;
    }

    public learnFromOfflineData(X, selectedArmIds, rewards) {
        const payoffs = [];
        const nTrials = X.length;
        for (let t = 0; t < nTrials; t++) {
            // compute the predictions for all arms of each trial
            let armsToRecommend = selectedArmIds[t].length;
            let recommendedActions = this.recommend(X[t], armsToRecommend);
            let r = [];//Payoffs for the recommended arms as of our recommendation.
            for (let i = 0; i < recommendedActions.length; i++) {
                let chosenArm = recommendedActions[i];//Take one arm
                let rw = selectedArmIds[t].indexOf(chosenArm) >= 0 ? rewards[t][selectedArmIds[t].indexOf(chosenArm)] : 0;
                r.push(rw);
            }
            payoffs[t] = math.sum(r);
            // update intermediate object
            this.include(X[t], recommendedActions, r);
        }
        return payoffs;
    }

    public include(arms, chosenArmIds, rewards) {
        let self = this;
        // update intermediate object
        chosenArmIds.forEach((chosenArm, i) => {
            //chosenArms are the ids of the arms, but the rewards is the array => so index is 0 based
            let xChosenArm = arms[chosenArm];
            let reward = rewards[i];
            let xMat = xChosenArm.map(f => [f]);
            self.A[chosenArm] = math.add(self.A[chosenArm], math.multiply(xMat, math.transpose(xMat)));
            self.b[chosenArm] = math.add(self.b[chosenArm], xChosenArm.map(v => v * reward));

        });
    }

    public predict(arms) {
        let theta = [];
        let p = [];
        let nArms = arms.length;
        let self = this;
        for (let a = 0; a < nArms; a++) {
            let invA = math.inv(self.A[a]);
            theta[a] = invA._data.map(row => {
                return math.dot(row, self.b[a]);
            });
            let ctxDotInvA = invA._data.map(row => {
                return math.dot(row, arms[a]);
            });
            p[a] = math.dot(theta[a], arms[a]) + self.alpha * math.sqrt(math.dot(ctxDotInvA, arms[a]));
        }
        return p;
    }

    public recommend(arms, numberOfArms) {
        let predictions = this.predict(arms);
        let armIds = arms.map((a, i) => i);
        armIds.sort((a, b) => {
            return predictions[b] - predictions[a];
        });
        let results = [];
        for (let i = 0; i < numberOfArms; i++) {
            results.push(armIds[i]);
        }
        return results;
    }
}

/**
 *
 * @param payoffs   {Array}: array of payoffs for every trial
 * @param oracles   {Array}: array of optimal score for every trial
 * @return {Array}: the cumulative sum of regrets (optimal reward - observed reward)
 */
export function makeRegret(payoffs, oracles) {
    let cusum = [];
    let cs = 0;
    oracles.forEach((o, i) => {
        cs += o - payoffs[i];
        cusum.push(cs);
    });
    return cusum;
}
