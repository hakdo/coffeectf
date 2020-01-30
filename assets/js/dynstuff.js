var allowed_nonauth = ['/', '/loginrequired', '/loginrequired.html'];

var authcheck = function () {
    var user = netlifyIdentity.currentUser();
    var username = '';
    if (!user) {
        username = 'anonymous@donkey.business';
        // check if page is allowed as anonymous
        if (!allowed_nonauth.includes(window.location.pathname)) {
            window.location = "/loginrequired.html";
        }
    } else {
        username = user.email;
    }
    document.getElementById("usrtag").innerHTML = username;
}


if (window.location.pathname.includes('loginrequired')) {
    document.getElementById("loginbtn").addEventListener("click", function () {
        netlifyIdentity.open();
    })
}

window.addEventListener("load", authcheck());
netlifyIdentity.on("login", function () {
    document.getElementById("usrtag").innerHTML = netlifyIdentity.currentUser().email;
})

netlifyIdentity.on("logout", function () {
    document.getElementById("usrtag").innerHTML = "anonymous@donkey.business";
    window.location = "/";
})
