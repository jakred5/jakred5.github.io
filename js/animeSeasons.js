var currentAnimeKey;
var animeList;
var currentAnime;
var seasons;
var url = 'https://torrid-fire-9340.firebaseio.com/';
var accordion = $("#accordion");
var currentSeason;
var currentEpisodeList;
var jsonUtils = new JsonUtils();
var stringUtils = new StringUtils();

var seasonObj = {
    showCreate: function() {
        $("#newCreateSeasonButton").hide();
        $("#accordion").hide();
        $("#createSeason").fadeIn("slow");
    },
    clearFields: function() {
        $("#seasonName").val("");
        $("#seasonPicture").val(null);
        $("#seasonDescription").val("");
    },
    hideCreate: function() {
        $("#createSeason").hide();
        $("#newCreateSeasonButton").show();
        $("#accordion").show();
        seasonObj.clearFields();
    },
    createHeader: function(name) {
        var postHeader = $("<h3></h3>", {
            "class": "postHeader",
            text: name
        });

        var addIcon = $("<span></span>", {
            "class": "ui-icon ui-icon-plus addIcon"
        });
        addIcon.css("float", "right");

        var removeIcon = $("<img>",{
            "src": "/images/trash.png",
            "alt": "Trash Can",
            "class": "removeIcon",
        });
        removeIcon.css("float", "right");

        postHeader.append(removeIcon).append(addIcon);
        return postHeader;
    },
    createAccordion: function (key, season) {
        var seasonAccordionItem = $("<div></div>", {
            "data-id": key
        });

        var seasonHeading = $("<div></div>");

        var img = $("<img></img>",{
            "src": "/images/" + season.imageSrc,
            "alt": "Season",
            "width": "200px",
            "height": "200px"
        });

        var description = $("<span></span>", {
            "class": "seasonDescription",
            text: season.description
        });

        var episodeList = $("<ul></ul>", {
            "class": "episodeList" 
        });

        var episodes = season.episodes;
        if(episodes){
            var episodeArray = episodeObj.sortEpisodes(episodes);
            for(var i = 0; i<episodeArray.length; i++){
                var episodeItem = episodeObj.createCard(episodeArray[i].key, episodeArray[i].value);
                episodeList.prepend(episodeItem);
            }
        }

        seasonHeading.append(img).append(description);
        seasonAccordionItem.append(seasonHeading).append(episodeList);

        var postAccordionHeader = seasonObj.createHeader(season.name);

        accordion.prepend(seasonAccordionItem).prepend(postAccordionHeader);
    },
    removeFromDB: function(key) {
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + key);
        ref.set(null);
    },
    removeFromPage: function(el) {
        if(window.confirm("Are you sure you want to delete this season?")){
            var seasonHeader = $(el.target).parent();
            var seasonContent = seasonHeader.next();
            var id = seasonContent.attr("data-id");
            seasonObj.removeFromDB(id);
            delete seasons[id];
            jsonUtils.store("animeList", animeList);
            seasonHeader.remove();
            seasonContent.remove();
        }
    },
    insertInDB: function(season) {
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons');
        season.episodes = {};
        var key = ref.push(season).key();
        seasons[key] = season;
        jsonUtils.store("animeList", animeList);
        return key;
    },
    getFields: function(){
        var season = {};
        season.name = $("#seasonName").val();
        season.imageSrc = $("#seasonPicture").val();
        season.description = $("#seasonDescription").val();
        return season;
    },
    createOnPage: function() {
        var season = seasonObj.getFields();
        var key = seasonObj.insertInDB(season);
        seasonObj.createAccordion(key, season);
        seasonObj.hideCreate();
        accordion.accordion('refresh');
    },
    retrieve: function() {
        currentAnimeKey = jsonUtils.retrieve("currentAnimePost");
        animeList = jsonUtils.retrieve("animeList");
        currentAnime = animeList[currentAnimeKey];
        if(!currentAnime.seasons){
            currentAnime.seasons = {};
        }

        seasons = currentAnime.seasons;

        for(x in seasons){
            var season = seasons[x];
            seasonObj.createAccordion(x, season);
        }
    }
};

var episodeObj = {
    showCreate: function(el) {
        var seasonHeader = $(el.target).parent();
        var seasonContent = seasonHeader.next();
        currentSeason = seasonContent.attr("data-id");
        currentEpisodeList = seasonContent.find("ul");
        $("#newCreateSeasonButton").hide();
        $("#accordion").hide();
        $("#createEpisode").fadeIn("slow");
    },
    clearFields: function() {
        $("#episodeNumber").val("");
        $("#episodePicture").val(null);
        $("#episodeUTitle").val("");
        $("#episodeJTitle").val("");
        $("#episodeOrder").val("");
        $("#dateAired").val("");
    },
    hideCreate: function() {
        $("#createEpisode").hide();
        $("#newCreateSeasonButton").show();
        $("#accordion").show();
        episodeObj.clearFields();
    },
    createCard: function (key, episode){    
        var episodeItem = $("<li></li>", {
            "data-id": key,
            "data-order": episode.order
        });
        
        var episodeImage = $("<img></img>", {
            "src": "/images/" + episode.imageSrc,
            "alt": "Episode",
            "width": "200px",
            "height": "200px"
        });
        
        var episodeContent = $("<div></div>", {
            "class": "episodeContent"
        });
        var episodeHeader = $("<span></span>");
        var episodeNum = $("<span></span>", {
            "class": "episodeNumber",
            text: episode.number
        });
        var editIcon = $("<span></span>", {
            "class": "ui-icon ui-icon-pencil editEpisode"
        });
        editIcon.css("float", "right");
        var removeIcon = $("<img>", {
            "src": "/images/trash.png",
            "alt": "Trash Can",
            "class": "removeEpisode",
        });
        removeIcon.css("float", "right");
        
        var review = $("<div></div>", {
           "class": "review"
        });
        
        var reviewSpan = $("<span></span>", {
            text: episode.review
        })
        
        var enterReview = $("<textarea></textarea>", {
            text: episode.review 
        });
        
        var reviewButton = $("<button></button>", {
            text: "Edit"                     
        });
        review.append(reviewSpan).append(enterReview).append(reviewButton);
        
        episodeHeader.append(episodeNum).append(removeIcon).append(editIcon).append(review);
        
        var episodeUTitle = $("<span></span>", {
            "class": "episodeTitle",
            text: episode.uTitle + "(US)"
        });

        var episodeJTitle = $("<span></span>", {
            "class": "episodeTitle",
            text: episode.jTitle + "(JP)"
        });

        var airDate = $("<span></span>", {
            "class": "airDate",
            text: "Air Date: " + episode.airDate
        });

        var helperForm = $("<form></form>");

        var rating = $("<div></div>", {
           "class": "rating"            
        });

        if(!episode.rating){
            episode.rating = 0;
        }

        for(var i = 1; i<=10; i++){
            var checked = false;
            if((i) == episode.rating){
                checked = true;
            }
            var star = $("<input>", {
                id: key + "_star" + i,
                type: "radio",
                name: "rating",
                value: i
            });
            star.attr("checked", checked);
            var label = $("<label for='" + key + "_star" + i + "'>" + i + " stars</label>");
            rating.prepend(label).prepend(star);
        }

        helperForm.append(rating);
        episodeContent.append(episodeHeader).append(episodeUTitle).append(episodeJTitle).append(airDate).append(helperForm);
        episodeItem.append(episodeImage);
        episodeItem.append(episodeContent);
        return episodeItem;
    },
    insertInDB: function(episode) {
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + currentSeason + "/episodes");
        episode.rating = 0;
        var key = ref.push(episode).key();
        if(!seasons[currentSeason].episodes){
            seasons[currentSeason].episodes = {};
        }
        seasons[currentSeason].episodes[key] = episode;
        jsonUtils.store("animeList", animeList);
        return key;
    },
    getFields: function(){
        var episode = {};
        episode.number = $("#episodeNumber").val();
        episode.imageSrc = $("#episodePicture").val();
        episode.uTitle = $("#episodeUTitle").val();
        episode.jTitle = $("#episodeJTitle").val();
        episode.order = parseInt($("#episodeOrder").val());
        episode.airDate = $("#dateAired").val();
        episode.airDate = stringUtils.reFormatDate(episode.airDate);
        episode.rating = 0;
        episode.review = "";
        return episode;
    },
    createOnPage: function() {
        var episode = episodeObj.getFields();
        var key = episodeObj.insertInDB(episode);
        var episodeItem = episodeObj.createCard(key, episode);
        var episodeItemOrder = parseInt(episodeItem.attr("data-order"));
        var flag = true;
        currentEpisodeList.children("li").each(function(index){
            var order = parseInt($(this).attr("data-order"));
            if(episodeItemOrder > order){
                $(this).before(episodeItem);
                flag = false;
                return false;
            }
        });
        if(flag){
            currentEpisodeList.append(episodeItem);
        }
        episodeObj.hideCreate();
        accordion.accordion('refresh');
    },
    updateStarRatingInDB: function(seasonKey, episodeKey, rating){
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + seasonKey + "/episodes/" + episodeKey);
        ref.update({"rating": rating});
    },
    updateStarRating: function(el){
        var star = $(el.target);
        var rating = star.val();
        var seasonKey = star.closest(".ui-accordion-content").attr("data-id");
        var episodeKey = star.closest("li").attr("data-id");
        seasons[seasonKey].episodes[episodeKey].rating = rating;
        jsonUtils.store("animeList", animeList);
        episodeObj.updateStarRatingInDB(seasonKey, episodeKey, rating);
    },
    sortByOrder: function(o1, o2){
        var order1 = o1.value.order;
        var order2 = o2.value.order;
        if(order1 < order2){
            return -1;
        }else if(order1 == order2){
            return 0;
        }else{
            return 1;
        } 
    },
    sortEpisodes: function(episodes){
        var episodeArray = [];
        for(var x in episodes){
            episodeArray.push({
                key: x,
                value: episodes[x]
            });
        }
        episodeArray.sort(episodeObj.sortByOrder);
        return episodeArray;
    },
    removeFromDB: function(episodeKey, seasonKey){
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + seasonKey + "/episodes/" + episodeKey);
        ref.set(null);
    },
    removeFromPage: function(el){
        if(window.confirm("Are you sure you want to delete this episode?")){
            var episode = $(el.target).closest("li");
            var episodeKey = episode.attr("data-id");
            var seasonKey = episode.closest(".ui-accordion-content").attr("data-id");
            episodeObj.removeFromDB(episodeKey, seasonKey);
            delete seasons[seasonKey].episodes[episodeKey];
            jsonUtils.store("animeList", animeList);
            episode.remove();
        }
    },
    displayReview: function(el){
        var review = $(el.target).next();
        if(review.css("display") == "none"){
            review.css("display", "block")
        }else{
            review.css("display", "none");;
        }
    },
    udpateReviewInDB: function(seasonKey, episodeKey, review){
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + seasonKey + "/episodes/" + episodeKey);
        ref.update({"review": review});
    },
    updateReview: function(el){
        var reviewButton = $(el.target);
        var reviewArea = reviewButton.prev();
        var reviewText = reviewArea.prev();
        var review = reviewArea.val();
        
        if(reviewArea.css("display") == "none"){
           reviewText.css("display", "none");
            reviewArea.css("display", "inline");
            reviewButton.html("Save");
            return;
        }else{
            reviewArea.css("display", "none");
            reviewText.html(review);
            reviewText.css("display", "inline");
            reviewButton.html("Edit");
        }
        
        var seasonKey = reviewButton.closest(".ui-accordion-content").attr("data-id");
        var episodeKey = reviewButton.closest("li").attr("data-id");
        
        seasons[seasonKey].episodes[episodeKey].review = review;
        jsonUtils.store("animeList", animeList);
        episodeObj.udpateReviewInDB(seasonKey, episodeKey, review);
    }
};

/************************************ Executed On Load of Page *******************************/
seasonObj.retrieve();
$(function() {
    accordion.accordion({
        heightStyle: "content"
    });
});

$(document).ready(function() {
    $(document).on("click", ".removeIcon", {"el": $(this)}, seasonObj.removeFromPage);
    $(document).on("click", ".removeEpisode", {"el": $(this)}, episodeObj.removeFromPage);
    $(document).on("click", ".editEpisode", {"el": $(this)}, episodeObj.displayReview);
    $(document).on("click", ".addIcon", {"el": $(this)}, episodeObj.showCreate);
    $(document).on("click", ".rating input", {"el": $(this)}, episodeObj.updateStarRating);
    $(document).on("click", ".review button", {"el": $(this)}, episodeObj.updateReview);
});