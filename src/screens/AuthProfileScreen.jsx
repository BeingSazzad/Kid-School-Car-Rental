import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { ChevronLeft, User, Mail, ChevronDown } from 'lucide-react';

export default function AuthProfileScreen({ onContinue, onBack }) {
  const [fullName, setFullName] = useState('Sadia Khan');
  const [email, setEmail] = useState('sadia.khan@example.com');
  const [relationship, setRelationship] = useState('Mother');

  const handleSubmit = (e) => {
    e.preventDefault();
    onContinue({ fullName, email, relationship });
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
          <ChevronLeft size={28} color="var(--color-title)" strokeWidth={2.4} />
        </button>
      </div>

      {/* Main Content Area */}
      <div style={{
        padding: '16px var(--screen-padding-h) 32px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        justifyContent: 'space-between'
      }}>
        <div>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{
              fontSize: '26px',
              fontWeight: 800,
              color: 'var(--color-title)',
              marginBottom: '8px',
              letterSpacing: '-0.3px'
            }}>
              Let's get to know you
            </h1>
            <p style={{
              fontSize: '14px',
              color: 'var(--color-body)',
              fontWeight: 400
            }}>
              Please provide your basic information
            </p>
          </div>

          {/* Form */}
          <form id="profile-form" onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Full Name */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-title)',
                marginBottom: '8px'
              }}>
                Full Name
              </label>
              <div className="input-field-container">
                <User size={18} color="#94A3B8" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input-text"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-title)',
                marginBottom: '8px'
              }}>
                Email Address
              </label>
              <div className="input-field-container">
                <Mail size={18} color="#94A3B8" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-text"
                  required
                />
              </div>
            </div>

            {/* Relationship */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--color-title)',
                marginBottom: '8px'
              }}>
                Relationship
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  style={{
                    width: '100%',
                    height: '50px',
                    backgroundColor: 'var(--color-fade)',
                    border: '1.5px solid var(--color-stroke)',
                    borderRadius: '12px',
                    padding: '0 40px 0 16px',
                    fontFamily: 'var(--font-family)',
                    fontSize: '15px',
                    fontWeight: 500,
                    color: 'var(--color-title)',
                    appearance: 'none',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Grandparent">Grandparent</option>
                </select>
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none'
                }}>
                  <ChevronDown size={18} color="var(--color-body)" />
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Continue Action Button */}
        <div style={{ paddingTop: '24px' }}>
          <button
            type="submit"
            form="profile-form"
            className="btn-primary"
          >
            Continue
          </button>
        </div>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
