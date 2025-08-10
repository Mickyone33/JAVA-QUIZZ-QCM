// header.js
window.addEventListener('DOMContentLoaded', () => {
  const headerElement = document.querySelector('header');
  if (headerElement) {
    headerElement.innerHTML = `
      <a href="../index.html"><h1>Site de questionnaire</h1></a>
      <nav>
          <div id="navMenu">
              <a href="../TAB1/tab1.html" class="onglet" id="onglet1">ONGLET1</a>
              <a href="../TAB2/tab2.html" class="onglet" id="onglet2">ONGLET2</a>
              <a href="../TAB3/tab3.html" class="onglet" id="onglet3">ONGLET3</a>
          </div>
      </nav>
    `;

    // Charger dynamiquement le CSS du header
    const headerCSS = document.createElement('link');
    headerCSS.rel = 'stylesheet';
    headerCSS.href = '../assets/css/header.css';
    document.head.appendChild(headerCSS);

    // Colorer l'onglet actif par itération
    const path = window.location.pathname;
    const navLinks = document.querySelectorAll('#navMenu a');
    navLinks.forEach(link => {
      if (link.href && path && link.href.includes(path)) {
        link.classList.add('active-tab');
      }
    });
  }
});
