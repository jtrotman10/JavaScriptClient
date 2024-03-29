﻿function log() {
    document.getElementById('results').innerText = '';

    Array.prototype.forEach.call(arguments, function (msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== 'string') {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById('results').innerHTML += msg + '\r\n';
    });


}

document.getElementById("login").addEventListener("click", login, false);
document.getElementById("api").addEventListener("click", api, false);
document.getElementById("logout").addEventListener("click", logout, false);

var config = {
    authority: "https://dc2is.azurewebsites.net",
    //authority: "https://localhost:5001",
    client_id: "js",
    //redirect_uri: "https://localhost:5003/callback.html",
    redirect_uri: "https://rinadc2storage.z28.web.core.windows.net/callback.html",
    response_type: "code",
    scope: "openid profile email RinaApi role",
    //post_logout_redirect_uri: "https://localhost:5003/index.html",
    post_logout_redirect_uri: "https://rinadc2storage.z28.web.core.windows.net/index.html",
};
var mgr = new Oidc.UserManager(config);

mgr.getUser().then(function (user) {
    if (user) {
        log("User logged in", user.profile, "Auth token", user.access_token);
    }
    else {
        log("User not logged in");
    }
});

function login() {
    mgr.signinRedirect();
}

function api() {
    mgr.getUser().then(function (user) {
        var url = "https://dc2api.azurewebsites.net/api/test";

        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function () {
            log(xhr.status, JSON.parse(xhr.responseText));
        }
        xhr.setRequestHeader("Authorization", "Bearer " + user.access_token);
        xhr.send();
    });
}

function logout() {
    mgr.signoutRedirect();
}