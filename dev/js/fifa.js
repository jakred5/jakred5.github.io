var timeUtils = new TimeUtils();
var db = new DB();
var jsonUtils = new JsonUtils();
var stringUtils = new StringUtils();
var playersObject = {};

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
            "data-id": key
        });
        var firstNameCell = $("<td></td>", {
            text: player.firstName
        });
        var birthdateCell = $("<td></td>", {
            text: stringUtils.dateTime(player.birthdate)
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
        newRow.append(firstNameCell).append(lastNameCell).append(positionCell)
            .append(countryCell).append(overallCell).append(birthdateCell);
        tableBody.append(newRow);
    },
    create: function(){
        var player = createPlayer.getFields();
        var key = db.insert("players", player);
        createPlayer.createOnPage(key, player);
        createPlayer.hide();
    },
    retrieve: function(){
        db.retrieve("players", function(players){
            playersObject = players;
            for(var x in players){
                createPlayer.createOnPage(x, players[x]);
            }
        });
    }
};

createPlayer.retrieve();