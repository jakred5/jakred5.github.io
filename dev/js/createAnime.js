var url = 'https://torrid-fire-9340.firebaseio.com/';
var posts = {};

function showCreateAnime(){
    $("#newCreateAnimeButton").hide();
    $("#animeContent").hide();
    $("#createAnime").fadeIn("slow");
}

function clearAnimeFields(){
    $("#animeName").val("");
    $("#animePicture").val(null);
}

function hideCreateAnime(){
    $("#createAnime").hide();
    $("#newCreateAnimeButton").show();
    $("#animeContent").show();
    clearAnimeFields();
}

function createAnimePostHeader(name){
    var postHeader = $("<header></header>", {
        "class": "postHeader"
    });
    
    var removeDiv = $("<div></div>", {
        "class": "removeIcon"
    });
    
    var postName = $("<div></div>", {
        "class": "postNumber",
        text: name
    });
    
    var removeIcon = $("<img>",{
        "src": "/images/trash.png",
        "alt": "Trash Can"
    });
    
    removeDiv.append(removeIcon);
    postHeader.append(postName).append(removeDiv);
    return postHeader;
}

function createAnimePostFooter(){
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

function createAnimePostDiv(key, imageSrc, name){
    var postBody = $("<div></div>", {
        "class": "postBody"
    });
    
    var img = $("<img></img>",{
        "src": "/images/" + imageSrc,
        "alt": "Anime",
        "width": "100%",
        "height": "100%"
    });
        
    postBody.append(img);
    
    var animeListItem = $("<article></article>", {
        "data-id": key
    });
    
    var postListHeader = createAnimePostHeader(name);
    var postListFooter = createAnimePostFooter();
      
    animeListItem.append(postListHeader).append(postBody).append(postListFooter);
    $("#animeContent").prepend(animeListItem);
}

function removeAnimePostFromDB(key){
    var ref = new Firebase(url + 'animePosts/' + key);
    ref.set(null);
}

function removeAnimePost(el){
    var postToRemove = $(el.target).closest("article");
    var id = postToRemove.attr("data-id");
    removeAnimePostFromDB(id);
    delete posts[id];
    store("animeList", posts);
    postToRemove.remove();
}

function insertAnimePostInDB(imageSrc, name){
    var ref = new Firebase(url + 'animePosts');
    var dataObject = {
        imageSrc: imageSrc,
        name: name,
        seasons: {}
    };
    var key = ref.push(dataObject).key();
    posts[key] = dataObject;
    store("animeList", posts);
    return key;
}

function createAnime(){
    var name = $("#animeName").val();
    var imageSrc = $("#animePicture").val();
    var key = insertAnimePostInDB(imageSrc, name);
    createAnimePostDiv(key, imageSrc, name);
    hideCreateAnime();
}

function retrieveAnimePosts(){
    var ref = new Firebase(url + 'animePosts');
    ref.on("value", function(snapshot) {
        posts = snapshot.val();
        store("animeList", posts);
        for(x in posts){
            var post = posts[x];
            createAnimePostDiv(x, post.imageSrc, post.name);
        }
        ref.off("value");
    }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
    });
}

function viewAnimePost(el){
    var postToView = $(el.target).closest("article");
    var key = postToView.attr("data-id");
    store("currentAnimePost", key);
    window.location = "animeSeasons.html";
}

function store(key, value){
    localStorage.setItem(key, JSON.stringify(value));
}

function retrieve(key){
    return JSON.parse(localStorage.getItem(key));
}

$(document).ready(function(){
    $(document).on("click", ".removeIcon", {"el": $(this)}, removeAnimePost);
    $(document).on("click", ".viewButton", {"el": $(this)}, viewAnimePost);
});

retrieveAnimePosts();