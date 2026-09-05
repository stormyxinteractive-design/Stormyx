const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('google-site-verification')) {
  code = code.replace(
    '</head>',
    '  <meta name="google-site-verification" content="pj7jax-PfCkz0m3X9cllb17FLylFlYqC66iuLbdwQ2o" />\n  </head>'
  );
  fs.writeFileSync('index.html', code);
}
