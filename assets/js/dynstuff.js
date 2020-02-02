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

if (window.location.pathname.includes('jointeam')) {
    var uid = localStorage.getItem("uid");
    var email = localStorage.getItem("email");
    // get all the available teams...
    fetch('/.netlify/fucntions/basicmongo')
        .then((response) => {
            document.getElementById("teamplate").innerText = response.json();
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