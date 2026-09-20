import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';
export const alt = 'VyaaparGST — Modern GST Billing, Invoicing & POS Platform';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  const filePath = path.join(process.cwd(), 'public', 'opengraph-image.png');
  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
