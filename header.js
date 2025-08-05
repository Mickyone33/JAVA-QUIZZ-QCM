// header.js
window.addEventListener('DOMContentLoaded', () => {
  const headerElement = document.querySelector('header');
  if (headerElement) {
    headerElement.innerHTML = `
      <a href="../index.html"><h1>Site de questionnaire</h1></a>
      <nav>
          <div id="navMenu">
              <a href="../TAB1/tab1.html">ONGLET1</a>
              <a href="">ONGLET2</a>
              <a href="">ONGLET3</a>
          </div>
      </nav>
    `;

    // Charger dynamiquement le CSS du header
    const headerCSS = document.createElement('link');
    headerCSS.rel = 'stylesheet';
    headerCSS.href = '../assets/css/header.css';
    document.head.appendChild(headerCSS);
  }
});
