const fs = require('fs');
let code = fs.readFileSync('src/components/Navbar.tsx', 'utf8');

if (!code.includes('trackEvent')) {
  code = code.replace(
    'import { loginWithGoogle, logout } from "../firebase";',
    'import { loginWithGoogle, logout } from "../firebase";\nimport { trackEvent } from "../analytics";'
  );

  code = code.replace(
    'await loginWithGoogle();',
    'await loginWithGoogle();\n      trackEvent("logins");'
  );

  fs.writeFileSync('src/components/Navbar.tsx', code);
}
