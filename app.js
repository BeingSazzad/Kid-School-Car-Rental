/* ==========================================================
   Home2School Interactive Controller & Navigation Logic
   Senior Product Architecture: Reactive State & Dynamic Sync
   ========================================================== */

let currentScreen = 'home';

const screens = [
  'splash',
  'onboarding1',
  'onboarding2',
  'onboarding3',
  'authWelcome',
  'authOtp',
  'authProfile',
  'authPhoto',
  'authAddChild',
  'authSuccess',
  'home',
  'myChildren',
  'addChild',
  'bookingSelectChildren',
  'bookingTripSetup',
  'bookingSearchProviders',
  'bookingProviderDetails',
  'bookingSummary',
  'bookingRequestSent',
  'bookingConfirmed',
  'bookingDetails',
  'tracking',
  'messages',
  'bookings',
  'profile',
  'rating',
  'notifications',
  'profilePersonalInfo',
  'profileEmergency',
  'profileLocations',
  'profilePayments',
  'faq',
  'legal',
  'about',
  'privacy',
  'report'
];

/* ==========================================================
   Central Application State (Single Source of Truth)
   ========================================================== */
window.appState = {
  user: {
    name: 'Sadia Khan',
    phone: '+1 (416) 555-0192',
    email: 'sadia.khan@example.com',
    role: 'Mother'
  },
  children: [
    { id: 'arman', name: 'Arman Khan', grade: 'Grade 4 (9 yrs)', school: 'Greenfield International School', pickup: 'Home (12 Elm Street)', notes: 'Wears booster seat' },
    { id: 'emma', name: 'Emma Khan', grade: 'Grade 2 (7 yrs)', school: 'Greenfield International School', pickup: 'Home (12 Elm Street)', notes: 'Sits next to brother' },
    { id: 'zara', name: 'Zara Khan', grade: 'Kindergarten (5 yrs)', school: 'Sunshine Pre-school', pickup: 'Home (12 Elm Street)', notes: 'Hand to teacher at gate' }
  ],
  providers: [
    { id: 'tariq', name: 'Tariq Ahmed', vehicle: 'Toyota Sienna (2023)', plate: 'SCH-4091', rating: 4.9, reviewsCount: 128, seats: 4, baseWeekly: 120, photo: '/assets/avatar_john.png', phone: '+1 (416) 555-0182' },
    { id: 'farhana', name: 'Farhana Yasmin', vehicle: 'Honda Odyssey (2024)', plate: 'KID-2810', rating: 5.0, reviewsCount: 94, seats: 5, baseWeekly: 135, photo: '/assets/avatar_john.png', phone: '+1 (416) 555-0183' },
    { id: 'kabir', name: 'Kabir Hossain', vehicle: 'Nissan Rogue (2022)', plate: 'SCH-9102', rating: 4.8, reviewsCount: 62, seats: 2, baseWeekly: 110, photo: '/assets/avatar_john.png', phone: '+1 (416) 555-0184' },
    { id: 'sarah', name: 'Sarah Jenkins (WalkShare)', vehicle: 'Walking School Bus Escort', plate: 'VERIFIED-WALK', rating: 4.9, reviewsCount: 45, seats: 3, baseWeekly: 75, photo: '/assets/avatar_john.png', phone: '+1 (416) 555-0185' }
  ],
  selectedChildIds: ['arman', 'emma'],
  bookingDraft: {
    direction: 'bothway', // 'bothway' | 'oneway'
    frequency: 'recurring', // 'recurring' | 'onetime'
    pickupLocation: 'Home (12 Elm Street)',
    schoolLocation: 'Greenfield International School',
    outboundTime: '07:30 AM',
    returnTime: '01:00 PM',
    selectedDays: ['M', 'T', 'W', 'T', 'F'],
    providerId: 'tariq',
    paymentMethod: 'Visa •••• 4242'
  },
  bookings: [
    {
      id: 'H2S-84920',
      status: 'confirmed', // 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
      childIds: ['arman', 'emma'],
      direction: 'bothway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri • Outbound: 07:30 AM | Return: 01:00 PM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:30 AM',
      returnTime: '01:00 PM',
      providerId: 'tariq',
      amount: 120,
      paymentMethod: 'Visa •••• 4242',
      createdAt: 'May 20, 2026'
    },
    {
      id: 'H2S-73190',
      status: 'pending',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'Thursday, May 23 • 08:15 AM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      paymentMethod: 'Visa •••• 4242',
      createdAt: 'May 21, 2026'
    },
    {
      id: 'H2S-61029',
      status: 'completed',
      childIds: ['arman', 'emma'],
      direction: 'bothway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri (Previous Week)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:30 AM',
      returnTime: '01:00 PM',
      providerId: 'tariq',
      amount: 120,
      paymentMethod: 'Visa •••• 4242',
      createdAt: 'May 14, 2026'
    },
    {
      id: 'H2S-54012',
      status: 'cancelled',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'May 10, 2026',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      paymentMethod: 'Visa •••• 4242',
      createdAt: 'May 08, 2026'
    }
  ],
  activeBookingId: 'H2S-84920',
  homeScenario: 'B', // 'A' | 'B' | 'C'
  trackingStageIndex: 2
};

/* ==========================================================
   Navigation Router
   ========================================================== */
window.navigateTo = function (screenName) {
  if (!screens.includes(screenName)) return;

  currentScreen = screenName;
  if (window.location.hash !== `#${screenName}`) {
    window.location.hash = screenName;
  }

  // Hide all screens, show target screen
  document.querySelectorAll('.screen-view').forEach(el => {
    el.classList.remove('active');
  });

  const targetEl = document.getElementById(`screen-${screenName}`);
  if (targetEl) {
    targetEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  // Dynamic View Renderers
  if (screenName === 'home') {
    renderHome();
  } else if (screenName === 'bookingSummary') {
    renderBookingSummary();
  } else if (screenName === 'bookings') {
    renderBookingsList('upcoming');
  } else if (screenName === 'bookingDetails') {
    renderBookingDetails(window.appState.activeBookingId);
  } else if (screenName === 'bookingConfirmed') {
    renderBookingConfirmation();
  } else if (screenName === 'myChildren') {
    renderMyChildrenList();
  }

  // Update Bottom Tab Bar highlights
  updateBottomTabHighlights(screenName);

  // Screen specific triggers
  if (screenName === 'authSuccess' || screenName === 'bookingConfirmed') {
    triggerCelebrationConfetti();
  } else if (screenName === 'authOtp') {
    focusFirstEmptyOtp();
  }

  // Render official Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

// Bottom Tab active highlight sync
function updateBottomTabHighlights(screenName) {
  const tabMap = {
    home: 0,
    notifications: 0,
    bookings: 1,
    bookingDetails: 1,
    bookingRequestSent: 1,
    bookingConfirmed: 1,
    tracking: 2,
    messages: 3,
    profile: 4,
    myChildren: 4,
    profilePersonalInfo: 4,
    profileEmergency: 4,
    profileLocations: 4,
    profilePayments: 4,
    faq: 4,
    legal: 4,
    about: 4
  };

  const activeIndex = tabMap[screenName];
  if (activeIndex !== undefined) {
    document.querySelectorAll('.bottom-tab-bar').forEach(bar => {
      const tabs = bar.querySelectorAll('.tab-item');
      tabs.forEach((tab, idx) => {
        if (idx === activeIndex) {
          tab.classList.add('active');
        } else {
          tab.classList.remove('active');
        }
      });
    });
  }
}

// Browser back/forward sync
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (hash && screens.includes(hash) && hash !== currentScreen) {
    window.navigateTo(hash);
  }
});

// Initialization
window.addEventListener('DOMContentLoaded', () => {
  renderHome();
  const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
  const initial = (hash && screens.includes(hash)) ? hash : 'home';
  window.navigateTo(initial);

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

/* ==========================================================
   Home Screen: State-Driven Logic (Scenario A / B / C)
   ========================================================== */
window.setHomeState = function (state) {
  window.appState.homeScenario = state;
  renderHome();
};

function renderHome() {
  const state = window.appState.homeScenario;
  const viewA = document.getElementById('homeStateAView');
  const viewB = document.getElementById('homeStateBView');
  const viewC = document.getElementById('homeStateCView');

  const btnA = document.getElementById('btnStateA');
  const btnB = document.getElementById('btnStateB');
  const btnC = document.getElementById('btnStateC');

  [btnA, btnB, btnC].forEach(b => b?.classList.remove('active'));

  if (state === 'A') {
    if (viewA) viewA.style.display = 'flex';
    if (viewB) viewB.style.display = 'none';
    if (viewC) viewC.style.display = 'none';
    btnA?.classList.add('active');
  } else if (state === 'B') {
    if (viewA) viewA.style.display = 'none';
    if (viewB) viewB.style.display = 'flex';
    if (viewC) viewC.style.display = 'none';
    btnB?.classList.add('active');

    // Populate upcoming ride card from active booking
    const activeBooking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
    if (activeBooking) {
      const provider = window.appState.providers.find(p => p.id === activeBooking.providerId) || window.appState.providers[0];
      const childNames = activeBooking.childIds.map(cid => {
        const c = window.appState.children.find(ch => ch.id === cid);
        return c ? c.name.split(' ')[0] : cid;
      }).join(' & ');

      const cardMeta = document.getElementById('homeNextTripMeta');
      if (cardMeta) {
        cardMeta.textContent = `${childNames} • Driver ${provider.name.split(' ')[0]} A.`;
      }
    }
  } else if (state === 'C') {
    if (viewA) viewA.style.display = 'none';
    if (viewB) viewB.style.display = 'none';
    if (viewC) viewC.style.display = 'flex';
    btnC?.classList.add('active');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

window.toggleNotificationAlert = function () {
  alert('🔔 Home2School Updates:\n• Tariq Ahmed scheduled for 07:30 AM tomorrow\n• Weekly recurring schedule active for Arman & Emma');
};

/* ==========================================================
   Booking Wizard: Step 1 Child Multi-Selection
   ========================================================== */
window.toggleChildSelection = function (childId) {
  const list = window.appState.selectedChildIds;
  const idx = list.indexOf(childId);
  const card = document.getElementById(`childCard-${childId}`);

  if (idx > -1) {
    if (list.length === 1) {
      alert('Please select at least one child for the trip.');
      return;
    }
    list.splice(idx, 1);
    card?.classList.remove('selected');
  } else {
    list.push(childId);
    card?.classList.add('selected');
  }

  const badgeText = document.getElementById('passengerBadgeText');
  if (badgeText) {
    badgeText.textContent = `${list.length} Selected`;
  } else {
    const badge = document.getElementById('passengerBadge');
    if (badge) badge.textContent = `${list.length} Selected`;
  }
};

/* ==========================================================
   Booking Wizard: Step 2 Trip Direction & Frequency
   ========================================================== */
window.setTripDirection = function (dir) {
  window.appState.bookingDraft.direction = dir;
  const btnOne = document.getElementById('btnDirOneWay');
  const btnBoth = document.getElementById('btnDirBothWay');
  const returnCard = document.getElementById('returnLegCard');

  if (dir === 'oneway') {
    btnOne?.classList.add('active');
    btnBoth?.classList.remove('active');
    if (returnCard) returnCard.style.display = 'none';
  } else {
    btnOne?.classList.remove('active');
    btnBoth?.classList.add('active');
    if (returnCard) returnCard.style.display = 'flex';
  }
};

window.setBookingFrequency = function (freq) {
  window.appState.bookingDraft.frequency = freq;
  const btnOneTime = document.getElementById('btnFreqOneTime');
  const btnRec = document.getElementById('btnFreqRecurring');
  const weekdaysBox = document.getElementById('weekdaySelectorBox');

  if (freq === 'onetime') {
    btnOneTime?.classList.add('active');
    btnRec?.classList.remove('active');
    if (weekdaysBox) weekdaysBox.style.display = 'none';
  } else {
    btnOneTime?.classList.remove('active');
    btnRec?.classList.add('active');
    if (weekdaysBox) weekdaysBox.style.display = 'flex';
  }
};

/* ==========================================================
   Booking Wizard: Step 3 Provider Selection
   ========================================================== */
window.selectProviderAndReview = function (name) {
  const provider = window.appState.providers.find(p => p.name.includes(name) || p.id === name) || window.appState.providers[0];
  window.appState.bookingDraft.providerId = provider.id;

  const nameEl = document.getElementById('detailsProviderName');
  const vehicleEl = document.getElementById('detailsProviderVehicle');

  if (nameEl) nameEl.textContent = provider.name;
  if (vehicleEl) vehicleEl.textContent = `${provider.vehicle} (Clean & Certified)`;

  window.navigateTo('bookingProviderDetails');
};

/* ==========================================================
   Booking Wizard: Step 4 Dynamic Summary & Calculations
   ========================================================== */
function calculateDraftPrice() {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const count = window.appState.selectedChildIds.length;

  let baseRate = provider.baseWeekly;
  if (draft.direction === 'oneway') {
    baseRate = Math.round(baseRate * 0.6);
  }

  // 2nd and subsequent children get 20% discount
  let discount = 0;
  if (count > 1) {
    discount = Math.round(baseRate * 0.2 * (count - 1));
  }

  const insurance = 8;
  const total = (baseRate * count) - discount + insurance;

  return {
    baseRate: baseRate * count,
    discount,
    insurance,
    total
  };
}

function renderBookingSummary() {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const children = window.appState.selectedChildIds.map(id => {
    const c = window.appState.children.find(ch => ch.id === id);
    return c ? c.name : id;
  });

  const childrenEl = document.getElementById('summaryChildrenText');
  const dirEl = document.getElementById('summaryDirectionText');
  const outboundEl = document.getElementById('summaryOutboundText');
  const returnEl = document.getElementById('summaryReturnText');
  const freqEl = document.getElementById('summaryFreqText');
  const providerEl = document.getElementById('summaryProviderText');

  if (childrenEl) childrenEl.textContent = `${children.join(' & ')} (${children.length})`;
  if (dirEl) dirEl.textContent = draft.direction === 'bothway' ? '⇄ Both-way (Round Trip)' : '→ One-way';
  if (outboundEl) outboundEl.textContent = `${draft.pickupLocation.split(' ')[0]} → School (${draft.outboundTime})`;
  if (returnEl) {
    if (draft.direction === 'bothway') {
      returnEl.textContent = `School → ${draft.pickupLocation.split(' ')[0]} (${draft.returnTime})`;
      returnEl.parentElement.style.display = 'flex';
    } else {
      returnEl.parentElement.style.display = 'none';
    }
  }
  if (freqEl) freqEl.textContent = draft.frequency === 'recurring' ? 'Recurring (Mon – Fri)' : 'One-time Trip';
  if (providerEl) providerEl.textContent = `${provider.name} (${provider.vehicle.split(' ')[0]} ${provider.vehicle.split(' ')[1] || ''})`;

  // Price calculations
  const price = calculateDraftPrice();
  const baseEl = document.getElementById('summaryBasePriceText');
  const discEl = document.getElementById('summaryDiscountPriceText');
  const totalEl = document.getElementById('summaryTotalPriceText');

  if (baseEl) baseEl.textContent = `$${price.baseRate}.00`;
  if (discEl) discEl.textContent = price.discount > 0 ? `-$${price.discount}.00` : '$0.00';
  if (totalEl) totalEl.textContent = `$${price.total}.00 / week`;
}

/* ==========================================================
   Booking Wizard: Step 5 Submit & Simulate Acceptance
   ========================================================== */
window.submitBookingRequest = function () {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const price = calculateDraftPrice();

  const newBooking = {
    id: `H2S-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'pending',
    childIds: [...window.appState.selectedChildIds],
    direction: draft.direction,
    frequency: draft.frequency,
    scheduleText: draft.direction === 'bothway'
      ? `Mon–Fri • Outbound: ${draft.outboundTime} | Return: ${draft.returnTime}`
      : `Outbound: ${draft.outboundTime}`,
    pickupLocation: draft.pickupLocation,
    schoolLocation: draft.schoolLocation,
    outboundTime: draft.outboundTime,
    returnTime: draft.returnTime,
    providerId: provider.id,
    amount: price.total,
    paymentMethod: draft.paymentMethod,
    createdAt: 'Just now'
  };

  window.appState.bookings.unshift(newBooking);
  window.appState.activeBookingId = newBooking.id;

  // Update Request Sent Screen text
  const reqDesc = document.getElementById('requestSentDesc');
  if (reqDesc) {
    reqDesc.textContent = `${provider.name} has received your school ride request for reference ${newBooking.id}.`;
  }

  window.navigateTo('bookingRequestSent');
};

window.simulateProviderAcceptance = function () {
  const active = window.appState.bookings.find(b => b.id === window.appState.activeBookingId);
  if (active) {
    active.status = 'confirmed';
  }
  window.appState.homeScenario = 'B';

  triggerCelebrationConfetti();
  setTimeout(() => {
    window.navigateTo('bookingConfirmed');
  }, 400);
};

function renderBookingConfirmation() {
  const active = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
  const provider = window.appState.providers.find(p => p.id === active.providerId) || window.appState.providers[0];
  const children = active.childIds.map(id => {
    const c = window.appState.children.find(ch => ch.id === id);
    return c ? c.name : id;
  });

  const refEl = document.getElementById('confirmedRefText');
  const providerEl = document.getElementById('confirmedProviderText');
  const childrenEl = document.getElementById('confirmedChildrenText');
  const totalEl = document.getElementById('confirmedTotalText');

  if (refEl) refEl.textContent = active.id;
  if (providerEl) providerEl.textContent = `${provider.name} (${provider.vehicle})`;
  if (childrenEl) childrenEl.textContent = `${children.join(' & ')} (${children.length})`;
  if (totalEl) totalEl.textContent = `$${active.amount}.00 / week`;
}

/* ==========================================================
   Dedicated Booking Details Screen (#bookingDetails)
   ========================================================== */
window.openBookingDetails = function (bookingId) {
  window.appState.activeBookingId = bookingId;
  window.navigateTo('bookingDetails');
};

function renderBookingDetails(bookingId) {
  const booking = window.appState.bookings.find(b => b.id === bookingId) || window.appState.bookings[0];
  if (!booking) return;

  const provider = window.appState.providers.find(p => p.id === booking.providerId) || window.appState.providers[0];
  const children = booking.childIds.map(id => window.appState.children.find(ch => ch.id === id)).filter(Boolean);

  // Reference & status
  const refEl = document.getElementById('detailRefId');
  const statusEl = document.getElementById('detailStatusBadge');
  const titleEl = document.getElementById('detailHeaderTitle');

  if (refEl) refEl.textContent = `REF: ${booking.id}`;
  if (titleEl) titleEl.textContent = children.map(c => c.name).join(' & ');
  if (statusEl) {
    statusEl.className = `status-chip ${booking.status}`;
    statusEl.textContent = booking.status.toUpperCase();
  }

  // Children passengers
  const passWrap = document.getElementById('detailPassengersWrap');
  if (passWrap) {
    passWrap.innerHTML = children.map((c, idx) => {
      const initials = c.name.split(' ').map(n => n[0]).join('');
      const colorClass = c.id === 'arman' ? 'navy' : c.id === 'emma' ? 'blue' : 'orange';
      return `
        <div style="display:flex; align-items:flex-start; justify-content:space-between; padding: 10px 0; ${idx < children.length - 1 ? 'border-bottom: 1px solid var(--color-stroke);' : ''}">
          <div style="display:flex; align-items:flex-start; gap:12px;">
            <div class="child-monogram-avatar ${colorClass}" style="width:38px; height:38px; font-size:13px; margin-top: 2px;">${initials}</div>
            <div>
              <div style="font-size:14px;font-weight:800;color:var(--color-title);">${c.name}</div>
              <div style="font-size:12px;color:var(--color-body); margin-top: 2px;">${c.grade} • ${c.school}</div>
              ${c.notes ? `
                <div style="display:inline-flex; align-items:center; gap:5px; font-size:11px; font-weight:600; color:var(--color-primary); background:var(--color-fade); padding:3px 9px; border-radius:6px; margin-top:6px; border:1px solid rgba(27,43,104,0.08); white-space:nowrap;">
                  <i data-lucide="shield" style="width:12px;height:12px;color:var(--color-secondary);"></i>
                  <span>${c.notes}</span>
                </div>` : ''}
            </div>
          </div>
          <span style="font-size:11px; font-weight:700; color:#15803D; background:#F0FDF4; padding:3px 9px; border-radius:99px; border:1px solid #DCFCE7; white-space:nowrap; margin-top: 2px;">Confirmed</span>
        </div>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  // Route breakdown
  const outTime = document.getElementById('detailOutboundTime');
  const retTime = document.getElementById('detailReturnTime');
  const retBox = document.getElementById('detailReturnLegBox');

  if (outTime) outTime.textContent = booking.outboundTime;
  if (retTime) retTime.textContent = booking.returnTime || 'N/A';
  if (retBox) {
    retBox.style.display = booking.direction === 'bothway' ? 'flex' : 'none';
  }

  // Provider info
  const pName = document.getElementById('detailProviderName');
  const pVeh = document.getElementById('detailProviderVehicle');
  const pRating = document.getElementById('detailProviderRating');

  if (pName) pName.textContent = provider.name;
  if (pVeh) pVeh.textContent = `${provider.vehicle} • ${provider.plate}`;
  if (pRating) pRating.textContent = `★ ${provider.rating} (${provider.reviewsCount} reviews)`;

  // Payment
  const pAmount = document.getElementById('detailTotalAmount');
  const pMethod = document.getElementById('detailPayMethod');
  if (pAmount) pAmount.textContent = `$${booking.amount}.00 / wk`;
  if (pMethod) pMethod.textContent = booking.paymentMethod;

  // Contextual Actions based on status
  const actionsWrap = document.getElementById('detailContextualActions');
  if (actionsWrap) {
    if (booking.status === 'confirmed' || booking.status === 'pending') {
      actionsWrap.innerHTML = `
        <button class="btn-primary" onclick="navigateTo('tracking')">Track Live Ride</button>
        <button class="btn-secondary-surface" onclick="navigateTo('messages')">Message Driver</button>
        <button class="btn-danger-surface" onclick="cancelBooking('${booking.id}')">Cancel This Booking</button>
      `;
    } else if (booking.status === 'completed') {
      actionsWrap.innerHTML = `
        <button class="btn-primary" onclick="navigateTo('rating')">Rate Tariq Ahmed ⭐</button>
        <button class="btn-secondary-surface" onclick="alert('Receipt emailed to ${window.appState.user.email}')">Download Official Receipt</button>
        <button class="btn-secondary-surface" onclick="navigateTo('bookingSelectChildren')">Book Again on This Route</button>
      `;
    } else if (booking.status === 'cancelled') {
      actionsWrap.innerHTML = `
        <div style="font-size:12.5px;color:#DC2626;background:#FEE2E2;padding:10px;border-radius:var(--radius-md);text-align:center;font-weight:700;">
          This booking was cancelled.
        </div>
        <button class="btn-primary" onclick="navigateTo('bookingSelectChildren')">Re-book This Route</button>
      `;
    }
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

window.cancelBooking = function (bookingId) {
  if (confirm('Are you sure you want to cancel this school ride booking?')) {
    const booking = window.appState.bookings.find(b => b.id === bookingId);
    if (booking) {
      booking.status = 'cancelled';
    }
    renderBookingDetails(bookingId);
    renderHome();
    alert('Booking has been cancelled.');
  }
};

/* ==========================================================
   Bookings Screen: Filter Tabs & Concise Cards
   ========================================================== */
window.switchBookingTab = function (tab) {
  renderBookingsList(tab);
};

function renderBookingsList(tab) {
  const btnU = document.getElementById('tabUpcoming');
  const btnP = document.getElementById('tabPast');
  const btnC = document.getElementById('tabCancelled');
  const wrap = document.getElementById('bookingsListWrap');

  [btnU, btnP, btnC].forEach(b => b?.classList.remove('active'));

  let filtered = [];
  if (tab === 'upcoming') {
    btnU?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'confirmed' || b.status === 'pending');
  } else if (tab === 'past') {
    btnP?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'completed');
  } else if (tab === 'cancelled') {
    btnC?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'cancelled');
  }

  if (!wrap) return;

  if (filtered.length === 0) {
    wrap.innerHTML = `
      <div style="text-align:center; padding: 40px 20px; color:var(--color-body);">
        <i data-lucide="calendar-x" style="width:36px;height:36px;margin-bottom:8px;color:#94A3B8;"></i>
        <div style="font-size:15px;font-weight:700;color:var(--color-title);">No ${tab} bookings</div>
        <p style="font-size:13px;margin-top:4px;">When you arrange rides, they will appear here.</p>
      </div>
    `;
  } else {
    wrap.innerHTML = filtered.map(b => {
      const provider = window.appState.providers.find(p => p.id === b.providerId) || window.appState.providers[0];
      const children = b.childIds.map(id => {
        const c = window.appState.children.find(ch => ch.id === id);
        return c ? c.name : id;
      });

      return `
        <div class="booking-item-card" onclick="openBookingDetails('${b.id}')" style="cursor:pointer;">
          <div class="booking-card-top-row">
            <span class="status-chip ${b.status}">${b.status.toUpperCase()}</span>
            <span style="font-size: 14px; font-weight: 800; color: var(--color-primary);">$${b.amount}/wk</span>
          </div>

          <div>
            <div style="font-size: 16px; font-weight: 800; color: var(--color-title);">${children.join(' & ')}</div>
            <div style="font-size: 13px; color: var(--color-body); margin-top: 2px;">${b.pickupLocation.split(' ')[0]} ⇄ ${b.schoolLocation}</div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #1E293B; font-weight: 700; margin-top: 6px;">
              <i data-lucide="calendar" style="width: 14px; height: 14px; color: var(--color-primary); flex-shrink: 0;"></i>
              <span>${b.scheduleText}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px; font-size: 12px; color: #64748B; margin-top: 3px;">
              <i data-lucide="user" style="width: 14px; height: 14px; color: #94A3B8; flex-shrink: 0;"></i>
              <span>${provider.name} (${provider.vehicle.split(' ')[0]})</span>
            </div>
          </div>

          <div class="booking-actions-row">
            <button class="btn-booking-sub" onclick="event.stopPropagation(); openBookingDetails('${b.id}')">View Details →</button>
            ${b.status === 'confirmed' ? `<button class="btn-booking-sub" onclick="event.stopPropagation(); navigateTo('tracking')">Live Track</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ==========================================================
   Live Tracking: Progressive Lifecycle Stepper
   ========================================================== */
const trackingStages = [
  { chip: 'On The Way', text: 'Tariq is driving towards your home', eta: '07:28 AM', pct: '25%' },
  { chip: 'At Pickup', text: 'Tariq has arrived at Home (12 Elm Street)', eta: '07:30 AM', pct: '50%' },
  { chip: 'In Progress', text: 'En route to Greenfield International', eta: '07:42 AM', pct: '70%' },
  { chip: 'Approaching', text: 'Approaching Greenfield School drop-off zone', eta: '07:44 AM', pct: '88%' },
  { chip: 'Completed', text: 'Children safely handed to school attendant', eta: '07:46 AM', pct: '100%' }
];

window.advanceTrackingStage = function () {
  window.appState.trackingStageIndex = (window.appState.trackingStageIndex + 1) % trackingStages.length;
  const stage = trackingStages[window.appState.trackingStageIndex];

  const chip = document.getElementById('trackingStatusChip');
  const stageText = document.getElementById('trackingStageText');
  const etaText = document.getElementById('trackingEtaText');
  const progressBar = document.getElementById('stepperProgressBar');
  const carMarker = document.getElementById('liveMapCarMarker');

  if (chip) chip.textContent = stage.chip;
  if (stageText) stageText.textContent = stage.text;
  if (etaText) etaText.textContent = stage.eta;
  if (progressBar) progressBar.style.width = stage.pct;

  if (carMarker) {
    const offsets = [
      { top: '65%', left: '25%' },
      { top: '60%', left: '32%' },
      { top: '48%', left: '46%' },
      { top: '35%', left: '60%' },
      { top: '28%', left: '72%' }
    ];
    const pos = offsets[window.appState.trackingStageIndex];
    carMarker.style.top = pos.top;
    carMarker.style.left = pos.left;
  }

  const s1 = document.getElementById('step1Node');
  const s2 = document.getElementById('step2Node');
  const s3 = document.getElementById('step3Node');
  const s4 = document.getElementById('step4Node');

  [s1, s2, s3, s4].forEach(n => n?.classList.remove('completed', 'active'));

  const idx = window.appState.trackingStageIndex;
  if (idx >= 0) s1?.classList.add(idx > 0 ? 'completed' : 'active');
  if (idx >= 1) s2?.classList.add(idx > 1 ? 'completed' : 'active');
  if (idx >= 2) s3?.classList.add(idx > 2 ? 'completed' : 'active');
  if (idx >= 4) {
    s4?.classList.add('completed');
    setTimeout(() => {
      if (confirm('🎉 Drop-off completed safely! Would you like to rate Tariq Ahmed now?')) {
        window.navigateTo('rating');
      }
    }, 600);
  }
};

/* ==========================================================
   Messaging / Parent-Provider Chat
   ========================================================== */
window.sendQuickReply = function (text) {
  appendChatMessage(text, 'parent');
  simulateDriverReply();
};

window.handleSendChatMessage = function (e) {
  e.preventDefault();
  const input = document.getElementById('chatInputField');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  appendChatMessage(text, 'parent');
  input.value = '';

  simulateDriverReply();
};

function appendChatMessage(text, sender) {
  const stream = document.getElementById('chatStream');
  if (!stream) return;

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bubble.innerHTML = `
    ${text}
    <div class="chat-timestamp">${timeStr}</div>
  `;

  stream.appendChild(bubble);
  stream.scrollTop = stream.scrollHeight;
}

function simulateDriverReply() {
  setTimeout(() => {
    const replies = [
      "Thank you, Sadia! Rest assured your children are safe with me.",
      "Understood! Driving carefully and following the verified school route.",
      "Just arrived at the school drop-off loop. All good!"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    appendChatMessage(randomReply, 'provider');
  }, 1200);
}

/* ==========================================================
   Rating System
   ========================================================== */
window.setRatingScore = function (score) {
  const starsContainer = document.getElementById('ratingStars');
  if (!starsContainer) return;

  const btns = starsContainer.querySelectorAll('.star-btn');
  btns.forEach((btn, idx) => {
    if (idx < score) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
};

/* ==========================================================
   OTP Input Navigation Logic
   ========================================================== */
function focusFirstEmptyOtp() {
  const inputs = document.querySelectorAll('.otp-box');
  for (const input of inputs) {
    if (!input.value) {
      input.focus();
      break;
    }
  }
}

document.querySelectorAll('.otp-box').forEach((box, idx, list) => {
  box.addEventListener('input', () => {
    if (box.value.length > 1) {
      box.value = box.value.slice(-1);
    }
    if (box.value) {
      box.classList.add('active');
      if (idx < list.length - 1) {
        list[idx + 1].focus();
      } else {
        setTimeout(() => {
          window.navigateTo('authProfile');
        }, 300);
      }
    } else {
      box.classList.remove('active');
    }
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && idx > 0) {
      list[idx - 1].focus();
    }
  });
});

/* ==========================================================
   Confetti Burst Celebration
   ========================================================== */
function triggerCelebrationConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.45 },
      colors: ['#F2600C', '#1B2B68', '#0284C7', '#F59E0B', '#10B981']
    });
  }
}

/* ==========================================================
   Avatar Upload Handlers
   ========================================================== */
window.triggerPhotoUpload = function () {
  document.getElementById('photoFileInput')?.click();
};

window.handlePhotoUpload = function (event) {
  const file = event.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const container = document.getElementById('avatarPreviewContainer');
    if (container) {
      container.innerHTML = `<img src="${url}" alt="Uploaded Avatar" style="width:100%;height:100%;object-fit:cover;" />`;
    }
  }
};

window.addEmergencyContact = function () {
  const name = prompt('Enter Contact Full Name:');
  if (!name) return;
  const rel = prompt('Relationship (e.g. Aunt, Neighbor, Co-parent):') || 'Guardian';
  const phone = prompt('Mobile Phone Number:') || '+1 (416) 555-0000';

  const container = document.getElementById('emergencyContactsListWrap');
  if (container) {
    const row = document.createElement('div');
    row.className = 'grouped-row-item';
    row.innerHTML = `
      <div class="grouped-row-left">
        <div class="grouped-row-icon-wrap">
          <i data-lucide="phone-call" style="width:18px;height:18px;color:var(--color-primary);"></i>
        </div>
        <div>
          <div class="grouped-row-title">${name} (${rel})</div>
          <div class="grouped-row-sub">${phone} • Verified</div>
        </div>
      </div>
      <a href="tel:${phone}" class="grouped-row-action" style="text-decoration:none;">Call</a>
    `;
    container.appendChild(row);
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
    alert(`✓ Emergency contact ${name} added successfully.`);
  }
};

window.addNewAddress = function () {
  const label = prompt('Location Label (e.g. Tutor, Soccer Field):');
  if (!label) return;
  const address = prompt('Full Street Address:');
  if (!address) return;

  const container = document.getElementById('savedLocationsListWrap');
  if (container) {
    const row = document.createElement('div');
    row.className = 'grouped-row-item';
    row.innerHTML = `
      <div class="grouped-row-left">
        <div class="grouped-row-icon-wrap">
          <i data-lucide="map-pin" style="width:18px;height:18px;color:var(--color-primary);"></i>
        </div>
        <div>
          <div class="grouped-row-title">${label}</div>
          <div class="grouped-row-sub">${address}</div>
        </div>
      </div>
      <button class="grouped-row-action" onclick="alert('Location details loaded')">Edit</button>
    `;
    container.appendChild(row);
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
    alert(`✓ Location "${label}" saved successfully.`);
  }
};

window.addNewPaymentMethod = function () {
  const cardNum = prompt('Enter Card Number (Demo):', '•••• •••• •••• 5592');
  if (!cardNum) return;
  alert('✓ New payment method added and verified with secure 3D-Secure bank protocol.');
};

window.savePersonalInfo = function () {
  const name = document.getElementById('parentProfileName')?.value;
  const phone = document.getElementById('parentProfilePhone')?.value;
  const email = document.getElementById('parentProfileEmail')?.value;
  const address = document.getElementById('parentProfileAddress')?.value;
  const relation = document.getElementById('parentProfileRelation')?.value;

  if (name) window.appState.user.name = name;
  if (phone) window.appState.user.phone = phone;
  if (email) window.appState.user.email = email;
  if (address) window.appState.user.address = address;
  if (relation) window.appState.user.role = relation;

  alert('✓ Personal information updated successfully.');
  window.navigateTo('profile');
};

window.markNotificationsAsRead = function () {
  document.querySelectorAll('.notification-card.unread').forEach(el => {
    el.classList.remove('unread');
  });
  const dot = document.querySelector('.unread-badge-dot');
  if (dot) dot.style.display = 'none';
  alert('All notifications marked as read.');
};

window.filterNotifications = function (category, btn) {
  const parent = btn?.closest('.filters-scroll-bar');
  parent?.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
  btn?.classList.add('active');

  const cards = document.querySelectorAll('.notification-card');
  cards.forEach(card => {
    if (category === 'all' || card.dataset.category === category) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
};

window.toggleFaq = function (headerEl) {
  const item = headerEl.closest('.faq-accordion-item');
  if (item) {
    item.classList.toggle('open');
    if (window.lucide) window.lucide.createIcons();
  }
};

window.filterFaqTopics = function (topic, btnEl) {
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
  }

  const items = document.querySelectorAll('.faq-accordion-item');
  const headers = document.querySelectorAll('.faq-topic-header');

  items.forEach(item => {
    if (topic === 'all' || item.dataset.topic === topic) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });

  headers.forEach(header => {
    if (topic === 'all' || header.dataset.topic === topic) {
      header.style.display = 'flex';
    } else {
      header.style.display = 'none';
    }
  });
};

window.searchFaq = function (query) {
  const q = (query || '').toLowerCase().trim();
  const items = document.querySelectorAll('.faq-accordion-item');
  const headers = document.querySelectorAll('.faq-topic-header');

  if (!q) {
    items.forEach(item => item.style.display = 'block');
    headers.forEach(header => header.style.display = 'flex');
    return;
  }

  headers.forEach(header => header.style.display = 'none');
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    if (text.includes(q)) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
};

window.selectReportCategory = function (category, btnEl) {
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.report-cat-btn').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
  }
  const select = document.getElementById('reportCategorySelect');
  if (select) select.value = category;
};

window.submitIssueReport = function () {
  const desc = document.getElementById('reportDescriptionInput')?.value?.trim();

  if (!desc) {
    alert('Please describe what happened so our dispatch team can investigate.');
    return;
  }

  const ticketId = 'H2S-' + Math.floor(1000 + Math.random() * 9000);
  alert(`✓ Incident report submitted successfully.\n\nTicket Reference: ${ticketId}\nOur Safety Operations & Dispatch team will investigate and follow up via phone/SMS within 15 minutes.`);

  if (document.getElementById('reportDescriptionInput')) {
    document.getElementById('reportDescriptionInput').value = '';
  }

  window.navigateTo('profile');
};

/* ==========================================================
   Reactive Children Management (Add & Edit Modal Logic)
   ========================================================== */
window.editingChildId = null;

window.renderMyChildrenList = function () {
  const container = document.getElementById('myChildrenListContainer');
  if (!container) return;

  const children = window.appState?.children || [];

  if (children.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding: 24px; color: var(--color-body); font-size: 13px;">
        No child profiles registered yet. Click "+ Add" above to register a child.
      </div>
    `;
    return;
  }

  container.innerHTML = children.map(c => {
    const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'KD';
    const colorClass = c.id === 'arman' ? 'navy' : c.id === 'emma' ? 'blue' : 'orange';
    return `
      <div class="child-manage-card" onclick="openEditChildModal('${c.id}')">
        <div class="child-manage-left">
          <div class="child-monogram-avatar ${colorClass}">${initials}</div>
          <div>
            <div class="child-manage-name">${c.name}</div>
            <div class="child-manage-sub">${c.grade} • ${c.school}</div>
          </div>
        </div>
        <button class="btn-icon-contact" onclick="event.stopPropagation(); openEditChildModal('${c.id}');" aria-label="Edit ${c.name}">
          <i data-lucide="chevron-right" style="width:18px;height:18px;color:#94A3B8;"></i>
        </button>
      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.openAddChildModal = function () {
  window.editingChildId = null;

  const titleEl = document.getElementById('childFormTopTitle');
  if (titleEl) titleEl.textContent = 'Add New Child';

  const monogramEl = document.getElementById('childFormMonogram');
  if (monogramEl) {
    monogramEl.textContent = '+';
    monogramEl.style.background = 'linear-gradient(135deg, var(--color-secondary) 0%, #EA580C 100%)';
  }

  const badgeEl = document.getElementById('childFormHeroBadge');
  if (badgeEl) badgeEl.textContent = 'New Student Registration';

  const nameInput = document.getElementById('editChildName');
  const gradeInput = document.getElementById('editChildGrade');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');
  const pickupInput = document.getElementById('editChildPickup');
  const notesInput = document.getElementById('editChildNotes');
  const submitBtn = document.getElementById('childFormSubmitBtn');

  if (nameInput) nameInput.value = '';
  if (gradeInput) gradeInput.value = 'Kindergarten';
  if (ageInput) ageInput.value = '';
  if (schoolInput) schoolInput.value = '';
  if (pickupInput) pickupInput.value = 'Home (12 Elm Street, Toronto)';
  if (notesInput) notesInput.value = '';
  if (submitBtn) submitBtn.textContent = 'Add Child Profile';

  window.navigateTo('addChild');
};

window.openEditChildModal = function (childId) {
  window.editingChildId = childId;
  const child = (window.appState?.children || []).find(c => c.id === childId);
  if (!child) return;

  const titleEl = document.getElementById('childFormTopTitle');
  if (titleEl) titleEl.textContent = 'Edit Child Profile';

  const initials = child.name ? child.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'KD';
  const monogramEl = document.getElementById('childFormMonogram');
  if (monogramEl) {
    monogramEl.textContent = initials;
    const bg = child.id === 'arman' ? 'linear-gradient(135deg, var(--color-primary) 0%, #263C8C 100%)' :
               child.id === 'emma' ? 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' :
               'linear-gradient(135deg, var(--color-secondary) 0%, #EA580C 100%)';
    monogramEl.style.background = bg;
  }

  const badgeEl = document.getElementById('childFormHeroBadge');
  if (badgeEl) badgeEl.textContent = `${child.grade} • Active Student`;

  const nameInput = document.getElementById('editChildName');
  const gradeInput = document.getElementById('editChildGrade');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');
  const pickupInput = document.getElementById('editChildPickup');
  const notesInput = document.getElementById('editChildNotes');
  const submitBtn = document.getElementById('childFormSubmitBtn');

  if (nameInput) nameInput.value = child.name || '';
  if (gradeInput) {
    if (child.grade.includes('Kindergarten')) gradeInput.value = 'Kindergarten';
    else if (child.grade.includes('Grade 1')) gradeInput.value = 'Grade 1';
    else if (child.grade.includes('Grade 2')) gradeInput.value = 'Grade 2';
    else if (child.grade.includes('Grade 3')) gradeInput.value = 'Grade 3';
    else if (child.grade.includes('Grade 4')) gradeInput.value = 'Grade 4';
    else if (child.grade.includes('Grade 5')) gradeInput.value = 'Grade 5';
  }
  if (ageInput) ageInput.value = child.grade.match(/\((.*?)\)/)?.[1] || '8 Years';
  if (schoolInput) schoolInput.value = child.school || '';
  if (pickupInput) pickupInput.value = child.pickup || 'Home (12 Elm Street, Toronto)';
  if (notesInput) notesInput.value = child.notes || '';
  if (submitBtn) submitBtn.textContent = 'Save Changes';

  window.navigateTo('addChild');
};

window.saveChildProfileForm = function (event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById('editChildName');
  const gradeInput = document.getElementById('editChildGrade');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');
  const pickupInput = document.getElementById('editChildPickup');
  const notesInput = document.getElementById('editChildNotes');

  const name = nameInput?.value?.trim();
  const grade = gradeInput?.value || 'Grade 1';
  const age = ageInput?.value?.trim() || '7 Years';
  const school = schoolInput?.value?.trim() || 'Greenfield International School';
  const pickup = pickupInput?.value?.trim() || 'Home (12 Elm Street)';
  const notes = notesInput?.value?.trim() || '';

  if (!name) {
    alert('Please enter your child’s name.');
    return;
  }

  if (window.editingChildId) {
    const child = (window.appState?.children || []).find(c => c.id === window.editingChildId);
    if (child) {
      child.name = name;
      child.grade = `${grade} (${age})`;
      child.school = school;
      child.pickup = pickup;
      child.notes = notes;
    }
  } else {
    const newId = 'child_' + Date.now();
    window.appState.children.push({
      id: newId,
      name: name,
      grade: `${grade} (${age})`,
      school: school,
      pickup: pickup,
      notes: notes
    });
  }

  window.renderMyChildrenList();
  window.navigateTo('myChildren');
};

// Initial render
window.renderMyChildrenList();



