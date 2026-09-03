import React, { useState, useEffect, useRef } from 'react';
import StatusBar from '../components/StatusBar';
import { ChevronLeft } from 'lucide-react';

export default function AuthOtpScreen({ phoneNumber = "+1 (416) *******2", onVerify, onBack }) {
  const [otp, setOtp] = useState(['4', '8', '6', '']);
  const [countdown, setCountdown] = useState(25);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const timer = countdown > 0 && setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-advance to next input
    if (value && index < 3) {
      inputRefs[index + 1].current.focus();
    }

    // Auto-submit if all 4 are filled
    if (index === 3 && value) {
      const code = newOtp.join('');
      if (code.length === 4) {
        setTimeout(() => onVerify(code), 300);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleResend = () => {
    if (countdown === 0) {
      setCountdown(30);
    }
  };

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

      {/* Top App Bar with Back Button */}
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
          <ChevronLeft size={28} color="var(--color-title)" strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Content */}
      <div style={{
        padding: '24px var(--screen-padding-h) 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        flex: 1
      }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: 800,
          color: 'var(--color-title)',
          marginBottom: '8px'
        }}>
          Verify Your Number
        </h1>

        <p style={{
          fontSize: '14px',
          color: 'var(--color-body)',
          marginBottom: '6px'
        }}>
          Enter the 4-digit code sent to
        </p>

        <p style={{
          fontSize: '15px',
          fontWeight: 700,
          color: '#1B2B68',
          marginBottom: '36px'
        }}>
          +1 (416) *******2
        </p>

        {/* 4-digit OTP Boxes */}
        <div style={{
          display: 'flex',
          gap: '14px',
          justifyContent: 'center',
          marginBottom: '32px'
        }}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={inputRefs[index]}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              style={{
                width: '64px',
                height: '68px',
                borderRadius: '14px',
                border: digit ? '2px solid #1B2B68' : '1.5px solid var(--color-stroke)',
                backgroundColor: digit ? '#FFFFFF' : 'var(--color-fade)',
                textAlign: 'center',
                fontSize: '26px',
                fontWeight: 800,
                color: 'var(--color-title)',
                outline: 'none',
                fontFamily: 'var(--font-family)',
                transition: 'all 0.2s ease',
                boxShadow: digit ? '0 4px 12px rgba(16, 25, 53, 0.08)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Resend countdown */}
        <div style={{
          fontSize: '13.5px',
          color: 'var(--color-body)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '4px'
        }}>
          <span>Didn't receive code?</span>
          {countdown > 0 ? (
            <span style={{ fontWeight: 600, color: 'var(--color-title)' }}>
              Resend code in <strong style={{ color: '#1B2B68' }}>00:{countdown < 10 ? `0${countdown}` : countdown}</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              style={{
                background: 'none',
                border: 'none',
                color: '#F2600C',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Resend code now
            </button>
          )}
        </div>

        {/* Continue Button */}
        <div style={{ width: '100%', marginTop: 'auto', paddingTop: '24px' }}>
          <button
            className="btn-primary"
            onClick={() => onVerify(otp.join(''))}
          >
            Continue
          </button>
        </div>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
