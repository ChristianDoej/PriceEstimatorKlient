//Husk at sæt ny krypteringsnøgle


function encryptDecrypt(input) {
    var e =1;
    var key = ['L', 'Y', 'N'];
    var out = "";
    for (var i = 0; i < input.length; i++) {
        out += (String.fromCharCode(((input.charAt(i)).charCodeAt(0) ^ (key[i % key.length]).charCodeAt(0))));
    }
    if(e==0) {
        return input;
    }
    return out;
}

function testingDelete() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user.type == 1) {
        document.location.href = 'deleteQuiz.html';
    } else {
        alert("Beklager kun ADMINS har adgang");
    }
}

function testingCreate() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user.type == 1) {
        document.location.href = 'createQuiz.html'
    } else {
        alert("Beklager kun ADMINS har adgang");
    }
}

function testingAdmin() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    if (user.type == 2) {
        document.getElementById("quizBtn").style.opacity = "0.3";
        document.getElementById("deleteQuizBtn").style.opacity = "0.3";
    } else {
    }
}