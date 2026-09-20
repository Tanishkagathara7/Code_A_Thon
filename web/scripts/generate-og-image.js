const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function createOptimizedBrandAssets() {
  const publicDir = path.join(__dirname, '..', 'public');
  const width = 1200;
  const height = 630;
  
  // 1. Create a modern rounded squircle card with glass glow for the logo
  const logoCardSize = 440;
  const logoCornerRadius = 32;
  const roundedLogo = await sharp(path.join(publicDir, 'logo.png'))
    .resize(logoCardSize, logoCardSize, { fit: 'cover' })
    .composite([{
      input: Buffer.from(`<svg width="${logoCardSize}" height="${logoCardSize}"><rect x="0" y="0" width="${logoCardSize}" height="${logoCardSize}" rx="${logoCornerRadius}" ry="${logoCornerRadius}" fill="#fff"/></svg>`),
      blend: 'dest-in'
    }])
    .png()
    .toBuffer();

  // 2. High-contrast, hyper-aesthetic background SVG
  const bgSvg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#070709" />
        <stop offset="45%" stop-color="#0E0F1A" />
        <stop offset="100%" stop-color="#16132C" />
      </linearGradient>
      
      <radialGradient id="glowPurple" cx="75%" cy="45%" r="55%">
        <stop offset="0%" stop-color="#7C3AED" stop-opacity="0.38" />
        <stop offset="50%" stop-color="#4F46E5" stop-opacity="0.12" />
        <stop offset="100%" stop-color="#070709" stop-opacity="0" />
      </radialGradient>
      
      <radialGradient id="glowEmerald" cx="20%" cy="85%" r="45%">
        <stop offset="0%" stop-color="#059669" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#070709" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="topLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3B82F6" />
        <stop offset="35%" stop-color="#8B5CF6" />
        <stop offset="70%" stop-color="#EC4899" />
        <stop offset="100%" stop-color="#10B981" />
      </linearGradient>

      <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#4F46E5" stop-opacity="0.35" />
        <stop offset="100%" stop-color="#9333EA" stop-opacity="0.25" />
      </linearGradient>

      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.08" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.02" />
      </linearGradient>

      <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
        <feDropShadow dx="0" dy="12" stdDeviation="24" flood-color="#000000" flood-opacity="0.6"/>
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#7C3AED" flood-opacity="0.25"/>
      </filter>
    </defs>
    
    <!-- Deep Canvas & Ambient Radiance -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#glowPurple)" />
    <rect width="${width}" height="${height}" fill="url(#glowEmerald)" />
    
    <!-- Top Accent Prism Strip -->
    <rect x="0" y="0" width="${width}" height="6" fill="url(#topLine)" />
    
    <!-- LEFT HERO SECTION -->
    <!-- Pill Badge -->
    <g transform="translate(80, 75)">
      <rect width="365" height="38" rx="19" fill="url(#badgeGrad)" stroke="#6366F1" stroke-width="1.5" stroke-opacity="0.6" />
      <circle cx="20" cy="19" r="5" fill="#10B981" />
      <text x="36" y="24" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#E0E7FF" letter-spacing="1">MODERN GST INVOICING &amp; POS</text>
    </g>

    <!-- App Name Title -->
    <text x="80" y="195" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="900" fill="#FFFFFF" letter-spacing="-1.5">VyaaparGST</text>
    
    <!-- Punchy Tagline -->
    <text x="80" y="255" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="33" font-weight="700" fill="#E2E8F0" letter-spacing="-0.5">Bill Smarter, Grow Faster.</text>
    
    <!-- Subtitle description -->
    <text x="80" y="315" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">Next-gen GST invoicing, POS counter billing, stock tracking,</text>
    <text x="80" y="346" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="400" fill="#94A3B8">and real-time synchronization across Web and Mobile.</text>

    <!-- Value Prop Feature Tags -->
    <g transform="translate(80, 412)">
      <!-- Feature 1 -->
      <rect x="0" y="0" width="225" height="46" rx="12" fill="#1E1B4B" fill-opacity="0.8" stroke="#4F46E5" stroke-width="1.2" />
      <text x="20" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#A5B4FC">⚡ 35ms Cloud Sync</text>
      
      <!-- Feature 2 -->
      <rect x="240" y="0" width="245" height="46" rx="12" fill="#064E3B" fill-opacity="0.7" stroke="#059669" stroke-width="1.2" />
      <text x="260" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#6EE7B7">🧾 GST Tax Invoicing</text>
    </g>

    <g transform="translate(80, 472)">
      <!-- Feature 3 -->
      <rect x="0" y="0" width="225" height="46" rx="12" fill="#3B0764" fill-opacity="0.7" stroke="#7E22CE" stroke-width="1.2" />
      <text x="20" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#E9D5FF">🤖 AI Copilot &amp; Audit</text>

      <!-- Feature 4 -->
      <rect x="240" y="0" width="245" height="46" rx="12" fill="#18181B" fill-opacity="0.85" stroke="#3F3F46" stroke-width="1.2" />
      <text x="260" y="28" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#F4F4F5">📱 Mobile App + Web</text>
    </g>

    <!-- Bottom URL Bar -->
    <g transform="translate(80, 565)">
      <text x="0" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#818CF8">code-a-thon-one.vercel.app</text>
      <text x="320" y="22" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="500" fill="#64748B">• Production Platform</text>
    </g>

    <!-- RIGHT LOGO STAGE CONTAINER -->
    <g transform="translate(685, 95)" filter="url(#shadow)">
      <!-- Outer Glass Card Container -->
      <rect width="${logoCardSize + 30}" height="${logoCardSize + 30}" rx="38" fill="url(#cardGrad)" stroke="#FFFFFF" stroke-opacity="0.18" stroke-width="1.5" />
    </g>
  </svg>
  `;

  const finalOgCard = await sharp(Buffer.from(bgSvg))
    .composite([
      {
        input: roundedLogo,
        top: 110,
        left: 700,
      }
    ])
    .png({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(path.join(publicDir, 'opengraph-image.png'), finalOgCard);
  fs.writeFileSync(path.join(publicDir, 'twitter-image.png'), finalOgCard);
  console.log('✅ Generated polished opengraph-image.png & twitter-image.png:', finalOgCard.length, 'bytes');
}

createOptimizedBrandAssets().catch(err => {
  console.error(err);
  process.exit(1);
});
