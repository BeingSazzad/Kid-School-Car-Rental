import React from 'react';
import { Wifi, Battery } from 'lucide-react';

export default function StatusBar({ light = false, time = "9:41" }) {
  return (
    <div className={`ios-status-bar ${light ? 'light-text' : 'dark-text'}`}>
      <span className="status-time">{time}</span>
      <div className="status-icons">
        {/* Cellular signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0.5" y="8.5" width="2.5" height="3" rx="0.8" />
          <rect x="4.5" y="6" width="2.5" height="5.5" rx="0.8" />
          <rect x="8.5" y="3.5" width="2.5" height="8" rx="0.8" />
          <rect x="12.5" y="1" width="2.5" height="10.5" rx="0.8" />
        </svg>
        <Wifi size={15} strokeWidth={2.4} />
        <Battery size={20} strokeWidth={2.2} />
      </div>
    </div>
  );
}
