$(function () {
    let newestToken = localStorage.getItem('token');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/user/myuser',
        dataType: "json",
        headers: {"Authorization": newestToken},
        success: function (user) {
            let cryptedUser = encryptDecrypt(user);
            //console.log(cryptedUser);
            localStorage.setItem('currentUser', cryptedUser);
            //Bruges til profile.js, loader user info
            let currentUser = JSON.parse(cryptedUser);
            if (currentUser.type == 2) {
                document.getElementById("quizBtn").style.opacity = "0.3";
                document.getElementById("deleteQuizBtn").style.opacity = "0.3";
            } else {
            }
        }
    });

});







































