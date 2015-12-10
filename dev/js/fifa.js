var timeUtils = new TimeUtils();
var db = new DB();
var jsonUtils = new JsonUtils();
var stringUtils = new StringUtils();
var dateUtils = new DateUtils();
var playersObject = {};
var sortMultiplier = 1;
var previousSort = "";

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
        player.isDeleted = false;
        return player;
    },
    hide: function(){
        $("#createPlayer").hide();
        $("#newCreatePlayerButton").show();
        $("#playerContent").show();
        createPlayer.clear();
    },
    createOnPage: function(key, player){
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
        var firstNameCell = $("<td></td>", {
            text: player.firstName
        });
        var birthdateCell = $("<td></td>", {
            text: dateUtils.getAge(new Date(), new Date(player.birthdate))
        });
        var lastNameCell = $("<td></td>", {
            text: player.lastName
        });
        var positionCell = $("<td></td>", {
            text: player.position
        });
        var countryCell = $("<td></td>", {
            text: player.country
        });
        var overallCell = $("<td></td>", {
            text: player.overall
        });
        
        var optionsCell = $("<td></td>");
        var viewSpan = $("<span></span>", {
            "class": "ui-icon ui-icon-person playerIcon" 
        });
        var trashSpan = $("<span></span>", {
            "class": "ui-icon ui-icon-trash playerIcon" 
        });
        optionsCell.append(viewSpan).append(trashSpan);
        
        newRow.append(firstNameCell).append(lastNameCell).append(positionCell)
            .append(countryCell).append(overallCell).append(birthdateCell).append(optionsCell);
        tableBody.append(newRow);
    },
    create: function(){
        var player = createPlayer.getFields();
        var key = db.insert("players", player);
        createPlayer.createOnPage(key, player);
        createPlayer.hide();
    }
};

var fifaTable = {
    sort: function(type){
        if(type !== previousSort){
            sortMultiplier = 1;
        }else{
            sortMultiplier *= -1;
        }
        
        var tableBody = $("#mainTableBody");
        var playerRows = $("#mainTableBody").find("tr");
        playerRows.sort(sortFunctions[type]);
        playerRows.detach().appendTo(tableBody);
        previousSort = type;
    },
    changeHeaderColor: function(el){
        $(".mainTable thead th").css("background-color", "#E1E1D9");
        $(el).css("background-color", "#E2D0E0");
    }
};

var fifaUtils = {
    retrieve: function(){
        db.retrieve("players", function(players){
            playersObject = players;
            for(var x in players){
                var player = players[x];
                if(!player.isDeleted){
                    createPlayer.createOnPage(x, player);
                }
            }
        });
    },
    remove: function(el){
        if(window.confirm("Are you sure you want to delete this player?")){
            var currentRow = $(el.target).parent().parent();
            var key = currentRow.attr("data-id");
            db.update("players/" + key, {isDeleted: true});
            currentRow.remove();
        }
    }
};

fifaUtils.retrieve();
$(document).ready(function() {
    $(document).on("click", ".ui-icon-trash", {"el": $(this)}, fifaUtils.remove);
});