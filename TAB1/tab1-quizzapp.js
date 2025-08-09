var QuizApp = function (quizData, resultContainerId) {
    this.quiz = quizData;
    this.score = 0;
    this.currentque = 0;
    this.totalque = quizData.length;
    this.selectedopt = undefined;

    const self = this;

    this.displayQuiz = function (cque) {
        self.currentque = cque;
        if (self.currentque < self.totalque) {
            document.getElementById("qid").textContent = `${self.quiz[cque].id}.`;
            document.getElementById("question").textContent = self.quiz[cque].question;

            const optionsContainer = document.getElementById("question-options");
            optionsContainer.innerHTML = "";
            const options = self.quiz[cque].options[0];

            for (let key in options) {
                if (options.hasOwnProperty(key)) {
                    const checked = (self.quiz[cque].selectedOption === key) ? 'checked' : '';
                    optionsContainer.insertAdjacentHTML('beforeend',
                        `<div class='form-check option-block'>
                            <label>
                                <input type='radio' name='option' value='${key}' ${checked}>
                                <span>${options[key]}</span>
                            </label>
                        </div>`);
                }
            }

            document.getElementById("previous").disabled = self.currentque <= 0;
        } else {
            document.getElementById('next').disabled = true;
            self.calculateScore();
            self.showResult();
        }
    };

    this.calculateScore = function () {
        self.score = self.quiz.reduce((sum, q) => sum + q.score, 0);
    };

    this.showResult = function () {
        const resultContainer = document.getElementById(resultContainerId);
        resultContainer.innerHTML = `<h1 class='res-header'>Total Score: ${self.score}/${self.totalque}</h1>`;
        self.quiz.forEach(q => {
            const res = q.score === 0
                ? `<span class='wrong'>${q.score}</span><i class='fa fa-remove c-wrong'></i>`
                : `<span class='correct'>${q.score}</span><i class='fa fa-check c-correct'></i>`;
            resultContainer.insertAdjacentHTML('beforeend',
                `<div>
                    <div><span>Q ${q.id}</span> ${q.question}</div>
                    <div><b>Correct answer:</b> ${q.options[0][q.answer]}</div>
                    <div><b>Score:</b> ${res}</div>
                </div>`);
        });
    };

    this.checkAnswer = function (optionId) {
        const currentQ = self.quiz[self.currentque];
        currentQ.score = (optionId === currentQ.answer) ? 1 : 0;
        currentQ.status = (optionId === currentQ.answer) ? "correct" : "wrong";
    };

    this.changeQuestion = function (cque) {
        if (self.selectedopt !== undefined) {
            self.checkAnswer(self.selectedopt);
            self.quiz[self.currentque].selectedOption = self.selectedopt;
            self.selectedopt = undefined;
        }
        self.currentque += cque;
        self.displayQuiz(self.currentque);
    };

    this.init = function () {
        self.displayQuiz(0);

        document.getElementById('question-options').addEventListener('change', e => {
            if (e.target.name === 'option') {
                self.selectedopt = e.target.value;
            }
        });

        document.getElementById('next').addEventListener('click', e => {
            e.preventDefault();
            self.changeQuestion(1);
        });

        document.getElementById('previous').addEventListener('click', e => {
            e.preventDefault();
            self.changeQuestion(-1);
        });
    };
};
