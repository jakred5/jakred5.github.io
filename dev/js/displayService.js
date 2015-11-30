angular.module('pokemonApp').service("displayService", ['$http', function($http){
    var types = ["Normal", "Fire", "Water", "Grass", "Electric", "Fighting", "Flying", "Rock", "Ground", "Psychic", "Bug",
                    "Steel", "Poison", "Ghost", "Dark", "Ice", "Dragon", "Fairy"];
    var stats = [
        {
            "name": "HP",
            "model": "hp"
        },
        {
            "name": "Attack",
            "model": "attack"
        },
        {
            "name": "Defense",
            "model": "defense"
        },
        {
            "name": "Special Attack",
            "model": "specialAttack"
        },
        {
            "name": "Special Defense",
            "model": "specialDefense"
        },
        {
            "name": "Speed",
            "model": "speed"
        },
    ];
    
    var natures = [
        {
            "name": "Lonely",
            "effect": ["attack", "defense"],
            "displayName": ["Attack", "Defense"]  
        },
        {
            "name": "Adamant",
            "effect": ["attack", "specialAttack"],
            "displayName": ["Attack", "Special Attack"]
        },
        {
            "name": "Naughty",
            "effect": ["attack", "specialDefense"],
            "displayName": ["Attack", "Special Defense"]
        },
            {
            "name": "Brave",
            "effect": ["attack", "speed"],
            "displayName": ["Attack", "Speed"]
        },
        {
            "name": "Bold",
            "effect": ["defense", "attack"],
            "displayName": ["Defense", "Attack"]
        },
            {
            "name": "Impish",
            "effect": ["defense", "specialAttack"],
            "displayName": ["Defense", "Special Attack"]
        },
        {
            "name": "Lax",
            "effect": ["defense", "specialDefense"],
            "displayName": ["Defense", "Special Defense"]
        },
            {
            "name": "Relaxed",
            "effect": ["defense", "speed"],
            "displayName": ["Defense", "Speed"]
        },
        {
            "name": "Modest",
            "effect": ["specialAttack", "attack"],
            "displayName": ["Special Attack", "Attack"]
        },
            {
            "name": "Mild",
            "effect": ["specialAttack", "defense"],
            "displayName": ["Special Attack", "Defense"]
        },
        {
            "name": "Rash",
            "effect": ["specialAttack", "specialDefense"],
            "displayName": ["Special Attack", "Special Defense"]
        },
            {
            "name": "Quiet",
            "effect": ["specialAttack", "speed"],
            "displayName": ["Special Attack", "Speed"]
        },
        {
            "name": "Calm",
            "effect": ["specialDefense", "attack"],
            "displayName": ["Special Defense", "Attack"]
        },
            {
            "name": "Gentle",
            "effect": ["specialDefense", "defense"],
            "displayName": ["Special Defense", "Defense"]
        },
        {
            "name": "Careful",
            "effect": ["specialDefense", "specialAttack"],
            "displayName": ["Special Defense", "Special Attack"]
        },
            {
            "name": "Sassy",
            "effect": ["specialDefense", "speed"],
            "displayName": ["Special Defense", "Speed"]
        },
        {
            "name": "Timid",
            "effect": ["speed", "attack"],
            "displayName": ["Speed", "Attack"]
        },
            {
            "name": "Hasty",
            "effect": ["speed", "defense"],
            "displayName": ["Speed", "Defense"]
        },
        {
            "name": "Jolly",
            "effect": ["speed", "specialAttack"],
            "displayName": ["Speed", "Special Attack"]
        },
            {
            "name": "Naive",
            "effect": ["speed", "specialDefense"],
            "displayName": ["Speed", "Special Defense"]
        },
    ];
    
    var headerStats = {
        "name": true,
        "types": false,
        "total": false,
        "hp": false,
        "attack": false,
        "defense": false,
        "specialAttack": false,
        "specialDefense": false,
        "speed": false
    };
    
    var getBarBackground = function(stat){
        if(stat < 50){
            return "#ff0000";
        }
        if(stat < 75){
            return "#ff7e00";
        }
        if(stat < 100){
            return "#ffcc00";
        }
        if(stat < 125){
            return "#e6ff00";
        }
        if(stat < 150){
            return "#5cff00";
        }
        if(stat < 175){
            return "#02ff55";
        }
        if(stat < 200){
            return "#02ffbf";
        }
        return "#02ffff";
    };
    
    getTotalBackground = function(stat){
        if(stat < 300){
            return "#ff0000";
        }
        if(stat < 400){
            return "#ff7e00";
        }
        if(stat < 500){
            return "#ffcc00";
        }
        if(stat < 550){
            return "#e6ff00";
        }
        if(stat < 600){
            return "#5cff00";
        }
        if(stat < 650){
            return "#02ff55";
        }
        if(stat < 700){
            return "#02ffbf";
        }
        return "#02ffff";
    };
    
    var calculateBarLengths = function(pokemon){
        return {
            "hp": {
                'width': Math.round(pokemon.hp/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.hp)
            },
            "attack": {
                'width': Math.round(pokemon.attack/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.attack)
            },
            "defense": {
                'width': Math.round(pokemon.defense/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.defense)
            },
            "specialAttack": {
                'width': Math.round(pokemon.specialAttack/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.specialAttack)
            },
            "specialDefense": {
                'width': Math.round(pokemon.specialDefense/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.specialDefense)
            },
            "speed": {
                'width': Math.round(pokemon.speed/255 * 100) + '%',
                'background-color': getBarBackground(pokemon.speed)
            },
            "total": {
                'width': Math.round(pokemon.total/780 * 100) + '%',
                'background-color': getTotalBackground(pokemon.total)
            }      
        };
    };
    
    return {
        getPokemonInfo : function(){
            return $http.get("/json/pokemonInfo.json");
        },
        getTypes : function(){
            return types;
        },
        getStats : function(){
            return stats;
        },
        getHeaderStats : function(){
            return headerStats;
        },
        getNatures : function(){
            return natures;  
        },
        calculateBarLengths : calculateBarLengths
    }
}]);