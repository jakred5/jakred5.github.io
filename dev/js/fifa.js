var timeUtils = new TimeUtils();
var db = new DB();
var jsonUtils = new JsonUtils();
var stringUtils = new StringUtils();
var dateUtils = new DateUtils();
var domUtils = new DomUtils();
var playersObject = {}; //local object representing players, needs to be updated when db updated
var sortMultiplier = 1;
var previousSort = "";
var currentSeason = 3;

var sortFunctions = {
    "firstName": function(o1, o2){
        var value1 = $(o1).attr("data-firstName");
        var value2 = $(o2).attr("data-firstName");
        if(value1 < value2){
            return -1 * sortMultiplier;
        }else if(value1 > value2){
            return 1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "lastName": function(o1, o2){
        var value1 = $(o1).attr("data-lastName");
        var value2 = $(o2).attr("data-lastName");
        if(value1 < value2){
            return -1 * sortMultiplier;
        }else if(value1 > value2){
            return 1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "position": function(o1, o2){
        var value1 = $(o1).attr("data-position");
        var value2 = $(o2).attr("data-position");
        if(value1 < value2){
            return -1 * sortMultiplier;
        }else if(value1 > value2){
            return 1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "country": function(o1, o2){
        var value1 = $(o1).attr("data-country");
        var value2 = $(o2).attr("data-country");
        if(value1 < value2){
            return -1 * sortMultiplier;
        }else if(value1 > value2){
            return 1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "overall": function(o1, o2){
        var value1 = parseInt($(o1).attr("data-overall"));
        var value2 = parseInt($(o2).attr("data-overall"));
        if(value1 < value2){
            return -1 * sortMultiplier;
        }else if(value1 > value2){
            return 1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "age": function(o1, o2){
        var value1 = parseInt($(o1).attr("data-age"));
        var value2 = parseInt($(o2).attr("data-age"));
        if(value1 < value2){
            return 1 * sortMultiplier;
        }else if(value1 > value2){
            return -1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "goals": function(o1, o2){
        var value1 = parseInt($(o1).attr("data-goals"));
        var value2 = parseInt($(o2).attr("data-goals"));
        if(value1 < value2){
            return 1 * sortMultiplier;
        }else if(value1 > value2){
            return -1 * sortMultiplier;
        }else{
            return 0;
        }
    },
    "average": function(o1, o2){
        var value1 = parseFloat($(o1).attr("data-average"));
        var value2 = parseFloat($(o2).attr("data-average"));
        if(value1 < value2){
            return 1 * sortMultiplier;
        }else if(value1 > value2){
            return -1 * sortMultiplier;
        }else{
            return 0;
        }
    }
};

var createPlayer = {
    show: function(){
        $("#newCreatePlayerButton").hide();
        $("#playerContent").hide();
        $("#createPlayer").fadeIn("slow");
    },
    clear: function(){
        $("#firstName").val("");
        $("#lastName").val("");
        $("#position").val("ST");
        $("#country").val("");
        $("#overall").val(0);
        $("#birthDate").val("");
    },
    getFields: function(){
        var player = {};
        player.firstName = $("#firstName").val();
        player.lastName = $("#lastName").val();
        player.position = $("#position").val();
        player.country = $("#country").val();
        player.birthdate = timeUtils.getTimeFromDate($("#birthDate").val());
        player.overall = $("#overall").val();
        
        //fields user can't enter
        player.isDeleted = false;
        player.seasonAdded = currentSeason;
        
        return player;
    },
    hide: function(){
        $("#createPlayer").hide();
        $("#newCreatePlayerButton").show();
        $("#playerContent").show();
        createPlayer.clear();
    },
    createOptionsCell: function(goalList, goalInfo){
        var optionsCell = $("<td></td>");
        var playerStats = domUtils.createClassElement("div", "playerStat"); //div for displaying stats, hidden
        var statHeader = domUtils.createTextElement("h3", "Stats");
        
        //display total and average goals
        var totalGoalDiv = domUtils.createTextElement("div", "Total Goals: " + goalInfo.sum);
        var averageGoalDiv = domUtils.createTextElement("div", "Average Goals: " + goalInfo.average);
        
        //print out list of goals every season
        var goalListElement = domUtils.createClassElement("ol", "goalList");
        playerUtils.createGoalList(goalListElement, goalList);
        
        playerStats.append(statHeader).append(totalGoalDiv).append(averageGoalDiv).append(goalListElement);
        
        var insertGoals = domUtils.createClassElement("div", "playerStat insertPlayerGoals"); //div for entering a goal amount, hidden
        var insertHeader = domUtils.createTextElement("h3", "Insert Goal Tally");
        
        var inputForm = $("<form onsubmit='playerUtils.insertGoalTally(this); return false;'><table><tbody><tr><td><label>Goals</label></td><td><input type='number' name='goals'></td></tr><tr><td><label>Season</label></td><td><input type='number' name='season'></td></tr></tbody></table></form>");
        var saveButton = domUtils.createTextElement("button", "Save");
        inputForm.append(saveButton);
        
        insertGoals.append(insertHeader).append(inputForm);
        
        var viewSpan = domUtils.createClassElement("span", "ui-icon ui-icon-person playerIcon");
        var addSpan = domUtils.createClassElement("span", "ui-icon ui-icon-plus playerIcon");
        var trashSpan = domUtils.createClassElement("span", "ui-icon ui-icon-trash playerIcon");
        
        optionsCell.append(playerStats).append(viewSpan).append(insertGoals).append(addSpan).append(trashSpan);
        return optionsCell;
    },
    createInRoster: function(key, player, goalInfo){
        //player table
        var tableBody = $("#mainTableBody");
        var newRow = $("<tr></tr>", {
            "data-id": key,
            "data-firstName": player.firstName,
            "data-lastName": player.lastName,
            "data-age": player.birthdate,
            "data-country": player.country,
            "data-position": player.position,
            "data-overall": player.overall
        });
        
        //columns of row for player table
        var firstNameCell = domUtils.createTextElement("td", player.firstName);
        var birthdateCell = domUtils.createTextElement("td", dateUtils.getAge(new Date(), new Date(player.birthdate)));
        var lastNameCell = domUtils.createTextElement("td", player.lastName);
        var positionCell = domUtils.createTextElement("td", player.position);
        var countryCell = domUtils.createTextElement("td", player.country);
        var overallCell = $("<td></td>");
        var overallSpan = $("<span></span>", {
            text: player.overall,
            "class": "overallSpan"
        });
        var overallInput = $("<input>", {
            type: "number",
            "class": "overallInput",
            value: player.overall
        });
        overallCell.append(overallSpan).append(overallInput);
        var optionsCell = createPlayer.createOptionsCell(player.goalList, goalInfo);
        
        newRow.append(firstNameCell).append(lastNameCell).append(positionCell)
            .append(countryCell).append(overallCell).append(birthdateCell).append(optionsCell);
        tableBody.append(newRow);
    },
    createInGoalTable: function(key, player, goalInfo){
        //goal table
        var tableBody = $("#goalTableBody");
        var newRow = $("<tr></tr>", {
            "data-id": key,
            "data-goals": goalInfo.sum,
            "data-average": goalInfo.average
        });
        
        //columns of row for goal table
        var firstNameCell = domUtils.createTextElement("td", player.firstName);
        var lastNameCell = domUtils.createTextElement("td", player.lastName);
        var goalCell = domUtils.createTextElement("td", goalInfo.sum);
        var averageCell = domUtils.createTextElement("td", goalInfo.average);
        newRow.append(firstNameCell).append(lastNameCell).append(goalCell).append(averageCell);
        tableBody.append(newRow);
    },
    create: function(){
        var player = createPlayer.getFields();
        var key = db.insert("players", player);
        playersObject[key] = player;
        var goalInfo = {sum: 0, average: 0};
        createPlayer.createInRoster(key, player, goalInfo);
        createPlayer.createInGoalTable(key, player, goalInfo);
        createPlayer.hide();
    }
};

var fifaTable = {
    sort: function(el, type){
        if(type !== previousSort){
            sortMultiplier = 1;
        }else{
            sortMultiplier *= -1;
        }
        var tableBody = el.parent().parent().next();
        var playerRows = tableBody.children("tr");
        playerRows.sort(sortFunctions[type]);
        playerRows.detach().appendTo(tableBody);
        previousSort = type;
    },
    changeHeaderColor: function(el){
        el.parent().children("th").css("background-color", "#E1E1D9");
        el.css("background-color", "#E2D0E0");
    },
    sortHeader: function(el, type){
        var element = $(el);
        fifaTable.sort(element, type);
        fifaTable.changeHeaderColor(element);
    },
    showStats: function(statDiv){
        if(statDiv.css("display") === "block"){
            statDiv.css("display", "none");
        }else{
            statDiv.css("display", "block");
        }
    },
    toggleOverallInput: function(el1, el2){
        el1.css("display", "none");
        el2.css("display", "inline");
    }
};

var fifaUtils = {
    retrieve: function(){
        db.retrieve("players", function(players){
            playersObject = players;
            for(var x in players){
                var player = players[x];
                var goalInfo = playerUtils.getSumAndAverage(player.goalList);
                if(!player.isDeleted){
                    createPlayer.createInRoster(x, player, goalInfo);
                }
                createPlayer.createInGoalTable(x, player, goalInfo);
            }
        });
    },
    remove: function(el){
        if(window.confirm("Are you sure you want to delete this player?")){
            var currentRow = $(el.target).parent().parent();
            var key = currentRow.attr("data-id");
            db.update("players/" + key, {isDeleted: true});
            delete playersObject[key];
            currentRow.remove();
        }
    }
};

var playerUtils = {
    "sumGoals": function(goalList){
        var sum = 0;
        if(goalList){
            for(var i = 1; i<=15; i++){
                var current = goalList[i];
                if(current){
                    sum += current;
                }
            }
        }
        return sum;
    },
    "averageGoals": function(goals, goalList){
        var numSeasons = 0;
        for(var x in goalList){
            numSeasons++;
        }
        if(numSeasons === 0){
            return 0;
        }else{
            return (goals/numSeasons).toFixed(2);
        }
    },
    "getSumAndAverage": function(goalList){
        var returnObj = {};
        returnObj.sum = playerUtils.sumGoals(goalList);
        returnObj.average = playerUtils.averageGoals(returnObj.sum, goalList);
        return returnObj;
    },
    "createGoalList": function(goalListElement, goalList){
        if(goalList){
            for(var i = 1; i<=15; i++){
                var current = goalList[i];
                if(current != null){
                    var listText = "Season " + i + ": " + current + " goals";
                    var currentElement = domUtils.createTextElement("li", listText);
                    goalListElement.append(currentElement);
                }
            }
        }  
    },
    "insertGoalTally": function(el){
        var updateObj = {};
        
        //grab values from forms
        var numGoals = parseInt(el.goals.value);
        var seasonNum = el.season.value;
        
        //get the key of the player and update db
        var parentDiv = $(el).parent();
        var key = parentDiv.parent().parent().attr("data-id");
        updateObj[seasonNum] = numGoals;
        db.update("players/" + key + "/goalList", updateObj);
        playersObject[key].goalList[seasonNum] = numGoals;
        
        //update values for total and average goals
        var goalListDiv = parentDiv.prev().prev();
        var goalInfoElements = goalListDiv.children("div");
        var goalInfo = playerUtils.getSumAndAverage(playersObject[key].goalList);
        goalInfoElements.first().html("Total Goals: " + goalInfo.sum);
        goalInfoElements.eq(1).html("Average Goals: " + goalInfo.average);
        
        //update goal list
        var goalListElement = goalListDiv.children("ol");
        goalListElement.empty();
        playerUtils.createGoalList(goalListElement, playersObject[key].goalList);
        
        //update goal table
        var goalTable = $("#goalTableBody");
        var playerRow = goalTable.find("tr[data-id='" + key + "']").children();
        playerRow.eq(2).html(goalInfo.sum);
        playerRow.eq(3).html(goalInfo.average);
        
        //hide the div and clear the values in the form
        fifaTable.showStats(parentDiv);
        el.goals.value = "";
        el.season.value = "";
    },
    updateOverall: function(el){
        var overall = el.val();
        var span = el.prev();
        if(overall !== "" || !isNaN(overall)){
            overall = parseInt(overall);
            var row = el.parent().parent();
            var key = row.attr("data-id");
            db.update("players/" + key, {overall: overall});
            span.html(overall);
            row.attr("data-overall", overall);
            playersObject[key].overall = overall;
        }
        fifaTable.toggleOverallInput(el, span);
    }
}

fifaUtils.retrieve();
$(document).ready(function() {
    $(document).on("click", ".ui-icon-trash", {"el": $(this)}, fifaUtils.remove);
    $(document).on("click", ".ui-icon-plus, .ui-icon-person", function(){
        fifaTable.showStats($(this).prev());
    });
    $(document).on("click", ".overallSpan", function(){
        fifaTable.toggleOverallInput($(this), $(this).next());
    });
    $(document).on("blur", ".overallInput", function(){
        playerUtils.updateOverall($(this));
    });
});