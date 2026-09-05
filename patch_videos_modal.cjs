const fs = require('fs');
let code = fs.readFileSync('src/pages/Videos.tsx', 'utf8');

if (!code.includes('VideoModal')) {
  code = code.replace(
    'import { Play } from "lucide-react";',
    'import { Play } from "lucide-react";\nimport { useState } from "react";\nimport VideoModal from "../components/VideoModal";'
  );
  
  code = code.replace(
    'const t = translations[language];',
    'const t = translations[language];\n  const [isModalOpen, setIsModalOpen] = useState(false);\n  const [activeVideo, setActiveVideo] = useState("");'
  );
  
  code = code.replace(
    '<a href={video.embedLink} target="_blank" rel="noopener noreferrer" className="block relative aspect-video overflow-hidden rounded-xl bg-black border border-gray-800 mb-4">',
    '<button onClick={() => { setActiveVideo(video.embedLink); setIsModalOpen(true); }} className="block w-full text-left relative aspect-video overflow-hidden rounded-xl bg-black border border-gray-800 mb-4">'
  );
  
  code = code.replace(
    '</a>\n              <h3',
    '</button>\n              <h3'
  );

  code = code.replace(
    '    </div>\n  );\n}',
    '      <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrl={activeVideo} />\n    </div>\n  );\n}'
  );
  
  fs.writeFileSync('src/pages/Videos.tsx', code);
}
