/****************************************************************************
 * Global Variables
 ***************************************************************************/
var numPosts = 0;
var url = 'https://torrid-fire-9340.firebaseio.com/';
var posts = {};

/****************************************************************************
 * Function declarations
 ***************************************************************************/
function createBlogPostHeader(num){
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

function createBlogPostFooter(){
    var postFooter = $("<footer></footer>", {
        "class": "postFooter" 
    });
    
    var viewButton = $("<button></button>", {
        "class": "viewButton",
        text: "View"
    });
    
    postFooter.append(viewButton);
    return postFooter;
}

function createBlogPostDiv(key, postContent, num){
    var temp = "";
    if(postContent.length > 750){
        temp = postContent.substring(0, 750) + "...";
    }else{
        temp = postContent;
    }
    var postBody = $("<div></div>", {
        "class": "postBody",
        text: temp
    });
    
    var postListItem = $("<article></article>", {
        "data-id": key
    });
    
    var postListHeader = createBlogPostHeader(num);
    var postFooter = createBlogPostFooter();
      
    postListItem.append(postListHeader).append(postBody).append(postFooter);
    $("#blogContent").prepend(postListItem);
}

function insertBlogPostInDB(postContent){
    var date = new Date();
    var dateString = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
    var ref = new Firebase(url + 'posts');
    var dataObject = {
        content: postContent,
        number: numPosts,
        date: dateString
    };
    var key = ref.push(dataObject).key();
    ref.update({
       total: numPosts 
    });
    posts[key] = dataObject;
    return key;
}

function postBlog(){
    numPosts = numPosts + 1;
    var postContent = $("#postContent").val();
    var key = insertBlogPostInDB(postContent);
    createBlogPostDiv(key, postContent, numPosts);
    hideInsertBlogPost();
}

function removeBlogPostFromDB(key){
    var ref = new Firebase(url + 'posts/' + key);
    ref.set(null);
}

function removeBlogPost(el){
    if(window.confirm("Are you sure you want to delete this blog entry?")){
        var postToRemove = $(el.target).closest("article");
        removeBlogPostFromDB(postToRemove.attr("data-id"));
        postToRemove.remove();
    }
}

function viewBlogPost(el){
    var postToView = $(el.target).closest("article");
    var key = postToView.attr("data-id");
    var currentPost = posts[key];
    localStorage.setItem("currentBlogPost", JSON.stringify(currentPost));
    window.location = "blogPost.html";
}

function retrieveBlogPosts(){
    var ref = new Firebase(url + 'posts');
    ref.on("value", function(snapshot) {
        posts = snapshot.val();
        for(x in posts){
            if(x !== 'total'){
                var post = posts[x];
                createBlogPostDiv(x, post.content, post.number);
            }else{
                numPosts = posts[x];
            }
        }
        ref.off("value");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function showInsertBlogPost(){
    $("#newPostBlogButton").hide();
    $("#blogContent").hide();
    $("#insertBlog").fadeIn("slow");
}

function hideInsertBlogPost(){
    $("#insertBlog").hide();
    $("#newPostBlogButton").show();
    $("#postContent").val("");
    $("#blogContent").show();
}

$(document).ready(function(){
    $(document).on("click", ".removeIcon", {"el": $(this)}, removeBlogPost);
    $(document).on("click", ".viewButton", {"el": $(this)}, viewBlogPost);
});

/****************************************************************************
 * Executed On Load
 ***************************************************************************/
retrieveBlogPosts();
