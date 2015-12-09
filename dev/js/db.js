var url = 'https://torrid-fire-9340.firebaseio.com/';

function DB(){
    this.insert = function(path, dataObject){
        var ref = new Firebase(url + path);
        var key = ref.push(dataObject).key();
        return key;
    };
    this.retrieve = function(path, callback){
        var ref = new Firebase(url + path);
        ref.on("value", function(snapshot) {
            callback(snapshot.val());
            ref.off("value");
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    }
}