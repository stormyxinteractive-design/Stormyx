const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const oldImage = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop';
const newImage = 'https://cdn.phototourl.com/free/2026-09-03-cbd02119-0748-405f-9d59-f2dcfee9cfd9.png';

code = code.replace(new RegExp(oldImage.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), newImage);

// Add favicon if not present
if (!code.includes('rel="icon"')) {
  code = code.replace(
    '<title>',
    '<link rel="icon" type="image/png" href="' + newImage + '" />\n    <title>'
  );
}

fs.writeFileSync('index.html', code);
