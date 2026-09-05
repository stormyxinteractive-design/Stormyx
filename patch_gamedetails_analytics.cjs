const fs = require('fs');
let code = fs.readFileSync('src/pages/GameDetails.tsx', 'utf8');

if (!code.includes('trackEvent')) {
  code = code.replace(
    'import { Play } from "lucide-react";',
    'import { Play } from "lucide-react";\nimport { trackEvent } from "../analytics";'
  );

  code = code.replace(
    '<a \n              href={game.buyLink || "#"} \n              target="_blank" rel="noopener noreferrer"',
    '<a \n              href={game.buyLink || "#"} \n              onClick={() => trackEvent(game.status === "pre-venda" ? "clicks_preorder" : game.status === "anuncio" ? "clicks_learnmore" : "clicks_buy")} \n              target="_blank" rel="noopener noreferrer"'
  );

  fs.writeFileSync('src/pages/GameDetails.tsx', code);
}
