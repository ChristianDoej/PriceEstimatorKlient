const $loadedCourses = $('#loadedCourses');
const $questionChoices = $('#questionChoices');
const $inputBtn = $('#inputBtn');
const $quiz = $('#quiz');
const $options = $('#options');
const $done = $('#done');

$(function () {
    let newestToken = localStorage.getItem('token');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/course',
        dataType: "json",
        headers: {"Authorization": newestToken},
        success: function (courses) {
         //   console.log(courses);
            let cryptedCourses = encryptDecrypt(courses);
            let newCourses = JSON.parse(cryptedCourses)
            localStorage.setItem('k', 0);
            $.each(newCourses, function (i, course) {
                $loadedCourses.append("<li>Course: " + course.courseTitle + "</li>" +
                    "<button id='" + course.courseId + "' class='chooseCourse'>Begynd!</button><br>");
            });
        }
    });

    $loadedCourses.on('click', '.chooseCourse', function () {
        let courseId = this.id;
        localStorage.setItem('courseId', courseId);
        let $courseId = $('#' + courseId);
        let k = localStorage.getItem('k');
        if (k == 0) {
            $courseId.css('background-color', '#91e095');
            localStorage.setItem('k', 1);
            localStorage.setItem('o', 0);
            $questionChoices.append("<br><p>Vælg quiz størrelse:</p>")
            $questionChoices.append("<input id='5'  class='questionBtn' type='button' value='5'>\n")
            $questionChoices.append("<input id='10' class='questionBtn' type='button' value='10'>\n")
            $questionChoices.append("<input id='15' class='questionBtn' type='button' value='15'>\n")
            $questionChoices.append("<input id='20' class='questionBtn' type='button' value='20'>\n")
        }
    });

    $questionChoices.on('click', '.questionBtn', function () {
        let $numberId = $('#' + this.id);
        let o = localStorage.getItem('o');
        if (o == 0) {
           // console.log(this.id);
            $numberId.css('background-color', '#91e095');
            localStorage.setItem('o', 1);
            localStorage.setItem('count', this.id);
            localStorage.setItem('l', 0);
            $quiz.append("<p>Udfyld felterne:</p>")
            $quiz.append("<input id='quizName' type='text' placeholder='Quiz navn'>\n")
            $quiz.append("<input id='quizDescription' type='text' placeholder='Quiz beskrivelse'>\n")
            $quiz.append("<input id='nameAndDes'class='quizBtn' type='button' value='Næste'><br><br>\n")
            $done.append("<input id='doneBtn' type='button' value='Afslut' onclick=\"document.location.href='createQuiz.html'\">")
        }
    });

    $quiz.on('click', '.quizBtn', function () {
        let l = localStorage.getItem('l');
        let $nextBtn = $('#nameAndDes');
        let $quizName = $('#quizName');
        let quizName = $quizName.val();
        let $quizDescription = $('#quizDescription');
        let quizDescription = $quizDescription.val();

        if ($quizName.val() == "") {
            alert("Husk at skriv navn på quiz");
        } else if ($quizDescription.val() == "") {
            alert("Husk at skriv en description");
        } else {
            if (l == 0) {
                $nextBtn.css('background-color', '#91e095');
                let user = JSON.parse(localStorage.getItem('currentUser'));
                let newQuiz = {
                    createdBy: user.username,
                    questionCount: localStorage.getItem('count'),
                    quizTitle: quizName,
                    quizDescription: quizDescription,
                    courseId: localStorage.getItem('courseId'),
                };
                let cryptedQuiz = encryptDecrypt(JSON.stringify(newQuiz));
               // console.log(JSON.stringify(newQuiz));
               // console.log(cryptedQuiz);
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/quiz',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: cryptedQuiz,
                    headers: {'Authorization': newestToken},

                    success: function (data) {
                       // console.log(data);
                        let cryptedData = encryptDecrypt(data);
                        let newData = JSON.parse(cryptedData);
                        let quizId = newData.quizId;
                       // console.log(quizId);
                        localStorage.setItem('quizId', quizId);
                    }
                });
                //Sætter den til 21, for at undgå problemer med quiz, da de indeholder id 1-20.
                let idAdder = 21;
                for (i = 0; i < localStorage.getItem('count'); i++) {
                    $inputBtn.append("<input id='name" + idAdder + "' type=\"text\" placeholder=\"Spørgsmål\">\n")
                    $inputBtn.append("<input id='" + idAdder + "' class=\"addQuestionBtn\" type=\"button\" value=\"Tilføj svar\">\n<br><br>")
                    idAdder++;
                }
                localStorage.setItem('l', 1);
            }
        }


    });

    $inputBtn.on('click', '.addQuestionBtn', function () {
        let $correctId = $('#name' + this.id);
        localStorage.setItem('idAdder', this.id);
        localStorage.setItem('questionName', $correctId.val());
        $options.html("");
        if ($(this).attr('pressed') == 1) {
            console.log("nonono");
        } else {
            if ($correctId.val() == "") {
                window.alert("Question felt tomt")
            } else {
                let newQuestion = {
                    question: localStorage.getItem('questionName'),
                    questionToQuizId: localStorage.getItem('quizId'),
                };
                let cryptedQuestion = encryptDecrypt(JSON.stringify(newQuestion));
                $.ajax({
                    type: 'POST',
                    url: 'http://localhost:8080/api/question',
                    dataType: 'json',
                    contentType: 'application/json',
                    data: cryptedQuestion,
                    headers: {'Authorization': newestToken},
                    success: function (data) {
                        let cryptedData = encryptDecrypt(data);
                        let newData = JSON.parse(cryptedData);
                        let questionId = newData.questionId;
                     //   console.log(data);
                        localStorage.setItem('questionId', questionId);
                    }
                });
                let name = localStorage.getItem('questionName');
                $options.append("<h4>" + name + "</h4>");
                $options.append("<input id='option1'class='newOptions' type=\"text\" placeholder=\"Mulighed 1\">\n")
                $options.append("<input id='btn1' class='isCorrect' name='isCorrect' type='radio' value='0'<br><br>")
                $options.append("<input id='option2' class='newOptions' type=\"text\" placeholder=\"Mulighed 2\">\n")
                $options.append("<input id='btn2' class='isCorrect' name='isCorrect' type='radio' value='0'<br><br>")
                $options.append("<input id='option3' class='newOptions' type=\"text\" placeholder=\"Mulighed 3\">\n")
                $options.append("<input id='btn3' class='isCorrect' name='isCorrect' type='radio' value='0'<br><br>")
                $options.append("<input id='option4'class='newOptions' type=\"text\" placeholder=\"Mulighed 4\">\n")
                $options.append("<input id='btn4' class='isCorrect' name='isCorrect' type='radio' value='0'<br><br>")
                $options.append("<input class=\"addOptionsBtn\" type=\"button\" value='Bekræft muligheder'>\n")
                $options.append("<p style=font-size:75%>Husk at marker rigtigt svar </p>");
            }
        }
    });

    $options.on('click', '.addOptionsBtn', function () {
        let $option1 = $('#option1');
        let valOption1 = $option1.val();
        let $option2 = $('#option2');
        let valOption2 = $option2.val();
        let $option3 = $('#option3');
        let valOption3 = $option3.val();
        let $option4 = $('#option4');
        let valOption4 = $option4.val();


        //Changes value to 1, which means it's marked as correct
        $('input[name=isCorrect]:checked').val(1);

        if (valOption1 == "") {
            alert("Option 1 mangler");
        } else if (valOption2 == "") {
            alert("Option 2 mangler");
        } else if (valOption3 == "") {
            alert("Option 3 mangler");
        } else if (valOption4 == "") {
            alert("Option 4 mangler");
        } else {
            let option1 = {
                option: valOption1,
                optionToQuestionId: localStorage.getItem('questionId'),
                isCorrect: $('#btn1').val(),
            };
            let option2 = {
                option: valOption2,
                optionToQuestionId: localStorage.getItem('questionId'),
                isCorrect: $('#btn2').val(),
            };
            let option3 = {
                option: valOption3,
                optionToQuestionId: localStorage.getItem('questionId'),
                isCorrect: $('#btn3').val(),
            };
            let option4 = {
                option: valOption4,
                optionToQuestionId: localStorage.getItem('questionId'),
                isCorrect: $('#btn4').val(),
            };
            let cryptedOption1 = encryptDecrypt(JSON.stringify(option1));
            let cryptedOption2 = encryptDecrypt(JSON.stringify(option2));
            let cryptedOption3 = encryptDecrypt(JSON.stringify(option3));
            let cryptedOption4 = encryptDecrypt(JSON.stringify(option4));

            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/option',
                dataType: 'json',
                contentType: 'application/json',
                data: cryptedOption1,
                headers: {'Authorization': newestToken},
                success: function (data) {
                  //  console.log(data);
                }
            });
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/option',
                dataType: 'json',
                contentType: 'application/json',
                data: cryptedOption2,
                headers: {'Authorization': newestToken},
                success: function (data) {
                   // console.log(data);
                }
            });
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/option',
                dataType: 'json',
                contentType: 'application/json',
                data: cryptedOption3,
                headers: {'Authorization': newestToken},
                success: function (data) {
                  //  console.log(data);
                }
            });
            $.ajax({
                type: 'POST',
                url: 'http://localhost:8080/api/option',
                dataType: 'json',
                contentType: 'application/json',
                data: cryptedOption4,
                headers: {'Authorization': newestToken},
                success: function (data) {
                  //  console.log(data);
                    $options.html("");
                    //Gør "tilføj muligheder" knappen grøn
                    let $idAdder = $('#' + localStorage.getItem('idAdder'));
                    $idAdder.css('background-color', '#91e095');
                    //Sørger for at man ikke kan trykke på "tilføj muligheder" knappen, hvis der allerede er oprettet options til spørgsmålet
                    let pressedId = localStorage.getItem('idAdder');
                    let pressed = document.getElementById(pressedId);
                    pressed.setAttribute('pressed', 1);
                }
            });
        }


    });

});