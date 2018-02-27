
const $profile = $('#profile');
$(function () {
    testingAdmin();
    let user = JSON.parse(localStorage.getItem('currentUser'));
    let type;
    if(user.type==1) {
        type = "Admin";
    }else {
        type ="Bruger";
    }
    $profile.append("<p>Username: "+ user.username +"</p>" +
        "<p>UserID: "+ user.userId +"</p>" +
        "<p>UserType: "+ type +"</p>");
});
