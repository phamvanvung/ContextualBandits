function drawTheta(containerId, heatMapData) {

    let heatMapSettings = {
        noSvg: false,
        showAxes: true,
        paddingLeft: 60,
        paddingRight: 50,
        paddingTop: 20,
        paddingBottom: 45,
        showColorBar: true,
        xAxisLabel: {text: 'arms'},
        yAxisLabel: {text: 'features'}
    };
    let hm = new HeatMap(document.getElementById(containerId), heatMapData, heatMapSettings);
    hm.plot();


}
function drawRegrets(containerId, lineChartData){
    let lcSettings = {
        noSvg: false,
        showAxes: true,
        paddingLeft: 60,
        paddingRight: 30,
        paddingTop: 20,
        paddingBottom: 45,
        legend: {
            x: 60 + 20,
            y: 20 + 20
        },
        xAxisLabel: {text: 'trials'},
        yAxisLabel: {text: 'cumulative regrets'}
    };
    //Change color scheme to category 10
    lcSettings.colorScale = d3.scaleOrdinal()
        .domain(lineChartData.map(ld => ld.series))
        .range(lineChartData.map((_, i) => {
            return d3.schemeCategory10[i];
        }));

    let lc = new LineChart(document.getElementById(containerId),
        lineChartData, lcSettings);
    lc.plot();
}