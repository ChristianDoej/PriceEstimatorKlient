
const $name = $("#name");
const $pass = $("#pass");

$('#loginBtn').on('click', function () {
    localStorage.clear();
    let user = {
        username: $name.val(),
        password: $pass.val()
    };
    let cryptedUser = encryptDecrypt(JSON.stringify(user));
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/api/user/login',
        dataType: 'json',
        contentType: 'application/json',
        data: cryptedUser,

        success: function (data) {
          //  console.log(data);
            let cryptedData = encryptDecrypt(data);
           // console.log(cryptedData);
            localStorage.setItem('token', cryptedData);
            document.location.href = "createEvent.html";
        }, error: function () {
            alert("Dit password matcher ikke dit brugernavn");
            document.getElementById('name').value = "";
            document.getElementById('pass').value = "";
           // console.log("error");
        }
    });
});
