import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { Info, ShieldCheck, ChevronDown, Users, Car, Footprints, Check } from 'lucide-react';

export default function AuthWelcomeScreen({ onContinue }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedRole, setSelectedRole] = useState('parent');

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue(phoneNumber || '(416) 555-0192', selectedRole);
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
        height: '260px',
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
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--color-title)',
              lineHeight: '1.25',
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px'
            }}>
              <span>Welcome to</span>
              <span style={{ color: '#1B2B68' }}>Home2School</span>
              <span style={{ color: '#F2600C', fontSize: '20px' }}>🧡</span>
            </h1>
          </div>

          <p style={{
            fontSize: '13px',
            color: 'var(--color-body)',
            fontWeight: 400,
            marginBottom: '16px',
            lineHeight: '1.4'
          }}>
            Select your account role and sign in or create an account.
          </p>

          {/* Role Selection 3-Tile Grid */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>I want to join as</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#1B2B68', background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '2px 8px', borderRadius: '99px' }}>3 Roles</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {/* Parent */}
              <div 
                onClick={() => setSelectedRole('parent')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  background: selectedRole === 'parent' ? '#1B2B68' : '#FFFFFF',
                  border: `1.5px solid ${selectedRole === 'parent' ? '#1B2B68' : '#E2E8F0'}`,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'parent' ? '0 6px 16px rgba(27, 43, 104, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '76px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: selectedRole === 'parent' ? 'rgba(255,255,255,0.2)' : '#EEF2FF',
                  color: selectedRole === 'parent' ? '#FFFFFF' : '#4F46E5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <Users size={16} />
                </div>
                <strong style={{ fontSize: '12px', color: selectedRole === 'parent' ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>Parent</strong>
                <span style={{ fontSize: '9px', fontWeight: 600, color: selectedRole === 'parent' ? '#93C5FD' : '#64748B', marginTop: '1px' }}>Book Rides</span>
              </div>

              {/* Driver */}
              <div 
                onClick={() => setSelectedRole('driver')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  background: selectedRole === 'driver' ? '#1B2B68' : '#FFFFFF',
                  border: `1.5px solid ${selectedRole === 'driver' ? '#1B2B68' : '#E2E8F0'}`,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'driver' ? '0 6px 16px rgba(27, 43, 104, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '76px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: selectedRole === 'driver' ? 'rgba(255,255,255,0.2)' : '#EFF6FF',
                  color: selectedRole === 'driver' ? '#FFFFFF' : '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <Car size={16} />
                </div>
                <strong style={{ fontSize: '12px', color: selectedRole === 'driver' ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>Driver</strong>
                <span style={{ fontSize: '9px', fontWeight: 600, color: selectedRole === 'driver' ? '#93C5FD' : '#64748B', marginTop: '1px' }}>Drive &amp; Earn</span>
              </div>

              {/* WalkShare */}
              <div 
                onClick={() => setSelectedRole('walkshare')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px 4px',
                  background: selectedRole === 'walkshare' ? '#1B2B68' : '#FFFFFF',
                  border: `1.5px solid ${selectedRole === 'walkshare' ? '#1B2B68' : '#E2E8F0'}`,
                  borderRadius: '14px',
                  cursor: 'pointer',
                  boxShadow: selectedRole === 'walkshare' ? '0 6px 16px rgba(27, 43, 104, 0.22)' : 'none',
                  transition: 'all 0.2s ease',
                  minHeight: '76px',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9px',
                  background: selectedRole === 'walkshare' ? 'rgba(255,255,255,0.2)' : '#ECFDF5',
                  color: selectedRole === 'walkshare' ? '#FFFFFF' : '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '4px'
                }}>
                  <Footprints size={16} />
                </div>
                <strong style={{ fontSize: '12px', color: selectedRole === 'walkshare' ? '#FFFFFF' : '#0F172A', lineHeight: 1.2 }}>WalkShare</strong>
                <span style={{ fontSize: '9px', fontWeight: 600, color: selectedRole === 'walkshare' ? '#93C5FD' : '#64748B', marginTop: '1px' }}>Walk Escort</span>
              </div>
            </div>

            {/* Dynamic Role Summary Pill */}
            <div style={{
              marginTop: '8px',
              padding: '7px 10px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              fontSize: '11px',
              color: '#334155',
              lineHeight: '1.35'
            }}>
              <ShieldCheck size={14} color="#10B981" style={{ flexShrink: 0 }} />
              <span>
                {selectedRole === 'driver' && 'Partner KYC — Driver licence, vehicle inspection & safety check.'}
                {selectedRole === 'walkshare' && 'Escort KYC — Residency proofs, CPR & chaperone verification.'}
                {selectedRole === 'parent' && 'No upfront docs needed — add children & book instantly.'}
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Phone Input with Country Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              height: '52px',
              backgroundColor: 'var(--color-fade)',
              border: '1.5px solid var(--color-stroke)',
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
                borderRight: '1.5px solid var(--color-stroke)',
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--color-title)',
                cursor: 'pointer'
              }}>
                <span style={{ fontSize: '18px' }}>🇨🇦</span>
                <span>+1</span>
                <ChevronDown size={16} color="var(--color-body)" />
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
                  color: 'var(--color-title)'
                }}
              />
            </div>

            {/* Primary Action Button (48px height, 18px extra bold) */}
            <button
              type="submit"
              className="btn-primary"
              style={{ marginTop: '4px' }}
            >
              {selectedRole === 'driver' ? 'Continue as Driver' : selectedRole === 'walkshare' ? 'Continue as WalkShare' : 'Continue as Parent'}
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
                color: 'var(--color-body)',
                fontWeight: 500
              }}>
                We'll send a one-time code to verify your number.
              </span>
            </div>
          </form>
        </div>

        {/* Privacy Assurance Box matching Figma bottom card */}
        <div style={{
          backgroundColor: 'var(--color-fade)',
          border: '1px solid var(--color-stroke)',
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
              color: 'var(--color-title)',
              marginBottom: '2px'
            }}>
              Your privacy is our priority
            </h4>
            <p style={{
              fontSize: '12px',
              color: 'var(--color-body)',
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
