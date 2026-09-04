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
  'report',
  'contactSupport',
  // Driver Role Screens (10-Year Product Architecture)
  'driverHome',
  'driverRequests',
  'driverSchedule',
  'driverActiveTrip',
  'driverSetup',
  'driverProfile'
];

/* ==========================================================
   Central Application State (Single Source of Truth)
   ========================================================== */
window.appState = {
  user: {
    name: 'Sadia Khan',
    phone: '+1 (416) 555-0192',
    email: 'sadia.khan@example.com',
    role: 'Mother',
    photo: '/assets/avatar_sadia.jpg'
  },
  children: [
    { id: 'arman', name: 'Arman Khan', age: '9 yrs', grade: 'Grade 4', school: 'Greenfield International School', pickup: 'Home (12 Elm Street)', notes: 'Wears booster seat', photo: '/assets/avatar_arman.jpg' },
    { id: 'emma', name: 'Emma Khan', age: '7 yrs', grade: 'Grade 2', school: 'Greenfield International School', pickup: 'Home (12 Elm Street)', notes: 'Sits next to brother', photo: '/assets/avatar_emma.jpg' },
    { id: 'zara', name: 'Zara Khan', age: '5 yrs', grade: 'Pre-K', school: 'Sunshine Pre-school', pickup: 'Home (12 Elm Street)', notes: 'Hand to teacher at gate', photo: '/assets/avatar_zara.jpg' }
  ],
  savedLocations: [
    { id: 'loc-1', name: 'Home', street: '12 Elm Street, Toronto, ON', type: 'home', isDefault: true },
    { id: 'loc-2', name: 'Greenfield International School', street: 'Gate 2 Drop-off Loop, Toronto, ON', type: 'school', isDefault: false }
  ],
  providers: [
    {
      id: 'tariq',
      name: 'Tariq Ahmed',
      vehicle: 'Toyota Sienna (2023)',
      plate: 'SCH-4091',
      rating: 4.9,
      reviewsCount: 128,
      seats: 4,
      baseWeekly: 120,
      photo: '/assets/avatar_tariq.jpg',
      phone: '+1 (416) 555-0182',
      experience: '4+ Yrs',
      onTimeRate: '99.8%',
      quote: '"Tariq has safely driven our kids to Greenfield School for over 8 months. Very gentle, always punctual, and sends notifications right away."',
      reviewer: '— Nadia Rahman (Parent of 2)'
    },
    {
      id: 'farhana',
      name: 'Farhana Yasmin',
      vehicle: 'Honda Odyssey (2024)',
      plate: 'KID-2810',
      rating: 5.0,
      reviewsCount: 94,
      seats: 5,
      baseWeekly: 135,
      photo: '/assets/avatar_farhana.jpg',
      phone: '+1 (416) 555-0183',
      experience: '6+ Yrs',
      onTimeRate: '100%',
      quote: '"Farhana is amazing with younger kids! Emma always looks forward to her morning commute and arrives at school with a big smile."',
      reviewer: '— David Miller (Parent of 1)'
    },
    {
      id: 'kabir',
      name: 'Kabir Hossain',
      vehicle: 'Nissan Rogue (2022)',
      plate: 'SCH-9102',
      rating: 4.8,
      reviewsCount: 62,
      seats: 2,
      baseWeekly: 110,
      photo: '/assets/avatar_kabir.jpg',
      phone: '+1 (416) 555-0184',
      experience: '3+ Yrs',
      onTimeRate: '99.2%',
      quote: '"Kabir is extremely reliable, always takes the safest routes and never speeds. Highly recommended for daily school carpool."',
      reviewer: '— Sumaiya Akter (Parent of 2)'
    },
    {
      id: 'sarah',
      name: 'Sarah Jenkins (WalkShare)',
      category: 'walkshare',
      vehicle: 'Walking School Bus Escort',
      plate: 'VERIFIED-WALK',
      rating: 4.9,
      reviewsCount: 45,
      seats: 3,
      baseWeekly: 75,
      photo: '/assets/avatar_sarah.jpg',
      phone: '+1 (416) 555-0185',
      experience: '5+ Yrs',
      onTimeRate: '99.5%',
      quote: '"Sarah\'s walking school bus is the healthiest and most enjoyable commute for our son. He walks safely with neighborhood kids every morning."',
      reviewer: '— Marcus Vance (Parent of 1)'
    },
    {
      id: 'elena',
      name: 'Elena Rostova (WalkShare)',
      category: 'walkshare',
      vehicle: 'Greenfield Walk Escort',
      plate: 'WALK-SAFE-02',
      rating: 4.9,
      reviewsCount: 38,
      seats: 2,
      baseWeekly: 70,
      photo: '/assets/avatar_rehana.jpg',
      phone: '+1 (416) 555-0186',
      experience: '4+ Yrs',
      onTimeRate: '100%',
      quote: '"Elena leads the morning walking group with immense care. The children practice safe sidewalk habits while getting fresh morning air."',
      reviewer: '— Sophia Lin (Parent of 1)'
    }
  ],
  emergencyContacts: [
    {
      id: 'ec-1',
      name: 'Farhan Khan',
      rel: 'Father',
      phone: '+1 (416) 555-0199',
      isPrimary: true,
      pickupAuth: true,
      notes: 'Available all day',
      photo: '/assets/avatar_farhan.jpg'
    },
    {
      id: 'ec-2',
      name: 'Rehana Begum',
      rel: 'Grandmother',
      phone: '+1 (416) 555-0144',
      isPrimary: false,
      pickupAuth: true,
      notes: 'Lives near school',
      photo: '/assets/avatar_rehana.jpg'
    },
    {
      id: 'ec-3',
      name: 'Greenfield School Main Office',
      rel: 'School Admin',
      phone: '+1 (416) 555-0800',
      isPrimary: false,
      pickupAuth: false,
      notes: 'Campus dispatch desk',
      photo: '/assets/avatar_school.jpg'
    }
  ],
  selectedChildIds: ['arman', 'emma'],
  bookingDraft: {
    direction: 'bothway', // 'bothway' | 'oneway'
    frequency: 'recurring', // 'recurring' | 'onetime'
    serviceType: 'drivers', // 'all' | 'drivers' | 'walkshare'
    pickupLocation: '',
    schoolLocation: '',
    outboundTime: '',
    returnTime: '',
    startDate: '',
    tripDate: '',
    selectedDays: ['M', 'T', 'W', 'T', 'F'],
    providerId: 'tariq',
    paymentMethod: 'Visa •••• 4242'
  },
  bookings: [
    // 1. Two-Way + Recurring (Active / In Progress)
    {
      id: 'H2S-84920',
      status: 'in_progress',
      activeNow: true,
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
    // 2. One-Way + Recurring (Confirmed)
    {
      id: 'H2S-91042',
      status: 'confirmed',
      childIds: ['arman'],
      direction: 'oneway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri • Outbound: 07:45 AM (Morning Commute)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:45 AM',
      returnTime: '',
      providerId: 'farhana',
      amount: 65,
      paymentMethod: 'Apple Pay',
      createdAt: 'May 22, 2026'
    },
    // 3. Two-Way + One-Time (Confirmed)
    {
      id: 'H2S-82194',
      status: 'confirmed',
      childIds: ['emma', 'zara'],
      direction: 'bothway',
      frequency: 'onetime',
      scheduleText: 'Friday, May 29 • 08:30 AM & 02:30 PM (Day Pass)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:30 AM',
      returnTime: '02:30 PM',
      providerId: 'kabir',
      amount: 55,
      paymentMethod: 'Mastercard •••• 8821',
      createdAt: 'May 23, 2026'
    },
    // 4. One-Way + One-Time (Pending)
    {
      id: 'H2S-73190',
      status: 'pending',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'Thursday, May 23 • 08:15 AM (Morning Escort)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      paymentMethod: 'Visa •••• 4242',
      createdAt: 'May 21, 2026'
    },

    // PAST / COMPLETED BOOKINGS (History)
    // 5. Two-Way + Recurring (Completed)
    {
      id: 'H2S-61029',
      status: 'completed',
      childIds: ['arman', 'emma'],
      direction: 'bothway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri (May 15–19) • 07:30 AM & 01:00 PM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:30 AM',
      returnTime: '01:00 PM',
      providerId: 'tariq',
      amount: 120,
      paymentMethod: 'Visa •••• 4242',
      completedAt: 'May 19, 2026 • 01:02 PM',
      dropoffNote: 'Safely handed to Ms. Clara at Greenfield Entrance Gate A',
      userRating: '5.0',
      userReview: 'Punctual and very gentle with both kids.',
      createdAt: 'May 14, 2026'
    },
    // 6. One-Way + One-Time (Completed)
    {
      id: 'H2S-60411',
      status: 'completed',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'May 18, 2026 • 08:15 AM (Morning Escort)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      paymentMethod: 'Visa •••• 4242',
      completedAt: 'May 18, 2026 • 08:24 AM',
      dropoffNote: 'Signed in at Sunshine Pre-school front reception desk',
      userRating: '5.0',
      userReview: 'Zara loved the nursery rhymes and car seat was clean!',
      createdAt: 'May 18, 2026'
    },
    // 7. Two-Way + One-Time (Completed)
    {
      id: 'H2S-59120',
      status: 'completed',
      childIds: ['arman'],
      direction: 'bothway',
      frequency: 'onetime',
      scheduleText: 'May 12, 2026 • 08:00 AM & 03:00 PM (Sports Day)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '08:00 AM',
      returnTime: '03:00 PM',
      providerId: 'farhana',
      amount: 50,
      paymentMethod: 'Apple Pay',
      completedAt: 'May 12, 2026 • 03:08 PM',
      dropoffNote: 'Returned to Home (12 Elm St) after sports tournament',
      userRating: '4.9',
      createdAt: 'May 12, 2026'
    },
    // 8. One-Way + Recurring (Completed)
    {
      id: 'H2S-58019',
      status: 'completed',
      childIds: ['emma'],
      direction: 'oneway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri (April 2026 Commute) • 07:45 AM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:45 AM',
      returnTime: '',
      providerId: 'kabir',
      amount: 65,
      paymentMethod: 'Visa •••• 4242',
      completedAt: 'April 30, 2026 • 08:00 AM',
      dropoffNote: 'Completed all 20 monthly morning rides on-time',
      userRating: '5.0',
      createdAt: 'April 28, 2026'
    },

    // CANCELLED BOOKINGS
    // 9. One-Way + One-Time (Cancelled)
    {
      id: 'H2S-54012',
      status: 'cancelled',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'May 10, 2026 • 08:15 AM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      paymentMethod: 'Visa •••• 4242',
      cancelledAt: 'May 08, 2026 • 06:40 PM',
      cancelReason: 'Child illness (Fever & pediatrician appointment)',
      refundStatus: 'Full $35.00 refunded to Visa •••• 4242 ($0 fee)',
      createdAt: 'May 08, 2026'
    },
    // 10. Two-Way + Recurring (Cancelled)
    {
      id: 'H2S-52109',
      status: 'cancelled',
      childIds: ['arman', 'emma'],
      direction: 'bothway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri (Cancelled Summer Session)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:30 AM',
      returnTime: '01:00 PM',
      providerId: 'tariq',
      amount: 120,
      paymentMethod: 'Visa •••• 4242',
      cancelledAt: 'May 01, 2026 • 09:15 PM',
      cancelReason: 'School Emergency Weather Advisory — Greenfield Campus Closed',
      refundStatus: 'Full $120.00 credited to Parent H2S Wallet',
      createdAt: 'May 02, 2026'
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      receiptNo: 'H2S-REC-8492',
      date: 'May 20, 2026 • 09:15 AM',
      title: 'Weekly Commute (Round Trip)',
      subtitle: 'Arman & Emma • Greenfield International',
      provider: 'Tariq Ahmed (Toyota Sienna)',
      amount: 120.00,
      paymentMethod: 'Stripe • Visa •••• 4242',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'recurring',
      stripeTxId: 'ch_3N8zYk2eZvKYlo2C8492'
    },
    {
      id: 'tx_2',
      receiptNo: 'H2S-REC-8410',
      date: 'May 22, 2026 • 02:40 PM',
      title: 'Weekly Commute (One Way)',
      subtitle: 'Arman • Morning Commute',
      provider: 'Farhana Yasmin (Honda Odyssey)',
      amount: 65.00,
      paymentMethod: 'Stripe • Apple Pay',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'recurring',
      stripeTxId: 'ch_3N8zYk2eZvKYlo2C8410'
    },
    {
      id: 'tx_3',
      receiptNo: 'H2S-REC-8395',
      date: 'May 23, 2026 • 11:30 AM',
      title: 'Single Day Pass (Round Trip)',
      subtitle: 'Emma & Zara • Sunshine Pre-school',
      provider: 'Kabir Hossain (Nissan Rogue)',
      amount: 55.00,
      paymentMethod: 'Stripe • Mastercard •••• 8821',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'onetime',
      stripeTxId: 'ch_3N8zYk2eZvKYlo2C8395'
    },
    {
      id: 'tx_4',
      receiptNo: 'H2S-REC-8302',
      date: 'May 14, 2026 • 08:00 AM',
      title: 'Weekly Commute (Round Trip)',
      subtitle: 'Arman & Emma • Greenfield International',
      provider: 'Tariq Ahmed (Toyota Sienna)',
      amount: 120.00,
      paymentMethod: 'Stripe • Visa •••• 4242',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'recurring',
      stripeTxId: 'ch_3N8zYk2eZvKYlo2C8302'
    },
    {
      id: 'tx_5',
      receiptNo: 'H2S-REC-8245',
      date: 'May 12, 2026 • 04:15 PM',
      title: 'Sports Day Ride (Round Trip)',
      subtitle: 'Arman • Greenfield International',
      provider: 'Farhana Yasmin (Honda Odyssey)',
      amount: 50.00,
      paymentMethod: 'Stripe • Apple Pay',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'onetime',
      stripeTxId: 'ch_3N8zYk2eZvKYlo2C8245'
    },
    {
      id: 'tx_6',
      receiptNo: 'H2S-REF-7104',
      date: 'May 10, 2026 • 01:20 PM',
      title: 'Weather Cancellation Refund',
      subtitle: 'Zara • Morning WalkShare Credited',
      provider: 'Sarah Jenkins (Escort)',
      amount: 35.00,
      paymentMethod: 'Refunded to Parent Wallet',
      status: 'refunded',
      statusText: 'Refunded to Balance',
      type: 'refund',
      stripeTxId: 're_3N8zYk2eZvKYlo2C7104'
    }
  ],
  activeBookingId: 'H2S-84920',
  homeScenario: 'C', // Default to Scenario C (Active Trip In Progress)
  trackingStageIndex: 2,

  // ==========================================================
  // Dual-Role System: Driver State (10yr Product Architecture)
  // ==========================================================
  activeRole: localStorage.getItem('h2s_active_role') || 'parent',
  driver: {
    id: 'tariq',
    name: 'Tariq Ahmed',
    phone: '+1 (416) 555-0182',
    email: 'tariq.ahmed@torontoschoolrides.ca',
    photo: '/assets/avatar_tariq.jpg',
    rating: 4.9,
    reviewsCount: 128,
    isOnline: true,
    verificationStatus: 'verified',
    homeScenario: 'B', // 'A': No Trips, 'B': Upcoming Trip, 'C': Trip Starts Soon
    activeTripStage: 0, // 0: Confirmed, 1: On Way, 2: Arrived, 3: Boarded, 4: En Route, 5: Dropped Off, 6: Complete
    attendance: {
      arman: true,
      emma: true
    },
    vehicle: {
      type: 'Minivan',
      make: 'Toyota',
      model: 'Sienna',
      year: '2023',
      color: 'Celestial Silver',
      plate: 'SCH-4091',
      capacity: 4,
      photo: '/assets/avatar_tariq.jpg'
    },
    documents: [
      { id: 'license', title: "Ontario Class G Driver's License", status: 'approved', expiry: 'Dec 14, 2028' },
      { id: 'insurance', title: "Commercial Passenger Vehicle Insurance", status: 'approved', expiry: 'Nov 30, 2026' },
      { id: 'registration', title: "Ontario Vehicle Registration & Safety", status: 'approved', expiry: 'Oct 22, 2027' },
      { id: 'background', title: "Vulnerable Sector & Criminal Record Check", status: 'approved', expiry: 'Jan 15, 2027' }
    ],
    availability: {
      weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      morningSlot: '06:30 AM – 09:30 AM',
      afternoonSlot: '01:00 PM – 04:30 PM'
    },
    subscription: {
      plan: 'Pro Driver Pass',
      price: '$29 / mo',
      renewal: 'Sep 30, 2026',
      status: 'active'
    },
    requests: [
      {
        id: 'dreq-1',
        parentName: 'Sarah Khan',
        parentPhone: '+1 (416) 555-0192',
        children: ['Arman Khan (9 yrs)', 'Emma Khan (7 yrs)'],
        childNamesShort: 'Arman + Emma',
        seatsNeeded: 2,
        routeFrom: 'Home (12 Elm Street)',
        routeTo: 'Greenfield International School',
        timing: 'Mon – Fri · Outbound: 07:30 AM | Return: 01:00 PM',
        frequency: 'Round Trip · Recurring',
        distance: '4.8 km (approx 14 min)',
        price: '$120 /wk',
        notes: 'Booster seat required for Arman. Front loop drop-off at Greenfield.',
        status: 'new'
      },
      {
        id: 'dreq-2',
        parentName: 'Sadia Khan',
        parentPhone: '+1 (416) 555-0192',
        children: ['Zara Khan (5 yrs)'],
        childNamesShort: 'Zara',
        seatsNeeded: 1,
        routeFrom: 'Home (12 Elm Street)',
        routeTo: 'Sunshine Pre-school',
        timing: 'Thursday, May 23 · 08:15 AM',
        frequency: 'One Way · Single Trip',
        distance: '2.4 km (approx 8 min)',
        price: '$35 trip',
        notes: 'Hand to classroom teacher Ms. Jenkins at main entrance gate.',
        status: 'new'
      }
    ],
    schedule: [
      {
        id: 'dsched-1',
        time: '07:30 AM',
        childNames: 'Arman + Emma Khan',
        route: 'Home (12 Elm Street) → Greenfield School',
        leg: 'Outbound Commute',
        seats: 2,
        status: 'upcoming',
        isActionableNow: true
      },
      {
        id: 'dsched-2',
        time: '01:00 PM',
        childNames: 'Arman + Emma Khan',
        route: 'Greenfield School → Home (12 Elm Street)',
        leg: 'Return Commute',
        seats: 2,
        status: 'upcoming',
        isActionableNow: false
      },
      {
        id: 'dsched-3',
        time: '03:15 PM',
        childNames: 'Zara Khan',
        route: 'Sunshine Pre-school → Home (12 Elm Street)',
        leg: 'Return Ride',
        seats: 1,
        status: 'upcoming',
        isActionableNow: false
      }
    ]
  }
};

/* ==========================================================
   Dual-Role Switcher (Parent Mode ⇄ Driver Mode)
   ========================================================== */
window.switchRole = function (role) {
  window.appState.activeRole = role;
  localStorage.setItem('h2s_active_role', role);

  const btnP = document.getElementById('btnRoleParent');
  const btnD = document.getElementById('btnRoleDriver');
  if (btnP && btnD) {
    if (role === 'driver') {
      btnP.classList.remove('active');
      btnD.classList.add('active');
      btnD.classList.add('driver-active');
    } else {
      btnD.classList.remove('active');
      btnD.classList.remove('driver-active');
      btnP.classList.add('active');
    }
  }

  if (role === 'driver') {
    window.navigateTo('driverHome');
  } else {
    window.navigateTo('home');
  }
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
  } else if (screenName === 'bookingTripSetup') {
    if (window.renderBookingSavedLocations) window.renderBookingSavedLocations();
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
  } else if (screenName === 'profilePayments') {
    renderTransactions('all');
  } else if (screenName === 'profileEmergency') {
    renderEmergencyContactsList();
  } else if (screenName === 'contactSupport') {
    renderSupportScreen();
  } else if (screenName === 'profileLocations') {
    renderSavedLocations();
  } else if (screenName === 'driverHome') {
    renderDriverHome();
  } else if (screenName === 'driverRequests') {
    renderDriverRequests('new');
  } else if (screenName === 'driverSchedule') {
    renderDriverSchedule('today');
  } else if (screenName === 'driverActiveTrip') {
    renderDriverActiveTrip();
  } else if (screenName === 'driverSetup') {
    renderDriverSetup();
  } else if (screenName === 'driverProfile') {
    renderDriverProfile();
  } else if (screenName === 'tracking') {
    if (window.renderTrackingScreen) window.renderTrackingScreen();
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
  const parentTabMap = {
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
    about: 4,
    contactSupport: 4
  };

  const driverTabMap = {
    driverHome: 0,
    driverRequests: 1,
    driverSchedule: 2,
    driverActiveTrip: 2,
    messages: 3,
    driverProfile: 4,
    driverSetup: 4
  };

  const parentIdx = parentTabMap[screenName];
  if (parentIdx !== undefined) {
    document.querySelectorAll('.bottom-tab-bar:not(.driver-nav-bar)').forEach(bar => {
      const tabs = bar.querySelectorAll('.tab-item');
      tabs.forEach((tab, idx) => {
        if (idx === parentIdx) tab.classList.add('active');
        else tab.classList.remove('active');
      });
    });
  }

  const driverIdx = driverTabMap[screenName];
  if (driverIdx !== undefined) {
    document.querySelectorAll('.driver-nav-bar').forEach(bar => {
      const tabs = bar.querySelectorAll('.tab-item');
      tabs.forEach((tab, idx) => {
        if (idx === driverIdx) tab.classList.add('active');
        else tab.classList.remove('active');
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

  const savedRole = localStorage.getItem('h2s_active_role') || 'parent';
  window.appState.activeRole = savedRole;
  const btnP = document.getElementById('btnRoleParent');
  const btnD = document.getElementById('btnRoleDriver');
  if (btnP && btnD) {
    if (savedRole === 'driver') {
      btnP.classList.remove('active');
      btnD.classList.add('active');
      btnD.classList.add('driver-active');
    } else {
      btnD.classList.remove('active');
      btnD.classList.remove('driver-active');
      btnP.classList.add('active');
    }
  }

  const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
  let initial = 'home';
  if (hash && screens.includes(hash)) {
    initial = hash;
  } else if (savedRole === 'driver') {
    initial = 'driverHome';
  }
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

  if (window.updateNavLiveBadges) {
    window.updateNavLiveBadges();
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
      if (window.showToast) window.showToast('Please keep at least one child selected for the commute', 'info');
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
  const returnBlock = document.getElementById('returnScheduleBlock') || document.getElementById('returnTimePickerBox');
  const timesGrid = document.querySelector('.clean-sched-times-grid');

  if (dir === 'oneway') {
    btnOne?.classList.add('active');
    btnBoth?.classList.remove('active');
    if (returnBlock) returnBlock.style.display = 'none';
    if (timesGrid) timesGrid.classList.add('is-oneway');
  } else {
    btnOne?.classList.remove('active');
    btnBoth?.classList.add('active');
    if (returnBlock) returnBlock.style.display = 'flex';
    if (timesGrid) timesGrid.classList.remove('is-oneway');
  }
};

window.handleRecurringToggleChange = function (isRecurring) {
  const repeatDaysSection = document.getElementById('repeatDaysSection');
  const subTxt = document.getElementById('repeatSubtitleText');

  if (isRecurring) {
    window.appState.bookingDraft.frequency = 'recurring';
    if (repeatDaysSection) repeatDaysSection.style.display = 'block';
    if (subTxt) subTxt.textContent = 'Repeats every week on selected days';
  } else {
    window.appState.bookingDraft.frequency = 'onetime';
    if (repeatDaysSection) repeatDaysSection.style.display = 'none';
    if (subTxt) subTxt.textContent = 'One-time ride on selected date';
  }
};

window.setBookingFrequency = function (freq) {
  window.appState.bookingDraft.frequency = freq;
  const toggle = document.getElementById('toggleRecurringRide');
  const repeatDaysSection = document.getElementById('repeatDaysSection');
  const subTxt = document.getElementById('repeatSubtitleText');

  if (freq === 'onetime') {
    if (toggle) toggle.checked = false;
    if (repeatDaysSection) repeatDaysSection.style.display = 'none';
    if (subTxt) subTxt.textContent = 'One-time ride on selected date';
  } else {
    if (toggle) toggle.checked = true;
    if (repeatDaysSection) repeatDaysSection.style.display = 'block';
    if (subTxt) subTxt.textContent = 'Repeats every week on selected days';
  }
};

window.toggleRepeatDay = function (btn) {
  if (!btn) return;
  btn.classList.toggle('active');
  const activeDays = Array.from(document.querySelectorAll('#cleanDaysGrid .clean-day-btn.active'))
    .map(b => b.getAttribute('data-day') || b.textContent.trim());
  window.appState.bookingDraft.selectedDays = activeDays;
};

window.openDatePicker = function (inputId) {
  const el = document.getElementById(inputId);
  if (!el) return;
  if (typeof el.showPicker === 'function') {
    try {
      el.showPicker();
      return;
    } catch (e) {
      // Fallback below
    }
  }
  el.focus();
  el.click();
};

window.handleScheduleDateChange = function (type, dateVal) {
  if (!dateVal) return;
  const parts = dateVal.split('-');
  let displayStr = dateVal;
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    displayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  if (type === 'outbound') {
    const txt = document.getElementById('setupOutboundDateText');
    if (txt) txt.value = displayStr;
    window.appState.bookingDraft.tripDate = displayStr;
    window.appState.bookingDraft.startDate = dateVal;
    // Keep return date in sync if still default
    const retTxt = document.getElementById('setupReturnDateText');
    const retInput = document.getElementById('setupReturnDate');
    if (retTxt && retInput && !retInput.dataset.userChanged) {
      retTxt.value = displayStr;
      retInput.value = dateVal;
    }
  } else if (type === 'return') {
    const txt = document.getElementById('setupReturnDateText');
    if (txt) txt.value = displayStr;
    const retInput = document.getElementById('setupReturnDate');
    if (retInput) retInput.dataset.userChanged = 'true';
  }
};

window.renderBookingSavedLocations = function () {
  const container = document.getElementById('bookingSavedLocsList');
  if (!container) return;

  const locs = window.appState.savedLocations || [];
  if (locs.length === 0) {
    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: #94A3B8; font-weight: 600;">No saved locations yet</span>
        <button type="button" class="clean-quick-chip add-new" onclick="openAddLocationModal()">
          <i data-lucide="plus"></i>
          <span>Add New</span>
        </button>
      </div>
    `;
  } else {
    const currentPickup = (window.appState.bookingDraft.pickupLocation || '').toLowerCase();
    const currentSchool = (window.appState.bookingDraft.schoolLocation || '').toLowerCase();

    const chips = locs.map(loc => {
      let iconName = 'map-pin';
      if (loc.type === 'home') iconName = 'home';
      else if (loc.type === 'school') iconName = 'graduation-cap';
      else if (loc.type === 'family') iconName = 'heart';

      const isSchool = loc.type === 'school';
      const schoolClass = isSchool ? 'chip-school' : '';
      const isLocActive = currentPickup.includes(loc.name.toLowerCase()) || currentSchool.includes(loc.name.toLowerCase());
      const activeClass = isLocActive ? 'active' : '';

      let label = loc.name;
      if (label.includes('Greenfield')) label = 'Greenfield';
      else if (label.includes('Sunshine')) label = 'Sunshine';
      else if (label.includes('Grandmother') || label.includes('Grandma')) label = "Grandma's";

      return `
        <button type="button" class="clean-quick-chip ${schoolClass} ${activeClass}" onclick="applySavedBookingLocation('${loc.id}', this)" title="${loc.name} (${loc.street})">
          <i data-lucide="${iconName}"></i>
          <span>${label}</span>
        </button>
      `;
    });

    chips.push(`
      <button type="button" class="clean-quick-chip add-new" onclick="openAddLocationModal()" title="Add a new saved location">
        <i data-lucide="plus"></i>
        <span>Add New</span>
      </button>
    `);

    container.innerHTML = chips.join('');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.applySavedBookingLocation = function (locId, btnEl) {
  const loc = (window.appState.savedLocations || []).find(l => l.id === locId);
  if (!loc) return;

  const pEl = document.getElementById('setupPickupLocation');
  const sEl = document.getElementById('setupSchoolLocation');
  const inputP = document.getElementById('setupPickupLocationInput');
  const inputS = document.getElementById('setupSchoolLocationInput');
  const dispP = document.getElementById('displayPickupAddr');
  const dispS = document.getElementById('displaySchoolAddr');

  if (loc.type === 'school') {
    if (sEl) sEl.value = loc.name;
    if (inputS) inputS.value = loc.name;
    if (dispS) dispS.textContent = loc.name;
    window.appState.bookingDraft.schoolLocation = loc.name;
    if (typeof showToast === 'function') showToast(`Selected ${loc.name} as school drop-off`);
  } else {
    const fullPickup = `${loc.name} (${loc.street})`;
    if (pEl) pEl.value = fullPickup;
    if (inputP) inputP.value = loc.street || loc.name;
    if (dispP) dispP.textContent = loc.street || loc.name;
    window.appState.bookingDraft.pickupLocation = fullPickup;
    if (typeof showToast === 'function') showToast(`Selected ${loc.name} as pickup point`);
  }

  const outLabel = document.getElementById('outboundScheduleLabel');
  const retLabel = document.getElementById('returnScheduleLabel');
  if (outLabel) outLabel.innerHTML = `<span class="clean-dot navy"></span><span>Outbound</span>`;
  if (retLabel) retLabel.innerHTML = `<span class="clean-dot orange"></span><span>Return</span>`;

  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.clean-quick-chip').forEach(c => c.classList.remove('active'));
    btnEl.classList.add('active');
  }
};

/* ==========================================================
   Map Picker & Location Live Input Sync (Senior UX Standard)
   ========================================================== */
window.syncLocationInput = function (type, val) {
  const value = (val || '').trim();
  if (type === 'pickup') {
    const hiddenP = document.getElementById('setupPickupLocation');
    if (hiddenP) hiddenP.value = value;
    window.appState.bookingDraft.pickupLocation = value;
  } else if (type === 'school') {
    const hiddenS = document.getElementById('setupSchoolLocation');
    if (hiddenS) hiddenS.value = value;
    window.appState.bookingDraft.schoolLocation = value;
  }

  const inputP = document.getElementById('setupPickupLocationInput');
  const inputS = document.getElementById('setupSchoolLocationInput');
  const pName = (inputP && inputP.value ? inputP.value.split(',')[0].trim() : 'Home');
  const sName = (inputS && inputS.value ? inputS.value.split(',')[0].trim() : 'School');
  const outLabel = document.getElementById('outboundScheduleLabel');
  const retLabel = document.getElementById('returnScheduleLabel');
  if (outLabel) outLabel.innerHTML = `<span class="clean-dot navy"></span><span>Outbound</span>`;
  if (retLabel) retLabel.innerHTML = `<span class="clean-dot orange"></span><span>Return</span>`;
};

window._currentMapPickerTarget = 'pickup';

window.openMapPickerModal = function (targetType) {
  window._currentMapPickerTarget = targetType;
  const modal = document.getElementById('modal-mapPicker');
  if (!modal) return;

  const titleEl = document.getElementById('mapPickerTitle');
  const headerIcon = document.getElementById('mapPickerHeaderIcon');
  const pinBubble = document.getElementById('mapPinBubble');
  const pinTriangle = document.getElementById('mapPinTriangle');
  const pinLabel = document.getElementById('mapPinLabel');
  const pillsTitle = document.getElementById('mapPickerPillsTitle');
  const gatesRow = document.getElementById('mapPickerGatesRow');
  const addrInput = document.getElementById('mapPickerAddressInput');

  const isSchool = targetType === 'school';

  if (titleEl) titleEl.textContent = isSchool ? 'Select School Gate & Drop-off Pin' : 'Pinpoint Pickup Location';
  if (pillsTitle) pillsTitle.textContent = isSchool ? 'School Gate Presets' : 'Pickup Presets';

  if (isSchool) {
    if (headerIcon) {
      headerIcon.setAttribute('data-lucide', 'graduation-cap');
      headerIcon.style.color = 'var(--color-secondary)';
    }
    if (pinBubble) {
      pinBubble.className = 'map-pin-bubble orange';
      if (pinLabel) pinLabel.textContent = 'School Gate';
    }
    if (pinTriangle) pinTriangle.className = 'map-pin-triangle orange';

    const inputSchool = document.getElementById('setupSchoolLocationInput');
    const currentSchoolVal = (inputSchool && inputSchool.value) ? inputSchool.value : 'Greenfield International School';
    if (addrInput) addrInput.value = currentSchoolVal;

    const schoolGates = [
      { label: 'Gate 1 (Main Entrance)', addr: 'Greenfield International School, Gate 1 Main Entrance' },
      { label: 'Gate 2 (Bus Loop)', addr: 'Greenfield International School, Gate 2 Bus Loop' },
      { label: 'West Wing (Kindergarten)', addr: 'Greenfield International School, West Wing Kindergarten Drop' },
      { label: 'Athletics Complex', addr: 'Greenfield International School, Athletics Complex Door B' }
    ];

    if (gatesRow) {
      gatesRow.innerHTML = schoolGates.map((g, idx) => `
        <button type="button" class="map-gate-pill ${idx === 0 ? 'active' : ''}" onclick="selectMapGate('${g.label.replace(/'/g, "\\'")}', '${g.addr.replace(/'/g, "\\'")}', this)">
          ${g.label}
        </button>
      `).join('');
    }
  } else {
    if (headerIcon) {
      headerIcon.setAttribute('data-lucide', 'home');
      headerIcon.style.color = 'var(--color-primary)';
    }
    if (pinBubble) {
      pinBubble.className = 'map-pin-bubble navy';
      if (pinLabel) pinLabel.textContent = 'Pickup Pin';
    }
    if (pinTriangle) pinTriangle.className = 'map-pin-triangle navy';

    const inputPickup = document.getElementById('setupPickupLocationInput');
    const currentPickupVal = (inputPickup && inputPickup.value) ? inputPickup.value : '12 Elm Street, Toronto';
    if (addrInput) addrInput.value = currentPickupVal;

    const pickupPresets = [
      { label: 'Front Porch', addr: `${currentPickupVal} (Front Porch)` },
      { label: 'Curbside / Driveway', addr: `${currentPickupVal} (Driveway)` },
      { label: 'Corner of Street', addr: `${currentPickupVal} (Street Corner)` },
      { label: 'Side Entrance', addr: `${currentPickupVal} (Side Gate)` }
    ];

    if (gatesRow) {
      gatesRow.innerHTML = pickupPresets.map((g, idx) => `
        <button type="button" class="map-gate-pill ${idx === 0 ? 'active' : ''}" onclick="selectMapGate('${g.label.replace(/'/g, "\\'")}', '${g.addr.replace(/'/g, "\\'")}', this)">
          ${g.label}
        </button>
      `).join('');
    }
  }

  modal.style.display = 'flex';

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.closeMapPickerModal = function () {
  const modal = document.getElementById('modal-mapPicker');
  if (modal) modal.style.display = 'none';
};

window.selectMapGate = function (label, addr, btnEl) {
  const addrInput = document.getElementById('mapPickerAddressInput');
  if (addrInput) addrInput.value = addr;
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.map-gate-pill').forEach(p => p.classList.remove('active'));
    btnEl.classList.add('active');
  }
  const pinLabel = document.getElementById('mapPinLabel');
  if (pinLabel) pinLabel.textContent = label.split('(')[0].trim();
};

window.handleMapCanvasClick = function (e) {
  const canvas = document.getElementById('mapPickerCanvas');
  const pinAnchor = document.getElementById('mapPickerPinAnchor');
  if (!canvas || !pinAnchor) return;
  const rect = canvas.getBoundingClientRect();
  const x = Math.max(20, Math.min(rect.width - 20, e.clientX - rect.left));
  const y = Math.max(25, Math.min(rect.height - 25, e.clientY - rect.top));

  pinAnchor.style.position = 'absolute';
  pinAnchor.style.left = `${x}px`;
  pinAnchor.style.top = `${y}px`;
  pinAnchor.style.transform = 'translate(-50%, -100%)';

  const isSchool = window._currentMapPickerTarget === 'school';
  const addrInput = document.getElementById('mapPickerAddressInput');
  if (addrInput) {
    if (isSchool) {
      addrInput.value = `Greenfield School Gate Pin (GPS: 43.${Math.round(6500 + y * 2)}, -79.${Math.round(3800 + x * 2)})`;
    } else {
      addrInput.value = `Home Adjusted Pin (GPS: 43.${Math.round(6500 + y * 2)}, -79.${Math.round(3800 + x * 2)})`;
    }
  }
};

window.confirmMapLocation = function () {
  const addrInput = document.getElementById('mapPickerAddressInput');
  const selectedAddr = addrInput ? addrInput.value.trim() : '';
  if (!selectedAddr) {
    if (typeof showToast === 'function') showToast('Please enter or select a valid location');
    return;
  }

  const targetType = window._currentMapPickerTarget || 'pickup';
  if (targetType === 'school') {
    const inputS = document.getElementById('setupSchoolLocationInput');
    const hiddenS = document.getElementById('setupSchoolLocation');
    if (inputS) inputS.value = selectedAddr;
    if (hiddenS) hiddenS.value = selectedAddr;
    window.appState.bookingDraft.schoolLocation = selectedAddr;
    if (typeof showToast === 'function') showToast('School drop-off pin updated!');
  } else {
    const inputP = document.getElementById('setupPickupLocationInput');
    const hiddenP = document.getElementById('setupPickupLocation');
    if (inputP) inputP.value = selectedAddr;
    if (hiddenP) hiddenP.value = selectedAddr;
    window.appState.bookingDraft.pickupLocation = selectedAddr;
    if (typeof showToast === 'function') showToast('Pickup location pin updated!');
  }

  window.syncLocationInput(targetType, selectedAddr);
  window.closeMapPickerModal();
};

window.openAddLocationModal = function () {
  const modal = document.getElementById('modal-addBookingLocation');
  if (modal) {
    modal.style.display = 'flex';
    const input = document.getElementById('newLocName');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 80);
    }
    const stInput = document.getElementById('newLocStreet');
    if (stInput) stInput.value = '';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeAddLocationModal = function () {
  const modal = document.getElementById('modal-addBookingLocation');
  if (modal) modal.style.display = 'none';
};

window.handleSaveNewBookingLocation = function (e) {
  if (e && e.preventDefault) e.preventDefault();
  const nameInput = document.getElementById('newLocName');
  const streetInput = document.getElementById('newLocStreet');
  const catInput = document.querySelector('input[name="newLocCategory"]:checked');

  const name = nameInput ? nameInput.value.trim() : '';
  const street = streetInput ? streetInput.value.trim() : '';
  const type = catInput ? catInput.value : 'home';

  if (!name || !street) {
    if (typeof showToast === 'function') showToast('Please enter both location name and address', 'warning');
    return;
  }

  const newId = `loc-${Date.now()}`;
  const newLocation = {
    id: newId,
    name,
    street,
    type,
    isDefault: false
  };

  if (!window.appState.savedLocations) window.appState.savedLocations = [];
  window.appState.savedLocations.push(newLocation);

  window.closeAddLocationModal();
  window.renderBookingSavedLocations();
  window.applySavedBookingLocation(newId);

  if (typeof showToast === 'function') showToast(`Added "${name}" to saved locations!`);
};

window.applyPresetLocation = function (type, address, fullVal, btnEl) {
  if (type === 'pickup') {
    const pEl = document.getElementById('setupPickupLocation');
    const dispP = document.getElementById('displayPickupAddr');
    if (pEl) pEl.value = fullVal;
    if (dispP) dispP.textContent = address;
    window.appState.bookingDraft.pickupLocation = fullVal;
  } else if (type === 'school') {
    const sEl = document.getElementById('setupSchoolLocation');
    const dispS = document.getElementById('displaySchoolAddr');
    if (sEl) sEl.value = fullVal;
    if (dispS) dispS.textContent = address;
    window.appState.bookingDraft.schoolLocation = fullVal;
  }

  const dispP = document.getElementById('displayPickupAddr');
  const dispS = document.getElementById('displaySchoolAddr');
  const outLabel = document.getElementById('outboundScheduleLabel');
  const retLabel = document.getElementById('returnScheduleLabel');
  if (outLabel) outLabel.innerHTML = `<span class="clean-dot navy"></span><span>Outbound</span>`;
  if (retLabel) retLabel.innerHTML = `<span class="clean-dot orange"></span><span>Return</span>`;

  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.clean-quick-chip').forEach(c => c.classList.remove('active'));
    btnEl.classList.add('active');
  }
};

window.loadTripPreset = function (type) {
  const btn2R = document.getElementById('presetBtn_2way_recurring');
  const btn1R = document.getElementById('presetBtn_1way_recurring');
  const btn2O = document.getElementById('presetBtn_2way_onetime');
  const btn1O = document.getElementById('presetBtn_1way_onetime');
  [btn2R, btn1R, btn2O, btn1O].forEach(b => b?.classList.remove('active'));

  const activeBtn = document.getElementById(`presetBtn_${type}`);
  if (activeBtn) activeBtn.classList.add('active');

  const outInput = document.getElementById('setupOutboundTime') || document.getElementById('setupMorningTime');
  const retInput = document.getElementById('setupReturnTime');
  const pickupInput = document.getElementById('setupPickupLocation');
  const schoolInput = document.getElementById('setupSchoolLocation');
  const dateInput = document.getElementById('setupTripDate');
  const startDateInput = document.getElementById('setupStartDate');

  if (type === '2way_recurring') {
    window.setTripDirection('bothway');
    window.setBookingFrequency('recurring');
    window.updateTripTime('outbound', '07:30');
    window.updateTripTime('return', '13:00');
    if (outInput) outInput.value = '07:30';
    if (retInput) retInput.value = '13:00';
    if (pickupInput) pickupInput.value = 'Home (12 Elm Street)';
    if (schoolInput) schoolInput.value = 'Greenfield International School';
    if (startDateInput) startDateInput.value = '2026-05-25';
    window.appState.bookingDraft.pickupLocation = 'Home (12 Elm Street)';
    window.appState.bookingDraft.schoolLocation = 'Greenfield International School';
  } else if (type === '1way_recurring') {
    window.setTripDirection('oneway');
    window.setBookingFrequency('recurring');
    window.updateTripTime('outbound', '07:45');
    if (outInput) outInput.value = '07:45';
    if (pickupInput) pickupInput.value = 'Home (12 Elm Street)';
    if (schoolInput) schoolInput.value = 'Greenfield International School';
    if (startDateInput) startDateInput.value = '2026-05-25';
    window.appState.bookingDraft.pickupLocation = 'Home (12 Elm Street)';
    window.appState.bookingDraft.schoolLocation = 'Greenfield International School';
  } else if (type === '2way_onetime') {
    window.setTripDirection('bothway');
    window.setBookingFrequency('onetime');
    window.updateTripTime('outbound', '08:30');
    window.updateTripTime('return', '14:30');
    if (outInput) outInput.value = '08:30';
    if (retInput) retInput.value = '14:30';
    if (pickupInput) pickupInput.value = 'Home (12 Elm Street)';
    if (schoolInput) schoolInput.value = 'Sunshine Pre-school';
    if (dateInput) dateInput.value = '2026-05-29';
    window.appState.bookingDraft.pickupLocation = 'Home (12 Elm Street)';
    window.appState.bookingDraft.schoolLocation = 'Sunshine Pre-school';
    window.appState.bookingDraft.tripDate = 'Friday, May 29, 2026';
  } else if (type === '1way_onetime') {
    window.setTripDirection('oneway');
    window.setBookingFrequency('onetime');
    window.updateTripTime('outbound', '08:15');
    if (outInput) outInput.value = '08:15';
    if (pickupInput) pickupInput.value = 'Home (12 Elm Street)';
    if (schoolInput) schoolInput.value = 'Sunshine Pre-school';
    if (dateInput) dateInput.value = '2026-05-23';
    window.appState.bookingDraft.pickupLocation = 'Home (12 Elm Street)';
    window.appState.bookingDraft.schoolLocation = 'Sunshine Pre-school';
    window.appState.bookingDraft.tripDate = 'Thursday, May 23, 2026';
  }

  if (window.lucide) window.lucide.createIcons();
};

window.selectQuickLocation = function (type, address, btnEl) {
  if (type === 'pickup') {
    const input = document.getElementById('setupPickupLocation');
    if (input) input.value = address;
    window.appState.bookingDraft.pickupLocation = address;
    if (btnEl) {
      const parent = btnEl.parentElement;
      if (parent) {
        parent.querySelectorAll('.quick-loc-chip').forEach(c => c.classList.remove('active'));
      }
      btnEl.classList.add('active');
    }
  } else if (type === 'school') {
    const input = document.getElementById('setupSchoolLocation');
    if (input) input.value = address;
    window.appState.bookingDraft.schoolLocation = address;
    if (btnEl) {
      const parent = btnEl.parentElement;
      if (parent) {
        parent.querySelectorAll('.quick-loc-chip').forEach(c => c.classList.remove('active'));
      }
      btnEl.classList.add('active');
    }
  }
};

window.updateTripTime = function (type, timeVal) {
  const formatTime = (t) => {
    if (!t) return t;
    const parts = t.split(':');
    if (parts.length < 2) return t;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
  };

  if (type === 'morning' || type === 'outbound') {
    window.appState.bookingDraft.outboundTime = formatTime(timeVal);
  } else if (type === 'return') {
    window.appState.bookingDraft.returnTime = formatTime(timeVal);
  }
};

/* Service Type Selector (All | Driver | WalkShare) */
window.setServiceType = function (serviceType) {
  if (!window.appState.bookingDraft) {
    window.appState.bookingDraft = {};
  }
  window.appState.bookingDraft.serviceType = serviceType;

  const btnAll = document.getElementById('btnServiceAll');
  const btnDriver = document.getElementById('btnServiceDriver');
  const btnWalk = document.getElementById('btnServiceWalk');

  if (btnAll) btnAll.classList.toggle('active', serviceType === 'all');
  if (btnDriver) btnDriver.classList.toggle('active', serviceType === 'drivers');
  if (btnWalk) btnWalk.classList.toggle('active', serviceType === 'walkshare');
};

window.proceedFromTripSetup = function () {
  const inputPickupEl = document.getElementById('setupPickupLocationInput');
  const inputSchoolEl = document.getElementById('setupSchoolLocationInput');
  const pickupEl = document.getElementById('setupPickupLocation');
  const schoolEl = document.getElementById('setupSchoolLocation');

  const pVal = (inputPickupEl && inputPickupEl.value.trim()) || (pickupEl && pickupEl.value.trim());
  const sVal = (inputSchoolEl && inputSchoolEl.value.trim()) || (schoolEl && schoolEl.value.trim());

  if (pVal) window.appState.bookingDraft.pickupLocation = pVal;
  if (sVal) window.appState.bookingDraft.schoolLocation = sVal;
  const morningTimeEl = document.getElementById('setupOutboundTime') || document.getElementById('setupMorningTime');
  const returnTimeEl = document.getElementById('setupReturnTime');

  if (pickupEl && pickupEl.value.trim()) {
    window.appState.bookingDraft.pickupLocation = pickupEl.value.trim();
  }
  if (schoolEl && schoolEl.value.trim()) {
    window.appState.bookingDraft.schoolLocation = schoolEl.value.trim();
  }

  const formatTime = (t) => {
    if (!t) return t;
    const parts = t.split(':');
    if (parts.length < 2) return t;
    let h = parseInt(parts[0], 10);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h < 10 ? '0' + h : h}:${m} ${ampm}`;
  };

  if (morningTimeEl && morningTimeEl.value) {
    window.appState.bookingDraft.outboundTime = formatTime(morningTimeEl.value);
  }
  if (window.appState.bookingDraft.direction === 'bothway') {
    if (returnTimeEl && returnTimeEl.value) {
      window.appState.bookingDraft.returnTime = formatTime(returnTimeEl.value);
    }
  } else {
    window.appState.bookingDraft.returnTime = '';
  }

  // Detect active Service Type
  const activeServiceBtn = document.querySelector('.clean-service-btn.active');
  if (activeServiceBtn) {
    if (activeServiceBtn.id === 'btnServiceAll') window.appState.bookingDraft.serviceType = 'all';
    else if (activeServiceBtn.id === 'btnServiceDriver') window.appState.bookingDraft.serviceType = 'drivers';
    else if (activeServiceBtn.id === 'btnServiceWalk') window.appState.bookingDraft.serviceType = 'walkshare';
  }

  const toggleEl = document.getElementById('toggleRecurringRide');
  if (toggleEl) {
    window.appState.bookingDraft.frequency = toggleEl.checked ? 'recurring' : 'onetime';
  }

  if (window.appState.bookingDraft.frequency === 'recurring') {
    const activeDays = Array.from(document.querySelectorAll('#cleanDaysGrid .clean-day-btn.active'))
      .map(b => b.getAttribute('data-day') || b.textContent.trim());
    window.appState.bookingDraft.selectedDays = activeDays;
  } else {
    window.appState.bookingDraft.selectedDays = [];
  }

  window.navigateTo('bookingSearchProviders');

  // Immediately apply chosen serviceType filter on search results
  const selectedType = window.appState.bookingDraft.serviceType || 'all';
  window.filterBookingProviders(selectedType);
};

window.filterBookingProviders = function (filterType, btnEl) {
  if (btnEl && btnEl.parentElement) {
    btnEl.parentElement.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
    btnEl.classList.add('active');
  } else {
    // Sync filter chip buttons programmatically
    const chips = document.querySelectorAll('.filters-scroll-bar .filter-chip-btn');
    chips.forEach(b => {
      const onclickAttr = b.getAttribute('onclick') || '';
      if (onclickAttr.includes(`'${filterType}'`)) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    });
  }

  // Sync back to bookingDraft if core service type
  if (['all', 'drivers', 'walkshare'].includes(filterType)) {
    if (window.appState && window.appState.bookingDraft) {
      window.appState.bookingDraft.serviceType = filterType;
    }
  }

  // Toggle WalkShare helper info banner for parents
  const banner = document.getElementById('walkshareInfoBanner');
  if (banner) {
    banner.style.display = filterType === 'walkshare' ? 'flex' : 'none';
  }

  const cards = document.querySelectorAll('#providersResultList .provider-result-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    const rating = parseFloat(card.getAttribute('data-rating') || '0');
    const verified = card.getAttribute('data-verified') === 'true';

    let show = true;
    if (filterType === 'drivers') {
      show = cat === 'drivers';
    } else if (filterType === 'walkshare') {
      show = cat === 'walkshare';
    } else if (filterType === 'toprated') {
      show = rating >= 4.9;
    } else if (filterType === 'verified') {
      show = verified;
    }
    card.style.display = show ? 'flex' : 'none';
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

/* ==========================================================
   Booking Wizard & Driver / Chaperone Profile Viewer
   ========================================================== */
window.currentDriverProfileReturnScreen = 'home';
window.currentDriverProfileId = 'tariq';

window.openDriverProfile = function (providerIdOrName, returnScreen) {
  if (returnScreen) {
    window.currentDriverProfileReturnScreen = returnScreen;
  } else if (!window.currentDriverProfileReturnScreen) {
    window.currentDriverProfileReturnScreen = window.currentScreen || 'home';
  }

  let provider = null;
  if (providerIdOrName) {
    const term = String(providerIdOrName).toLowerCase().trim();
    provider = window.appState.providers.find(p => p.id === term || p.name.toLowerCase().includes(term));
  }
  if (!provider) {
    provider = window.appState.providers[0];
  }

  window.currentDriverProfileId = provider.id;

  const isWalk = provider.category === 'walkshare' || provider.id === 'sarah' || provider.id === 'elena';

  // Update elements in screen-bookingProviderDetails
  const imgEl = document.getElementById('detailsProviderImg');
  const nameEl = document.getElementById('detailsProviderName');
  const ratingEl = document.getElementById('detailsProviderRatingVal');
  const reviewsEl = document.getElementById('detailsProviderReviewsLbl');
  const quoteEl = document.getElementById('detailsProviderQuote');
  const reviewerEl = document.getElementById('detailsProviderReviewer');
  const titleEl = document.getElementById('providerDetailsTitle');
  const bioEl = document.getElementById('detailsProviderBio');

  if (titleEl) titleEl.textContent = isWalk ? `${provider.name.split(' ')[0]}'s Profile` : `${provider.name.split(' ')[0]}'s Profile`;
  if (imgEl) {
    imgEl.src = provider.photo || '/assets/avatar_tariq.jpg';
    imgEl.alt = provider.name;
    imgEl.style.borderColor = isWalk ? '#10B981' : '#E2E8F0';
    imgEl.onerror = function () { this.src = '/assets/avatar_tariq.jpg'; };
  }
  if (nameEl) nameEl.textContent = provider.name;
  if (ratingEl) ratingEl.textContent = `★ ${provider.rating} (${provider.reviewsCount || 128} reviews)`;
  if (reviewsEl) reviewsEl.textContent = `${provider.reviewsCount || 128} Reviews`;

  // Stat Pillars adaptation
  const expPillar = document.getElementById('detailsProviderExpPillar');
  const tripsPillar = document.getElementById('detailsProviderTripsPillar');
  const onTimePillar = document.getElementById('detailsProviderOnTimePillar');

  if (expPillar) expPillar.textContent = provider.experience || '5+ Yrs';
  if (tripsPillar) {
    tripsPillar.textContent = isWalk ? '320+' : '500+';
    if (tripsPillar.nextElementSibling) tripsPillar.nextElementSibling.textContent = isWalk ? 'Walks' : 'Trips';
  }
  if (onTimePillar) {
    onTimePillar.textContent = provider.onTimeRate || '100%';
    if (onTimePillar.nextElementSibling) onTimePillar.nextElementSibling.textContent = isWalk ? 'Safe Record' : 'On-time';
  }

  // Showcase Box adaptation: Vehicle vs Walk Route
  const vehTitleEl = document.getElementById('detailsProviderVehTitle');
  const vehSpecsEl = document.getElementById('detailsProviderVehSpecs');
  const vehBox = document.querySelector('.clean-veh-showcase-box');

  if (vehTitleEl) {
    vehTitleEl.textContent = isWalk 
      ? `Walking School Bus (${provider.vehicle || 'Escorted Route'})`
      : (provider.vehicle || 'Toyota Sienna');
  }
  if (vehSpecsEl) {
    vehSpecsEl.textContent = isWalk
      ? `0.4 km · Safe Sidewalk Route · Crossing Guard Monitored · Max 5 Kids`
      : `4 seats · 2023 Clean · Plate: ${provider.plate || 'H2S-782'}`;
  }

  if (vehBox) {
    const iconWrap = vehBox.querySelector('div > div > div:first-child');
    if (iconWrap) {
      if (isWalk) {
        iconWrap.style.background = '#ECFDF5';
        iconWrap.style.color = '#047857';
        iconWrap.innerHTML = '<i data-lucide="footprints" style="width: 22px; height: 22px;"></i>';
      } else {
        iconWrap.style.background = 'rgba(27, 43, 104, 0.08)';
        iconWrap.style.color = 'var(--color-primary)';
        iconWrap.innerHTML = '<i data-lucide="car" style="width: 22px; height: 22px;"></i>';
      }
    }
  }

  if (bioEl) {
    if (isWalk) {
      bioEl.textContent = 'Certified neighborhood walking school bus leader. We walk safely as a supervised group along sidewalks, observing crossing guard signals. Children stay healthy, active, and arrive safely every morning.';
    } else {
      bioEl.textContent = 'Experienced school transport provider with a strong focus on child safety. Verified background check and CPR certified.';
    }
  }

  const bookBtnEl = document.getElementById('btnBookWithProvider');
  if (bookBtnEl) {
    bookBtnEl.textContent = isWalk 
      ? `Book WalkShare with ${provider.name.split(' ')[0]}`
      : `Book with ${provider.name.split(' ')[0]}`;
    bookBtnEl.onclick = function () {
      window.appState.bookingDraft.providerId = provider.id;
      navigateTo('bookingSummary');
    };
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  window.navigateTo('bookingProviderDetails');
};

window.handleProviderDetailsBack = function () {
  const target = window.currentDriverProfileReturnScreen || 'home';
  window.navigateTo(target);
};

window.selectProviderAndReview = function (name) {
  const provider = window.appState.providers.find(p => p.name.includes(name) || p.id === name) || window.appState.providers[0];
  window.appState.bookingDraft.providerId = provider.id;
  window.openDriverProfile(provider.id, 'bookingSearchProviders');
};

/* ==========================================================
   Booking Wizard: Step 4 Dynamic Summary & Calculations
   ========================================================== */
function calculateDraftPrice() {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const count = window.appState.selectedChildIds.length || 1;
  const isWalk = provider.category === 'walkshare' || provider.id === 'sarah' || provider.id === 'elena';

  let baseRate = provider.baseWeekly || (isWalk ? 75 : 120);

  if (draft.frequency === 'onetime') {
    // One-time single trip flat rate
    baseRate = isWalk ? (draft.direction === 'bothway' ? 35 : 20) : (draft.direction === 'bothway' ? 55 : 35);
    const insurance = isWalk ? 3 : 5;
    const discount = count > 1 ? Math.round(baseRate * 0.2 * (count - 1)) : 0;
    const total = (baseRate * count) - discount + insurance;
    return {
      baseRate: baseRate * count,
      discount,
      insurance,
      total,
      period: 'total'
    };
  }

  // Recurring weekly commute rate
  if (draft.direction === 'oneway') {
    baseRate = Math.round(baseRate * 0.55); // 55% for morning drop-off only
  }

  let discount = 0;
  if (count > 1) {
    discount = Math.round(baseRate * 0.2 * (count - 1));
  }

  const insurance = isWalk ? 4 : 8;
  const total = (baseRate * count) - discount + insurance;

  return {
    baseRate: baseRate * count,
    discount,
    insurance,
    total,
    period: 'week'
  };
}

function renderBookingSummary() {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const isWalk = provider.category === 'walkshare' || provider.id === 'sarah' || provider.id === 'elena';
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
  if (dirEl) {
    dirEl.textContent = draft.direction === 'bothway' ? '⇄ Round Trip' : '→ One Way';
  }

  const cleanLoc = (loc) => {
    if (!loc) return 'Home';
    if (loc.includes('Home')) return 'Home';
    if (loc.includes('Willowbrook')) return "Grandma's";
    return loc.split(',')[0].trim();
  };
  const cleanSchool = (sch) => {
    if (!sch) return 'School';
    if (sch.includes('Greenfield')) return 'Greenfield School';
    if (sch.includes('Sunshine')) return 'Sunshine Pre-school';
    return sch.split(',')[0].trim();
  };

  const pickupShort = cleanLoc(draft.pickupLocation);
  const schoolShort = cleanSchool(draft.schoolLocation);

  const walkSuffix = isWalk ? ' · Chaperoned Walk' : '';
  if (outboundEl) outboundEl.textContent = `${pickupShort} → ${schoolShort} (${draft.outboundTime || '07:30 AM'}${walkSuffix})`;
  if (returnEl) {
    if (draft.direction === 'bothway') {
      returnEl.textContent = `${schoolShort} → ${pickupShort} (${draft.returnTime || '01:00 PM'}${walkSuffix})`;
      returnEl.parentElement.style.display = 'flex';
    } else {
      returnEl.parentElement.style.display = 'none';
    }
  }

  if (freqEl) {
    freqEl.textContent = draft.frequency === 'recurring' 
      ? 'Recurring (Mon – Fri Commute)' 
      : `One-Time Ride (${draft.tripDate || 'Single Day Pass'})`;
  }
  if (providerEl) {
    providerEl.textContent = isWalk 
      ? `${provider.name} (WalkShare Escort)` 
      : `${provider.name} (${provider.vehicle.split('(')[0].trim()})`;
  }

  // Price calculations & dynamic labels
  const price = calculateDraftPrice();
  const baseEl = document.getElementById('summaryBasePriceText');
  const discEl = document.getElementById('summaryDiscountPriceText');
  const totalEl = document.getElementById('summaryTotalPriceText');
  const baseLbl = document.getElementById('summaryBasePriceLabel');
  const totalLbl = document.getElementById('summaryTotalPriceLabel');

  if (baseEl) baseEl.textContent = `$${price.baseRate}.00`;
  if (discEl) discEl.textContent = price.discount > 0 ? `-$${price.discount}.00` : '$0.00';

  if (draft.frequency === 'onetime') {
    if (baseLbl) baseLbl.textContent = 'Single Ride Base Fare';
    if (totalLbl) totalLbl.textContent = 'Total One-Time Amount';
    if (totalEl) totalEl.textContent = `$${price.total}.00 Flat Rate`;
  } else {
    if (baseLbl) baseLbl.textContent = 'Weekly Base Rate';
    if (totalLbl) totalLbl.textContent = 'Total Weekly Amount';
    if (totalEl) totalEl.textContent = `$${price.total}.00 / week`;
  }
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
    scheduleText: draft.frequency === 'recurring'
      ? (draft.direction === 'bothway' 
          ? `Mon–Fri • Outbound: ${draft.outboundTime} | Return: ${draft.returnTime}` 
          : `Mon–Fri • Outbound: ${draft.outboundTime} (Morning Commute)`)
      : (draft.direction === 'bothway'
          ? `${draft.tripDate || 'Single Day'} • ${draft.outboundTime} & ${draft.returnTime}`
          : `${draft.tripDate || 'Single Day'} • ${draft.outboundTime}`),
    pickupLocation: draft.pickupLocation,
    schoolLocation: draft.schoolLocation,
    outboundTime: draft.outboundTime,
    returnTime: draft.direction === 'bothway' ? draft.returnTime : '',
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
  if (totalEl) {
    totalEl.textContent = active.frequency === 'recurring' 
      ? `$${active.amount}.00 / week (Recurring)` 
      : `$${active.amount}.00 Flat Rate (One-Time)`;
  }
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
  window.currentBookingProviderId = provider.id;
  const children = booking.childIds.map(id => window.appState.children.find(ch => ch.id === id)).filter(Boolean);

  // Reference & status
  const refEl = document.getElementById('detailRefId');
  const statusEl = document.getElementById('detailStatusBadge');
  const titleEl = document.getElementById('detailHeaderTitle');
  const subEl = document.getElementById('detailHeaderSubtitle');

  if (refEl) refEl.textContent = booking.id.startsWith('#') ? booking.id : `#${booking.id}`;
  if (titleEl) titleEl.textContent = booking.schoolLocation || 'School Commute';

  // Child Boarding Safety PIN (Unique real-world student security concept)
  const pin = booking.id.replace(/\D/g, '').slice(-4) || '8492';
  const pinEl = document.getElementById('detailSafetyPin');
  const modalPinEl = document.getElementById('modalSafetyPinText');
  const modalSubEl = document.getElementById('modalSafetyPinSub');
  const modalVehEl = document.getElementById('modalSafetyVehicleSub');

  if (pinEl) pinEl.textContent = pin;
  if (modalPinEl) modalPinEl.textContent = pin;
  if (modalSubEl) modalSubEl.textContent = `Assigned: ${children.map(c => c.name).join(' & ')}`;
  if (modalVehEl) modalVehEl.textContent = `Vehicle: ${provider.vehicle} (${provider.plate})`;

  if (statusEl) {
    if (booking.status === 'in_progress') {
      statusEl.className = 'status-chip in-progress';
      statusEl.innerHTML = '<span class="live-pulse-dot"></span> In Transit';
    } else if (booking.status === 'confirmed') {
      statusEl.className = 'status-chip confirmed';
      statusEl.textContent = 'Scheduled';
    } else {
      statusEl.className = `status-chip ${booking.status}`;
      statusEl.textContent = booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1).toLowerCase() : '';
    }
  }

  // Direction & frequency subtitle in top card
  if (subEl) {
    let subText = '';
    if (booking.direction === 'bothway' && booking.frequency === 'recurring') {
      subText = '⇄ Round Trip • Recurring (Mon–Fri)';
    } else if (booking.direction === 'oneway' && booking.frequency === 'recurring') {
      subText = '→ One Way • Recurring (Mon–Fri)';
    } else if (booking.direction === 'bothway' && booking.frequency === 'onetime') {
      subText = '⇄ Round Trip • Day Pass';
    } else {
      subText = '→ One Way • Single Trip';
    }
    subEl.textContent = subText;
  }

  // Children passengers
  const passWrap = document.getElementById('detailPassengersWrap');
  if (passWrap) {
    const isLive = booking.status === 'in_progress';
    passWrap.innerHTML = children.map((c, idx) => {
      const photoSrc = c.photo || (c.id === 'arman' ? '/assets/avatar_arman.jpg' : c.id === 'emma' ? '/assets/avatar_emma.jpg' : '/assets/avatar_zara.jpg');
      const badgeText = isLive ? 'On Board' : 'Confirmed';
      const gradeAge = [c.grade, c.age].filter(Boolean).join(' • ') || 'Student';
      return `
        <div style="display:flex; align-items:center; justify-content:space-between; padding: 8px 0; ${idx < children.length - 1 ? 'border-bottom: 1px solid #F1F5F9;' : ''}">
          <div style="display:flex; align-items:center; gap:12px;">
            <img src="${photoSrc}" alt="${c.name}" class="child-photo-avatar" style="width:38px; height:38px; border-radius:50%; object-fit:cover; border:1px solid #E2E8F0;" onerror="this.src='/assets/avatar_arman.jpg';" />
            <div>
              <div style="font-size:14px;font-weight:800;color:var(--color-title); line-height:1.2;">${c.name}</div>
              <div style="font-size:12px;color:var(--color-body); margin-top: 2px;">${gradeAge}</div>
            </div>
          </div>
          <span style="font-size:11px; font-weight:700; color:#15803D; background:#F0FDF4; padding:3px 8px; border-radius:99px; border:1px solid #DCFCE7; white-space:nowrap;">${badgeText}</span>
        </div>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  // Route breakdown
  const outTime = document.getElementById('detailOutboundTime');
  const retTime = document.getElementById('detailReturnTime');
  const retBox = document.getElementById('detailReturnLegBox');

  if (outTime) outTime.textContent = booking.outboundTime || '07:30 AM';
  if (retTime) retTime.textContent = booking.returnTime || 'N/A';
  if (retBox) {
    retBox.style.display = booking.direction === 'bothway' ? 'flex' : 'none';
  }

  // Provider info
  const pName = document.getElementById('detailProviderName');
  const pVeh = document.getElementById('detailProviderVehicle');
  const pRating = document.getElementById('detailProviderRating');
  const pPhoto = document.getElementById('detailDriverPhoto');

  if (pName) pName.textContent = provider.name;
  if (pVeh) pVeh.textContent = `${provider.vehicle} • ${provider.plate}`;
  if (pRating) pRating.textContent = `★ ${provider.rating} (${provider.reviewsCount} reviews)`;
  if (pPhoto && provider.photo) pPhoto.src = provider.photo;

  // Payment
  const pAmount = document.getElementById('detailTotalAmount');
  const pMethod = document.getElementById('detailPayMethod');
  if (pAmount) {
    pAmount.textContent = booking.frequency === 'recurring' 
      ? `$${booking.amount}.00 / wk` 
      : `$${booking.amount}.00`;
  }
  if (pMethod) pMethod.textContent = booking.paymentMethod || 'Visa •••• 4242';

  // Dynamic Contextual Actions based on status (Clean, uncluttered, top-tier UX)
  const actionsWrap = document.getElementById('detailContextualActions');
  if (actionsWrap) {
    if (booking.status === 'in_progress') {
      actionsWrap.innerHTML = `
        <div class="booking-status-tip-card live" style="margin-bottom: 4px;">
          <div class="status-tip-icon" style="background: #DCFCE7;">
            <span class="live-pulse-dot" style="margin: 0;"></span>
          </div>
          <div class="status-tip-text">
            <div class="status-tip-title" style="color: #14532D;">Live Ride in Progress</div>
            <div class="status-tip-sub" style="color: #166534;">Driver ${provider.name} is en route • Est. school arrival <strong>07:42 AM</strong></div>
          </div>
        </div>

        <button class="btn-primary" onclick="navigateTo('tracking')" style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 50px; font-size: 15.5px; font-weight: 800; border-radius: 14px;">
          <span class="live-pulse-dot" style="background: #FFFFFF; box-shadow: 0 0 0 3px rgba(255,255,255,0.3);"></span>
          <span>Open Live GPS Tracking</span>
          <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
        </button>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 0;">
          <button type="button" onclick="openTripReport('${booking.id}')" style="background: none; border: none; font-size: 12.5px; font-weight: 600; color: #64748B; display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 4px 0;">
            <i data-lucide="help-circle" style="width: 14px; height: 14px;"></i>
            <span>Report Issue</span>
          </button>
          <button type="button" onclick="openEmergencySOSModal()" style="background: none; border: none; font-size: 12.5px; font-weight: 700; color: #DC2626; display: flex; align-items: center; gap: 5px; cursor: pointer; padding: 4px 0;">
            <i data-lucide="shield-alert" style="width: 14px; height: 14px;"></i>
            <span>SOS Emergency</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 2px;">
          <button type="button" class="btn-ghost-cancel" onclick="cancelBooking('${booking.id}')" style="font-size: 12px; color: #94A3B8; padding: 4px 8px;">
            <span>Cancel this active ride</span>
          </button>
        </div>
      `;
    } else if (booking.status === 'confirmed') {
      actionsWrap.innerHTML = `
        <div class="booking-status-tip-card upcoming" style="margin-bottom: 4px;">
          <div class="status-tip-icon" style="background: #E0F2FE;">
            <i data-lucide="calendar" style="width: 16px; height: 16px; color: #0284C7;"></i>
          </div>
          <div class="status-tip-text">
            <div class="status-tip-title" style="color: #0369A1;">Scheduled Commute</div>
            <div class="status-tip-sub" style="color: #0C4A6E;">Tomorrow at ${booking.outboundTime || '07:30 AM'}. Live GPS activates 15 mins prior.</div>
          </div>
        </div>

        <button class="btn-primary" onclick="openChatWith(window.currentBookingProviderId || 'tariq')" style="display: flex; align-items: center; justify-content: center; gap: 8px; height: 48px; font-size: 15px; font-weight: 700; border-radius: 14px;">
          <i data-lucide="message-square" style="width: 16px; height: 16px;"></i>
          <span>Message Driver</span>
        </button>

        <div style="display: flex; align-items: center; justify-content: space-between; padding: 4px 6px 0;">
          <button type="button" onclick="openTripReport('${booking.id}')" style="background: none; border: none; font-size: 12.5px; font-weight: 600; color: #64748B; display: flex; align-items: center; gap: 5px; cursor: pointer;">
            <i data-lucide="help-circle" style="width: 14px; height: 14px;"></i>
            <span>Trip Support</span>
          </button>
          <button type="button" class="btn-ghost-cancel" onclick="cancelBooking('${booking.id}')" style="font-size: 12px; color: #EF4444; padding: 0;">
            <span>Cancel booking</span>
          </button>
        </div>
      `;
    } else if (booking.status === 'pending') {
      actionsWrap.innerHTML = `
        <div class="booking-status-tip-card" style="margin-bottom: 6px;">
          <div class="status-tip-icon" style="background: #FEF3C7;">
            <i data-lucide="clock" style="width: 16px; height: 16px; color: #D97706;"></i>
          </div>
          <div class="status-tip-text">
            <div class="status-tip-title" style="color: #92400E;">Awaiting Escort Confirmation</div>
            <div class="status-tip-sub">The provider is reviewing your request. You will receive a notification once confirmed.</div>
          </div>
        </div>

        <button type="button" class="btn-ghost-cancel" onclick="cancelBooking('${booking.id}')" style="margin-top: 4px; font-size: 12.5px; color: #EF4444;">
          <i data-lucide="x-circle" style="width: 14px; height: 14px;"></i>
          <span>Withdraw Booking Request</span>
        </button>
      `;
    } else if (booking.status === 'completed') {
      actionsWrap.innerHTML = `
        <button class="btn-primary" onclick="navigateTo('rating')" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="star" style="width: 16px; height: 16px; fill: #F59E0B; color: #F59E0B;"></i>
          <span>Rate ${provider.name.split(' ')[0]} ⭐</span>
        </button>

        <div class="booking-utility-actions-grid">
          <button type="button" class="btn-utility-card" onclick="alert('Official receipt emailed to ${window.appState.user.email}')">
            <i data-lucide="file-text" style="width: 15px; height: 15px; color: #0284C7;"></i>
            <span>Official Receipt</span>
          </button>
          <button type="button" class="btn-utility-card" onclick="openTripReport('${booking.id}')">
            <i data-lucide="help-circle" style="width: 15px; height: 15px; color: #64748B;"></i>
            <span>Report Issue</span>
          </button>
        </div>

        <button type="button" class="btn-ghost-cancel" onclick="navigateTo('bookingSelectChildren')" style="color: var(--color-primary);">
          <i data-lucide="repeat" style="width: 13px; height: 13px;"></i>
          <span>Book again on this route</span>
        </button>
      `;
    } else if (booking.status === 'cancelled') {
      actionsWrap.innerHTML = `
        <div class="booking-status-tip-card" style="background: #FEF2F2; border-color: #FECACA;">
          <div class="status-tip-icon" style="background: #FEE2E2;">
            <i data-lucide="x-circle" style="width: 16px; height: 16px; color: #DC2626;"></i>
          </div>
          <div class="status-tip-text">
            <div class="status-tip-title" style="color: #991B1B;">Booking Cancelled</div>
            <div class="status-tip-sub" style="color: #B91C1C;">This school ride was cancelled. No charges were billed.</div>
          </div>
        </div>

        <button class="btn-primary" onclick="navigateTo('bookingSelectChildren')" style="margin-top: 6px;">
          Re-book This School Route
        </button>
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
   Bookings Screen: Filter Tabs & State-Specific Realistic Cards
   ========================================================== */
window.switchBookingTab = function (tab) {
  renderBookingsList(tab);
};

window.swapPickupDropoff = function () {
  const pEl = document.getElementById('setupPickupLocation');
  const sEl = document.getElementById('setupSchoolLocation');
  const inputP = document.getElementById('setupPickupLocationInput');
  const inputS = document.getElementById('setupSchoolLocationInput');
  const dispP = document.getElementById('displayPickupAddr');
  const dispS = document.getElementById('displaySchoolAddr');

  const valP = (inputP && inputP.value) || (pEl ? pEl.value : (dispP ? dispP.textContent : ''));
  const valS = (inputS && inputS.value) || (sEl ? sEl.value : (dispS ? dispS.textContent : ''));

  if (inputP && inputS) {
    inputP.value = valS;
    inputS.value = valP;
  }
  if (pEl && sEl) {
    pEl.value = valS;
    sEl.value = valP;
  }
  if (dispP && dispS) {
    dispP.textContent = valS;
    dispS.textContent = valP;
  }

  window.appState.bookingDraft.pickupLocation = valS;
  window.appState.bookingDraft.schoolLocation = valP;

  const outLabel = document.getElementById('outboundScheduleLabel');
  const retLabel = document.getElementById('returnScheduleLabel');
  if (outLabel) outLabel.innerHTML = `<span class="clean-dot navy"></span><span>Outbound</span>`;
  if (retLabel) retLabel.innerHTML = `<span class="clean-dot orange"></span><span>Return</span>`;

  if (typeof showToast === 'function') showToast('Swapped pickup and drop-off locations');
};

window.rebookRide = function (bookingId) {
  const b = window.appState.bookings.find(x => x.id === bookingId);
  if (b) {
    window.appState.bookingDraft = {
      ...window.appState.bookingDraft,
      childIds: b.childIds || ['arman'],
      pickupLocation: b.pickupLocation,
      schoolLocation: b.schoolLocation,
      direction: b.direction,
      frequency: b.frequency
    };
    if (typeof showToast === 'function') showToast(`Loaded booking for ${b.schoolLocation}`);
    navigateTo('bookingSelectChildren');
  }
};

window.openBookingReceipt = function (bookingId) {
  openBookingDetails(bookingId);
};

window.withdrawBookingRequest = function (bookingId) {
  if (confirm('Withdraw this pending ride request? No cancellation fees apply.')) {
    const b = window.appState.bookings.find(x => x.id === bookingId);
    if (b) {
      b.status = 'cancelled';
      b.cancelReason = 'Withdrawn by Parent prior to driver assignment';
      b.refundStatus = 'Full authorization released ($0 charged)';
      if (typeof showToast === 'function') showToast('Booking request withdrawn.');
      renderBookingsList('upcoming');
    }
  }
};

function renderBookingsList(tab) {
  const normTab = (tab === 'past' || tab === 'history') ? 'history' : tab;
  const btnU = document.getElementById('tabUpcoming');
  const btnH = document.getElementById('tabHistory') || document.getElementById('tabPast');
  const btnC = document.getElementById('tabCancelled');
  const wrap = document.getElementById('bookingsListWrap');

  // Dynamically update tab badges count
  const countU = window.appState.bookings.filter(b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress').length;
  const countH = window.appState.bookings.filter(b => b.status === 'completed').length;
  const countC = window.appState.bookings.filter(b => b.status === 'cancelled').length;
  if (btnU) btnU.textContent = `Upcoming (${countU})`;
  if (btnH) btnH.textContent = `History (${countH})`;
  if (btnC) btnC.textContent = `Cancelled (${countC})`;

  [btnU, btnH, btnC].forEach(b => b?.classList.remove('active'));

  let filtered = [];
  if (normTab === 'upcoming') {
    btnU?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'confirmed' || b.status === 'pending' || b.status === 'in_progress');
    // Sort so in_progress is strictly first
    filtered.sort((a, b) => (b.status === 'in_progress' ? 1 : 0) - (a.status === 'in_progress' ? 1 : 0));
  } else if (normTab === 'history') {
    btnH?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'completed');
  } else if (normTab === 'cancelled') {
    btnC?.classList.add('active');
    filtered = window.appState.bookings.filter(b => b.status === 'cancelled');
  }

  if (!wrap) return;

  if (filtered.length === 0) {
    wrap.innerHTML = `
      <div class="bookings-empty-state">
        <div class="bookings-empty-icon-box">
          <i data-lucide="calendar-x" style="width:24px;height:24px;"></i>
        </div>
        <div class="bookings-empty-title">No ${normTab} bookings</div>
        <p class="bookings-empty-sub">When you arrange rides or school commutes, they will appear here with live tracking updates.</p>
        <button class="btn-primary" style="margin-top: 14px; max-width: 200px; height: 42px;" onclick="navigateTo('bookingSelectChildren')">+ Book a Ride</button>
      </div>
    `;
  } else {
    const activeTrips = filtered.filter(b => b.status === 'in_progress');
    const scheduledTrips = filtered.filter(b => b.status !== 'in_progress');

    const renderCard = (b) => {
      const provider = window.appState.providers.find(p => p.id === b.providerId) || window.appState.providers[0];
      const children = (b.childIds || []).map(id => {
        const c = window.appState.children.find(ch => ch.id === id);
        return c ? c.name : id;
      });

      // Friendly child display (e.g. "Arman & Emma" or "Arman Khan")
      let childText = '';
      if (children.length > 1) {
        childText = children.map(c => c.split(' ')[0]).join(' & ');
      } else {
        childText = children[0] || 'Child Rider';
      }

      // Parse schedule
      let dayChip = 'Mon – Fri';
      let timeChip = '';
      if (b.direction === 'bothway' && b.outboundTime && b.returnTime) {
        timeChip = `${b.outboundTime} & ${b.returnTime}`;
      } else if (b.outboundTime) {
        timeChip = b.outboundTime;
      }

      if (b.scheduleText) {
        if (b.scheduleText.includes('•')) {
          const parts = b.scheduleText.split('•');
          dayChip = parts[0].trim();
          if (parts[1]) timeChip = parts[1].trim();
        } else if (b.scheduleText.includes('Mon–Fri') || b.scheduleText.includes('Mon-Fri')) {
          dayChip = 'Mon – Fri';
        }
      }

      if (timeChip) {
        timeChip = timeChip.replace(/Outbound:\s*/i, '').replace(/Return:\s*/i, '').replace(/\(.*?\)/g, '').replace(/\|/g, '&').trim();
      }

      // 1. In Transit Active Ride Card
      if (b.status === 'in_progress') {
        return `
          <div class="booking-item-card is-live" onclick="openBookingDetails('${b.id}')">
            <div class="bcard-header">
              <span class="status-chip in-progress" style="font-weight:700;">
                <span class="status-dot"></span>
                In Transit · ETA 07:42 AM
              </span>
              <div class="bcard-price">
                <strong>$${b.amount}</strong>
                <small>/wk</small>
              </div>
            </div>

            <div class="bcard-route-block">
              <div class="bcard-child-title">${childText}</div>
              <div class="bcard-school-target">${b.schoolLocation}</div>
              <div class="bcard-meta-line">
                <span>${dayChip}</span>
                ${timeChip ? `<span class="meta-dot">·</span><span>${timeChip}</span>` : ''}
              </div>
              <div style="font-size:11.5px; color:#059669; font-weight:600; display:flex; align-items:center; gap:5px; margin-top:2px;">
                <i data-lucide="navigation" style="width:12px;height:12px;"></i>
                <span>1.8 km away · Toyota Highlander (H2S-782)</span>
              </div>
            </div>

            <div class="bcard-footer">
              <div class="bcard-driver" onclick="event.stopPropagation(); openDriverProfile('${b.providerId || provider.id}', 'bookings')" title="View ${provider.name}'s Profile">
                <img src="${provider.photo}" alt="${provider.name}" class="bcard-driver-img" onerror="this.src='/assets/avatar_tariq.jpg';" />
                <div class="bcard-driver-text">
                  <div class="bcard-driver-name">${provider.name}</div>
                  <div class="bcard-driver-veh"><span style="color:#D97706;font-weight:700;">★ ${provider.rating}</span></div>
                </div>
              </div>
              <div class="bcard-action-wrap" style="display:flex; gap:6px;">
                <button class="btn-chat-compact" onclick="event.stopPropagation(); openChatWith('${provider.id}')" title="Message Driver">
                  <i data-lucide="message-square" style="width:12px;height:12px;"></i>
                </button>
                <button class="btn-live-track-compact" onclick="event.stopPropagation(); navigateTo('tracking')" title="Track Live GPS Ride">
                  <span class="live-pulse-dot" style="margin:0;"></span>
                  <span>Live Track</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 2. Pending Ride Card (Awaiting Provider)
      if (b.status === 'pending') {
        return `
          <div class="booking-item-card" onclick="openBookingDetails('${b.id}')">
            <div class="bcard-header">
              <span class="status-chip pending" style="font-weight:700;">
                <span class="status-dot"></span>
                Matching Driver · Pending
              </span>
              <div class="bcard-price">
                <strong>$${b.amount}</strong>
                <small>trip</small>
              </div>
            </div>

            <div class="bcard-route-block">
              <div class="bcard-child-title">${childText}</div>
              <div class="bcard-school-target">${b.schoolLocation}</div>
              <div class="bcard-meta-line">
                <span>${dayChip}</span>
                ${timeChip ? `<span class="meta-dot">·</span><span>${timeChip}</span>` : ''}
              </div>
              <div style="font-size:11.5px; color:#D97706; font-weight:600; display:flex; align-items:center; gap:5px; margin-top:3px;">
                <i data-lucide="clock" style="width:12px;height:12px;"></i>
                <span>Requested 12 mins ago · Reviewing by ${provider.name}</span>
              </div>
            </div>

            <div class="bcard-footer">
              <div class="bcard-driver" onclick="event.stopPropagation(); openDriverProfile('${b.providerId || provider.id}', 'bookings')">
                <img src="${provider.photo}" alt="${provider.name}" class="bcard-driver-img" onerror="this.src='/assets/avatar_sarah.jpg';" />
                <div class="bcard-driver-text">
                  <div class="bcard-driver-name">${provider.name}</div>
                  <div class="bcard-driver-veh"><span style="color:#D97706;font-weight:700;">★ ${provider.rating}</span></div>
                </div>
              </div>
              <div class="bcard-action-wrap">
                <button class="btn-support-compact" style="color:#EF4444;" onclick="event.stopPropagation(); withdrawBookingRequest('${b.id}')" title="Withdraw Request">
                  <i data-lucide="x-circle" style="width:12px;height:12px;"></i>
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 3. Past Completed Card (History)
      if (b.status === 'completed') {
        const dateLabel = b.completedAt ? b.completedAt.split('•')[0].trim() : 'May 19';
        return `
          <div class="booking-item-card" onclick="openBookingDetails('${b.id}')">
            <div class="bcard-header">
              <span class="status-chip completed" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0; font-weight:700;">
                <i data-lucide="check-circle" style="width:12px;height:12px;color:#059669;"></i>
                Completed · ${dateLabel}
              </span>
              <div class="bcard-price">
                <strong style="color:#0F172A;">$${b.amount}</strong>
                <small style="color:#64748B;">Paid</small>
              </div>
            </div>

            <div class="bcard-route-block">
              <div class="bcard-child-title">${childText}</div>
              <div class="bcard-school-target">${b.schoolLocation}</div>
              <div class="bcard-meta-line">
                <span>${dayChip}</span>
                ${timeChip ? `<span class="meta-dot">·</span><span>${timeChip}</span>` : ''}
              </div>
              <div class="bcard-delivery-log" style="margin-top: 4px;">
                <i data-lucide="shield-check" style="width:13px;height:13px;color:#059669;flex-shrink:0;"></i>
                <span>${b.dropoffNote || 'Delivered safely to school entrance'}</span>
              </div>
            </div>

            <div class="bcard-footer">
              <div class="bcard-driver" onclick="event.stopPropagation(); openDriverProfile('${b.providerId || provider.id}', 'bookings')" title="View ${provider.name}'s Profile">
                <img src="${provider.photo}" alt="${provider.name}" class="bcard-driver-img" onerror="this.src='/assets/avatar_tariq.jpg';" />
                <div class="bcard-driver-text">
                  <div class="bcard-driver-name">${provider.name}</div>
                  <div class="bcard-driver-veh"><span style="color:#D97706;font-weight:700;">★ ${b.userRating || provider.rating} (You rated)</span></div>
                </div>
              </div>

              <div class="bcard-action-wrap" style="display:flex; gap:6px;">
                <button class="btn-receipt-compact" onclick="event.stopPropagation(); openBookingReceipt('${b.id}')" title="View Official Receipt">
                  <i data-lucide="receipt" style="width:12px;height:12px;"></i>
                  <span>Receipt</span>
                </button>
                <button class="btn-rebook-compact" onclick="event.stopPropagation(); rebookRide('${b.id}')" title="Rebook this route">
                  <i data-lucide="rotate-cw" style="width:12px;height:12px;"></i>
                  <span>Book Again</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 4. Cancelled Card
      if (b.status === 'cancelled') {
        const cancelDate = b.cancelledAt ? b.cancelledAt.split('•')[0].trim() : 'May 08';
        return `
          <div class="booking-item-card" style="border-color:#FCA5A5; background:#FFFBFB;" onclick="openBookingDetails('${b.id}')">
            <div class="bcard-header">
              <span class="status-chip cancelled" style="font-weight:700;">
                <i data-lucide="x-circle" style="width:12px;height:12px;color:#DC2626;"></i>
                Cancelled · ${cancelDate}
              </span>
              <div class="bcard-price">
                <span style="text-decoration:line-through; color:#94A3B8; font-size:12px;">$${b.amount}</span>
                <strong style="color:#059669; font-size:14px; margin-left:4px;">$0 Paid</strong>
              </div>
            </div>

            <div class="bcard-route-block">
              <div class="bcard-child-title">${childText}</div>
              <div class="bcard-school-target">${b.schoolLocation}</div>
              <div class="bcard-meta-line">
                <span>${dayChip}</span>
                ${timeChip ? `<span class="meta-dot">·</span><span>${timeChip}</span>` : ''}
              </div>

              <div class="bcard-cancel-reason" style="margin-top: 4px;">
                <i data-lucide="alert-circle" style="width:13px;height:13px;color:#DC2626;flex-shrink:0;"></i>
                <span>Reason: ${b.cancelReason || 'Schedule adjusted by parent'}</span>
              </div>

              <div class="bcard-refund-pill" style="margin-top: 2px;">
                <i data-lucide="check" style="width:12px;height:12px;color:#059669;flex-shrink:0;"></i>
                <span>${b.refundStatus || 'Full refund processed ($0 fee applied)'}</span>
              </div>
            </div>

            <div class="bcard-footer">
              <div class="bcard-driver" style="cursor:default;">
                <img src="${provider.photo}" alt="${provider.name}" class="bcard-driver-img" style="filter:grayscale(0.5);" onerror="this.src='/assets/avatar_sarah.jpg';" />
                <div class="bcard-driver-text">
                  <div class="bcard-driver-name" style="color:#64748B;">${provider.name}</div>
                  <div class="bcard-driver-veh" style="color:#94A3B8;">Released &amp; Notified</div>
                </div>
              </div>

              <div class="bcard-action-wrap" style="display:flex; gap:6px;">
                <button class="btn-support-compact" onclick="event.stopPropagation(); navigateTo('contactSupport')" title="Get Trip Support">
                  <i data-lucide="help-circle" style="width:12px;height:12px;"></i>
                  <span>Help</span>
                </button>
                <button class="btn-rebook-compact" onclick="event.stopPropagation(); rebookRide('${b.id}')" title="Rebook this ride">
                  <i data-lucide="refresh-cw" style="width:12px;height:12px;"></i>
                  <span>Rebook</span>
                </button>
              </div>
            </div>
          </div>
        `;
      }

      // 5. Regular Confirmed Scheduled Ride Card
      return `
        <div class="booking-item-card" onclick="openBookingDetails('${b.id}')">
          <div class="bcard-header">
            <span class="status-chip confirmed" style="font-weight:700;">
              <span class="status-dot"></span>
              Scheduled Commute
            </span>
            <div class="bcard-price">
              <strong>$${b.amount}</strong>
              <small>${b.frequency === 'recurring' ? '/wk' : 'trip'}</small>
            </div>
          </div>

          <div class="bcard-route-block">
            <div class="bcard-child-title">${childText}</div>
            <div class="bcard-school-target">${b.schoolLocation}</div>
            <div class="bcard-meta-line">
              <span>${dayChip}</span>
              ${timeChip ? `<span class="meta-dot">·</span><span>${timeChip}</span>` : ''}
            </div>
          </div>

          <div class="bcard-footer">
            <div class="bcard-driver" onclick="event.stopPropagation(); openDriverProfile('${b.providerId || provider.id}', 'bookings')" title="View ${provider.name}'s Profile">
              <img src="${provider.photo}" alt="${provider.name}" class="bcard-driver-img" onerror="this.src='/assets/avatar_farhana.jpg';" />
              <div class="bcard-driver-text">
                <div class="bcard-driver-name">${provider.name}</div>
                <div class="bcard-driver-veh"><span style="color:#D97706;font-weight:700;">★ ${provider.rating}</span></div>
              </div>
            </div>

            <div class="bcard-action-wrap">
              <button class="btn-chat-compact" onclick="event.stopPropagation(); openChatWith('${provider.id}')" title="Message Driver">
                <i data-lucide="message-square" style="width:12px;height:12px;"></i>
                <span>Message</span>
              </button>
            </div>
          </div>
        </div>
      `;
    };

    if (normTab === 'upcoming' && activeTrips.length > 0 && scheduledTrips.length > 0) {
      wrap.innerHTML = `
        <div class="booking-section-heading live">
          <span class="live-pulse-dot"></span>
          <span>Active Trip Right Now (${activeTrips.length})</span>
        </div>
        ${activeTrips.map(renderCard).join('')}
        <div class="booking-section-heading" style="margin-top: 14px;">
          <i data-lucide="calendar" style="width:14px;height:14px;color:#64748B;"></i>
          <span>Scheduled Commutes (${scheduledTrips.length})</span>
        </div>
        ${scheduledTrips.map(renderCard).join('')}
      `;
    } else {
      wrap.innerHTML = filtered.map(renderCard).join('');
    }
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ==========================================================
   Live Tracking: Realistic Leaflet Map Engine & Lifecycle
   ========================================================== */
window.renderTrackingScreen = function () {
  setTimeout(() => {
    window.initTrackingMap();
  }, 80);
};

window.initTrackingMap = function () {
  const mapContainer = document.getElementById('liveLeafletMap');
  if (!mapContainer) return;

  if (window.L && typeof window.L.map === 'function') {
    if (window.trackingMapInstance) {
      try {
        window.trackingMapInstance.invalidateSize();
        return;
      } catch (e) {
        console.warn('Map refresh:', e);
      }
    }

    try {
      const map = L.map('liveLeafletMap', {
        zoomControl: false,
        attributionControl: false
      }).setView([43.6635, -79.3885], 14);

      // CartoDB Voyager Realistic Clean City Map Tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Realistic Commute Route from 12 Elm Street to Greenfield School
      const routeCoords = [
        [43.6575, -79.3838], // 12 Elm Street (Home)
        [43.6576, -79.3858], // Elm St turning onto Bay St
        [43.6605, -79.3865], // Bay St northbound
        [43.6635, -79.3882], // Bay St past College St
        [43.6665, -79.3912], // Queen's Park Crescent East
        [43.6690, -79.3940], // Avenue Rd / Bloor St
        [43.6705, -79.3955]  // Greenfield International School
      ];

      // Route Polyline with Soft Outer Glow & Core Accent Line
      L.polyline(routeCoords, {
        color: '#38BDF8',
        weight: 9,
        opacity: 0.45,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      L.polyline(routeCoords, {
        color: '#0284C7',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      L.polyline(routeCoords, {
        color: '#FFFFFF',
        weight: 2,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: '6, 8'
      }).addTo(map);

      // Home Marker (12 Elm St)
      const homeIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div class="map-pin-badge home">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          </div>
          <span class="map-pin-label">12 Elm St (Pickup)</span>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 20]
      });
      L.marker(routeCoords[0], { icon: homeIcon }).addTo(map);

      // School Marker (Greenfield International)
      const schoolIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div class="map-pin-badge school">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFFFFF"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/></svg>
          </div>
          <span class="map-pin-label">Greenfield School</span>
        `,
        iconSize: [36, 42],
        iconAnchor: [18, 20]
      });
      L.marker(routeCoords[routeCoords.length - 1], { icon: schoolIcon }).addTo(map);

      // Animated Vehicle Marker
      const carIcon = L.divIcon({
        className: 'leaflet-custom-marker',
        html: `
          <div class="map-car-pulsar"></div>
          <div class="map-car-body">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
            </svg>
          </div>
          <div class="map-car-tag">Tariq • 32 km/h</div>
        `,
        iconSize: [44, 52],
        iconAnchor: [22, 22]
      });
      window.trackingCarMarker = L.marker([43.6635, -79.3882], { icon: carIcon }).addTo(map);

      window.trackingMapInstance = map;

      // When Leaflet tiles load, fade out the fallback vector map
      map.whenReady(() => {
        setTimeout(() => {
          const fallback = document.getElementById('realisticVectorFallback');
          if (fallback) fallback.style.opacity = '0';
          map.invalidateSize();
        }, 300);
      });

      // Smooth Car Simulation forward animation
      let step = 3;
      if (window.trackingSimInterval) clearInterval(window.trackingSimInterval);
      window.trackingSimInterval = setInterval(() => {
        if (!window.trackingCarMarker || !window.trackingMapInstance) return;
        step = (step + 1) % routeCoords.length;
        window.trackingCarMarker.setLatLng(routeCoords[step]);
      }, 4000);

    } catch (err) {
      console.warn('Leaflet init error, keeping realistic vector fallback:', err);
    }
  }
};

window.recenterTrackingMap = function () {
  if (window.trackingMapInstance && window.trackingCarMarker) {
    window.trackingMapInstance.setView(window.trackingCarMarker.getLatLng(), 15, { animate: true });
  }
};

window.zoomInTrackingMap = function () {
  if (window.trackingMapInstance) {
    window.trackingMapInstance.zoomIn();
  }
};

window.zoomOutTrackingMap = function () {
  if (window.trackingMapInstance) {
    window.trackingMapInstance.zoomOut();
  }
};

const trackingStages = [
  { chip: 'Live • Driver On Way', text: 'Tariq is driving towards your home', eta: '07:28 AM', pct: '18%' },
  { chip: 'Live • Arrived At Pickup', text: 'Tariq has arrived at Home (12 Elm Street)', eta: '07:30 AM', pct: '45%' },
  { chip: 'Live • En Route', text: 'En route to Greenfield International', eta: '07:42 AM', pct: '72%' },
  { chip: 'Live • Approaching School', text: 'Approaching Greenfield School drop-off zone', eta: '07:44 AM', pct: '90%' },
  { chip: 'Safe Drop-off Completed', text: 'Children safely handed to school attendant', eta: '07:46 AM', pct: '100%' }
];

window.advanceTrackingStage = function () {
  window.appState.trackingStageIndex = (window.appState.trackingStageIndex + 1) % trackingStages.length;
  const stage = trackingStages[window.appState.trackingStageIndex];

  const chip = document.getElementById('trackingStatusChip');
  const chipText = document.getElementById('trackingChipText');
  const stageText = document.getElementById('trackingStageText');
  const etaText = document.getElementById('trackingEtaText');
  const progressBar = document.getElementById('stepperProgressBar');
  const carGroup = document.getElementById('liveVectorCarGroup');

  if (chipText) {
    chipText.textContent = stage.chip;
  } else if (chip) {
    chip.textContent = stage.chip;
  }

  if (stageText) stageText.textContent = stage.text;
  if (etaText) etaText.textContent = stage.eta;
  if (progressBar) progressBar.style.width = stage.pct;

  if (carGroup) {
    const vectorPositions = [
      { x: 100, y: 520 },
      { x: 200, y: 520 },
      { x: 200, y: 310 },
      { x: 255, y: 160 },
      { x: 270, y: 80 }
    ];
    const vp = vectorPositions[window.appState.trackingStageIndex] || vectorPositions[2];
    carGroup.setAttribute('transform', `translate(${vp.x}, ${vp.y})`);
  }

  const s1 = document.getElementById('step1Node');
  const s2 = document.getElementById('step2Node');
  const s3 = document.getElementById('step3Node');
  const s4 = document.getElementById('step4Node');

  const nodes = [
    { el: s1, num: 1 },
    { el: s2, num: 2 },
    { el: s3, num: 3 },
    { el: s4, num: 4 }
  ];

  const idx = window.appState.trackingStageIndex;

  nodes.forEach(({ el, num }, i) => {
    if (!el) return;
    el.classList.remove('completed', 'active');
    const dot = el.querySelector('.step-circle-dot');

    let isCompleted = false;
    let isActive = false;
    if (idx === 0) {
      if (i === 0) isActive = true;
    } else if (idx === 1) {
      if (i === 0) isCompleted = true;
      if (i === 1) isActive = true;
    } else if (idx === 2 || idx === 3) {
      if (i < 2) isCompleted = true;
      if (i === 2) isActive = true;
    } else if (idx >= 4) {
      isCompleted = true;
    }

    if (isCompleted) {
      el.classList.add('completed');
      if (dot) dot.innerHTML = '<i data-lucide="check" style="width:13px;height:13px;"></i>';
    } else if (isActive) {
      el.classList.add('active');
      if (dot) dot.textContent = num;
    } else {
      if (dot) dot.textContent = num;
    }
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  if (idx >= 4) {
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
window.activeChatProviderId = 'tariq';

window.openChatWith = function (providerId) {
  window.activeChatProviderId = providerId || 'tariq';
  const provider = window.appState.providers.find(p => p.id === window.activeChatProviderId) || window.appState.providers[0];

  const avatar = document.getElementById('chatDriverAvatar');
  const nameEl = document.getElementById('chatDriverName');
  const subEl = document.getElementById('chatDriverSub');
  const inputEl = document.getElementById('chatInputField');

  if (avatar) avatar.src = provider.photo || '/assets/avatar_tariq.jpg';
  if (nameEl) nameEl.textContent = provider.name;
  if (subEl) subEl.textContent = `${provider.vehicle || 'School Escort'} • ${provider.rating} ★`;
  if (inputEl) inputEl.placeholder = `Type a message to ${provider.name.split(' ')[0]}...`;

  window.navigateTo('messages');
};

window.callCurrentDriver = function () {
  const provider = window.appState.providers.find(p => p.id === window.activeChatProviderId) || window.appState.providers[0];
  alert(`Calling ${provider.name}: ${provider.phone || '+1 (416) 555-0182'}`);
};

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

window.showToast = function (msg, type = 'success') {
  let toast = document.getElementById('h2sToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'h2sToast';
    toast.className = 'h2s-toast-notification';
    document.body.appendChild(toast);
  }
  const isError = type === 'error' || type === 'danger';
  const iconHtml = isError ? '🚨' : type === 'success' ? '✓' : 'ℹ';
  const iconColor = isError ? '#EF4444' : type === 'success' ? '#10B981' : '#38BDF8';
  toast.innerHTML = `<span style="color:${iconColor};font-weight:800;">${iconHtml}</span> <span>${msg}</span>`;
  if (isError) {
    toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    toast.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.25)';
  } else {
    toast.style.borderColor = 'rgba(255, 255, 255, 0.12)';
    toast.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.35)';
  }
  toast.classList.add('visible');

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('visible');
  }, isError ? 3400 : 2500);
};

/* ==========================================================
   Emergency Contacts Management System (Single Source of Truth)
   ========================================================== */
window.renderEmergencyContactsList = function () {
  const container = document.getElementById('emergencyContactsListWrap');
  const countBadge = document.getElementById('contactCountBadge');
  const sosContainer = document.getElementById('sosFamilyContactsContainer');
  const contacts = window.appState.emergencyContacts || [];

  if (countBadge) {
    countBadge.textContent = `${contacts.length}`;
  }

  if (container) {
    if (contacts.length === 0) {
      container.innerHTML = `
        <div style="padding: 24px 16px; text-align: center; background: #FFFFFF; border-radius: var(--radius-md);">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: #F1F5F9; color: #64748B; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
            <i data-lucide="shield-alert" style="width: 22px; height: 22px;"></i>
          </div>
          <div style="font-size: 13.5px; font-weight: 700; color: #0F172A;">No Emergency Contacts Added</div>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 14px; line-height: 1.4;">Add at least one trusted guardian or family member.</p>
          <button class="btn-primary" style="height: 38px; font-size: 12.5px; padding: 0 16px; margin: 0 auto;" onclick="openAddEmergencyContactModal()">+ Add Contact</button>
        </div>
      `;
    } else {
      container.innerHTML = contacts.map(c => {
        const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EC';
        const cleanPhone = c.phone.replace(/[^0-9+]/g, '');
        const primaryBadge = c.isPrimary ? `<span class="contact-primary-tag">Primary</span>` : '';
        const avatarHtml = c.photo
          ? `<img src="${c.photo}" alt="${c.name}" class="contact-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" /><span class="contact-avatar-circle" style="display:none">${initials}</span>`
          : `<div class="contact-avatar-circle">${initials}</div>`;

        return `
          <div class="emergency-contact-row" id="contactItem-${c.id}">
            <div class="contact-avatar-wrap">
              ${avatarHtml}
            </div>
            <div class="contact-meta-block">
              <div class="contact-row-name-wrap">
                <span class="contact-row-name">${c.name}</span>
                ${primaryBadge}
              </div>
              <div class="contact-row-sub">${c.rel} • ${c.phone}</div>
            </div>
            <div class="contact-row-actions">
              <a href="tel:${cleanPhone}" class="btn-contact-action-call" aria-label="Call ${c.name}" title="Call ${c.name}">
                <i data-lucide="phone-call" style="width:14px;height:14px;"></i>
              </a>
              <div class="contact-menu-wrapper">
                <button type="button" class="btn-contact-action-icon btn-contact-more" onclick="event.stopPropagation(); window.toggleContactMenu('${c.id}')" aria-label="Options for ${c.name}" title="More options">
                  <i data-lucide="more-vertical" style="width:15px;height:15px;"></i>
                </button>
                <div class="contact-dropdown-menu" id="contactMenu-${c.id}" style="display: none;">
                  <button type="button" class="contact-menu-item" onclick="event.stopPropagation(); window.openAddEmergencyContactModal('${c.id}'); window.closeContactActionMenus();">
                    <i data-lucide="pencil" style="width:13px;height:13px;"></i>
                    <span>Edit</span>
                  </button>
                  <button type="button" class="contact-menu-item danger" onclick="event.stopPropagation(); window.deleteEmergencyContact('${c.id}'); window.closeContactActionMenus();">
                    <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  // Synchronize Emergency SOS Hub modal family list
  if (sosContainer) {
    const familyContacts = contacts.filter(c => c.rel !== 'School Admin').slice(0, 4);
    if (familyContacts.length === 0) {
      sosContainer.innerHTML = `
        <div style="grid-column: 1 / -1; font-size: 11.5px; color: #64748B; text-align: center; padding: 10px;">
          No personal contacts registered. Please add contacts in Emergency Hub.
        </div>
      `;
    } else {
      sosContainer.innerHTML = familyContacts.map(c => {
        const initials = c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'EC';
        const cleanPhone = c.phone.replace(/[^0-9+]/g, '');
        const relLabel = c.rel;
        return `
          <a href="tel:${cleanPhone}" class="sos-contact-pill-card">
            <div class="contact-pill-avatar">${initials}</div>
            <div class="contact-pill-info">
              <div class="contact-pill-name">${c.name}</div>
              <div class="contact-pill-rel">${relLabel}</div>
            </div>
            <div class="contact-pill-action" aria-label="Call">
              <i data-lucide="phone"></i>
            </div>
          </a>
        `;
      }).join('');
    }
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.toggleContactMenu = function (contactId, forceOpen = false) {
  const targetMenu = document.getElementById(`contactMenu-${contactId}`);
  const allMenus = document.querySelectorAll('.contact-dropdown-menu');

  if (!window.figmaHoldMode) {
    allMenus.forEach(m => {
      if (m !== targetMenu) m.style.display = 'none';
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    targetMenu.style.display = forceOpen ? 'flex' : (isVisible ? 'none' : 'flex');
    if (targetMenu.style.display === 'flex' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeContactActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('.contact-dropdown-menu').forEach(m => {
    m.style.display = 'none';
  });
};

if (!window.contactMenuListenerAttached) {
  document.addEventListener('click', (e) => {
    if (window.figmaHoldMode) return; // Keep held open in Figma mode!
    if (!e.target.closest('.contact-menu-wrapper')) {
      window.closeContactActionMenus();
    }
  });
  window.contactMenuListenerAttached = true;
}

window.openAddEmergencyContactModal = function (contactId = null) {
  const modal = document.getElementById('addEmergencyContactModal');
  if (!modal) return;

  const titleElem = document.getElementById('emergencyContactModalTitle');
  const btnTextElem = document.getElementById('btnSaveEmergencyContactText');
  const idInput = document.getElementById('editEmergencyContactId');
  const nameInput = document.getElementById('contactInputName');
  const relInput = document.getElementById('contactInputRel');
  const phoneInput = document.getElementById('contactInputPhone');
  const primaryInput = document.getElementById('contactInputIsPrimary');
  const authInput = document.getElementById('contactInputPickupAuth');
  const notesInput = document.getElementById('contactInputNotes');

  if (contactId) {
    // Edit existing contact
    const contact = (window.appState.emergencyContacts || []).find(c => c.id === contactId);
    if (contact) {
      if (titleElem) titleElem.textContent = 'Edit Contact';
      if (btnTextElem) btnTextElem.textContent = 'Save Changes';
      if (idInput) idInput.value = contact.id;
      if (nameInput) nameInput.value = contact.name || '';
      if (relInput) {
        relInput.value = contact.rel || 'Father';
        if (!relInput.value) relInput.value = 'Other';
      }
      if (phoneInput) phoneInput.value = contact.phone || '';
      if (primaryInput) primaryInput.checked = !!contact.isPrimary;
      if (authInput) authInput.checked = !!contact.pickupAuth;
      if (notesInput) notesInput.value = contact.notes || '';
    }
  } else {
    // Create new contact
    if (titleElem) titleElem.textContent = 'Add Contact';
    if (btnTextElem) btnTextElem.textContent = 'Save Contact';
    if (idInput) idInput.value = '';
    if (nameInput) nameInput.value = '';
    if (relInput) relInput.value = 'Father';
    if (phoneInput) phoneInput.value = '+1 (416) ';
    if (primaryInput) primaryInput.checked = false;
    if (authInput) authInput.checked = true;
    if (notesInput) notesInput.value = '';
  }

  modal.style.display = 'flex';
  if (nameInput) {
    setTimeout(() => nameInput.focus(), 100);
  }
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.closeEmergencyContactModal = function (event) {
  if (event && event.target && 
      event.target.id !== 'addEmergencyContactModal' && 
      !event.target.classList.contains('emergency-sos-modal-overlay') && 
      !event.target.closest('.btn-secondary-link') && 
      !event.target.closest('.btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('addEmergencyContactModal');
  if (modal) modal.style.display = 'none';
};

window.setContactRel = function (rel) {
  const input = document.getElementById('contactInputRel');
  if (input) input.value = rel;
};

window.highlightContactRelPill = function () {};

window.saveEmergencyContactForm = function (event) {
  if (event) event.preventDefault();

  const idInput = document.getElementById('editEmergencyContactId');
  const nameInput = document.getElementById('contactInputName');
  const relInput = document.getElementById('contactInputRel');
  const phoneInput = document.getElementById('contactInputPhone');
  const primaryInput = document.getElementById('contactInputIsPrimary');
  const authInput = document.getElementById('contactInputPickupAuth');
  const notesInput = document.getElementById('contactInputNotes');

  const contactId = idInput?.value?.trim();
  const name = nameInput?.value?.trim();
  const rel = relInput?.value?.trim() || 'Guardian';
  const phone = phoneInput?.value?.trim();
  const isPrimary = !!primaryInput?.checked;
  const pickupAuth = !!authInput?.checked;
  const notes = notesInput?.value?.trim() || '';

  if (!name || !phone) {
    if (window.showToast) window.showToast('Please enter full legal name and phone number', 'error');
    return;
  }

  if (!window.appState.emergencyContacts) {
    window.appState.emergencyContacts = [];
  }

  // If set to primary, unset previous primary
  if (isPrimary) {
    window.appState.emergencyContacts.forEach(c => c.isPrimary = false);
  }

  if (contactId) {
    // Update existing contact
    const contact = window.appState.emergencyContacts.find(c => c.id === contactId);
    if (contact) {
      contact.name = name;
      contact.rel = rel;
      contact.phone = phone;
      contact.isPrimary = isPrimary;
      contact.pickupAuth = pickupAuth;
      contact.notes = notes;
    }
    if (window.showToast) window.showToast(`✓ Updated ${name}`);
  } else {
    // Add new contact
    const newContact = {
      id: 'ec_' + Date.now(),
      name,
      rel,
      phone,
      isPrimary,
      pickupAuth,
      notes
    };
    window.appState.emergencyContacts.push(newContact);
    if (window.showToast) window.showToast(`✓ Added ${name} to emergency contacts`);
  }

  const modal = document.getElementById('addEmergencyContactModal');
  if (modal) modal.style.display = 'none';

  window.renderEmergencyContactsList();
};

window.deleteEmergencyContact = function (contactId) {
  const contact = (window.appState.emergencyContacts || []).find(c => c.id === contactId);
  const name = contact ? contact.name : 'this contact';

  if (confirm(`Remove ${name} from your emergency contacts?`)) {
    window.appState.emergencyContacts = (window.appState.emergencyContacts || []).filter(c => c.id !== contactId);
    window.renderEmergencyContactsList();
    if (window.showToast) window.showToast(`Removed ${name}`, 'info');
  }
};

// Backwards compatibility alias
window.addEmergencyContact = window.openAddEmergencyContactModal;

window.selectedAddressType = 'home';

// Preset locations for simulated map picking
window.simulatedMapLocations = [
  { name: "Grandma's House", street: "84 Willowbrook Crescent, Toronto, ON", x: 48, y: 52 },
  { name: "Greenfield Campus", street: "Gate 2 Drop-off Loop, Toronto, ON", x: 68, y: 35 },
  { name: "Karate Club / YMCA", street: "220 Broadview Avenue, Toronto, ON", x: 30, y: 65 },
  { name: "Kumon Learning Center", street: "512 Queen St East, Toronto, ON", x: 75, y: 70 },
  { name: "Swim Academy", street: "90 Harborfront Quay, Toronto, ON", x: 38, y: 40 }
];

window.openAddAddressModal = function () {
  const modal = document.getElementById('addAddressModal');
  if (modal) {
    // Reset to Add mode
    const title = modal.querySelector('[data-modal-title]');
    if (title) title.textContent = 'Set Location on Map';
    const submitBtn = modal.querySelector('[data-modal-submit]');
    if (submitBtn) submitBtn.textContent = 'Save Location';
    const labelInput = document.getElementById('newAddressLabel');
    if (labelInput) { labelInput.value = ''; labelInput.readOnly = false; }
    modal.dataset.editingLabel = '';
    modal.style.display = 'flex';
    window.recenterPickerLocation();
    setTimeout(() => {
      document.getElementById('newAddressLabel')?.focus();
    }, 100);
  }
};

window.renderSavedLocations = function () {
  const container = document.getElementById('savedLocationsListWrap');
  if (!container) return;

  const locs = window.appState.savedLocations || [];
  container.innerHTML = locs.map(loc => {
    const lower = (loc.name || '').toLowerCase();
    const iconName = (loc.type === 'home' || lower.includes('home')) ? 'home' : 'map-pin';
    const iconColor = 'var(--color-primary)';

    const safeName = (loc.name || '').replace(/'/g, "\\'");
    const safeStreet = (loc.street || '').replace(/'/g, "\\'");

    return `
      <div class="grouped-row-item" id="savedLocRow-${loc.id}" style="position: relative;">
        <div class="grouped-row-left" style="min-width: 0; flex: 1;">
          <div class="grouped-row-icon-wrap" style="flex-shrink: 0;">
            <i data-lucide="${iconName}" style="width:18px;height:18px;color:${iconColor};"></i>
          </div>
          <div style="min-width: 0; flex: 1; margin-right: 8px;">
            <div class="grouped-row-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${loc.name}</div>
            <div class="grouped-row-sub" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${loc.street}</div>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-shrink: 0;">
          ${loc.isDefault ? '<span class="status-chip confirmed" style="font-size: 11px; padding: 3px 9px; font-weight: 700;">Default</span>' : ''}
          <div class="location-menu-wrapper" style="position: relative; display: inline-flex;" onclick="event.stopPropagation();">
            <button type="button" class="btn-contact-action-icon" onclick="event.stopPropagation(); window.toggleLocationMenu('${loc.id}')" aria-label="Options for ${loc.name}" title="Options">
              <i data-lucide="more-vertical" style="width:15px;height:15px;"></i>
            </button>
            <div class="contact-dropdown-menu" id="locMenu-${loc.id}" style="display: none; right: 0; top: calc(100% + 4px);">
              ${!loc.isDefault ? `
                <button type="button" class="contact-menu-item" onclick="event.stopPropagation(); window.setDefaultSavedLocation('${loc.id}'); window.closeLocationActionMenus(true);">
                  <i data-lucide="check-circle-2" style="width:13px;height:13px;color:#10B981;"></i>
                  <span>Set as Default</span>
                </button>
              ` : ''}
              <button type="button" class="contact-menu-item" onclick="event.stopPropagation(); window.openEditAddressModal('${safeName}', '${safeStreet}', ${!!loc.isDefault}, '${loc.id}'); window.closeLocationActionMenus(true);">
                <i data-lucide="pencil" style="width:13px;height:13px;"></i>
                <span>Edit Location</span>
              </button>
              <button type="button" class="contact-menu-item danger" onclick="event.stopPropagation(); window.deleteSavedLocation('${loc.id}'); window.closeLocationActionMenus(true);">
                <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.toggleLocationMenu = function (locId, forceOpen = false) {
  const targetMenu = document.getElementById(`locMenu-${locId}`);
  const allMenus = document.querySelectorAll('[id^="locMenu-"]');

  if (!window.figmaHoldMode) {
    allMenus.forEach(m => {
      if (m !== targetMenu) m.style.display = 'none';
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    targetMenu.style.display = forceOpen ? 'flex' : (isVisible ? 'none' : 'flex');
    if (targetMenu.style.display === 'flex' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeLocationActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('[id^="locMenu-"]').forEach(m => {
    m.style.display = 'none';
  });
};

if (!window.locMenuListenerAttached) {
  document.addEventListener('click', (e) => {
    if (window.figmaHoldMode) return;
    if (!e.target.closest('.location-menu-wrapper')) {
      window.closeLocationActionMenus();
    }
  });
  window.locMenuListenerAttached = true;
}

window.deleteSavedLocation = function (locId) {
  if (!window.appState.savedLocations) return;
  const target = window.appState.savedLocations.find(l => l.id === locId);
  if (!target) return;

  if (target.isDefault) {
    if (window.showToast) {
      window.showToast('Cannot delete default pickup location. Please set another default first.', 'warning');
    }
    return;
  }

  window.appState.savedLocations = window.appState.savedLocations.filter(l => l.id !== locId);
  window.renderSavedLocations();
  if (window.showToast) {
    window.showToast(`✓ Removed "${target.name}" from saved locations`, 'info');
  }
};

window.setDefaultSavedLocation = function (locId) {
  if (!window.appState.savedLocations) return;
  let chosen = null;
  window.appState.savedLocations.forEach(loc => {
    if (loc.id === locId) {
      loc.isDefault = true;
      chosen = loc;
    } else {
      loc.isDefault = false;
    }
  });

  // Update default pickup in bookingDraft
  if (chosen && window.appState.bookingDraft) {
    window.appState.bookingDraft.pickupLocation = chosen.name;
    const input = document.getElementById('setupPickupLocation');
    if (input) input.value = chosen.name;
  }

  window.renderSavedLocations();
  if (window.showToast) {
    window.showToast(`✓ "${chosen?.name || 'Location'}" is now your default pickup location!`, 'success');
  }
};

window.openEditAddressModal = function (label = '', street = '', isDefault = false, locId = null) {
  const modal = document.getElementById('addAddressModal');
  if (!modal) return;

  const labelInput = document.getElementById('newAddressLabel');
  const streetInput = document.getElementById('newAddressStreet');
  const addrTag = document.getElementById('mapPinDetectedAddress');
  const defaultCheck = document.getElementById('newAddressIsDefault');

  if (labelInput) { labelInput.value = label || ''; }
  if (streetInput) { streetInput.value = street || '12 Elm Street, Toronto, ON'; }
  if (addrTag) { addrTag.innerText = (street || '12 Elm Street').split(',')[0]; }
  if (defaultCheck) { defaultCheck.checked = !!isDefault; }

  modal.dataset.editingId = locId || '';
  modal.dataset.editingLabel = label || '';

  modal.style.display = 'flex';
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};

window.closeAddAddressModal = function (event) {
  if (event && event.target && event.target.closest('.receipt-modal-card') && event.target.id !== 'addAddressModal') {
    return;
  }
  const modal = document.getElementById('addAddressModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.fillLocationCustomName = function (name) {
  const input = document.getElementById('newAddressLabel');
  if (input) {
    input.value = name;
    input.focus();
  }
};

window.handleMapPickerTap = function (event) {
  const container = document.getElementById('modalMapPickerContainer');
  const pin = document.getElementById('modalMapPin');
  const addrTag = document.getElementById('mapPinDetectedAddress');
  const streetInput = document.getElementById('newAddressStreet');
  const labelInput = document.getElementById('newAddressLabel');

  if (!container || !pin) return;

  const rect = container.getBoundingClientRect();
  const x = Math.max(10, Math.min(rect.width - 10, event.clientX - rect.left));
  const y = Math.max(30, Math.min(rect.height - 10, event.clientY - rect.top));

  const pctX = (x / rect.width) * 100;
  const pctY = (y / rect.height) * 100;

  pin.style.left = `${pctX}%`;
  pin.style.top = `${pctY}%`;

  // Find nearest simulated location or generate realistic Toronto street
  const randomLoc = window.simulatedMapLocations[Math.floor(Math.random() * window.simulatedMapLocations.length)];
  const detectedStreet = randomLoc.street;
  
  if (addrTag) addrTag.innerText = detectedStreet.split(',')[0];
  if (streetInput) streetInput.value = detectedStreet;

  // If user hasn't typed a custom name yet, suggest place name
  if (labelInput && !labelInput.value.trim()) {
    labelInput.placeholder = `e.g. ${randomLoc.name}`;
  }

  if (window.showToast) {
    window.showToast(`Pinned: ${detectedStreet.split(',')[0]}`);
  }
};

window.recenterPickerLocation = function (event) {
  if (event) event.stopPropagation();
  const pin = document.getElementById('modalMapPin');
  const addrTag = document.getElementById('mapPinDetectedAddress');
  const streetInput = document.getElementById('newAddressStreet');
  if (pin) {
    pin.style.left = '50%';
    pin.style.top = '52%';
  }
  if (addrTag) addrTag.innerText = '12 Elm Street, Toronto';
  if (streetInput) streetInput.value = '12 Elm Street, Toronto, ON';
};

window.handleMapQuickSearch = function (query) {
  if (!query || query.length < 2) return;
  const match = window.simulatedMapLocations.find(l => 
    l.name.toLowerCase().includes(query.toLowerCase()) || 
    l.street.toLowerCase().includes(query.toLowerCase())
  );
  if (match) {
    const pin = document.getElementById('modalMapPin');
    const addrTag = document.getElementById('mapPinDetectedAddress');
    const streetInput = document.getElementById('newAddressStreet');
    const labelInput = document.getElementById('newAddressLabel');

    if (pin) {
      pin.style.left = `${match.x}%`;
      pin.style.top = `${match.y}%`;
    }
    if (addrTag) addrTag.innerText = match.name;
    if (streetInput) streetInput.value = match.street;
    if (labelInput && !labelInput.value.trim()) {
      labelInput.value = match.name;
    }
  }
};

window.handleSaveNewAddress = function (e) {
  e.preventDefault();
  const label = document.getElementById('newAddressLabel')?.value?.trim();
  const street = document.getElementById('newAddressStreet')?.value?.trim() || "Toronto, ON";
  const isDefault = !!document.getElementById('newAddressIsDefault')?.checked;
  if (!label) return;

  const modal = document.getElementById('addAddressModal');
  const editingId = modal?.dataset?.editingId;

  if (!window.appState.savedLocations) {
    window.appState.savedLocations = [];
  }

  if (isDefault) {
    window.appState.savedLocations.forEach(loc => { loc.isDefault = false; });
  }

  if (editingId) {
    const existing = window.appState.savedLocations.find(l => l.id === editingId);
    if (existing) {
      existing.name = label;
      existing.street = street;
      existing.isDefault = isDefault;
    }
  } else {
    let locType = 'custom';
    const lower = label.toLowerCase();
    if (lower.includes('home')) locType = 'home';
    else if (lower.includes('school')) locType = 'school';
    else if (lower.includes('grandma') || lower.includes('nana')) locType = 'family';

    window.appState.savedLocations.push({
      id: 'loc-' + Date.now(),
      name: label,
      street: street,
      type: locType,
      isDefault: isDefault
    });
  }

  window.renderSavedLocations();
  window.closeAddAddressModal();
  if (window.showToast) {
    window.showToast(isDefault ? `✓ Saved "${label}" as default location!` : `✓ Saved "${label}"`, 'success');
  }
};

window.addNewAddress = function () {
  window.openEditAddressModal('', '12 Elm Street, Toronto, ON', false, null);
};

/* ==========================================================
   STRIPE BILLING & TRANSACTION HISTORY
   ========================================================== */
window.currentTxFilter = 'all';

window.filterTransactions = function (type) {
  window.currentTxFilter = type;

  // Update segmented control buttons
  const btnMap = {
    all: 'filterTxAll',
    recurring: 'filterTxCommutes',
    onetime: 'filterTxOneTime',
    refund: 'filterTxRefunds'
  };

  Object.entries(btnMap).forEach(([key, btnId]) => {
    const btn = document.getElementById(btnId);
    if (btn) {
      if (key === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    }
  });

  window.renderTransactions(type);
};

window.renderTransactions = function (filter = 'all') {
  const container = document.getElementById('transactionsListWrap');
  if (!container) return;

  const allTx = window.appState?.transactions || [];
  let filtered = allTx;
  if (filter === 'recurring') {
    filtered = allTx.filter(t => t.type === 'recurring');
  } else if (filter === 'onetime') {
    filtered = allTx.filter(t => t.type === 'onetime');
  } else if (filter === 'refund') {
    filtered = allTx.filter(t => t.type === 'refund');
  }

  // Update transaction count label
  const countLabel = document.getElementById('txCountLabel');
  if (countLabel) {
    countLabel.textContent = `${filtered.length} Transaction${filtered.length === 1 ? '' : 's'}`;
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background:#F8FAFC; border:1px dashed #E2E8F0; border-radius:14px; padding:28px 16px; text-align:center;">
        <div style="font-size:13px; font-weight:700; color:#64748B;">No transactions found</div>
        <div style="font-size:11.5px; color:#94A3B8; margin-top:3px;">There are no transactions recorded under this filter.</div>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(tx => {
    const isRefund = tx.status === 'refunded';
    const amountDisplay = isRefund ? `+$${tx.amount.toFixed(2)}` : `$${tx.amount.toFixed(2)}`;
    const statusPillClass = isRefund ? 'refunded' : 'paid';
    const statusPillText = isRefund ? '↩ Refunded' : '✓ Paid';
    const methodIcon = isRefund ? 'wallet' : 'credit-card';

    return `
      <div class="transaction-card" onclick="openTransactionReceipt('${tx.id}')">
        <div class="tx-header-row">
          <div class="tx-date">
            <i data-lucide="calendar" style="width:12px;height:12px;color:#64748B;"></i>
            <span>${tx.date}</span>
          </div>
          <span class="tx-status-pill ${statusPillClass}">${statusPillText}</span>
        </div>

        <div class="tx-main-row">
          <div>
            <div class="tx-title">${tx.title}</div>
            <div class="tx-sub">${tx.subtitle}</div>
          </div>
          <div class="tx-amount ${isRefund ? 'refund' : ''}">${amountDisplay}</div>
        </div>

        <div class="tx-footer-row">
          <div class="tx-method">
            <i data-lucide="${methodIcon}" style="width:13px;height:13px;color:#64748B;"></i>
            <span>${tx.paymentMethod}</span>
          </div>
          <button type="button" class="tx-receipt-btn" onclick="event.stopPropagation(); openTransactionReceipt('${tx.id}')">
            <span>Receipt</span>
            <i data-lucide="arrow-up-right" style="width:11px;height:11px;"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.openTransactionReceipt = function (txId) {
  const tx = (window.appState?.transactions || []).find(t => t.id === txId) || window.appState?.transactions?.[0];
  if (!tx) return;

  const isRefund = tx.status === 'refunded';

  const noEl = document.getElementById('recModalReceiptNo');
  const amtEl = document.getElementById('recModalAmount');
  const badgeEl = document.getElementById('recModalStatusBadge');
  const dateEl = document.getElementById('recModalDate');
  const srvEl = document.getElementById('recModalService');
  const ridEl = document.getElementById('recModalRiders');
  const provEl = document.getElementById('recModalProvider');
  const methEl = document.getElementById('recModalMethod');
  const txEl = document.getElementById('recModalStripeTx');

  if (noEl) noEl.textContent = `Receipt #${tx.receiptNo}`;
  if (amtEl) amtEl.textContent = `${isRefund ? '+' : ''}$${tx.amount.toFixed(2)}`;
  if (badgeEl) {
    badgeEl.className = `tx-status-pill ${isRefund ? 'refunded' : 'paid'}`;
    badgeEl.textContent = isRefund ? '↩ Refund Credited to Parent Wallet' : '✓ Payment Successful via Stripe';
  }
  if (dateEl) dateEl.textContent = tx.date;
  if (srvEl) srvEl.textContent = tx.title;
  if (ridEl) ridEl.textContent = tx.subtitle;
  if (provEl) provEl.textContent = tx.provider;
  if (methEl) methEl.textContent = tx.paymentMethod;
  if (txEl) txEl.textContent = tx.stripeTxId;

  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.style.display = 'flex';
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.closeTransactionReceipt = function (event) {
  if (event && event.target && event.target.closest('.receipt-modal-card') && event.target.id !== 'receiptModal') {
    return;
  }
  const modal = document.getElementById('receiptModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.openStripePortal = function () {
  if (window.showToast) {
    window.showToast('Connecting to Stripe Customer Portal (Sandbox)...', 'info');
  }
  setTimeout(() => {
    alert('Stripe Customer Portal Demo:\nIn production, this redirects directly to your secure hosted Stripe Customer Portal (billing.stripe.com) where parents can manage saved cards, Apple Pay, Google Pay, and download official VAT tax invoices without storing card details in the app.');
  }, 350);
};

window.downloadReceiptPdf = function () {
  const receiptNo = document.getElementById('recModalReceiptNo')?.textContent || 'H2S-REC';
  if (window.showToast) {
    window.showToast(`✓ Downloading official PDF receipt (${receiptNo})...`);
  }
  setTimeout(() => {
    window.closeTransactionReceipt();
  }, 800);
};

window.addNewPaymentMethod = function () {
  window.openStripePortal();
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

window.setNotifFilter = function (filter) {
  const btnAll = document.getElementById('notifTabAll');
  const btnUnread = document.getElementById('notifTabUnread');
  const cards = document.querySelectorAll('#notifFeedList .notification-card');

  if (filter === 'unread') {
    btnAll?.classList.remove('active');
    btnUnread?.classList.add('active');
    cards.forEach(card => {
      if (card.classList.contains('unread')) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  } else {
    btnAll?.classList.add('active');
    btnUnread?.classList.remove('active');
    cards.forEach(card => {
      card.style.display = 'flex';
    });
  }
};

window.filterNotifications = window.setNotifFilter;

window.markNotificationsAsRead = function () {
  const cards = document.querySelectorAll('#notifFeedList .notification-card.unread');
  cards.forEach(el => {
    el.classList.remove('unread');
  });

  const unreadBadge = document.getElementById('notifBadgeUnread');
  if (unreadBadge) unreadBadge.textContent = '0';

  const dot = document.querySelector('.unread-badge-dot');
  if (dot) dot.style.display = 'none';

  const btnUnread = document.getElementById('notifTabUnread');
  if (btnUnread && btnUnread.classList.contains('active')) {
    window.setNotifFilter('unread');
  }

  if (window.showToast) {
    window.showToast('All notifications marked as read');
  }
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
      parent.querySelectorAll('.report-cat-btn, .report-chip-compact').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
  }
  const select = document.getElementById('reportCategorySelect');
  if (select) select.value = category;
};

window.submitIssueReport = function () {
  const desc = document.getElementById('reportDescriptionInput')?.value?.trim();

  if (!desc) {
    if (window.showToast) {
      window.showToast('Please describe what happened', 'error');
    } else {
      alert('Please describe what happened.');
    }
    return;
  }

  const ticketId = 'H2S-INC-' + Math.floor(1000 + Math.random() * 9000);
  if (window.showToast) {
    window.showToast(`Report ${ticketId} submitted. Dispatch is reviewing.`, 'success');
  } else {
    alert(`Report ${ticketId} submitted.`);
  }

  if (document.getElementById('reportDescriptionInput')) {
    document.getElementById('reportDescriptionInput').value = '';
  }

  window.handleTripReportBack();
};

/* ==========================================================
   Dedicated Trip Incident & Delay Report (#screen-report)
   ========================================================== */
window.tripReportPreviousScreen = 'profile';

window.openTripReport = function (bookingId) {
  window.tripReportPreviousScreen = currentScreen || 'bookingDetails';
  const booking = (window.appState.bookings || []).find(b => b.id === bookingId) || window.appState.bookings[0];
  const provider = (window.appState.providers || []).find(p => p.id === booking?.providerId) || window.appState.providers[0];
  const children = (booking?.childIds || []).map(id => (window.appState.children || []).find(c => c.id === id)?.name).filter(Boolean);

  const badgeEl = document.getElementById('tripReportBookingBadge');
  const titleEl = document.getElementById('tripReportTitle');
  const routeEl = document.getElementById('tripReportRoute');
  const selectEl = document.getElementById('reportTripSelect');

  if (badgeEl && booking) badgeEl.textContent = booking.id.startsWith('#') ? booking.id : `#${booking.id}`;
  if (titleEl && booking) titleEl.textContent = `${provider?.name || 'Driver'} • ${children.join(' & ') || 'Child Commute'}`;
  if (routeEl && booking) routeEl.textContent = `${booking.pickupLocation} → ${booking.schoolLocation}`;

  if (selectEl && booking) {
    selectEl.value = booking.id;
  }

  window.navigateTo('report');
};

window.handleTripReportBack = function () {
  const prev = window.tripReportPreviousScreen || 'profile';
  window.navigateTo(prev);
};

window.onReportTripSelectChange = function (selectEl) {
  const bookingId = selectEl.value;
  const booking = (window.appState.bookings || []).find(b => b.id === bookingId);
  if (!booking) return;

  const provider = (window.appState.providers || []).find(p => p.id === booking.providerId) || window.appState.providers[0];
  const children = (booking.childIds || []).map(id => (window.appState.children || []).find(c => c.id === id)?.name).filter(Boolean);

  const badgeEl = document.getElementById('tripReportBookingBadge');
  const titleEl = document.getElementById('tripReportTitle');
  const routeEl = document.getElementById('tripReportRoute');

  if (badgeEl) badgeEl.textContent = `#${booking.id}`;
  if (titleEl) titleEl.textContent = `${provider?.name || 'Driver'} • ${children.join(' & ') || 'Child Commute'}`;
  if (routeEl) routeEl.textContent = `${booking.pickupLocation} → ${booking.schoolLocation}`;
};

/* ==========================================================
   Dedicated Contact Support Desk & Inquiry Dispatch (#screen-contactSupport)
   ========================================================== */
window.supportTopicsMap = {
  billing: [
    'Refund Status Inquiry',
    'Official Receipt / Tax Invoice',
    'Update Payment Card',
    'Weekly Commute Pricing Question'
  ],
  routes: [
    'Change Morning Pickup Time',
    'Driver Feedback or Commendation',
    'Request New School Route Extension',
    'Lost Item Left in Car'
  ],
  children: [
    'Update Authorized Pickup Guardian',
    'Booster Seat / Special Needs Note',
    'School Campus Transfer',
    'Temporary Vacation / Stop Commute'
  ],
  feedback: [
    'App Feature Suggestion',
    'Report a Bug or UI Glitch',
    'Compliment Escort or Dispatcher'
  ],
  general: [
    'Child Safety & Screening Standards',
    'Account & Phone Verification',
    'Other Family Inquiries'
  ]
};

window.activeSupportCategory = 'billing';
window.activeSupportSubTopic = 'Refund Status Inquiry';

window.renderSupportScreen = function () {
  window.renderSupportSubTopics(window.activeSupportCategory || 'billing');
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.selectSupportCategory = function (category, btnEl) {
  window.activeSupportCategory = category;
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.support-cat-pill').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
  }
  window.renderSupportSubTopics(category);
};

window.renderSupportSubTopics = function (category) {
  const container = document.getElementById('supportSubTopicsWrap');
  if (!container) return;

  const topics = window.supportTopicsMap[category] || window.supportTopicsMap.general;
  window.activeSupportSubTopic = topics[0];

  container.innerHTML = topics.map((topic, idx) => `
    <button type="button" class="support-subtopic-pill ${idx === 0 ? 'active' : ''}" onclick="selectSupportSubTopic('${topic.replace(/'/g, "\\'")}', this)">
      ${topic}
    </button>
  `).join('');
};

window.selectSupportSubTopic = function (topic, btnEl) {
  window.activeSupportSubTopic = topic;
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('.support-subtopic-pill').forEach(b => b.classList.remove('active'));
      btnEl.classList.add('active');
    }
  }
};

window.updateSupportCharCount = function (textarea) {
  const counter = document.getElementById('supportCharCounter');
  if (counter && textarea) {
    counter.textContent = `${textarea.value.length} / 500`;
  }
};

window.submitSupportTicket = function () {
  const messageInput = document.getElementById('supportMessageInput');
  const message = messageInput?.value?.trim();
  const topic = document.getElementById('supportTopicSelect')?.value || 'General Inquiry';

  if (!message) {
    if (window.showToast) {
      window.showToast('Please type your message before sending', 'error');
    } else {
      alert('Please type your message before sending.');
    }
    return;
  }

  const ticketId = 'H2S-TKT-' + Math.floor(10000 + Math.random() * 90000);

  if (window.showToast) {
    window.showToast(`Support ticket ${ticketId} created. We'll reply shortly.`, 'success');
  } else {
    alert(`Message sent (${ticketId}). We will reply shortly.`);
  }

  if (messageInput) messageInput.value = '';
  const counter = document.getElementById('supportCharCounter');
  if (counter) counter.textContent = '0 / 500';

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
    const photoSrc = c.photo || (c.id === 'arman' ? '/assets/avatar_arman.jpg' : c.id === 'emma' ? '/assets/avatar_emma.jpg' : '/assets/avatar_zara.jpg');
    return `
      <div class="grouped-row-item child-manage-row" onclick="openEditChildModal('${c.id}')" role="button" tabindex="0" style="cursor:pointer; position: relative;">
        <div class="grouped-row-left" style="gap: 12px; min-width: 0; flex: 1;">
          <img src="${photoSrc}" alt="${c.name}" class="child-photo-avatar" onerror="this.src='/assets/avatar_arman.jpg';" />
          <div style="min-width: 0; flex: 1;">
            <div class="child-manage-name" style="font-size: 14px; font-weight: 700; color: #0F172A; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.name}</div>
            <div class="child-manage-sub" style="font-size: 12px; color: #64748B; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${c.grade || c.age} • ${c.school}</div>
          </div>
        </div>
        <div class="child-menu-wrapper" onclick="event.stopPropagation();">
          <button type="button" class="btn-contact-action-icon btn-child-more" onclick="event.stopPropagation(); window.toggleChildMenu('${c.id}')" aria-label="Options for ${c.name}" title="Options">
            <i data-lucide="more-vertical" style="width:15px;height:15px;"></i>
          </button>
          <div class="child-dropdown-menu" id="childMenu-${c.id}" style="display: none;">
            <button type="button" class="contact-menu-item" onclick="event.stopPropagation(); window.openEditChildModal('${c.id}'); window.closeChildActionMenus();">
              <i data-lucide="pencil" style="width:13px;height:13px;"></i>
              <span>Edit Profile</span>
            </button>
            <button type="button" class="contact-menu-item danger" onclick="event.stopPropagation(); window.deleteChildProfile('${c.id}'); window.closeChildActionMenus();">
              <i data-lucide="trash-2" style="width:13px;height:13px;"></i>
              <span>Delete Profile</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.toggleChildMenu = function (childId, forceOpen = false) {
  const targetMenu = document.getElementById(`childMenu-${childId}`);
  const allMenus = document.querySelectorAll('.child-dropdown-menu');

  if (!window.figmaHoldMode) {
    allMenus.forEach(m => {
      if (m !== targetMenu) m.style.display = 'none';
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    targetMenu.style.display = forceOpen ? 'flex' : (isVisible ? 'none' : 'flex');
    if (targetMenu.style.display === 'flex' && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeChildActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('.child-dropdown-menu').forEach(m => {
    m.style.display = 'none';
  });
};

if (!window.childMenuListenerAttached) {
  document.addEventListener('click', (e) => {
    if (window.figmaHoldMode) return; // Keep held open in Figma mode!
    if (!e.target.closest('.child-menu-wrapper')) {
      window.closeChildActionMenus?.();
    }
  });
  window.childMenuListenerAttached = true;
}

window.deleteChildProfile = function (childId) {
  const child = (window.appState?.children || []).find(c => c.id === childId);
  const name = child ? child.name : 'this child profile';

  if (confirm(`Remove ${name}'s profile from your account?`)) {
    window.appState.children = (window.appState.children || []).filter(c => c.id !== childId);

    if (window.appState.selectedChildIds) {
      window.appState.selectedChildIds = window.appState.selectedChildIds.filter(id => id !== childId);
    }

    window.closeChildActionMenus();
    window.renderMyChildrenList();
    if (window.navigateTo) window.navigateTo('myChildren');
    if (window.showToast) window.showToast(`Removed ${name}'s profile`, 'info');
  }
};

window.openAddChildModal = function () {
  window.editingChildId = null;

  const titleEl = document.getElementById('childFormTopTitle');
  if (titleEl) titleEl.textContent = 'Add Child';

  const monogramEl = document.getElementById('childFormMonogram');
  if (monogramEl) {
    monogramEl.innerHTML = `<i data-lucide="camera" style="width:28px;height:28px;color:#FFFFFF;"></i>`;
    monogramEl.style.background = 'linear-gradient(135deg, var(--color-primary) 0%, #263C8C 100%)';
  }


  const nameInput = document.getElementById('editChildName');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');
  const submitBtn = document.getElementById('childFormSubmitBtn');
  const deleteBtn = document.getElementById('childFormDeleteBtn');

  if (nameInput) nameInput.value = '';
  if (ageInput) ageInput.value = '';
  if (schoolInput) schoolInput.value = '';
  if (submitBtn) submitBtn.textContent = 'Save Changes';
  if (deleteBtn) deleteBtn.style.display = 'none';

  window.navigateTo('addChild');
};

window.openEditChildModal = function (childId) {
  window.editingChildId = childId;
  const child = (window.appState?.children || []).find(c => c.id === childId);
  if (!child) return;

  const titleEl = document.getElementById('childFormTopTitle');
  if (titleEl) titleEl.textContent = 'Edit Child';

  const photoSrc = child.photo || (child.id === 'arman' ? '/assets/avatar_arman.jpg' : child.id === 'emma' ? '/assets/avatar_emma.jpg' : '/assets/avatar_zara.jpg');
  const monogramEl = document.getElementById('childFormMonogram');
  if (monogramEl) {
    monogramEl.innerHTML = `<img src="${photoSrc}" alt="${child.name}" style="width:100%;height:100%;object-fit:cover;" />`;
    monogramEl.style.background = 'transparent';
  }


  const nameInput = document.getElementById('editChildName');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');
  const submitBtn = document.getElementById('childFormSubmitBtn');
  const deleteBtn = document.getElementById('childFormDeleteBtn');

  if (nameInput) nameInput.value = child.name || '';
  if (ageInput) ageInput.value = child.age || child.grade || '8 Years';
  if (schoolInput) schoolInput.value = child.school || '';
  if (submitBtn) submitBtn.textContent = 'Save Changes';
  if (deleteBtn) deleteBtn.style.display = 'flex';

  window.navigateTo('addChild');
};

window.saveChildProfileForm = function (event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById('editChildName');
  const ageInput = document.getElementById('editChildAge');
  const schoolInput = document.getElementById('editChildSchool');

  const name = nameInput?.value?.trim();
  const age = ageInput?.value?.trim() || '7 Years';
  const school = schoolInput?.value?.trim() || 'Greenfield International School';

  if (!name) {
    alert('Please enter your child’s name.');
    return;
  }

  if (window.editingChildId) {
    const child = (window.appState?.children || []).find(c => c.id === window.editingChildId);
    if (child) {
      child.name = name;
      child.age = age;
      child.grade = age;
      child.school = school;
      child.pickup = child.pickup || 'Home Address';
      child.notes = child.notes || '';
    }
  } else {
    const newId = 'child_' + Date.now();
    window.appState.children.push({
      id: newId,
      name: name,
      age: age,
      grade: age,
      school: school,
      pickup: 'Home Address',
      notes: ''
    });
  }

  window.renderMyChildrenList();
  window.navigateTo('myChildren');
};

// Initial render
window.renderMyChildrenList();

/* ==========================================================
   Emergency SOS Protocol Flow
   ========================================================== */
window.openEmergencySOSModal = function () {
  const modal = document.getElementById('emergencySOSModal');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeEmergencySOSModal = function (event) {
  if (event && event.target && 
      event.target.id !== 'emergencySOSModal' && 
      !event.target.classList.contains('emergency-sos-modal-overlay') && 
      !event.target.closest('.btn-sos-cancel') && 
      !event.target.closest('.btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('emergencySOSModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

/* ==========================================================
   Child Boarding Safety PIN Pass Modal (Unique Concept)
   ========================================================== */
window.openSafetyPinModal = function () {
  const modal = document.getElementById('safetyPinModal');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeSafetyPinModal = function (event) {
  if (event && event.target && 
      event.target.id !== 'safetyPinModal' && 
      !event.target.classList.contains('emergency-sos-modal-overlay') && 
      !event.target.closest('.btn-primary') && 
      !event.target.closest('.btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('safetyPinModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.handleSosCall = function (event, type) {
  if (type === '911') {
    if (window.showToast) {
      window.showToast('🚨 Connecting to Emergency 911 Dispatcher...', 'error');
    }
  } else if (type === 'dispatch') {
    if (window.showToast) {
      window.showToast('🛡️ Connecting to 24/7 Safety Dispatch Desk (1-800-555-5437)...', 'info');
    }
  }
};

window.broadcastSchoolSecurityAlert = function () {
  const btn = document.getElementById('btnSosSchoolBroadcast');
  if (btn) {
    btn.classList.add('dispatched');
    btn.innerHTML = `
      <div class="sos-card-icon success">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="sos-card-content">
        <div class="sos-card-title" style="color:#15803D;">✓ Alert Broadcasted to Greenfield Security</div>
        <div class="sos-card-desc" style="color:#166534;">Security Desk &amp; Principal notified • Incident #SOS-8921 logged</div>
      </div>
    `;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  if (window.showToast) {
    window.showToast('🚨 High-Priority SOS Broadcasted to Greenfield School Security!', 'error');
  }
};

window.requestDriverCallback = function () {
  const btn = document.getElementById('btnSosDriverPing');
  if (btn) {
    btn.classList.add('dispatched');
    btn.innerHTML = `
      <div class="sos-card-icon success">
        <i data-lucide="check-circle-2"></i>
      </div>
      <div class="sos-card-content">
        <div class="sos-card-title" style="color:#15803D;">✓ Escort Cab Pinged Successfully</div>
        <div class="sos-card-desc" style="color:#166534;">Tariq Ahmed notified to initiate emergency safety callback</div>
      </div>
    `;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
  if (window.showToast) {
    window.showToast('🔔 High-priority alert sounded on driver dashboard tablet', 'info');
  }
};

window.shareEmergencyLiveTelemetry = function () {
  const shareText = '🚨 URGENT LIVE SAFETY TELEMETRY - Home2School\n' +
    'Children: Arman & Emma Khan (On Board)\n' +
    'Vehicle: Toyota Sienna (SCH-4091) - Tariq Ahmed\n' +
    'Current GPS: Bloor St W & Bay St, Toronto (Speed: 32 km/h)\n' +
    'Destination: Greenfield International School (ETA: 6 min)\n' +
    'Encrypted Live Route: https://home2school.app/live/H2S-84920?sos=true';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(shareText).then(() => {
      if (window.showToast) {
        window.showToast('✓ Live GPS Telemetry copied to clipboard! Ready to send via SMS/WhatsApp.', 'success');
      }
    }).catch(() => {
      if (window.showToast) {
        window.showToast('✓ Live Telemetry ready to share', 'success');
      }
    });
  } else {
    if (window.showToast) {
      window.showToast('✓ Live Telemetry ready to share', 'success');
    }
  }
};

/* ==========================================================
   Bottom Navigation Live Ride Pulse Indicator
   ========================================================== */
window.updateNavLiveBadges = function () {
  const hasActive = (window.appState?.homeScenario === 'C') || 
    (window.appState?.bookings || []).some(b => b.status === 'in_progress');

  const navButtons = document.querySelectorAll('.bottom-tab-bar button[onclick*="tracking"]');
  navButtons.forEach(btn => {
    let badge = btn.querySelector('.nav-live-badge');
    if (hasActive) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nav-live-badge';
        btn.appendChild(badge);
      }
    } else if (badge) {
      badge.remove();
    }
  });
};

// Initialize navigation live indicator & emergency contacts
setTimeout(() => {
  if (window.updateNavLiveBadges) window.updateNavLiveBadges();
  if (window.renderEmergencyContactsList) window.renderEmergencyContactsList();
  if (window.renderSavedLocations) window.renderSavedLocations();
}, 200);

/* ==========================================================
   COUNTRY PICKER — Profile Phone Field
   ========================================================== */
window._countryPickerData = [
  { flag: '🇧🇩', name: 'Bangladesh',      code: '+880' },
  { flag: '🇨🇦', name: 'Canada',          code: '+1'   },
  { flag: '🇺🇸', name: 'United States',   code: '+1'   },
  { flag: '🇬🇧', name: 'United Kingdom',  code: '+44'  },
  { flag: '🇦🇺', name: 'Australia',       code: '+61'  },
  { flag: '🇮🇳', name: 'India',           code: '+91'  },
  { flag: '🇵🇰', name: 'Pakistan',        code: '+92'  },
  { flag: '🇲🇾', name: 'Malaysia',        code: '+60'  },
  { flag: '🇸🇬', name: 'Singapore',       code: '+65'  },
  { flag: '🇦🇪', name: 'UAE',             code: '+971' },
  { flag: '🇸🇦', name: 'Saudi Arabia',    code: '+966' },
  { flag: '🇩🇪', name: 'Germany',         code: '+49'  },
  { flag: '🇫🇷', name: 'France',          code: '+33'  },
  { flag: '🇯🇵', name: 'Japan',           code: '+81'  },
];

window.openCountryPicker = function () {
  // Remove any existing picker
  const old = document.getElementById('countryPickerModal');
  if (old) old.remove();

  const overlay = document.createElement('div');
  overlay.id = 'countryPickerModal';
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 9999;
    background: rgba(15,23,42,0.45);
    display: flex; align-items: flex-end; justify-content: center;
    animation: fadeInOverlay 0.18s ease;
  `;
  overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

  const sheet = document.createElement('div');
  sheet.style.cssText = `
    width: 430px; max-width: 100%;
    background: #fff;
    border-radius: 20px 20px 0 0;
    padding: 0 0 24px;
    max-height: 70vh;
    display: flex; flex-direction: column;
    animation: slideUpSheet 0.22s ease;
    overflow: hidden;
  `;

  sheet.innerHTML = `
    <div style="padding: 16px 16px 10px; display:flex; align-items:center; justify-content:space-between; border-bottom: 1px solid #F1F5F9;">
      <div style="font-size:15px; font-weight:800; color:#0F172A;">Select Country</div>
      <button onclick="document.getElementById('countryPickerModal').remove()" style="background:none;border:none;cursor:pointer;padding:4px;color:#64748B;">
        <i data-lucide="x" style="width:18px;height:18px;"></i>
      </button>
    </div>
    <div style="overflow-y: auto; flex:1;">
      ${window._countryPickerData.map((c, i) => `
        <div onclick="window.selectCountry('${c.flag}','${c.code}','${c.name}')"
          style="display:flex; align-items:center; gap:12px; padding:11px 16px; cursor:pointer; border-bottom:1px solid #F8FAFC; transition:background 0.12s;"
          onmouseover="this.style.background='#F0F9FF'" onmouseout="this.style.background='transparent'">
          <span style="font-size:22px;">${c.flag}</span>
          <div style="flex:1;">
            <div style="font-size:13.5px; font-weight:600; color:#0F172A;">${c.name}</div>
          </div>
          <span style="font-size:13px; font-weight:700; color:#64748B; font-variant-numeric:tabular-nums;">${c.code}</span>
        </div>
      `).join('')}
    </div>
  `;

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};

window.selectCountry = function (flag, code, name) {
  const flagEl = document.getElementById('profileCountryFlag');
  const codeEl = document.getElementById('profileCountryCode');
  if (flagEl) flagEl.textContent = flag;
  if (codeEl) codeEl.textContent = code;
  const modal = document.getElementById('countryPickerModal');
  if (modal) modal.remove();
};

/* ==========================================================
   PROFILE ADDRESS MAP PICKER
   ========================================================== */
window._profileMapOpen = false;

window.toggleProfileMapPicker = function () {
  const picker = document.getElementById('profileMapPicker');
  if (!picker) return;
  window._profileMapOpen = !window._profileMapOpen;
  picker.style.display = window._profileMapOpen ? 'block' : 'none';
  if (window._profileMapOpen) {
    // Sync current address value to map label
    const addr = document.getElementById('parentProfileAddress')?.value || '';
    const tag = document.getElementById('profilePinTag');
    const addrLabel = document.getElementById('profileMapSelectedAddr');
    if (tag) tag.textContent = addr.split(',')[0];
    if (addrLabel) addrLabel.textContent = addr;
    setTimeout(() => {
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
    }, 50);
    // Scroll into view
    setTimeout(() => picker.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
  }
};

window.handleProfileMapTap = function (event) {
  const container = document.getElementById('profileMapContainer');
  const pin = document.getElementById('profileMapPin');
  const tag = document.getElementById('profilePinTag');
  const addrLabel = document.getElementById('profileMapSelectedAddr');
  if (!container || !pin) return;

  const rect = container.getBoundingClientRect();
  const x = Math.max(8, Math.min(rect.width - 8, event.clientX - rect.left));
  const y = Math.max(30, Math.min(rect.height - 8, event.clientY - rect.top));

  pin.style.left = `${(x / rect.width) * 100}%`;
  pin.style.top  = `${(y / rect.height) * 100}%`;

  // Pick a simulated address
  const locs = window.simulatedMapLocations || [{ street: '12 Elm Street, Toronto, ON', name: 'Home' }];
  const loc = locs[Math.floor(Math.random() * locs.length)];
  const street = loc.street || '12 Elm Street, Toronto, ON';

  if (tag) tag.textContent = street.split(',')[0];
  if (addrLabel) addrLabel.textContent = street;

  if (window.showToast) window.showToast(`Pinned: ${street.split(',')[0]}`);
};

window.profileMapRecenter = function () {
  const pin = document.getElementById('profileMapPin');
  const tag = document.getElementById('profilePinTag');
  const addrLabel = document.getElementById('profileMapSelectedAddr');
  if (pin) { pin.style.left = '50%'; pin.style.top = '52%'; }
  const addr = document.getElementById('parentProfileAddress')?.value || '12 Elm Street, Toronto, ON';
  if (tag) tag.textContent = addr.split(',')[0];
  if (addrLabel) addrLabel.textContent = addr;
};

window.handleProfileMapSearch = function (query) {
  if (!query || query.length < 2) return;
  const locs = window.simulatedMapLocations || [];
  const match = locs.find(l => l.street.toLowerCase().includes(query.toLowerCase()) || (l.name && l.name.toLowerCase().includes(query.toLowerCase())));
  if (match) {
    const tag = document.getElementById('profilePinTag');
    const addrLabel = document.getElementById('profileMapSelectedAddr');
    if (tag) tag.textContent = match.street.split(',')[0];
    if (addrLabel) addrLabel.textContent = match.street;
    if (window.showToast) window.showToast(`Found: ${match.street.split(',')[0]}`);
  }
};

window.confirmProfileAddress = function () {
  const addrLabel = document.getElementById('profileMapSelectedAddr');
  const input = document.getElementById('parentProfileAddress');
  if (addrLabel && input) {
    input.value = addrLabel.textContent;
  }
  // Close map
  window._profileMapOpen = false;
  const picker = document.getElementById('profileMapPicker');
  if (picker) picker.style.display = 'none';
  if (window.showToast) window.showToast('Address updated ✓', 'success');
};

window.profileUseCurrentLocation = function () {
  const btn = document.getElementById('profileUseLocationBtn');
  if (btn) { btn.textContent = 'Locating…'; btn.disabled = true; }

  if (!navigator.geolocation) {
    if (window.showToast) window.showToast('Geolocation not supported on this device', 'error');
    if (btn) { btn.innerHTML = '<i data-lucide="locate" style="width:11px;height:11px;"></i> Use Current'; btn.disabled = false; if (window.lucide) window.lucide.createIcons(); }
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      // Real app: reverse-geocode pos.coords.latitude, pos.coords.longitude
      // Simulated: pick a realistic Toronto address
      const locs = window.simulatedMapLocations || [];
      const loc = locs[Math.floor(Math.random() * locs.length)] || { street: '12 Elm Street, Toronto, ON' };
      const street = loc.street;

      const input = document.getElementById('parentProfileAddress');
      const tag = document.getElementById('profilePinTag');
      const addrLabel = document.getElementById('profileMapSelectedAddr');
      if (input) input.value = street;
      if (tag) tag.textContent = street.split(',')[0];
      if (addrLabel) addrLabel.textContent = street;

      if (window.showToast) window.showToast(`Location found: ${street.split(',')[0]}`, 'success');
      if (btn) { btn.innerHTML = '<i data-lucide="locate" style="width:11px;height:11px;"></i> Use Current'; btn.disabled = false; if (window.lucide) window.lucide.createIcons(); }
    },
    (err) => {
      // Fallback — show map so user can pick manually
      if (window.showToast) window.showToast('Could not get location. Pin it on the map.', 'error');
      window.toggleProfileMapPicker();
      if (btn) { btn.innerHTML = '<i data-lucide="locate" style="width:11px;height:11px;"></i> Use Current'; btn.disabled = false; if (window.lucide) window.lucide.createIcons(); }
    },
    { timeout: 8000, enableHighAccuracy: true }
  );
};

/* ==========================================================================
   FIGMA SCREEN CAPTURE & HOLD UI ENGINE
   Allows designers to keep dropdowns, popovers, and option menus open
   without them vanishing on blur/click, making Figma capture seamless.
   ========================================================================== */
window.figmaHoldMode = true; // Default ON so menus never disappear when capturing for Figma!

window.toggleFigmaHoldMode = function (explicitState = null) {
  if (explicitState !== null) {
    window.figmaHoldMode = explicitState;
  } else {
    window.figmaHoldMode = !window.figmaHoldMode;
  }

  const statusText = document.getElementById('figmaHoldStatusText');
  const toggleBtn = document.getElementById('btnToggleFigmaHold');
  const pulseDot = document.getElementById('figmaPulseDot');

  if (statusText) {
    statusText.textContent = window.figmaHoldMode ? 'ON' : 'OFF';
    statusText.style.color = window.figmaHoldMode ? '#34D399' : '#94A3B8';
  }
  if (toggleBtn) {
    toggleBtn.textContent = window.figmaHoldMode ? 'HOLD ON' : 'HOLD OFF';
    toggleBtn.className = window.figmaHoldMode ? 'btn-figma-toggle' : 'btn-figma-toggle off';
  }
  if (pulseDot) {
    pulseDot.className = window.figmaHoldMode ? 'figma-pulse-dot active' : 'figma-pulse-dot';
  }

  if (window.showToast) {
    window.showToast(
      window.figmaHoldMode
        ? '📸 Figma Hold ON: Menus stay open until you click again!'
        : 'Figma Hold OFF: Standard auto-dismiss restored.',
      'info'
    );
  }
};

window.holdOpenCurrentDropdown = function () {
  // 1. If on My Children screen, hold open child option menu
  const childMenus = document.querySelectorAll('.child-dropdown-menu');
  if (childMenus && childMenus.length > 0) {
    // Open the first child's menu or visible ones
    const firstMenu = childMenus[0];
    const idParts = firstMenu.id.replace('childMenu-', '');
    if (idParts && window.toggleChildMenu) {
      window.toggleChildMenu(idParts, true);
    } else {
      firstMenu.style.display = 'flex';
    }
  }

  // 2. If on Emergency Contacts screen, hold open contact menu
  const contactMenus = document.querySelectorAll('.contact-dropdown-menu');
  if (contactMenus && contactMenus.length > 0) {
    const firstContactMenu = contactMenus[0];
    const cidParts = firstContactMenu.id.replace('contactMenu-', '');
    if (cidParts && window.toggleContactMenu) {
      window.toggleContactMenu(cidParts, true);
    } else {
      firstContactMenu.style.display = 'flex';
    }
  }

  // 3. Trigger Lucide to render icons if needed
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  if (window.showToast) {
    window.showToast('📌 Menu held open for Figma capture!', 'success');
  }
};

window.closeAllHeldMenus = function () {
  window.closeChildActionMenus?.(true);
  window.closeContactActionMenus?.(true);
  document.querySelectorAll('.figma-select-popover').forEach(el => el.remove());
  if (window.showToast) {
    window.showToast('All menus dismissed.', 'info');
  }
};

window.hideFigmaPanelTemporarily = function (seconds = 12) {
  const panel = document.getElementById('figmaCapturePanel');
  if (!panel) return;
  panel.classList.add('temporarily-hidden');
  setTimeout(() => {
    panel.classList.remove('temporarily-hidden');
  }, seconds * 1000);
};

// Keyboard Shortcut: Ctrl + Shift + H toggles Figma Hold Mode
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'H' || e.key === 'h')) {
    e.preventDefault();
    window.toggleFigmaHoldMode();
  }
});

// Custom Figma-friendly DOM popover for native <select> elements on demand
window.initFigmaSelectEnhancers = function () {
  document.querySelectorAll('select.form-input, select.form-select').forEach(selectElem => {
    if (selectElem.dataset.figmaEnhanced) return;
    selectElem.dataset.figmaEnhanced = 'true';

    selectElem.addEventListener('mousedown', (e) => {
      if (!window.figmaHoldMode) return;
      // In Figma Hold mode, prevent native uncapturable OS popup and show full HTML DOM popover
      e.preventDefault();
      
      const existingPopover = selectElem.parentNode.querySelector('.figma-select-popover');
      if (existingPopover) {
        existingPopover.remove();
        return;
      }

      // Close other popovers
      document.querySelectorAll('.figma-select-popover').forEach(p => p.remove());

      const popover = document.createElement('div');
      popover.className = 'figma-select-popover';

      Array.from(selectElem.options).forEach(opt => {
        const item = document.createElement('div');
        item.className = 'figma-select-option-item' + (opt.selected ? ' selected' : '');
        item.textContent = opt.textContent;
        item.onclick = (evt) => {
          evt.stopPropagation();
          selectElem.value = opt.value;
          selectElem.dispatchEvent(new Event('change', { bubbles: true }));
          popover.remove();
        };
        popover.appendChild(item);
      });

      selectElem.parentNode.style.position = 'relative';
      selectElem.parentNode.appendChild(popover);
    });
  });
};

// Initialize select enhancer
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', window.initFigmaSelectEnhancers);
} else {
  window.initFigmaSelectEnhancers();
}

/* ==========================================================
   25. DRIVER PORTAL LOGIC & CONTROLLER
   10-Year Lead Product Design Standard
   ========================================================== */

// 1. Scenario Toggle (State A / B / C)
window.setDriverScenario = function (scenario) {
  window.appState.driver.homeScenario = scenario;
  
  // Highlight chips
  ['A', 'B', 'C'].forEach(sc => {
    const chip = document.getElementById(`dchipScenario${sc}`);
    if (chip) {
      if (sc === scenario) chip.classList.add('active');
      else chip.classList.remove('active');
    }
  });

  renderDriverHome();
};

window.toggleDriverOnlineStatus = function () {
  const d = window.appState.driver;
  d.isOnline = !d.isOnline;
  const btn = document.getElementById('driverStatusToggleBtn');
  if (btn) {
    if (d.isOnline) {
      btn.className = 'driver-status-toggle-pill';
      btn.innerHTML = `<span class="live-pulse-dot" style="margin:0;"></span><span id="driverStatusToggleText">Available</span>`;
    } else {
      btn.className = 'driver-status-toggle-pill offline';
      btn.innerHTML = `<span style="width:7px;height:7px;border-radius:50%;background:#94A3B8;"></span><span id="driverStatusToggleText">Offline</span>`;
    }
  }
};

// 2. Driver Home Renderer
function renderDriverHome() {
  const d = window.appState.driver;
  const heroWrap = document.getElementById('driverHeroContainer');
  if (!heroWrap) return;

  const scenario = d.homeScenario || 'B';

  if (scenario === 'A') {
    // State A: No Upcoming Trip (Idle)
    heroWrap.innerHTML = `
      <div class="driver-hero-card state-idle">
        <div style="width:48px;height:48px;border-radius:50%;background:#F1F5F9;display:flex;align-items:center;justify-content:center;color:#64748B;margin-bottom:2px;">
          <i data-lucide="check-circle-2" style="width:26px;height:26px;color:#059669;"></i>
        </div>
        <h3 style="font-size:17px;font-weight:800;color:#0F172A;margin:0;">You're all set, Tariq</h3>
        <p style="font-size:13px;color:#64748B;margin:0;max-width:280px;line-height:1.4;">No upcoming trips right now. Your next scheduled commute begins tomorrow at 07:30 AM.</p>
        <button type="button" class="btn-primary" style="margin-top:6px;height:40px;font-size:13px;font-weight:700;padding:0 20px;" onclick="navigateTo('driverSetup')">
          <i data-lucide="clock" style="width:14px;height:14px;margin-right:4px;"></i>
          <span>Update Availability</span>
        </button>
      </div>
    `;
  } else if (scenario === 'C') {
    // State C: Trip Starts Soon (Action-Oriented, 15m away)
    heroWrap.innerHTML = `
      <div class="driver-hero-card state-urgent">
        <div class="dhero-badge-row">
          <span class="dhero-chip emerald">
            <span class="live-pulse-dot" style="margin:0;background:#FFFFFF;"></span>
            <span>Trip Starts Soon · 15m</span>
          </span>
          <span class="dhero-time">07:30 AM</span>
        </div>

        <div>
          <div class="dhero-children">Arman &amp; Emma Khan</div>
          <div style="font-size:13px;opacity:0.9;margin-top:2px;">Parent: Sarah Khan · 2 Children (Minivan)</div>
        </div>

        <div class="dhero-route-box" style="background:rgba(0,0,0,0.2);">
          <div class="dhero-route-row">
            <i data-lucide="map-pin" style="width:14px;height:14px;color:#FDBA74;flex-shrink:0;"></i>
            <span>Pickup: <strong>12 Elm Street, Toronto</strong></span>
          </div>
          <div class="dhero-route-row">
            <i data-lucide="graduation-cap" style="width:14px;height:14px;color:#86EFAC;flex-shrink:0;"></i>
            <span>Destination: <strong>Greenfield International School</strong></span>
          </div>
        </div>

        <div class="dhero-actions-row">
          <button type="button" class="btn-dhero-primary" onclick="navigateTo('driverActiveTrip')">
            <i data-lucide="navigation" style="width:16px;height:16px;"></i>
            <span>I'm On the Way →</span>
          </button>
          <button type="button" class="btn-dhero-secondary" onclick="openChatWith('sarah')">
            <i data-lucide="message-square" style="width:16px;height:16px;"></i>
            <span>Message</span>
          </button>
        </div>
      </div>
    `;
  } else {
    // State B (Default): Upcoming Trip
    heroWrap.innerHTML = `
      <div class="driver-hero-card state-upcoming">
        <div class="dhero-badge-row">
          <span class="dhero-chip orange">Next Scheduled Trip</span>
          <span style="font-size:12.5px;font-weight:700;opacity:0.85;">Starts in 35 min</span>
        </div>

        <div style="display:flex;align-items:baseline;justify-content:space-between;">
          <div class="dhero-time">07:30 AM</div>
          <span style="font-size:13px;font-weight:700;color:#93C5FD;">Outbound Leg</span>
        </div>

        <div>
          <div class="dhero-children">Arman &amp; Emma Khan</div>
          <div style="font-size:12.5px;opacity:0.85;margin-top:2px;">Both-Way · Mon–Fri Recurring Commute</div>
        </div>

        <div class="dhero-route-box">
          <div class="dhero-route-row">
            <span style="color:#94A3B8;">Pickup:</span>
            <span>Home — 12 Elm Street</span>
          </div>
          <div class="dhero-route-row">
            <span style="color:#94A3B8;">Drop-off:</span>
            <span>Greenfield International School</span>
          </div>
          <div class="dhero-route-row">
            <span style="color:#94A3B8;">Parent:</span>
            <span>Sarah Khan (+1 416-555-0192)</span>
          </div>
        </div>

        <div class="dhero-actions-row">
          <button type="button" class="btn-dhero-primary" onclick="navigateTo('driverActiveTrip')">
            <span>View Trip Details →</span>
          </button>
          <button type="button" class="btn-dhero-secondary" onclick="openChatWith('sarah')">
            <i data-lucide="message-square" style="width:15px;height:15px;"></i>
            <span>Message</span>
          </button>
        </div>
      </div>
    `;
  }

  // Update badge count
  const newCount = d.requests.filter(r => r.status === 'new').length;
  const badge = document.getElementById('driverNewReqBadge');
  if (badge) badge.textContent = `${newCount} New Request${newCount === 1 ? '' : 's'}`;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 3. Driver Requests Manager
window.switchDriverRequestsTab = function (tab) {
  ['new', 'accepted', 'declined'].forEach(t => {
    const btn = document.getElementById(`btnDReq${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (btn) {
      if (t === tab) btn.classList.add('active');
      else btn.classList.remove('active');
    }
  });

  renderDriverRequests(tab);
};

function renderDriverRequests(tab = 'new') {
  const d = window.appState.driver;
  const wrap = document.getElementById('driverRequestsListWrap');
  if (!wrap) return;

  const filtered = d.requests.filter(r => r.status === tab);

  if (filtered.length === 0) {
    wrap.innerHTML = `
      <div style="text-align:center;padding:40px 20px;background:#FFFFFF;border:1px solid #E2E8F0;border-radius:18px;">
        <i data-lucide="inbox" style="width:36px;height:36px;color:#94A3B8;margin-bottom:8px;"></i>
        <h4 style="font-size:15px;font-weight:800;color:#0F172A;margin:0 0 4px 0;">No ${tab} requests</h4>
        <p style="font-size:13px;color:#64748B;margin:0;">When parents in your route request school commutes, they will appear here.</p>
      </div>
    `;
  } else {
    wrap.innerHTML = filtered.map(req => {
      const seatsOk = req.seatsNeeded <= d.vehicle.capacity;
      const capacityPill = seatsOk
        ? `<span class="capacity-badge ok"><i data-lucide="check" style="width:12px;height:12px;"></i> ${req.seatsNeeded} / ${d.vehicle.capacity} Seats Available</span>`
        : `<span class="capacity-badge full"><i data-lucide="alert-triangle" style="width:12px;height:12px;"></i> Capacity Full (${req.seatsNeeded} Seats Needed)</span>`;

      let actionButtons = '';
      if (tab === 'new') {
        actionButtons = `
          <div class="dreq-actions">
            <button type="button" class="btn-dreq-decline" onclick="declineDriverRequest('${req.id}')">Decline</button>
            <button type="button" class="btn-dreq-accept" onclick="acceptDriverRequest('${req.id}')">
              <span>Accept Booking (${req.price})</span>
            </button>
          </div>
        `;
      } else if (tab === 'accepted') {
        actionButtons = `
          <div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #F1F5F9;">
            <span class="status-chip completed" style="font-size:11.5px;font-weight:700;"><span class="status-dot"></span>Added to Schedule</span>
            <button type="button" class="btn-text-link" onclick="navigateTo('driverSchedule')" style="font-size:12.5px;font-weight:700;color:var(--color-primary);">Open Schedule →</button>
          </div>
        `;
      } else {
        actionButtons = `
          <div style="padding-top:8px;border-top:1px solid #F1F5F9;font-size:12px;color:#EF4444;font-weight:600;">
            Decline confirmed · Parent was notified
          </div>
        `;
      }

      return `
        <div class="driver-request-card">
          <div class="dreq-header">
            ${capacityPill}
            <span style="font-size:15px;font-weight:900;color:#0F172A;">${req.price}</span>
          </div>

          <div>
            <h4 style="font-size:15.5px;font-weight:800;color:#0F172A;margin:0 0 3px 0;">${req.children.join(' & ')}</h4>
            <div style="font-size:12.5px;color:#475569;font-weight:600;">Parent: ${req.parentName} (${req.parentPhone})</div>
          </div>

          <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:6px;font-size:12px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="map-pin" style="width:13px;height:13px;color:var(--color-primary);"></i>
              <span><strong>Pickup:</strong> ${req.routeFrom}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="graduation-cap" style="width:13px;height:13px;color:#059669;"></i>
              <span><strong>School:</strong> ${req.routeTo}</span>
            </div>
            <div style="display:flex;align-items:center;gap:6px;">
              <i data-lucide="clock" style="width:13px;height:13px;color:#D97706;"></i>
              <span><strong>Timing:</strong> ${req.timing}</span>
            </div>
            ${req.notes ? `
              <div style="margin-top:2px;padding-top:6px;border-top:1px solid #E2E8F0;color:#64748B;">
                <strong>Note:</strong> ${req.notes}
              </div>
            ` : ''}
          </div>

          ${actionButtons}
        </div>
      `;
    }).join('');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

window.acceptDriverRequest = function (reqId) {
  const d = window.appState.driver;
  const req = d.requests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'accepted';

  // Synchronize Parent Booking State
  const matchingParentBooking = window.appState.bookings.find(b => b.childIds.includes('arman') || b.childIds.includes('zara'));
  if (matchingParentBooking) {
    matchingParentBooking.status = 'confirmed';
  }

  // Add to Driver Schedule
  d.schedule.unshift({
    id: 'dsched-' + Date.now(),
    time: req.timing.includes('07:30') ? '07:30 AM' : '08:15 AM',
    childNames: req.childNamesShort,
    route: `${req.routeFrom} → ${req.routeTo}`,
    leg: 'Outbound Commute',
    seats: req.seatsNeeded,
    status: 'upcoming',
    isActionableNow: true
  });

  renderDriverRequests('new');
  showCustomToast('Booking Accepted! Trip added to your schedule.');
};

window.declineDriverRequest = function (reqId) {
  const d = window.appState.driver;
  const req = d.requests.find(r => r.id === reqId);
  if (!req) return;

  req.status = 'declined';
  renderDriverRequests('new');
  showCustomToast('Request declined. Parent has been notified.');
};

// 4. Driver Schedule Manager
window.switchDriverScheduleTab = function (tab) {
  const btnT = document.getElementById('btnDSchedToday');
  const btnU = document.getElementById('btnDSchedUpcoming');
  if (btnT && btnU) {
    if (tab === 'today') {
      btnT.classList.add('active');
      btnU.classList.remove('active');
    } else {
      btnU.classList.add('active');
      btnT.classList.remove('active');
    }
  }
  renderDriverSchedule(tab);
};

function renderDriverSchedule(tab = 'today') {
  const d = window.appState.driver;
  const wrap = document.getElementById('driverScheduleListWrap');
  if (!wrap) return;

  wrap.innerHTML = d.schedule.map(item => {
    return `
      <div style="background:#FFFFFF;border:1px solid #E2E8F0;border-radius:18px;padding:16px 18px;display:flex;flex-direction:column;gap:10px;box-shadow:0 2px 8px -2px rgba(15,23,42,0.04);">
        <div style="display:flex;align-items:center;justify-content:space-between;">
          <div style="display:flex;align-items:baseline;gap:6px;">
            <span style="font-size:18px;font-weight:900;color:#0F172A;">${item.time}</span>
            <span style="font-size:11.5px;font-weight:700;color:var(--color-primary);">${item.leg}</span>
          </div>
          <span class="status-chip" style="font-size:11px;padding:2px 8px;">${item.seats} Seats</span>
        </div>

        <div>
          <h4 style="font-size:15px;font-weight:800;color:#0F172A;margin:0 0 2px 0;">${item.childNames}</h4>
          <p style="font-size:12.5px;color:#64748B;margin:0;">${item.route}</p>
        </div>

        <div style="display:flex;align-items:center;gap:10px;padding-top:8px;border-top:1px solid #F1F5F9;margin-top:2px;">
          ${item.isActionableNow ? `
            <button type="button" class="btn-primary" style="height:36px;font-size:12.5px;font-weight:700;flex:1;" onclick="navigateTo('driverActiveTrip')">
              <span>Execute Ride Cockpit →</span>
            </button>
          ` : `
            <button type="button" class="btn-chat-compact" style="flex:1;height:34px;justify-content:center;" onclick="openChatWith('sarah')">
              <i data-lucide="message-square" style="width:13px;height:13px;"></i>
              <span>Contact Parent</span>
            </button>
          `}
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

// 5. Driver Active Trip & Milestone Stepper
const driverMilestones = [
  {
    step: 0,
    chip: 'Milestone: Confirmed',
    title: 'Home (12 Elm Street, Toronto)',
    desc: 'Pick up Arman Khan & Emma Khan from front porch',
    eta: 'ETA: 07:28 AM',
    btnText: "I'm On the Way →",
    parentSyncStage: 0
  },
  {
    step: 1,
    chip: 'Milestone: Driving to Pickup',
    title: 'En route to 12 Elm Street',
    desc: 'Approaching Elm Street neighbourhood',
    eta: 'ETA: 07:30 AM (2 min away)',
    btnText: 'Arrived at Pickup Location →',
    parentSyncStage: 1
  },
  {
    step: 2,
    chip: 'Milestone: Arrived at Pickup',
    title: 'At 12 Elm Street',
    desc: 'Verify children boarding vehicle safely',
    eta: 'Scheduled Departure: 07:32 AM',
    btnText: 'Verify Children Boarded (Attendance) →',
    parentSyncStage: 1
  },
  {
    step: 3,
    chip: 'Milestone: Children Boarded & En Route',
    title: 'Greenfield International School (Gate 2 Loop)',
    desc: 'Safe commute in progress with Arman & Emma',
    eta: 'ETA: 07:44 AM (12 min)',
    btnText: 'Arrived at Greenfield School →',
    parentSyncStage: 2
  },
  {
    step: 4,
    chip: 'Milestone: Arrived at School',
    title: 'School Drop-off Zone Gate 2',
    desc: 'Hand children to school supervisor / staff attendant',
    eta: 'Drop-off Window: 07:45 AM',
    btnText: 'Confirm Safe Drop-off & Handoff →',
    parentSyncStage: 3
  },
  {
    step: 5,
    chip: 'Milestone: Drop-off Completed',
    title: 'All Children Safely Handed Over',
    desc: 'Parent notified. Return leg scheduled for 01:00 PM.',
    eta: 'Completed at 07:46 AM',
    btnText: 'Rate Parent & Finish Ride ✓',
    parentSyncStage: 4
  }
];

function renderDriverActiveTrip() {
  const d = window.appState.driver;
  const curr = driverMilestones[d.activeTripStage || 0];

  const chip = document.getElementById('driverMilestoneText');
  const title = document.getElementById('driverActiveTargetTitle');
  const desc = document.getElementById('driverActiveTargetDesc');
  const eta = document.getElementById('driverActiveTripTimeLeft');
  const btn = document.getElementById('btnDriverMilestoneText');

  if (chip) chip.textContent = curr.chip;
  if (title) title.textContent = curr.title;
  if (desc) desc.textContent = curr.desc;
  if (eta) eta.textContent = curr.eta;
  if (btn) btn.textContent = curr.btnText;

  // Sync to Parent Tracking State!
  window.appState.trackingStageIndex = curr.parentSyncStage;

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

window.advanceDriverActiveTrip = function () {
  const d = window.appState.driver;

  // Step 2 is attendance verification modal
  if (d.activeTripStage === 2) {
    openDriverAttendanceModal();
    return;
  }

  if (d.activeTripStage >= driverMilestones.length - 1) {
    // Reset and return
    d.activeTripStage = 0;
    navigateTo('driverHome');
    showCustomToast('Trip completed! $120 added to your weekly earnings.');
    return;
  }

  d.activeTripStage++;
  renderDriverActiveTrip();
  showCustomToast(driverMilestones[d.activeTripStage].chip);
};

// 6. Multi-Child Attendance Modal Logic
window.openDriverAttendanceModal = function () {
  const modal = document.getElementById('driverAttendanceModal');
  if (modal) modal.classList.add('active');
};

window.closeDriverAttendanceModal = function () {
  const modal = document.getElementById('driverAttendanceModal');
  if (modal) modal.classList.remove('active');
};

window.toggleChildAttendance = function (child) {
  const d = window.appState.driver;
  d.attendance[child] = !d.attendance[child];

  const chk = document.getElementById(child === 'arman' ? 'chkAttendArman' : 'chkAttendEmma');
  const card = document.getElementById(child === 'arman' ? 'attCardArman' : 'attCardEmma');

  if (chk) chk.checked = d.attendance[child];
  if (card) {
    if (d.attendance[child]) card.classList.add('selected');
    else card.classList.remove('selected');
  }
};

window.confirmDriverAttendance = function () {
  closeDriverAttendanceModal();
  const d = window.appState.driver;
  d.activeTripStage = 3; // Advance to En Route
  renderDriverActiveTrip();
  showCustomToast('Attendance confirmed! Live GPS ride in progress.');
};

// 7. Driver Setup & Profile Renderers
function renderDriverSetup() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

function renderDriverProfile() {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.renderBookingSavedLocations) window.renderBookingSavedLocations();
    });
  } else {
    if (window.renderBookingSavedLocations) window.renderBookingSavedLocations();
  }
}




