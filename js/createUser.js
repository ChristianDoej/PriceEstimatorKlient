const $newName = $('#createName');
const $newPass = $('#createPass');
const $newPass2 = $('#createPass2');

$('#userCreate').on('click', function () {
    if ($newPass.val() === $newPass2.val()) {
        let newUser = {
            username: $newName.val(),
            password: $newPass.val()
        };
        let cryptedUser = encryptDecrypt(JSON.stringify(newUser));
        $.ajax({
            type: 'POST',
            url: 'http://localhost:8080/api/user/signup',
            dataType: 'json',
            contentType: 'application/json',
            data: cryptedUser,

            success: function (data) {
               // console.log(data);
                document.location.href = "login.html";
            }, error: function () {
               // console.log("error");
                alert("Brugernavnet er i brug");
                document.getElementById('createName').value = "";
                document.getElementById('createPass').value = "";
                document.getElementById('createPass2').value = "";
            }
        });
    } else {
        window.alert("passwords do not match");
    }
});