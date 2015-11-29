/****************************************************************************
 * Global Variables
 ***************************************************************************/
var numPosts = 0;
var url = 'https://torrid-fire-9340.firebaseio.com/';
var posts = {};
var stringUtils = new StringUtils();
var timeUtils = new TimeUtils();

/****************************************************************************
 * Function declarations
 ***************************************************************************/
function calculatePace(distance, hours, minutes, seconds){
    var totalSeconds = (hours * 3600 + minutes * 60 + seconds * 1)/distance;
    var tempMinutes = totalSeconds/60;
    var paceMinutes = Math.floor(tempMinutes);
    var paceSeconds = Math.floor(totalSeconds - paceMinutes * 60);
    paceMinutes = stringUtils.formatTimeValue(paceMinutes);
    paceSeconds = stringUtils.formatTimeValue(paceSeconds);
    return paceMinutes + ":" + paceSeconds; 
}

function getPostContentValues(){
    var hours = $("#hours").val();
    var minutes = $("#minutes").val();
    var seconds = $("#seconds").val();
    var distance = $("#distance").val();
    var date = $("#date").val();
    var pace = calculatePace(distance, hours, minutes, seconds);
    var time = stringUtils.createTime(hours, minutes, seconds);
    var postContent = {
        distance: parseFloat(distance),
        time: time,
        pace: pace,
        date: date,
        number: numPosts
    };
    return postContent;
}

function insertRunPostInDB(postContent){
    var ref = new Firebase(url + 'runPosts');
    var key = ref.push(postContent).key();
    ref.update({
       total: numPosts 
    });
    posts[key] = postContent;
    return key;
}

function createRunPostHeader(num){
    var postHeader = $("<header></header>", {
        "class": "postHeader"
    });
    
    var removeDiv = $("<div></div>", {
        "class": "removeIcon"
    });
    
    var postNumber = $("<div></div>", {
        "class": "postNumber",
        text: "Post #" + num 
    });
    
    var removeIcon = $("<img>",{
        "src": "/images/trash.png",
        "alt": "Trash Can"
    });
    
    removeDiv.append(removeIcon);
    postHeader.append(postNumber).append(removeDiv);
    return postHeader;
}

function createRunPostBody(postContent){
    var date = $("<p></p>", {
        text: "Date: " + postContent.date
    });
    var distance = $("<p></p>", {
        text: "Distance: " + stringUtils.distance(postContent.distance)
    });
    var time = $("<p></p>", {
        text: "Time: " + postContent.time
    });
    var pace = $("<p></p>", {
        text: "Pace: " + postContent.pace
    });
    var runDisplayContent = $("<div></div>", {
       "class": "runDisplayContent" 
    });
    runDisplayContent.append(distance).append(time).append(pace);
    var postBody = $("<div></div>", {
        "class": "postBody"
    });
    postBody.append(date).append(runDisplayContent);
    return postBody;
}

function createRunPostDiv(key, postContent, num){
    var postBody = createRunPostBody(postContent);
    
    var postListItem = $("<article></article>", {
        "data-id": key,
        "data-date": timeUtils.getTimeFromDate(postContent.date),
        "data-distance": postContent.distance,
        "data-time": timeUtils.convertHoursStringToSeconds(postContent.time),
        "data-pace": timeUtils.convertMinutesStringToSeconds(postContent.pace)
    });
    
    var postListHeader = createRunPostHeader(num);
      
    postListItem.append(postListHeader).append(postBody);
    $("#runContent").prepend(postListItem);
}

function postRun(){
    numPosts = numPosts + 1;
    var postContent = getPostContentValues();
    var key = insertRunPostInDB(postContent);
    createRunPostDiv(key, postContent, numPosts);
    hideInsertRunPost();
}

function retrieveRunPosts(){
    var ref = new Firebase(url + 'runPosts');
    ref.on("value", function(snapshot) {
        posts = snapshot.val();
        for(x in posts){
            if(x !== 'total'){
                var post = posts[x];
                createRunPostDiv(x, post, post.number);
            }else{
                numPosts = posts[x];
            }
        }
        ref.off("value");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function removeRunPostFromDB(key){
    var ref = new Firebase(url + 'runPosts/' + key);
    ref.set(null);
}

function removeRunPost(el){
    if(window.confirm("Are you sure you want to remove this run?")){
        var postToRemove = $(el.target).closest("article");
        removeRunPostFromDB(postToRemove.attr("data-id"));
        postToRemove.remove();
    }
}

function clearRunFields(){
    $("#hours").val("");
    $("#minutes").val("");
    $("#seconds").val("");
    $("#distance").val("");
    $("#date").val("");
}

function showInsertRunPost(){
    $("#newPostRunButton").hide();
    $("#viewRunDataButton").hide();
    $("#runContent").hide();
    $("#sortingChoices").hide();
    $("#insertRun").fadeIn("slow");
}

function hideInsertRunPost(){
    $("#insertRun").hide();
    $("#newPostRunButton").show();
    $("#viewRunDataButton").show();
    $("#runContent").show();
    $("#sortingChoices").show();
    clearRunFields();
}

function viewRunData(){
    localStorage.setItem("runData", JSON.stringify(posts));
    window.location.href = "runData.html";
}

var sortingFunctions = {
    date: function(a, b, direction){
        
    }
}

var sortFunctions = {
    date: function(a, b){
        var multiplier = parseInt($("#sortingDirection").val());
        var date1 = parseInt($(a).attr("data-date"));
        var date2 = parseInt($(b).attr("data-date"));
        if(date1 < date2){
            return -1 * multiplier;
        }else if(date1 > date2){
            return 1 * multiplier;
        }else{
            return 0;
        }
    },
    time: function(a, b){
        var multiplier = parseInt($("#sortingDirection").val());
        var time1 = parseInt($(a).attr("data-time"));
        var time2 = parseInt($(b).attr("data-time"));
        if(time1 < time2){
            return -1 * multiplier;
        }else if(time1 > time2){
            return 1 * multiplier;
        }else{
            return 0;
        }
    },
    pace: function(a, b){
        var multiplier = parseInt($("#sortingDirection").val());
        var pace1 = parseInt($(a).attr("data-pace"));
        var pace2 = parseInt($(b).attr("data-pace"));
        if(pace1 < pace2){
            return -1 * multiplier;
        }else if(pace1 > pace2){
            return 1 * multiplier;
        }else{
            return 0;
        }
    },
    distance: function(a, b){
        var multiplier = parseInt($("#sortingDirection").val());
        var distance1 = parseFloat($(a).attr("data-distance"));
        var distance2 = parseFloat($(b).attr("data-distance"));
        if(distance1 < distance2){
            return -1 * multiplier;
        }else if(distance1 > distance2){
            return 1 * multiplier;
        }else{
            return 0;
        }
    }
};

function sortRuns(){
    var runList = $("#runContent");
    var runListItems = runList.children("article");
    runListItems.sort(sortFunctions[$("#sortingOptions").val()]);
    runListItems.detach().appendTo(runList);
}

$(document).ready(function(){
    $(document).on("click", ".removeIcon", {"el": $(this)}, removeRunPost);
});

/****************************************************************************
 * Executed On load
 ***************************************************************************/

retrieveRunPosts();