// --- Coloration du bouton actif dans la nav ---

function setActiveNavButton(index) {
    const navButtons = document.querySelectorAll('.deck0-nav button');
    navButtons.forEach((btn, i) => {
        btn.classList.toggle('active-tab', i === index);
    });
}

// Appel à chaque changement d'onglet
window.setActiveNavButton = setActiveNavButton;

// Exemple d'utilisation :
// setActiveNavButton(0) pour leçon, setActiveNavButton(1) pour quiz1, etc.
// --- Gestion des containers ---
function getResultContainer(index) {
    return document.querySelector(`.deck2${String.fromCharCode(97 + index)}`);
}
function getLessonContainer(index) {
    return document.querySelector(`.deck1${String.fromCharCode(97 + index)}`);
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
async function loadQuizzContent(containerIndex, url) {

    // Unload previous quiz scripts
    unloadAllQuizzScripts();

    // Hide lesson deck
    lessonDeck.classList.remove("show");
    lessonDeck.classList.add("hide");

    // Hide all lesson containers
    for (let i = 0; i < 26; i++) {
        const lesson = getLessonContainer(i);
        if (lesson) {
            lesson.classList.remove("show");
            lesson.classList.add("hide");
        }
    }

    // Hide all result containers and clear content
    for (let i = 0; i < 26; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.remove("show");
            container.classList.add("hide");
            container.innerHTML = "";
        }
    }

    // Show only the current quiz container
    const currentContainer = getResultContainer(containerIndex);
    currentContainer.classList.remove("hide");
    currentContainer.classList.add("show");
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

    // Load the quiz data script (quizz1.js etc.)
    try {
        const script = await loadQuizzScript(url);
        loadedScripts.push(script);
        selectedopt = undefined;

        const quizAppInstance = new QuizApp(quizJS, `deck2${String.fromCharCode(97 + containerIndex)}`);
        quizAppInstance.init();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}
function loadQuizz(n) {
    setActiveNavButton(n + 1);
    loadQuizzContent(n, `./QUIZZES/tab1-quizz${n + 1}.js`);
}
// --- Gestion des leçons ---
const lessonDeck = document.getElementById("deck1-lessons");
document.querySelector(".lesson-btn").addEventListener("click", () => {
    setActiveNavButton(0);
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
// Active le bouton 'lesson-btn' au chargement
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavButton(0);
});
