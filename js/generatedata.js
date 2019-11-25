/**
 * Generate the context vector each has nFeatures, for every nArms, at each trial t our of nTrials
 * @param nTrials   int: total number of trials
 * @param nArms int: total number of arms per trials
 * @param nFeatures int: number of features per arm (context dimension)
 * @return a matrix for the simulated data
 */
function generateData(nTrials, nArms, nFeatures) {
    let X = [];
    for (let t = 0; t < nTrials; t++) {
        let trial = [];
        for (let a = 0; a < nArms; a++) {
            let arm = [];
            for (let f = 0; f < nFeatures; f++) {
                arm.push(Math.random());
            }
            trial.push(arm);
        }
        X.push(trial);
    }
    return X;
}

/**
 *
 * @param nArms int: number of arms per trial
 * @param nFeatures int: number of features per arm
 * @param bestArms {Array: int}: the indices of biased (good) arms
 * @param bias number: the values (reward) to be added to the best arms
 * @return {Array}: an array ofo size nArms x nFeatures
 */
function generateTheta(nArms, nFeatures, bestArms, bias = 1) {
    let theta = [];
    let rn = d3.randomNormal(0, 0.25);
    for (let a = 0; a < nArms; a++) {
        let ta = [];
        for (let f = 0; f < nFeatures; f++) {
            ta.push(rn());
        }
        theta.push(ta);
    }
    //Add bias to all features of the best arms
    bestArms.forEach(ba => {
        for (let f = 0; f < nFeatures; f++) {
            theta[ba][f] += bias;
        }
    });
    return theta;
}

/**
 *
 * @param arm int: the arm index (used to select corresponding theta row for the dot product)
 * @param context {Array of size nFeatures}: the context of one arm that we are calculating the score (array of nFeatures)
 * @param theta {Array of size nArms x nFeatures}: Used to calculate the score
 * @param noiseSd float: the standard deviation of the noise to be added to the score
 */
function generateReward(arm, context, theta, noiseSd = 0.1) {
    let signal = math.dot(context, theta[arm]);
    let noise = d3.randomNormal(0, noiseSd)();
    return signal + noise;
}

/**
 *
 * @param payoffs   {Array}: array of payoffs for every trial
 * @param oracles   {Array}: array of optimal score for every trial
 * @return {Array}: the cumulative sum of regrets (optimal reward - observed reward)
 */
function makeRegret(payoffs, oracles) {
    let cusum = [];
    let cs = 0;
    oracles.forEach((o, i) => {
        cs += o - payoffs[i];
        cusum.push(cs);
    });
    return cusum;
}
