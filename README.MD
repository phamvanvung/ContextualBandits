<h3>Installation</h3>
Include the script file into html page:
<br/>`<script src = 'js/contextualbandits.min.js'></script>`

<h3>Creating an agent</h3>
<code>let lucb = new LinUCB(alpha, nArms, nFeatures);</code>where <code>alpha</code>is a parameter (<code>\alpha = \sqrt{ln(2/\sigma)/2}</code>), <code>nArms</code>is the number of available arms per trial, <code>nFeatures</code>is the number of features per arm (features for the context).

<h3>Saving an agent</h3>
Save the agent using <code>let jsonData = lucb.getAgentData()</code>, this method returns the current agent data in form of a json object (<code>jsonData</code>).

<h3>Loading an agent</h3>
Load the agent using <code>let lucb = LinUCB.createAgentFromData(jsonData)</code>, this is a static method to create the agent with previously saved data.
<br/>
<br/><h3>Online training</h3>
At each trial <code>t</code>do:<br/>
1. Get recommended arms: <code>let recommendedActions = lucb.recommend(armContexts, armsToRecommend);</code>, where <code>armContexts</code>are the array of contexts of all available arms at this time, and <code>armsToRecommend</code>is the number of arms that the user would like to pick out for recommendations.<br/>
2. Collect rewards from user and store it to <code>rewards</code>variable for each of the recommended arms. <br/>
3. Update the learned parameters by calling to <code>lucb.include(armContexts, recommendedActions, rewards);</code>, where <code>armContexts</code>are the contexts of all the available arms, <code>recommendedArms</code>are those who got recommended at trial <code>t</code>, and <code>rewards</code>are the observed rewards for those who got recommended.<br/>
4. Continue to the next trial.<br/>

<br/>Note: It's a good practice to always normalize the context data (not the reward data), to have better performance. This is to avoid one attribute dominates the others in the contribution to the learning process due to different value ranges.

<h3>Offline training</h3>
Learn from offline data <code>lucb.learnFromOfflineData(X, selectedArmIds, rewards)</code>, where <code>X</code>is an array of <code>T</code>trials, each trial <code>t</code>has <code>k</code>arms, each arm has <code>d</code>features, <code>selectedArmIds</code>is an array of size <code>T</code>, at each trial it contains an array of the <code>indices</code>of the available arms that got recommended, and <code>rewards</code>is also an array of size <code>T</code>, at each trial <code>t</code>it contains an array of the observed rewards for the corresponding recommended arms.   