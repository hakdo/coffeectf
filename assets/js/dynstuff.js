var allowed_nonauth = ['/', '/loginrequired', '/loginrequired.html'];

var authcheck = function () {
    var user = netlifyIdentity.currentUser();
    var username = '';
    if (user == undefined) {
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

window.addEventListener("load", authcheck());

if (window.location.pathname.includes('loginrequired')) {
    document.getElementById("loginbtn").addEventListener("click", function () {
        netlifyIdentity.open();
    })
}

netlifyIdentity.on("login", authcheck())
