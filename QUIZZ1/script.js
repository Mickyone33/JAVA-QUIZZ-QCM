const resultContainers = [
    document.getElementById("result1"),
    document.getElementById("result2"),
    document.getElementById("result3"),
    // document.getElementById("deck1-lesson")
];

let scripts = [null, null, null];

function unloadScript(scriptVar) {
    if (scriptVar) {
        scriptVar.remove();
        scriptVar = null;
    }
}

async function loadQuizz(url, container, scriptIndex, unloadVar) {
    if (unloadVar) {
        unloadScript(unloadVar);
    }

    if (url) {
        const script = document.createElement('script');
        script.src = url;
        container.appendChild(script);
        return script;
    }
    return null;
}

async function loadQuizzContent(containerIndex, url) {
    lessonDeck.classList.remove("show");
    lessonDeck.classList.add("hide");
    for (let i = 0; i < resultContainers.length; i++) {
        const container = resultContainers[i];
        container.classList.toggle("show", i === containerIndex);
        container.classList.toggle("hide", i !== containerIndex);
        container.innerHTML = "";
    }

    const currentContainer = resultContainers[containerIndex];
    currentContainer.innerHTML = `
        <form name="quizForm" onSubmit="">
            <fieldset class="form-group">
                <h4><span id="qid">1.</span> <span id="question"></span></h4>
                <div class="option-block-container" id="question-options"></div>
            </fieldset>
            <button name="previous" id="previous" class="btn btn-success">Précédent</button>
            &nbsp;
            <button name="next" id="next" class="btn btn-success">Suivant</button>
        </form>`;

    try {
        scripts[containerIndex] = await loadQuizz(url, currentContainer, scripts[containerIndex], scripts[containerIndex - 1]);
    } catch (error) {
        console.error(`Error loading quizz${containerIndex + 1}.js:`, error);
    }
}

async function loadQuizz1() {
    await loadQuizzContent(0, "./quizz1.js");
}

async function loadQuizz2() {
    await loadQuizzContent(1, "./quizz2.js");
}

async function loadQuizz3() {
    await loadQuizzContent(2, "./quizz3.js");
}

// --------- -------------------- --------- //
// --------- deck lessons display --------- //
// --------- -------------------- --------- //
const lesson = document.getElementById("lesson-btn");
const lessonDeck = document.getElementById("deck1-lesson");

lesson.addEventListener("click", function () {
    // Hide result containers
    for (let i = 0; i < resultContainers.length; i++) {
        resultContainers[i].classList.remove("show");
        resultContainers[i].classList.add("hide");
    }

    // Show the lesson deck
    lessonDeck.classList.remove("hide");
    lessonDeck.classList.add("show");
});

const decks = [
    document.getElementById("deck1a"),
    document.getElementById("deck1b"),
    document.getElementById("deck1c"),
    document.getElementById("deck1d"),
];
let currentPage = 0;

const displayPage = (page) => {
    for (let i = 0; i < decks.length; i++) {
        if (i === page) {
            decks[i].classList.remove("hide");
            decks[i].classList.add("show");
        } else {
            decks[i].classList.remove("show");
            decks[i].classList.add("hide");
        }
    }
};

function prev() {
    currentPage = (currentPage === 0) ? decks.length - 1 : currentPage - 1;
    displayPage(currentPage);
}

function next() {
    currentPage = (currentPage === decks.length - 1) ? 0 : currentPage + 1;
    displayPage(currentPage);
}

// displayPage(currentPage);