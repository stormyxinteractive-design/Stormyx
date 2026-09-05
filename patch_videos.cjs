const fs = require('fs');
let code = fs.readFileSync('src/pages/Videos.tsx', 'utf8');

const helperCode = `
  const getThumbnail = (video: any) => {
    if (video.thumbnail) return video.thumbnail;
    const url = video.embedLink || "";
    const youtubeRegex = /(?:youtube\\.com\\/(?:[^\\/]+\\/.+\\/|(?:v|e(?:mbed)?)\\/|.*[?&]v=)|youtu\\.be\\/)([^"&?\\/\\s]{11})/i;
    const match = url.match(youtubeRegex);
    if (match && match[1]) {
      return \`https://img.youtube.com/vi/\${match[1]}/maxresdefault.jpg\`;
    }
    return "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000";
  };
`;

if (!code.includes('getThumbnail')) {
  code = code.replace(
    'const t = translations[language];',
    'const t = translations[language];\n' + helperCode
  );
  
  code = code.replace(
    'src={video.thumbnail || "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000"}',
    'src={getThumbnail(video)}'
  );

  fs.writeFileSync('src/pages/Videos.tsx', code);
}
