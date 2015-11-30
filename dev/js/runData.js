/****************************************************************************
 * Global Variables
 ***************************************************************************/
var stringUtils = new StringUtils();
var timeUtils = new TimeUtils();
var posts = JSON.parse(localStorage.getItem("runData"));

var data = {};
var startDate = timeUtils.getTimeFromDate("10-18-2015");
var weekMillis = 1000 * 60 * 60 * 24 * 7; 
var weeks = createWeekArray();
var weekArrays = {
    labels: [],
    distance: [],
    pace: [],
    time: []
};

var dayArrays = {
    labels: [],
    distance: [],
    pace: [],
    time: []
};

for(x in posts){
    if(x !== "total"){      
        var pace = posts[x].pace;
        var paceTotal = timeUtils.convertMinutesStringToSeconds(pace);       
        var time = posts[x].time;
        var timeTotal = timeUtils.convertHoursStringToSeconds(time);
        
        dayArrays.labels.push(posts[x].date);
        dayArrays.pace.push(paceTotal);
        dayArrays.distance.push(posts[x].distance);
        dayArrays.time.push(timeTotal);     
    }
}

data.distance = dayArrays.distance;
data.pace = dayArrays.pace;
data.time = dayArrays.time;
data.labels = dayArrays.labels;
data.charts = {};

var chartOptions = {};

chartOptions.pace = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : false,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",
    
    scaleFontColor: "black",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,
    
    scaleLabel: function (valuePayload){
        var value = parseInt(valuePayload.value);
        return " " + stringUtils.timeInMinutes(value);
    },  
    tooltipTemplate: function(valuePayload){
        var value = parseInt(valuePayload.value);
        return valuePayload.label + " -- " + stringUtils.timeInMinutes(value);
    }
};

chartOptions.distance = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",
    
    scaleFontColor: "black",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,
    
    scaleLabel: function (valuePayload){
        return " " + stringUtils.distance(valuePayload.value); 
    },  
    tooltipTemplate: function(valuePayload){
        return valuePayload.label + " -- " + stringUtils.distance(valuePayload.value);
    }
};

chartOptions.time = {
    //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
    scaleBeginAtZero : true,

    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines : true,

    //String - Colour of the grid lines
    scaleGridLineColor : "rgba(0,0,0,.05)",
    
    scaleFontColor: "black",

    //Number - Width of the grid lines
    scaleGridLineWidth : 1,

    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,

    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,

    //Boolean - If there is a stroke on each bar
    barShowStroke : true,

    //Number - Pixel width of the bar stroke
    barStrokeWidth : 2,

    //Number - Spacing between each of the X value sets
    barValueSpacing : 5,

    //Number - Spacing between data sets within X values
    barDatasetSpacing : 1,
    
    scaleLabel: function (valuePayload){
        var value = parseInt(valuePayload.value);
        return " " + stringUtils.timeInHours(value);
         
    },  
    tooltipTemplate: function(valuePayload){
        var value = parseInt(valuePayload.value);
        return valuePayload.label + " -- " + stringUtils.timeInHours(value);
    }
};


/****************************************************************************
 * Function declarations
 ***************************************************************************/
function getRunData(type){
    return {
        labels: data.labels,
        datasets: [
            {
                label: "First",
                label: "My Second dataset",
                fillColor: "coral",
                strokeColor: "coral",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: data[type]
            }
        ]
    }
}

function createChart(type){
    var options = chartOptions[type];
    var runData = getRunData(type);
    var ctx = $("#" + type + "Chart").get(0).getContext("2d");
    data.charts[type] = new Chart(ctx).Bar(runData, options);
}

function initializeCharts(){
    createChart("pace");
    createChart("distance");
    createChart("time");
}

function createWeekArray(){
    var weekArray = [];
    var returnMax = startDate;
    var max = timeUtils.getCurrentTime();
    weekArray.push({
       week: startDate,
       distance: 0,
       pace: 0,
       time: 0,
       paceCount: 0
    });
    
    var daylightSavingsEnd = timeUtils.getTimeFromDate("11/1/2015") + 1000 * 60 * 60 * 2;
    var daylightSavingsFlag = false;
    
    while(returnMax < max){
        //daylight savings end check
        if(returnMax >= daylightSavingsEnd && !daylightSavingsFlag){
            returnMax += 1000 * 60 * 60;
            daylightSavingsFlag = true;
        }
        returnMax += weekMillis;
        weekArray.push({
           week: returnMax,
           distance: 0,
           pace: 0,
           time: 0,
           paceCount: 0
        });
    }
    return weekArray;
}

function setWeekValues(){
    for(var j = 0; j<dayArrays.labels.length; j++){
        var currentDate = timeUtils.getTimeFromDate(dayArrays.labels[j]);
        for(var k = 0; k<weeks.length; k++){
            if(currentDate >= weeks[k].week){
                continue;
            }else{
                weeks[k-1].distance = weeks[k-1].distance + dayArrays.distance[j];
                weeks[k-1].pace = weeks[k-1].pace + dayArrays.pace[j];
                weeks[k-1].time = weeks[k-1].time + dayArrays.time[j];
                weeks[k-1].paceCount = weeks[k-1].paceCount + 1;
                break;
            }
        }
    }
    
    for(var i = 0; i<weeks.length; i++){
        if(weeks[i].paceCount > 0){
            weeks[i].pace = Math.floor(weeks[i].pace/weeks[i].paceCount);
        }
    }
}

function createWeekArrays(){
    for(var i = 0; i<weeks.length; i++){
        weekArrays.labels.push(stringUtils.dateTime(weeks[i].week));
        weekArrays.distance.push(weeks[i].distance);
        weekArrays.pace.push(weeks[i].pace);
        weekArrays.time.push(weeks[i].time);
    }
    
    for(var x in weekArrays){
        weekArrays[x].splice(weekArrays[x].length-1, 1);
    }
}

function createWeekDisplay(type, interval){
    if(interval === "day"){
        data[type] = dayArrays[type];
        data.labels = dayArrays.labels;       
    }else if(interval === "week"){
        data[type] = weekArrays[type];
        data.labels = weekArrays.labels;
    }
    data.charts[type].destroy();
    createChart(type);
}

function initializePage(){
    initializeCharts();
    setWeekValues();
    createWeekArrays();
}

/****************************************************************************
 * Executed On load
 ***************************************************************************/
initializePage();