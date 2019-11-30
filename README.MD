Usage:
Initialization <br/>
`let payoffs = [], lucb = new LinUCB(alpha, nTrials, nArms, nFeatures);`
<br/>
At each trial `t` do:<br/>
    1. Get recommended arms: `let recommendedActions = lucb.recommend(armContexts, armsToRecommend);`, where `armContexts` are the array of contexts of all available arms at this time, and `armsToRecommend` is the number of arms that the user would like to pick out for recommendations.<br/>
    2. Collect rewards from user and store it to `rewards` variable for each of the recommended arms. <br/>
    3. Update the learned parameters by calling to `lucb.include(armContexts, recommendedActions, rewards);`, where `armContexts` are the contexts of all the available arms, `recommendedArms` are those who got recommended at trial `t`, and `rewards` are the observed rewards for those who got recommended.
    4. Continue to the next trial.
      