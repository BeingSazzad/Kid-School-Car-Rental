import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { Info, ShieldCheck, ChevronDown } from 'lucide-react';

export default function AuthWelcomeScreen({ onContinue }) {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(phoneNumber || '(416) 555-0192');
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowY: 'auto'
    }}>
      <StatusBar light={false} />

      {/* Hero Car & Kids Image with Curved Wave Divider */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '320px',
        overflow: 'hidden',
        flexShrink: 0
      }}>
        <img 
          src="/assets/auth_hero.jpg" 
          alt="School Ride Car" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 40%'
          }}
        />
        {/* Soft white wave curve at bottom of image matching Figma */}
        <div style={{
          position: 'absolute',
          bottom: -1,
          left: 0,
          width: '100%',
          overflow: 'hidden',
          lineHeight: 0
        }}>
          <svg viewBox="0 0 430 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '36px' }}>
            <path d="M0 36H430V15C340 32 260 2 170 12C95 20 40 32 0 15V36Z" fill="#FFFFFF" />
          </svg>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '12px var(--screen-padding-h) 28px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Header */}
          <div style={{ marginBottom: '8px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 800,
              color: '#0F172A',
              lineHeight: '1.25',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              <span>Welcome to</span>
              <span style={{ color: '#101935' }}>Home2School</span>
              <span style={{ color: '#F36621', fontSize: '20px' }}>🧡</span>
            </h1>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#64748B',
            fontWeight: 400,
            marginBottom: '28px',
            lineHeight: '1.4'
          }}>
            Sign in or create your account using your mobile number.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phone Input with Country Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '52px',
              backgroundColor: '#F8FAFC',
              border: '1.5px solid #E2E8F0',
              borderRadius: '12px',
              padding: '0 14px',
              gap: '10px'
            }}>
              {/* Country Code Flag + Dropdown */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                paddingRight: '10px',
                borderRight: '1.5px solid #E2E8F0',
                fontSize: '15px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '18px' }}>🇨🇦</span>
                <span>+1</span>
                <ChevronDown size={16} color="#64748B" />
              </div>

              {/* Number Input */}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Enter mobile number"
                style={{
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  height: '100%',
                  outline: 'none',
                  fontFamily: 'var(--font-family)',
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#0F172A'
                }}
              />
            </div>

            {/* Primary Action Button (48px height, 18px extra bold) */}
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '4px' }}
            >
              Continue
            </button>

            {/* Info hint */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginTop: '4px'
            }}>
              <Info size={16} color="#0284C7" strokeWidth={2.2} />
              <span style={{
                fontSize: '12px',
                color: '#64748B',
                fontWeight: 500
              }}>
                We'll send a one-time code to verify your number.
              </span>
            </div>
          </form>
        </div>

        {/* Privacy Assurance Box matching Figma bottom card */}
        <div style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          marginTop: '28px'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: '#EFF6FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            marginTop: '2px'
          }}>
            <ShieldCheck size={18} color="#0284C7" strokeWidth={2.2} />
          </div>
          <div>
            <h4 style={{
              fontSize: '13.5px',
              fontWeight: 700,
              color: '#0F172A',
              marginBottom: '2px'
            }}>
              Your privacy is our priority
            </h4>
            <p style={{
              fontSize: '12px',
              color: '#64748B',
              lineHeight: '1.35'
            }}>
              Your number is secure and will never be shared.
            </p>
          </div>
        </div>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
