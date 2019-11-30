Usage:<br/>
Include the script file into html page:
<br/>`<script src = 'js/contextualbandits.min.js'></script>`
<br/>Initialization:
<br/>`let lucb = new LinUCB(alpha, nArms, nFeatures);` where `alpha` is a parameter (`\alpha = \sqrt{ln(2/\sigma)/2}`), `nArms` is the number of available arms per trial, `nFeatures` is the number of features per arm (features for the context).
<br/>
At each trial `t` do:<br/>
    1. Get recommended arms: `let recommendedActions = lucb.recommend(armContexts, armsToRecommend);`, where `armContexts` are the array of contexts of all available arms at this time, and `armsToRecommend` is the number of arms that the user would like to pick out for recommendations.<br/>
    2. Collect rewards from user and store it to `rewards` variable for each of the recommended arms. <br/>
    3. Update the learned parameters by calling to `lucb.include(armContexts, recommendedActions, rewards);`, where `armContexts` are the contexts of all the available arms, `recommendedArms` are those who got recommended at trial `t`, and `rewards` are the observed rewards for those who got recommended.
    4. Continue to the next trial.

<br/>Note: It's a good practice to always normalize the context data (not the reward data), to have better performance. This is to avoid one attribute dominates the others in the contribution to the learning process due to different value ranges.