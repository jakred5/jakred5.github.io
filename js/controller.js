angular.module('pokemonApp', [])
.controller("DisplayController", ['$scope', 'displayService', function($scope, displayService){
    $scope.list = [];
    displayService.getPokemonInfo().then(function(data){
        var list = data.data[0];
        for(var name in list){
            list[name].total = $scope.calculateTotal(list[name]);
            list[name].types = data.data[1][name];
            var index = name.indexOf("mega");
            var newName = name.replace(name.charAt(0), name.charAt(0).toUpperCase());
            if(index !== -1){
                if(name !== "meganium" && name !== "yanmega"){
                    newName = newName.replace("mega", " Mega")
                }
            }
            list[name].name = newName;
            $scope.list.push(list[name]);
        }
    });
    $scope.pokemonFilter =  {
        "name": "",
        "types": "" 
    };
    $scope.statFilter = {
        "stat": "none",
        "from": "",
        "to": ""
    };
    $scope.currentPage = "/views/statTable.html";
    $scope.order = "name";
    $scope.reverse = false;
    $scope.currentNature = "Neutral";
    $scope.options = {
        "level": "50",
        "nature": "Neutral"
    };
    $scope.ev = {
        "hp": "0",
        "attack": "0",
        "defense": "0",
        "specialAttack": "0",
        "specialDefense": "0",
        "speed": "0",
    };
    $scope.iv = {
        "hp": "0",
        "attack": "0",
        "defense": "0",
        "specialAttack": "0",
        "specialDefense": "0",
        "speed": "0"
    };
    $scope.customStats = {
      "hp": 0  
    };
    $scope.types = displayService.getTypes();
    $scope.stats = displayService.getStats();
    $scope.headerClasses = displayService.getHeaderStats();
    $scope.natures = displayService.getNatures();
    $scope.natureMultiplier = {
        "attack": 1,
        "defense": 1,
        "specialAttack": 1,
        "specialDefense": 1,
        "speed": 1
    };
    $scope.orderRows = function(order){
        if(order === $scope.order){
            $scope.reverse = !$scope.reverse;
        }
        else{
            $scope.order = order;
            for(header in $scope.headerClasses){
                $scope.headerClasses[header] = false;
            }
            $scope.headerClasses[order] = true;
        }
    };
    
    $scope.calculateTotal = function(baseStats){
        var total = 0;
        for(var stat in baseStats){
            total += baseStats[stat];
        }
        return total;
    };
    
    $scope.statFilterFunction = function(statFilter){
        return function(item){
            if(statFilter.stat === "none" || statFilter.to === "" || statFilter.from === ""){
                return true;
            }
            return item[statFilter.stat] <= parseInt(statFilter.to) && item[statFilter.stat] >= parseInt(statFilter.from);
        }
    };
    
    $scope.changeToSpecificPage = function(pokemon){
        $scope.currentPokemon = pokemon;
        $scope.barIndicators = displayService.calculateBarLengths(pokemon);
        $scope.currentPage = "/views/specificPokemon.html";  
    };
    
    $scope.backToList = function(){
      $scope.currentPage = "/views/statTable.html";  
    };
    
    $scope.calculateHP = function(){
        $scope.updateMultiplier();
        var tempLevel = 0;
        if($scope.options.level === ""){
            tempLevel = 0;
        }else{
            tempLevel = parseInt($scope.options.level);
        }
        return Math.floor(($scope.currentPokemon.hp * 2 + parseInt($scope.iv.hp) + (parseInt($scope.ev.hp/4))) * tempLevel / 100 + 10 + tempLevel);
    };
    
    $scope.calculateStat = function(field){
        $scope.updateMultiplier();
        var tempLevel = 0;
        if($scope.options.level === ""){
            tempLevel = 0;
        }else{
            tempLevel = parseInt($scope.options.level);
        }
        return Math.floor((($scope.currentPokemon[field] * 2 + parseInt($scope.iv[field]) + (parseInt($scope.ev[field]/4))) * tempLevel / 100 + 5) * $scope.natureMultiplier[field]);
    };
    
    $scope.updateMultiplier = function(){
        if($scope.options.nature == "Neutral"){
            return;
        }
        for(var x in $scope.natureMultiplier){
            $scope.natureMultiplier[x] = 1;
        }
        var tempNature = JSON.parse($scope.options.nature);
        $scope.natureMultiplier[tempNature[0]] = 1.1;
        $scope.natureMultiplier[tempNature[1]] = .9;
    };
    
    /*Stat = ((Base * 2 + IV + (EV/4)) * Level / 100 + 5) * Nmod
HP = (Base * 2 + IV + (EV/4)) * Level / 100 + 10 + Level*/
}]);