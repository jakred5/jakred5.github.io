angular.module('tournamentModule', ['ngMaterial'])
.controller('tournamentController', function($scope){
    var self = this;
    self.tournament = new Tournament(["Arsenal", "Chelsea", "Man U", "Liverpool"]);
    var jsonUtils = new JsonUtils();
});