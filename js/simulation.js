const N_TRIALS = 2000;
const N_ARMS = 16;
const N_FEATURES = 5;
const BEST_ARMS = [1, 3, 5];

let X = generateData(N_TRIALS, N_ARMS, N_FEATURES);
let trueTheta = generateTheta(N_ARMS, N_FEATURES, BEST_ARMS, 1.0);

//Add argmax method
math.argmax = (a)=>a.indexOf(math.max(a));

/**
 * Simulate the learning process and observe the payoffs
 * @param alpha number: this is the :math:`\alpha = \sqrt{ln(2/\sigma)/2}`
 * @param X {Array: nTrials x nArms x nFeatures}: The observed data
 * @param generateReward {function}: A function used to generate the reward data
 * @param trueTheta {Array: nArms x nFeatures}: true theta used to generate reward
 * @return {Array}: the payoffs for every trial.
 */
function linUCB(alpha, X, generateReward, trueTheta) {
    const nTrials = X.length;
    const nArms = X[0].length;
    const nFeatures = X[0][0].length;
    //Initialize A
    let payoffs = [];
    let lucb = new LinUCB(alpha, nTrials, nArms, nFeatures);

    for (let t = 0; t < nTrials; t++) {
        // compute the estimates (theta) and prediction for all arms
        let recommendedActions = lucb.recommend(X[t], 1);//Recommend one by now
        let chosenArm = recommendedActions[0];//Take only one
        let xChosenArm = X[t][chosenArm];
        payoffs[t] = generateReward(chosenArm, xChosenArm, trueTheta);
        // update intermediate object
        lucb.include(X[t], [chosenArm], [payoffs[t]]);
    }
    return payoffs;
}
