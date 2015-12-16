function DomUtils(){
    this.createTextElement = function(name, text){
        var element = $("<" + name + "></" + name + ">", {
            text: text
        });
        return element;
    };
    this.createClassElement = function(name, className){
        var element = $("<" + name + "></" + name + ">", {
            "class": className
        });
        return element;
    };
}