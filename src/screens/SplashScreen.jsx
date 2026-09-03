import React from 'react';
import StatusBar from '../components/StatusBar';

export default function SplashScreen({ onNext }) {
  return (
    <div 
      onClick={onNext}
      style={{
        backgroundColor: 'var(--color-brand-navy)',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        cursor: 'pointer',
        position: 'relative',
        userSelect: 'none'
      }}
    >
      <StatusBar light={true} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}>
        <div 
          className="animate-pulse-glow"
          style={{
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            backgroundColor: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.35)'
          }}
        >
          <img 
            src="/assets/logo.png" 
            alt="Home2School Logo" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* Tap hint & Home Indicator */}
      <div style={{
        paddingBottom: '28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{
          color: 'rgba(255, 255, 255, 0.5)',
          fontSize: '13px',
          fontWeight: 500,
          letterSpacing: '0.2px'
        }}>
          Tap anywhere to continue
        </span>
        <div className="ios-home-indicator light" />
      </div>
    </div>
  );
}
