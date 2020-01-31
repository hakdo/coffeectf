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
    document.getElementById("newteam").addEventListener("click", function () {
        document.getElementById("jointype").value = "create";
    })
    document.getElementById("jointeam").addEventListener("click", function () {
        document.getElementById("jointype").value = "join";
    })
    document.getElementById("form-new-team").addEventListener("load", function () {
        var user = netlifyIdentity.currentUser();
        document.getElementById("uid-field").value = user.id;
        document.getElementById("email-field").value = user.email;
    })

}

netlifyIdentity.on("login", user => {
    document.getElementById("usrtag").innerHTML = user.email;
})

netlifyIdentity.on("logout", () => {
    document.getElementById("usrtag").innerHTML = "anonymous@donkey.business";
    window.location = "/";
})

document.body.addEventListener("load", authcheck());