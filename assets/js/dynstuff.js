window.addEventListener("load", function () {
    var user = netlifyIdentity.currentUser();
    document.getElementById("usrtag").innerHTML = user.email;
})