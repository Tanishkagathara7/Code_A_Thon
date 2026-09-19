const sharp = require('sharp');
const fs = require('fs');

async function createPunchyFavicon() {
  const svgFavicon = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4F46E5" />
        <stop offset="50%" stop-color="#7C3AED" />
        <stop offset="100%" stop-color="#EC4899" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" flood-opacity="0.35"/>
      </filter>
    </defs>
    
    <!-- Transparent Background with Rich Rounded App Squircle -->
    <rect x="2" y="2" width="60" height="60" rx="15" fill="url(#bgGrad)" />
    
    <!-- White Inner GST Tax Invoice Silhouette with Folded Corner -->
    <path d="M15 11 C15 9 17 7 19 7 L39 7 L49 17 L49 48 C49 50 47 52 45 52 L19 52 C17 52 15 50 15 48 Z" fill="#FFFFFF" filter="url(#shadow)" />
    
    <!-- Bill Fold Corner -->
    <path d="M39 7 L49 17 L39 17 Z" fill="#CBD5E1" />
    
    <!-- GST Text on Document -->
    <text x="19" y="21" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="9" font-weight="900" fill="#1E1B4B" letter-spacing="0.2">GST</text>
    
    <!-- Mini invoice line indicators -->
    <rect x="19" y="25" width="16" height="2" rx="1" fill="#94A3B8" />
    <rect x="19" y="29" width="12" height="2" rx="1" fill="#CBD5E1" />
    
    <!-- Growth bar charts -->
    <rect x="29" y="34" width="3" height="8" rx="1" fill="#3B82F6" />
    <rect x="33" y="31" width="3" height="11" rx="1" fill="#6366F1" />
    
    <!-- Glowing Rupee Badge Circle in Foreground -->
    <circle cx="44" cy="43" r="14" fill="url(#bgGrad)" stroke="#FFFFFF" stroke-width="2.5" filter="url(#shadow)" />
    
    <!-- Crisp White Rupee Symbol (₹) -->
    <text x="44" y="49" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="17" font-weight="900" fill="#FFFFFF" text-anchor="middle">₹</text>
  </svg>
  `;

  const buf32 = await sharp(Buffer.from(svgFavicon)).resize(32, 32).png().toBuffer();
  const buf48 = await sharp(Buffer.from(svgFavicon)).resize(48, 48).png().toBuffer();
  const buf192 = await sharp(Buffer.from(svgFavicon)).resize(192, 192).png().toBuffer();
  const buf512 = await sharp(Buffer.from(svgFavicon)).resize(512, 512).png().toBuffer();

  // Write all icons across web and mobile
  fs.writeFileSync('d:/Code_A_Thon/web/public/favicon.ico', buf32);
  fs.writeFileSync('d:/Code_A_Thon/web/app/favicon.ico', buf32);
  fs.writeFileSync('d:/Code_A_Thon/web/public/icon.png', buf512);
  fs.writeFileSync('d:/Code_A_Thon/frontend/assets/icon.png', buf512);
  fs.writeFileSync('d:/Code_A_Thon/frontend/assets/favicon.png', buf48);

  console.log('✅ Generated high-contrast, backgroundless high-visibility brand logo and favicon successfully!');
}

createPunchyFavicon().catch(err => {
  console.error(err);
  process.exit(1);
});
