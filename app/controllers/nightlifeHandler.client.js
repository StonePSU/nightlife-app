(function() {
    
    var results = document.getElementById("results") || null;
    var searchBtn = document.getElementById("search-btn") || null;
    var input = document.getElementById("search-input") || null;
    var apiURL = window.location.origin + "/api/search/"
    var searchResults = document.getElementById("results");
    
    searchBtn.addEventListener("click", search, false);
    
    input.addEventListener("keyup", function(event) {
        event.preventDefault();
        if (event.keyCode == 13) {
            searchBtn.click();
        }
    });
    
    if (document.cookie) {
        var arr = [];
        arr = document.cookie.split("=");
        if (arr[0] === "last-search") {
          input.value = arr[1];
          
          if (arr[1]) {
              searchBtn.click();
          }
        }
    }
    
    
    function getAddress(arr) {
        var text = "";
        
        arr.forEach(function(el) {
            text += el + " ";
        })
        
        return text;
    }
    
    function createHTMLRow(item) {
        var html = ""
        var apiURL = window.location.origin + "/api/business/"
        var count = 0;
        
        html = '<div class="business animated rollIn">' +
                    '<div class="business-img">' + 
                       '<img src="' + item.image_url + '" class="img-rounded">' +
                    '</div>' + 
                    '<div class="business-details">' + 
                        '<h2><a href="' + item.url + '" target="_blank">' + item.name + '</a></h2>' +
                        '<p class="business-phone">Phone Number: ' + item.display_phone + '</p>' +
                        '<p class="business-address">' + getAddress(item.location.display_address) + '</p>' +
                        '<p class="business-rating">Rating: ' + item.rating + ' <img src="' + item.rating_img_url_small + '"></p>' +
                        '<p class="snippet">' + item.snippet_text + '</p>'+
                        '<div class="social">' +
                            '<button type="button" onclick="updateAttendees(this)" id="' + item.id + '"><span id="span-' + item.id + '">0</span> Going</button>' +
                        '</div>' +
                    '</div>' +
                    '<div class="clear"></div>' +
                '</div>';
                
        ajaxFunctions.ajaxRequest("GET", null, apiURL + item.id, function(data) {
            var obj = JSON.parse(data)
            document.getElementById("span-" + item.id).innerHTML = obj.count;
        })
        return html;
        
    }
    
    function loadData(data) {
        //console.log(data);
        var obj = JSON.parse(data);
        var bus = obj.businesses;
        var html = "";
        
        bus.forEach(function(item) {
            html += createHTMLRow(item);
        });
        
        results.innerHTML = html;
        
    }
    function search() {
        var searchTerm = input.value;
        //document.cookie = "last-search=" + searchTerm;
        ajaxFunctions.ajaxRequest("GET", null, apiURL + searchTerm, loadData);
        //document.cookie="";
        
        
    }
    
})()