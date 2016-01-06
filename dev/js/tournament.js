function Tournament(list){
    this.makeSchedule = function(array, schedule, opposite, grid){
        var length = array.length;
        var halfLength = length/2;
        for(var i = 0; i<length - 1; i++){
            var index = i;
            if(opposite){
                index = length - 1 + i;
            }
            schedule[index] = [];
            for(var j = 0; j<halfLength; j++){
                var k = length - 1 - j;
                if(!opposite){
                    if(j === 0 && i % 2 === 0){
                        schedule[index].push({home: array[k].value, away: array[j].value});
                        grid[array[k].index][array[j].index] = true;
                    }else{
                        schedule[index].push({home: array[j].value, away: array[k].value});
                        grid[array[j].index][array[k].index] = true;
                    }
                }else{
                    if(!grid[array[j].index][array[k].index]){
                        schedule[index].push({home: array[j].value, away: array[k].value});
                    }else{
                        schedule[index].push({home: array[k].value, away: array[j].value});
                    }
                }
            }
            var last = array[length - 1];
            for(var j = length - 2; j>0; j--){
                array[j+1] = array[j];
            }
            array[1] = last;
        }
    };
    this.initialize = function(list){
        this.list = list;
        var grid = [];
        if((list.length % 2) !== 0){
            list.push("free");
        }
        var array = [];
        for(var i = 0; i<list.length; i++){
            array.push({value: list[i], index: i});
            grid.push([false, false, false, false]);
        }
        array.shuffle();
        this.schedule = [];
        this.makeSchedule(array, this.schedule, false, grid);
        array.shuffle();
        this.makeSchedule(array, this.schedule, true, grid);
    }
    
    this.initialize(list);
}