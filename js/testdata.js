d3.json("data/userstudy_record_trial.json").then(X => {
    d3.json("data/userstudy_record_selection.json").then(selectedArmIds => {
        d3.json("data/userstudy_record_reward.json").then(rewards => {
            let trials = X.map((_, i) => i);
            debugger
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
            alphas.forEach(alpha => {
                let payoffsAlpha = linUCBFromData(alpha, X, selectedArmIds, rewards);
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
            drawRegrets("regretsTest", testLineChartData);
        });
    });
});
