// --- Gestion des containers ---
function getResultContainer(index) {
    return document.getElementById(`deck2${String.fromCharCode(97 + index)}`);
}
function getLessonContainer(index) {
    return document.getElementById(`deck1${String.fromCharCode(97 + index)}`);
}

// --- Gestion des scripts ---
let loadedScripts = [];
function unloadAllQuizzScripts() {
    loadedScripts.forEach(script => script.remove());
    loadedScripts = [];
}
function loadQuizzScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = () => (typeof quizJS !== 'undefined') ? resolve(script) : reject(`quizJS not defined in ${url}`);
        script.onerror = () => reject(`Failed to load ${url}`);
        document.body.appendChild(script);
    });
}

// --- Chargement du quiz ---
async function loadQuizzContent(index, url) {
    unloadAllQuizzScripts();
    lessonDeck.classList.replace("show", "hide");

    for (let i = 0; i < 26; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.toggle("show", i === index);
            container.classList.toggle("hide", i !== index);
            container.innerHTML = "";
        }
    }

    const currentContainer = getResultContainer(index);
    currentContainer.innerHTML = `
        <form name="quizForm" onSubmit="return false;">
            <fieldset class="form-group">
                <h4><span id="qid">1.</span> <span id="question"></span></h4>
                <div class="option-block-container" id="question-options"></div>
            </fieldset>
            <button name="previous" id="previous" class="btn btn-success">Précédent</button>
            &nbsp;
            <button name="next" id="next" class="btn btn-success">Suivant</button>
        </form>`;

    try {
        const script = await loadQuizzScript(url);
        loadedScripts.push(script);
        selectedopt = undefined;
        new QuizApp(quizJS, `deck2${String.fromCharCode(97 + index)}`).init();
    } catch (err) {
        console.error(err);
    }
}
function loadQuizz(n) {
    loadQuizzContent(n, `./QUIZZES/tab1-quizz${n + 1}.js`);
}

// --- Gestion des leçons ---
const lessonDeck = document.getElementById("deck1-lessons");
document.getElementById("lesson-btn").addEventListener("click", () => {
    for (let i = 0; i < 26; i++) {
        const container = getResultContainer(i);
        if (container) container.classList.replace("show", "hide");
    }
    unloadAllQuizzScripts();
    lessonDeck.classList.replace("hide", "show");
    displayPage(currentPage);
});

// --- Navigation des leçons ---
const deckUrls = (() => {
    let urls = [], i = 0;
    while (document.getElementById(`deck1${String.fromCharCode(97 + i)}`)) {
        urls.push(`./LESSONS/test${i + 1}.html`);
        i++;
    }
    return urls;
})();
let currentPage = 0;

function displayPage(page) {
    for (let i = 0; i < deckUrls.length; i++) {
        const deck = getLessonContainer(i);
        if (deck) {
            deck.classList.toggle("show", i === page);
            deck.classList.toggle("hide", i !== page);
            if (i === page) {
                loadHTMLIntoContainer(deckUrls[i], deck.id);
            } else {
                deck.innerHTML = "";
            }
        }
    }
}
function prev() {
    currentPage = (currentPage === 0) ? deckUrls.length - 1 : currentPage - 1;
    displayPage(currentPage);
}
function next() {
    currentPage = (currentPage === deckUrls.length - 1) ? 0 : currentPage + 1;
    displayPage(currentPage);
}
function loadHTMLIntoContainer(url, containerId) {
    fetch(url)
        .then(res => res.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            Prism.highlightAll();
        })
        .catch(err => console.error('Erreur de chargement:', err));
}

// --- Init ---
document.addEventListener('DOMContentLoaded', () => displayPage(0));
