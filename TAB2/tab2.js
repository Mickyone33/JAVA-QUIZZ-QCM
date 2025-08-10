
function getResultContainer(index) {
    return document.getElementById(`deck2${String.fromCharCode(97 + index)}`);
}

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
async function loadQuizzContent(containerIndex, url) {
    // Unload previous quiz scripts
    unloadAllQuizzScripts();

    // Hide lesson deck
    lessonDeck.classList.remove("show");
    lessonDeck.classList.add("hide");


    // Hide all result containers and clear content (dynamique)
    for (let i = 0; i < 26; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.toggle("show", i === containerIndex);
            container.classList.toggle("hide", i !== containerIndex);
            container.innerHTML = "";
        }
    }

    // Add quiz form HTML to the current container
    const currentContainer = getResultContainer(containerIndex);
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

// Shortcut functions
function loadQuizz(n) {
    loadQuizzContent(n, `./QUIZZES/tab2-quizz${n+1}.js`);
}

// --------- Deck lessons display --------- //
const lesson = document.getElementById("lesson-btn");
const lessonDeck = document.getElementById("deck1-lessons");

lesson.addEventListener("click", () => {
    // Hide all quiz containers dynamiquement
    for (let i = 0; i < 26; i++) {
        const container = getResultContainer(i);
        if (container) {
            container.classList.remove("show");
            container.classList.add("hide");
        }
    }

    // Unload any loaded quiz scripts
    unloadAllQuizzScripts();

    // Show lesson deck
    lessonDeck.classList.remove("hide");
    lessonDeck.classList.add("show");
});

// Deck navigation
// Génère dynamiquement le tableau deckUrls selon le nombre de containers deck1x présents dans le HTML
const deckUrls = (() => {
    let urls = [];
    let i = 0;
    while (document.getElementById(`deck1${String.fromCharCode(97 + i)}`)) {
        urls.push(`./LESSONS/test${i+1}.html`);
        i++;
    }
    return urls;
})();

function getLessonContainer(index) {
    return document.getElementById(`deck1${String.fromCharCode(97 + index)}`);
}

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

// function loadHTMLIntoContainer(url, containerId) {
//     fetch(url)
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById(containerId).innerHTML = html;
//         })
//         .catch(error => console.error('Erreur de chargement:', error));
// }



function loadHTMLIntoContainer(url, containerId) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById(containerId).innerHTML = html;
            Prism.highlightAll();
        })
        .catch(error => console.error('Erreur de chargement:', error));
}



document.addEventListener('DOMContentLoaded', function() {
    displayPage(0); // Affiche et charge le contenu du premier deck (deck1a)
});