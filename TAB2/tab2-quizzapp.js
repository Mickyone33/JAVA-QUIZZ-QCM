var selectedopt;

var QuizApp = function (quizData) {
    this.quiz = quizData;
    this.score = 0;
    this.currentque = 0;
    this.totalque = this.quiz.length;
    var self = this;

    this.displayQuiz = function (cque) {
        self.currentque = cque;

        if (self.currentque < self.totalque) {
            document.getElementById("qid").textContent = self.quiz[self.currentque].id + '.';
            document.getElementById("question").textContent = self.quiz[self.currentque].question;

            const optionsContainer = document.getElementById("question-options");
            optionsContainer.innerHTML = "";

            const options = self.quiz[self.currentque].options[0];
            for (var key in options) {
                if (options.hasOwnProperty(key)) {
                    // var isChecked = (self.quiz[self.currentque].selectedOption === key) ? 'checked' : '';
                    var isChecked = (self.quiz[self.currentque].selectedOptions || []).includes(key) ? 'checked' : '';
                    var optionHTML = `
                        <div class='form-check option-block'>
                            <label class='form-check-label'>
                                <!-- input type='radio' class='form-check-input' name='option' id='q${key}' value='${key}' ${isChecked} -->
                                <input type='checkbox' class='form-check-input' name='option' id='q${key}' value='${key}' ${isChecked}>
                                <span>${options[key]}</span>
                            </label>
                        </div>
                    `;
                    optionsContainer.insertAdjacentHTML('beforeend', optionHTML);
                }
            }

            document.getElementById("previous").disabled = self.currentque <= 0;
        }

        if (self.currentque >= self.totalque) {
            document.getElementById('next').disabled = true;
            self.calculateScore();
            self.showResult();
        } else {
            document.getElementById('next').disabled = false;
        }
    };

    this.calculateScore = function () {
        self.score = 0;
        for (var i = 0; i < self.totalque; i++) {
            self.score += self.quiz[i].score;
        }
    };

    this.showResult = function () {
        const resultContainer = document.getElementById("result1");
        resultContainer.classList.add('result1');
        resultContainer.innerHTML = `<h1 class='res-header'>Total Score: ${self.score}/${self.totalque}</h1>`;

        for (var j = 0; j < self.totalque; j++) {
            const q = self.quiz[j];
            const res = q.score === 0
                ? `<span class="wrong">${q.score}</span><i class="fa fa-remove c-wrong"></i>`
                : `<span class="correct">${q.score}</span><i class="fa fa-check c-correct"></i>`;

            // Correction ici : affiche toutes les bonnes réponses
            let correctAnswer;
            if (Array.isArray(q.answer)) {
                correctAnswer = q.answer.map(key => q.options[0][key]).join(', ');
            } else {
                correctAnswer = q.options[0][q.answer];
            }

            const resultItem = `
            <div class="result1-item">
                <div class="result-question"><span>Q ${q.id}</span> &nbsp;${q.question}</div>
                <div><b>Correct answer:</b> &nbsp;${correctAnswer}</div>
                <div class="last-row"><b>Score:</b> &nbsp;${res}</div>
            </div>
        `;
            resultContainer.insertAdjacentHTML('beforeend', resultItem);
        }
    };

    this.checkAnswer = function (selectedOptions) {
        const currentQ = self.quiz[self.currentque];
        const answer = currentQ.answer;

        if (Array.isArray(answer)) {
            // Multi-réponse
            if (
                Array.isArray(selectedOptions) &&
                selectedOptions.length === answer.length &&
                selectedOptions.every(opt => answer.includes(opt))
            ) {
                currentQ.score = 1;
                currentQ.status = "correct";
            } else {
                currentQ.score = 0;
                currentQ.status = "wrong";
            }
        } else {
            // Réponse unique
            if (
                Array.isArray(selectedOptions) &&
                selectedOptions.length === 1 &&
                selectedOptions[0] === answer
            ) {
                currentQ.score = 1;
                currentQ.status = "correct";
            } else {
                currentQ.score = 0;
                currentQ.status = "wrong";
            }
        }
    };

    this.changeQuestion = function (cque) {
        if (self.quiz[self.currentque].selectedOptions !== undefined) {
            self.checkAnswer(self.quiz[self.currentque].selectedOptions);
        }
        self.currentque += cque;
        self.displayQuiz(self.currentque);
    };
    this.init = function () {
        self.displayQuiz(0);

        document.getElementById('question-options').addEventListener('change', function (e) {
            const checked = Array.from(document.querySelectorAll('#question-options input[type="checkbox"]:checked')).map(i => i.value);
            self.quiz[self.currentque].selectedOptions = checked;
        });

        document.getElementById('next').addEventListener('click', function (e) {
            e.preventDefault();
            self.changeQuestion(1);
        });

        document.getElementById('previous').addEventListener('click', function (e) {
            e.preventDefault();
            self.changeQuestion(-1);
        });
    };
};