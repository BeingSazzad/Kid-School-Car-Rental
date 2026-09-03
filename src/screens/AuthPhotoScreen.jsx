import React, { useState, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import { ChevronLeft, Camera, User } from 'lucide-react';

export default function AuthPhotoScreen({ onContinue, onSkip, onBack }) {
  const [photoUrl, setPhotoUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoUrl(url);
    }
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

      {/* Top App Bar */}
      <div style={{
        padding: '8px var(--screen-padding-h)',
        display: 'flex',
        alignItems: 'center'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            marginLeft: '-8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Back"
        >
          <ChevronLeft size={28} color="#0F172A" strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '24px var(--screen-padding-h) 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          <h1 style={{
            fontSize: '26px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '8px'
          }}>
            Add Your Photo
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#64748B',
            maxWidth: '300px',
            margin: '0 auto 48px'
          }}>
            Add a profile photo to personalize your account
          </p>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Avatar Upload Container matching Figma with dashed ring */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: 'relative',
              width: '160px',
              height: '160px',
              margin: '0 auto 20px',
              cursor: 'pointer'
            }}
          >
            {/* Outer dashed circular ring */}
            <div style={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '2px dashed #CBD5E1',
              pointerEvents: 'none'
            }} />

            {/* Inner avatar circular container */}
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              backgroundColor: '#E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              transition: 'transform 0.2s ease'
            }}>
              {photoUrl ? (
                <img 
                  src={photoUrl} 
                  alt="Profile Preview" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              ) : (
                <User size={72} color="#1E293B" strokeWidth={1.5} />
              )}
            </div>

            {/* Camera badge button */}
            <div style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: '#1B2B68',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              border: '2.5px solid #FFFFFF'
            }}>
              <Camera size={18} strokeWidth={2.2} />
            </div>
          </div>

          <p style={{
            fontSize: '13px',
            color: '#94A3B8',
            fontWeight: 500
          }}>
            You can change this later
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <button
            className="btn-primary"
            onClick={() => onContinue(photoUrl)}
          >
            Continue
          </button>
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '15px',
              fontWeight: 600,
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px'
            }}
          >
            Skip for now
          </button>
        </div>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
