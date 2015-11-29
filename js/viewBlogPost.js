var currentPost = JSON.parse(localStorage.getItem("currentBlogPost"));
var viewPostHeader = $("<header></header>");
var viewPostHeaderText = $("<span></span>", {
    text: "Post #" + currentPost.number + " (Date: " + currentPost.date + ")"
});
var viewPostBody = $("<div></div>", {
    "class": "viewPostBody",
    text: currentPost.content
});
viewPostHeader.append(viewPostHeaderText);
$("#viewPostContent").append(viewPostHeader).append(viewPostBody);