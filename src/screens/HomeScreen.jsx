import React, { useState } from 'react';
import StatusBar from '../components/StatusBar';
import { 
  Bell, 
  CalendarPlus, 
  Users, 
  Calendar, 
  ShieldAlert, 
  ChevronRight, 
  RefreshCw,
  Home,
  Clock,
  MessageSquare,
  User
} from 'lucide-react';

export default function HomeScreen({ onNavigateAction }) {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#FFFFFF',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <StatusBar light={false} />

      {/* Scrollable Content Container */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '8px var(--screen-padding-h) 80px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
      }}>
        {/* Profile Header Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* John's Avatar */}
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
              border: '2px solid #FFFFFF',
              flexShrink: 0
            }}>
              <img 
                src="/assets/avatar_john.png" 
                alt="John Avatar" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: 'var(--color-title)',
                lineHeight: '1.2'
              }}>
                Hello, John 👋
              </h2>
              <p style={{
                fontSize: '13px',
                color: 'var(--color-body)',
                fontWeight: 500
              }}>
                Where would you like to go?
              </p>
            </div>
          </div>

          {/* Bell Notification Button */}
          <button 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              border: '1.5px solid var(--color-stroke)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)'
            }}
            aria-label="Notifications"
          >
            <Bell size={20} color="var(--color-title)" strokeWidth={2.2} />
            {/* Notification unread dot */}
            <span style={{
              position: 'absolute',
              top: '9px',
              right: '9px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#F2600C',
              border: '1.5px solid #FFFFFF'
            }} />
          </button>
        </div>

        {/* Hero Promo Card: Safe Ride / Brighter Future */}
        <div style={{
          width: '100%',
          height: '142px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 16px rgba(16, 25, 53, 0.08)',
          border: '1px solid var(--color-stroke)',
          backgroundColor: '#FFFFFF'
        }}>
          {/* Card background vehicle image */}
          <img 
            src="/assets/home_van_banner.jpg" 
            alt="School Transportation Van"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right center'
            }}
          />

          {/* Gradient text protection scrim on left side */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.2) 75%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 18px'
          }}>
            <div style={{ maxWidth: '210px' }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#1B2B68',
                lineHeight: '1.15'
              }}>
                Safe Ride
              </h3>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#F2600C',
                lineHeight: '1.15',
                marginBottom: '6px'
              }}>
                Brighter Future
              </h3>
              <p style={{
                fontSize: '11.5px',
                color: '#475569',
                fontWeight: 500,
                lineHeight: '1.35'
              }}>
                Trusted school transportation for your child's everyday journey
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 800,
            color: 'var(--color-title)',
            marginBottom: '12px'
          }}>
            Quick Actions
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {/* Action 1: New Booking (Featured Dark Navy Card) */}
            <div 
              onClick={() => onNavigateAction && onNavigateAction('New Booking')}
              style={{
                backgroundColor: '#1B2B68',
                borderRadius: '16px',
                padding: '16px 14px',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: 'transform 0.2s',
                boxShadow: '0 4px 14px rgba(16, 25, 53, 0.15)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <CalendarPlus size={22} color="#FFFFFF" />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, marginBottom: '2px' }}>
                New Booking
              </h4>
              <p style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 500 }}>
                Book a school trip
              </p>
            </div>

            {/* Action 2: My Children */}
            <div 
              onClick={() => onNavigateAction && onNavigateAction('My Children')}
              style={{
                backgroundColor: 'var(--color-fade)',
                borderRadius: '16px',
                padding: '16px 14px',
                border: '1.5px solid var(--color-stroke)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                transition: 'transform 0.2s'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px'
              }}>
                <Users size={22} color="#2563EB" />
              </div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-title)', marginBottom: '2px' }}>
                My Children
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-body)', fontWeight: 500 }}>
                Manage profiles
              </p>
            </div>

            {/* Action 3: My Bookings */}
            <div 
              onClick={() => onNavigateAction && onNavigateAction('My Bookings')}
              style={{
                backgroundColor: 'var(--color-fade)',
                borderRadius: '16px',
                padding: '14px',
                border: '1.5px solid var(--color-stroke)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FEE2E2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Calendar size={20} color="#EF4444" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-title)' }}>
                My Bookings
              </h4>
            </div>

            {/* Action 4: Safety & Help */}
            <div 
              onClick={() => onNavigateAction && onNavigateAction('Safety & Help')}
              style={{
                backgroundColor: 'var(--color-fade)',
                borderRadius: '16px',
                padding: '14px',
                border: '1.5px solid var(--color-stroke)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: '#FFF4ED',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <ShieldAlert size={20} color="#F2600C" />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-title)' }}>
                Safety & Help
              </h4>
            </div>
          </div>
        </div>

        {/* Upcoming Trips Section */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: 800,
              color: 'var(--color-title)'
            }}>
              Upcoming Trips
            </h3>
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0284C7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '2px'
            }}>
              <span>See All</span>
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Trip Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid var(--color-stroke)',
            padding: '16px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              {/* Date Box */}
              <div style={{
                backgroundColor: 'var(--color-fade)',
                border: '1px solid var(--color-stroke)',
                borderRadius: '12px',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minWidth: '56px',
                flexShrink: 0
              }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-body)', textTransform: 'uppercase' }}>
                  May
                </span>
                <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-title)', lineHeight: '1.15' }}>
                  22
                </span>
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#94A3B8' }}>
                  Wed
                </span>
              </div>

              {/* Timeline with Drop-off & Pick-up */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                {/* Stop 1: Drop-off */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', position: 'relative' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#10B981',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  {/* Connecting Line */}
                  <div style={{
                    position: 'absolute',
                    top: '14px',
                    left: '3.5px',
                    bottom: '-14px',
                    width: '1.5px',
                    backgroundColor: 'var(--color-stroke)'
                  }} />
                  <div>
                    <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-title)' }}>
                      07:45 AM <span style={{ color: '#94A3B8', fontWeight: 400 }}>• Drop-off</span>
                    </h5>
                    <p style={{ fontSize: '12px', color: 'var(--color-body)', fontWeight: 500 }}>
                      Home <span style={{ color: '#94A3B8' }}>→</span> Dhanmondi Tutorial
                    </p>
                  </div>
                </div>

                {/* Stop 2: Pick-up */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#F2600C',
                    marginTop: '5px',
                    flexShrink: 0
                  }} />
                  <div>
                    <h5 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-title)' }}>
                      01:15 PM <span style={{ color: '#94A3B8', fontWeight: 400 }}>• Pick-up</span>
                    </h5>
                    <p style={{ fontSize: '12px', color: 'var(--color-body)', fontWeight: 500 }}>
                      Dhanmondi Tutorial <span style={{ color: '#94A3B8' }}>→</span> Home
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Meta Row */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '12px',
              borderTop: '1px solid #F1F5F9',
              fontSize: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-body)' }}>
                <RefreshCw size={13} strokeWidth={2} />
                <span>Repeats: Mon, Tue, Wed, Thu, Sun</span>
              </div>
              <span style={{
                padding: '3px 8px',
                backgroundColor: '#EFF6FF',
                color: '#2563EB',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                ⇄ Both-way
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation Bar */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid var(--color-stroke)',
        padding: '8px 16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40
      }}>
        <button 
          onClick={() => setActiveTab('home')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'home' ? '#F2600C' : '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <Home size={22} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'home' ? 700 : 500 }}>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('trips')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'trips' ? '#F2600C' : '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <Clock size={22} strokeWidth={activeTab === 'trips' ? 2.5 : 2} />
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'trips' ? 700 : 500 }}>Trips</span>
        </button>

        <button 
          onClick={() => setActiveTab('messages')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'messages' ? '#F2600C' : '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <MessageSquare size={22} strokeWidth={activeTab === 'messages' ? 2.5 : 2} />
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'messages' ? 700 : 500 }}>Inbox</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
            color: activeTab === 'profile' ? '#F2600C' : '#94A3B8',
            cursor: 'pointer'
          }}
        >
          <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 2} />
          <span style={{ fontSize: '11px', fontWeight: activeTab === 'profile' ? 700 : 500 }}>Profile</span>
        </button>
      </div>

      <div className="ios-home-indicator" />
    </div>
  );
}
