var allowed_nonauth = ['/', '/loginrequired', '/loginrequired.html'];

var authcheck = function () {
    var username = '';
    var usertoken = localStorage.getItem("gotrue.user");
    // need to check this at the next crossroads...
    if (!usertoken) {
        username = 'anonymous@donkey.business';
        // check if page is allowed as anonymous
        if (!allowed_nonauth.includes(window.location.pathname)) {
            console.log(netlifyIdentity.currentUser());
            window.location = "/loginrequired.html";
        }
    }
    document.getElementById("usrtag").innerHTML = username;
}

if (window.location.pathname.includes('loginrequired')) {
    document.getElementById("loginbtn").addEventListener("click", function () {
        netlifyIdentity.open();
    })
}

// listeners on the makeateam page
if (window.location.pathname.includes('makeateam')) {
    var uid = localStorage.getItem("uid");
    var email = localStorage.getItem("email");
    document.getElementById("uid-field").value = uid;
    document.getElementById("email-field").value = email;
    document.getElementById("newteam").addEventListener("click", function () {
        document.getElementById("jointype").value = "create";
    })
    document.getElementById("jointeam").addEventListener("click", function () {
        document.getElementById("jointype").value = "join";
    })
}

var teamlist = function (teams) {
    // expects an array of team objects
    var teamholder = document.getElementById("teamplate");
    for (team of teams) {
        var newteam = document.createElement("p");
        var textnode = document.createTextNode(team.name);
        newteam.appendChild(textnode);
        teamholder.appendChild(newteam);
    }
}

if (window.location.pathname.includes('jointeam')) {
    var uid = localStorage.getItem("uid");
    var email = localStorage.getItem("email");
    // get all the available teams...
    fetch('/.netlify/functions/basicmongo')
        .then((response) => {
            console.log(response.json())
            teamlist(response.json())
        })
        .catch((err) => {
            console.log(err);
        })
}

netlifyIdentity.on("login", user => {
    document.getElementById("usrtag").innerHTML = user.email;
    localStorage.setItem("uid", user.id);
    localStorage.setItem("email", user.email);
})

netlifyIdentity.on("logout", () => {
    document.getElementById("usrtag").innerHTML = "anonymous@donkey.business";
    localStorage.clear();
    window.location = "/";
})

document.body.addEventListener("load", authcheck());