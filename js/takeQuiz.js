const $courses = $("#courses");
const $quizzes = $("#quizzes");
const $quizzes2 = $("#quizzes2");
const $questions = $("#questions");
const $options = $("#options");
const $middle = $("#middle");

$(function () {
    testingAdmin();
    let newestToken = localStorage.getItem('token');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/course',
        dataType: "json",
        headers: {"Authorization": newestToken},
        success: function (courses) {
            let cryptedCourses = encryptDecrypt(courses);
            let newCourses = JSON.parse(cryptedCourses)

            $.each(newCourses, function (i, course) {
                $courses.append("<li class='loadedCourses'>" + course.courseTitle + "</li>" +
                    "<button id='btn" + course.courseId + "'data-id='" + course.courseId + "' class='chooseCourse'>--></button><br>");
            });
        }
    });

    $courses.on('click','.chooseCourse', function () {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/quiz/' + $(this).attr('data-id'),
            dataType: 'json',
            headers: {'Authorization': newestToken},
            success: function (data) {
                if (data) {
                    $quizzes.html("");
                    $quizzes2.html("");
                    $questions.html("");
                    let cryptedData = encryptDecrypt(data);
                    let newData = JSON.parse(cryptedData);
                    let count = 0;
                    $.each(newData, function (i, quiz) {
                        if (count < 3) {
                            $quizzes.append("<div class='firstQuiz>'><p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                "<p>Antal spørgsmål: " + quiz.questionCount + "</p>" +
                                "<button quiz-id='" + quiz.quizId + "' class='chooseQuiz'>Start Quiz</button></div><br>");
                            count++;
                        } else if (3 <= count && count < 6) {
                            $quizzes2.append("<div class='secondQuiz'><p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                "<p>Antal spørgsmål: " + quiz.questionCount + "</p>" +
                                "<button quiz-id='" + quiz.quizId + "' class='chooseQuiz2'>Start Quiz</button></div><br>");
                            count++;
                        } else if (6 <= count && count < 9) {
                            $quizzes.append("<div class='firstQuiz>'><p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                "<p>Antal spørgsmål: " + quiz.questionCount + "</p>" +
                                "<button quiz-id='" + quiz.quizId + "' class='chooseQuiz'>Start Quiz</button></div><br>");
                            count++;
                        } else if (9 <= count && count < 12) {
                            $quizzes2.append("<div class='secondQuiz'><p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                "<p>Antal spørgsmål: " + quiz.questionCount + "</p>" +
                                "<button quiz-id='" + quiz.quizId + "' class='chooseQuiz2'>Start Quiz</button></div><br>");
                            count++;
                        }
                    });
                }
            }, error: function () {
               // console.log("No quizzes avaliable");
            }

        });
    });
////
    $quizzes.on('click', '.chooseQuiz',  function () {
        $quizzes.html("");
        $quizzes2.html("");
        $questions.html("");
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/question/' + $(this).attr('quiz-id'),
            dataType: 'json',
            headers: {'Authorization': newestToken},
            success: function (data) {
                if (data) {
                    document.getElementById("btn1").disabled = true;
                    document.getElementById("btn2").disabled = true;
                    document.getElementById("btn3").disabled = true;
                    document.getElementById("btn4").disabled = true;
                    let cryptedData = encryptDecrypt(data);
                    let newQuestions = JSON.parse(cryptedData);
                    localStorage.setItem('currentQuestion', newQuestions.question);
                    let adder = 1;
                    $.each(newQuestions, function (i, questions) {
                        $questions.append("<li class='questionos' id='text" + questions.questionId + "'>"+ adder + ": " + questions.question + "</li>" +
                            "<button question-id='"+questions.questionId +"' id='" + questions.questionId + "' class='chooseOptions'>Svar på spørgsmålet</button>");
                        adder++;
                    });
                }
            }
        });
    });

    $quizzes2.on('click','.chooseQuiz2', function () {
        $quizzes.html("");
        $quizzes2.html("");
        $questions.html("");
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/question/' + $(this).attr('quiz-id'),
            dataType: 'json',
            headers: {'Authorization': newestToken},
            success: function (data) {
                if (data) {
                    document.getElementById("btn1").disabled = true;
                    document.getElementById("btn2").disabled = true;
                    document.getElementById("btn3").disabled = true;
                    document.getElementById("btn4").disabled = true;
                    let cryptedData = encryptDecrypt(data);
                    let newQuestions = JSON.parse(cryptedData);
                    localStorage.setItem('currentQuestion', newQuestions.question);
                    let adder = 1;
                    $.each(newQuestions, function (i, questions) {
                        $questions.append("<li class='questionos' id='text" + questions.questionId + "'>"+ adder +": " + questions.question + "</li>" +
                            "<button question-id='"+questions.questionId +"' id='" + questions.questionId + "' class='chooseOptions'>Svar på spørgsmålet</button>");
                        adder++;
                    });
                }
            }
        });
    });
    // $(this).prop('disabled', true);   skal bruges til at sørge for knapper kun klikker 1 gang
    // $(this) udskiftes med id fra button, som også bruges ti lat ændre farve
    $questions.on('click','.chooseOptions', function () {
        $options.html("");
        let questionId = $(this).attr('question-id');
        let $questionText = $('#text' + questionId);
        localStorage.setItem('questionId', questionId);
        localStorage.setItem('pressedQuizId', questionId);
        let $cOptions = $(this);
        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/option/' + $(this).attr('question-id'),
            dataType: 'json',
            headers: {'Authorization': newestToken},

            success: function (data) {
                if (data) {
                    let cryptedData = encryptDecrypt(data);
                    let newOptions = JSON.parse(cryptedData);
                    let currentQuestion = $questionText.text();
                    let option =[];
                    $options.append("<p>" + currentQuestion + "</p>")
                    $.each(newOptions, function (i, options) {

                        option.push(options.optionId);
                       // console.log(option);
                        if (options.isCorrect == 0) {
                            $options.append("<li class='optionos'>" + options.option + "</li>" +
                                "<button id='" + options.optionId + "' class='wrong'>Vælg</button>");
                        } else if (options.isCorrect == 1) {
                            $options.append("<li>" + options.option + "</li>" +
                                "<button id='" + options.optionId + "' class='correct'>Vælg</button>");
                        }
                    });
                    //Ikke svare på spm senere hen
                    if($cOptions.attr('pressed')==1) {
                        $('.wrong').css('color', 'red');
                        $('.correct').css('color', 'green');
                        $.each(newOptions, function (i, option) {
                            document.getElementById(option.optionId).disabled = true;
                        });
                    } else {
                        var option1 = option[0];
                        var option2 = option[1];
                        var option3 = option[2];
                        var option4 = option[3];
                        localStorage.setItem('option1', option1);
                        localStorage.setItem('option2', option2);
                        localStorage.setItem('option3', option3);
                        localStorage.setItem('option4', option4);
                    }
                }else {
                    $options.append("<p>Beklager, der er ikke blive tilføjet nogle svarmuligheder til dette spørgsmål</p>")
                }
            }
        });
    });
    let total = 0;
    let correct = 0;
    $options.on('click','.wrong', function () {
        total++;
        $('.wrong').css('color', 'red');
        $('.correct').css('color', 'green');
        let $questionId = $("button[question-id='" + localStorage.getItem('questionId') +"']");
        $questionId.css('color', 'red');
        document.getElementById(localStorage.getItem('questionId')).textContent="Forkert - se svarmuligheder";
        //Sørger for at når man har svaret på et spørgsmål, så kan man ikke svare på det samme spørgsmål igen, hvis man på et senere tidspunkt klikker på den igen.
        let pressedId = localStorage.getItem('pressedQuizId');
        let pressed = document.getElementById(pressedId);
        pressed.setAttribute('pressed', 1);
        //Sørger for at man ikke kan svare flere gange på det samme spørgsmål første gang man svarer
        document.getElementById(localStorage.getItem('option1')).disabled = true;
        document.getElementById(localStorage.getItem('option2')).disabled = true;
        document.getElementById(localStorage.getItem('option3')).disabled = true;
        document.getElementById(localStorage.getItem('option4')).disabled = true;


    });
    $options.on('click','.correct', function () {
        total++;
        correct++;
        $('.wrong').css('color', 'red');
        $('.correct').css('color', 'green');
       // let $questionId = $('#' + localStorage.getItem('questionId'));

        let $questionId = $("button[question-id='" + localStorage.getItem('questionId') +"']");
        //console.log($questionId);
        $questionId.css('color', 'green');
        document.getElementById(localStorage.getItem('questionId')).textContent="Korrekt - se svarmuligheder";
        let pressedId = localStorage.getItem('pressedQuizId');
        let pressed = document.getElementById(pressedId);
        pressed.setAttribute('pressed', 1);
        document.getElementById(localStorage.getItem('option1')).disabled = true;
        document.getElementById(localStorage.getItem('option2')).disabled = true;
        document.getElementById(localStorage.getItem('option3')).disabled = true;
        document.getElementById(localStorage.getItem('option4')).disabled = true;
    });

    $('#result').click(function () {
        alert("Du har svaret " + correct + " ud af " + total + " rigtigt");
    });

});

