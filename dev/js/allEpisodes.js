var url = 'https://torrid-fire-9340.firebaseio.com/';
var jsonUtils = new JsonUtils();
var currentAnimeKey = jsonUtils.retrieve("currentAnimePost");
var animeList = jsonUtils.retrieve("animeList");
var currentAnime = animeList[currentAnimeKey];
var sortMultiplier = -1;
if(!currentAnime.seasons){
    currentAnime.seasons = {};
}
var seasons = currentAnime.seasons;

var allEpisodeObj = {
    createCard: function (key, episode, seasonKey){
        if(!episode.rating){
            episode.rating = 0;
        }
        
        var episodeItem = $("<li></li>", {
            "data-id": key,
            "data-seasonKey": seasonKey,
            "data-rating": episode.rating
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
        episodeArray.sort(allEpisodeObj.sortByOrder);
        return episodeArray;
    },
    sortByRating: function(){
        var episodeListElement = $("#episodeList");
        var episodeList = episodeListElement.children("li");
        episodeList.sort(function(o1, o2){
            var rating1 = parseInt($(o1).attr("data-rating"));
            var rating2 = parseInt($(o2).attr("data-rating"));
            if(rating1 < rating2){
                return -1 * sortMultiplier;
            }else if(rating1 > rating2){
                return 1 * sortMultiplier;
            }else{
                return 0;
            }
        });
        
        episodeList.detach().appendTo(episodeListElement);
        
        sortMultiplier *= -1;
    },
    createEpisodeList: function(){
        for(x in seasons){
            var season = seasons[x];
            var episodes = season.episodes;
            if(episodes){
                var episodeArray = allEpisodeObj.sortEpisodes(episodes);
                for(var i = 0; i<episodeArray.length; i++){
                    var episodeItem = allEpisodeObj.createCard(episodeArray[i].key, episodeArray[i].value, x);
                    $("#episodeList").prepend(episodeItem);
                }
            }
        }
    },
    removeFromDB: function(episodeKey, seasonKey){
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + seasonKey + "/episodes/" + episodeKey);
        ref.set(null);
    },
    removeFromPage: function(el){
        if(window.confirm("Are you sure you want to delete this episode?")){
            var episode = $(el.target).closest("li");
            var episodeKey = episode.attr("data-id");
            var seasonKey = episode.attr("data-seasonKey");
            allEpisodeObj.removeFromDB(episodeKey, seasonKey);
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
        
        var episodeItem = reviewButton.closest("li");
        var seasonKey = episodeItem.attr("data-seasonKey");
        var episodeKey = episodeItem.attr("data-id");
        
        seasons[seasonKey].episodes[episodeKey].review = review;
        jsonUtils.store("animeList", animeList);
        allEpisodeObj.udpateReviewInDB(seasonKey, episodeKey, review);
    },
    updateStarRatingInDB: function(seasonKey, episodeKey, rating){
        var ref = new Firebase(url + 'animePosts/' + currentAnimeKey + '/seasons/' + seasonKey + "/episodes/" + episodeKey);
        ref.update({"rating": rating});
    },
    updateStarRating: function(el){
        var star = $(el.target);
        var rating = star.val();
        var episodeItem = star.closest("li");
        var seasonKey = episodeItem.attr("data-seasonKey");
        var episodeKey = episodeItem.attr("data-id");
        seasons[seasonKey].episodes[episodeKey].rating = rating;
        jsonUtils.store("animeList", animeList);
        allEpisodeObj.updateStarRatingInDB(seasonKey, episodeKey, rating);
    }
}

allEpisodeObj.createEpisodeList();
$(document).ready(function() {
    $(document).on("click", ".removeEpisode", {"el": $(this)}, allEpisodeObj.removeFromPage);
    $(document).on("click", ".editEpisode", {"el": $(this)}, allEpisodeObj.displayReview);
    $(document).on("click", ".rating input", {"el": $(this)}, allEpisodeObj.updateStarRating);
    $(document).on("click", ".review button", {"el": $(this)}, allEpisodeObj.updateReview);
});