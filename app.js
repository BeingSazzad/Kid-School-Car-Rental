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
  'authLogin',
  'authRoleSelect',
  'authOtp',
  'authProfile',
  'authPhoto',
  'authAddChild',
  'subscription',
  'authSuccess',
  'home',
  'myChildren',
  'addChild',
  'bookingSelectChildren',
  'bookingTripSetup',
  'bookingSearchProviders',
  'bookingProviderDetails',
  'bookingProviderReviews',
  'bookingSummary',
  'bookingRequestSent',
  'bookingConfirmed',
  'bookingDetails',
  'tracking',
  'inbox',
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
  'driverProfile',
  'driverOnboardProfile',
  'driverOnboardVehicle',
  'driverOnboardDocs',
  'driverDocDetail',
  'driverOnboardAvailability',
  'driverOnboardRate',
  'driverPayment',
  'driverPending',
  'driverSubscription',
  'driverRequestDetail',
  'driverTripPrep',
  'driverRateParent',
  'driverRatings',
  // WalkShare Role Screens
  'wsHome',
  'wsRequests',
  'wsSchedule',
  'wsProfile',
  'wsSetup',
  'wsOnboardProfile',
  'wsOnboardGroup',
  'wsOnboardDocs',
  'wsDocDetail',
  'wsOnboardAvailability',
  'wsOnboardRate',
  'wsPayment',
  'wsPending',
  'wsSubscription',
  'wsRequestDetail',
  'wsWalkPrep',
  'wsActiveWalk',
  'wsRatings',
  'profileNotifications',
  'profileReviews',
  'adminPortal'
];

window.personAvatar = function (name, fallback) {
  const raw = String(name || '').trim();
  const n = raw.toLowerCase();
  const map = [
    ['sadia', '/assets/avatar_sadia.jpg'],
    ['tariq', '/assets/avatar_tariq.jpg'],
    ['farhana', '/assets/avatar_farhana.jpg'],
    ['sarah', '/assets/avatar_sarah.jpg'],
    ['elena', '/assets/avatar_rehana.jpg'],
    ['rehana', '/assets/avatar_rehana.jpg'],
    ['nadia', '/assets/avatar_rehana.jpg'],
    ['kabir', '/assets/avatar_kabir.jpg'],
    ['farhan', '/assets/avatar_farhan.jpg'],
    ['marcus', '/assets/avatar_john.png'],
    ['priya', '/assets/avatar_farhana.jpg'],
    ['amira', '/assets/avatar_sarah.jpg'],
    ['arman', '/assets/avatar_arman.jpg'],
    ['emma', '/assets/avatar_emma.jpg'],
    ['zara', '/assets/avatar_zara.jpg'],
    ['omar', '/assets/avatar_arman.jpg'],
    ['yusuf', '/assets/avatar_arman.jpg'],
    ['ayla', '/assets/avatar_emma.jpg'],
    ['riya', '/assets/avatar_emma.jpg'],
    ['leo', '/assets/avatar_arman.jpg'],
    ['mia', '/assets/avatar_zara.jpg'],
    ['david', '/assets/avatar_kabir.jpg'],
    ['sumaiya', '/assets/avatar_farhana.jpg'],
    ['james', '/assets/avatar_john.png'],
    ['lisa', '/assets/avatar_sadia.jpg'],
    ['school', '/assets/avatar_school.jpg']
  ];
  for (let i = 0; i < map.length; i++) {
    if (n.indexOf(map[i][0]) !== -1) return map[i][1];
  }
  if (fallback) return fallback;
  const pool = [
    '/assets/avatar_sadia.jpg',
    '/assets/avatar_farhana.jpg',
    '/assets/avatar_kabir.jpg',
    '/assets/avatar_rehana.jpg',
    '/assets/avatar_john.png',
    '/assets/avatar_sarah.jpg'
  ];
  let h = 0;
  for (let i = 0; i < n.length; i++) h = (h + n.charCodeAt(i) * (i + 1)) % pool.length;
  return pool[h] || '/assets/avatar_sadia.jpg';
};

/* ==========================================================
   Central Application State (Single Source of Truth)
   ========================================================== */
window.appState = {
  user: {
    id: 'PRNT-9042',
    name: 'Sadia Khan',
    phone: '+1 (416) 555-0192',
    email: 'sadia.khan@example.com',
    role: 'Mother',
    relationship: 'Mother (Primary Guardian)',
    status: 'Verified Guardian',
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
      listedRate: 120,
      ratePeriod: 'week',
      oneTimeRate: 35,
      negotiable: true,
      preferredPayment: 'e-Transfer · Cash',
      paymentHandle: 'tariq.ahmed@interac.ca',
      maxServiceDistanceKm: 15,
      serviceArea: 'Midtown Toronto',
      photo: '/assets/avatar_tariq.jpg',
      phone: '+1 (416) 555-0182',
      experience: '4+ Yrs',
      onTimeRate: '99.8%',
      quote: '"Tariq has safely driven our kids to Greenfield School for over 8 months. Very gentle, always punctual, and sends notifications right away."',
      reviewer: '— Nadia Rahman (Parent of 2)',
      availability: {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '06:30', end: '09:00', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '13:00', end: '16:30', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      },
      zone: 'Greenfield / Midtown',
      lat: 43.6620,
      lng: -79.3900
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
      listedRate: 135,
      ratePeriod: 'week',
      oneTimeRate: 40,
      negotiable: true,
      preferredPayment: 'e-Transfer · Cash',
      paymentHandle: 'farhana.yasmin@interac.ca',
      maxServiceDistanceKm: 15,
      serviceArea: 'Annex / Midtown',
      photo: '/assets/avatar_farhana.jpg',
      phone: '+1 (416) 555-0183',
      experience: '6+ Yrs',
      onTimeRate: '100%',
      quote: '"Farhana is amazing with younger kids! Emma always looks forward to her morning commute and arrives at school with a big smile."',
      reviewer: '— David Miller (Parent of 1)',
      availability: {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '07:00', end: '09:30', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '14:00', end: '17:00', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      },
      zone: 'Annex / Midtown',
      lat: 43.6655,
      lng: -79.4030
    },
    {
      id: 'kabir',
      name: 'Kabir Hossain',
      vehicle: 'Toyota Highlander (2022)',
      plate: 'SCH-9102',
      rating: 4.8,
      reviewsCount: 62,
      seats: 4,
      baseWeekly: 110,
      listedRate: 110,
      ratePeriod: 'week',
      oneTimeRate: 30,
      negotiable: false,
      preferredPayment: 'e-Transfer · Cash',
      paymentHandle: 'kabir.hossain@interac.ca',
      maxServiceDistanceKm: 15,
      serviceArea: 'East York',
      photo: '/assets/avatar_kabir.jpg',
      phone: '+1 (416) 555-0184',
      experience: '3+ Yrs',
      onTimeRate: '99.2%',
      quote: '"Kabir is extremely reliable, always takes the safest routes and never speeds. Highly recommended for daily school carpool."',
      reviewer: '— Sumaiya Akter (Parent of 2)',
      availability: {
        weekly: ['Mon', 'Wed', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Wed', 'Fri'], start: '07:00', end: '08:30', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Mon', 'Wed', 'Fri'], start: '14:00', end: '16:00', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      },
      zone: 'East York',
      lat: 43.6890,
      lng: -79.3480
    },
    {
      id: 'sarah',
      name: 'Sarah Jenkins',
      category: 'walkshare',
      vehicle: 'Neighborhood Walking Group',
      plate: 'VERIFIED-ESCORT',
      rating: 4.9,
      reviewsCount: 45,
      seats: 3,
      baseWeekly: 75,
      listedRate: 75,
      ratePeriod: 'week',
      oneTimeRate: 25,
      negotiable: true,
      preferredPayment: 'e-Transfer · Cash',
      paymentHandle: 'sarah.jenkins@interac.ca',
      maxServiceDistanceKm: 5,
      serviceArea: 'Elm → Greenfield',
      photo: '/assets/avatar_sarah.jpg',
      phone: '+1 (416) 555-0185',
      experience: '5+ Yrs',
      onTimeRate: '99.5%',
      quote: '"Sarah\'s neighborhood walking group is the healthiest and most enjoyable commute for our son. He walks safely with neighborhood kids every morning."',
      reviewer: '— Marcus Vance (Parent of 1)',
      availability: {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '07:15', end: '08:45', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '14:30', end: '16:00', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      },
      zone: 'Elm → Greenfield',
      lat: 43.6582,
      lng: -79.3855
    },
    {
      id: 'elena',
      name: 'Elena Rostova',
      category: 'walkshare',
      vehicle: 'Greenfield Walk Escort',
      plate: 'WALK-SAFE-02',
      rating: 4.9,
      reviewsCount: 38,
      seats: 2,
      baseWeekly: 70,
      listedRate: 70,
      ratePeriod: 'week',
      oneTimeRate: 25,
      negotiable: true,
      preferredPayment: 'e-Transfer · Cash',
      paymentHandle: 'elena.rostova@interac.ca',
      maxServiceDistanceKm: 5,
      serviceArea: 'West-gate / Greenfield',
      photo: '/assets/avatar_rehana.jpg',
      phone: '+1 (416) 555-0186',
      experience: '4+ Yrs',
      onTimeRate: '100%',
      quote: '"Elena leads the morning walking group with immense care. The children practice safe sidewalk habits while getting fresh morning air."',
      reviewer: '— Sophia Lin (Parent of 1)',
      availability: {
        weekly: ['Tue', 'Thu'],
        windows: [
          { id: 'w1', days: ['Tue', 'Thu'], start: '07:30', end: '08:30', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Tue', 'Thu'], start: '14:30', end: '15:30', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      },
      zone: 'West-gate / Greenfield',
      lat: 43.6608,
      lng: -79.3960
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
  selectedChildIds: [],
  bookingDraft: {
    notes: '',
    direction: 'bothway',
    frequency: 'onetime',
    serviceType: 'drivers',
    childIds: [],
    pickupLocation: '',
    schoolLocation: '',
    outboundTime: '',
    returnTime: '',
    startDate: '',
    tripDate: '',
    selectedDays: [],
    recurrenceEnds: 'until_cancelled',
    recurrenceEndDate: '',
    untilCancelled: true,
    untilDate: '',
    providerId: 'tariq',
    paymentMethod: 'Visa •••• 4242'
  },
  parentSubscription: {
    status: 'trial',
    plan: 'monthly',
    trialDaysLeft: 14,
    priceMonthly: 9.99,
    priceAnnual: 79,
    renewal: 'Sep 22, 2026',
    history: [
      { id: 'sub-1', label: '14-day free trial started', date: 'Sep 8, 2026', amount: '$0.00' }
    ]
  },
  paymentHandle: {
    status: 'idle',
    handle: 'sadia.khan@interac',
    requestedBy: null
  },
  bookings: [
    // 1. Two-Way + Recurring (Active / In Progress)
    {
      id: 'H2S-84920',
      status: 'in_progress',
      notes: 'Gate 2 (Junior Wing Pickup) • Arman & Emma handover requires PIN verification. Driver will wait 5 mins at home gate.',
      activeNow: true,
      parentId: 'PRNT-9042',
      parentName: 'Sadia Khan',
      parentPhone: '+1 (416) 555-0192',
      parentRole: 'Mother (Primary Guardian)',
      parentPhoto: '/assets/avatar_sadia.jpg',
      childIds: ['arman', 'emma'],
      direction: 'bothway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri • Morning: 07:30 AM | Afternoon: 01:00 PM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:30 AM',
      returnTime: '01:00 PM',
      providerId: 'tariq',
      amount: 135,
      listedRate: 120,
      agreedRate: 135,
      rateStatus: 'agreed',
      ratePeriod: 'week',
      preferredPayment: 'e-Transfer · Cash',
      paymentHandleStatus: 'shared',
      paymentHandle: 'tariq.ahmed@interac.ca',
      paymentMethod: 'Interac e-Transfer (Direct to Driver)',
      createdAt: 'May 20, 2026'
    },
    // 2. One-Way + Recurring (Confirmed)
    {
      id: 'H2S-91042',
      status: 'confirmed',
      notes: 'Front gate drop-off. Arman walks to homeroom with morning monitor.',
      parentId: 'PRNT-9042',
      parentName: 'Sadia Khan',
      parentPhone: '+1 (416) 555-0192',
      parentRole: 'Mother (Primary Guardian)',
      parentPhoto: '/assets/avatar_sadia.jpg',
      childIds: ['arman'],
      direction: 'oneway',
      frequency: 'recurring',
      scheduleText: 'Mon–Fri • Morning: 07:45 AM (To School)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Greenfield International School',
      outboundTime: '07:45 AM',
      returnTime: '',
      providerId: 'farhana',
      amount: 135,
      listedRate: 135,
      agreedRate: 135,
      rateStatus: 'agreed',
      ratePeriod: 'week',
      preferredPayment: 'e-Transfer · Cash',
      paymentHandleStatus: 'shared',
      paymentHandle: 'farhana.yasmin@interac.ca',
      paymentMethod: 'Interac e-Transfer (Direct to Driver)',
      createdAt: 'May 22, 2026'
    },
    // 3. Two-Way + One-Time (Confirmed)
    {
      id: 'H2S-82194',
      status: 'confirmed',
      notes: 'Emma & Zara: Booster seats required. Handover to classroom teacher Ms. Jenkins at Kindergarten entrance.',
      parentId: 'PRNT-9042',
      parentName: 'Sadia Khan',
      parentPhone: '+1 (416) 555-0192',
      parentRole: 'Mother (Primary Guardian)',
      parentPhoto: '/assets/avatar_sadia.jpg',
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
      listedRate: 110,
      agreedRate: 55,
      rateStatus: 'agreed',
      ratePeriod: 'trip',
      preferredPayment: 'e-Transfer · Cash',
      paymentHandleStatus: 'shared',
      paymentHandle: 'kabir.hossain@interac.ca',
      paymentMethod: 'Cash at pickup',
      createdAt: 'May 23, 2026'
    },
    // 4. One-Way + One-Time (Pending)
    {
      id: 'H2S-73190',
      status: 'pending',
      notes: 'Please wait with Zara until teacher receives her at the playground gate.',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      scheduleText: 'Thursday, May 23 • 08:15 AM (Morning Escort)',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 25,
      listedRate: 75,
      agreedRate: null,
      rateStatus: 'listed',
      ratePeriod: 'trip',
      preferredPayment: 'e-Transfer · Cash',
      paymentHandleStatus: 'not_requested',
      paymentHandle: 'sarah.jenkins@interac.ca',
      paymentMethod: 'Direct to Escort',
      createdAt: 'May 21, 2026'
    },
    {
      id: 'H2S-REQ-9042',
      status: 'pending',
      parentId: 'PRNT-9042',
      parentName: 'Sadia Khan',
      parentPhone: '+1 (416) 555-0192',
      parentRole: 'Mother (Primary Guardian)',
      parentPhoto: '/assets/avatar_sadia.jpg',
      childIds: ['zara'],
      direction: 'bothway',
      frequency: 'onetime',
      scheduleText: 'Thursday, Sep 17 • 08:15 AM & 01:30 PM',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '01:30 PM',
      providerId: 'tariq',
      amount: 35,
      listedRate: 120,
      agreedRate: null,
      rateStatus: 'listed',
      ratePeriod: 'trip',
      preferredPayment: 'e-Transfer · Cash',
      paymentHandleStatus: 'not_requested',
      paymentHandle: 'tariq.ahmed@interac.ca',
      paymentMethod: 'Direct to Driver',
      createdAt: 'Sep 9, 2026'
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
      refundStatus: 'Arrange any ride-fee adjustment directly with the provider',
      createdAt: 'May 02, 2026'
    }
  ],
  transactions: [
    {
      id: 'tx_1',
      receiptNo: 'H2S-SUB-0999',
      date: 'Sep 1, 2026 • 09:15 AM',
      title: 'Platform subscription — Monthly',
      subtitle: 'Home2School app access',
      provider: 'Home2School',
      amount: 9.99,
      paymentMethod: 'Stripe • Visa •••• 4242',
      status: 'paid',
      statusText: 'Paid via Stripe',
      type: 'recurring',
      stripeTxId: 'ch_sub_monthly_0999'
    },
    {
      id: 'tx_2',
      receiptNo: 'H2S-SUB-0000',
      date: 'Aug 18, 2026 • 10:00 AM',
      title: '14-day free trial started',
      subtitle: 'No charge during trial',
      provider: 'Home2School',
      amount: 0.00,
      paymentMethod: 'Trial · no charge',
      status: 'paid',
      statusText: 'Trial',
      type: 'onetime',
      stripeTxId: 'ch_sub_trial_0000'
    }
  ],
  activeBookingId: 'H2S-84920',
  homeScenario: 'B', // Default matches redesigned Upcoming home (A/B/C switcher still works)
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
    serviceArea: 'Greenfield / Midtown',
    rating: 4.9,
    reviewsCount: 128,
    isOnline: true,
    verificationStatus: 'approved',
    onboarding: {
      profile: true,
      vehicle: true,
      docs: true,
      availability: true,
      rate: true
    },
    homeScenario: 'B',
    activeTripStage: 0,
    activeTrip: null,
    selectedRequestId: null,
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
      photo: '/assets/home_van_banner.jpg'
    },
    documents: [
      {
        id: 'licence',
        title: "Driver's Licence",
        status: 'approved',
        rejectReason: '',
        number: 'A8472-19305-66120',
        class: 'G',
        province: 'Ontario',
        expiry: '2028-06-14',
        fileFront: { name: 'licence-front.jpg', attached: true },
        fileBack: { name: 'licence-back.jpg', attached: true }
      },
      {
        id: 'insurance',
        title: 'Vehicle Insurance',
        status: 'approved',
        rejectReason: '',
        insurer: 'Intact Insurance',
        policyNumber: 'ON-884291-SIENNA',
        expiry: '2027-03-31',
        fileDoc: { name: 'insurance-pink-slip.pdf', attached: true }
      },
      {
        id: 'registration',
        title: 'Vehicle Registration',
        status: 'approved',
        rejectReason: '',
        plate: 'SCH-4091',
        vin: '5TDKRKEC8PS084091',
        expiry: '2027-08-31',
        fileDoc: { name: 'ontario-ownership.pdf', attached: true }
      },
      {
        id: 'criminal',
        title: 'Criminal Background Check',
        status: 'approved',
        rejectReason: '',
        issuer: 'Toronto Police Service',
        issueDate: '2026-07-12',
        expiry: '2029-07-12',
        fileDoc: { name: 'crc-tariq-ahmed.pdf', attached: true }
      },
      {
        id: 'vulnerable',
        title: 'Vulnerable Sector Check',
        status: 'approved',
        rejectReason: '',
        issuer: 'Toronto Police Service',
        issueDate: '2026-07-12',
        expiry: '2029-07-12',
        fileDoc: { name: 'vsc-tariq-ahmed.pdf', attached: true }
      }
    ],
    availability: {
      weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      morningSlot: '06:30 AM – 09:00 AM',
      afternoonSlot: '01:00 PM – 04:30 PM',
      windows: [
        { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '06:30', end: '09:00', label: 'Morning', enabled: true },
        { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '13:00', end: '16:30', label: 'Afternoon', enabled: true }
      ],
      exceptions: []
    },
    rate: {
      amount: 120,
      period: 'week',
      negotiable: true,
      paymentMethod: 'Interac e-Transfer'
    },
    subscription: {
      plan: 'monthly',
      priceMonthly: 29,
      priceAnnual: 279,
      renewal: 'Oct 8, 2026',
      status: 'trial',
      trialDaysLeft: 14,
      history: []
    },
    notifications: [
      { id: 'dn-1', title: 'New ride request', body: 'Nadia Rahman requested a Mon–Fri school commute for Yusuf and Ayla.', time: '12 min ago', unread: true, action: 'requests' },
      { id: 'dn-2', title: 'New ride request', body: 'Priya Patel asked for a one-time afternoon pickup for Riya.', time: '28 min ago', unread: true, action: 'requests' },
      { id: 'dn-3', title: 'Message from parent', body: 'Sadia: Arman and Emma will be at the porch at 07:28.', time: '1 hr ago', unread: true, action: 'inbox' },
      { id: 'dn-4', title: 'Message from Nadia', body: 'Can you confirm booster seats for both kids tomorrow?', time: 'Yesterday', unread: true, action: 'inbox' },
      { id: 'dn-5', title: 'Booking accepted', body: 'You accepted Marcus Chen’s Mon–Wed morning commute.', time: '2 days ago', unread: false, action: 'requests' },
      { id: 'dn-6', title: 'Trip reminder', body: 'Morning pickup for Arman & Emma starts in 25 minutes.', time: 'Tue', unread: false, action: 'inbox' }
    ],
    requests: [
      {
        id: 'dreq-1',
        bookingId: 'H2S-REQ-2201',
        parentId: 'PRNT-2201',
        parentName: 'Nadia Rahman',
        parentRole: 'Mother',
        parentPhoto: '/assets/avatar_rehana.jpg',
        parentPhone: '+1 (416) 555-0160',
        children: [
          { id: 'yusuf', name: 'Yusuf Rahman', age: '8 yrs', grade: 'Grade 3', school: 'Greenfield International School', notes: 'Booster seat', photo: '/assets/avatar_arman.jpg' },
          { id: 'ayla', name: 'Ayla Rahman', age: '6 yrs', grade: 'Grade 1', school: 'Greenfield International School', notes: 'Sits with brother', photo: '/assets/avatar_emma.jpg' }
        ],
        childNamesShort: 'Yusuf + Ayla',
        seatsNeeded: 2,
        pickupLocation: '18 Maple Avenue',
        dropoffLocation: 'Greenfield International School',
        routeFrom: '18 Maple Avenue',
        routeTo: 'Greenfield International School',
        dateLabel: 'Starts Mon, Sep 14, 2026',
        pickupTime: '07:45 AM',
        returnTime: '03:10 PM',
        recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        frequency: 'recurring',
        direction: 'bothway',
        timing: 'Mon–Fri · Pickup 07:45 AM · Return 03:10 PM',
        rate: 120,
        rateLabel: '$120 / week',
        price: '$120 / week',
        notes: 'Booster seat for Yusuf. Hand both children to the Greenfield loop supervisor.',
        status: 'new'
      },
      {
        id: 'dreq-2',
        bookingId: 'H2S-REQ-9042',
        parentId: 'PRNT-9042',
        parentName: 'Sadia Khan',
        parentRole: 'Mother (Primary Guardian)',
        parentPhoto: '/assets/avatar_sadia.jpg',
        parentPhone: '+1 (416) 555-0192',
        children: [
          { id: 'zara', name: 'Zara Khan', age: '5 yrs', grade: 'Pre-K', school: 'Sunshine Pre-school', notes: 'Hand to teacher at gate', photo: '/assets/avatar_zara.jpg' }
        ],
        childNamesShort: 'Zara',
        seatsNeeded: 1,
        pickupLocation: 'Home (12 Elm Street)',
        dropoffLocation: 'Sunshine Pre-school',
        routeFrom: 'Home (12 Elm Street)',
        routeTo: 'Sunshine Pre-school',
        dateLabel: 'Thursday, Sep 17, 2026',
        pickupTime: '08:15 AM',
        returnTime: '01:30 PM',
        recurringDays: [],
        frequency: 'onetime',
        direction: 'bothway',
        timing: 'Thu, Sep 17 · Pickup 08:15 AM · Return 01:30 PM',
        rate: 45,
        rateLabel: '$45 / day',
        price: '$45 / day',
        notes: 'Hand to classroom teacher Ms. Jenkins at the main entrance gate.',
        status: 'new'
      },
      {
        id: 'dreq-3',
        bookingId: 'H2S-REQ-3310',
        parentId: 'PRNT-3310',
        parentName: 'Priya Patel',
        parentRole: 'Mother',
        parentPhoto: '/assets/avatar_farhana.jpg',
        parentPhone: '+1 (416) 555-0177',
        children: [
          { id: 'riya', name: 'Riya Patel', age: '7 yrs', grade: 'Grade 2', school: 'Greenfield International School', notes: 'Carries epi-pen in backpack', photo: '/assets/avatar_emma.jpg' }
        ],
        childNamesShort: 'Riya',
        seatsNeeded: 1,
        pickupLocation: '42 Birchwood Crescent',
        dropoffLocation: 'Greenfield International School',
        routeFrom: '42 Birchwood Crescent',
        routeTo: 'Greenfield International School',
        dateLabel: 'Friday, Sep 18, 2026',
        pickupTime: '02:50 PM',
        returnTime: '',
        recurringDays: [],
        frequency: 'onetime',
        direction: 'oneway',
        timing: 'Fri, Sep 18 · School pickup 02:50 PM',
        rate: 28,
        rateLabel: '$28 / day',
        price: '$28 / day',
        notes: 'One-way afternoon only. Parent works late — drop at front door and wait until porch light is on.',
        status: 'new'
      },
      {
        id: 'dreq-4',
        bookingId: 'H2S-REQ-1188',
        parentId: 'PRNT-1188',
        parentName: 'Marcus Chen',
        parentRole: 'Father',
        parentPhoto: '/assets/avatar_john.png',
        parentPhone: '+1 (416) 555-0148',
        children: [
          { id: 'leo', name: 'Leo Chen', age: '9 yrs', grade: 'Grade 4', school: 'Greenfield International School', notes: '', photo: '/assets/avatar_arman.jpg' },
          { id: 'mia', name: 'Mia Chen', age: '6 yrs', grade: 'Grade 1', school: 'Greenfield International School', notes: 'Booster', photo: '/assets/avatar_zara.jpg' }
        ],
        childNamesShort: 'Leo + Mia',
        seatsNeeded: 2,
        pickupLocation: '9 Harbourview Lane',
        dropoffLocation: 'Greenfield International School',
        routeFrom: '9 Harbourview Lane',
        routeTo: 'Greenfield International School',
        dateLabel: 'Starts Mon, Sep 7, 2026',
        pickupTime: '07:20 AM',
        returnTime: '',
        recurringDays: ['Mon', 'Wed', 'Fri'],
        frequency: 'recurring',
        direction: 'oneway',
        timing: 'Mon/Wed/Fri · Pickup 07:20 AM',
        rate: 85,
        rateLabel: '$85 / week',
        price: '$85 / week',
        notes: 'Morning-only. Dad works downtown — kids ready at curb by 07:15.',
        status: 'accepted'
      },
      {
        id: 'dreq-5',
        bookingId: 'H2S-REQ-5520',
        parentId: 'PRNT-5520',
        parentName: 'Amira Hassan',
        parentRole: 'Mother',
        parentPhoto: '/assets/avatar_sarah.jpg',
        parentPhone: '+1 (416) 555-0133',
        children: [
          { id: 'omar', name: 'Omar Hassan', age: '10 yrs', grade: 'Grade 5', school: 'Rosedale Public School', notes: '', photo: '/assets/avatar_arman.jpg' }
        ],
        childNamesShort: 'Omar',
        seatsNeeded: 1,
        pickupLocation: '77 Rosedale Valley Road',
        dropoffLocation: 'Rosedale Public School',
        routeFrom: '77 Rosedale Valley Road',
        routeTo: 'Rosedale Public School',
        dateLabel: 'Mon–Fri starting Sep 21',
        pickupTime: '08:05 AM',
        returnTime: '03:40 PM',
        recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        frequency: 'recurring',
        direction: 'bothway',
        timing: 'Mon–Fri · 08:05 AM & 03:40 PM',
        rate: 110,
        rateLabel: '$110 / week',
        price: '$110 / week',
        notes: 'Outside usual Greenfield corridor — declined for route distance.',
        status: 'declined'
      }
    ],
    schedule: [
      {
        id: 'dsched-1',
        time: '07:30 AM',
        childNames: 'Arman + Emma Khan',
        route: 'Home (12 Elm Street) → Greenfield School',
        leg: 'Morning Ride (To School)',
        seats: 2,
        status: 'upcoming',
        isActionableNow: true
      },
      {
        id: 'dsched-2',
        time: '01:00 PM',
        childNames: 'Arman + Emma Khan',
        route: 'Greenfield School → Home (12 Elm Street)',
        leg: 'Afternoon Ride (Back Home)',
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
   Shared Availability + Timeline (Driver & WalkShare)
   ========================================================== */
window.H2SAvailability = (function () {
  const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function toMinutes(value) {
    if (!value) return null;
    const raw = String(value).trim();
    const ampm = raw.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (ampm) {
      let h = Number(ampm[1]);
      const m = Number(ampm[2]);
      const mer = ampm[3].toUpperCase();
      if (mer === 'PM' && h !== 12) h += 12;
      if (mer === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }
    const parts = raw.split(':').map(Number);
    if (parts.length < 2 || Number.isNaN(parts[0])) return null;
    return parts[0] * 60 + parts[1];
  }

  function toLabel(hhmm) {
    if (!hhmm) return '';
    if (/AM|PM/i.test(String(hhmm))) return String(hhmm);
    const [h, m] = String(hhmm).split(':').map(Number);
    const am = h < 12;
    const hr = h % 12 || 12;
    return `${String(hr).padStart(2, '0')}:${String(m || 0).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
  }

  function formatWindow(w) {
    if (!w) return '';
    return `${toLabel(w.start)} – ${toLabel(w.end)}`;
  }

  function defaultWindows() {
    return [
      { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '06:30', end: '09:00', label: 'Morning', enabled: true },
      { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '13:00', end: '16:30', label: 'Afternoon', enabled: true }
    ];
  }

  function normalize(raw) {
    const a = raw && typeof raw === 'object' ? raw : {};
    const defaults = defaultWindows();
    const existing = Array.isArray(a.windows) ? a.windows : [];
    const windows = defaults.map((base, i) => {
      const extra = existing[i] && typeof existing[i] === 'object' ? existing[i] : {};
      return {
        id: extra.id || base.id,
        label: base.label,
        start: extra.start || base.start,
        end: extra.end || base.end,
        days: Array.isArray(extra.days) && extra.days.length ? extra.days.slice() : base.days.slice(),
        enabled: extra.enabled !== false
      };
    });
    const weekly = Array.isArray(a.weekly) && a.weekly.length
      ? a.weekly.slice()
      : [...new Set(windows.flatMap((w) => w.days || []))];
    return {
      weekly,
      windows,
      exceptions: Array.isArray(a.exceptions) ? a.exceptions.filter(Boolean) : [],
      morningSlot: windows[0].enabled ? formatWindow(windows[0]) : '',
      afternoonSlot: windows[1].enabled ? formatWindow(windows[1]) : ''
    };
  }

  function summary(raw) {
    const a = normalize(raw);
    const bits = a.windows.filter((w) => w.enabled).map(formatWindow);
    const days = (a.weekly || []).join('/');
    if (!bits.length) return 'Set weekly hours';
    return `${days || 'Mon–Fri'} · ${bits.join(' · ')}`;
  }

  function dayFromIso(iso) {
    if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return '';
    const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
    if (Number.isNaN(d.getTime())) return '';
    return DAY_NAMES[d.getDay()];
  }

  function coversDay(avail, day) {
    if (!day) return true;
    const a = normalize(avail);
    if ((a.weekly || []).includes(day)) return true;
    return (a.windows || []).some((w) => w.enabled && (w.days || []).includes(day));
  }

  function timeInWindows(timeStr, windows, preferLabel) {
    const mins = toMinutes(timeStr);
    if (mins == null) return true;
    return (windows || []).some((w) => {
      if (!w || w.enabled === false) return false;
      if (preferLabel && w.label && w.label !== preferLabel) return false;
      return mins >= toMinutes(w.start) && mins <= toMinutes(w.end);
    });
  }

  function matchesSearch(rawAvail, draft) {
    const a = normalize(rawAvail);
    const search = draft || {};
    const dateIso = search.startDate || '';
    if (dateIso && (a.exceptions || []).includes(dateIso)) return false;

    if (search.frequency === 'recurring' && Array.isArray(search.selectedDays) && search.selectedDays.length) {
      const hit = search.selectedDays.some((d) => coversDay(a, d));
      if (!hit) return false;
    } else {
      const day = dayFromIso(dateIso);
      if (day && !coversDay(a, day)) return false;
    }

    const timing = search.timingFilter || 'all';
    const pickup = search.outboundTime;
    const ret = search.returnTime;
    const morning = a.windows.filter((w) => w.label === 'Morning');
    const afternoon = a.windows.filter((w) => w.label === 'Afternoon');

    if (timing === 'morning') {
      if (pickup && !timeInWindows(pickup, morning.length ? morning : a.windows, 'Morning')) return false;
      return morning.some((w) => w.enabled) || timeInWindows(pickup || '08:00', a.windows);
    }
    if (timing === 'afternoon') {
      const t = ret || pickup;
      if (t && !timeInWindows(t, afternoon.length ? afternoon : a.windows, 'Afternoon')) return false;
      return afternoon.some((w) => w.enabled) || timeInWindows(t || '15:00', a.windows);
    }

    if (pickup && !timeInWindows(pickup, a.windows)) return false;
    if (search.direction !== 'oneway' && ret && !timeInWindows(ret, a.windows)) return false;
    return true;
  }

  function applyToProviderCards(draft) {
    const search = draft || (window.appState && window.appState.bookingDraft) || {};
    const providers = (window.appState && window.appState.providers) || [];
    const timing = search.timingFilter || 'all';
    // Only hard-filter when parent explicitly picks Morning/Afternoon.
    // Default "All" must keep demo cards visible (times/zones are soft signals).
    const strictTiming = timing === 'morning' || timing === 'afternoon';

    document.querySelectorAll('#providersResultList .provider-result-card').forEach((card) => {
      const id = (card.getAttribute('data-provider-id') || '').toLowerCase();
      const provider = providers.find((p) => p.id === id);
      if (!provider) return;

      let avail = provider.availability;
      if (!avail && id === 'tariq' && window.appState.driver) avail = window.appState.driver.availability;
      if (!avail && id === 'sarah' && window.appState.walkshare) avail = window.appState.walkshare.availability;

      let line = card.querySelector('.provider-avail-line');
      if (!line) {
        line = document.createElement('div');
        line.className = 'provider-avail-line';
        line.hidden = true;
        card.appendChild(line);
      }
      line.hidden = true;
      line.textContent = summary(avail);
      line.style.display = 'none';

      const reason = card.getAttribute('data-hide-reason');
      if (card.style.display === 'none' && reason && reason !== 'availability') return;

      if (!strictTiming) {
        if (reason === 'availability') {
          card.style.display = 'flex';
          card.removeAttribute('data-hide-reason');
        }
        return;
      }

      const ok = matchesSearch(avail, search);
      if (!ok) {
        card.style.display = 'none';
        card.setAttribute('data-hide-reason', 'availability');
      } else if (reason === 'availability') {
        card.style.display = 'flex';
        card.removeAttribute('data-hide-reason');
      }
    });
  }

  return { toMinutes, toLabel, formatWindow, defaultWindows, normalize, summary, matchesSearch, applyToProviderCards, coversDay };
})();

window.H2SZone = (function () {
  function clean(value) {
    let s = String(value || '').trim();
    if (!s) return '';
    s = s.replace(/\s*sidewalk corridor\s*/gi, ' ')
      .replace(/\s*walking school bus escort\s*/gi, ' ')
      .replace(/\s*corridor\s*/gi, ' ')
      .replace(/\s{2,}/g, ' ')
      .trim();
    return s;
  }

  function label(provider) {
    if (!provider) return '';
    return clean(provider.zone || provider.serviceArea || provider.corridor || '');
  }

  function tokens(text) {
    return clean(text)
      .toLowerCase()
      .split(/[\/,·•→\-]+/)
      .map((t) => t.trim())
      .filter((t) => t.length > 2);
  }

  function matchesSearch(provider, draft) {
    const zone = label(provider);
    if (!zone) return true;
    const search = draft || {};
    const hay = `${search.pickupLocation || ''} ${search.schoolLocation || ''}`.toLowerCase();
    if (!hay.trim()) return true;
    const zTokens = tokens(zone);
    if (!zTokens.length) return true;
    return zTokens.some((t) => hay.includes(t));
  }

  function paintProviderCards() {
    const providers = (window.appState && window.appState.providers) || [];
    document.querySelectorAll('#providersResultList .provider-result-card').forEach((card) => {
      const id = (card.getAttribute('data-provider-id') || '').toLowerCase();
      const provider = providers.find((p) => p.id === id);
      if (!provider) return;
      if (!provider.zone) {
        if (id === 'tariq' && window.appState.driver) provider.zone = clean(window.appState.driver.serviceArea);
        if (id === 'sarah' && window.appState.walkshare) {
          provider.zone = clean(window.appState.walkshare.group?.route || window.appState.walkshare.serviceArea);
        }
      }
      let line = card.querySelector('.provider-zone-line');
      if (line) {
        line.style.display = 'none';
        line.textContent = '';
      }
      const z = label(provider);
      const zoneChip = card.querySelector('.pcs-zone');
      if (zoneChip && z) {
        const short = z.split(/[\/→]/)[0].trim();
        zoneChip.textContent = short;
      }
      // Zone is a display signal on search cards — never hard-hide the demo list.
      if (card.getAttribute('data-hide-reason') === 'zone') {
        card.style.display = 'flex';
        card.removeAttribute('data-hide-reason');
      }
    });
  }

  return { clean, label, matchesSearch, paintProviderCards };
})();

/* ==========================================================
   Product-Grade Unified Role & Workspace Switcher Engine
   (Parent ⇄ Driver Partner ⇄ WalkShare Escort ⇄ Admin Portal)
   ========================================================== */
window.ROLE_METADATA = {
  parent: {
    label: 'Parent',
    badge: 'Guardian',
    icon: 'user',
    color: '#4F46E5',
    toast: 'Parent mode'
  },
  driver: {
    label: 'Driver',
    badge: 'Partner',
    icon: 'car',
    color: '#D97706',
    toast: 'Driver mode'
  },
  walkshare: {
    label: 'WalkShare',
    badge: 'Escort',
    icon: 'footprints',
    color: '#1B2B68',
    toast: 'WalkShare mode'
  },
  admin: {
    label: 'Admin',
    badge: 'Later',
    icon: 'shield',
    color: '#0284C7',
    toast: 'Admin web dashboard comes later'
  }
};

window.openRoleSwitcherModal = function () {
  const modal = document.getElementById('roleSwitcherModal');
  if (!modal) return;
  modal.style.display = 'flex';
  modal.classList.add('active');
  const current = window.appState.activeRole || localStorage.getItem('h2s_active_role') || 'parent';
  window.syncRoleSwitcherCards(current);
  if (window.lucide) window.lucide.createIcons();
};

window.closeRoleSwitcherModal = function () {
  const modal = document.getElementById('roleSwitcherModal');
  if (!modal) return;
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
  }, 180);
};

window.handleSelectRole = function (role) {
  window.closeRoleSwitcherModal();
  setTimeout(() => {
    window.switchRole(role);
  }, 100);
};

window.syncRoleSwitcherCards = function (role) {
  const roles = ['parent', 'driver', 'walkshare'];
  roles.forEach((r) => {
    const card = document.getElementById(`roleCard${r.charAt(0).toUpperCase() + r.slice(1)}`);
    const chip = document.getElementById(`chipRole${r.charAt(0).toUpperCase() + r.slice(1)}`);
    if (card) {
      if (r === role) {
        card.classList.add('active');
      } else {
        card.classList.remove('active');
      }
    }
    if (chip) {
      if (r === role) {
        chip.textContent = 'Active';
        chip.classList.add('active');
      } else {
        chip.textContent = 'Switch';
        chip.classList.remove('active');
      }
    }
  });
};

window.syncRoleCapsuleUI = function (role) {
  const meta = window.ROLE_METADATA[role] || window.ROLE_METADATA.parent;
  const capsule = document.getElementById('roleCapsuleIsland');
  const title = document.getElementById('roleCapsuleTitle');
  const badge = document.getElementById('roleCapsuleBadge');
  const iconWrap = document.getElementById('roleCapsuleIconWrap');
  
  if (capsule) {
    capsule.setAttribute('data-role', role);
  }
  if (title) title.textContent = meta.label;
  if (badge) badge.textContent = meta.badge;
  if (iconWrap) {
    iconWrap.innerHTML = `<i data-lucide="${meta.icon}" style="width:14px;height:14px;"></i>`;
    if (window.lucide) window.lucide.createIcons();
  }
  
  window.syncRoleSwitcherCards(role);

  // Sync profile workspace cards across screens if present
  document.querySelectorAll('.profile-workspace-card').forEach((card) => {
    const titleEl = card.querySelector('.pwc-title');
    const subEl = card.querySelector('.pwc-subtitle');
    const iconWrap = card.querySelector('.pwc-icon-wrap');
    if (titleEl) {
      titleEl.textContent = `Role: ${meta.label.replace(' Mode', '')}`;
    }
    if (subEl) {
      subEl.textContent = 'Switch role';
    }
    if (iconWrap) {
      iconWrap.classList.remove('parent', 'driver', 'walkshare');
      iconWrap.classList.add(validRoleClass(role));
      // Standard card glyph (matches role-switcher design)
      iconWrap.innerHTML = '<i data-lucide="layers"></i>';
    }
  });
  if (window.lucide) window.lucide.createIcons();
};

function validRoleClass(role) {
  return role === 'driver' || role === 'walkshare' ? role : 'parent';
}

window.coreSwitchRole = function (role) {
  if (role === 'admin') {
    if (typeof window.showToast === 'function') {
      window.showToast('Admin web dashboard comes later', 'info');
    }
    return;
  }
  const valid = ['parent', 'driver', 'walkshare'].includes(role) ? role : 'parent';
  if (typeof window.clearNavStacks === 'function') window.clearNavStacks();
  window.appState.activeRole = valid;
  localStorage.setItem('h2s_active_role', valid);
  
  document.body.setAttribute('data-role', valid);
  const shell = document.getElementById('appShell');
  if (shell) shell.setAttribute('data-role', valid);
  
  window.syncRoleCapsuleUI(valid);
  
  const meta = window.ROLE_METADATA[valid] || window.ROLE_METADATA.parent;
  if (typeof window.showToast === 'function') {
    window.showToast(meta.toast, 'info');
  }

  if (valid === 'driver') {
    const next = typeof window.getDriverLanding === 'function' ? window.getDriverLanding() : 'driverSetup';
    window.navigateTo(next, true);
  } else if (valid === 'walkshare') {
    const next = typeof window.getWalkShareLanding === 'function' ? window.getWalkShareLanding() : 'wsHome';
    window.navigateTo(next, true);
  } else {
    window.navigateTo('home', true);
  }
};

window.switchRole = function (role) {
  window.coreSwitchRole(role);
};

// Global Hotkeys for seamless demo & power user switching
document.addEventListener('keydown', (e) => {
  if (e.altKey) {
    if (e.key === '1') {
      e.preventDefault();
      window.switchRole('parent');
    } else if (e.key === '2') {
      e.preventDefault();
      window.switchRole('driver');
    } else if (e.key === '3') {
      e.preventDefault();
      window.switchRole('walkshare');
    } else if (e.key === 'r' || e.key === 'R') {
      e.preventDefault();
      const modal = document.getElementById('roleSwitcherModal');
      if (modal && modal.style.display !== 'none' && modal.classList.contains('active')) {
        window.closeRoleSwitcherModal();
      } else {
        window.openRoleSwitcherModal();
      }
    }
  }
});

window.enterDriverFromAuth = function () {
  window.appState.activeRole = 'driver';
  window.appState.driverEntryFromAuth = true;
  localStorage.setItem('h2s_active_role', 'driver');
  window.syncRoleCapsuleUI('driver');
  window.navigateTo('authOtp');
};

window.enterWalkShareFromAuth = function () {
  window.appState.activeRole = 'walkshare';
  window.appState.walkshareEntryFromAuth = true;
  localStorage.setItem('h2s_active_role', 'walkshare');
  window.syncRoleCapsuleUI('walkshare');
  window.navigateTo('authOtp');
};

window.triggerEmergencyAlert = function () {
  if (typeof window.openEmergencySOSModal === 'function') {
    window.openEmergencySOSModal();
    return;
  }
  if (window.showToast) window.showToast('Emergency desk is unavailable in this session', 'error');
};

/* ==========================================================
   Navigation Router
   ========================================================== */
window.screenHistory = window.screenHistory || [];
window.navReturnStack = window.navReturnStack || [];

function navScreenBucket(name) {
  if (!name) return 'unknown';
  if (name === 'adminPortal') return 'admin';
  if (name === 'inbox' || name === 'messages' || name === 'notifications' || name === 'profileNotifications' || name === 'profileReviews' || name === 'faq' || name === 'legal' || name === 'about' || name === 'privacy' || name === 'contactSupport' || name === 'report' || name === 'rating' || name === 'bookingProviderDetails' || name === 'bookingProviderReviews') return 'shared';
  if (String(name).indexOf('driver') === 0) return 'driver';
  if (String(name).indexOf('ws') === 0) return 'walkshare';
  if (name === 'splash' || String(name).indexOf('onboarding') === 0 || String(name).indexOf('auth') === 0) return 'auth';
  return 'parent';
}

function activeNavRole() {
  return (window.appState && window.appState.activeRole) || localStorage.getItem('h2s_active_role') || 'parent';
}

function roleDefaultScreen(kind) {
  const role = activeNavRole();
  if (role === 'walkshare') return kind === 'profile' ? 'wsProfile' : 'wsHome';
  if (role === 'driver') return kind === 'profile' ? 'driverProfile' : 'driverHome';
  return kind === 'profile' ? 'profile' : 'home';
}

function impliedRoleFromScreen(screenName) {
  const bucket = navScreenBucket(screenName);
  if (bucket === 'driver') return 'driver';
  if (bucket === 'walkshare') return 'walkshare';
  if (bucket === 'parent') return 'parent';
  return null;
}

/** Intentional deep-link / hash: adopt the role that owns that screen so parent URLs stay parent. */
function adoptRoleFromIntentionalHash(screenName) {
  const implied = impliedRoleFromScreen(screenName);
  if (!implied) return false;
  const current = activeNavRole();
  if (implied === current) return false;
  window.appState.activeRole = implied;
  localStorage.setItem('h2s_active_role', implied);
  document.body.setAttribute('data-role', implied);
  const shell = document.getElementById('appShell');
  if (shell) shell.setAttribute('data-role', implied);
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(implied);
  return true;
}

function coerceScreenToRole(screenName) {
  if (screenName === 'adminPortal') return roleDefaultScreen('home');
  const role = activeNavRole();
  const bucket = navScreenBucket(screenName);

  // Driver screens: automatically adopt driver role and sync UI
  if (bucket === 'driver') {
    if (role !== 'driver') {
      window.appState.activeRole = 'driver';
      localStorage.setItem('h2s_active_role', 'driver');
      document.body.setAttribute('data-role', 'driver');
      const shell = document.getElementById('appShell');
      if (shell) shell.setAttribute('data-role', 'driver');
      if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('driver');
    }
    return screenName;
  }

  // WalkShare screens: automatically adopt walkshare role and sync UI
  if (bucket === 'walkshare') {
    if (role !== 'walkshare') {
      window.appState.activeRole = 'walkshare';
      localStorage.setItem('h2s_active_role', 'walkshare');
      document.body.setAttribute('data-role', 'walkshare');
      const shell = document.getElementById('appShell');
      if (shell) shell.setAttribute('data-role', 'walkshare');
      if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('walkshare');
    }
    return screenName;
  }

  // Shared and auth screens: stay as-is
  if (bucket === 'shared' || bucket === 'auth') {
    return screenName;
  }

  // Parent specific screens: if navigating directly, adopt parent role if requested
  if (bucket === 'parent') {
    if (screenName === 'home' && role === 'driver') return 'driverHome';
    if (screenName === 'home' && role === 'walkshare') return 'wsHome';
    if (screenName === 'bookings' && role === 'driver') return 'driverSchedule';
    if (screenName === 'bookings' && role === 'walkshare') return 'wsSchedule';
    if (screenName === 'profile' && role === 'driver') return 'driverProfile';
    if (screenName === 'profile' && role === 'walkshare') return 'wsProfile';
    if (screenName === 'subscription' && role === 'driver') return 'driverSubscription';
    if (screenName === 'subscription' && role === 'walkshare') return 'wsSubscription';
    return screenName;
  }

  return screenName;
}

window.clearNavStacks = function () {
  window.screenHistory = [];
  window.navReturnStack = [];
};

window.openNestedScreen = function (screenName, evt) {
  if (evt && typeof evt === 'object') {
    if (typeof evt.preventDefault === 'function') evt.preventDefault();
    if (typeof evt.stopPropagation === 'function') evt.stopPropagation();
  }
  const role = activeNavRole();
  const current = currentScreen || window.currentScreen;
  if (current && current !== screenName) {
    window.navReturnStack.push({ screen: current, role: role });
  }
  // Nested hops use replaceState (isBack) so browser Back cannot pop into the other role's hash.
  window.navigateTo(screenName, true);
};

window.backNested = function (fallback) {
  const role = activeNavRole();
  // Role never changes on Back — only the explicit role switcher may flip roles.
  let target = fallback || roleDefaultScreen('profile');
  const stack = window.navReturnStack || [];
  while (stack.length) {
    const entry = stack.pop();
    if (!entry) continue;
    if (entry.role && entry.role !== role) continue;
    if (!entry.screen || entry.screen === (currentScreen || window.currentScreen)) continue;
    // Skip cross-role screen ids that leaked into the stack.
    const bucket = navScreenBucket(entry.screen);
    if (role === 'driver' && bucket === 'parent') continue;
    if (role === 'walkshare' && bucket === 'parent') continue;
    if (role === 'walkshare' && bucket === 'driver') continue;
    if (role === 'parent' && bucket === 'driver') continue;
    if (role === 'parent' && bucket === 'walkshare') continue;
    if (role === 'driver' && bucket === 'walkshare') continue;
    target = entry.screen;
    break;
  }
  window.navigateTo(coerceScreenToRole(target), true);
};

window.selectSignupRoleDirect = function(role) {
  const valid = role === 'driver' || role === 'walkshare' ? role : 'parent';
  if (!window.appState) window.appState = {};
  window.appState._signupRole = valid;
  window.appState.activeRole = valid;
  try { localStorage.setItem('h2s_active_role', valid); } catch (e) {}
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(valid);

  document.querySelectorAll('.role-choice-card').forEach(card => {
    const isSelected = card.getAttribute('data-role') === valid;
    card.classList.toggle('active', isSelected);
  });
};

window.proceedFromRoleSelect = function() {
  const role = (window.appState && window.appState._signupRole) || 'parent';
  if (!window.appState) window.appState = {};
  window.appState.activeRole = role;
  try { localStorage.setItem('h2s_active_role', role); } catch (e) {}
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);

  if (role === 'driver') {
    window.appState.driverEntryFromAuth = true;
    if (typeof window.startDriverSignupFlow === 'function') {
      window.startDriverSignupFlow(window.appState.user?.name || 'Tariq Ahmed', window.appState.user?.email || 'tariq.ahmed@example.com');
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Setting up your Driver account...', 'info');
    }
    window.navigateTo('driverOnboardProfile');
    return;
  }

  if (role === 'walkshare') {
    window.appState.walkshareEntryFromAuth = true;
    if (typeof window.startWalkShareSignupFlow === 'function') {
      window.startWalkShareSignupFlow(window.appState.user?.name || 'Sarah Jenkins', window.appState.user?.email || 'sarah.jenkins@example.com');
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Setting up your WalkShare Escort account...', 'info');
    }
    window.navigateTo('wsOnboardProfile');
    return;
  }

  // Parent default
  if (typeof window.showToast === 'function') {
    window.showToast('Setting up your Family profile...', 'info');
  }
  window.navigateTo('authProfile');
};

window.navigateTo = function (screenName, isBack = false) {
  // Always stay inside the active role's screen set (never flip role here).
  screenName = coerceScreenToRole(screenName);
  if (!screens.includes(screenName)) return;

  if (!isBack && currentScreen && currentScreen !== screenName) {
    window.screenHistory.push(currentScreen);
  }
  if (!isBack && ['home', 'bookings', 'tracking', 'inbox', 'profile', 'driverHome', 'driverRequests', 'driverSchedule', 'driverProfile', 'wsHome', 'wsRequests', 'wsSchedule', 'wsProfile'].indexOf(screenName) !== -1) {
    window.navReturnStack = [];
  }

  currentScreen = screenName;
  window.currentScreen = screenName;
  const nextHash = `#${screenName}`;
  if (window.location.hash !== nextHash) {
    // Back + nested use replaceState so browser history cannot walk into the other role.
    if (isBack && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', nextHash);
    } else {
      window.location.hash = screenName;
    }
  }

  // Auto-dismiss all open modals and bottom sheets when navigating
  const filterModal = document.getElementById('searchFilterModal');
  if (filterModal) {
    filterModal.classList.remove('active');
    filterModal.style.display = 'none';
  }
  const roleModal = document.getElementById('roleSwitcherModal');
  if (roleModal) {
    roleModal.classList.remove('active');
    roleModal.style.display = 'none';
  }
  const sosModal = document.getElementById('emergencySOSModal');
  if (sosModal) {
    sosModal.classList.remove('active');
    sosModal.style.setProperty('display', 'none', 'important');
  }
  const pinModal = document.getElementById('dynamicSafetyPinModal') || document.getElementById('safetyPinModal');
  if (pinModal) {
    pinModal.classList.remove('active');
    pinModal.style.setProperty('display', 'none', 'important');
  }
  const fareModal = document.getElementById('dynamicFareModal');
  if (fareModal) {
    fareModal.classList.remove('active');
    fareModal.style.setProperty('display', 'none', 'important');
  }

  document.querySelectorAll('.book-ride-sheet.visible, .clean-modal-overlay[style*="display: flex"], .custom-modal-overlay.active').forEach((sheet) => {
    sheet.classList.remove('visible', 'active');
    if (sheet.classList.contains('custom-modal-overlay') || sheet.classList.contains('clean-modal-overlay')) {
      sheet.style.display = 'none';
    }
  });

  // Hide all screens, show target screen
  document.querySelectorAll('.screen-view').forEach(el => {
    el.classList.remove('active');
  });

  document.body.setAttribute('data-screen', screenName);
  const isAuthFlow = ['splash', 'onboarding1', 'onboarding2', 'onboarding3', 'authWelcome', 'authOtp', 'authProfile', 'authPhoto', 'authAddChild', 'authSuccess'].includes(screenName);
  document.body.classList.toggle('is-auth-flow', isAuthFlow);

  const targetEl = document.getElementById(`screen-${screenName}`);
  if (targetEl) {
    targetEl.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    const scrollContainer = targetEl.querySelector('.screen-scroll-body, .bk-scroll, .bd-scroll, .flow-scroll-body, .chat-messages, .scroll-body');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
    }
  }

  // Dynamic View Renderers
  if (screenName === 'home') {
    renderHome();
  } else if (screenName === 'bookingTripSetup') {
    if (window.initBookingSetupPage) window.initBookingSetupPage();
  } else if (screenName === 'bookingSearchProviders') {
    if (window.initProviderSearchPage) window.initProviderSearchPage();
  } else if (screenName === 'subscription') {
    if (window.renderSubscriptionScreen) window.renderSubscriptionScreen();
  } else if (screenName === 'inbox') {
    if (window.renderInboxScreen) window.renderInboxScreen();
  } else if (screenName === 'bookingSummary') {
    (window.renderBookingSummary || renderBookingSummary)();
  } else if (screenName === 'bookings') {
    (window.renderBookingsList || renderBookingsList)('upcoming');
  } else if (screenName === 'bookingDetails') {
    (window.renderBookingDetails || renderBookingDetails)(window.appState.activeBookingId);
  } else if (screenName === 'bookingConfirmed') {
    if (window.renderBookingConfirmation) window.renderBookingConfirmation();
  } else if (screenName === 'myChildren') {
    if (window.renderMyChildrenList) window.renderMyChildrenList();
  } else if (screenName === 'profilePayments') {
    if (window.renderTransactions) window.renderTransactions('all');
  } else if (screenName === 'profileEmergency') {
    if (window.renderEmergencyContactsList) window.renderEmergencyContactsList();
  } else if (screenName === 'contactSupport') {
    if (window.renderSupportScreen) window.renderSupportScreen();
  } else if (screenName === 'profileLocations') {
    if (window.renderSavedLocations) window.renderSavedLocations();
  } else if (screenName === 'driverHome') {
    if (window.renderDriverHome) window.renderDriverHome();
  } else if (screenName === 'driverRequests') {
    if (window.renderDriverRequests) window.renderDriverRequests(window.appState._driverReqTab || 'new');
  } else if (screenName === 'driverSchedule') {
    if (window.renderDriverSchedule) window.renderDriverSchedule(window.appState._driverSchedTab || 'today');
  } else if (screenName === 'driverActiveTrip') {
    if (window.renderDriverActiveTrip) window.renderDriverActiveTrip();
  } else if (screenName === 'driverSetup') {
    if (window.renderDriverSetup) window.renderDriverSetup();
  } else if (screenName === 'driverProfile') {
    if (window.renderDriverProfile) window.renderDriverProfile();
  } else if (screenName === 'driverOnboardProfile' && window.renderDriverOnboardProfile) {
    window.renderDriverOnboardProfile();
  } else if (screenName === 'driverOnboardVehicle' && window.renderDriverOnboardVehicle) {
    window.renderDriverOnboardVehicle();
  } else if (screenName === 'driverOnboardDocs' && window.renderDriverOnboardDocs) {
    window.renderDriverOnboardDocs();
  } else if (screenName === 'driverDocDetail' && window.renderDriverDocDetail) {
    window.renderDriverDocDetail();
  } else if (screenName === 'driverOnboardAvailability' && window.renderDriverOnboardAvailability) {
    window.renderDriverOnboardAvailability();
  } else if (screenName === 'driverOnboardRate' && window.renderDriverOnboardRate) {
    window.renderDriverOnboardRate();
  } else if (screenName === 'driverPayment' && window.renderDriverPayment) {
    window.renderDriverPayment();
  } else if (screenName === 'driverPending' && window.renderDriverPending) {
    window.renderDriverPending();
  } else if (screenName === 'driverSubscription' && window.renderDriverSubscription) {
    window.renderDriverSubscription();
  } else if (screenName === 'driverRequestDetail' && window.renderDriverRequestDetail) {
    window.renderDriverRequestDetail();
  } else if (screenName === 'driverTripPrep' && window.renderDriverTripPrep) {
    window.renderDriverTripPrep();
  } else if (screenName === 'driverRateParent' && window.renderDriverRateParent) {
    window.renderDriverRateParent();
  } else if (screenName === 'profileReviews' && window.renderParentReviewsScreen) {
    window.renderParentReviewsScreen();
  } else if (screenName === 'tracking') {
    if (window.renderTrackingScreen) window.renderTrackingScreen();
  }

  // Update Bottom Tab Bar highlights
  updateBottomTabHighlights(screenName);

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Screen specific triggers
  if (screenName === 'authSuccess' || screenName === 'bookingConfirmed') {
    triggerCelebrationConfetti();
  } else if (screenName === 'authOtp') {
    focusFirstEmptyOtp();
  } else if (screenName === 'authRoleSelect') {
    const r = window.appState._signupRole || window.appState.activeRole || 'parent';
    window.selectSignupRoleDirect(r);
  }

  // Render official Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

window.navigateBack = function (fallback = 'home') {
  // Prefer nested return stack (Profile → child) so Back never role-flips.
  if (window.navReturnStack && window.navReturnStack.length) {
    window.backNested(fallback || roleDefaultScreen('profile'));
    return;
  }
  const role = activeNavRole();
  const history = window.screenHistory || [];
  while (history.length) {
    const prev = history.pop();
    const bucket = navScreenBucket(prev);
    if (role === 'driver' && bucket === 'parent') continue;
    if (role === 'walkshare' && bucket === 'parent') continue;
    if (role === 'walkshare' && bucket === 'driver') continue;
    if (role === 'parent' && bucket === 'driver') continue;
    if (role === 'parent' && bucket === 'walkshare') continue;
    if (role === 'driver' && bucket === 'walkshare') continue;
    window.navigateTo(coerceScreenToRole(prev), true);
    return;
  }
  const safeFallback = coerceScreenToRole(fallback || roleDefaultScreen('home'));
  window.navigateTo(safeFallback, true);
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
    tracking: 1,
    messages: 2,
    inbox: 2,
    profile: 3,
    myChildren: 3,
    profilePersonalInfo: 3,
    profileEmergency: 3,
    profileLocations: 3,
    profilePayments: 3,
    profileReviews: 3,
    profileNotifications: 3,
    privacy: 3,
    subscription: 3,
    faq: 3,
    legal: 3,
    about: 3,
    contactSupport: 3
  };

  const driverTabMap = {
    driverHome: 0,
    driverRequests: 1,
    driverSchedule: 2,
    driverActiveTrip: 2,
    messages: 3,
    driverProfile: 4,
    driverSetup: 4,
    driverOnboardProfile: 4,
    driverOnboardVehicle: 4,
    driverOnboardDocs: 4,
    driverDocDetail: 4,
    driverOnboardAvailability: 4,
    driverPayment: 4,
    driverOnboardRate: 4,
    driverPending: 4,
    driverSubscription: 4,
    driverRequestDetail: 1,
    driverTripPrep: 2,
    driverRateParent: 0,
    notifications: 0,
    inbox: 3
  };

  const walkTabMap = {
    wsHome: 0,
    wsRequests: 1,
    wsSchedule: 2,
    wsActiveWalk: 2,
    wsWalkPrep: 2,
    wsProfile: 4,
    wsSetup: 4,
    wsOnboardProfile: 4,
    wsOnboardGroup: 4,
    wsOnboardDocs: 4,
    wsDocDetail: 4,
    wsOnboardAvailability: 4,
    wsOnboardRate: 4,
    wsPayment: 4,
    wsPending: 4,
    wsSubscription: 4,
    wsRequestDetail: 1,
    notifications: 0,
    inbox: 3,
    messages: 3
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
  if (driverIdx !== undefined && activeNavRole() === 'driver') {
    document.querySelectorAll('.driver-nav-bar').forEach(bar => {
      if (bar.id === 'inboxWalkNav') return;
      const tabs = bar.querySelectorAll('.tab-item');
      tabs.forEach((tab, idx) => {
        if (idx === driverIdx) tab.classList.add('active');
        else tab.classList.remove('active');
      });
    });
  }

  const walkIdx = walkTabMap[screenName];
  if (walkIdx !== undefined && activeNavRole() === 'walkshare') {
    document.querySelectorAll('#screen-wsHome .driver-nav-bar, #screen-wsRequests .driver-nav-bar, #screen-wsSchedule .driver-nav-bar, #screen-wsProfile .driver-nav-bar, #inboxWalkNav').forEach(bar => {
      const tabs = bar.querySelectorAll('.tab-item');
      tabs.forEach((tab, idx) => {
        if (idx === walkIdx) tab.classList.add('active');
        else tab.classList.remove('active');
      });
    });
  }
}

// Browser back/forward sync — intentional role-screen hashes adopt that role; never flip on shared/auth.
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  if (!hash || !screens.includes(hash)) return;
  adoptRoleFromIntentionalHash(hash);
  const coerced = coerceScreenToRole(hash);
  if (coerced === currentScreen) {
    if (hash !== coerced && window.history && window.history.replaceState) {
      window.history.replaceState(null, '', `#${coerced}`);
    }
    return;
  }
  window.navigateTo(coerced, true);
});

// Initialization — wait until Driver + WalkShare wrappers register (module load order).
function initApp() {
  if (window.__h2sBooted) return;
  window.__h2sBooted = true;
  renderHome();

  let savedRole = localStorage.getItem('h2s_active_role') || 'parent';
  if (savedRole === 'admin' || !['parent', 'driver', 'walkshare'].includes(savedRole)) {
    savedRole = 'parent';
    localStorage.setItem('h2s_active_role', 'parent');
  }
  window.appState.activeRole = savedRole;
  const btnP = document.getElementById('btnRoleParent');
  const btnD = document.getElementById('btnRoleDriver');
  const btnW = document.getElementById('btnRoleWalkShare');
  [btnP, btnD, btnW].forEach((btn) => {
    if (!btn) return;
    btn.classList.remove('active', 'driver-active', 'walkshare-active');
  });
  if (savedRole === 'driver' && btnD) btnD.classList.add('active', 'driver-active');
  else if (savedRole === 'walkshare' && btnW) btnW.classList.add('active', 'walkshare-active');
  else if (btnP) btnP.classList.add('active');

  const hash = window.location.hash ? window.location.hash.replace('#', '') : '';
  let initial = 'home';
  if (hash && screens.includes(hash)) {
    adoptRoleFromIntentionalHash(hash);
    initial = hash;
  } else if (savedRole === 'driver') {
    initial = typeof window.getDriverLanding === 'function' ? window.getDriverLanding() : 'driverSetup';
  } else if (savedRole === 'walkshare') {
    initial = typeof window.getWalkShareLanding === 'function' ? window.getWalkShareLanding() : 'wsHome';
  }
  // Re-read role after intentional hash adopt
  window.appState.activeRole = localStorage.getItem('h2s_active_role') || window.appState.activeRole || 'parent';
  window.navigateTo(initial);

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

window.__h2sTryBoot = function () {
  // Boot only after the outermost role layer (WalkShare) has wrapped navigateTo/switchRole.
  if (window.__h2sBooted) return;
  if (!window.__h2sWalkShareReady) {
    // Module scripts can race DOMContentLoaded; retry briefly, then fall back.
    if (!window.__h2sBootTimer) {
      window.__h2sBootTimer = setTimeout(() => {
        if (!window.__h2sBooted) initApp();
      }, 50);
    }
    return;
  }
  if (window.__h2sBootTimer) clearTimeout(window.__h2sBootTimer);
  initApp();
};

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', () => {
    // If WalkShare already loaded (unlikely), boot; else WalkShare calls __h2sTryBoot.
    window.__h2sTryBoot();
  });
} else {
  window.__h2sTryBoot();
}

/* ==========================================================
   Home Screen: State-Driven Logic (Scenario A / B / C)
   ========================================================== */
window.setHomeState = function (state) {
  window.appState.homeScenario = state;
  renderHome();
};

/** Soft upcoming trip cards on parent Home (State B) - 1:1 Reference UI */
window.HOME_UPCOMING_TRIPS = [
  {
    id: 'H2S-84920',
    month: 'MAY',
    day: '22',
    weekday: 'Wed',
    time: '07:30 AM',
    type: 'oneway',
    pickup: '9 Harbourview Lane',
    dropoff: 'Greenfield International'
  },
  {
    id: 'H2S-73190',
    month: 'MAY',
    day: '22',
    weekday: 'Wed',
    time: '07:30 AM & 01:00 PM',
    type: 'roundtrip',
    pickup: '9 Harbourview Lane',
    dropoff: 'Greenfield International'
  },
  {
    id: 'H2S-66211',
    month: 'MAY',
    day: '24',
    weekday: 'Wed',
    time: '07:30 AM & 01:00 PM',
    type: 'roundtrip',
    pickup: '9 Harbourview Lane',
    dropoff: 'Greenfield International'
  }
];

window.buildPhUpcomingRowHtml = function (trip) {
  const id = String(trip.id || '').replace(/'/g, '');
  const isRound = trip.type === 'roundtrip' || trip.direction === 'bothway' || /&|both/i.test(trip.time || '') || (Array.isArray(trip.legs) && trip.legs.length > 1);
  const timeText = trip.time || (isRound ? '07:30 AM & 01:00 PM' : '07:30 AM');
  
  let pickupAddr = trip.pickup || '9 Harbourview Lane';
  let dropoffAddr = trip.dropoff || 'Greenfield International';
  if (Array.isArray(trip.legs) && trip.legs.length) {
    pickupAddr = trip.legs[0].route ? trip.legs[0].route.split('→')[0].trim() : pickupAddr;
    dropoffAddr = trip.legs[0].route ? trip.legs[0].route.split('→')[1].trim() : dropoffAddr;
  }

  const tagHtml = isRound
    ? `<span class="ph-up-type-pill is-round"><i data-lucide="repeat" style="width:12px;height:12px;"></i> Round Trip</span>`
    : `<span class="ph-up-type-pill is-oneway"><i data-lucide="arrow-right" style="width:12px;height:12px;"></i> One-way</span>`;

  return `
    <button type="button" class="ph-upcoming-card-ref" onclick="openBookingDetails('${id}')">
      <div class="ph-up-date-badge">
        <span class="ph-up-month">${trip.month || 'MAY'}</span>
        <span class="ph-up-day">${trip.day || '22'}</span>
        <span class="ph-up-wd">${trip.weekday || 'Wed'}</span>
      </div>
      <div class="ph-up-body-ref">
        <div class="ph-up-head-row">
          <div class="ph-up-time-text">${timeText}</div>
          ${tagHtml}
        </div>
        <div class="ph-up-route-rail">
          <div class="ph-up-route-stop">
            <span class="ph-up-dot-solid"></span>
            <span class="ph-up-addr-text">${pickupAddr}</span>
          </div>
          <div class="ph-up-rail-line"></div>
          <div class="ph-up-route-stop">
            <span class="ph-up-dot-ring"></span>
            <span class="ph-up-addr-text">${dropoffAddr}</span>
          </div>
        </div>
      </div>
    </button>
  `;
};

window.renderHomeUpcomingList = function (trips) {
  const list = document.getElementById('homeUpcomingList');
  if (!list) return;
  const rows = Array.isArray(trips) && trips.length ? trips : window.HOME_UPCOMING_TRIPS;
  list.innerHTML = rows.map(window.buildPhUpcomingRowHtml).join('');
};

function renderHome() {
  const state = window.appState.homeScenario;
  const viewA = document.getElementById('homeStateAView');
  const viewB = document.getElementById('homeStateBView');
  const viewC = document.getElementById('homeStateCView');
  const nextBlock = document.getElementById('homeNextTripBlock');

  const btnA = document.getElementById('btnStateA');
  const btnB = document.getElementById('btnStateB');
  const btnC = document.getElementById('btnStateC');

  [btnA, btnB, btnC].forEach(b => b?.classList.remove('active'));

  if (state === 'A') {
    if (viewA) viewA.style.display = 'flex';
    if (viewB) viewB.style.display = 'none';
    if (viewC) viewC.style.display = 'none';
    if (nextBlock) nextBlock.style.display = 'none';
    btnA?.classList.add('active');
  } else if (state === 'B') {
    if (viewA) viewA.style.display = 'none';
    if (viewB) viewB.style.display = 'flex';
    if (viewC) viewC.style.display = 'none';
    if (nextBlock) nextBlock.style.display = 'block';
    btnB?.classList.add('active');

    if (window.renderHomeUpcomingList) window.renderHomeUpcomingList();

    // Populate featured Today's trip card (1:1 Reference UI)
    const activeBooking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
    if (activeBooking) {
      const provider = window.appState.providers.find(p => p.id === activeBooking.providerId) || window.appState.providers[0];
      const setText = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = val;
      };

      const isBothWay = activeBooking.direction === 'bothway' || /bothway|round/i.test(activeBooking.direction || '');
      const isReturn = /return|pm/i.test(activeBooking.title || '') || (!isBothWay && /1:00|3:15|3:45/i.test(activeBooking.outboundTime || ''));
      
      // 1. Direction badge
      const dirBadge = document.getElementById('homeTodayTripDirBadge');
      if (dirBadge) {
        if (isBothWay) {
          dirBadge.textContent = '⇄ Round Trip';
          dirBadge.className = 'ph-tt-dir-badge is-round';
        } else {
          dirBadge.textContent = '→ One-Way';
          dirBadge.className = 'ph-tt-dir-badge is-oneway';
        }
      }

      // 2. Exact 2-Stop Times: Morning Home Pickup & Afternoon School Return Pickup
      const dateText = activeBooking.date || 'Mon, Sep 1';
      const pickupName = activeBooking.pickupLocation || 'Home (12 Elm Street)';
      const schoolName = activeBooking.schoolLocation || 'Greenfield International School';
      const pickupTime = activeBooking.outboundTime || '07:30 AM';
      const schoolReturnTime = isBothWay ? (activeBooking.returnTime || '01:00 PM') : 'Drop-off';

      setText('homeTodayTripDate', dateText);
      setText('homeTodayPickupLoc', pickupName);
      setText('homeTodayPickupTime', pickupTime);
      setText('homeTodayDropLoc', schoolName);
      setText('homeTodayDropTime', schoolReturnTime);

      const driverName = String(provider.name || 'Mohammad Rahim').replace(/\s*\(WalkShare\)/i, '');
      setText('homeTodayDriverName', driverName);
      setText('homeTodayDriverScore', String(provider.rating != null ? provider.rating : '4.8'));

      const dPhoto = document.getElementById('homeTodayDriverPhoto');
      if (dPhoto) {
        dPhoto.src = provider.photo || '/assets/avatar_tariq.jpg';
        dPhoto.onerror = function() { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
      }

      const vehName = String(provider.vehicle || 'Toyota Hiace').replace(/\s*\(\d{4}\)\s*/g, '').trim();
      setText('homeTodayVehicleName', vehName || 'Toyota Hiace');
      setText('homeTodayVehiclePlate', provider.plate || 'GA 15-6789');

      const vPhoto = document.getElementById('homeTodayVehiclePhoto');
      if (vPhoto) {
        vPhoto.src = '/assets/vehicle_hiace_white.jpg';
        vPhoto.onerror = function() { this.onerror = null; this.src = '/assets/vehicle_hiace_white.jpg'; };
      }
    }
  } else if (state === 'C') {
    if (viewA) viewA.style.display = 'none';
    if (viewB) viewB.style.display = 'none';
    if (viewC) viewC.style.display = 'flex';
    if (nextBlock) nextBlock.style.display = 'none';
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
window.setTripType = function (type) {
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.tripType = type; // 'morning' | 'afternoon' | 'bothway'

  const btnMorning = document.getElementById('btnDirMorning');
  const btnAfternoon = document.getElementById('btnDirAfternoon');
  const btnBoth = document.getElementById('btnDirBothWay');
  const morningBlock = document.getElementById('morningScheduleBlock');
  const returnBlock = document.getElementById('returnScheduleBlock');
  const timesGrid = document.querySelector('#screen-bookingTripSetup .book-ride-times')
    || document.querySelector('.clean-sched-times-grid');

  btnMorning?.classList.toggle('active', type === 'morning');
  btnAfternoon?.classList.toggle('active', type === 'afternoon');
  btnBoth?.classList.toggle('active', type === 'bothway');
  if (btnMorning) btnMorning.setAttribute('aria-pressed', type === 'morning' ? 'true' : 'false');
  if (btnAfternoon) btnAfternoon.setAttribute('aria-pressed', type === 'afternoon' ? 'true' : 'false');
  if (btnBoth) btnBoth.setAttribute('aria-pressed', type === 'bothway' ? 'true' : 'false');

  if (type === 'morning') {
    window.appState.bookingDraft.direction = 'oneway';
    window.appState.bookingDraft.oneWayShift = 'morning';
    if (morningBlock) morningBlock.style.display = 'flex';
    if (returnBlock) returnBlock.style.display = 'none';
    if (timesGrid) timesGrid.classList.add('is-oneway');
  } else if (type === 'afternoon') {
    window.appState.bookingDraft.direction = 'oneway';
    window.appState.bookingDraft.oneWayShift = 'afternoon';
    if (morningBlock) morningBlock.style.display = 'none';
    if (returnBlock) returnBlock.style.display = 'flex';
    if (timesGrid) timesGrid.classList.add('is-oneway');
  } else {
    window.appState.bookingDraft.direction = 'bothway';
    window.appState.bookingDraft.oneWayShift = null;
    if (morningBlock) morningBlock.style.display = 'flex';
    if (returnBlock) returnBlock.style.display = 'flex';
    if (timesGrid) timesGrid.classList.remove('is-oneway');
  }

  if (typeof window.updateBookingSearchCta === 'function') window.updateBookingSearchCta();
};

window.setTripDirection = function (dir) {
  if (dir === 'oneway') {
    window.setTripType('morning');
  } else {
    window.setTripType('bothway');
  }
};

window.setBookingZone = function (zone, btn) {
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.zone = zone === 'all' ? '' : zone;

  const badge = document.getElementById('setupSelectedZoneBadge');
  if (badge) {
    badge.textContent = zone === 'all' ? 'All Zones' : zone.charAt(0).toUpperCase() + zone.slice(1);
  }

  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.sf-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }

  if (typeof window.filterBookingProviders === 'function') {
    window.filterBookingProviders(window.appState.bookingDraft.serviceType || 'all');
  }
};

window.setOneWayShift = function (shift) {
  window.appState.bookingDraft.oneWayShift = shift;
  const btnM = document.getElementById('btnShiftMorning');
  const btnA = document.getElementById('btnShiftAfternoon');
  const morningBlock = document.getElementById('morningScheduleBlock');
  const returnBlock = document.getElementById('returnScheduleBlock');

  if (shift === 'afternoon') {
    btnM?.classList.remove('active');
    btnA?.classList.add('active');
    if (morningBlock) morningBlock.style.display = 'none';
    if (returnBlock) returnBlock.style.display = 'flex';
  } else {
    btnM?.classList.add('active');
    btnA?.classList.remove('active');
    if (morningBlock) morningBlock.style.display = 'flex';
    if (returnBlock) returnBlock.style.display = 'none';
  }
};

window.handleRecurringToggleChange = function (isRecurring) {
  const repeatDaysSection = document.getElementById('repeatDaysSection');
  const subTxt = document.getElementById('repeatSubtitleText');

  if (isRecurring) {
    window.appState.bookingDraft.frequency = 'recurring';
    if (repeatDaysSection) {
      repeatDaysSection.hidden = false;
      repeatDaysSection.style.display = '';
    }
    if (subTxt) subTxt.textContent = 'Repeats every week on selected days';
  } else {
    window.appState.bookingDraft.frequency = 'onetime';
    if (repeatDaysSection) {
      repeatDaysSection.hidden = true;
      repeatDaysSection.style.display = 'none';
    }
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
    if (repeatDaysSection) {
      repeatDaysSection.hidden = true;
      repeatDaysSection.style.display = 'none';
    }
    if (subTxt) subTxt.textContent = 'One-time ride on selected date';
  } else {
    if (toggle) toggle.checked = true;
    if (repeatDaysSection) {
      repeatDaysSection.hidden = false;
      repeatDaysSection.style.display = '';
    }
    if (subTxt) subTxt.textContent = 'Repeats every week on selected days';
  }
};

window.toggleRepeatDay = function (btn) {
  if (!btn) return;
  btn.classList.toggle('active');
  const activeDays = Array.from(document.querySelectorAll('#cleanDaysGrid .clean-day-btn.active'))
    .map(b => b.getAttribute('data-day'))
    .filter(Boolean);
  window.appState.bookingDraft.selectedDays = activeDays;
  if (window.updateBookingSearchCta) window.updateBookingSearchCta();
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
    displayStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  if (type === 'outbound') {
    const txt = document.getElementById('setupOutboundDateText');
    if (txt) {
      txt.value = displayStr;
      txt.textContent = displayStr;
    }
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
        <span style="font-size: 10px; color: #94A3B8; font-weight: 600;">No saved locations yet</span>
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

  if (typeof window.updateBookingSearchCta === 'function') window.updateBookingSearchCta();

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
  const addrInput = document.getElementById('mapPickerAddressInput');

  const isSchool = targetType === 'school';

  if (titleEl) titleEl.textContent = isSchool ? 'Select School Gate & Drop-off Pin' : 'Pinpoint Pickup Location';

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

window.initBookingSetupPage = function () {
  const notesInput = document.getElementById('setupBookingNotesInput');
  if (notesInput && window.appState && window.appState.bookingDraft) {
    notesInput.value = window.appState.bookingDraft.notes || '';
  }
};

window.proceedFromTripSetup = function () {
  const notesEl = document.getElementById('setupBookingNotesInput');
  if (notesEl && window.appState.bookingDraft) {
    window.appState.bookingDraft.notes = notesEl.value.trim();
  }
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
      .map(b => b.getAttribute('data-day'))
      .filter(Boolean);
    window.appState.bookingDraft.selectedDays = activeDays;
    const untilCancelled = !!document.getElementById('toggleUntilCancelled')?.checked;
    window.appState.bookingDraft.untilCancelled = untilCancelled;
    window.appState.bookingDraft.untilDate = untilCancelled
      ? ''
      : (window.appState.bookingDraft.untilDate || window.appState.bookingDraft.recurrenceEndDate || '');
    window.appState.bookingDraft.recurrenceEnds = untilCancelled ? 'until_cancelled' : 'date';
    if (untilCancelled) window.appState.bookingDraft.recurrenceEndDate = '';
  } else {
    window.appState.bookingDraft.selectedDays = [];
    window.appState.bookingDraft.untilCancelled = false;
    window.appState.bookingDraft.untilDate = '';
  }

  window.navigateTo('bookingSearchProviders');

  // Immediately apply chosen serviceType filter on search results
  const selectedType = window.appState.bookingDraft.serviceType || 'all';
  window.filterBookingProviders(selectedType);
};

window.filterBookingProviders = function (filterType, btnEl) {
  // Sync the clean 3 pills on bookingSearchProviders
  const pillAll = document.getElementById('searchPillAll');
  const pillDriver = document.getElementById('searchPillDrivers');
  const pillWalk = document.getElementById('searchPillWalkShare');

  if (pillAll) pillAll.classList.toggle('active', filterType === 'all');
  if (pillDriver) pillDriver.classList.toggle('active', filterType === 'drivers');
  if (pillWalk) pillWalk.classList.toggle('active', filterType === 'walkshare');

  // Also sync Trip Setup buttons if user returns
  const btnAll = document.getElementById('btnServiceAll');
  const btnDriver = document.getElementById('btnServiceDriver');
  const btnWalk = document.getElementById('btnServiceWalk');
  if (btnAll) btnAll.classList.toggle('active', filterType === 'all');
  if (btnDriver) btnDriver.classList.toggle('active', filterType === 'drivers');
  if (btnWalk) btnWalk.classList.toggle('active', filterType === 'walkshare');

  // Sync back to bookingDraft if core service type
  if (['all', 'drivers', 'walkshare'].includes(filterType)) {
    if (window.appState && window.appState.bookingDraft) {
      window.appState.bookingDraft.serviceType = filterType;
    }
  }

  // Filter provider cards directly
  const cards = document.querySelectorAll('#providersResultList .provider-result-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    let show = true;
    if (filterType === 'drivers') {
      show = cat === 'drivers';
    } else if (filterType === 'walkshare') {
      show = cat === 'walkshare';
    }
    card.style.display = show ? 'flex' : 'none';
    if (show) card.removeAttribute('data-hide-reason');
    else card.setAttribute('data-hide-reason', 'service');
  });

  if (typeof window.applyProviderCompactFilter === 'function') {
    const active = document.querySelector('#providerFilterRow .mvp-filter-chip.active');
    window.applyProviderCompactFilter(active?.getAttribute('data-filter') || 'all', active);
    return;
  }

  if (window.H2SAvailability && typeof window.H2SAvailability.applyToProviderCards === 'function') {
    window.H2SAvailability.applyToProviderCards(window.appState?.bookingDraft);
  }
  if (window.H2SZone && typeof window.H2SZone.paintProviderCards === 'function') {
    window.H2SZone.paintProviderCards();
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
};

/* ==========================================================
   Child Safety Center Modal Controller (Design System Match)
   ========================================================== */
window.openChildSafetyCenter = function () {
  const modal = document.getElementById('modal-childSafetyCenter');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeChildSafetyCenter = function () {
  const modal = document.getElementById('modal-childSafetyCenter');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.triggerChildSafetySOS = function () {
  window.closeChildSafetyCenter();
  if (typeof window.openEmergencySOSModal === 'function') {
    window.openEmergencySOSModal();
  } else {
    alert('SOS Emergency Alert Dispatched to 24/7 Child Transit Monitoring Center & Emergency Contacts.');
  }
};

/* ==========================================================
   Booking Wizard & Driver / Chaperone Profile Viewer
   ========================================================== */
window.currentDriverProfileReturnScreen = 'home';
window.currentDriverProfileId = 'tariq';

/* ==========================================================
   Section 4.8: Ratings & Reviews Engine (Two-Way, Verified)
   ========================================================== */
window.currentDriverProfileReturnScreen = 'home';
window.currentDriverProfileId = 'tariq';
window.activeRatingStars = 5;
window.selectedReviewTags = [];

window.getProviderReviews = function (provider) {
  if (!provider) return [];
  if (!provider.reviewsList || !Array.isArray(provider.reviewsList)) {
    const mainQuote = String(provider.quote || '').replace(/^"|"$/g, '').trim()
      || 'Reliable and great with kids.';
    const mainName = String(provider.reviewer || 'Parent')
      .replace(/^—\s*/, '')
      .replace(/\s*\(.*\)$/, '')
      .trim() || 'Parent';
    const shortName = mainName.split(' ').map((p, i) => (i === 0 ? p : (p[0] ? p[0] + '.' : ''))).join(' ').trim();

    provider.reviewsList = provider.category === 'walkshare'
      ? [
          { id: 'rev-seed-1', name: shortName, rating: 5, date: '3 wk ago', text: mainQuote, tags: ['Safe Crossings', 'Friendly'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-2', name: 'Priya S.', rating: 5, date: '1 mo ago', text: 'Kids love the morning walk. Clear updates every day.', tags: ['Punctual', 'Clear Updates'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-3', name: 'Omar H.', rating: 5, date: '2 mo ago', text: 'Safe crossings and friendly group. Highly recommend.', tags: ['Safe Crossings'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-4', name: 'Lisa M.', rating: 4, date: '3 mo ago', text: 'Punctual and calm. Would book again.', tags: ['Punctual'], flaggedForAdmin: false, hidden: false }
        ]
      : [
          { id: 'rev-seed-1', name: shortName, rating: 5, date: '2 wk ago', text: mainQuote, tags: ['Punctual', 'Careful Driver'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-2', name: 'David M.', rating: 5, date: '1 mo ago', text: 'Always on time. Kids feel safe in the car.', tags: ['Punctual', 'Clean Vehicle'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-3', name: 'Sumaiya A.', rating: 5, date: '6 wk ago', text: 'Clear chat updates and careful driving.', tags: ['Clear Updates', 'Careful Driver'], flaggedForAdmin: false, hidden: false },
          { id: 'rev-seed-4', name: 'James K.', rating: 4, date: '2 mo ago', text: 'Professional and friendly. Easy booking.', tags: ['Polite & Friendly'], flaggedForAdmin: false, hidden: false }
        ];
  }
  return provider.reviewsList.filter(r => !r.hidden);
};

window.openProviderReviews = function (filterTab = 'all') {
  const id = window.currentDriverProfileId || 'tariq';
  const provider = (window.appState.providers || []).find((p) => p.id === id) || window.appState.providers[0];
  if (!provider) return;

  const cleanName = provider.name.replace(/\s*\(WalkShare\)/i, '');
  const titleEl = document.getElementById('providerReviewsTitle');
  if (titleEl) titleEl.textContent = 'Reviews · ' + cleanName.split(' ')[0];

  const scoreEl = document.getElementById('providerReviewsScore');
  const starsEl = document.getElementById('providerReviewsStars');
  const countEl = document.getElementById('providerReviewsCountLabel');
  
  const allReviews = window.getProviderReviews(provider);
  const visibleReviews = allReviews.filter(r => !r.hidden);
  
  // Calculate average rating
  let totalScore = 0;
  visibleReviews.forEach(r => { totalScore += Number(r.rating || 5); });
  const avgRating = visibleReviews.length ? (totalScore / visibleReviews.length) : 4.9;
  provider.rating = Math.round(avgRating * 10) / 10;
  provider.reviewsCount = visibleReviews.length;

  if (scoreEl) scoreEl.textContent = provider.rating.toFixed(1);
  if (starsEl) {
    const full = Math.round(provider.rating);
    starsEl.textContent = '★★★★★'.slice(0, full) + '☆☆☆☆☆'.slice(0, 5 - full);
  }
  if (countEl) countEl.textContent = provider.reviewsCount + ' reviews';

  // Render Top Action Bar (+ Write Review & Filter Chips)
  const summaryEl = document.getElementById('providerReviewsSummary');
  if (summaryEl) {
    let actionsWrap = document.getElementById('providerReviewsActionsRow');
    if (!actionsWrap) {
      actionsWrap = document.createElement('div');
      actionsWrap.id = 'providerReviewsActionsRow';
      actionsWrap.style.marginTop = '14px';
      summaryEl.appendChild(actionsWrap);
    }
    actionsWrap.innerHTML = `
      <div style="display: flex; gap: 8px; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        <div style="display: flex; gap: 6px; overflow-x: auto; padding-bottom: 2px;">
          <button type="button" class="mvp-filter-chip ${filterTab === 'all' ? 'active' : ''}" onclick="openProviderReviews('all')">All (${visibleReviews.length})</button>
          <button type="button" class="mvp-filter-chip ${filterTab === '5' ? 'active' : ''}" onclick="openProviderReviews('5')">5 ★</button>
          <button type="button" class="mvp-filter-chip ${filterTab === '4' ? 'active' : ''}" onclick="openProviderReviews('4')">4 ★</button>
          <button type="button" class="mvp-filter-chip ${filterTab === 'critical' ? 'active' : ''}" onclick="openProviderReviews('critical')">Under 3.5 ★</button>
        </div>
        <button type="button" class="btn-primary" onclick="openParentRateDriverModal('${provider.id}')" style="padding: 6px 12px; font-size: 12px; font-weight: 700; border-radius: 99px; height: auto;">
          + Write Review
        </button>
      </div>
    `;
  }

  // Filter reviews
  let filtered = visibleReviews;
  if (filterTab === '5') filtered = visibleReviews.filter(r => r.rating === 5);
  else if (filterTab === '4') filtered = visibleReviews.filter(r => r.rating === 4);
  else if (filterTab === 'critical') filtered = visibleReviews.filter(r => r.rating < 3.5 || r.flaggedForAdmin);

  const list = document.getElementById('providerReviewsList');
  if (list) {
    if (!filtered.length) {
      list.innerHTML = `
        <div style="text-align: center; padding: 32px 16px; color: #64748B;">
          <i data-lucide="message-square-dashed" style="width: 36px; height: 36px; stroke-width: 1.5; margin-bottom: 8px; color: #94A3B8;"></i>
          <p style="font-size: 13.5px; font-weight: 600; margin: 0;">No reviews matching this filter.</p>
        </div>
      `;
    } else {
      list.innerHTML = filtered.map((r) => {
        const stars = '★'.repeat(Math.min(5, Math.max(1, Math.round(r.rating || 5))));
        const photo = window.personAvatar(r.name, '/assets/avatar_sadia.jpg');
        const isFlagged = !!r.flaggedForAdmin;
        const tagsHtml = (r.tags && r.tags.length)
          ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin-top:6px;">${r.tags.map(t => `<span style="background:#F1F5F9; color:#475569; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:6px;">${t}</span>`).join('')}</div>`
          : '';

        const flagBanner = isFlagged
          ? `<div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:8px; padding:6px 10px; margin-top:8px; display:flex; align-items:flex-start; gap:6px;">
              <span style="font-size:12px;">⚠️</span>
              <div style="font-size:11px; color:#B45309; line-height:1.35;">
                <strong>Flagged for Administrator Review (Section 4.8)</strong>: Low rating threshold alert. Safety team notified.
              </div>
            </div>`
          : '';

        const adminActions = `
          <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:8px; border-top:1px solid #F1F5F9; padding-top:6px;">
            <button type="button" onclick="moderateProviderReview('${provider.id}', '${r.id}', 'hide')" style="background:none; border:none; font-size:11px; color:#64748B; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:3px;">
              <i data-lucide="eye-off" style="width:12px;height:12px;"></i> Hide
            </button>
            <button type="button" onclick="moderateProviderReview('${provider.id}', '${r.id}', 'delete')" style="background:none; border:none; font-size:11px; color:#DC2626; font-weight:600; cursor:pointer; display:flex; align-items:center; gap:3px;">
              <i data-lucide="trash-2" style="width:12px;height:12px;"></i> Delete
            </button>
          </div>
        `;

        return (
          '<article class="provider-review-card" style="position:relative;">' +
            '<div class="profile-review-top-row">' +
              '<div class="profile-reviewer-info">' +
                '<div class="provider-review-avatar"><img src="' + photo + '" alt="" onerror="this.src=\'/assets/avatar_sadia.jpg\'" /></div>' +
                '<div>' +
                  '<div class="profile-reviewer-name">' + r.name + '</div>' +
                  '<div class="profile-reviewer-sub">Verified parent</div>' +
                '</div>' +
              '</div>' +
              '<div class="provider-review-meta">' +
                '<span class="profile-rating-stars-gold">' + stars + '</span>' +
                '<span class="profile-review-date">' + (r.date || 'Recent') + '</span>' +
              '</div>' +
            '</div>' +
            (r.text ? '<p class="profile-review-quote" style="margin-top:8px;">' + r.text + '</p>' : '') +
            tagsHtml +
            flagBanner +
            adminActions +
          '</article>'
        );
      }).join('');
    }
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  window.navigateTo('bookingProviderReviews');
};

window.openParentRateDriverModal = function (providerId, bookingId) {
  const pId = providerId || window.currentDriverProfileId || 'tariq';
  const provider = (window.appState.providers || []).find((p) => p.id === pId) || window.appState.providers[0];
  const driverName = provider ? provider.name.replace(/\s*\(WalkShare\)/i, '') : 'Driver';
  const driverPhoto = provider ? (provider.photo || '/assets/avatar_tariq.jpg') : '/assets/avatar_tariq.jpg';
  const vehTitle = provider ? (provider.vehicle || 'Toyota Sienna') : 'Vehicle';

  window.activeRatingStars = 5;
  window.selectedReviewTags = [];

  let modal = document.getElementById('modal-parentRateDriver');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'modal-parentRateDriver';
    modal.className = 'safety-modal-overlay';
    modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.6); z-index:99999; display:flex; align-items:flex-end; justify-content:center; backdrop-filter:blur(4px);';
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="safety-pin-modal-card" style="max-width:430px; width:100%; margin:0 auto; background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px; box-sizing:border-box; animation:slideUp 0.25s cubic-bezier(0.16,1,0.3,1);">
      <!-- Header -->
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div>
          <span style="font-size:11px; font-weight:700; color:#F59E0B; text-transform:uppercase; letter-spacing:0.5px;">Trip Completed</span>
          <h3 style="font-size:19px; font-weight:800; color:#0F172A; margin:2px 0 0;">Rate Your Experience</h3>
        </div>
        <button type="button" onclick="closeParentRateDriverModal()" style="width:32px; height:32px; border-radius:50%; background:#F1F5F9; border:none; color:#64748B; display:flex; align-items:center; justify-content:center; cursor:pointer;">
          <i data-lucide="x" style="width:18px;height:18px;"></i>
        </button>
      </div>

      <!-- Provider Mini Row -->
      <div style="display:flex; align-items:center; gap:12px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:10px 14px; margin-bottom:16px;">
        <img src="${driverPhoto}" alt="" style="width:44px; height:44px; border-radius:50%; object-fit:cover; border:2px solid #E2E8F0;" onerror="this.src='/assets/avatar_tariq.jpg'" />
        <div style="flex:1; min-width:0;">
          <div style="font-size:14.5px; font-weight:800; color:#0F172A;">${driverName}</div>
          <div style="font-size:12px; color:#64748B;">${vehTitle} · School Commute</div>
        </div>
      </div>

      <!-- 1. Star Rating (Required 1-5) -->
      <div style="text-align:center; margin-bottom:16px;">
        <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:6px;">Star Rating <span style="color:#EF4444;">* (Required)</span></label>
        <div id="parentRatingStarsRow" style="display:flex; justify-content:center; gap:10px; font-size:32px; cursor:pointer;">
          <span class="rate-star" data-val="1" onclick="setParentRatingStars(1)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="2" onclick="setParentRatingStars(2)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="3" onclick="setParentRatingStars(3)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="4" onclick="setParentRatingStars(4)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="5" onclick="setParentRatingStars(5)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
        </div>
        <div id="parentRatingSentimentLabel" style="font-size:13px; font-weight:700; color:#0F172A; margin-top:4px;">5.0 · Excellent &amp; Safe</div>
      </div>

      <!-- Section 4.8 Low Rating Admin Flag Notice -->
      <div id="parentRatingAdminFlagAlert" style="display:none; background:#FFFBEB; border:1px solid #FDE68A; border-radius:10px; padding:10px 12px; margin-bottom:14px; text-align:left;">
        <div style="display:flex; gap:8px; align-items:flex-start;">
          <span style="font-size:14px;">⚠️</span>
          <div style="font-size:11.5px; color:#92400E; line-height:1.4;">
            <strong>Administrator Review (Section 4.8 Rule)</strong>: Ratings below 3.5 stars are automatically flagged for admin quality review to maintain child safety standards.
          </div>
        </div>
      </div>

      <!-- Quick Feedback Tags -->
      <div style="margin-bottom:14px;">
        <label style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:6px;">Highlights</label>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${['⏰ Punctual', '🛡️ Safe Driving', '👦 Great with Kids', '🚗 Clean Car', '💬 Clear Chat', '🚪 Curbside Care'].map(tag => `
            <button type="button" class="review-tag-chip" onclick="toggleReviewTag(this, '${tag}')" style="padding:6px 10px; border-radius:99px; font-size:11.5px; font-weight:700; border:1px solid #CBD5E1; background:#FFFFFF; color:#475569; cursor:pointer;">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 2. Written Review (Optional) -->
      <div style="margin-bottom:18px;">
        <label for="parentReviewComment" style="font-size:12px; font-weight:700; color:#475569; display:block; margin-bottom:6px;">
          Written Review <span style="font-weight:400; color:#94A3B8;">(Optional)</span>
        </label>
        <textarea id="parentReviewComment" rows="3" class="form-input" placeholder="Share specific details about this trip to help other parents..." style="width:100%; border-radius:12px; border:1px solid #CBD5E1; padding:10px 12px; font-size:13px; font-family:inherit; resize:none; box-sizing:border-box;"></textarea>
      </div>

      <!-- Submit Button -->
      <div style="display:flex; gap:10px;">
        <button type="button" onclick="closeParentRateDriverModal()" class="btn-secondary" style="flex:1; padding:13px; border-radius:14px; font-weight:700; font-size:13.5px;">Cancel</button>
        <button type="button" onclick="submitParentDriverRating('${pId}', '${bookingId || 'H2S-84920'}')" class="btn-primary" style="flex:2; padding:13px; border-radius:14px; font-weight:800; font-size:14px; background:linear-gradient(135deg, #1B2B68 0%, #2A3F8E 100%);">
          Submit Review →
        </button>
      </div>
    </div>
  `;

  modal.style.display = 'flex';
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};

window.closeParentRateDriverModal = function () {
  const modal = document.getElementById('modal-parentRateDriver');
  if (modal) modal.style.display = 'none';
};

window.setParentRatingStars = function (val) {
  window.activeRatingStars = Number(val);
  const row = document.getElementById('parentRatingStarsRow');
  if (row) {
    const stars = row.querySelectorAll('.rate-star');
    stars.forEach((s) => {
      const v = Number(s.getAttribute('data-val'));
      s.textContent = v <= val ? '★' : '☆';
      s.style.color = v <= val ? '#F59E0B' : '#CBD5E1';
    });
  }

  const sentimentEl = document.getElementById('parentRatingSentimentLabel');
  const sentiments = {
    1: '1.0 · Poor Experience',
    2: '2.0 · Needs Improvement',
    3: '3.0 · Average',
    4: '4.0 · Very Good & Reliable',
    5: '5.0 · Excellent & Safe'
  };
  if (sentimentEl) sentimentEl.textContent = sentiments[val] || `${val}.0`;

  const flagAlert = document.getElementById('parentRatingAdminFlagAlert');
  if (flagAlert) {
    flagAlert.style.display = val < 3.5 ? 'block' : 'none';
  }
};

window.toggleReviewTag = function (btn, tag) {
  btn.classList.toggle('selected');
  if (btn.classList.contains('selected')) {
    btn.style.background = '#EFF6FF';
    btn.style.borderColor = '#1B2B68';
    btn.style.color = '#1B2B68';
    if (!window.selectedReviewTags.includes(tag)) window.selectedReviewTags.push(tag);
  } else {
    btn.style.background = '#FFFFFF';
    btn.style.borderColor = '#CBD5E1';
    btn.style.color = '#475569';
    window.selectedReviewTags = window.selectedReviewTags.filter(t => t !== tag);
  }
};

window.submitParentDriverRating = function (providerId, bookingId) {
  const stars = Number(window.activeRatingStars || 5);
  if (stars < 1 || stars > 5) {
    alert('Please select a star rating (1 to 5 stars).');
    return;
  }

  const comment = (document.getElementById('parentReviewComment')?.value || '').trim();
  const tags = (window.selectedReviewTags || []).slice();
  const provider = (window.appState.providers || []).find((p) => p.id === providerId) || window.appState.providers[0];
  if (!provider) return;

  const isFlagged = stars < 3.5;
  const parentName = (window.appState.user?.name || 'Sadia Khan');
  const shortName = parentName.split(' ').map((p, i) => (i === 0 ? p : (p[0] ? p[0] + '.' : ''))).join(' ').trim();

  const newReview = {
    id: 'rev-' + Date.now(),
    name: shortName,
    fullName: parentName,
    providerId: provider.id,
    bookingId: bookingId || 'H2S-84920',
    rating: stars,
    date: 'Today',
    text: comment || (stars >= 4 ? 'Great school commute, gentle driving and punctual arrival.' : 'Trip completed.'),
    tags: tags,
    flaggedForAdmin: isFlagged,
    flagReason: isFlagged ? `Low rating (${stars}/5 stars) automatically flagged for admin review.` : '',
    hidden: false
  };

  // Add to provider's review list
  const existing = window.getProviderReviews(provider);
  provider.reviewsList = [newReview, ...existing];

  // Store in parent's submitted reviews state
  if (!window.appState.parentReviews) window.appState.parentReviews = [];
  window.appState.parentReviews.unshift(newReview);

  // Recalculate provider score
  const visible = provider.reviewsList.filter(r => !r.hidden);
  let sum = 0;
  visible.forEach(r => { sum += Number(r.rating || 5); });
  provider.rating = Math.round((sum / visible.length) * 10) / 10;
  provider.reviewsCount = visible.length;

  // Sync to driver state if Tariq
  if (provider.id === 'tariq' && window.syncDriverToProviders) {
    if (window.appState.driver) {
      window.appState.driver.rating = provider.rating;
      window.appState.driver.reviewsCount = provider.reviewsCount;
    }
    window.syncDriverToProviders();
  }

  window.closeParentRateDriverModal();

  if (isFlagged) {
    alert(`⚠️ Review Submitted (★ ${stars}/5):\n\nYour feedback has been saved. Per Section 4.8 system rules, ratings below 3.5 stars are automatically flagged for administrator quality review.`);
  } else {
    alert(`🎉 Thank You!\n\nYour ${stars}-star review for ${provider.name.replace(/\s*\(WalkShare\)/i, '')} has been published.`);
  }

  // Refresh active screen
  if (window.currentScreen === 'bookingProviderReviews') {
    window.openProviderReviews();
  } else if (window.currentScreen === 'profileReviews') {
    window.renderParentReviewsScreen();
  } else if (window.currentScreen === 'bookingProviderDetails') {
    window.openDriverProfile(provider.id);
  }
};

window.moderateProviderReview = function (providerId, reviewId, action) {
  const provider = (window.appState.providers || []).find((p) => p.id === providerId) || window.appState.providers[0];
  if (!provider || !provider.reviewsList) return;

  const idx = provider.reviewsList.findIndex(r => r.id === reviewId);
  if (idx < 0) return;

  if (action === 'delete') {
    if (confirm('Admin Action: Are you sure you want to permanently remove this review?')) {
      provider.reviewsList.splice(idx, 1);
    }
  } else if (action === 'hide') {
    provider.reviewsList[idx].hidden = true;
    alert('Review has been hidden from public view.');
  }

  window.openProviderReviews();
};

window.renderParentReviewsScreen = function () {
  const unratedWrap = document.getElementById('parentUnratedRidesContainer');
  const listWrap = document.getElementById('parentSubmittedReviewsList');
  const countBadge = document.getElementById('parentGivenReviewsCount');
  const totalBadge = document.getElementById('parentReviewsTotalBadge');

  const reviews = window.appState.parentReviews || [
    {
      id: 'rev-prnt-1',
      providerId: 'tariq',
      providerName: 'Tariq Ahmed',
      providerPhoto: '/assets/avatar_tariq.jpg',
      rating: 5,
      date: 'Sep 15, 2026',
      text: 'Tariq is extremely punctual and always ensures Emma and Arman are buckled safely before driving.',
      tags: ['⏰ Punctual', '🛡️ Safe Driving'],
      flaggedForAdmin: false
    },
    {
      id: 'rev-prnt-2',
      providerId: 'sarah',
      providerName: 'Sarah Jenkins (WalkShare)',
      providerPhoto: '/assets/avatar_sarah.jpg',
      rating: 5,
      date: 'Sep 10, 2026',
      text: 'Supervised neighborhood walking group was fantastic. Arman enjoyed walking with friends.',
      tags: ['👦 Great with Kids', '🚪 Curbside Care'],
      flaggedForAdmin: false
    }
  ];
  window.appState.parentReviews = reviews;

  if (countBadge) countBadge.textContent = `${reviews.length} Submitted`;
  if (totalBadge) totalBadge.textContent = `${reviews.length} reviews`;

  // Render Unrated Trip Prompt (e.g. recent completed trip)
  if (unratedWrap) {
    unratedWrap.innerHTML = `
      <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:14px; padding:14px 16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
          <span style="font-size:11px; font-weight:800; color:#D97706; text-transform:uppercase; letter-spacing:0.5px;">Pending Feedback</span>
          <span style="font-size:11px; color:#92400E; font-weight:600;">Today's Completed Run</span>
        </div>
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px;">
          <img src="/assets/avatar_tariq.jpg" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #FDE68A;" onerror="this.onerror=null;this.src='/assets/avatar_tariq.jpg';" />
          <div>
            <div style="font-size:14px; font-weight:800; color:#0F172A;">Tariq Ahmed</div>
            <div style="font-size:12px; color:#78350F;">Toyota Sienna · Greenfield Int. Drop-off</div>
          </div>
        </div>
        <button type="button" onclick="openParentRateDriverModal('tariq', 'H2S-84920')" class="btn-primary" style="width:100%; padding:10px; font-size:13px; font-weight:800; border-radius:10px; background:#F59E0B; color:#0F172A; border:none; display:flex; align-items:center; justify-content:center; gap:6px;">
          <span>★</span> Rate Tariq Ahmed
        </button>
      </div>
    `;
  }

  // Render Submitted Reviews
  if (listWrap) {
    listWrap.innerHTML = reviews.map(r => {
      const stars = '★'.repeat(r.rating || 5);
      const isFlagged = !!r.flaggedForAdmin;
      const photo = r.providerPhoto || '/assets/avatar_tariq.jpg';
      const pName = r.providerName || 'Provider';

      return `
        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:14px; padding:14px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${photo}" alt="" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_tariq.jpg'" />
              <div>
                <div style="font-size:13.5px; font-weight:800; color:#0F172A;">${pName}</div>
                <div style="font-size:11px; color:#64748B;">${r.date || 'Recent'}</div>
              </div>
            </div>
            <span style="color:#F59E0B; font-size:14px; font-weight:700;">${stars}</span>
          </div>
          <p style="font-size:12.5px; color:#334155; line-height:1.45; margin:0 0 8px;">${r.text}</p>
          ${r.tags && r.tags.length ? `<div style="display:flex; gap:4px; flex-wrap:wrap; margin-bottom:6px;">${r.tags.map(t => `<span style="background:#F1F5F9; color:#475569; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:6px;">${t}</span>`).join('')}</div>` : ''}
          ${isFlagged ? `<div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:6px; padding:4px 8px; font-size:11px; color:#B45309; font-weight:600;">⚠️ Under Administrative Quality Review (Score < 3.5★)</div>` : `<div style="font-size:11px; color:#10B981; font-weight:600;">✓ Published on Provider Profile</div>`}
        </div>
      `;
    }).join('');
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};

window.formatProviderSchedule = function (provider) {
  const avail = provider && provider.availability;
  if (!avail) return 'School days';
  const days = Array.isArray(avail.weekly) && avail.weekly.length
    ? (avail.weekly.length >= 5 ? 'Mon–Fri' : avail.weekly.join(', '))
    : 'School days';
  const windows = (avail.windows || []).filter((w) => w && w.enabled !== false);
  if (!windows.length) return days;
  const hasAm = windows.some((w) => Number(String(w.start || '12').split(':')[0]) < 12);
  const hasPm = windows.some((w) => Number(String(w.start || '0').split(':')[0]) >= 12);
  if (hasAm && hasPm) return days + ' · AM & PM';
  if (hasAm) return days + ' · Morning';
  if (hasPm) return days + ' · Afternoon';
  return days;
};

window.openDriverProfile = function (providerIdOrName, returnScreen) {
  if (returnScreen) {
    window.currentDriverProfileReturnScreen = returnScreen;
  } else {
    const cur = currentScreen || window.currentScreen;
    window.currentDriverProfileReturnScreen = (cur && cur !== 'bookingProviderDetails' && cur !== 'bookingProviderReviews')
      ? cur
      : (activeNavRole() === 'driver' ? 'driverProfile' : activeNavRole() === 'walkshare' ? 'wsProfile' : 'home');
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
  const cleanFirstName = provider.name.replace(/\s*\(WalkShare\)/i, '').split(' ')[0];
  const cleanFullName = provider.name.replace(/\s*\(WalkShare\)/i, '');
  const zone = (window.H2SZone && window.H2SZone.label(provider)) || provider.zone || '';
  const reviews = window.getProviderReviews(provider);
  const schedule = window.formatProviderSchedule(provider);

  const titleEl = document.getElementById('providerDetailsTitle');
  if (titleEl) titleEl.textContent = isWalk ? 'WalkShare profile' : 'Driver profile';

  const imgEl = document.getElementById('detailsProviderImg');
  const nameEl = document.getElementById('detailsProviderName');
  const ratingEl = document.getElementById('detailsProviderRatingVal');
  const reviewCountEl = document.getElementById('detailsProviderReviewCount');
  const distEl = document.getElementById('detailsProviderDistance');
  const trustEl = document.getElementById('detailsTrustLine');
  const trustTitle = document.getElementById('detailsTrustTitle');
  const roleChip = document.getElementById('detailsRoleChip');
  const roleChipText = document.getElementById('detailsRoleChipText');
  const serviceLabel = document.getElementById('detailsServiceLabel');
  const zoneEl = document.getElementById('detailsZoneText');
  const availEl = document.getElementById('detailsAvailText');
  const safetyList = document.getElementById('detailsSafetyList');
  const plateLbl = document.getElementById('specPlateLbl');

  if (imgEl) {
    imgEl.src = provider.photo || '/assets/avatar_tariq.jpg';
    imgEl.alt = cleanFullName;
    imgEl.onerror = function () { this.src = '/assets/avatar_tariq.jpg'; };
  }
  if (nameEl) nameEl.textContent = cleanFullName;
  if (ratingEl) ratingEl.textContent = '★ ' + provider.rating;
  if (reviewCountEl) reviewCountEl.textContent = (provider.reviewsCount || reviews.length) + ' reviews';
  if (distEl) {
    distEl.textContent = isWalk
      ? ('~8 min walk · ' + (zone || 'Neighborhood corridor'))
      : ('0.8 km away · ' + (zone || 'School corridor'));
  }
  if (trustTitle) trustTitle.textContent = 'Home2School verified';
  if (trustEl) {
    trustEl.textContent = isWalk
      ? "Driver's license, 2× proof of residency, background & vulnerable sector checked"
      : 'Licence, insurance, background & vulnerable sector checked';
  }
  if (roleChip) {
    roleChip.className = isWalk ? 'pp-role-chip walkshare' : 'pp-role-chip';
    roleChip.innerHTML = (isWalk
      ? '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.5v2"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.5v2"/></svg>'
      : '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.2 1 12 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>')
      + '<span id="detailsRoleChipText">' + (isWalk ? 'WalkShare Escort' : 'School Driver') + '</span>';
  }
  if (serviceLabel) serviceLabel.textContent = isWalk ? 'Neighborhood Walking Group' : 'School commute';
  if (zoneEl) zoneEl.textContent = zone || (isWalk ? 'Elm → Greenfield' : 'School corridor');
  if (availEl) availEl.textContent = schedule;

  if (safetyList) {
    const checks = isWalk
      ? [
          "Driver's licence verified",
          'Proof of residency: Property Tax / Tenancy',
          'Proof of residency: Utility Bill',
          'Criminal background check',
          'Vulnerable sector check'
        ]
      : ["Driver's licence verified", 'Vehicle insurance on file', 'Criminal background check', 'Vulnerable sector check'];
    safetyList.innerHTML = checks.map((label) =>
      `<li><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg><span>${label}</span></li>`
    ).join('');
  }

  const expPillar = document.getElementById('detailsProviderExpPillar');
  const tripsPillar = document.getElementById('detailsProviderTripsPillar');
  const tripsLbl = document.getElementById('detailsProviderTripsLbl');
  const onTimePillar = document.getElementById('detailsProviderOnTimePillar');
  const onTimeLbl = document.getElementById('detailsProviderOnTimeLbl');

  if (expPillar) expPillar.textContent = provider.experience || '5+ Yrs';
  if (tripsPillar) tripsPillar.textContent = isWalk ? '320+' : '500+';
  if (tripsLbl) tripsLbl.textContent = isWalk ? 'Safe walks' : 'School trips';
  if (onTimePillar) onTimePillar.textContent = provider.onTimeRate || '99.8%';
  if (onTimeLbl) onTimeLbl.textContent = isWalk ? 'Safety record' : 'On time';

  const iconBox = document.getElementById('detailsVehIconBox');
  const vehTitle = document.getElementById('detailsProviderVehTitle');
  const vehSubtitle = document.getElementById('detailsProviderVehSubtitle');
  const specSeats = document.getElementById('specSeatsText');
  const specPlate = document.getElementById('specPlateText');
  const specBooster = document.getElementById('specBoosterText');
  const specLocks = document.getElementById('specLocksText');

  if (isWalk) {
    if (iconBox) {
      iconBox.className = 'profile-service-icon-box walkshare';
      iconBox.innerHTML = '<i data-lucide="footprints" style="width: 22px; height: 22px;"></i>';
    }
    if (vehTitle) vehTitle.textContent = provider.vehicle || 'Neighborhood Walking Group';
    if (vehSubtitle) vehSubtitle.textContent = 'Supervised neighborhood group walk to school';
    if (specSeats) specSeats.textContent = (provider.seats || 3) + ' kids';
    if (plateLbl) plateLbl.textContent = 'Path';
    if (specPlate) specPlate.textContent = 'Sidewalks only';
    if (specBooster) specBooster.textContent = 'High-vis vests';
    if (specLocks) specLocks.textContent = 'Crossing care';
  } else {
    if (iconBox) {
      iconBox.className = 'profile-service-icon-box';
      iconBox.innerHTML = '<i data-lucide="car" style="width: 22px; height: 22px;"></i>';
    }
    if (vehTitle) vehTitle.textContent = provider.vehicle || 'Toyota Sienna (2023)';
    if (vehSubtitle) vehSubtitle.textContent = (provider.seats || 4) + ' seats · Plate ' + (provider.plate || '—');
    if (specSeats) specSeats.textContent = (provider.seats || 4) + ' seats';
    if (plateLbl) plateLbl.textContent = 'Plate';
    if (specPlate) specPlate.textContent = provider.plate || '—';
    if (specBooster) specBooster.textContent = 'Booster seats';
    if (specLocks) specLocks.textContent = 'Child locks';
  }

  const aboutLbl = document.getElementById('detailsAboutLabel');
  const bioEl = document.getElementById('detailsProviderBio');
  if (aboutLbl) aboutLbl.textContent = 'About ' + cleanFirstName;
  if (bioEl) {
    bioEl.textContent = provider.bio || provider.about || (isWalk
      ? (cleanFirstName + ' leads a supervised neighborhood walking group so local children walk to school together safely on verified sidewalk corridors and crosswalks to the school gate.')
      : (cleanFirstName + ' provides daily school rides with a focus on child safety, calm pickups, booster-ready seating, and on-time arrival at the school gate.'));
  }

  const stickyPrice = document.getElementById('detailsStickyPrice');
  if (stickyPrice) stickyPrice.style.display = 'none';
  const stickyBlock = document.querySelector('.profile-sticky-price-block');
  if (stickyBlock) stickyBlock.style.display = 'none';

  // Typical / Posted Rate and Preferred Payment
  const postedRateEl = document.getElementById('detailsPostedRateText');
  const negBadgeEl = document.getElementById('detailsRateNegotiableBadge');
  const payPrefEl = document.getElementById('detailsPreferredPaymentText');
  const rateUnit = provider.ratePeriod || 'week';
  const rateVal = provider.listedRate || provider.baseWeekly || (isWalk ? 75 : 120);

  if (postedRateEl) postedRateEl.textContent = `$${rateVal}/${rateUnit}`;
  if (negBadgeEl) negBadgeEl.style.display = provider.negotiable !== false ? 'inline-block' : 'none';
  if (payPrefEl) payPrefEl.textContent = provider.preferredPayment || 'e-Transfer · Cash';

  const role = typeof activeNavRole === 'function' ? activeNavRole() : (window.appState?.activeRole || localStorage.getItem('h2s_active_role') || 'parent');
  const isOwner = (role === 'walkshare' && (provider.id === 'sarah' || isWalk)) ||
                  (role === 'driver' && (provider.id === 'tariq' || !isWalk));

  const actionsWrap = document.getElementById('detailsProviderActionsWrap');
  if (actionsWrap) {
    if (isOwner) {
      actionsWrap.innerHTML = `
        <div class="profile-sticky-footer-inner" style="display:flex; gap:10px; width:100%;">
          <button type="button" class="btn-primary" style="width:100%; height:48px; border-radius:12px; font-weight:800; font-size:14px; background:var(--color-primary-navy, #1B2B68); color:#FFFFFF; border:none; display:flex; align-items:center; justify-content:center; gap:8px;" onclick="openDriverProfileEditWizard('${provider.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
            <span>Edit Profile Info &amp; Rates</span>
          </button>
        </div>
      `;
    } else {
      actionsWrap.innerHTML = `
        <div class="profile-sticky-footer-inner pp-footer-dual">
          <button type="button" class="pp-btn-outline" onclick="openChatWith('${provider.id || 'tariq'}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
            <span>Message</span>
          </button>
          <button class="btn-primary" id="btnBookWithProvider" onclick="startBookingReview('${provider.id || 'tariq'}')">
            <span>Request Booking</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </button>
        </div>
      `;
    }
  }

  window.navigateTo('bookingProviderDetails');
};

window.openDriverProfileEditWizard = function (providerId) {
  const role = typeof activeNavRole === 'function' ? activeNavRole() : (window.appState?.activeRole || 'driver');
  const isWalk = providerId === 'sarah' || role === 'walkshare';
  if (isWalk) {
    if (typeof window.openNestedScreen === 'function') {
      window.navigateTo('wsProfile');
      window.openNestedScreen('wsOnboardProfile');
    } else {
      window.navigateTo('wsOnboardProfile');
    }
  } else {
    if (typeof window.openDriverProfileChild === 'function') {
      window.navigateTo('driverProfile');
      window.openDriverProfileChild('driverOnboardProfile');
    } else {
      window.navigateTo('driverOnboardProfile');
    }
  }
};

window.handleProviderDetailsBack = function () {
  const target = window.currentDriverProfileReturnScreen || (activeNavRole() === 'driver' ? 'driverProfile' : activeNavRole() === 'walkshare' ? 'wsProfile' : 'home');
  window.navigateTo(target, true);
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
  // MVP truth: ride fare is arranged parent↔provider. Do not invent weekly/package totals.
  return {
    baseRate: null,
    discount: 0,
    insurance: 0,
    total: null,
    period: 'arrange'
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
  const parentEl = document.getElementById('summaryParentText');
  const dirEl = document.getElementById('summaryDirectionText');
  const outboundEl = document.getElementById('summaryOutboundText');
  const returnEl = document.getElementById('summaryReturnText');
  const freqEl = document.getElementById('summaryFreqText');
  const providerEl = document.getElementById('summaryProviderText');

  if (parentEl) {
    const u = window.appState.user;
    parentEl.textContent = `${u.name || 'Sadia Khan'} (ID: #${u.id || 'PRNT-9042'})`;
  }
  if (childrenEl) childrenEl.textContent = `${children.join(' & ')} (${children.length})`;
  if (dirEl) {
    dirEl.textContent = draft.direction === 'bothway' ? '⇄ Round Trip (Both Ways)' : '→ One-Way (Single Ride)';
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
  if (outboundEl) {
    if (draft.outboundTime) {
      outboundEl.textContent = `${pickupShort} → ${schoolShort} (${draft.outboundTime}${walkSuffix})`;
      if (outboundEl.parentElement) outboundEl.parentElement.style.display = 'flex';
    } else if (outboundEl.parentElement) {
      outboundEl.parentElement.style.display = 'none';
    }
  }
  if (returnEl) {
    if (draft.direction === 'bothway') {
      returnEl.textContent = `${schoolShort} → ${pickupShort} (${draft.returnTime || '01:00 PM'}${walkSuffix})`;
      if (returnEl.parentElement) returnEl.parentElement.style.display = 'flex';
    } else if (returnEl.parentElement) {
      returnEl.parentElement.style.display = 'none';
    }
  }

  if (freqEl) {
    freqEl.textContent = draft.frequency === 'recurring'
      ? 'Recurring (Mon – Fri Commute)'
      : `One-Time Ride (${draft.tripDate || 'Single Day Pass'})`;
  }

  const notesRow = document.getElementById('summaryNotesRow');
  const notesVal = document.getElementById('summaryNotesText');
  if (notesRow && notesVal) {
    if (draft.notes && draft.notes.trim()) {
      notesRow.style.display = 'flex';
      notesVal.textContent = draft.notes.trim();
    } else {
      notesRow.style.display = 'none';
    }
  }
  const cleanFullName = provider.name.replace(/\s*\(WalkShare\)/i, '');
  if (providerEl) {
    providerEl.textContent = isWalk
      ? `${cleanFullName} (WalkShare Escort)`
      : `${cleanFullName} (${provider.vehicle.split('(')[0].trim()})`;
  }

  // Never write invented $/wk package numbers into parent UI
  const baseEl = document.getElementById('summaryBasePriceText');
  const discEl = document.getElementById('summaryDiscountPriceText');
  const totalEl = document.getElementById('summaryTotalPriceText');
  const baseLbl = document.getElementById('summaryBasePriceLabel');
  const totalLbl = document.getElementById('summaryTotalPriceLabel');
  const insLbl = document.getElementById('summaryInsuranceLabel');
  const insVal = document.getElementById('summaryInsurancePriceText');
  if (baseLbl) baseLbl.textContent = 'Ride fee';
  if (baseEl) baseEl.textContent = 'Arrange with provider';
  if (discEl) discEl.textContent = '—';
  if (insLbl) insLbl.textContent = 'Platform fee';
  if (insVal) insVal.textContent = 'Subscription / trial';
  if (totalLbl) totalLbl.textContent = 'Ride payment';
  if (totalEl) totalEl.textContent = 'Direct to provider';
}

/* ==========================================================
   Booking Wizard: Step 5 Submit & Simulate Acceptance
   ========================================================== */
window.submitBookingRequest = function () {
  const draft = window.appState.bookingDraft;
  const provider = window.appState.providers.find(p => p.id === draft.providerId) || window.appState.providers[0];
  const isWalk = provider.category === 'walkshare' || provider.id === 'sarah' || provider.id === 'elena';

  const newBooking = {
    id: `H2S-${Math.floor(10000 + Math.random() * 90000)}`,
    status: 'pending',
    parentId: window.appState.user.id || 'PRNT-9042',
    parentName: window.appState.user.name || 'Sadia Khan',
    parentPhone: window.appState.user.phone || '+1 (416) 555-0192',
    parentRole: 'Mother (Primary Guardian)',
    parentPhoto: window.appState.user.photo || '/assets/avatar_sadia.jpg',
    childIds: [...window.appState.selectedChildIds],
    direction: draft.direction === 'oneway' ? 'oneway' : 'bothway',
    frequency: draft.frequency,
    selectedDays: draft.frequency === 'recurring' ? (draft.selectedDays || []) : [],
    untilCancelled: draft.frequency === 'recurring' ? !!draft.untilCancelled : false,
    untilDate: draft.frequency === 'recurring' && !draft.untilCancelled
      ? (draft.untilDate || draft.recurrenceEndDate || '')
      : '',
    recurrenceEndDate: draft.frequency === 'recurring' && !draft.untilCancelled
      ? (draft.untilDate || draft.recurrenceEndDate || '')
      : '',
    startDate: draft.startDate || '',
    scheduleText: draft.frequency === 'recurring'
      ? (draft.direction === 'bothway' 
          ? `Mon–Fri • Outbound: ${draft.outboundTime} | Return: ${draft.returnTime}` 
          : `Mon–Fri • Outbound: ${draft.outboundTime} (Morning Commute)`)
      : (draft.direction === 'bothway'
          ? `${draft.tripDate || 'Single Day'} • ${draft.outboundTime} & ${draft.returnTime}`
          : `${draft.tripDate || 'Single Day'} • ${draft.outboundTime}`),
    pickupLocation: draft.pickupLocation,
    schoolLocation: draft.schoolLocation,
    notes: draft.notes || '',
    outboundTime: draft.outboundTime,
    returnTime: draft.direction === 'bothway' ? draft.returnTime : '',
    providerId: provider.id,
    listedRate: draft.frequency === 'recurring' ? (provider.listedRate || provider.baseWeekly || 120) : (provider.oneTimeRate || 35),
    ratePeriod: draft.frequency === 'recurring' ? 'week' : 'trip',
    agreedRate: null,
    rateStatus: 'listed',
    negotiable: provider.negotiable !== false,
    amount: draft.frequency === 'recurring' ? (provider.listedRate || 120) : (provider.oneTimeRate || 35),
    preferredPayment: provider.preferredPayment || 'e-Transfer · Cash',
    paymentHandleStatus: 'not_requested',
    paymentHandle: provider.paymentHandle || (provider.id + '@interac.ca'),
    paymentMethod: 'Direct to provider',
    createdAt: 'Just now'
  };

  window.appState.bookings.unshift(newBooking);
  window.appState.activeBookingId = newBooking.id;

  // Also sync into driver's / walkshare requests if active
  if (window.syncNewBookingToDriver) {
    window.syncNewBookingToDriver(newBooking);
  }

  // Update Request Sent Screen text
  const reqDesc = document.getElementById('requestSentDesc');
  const cleanName = provider.name.replace(/\s*\(WalkShare\)/i, '');
  if (reqDesc) {
    reqDesc.textContent = isWalk 
      ? `${cleanName} has received your WalkShare chaperone escort request for reference ${newBooking.id}.`
      : `${cleanName} has received your school ride request for reference ${newBooking.id}.`;
  }

  window.navigateTo('bookingRequestSent');
};

window.simulateProviderAcceptance = function () {
  const active = window.appState.bookings.find(b => b.id === window.appState.activeBookingId);
  if (active) {
    active.status = 'confirmed';
    if (!active.agreedRate) {
      active.agreedRate = active.listedRate || 120;
      active.rateStatus = 'agreed';
    }
  }
  window.appState.homeScenario = 'B';

  triggerCelebrationConfetti();
  setTimeout(() => {
    window.navigateTo('bookingConfirmed');
  }, 400);
};

/* Peer-to-Peer Payment & Rate Handshake APIs */
window.requestPaymentDetails = function (bookingId) {
  const id = bookingId || window.appState.activeBookingId;
  const b = (window.appState.bookings || []).find(x => x.id === id) || window.appState.bookings[0];
  if (!b) return;
  b.paymentHandleStatus = 'requested';
  if (window.showToast) window.showToast('Payment details requested from provider', 'info');
  if (window.renderBookingDetails) window.renderBookingDetails(b.id);
  // Re-paint if driver screens are open
  if (window.refreshDriverRequests) window.refreshDriverRequests();
};

window.consentPaymentDetails = function (bookingId) {
  const id = bookingId || window.appState.activeBookingId;
  const b = (window.appState.bookings || []).find(x => x.id === id) || window.appState.bookings[0];
  if (!b) return;
  b.paymentHandleStatus = 'shared';
  if (!b.paymentHandle) {
    const prov = (window.appState.providers || []).find(p => p.id === b.providerId) || window.appState.providers[0];
    b.paymentHandle = prov.paymentHandle || `${prov.id}.ahmed@interac.ca`;
  }
  if (window.showToast) window.showToast('e-Transfer details shared with parent', 'success');
  if (window.renderBookingDetails) window.renderBookingDetails(b.id);
  if (window.refreshDriverRequests) window.refreshDriverRequests();
};

window.chooseCashPayment = function (bookingId) {
  const id = bookingId || window.appState.activeBookingId;
  const b = (window.appState.bookings || []).find(x => x.id === id) || window.appState.bookings[0];
  if (!b) return;
  b.paymentHandleStatus = 'cash';
  if (window.showToast) window.showToast('Cash at pickup confirmed', 'success');
  if (window.renderBookingDetails) window.renderBookingDetails(b.id);
  if (window.refreshDriverRequests) window.refreshDriverRequests();
};

window.copyPaymentHandle = function (handle) {
  const text = handle || 'tariq.ahmed@interac.ca';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast('Copied: ' + text, 'success');
    }).catch(() => {
      if (window.showToast) window.showToast('Copied: ' + text, 'success');
    });
  } else {
    if (window.showToast) window.showToast('Copied: ' + text, 'success');
  }
};

window.acceptRateProposal = function (bookingId, newRate) {
  const id = bookingId || window.appState.activeBookingId;
  const b = (window.appState.bookings || []).find(x => x.id === id) || window.appState.bookings[0];
  if (!b) return;
  b.agreedRate = Number(newRate);
  b.amount = Number(newRate);
  b.rateStatus = 'agreed';
  b.status = 'confirmed';
  if (window.showToast) window.showToast(`Rate agreed: $${newRate}/${b.ratePeriod || 'week'}!`, 'success');
  if (window.renderBookingDetails) window.renderBookingDetails(b.id);
  if (window.paintParentChat) window.paintParentChat(b.providerId || 'tariq');
  if (window.refreshDriverRequests) window.refreshDriverRequests();
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
    totalEl.textContent = 'Ride fee · arrange with provider';
  }

  const trackBtn = document.getElementById('btnConfirmedLiveTrack');
  if (trackBtn) {
    const live = active && active.status === 'in_progress';
    trackBtn.style.display = live ? 'flex' : 'none';
    if (live) trackBtn.setAttribute('onclick', `openLiveTracking('${active.id}')`);
  }
}

/* ==========================================================
   Dedicated Booking Details Screen (#bookingDetails)
   ========================================================== */
window.openBookingDetails = function (bookingId, returnScreen) {
  window.appState.activeBookingId = bookingId;
  window._bookingDetailsReturnScreen = returnScreen || (window.currentScreen !== 'bookingDetails' ? window.currentScreen : 'bookings');
  window.navigateTo('bookingDetails');
};

window.handleBookingDetailsBack = function () {
  const from = window._bookingDetailsReturnScreen;
  window._bookingDetailsReturnScreen = null;
  if (from && screens.includes(from) && from !== 'bookingDetails') {
    window.navigateTo(from, true);
    return;
  }
  window.navigateTo('bookings', true);
};

window.handleNotificationsBack = function () {
  const role = typeof window.activeNavRole === 'function' ? window.activeNavRole() : (window.appState?.activeRole || 'parent');
  if (role === 'driver') {
    window.navigateTo('driverHome', true);
  } else if (role === 'walkshare') {
    window.navigateTo('wsHome', true);
  } else {
    window.navigateTo('home', true);
  }
};

window.handleInboxBack = function () {
  const role = typeof window.activeNavRole === 'function' ? window.activeNavRole() : (window.appState?.activeRole || 'parent');
  if (role === 'driver') {
    window.navigateTo('driverHome', true);
  } else if (role === 'walkshare') {
    window.navigateTo('wsHome', true);
  } else {
    window.navigateTo('home', true);
  }
};

window.setDriverScenario = function (scenario) {
  if (typeof window.ensureDriverState === 'function') {
    const d = window.ensureDriverState();
    if (d) d.homeScenario = scenario;
    if (typeof window.persistDriverState === 'function') window.persistDriverState();
  }
  if (window.appState && window.appState.driver) {
    window.appState.driver.homeScenario = scenario;
  }
  ['A', 'B', 'C'].forEach((sc) => {
    document.getElementById('dchipScenario' + sc)?.classList.toggle('active', sc === scenario);
  });
  if (typeof window.renderDriverHome === 'function') {
    window.renderDriverHome();
  }
};

/* --- Booking Details Modal Controllers --- */
window.openSafetyPinModal = function () {
  const booking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
  const pin = booking ? (String(booking.id || '').replace(/\D/g, '').slice(-4) || '4920') : '4920';
  
  let modal = document.getElementById('dynamicSafetyPinModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dynamicSafetyPinModal';
    modal.className = 'safety-pin-modal-backdrop';
    modal.onclick = function (e) { if (e.target === modal) modal.style.display = 'none'; };
    document.body.appendChild(modal);
  }
  
  modal.innerHTML = `
    <div class="safety-pin-sheet" style="background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px 32px; max-width:430px; margin:0 auto; width:100%; box-shadow:0 -10px 40px rgba(0,0,0,0.2); box-sizing:border-box;">
      <div style="width:40px; height:4px; background:#E2E8F0; border-radius:999px; margin:0 auto 16px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <h3 style="font-size:17px; font-weight:800; color:#0F172A; margin:0;">Child Handover PIN</h3>
        <button type="button" onclick="document.getElementById('dynamicSafetyPinModal').style.display='none'" style="background:#F1F5F9; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; color:#64748B;">✕</button>
      </div>
      <p style="font-size:13px; color:#64748B; margin:0 0 16px; line-height:1.4;">Provide this 4-digit code to the verified driver or school attendant to authorize child pickup and drop-off.</p>
      <div style="background:linear-gradient(135deg, #1B2B68 0%, #2563EB 100%); border-radius:18px; padding:20px; text-align:center; color:#FFFFFF; margin-bottom:16px;">
        <div style="font-size:12px; font-weight:700; opacity:0.8; letter-spacing:1px; margin-bottom:6px;">SECURITY VERIFICATION CODE</div>
        <div style="font-size:36px; font-weight:800; letter-spacing:8px; font-family:monospace;">${pin}</div>
      </div>
      <button type="button" class="btn-primary" onclick="navigator.clipboard && navigator.clipboard.writeText('${pin}'); showToast('PIN copied to clipboard!'); document.getElementById('dynamicSafetyPinModal').style.display='none';" style="width:100%; border-radius:14px; padding:14px; font-weight:700;">Copy PIN &amp; Close</button>
    </div>
  `;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(15, 23, 42, 0.6)';
  modal.style.zIndex = '9999';
  modal.style.alignItems = 'flex-end';
  modal.style.justifyContent = 'center';
};

window.openFareBreakdownModal = function () {
  const booking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
  const total = booking && booking.amount ? Number(booking.amount) : 120;
  const isRec = booking && booking.frequency === 'recurring';
  const base = total > 30 ? (total - 20) : (total - 4);
  const service = total > 30 ? 15 : 3;
  const tax = total > 30 ? 5 : 1;

  let modal = document.getElementById('dynamicFareModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dynamicFareModal';
    modal.onclick = function (e) { if (e.target === modal) modal.style.display = 'none'; };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px 32px; max-width:430px; margin:0 auto; width:100%; box-shadow:0 -10px 40px rgba(0,0,0,0.2); box-sizing:border-box;">
      <div style="width:40px; height:4px; background:#E2E8F0; border-radius:999px; margin:0 auto 16px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:17px; font-weight:800; color:#0F172A; margin:0;">Fare Breakdown &amp; Receipt</h3>
        <button type="button" onclick="document.getElementById('dynamicFareModal').style.display='none'" style="background:#F1F5F9; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; color:#64748B;">✕</button>
      </div>
      <div style="background:#F8FAFC; border-radius:16px; padding:16px; border:1px solid #E2E8F0; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#64748B;">
          <span>${isRec ? 'Weekly Base Pass (5 Days)' : 'Single Trip Base Fare'}</span>
          <span style="font-weight:700; color:#0F172A;">$${base}.00</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:13px; color:#64748B;">
          <span>Child Safety &amp; GPS Telematics</span>
          <span style="font-weight:700; color:#0F172A;">$${service}.00</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:12px; font-size:13px; color:#64748B;">
          <span>GST / Provincial HST</span>
          <span style="font-weight:700; color:#0F172A;">$${tax}.00</span>
        </div>
        <div style="height:1px; background:#E2E8F0; margin-bottom:12px;"></div>
        <div style="display:flex; justify-content:space-between; font-size:16px; font-weight:800; color:#0F172A;">
          <span>Total Paid</span>
          <span>$${total}.00</span>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:8px; font-size:12px; color:#64748B; margin-bottom:18px;">
        <span style="background:#ECFDF5; color:#059669; padding:3px 8px; border-radius:999px; font-weight:700;">✓ Paid</span>
        <span>Charged to ${booking && booking.paymentMethod ? booking.paymentMethod : 'Visa •••• 4242'}</span>
      </div>
      <button type="button" class="btn-primary" onclick="showToast('Tax invoice PDF downloaded!'); document.getElementById('dynamicFareModal').style.display='none';" style="width:100%; border-radius:14px; padding:14px; font-weight:700;">Download Official Tax Invoice</button>
    </div>
  `;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(15, 23, 42, 0.6)';
  modal.style.zIndex = '9999';
  modal.style.alignItems = 'flex-end';
  modal.style.justifyContent = 'center';
};

window.openScheduleDetailsModal = function () {
  const booking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
  let modal = document.getElementById('dynamicScheduleModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dynamicScheduleModal';
    modal.onclick = function (e) { if (e.target === modal) modal.style.display = 'none'; };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px 32px; max-width:430px; margin:0 auto; width:100%; box-shadow:0 -10px 40px rgba(0,0,0,0.2); box-sizing:border-box;">
      <div style="width:40px; height:4px; background:#E2E8F0; border-radius:999px; margin:0 auto 16px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:17px; font-weight:800; color:#0F172A; margin:0;">Active Schedule Rules</h3>
        <button type="button" onclick="document.getElementById('dynamicScheduleModal').style.display='none'" style="background:#F1F5F9; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; color:#64748B;">✕</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
        <div style="background:#F8FAFC; border-radius:14px; padding:12px 14px; border:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; font-weight:600; color:#475569;">Active Days</span>
          <strong style="font-size:13px; color:#0F172A;">Monday – Friday</strong>
        </div>
        <div style="background:#F8FAFC; border-radius:14px; padding:12px 14px; border:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; font-weight:600; color:#475569;">Morning Pickup</span>
          <strong style="font-size:13px; color:#0F172A;">${booking && booking.outboundTime ? booking.outboundTime : '7:15 AM'} (Window: ±5 min)</strong>
        </div>
        <div style="background:#F8FAFC; border-radius:14px; padding:12px 14px; border:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; font-weight:600; color:#475569;">School Drop-off</span>
          <strong style="font-size:13px; color:#0F172A;">${booking && booking.schoolArriveTime ? booking.schoolArriveTime : '7:45 AM'}</strong>
        </div>
        <div style="background:#F8FAFC; border-radius:14px; padding:12px 14px; border:1px solid #E2E8F0; display:flex; justify-content:space-between; align-items:center;">
          <span style="font-size:13px; font-weight:600; color:#475569;">Term Expiry</span>
          <strong style="font-size:13px; color:#0F172A;">Dec 31, 2026</strong>
        </div>
      </div>
      <button type="button" class="btn-primary" onclick="document.getElementById('dynamicScheduleModal').style.display='none'" style="width:100%; border-radius:14px; padding:14px; font-weight:700;">Got It</button>
    </div>
  `;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(15, 23, 42, 0.6)';
  modal.style.zIndex = '9999';
  modal.style.alignItems = 'flex-end';
  modal.style.justifyContent = 'center';
};

window.openManageBookingModal = function () {
  const booking = window.appState.bookings.find(b => b.id === window.appState.activeBookingId) || window.appState.bookings[0];
  const id = booking ? booking.id : 'H2S-84920';

  let modal = document.getElementById('dynamicManageModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'dynamicManageModal';
    modal.onclick = function (e) { if (e.target === modal) modal.style.display = 'none'; };
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div style="background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px 32px; max-width:430px; margin:0 auto; width:100%; box-shadow:0 -10px 40px rgba(0,0,0,0.2); box-sizing:border-box;">
      <div style="width:40px; height:4px; background:#E2E8F0; border-radius:999px; margin:0 auto 16px;"></div>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
        <h3 style="font-size:17px; font-weight:800; color:#0F172A; margin:0;">Manage Subscription &amp; Route</h3>
        <button type="button" onclick="document.getElementById('dynamicManageModal').style.display='none'" style="background:#F1F5F9; border:none; width:30px; height:30px; border-radius:50%; cursor:pointer; color:#64748B;">✕</button>
      </div>
      <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:18px;">
        <button type="button" onclick="document.getElementById('dynamicManageModal').style.display='none'; window.modifyBooking && window.modifyBooking('${id}');" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#0F172A;">Edit Route or Stop Times</div>
            <div style="font-size:12px; color:#64748B;">Change home stop, school gate, or timings</div>
          </div>
          <span style="color:#64748B;">›</span>
        </button>
        <button type="button" onclick="document.getElementById('dynamicManageModal').style.display='none'; showToast('Absence requested for tomorrow.');" style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:14px; padding:14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#0F172A;">Report Student Absence (Skip Day)</div>
            <div style="font-size:12px; color:#64748B;">Notify driver if child is staying home</div>
          </div>
          <span style="color:#64748B;">›</span>
        </button>
        <button type="button" onclick="document.getElementById('dynamicManageModal').style.display='none'; cancelBooking('${id}');" style="background:#FEF2F2; border:1px solid #FECACA; border-radius:14px; padding:14px; text-align:left; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-size:14px; font-weight:700; color:#DC2626;">Cancel Subscription / Ride</div>
            <div style="font-size:12px; color:#DC2626; opacity:0.8;">Full refund available within 24 hours</div>
          </div>
          <span style="color:#DC2626;">›</span>
        </button>
      </div>
      <button type="button" class="btn-primary" onclick="document.getElementById('dynamicManageModal').style.display='none'" style="width:100%; border-radius:14px; padding:14px; font-weight:700;">Close</button>
    </div>
  `;
  modal.style.display = 'flex';
  modal.style.position = 'fixed';
  modal.style.inset = '0';
  modal.style.background = 'rgba(15, 23, 42, 0.6)';
  modal.style.zIndex = '9999';
  modal.style.alignItems = 'flex-end';
  modal.style.justifyContent = 'center';
};

function renderBookingDetails(bookingId) {
  const booking = window.appState.bookings.find(b => b.id === bookingId) || window.appState.bookings[0];
  if (!booking) return;

  const provider = window.appState.providers.find(p => p.id === booking.providerId) || window.appState.providers[0];
  window.currentBookingProviderId = provider.id;
  let children = (booking.childIds || []).map(id => window.appState.children.find(ch => ch.id === id)).filter(Boolean);
  if (!children.length && Array.isArray(window.appState.children) && window.appState.children.length) {
    children = window.appState.children.slice(0, 1);
  }
  const isWalk = provider.category === 'walkshare' || /walk/i.test(provider.name || '') || /walk/i.test(provider.vehicle || '');

  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  const shortPlace = (loc) => {
    if (!loc) return '';
    if (/home/i.test(loc)) return 'Home';
    if (/greenfield/i.test(loc)) return 'Greenfield';
    if (/sunshine/i.test(loc)) return 'Sunshine';
    return String(loc).replace(/\s*\([^)]*\)\s*/g, '').replace(/\s+International School/i, '').replace(/\s+Pre-school/i, '').split(',')[0].trim();
  };

  const shortSchool = shortPlace(booking.schoolLocation) || 'School';
  const pickupStreet = String(booking.pickupLocation || '12 Elm Street')
    .replace(/^Home\s*\(?/i, '')
    .replace(/\)$/, '')
    .trim() || '12 Elm Street';

  const isCompleted = booking.status === 'completed';
  const isLive = booking.status === 'in_progress';
  const isPending = booking.status === 'pending';
  const isCancelled = booking.status === 'cancelled';
  const isConfirmed = booking.status === 'confirmed';

  // 1. Hero Summary Titles & Date (Audited Input -> Output)
  const isRecurring = booking.frequency === 'recurring';
  const isBothWay = booking.direction === 'bothway';
  
  // Option A Format: Home ⇄ Greenfield International
  const cleanPickupShort = /home/i.test(booking.pickupLocation || '') ? 'Home' : String(booking.pickupLocation || 'Home').replace(/\s*\([^)]*\)/g, '').split(',')[0].trim();
  const cleanSchoolShort = String(booking.schoolLocation || 'Greenfield International').replace(/\s*\([^)]*\)/g, '').split(',')[0].trim();
  
  const tripTitle = booking.title || (isBothWay
    ? `${cleanPickupShort} ⇄ ${cleanSchoolShort}`
    : `${cleanPickupShort} → ${cleanSchoolShort}`);

  // Dynamic recurrence or single pass subtitle
  let tripSub = '';
  if (isRecurring) {
    if (booking.selectedDays && booking.selectedDays.length) {
      tripSub = `Weekly Commute • ${booking.selectedDays.join(', ')}`;
    } else {
      tripSub = 'Weekly Commute • Weekdays (Mon – Fri)';
    }
  } else {
    tripSub = `One-Time Pass • ${isBothWay ? 'Round Trip' : 'Single Ride'}`;
  }

  // Exact date without fallback mismatch
  const tripDate = booking.tripDate || booking.date || booking.startDate || (booking.createdAt ? (booking.createdAt.includes('2026') ? booking.createdAt : booking.createdAt + ', 2026') : 'Mon, Sep 1, 2026');

  setText('detailHeaderTitle', tripTitle);
  setText('detailHeaderSubtitle', tripSub);
  setText('detailScheduleDate', tripDate);

  const idShort = String(booking.id || '').replace(/^H2S-?/i, '');
  setText('detailRefId', idShort ? '#' + idShort : '');

  const pin = String(booking.id || '').replace(/\D/g, '').slice(-4) || '4920';
  setText('detailSafetyPin', pin);
  const modalPinEl = document.getElementById('modalSafetyPinText');
  const modalSubEl = document.getElementById('modalSafetyPinSub');
  const modalVehEl = document.getElementById('modalSafetyVehicleSub');
  if (modalPinEl) modalPinEl.textContent = pin;
  if (modalSubEl) modalSubEl.textContent = children.map(c => c.name.split(' ')[0]).join(' + ') || 'Children';
  if (modalVehEl) modalVehEl.textContent = (provider.vehicle || '') + (provider.plate ? ' · ' + provider.plate : '');

  // 2. Status Badge in Hero
  const heroStatusPill = document.getElementById('detailHeroStatusPill');
  const heroStatusText = document.getElementById('detailHeroStatusText');
  if (heroStatusPill && heroStatusText) {
    if (isLive) {
      heroStatusPill.className = 'bd-hero-status-pill';
      heroStatusPill.style.background = '#059669';
      heroStatusPill.innerHTML = '<i data-lucide="check-circle" style="width:13px;height:13px;"></i> <span>Active Trip</span>';
    } else if (isCompleted) {
      heroStatusPill.className = 'bd-hero-status-pill is-completed';
      heroStatusPill.style.background = '#059669';
      heroStatusPill.innerHTML = '<i data-lucide="check-circle" style="width:13px;height:13px;"></i> <span>Completed</span>';
    } else if (isPending) {
      heroStatusPill.className = 'bd-hero-status-pill is-pending';
      heroStatusPill.style.background = '#D97706';
      heroStatusPill.innerHTML = '<i data-lucide="clock" style="width:13px;height:13px;"></i> <span>Pending</span>';
    } else {
      heroStatusPill.className = 'bd-hero-status-pill is-scheduled';
      heroStatusPill.style.background = '#2563EB';
      heroStatusPill.innerHTML = '<i data-lucide="calendar" style="width:13px;height:13px;"></i> <span>Scheduled</span>';
    }
  }

  // 3. Journey & Route Card (Audited for Scheduled, Live & Completed)
  setText('detailOutboundTime', booking.outboundTime || '07:30 AM');
  setText('detailSchoolTime', booking.schoolArriveTime || '07:45 AM');
  setText('detailReturnTime', booking.returnTime || '01:00 PM');
  setText('detailPickupAddr', pickupStreet + ', Toronto, ON');
  setText('detailSchoolName', shortSchool.includes('School') || shortSchool.includes('Pre-school') ? shortSchool : shortSchool + ' International School');
  setText('detailReturnAddr', 'Drop-off at ' + pickupStreet + ', Toronto, ON');

  const pickupStatusTag = document.getElementById('detailPickupStatus');
  const dropoffStatusTag = document.getElementById('detailDropoffStatus');
  const returnStatusTag = document.getElementById('detailReturnStatus');

  if (isLive) {
    // ACTIVE / IN-PROGRESS
    if (pickupStatusTag) {
      pickupStatusTag.className = 'bd-rt-pill-tag is-green';
      pickupStatusTag.textContent = 'Picked up';
    }
    if (dropoffStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-blue';
      dropoffStatusTag.textContent = 'In Transit';
    }
    if (returnStatusTag) {
      returnStatusTag.className = 'bd-rt-pill-tag is-grey';
      returnStatusTag.textContent = 'Scheduled';
    }
  } else if (isCompleted) {
    // COMPLETED (History)
    if (pickupStatusTag) {
      pickupStatusTag.className = 'bd-rt-pill-tag is-green';
      pickupStatusTag.textContent = 'Completed (07:32 AM)';
    }
    if (dropoffStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-green';
      dropoffStatusTag.textContent = 'Delivered (07:46 AM)';
    }
    if (returnStatusTag) {
      returnStatusTag.className = 'bd-rt-pill-tag is-green';
      returnStatusTag.textContent = 'Completed (01:04 PM)';
    }
  } else if (isPending) {
    // PENDING REQUEST
    if (pickupStatusTag) {
      pickupStatusTag.className = 'bd-rt-pill-tag is-grey';
      pickupStatusTag.textContent = 'Pending';
    }
    if (dropoffStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-grey';
      dropoffStatusTag.textContent = 'Pending';
    }
    if (returnStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-grey';
      dropoffStatusTag.textContent = 'Pending';
    }
  } else {
    // SCHEDULED / CONFIRMED BOOKING (Before trip starts)
    if (pickupStatusTag) {
      pickupStatusTag.className = 'bd-rt-pill-tag is-blue';
      pickupStatusTag.textContent = 'Scheduled';
    }
    if (dropoffStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-grey';
      dropoffStatusTag.textContent = 'School Drop';
    }
    if (returnStatusTag) {
      dropoffStatusTag.className = 'bd-rt-pill-tag is-grey';
      dropoffStatusTag.textContent = 'Return Leg';
    }
  }

  const retBox = document.getElementById('detailReturnLegBox');
  const retLine = document.getElementById('detailReturnRailLine');
  const both = booking.direction === 'bothway';
  if (retBox) retBox.style.display = both ? 'flex' : 'none';
  if (retLine) retLine.style.display = both ? 'block' : 'none';

  // Stats Strip
  setText('detailStatDistance', booking.distance || '12.5 km');
  setText('detailStatDuration', booking.duration || '30 min');

  // 4. Driver & Vehicle Card
  setText('detailProviderName', String(provider.name || 'Mohammad Rahim').replace(/\s*\(WalkShare\)/i, ''));
  setText('detailProviderRating', String(provider.rating != null ? provider.rating : '4.8'));
  setText('detailProviderReviews', provider.reviewsCount != null ? '(' + provider.reviewsCount + ' trips)' : '(120 trips)');

  const vehName = String(provider.vehicle || '').replace(/\s*\(\d{4}\)\s*/g, '').trim();
  setText('detailVehicleName', isWalk ? 'Walking Escort Group' : (vehName || 'Toyota Hiace'));
  setText(
    'detailVehiclePlate',
    isWalk
      ? ([provider.zone || provider.serviceArea, provider.seats ? provider.seats + ' kids capacity' : 'Verified Escort'].filter(Boolean).join(' • '))
      : [(provider.plate || 'SCH-4091'), 'White', (provider.seats ? provider.seats + ' Seater' : '12 Seater')].join(' • ')
  );

  const pPhoto = document.getElementById('detailDriverPhoto');
  if (pPhoto) {
    pPhoto.src = provider.photo || '/assets/avatar_tariq.jpg';
    pPhoto.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
  }

  const vPhoto = document.getElementById('detailVehicleImage');
  if (vPhoto) {
    vPhoto.src = isWalk ? '/assets/vehicle_walkshare.png' : '/assets/vehicle_hiace_white.jpg';
    vPhoto.onerror = function () { this.onerror = null; this.src = '/assets/vehicle_hiace_white.jpg'; };
  }

  const driverInfoClickable = document.getElementById('detailDriverInfoClickable');
  if (driverInfoClickable) {
    driverInfoClickable.setAttribute('onclick', `openDriverProfile('${provider.id || 'tariq'}', 'bookingDetails')`);
  }

  const vehicleRowClickable = document.getElementById('detailVehicleRowClickable');
  if (vehicleRowClickable) {
    vehicleRowClickable.setAttribute('onclick', `openDriverProfile('${provider.id || 'tariq'}', 'bookingDetails')`);
  }

  // 5. Children (2) Card
  const childrenHeader = document.getElementById('detailChildrenHeaderLabel');
  if (childrenHeader) {
    childrenHeader.textContent = `Children (${children.length})`;
  }

  const passWrap = document.getElementById('detailPassengersWrap');
  if (passWrap) {
    passWrap.innerHTML = children.map((c) => {
      const first = (c.name || 'Child').split(' ')[0];
      const photoSrc = c.photo || (first.toLowerCase() === 'emma' ? '/assets/avatar_emma.jpg' : (first.toLowerCase() === 'zara' ? '/assets/avatar_zara.jpg' : '/assets/avatar_arman.jpg'));
      const gradeText = c.grade ? (c.grade.toLowerCase().includes('grade') || c.grade.toLowerCase().includes('pre') ? c.grade : `Grade ${c.grade}`) : 'Grade 3';

      return (
        '<div class="bd-child-item-row">' +
          '<div style="display:flex; align-items:center; gap:12px;">' +
            '<img src="' + photoSrc + '" alt="" class="bd-child-item-avatar" onerror="this.src=\'/assets/avatar_arman.jpg\';" />' +
            '<div class="bd-child-item-name">' + (c.name || first) + '</div>' +
          '</div>' +
          '<span class="bd-grade-pill">' + gradeText + '</span>' +
        '</div>'
      );
    }).join('') || '<div class="bd-student-meta">No children added</div>';
  }

  // 6. Safety PIN Banner, Pricing Card & Special Instructions
  setText('detailSafetyPinBannerCode', 'PIN ' + pin);
  const ratePeriod = booking.ratePeriod || (isRecurring ? 'week' : 'trip');
  const rateUnitText = ratePeriod === 'week' ? 'week' : 'trip';
  const isAgreed = booking.rateStatus === 'agreed' || (booking.status !== 'pending' && booking.agreedRate != null);
  const currentRate = isAgreed ? (booking.agreedRate || booking.amount || 120) : (booking.listedRate || booking.amount || 120);

  setText('detailPriceAmount', `$${currentRate}/${rateUnitText}`);
  setText('detailPriceBillingCycle', isAgreed ? `Agreed rate · Paid directly to ${(provider.name || 'driver').split(' ')[0]}` : `Listed rate (Negotiable) · Pending confirmation`);
  setText('detailPaymentCardLabel', booking.preferredPayment || 'e-Transfer · Cash (Direct)');

  const payPill = document.getElementById('detailPaymentStatusPill');
  const payPillText = document.getElementById('detailPaymentStatusText');
  if (payPill && payPillText) {
    if (isPending) {
      payPill.style.background = '#FEF3C7';
      payPill.style.color = '#D97706';
      payPill.style.borderColor = '#FDE68A';
      payPillText.textContent = 'Rate: Pending';
    } else {
      payPill.style.background = '#ECFDF5';
      payPill.style.color = '#059669';
      payPill.style.borderColor = '#A7F3D0';
      payPillText.textContent = isAgreed ? 'Rate Agreed' : 'Confirmed';
    }
  }

  const payHandleWrap = document.getElementById('detailPaymentHandleWrap');
}

  // 7. Special Notes & Schedule Tiles
  setText('detailSpecialNotesText', booking.notes || 'Gate 2 (Junior Wing Pickup) • Arman & Emma handover. Driver will wait 5 mins at home gate.');
  setText('detailTileScheduleSub', isRecurring ? 'Repeats every Mon – Fri • Until Dec 31, 2026' : `${tripDate} • ${isBothWay ? 'Round Trip' : 'Single Ride'}`);
  setText('detailTileFareSub', isAgreed ? `Rate agreed: $${currentRate}/${rateUnitText} · Direct payment` : 'Direct payment to provider');

  // 8. Bottom Sticky Contextual Actions
  const primaryTrackBtn = document.getElementById('btnTrackLivePrimary');
  const actionsWrap = document.getElementById('detailContextualActions');

  if (actionsWrap) {
    if (isLive) {
      if (primaryTrackBtn) {
        primaryTrackBtn.style.display = 'flex';
        primaryTrackBtn.innerHTML = '<i data-lucide="map-pin" style="width:18px;height:18px;"></i> <span>Track live vehicle</span>';
        primaryTrackBtn.onclick = function () { openLiveTracking(booking.id); };
      }
      actionsWrap.innerHTML = `
        <button type="button" class="bd-btn-outline danger" onclick="openSosModal()" style="width:100%; justify-content:center;">
          <i data-lucide="alert-triangle" style="width:16px;height:16px;"></i>
          <span>Emergency / SOS Help</span>
        </button>
      `;
    } else if (isPending) {
      if (primaryTrackBtn) primaryTrackBtn.style.display = 'none';
      actionsWrap.innerHTML = `
        <button type="button" class="bd-btn-outline danger" onclick="cancelBooking('${booking.id}')" style="width:100%; justify-content:center;">
          <i data-lucide="x-circle" style="width:16px;height:16px;"></i>
          <span>Cancel request</span>
        </button>
      `;
    } else if (isCancelled) {
      if (primaryTrackBtn) primaryTrackBtn.style.display = 'none';
      actionsWrap.innerHTML = `
        <button type="button" class="bd-btn-outline" onclick="navigateToScreen('screen-browseCars')" style="width:100%; justify-content:center;">
          <i data-lucide="rotate-ccw" style="width:16px;height:16px;"></i>
          <span>Book again</span>
        </button>
      `;
    } else {
      // Confirmed / Scheduled
      if (primaryTrackBtn) {
        primaryTrackBtn.style.display = 'flex';
        primaryTrackBtn.innerHTML = '<i data-lucide="map" style="width:18px;height:18px;"></i> <span>View route map</span>';
        primaryTrackBtn.onclick = function () { openLiveTracking(booking.id); };
      }
      actionsWrap.innerHTML = `
        <button type="button" class="bd-btn-outline danger" onclick="cancelBooking('${booking.id}')" style="width:100%; justify-content:center;">
          <i data-lucide="x-circle" style="width:16px;height:16px;"></i>
          <span>Cancel booking</span>
        </button>
      `;
    }
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  if (payHandleWrap) {
    payHandleWrap.innerHTML = '';
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

  if (typeof window.updateBookingSearchCta === 'function') window.updateBookingSearchCta();
  if (typeof showToast === 'function') showToast('Swapped pickup and drop-off locations');
};

window.rebookRide = function (bookingId) {
  const b = window.appState.bookings.find(x => x.id === bookingId);
  if (b) {
    const childIds = b.childIds || [];
    window.appState.selectedChildIds = [...childIds];
    window.appState.bookingDraft = {
      ...window.appState.bookingDraft,
      childIds: [...childIds],
      pickupLocation: b.pickupLocation,
      schoolLocation: b.schoolLocation,
      direction: b.direction,
      frequency: b.frequency || 'onetime',
      outboundTime: b.outboundTime || '',
      returnTime: b.returnTime || '',
      startDate: b.startDate || '',
      tripDate: b.tripDate || '',
      selectedDays: b.selectedDays || [],
      untilCancelled: b.frequency === 'recurring' ? (b.untilCancelled !== false && !b.untilDate && !b.recurrenceEndDate) : true,
      untilDate: b.untilDate || b.recurrenceEndDate || '',
      recurrenceEndDate: b.untilDate || b.recurrenceEndDate || '',
      recurrenceEnds: (b.untilCancelled !== false && !b.untilDate && !b.recurrenceEndDate) ? 'until_cancelled' : 'date',
      setupSource: 'rebook'
    };
    if (typeof showToast === 'function') showToast(`Loaded booking for ${b.schoolLocation}`);
    navigateTo('bookingTripSetup');
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

  // Exact categories
  const activeTrips = window.appState.bookings.filter(b => b.status === 'in_progress');
  const scheduledTrips = window.appState.bookings.filter(b => ['confirmed', 'pending'].includes(b.status));
  const historyList = window.appState.bookings.filter(b => b.status === 'completed');
  const cancelledList = window.appState.bookings.filter(b => ['cancelled', 'declined'].includes(b.status));

  const totalUpcoming = activeTrips.length + scheduledTrips.length;
  if (btnU) btnU.textContent = `Upcoming (${totalUpcoming})`;
  if (btnH) btnH.textContent = `History (${historyList.length})`;
  if (btnC) btnC.textContent = `Cancelled (${cancelledList.length})`;
  [btnU, btnH, btnC].forEach(b => b?.classList.remove('active'));

  if (!wrap) return;

  const cleanLoc = (loc) => {
    if (!loc) return 'Home (12 Elm Street)';
    return String(loc).split(',')[0].trim();
  };

  const cleanSchool = (loc) => {
    if (!loc) return 'Greenfield International';
    return String(loc).replace(/\s*\([^)]*\)/g, '').split(',')[0].trim();
  };

  const parseDisplayDate = (b, index) => {
    if (b.date) return b.date;
    if (b.tripDate) return b.tripDate;
    const raw = b.startDate || b.createdAt || '';
    if (raw && !raw.includes('Just now')) return raw;
    const sampleDates = ['May 20, 2026', 'May 22, 2026', 'May 24, 2026', 'May 28, 2026'];
    return sampleDates[index % sampleDates.length];
  };

  const renderCard = (b, index, cardType) => {
    const provider = window.appState.providers.find(p => p.id === b.providerId) || window.appState.providers[0];
    const isBothWay = b.direction === 'bothway' || /bothway|round/i.test(b.direction || '');
    const displayDate = parseDisplayDate(b, index);
    
    const pickupLoc = cleanLoc(b.pickupLocation);
    const schoolLoc = cleanSchool(b.schoolLocation);
    
    const outbound = b.outboundTime || '07:30 AM';
    const returnTime = b.returnTime || '01:00 PM';
    const timesText = isBothWay ? `${outbound} & ${returnTime}` : outbound;

    const isLive = b.status === 'in_progress';
    const isCancelled = cardType === 'cancelled' || b.status === 'cancelled' || b.status === 'declined';
    const isHistory = cardType === 'history';

    const priceVal = b.amount != null ? b.amount : 120;

    // 1. Direction Badge — Matching Brand Primary Dark Navy Blue
    const dirPillHtml = isBothWay
      ? `<span style="background:rgba(27,43,104,0.08); color:#1B2B68; border-radius:99px; padding:4px 11px; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="refresh-cw" style="width:11px; height:11px;"></i> Round Trip</span>`
      : `<span style="background:#FFF7ED; color:#EA580C; border-radius:99px; padding:4px 11px; font-size:11.5px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right" style="width:11px; height:11px;"></i> One-way</span>`;

    // 2. Driver Info
    const driverName = String(provider.name || 'Mohammad Rahim').replace(/\s*\(WalkShare\)/i, '');
    const driverRating = String(provider.rating != null ? provider.rating : '4.9');
    const driverPhoto = provider.photo || '/assets/avatar_tariq.jpg';

    // 3. Right Action in Footer — Proper Brand Primary Color
    let actionColHtml = '';
    if (isLive) {
      actionColHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="openLiveTracking('${b.id}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:12px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
            <i data-lucide="map-pin" style="width:13px; height:13px;"></i>
            <span>Track</span>
          </button>
        </div>`;
    } else if (isHistory) {
      actionColHtml = `
        <div style="display:flex; align-items:center; gap:6px;" onclick="event.stopPropagation();">
          <button type="button" onclick="openRatingModal('${b.id}')" style="background:#FFFBEB; color:#D97706; border:1px solid #FDE68A; border-radius:99px; padding:4px 8px; font-size:11px; font-weight:700; cursor:pointer; display:inline-flex; align-items:center; gap:3px;">
            <span style="color:#F59E0B;">★</span> Rate
          </button>
          <button type="button" onclick="rebookRide('${b.id}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:3px;">
            <i data-lucide="rotate-ccw" style="width:11px; height:11px;"></i>
            <span>Book again</span>
          </button>
        </div>`;
    } else if (isCancelled) {
      actionColHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="rebookRide('${b.id}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:3px;">
            <i data-lucide="rotate-ccw" style="width:11px; height:11px;"></i>
            <span>Book again</span>
          </button>
        </div>`;
    } else {
      actionColHtml = `
        <div style="width:28px; height:28px; border-radius:50%; background:#F8FAFC; color:#94A3B8; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:15px; height:15px;"></i>
        </div>`;
    }

    return `
      <article class="h2s-booking-card" onclick="openBookingDetails('${b.id}')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:12px 14px; margin-bottom:10px; box-shadow:0 1px 3px rgba(15,23,42,0.03); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.15s ease;">
        <!-- Top Row: Date & Direction -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(27,43,104,0.08); color:#1B2B68; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="calendar" style="width:17px; height:17px;"></i>
            </div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#0F172A; line-height:1.2;">${displayDate}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:1px;">${timesText}</div>
            </div>
          </div>
          ${dirPillHtml}
        </div>

        <!-- Middle Row: Route Rail & Price Block -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; gap:6px; flex:1; min-width:0; position:relative; padding-left:2px;">
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; background:#1B2B68; flex-shrink:0;"></span>
              <span style="font-size:12.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${pickupLoc}</span>
            </div>
            <div style="position:absolute; left:5px; top:6px; bottom:6px; width:1.5px; border-left:1.5px dashed #CBD5E1; z-index:1;"></div>
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; border:2px solid #1B2B68; background:#FFFFFF; flex-shrink:0; box-sizing:border-box;"></span>
              <span style="font-size:12.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${schoolLoc}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px; flex-shrink:0; padding-left:12px; border-left:1px solid #F1F5F9;">
            <div style="font-size:21px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">$${priceVal}</div>
          </div>
        </div>

        <!-- Footer Row: Driver Info & Contextual Action -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:9px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${driverPhoto}" alt="" style="width:32px; height:32px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_tariq.jpg';" />
            <div>
              <div style="font-size:12.5px; font-weight:700; color:#0F172A; line-height:1.2;">${driverName}</div>
              <div style="font-size:11px; font-weight:700; color:#0F172A; display:flex; align-items:center; gap:2px; margin-top:1px;">
                <span style="color:#F59E0B;">★</span>
                <span>${driverRating}</span>
              </div>
            </div>
          </div>
          ${actionColHtml}
        </div>
      </article>`;
  };

  if (normTab === 'upcoming') {
    btnU?.classList.add('active');
    if (!totalUpcoming) {
      wrap.innerHTML = `
        <div class="bookings-empty-state">
          <div class="bookings-empty-icon-box"><i data-lucide="calendar-x" style="width:24px;height:24px;"></i></div>
          <div class="bookings-empty-title">No upcoming bookings</div>
          <p class="bookings-empty-sub">Book a school ride to see it here.</p>
          <button class="btn-primary" style="margin-top:14px;max-width:200px;height:44px;" onclick="navigateTo('bookingTripSetup')">Book a ride</button>
        </div>`;
    } else {
      let contentHtml = '';
      if (activeTrips.length) {
        contentHtml += `
          <div class="mb-section-title" style="display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:800;color:#1E293B;text-transform:uppercase;letter-spacing:0.5px;margin:4px 0 10px;padding:0 2px;">
            <span class="mb-section-dot green" style="width:8px;height:8px;border-radius:50%;display:inline-block;flex-shrink:0;background:#10B981;box-shadow:0 0 0 3px rgba(16,185,129,0.2);"></span>
            <span>ACTIVE TRIP RIGHT NOW (${activeTrips.length})</span>
          </div>
          ${activeTrips.map((b, i) => renderCard(b, i, 'live')).join('')}`;
      }
      if (scheduledTrips.length) {
        contentHtml += `
          <div class="mb-section-title" style="display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:800;color:#1E293B;text-transform:uppercase;letter-spacing:0.5px;margin:18px 0 10px;padding:0 2px;">
            <i data-lucide="calendar" style="width:14px;height:14px;color:#64748B;"></i>
            <span>SCHEDULED COMMUTES (${scheduledTrips.length})</span>
          </div>
          ${scheduledTrips.map((b, i) => renderCard(b, i + (activeTrips.length || 0), 'upcoming')).join('')}`;
      }
      wrap.innerHTML = contentHtml;
    }
  } else if (normTab === 'history') {
    btnH?.classList.add('active');
    if (!historyList.length) {
      wrap.innerHTML = `
        <div class="bookings-empty-state">
          <div class="bookings-empty-icon-box"><i data-lucide="clock" style="width:24px;height:24px;"></i></div>
          <div class="bookings-empty-title">No past bookings</div>
          <p class="bookings-empty-sub">Completed rides will appear here.</p>
          <button class="btn-primary" style="margin-top:14px;max-width:200px;height:44px;" onclick="navigateTo('bookingTripSetup')">Book a ride</button>
        </div>`;
    } else {
      wrap.innerHTML = `
        <div class="mb-section-title" style="display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:800;color:#1E293B;text-transform:uppercase;letter-spacing:0.5px;margin:4px 0 10px;padding:0 2px;">
          <i data-lucide="check-circle" style="width:14px;height:14px;color:#10B981;"></i>
          <span>COMPLETED COMMUTES (${historyList.length})</span>
        </div>
        ${historyList.map((b, i) => renderCard(b, i, 'history')).join('')}`;
    }
  } else if (normTab === 'cancelled') {
    btnC?.classList.add('active');
    if (!cancelledList.length) {
      wrap.innerHTML = `
        <div class="bookings-empty-state">
          <div class="bookings-empty-icon-box"><i data-lucide="calendar-check" style="width:24px;height:24px;"></i></div>
          <div class="bookings-empty-title">No cancelled bookings</div>
          <p class="bookings-empty-sub">Cancelled requests will appear here.</p>
        </div>`;
    } else {
      wrap.innerHTML = `
        <div class="mb-section-title" style="display:flex;align-items:center;gap:8px;font-size:11.5px;font-weight:800;color:#EF4444;text-transform:uppercase;letter-spacing:0.5px;margin:4px 0 10px;padding:0 2px;">
          <i data-lucide="x-circle" style="width:14px;height:14px;color:#EF4444;"></i>
          <span>CANCELLED / DECLINED (${cancelledList.length})</span>
        </div>
        ${cancelledList.map((b, i) => renderCard(b, i, 'cancelled')).join('')}`;
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
  { chip: 'Live • Trip Started', text: 'Tariq is on the way to pickup', eta: '07:28 AM', pct: '18%' },
  { chip: 'Live • Provider Arrived', text: 'Tariq has arrived at Home (12 Elm Street)', eta: '07:30 AM', pct: '45%' },
  { chip: 'Live • Child Picked Up', text: 'Arman and Emma are on the way to school', eta: '07:42 AM', pct: '72%' },
  { chip: 'Live • Child Dropped Off', text: 'Approaching Greenfield School drop-off zone', eta: '07:44 AM', pct: '90%' },
  { chip: 'Trip Completed', text: 'Children safely handed to school attendant', eta: '07:46 AM', pct: '100%' }
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

  const rateBtn = document.getElementById('trackingRateTripBtn');
  const safetyStatus = document.getElementById('trackingLiveSafetyStatus');

  if (idx >= 4) {
    if (rateBtn) rateBtn.style.display = 'inline-flex';
    if (safetyStatus) safetyStatus.style.display = 'none';
    setTimeout(() => {
      if (typeof window.openParentRateDriverModal === 'function') {
        window.openParentRateDriverModal('tariq', 'H2S-84920');
      } else {
        window.navigateTo('rating');
      }
    }, 600);
  } else {
    if (rateBtn) rateBtn.style.display = 'none';
    if (safetyStatus) safetyStatus.style.display = 'flex';
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

  if (avatar) {
    avatar.src = provider.photo || '/assets/avatar_tariq.jpg';
    avatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
  }
  if (nameEl) nameEl.textContent = provider.name;
  if (subEl) subEl.textContent = `${provider.vehicle || 'School Escort'} • ${provider.rating} ★`;
  if (inputEl) inputEl.placeholder = `Type a message to ${provider.name.split(' ')[0]}...`;

  window.navigateTo('messages');
};

window.callCurrentChatParty = function () {
  let partyName = 'Tariq Ahmed';
  let partyPhone = '+1 (416) 555-0182';

  if (window.appState && window.appState.activeRole === 'driver') {
    partyName = document.getElementById('chatDriverName')?.textContent || 'Sadia Khan';
    partyPhone = '+1 (416) 555-0199';
  } else if (window.activeChatProviderId) {
    const provider = (window.appState?.providers || []).find(p => p.id === window.activeChatProviderId);
    if (provider) {
      partyName = provider.name;
      partyPhone = provider.phone || partyPhone;
    }
  }

  if (window.showToast) {
    window.showToast(`📞 Connecting masked call to ${partyName}...`, 'info');
  } else {
    alert(`Calling ${partyName}: ${partyPhone}`);
  }
};

window.callCurrentDriver = window.callCurrentChatParty;

window.toggleChatOptionsMenu = function (event) {
  if (event) event.stopPropagation();
  const menu = document.getElementById('chatDropdownMenu');
  if (!menu) return;
  const isHidden = menu.style.display === 'none' || !menu.style.display;
  if (isHidden) {
    menu.style.display = 'flex';
    menu.style.flexDirection = 'column';
    const onOutsideClick = function (e) {
      if (!menu.contains(e.target) && e.target.id !== 'chatMoreMenuBtn' && !e.target.closest('#chatMoreMenuBtn')) {
        menu.style.display = 'none';
        document.removeEventListener('click', onOutsideClick);
      }
    };
    setTimeout(() => document.addEventListener('click', onOutsideClick), 10);
  } else {
    menu.style.display = 'none';
  }
};

window.closeChatOptionsMenu = function () {
  const menu = document.getElementById('chatDropdownMenu');
  if (menu) menu.style.display = 'none';
};

window.openClearChatConfirmModal = function () {
  window.closeChatOptionsMenu();
  const nameEl = document.getElementById('chatDriverName');
  const modalName = document.getElementById('clearChatPartyName');
  if (modalName && nameEl) {
    modalName.textContent = nameEl.textContent || 'this contact';
  }
  const modal = document.getElementById('clearChatConfirmModal');
  if (modal) {
    modal.style.display = 'flex';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeClearChatConfirmModal = function (event) {
  if (event && event.target && 
      event.target.id !== 'clearChatConfirmModal' && 
      !event.target.classList.contains('emergency-sos-modal-overlay') && 
      !event.target.closest('.btn-clear-chat-cancel') && 
      !event.target.closest('.btn-close-modal')) {
    return;
  }
  const modal = document.getElementById('clearChatConfirmModal');
  if (modal) {
    modal.style.display = 'none';
  }
};

window.confirmClearChatHistory = function () {
  const stream = document.getElementById('chatStream');
  if (stream) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    stream.innerHTML = `
      <div class="system-status-bubble" style="background:#F1F5F9;border-color:#E2E8F0;color:#64748B;">
        <i data-lucide="info" style="width:14px;height:14px;"></i>
        <span>Chat history was cleared by you • ${timeStr}</span>
      </div>
      <div class="chat-empty-state-card" id="chatEmptyState">
        <div class="chat-empty-icon-wrap">
          <i data-lucide="message-square" style="width:24px;height:24px;"></i>
        </div>
        <div class="chat-empty-title">Conversation Cleared</div>
        <div class="chat-empty-desc">Send a new message or tap a quick reply below to coordinate child transit.</div>
      </div>
    `;
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  const modal = document.getElementById('clearChatConfirmModal');
  if (modal) {
    modal.style.display = 'none';
  }

  if (window.showToast) {
    window.showToast('✓ Conversation history cleared from view', 'success');
  }
};

window.deleteIndividualChatMessage = function (btnEl) {
  const bubble = btnEl.closest('.chat-bubble') || btnEl.closest('.system-status-bubble');
  if (!bubble) return;

  bubble.style.transition = 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)';
  bubble.style.opacity = '0';
  bubble.style.transform = 'scale(0.92) translateY(-6px)';
  bubble.style.maxHeight = '0px';
  bubble.style.padding = '0px 14px';
  bubble.style.margin = '0px';
  bubble.style.overflow = 'hidden';

  setTimeout(() => {
    bubble.remove();
    const stream = document.getElementById('chatStream');
    if (stream && stream.querySelectorAll('.chat-bubble').length === 0 && !document.getElementById('chatEmptyState')) {
      const empty = document.createElement('div');
      empty.className = 'chat-empty-state-card';
      empty.id = 'chatEmptyState';
      empty.innerHTML = `
        <div class="chat-empty-icon-wrap">
          <i data-lucide="message-square" style="width:24px;height:24px;"></i>
        </div>
        <div class="chat-empty-title">No Messages</div>
        <div class="chat-empty-desc">Send a message to coordinate school commute.</div>
      `;
      stream.appendChild(empty);
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }
  }, 260);

  if (window.showToast) {
    window.showToast('✓ Message removed from view', 'info');
  }
};

window.copyChatMessageText = function (btnEl) {
  const bubble = btnEl.closest('.chat-bubble');
  if (!bubble) return;
  const textEl = bubble.querySelector('.chat-bubble-text') || bubble;
  const rawText = textEl.childNodes[0]?.nodeValue?.trim() || textEl.innerText?.split('\n')[0] || '';

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(rawText).then(() => {
      if (window.showToast) window.showToast('✓ Copied to clipboard', 'success');
    }).catch(() => {
      if (window.showToast) window.showToast('Copied text: ' + rawText, 'info');
    });
  } else {
    if (window.showToast) window.showToast('✓ Copied: ' + rawText, 'info');
  }
};

window.reactToChatMessage = function (btnEl, emoji) {
  const bubble = btnEl.closest('.chat-bubble');
  if (!bubble) return;
  let reactionPill = bubble.querySelector('.chat-reaction-pill');
  if (reactionPill) {
    if (reactionPill.textContent === emoji) {
      reactionPill.remove();
      return;
    }
    reactionPill.textContent = emoji;
  } else {
    reactionPill = document.createElement('span');
    reactionPill.className = 'chat-reaction-pill';
    reactionPill.textContent = emoji;
    bubble.appendChild(reactionPill);
  }
};

window.shareCurrentTripLocationInChat = function () {
  window.closeChatOptionsMenu();
  const stream = document.getElementById('chatStream');
  if (!stream) return;

  const empty = document.getElementById('chatEmptyState');
  if (empty) empty.remove();

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble parent chat-bubble-location-share';
  bubble.innerHTML = `
    <div class="chat-location-card">
      <div class="chat-location-header">
        <i data-lucide="map-pin" style="width:16px;height:16px;color:#38BDF8;"></i>
        <strong>Live Route &amp; ETA Shared</strong>
      </div>
      <div class="chat-location-body">
        <span>📍 Near Bloor St W &amp; Bay St</span>
        <span class="chat-location-eta">ETA: 4 mins to pickup</span>
      </div>
    </div>
    <div class="chat-timestamp">${timeStr} <i data-lucide="check-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;"></i></div>
    <div class="chat-bubble-actions">
      <button type="button" class="bubble-act-btn" onclick="copyChatMessageText(this)" title="Copy" aria-label="Copy"><i data-lucide="copy"></i></button>
      <button type="button" class="bubble-act-btn danger" onclick="deleteIndividualChatMessage(this)" title="Delete" aria-label="Delete"><i data-lucide="trash-2"></i></button>
      <button type="button" class="bubble-act-btn" onclick="reactToChatMessage(this, '👍')" title="Thumbs up"><span>👍</span></button>
    </div>
  `;
  stream.appendChild(bubble);
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  stream.scrollTop = stream.scrollHeight;

  if (window.showToast) {
    window.showToast('✓ Live location pin shared in chat', 'success');
  }
};

window.toggleMuteChatNotifications = function () {
  window.closeChatOptionsMenu();
  window._isChatMuted = !window._isChatMuted;
  const label = document.getElementById('chatMuteMenuLabel');
  if (label) {
    label.textContent = window._isChatMuted ? 'Unmute' : 'Mute notifications';
  }
  if (window.showToast) {
    window.showToast(window._isChatMuted ? '🔕 Notifications muted for this chat' : '🔔 Notifications enabled', 'info');
  }
};

window.reportSafetyIssueFromChat = function () {
  window.closeChatOptionsMenu();
  if (window.showToast) {
    window.showToast('🛡️ Safety incident report logged with Trust & Safety Desk', 'info');
  }
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

  const empty = document.getElementById('chatEmptyState');
  if (empty) empty.remove();

  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${sender}`;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  bubble.innerHTML = `
    <div class="chat-bubble-text">${text}</div>
    <div class="chat-timestamp">
      ${timeStr}
      ${sender === 'parent' ? '<i data-lucide="check-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;opacity:0.85;"></i>' : ''}
    </div>
    <div class="chat-bubble-actions">
      <button type="button" class="bubble-act-btn" onclick="copyChatMessageText(this)" title="Copy message" aria-label="Copy">
        <i data-lucide="copy"></i>
      </button>
      <button type="button" class="bubble-act-btn danger" onclick="deleteIndividualChatMessage(this)" title="Delete message" aria-label="Delete">
        <i data-lucide="trash-2"></i>
      </button>
      <button type="button" class="bubble-act-btn" onclick="reactToChatMessage(this, '👍')" title="Thumbs up" aria-label="React">
        <span>👍</span>
      </button>
    </div>
  `;

  stream.appendChild(bubble);
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  stream.scrollTop = stream.scrollHeight;
}

function simulateDriverReply() {
  setTimeout(() => {
    const replies = [
      "Thank you! Rest assured your children are safe with me.",
      "Understood! Driving carefully and following the verified school route.",
      "Just arrived at the school drop-off loop. All good!"
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    appendChatMessage(randomReply, 'provider');
  }, 1200);
}

window.currentRatingScore = 5;
window._ratingBookingId = null;

window.openRatingModal = function (bookingId) {
  const booking = (window.appState.bookings || []).find((b) => b.id === bookingId)
    || (window.appState.bookings || []).find((b) => b.status === 'completed')
    || null;
  window._ratingBookingId = booking?.id || bookingId || null;
  const provider = (window.appState.providers || []).find((p) => p.id === (booking?.providerId || 'tariq'))
    || window.appState.providers?.[0];
  const cleanName = String(provider?.name || 'Provider').replace(/\s*\(WalkShare\)/i, '');
  const photo = document.getElementById('ratingProviderPhoto');
  const nameEl = document.getElementById('ratingProviderName');
  const tripEl = document.getElementById('ratingTripLine');
  if (photo) {
    photo.src = provider?.photo || '/assets/avatar_tariq.jpg';
    photo.alt = cleanName;
  }
  if (nameEl) nameEl.textContent = cleanName;
  if (tripEl) {
    const school = String(booking?.schoolLocation || 'School').split(',')[0];
    tripEl.textContent = school + ' · completed';
  }
  window.setRatingScore(5);
  const comment = document.getElementById('ratingCommentText');
  if (comment) comment.value = '';
  if (window.lucide) window.lucide.createIcons();
  window.navigateTo('rating');
};

window.setRatingScore = function (score) {
  window.currentRatingScore = score;
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

  const flagNotice = document.getElementById('lowRatingAutoFlagNotice');
  if (flagNotice) {
    if (score <= 3) flagNotice.removeAttribute('hidden');
    else flagNotice.setAttribute('hidden', '');
  }
};

window.handleParentReviewSubmit = function () {
  const score = window.currentRatingScore || 5;
  const comment = (document.getElementById('ratingCommentText')?.value || '').trim();
  const provider = (window.appState.providers || []).find((p) => p.id === (window._ratingBookingId || 'tariq')) || window.appState.providers?.[0];

  if (provider) {
    const parentName = window.appState.user?.name || 'Sadia Khan';
    const shortName = parentName.split(' ').map((p, i) => (i === 0 ? p : (p[0] ? p[0] + '.' : ''))).join(' ').trim();
    const newReview = {
      id: 'rev-' + Date.now(),
      name: shortName,
      fullName: parentName,
      providerId: provider.id,
      rating: score,
      date: 'Today',
      text: comment || (score >= 4 ? 'Great school commute, gentle driving and punctual arrival.' : 'Trip completed.'),
      flaggedForAdmin: score < 3.5,
      flagReason: score < 3.5 ? `Low rating (${score}/5 stars) automatically flagged for admin review.` : '',
      hidden: false
    };
    if (typeof window.getProviderReviews === 'function') {
      const existing = window.getProviderReviews(provider);
      provider.reviewsList = [newReview, ...existing];
    }
    if (!window.appState.parentReviews) window.appState.parentReviews = [];
    window.appState.parentReviews.unshift(newReview);
  }

  if (typeof window.showToast === 'function') {
    window.showToast(
      score <= 3 ? `${score}★ submitted — safety team will review` : `Thanks — ${score}★ review saved`,
      score <= 3 ? 'info' : 'success'
    );
  }
  window.navigateTo('home');
};

/* ==========================================================
   PIPEDA & Account Management Modals
   ========================================================== */
window.openPipedaConsentModal = function () {
  const modal = document.getElementById('pipedaConsentModal');
  if (modal) modal.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

window.closePipedaConsentModal = function () {
  const modal = document.getElementById('pipedaConsentModal');
  if (modal) modal.style.display = 'none';
};

window.acceptPipedaConsent = function () {
  const checkbox = document.getElementById('authParentConsentCheckbox');
  if (checkbox) checkbox.checked = true;
  window.closePipedaConsentModal();
};

window.openForgotPasswordModal = function () {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

window.closeForgotPasswordModal = function () {
  const modal = document.getElementById('forgotPasswordModal');
  if (modal) modal.style.display = 'none';
};

window.handleSendPasswordReset = function (e) {
  if (e) e.preventDefault();
  const email = document.getElementById('forgotPasswordEmailInput')?.value || 'your email';
  alert(`✓ Password reset email sent to: ${email}\nPlease check your inbox to complete verification.`);
  window.closeForgotPasswordModal();
};

window.openChangePasswordModal = function () {
  const modal = document.getElementById('changePasswordModal');
  if (modal) {
    modal.style.display = 'flex';
    const cur = document.getElementById('changePassCurrent');
    if (cur) cur.value = '';
    const nw = document.getElementById('changePassNew');
    if (nw) nw.value = '';
    const cf = document.getElementById('changePassConfirm');
    if (cf) cf.value = '';
  }
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};
window.openChangePassword = window.openChangePasswordModal;

window.closeChangePasswordModal = function () {
  const modal = document.getElementById('changePasswordModal');
  if (modal) modal.style.display = 'none';
};

window.handleChangePasswordSubmit = function (e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const nw = document.getElementById('changePassNew')?.value || '';
  const cf = document.getElementById('changePassConfirm')?.value || '';
  if (nw.length < 8) {
    if (typeof window.toast === 'function') window.toast('Password must be at least 8 characters.');
    else alert('Password must be at least 8 characters.');
    return;
  }
  if (nw !== cf) {
    if (typeof window.toast === 'function') window.toast('New passwords do not match. Please try again.');
    else alert('New passwords do not match.');
    return;
  }
  window.closeChangePasswordModal();
  if (typeof window.toast === 'function') {
    window.toast('✓ Password updated successfully!');
  } else {
    alert('✓ Password updated successfully!');
  }
};

window.openSubscriptionReceiptModal = function () {
  const modal = document.getElementById('subscriptionInvoiceModal');
  if (modal) modal.style.display = 'flex';
  if (window.lucide) window.lucide.createIcons();
};

window.closeSubscriptionReceiptModal = function () {
  const modal = document.getElementById('subscriptionInvoiceModal');
  if (modal) modal.style.display = 'none';
};

window.applyParentPromoCode = function () {
  const input = document.getElementById('inputPromoCode');
  const code = (input?.value || '').trim().toUpperCase();
  const badge = document.getElementById('promoBadgeSuccess');
  if (code === 'SCHOOL20' || code === 'SCHOOL2026' || code === 'SAVE20' || code.length >= 3) {
    if (badge) badge.style.display = 'inline';
    alert(`🎉 Promo Code "${code || 'SCHOOL20'}" applied! 20% discount activated on your platform fee.`);
  } else {
    alert('Please enter a valid promo code (e.g. SCHOOL20)');
  }
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
          if (window.appState.activeRole === 'driver') {
            const next = typeof window.getDriverLanding === 'function' ? window.getDriverLanding() : 'driverOnboardProfile';
            window.navigateTo(next);
          } else {
            window.navigateTo('authProfile');
          }
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
      container.innerHTML = `<img src="${url}" alt="Uploaded Avatar" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />`;
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

window.showCustomToast = function (msg, type) {
  window.showToast(msg, type || 'success');
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
          <div style="font-size: 14px; font-weight: 700; color: #0F172A;">No Emergency Contacts Added</div>
          <p style="font-size: 12px; color: #64748B; margin: 4px 0 14px; line-height: 1.4;">Add at least one trusted guardian or family member.</p>
          <button class="btn-primary" style="height: 38px; font-size: 12px; padding: 0 16px; margin: 0 auto;" onclick="openAddEmergencyContactModal()">+ Add Contact</button>
        </div>
      `;
    } else {
      container.innerHTML = contacts.map(c => {
        const cleanPhone = c.phone.replace(/[^0-9+]/g, '');
        const primaryBadge = c.isPrimary ? `<span class="contact-primary-tag">Primary</span>` : '';
        const photo = c.photo || window.personAvatar(c.name, '/assets/avatar_sadia.jpg');
        const avatarHtml = `<img src="${photo}" alt="${c.name}" class="contact-avatar-img" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />`;

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
              <a href="tel:${cleanPhone}" class="btn-contact-action-call mvp-hide-phone" aria-label="Call ${c.name}" title="Call ${c.name}" style="display:none;">
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
        <div style="grid-column: 1 / -1; font-size: 12px; color: #64748B; text-align: center; padding: 10px;">
          No personal contacts registered. Please add contacts in Emergency Hub.
        </div>
      `;
    } else {
      sosContainer.innerHTML = familyContacts.map(c => {
        const photo = c.photo || window.personAvatar(c.name, '/assets/avatar_sadia.jpg');
        const cleanPhone = c.phone.replace(/[^0-9+]/g, '');
        const relLabel = c.rel;
        return `
          <a href="tel:${cleanPhone}" class="sos-family-row">
            <div class="sos-family-avatar-wrap">
              <img class="sos-family-avatar" src="${photo}" alt="${c.name}" onerror="this.src='/assets/avatar_sadia.jpg'" />
              <span class="sos-avatar-online"></span>
            </div>
            <div class="sos-family-info">
              <span class="sos-family-name">${c.name}</span>
              <span class="sos-family-rel">${relLabel}</span>
            </div>
            <span class="sos-family-call" aria-label="Call ${c.name}"><i data-lucide="phone" style="width:16px;height:16px;"></i></span>
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
      if (m !== targetMenu) {
        m.style.display = 'none';
        const parentRow = m.closest('.emergency-contact-row, .grouped-row-item');
        if (parentRow) parentRow.style.zIndex = '';
      }
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    const willOpen = forceOpen ? true : !isVisible;
    targetMenu.style.display = willOpen ? 'flex' : 'none';
    const parentRow = targetMenu.closest('.emergency-contact-row, .grouped-row-item');
    if (parentRow) {
      parentRow.style.zIndex = willOpen ? '35' : '';
    }
    if (willOpen && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeContactActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('.contact-dropdown-menu').forEach(m => {
    m.style.display = 'none';
    const parentRow = m.closest('.emergency-contact-row, .grouped-row-item');
    if (parentRow) parentRow.style.zIndex = '';
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
  modal.classList.add('active');
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
  if (modal) {
    modal.style.display = 'none';
    modal.classList.remove('active');
  }
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
      notes,
      photo: window.personAvatar(name, '/assets/avatar_sadia.jpg')
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
          ${loc.isDefault ? '<span class="status-chip confirmed" style="font-size: 10px; padding: 3px 9px; font-weight: 700;">Default</span>' : ''}
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
      if (m !== targetMenu) {
        m.style.display = 'none';
        const parentRow = m.closest('.grouped-row-item');
        if (parentRow) parentRow.style.zIndex = '';
      }
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    const willOpen = forceOpen ? true : !isVisible;
    targetMenu.style.display = willOpen ? 'flex' : 'none';
    const parentRow = targetMenu.closest('.grouped-row-item');
    if (parentRow) {
      parentRow.style.zIndex = willOpen ? '35' : '';
    }
    if (willOpen && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeLocationActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('[id^="locMenu-"]').forEach(m => {
    m.style.display = 'none';
    const parentRow = m.closest('.grouped-row-item');
    if (parentRow) parentRow.style.zIndex = '';
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
    countLabel.textContent = String(filtered.length);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="background:#F8FAFC; border:1px dashed #E2E8F0; border-radius:14px; padding:28px 16px; text-align:center;">
        <div style="font-size:12px; font-weight:700; color:#64748B;">No transactions found</div>
        <div style="font-size:12px; color:#94A3B8; margin-top:3px;">There are no transactions recorded under this filter.</div>
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
    badgeEl.textContent = isRefund ? '↩ Subscription refund' : '✓ Platform fee paid via Stripe';
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
  if (typeof window.backNested === 'function') window.backNested('profile');
  else window.navigateTo('profile');
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
  if (window.navReturnStack && window.navReturnStack.length) {
    window.backNested(window.tripReportPreviousScreen || 'profile');
    return;
  }
  const prev = window.tripReportPreviousScreen || (activeNavRole() === 'driver' ? 'driverProfile' : activeNavRole() === 'walkshare' ? 'wsProfile' : 'profile');
  window.navigateTo(prev, true);
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
      <div style="text-align:center; padding: 24px; color: var(--color-body); font-size: 12px;">
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
      if (m !== targetMenu) {
        m.style.display = 'none';
        const parentRow = m.closest('.grouped-row-item');
        if (parentRow) parentRow.style.zIndex = '';
      }
    });
  }

  if (targetMenu) {
    const isVisible = targetMenu.style.display === 'flex';
    const willOpen = forceOpen ? true : !isVisible;
    targetMenu.style.display = willOpen ? 'flex' : 'none';
    const parentRow = targetMenu.closest('.grouped-row-item');
    if (parentRow) {
      parentRow.style.zIndex = willOpen ? '35' : '';
    }
    if (willOpen && window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeChildActionMenus = function (force = false) {
  if (window.figmaHoldMode && !force) return;
  document.querySelectorAll('.child-dropdown-menu').forEach(m => {
    m.style.display = 'none';
    const parentRow = m.closest('.grouped-row-item');
    if (parentRow) parentRow.style.zIndex = '';
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
    monogramEl.innerHTML = `<img src="${photoSrc}" alt="${child.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='/assets/avatar_arman.jpg';" />`;
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
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeEmergencySOSModal = function () {
  const modal = document.getElementById('emergencySOSModal');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
  }
};


// Global escape key listener to close active overlays
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' || e.key === 'Esc') {
    const sosModal = document.getElementById('emergencySOSModal');
    if (sosModal && sosModal.style.display === 'flex') {
      sosModal.style.display = 'none';
    }
    const pinModal = document.getElementById('dynamicSafetyPinModal') || document.getElementById('safetyPinModal');
    if (pinModal && pinModal.style.display === 'flex') {
      pinModal.style.display = 'none';
    }
    const fareModal = document.getElementById('dynamicFareModal');
    if (fareModal && fareModal.style.display === 'flex') {
      fareModal.style.display = 'none';
    }
  }
});

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
    if (window.showToast) window.showToast('Calling 911…', 'error');
  } else if (type === 'dispatch') {
    if (window.showToast) window.showToast('Calling support…', 'info');
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
  const hasActive = (window.appState?.bookings || []).some(b => b.status === 'in_progress');

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
  const old = document.getElementById('countryPickerModal');
  if (old) old.remove();

  // Never leave address map open under the picker
  const profileMap = document.getElementById('profileMapPicker');
  if (profileMap) profileMap.style.display = 'none';
  window._profileMapOpen = false;

  const overlay = document.createElement('div');
  overlay.id = 'countryPickerModal';
  overlay.className = 'country-picker-overlay';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-label', 'Select country');
  overlay.onclick = (e) => {
    if (e.target === overlay) overlay.remove();
  };

  const sheet = document.createElement('div');
  sheet.className = 'country-picker-sheet';
  sheet.onclick = (e) => e.stopPropagation();

  sheet.innerHTML = `
    <div class="country-picker-head">
      <div class="country-picker-title">Select Country</div>
      <button type="button" class="btn-icon-close" onclick="document.getElementById('countryPickerModal')?.remove()" aria-label="Close">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="country-picker-list">
      ${window._countryPickerData.map((c) => `
        <button type="button" class="country-picker-row" onclick="window.selectCountry('${c.flag}','${c.code}','${c.name}')">
          <span class="country-picker-flag">${c.flag}</span>
          <span class="country-picker-name">${c.name}</span>
          <span class="country-picker-code">${c.code}</span>
        </button>
      `).join('')}
    </div>
  `;

  overlay.appendChild(sheet);
  const shell = document.getElementById('appShell') || document.body;
  shell.appendChild(overlay);
  if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
};

window.selectCountry = function (flag, code) {
  const flagEl = document.getElementById('profileCountryFlag');
  const codeEl = document.getElementById('profileCountryCode');
  if (flagEl) flagEl.textContent = flag;
  if (codeEl) codeEl.textContent = code;

  // Auth welcome phone pill (if present)
  const authPill = document.querySelector('#authPhoneForm .country-picker');
  if (authPill) {
    const authFlag = authPill.querySelector('.flag-icon');
    const authCode = authPill.querySelector('.country-code');
    if (authFlag) authFlag.textContent = flag;
    if (authCode) authCode.textContent = code;
  }

  document.getElementById('countryPickerModal')?.remove();
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
  if (btn) {
    btn.innerHTML = '<i data-lucide="loader-2" class="spin" style="width:16px;height:16px;color:#fff;"></i>';
    btn.disabled = true;
    if (window.lucide) window.lucide.createIcons();
  }

  if (!navigator.geolocation) {
    if (window.showToast) window.showToast('Geolocation not supported on this device', 'error');
    if (btn) {
      btn.innerHTML = '<i data-lucide="locate" style="width:16px;height:16px;color:#fff;"></i>';
      btn.disabled = false;
      if (window.lucide) window.lucide.createIcons();
    }
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
      if (btn) {
        btn.innerHTML = '<i data-lucide="locate" style="width:16px;height:16px;color:#fff;"></i>';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
    },
    (err) => {
      // Fallback — show map so user can pick manually
      if (window.showToast) window.showToast('Could not get location. Pin it on the map.', 'error');
      window.toggleProfileMapPicker();
      if (btn) {
        btn.innerHTML = '<i data-lucide="locate" style="width:16px;height:16px;color:#fff;"></i>';
        btn.disabled = false;
        if (window.lucide) window.lucide.createIcons();
      }
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

/* Driver Home/Profile/Requests/Schedule are rendered by mvp-driver.js
   against appState.driver only. Do not paint parent household chrome here. */

window.openDriverAttendanceModal = function () {
  const m = document.getElementById('driverAttendanceModal');
  if (m) {
    m.style.display = 'flex';
    m.classList.add('active');
  }
};

window.closeDriverAttendanceModal = function () {
  const m = document.getElementById('driverAttendanceModal');
  if (m) {
    m.style.display = 'none';
    m.classList.remove('active');
  }
};

if (typeof document !== 'undefined') {
  window.renderBookingSummary = renderBookingSummary;
  window.renderBookingDetails = renderBookingDetails;
  window.renderBookingsList = renderBookingsList;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      if (window.renderBookingSavedLocations) window.renderBookingSavedLocations();
    });
  } else {
    if (window.renderBookingSavedLocations) window.renderBookingSavedLocations();
  }
}

/* ==========================================================
   Admin Portal & Search Filter Helpers (RFP Sec 4.2 & 4.10)
   ========================================================== */
window.showAdminSection = function (sectionName, btn) {
  const sections = ['kyc', 'trips', 'reviews', 'pricing'];
  sections.forEach((s) => {
    const el = document.getElementById('adminSection' + s.charAt(0).toUpperCase() + s.slice(1));
    if (el) el.style.display = s === sectionName ? 'flex' : 'none';
  });

  document.querySelectorAll('#screen-adminPortal .clean-pill-btn').forEach((b) => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  if (window.lucide) window.lucide.createIcons();
};

/* ==========================================================
   Search & Distance Radius Filter Modal & Drag Slider Logic
   ========================================================== */
window.openSearchFilterModal = function () {
  const modal = document.getElementById('searchFilterModal');
  if (!modal) return;
  modal.classList.add('active');

  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  const currentRadius = Number(window.appState.bookingDraft.searchRadiusKm);
  const radiusVal = (Number.isFinite(currentRadius) && currentRadius > 0) ? currentRadius : 10;
  
  const slider = document.getElementById('modalRadiusSlider');
  const badge = document.getElementById('modalRadiusBadge');
  if (slider) slider.value = radiusVal >= 50 ? 50 : radiusVal;
  if (badge) badge.textContent = radiusVal >= 50 ? 'Any' : `${radiusVal} km`;

  // Sync radius preset chips
  document.querySelectorAll('#modalRadiusPresetChips .sf-chip').forEach((chip) => {
    const text = chip.textContent.trim();
    if (radiusVal >= 50 && text === 'Any') chip.classList.add('active');
    else if (text === `${radiusVal} km`) chip.classList.add('active');
    else chip.classList.remove('active');
  });

  // Sync Trust & Safety toggle cards
  const verifiedCheck = document.getElementById('modalFilterVerifiedCheck');
  if (verifiedCheck) {
    verifiedCheck.closest('.sf-feature-card')?.classList.toggle('is-checked', verifiedCheck.checked);
  }
  const topRatedCheck = document.getElementById('modalFilterTopRatedCheck');
  if (topRatedCheck) {
    topRatedCheck.closest('.sf-feature-card')?.classList.toggle('is-checked', topRatedCheck.checked);
  }

  window.updateLiveFilterCount();
  if (window.lucide) window.lucide.createIcons();
};

window.closeSearchFilterModal = function () {
  const modal = document.getElementById('searchFilterModal');
  if (!modal) return;
  modal.classList.remove('active');
};

window.handleRadiusSliderChange = function (val) {
  const km = Number(val);
  const badge = document.getElementById('modalRadiusBadge');
  if (badge) badge.textContent = km >= 50 ? 'Any' : `${km} km`;

  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.searchRadiusKm = km >= 50 ? 0 : km;

  // Sync preset chips
  document.querySelectorAll('#modalRadiusPresetChips .sf-chip').forEach((chip) => {
    const text = chip.textContent.trim();
    if (km >= 50 && text === 'Any') chip.classList.add('active');
    else if (text === `${km} km`) chip.classList.add('active');
    else chip.classList.remove('active');
  });

  window.updateLiveFilterCount();
};

window.setModalRadius = function (km) {
  const slider = document.getElementById('modalRadiusSlider');
  if (slider) slider.value = km;
  window.handleRadiusSliderChange(km);
};

window.setModalTiming = function (timing, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.sf-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.timingFilter = timing || 'all';
  window.updateLiveFilterCount();
};

window.setModalServiceType = function (type, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.sf-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.serviceType = type || 'all';
  window.updateLiveFilterCount();
};

window.setModalZone = function (zone, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.sf-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.zone = zone === 'all' ? '' : zone;
  const label = document.getElementById('modalSelectedZoneLabel');
  if (label) {
    label.textContent = zone === 'all' ? 'All' : zone.charAt(0).toUpperCase() + zone.slice(1);
  }
  window.updateLiveFilterCount();
};

window.updateLiveFilterCount = function () {
  const cards = Array.from(document.querySelectorAll('#providersResultList .provider-result-card'));
  if (!cards.length) return;

  const draft = window.appState.bookingDraft || {};
  const radiusKm = Number(draft.searchRadiusKm);
  const hasRadius = Number.isFinite(radiusKm) && radiusKm > 0;
  const service = draft.serviceType || 'all';
  const selectedZone = (draft.zone || '').toLowerCase().trim();
  const verifiedOnly = document.getElementById('modalFilterVerifiedCheck')?.checked;
  const topRatedOnly = document.getElementById('modalFilterTopRatedCheck')?.checked;

  const providers = (window.appState && window.appState.providers) || [];

  let count = 0;
  cards.forEach((card) => {
    const cat = card.getAttribute('data-category');
    const rating = parseFloat(card.getAttribute('data-rating') || '0');
    const verified = card.getAttribute('data-verified') === 'true';
    const distance = parseFloat(card.getAttribute('data-distance') || '99');
    const providerId = (card.getAttribute('data-provider-id') || '').toLowerCase();
    const provider = providers.find((p) => p.id === providerId);

    let match = true;
    if (service !== 'all' && cat !== service) match = false;
    if (hasRadius && distance > radiusKm) match = false;
    if (verifiedOnly && !verified) match = false;
    if (topRatedOnly && rating < 4.8) match = false;
    if (selectedZone && selectedZone !== 'all') {
      const pZone = ((provider && (provider.zone || provider.serviceArea)) || '').toLowerCase();
      if (!pZone.includes(selectedZone)) match = false;
    }

    if (match) count++;
  });

  const btnText = document.getElementById('modalApplyFilterBtnText');
  if (btnText) {
    btnText.textContent = count > 0 ? `Apply (${count})` : 'Apply (0)';
  }
};

window.resetSearchFilters = function () {
  window.setModalRadius(10);
  
  const allTiming = document.querySelector('#modalTimingChips .sf-chip');
  if (allTiming) window.setModalTiming('all', allTiming);

  const allService = document.querySelector('#modalServiceTypeChips .sf-chip');
  if (allService) window.setModalServiceType('all', allService);

  const verifiedCheck = document.getElementById('modalFilterVerifiedCheck');
  if (verifiedCheck) {
    verifiedCheck.checked = false;
    verifiedCheck.closest('.sf-feature-card')?.classList.remove('is-checked');
  }

  const topRatedCheck = document.getElementById('modalFilterTopRatedCheck');
  if (topRatedCheck) {
    topRatedCheck.checked = false;
    topRatedCheck.closest('.sf-feature-card')?.classList.remove('is-checked');
  }

  window.updateLiveFilterCount();
};

window.applySearchFiltersAndClose = function () {
  window.closeSearchFilterModal();

  const active = document.querySelector('#providerFilterRow .mvp-filter-chip.active');
  if (typeof window.applyProviderCompactFilter === 'function') {
    window.applyProviderCompactFilter(active?.getAttribute('data-filter') || 'all', active);
  }

  const radius = window.appState.bookingDraft?.searchRadiusKm;
  const radiusText = radius && radius > 0 ? `Within ${radius} km` : 'All distances';
  if (typeof window.showToast === 'function') {
    window.showToast(`✓ Filter applied: ${radiusText}`, 'info');
  }
};

window.toggleAdvancedSearchFilterDrawer = function () {
  window.openSearchFilterModal();
};

window.setDistanceRadius = function (km, btn) {
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.searchRadiusKm = Number(km) || 0;
  const label = document.getElementById('radiusFilterLabel');
  if (label) label.textContent = km === 0 ? 'Any' : `${km} km`;
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.mvp-filter-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }
  const active = document.querySelector('#providerFilterRow .mvp-filter-chip.active');
  if (typeof window.applyProviderCompactFilter === 'function') {
    window.applyProviderCompactFilter(active?.getAttribute('data-filter') || 'all', active);
  }
};

window.setTripTimingFilter = function (timing, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('.mvp-filter-chip').forEach((c) => c.classList.remove('active'));
    btn.classList.add('active');
  }
  if (!window.appState.bookingDraft) window.appState.bookingDraft = {};
  window.appState.bookingDraft.timingFilter = timing || 'all';
  if (timing === 'all') {
    /* keep existing direction from trip setup */
  } else if (timing === 'morning' || timing === 'afternoon') {
    window.appState.bookingDraft.direction = 'oneway';
  }
  if (typeof window.applyProviderCompactFilter === 'function') {
    const active = document.querySelector('#providerFilterRow .mvp-filter-chip.active');
    window.applyProviderCompactFilter(active?.getAttribute('data-filter') || 'all', active);
  } else if (window.H2SAvailability) {
    window.H2SAvailability.applyToProviderCards(window.appState.bookingDraft);
  }
};

window.switchAuthMethod = function (method) {
  const emailContainer = document.getElementById('authEmailContainer');
  const phoneForm = document.getElementById('authPhoneForm');
  const tabEmail = document.getElementById('authTabEmail');
  const tabPhone = document.getElementById('authTabPhone');

  if (method === 'email') {
    if (emailContainer) emailContainer.style.display = 'flex';
    if (phoneForm) phoneForm.style.display = 'none';
    if (tabEmail) tabEmail.classList.add('active');
    if (tabPhone) tabPhone.classList.remove('active');
  } else {
    if (emailContainer) emailContainer.style.display = 'none';
    if (phoneForm) phoneForm.style.display = 'flex';
    if (tabEmail) tabEmail.classList.remove('active');
    if (tabPhone) tabPhone.classList.add('active');
  }
  if (window.lucide) window.lucide.createIcons();
};

window.toggleAuthViewMode = function (mode) {
  const signInForm = document.getElementById('authEmailSignInForm');
  const signUpForm = document.getElementById('authEmailSignUpForm');
  
  if (mode === 'signup') {
    if (signInForm) signInForm.style.display = 'none';
    if (signUpForm) signUpForm.style.display = 'flex';
    window.selectSignupRole(window.appState._signupRole || 'parent');
  } else {
    if (signInForm) signInForm.style.display = 'flex';
    if (signUpForm) signUpForm.style.display = 'none';
  }
  if (window.lucide) window.lucide.createIcons();
};

window.selectSignupRole = function (role) {
  const valid = role === 'driver' || role === 'walkshare' ? role : 'parent';
  window.appState._signupRole = valid;
  
  // Sync tiles, chips, and cards
  document.querySelectorAll('.auth-role-tile, .auth-role-chip, .auth-role-card').forEach((btn) => {
    const on = btn.getAttribute('data-role') === valid;
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.setAttribute('aria-checked', on ? 'true' : 'false');
  });

  const consent = document.getElementById('authPhoneConsentLabel');
  const hint = document.getElementById('authRoleHint');
  const submitLabel = document.getElementById('authPhoneSubmitLabel');

  if (valid === 'driver') {
    if (consent) {
      consent.innerHTML = 'I agree to the <a href="javascript:void(0)" onclick="window.openPipedaConsentModal()" style="color: var(--color-primary); font-weight: 700; text-decoration: underline;">Driver Partner Terms &amp; Safety Policies</a>.';
    }
    if (hint) hint.textContent = 'Partner KYC required — Driver\'s Licence, vehicle inspection, commercial insurance, CRC & VSC.';
    if (submitLabel) submitLabel.textContent = 'Continue as Driver Partner';
  } else if (valid === 'walkshare') {
    if (consent) {
      consent.innerHTML = 'I agree to the <a href="javascript:void(0)" onclick="window.openPipedaConsentModal()" style="color: var(--color-primary); font-weight: 700; text-decoration: underline;">WalkShare Chaperone Terms &amp; Privacy</a>.';
    }
    if (hint) hint.textContent = 'Escort KYC required — Driver\'s Licence, 2 residency proofs (Tax/Tenancy + Utility), CRC, VSC & CPR.';
    if (submitLabel) submitLabel.textContent = 'Continue as WalkShare Escort';
  } else {
    if (consent) {
      consent.innerHTML = 'I agree to the <a href="javascript:void(0)" onclick="window.openPipedaConsentModal()" style="color: var(--color-primary); font-weight: 700; text-decoration: underline;">Terms, Privacy &amp; PIPEDA Consent</a>.';
    }
    if (hint) hint.textContent = 'No upfront verification docs needed — add your children and book rides right away.';
    if (submitLabel) submitLabel.textContent = 'Continue as Parent / Family';
  }
  if (window.lucide) window.lucide.createIcons();
};

/** Single Normal Phone Authentication Submission */
window.handlePhoneAuthSubmit = function () {
  const phone = document.getElementById('authPhoneNumberInput')?.value?.trim() || '(416) 555-0192';
  const role = window.appState._signupRole || 'parent';
  const pipedaChecked = document.getElementById('authPhonePipedaCheck')?.checked;

  if (!pipedaChecked) {
    if (typeof window.showToast === 'function') {
      window.showToast('Please accept the Terms & Privacy to continue', 'error');
    }
    return;
  }

  window.appState.user.phone = phone;
  window.appState.activeRole = role;
  localStorage.setItem('h2s_active_role', role);
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);

  if (typeof window.showToast === 'function') {
    window.showToast(`✓ Sending SMS code to ${phone}...`, 'info');
  }
  window.navigateTo('authOtp');
};

/** OTP verification step routing based on chosen role */
window.continueAfterOtp = function () {
  const role = window.appState._signupRole || window.appState.activeRole || 'parent';
  window.appState.activeRole = role;
  localStorage.setItem('h2s_active_role', role);
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);

  if (role === 'driver') {
    window.appState.driverEntryFromAuth = true;
    if (typeof window.startDriverSignupFlow === 'function') {
      window.startDriverSignupFlow(window.appState.user?.name || 'Tariq Ahmed', window.appState.user?.email || 'tariq.ahmed@example.com');
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Phone verified! Finish Driver partner onboarding', 'success');
    }
    window.navigateTo('driverOnboardProfile');
    return;
  }
  if (role === 'walkshare') {
    window.appState.walkshareEntryFromAuth = true;
    if (typeof window.startWalkShareSignupFlow === 'function') {
      window.startWalkShareSignupFlow(window.appState.user?.name || 'Sarah Jenkins', window.appState.user?.email || 'sarah.jenkins@example.com');
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Phone verified! Finish WalkShare chaperone setup', 'success');
    }
    window.navigateTo('wsOnboardProfile');
    return;
  }
  if (typeof window.showToast === 'function') {
    window.showToast('Phone verified! Set up your family profile', 'success');
  }
  window.navigateTo('authProfile');
};

/** Photo step branches: Parent → child; Driver/WalkShare → partner setup (docs). */
window.continueAuthAfterPhoto = function () {
  const role = window.appState._signupRole || window.appState.activeRole || 'parent';
  window.appState.activeRole = role;
  localStorage.setItem('h2s_active_role', role);
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);
  if (role === 'driver') {
    window.appState.driverEntryFromAuth = true;
    if (typeof window.startDriverSignupFlow === 'function') {
      window.startDriverSignupFlow(window.appState.user?.name, window.appState.user?.email);
    }
    window.navigateTo('driverOnboardProfile');
    return;
  }
  if (role === 'walkshare') {
    window.appState.walkshareEntryFromAuth = true;
    if (typeof window.startWalkShareSignupFlow === 'function') {
      window.startWalkShareSignupFlow(window.appState.user?.name, window.appState.user?.email);
    }
    window.navigateTo('wsOnboardProfile');
    return;
  }
  window.navigateTo('authAddChild');
};

window.handleEmailSignIn = function () {
  const email = document.getElementById('authEmailInput')?.value || 'sadia.khan@example.com';
  window.appState.user.email = email;
  if (typeof window.showToast === 'function') {
    window.showToast('✓ Welcome back! Signed in successfully.', 'success');
  }
  window.navigateTo('home');
};

window.handleEmailSignUp = function () {
  const role = window.appState._signupRole || 'parent';
  const name = document.getElementById('authSignupNameInput')?.value || 'Sadia Khan';
  const email = document.getElementById('authSignupEmailInput')?.value || 'sadia.khan@example.com';
  const pipedaChecked = document.getElementById('authSignupPipedaCheck')?.checked;
  
  if (!pipedaChecked) {
    if (typeof window.showToast === 'function') {
      window.showToast('Please accept the consent terms to continue', 'error');
    }
    return;
  }
  
  window.appState.user.name = name;
  window.appState.user.email = email;
  window.appState.activeRole = role;
  localStorage.setItem('h2s_active_role', role);
  if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);

  if (role === 'driver') {
    window.appState.driverEntryFromAuth = true;
    if (typeof window.startDriverSignupFlow === 'function') {
      window.startDriverSignupFlow(name, email);
    } else if (window.appState.driver) {
      window.appState.driver.name = name;
      window.appState.driver.email = email;
    }
    if (typeof window.showToast === 'function') {
      window.showToast('Driver account created — finish partner setup', 'success');
    }
    window.navigateTo('driverOnboardProfile');
    return;
  }

  if (role === 'walkshare') {
    window.appState.walkshareEntryFromAuth = true;
    if (typeof window.startWalkShareSignupFlow === 'function') {
      window.startWalkShareSignupFlow(name, email);
    } else if (window.appState.walkshare) {
      window.appState.walkshare.name = name;
      window.appState.walkshare.email = email;
    }
    if (typeof window.showToast === 'function') {
      window.showToast('WalkShare account created — finish escort setup', 'success');
    }
    window.navigateTo('wsOnboardProfile');
    return;
  }

  if (typeof window.showToast === 'function') {
    window.showToast('Account created — set up your family', 'success');
  }
  window.navigateTo('authProfile');
};

window.handleSendLoginOtp = function() {
  const phoneInput = document.getElementById('loginPhoneInput');
  let phone = (phoneInput && phoneInput.value.trim()) || '(416) 555-0192';
  if (!phone.startsWith('+1') && !phone.startsWith('+')) {
    phone = '+1 ' + phone;
  }
  
  window.appState.loginPhone = phone;
  window.appState.isLoginFlow = true;
  window.appState.authPrevScreen = 'authLogin';

  // Match demo accounts
  if (phone.includes('0182') || phone.toLowerCase().includes('tariq')) {
    window.appState.activeRole = 'driver';
  } else if (phone.includes('0185') || phone.toLowerCase().includes('sarah')) {
    window.appState.activeRole = 'walkshare';
  }

  // Update target phone text on OTP screen
  const targetPhoneEls = document.querySelectorAll('.target-phone-text, #otpTargetPhoneDisplay');
  targetPhoneEls.forEach(el => {
    el.textContent = phone;
  });

  if (typeof window.showToast === 'function') {
    window.showToast(`✓ 4-digit code sent to ${phone}`, 'success');
  } else if (typeof window.toast === 'function') {
    window.toast(`4-digit code sent to ${phone}`);
  }

  window.navigateTo('authOtp');
};

window.handleOtpInput = function(el, ev, idx) {
  if (el.value.length >= 1) {
    el.classList.add('active');
    const inputs = document.querySelectorAll('#screen-authOtp .otp-box');
    if (inputs[idx + 1]) {
      inputs[idx + 1].focus();
    }
  } else {
    el.classList.remove('active');
  }
};

window.handleOtpKeydown = function(el, ev, idx) {
  if (ev.key === 'Backspace' && !el.value) {
    const inputs = document.querySelectorAll('#screen-authOtp .otp-box');
    if (inputs[idx - 1]) {
      inputs[idx - 1].focus();
    }
  } else if (ev.key === 'Enter') {
    window.continueAfterOtp();
  }
};

window.resendOtpCode = function() {
  const phone = window.appState.loginPhone || '+1 (416) 555-0192';
  if (typeof window.showToast === 'function') {
    window.showToast(`✓ New code sent to ${phone}`, 'info');
  } else if (typeof window.toast === 'function') {
    window.toast(`New code sent to ${phone}`);
  }
};

window.continueAfterOtp = function() {
  if (window.appState.isLoginFlow) {
    const role = window.appState.activeRole || localStorage.getItem('h2s_active_role') || 'parent';
    localStorage.setItem('h2s_active_role', role);
    if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI(role);

    if (typeof window.showToast === 'function') {
      window.showToast('✓ Phone verified! Welcome back.', 'success');
    }

    if (role === 'driver') {
      window.navigateTo('driverHome');
    } else if (role === 'walkshare') {
      window.navigateTo('wsHome');
    } else {
      window.navigateTo('home');
    }
    return;
  }

  // Signup flow
  const role = window.appState._signupRole || window.appState.activeRole || 'parent';
  if (role === 'driver') {
    window.navigateTo('driverOnboardProfile');
  } else if (role === 'walkshare') {
    window.navigateTo('wsOnboardProfile');
  } else {
    window.navigateTo('authProfile');
  }
};

window.handleUserLogin = function() {
  window.handleSendLoginOtp();
};

window.saveNotificationPreferences = function() {
  if (typeof window.showToast === 'function') {
    window.showToast('✓ Notification preferences saved', 'success');
  } else if (typeof window.toast === 'function') {
    window.toast('Notification preferences saved');
  }
  if (typeof window.backNested === 'function') {
    window.backNested('profile');
  } else if (typeof window.navigateTo === 'function') {
    window.navigateTo('profile');
  }
};





/* ==========================================================
   Payment Methods & Billing Modal Handlers
   ========================================================== */
window.openAddPaymentMethodModal = function () {
  const modal = document.getElementById('modal-addPaymentMethod');
  if (modal) {
    modal.classList.add('active');
    modal.style.setProperty('display', 'flex', 'important');
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }
};

window.closeAddPaymentMethodModal = function () {
  const modal = document.getElementById('modal-addPaymentMethod');
  if (modal) {
    modal.classList.remove('active');
    modal.style.setProperty('display', 'none', 'important');
  }
};

window.saveNewPaymentMethod = function (e) {
  if (e) e.preventDefault();
  const name = document.getElementById('newCardName')?.value || 'Cardholder';
  const num = document.getElementById('newCardNumber')?.value || '4242';
  const last4 = num.replace(/\s/g, '').slice(-4) || '1234';
  const exp = document.getElementById('newCardExpiry')?.value || '12/28';

  const isMastercard = num.startsWith('5');
  const brand = isMastercard ? 'Mastercard' : 'Visa';

  if (!window.appState.savedCards) {
    window.appState.savedCards = [];
  }
  window.appState.savedCards.push({
    id: 'card_' + Date.now(),
    brand: brand,
    last4: last4,
    exp: exp,
    name: name,
    isDefault: false
  });

  window.closeAddPaymentMethodModal();
  if (window.showToast) {
    window.showToast(`✓ ${brand} •••• ${last4} added to your payment methods!`, 'success');
  } else {
    alert(`✓ ${brand} •••• ${last4} added successfully.`);
  }
};

window.setDefaultPaymentMethod = function (last4) {
  if (window.showToast) {
    window.showToast(`✓ Card ending in ${last4} set as default for platform billing.`, 'success');
  } else {
    alert(`✓ Card ending in ${last4} set as default.`);
  }
};
