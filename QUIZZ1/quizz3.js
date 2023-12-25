// step 1:; create an array of objects for the quizz
var quiz = {
    "JS": [
        {
            "id": 1,
            "question": "Question 3.1",
            "options": [
                {
                    "a": "a) bonne reponse",
                    "b": "b) mauvaise reponse",
                    "c": "c) mauvaise reponse",
                    "d": "d) mauvaise reponse",
                }
            ],
            "answer": "a",
            "score": 0,
            "status": ""
        },
        {
            "id": 2,
            "question": "question 3.2",
            "options": [
                {
                    "a": "a) mauvaise reponse",
                    "b": "b) mauvaise reponse",
                    "c": "c) bonne reponse",
                    "d": "d) mauvaise reponse",
                }
            ],
            "answer": "c",
            "score": 0,
            "status": ""
        },
        {
            "id": 3,
            "question": "question 3.3",
            "options": [
                {
                    "a": "a) mauvaise reponse",
                    "b": "b) bonne reponse",
                    "c": "c) mauvaise reponse",
                    "d": "d) mauvaise reponse",
                }
            ],
            "answer": "b",
            "score": 0,
            "status": ""
        },
    ]
}
// step 2: initialize the class "quizzApp"
var quizApp = function () {
    this.score = 0;
    this.qno = 1;
    this.currentque = 0;
    var totalque = quiz.JS.length;

    this.displayQuiz = function (cque) {
        this.currentque = cque;
        if (this.currentque < totalque) {
            $("#tque").html(totalque);
            $("#previous").attr("disabled", false);
            $("#next").attr("disabled", false);
            $("#qid").html(quiz.JS[this.currentque].id + '.');
            $("#question").html(quiz.JS[this.currentque].question);
            $("#question-options").html("");
            for (var key in quiz.JS[this.currentque].options[0]) {
                if (quiz.JS[this.currentque].options[0].hasOwnProperty(key)) {
                    var isChecked = '';
                    if (quiz.JS[this.currentque].selectedOption === key) {
                        isChecked = 'checked';
                    }
                    $("#question-options").append(
                        "<div class='form-check option-block'>" +
                        "<label class='form-check-label'>" +
                        "<input type='radio' class='form-check-input' name='option'  id='q" + key + "' value='" + quiz.JS[this.currentque].options[0][key] + "' " + isChecked + "><span id='optionval'>" +
                        quiz.JS[this.currentque].options[0][key] +
                        "</span></label>"
                    );
                }
            }
        }
        if (this.currentque <= 0) {
            $("#previous").attr("disabled", true);
        }
        if (this.currentque >= totalque) {
            $('#next').attr('disabled', true);
            for (var i = 0; i < totalque; i++) {
                this.score = this.score + quiz.JS[i].score;
            }
            return this.showResult(this.score);
        }
    }

    this.showResult = function (scr) {
        $("#result1").addClass('result1');
        $("#result1").html("<h1 class='res-header'>Total Score: &nbsp;" + scr + '/' + totalque + "</h1>");
        for (var j = 0; j < totalque; j++) {
            var res;
            if (quiz.JS[j].score == 0) {
                res = '<span class="wrong">' + quiz.JS[j].score + '</span><i class="fa fa-remove c-wrong"></i>';
            } else {
                res = '<span class="correct">' + quiz.JS[j].score + '</span><i class="fa fa-check c-correct"></i>';
            }
    
            var correctAnswer = '';
            var answerKey = quiz.JS[j].answer;
            for (var key in quiz.JS[j].options[0]) {
                if (key === answerKey) {
                    correctAnswer = quiz.JS[j].options[0][key];
                    break;
                }
            }
    
            $("#result1").append(
                '<div class="result1-item">' +
                    '<div class="result-question"><span>Q ' + quiz.JS[j].id + '</span> &nbsp;' + quiz.JS[j].question + '</div>' +
                    '<div><b>Correct answer:</b> &nbsp;' + correctAnswer + '</div>' +
                    '<div class="last-row"><b>Score:</b> &nbsp;' + res + '</div>' +
                '</div>'
            );
        }
    };

    this.checkAnswer = function(optionId) {
        var answerKey = quiz.JS[this.currentque].answer;
        console.log("Selected option ID:", optionId); // Check the ID of the selected option
        console.log("Correct answer:", answerKey); // Check the value of the correct answer
    
        // Directly compare the optionId and answerKey
        if (optionId === answerKey) {
            quiz.JS[this.currentque].score = 1;
            quiz.JS[this.currentque].status = "correct";
        } else {
            quiz.JS[this.currentque].score = 0;
            quiz.JS[this.currentque].status = "wrong";
        }
        console.log("Current score for the question:", quiz.JS[this.currentque].score); // Check the score of the question
    };

    this.changeQuestion = function (cque) {
        if (selectedopt !== undefined) {
            this.checkAnswer(selectedopt);
            quiz.JS[this.currentque].selectedOption = selectedopt; // Enregistre la réponse sélectionnée
            selectedopt = undefined; // Réinitialise la sélection de l'option
        }
        this.currentque = this.currentque + cque;
        this.displayQuiz(this.currentque);
    }
}

var jsq = new quizApp();
var selectedopt;
$(document).ready(function () {
    jsq.displayQuiz(0);
    $('#question-options').on('change', 'input[type=radio][name=option]', function (e) {
        selectedopt = $(this).attr('id').substr(1); // Extract the option ID ('a', 'b', 'c', 'd')
    });
});

$('#next').click(function (e) {
    e.preventDefault();
    jsq.changeQuestion(1);
});

$('#previous').click(function (e) {
    e.preventDefault();
    jsq.changeQuestion(-1);
});