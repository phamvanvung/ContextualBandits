export class LinUCB{
    private alpha;
    private nTrials;
    private nArms;
    private nFeatures;
    private A;
    private b;
    private theta;
    constructor(alpha, nTrials, nArms, nFeatures){
        this.alpha = alpha;
        this.nTrials = nTrials;
        this.nArms = nArms;
        this.nFeatures = nFeatures;
        //Initialization
        this.A = [];
        this.b = [];
        this.theta = [];
    }

}
