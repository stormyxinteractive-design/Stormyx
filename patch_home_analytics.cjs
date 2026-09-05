const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

if (!code.includes('trackEvent')) {
  code = code.replace(
    'import { Play } from "lucide-react";',
    'import { Play } from "lucide-react";\nimport { trackEvent } from "../analytics";'
  );

  code = code.replace(
    /<Link to=\{slides\[currentSlide\].link1\} className="relative group/g,
    '<Link to={slides[currentSlide].link1} onClick={() => trackEvent("clicks_learnmore")} className="relative group'
  );

  code = code.replace(
    /<Link to=\{slides\[currentSlide\].link2\} className="relative group/g,
    '<Link to={slides[currentSlide].link2} onClick={() => trackEvent(slides[currentSlide].status === "pre-venda" ? "clicks_preorder" : "clicks_buy")} className="relative group'
  );

  fs.writeFileSync('src/pages/Home.tsx', code);
}
