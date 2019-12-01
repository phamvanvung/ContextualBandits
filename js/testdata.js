function learnAndDisplayPayoffs(containerId, X, selectedArmIds, rewards, agents) {
    if (!agents) {
        agents = [];
    }
    let trials = X.map((_, i) => i);
    let regrets = {};
    //Oracle
    let oracles = rewards.map(r => {
        return d3.sum(r);
    });

    //Need regret for random
    let nArmsToRecommend = selectedArmIds[0].length;
    let nArms = X[0].length;

    let payoffsRandom = selectedArmIds.map((selectedArms, t) => {
        let totalRewards = 0;

        let recommendedArms = [];
        for (let i = 0; i < nArmsToRecommend; i++) {
            //Select one random arm
            let randomArm = d3.randomInt(0, nArms)();
            while (recommendedArms.indexOf(randomArm) >= 0) {
                randomArm = d3.randomInt(0, nArms)();//Generate another one if the random arm was selected in this trial
            }
            recommendedArms.push(randomArm);

            //Add the score
            //Note very well that the selectedArms are the indices from the whole arm set per trial but the rewards are stored by index (not by the id of the arm the two are different).
            totalRewards += selectedArms.indexOf(randomArm) >= 0 ? rewards[t][selectedArms.indexOf(randomArm)] : 0;
        }
        return totalRewards;
    });
    regrets['random'] = makeRegret(payoffsRandom, oracles);
    //Regret for alphas
    let alphas = [0, 1.0, 2.5, 5.0, 10.0];

    alphas.forEach((alpha, agentIdx) => {
        let payoffsAlpha = null;
        if (agents.length > agentIdx) {
            payoffsAlpha = agents[agentIdx].learnFromOfflineData(X, selectedArmIds, rewards);
        } else {
            let ret = linUCBFromData(alpha, X, selectedArmIds, rewards);
            agents.push(ret.agent);
            payoffsAlpha = ret.payoffs;
        }
        regrets['alpha=' + alpha] = makeRegret(payoffsAlpha, oracles);
    });

    //Draw regrets
    let testLineChartData = Object.keys(regrets).map(k => {
        return {
            x: trials,
            y: regrets[k],
            series: k
        }
    });
    drawRegrets(containerId, testLineChartData);
    return agents;
}

d3.json("data/2000_userstudy_record_trial_normalize.json").then(X => {
    d3.json("data/2000_userstudy_record_selection_normalize.json").then(selectedArmIds => {
        d3.json("data/2000_userstudy_record_reward (2).json").then(rewards => {
            let X1 = X.slice(1000);
            let selectedArmIds1 = selectedArmIds.slice(1000);
            let rewards1 = rewards.slice(1000);
            let agents = learnAndDisplayPayoffs("regretsTest1", X1, selectedArmIds1, rewards1);
            let X2 = X.slice(1000);
            let selectedArmIds2 = selectedArmIds.slice(1000);
            let rewards2 = rewards.slice(1000);
            learnAndDisplayPayoffs("regretsTest2", X2, selectedArmIds2, rewards2);
            learnAndDisplayPayoffs("regretsTest3", X2, selectedArmIds2, rewards2, agents);
        });
    });
});
