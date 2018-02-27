
const $deleteCourses =$('#deleteCourses');

$(function() {
    let newestToken = localStorage.getItem('token');
    $.ajax({
        type: 'GET',
        url: 'http://localhost:8080/api/course',
        dataType: "json",
        headers: {"Authorization": newestToken},
        success: function (courses) {
           // console.log(courses);
            let cryptedCourses = encryptDecrypt(courses);
            let newCourses = JSON.parse(cryptedCourses)

            $.each(newCourses, function (i, course) {
                $deleteCourses.append("<div id='list"+ course.courseId+"'><h4>" + course.courseTitle + "</h4>" +
                    "<button id='" + course.courseId + "' class='courses'>Se liste</button><br>" +
                "<ul id='course"+ course.courseId +"'></ul></div>")
                // console.log(course);

            });
        }
    });

    $deleteCourses.on('click','.courses', function () {
        let $correctCourse = $('#course'+this.id);
        localStorage.setItem('correctCourseId', this.id);

        $.ajax({
            type: 'GET',
            url: 'http://localhost:8080/api/quiz/' + $(this).attr('id'),
            dataType: 'json',
            headers: {'Authorization': newestToken},

            success: function (data) {
                if (data) {
                    $('#course1').html("");
                    $('#course2').html("");
                    $('#course3').html("");
                    $('#course4').html("");
                    let cryptedData = encryptDecrypt(data);
                        let newData = JSON.parse(cryptedData);
                        $.each(newData, function (i, quiz) {
                          //  console.log(this);
                            $correctCourse.append("<p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                "<p>Antal Spørgsmål: " + quiz.questionCount + "</p>" +
                                "<button id='" + quiz.quizId + "' class='deleteQuiz'>Slet Quiz</button>");
                        });

                }
            }, error: function () {
                console.log("No quizzes avaliable");
            }

        });
        $correctCourse.on('click','.deleteQuiz', function() {
          //  console.log(this.id);
            $.ajax( {
                type: 'DELETE',
                url: 'http://localhost:8080/api/quiz/' + $(this).attr('id'),
                //dataType: 'json',
                //contentType: 'application/json',
                headers: {'Authorization': newestToken},
                success: function(data) {
                   // console.log("works");
                    $.ajax( {
                        type: 'GET',
                        url: 'http://localhost:8080/api/quiz/' + localStorage.getItem('correctCourseId'),
                        dataType: 'json',
                        headers: {'Authorization': newestToken},

                        success: function (data) {
                            if (data) {
                                $correctCourse.html("");
                                let cryptedData = encryptDecrypt(data);
                                let newData = JSON.parse(cryptedData);
                                $.each(newData, function (i, quiz) {
                                    $correctCourse.append("<p class='quizName'>Quiz: " + quiz.quizTitle + "</p>" +
                                        "<p>Beskrivelse: " + quiz.quizDescription + "</p>" +
                                        "<p>Lavet af: " + quiz.createdBy + "</p>" +
                                        "<p>Antal Spørgsmål: " + quiz.questionCount + "</p>" +
                                        "<button id='" + quiz.quizId + "' class='deleteQuiz'>Slet Quiz</button>");
                                });
                            }
                        }, error: function () {
                           // console.log("No quizzes avaliable");
                        }
                    });
                }
            });
        });
    });
});