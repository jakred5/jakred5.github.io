/*
Prototype containing methods that convert values into time representations
These can be values for number of seconds, minutes, or hours
*/
function TimeUtils(){
    //converts a string of format mm:ss to number of seconds
    this.convertMinutesStringToSeconds = function(pace){
        var minutes = parseInt(pace.substring(0, 2));
        var seconds = parseInt(pace.substring(3));
        var total = minutes * 60 + seconds;
        return total;
    };
    
    //converts a string of format hh:mm:ss to number of seconds
    this.convertHoursStringToSeconds = function(time){
        var hours = parseInt(time.substring(0, 1));
        var total = hours * 3600 + this.convertMinutesStringToSeconds(time.substring(2));
        return total;
    };
    
    this.getCurrentTime = function(){
        return (new Date()).getTime();
    };
    
    this.getTimeFromDate = function(dateString){
        return (new Date(dateString)).getTime();
    }
}

/*
Prototype containing methods that convert values into string representations
All return types are strings
*/
function StringUtils(){
    //converts a date object into a string
    this.date = function(date){
        var day = date.getUTCDate();
        var month = date.getUTCMonth() + 1;
        var year = date.getUTCFullYear();
        return (month + "/" + day + "/" + year);
    };
    
    //converts a time in milliseconds into a date string
    this.dateTime = function(millis){
        var date = new Date(millis);
        return this.date(date);
    };
    
    //get the string for the current date
    this.currentDate = function(){
        var date = new Date();
        return this.date(date);
    };
    
    //prints string representation of a distance in miles
    this.distance = function(value){
        if(value <= 1){
            return value + " mile";
        }else{
            return value + " miles";
        }
    };
    
    //converts number of seconds into a string of format hh:mm:ss
    this.timeInHours = function(value){
        var timeHours = Math.floor(value/3600);
        var temp = value - timeHours * 3600;
        timeHours = this.formatTimeValue(timeHours);
        return timeHours + ":" + this.timeInMinutes(temp);
    };
    
    //converts number of seconds into a string of format mm:ss
    this.timeInMinutes = function(value){
        var minutes = Math.floor(value/60);
        var seconds = value - minutes * 60;
        minutes = this.formatTimeValue(minutes);
        seconds = this.formatTimeValue(seconds);
        return minutes + ":" + seconds;
    };
    
    //takes in a value for hours, minutes, and seconds and prints string
    this.createTime = function(hours, minutes, seconds){
        var newHours = this.formatTimeValue(hours);
        var newMinutes = this.formatTimeValue(minutes);
        var newSeconds = this.formatTimeValue(seconds);
        return newHours + ":" + newMinutes + ":" + newSeconds;
    };
    
    //prepends 0 on time values less than 10
    this.formatTimeValue = function(value){
        if(value < 10){
            return "0" + value;
        }
        return value;
    };
    
    this.reFormatDate = function(date){
        var year = date.substring(0, 4);
        var month = date.substring(5, 7);
        var day = date.substring(8);
        return month + "/" + day + "/" + year;
    }
}

function DateUtils(){
    //takes two dates and finds the age between oldate and currentdate
    this.getAge = function(currentDate, oldDate){
        var age = currentDate.getUTCFullYear() - oldDate.getUTCFullYear();
        var m = currentDate.getUTCMonth() - oldDate.getUTCMonth();
        if (m < 0 || (m === 0 && currentDate.getUTCDate() < oldDate.getUTCDate())) 
        {
            age--;
        }
        return age;
    };
}

function JsonUtils(){
    this.debug = true;
    this.print = function(value){
        if(this.debug){
            console.log(JSON.stringify(value, null, 2)); 
        }
    };
    
    this.store = function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    };
    
    this.retrieve = function(key){
        return JSON.parse(localStorage.getItem(key));
    };
}