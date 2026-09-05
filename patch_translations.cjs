const fs = require('fs');
let code = fs.readFileSync('src/translations.ts', 'utf8');

function inject(lang, additions) {
  const marker = lang + ": {";
  if (code.includes(marker)) {
    code = code.replace(marker, marker + '\n' + additions);
  }
}

const pt = `    welcomeTitle: "Bem-vindo à Stormyx Interactive!",
    welcomeDesc: "Prepare-se para explorar nosso catálogo e descobrir as novidades da próxima geração de jogos.",
    welcomeBtn: "Explorar Agora",
    applyNow: "Candidatar-se",
    loginToApply: "Faça Login para se Candidatar",
    applicationSent: "Candidatura Enviada!",`;

const en = `    welcomeTitle: "Welcome to Stormyx Interactive!",
    welcomeDesc: "Get ready to explore our catalog and discover the latest in next-generation gaming.",
    welcomeBtn: "Explore Now",
    applyNow: "Apply Now",
    loginToApply: "Login to Apply",
    applicationSent: "Application Sent!",`;

const es = `    welcomeTitle: "¡Bienvenido a Stormyx Interactive!",
    welcomeDesc: "Prepárate para explorar nuestro catálogo y descubrir lo último en juegos de próxima generación.",
    welcomeBtn: "Explorar Ahora",
    applyNow: "Aplicar Ahora",
    loginToApply: "Inicia sesión para aplicar",
    applicationSent: "¡Aplicación enviada!",`;

const fr = `    welcomeTitle: "Bienvenue chez Stormyx Interactive !",
    welcomeDesc: "Préparez-vous à explorer notre catalogue et à découvrir les dernières nouveautés du jeu de nouvelle génération.",
    welcomeBtn: "Explorer",
    applyNow: "Postuler Maintenant",
    loginToApply: "Connectez-vous pour postuler",
    applicationSent: "Candidature envoyée !",`;

const de = `    welcomeTitle: "Willkommen bei Stormyx Interactive!",
    welcomeDesc: "Machen Sie sich bereit, unseren Katalog zu erkunden und die neuesten Entwicklungen im Next-Gen-Gaming zu entdecken.",
    welcomeBtn: "Jetzt Erkunden",
    applyNow: "Jetzt Bewerben",
    loginToApply: "Zum Bewerben einloggen",
    applicationSent: "Bewerbung gesendet!",`;

inject('pt', pt);
inject('en', en);
inject('es', es);
inject('fr', fr);
inject('de', de);

fs.writeFileSync('src/translations.ts', code);
