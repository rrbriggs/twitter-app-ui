var request = new XMLHttpRequest();

document.addEventListener("DOMContentLoaded", function() {
    const timelineDiv = document.getElementById("timelineData");

    //set up title formatting
    const titleDiv = document.getElementById("titleDiv");
    titleDiv.className = "title";

    // trigger GET request at page load
    getTimeline(timelineDiv, request);

    // "load" = transfer is complete, all data is now in response
    request.addEventListener("load", function() {
        // set up new div per tweet/post
        buildTimeline(this.response, timelineDiv);
    });
});

function getTimeline(timelineDiv, request) {
    timelineDiv.innerHTML = "";
    request.open("GET", "http://localhost:8080/api/1.0/twitter/timeline");
    request.send();

    request.onerror = function() {
        if(request.status == 0) {
            timelineDiv.innerHTML = "";
            timelineDiv.append("No data currently available.")
        };
    };
}

function buildTimeline(response, timelineDiv) {
    let postJson = JSON.parse(response);
    var toAdd = document.createDocumentFragment();

    for(let x = 0; x < postJson.length; x++) {
        let socialPost = postJson[x];

        let newDiv = document.createElement("div");
        newDiv.id = x;
        
        // make each new post div a clickable link to the post itself
        if(socialPost.socialUser != null && socialPost.message != null) {
            let handle = socialPost.socialUser.twitterHandle;
            let postID = socialPost.postID;
            newDiv.addEventListener("click", function() {
                location.href = `http://twitter.com/${handle}/status/${postID}`;
            });

            // alternating div colors
            if (x % 2 == 0) {
                //newDiv.style.backgroundColor = "LightCyan";
                newDiv.className = "oddPostBlock";
            } else {
                //newDiv.style.backgroundColor = "LightBlue";
                newDiv.className = "evenPostBlock";
            }

            let newPhotoElement = document.createElement("img");
            newPhotoElement.id = x;
            newPhotoElement.src = socialPost.socialUser.profileImageUrl;
            newDiv.appendChild(newPhotoElement);

            let newMessageSpan = document.createElement("span");
            newMessageSpan.id = x;
            let message = document.createTextNode(socialPost.message);
            newMessageSpan.appendChild(message);
            newDiv.appendChild(newMessageSpan);

            let newDateSpan = document.createElement("span");
            newDateSpan.id = x;
            let epochDate = parseInt(socialPost.createdAt);
            let readableDate = new Date(epochDate);
            let date = document.createTextNode(readableDate);
            newDateSpan.appendChild(date);
            newDiv.appendChild(newDateSpan);

            toAdd.appendChild(newDiv);    
        }    
    }
    timelineDiv.append(toAdd);
}