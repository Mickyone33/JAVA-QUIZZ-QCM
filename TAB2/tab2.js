const resultContainers = [
    document.getElementById("result1"),
    document.getElementById("result2"),
    document.getElementById("result3")
];

let loadedScripts = [];

// Function to unload all quiz scripts
function unloadAllQuizzScripts() {
    loadedScripts.forEach(script => {
        if (script) script.remove();
    });
    loadedScripts = [];
}

// Function to load a quiz script dynamically
function loadQuizzScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.setAttribute('data-quiz', 'true');
        script.onload = () => {
            if (typeof quizJS !== 'undefined') {
                resolve(script);
            } else {
                reject(new Error('quizJS not defined in ' + url));
            }
        };
        script.onerror = () => reject(new Error('Failed to load ' + url));
        document.body.appendChild(script);
    });
}

// Generic function to load quiz content into a container
function getResultContainer(index) {
    return document.getElementById(`deck2${String.fromCharCode(97 + index)}`);
}

async function loadQuizzContent(index, url) {
    unloadAllQuizzScripts();
    lessonDeck.classList.remove("show");
    lessonDeck.classList.add("hide");

    // Hide all quiz containers and clear content
    for (let i = 0; i < 3; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.toggle("show", i === index);
            container.classList.toggle("hide", i !== index);
            container.innerHTML = "";
        }
    }

    // Add quiz form HTML to the current container
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

    // Load the quiz data script (quizz1.js etc.)
    try {
        const script = await loadQuizzScript(url);
        loadedScripts.push(script);
        selectedopt = undefined;
        new QuizApp(quizJS, `deck2${String.fromCharCode(97 + index)}`).init();
    } catch (error) {
        console.error(`Error loading ${url}:`, error);
    }
}

// Shortcut functions
function loadQuizz(n) {
    loadQuizzContent(n, `./QUIZZES/tab2-quizz${n + 1}.js`);
}

// --------- Deck lessons display --------- //
const lesson = document.getElementById("lesson-btn");
const lessonDeck = document.getElementById("deck1-lessons");

lesson.addEventListener("click", () => {
    for (let i = 0; i < 3; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.remove("show");
            container.classList.add("hide");
        }
    }
    unloadAllQuizzScripts();
    lessonDeck.classList.remove("hide");
    lessonDeck.classList.add("show");
});

// Deck navigation
const decks = [
    document.getElementById("deck1a"),
    document.getElementById("deck1b"),
    document.getElementById("deck1c"),
    document.getElementById("deck1d")
];

let currentPage = 0;

function displayPage(page) {
    decks.forEach((deck, index) => {
        deck.classList.toggle("show", index === page);
        deck.classList.toggle("hide", index !== page);
    });
}

function prev() {
    currentPage = (currentPage === 0) ? decks.length - 1 : currentPage - 1;
    displayPage(currentPage);
}

function next() {
    currentPage = (currentPage === decks.length - 1) ? 0 : currentPage + 1;
    displayPage(currentPage);
}

// 

const deckIds = ["deck1a", "deck1b", "deck1c", "deck1d"];
const deckUrls = [
    "./LESSONS/test1.html", // pour deck1a
    "./LESSONS/test2.html", // pour deck1b
    "./LESSONS/test3.html", // pour deck1c
    "./LESSONS/test4.html"  // pour deck1d
];

function loadHTMLIntoContainer(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            Prism.highlightAll(); // <-- Ajoute cette ligne !
        })
        .catch(error => console.error('Erreur de chargement:', error));
}

function displayPage(page) {
    deckIds.forEach((id, index) => {
        const deck = document.getElementById(id);
        deck.classList.toggle("show", index === page);
        deck.classList.toggle("hide", index !== page);
        if (index === page) {
            loadHTMLIntoContainer(deckUrls[index], id);
        } else {
            deck.innerHTML = ""; // décharge le contenu
        }
    });
}
document.addEventListener('DOMContentLoaded', function() {
    displayPage(0); // Affiche et charge le contenu du premier deck (deck1a)
});