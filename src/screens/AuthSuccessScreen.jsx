import React, { useEffect } from 'react';
import StatusBar from '../components/StatusBar';
import { Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuthSuccessScreen({ userName = "Sadia", onGetStarted }) {
  useEffect(() => {
    // Trigger confetti burst on entrance
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.45 },
        colors: ['#F36621', '#101935', '#0284C7', '#F59E0B', '#10B981']
      });
    } catch {
      // safe fallback
    }
  }, []);

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <StatusBar light={false} />

      {/* Main Success Content */}
      <div style={{
        padding: '60px var(--screen-padding-h) 36px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: 'auto',
          marginBottom: 'auto'
        }}>
          {/* Confetti & Checkmark Graphic */}
          <div style={{
            position: 'relative',
            width: '140px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '36px'
          }}>
            {/* Background confetti graphic particles */}
            <svg width="140" height="140" viewBox="0 0 140 140" fill="none" style={{ position: 'absolute', inset: 0 }}>
              {/* Top particles */}
              <rect x="70" y="8" width="4" height="12" rx="2" transform="rotate(15 70 8)" fill="#F36621" />
              <circle cx="98" cy="20" r="3.5" fill="#3B82F6" />
              <rect x="36" y="24" width="10" height="4" rx="2" transform="rotate(-30 36 24)" fill="#EAB308" />
              {/* Side particles */}
              <circle cx="16" cy="65" r="4" fill="#06B6D4" />
              <rect x="22" y="86" width="12" height="4" rx="2" transform="rotate(25 22 86)" fill="#3B82F6" />
              <circle cx="124" cy="68" r="3.5" fill="#8B5CF6" />
              <rect x="114" y="92" width="10" height="4" rx="2" transform="rotate(-40 114 92)" fill="#F36621" />
              <rect x="95" y="112" width="4" height="10" rx="2" transform="rotate(45 95 112)" fill="#8B5CF6" />
              <circle cx="50" cy="115" r="3" fill="#EC4899" />
            </svg>

            {/* Central Navy Badge */}
            <div style={{
              width: '74px',
              height: '74px',
              borderRadius: '50%',
              backgroundColor: '#101935',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px rgba(16, 25, 53, 0.25)',
              zIndex: 2
            }}>
              <Check size={40} strokeWidth={3.2} />
            </div>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '10px'
          }}>
            Welcome, {userName}!
          </h1>

          <p style={{
            fontSize: '15px',
            color: '#64748B',
            fontWeight: 400,
            maxWidth: '300px',
            lineHeight: '1.4'
          }}>
            Your account has been created successfully.
          </p>
        </div>

        {/* Primary Action Button */}
        <div style={{ width: '100%' }}>
          <button
            className="btn-primary"
            onClick={onGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
