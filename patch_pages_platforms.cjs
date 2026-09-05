const fs = require('fs');

const fixPlatforms = (file) => {
  let code = fs.readFileSync(file, 'utf8');
  code = code.replace(/game\.platforms\.slice/g, '(game.platforms || []).slice');
  code = code.replace(/game\.platforms\.map/g, '(game.platforms || []).map');
  fs.writeFileSync(file, code);
};

fixPlatforms('src/pages/Home.tsx');
fixPlatforms('src/pages/GameDetails.tsx');
