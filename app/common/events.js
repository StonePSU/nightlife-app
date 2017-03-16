'use strict';

function updateAttendees(btn) {
    var apiURL = window.location.origin + "/api/business/";
    
    var businessID = btn.getAttribute("id");
    
    ajaxFunctions.ajaxRequest("POST", null, apiURL + businessID, function(data) {
        var obj = JSON.parse(data);
        if (obj.loginStatus === "GUEST") {
            window.location = window.location.origin + "/auth/twitter";
        } else {
            var span = document.getElementById("span-" + businessID);
            if (obj.count) {
                span.innerHTML = obj.count;
            } else {
                span.innerHTML = 0;
            }
        }
    });
}