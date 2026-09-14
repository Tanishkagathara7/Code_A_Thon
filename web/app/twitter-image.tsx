import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'APP — Real-Time Cross-Platform Operational Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#09090B',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle decorative background gradient */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(0,0,0,0) 70%)',
            borderRadius: '50%',
          }}
        />

        {/* Top Header / Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '24px',
              fontWeight: 800,
            }}
          >
            A
          </div>
          <span
            style={{
              color: '#E4E4E7',
              fontSize: '16px',
              fontWeight: 700,
              letterSpacing: '0.5px',
            }}
          >
            APP PLATFORM
          </span>
        </div>

        {/* Center Title & Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '60px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Synchronized Cross-Platform Operational Intelligence
          </div>
          <div
            style={{
              fontSize: '22px',
              color: '#A1A1AA',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            Next.js 16 App Router • React Native Expo • Express REST Core • AI Synthesis
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '28px',
            width: '100%',
          }}
        >
          <div style={{ color: '#71717A', fontSize: '15px' }}>
            Built for modern engineering teams and hackathon velocity
          </div>
          <div style={{ color: '#60A5FA', fontSize: '15px', fontWeight: 600 }}>
            code-a-thon-one.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
