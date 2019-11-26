const N_TRIALS = 200;
const N_ARMS = 36;
const N_FEATURES = 17;
const BEST_ARMS = [1, 3, 5, 9];
const N_ARMS_TO_RECOMMEND = 4;

// const N_TRIALS = 2000;
// const N_ARMS = 36;
// const N_FEATURES = 5;
// const BEST_ARMS = [1, 3, 5];
// const N_ARMS_TO_RECOMMEND = 4;


let trials = Array.from(new Array(N_TRIALS), (_, i) => i);
let X = generateData(N_TRIALS, N_ARMS, N_FEATURES);
let trueTheta = generateTheta(N_ARMS, N_FEATURES, BEST_ARMS, 1.0);

let oracles = X.map(trial => {
    //Generate array of scores => then sort ascending => then take the last N_ARMS (largest)
    return math.sum((trial.map((arm, i) => {
        return math.dot(arm, trueTheta[i]);
    })).sort((a, b) => a - b).slice(-N_ARMS_TO_RECOMMEND));
});
let payoffsRandom = X.map(trial => {
    let totalRewards = 0;
    for (let i = 0; i < N_ARMS_TO_RECOMMEND; i++) {
        //Select one random arm
        let randomArm = d3.randomInt(0, N_ARMS)();
        //Add the score
        totalRewards += math.dot(trial[randomArm], trueTheta[randomArm]);
    }
    return totalRewards;
});

let regretsRandom = makeRegret(payoffsRandom, oracles);
let regrets = {};
regrets['random'] = regretsRandom;

let alphas = [0, 1.0, 2.5, 5.0, 10.0];
alphas.forEach(alpha => {
    let payoffsAlpha = linUCB(alpha, X, generateReward, trueTheta, N_ARMS_TO_RECOMMEND);
    regrets['alpha=' + alpha] = makeRegret(payoffsAlpha, oracles);
});

