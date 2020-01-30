window.addEventListener("load", function () {
    var user = netlifyIdentity.currentUser();
    var username = '';
    if (user == 'undefined') {
        username = 'Anonymous Donkey';
    } else {
        username = user.email;
    }
    document.getElementById("usrtag").innerHTML = username;
})