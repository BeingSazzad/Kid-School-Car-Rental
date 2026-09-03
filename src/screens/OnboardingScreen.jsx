import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    image: '/assets/onboarding1.jpg',
    title: 'Verified & Trusted',
    description: 'All providers are background verified and rated by parents like you.'
  },
  {
    id: 2,
    image: '/assets/onboarding2.jpg',
    title: 'Real-time Tracking',
    description: "Track your child's trip in real-time and get instant updates."
  },
  {
    id: 3,
    image: '/assets/onboarding3.jpg',
    title: 'Stay Connected',
    description: 'Communicate with providers and get updates at every step of the journey.'
  }
];

export default function OnboardingScreen({ onFinish, onSkip }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < SLIDES.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onFinish();
    }
  };

  const slide = SLIDES[currentSlide];

  return (
    <div style={{
      width: '100%',
      height: '100%',
      position: 'relative',
      backgroundColor: '#0B1226',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      overflow: 'hidden'
    }}>
      <StatusBar light={true} />

      {/* Background Image with smooth transition */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '75%',
        backgroundImage: `url(${slide.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        transition: 'background-image 0.4s ease-in-out',
        zIndex: 1
      }}>
        {/* Top subtle vignette */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)'
        }} />
        {/* Bottom smooth dark gradient fade into content */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '60%',
          background: 'linear-gradient(to top, #0B1226 0%, rgba(11, 18, 38, 0.9) 40%, transparent 100%)'
        }} />
      </div>

      {/* Content Sheet Section */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        marginTop: 'auto',
        padding: '0 var(--screen-padding-h) 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}>
        {/* Title */}
        <h2 style={{
          color: '#FFFFFF',
          fontSize: '26px',
          fontWeight: 800,
          lineHeight: '1.25',
          marginBottom: '12px',
          letterSpacing: '-0.3px'
        }}>
          {slide.title}
        </h2>

        {/* Description */}
        <p style={{
          color: '#CBD5E1',
          fontSize: '15px',
          fontWeight: 400,
          lineHeight: '1.45',
          maxWidth: '340px',
          marginBottom: '36px'
        }}>
          {slide.description}
        </p>

        {/* Bottom Navigation Controls: Skip, Pagination Dots, Orange Arrow */}
        <div style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 4px'
        }}>
          {/* Skip button */}
          <button
            onClick={onSkip}
            style={{
              background: 'none',
              border: 'none',
              color: '#FFFFFF',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'opacity 0.2s',
              minWidth: '60px',
              textAlign: 'left'
            }}
          >
            Skip
          </button>

          {/* Dots Indicator */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {SLIDES.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                style={{
                  height: '8px',
                  width: idx === currentSlide ? '24px' : '8px',
                  borderRadius: '4px',
                  backgroundColor: idx === currentSlide ? '#FFFFFF' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          {/* Next circle button */}
          <button
            onClick={handleNext}
            className="btn-circle-orange"
            style={{ minWidth: '52px' }}
            aria-label="Next slide"
          >
            <ArrowRight size={22} strokeWidth={2.6} />
          </button>
        </div>
      </div>

      <div className="ios-home-indicator light" />
    </div>
  );
}
