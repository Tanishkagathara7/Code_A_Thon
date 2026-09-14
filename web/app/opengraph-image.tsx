import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const alt = 'APP — Real-Time Cross-Platform Operational Intelligence';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
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
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            left: '20%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(0,0,0,0) 70%)',
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10B981',
              }}
            />
            <span
              style={{
                color: '#E4E4E7',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '1px',
              }}
            >
              CROSS-PLATFORM ARCHITECTURE
            </span>
          </div>
        </div>

        {/* Center Title & Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
          <div
            style={{
              fontSize: '64px',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: '-1.5px',
            }}
          >
            Real-Time Cross-Platform Intelligence & Operations
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#A1A1AA',
              lineHeight: 1.4,
              maxWidth: '900px',
            }}
          >
            One authoritative backend powering synchronized Next.js 16 and React Native Expo workspaces with zero architectural drift.
          </div>
        </div>

        {/* Bottom Feature Tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '32px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4D4D8', fontSize: '16px' }}>
            <span style={{ color: '#3B82F6', fontWeight: 700 }}>•</span> Next.js 16 App Router
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4D4D8', fontSize: '16px' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>•</span> React Native Expo SDK 57
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#A855F7', fontWeight: 700 }}>
            <span style={{ color: '#F59E0B', fontWeight: 700 }}>•</span> OpenRouter AI Gateway
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#D4D4D8', fontSize: '16px' }}>
            <span style={{ color: '#10B981', fontWeight: 700 }}>•</span> MongoDB Atlas
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
