//Explanation of the algorithm is from here: https://www.kaggle.com/phamvanvung/linucb-thompson-sampling?scriptVersionId=23942333
import {create, all} from "mathjs";

import * as d3 from "d3-random";

const config = {}
const math = create(all, config);

export class LinUCB {
    private alpha;
    private nTrials;
    private nArms;
    private nFeatures;
    private A;
    private b;

    constructor(alpha, nTrials, nArms, nFeatures) {
        this.alpha = alpha;
        this.nTrials = nTrials;
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
