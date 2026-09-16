/* Driver MVP layer. Reuses the live design system and appState.driver. */

(function () {
  const STORE = 'h2s_driver_mvp_v3';
  const AUTH = new Set(['splash', 'onboarding1', 'onboarding2', 'onboarding3', 'authWelcome', 'authOtp', 'authProfile', 'authPhoto', 'authAddChild', 'authSuccess']);
  const SHARED = new Set(['inbox', 'messages', 'notifications', 'faq', 'legal', 'about', 'privacy', 'contactSupport', 'report']);
  const PARENT_ONLY = new Set([
    'home', 'myChildren', 'addChild', 'bookings', 'bookingSelectChildren', 'bookingTripSetup',
    'bookingSearchProviders', 'bookingProviderDetails', 'bookingSummary', 'bookingRequestSent',
    'bookingConfirmed', 'bookingDetails', 'tracking', 'profile', 'profilePersonalInfo',
    'profileEmergency', 'profileLocations', 'profilePayments', 'subscription', 'rating'
  ]);
  const DRIVER_ONLY = new Set([
    'driverHome', 'driverRequests', 'driverSchedule', 'driverActiveTrip', 'driverSetup', 'driverProfile',
    'driverOnboardProfile', 'driverOnboardVehicle', 'driverOnboardDocs', 'driverDocDetail', 'driverOnboardAvailability',
    'driverOnboardRate', 'driverPayment', 'driverPending', 'driverSubscription', 'driverRequestDetail', 'driverTripPrep', 'driverRateParent', 'driverRatings'
  ]);
  const PARENTS = {
    'PRNT-9042': { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Arman, Emma & Zara' },
    sadia: { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Arman, Emma & Zara' },
    'PRNT-2201': { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', sub: 'Parent · Yusuf & Ayla' },
    'PRNT-3310': { id: 'PRNT-3310', name: 'Priya Patel', photo: '/assets/avatar_farhana.jpg', sub: 'Parent · Riya' },
    'PRNT-1188': { id: 'PRNT-1188', name: 'Marcus Chen', photo: '/assets/avatar_john.png', sub: 'Parent · Leo & Mia' },
    'PRNT-5520': { id: 'PRNT-5520', name: 'Amira Hassan', photo: '/assets/avatar_sarah.jpg', sub: 'Parent · Omar' }
  };
  const DEMO_INBOX = [
    { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', preview: 'Arman and Emma will be at the porch at 07:28.', time: '07:28 AM', unread: 2 },
    { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', preview: 'Can you confirm booster seats for both kids tomorrow?', time: 'Yesterday', unread: 1 },
    { id: 'PRNT-3310', name: 'Priya Patel', photo: '/assets/avatar_farhana.jpg', preview: 'Riya has her epi-pen in the front pocket.', time: 'Mon', unread: 1 },
    { id: 'PRNT-1188', name: 'Marcus Chen', photo: '/assets/avatar_john.png', preview: 'Thanks for accepting — curb pickup works great.', time: 'Sun', unread: 0 },
    { id: 'PRNT-5520', name: 'Amira Hassan', photo: '/assets/avatar_sarah.jpg', preview: 'Understood about the route distance. Thanks anyway.', time: 'Sat', unread: 0 }
  ];
  const DEMO_CHATS = {
    'PRNT-9042': [
      { type: 'provider', text: 'Sadia here — Arman and Emma will be at the porch with backpacks.', time: '07:25 AM' },
      { type: 'parent', text: 'Thanks. I’m on the way in the Sienna — about 4 minutes out.', time: '07:26 AM' },
      { type: 'system', text: 'Driver arrived at Home (12 Elm Street) · 07:30 AM', tone: 'amber' },
      { type: 'provider', text: 'Perfect timing. Emma forgot her water bottle — I’ll bring the spare from yesterday.', time: '07:31 AM' },
      { type: 'parent', text: 'Got both buckled. Heading to Greenfield now.', time: '07:33 AM' },
      { type: 'provider', text: 'Thank you Tariq — please text when you reach the loop.', time: '07:34 AM' }
    ],
    'PRNT-2201': [
      { type: 'system', text: 'Chat about Yusuf & Ayla · Greenfield commute' },
      { type: 'provider', text: 'Hi Tariq — requesting Mon–Fri for Yusuf (Gr 3) and Ayla (Gr 1).', time: 'Mon 6:12 PM' },
      { type: 'parent', text: 'Happy to review. Booster for Yusuf — noted.', time: 'Mon 6:18 PM' },
      { type: 'provider', text: 'Can you confirm booster seats for both kids tomorrow?', time: 'Yesterday 8:40 PM' },
      { type: 'parent', text: 'Yes — both boosters stay in the Sienna. Pickup at 18 Maple.', time: 'Yesterday 8:44 PM' },
      { type: 'provider', text: 'Great. Hand-off is to the west loop supervisor.', time: 'Yesterday 8:46 PM' }
    ],
    'PRNT-3310': [
      { type: 'system', text: 'One-time afternoon pickup · Fri Sep 18' },
      { type: 'provider', text: 'Hi — need a school pickup for Riya at 02:50 PM Friday.', time: 'Tue 1:05 PM' },
      { type: 'parent', text: 'I can take that. Drop at 42 Birchwood — wait for porch light?', time: 'Tue 1:12 PM' },
      { type: 'provider', text: 'Yes please. Riya has her epi-pen in the front pocket.', time: 'Tue 1:14 PM' },
      { type: 'parent', text: 'Noted and saved on the trip card.', time: 'Tue 1:15 PM' }
    ],
    'PRNT-1188': [
      { type: 'system', text: 'Accepted · Mon/Wed/Fri mornings' },
      { type: 'provider', text: 'Thanks for accepting — curb pickup works great for Leo and Mia.', time: 'Sun 4:02 PM' },
      { type: 'parent', text: 'Glad it works. I’ll be there by 07:15.', time: 'Sun 4:05 PM' },
      { type: 'provider', text: 'Mia sometimes needs an extra minute with her jacket.', time: 'Sun 4:08 PM' },
      { type: 'parent', text: 'No rush — I’ll wait at the curb.', time: 'Sun 4:09 PM' }
    ],
    'PRNT-5520': [
      { type: 'system', text: 'Request declined · outside service corridor' },
      { type: 'provider', text: 'Hi Tariq, following up on the Rosedale route.', time: 'Sat 10:20 AM' },
      { type: 'parent', text: 'That corridor is too far from my Greenfield runs — sorry I can’t take it.', time: 'Sat 10:31 AM' },
      { type: 'provider', text: 'Understood about the route distance. Thanks anyway.', time: 'Sat 10:33 AM' }
    ]
  };
  const TRIP_STAGES = [
    { key: 0, chip: 'Confirmed', cta: "I'm on the way", parentSync: 0, progress: 8, pin: { left: '19%', top: '74%' } },
    { key: 1, chip: 'On the way', cta: 'Arrived at pickup', parentSync: 1, progress: 22, pin: { left: '19%', top: '58%' } },
    { key: 2, chip: 'At pickup', cta: 'Confirm child pickup', attendance: true, parentSync: 1, progress: 34, pin: { left: '19%', top: '36%' } },
    { key: 3, chip: 'En route', cta: 'Arrived at destination', parentSync: 2, progress: 58, pin: { left: '48%', top: '24%' } },
    { key: 4, chip: 'At destination', cta: 'Confirm drop-off', parentSync: 3, progress: 78, pin: { left: '78%', top: '28%' } },
    { key: 5, chip: 'Drop-off', cta: 'Complete trip', parentSync: 4, progress: 92, pin: { left: '80%', top: '48%' } }
  ];

  let restored = false;

  function state() {
    return window.appState || {};
  }

  function toast(message, type) {
    if (window.showToast) window.showToast(message, type || 'info');
  }

  function icons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function persist() {
    const d = state().driver;
    if (!d) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: d.name,
        phone: d.phone,
        email: d.email,
        photo: d.photo,
        photoName: d.photoName,
        serviceArea: d.serviceArea,
        verificationStatus: d.verificationStatus,
        onboarding: d.onboarding,
        vehicle: d.vehicle,
        documents: d.documents,
        docsIdentitySeeded: d.docsIdentitySeeded,
        availability: d.availability,
        rate: d.rate,
        subscription: d.subscription,
        requests: d.requests,
        schedule: d.schedule,
        activeTrip: d.activeTrip,
        activeTripStage: d.activeTripStage,
        isOnline: d.isOnline,
        skipDemoUnlock: !!d.skipDemoUnlock,
        homeScenario: d.homeScenario,
        notifications: d.notifications
      }));
    } catch (err) { /* ignore quota */ }
  }

  const PROVINCES = ['Ontario', 'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador', 'Nova Scotia', 'Prince Edward Island', 'Quebec', 'Saskatchewan'];
  const LICENCE_CLASSES = ['G', 'G2', 'G1', 'A', 'B', 'C', 'D', 'E', 'F', 'M'];
  const REQUIRED_DOCS = [
    { id: 'licence', title: "Driver's Licence" },
    { id: 'insurance', title: 'Vehicle Insurance' },
    { id: 'registration', title: 'Vehicle Registration' },
    { id: 'criminal', title: 'Criminal Background Check' },
    { id: 'vulnerable', title: 'Vulnerable Sector Check' }
  ];

  function emptyUpload() {
    return { name: '', attached: false, preview: '' };
  }

  function asUpload(value) {
    if (value && typeof value === 'object') {
      return {
        name: value.name || '',
        attached: !!(value.attached || value.name || value.preview),
        preview: value.preview || ''
      };
    }
    if (typeof value === 'string' && value.trim()) {
      return { name: value.trim(), attached: true, preview: '' };
    }
    return emptyUpload();
  }

  function hasUpload(file) {
    return !!(file && (file.attached || file.name || file.preview));
  }

  function demoUpload(name) {
    return { name: name, attached: true, preview: '' };
  }

  function demoDocuments() {
    return {
      licence: {
        number: 'A8472-19305-66120',
        class: 'G',
        province: 'Ontario',
        expiry: '2028-06-14',
        fileFront: demoUpload('licence-front.jpg'),
        fileBack: demoUpload('licence-back.jpg'),
        status: 'approved',
        rejectReason: ''
      },
      insurance: {
        insurer: 'Intact Insurance',
        policyNumber: 'ON-884291-SIENNA',
        expiry: '2027-03-31',
        fileDoc: demoUpload('insurance-pink-slip.pdf'),
        status: 'approved',
        rejectReason: ''
      },
      registration: {
        plate: 'SCH-4091',
        vin: '5TDKRKEC8PS084091',
        expiry: '2027-08-31',
        fileDoc: demoUpload('ontario-ownership.pdf'),
        status: 'approved',
        rejectReason: ''
      },
      criminal: {
        issuer: 'Toronto Police Service',
        issueDate: '2026-07-12',
        expiry: '2029-07-12',
        fileDoc: demoUpload('crc-tariq-ahmed.pdf'),
        status: 'approved',
        rejectReason: ''
      },
      vulnerable: {
        issuer: 'Toronto Police Service',
        issueDate: '2026-07-12',
        expiry: '2029-07-12',
        fileDoc: demoUpload('vsc-tariq-ahmed.pdf'),
        status: 'approved',
        rejectReason: ''
      }
    };
  }

  function docHasIdentityFields(doc) {
    if (!doc || typeof doc !== 'object') return false;
    const text = ['number', 'class', 'province', 'expiry', 'insurer', 'policyNumber', 'plate', 'vin', 'issuer', 'issueDate'];
    if (text.some((key) => String(doc[key] || '').trim())) return true;
    return hasUpload(doc.fileFront) || hasUpload(doc.fileBack) || hasUpload(doc.fileDoc);
  }

  function pickDocFields(source) {
    const src = source || {};
    return {
      number: src.number || '',
      class: src.class || '',
      province: src.province || '',
      expiry: src.expiry || '',
      insurer: src.insurer || '',
      policyNumber: src.policyNumber || '',
      plate: src.plate || '',
      vin: src.vin || '',
      issuer: src.issuer || '',
      issueDate: src.issueDate || '',
      fileFront: asUpload(src.fileFront),
      fileBack: asUpload(src.fileBack),
      fileDoc: asUpload(src.fileDoc || src.fileName)
    };
  }

  function normalizeDocuments(docs, opts) {
    const list = Array.isArray(docs) ? docs : [];
    const demo = demoDocuments();
    const useDemo = !opts?.seeded && (list.length === 0 || list.every((doc) => !docHasIdentityFields(doc)));
    return REQUIRED_DOCS.map((spec) => {
      const existing = list.find((doc) => doc.id === spec.id) || {};
      const fields = useDemo ? pickDocFields(demo[spec.id]) : pickDocFields(existing);
      const statusSource = useDemo ? demo[spec.id] : existing;
      return Object.assign({
        id: spec.id,
        title: spec.title,
        status: statusSource.status || 'not_submitted',
        rejectReason: statusSource.rejectReason || existing.rejectReason || ''
      }, fields);
    });
  }

  function ensureDriver() {
    const d = state().driver;
    if (!d) return {};
    if (!d.onboarding) d.onboarding = { profile: false, vehicle: false, docs: false, availability: false, rate: false };
    if (!Array.isArray(d.documents)) d.documents = [];
    if (!d.availability) d.availability = {};
    if (!d.rate) d.rate = { amount: 120, period: 'week', negotiable: true, paymentMethod: 'Interac e-Transfer', paymentHandle: '' };
    if (!d.rate.paymentHandle) d.rate.paymentHandle = d.email || '';
    if (!d.subscription) d.subscription = { status: 'none', plan: 'monthly', priceMonthly: 29, priceAnnual: 279, trialDaysLeft: 14, history: [] };
    if (!d.vehicle) d.vehicle = { type: 'Minivan', make: 'Toyota', model: 'Sienna', year: '2023', color: 'Celestial Silver', plate: 'SCH-4091', capacity: 4, photo: '/assets/home_van_banner.jpg' };
    if (d.vehicle && (!d.vehicle.photo || /sienna\.jpg$/i.test(d.vehicle.photo))) {
      d.vehicle.photo = '/assets/home_van_banner.jpg';
    }
    if (!Array.isArray(d.requests)) d.requests = [];
    if (!Array.isArray(d.notifications)) d.notifications = [];
    d.requests.forEach(normalizeRequest);
    if (!restored) {
      restored = true;
      try {
        const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
        if (saved && typeof saved === 'object') {
          ['name', 'phone', 'email', 'photo', 'serviceArea', 'verificationStatus', 'isOnline', 'homeScenario', 'activeTripStage', 'skipDemoUnlock'].forEach((key) => {
            if (saved[key] !== undefined) d[key] = saved[key];
          });
          ['onboarding', 'vehicle', 'availability', 'rate', 'subscription', 'activeTrip'].forEach((key) => {
            if (saved[key]) d[key] = saved[key];
          });
          if (saved.docsIdentitySeeded) d.docsIdentitySeeded = true;
          if (saved.photoName) d.photoName = saved.photoName;
          if (Array.isArray(saved.documents)) d.documents = saved.documents;
          if (Array.isArray(saved.requests)) d.requests = saved.requests.map(normalizeRequest);
          if (Array.isArray(saved.schedule)) d.schedule = saved.schedule;
          if (Array.isArray(saved.notifications)) d.notifications = saved.notifications;
        }
      } catch (err) { /* ignore */ }
    }
    mergeDemoRequests(d);
    mergeDemoNotifications(d);
    const wasSeeded = !!d.docsIdentitySeeded;
    d.documents = normalizeDocuments(d.documents, { seeded: wasSeeded });
    d.docsIdentitySeeded = true;
    const unlocked = d.skipDemoUnlock ? false : unlockPartnerForDemo(d);
    if (!wasSeeded || unlocked) persist();
    normalizeAvailability(d);
    syncTariqProviderAvailability();
    return d;
  }

  /** Keep the demo driver accept-ready even if older localStorage had pending docs. */
  function unlockPartnerForDemo(d) {
    if (!d || typeof d !== 'object' || d.skipDemoUnlock) return false;
    let changed = false;
    (d.documents || []).forEach((doc) => {
      if (!doc) return;
      if (doc.status !== 'approved') {
        doc.status = 'approved';
        changed = true;
      }
      if (doc.id === 'vulnerable' || doc.id === 'criminal') {
        if (!doc.issuer) { doc.issuer = 'Toronto Police Service'; changed = true; }
        if (!doc.issueDate) { doc.issueDate = '2026-07-12'; changed = true; }
        if (!doc.expiry) { doc.expiry = '2029-07-12'; changed = true; }
        if (!hasUpload(doc.fileDoc)) {
          doc.fileDoc = demoUpload(`${doc.id}-tariq-ahmed.pdf`);
          changed = true;
        }
      }
    });
    if (!isApproved(d)) {
      d.verificationStatus = 'approved';
      changed = true;
    }
    if (!d.subscription || typeof d.subscription !== 'object') {
      d.subscription = { status: 'trial', plan: 'monthly', priceMonthly: 29, priceAnnual: 279, trialDaysLeft: 14, history: [] };
      changed = true;
    }
    if (d.subscription.status !== 'trial' && d.subscription.status !== 'active') {
      d.subscription.status = 'trial';
      d.subscription.trialDaysLeft = d.subscription.trialDaysLeft || 14;
      changed = true;
    }
    if (!d.onboarding) d.onboarding = {};
    ['profile', 'vehicle', 'docs', 'availability', 'rate'].forEach((k) => {
      if (!d.onboarding[k]) {
        d.onboarding[k] = true;
        changed = true;
      }
    });
    return changed;
  }

  function defaultAvailWindows() {
    return [
      { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '06:30', end: '09:00', label: 'Morning', enabled: true },
      { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '13:00', end: '16:30', label: 'Afternoon', enabled: true }
    ];
  }

  function mergeAvailWindow(base, extra) {
    const w = Object.assign({}, base, extra && typeof extra === 'object' ? extra : {});
    w.id = w.id || base.id;
    w.label = base.label;
    w.start = w.start || base.start;
    w.end = w.end || base.end;
    w.days = Array.isArray(w.days) && w.days.length ? w.days : base.days.slice();
    w.enabled = w.enabled !== false;
    return w;
  }

  function normalizeAvailability(d) {
    if (!d || typeof d !== 'object') return;
    if (!d.availability || typeof d.availability !== 'object') d.availability = {};
    const a = d.availability;
    const existing = Array.isArray(a.windows) ? a.windows : [];
    const defaults = defaultAvailWindows();
    a.windows = [mergeAvailWindow(defaults[0], existing[0]), mergeAvailWindow(defaults[1], existing[1])];
    a.exceptions = Array.isArray(a.exceptions) ? a.exceptions.filter(Boolean) : [];
    a.weekly = Array.isArray(a.weekly) && a.weekly.length ? a.weekly : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    a.morningSlot = a.windows[0].enabled ? formatWindow(a.windows[0]) : '';
    a.afternoonSlot = a.windows[1].enabled ? formatWindow(a.windows[1]) : '';
  }

  function availSummary(a) {
    const w = (a && a.windows) || [];
    const bits = [];
    if (w[0] && w[0].enabled !== false) bits.push(formatWindow(w[0]));
    if (w[1] && w[1].enabled !== false) bits.push(formatWindow(w[1]));
    return bits.length ? ('Mon–Fri · ' + bits.join(' · ')) : 'Set weekly hours';
  }

  function normalizeRequest(req) {
    if (!req) return req;
    if (typeof req.children?.[0] === 'string') {
      req.children = req.children.map((label, i) => ({
        id: 'c' + i,
        name: String(label).split(' (')[0],
        age: '',
        grade: '',
        notes: '',
        photo: '/assets/avatar_arman.jpg'
      }));
    }
    req.pickupLocation = req.pickupLocation || req.routeFrom || '';
    req.dropoffLocation = req.dropoffLocation || req.routeTo || '';
    req.rateLabel = req.rateLabel || req.price || '';
    req.childNamesShort = req.childNamesShort || childShort(req);
    return req;
  }

  function mergeDemoRequests(d) {
    if (!Array.isArray(d.requests)) d.requests = [];
    const have = new Set(d.requests.map((r) => r.id));
    DEMO_REQUEST_PACK.forEach((seed) => {
      if (!seed?.id || have.has(seed.id)) return;
      d.requests.push(normalizeRequest(JSON.parse(JSON.stringify(seed))));
      have.add(seed.id);
    });
  }

  const DEMO_REQUEST_PACK = [
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
      dateLabel: 'Starts Mon, Sep 14, 2026',
      pickupTime: '07:45 AM',
      returnTime: '03:10 PM',
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      frequency: 'recurring',
      direction: 'bothway',
      rate: 120,
      rateLabel: '$120 / week',
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
      pickupLocation: '12 Elm Street',
      dropoffLocation: 'Sunshine Pre-school',
      dateLabel: 'Thursday, Sep 17, 2026',
      pickupTime: '08:15 AM',
      returnTime: '01:30 PM',
      recurringDays: [],
      frequency: 'onetime',
      direction: 'bothway',
      rate: 45,
      rateLabel: '$45 / day',
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
      dateLabel: 'Friday, Sep 18, 2026',
      pickupTime: '02:50 PM',
      returnTime: '',
      recurringDays: [],
      frequency: 'onetime',
      direction: 'oneway',
      rate: 28,
      rateLabel: '$28 / day',
      notes: 'One-way afternoon only. Wait until porch light is on.',
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
      dateLabel: 'Starts Mon, Sep 7, 2026',
      pickupTime: '07:20 AM',
      returnTime: '',
      recurringDays: ['Mon', 'Wed', 'Fri'],
      frequency: 'recurring',
      direction: 'oneway',
      rate: 85,
      rateLabel: '$85 / week',
      notes: 'Morning-only curb pickup.',
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
      dateLabel: 'Mon–Fri starting Sep 21',
      pickupTime: '08:05 AM',
      returnTime: '03:40 PM',
      recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      frequency: 'recurring',
      direction: 'bothway',
      rate: 110,
      rateLabel: '$110 / week',
      notes: 'Outside usual Greenfield corridor.',
      status: 'declined'
    }
  ];

  function mergeDemoNotifications(d) {
    const pack = [
      { id: 'dn-1', title: 'New ride request', body: 'Nadia Rahman requested a Mon–Fri school commute for Yusuf and Ayla.', time: '12 min ago', unread: true, action: 'requests' },
      { id: 'dn-2', title: 'New ride request', body: 'Priya Patel asked for a one-time afternoon pickup for Riya.', time: '28 min ago', unread: true, action: 'requests' },
      { id: 'dn-3', title: 'Message from parent', body: 'Sadia: Arman and Emma will be at the porch at 07:28.', time: '1 hr ago', unread: true, action: 'inbox' },
      { id: 'dn-4', title: 'Message from Nadia', body: 'Can you confirm booster seats for both kids tomorrow?', time: 'Yesterday', unread: true, action: 'inbox' },
      { id: 'dn-5', title: 'Booking accepted', body: 'You accepted Marcus Chen’s Mon–Wed morning commute.', time: '2 days ago', unread: false, action: 'requests' },
      { id: 'dn-6', title: 'Trip reminder', body: 'Morning pickup for Arman & Emma starts in 25 minutes.', time: 'Tue', unread: false, action: 'inbox' }
    ];
    if (!Array.isArray(d.notifications)) d.notifications = [];
    const have = new Set(d.notifications.map((n) => n.id));
    pack.forEach((n) => {
      if (!have.has(n.id)) d.notifications.push(n);
    });
  }

  function kids(req) {
    return Array.isArray(req?.children) ? req.children.filter(Boolean) : [];
  }

  function childShort(req) {
    const names = kids(req).map((c) => String(c.name || c).split(' ')[0]);
    return names.join(' + ') || req?.childNamesShort || 'Children';
  }

  function cleanPlace(value) {
    let s = String(value || '').trim();
    if (!s) return '';
    s = s.replace(/^(Home|School|Pickup|Drop-?off|Meetup|Meeting point)\s*[:(–-]\s*/i, '');
    s = s.replace(/\)\s*$/, '').trim();
    return s || String(value || '').trim();
  }

  function formatCardDate(req) {
    if (req.frequency === 'recurring') return compactDays(req.recurringDays);
    const raw = String(req.dateLabel || '').replace(/^Starts\s+/i, '').replace(/\s*[·•].*$/, '').trim();
    const withYear = /\d{4}/.test(raw) ? raw : `${raw} 2026`;
    const parsed = Date.parse(withYear);
    if (!Number.isNaN(parsed)) {
      return new Date(parsed).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
    }
    return dateShort(raw)
      .replace(/\b(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/gi, (m) => m.slice(0, 3))
      || 'Date TBD';
  }

  function scheduleMetaLine(req) {
    return [formatCardDate(req), timeLineCard(req)].filter(Boolean).join(' · ');
  }

  function cardMetaLine(req) {
    const kind = req.frequency === 'recurring' ? 'Recurring' : 'One-time';
    return `${kind} · ${seatsLabel(req.seatsNeeded)}`;
  }

  function childLine(req) {
    return kids(req).map((c) => c.name + (c.age ? ` (${c.age})` : '')).join(' · ') || childShort(req);
  }

  function gradeChip(c) {
    const g = String(c?.grade || '').trim();
    if (g) {
      const n = g.match(/(\d+)/);
      if (n) return `Gr ${n[1]}`;
      return g.replace(/^Grade\s+/i, 'Gr ');
    }
    return String(c?.age || '').trim();
  }

  function childScanLine(req) {
    const list = kids(req);
    if (!list.length) return childShort(req);
    return list.map((c) => {
      const first = String(c.name || '').split(' ')[0] || 'Child';
      const extra = gradeChip(c);
      return extra ? `${first} (${extra})` : first;
    }).join(' • ');
  }

  function dateShort(label) {
    let text = String(label || '').replace(/,?\s*\d{4}\s*$/, '').trim();
    // Strip any times already embedded so list meta stays one clean line.
    text = text
      .replace(/\s*[·•|].*$/, '')
      .replace(/\s+\d{1,2}:\d{2}\s*(AM|PM).*$/i, '')
      .replace(/^Starts\s+/i, '')
      .trim();
    return text;
  }

  function compactDays(days) {
    const list = Array.isArray(days) ? days.filter(Boolean) : [];
    if (!list.length) return 'Mon–Fri';
    if (list.length === 5 && list[0] === 'Mon' && list[4] === 'Fri') return 'Mon–Fri';
    return list.join(', ');
  }

  function timeLine(req) {
    const pickup = req.pickupTime || '';
    if (req.direction === 'oneway' || !req.returnTime) return pickup;
    return `${pickup} · ${req.returnTime}`;
  }

  function timeLineCard(req) {
    const pickup = req.pickupTime || '';
    if (req.direction === 'oneway' || !req.returnTime) return pickup;
    return `${pickup} & ${req.returnTime}`;
  }

  function dateLineCard(req) {
    if (req.frequency === 'recurring') return compactDays(req.recurringDays);
    return dateShort(req.dateLabel) || 'Select date';
  }

  function parentInitials(name) {
    const parts = String(name || 'P').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return 'P';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function avatarTone(name) {
    const tones = ['rose', 'mint', 'sky', 'sand'];
    let hash = 0;
    String(name || '').split('').forEach((ch) => { hash = (hash + ch.charCodeAt(0)) % tones.length; });
    return tones[hash];
  }

  function metaLine(req) {
    const parts = [];
    if (req.frequency === 'recurring') {
      parts.push(compactDays(req.recurringDays));
    } else {
      const date = dateShort(req.dateLabel);
      if (date) parts.push(date);
    }
    const times = timeLine(req);
    if (times) parts.push(times);
    return parts.join(' · ');
  }

  function tripKindLabel(req) {
    if (req.frequency === 'recurring') return 'Recurring';
    if (req.direction === 'oneway') return 'One way';
    return 'Round trip';
  }

  function seatsLabel(n) {
    const seats = Number(n) || 0;
    return seats === 1 ? '1 child' : `${seats || 1} children`;
  }

  function routeLine(req) {
    return `${req.pickupLocation || ''} → ${req.dropoffLocation || ''}`.replace(/^\s*→\s*|\s*→\s*$/g, '');
  }

  function docShortTitle(id) {
    return { licence: 'Licence', insurance: 'Insurance', registration: 'Registration', criminal: 'CBC', vulnerable: 'Vulnerable Sector' }[id] || id;
  }

  function missingRequiredDocs(d) {
    const docs = Array.isArray(d?.documents) ? d.documents : [];
    return REQUIRED_DOCS.filter((spec) => {
      const doc = docs.find((item) => item.id === spec.id);
      return !doc || doc.status !== 'approved';
    });
  }

  function docsApproved(d) {
    return missingRequiredDocs(d).length === 0;
  }

  function acceptBlockReason(d) {
    const missing = missingRequiredDocs(d);
    if (missing.length) return `Approve docs first: ${missing.map((spec) => docShortTitle(spec.id)).join(', ')}`;
    if (!isApproved(d)) return 'Account not approved yet';
    if (!hasAccess(d)) return 'Start trial or subscribe first';
    return '';
  }

  function requestCapacityBlock(d, req) {
    if (!req) return '';
    const seats = Number(req.seatsNeeded) || (Array.isArray(req.children) ? req.children.length : 1) || 1;
    const cap = Number(d.vehicle?.capacity) || 0;
    if (seats > cap) return `Need ${seats} seats — vehicle has ${cap}`;
    const pickup = req.pickupTime || '';
    if (pickup) {
      const used = seatsBookedAt(pickup, req.id);
      if (used + seats > cap) return `Only ${Math.max(0, cap - used)} seat(s) free at ${pickup}`;
    }
    const ret = req.returnTime || '';
    if (ret && req.direction !== 'oneway') {
      const usedR = seatsBookedAt(ret, req.id);
      if (usedR + seats > cap) return `Only ${Math.max(0, cap - usedR)} seat(s) free at ${ret}`;
    }
    return '';
  }

  function onboardingDone(d) {
    const o = d.onboarding || {};
    return o.profile && o.vehicle && o.docs && o.availability && o.rate;
  }

  function hasAccess(d) {
    return d.subscription && (d.subscription.status === 'trial' || d.subscription.status === 'active');
  }

  function isApproved(d) {
    return d.verificationStatus === 'approved' || d.verificationStatus === 'verified';
  }

  window.startDriverSignupFlow = function (name, email) {
    if (!state().driver) state().driver = { onboarding: {}, documents: [], vehicle: {}, availability: {}, rate: {}, subscription: {} };
    state().driver.skipDemoUnlock = true;
    const d = ensureDriver();
    d.name = name || d.name || 'New Driver';
    d.email = email || d.email || '';
    d.phone = d.phone || '';
    d.verificationStatus = 'pending';
    d.isOnline = false;
    d.skipDemoUnlock = true;
    d.onboarding = { profile: false, vehicle: false, docs: false, availability: false, rate: false };
    d.documents = REQUIRED_DOCS.map((spec) => ({
      id: spec.id,
      title: spec.title,
      status: 'not_submitted',
      rejectReason: '',
      number: '',
      class: '',
      province: 'Ontario',
      expiry: '',
      insurer: '',
      policyNumber: '',
      plate: '',
      vin: '',
      issuer: '',
      issueDate: '',
      fileFront: emptyUpload(),
      fileBack: emptyUpload(),
      fileDoc: emptyUpload()
    }));
    d.docsIdentitySeeded = true;
    d.subscription = d.subscription || { status: 'trial', plan: 'monthly', priceMonthly: 29, priceAnnual: 279, trialDaysLeft: 14, history: [] };
    d.subscription.status = 'trial';
    persist();
    return d;
  };

  function syncDriverOnlineUi(d) {
    const online = !!d.isOnline && isApproved(d);
    const chip = document.getElementById('driverOnlineChip');
    const label = document.getElementById('driverOnlineLabel');
    if (chip) {
      chip.classList.toggle('is-online', online);
      chip.classList.toggle('is-offline', !online);
      chip.disabled = !isApproved(d);
      chip.title = isApproved(d) ? (online ? 'Go offline' : 'Go online') : 'Finish verification first';
    }
    if (label) label.textContent = online ? 'Online' : 'Offline';
    const toggle = document.getElementById('driverOnlineToggle');
    if (toggle) {
      toggle.checked = online;
      toggle.disabled = !isApproved(d);
    }
    const sub = document.getElementById('driverOnlineSub');
    if (sub) {
      sub.textContent = !isApproved(d)
        ? 'Available after verification'
        : (online ? 'Accepting new requests' : 'Hidden from new requests');
    }
  }

  window.setDriverOnlineStatus = function (on) {
    const d = ensureDriver();
    if (!isApproved(d)) {
      toast('Finish verification before going online', 'error');
      syncDriverOnlineUi(d);
      return;
    }
    d.isOnline = !!on;
    persist();
    syncTariqProviderAvailability();
    syncDriverOnlineUi(d);
    toast(d.isOnline ? 'You are online' : 'You are offline');
  };

  window.toggleDriverOnline = function () {
    const d = ensureDriver();
    window.setDriverOnlineStatus(!d.isOnline);
  };

  function partnerOnlineRow(idPrefix, checked, disabled, onChangeFn) {
    return `<div class="partner-status-row profile-menu-item" style="cursor:default;">
      <div class="partner-status-copy">
        <span class="partner-status-title">Online status</span>
        <span class="partner-status-sub" id="${idPrefix}OnlineSub">${disabled ? 'Available after verification' : (checked ? 'Accepting new requests' : 'Hidden from new requests')}</span>
      </div>
      <label class="partner-status-switch" onclick="event.stopPropagation()">
        <input type="checkbox" id="${idPrefix}OnlineToggle" ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''} onchange="${onChangeFn}" />
        <span class="partner-status-slider"></span>
      </label>
    </div>`;
  }

  window.getDriverLanding = function () {
    const d = ensureDriver();
    if (!hasAccess(d)) {
      d.subscription = d.subscription || {};
      d.subscription.status = 'trial';
      d.subscription.trialDaysLeft = d.subscription.trialDaysLeft || 14;
      persist();
    }
    return 'driverHome';
  };

  function ensureDriverRole() {
    state().activeRole = 'driver';
    localStorage.setItem('h2s_active_role', 'driver');
    document.body.setAttribute('data-role', 'driver');
    const shell = document.getElementById('appShell');
    if (shell) shell.setAttribute('data-role', 'driver');
    if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('driver');
  }

  function isDriverPartnerFlowScreen(name) {
    return name === 'driverDocDetail'
      || name === 'driverSetup'
      || name === 'driverPending'
      || String(name || '').indexOf('driverOnboard') === 0;
  }

  function resolveScreen(name) {
    const role = state().activeRole || 'parent';
    if (AUTH.has(name)) return name;
    // Never bounce signup/doc-detail to parent home when role lagged on parent.
    if (isDriverPartnerFlowScreen(name)) {
      if (role !== 'driver') ensureDriverRole();
      return name;
    }
    if (role === 'parent' && DRIVER_ONLY.has(name)) return 'home';
    if (role !== 'driver') return name;
    if (name === 'tracking') {
      return ensureDriver().activeTripStage > 0 ? 'driverActiveTrip' : 'driverHome';
    }
    if (name === 'profile' || name === 'profilePersonalInfo') return 'driverProfile';
    if (name === 'subscription' || name === 'profilePayments') return 'driverSubscription';
    if (name === 'home') return 'driverHome';
    if (name === 'bookings') return 'driverSchedule';
    return name;
  }

  function statusBar() {
    return `<div class="status-bar dark"><span class="sb-time">9:41</span><div class="sb-icons"><span class="signal-bars"><i></i><i></i><i></i><i></i></span><div class="battery-icon"><div class="battery-level"></div></div></div></div>`;
  }

  function topBar(title, back) {
    return `<div class="top-bar-sticky"><button type="button" class="back-btn" onclick="${back}"><i data-lucide="chevron-left"></i></button><h2 class="top-bar-title">${title}</h2><span style="width:26px;"></span></div>`;
  }

  function injectScreens() {
    const shell = document.getElementById('appShell');
    if (!shell) return;
    const screens = [
      ['driverOnboardProfile', 'Your profile', "leaveDriverGate()"],
      ['driverOnboardVehicle', 'Your vehicle', "navigateTo('driverOnboardProfile')"],
      ['driverOnboardDocs', 'Documents', "navigateTo('driverOnboardVehicle')"],
      ['driverDocDetail', 'Document', "navigateTo('driverOnboardDocs')"],
      ['driverOnboardAvailability', 'Availability', "navigateTo('driverOnboardDocs')"],
      ['driverOnboardRate', 'Posted rate', "navigateTo('driverOnboardAvailability')"],
      ['driverPayment', 'Payment preference', "backNested('driverProfile')"],
      ['driverPending', 'Verification', "navigateTo('driverSetup')"],
      ['driverSubscription', 'Platform access', "backNested('driverProfile')"],
      ['driverRequestDetail', 'Request', "navigateTo('driverRequests')"],
      ['driverTripPrep', 'Next trip', "navigateTo('driverSchedule')"],
      ['driverRateParent', 'Rate parent', "navigateTo('driverHome')"],
      ['driverRatings', 'Your ratings', "backNested('driverProfile')"]
    ];
    screens.forEach(([id, title, back]) => {
      if (document.getElementById('screen-' + id)) return;
      const section = document.createElement('section');
      section.className = 'screen-view';
      section.id = 'screen-' + id;
      section.style.backgroundColor = '#FFFFFF';
      const extra = id === 'driverSubscription' ? ' sub-screen-body' : '';
      section.innerHTML = `${statusBar()}${topBar(title, back)}<div class="screen-scroll-body${extra}" id="${id}Feed"></div><div class="home-indicator"></div>`;
      shell.appendChild(section);
    });
  }

  function syncPills() {
    const role = state().activeRole || 'parent';
    if (typeof window.syncRoleCapsuleUI === 'function') {
      window.syncRoleCapsuleUI(role);
    }
  }

  let parentChatHtml = null;

  function applyRoleChrome() {
    const role = state().activeRole || 'parent';
    const shell = document.getElementById('appShell');
    if (shell) shell.setAttribute('data-role', role);
    document.body.setAttribute('data-role', role);
    syncPills();
    syncSharedChrome();
    if (role !== 'driver') {
      const stream = document.getElementById('chatStream');
      if (stream && parentChatHtml !== null) {
        stream.innerHTML = parentChatHtml;
        delete stream.dataset.driverPainted;
        parentChatHtml = null;
      }
      const header = document.getElementById('chatHeaderProfileBtn');
      if (header) {
        header.style.cursor = 'pointer';
        header.setAttribute('onclick', "openDriverProfile(window.activeChatProviderId || 'tariq', 'messages')");
      }
      const nameEl = document.getElementById('chatDriverName');
      const chev = nameEl?.querySelector('i, svg');
      if (chev) chev.style.display = '';
    }
  }

  function syncSharedChrome() {
    const role = state().activeRole || 'parent';
    const parentNav = document.getElementById('inboxParentNav');
    const driverNav = document.getElementById('inboxDriverNav');
    const walkNav = document.getElementById('inboxWalkNav');
    const back = document.getElementById('inboxBackBtn');
    if (parentNav) parentNav.style.display = role === 'parent' ? '' : 'none';
    if (driverNav) driverNav.style.display = role === 'driver' ? 'flex' : 'none';
    if (walkNav) walkNav.style.display = role === 'walkshare' ? 'flex' : 'none';
    if (back) {
      const home = role === 'driver' ? 'driverHome' : role === 'walkshare' ? 'wsHome' : 'home';
      back.setAttribute('onclick', `backNested('${home}')`);
    }
    const notifBack = document.querySelector('#screen-notifications .back-btn');
    if (notifBack) {
      const home = role === 'driver' ? 'driverHome' : role === 'walkshare' ? 'wsHome' : 'home';
      notifBack.setAttribute('onclick', `backNested('${home}')`);
    }
    const msgBack = document.querySelector('#screen-messages .back-btn');
    if (msgBack) msgBack.setAttribute('onclick', "backNested('inbox')");
    const sharedIds = ['faq', 'legal', 'about', 'privacy', 'contactSupport'];
    sharedIds.forEach((id) => {
      const screen = document.getElementById(`screen-${id}`);
      if (screen) {
        screen.setAttribute('data-shared-role', role);
        screen.classList.add('h2s-shared-surface');
      }
      const sharedBack = document.querySelector(`#screen-${id} .back-btn`);
      if (sharedBack) {
        sharedBack.setAttribute('type', 'button');
        const fallback = role === 'driver' ? 'driverProfile' : role === 'walkshare' ? 'wsProfile' : 'profile';
        sharedBack.setAttribute('onclick', `event.preventDefault();event.stopPropagation();backNested('${fallback}')`);
      }
      const title = document.querySelector(`#screen-${id} .top-bar-title`);
      if (title) {
        title.style.fontSize = '';
        title.style.fontWeight = '';
        title.style.color = '';
      }
    });
  }

  function paint(name) {
    applyRoleChrome();
    if (name === 'driverHome') renderHome();
    else if (name === 'driverRequests') renderRequests(state()._driverReqTab || 'new');
    else if (name === 'driverSchedule') renderSchedule(state()._driverSchedTab || 'today');
    else if (name === 'driverActiveTrip') renderActiveTrip();
    else if (name === 'driverSetup') renderSetup();
    else if (name === 'driverProfile') renderProfile();
    else if (name === 'driverOnboardProfile') renderOnboardProfile();
    else if (name === 'driverOnboardVehicle') renderOnboardVehicle();
    else if (name === 'driverOnboardDocs') renderOnboardDocs();
    else if (name === 'driverDocDetail') renderDocDetail();
    else if (name === 'driverOnboardAvailability') renderOnboardAvailability();
    else if (name === 'driverOnboardRate') renderOnboardRate();
    else if (name === 'driverPayment') renderPayment();
    else if (name === 'driverPending') renderPending();
    else if (name === 'driverSubscription') renderSubscription();
    else if (name === 'driverRequestDetail') renderRequestDetail();
    else if (name === 'driverTripPrep') renderTripPrep();
    else if (name === 'driverRateParent') renderRateParent();
    else if (name === 'driverRatings') renderMyRatings();
    else if (name === 'inbox') renderDriverInbox();
    else if (name === 'messages') renderDriverChatHeader();
    else if (name === 'notifications' && state().activeRole === 'driver') renderDriverNotifications();
    icons();
  }

  const origNavigate = window.navigateTo;
  window.navigateTo = function (screenName, isBack) {
    const next = resolveScreen(screenName);
    origNavigate.call(window, next, isBack);
    paint(next);
  };

  window.switchRole = function (role) {
    if (typeof window.coreSwitchRole === 'function') {
      window.coreSwitchRole(role);
      return;
    }
    if (role === 'admin') {
      if (typeof window.showToast === 'function') window.showToast('Admin web dashboard comes later', 'info');
      return;
    }
    const next = role === 'driver' ? 'driver' : role === 'walkshare' ? 'walkshare' : 'parent';
    if (typeof window.clearNavStacks === 'function') window.clearNavStacks();
    state().activeRole = next;
    localStorage.setItem('h2s_active_role', next);
    applyRoleChrome();
    // replaceState landing so Back cannot re-enter the previous role's hash trail
    if (next === 'driver') window.navigateTo(window.getDriverLanding(), true);
    else if (next === 'walkshare' && typeof window.getWalkShareLanding === 'function') window.navigateTo(window.getWalkShareLanding(), true);
    else window.navigateTo('home', true);
  };

  window.leaveDriverGate = function () {
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested('driverProfile');
      return;
    }
    window.navigateTo('driverProfile', true);
  };

  function fromProfileEdit() {
    const stack = window.navReturnStack || [];
    const role = state().activeRole || 'driver';
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      const entry = stack[i];
      if (entry && entry.role === role) return entry.screen === 'driverProfile';
    }
    return false;
  }

  function bindChildBack(el, onboardBack) {
    const back = el?.closest('.screen-view')?.querySelector('.back-btn');
    if (!back) return;
    back.setAttribute('type', 'button');
    const useProfileReturn = (window.navReturnStack && window.navReturnStack.length) || fromProfileEdit() || editingProfileChild();
    if (useProfileReturn) {
      // Keep explicit nested backs (e.g. doc detail → docs list).
      if (String(onboardBack || '').indexOf('backNested') === 0) {
        back.setAttribute('onclick', `event.preventDefault();event.stopPropagation();${onboardBack}`);
      } else {
        back.setAttribute('onclick', "event.preventDefault();event.stopPropagation();backNested('driverProfile')");
      }
    } else {
      back.setAttribute('onclick', `event.preventDefault();event.stopPropagation();${onboardBack}`);
    }
  }

  function bindChildTitle(el, title) {
    const titleEl = el?.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl && title) titleEl.textContent = title;
  }

  function finishNestedOr(next) {
    if (window.navReturnStack && window.navReturnStack.length) {
      toast('Saved');
      window.backNested(state().activeRole === 'driver' ? 'driverProfile' : 'profile');
      return true;
    }
    if (next) window.navigateTo(next);
    return false;
  }

  window.openDriverProfileChild = function (screenId, evt) {
    if (typeof window.openNestedScreen === 'function') window.openNestedScreen(screenId, evt);
    else window.navigateTo(screenId);
  };

  function feed(id) {
    return document.getElementById(id);
  }

  function val(id) {
    return document.getElementById(id)?.value?.trim() || '';
  }

  function stepHint(n, total, kicker) {
    return `<p class="drv-step-kicker">Step ${n} of ${total} · ${kicker}</p>`;
  }

  function stepIntro(n, total, kicker, copy) {
    return `<div>
      <p class="drv-step-kicker">Step ${n} of ${total} · ${kicker}</p>
      <p class="page-subtitle" style="margin:0;text-align:left;">${copy}</p>
    </div>`;
  }

  function field(label, control, icon) {
    const ic = icon ? `<i data-lucide="${icon}" class="input-box-icon"></i>` : '';
    return `<div class="form-group"><label class="form-label">${label}</label><div class="input-box-wrapper">${ic}${control}</div></div>`;
  }

  function textareaField(label, id, value, placeholder, rows = 3) {
    return `<div class="form-group"><label class="form-label" for="${id}">${label}</label><textarea class="form-textarea" id="${id}" rows="${rows}" placeholder="${placeholder}">${value}</textarea></div>`;
  }

  function selectField(label, inner) {
    return `<div class="form-group"><label class="form-label">${label}</label><div class="select-wrapper">${inner}<i data-lucide="chevron-down" class="select-chevron" style="width:18px;height:18px;color:currentColor;"></i></div></div>`;
  }

  function dateParts(label) {
    const raw = String(label || '');
    const monthMatch = raw.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*/i);
    const dayMatch = raw.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2})/i);
    const weekMatch = raw.match(/\b(Mon|Tue|Wed|Thu|Fri|Sat|Sun|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/i);
    if (monthMatch && dayMatch) {
      return {
        month: monthMatch[1].slice(0, 3).toUpperCase(),
        day: String(Number(dayMatch[2])),
        weekday: weekMatch ? weekMatch[1].slice(0, 3) : ''
      };
    }
    return { month: 'SEP', day: '9', weekday: 'Wed' };
  }

  function canAccept(d) {
    return isApproved(d) && docsApproved(d) && hasAccess(d);
  }

  function editingProfileChild() {
    if (fromProfileEdit()) return true;
    if (state()._docsReturnTo) return false;
    return onboardingDone(ensureDriver());
  }

  function readLocalFile(file, cb) {
    if (!file) return;
    const meta = { name: file.name, attached: true, preview: '' };
    const isImage = !!(file.type && file.type.indexOf('image/') === 0);
    if (!isImage) {
      cb(meta);
      return;
    }
    const maxBytes = 12 * 1024 * 1024;
    if (file.size > maxBytes) {
      toast('Choose a photo under 12 MB');
      cb(meta);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      if (!dataUrl) {
        cb(meta);
        return;
      }
      if (file.size <= 1.5 * 1024 * 1024) {
        cb({ name: file.name, attached: true, preview: dataUrl });
        return;
      }
      const img = new Image();
      img.onload = () => {
        try {
          const maxEdge = 1280;
          const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            cb({ name: file.name, attached: true, preview: dataUrl });
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          const compressed = canvas.toDataURL('image/jpeg', 0.82);
          cb({ name: file.name, attached: true, preview: compressed || dataUrl });
        } catch (err) {
          cb({ name: file.name, attached: true, preview: dataUrl });
        }
      };
      img.onerror = () => cb({ name: file.name, attached: true, preview: dataUrl });
      img.src = dataUrl;
    };
    reader.onerror = () => {
      toast('Could not read that photo');
      cb(meta);
    };
    reader.readAsDataURL(file);
  }

  function renderOnboardProfile() {
    const d = ensureDriver();
    const el = feed('driverOnboardProfileFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Edit profile' : 'Your profile');
    bindChildBack(el, "leaveDriverGate()");
    el.innerHTML = `
      ${editing ? '' : stepIntro(1, 5, 'Who you are', 'Name and service area parents will see.')}
      
      <!-- Avatar Hero with Name & Verified Badge -->
      <div style="display: flex; flex-direction: column; align-items: center; margin: 4px 0 16px;">
        <div style="position: relative;">
          <div class="drv-photo-wrap" style="width: 76px; height: 76px; border-radius: 50%; overflow: hidden; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(27, 43, 104, 0.12);">
            <img src="${esc(d.photo || '/assets/avatar_tariq.jpg')}" alt="${esc(d.name)}" id="drvProfileImg" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='/assets/avatar_tariq.jpg';" />
          </div>
          <button type="button" class="drv-photo-cam" onclick="document.getElementById('drvPhotoFile').click()" aria-label="Change photo" style="position: absolute; bottom: -2px; right: -2px; background: var(--color-primary, #1B2B68); color: #fff; border: 2px solid #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <i data-lucide="camera" style="width:13px;height:13px;"></i>
          </button>
          <input type="file" accept="image/*" id="drvPhotoFile" class="drv-file-input" onchange="onDriverProfilePhoto(event)" style="display:none;" />
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 8px; display: inline-flex; align-items: center; gap: 6px;">
          <span>${esc(d.name || 'Ahmed Asik')}</span>
          <span class="fb-verified-badge" title="Verified Account">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.6l-3.9-3.9 1.41-1.41 2.49 2.48 5.69-5.69 1.41 1.41-7.1 7.11z"/>
            </svg>
          </span>
        </div>
      </div>

      <!-- Unified Driver Profile Details Card -->
      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Full Legal Name</label>
          <div class="input-box-wrapper">
            <input type="text" class="form-input" id="drvName" value="${esc(d.name)}" placeholder="Ahmed Asik" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <div class="phone-input-row" style="border: 1.5px solid #E2E8F0; border-radius: 10px; background: #fff; height: 44px; overflow: hidden; display: flex; align-items: center; padding: 0; gap: 0; transition: border-color 0.15s;" onfocusin="this.style.borderColor='var(--color-primary)'" onfocusout="this.style.borderColor='#E2E8F0'">
            <div class="country-pill" style="cursor: pointer; border-right: 1.5px solid #E2E8F0; border-radius: 0; height: 100%; padding: 0 10px; background: #F8FAFC; display: flex; align-items: center; gap: 5px; flex-shrink: 0; min-width: 64px; justify-content: center;">
              <span style="font-size: 16px; line-height: 1;">🇨🇦</span>
              <span style="font-size: 12px; font-weight: 700; color: #334155; letter-spacing: -0.2px;">+1</span>
              <i data-lucide="chevron-down" style="width:11px;height:11px;color:#94A3B8;flex-shrink:0;"></i>
            </div>
            <input type="tel" class="form-input" id="drvPhone" value="${esc(d.phone)}" placeholder="(416) 555-0192" style="border: none; border-radius: 0; padding: 0 12px; height: 100%; flex: 1; background: transparent;" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-box-wrapper">
            <input type="email" class="form-input" id="drvEmail" value="${esc(d.email)}" placeholder="sadia.khan@example.com" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Service Area</label>
          <div class="input-box-wrapper">
            <input type="text" class="form-input" id="drvArea" value="${esc(d.serviceArea || '12 Elm Street, Toronto, ON')}" placeholder="12 Elm Street, Toronto, ON" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">About / Bio (Shown to parents)</label>
          <textarea class="form-textarea" id="drvBio" rows="3" placeholder="Tell parents about your driving experience, focus on child safety, boosters, and calm school rides...">${esc(d.bio || d.about || 'Provides daily school rides with a focus on child safety, calm pickups, booster-ready seating, and on-time arrival at the school gate.')}</textarea>
        </div>
      </div>

      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveDriverOnboardProfile()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">Save Changes</button>
      </div>
    `;
    icons();
  }

  window.onDriverProfilePhoto = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    readLocalFile(file, (meta) => {
      const d = ensureDriver();
      d.photoName = meta.name;
      if (meta.preview) d.photo = meta.preview;
      syncDriverToProviders();
      persist();
      const img = document.getElementById('drvProfileImg');
      if (img && meta.preview) img.src = meta.preview;
      toast('Photo attached');
    });
  };

  window.saveDriverOnboardProfile = function () {
    const d = ensureDriver();
    d.name = val('drvName') || d.name;
    d.phone = val('drvPhone') || d.phone;
    d.email = val('drvEmail') || d.email;
    d.serviceArea = val('drvArea') || d.serviceArea;
    d.bio = val('drvBio') || d.bio;
    d.about = d.bio;
    d.onboarding.profile = true;
    syncDriverToProviders();
    persist();
    toast('Profile saved');
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested('driverProfile');
    } else {
      window.navigateTo('driverProfile', true);
    }
  };

  function renderOnboardVehicle() {
    const d = ensureDriver();
    const v = d.vehicle;
    const el = feed('driverOnboardVehicleFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, 'Your vehicle');
    bindChildBack(el, "navigateTo('driverOnboardProfile')");
    const hasCustomPhoto = !!(v.photoName || (v.photo && String(v.photo).indexOf('data:') === 0));
    const photoName = hasCustomPhoto ? (v.photoName || 'Vehicle photo') : 'Add vehicle photo';
    const photoHint = hasCustomPhoto ? 'Tap to replace' : 'Tap to upload · JPG or PNG';
    const thumb = hasCustomPhoto && v.photo ? v.photo : '';
    el.innerHTML = `
      ${editing ? '' : stepIntro(2, 5, 'One vehicle', 'Vehicle parents will see.')}
      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        ${selectField('Type', `<select class="form-select" id="drvVType">${['Minivan', 'SUV', 'Sedan', 'Wagon'].map((t) => `<option ${v.type === t ? 'selected' : ''}>${t}</option>`).join('')}</select>`)}
        <div class="drv-window-row">
          ${field('Make', `<input class="form-input" id="drvVMake" value="${esc(v.make)}" placeholder="Toyota" />`)}
          ${field('Model', `<input class="form-input" id="drvVModel" value="${esc(v.model)}" placeholder="Sienna" />`)}
        </div>
        <div class="drv-window-row">
          ${field('Year', `<input class="form-input" id="drvVYear" value="${esc(v.year)}" placeholder="2023" />`)}
          ${field('Colour', `<input class="form-input" id="drvVColor" value="${esc(v.color)}" placeholder="Celestial Silver" />`)}
        </div>
        <div class="drv-window-row">
          ${field('Plate', `<input class="form-input" id="drvVPlate" value="${esc(v.plate)}" placeholder="SCH-4091" />`)}
          ${field('Seats', `<input class="form-input" id="drvVSeats" type="number" min="1" max="8" value="${esc(v.capacity)}" placeholder="4" />`)}
        </div>
        <div class="form-group">
          <label class="form-label" for="drvVehicleFile">Vehicle photo</label>
          <label class="drv-upload-tile" for="drvVehicleFile">
            ${thumb
              ? `<img class="drv-upload-thumb" src="${esc(thumb)}" alt="" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />`
              : `<span class="menu-icon-wrap drv-doc-icon" aria-hidden="true"><i data-lucide="upload"></i></span>`}
            <span class="drv-upload-copy">
              <span class="drv-upload-name">${esc(photoName)}</span>
              <span class="drv-upload-hint">${esc(photoHint)}</span>
            </span>
          </label>
          <input type="file" accept="image/*" capture="environment" id="drvVehicleFile" class="drv-file-input" onchange="onDriverVehiclePhoto(event)" />
        </div>
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveDriverVehicle()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">${editing ? 'Save Changes' : 'Continue'}</button>
      </div>
    `;
    icons();
  }

  window.onDriverVehiclePhoto = function (event) {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;
    if (!(file.type && file.type.indexOf('image/') === 0)) {
      toast('Choose a JPG or PNG photo');
      input.value = '';
      return;
    }
    readLocalFile(file, (meta) => {
      const d = ensureDriver();
      d.vehicle.photoName = meta.name || 'Vehicle photo';
      if (meta.preview) d.vehicle.photo = meta.preview;
      syncDriverToProviders();
      persist();
      input.value = '';
      renderOnboardVehicle();
      toast(meta.preview ? 'Vehicle photo uploaded' : 'Photo name saved — try a smaller JPG/PNG');
    });
  };

  window.saveDriverVehicle = function () {
    const d = ensureDriver();
    const prevPlate = d.vehicle.plate;
    d.vehicle = {
      ...d.vehicle,
      type: val('drvVType') || d.vehicle.type,
      make: val('drvVMake') || d.vehicle.make,
      model: val('drvVModel') || d.vehicle.model,
      year: val('drvVYear') || d.vehicle.year,
      color: val('drvVColor') || d.vehicle.color,
      plate: val('drvVPlate') || d.vehicle.plate,
      capacity: Number(val('drvVSeats') || d.vehicle.capacity)
    };
    const reg = d.documents.find((doc) => doc.id === 'registration');
    if (reg && (!reg.plate || reg.plate === prevPlate)) reg.plate = d.vehicle.plate;
    d.onboarding.vehicle = true;
    syncDriverToProviders();
    persist();
    if (finishNestedOr()) return;
    window.navigateTo(editingProfileChild() ? 'driverProfile' : 'driverOnboardDocs');
  };

  function docLabel(status) {
    return { not_submitted: 'Not Submitted', under_review: 'Under Review', approved: 'Approved', action_required: 'Action Required', rejected: 'Rejected' }[status] || status;
  }

  function docIcon(id) {
    return { licence: 'credit-card', insurance: 'shield', registration: 'car', criminal: 'file-text', vulnerable: 'shield-check' }[id] || 'file';
  }

  function docFormSpec(id) {
    if (id === 'licence') {
      return {
        fields: [
          { key: 'number', label: 'Licence number', placeholder: 'A8472-19305-66120', icon: 'hash' },
          { key: 'class', label: 'Licence class', type: 'select', options: LICENCE_CLASSES },
          { key: 'province', label: 'Issuing province', type: 'select', options: PROVINCES },
          { key: 'expiry', label: 'Expiry date', type: 'date', placeholder: 'YYYY-MM-DD', icon: 'calendar' }
        ],
        uploads: [
          { key: 'fileFront', label: 'Front of licence', hint: 'Colour photo of the front' },
          { key: 'fileBack', label: 'Back of licence', hint: 'Colour photo of the back' }
        ]
      };
    }
    if (id === 'insurance') {
      return {
        fields: [
          { key: 'insurer', label: 'Insurer', placeholder: 'Intact Insurance', icon: 'building' },
          { key: 'policyNumber', label: 'Policy number', placeholder: 'ON-884291-SIENNA', icon: 'hash' },
          { key: 'expiry', label: 'Policy expiry', type: 'date', placeholder: 'YYYY-MM-DD', icon: 'calendar' }
        ],
        uploads: [
          { key: 'fileDoc', label: 'Insurance document', hint: 'Pink slip or policy PDF' }
        ]
      };
    }
    if (id === 'registration') {
      return {
        fields: [
          { key: 'plate', label: 'Licence plate', placeholder: 'SCH-4091', icon: 'car' },
          { key: 'vin', label: 'VIN or permit number', placeholder: '17-character VIN', icon: 'hash' },
          { key: 'expiry', label: 'Registration expiry', type: 'date', placeholder: 'YYYY-MM-DD', icon: 'calendar' }
        ],
        uploads: [
          { key: 'fileDoc', label: 'Registration document', hint: 'Ownership or permit PDF' }
        ]
      };
    }
    return {
      fields: [
        { key: 'issuer', label: 'Issuing body', placeholder: 'Toronto Police Service', icon: 'building' },
        { key: 'issueDate', label: 'Issue date', type: 'date', placeholder: 'YYYY-MM-DD', icon: 'calendar' },
        { key: 'expiry', label: 'Expiry date (if listed)', type: 'date', placeholder: 'YYYY-MM-DD', icon: 'calendar', optional: true }
      ],
      uploads: [
        { key: 'fileDoc', label: id === 'vulnerable' ? 'Vulnerable sector document' : 'Background check document', hint: 'PDF or photo of the official letter' }
      ]
    };
  }

  function docFieldControl(item, value) {
    if (item.type === 'select') {
      const opts = [`<option value="">Select</option>`].concat(
        (item.options || []).map((opt) => `<option value="${esc(opt)}" ${value === opt ? 'selected' : ''}>${esc(opt)}</option>`)
      );
      return `<select class="form-select" id="drvDoc_${item.key}">${opts.join('')}</select>`;
    }
    const type = item.type === 'date' ? 'date' : 'text';
    return `<input class="form-input" type="${type}" id="drvDoc_${item.key}" value="${esc(value)}" placeholder="${esc(item.placeholder || '')}" />`;
  }

  function renderDocField(item, value) {
    if (item.type === 'select') return selectField(item.label, docFieldControl(item, value));
    return field(item.label, docFieldControl(item, value), item.icon);
  }

  function uploadHint(status, attached, fallback) {
    if (status === 'action_required' || status === 'rejected') return 'Re-upload required';
    if (status === 'under_review') return attached ? 'Update file' : 'Update file';
    if (status === 'approved') return attached ? 'Replace file' : 'Add file';
    return attached ? 'Replace file' : (fallback || 'JPG, PNG, or PDF');
  }

  function uploadTile(file, key, label, hint, status) {
    const attached = hasUpload(file);
    const name = attached ? (file.name || 'File attached') : 'Tap to upload';
    const inputId = `drvUpload_${key}`;
    const thumb = attached && file.preview && String(file.preview).indexOf('data:') === 0
      ? `<img class="drv-upload-thumb" src="${esc(file.preview)}" alt="" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />`
      : `<span class="menu-icon-wrap drv-doc-icon" aria-hidden="true"><i data-lucide="${attached ? 'file-check' : 'upload'}"></i></span>`;
    return `
      <div class="form-group">
        <label class="form-label" for="${inputId}">${esc(label)}</label>
        <label class="drv-upload-tile" for="${inputId}">
          ${thumb}
          <span class="drv-upload-copy">
            <span class="drv-upload-name">${esc(name)}</span>
            <span class="drv-upload-hint">${esc(uploadHint(status, attached, hint))}</span>
          </span>
        </label>
        <input type="file" accept="image/*,.pdf,application/pdf" id="${inputId}" class="drv-file-input" onchange="onDriverDocFile(event, '${key}')" />
      </div>`;
  }

  function docReadyToSubmit(doc) {
    const spec = docFormSpec(doc.id);
    const missingField = spec.fields.some((item) => !item.optional && !String(doc[item.key] || '').trim());
    const missingFile = spec.uploads.some((item) => !hasUpload(doc[item.key]));
    return !missingField && !missingFile;
  }

  function nextDocStatus(prev, doc, fileReplaced) {
    const wasRejected = prev === 'action_required' || prev === 'rejected';
    if (wasRejected) {
      return fileReplaced ? 'under_review' : 'action_required';
    }
    if (!docReadyToSubmit(doc)) return 'not_submitted';
    if (prev === 'approved' && fileReplaced) return 'under_review';
    if (prev === 'approved') return 'approved';
    return 'under_review';
  }

  function docPrimaryLabel(status) {
    if (status === 'action_required' || status === 'rejected') return 'Re-upload';
    if (status === 'not_submitted') return 'Submit';
    return 'Save';
  }

  function renderDocList(d, listScreen) {
    const screen = listScreen || 'driverOnboardDocs';
    const chevron = '<i data-lucide="chevron-right" style="width:16px;height:16px;color:#94A3B8;"></i>';
    const rows = d.documents.map((doc) => {
      const needsUpload = doc.status === 'not_submitted' || doc.status === 'action_required' || doc.status === 'rejected';
      const sub = needsUpload ? 'Tap to upload' : docLabel(doc.status);
      return `
      <button type="button" class="profile-menu-item drv-doc-row" data-status="${esc(doc.status)}" data-doc-id="${esc(doc.id)}" onclick="event.preventDefault();event.stopPropagation();window.openDriverDoc('${doc.id}', '${screen}')">
        <div class="menu-item-left">
          <div class="menu-icon-wrap drv-doc-icon"><i data-lucide="${docIcon(doc.id)}"></i></div>
          <div>
            <span class="menu-title-text">${esc(doc.title)}</span>
            ${needsUpload ? `<span class="menu-subtitle">${esc(sub)}</span>` : ''}
          </div>
        </div>
        <span class="drv-doc-row-end">
          <span class="drv-doc-status ${esc(doc.status)}">${docLabel(doc.status)}</span>
          ${chevron}
        </span>
      </button>`;
    }).join('');
    return `<div class="profile-menu-section drv-doc-list">${rows}</div>`;
  }

  function docsListBackTarget() {
    const ret = state()._docsReturnTo;
    if (ret) return ret;
    return editingProfileChild() ? 'driverProfile' : 'driverOnboardVehicle';
  }

  function renderOnboardDocs() {
    const d = ensureDriver();
    ensureDriverRole();
    const el = feed('driverOnboardDocsFeed');
    if (!el) return;
    state()._docListScreen = 'driverOnboardDocs';
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Verification documents' : 'Documents');
    const approved = d.documents.filter((doc) => doc.status === 'approved').length;
    const submitted = d.documents.filter((doc) => doc.status !== 'not_submitted' && doc.status !== 'action_required' && doc.status !== 'rejected').length;
    const backFallback = state()._docsReturnTo
      ? `backNested('${state()._docsReturnTo}')`
      : (editing ? "backNested('driverProfile')" : "navigateTo('driverOnboardVehicle')");
    bindChildBack(el, backFallback);
    el.innerHTML = `
      ${editing ? '' : stepHint(3, 5, 'Safety checks')}
      <p class="drv-docs-meta">${editing ? `${approved} / ${d.documents.length} approved` : `${submitted} / ${d.documents.length} submitted`} · Licence, insurance, registration, CRC, VSC</p>
      ${renderDocList(d, 'driverOnboardDocs')}
      ${editing ? '' : '<div class="drv-actions-col"><button type="button" class="btn-primary" onclick="saveDriverDocs()">Continue</button></div>'}
    `;
    icons();
  }

  let docDraft = null;

  function harvestDocDraft() {
    if (!docDraft) return;
    docFormSpec(docDraft.id).fields.forEach((item) => {
      const el = document.getElementById('drvDoc_' + item.key);
      if (el) docDraft[item.key] = el.value.trim();
    });
  }

  function returnToDocList() {
    const list = state()._docListScreen || 'driverOnboardDocs';
    const stack = window.navReturnStack || [];
    // Drop the docs→detail hop so Back from the list still returns to profile/setup.
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (!top) {
        stack.pop();
        continue;
      }
      if (top.screen === list || top.screen === 'driverDocDetail') {
        stack.pop();
        if (top.screen === list) break;
        continue;
      }
      break;
    }
    window.navigateTo(list, true);
  }

  window.openDriverDoc = function (id, listScreen) {
    const d = ensureDriver();
    const doc = d.documents.find((item) => item.id === id);
    if (!doc) {
      toast('Document not found');
      return;
    }
    ensureDriverRole();
    state()._docListScreen = listScreen || state()._docListScreen || 'driverOnboardDocs';
    state()._activeDocId = id;
    try {
      docDraft = JSON.parse(JSON.stringify(doc));
    } catch (err) {
      docDraft = Object.assign({}, doc);
    }
    docDraft._fileTouched = false;
    const current = window.currentScreen || '';
    if (current && current !== 'driverDocDetail') {
      window.navReturnStack = window.navReturnStack || [];
      window.navReturnStack.push({ screen: current, role: 'driver' });
    }
    // Direct navigate (not openNestedScreen) so role/resolution cannot bounce to parent home.
    window.navigateTo('driverDocDetail', true);
  };

  function renderDocDetail() {
    const d = ensureDriver();
    const el = feed('driverDocDetailFeed');
    if (!el) return;
    const id = (docDraft && docDraft.id) || state()._activeDocId;
    const stored = d.documents.find((item) => item.id === id);
    if (!docDraft || docDraft.id !== id) {
      docDraft = stored ? JSON.parse(JSON.stringify(stored)) : null;
    }
    if (!docDraft) {
      returnToDocList();
      return;
    }
    const spec = docFormSpec(docDraft.id);
    const rejected = docDraft.status === 'action_required' || docDraft.status === 'rejected';
    bindChildTitle(el, docDraft.title);
    // Always return to the documents list — never skip to profile from detail Back.
    const back = el?.closest('.screen-view')?.querySelector('.back-btn');
    if (back) {
      back.setAttribute('onclick', "event.preventDefault();event.stopPropagation();returnToDriverDocList()");
    }
    el.innerHTML = `
      <div class="drv-doc-detail-head">
        <span class="drv-doc-status ${esc(docDraft.status)}">${docLabel(docDraft.status)}</span>
      </div>
      ${rejected && docDraft.rejectReason ? `<div class="drv-reject-banner"><p>${esc(docDraft.rejectReason)}</p></div>` : ''}
      ${spec.fields.map((item) => renderDocField(item, docDraft[item.key] || '')).join('')}
      ${spec.uploads.map((item) => uploadTile(docDraft[item.key], item.key, item.label, item.hint, docDraft.status)).join('')}
      <div class="drv-actions-col"><button type="button" class="btn-primary" onclick="saveDriverDoc()">${docPrimaryLabel(docDraft.status)}</button></div>
    `;
    icons();
  }

  window.returnToDriverDocList = returnToDocList;

  window.onDriverDocFile = function (event, key) {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file || !docDraft) return;
    harvestDocDraft();
    readLocalFile(file, (meta) => {
      if (!meta || !meta.name) {
        toast('Could not read that file');
        input.value = '';
        return;
      }
      docDraft[key] = {
        name: meta.name,
        attached: true,
        preview: meta.preview || ''
      };
      docDraft._fileTouched = true;
      input.value = '';
      toast('File attached');
      if (docDraft.status === 'action_required' || docDraft.status === 'rejected') {
        window.saveDriverDoc();
        return;
      }
      renderDocDetail();
    });
  };

  window.saveDriverDoc = function () {
    harvestDocDraft();
    if (!docDraft) return;
    const d = ensureDriver();
    const idx = d.documents.findIndex((item) => item.id === docDraft.id);
    if (idx < 0) return;
    const prev = d.documents[idx].status;
    const rejected = prev === 'action_required' || prev === 'rejected';
    if (rejected && !docDraft._fileTouched) {
      const spec = docFormSpec(docDraft.id);
      document.getElementById('drvUpload_' + spec.uploads[0].key)?.click();
      return;
    }
    if (!docReadyToSubmit(docDraft) && prev === 'not_submitted') {
      toast('Add required details and upload the file(s)');
      return;
    }
    const next = nextDocStatus(prev, docDraft, docDraft._fileTouched);
    const saved = JSON.parse(JSON.stringify(docDraft));
    delete saved._fileTouched;
    saved.status = next;
    if (next !== 'action_required' && next !== 'rejected') saved.rejectReason = '';
    d.documents[idx] = Object.assign({}, d.documents[idx], saved);
    syncDriverToProviders();
    persist();
    toast(next === 'under_review' ? 'Submitted for review' : 'Document saved');
    returnToDocList();
  };

  window.uploadDriverDoc = function (id) {
    window.openDriverDoc(id, state()._docListScreen || 'driverOnboardDocs');
  };

  window.saveDriverDocs = function () {
    const d = ensureDriver();
    const blocked = d.documents.filter((doc) => doc.status === 'not_submitted' || doc.status === 'action_required');
    if (blocked.length) {
      toast('Open every document and add the required details, including any that need action.');
      return;
    }
    d.onboarding.docs = true;
    syncDriverToProviders();
    persist();
    if (finishNestedOr()) return;
    window.navigateTo('driverOnboardAvailability');
  };

  let availDraft = null;
  let availTimeTarget = 'morningStart';
  let availCalCursor = { year: 2026, month: 8 };
  let availCalPending = '';
  const AVAIL_HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const AVAIL_MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  const AVAIL_PERIODS = ['AM', 'PM'];

  function editingAvailability() {
    const d = ensureDriver();
    return !!(d.onboarding && d.onboarding.availability && d.onboarding.rate);
  }

  function resetAvailDraft() {
    const d = ensureDriver();
    const w = d.availability && d.availability.windows ? d.availability.windows : defaultAvailWindows();
    availDraft = {
      days: (d.availability && d.availability.weekly && d.availability.weekly.length ? d.availability.weekly : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']).slice(),
      morningOn: w[0] ? w[0].enabled !== false : true,
      afternoonOn: w[1] ? w[1].enabled !== false : true,
      morningStart: w[0] ? w[0].start : '06:30',
      morningEnd: w[0] ? w[0].end : '09:00',
      afternoonStart: w[1] ? w[1].start : '13:00',
      afternoonEnd: w[1] ? w[1].end : '16:30',
      scheduleType: (d.availability && d.availability.scheduleType) || 'recurring',
      exceptions: (d.availability && d.availability.exceptions ? d.availability.exceptions : []).slice(),
      pendingDate: ''
    };
  }

  window.toggleDriverAvailDay = function (day) {
    if (!availDraft) resetAvailDraft();
    const idx = availDraft.days.indexOf(day);
    if (idx !== -1) {
      if (availDraft.days.length > 1) {
        availDraft.days.splice(idx, 1);
      } else {
        toast('At least one active service day is required', 'warning');
        return;
      }
    } else {
      availDraft.days.push(day);
    }
    paintAvailability();
  };

  window.toggleDriverShift = function (shift) {
    if (!availDraft) resetAvailDraft();
    if (shift === 'morning') {
      availDraft.morningOn = !availDraft.morningOn;
    } else if (shift === 'afternoon') {
      availDraft.afternoonOn = !availDraft.afternoonOn;
    }
    if (!availDraft.morningOn && !availDraft.afternoonOn) {
      if (shift === 'morning') availDraft.afternoonOn = true;
      else availDraft.morningOn = true;
      toast('At least one shift must remain active', 'warning');
    }
    paintAvailability();
  };

  window.setDriverScheduleType = function (type) {
    if (!availDraft) resetAvailDraft();
    availDraft.scheduleType = type;
    paintAvailability();
  };

  function isoToMdY(iso) {
    const parts = String(iso || '').split('-');
    if (parts.length !== 3) return iso || '';
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  function availTimeField(key) {
    return `<button type="button" class="avail-time-btn" onclick="openDriverAvailTime('${key}')">
      <span class="avail-time-val">${esc(toLabel(availDraft[key]))}</span>
      <i data-lucide="clock"></i>
    </button>`;
  }

  function availWindowRow(startKey, endKey) {
    return `<div class="drv-avail-window">
      <div class="drv-window-row">
        <div class="form-group">
          <label class="form-label">From</label>
          ${availTimeField(startKey)}
        </div>
        <div class="form-group">
          <label class="form-label">To</label>
          ${availTimeField(endKey)}
        </div>
      </div>
    </div>`;
  }

  function exceptionChips() {
    const list = availDraft.exceptions || [];
    if (!list.length) return '<p class="drv-lede" id="drvExceptionList" style="font-size:12px; color:#94A3B8; margin:4px 0;">No date exceptions set</p>';
    return `<div class="drv-exception-list" id="drvExceptionList" style="display:flex; gap:6px; flex-wrap:wrap; margin-top:6px;">${list.map((iso) => `
      <span class="drv-exception-chip" style="display:inline-flex; align-items:center; gap:6px; background:#F1F5F9; border:1px solid #E2E8F0; padding:4px 10px; border-radius:99px; font-size:12px; font-weight:700; color:#334155;">
        <span>${esc(isoToMdY(iso))}</span>
        <button type="button" class="drv-exception-remove" onclick="removeDriverException('${esc(iso)}')" aria-label="Remove exception" style="border:none; background:none; cursor:pointer; display:flex; align-items:center; color:#94A3B8; padding:0;">
          <i data-lucide="x" style="width:12px; height:12px;"></i>
        </button>
      </span>`).join('')}</div>`;
  }

  function ensureAvailSheets() {
    const screen = document.getElementById('screen-driverOnboardAvailability');
    if (!screen || document.getElementById('drvAvailTimeSheet')) return;
    screen.insertAdjacentHTML('beforeend', `
      <div class="book-ride-sheet" id="drvAvailTimeSheet" onclick="if(event.target===this) closeDriverAvailSheet('drvAvailTimeSheet')">
        <div class="book-ride-sheet-card">
          <div class="sheet-drag-handle" style="margin: 0 auto 8px;"></div>
          <div class="book-ride-sheet-head">
            <h3 id="drvAvailTimeSheetTitle">From</h3>
            <button type="button" class="book-ride-sheet-close" onclick="closeDriverAvailSheet('drvAvailTimeSheet')" title="Close">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="book-ride-time-wheels">
            <div class="book-ride-time-col" id="drvAvailHourCol"></div>
            <div class="book-ride-time-col" id="drvAvailMinuteCol"></div>
            <div class="book-ride-time-col" id="drvAvailPeriodCol"></div>
          </div>
          <button type="button" class="btn-primary" onclick="confirmDriverAvailTime()">Done</button>
        </div>
      </div>
      <div class="book-ride-sheet" id="drvAvailDateSheet" onclick="if(event.target===this) closeDriverAvailSheet('drvAvailDateSheet')">
        <div class="book-ride-sheet-card">
          <div class="sheet-drag-handle" style="margin: 0 auto 8px;"></div>
          <div class="book-ride-sheet-head">
            <h3>Select Date</h3>
            <button type="button" class="book-ride-sheet-close" onclick="closeDriverAvailSheet('drvAvailDateSheet')" title="Close">
              <i data-lucide="x"></i>
            </button>
          </div>
          <div class="book-ride-calendar-nav">
            <button type="button" onclick="shiftDriverAvailCalendar(-1)" aria-label="Previous month"><i data-lucide="chevron-left"></i></button>
            <h4 id="drvAvailCalMonthLabel">September 2026</h4>
            <button type="button" onclick="shiftDriverAvailCalendar(1)" aria-label="Next month"><i data-lucide="chevron-right"></i></button>
          </div>
          <div class="book-ride-cal-week">
            <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
          </div>
          <div class="book-ride-cal-grid" id="drvAvailCalGrid"></div>
          <button type="button" class="btn-primary" onclick="confirmDriverAvailDate()">Done</button>
        </div>
      </div>
    `);
  }

  function scrollAvailTimeOpt(col, el) {
    if (!col || !el) return;
    col.scrollTop = el.offsetTop - (col.clientHeight / 2) + (el.clientHeight / 2);
  }

  function fillAvailTimeCol(id, values, selected) {
    const col = document.getElementById(id);
    if (!col) return;
    if (id === 'drvAvailPeriodCol') {
      const btns = values.map((val) => 
        `<button type="button" class="book-ride-period-btn${val === selected ? ' selected' : ''}" data-val="${val}" onclick="selectDriverAvailPeriod('${val}')">${val}</button>`
      ).join('');
      col.innerHTML = btns;
      return;
    }
    const opts = values.map((val) => `<button type="button" class="book-ride-time-opt${val === selected ? ' selected' : ''}" data-val="${val}" onclick="selectDriverAvailTimePart(this)">${val}</button>`).join('');
    col.innerHTML = `<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>${opts}<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>`;
    scrollAvailTimeOpt(col, col.querySelector('.book-ride-time-opt.selected'));
  }

  window.selectDriverAvailPeriod = function (val) {
    const col = document.getElementById('drvAvailPeriodCol');
    if (!col) return;
    col.querySelectorAll('.book-ride-period-btn').forEach((btn) => {
      if (btn.getAttribute('data-val') === val) btn.classList.add('selected');
      else btn.classList.remove('selected');
    });
  };

  function parseAvailTimeParts(value) {
    const mins = toMinutes(value || '07:30');
    let h = Math.floor(mins / 60);
    let minute = Math.round((mins % 60) / 5) * 5;
    if (minute === 60) minute = 55;
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return { hour: String(h).padStart(2, '0'), minute: String(minute).padStart(2, '0'), period };
  }

  function paintAvailability() {
    if (!availDraft) resetAvailDraft();
    const el = feed('driverOnboardAvailabilityFeed');
    if (!el) return;
    ensureAvailSheets();
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Edit availability' : 'Availability');
    bindChildBack(el, editing ? "navigateTo('driverProfile')" : "navigateTo('driverOnboardDocs')");

    const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activeDays = availDraft.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

    el.innerHTML = `
      ${editing ? '' : stepIntro(4, 5, 'Driving schedule', 'Set your active days, shift windows, and school term availability.')}
      
      <!-- Schedule Type (Recurring vs One-time) -->
      <h3 class="avail-section-heading">Schedule type</h3>
      <div class="avail-type-grid">
        <button type="button" class="avail-type-btn ${availDraft.scheduleType !== 'onetime' ? 'active' : ''}" onclick="setDriverScheduleType('recurring')">
          <i data-lucide="repeat"></i>
          <span>Recurring</span>
        </button>
        <button type="button" class="avail-type-btn ${availDraft.scheduleType === 'onetime' ? 'active' : ''}" onclick="setDriverScheduleType('onetime')">
          <i data-lucide="calendar"></i>
          <span>One-time / Flexible</span>
        </button>
      </div>

      <!-- Service Days -->
      <h3 class="avail-section-heading">Service days</h3>
      <div class="avail-days-row">
        ${ALL_DAYS.map((d) => {
          const active = activeDays.includes(d);
          return `<button type="button" class="avail-day-pill ${active ? 'active' : ''}" onclick="toggleDriverAvailDay('${d}')">${d}</button>`;
        }).join('')}
      </div>

      <!-- Time Windows -->
      <h3 class="avail-section-heading">Time windows</h3>
      
      <!-- Morning Drop-off Card -->
      <div class="avail-window-card">
        <div class="avail-window-head">
          <div class="avail-window-title-wrap">
            <div class="avail-window-icon-badge">
              <i data-lucide="sunrise"></i>
            </div>
            <span class="avail-window-title">Morning drop-off</span>
          </div>
          <div class="avail-toggle-switch" onclick="event.preventDefault(); toggleDriverShift('morning');">
            <span class="avail-toggle-slider ${availDraft.morningOn ? 'active' : ''}"></span>
          </div>
        </div>
        ${availDraft.morningOn ? `
          <div class="avail-time-inputs-grid">
            <div class="avail-time-col">
              <span class="avail-time-label">From</span>
              <button type="button" class="avail-time-btn" onclick="openDriverAvailTime('morningStart')">
                <span class="avail-time-val">${esc(toLabel(availDraft.morningStart))}</span>
                <i data-lucide="clock"></i>
              </button>
            </div>
            <div class="avail-time-col">
              <span class="avail-time-label">To</span>
              <button type="button" class="avail-time-btn" onclick="openDriverAvailTime('morningEnd')">
                <span class="avail-time-val">${esc(toLabel(availDraft.morningEnd))}</span>
                <i data-lucide="clock"></i>
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <!-- Afternoon Pickup Card -->
      <div class="avail-window-card">
        <div class="avail-window-head">
          <div class="avail-window-title-wrap">
            <div class="avail-window-icon-badge">
              <i data-lucide="sun"></i>
            </div>
            <span class="avail-window-title">Afternoon pickup</span>
          </div>
          <div class="avail-toggle-switch" onclick="event.preventDefault(); toggleDriverShift('afternoon');">
            <span class="avail-toggle-slider ${availDraft.afternoonOn ? 'active' : ''}"></span>
          </div>
        </div>
        ${availDraft.afternoonOn ? `
          <div class="avail-time-inputs-grid">
            <div class="avail-time-col">
              <span class="avail-time-label">From</span>
              <button type="button" class="avail-time-btn" onclick="openDriverAvailTime('afternoonStart')">
                <span class="avail-time-val">${esc(toLabel(availDraft.afternoonStart))}</span>
                <i data-lucide="clock"></i>
              </button>
            </div>
            <div class="avail-time-col">
              <span class="avail-time-label">To</span>
              <button type="button" class="avail-time-btn" onclick="openDriverAvailTime('afternoonEnd')">
                <span class="avail-time-val">${esc(toLabel(availDraft.afternoonEnd))}</span>
                <i data-lucide="clock"></i>
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <button type="button" class="avail-save-btn" onclick="saveDriverAvailability()">
        ${editing ? 'Save availability' : 'Continue to Rates'}
      </button>
    `;
    icons();
  }

  function renderOnboardAvailability() {
    resetAvailDraft();
    paintAvailability();
  }

  window.closeDriverAvailSheet = function (id) {
    document.getElementById(id)?.classList.remove('visible');
  };

  window.selectDriverAvailTimePart = function (btn) {
    const col = btn.parentElement;
    col.querySelectorAll('.book-ride-time-opt').forEach((el) => el.classList.remove('selected'));
    btn.classList.add('selected');
    scrollAvailTimeOpt(col, btn);
  };

  window.openDriverAvailTime = function (target) {
    if (!availDraft) resetAvailDraft();
    availTimeTarget = target;
    const title = target.indexOf('End') !== -1 ? 'To' : 'From';
    const heading = document.getElementById('drvAvailTimeSheetTitle');
    if (heading) heading.textContent = title;
    const parts = parseAvailTimeParts(availDraft[target]);
    fillAvailTimeCol('drvAvailHourCol', AVAIL_HOURS, parts.hour);
    fillAvailTimeCol('drvAvailMinuteCol', AVAIL_MINUTES, parts.minute);
    fillAvailTimeCol('drvAvailPeriodCol', AVAIL_PERIODS, parts.period);
    document.getElementById('drvAvailTimeSheet')?.classList.add('visible');
    requestAnimationFrame(() => {
      ['drvAvailHourCol', 'drvAvailMinuteCol'].forEach((id) => {
        const col = document.getElementById(id);
        scrollAvailTimeOpt(col, col?.querySelector('.book-ride-time-opt.selected'));
      });
    });
    icons();
  };

  window.confirmDriverAvailTime = function () {
    const hour = document.querySelector('#drvAvailHourCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '07';
    const minute = document.querySelector('#drvAvailMinuteCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '30';
    const period = document.querySelector('#drvAvailPeriodCol .book-ride-period-btn.selected, #drvAvailPeriodCol .book-ride-time-opt.selected')?.getAttribute('data-val') || 'AM';
    let h = parseInt(hour, 10);
    if (period === 'AM') h = h === 12 ? 0 : h;
    else h = h === 12 ? 12 : h + 12;
    availDraft[availTimeTarget] = `${String(h).padStart(2, '0')}:${minute}`;
    window.closeDriverAvailSheet('drvAvailTimeSheet');
    paintAvailability();
  };

  function renderAvailCalendar() {
    const grid = document.getElementById('drvAvailCalGrid');
    const label = document.getElementById('drvAvailCalMonthLabel');
    if (!grid) return;
    const { year, month } = availCalCursor;
    if (label) {
      label.textContent = new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells = [];
    for (let i = 0; i < firstDow; i += 1) {
      cells.push(`<button type="button" class="book-ride-cal-day muted">${prevMonthDays - firstDow + 1 + i}</button>`);
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const selected = iso === availCalPending ? ' selected' : '';
      cells.push(`<button type="button" class="book-ride-cal-day${selected}" onclick="selectDriverAvailCalendarDay('${iso}')">${d}</button>`);
    }
    let next = 1;
    while (cells.length % 7 !== 0) {
      cells.push(`<button type="button" class="book-ride-cal-day muted">${next}</button>`);
      next += 1;
    }
    grid.innerHTML = cells.join('');
  }

  window.shiftDriverAvailCalendar = function (delta) {
    availCalCursor.month += delta;
    if (availCalCursor.month < 0) {
      availCalCursor.month = 11;
      availCalCursor.year -= 1;
    } else if (availCalCursor.month > 11) {
      availCalCursor.month = 0;
      availCalCursor.year += 1;
    }
    renderAvailCalendar();
    icons();
  };

  window.selectDriverAvailCalendarDay = function (iso) {
    availCalPending = iso;
    renderAvailCalendar();
  };

  window.openDriverAvailDate = function () {
    const iso = availDraft.pendingDate || '2026-09-09';
    availCalPending = iso;
    const parts = iso.split('-').map(Number);
    availCalCursor = { year: parts[0], month: parts[1] - 1 };
    renderAvailCalendar();
    document.getElementById('drvAvailDateSheet')?.classList.add('visible');
    icons();
  };

  window.confirmDriverAvailDate = function () {
    availDraft.pendingDate = availCalPending;
    window.closeDriverAvailSheet('drvAvailDateSheet');
    paintAvailability();
  };

  window.addDriverException = function () {
    if (!availDraft) resetAvailDraft();
    const date = availDraft.pendingDate;
    if (!date) return toast('Choose a date', 'error');
    if (!availDraft.exceptions.includes(date)) availDraft.exceptions.push(date);
    availDraft.exceptions.sort();
    availDraft.pendingDate = '';
    paintAvailability();
  };

  window.removeDriverException = function (iso) {
    if (!availDraft) resetAvailDraft();
    availDraft.exceptions = availDraft.exceptions.filter((item) => item !== iso);
    paintAvailability();
  };

  function reflectDriverToDOM(d, provider) {
    if (typeof document === 'undefined') return;

    // A. Provider Search Card (Parent Search Results List)
    const card = document.querySelector(`.provider-result-card[data-provider-id="${provider.id || 'tariq'}"]`);
    if (card) {
      const img = card.querySelector('.provider-card-avatar, .pcm-avatar');
      if (img && provider.photo) {
        img.src = provider.photo;
        img.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
      }
      const nameEl = card.querySelector('.pcm-name, .provider-name-verified span');
      if (nameEl) nameEl.textContent = provider.name;

      const verifiedIcon = card.querySelector('.pcm-verified-badge, .pcs-verified-icon');
      if (verifiedIcon) {
        verifiedIcon.style.display = provider.verified ? 'inline-flex' : 'none';
      }

      const ratingEl = card.querySelector('.pcm-rating-val, .rating-badge');
      if (ratingEl) {
        ratingEl.innerHTML = `<span class="pcm-star pcs-star" aria-hidden="true">★</span> ${Number(provider.rating || 4.9).toFixed(1)}`;
      }

      const zoneEl = card.querySelector('.pcm-zone-name, .pcs-zone');
      if (zoneEl) zoneEl.textContent = (provider.serviceArea || provider.zone || 'Greenfield').split('/')[0].trim();

      const vNameEl = card.querySelector('.pcm-vehicle-name');
      if (vNameEl) {
        const vMake = d.vehicle?.make || 'Toyota';
        const vModel = d.vehicle?.model || 'Sienna';
        vNameEl.textContent = `${vMake} ${vModel}`;
      }
    }

    // B. Provider Details Page (if open or viewing Tariq)
    if (window.currentDriverProfileId === provider.id || window.currentDriverProfileId === 'tariq') {
      const pImg = document.getElementById('detailsProviderImg');
      if (pImg && provider.photo) {
        pImg.src = provider.photo;
        pImg.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
      }
      const pName = document.getElementById('detailsProviderName');
      if (pName) pName.textContent = provider.name;

      const pRating = document.getElementById('detailsProviderRatingVal');
      if (pRating) pRating.textContent = '★ ' + Number(provider.rating || 4.9).toFixed(1);

      const pZone = document.getElementById('detailsZoneText');
      if (pZone) pZone.textContent = provider.serviceArea || provider.zone || 'School corridor';

      const vTitle = document.getElementById('detailsProviderVehTitle');
      if (vTitle) vTitle.textContent = provider.vehicle;

      const vSub = document.getElementById('detailsProviderVehSubtitle');
      if (vSub) vSub.textContent = `${provider.seats} seats · Plate ${provider.plate || '—'}`;

      const sSeats = document.getElementById('specSeatsText');
      if (sSeats) sSeats.textContent = `${provider.seats} seats`;

      const sPlate = document.getElementById('specPlateText');
      if (sPlate) sPlate.textContent = provider.plate || '—';

      const sAvail = document.getElementById('detailsAvailText');
      if (sAvail && typeof window.formatProviderSchedule === 'function') {
        sAvail.textContent = window.formatProviderSchedule(provider);
      }

      const pAbout = document.getElementById('detailsAboutLabel');
      const firstName = (provider.name || 'Tariq').split(' ')[0];
      if (pAbout) pAbout.textContent = `About ${firstName}`;

      const pBio = document.getElementById('detailsProviderBio');
      if (pBio) {
        pBio.textContent = `${firstName} provides daily school rides with a focus on child safety, calm pickups, booster-ready seating, and on-time arrival at the school gate.`;
      }

      const pBook = document.getElementById('btnBookWithProvider');
      if (pBook) pBook.textContent = `Request ${firstName} →`;
    }

    // C. Parent Home Screen (Upcoming / Today's Trip card)
    const homeDriverName = document.getElementById('homeTodayDriverName');
    if (homeDriverName) homeDriverName.textContent = provider.name;

    const homeDriverPhoto = document.getElementById('homeTodayDriverPhoto');
    if (homeDriverPhoto && provider.photo) {
      homeDriverPhoto.src = provider.photo;
      homeDriverPhoto.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }

    const homeDriverScore = document.getElementById('homeTodayDriverScore');
    if (homeDriverScore) homeDriverScore.textContent = String(provider.rating != null ? provider.rating : '4.9');

    const homeMiniName = document.querySelector('.driver-mini-info .driver-mini-name span');
    if (homeMiniName) homeMiniName.textContent = provider.name;

    const homeMiniAvatar = document.querySelector('.driver-mini-info .driver-mini-avatar');
    if (homeMiniAvatar && provider.photo) {
      homeMiniAvatar.src = provider.photo;
      homeMiniAvatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }

    const homeMiniSub = document.querySelector('.driver-mini-info .driver-mini-sub span:first-child');
    if (homeMiniSub && d.vehicle) {
      homeMiniSub.textContent = `${d.vehicle.make || 'Toyota'} ${d.vehicle.model || 'Sienna'}`;
    }

    // D. Chat / Messaging Header
    const chatPeerName = document.querySelector('#screen-chat .chat-header-peer-name');
    if (chatPeerName && (!window.activeChatProviderId || window.activeChatProviderId === 'tariq')) {
      chatPeerName.textContent = provider.name;
    }
    const chatPeerAvatar = document.querySelector('#screen-chat .chat-peer-avatar');
    if (chatPeerAvatar && provider.photo && (!window.activeChatProviderId || window.activeChatProviderId === 'tariq')) {
      chatPeerAvatar.src = provider.photo;
      chatPeerAvatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }

    // E. Live Tracking Screen Driver Info
    const trackDriverName = document.querySelector('#trackingDriverProfileBtn .driver-mini-name span');
    if (trackDriverName) trackDriverName.textContent = provider.name;

    const trackDriverAvatar = document.querySelector('#trackingDriverProfileBtn .driver-mini-avatar');
    if (trackDriverAvatar && provider.photo) {
      trackDriverAvatar.src = provider.photo;
      trackDriverAvatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }

    const trackDriverVeh = document.querySelector('#trackingDriverProfileBtn .driver-mini-sub span:first-child');
    if (trackDriverVeh && d.vehicle) {
      trackDriverVeh.textContent = `${d.vehicle.make || 'Toyota'} ${d.vehicle.model || 'Sienna'}`;
    }

    // F. Booking Summary
    const summaryVeh = document.getElementById('summaryVehicleText');
    if (summaryVeh && state().bookingDraft?.providerId === provider.id) {
      summaryVeh.textContent = [provider.vehicle, provider.plate].filter(Boolean).join(' · ');
    }
    const summaryAvatar = document.getElementById('summaryProviderAvatar');
    if (summaryAvatar && provider.photo && state().bookingDraft?.providerId === provider.id) {
      summaryAvatar.src = provider.photo;
      summaryAvatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }
  }

  function syncDriverToProviders() {
    const d = state().driver;
    if (!d) return;
    const providers = state().providers || [];
    let provider = providers.find((p) => p.id === (d.id || 'tariq'));
    if (!provider) {
      provider = { id: d.id || 'tariq' };
      providers.push(provider);
      state().providers = providers;
    }

    // 1. Core Profile Sync
    provider.name = d.name || provider.name || 'Tariq Ahmed';
    provider.phone = d.phone || provider.phone || '+1 (416) 555-0182';
    provider.email = d.email || provider.email || 'tariq.ahmed@torontoschoolrides.ca';
    if (d.photo) provider.photo = d.photo;
    provider.zone = d.serviceArea || provider.zone || 'Greenfield / Midtown';
    provider.serviceArea = d.serviceArea || provider.serviceArea || 'Greenfield / Midtown';
    provider.bio = d.bio || d.about || provider.bio || 'Provides daily school rides with a focus on child safety, calm pickups, booster-ready seating, and on-time arrival at the school gate.';
    provider.about = provider.bio;
    provider.rating = d.rating != null ? d.rating : (provider.rating || 4.9);
    provider.reviewsCount = d.reviewsCount != null ? d.reviewsCount : (provider.reviewsCount || 128);

    // 2. Vehicle Sync
    if (d.vehicle) {
      const v = d.vehicle;
      const vehName = [v.make, v.model].filter(Boolean).join(' ');
      const yearStr = v.year ? ` (${v.year})` : '';
      provider.vehicle = (vehName ? `${vehName}${yearStr}` : provider.vehicle) || 'Toyota Sienna (2023)';
      provider.vehicleMake = v.make;
      provider.vehicleModel = v.model;
      provider.vehicleYear = v.year;
      provider.vehicleColor = v.color;
      provider.plate = v.plate || provider.plate || 'SCH-4091';
      provider.seats = Number(v.capacity || v.seats || provider.seats || 4);
      if (v.photo) provider.vehiclePhoto = v.photo;
    }

    // 3. Availability Sync
    if (d.availability) {
      provider.availability = d.availability;
    }

    // 4. Rate & Pricing Sync
    if (d.rate) {
      provider.baseWeekly = d.rate.amount || d.rate.recurringWeekly || provider.baseWeekly || 120;
      provider.listedRate = provider.baseWeekly;
      provider.negotiable = d.rate.negotiable !== false;
      provider.preferredPayment = d.rate.paymentMethod || provider.preferredPayment || 'e-Transfer · Cash';
      provider.rate = d.rate;
    }

    // 5. Verification & Documents (Section 4.6)
    if (d.documents) {
      provider.documents = d.documents;
    }
    const allApproved = d.verificationStatus === 'approved' || (d.documents && d.documents.length >= 5 && d.documents.every(doc => doc.status === 'approved'));
    provider.verified = allApproved;
    provider.verificationStatus = d.verificationStatus || (allApproved ? 'approved' : 'pending');

    // 6. Real-Time DOM Updates Across All Active Views
    reflectDriverToDOM(d, provider);
  }

  function syncTariqProviderAvailability() {
    syncDriverToProviders();
  }

  window.syncDriverToProviders = syncDriverToProviders;

  window.saveDriverAvailability = function () {
    if (!availDraft) resetAvailDraft();
    if (availDraft.morningOn && toMinutes(availDraft.morningEnd) <= toMinutes(availDraft.morningStart)) {
      toast('Morning window: To must be after From', 'error');
      return;
    }
    if (availDraft.afternoonOn && toMinutes(availDraft.afternoonEnd) <= toMinutes(availDraft.afternoonStart)) {
      toast('Afternoon window: To must be after From', 'error');
      return;
    }
    const d = ensureDriver();
    const days = availDraft.days && availDraft.days.length ? availDraft.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    d.availability.windows = [
      { id: 'w1', days: days, start: availDraft.morningStart, end: availDraft.morningEnd, label: 'Morning', enabled: availDraft.morningOn },
      { id: 'w2', days: days, start: availDraft.afternoonStart, end: availDraft.afternoonEnd, label: 'Afternoon', enabled: availDraft.afternoonOn }
    ];
    d.availability.weekly = days;
    d.availability.scheduleType = availDraft.scheduleType || 'recurring';
    d.availability.exceptions = (availDraft.exceptions || []).slice();
    d.availability.morningSlot = availDraft.morningOn ? formatWindow(d.availability.windows[0]) : 'Off';
    d.availability.afternoonSlot = availDraft.afternoonOn ? formatWindow(d.availability.windows[1]) : 'Off';
    d.onboarding.availability = true;
    syncTariqProviderAvailability();
    persist();
    toast('Availability saved');
    if (finishNestedOr()) return;
    window.navigateTo(d.onboarding.rate ? 'driverProfile' : 'driverOnboardRate');
  };

  window.driverMatchesParentSearch = function (draft) {
    const d = ensureDriver();
    if (window.H2SAvailability) {
      return window.H2SAvailability.matchesSearch(d.availability, draft || {});
    }
    const search = draft || {};
    const dateIso = search.startDate || search.tripDate || '';
    if (dateIso && (d.availability.exceptions || []).includes(dateIso)) return false;
    const pickup = search.outboundTime;
    const ret = search.returnTime;
    if (pickup && !timeInWindows(pickup, d.availability.windows)) return false;
    if (search.direction !== 'oneway' && ret && !timeInWindows(ret, d.availability.windows)) return false;
    return true;
  };

  function formatWindow(w) {
    if (!w) return '';
    return `${toLabel(w.start)} – ${toLabel(w.end)}`;
  }

  function toLabel(hhmm) {
    if (!hhmm) return '';
    if (hhmm.indexOf('AM') !== -1 || hhmm.indexOf('PM') !== -1) return hhmm;
    const [h, m] = hhmm.split(':').map(Number);
    const am = h < 12;
    const hr = h % 12 || 12;
    return `${String(hr).padStart(2, '0')}:${String(m).padStart(2, '0')} ${am ? 'AM' : 'PM'}`;
  }

  function toMinutes(value) {
    if (!value) return 0;
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
    const [h, m] = raw.split(':').map(Number);
    return h * 60 + m;
  }

  function renderDriverPaymentRates(feedId, isEditing) {
    const d = ensureDriver();
    const r = d.rate || {};
    const el = feed(feedId);
    if (!el) return;
    const editing = isEditing !== undefined ? isEditing : editingProfileChild();
    bindChildTitle(el, editing ? 'Payment & Rates' : 'Posted Rate & Payment');
    bindChildBack(el, editing ? "navigateTo('driverProfile')" : "navigateTo('driverOnboardAvailability')");

    el.innerHTML = `
      ${editing ? `
        <div class="p2p-payment-notice" style="display:flex; align-items:flex-start; gap:12px; background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:14px; margin-bottom:16px;">
          <div style="width:36px; height:36px; border-radius:10px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i data-lucide="shield-check" style="width:18px; height:18px;"></i>
          </div>
          <div>
            <div style="font-size:13.5px; font-weight:700; color:#0F172A; margin-bottom:2px;">100% Direct Parent Payments</div>
            <div style="font-size:12px; color:#64748B; line-height:1.4;">Ride fees stay directly between you and parents. Home2School takes 0% commission on your trips.</div>
          </div>
        </div>
      ` : stepIntro(5, 5, 'Posted rates & payment setup', 'Set your ride rates, service corridor, and where you will receive direct payments from parents.')}

      <!-- Ride Rates Card -->
      <div class="profile-form-section-card" style="margin-bottom: 14px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
          <i data-lucide="banknote" style="width:16px; height:16px; color:#1B2B68;"></i>
          <span style="font-size:14px; font-weight:700; color:#0F172A;">Ride Pricing & Rates</span>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Weekly posted rate ($ CAD / child)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="drvRateAmt" type="number" value="${esc(r.amount || 120)}" placeholder="120" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Single ride / daily rate (optional $ CAD)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="drvDailyAmt" type="number" value="${esc(r.dailyAmount || 35)}" placeholder="35" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Rate Flexibility</label>
          <div class="drv-toggle-row" style="display:flex; gap:8px; margin-top:4px;">
            <button type="button" id="drvNegYes" class="avail-type-btn ${r.negotiable ? 'active' : ''}" style="height:42px; font-size:13px; font-weight:700;" onclick="setDriverNegotiable(true)">
              <i data-lucide="message-circle" style="width:14px; height:14px;"></i>
              <span>Yes, negotiable</span>
            </button>
            <button type="button" id="drvNegNo" class="avail-type-btn ${!r.negotiable ? 'active' : ''}" style="height:42px; font-size:13px; font-weight:700;" onclick="setDriverNegotiable(false)">
              <i data-lucide="lock" style="width:14px; height:14px;"></i>
              <span>Fixed rate</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Payment Collection & Payout Card -->
      <div class="profile-form-section-card" style="margin-bottom: 14px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
          <i data-lucide="wallet" style="width:16px; height:16px; color:#1B2B68;"></i>
          <span style="font-size:14px; font-weight:700; color:#0F172A;">Payment Collection & Payout</span>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Preferred payment method</label>
          <div class="select-wrapper">
            <select class="form-select" id="drvPayMethod">
              ${['Interac e-Transfer · Cash', 'Interac e-Transfer', 'Cash', 'Direct Deposit'].map((m) => `<option ${(r.paymentMethod || 'Interac e-Transfer · Cash') === m ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="select-chevron" style="width:18px;height:18px;color:currentColor;"></i>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Payment handle (e-Transfer email or phone)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="drvPayHandle" value="${esc(r.paymentHandle || d.email || '')}" placeholder="driver@email.com or (416) 555-0199" />
          </div>
        </div>
      </div>

      <!-- Service Corridor & Distance Card -->
      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
          <i data-lucide="map-pin" style="width:16px; height:16px; color:#1B2B68;"></i>
          <span style="font-size:14px; font-weight:700; color:#0F172A;">Service Area & Corridor</span>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Service corridor / route</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="drvServiceArea" value="${esc(d.serviceArea || 'Midtown Toronto')}" placeholder="Midtown Toronto" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:4px;">
          <label class="form-label">Max service distance (km)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="drvMaxDistance" type="number" value="${esc(d.maxDistanceKm || 15)}" placeholder="15" />
          </div>
        </div>
        <p style="font-size:11.5px; color:#64748B; margin:6px 0 0 0; line-height:1.4;">
          Distance is used to match parents along your route corridor.
        </p>
      </div>

      <!-- Action Button -->
      <button type="button" class="avail-save-btn" onclick="saveDriverPaymentAndRates()">
        ${editing ? 'Save payment & rates' : 'Submit for review'}
      </button>
    `;
    icons();
  }

  function renderOnboardRate() {
    renderDriverPaymentRates('driverOnboardRateFeed', false);
  }

  function renderPayment() {
    renderDriverPaymentRates('driverPaymentFeed', true);
  }

  window.setDriverNegotiable = function (yes) {
    ensureDriver().rate.negotiable = yes;
    const btnYes = document.getElementById('drvNegYes');
    const btnNo = document.getElementById('drvNegNo');
    if (btnYes && btnNo) {
      if (yes) {
        btnYes.classList.add('active');
        btnNo.classList.remove('active');
      } else {
        btnYes.classList.remove('active');
        btnNo.classList.add('active');
      }
    }
  };

  window.saveDriverPaymentAndRates = function () {
    const d = ensureDriver();
    d.rate = d.rate || {};
    d.rate.amount = Number(val('drvRateAmt') || d.rate.amount || 120);
    d.rate.dailyAmount = Number(val('drvDailyAmt') || 35);
    const pay = val('drvPayMethod');
    if (pay) d.rate.paymentMethod = pay;
    d.rate.paymentHandle = val('drvPayHandle') || d.rate.paymentHandle || d.email || '';
    d.serviceArea = val('drvServiceArea') || 'Midtown Toronto';
    d.maxDistanceKm = Number(val('drvMaxDistance') || 15);
    d.onboarding.rate = true;
    syncDriverToProviders();
    persist();
    if (editingProfileChild()) {
      toast('Payment & rates updated');
      window.backNested('driverProfile');
    } else {
      if (finishNestedOr()) return;
      d.verificationStatus = 'pending';
      syncDriverToProviders();
      persist();
      window.navigateTo('driverPending');
    }
  };

  window.saveDriverRate = window.saveDriverPaymentAndRates;
  window.saveDriverPayment = window.saveDriverPaymentAndRates;

  function renderPending() {
    const d = ensureDriver();
    const el = feed('driverPendingFeed');
    if (!el) return;
    const back = el.closest('.screen-view')?.querySelector('.back-btn');
    if (back) back.setAttribute('onclick', "navigateTo('driverSetup')");
    el.innerHTML = `
      <div class="empty-trips-card">
        <div class="empty-trips-icon"><i data-lucide="shield"></i></div>
        <h4 class="empty-trips-title">Verification pending</h4>
        <p class="empty-trips-desc">Home2School reviews your documents before you can accept bookings. You will get an in-app notice when a decision is ready.</p>
      </div>
      ${renderDocList(d, 'driverPending')}
      <div class="drv-proto-box">
        <p>Prototype only</p>
        <button type="button" class="btn-primary" onclick="mockApproveDriver()">Approve driver</button>
        <button type="button" class="btn-secondary-surface" style="margin-top:8px;" onclick="mockDriverDocReject()">Mark licence as action required</button>
      </div>
    `;
  }

  window.mockApproveDriver = function () {
    const d = ensureDriver();
    d.verificationStatus = 'approved';
    d.documents.forEach((doc) => { doc.status = 'approved'; doc.rejectReason = ''; });
    d.subscription = d.subscription || {};
    if (d.subscription.status !== 'active') {
      d.subscription.status = 'trial';
      d.subscription.trialDaysLeft = d.subscription.trialDaysLeft || 14;
    }
    persist();
    toast('Driver approved');
    window.navigateTo('driverHome');
  };

  window.mockDriverDocReject = function () {
    const d = ensureDriver();
    const licence = d.documents.find((doc) => doc.id === 'licence');
    if (licence) {
      licence.status = 'action_required';
      licence.rejectReason = 'Photo is cropped. Upload a full, unexpired licence.';
    }
    persist();
    renderPending();
    icons();
  };

  function renderSubscription() {
    const d = ensureDriver();
    const sub = d.subscription;
    const el = feed('driverSubscriptionFeed');
    if (!el) return;
    bindChildTitle(el, 'Platform access');
    bindChildBack(el, "backNested('driverProfile')");
    const titleEl = el.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Platform access';
    el.classList.add('sub-screen-body');
    const failed = sub.status === 'failed';
    const isTrial = sub.status === 'trial';
    const isActive = sub.status === 'active';
    const kicker = isTrial ? 'Free trial' : isActive ? 'Active' : failed ? 'Payment failed' : 'Not started';
    const title = isTrial
      ? `${sub.trialDaysLeft} days remaining`
      : isActive
        ? (sub.plan === 'annual' ? '$279 / year' : '$29 / month')
        : 'Manage platform access';
    const subtitle = sub.status === 'none' ? 'Monthly or annual platform access' : `Renews ${sub.renewal || 'Oct 8, 2026'}`;
    
    const planName = sub.plan === 'annual' ? 'annual' : 'monthly';
    const planPrice = sub.plan === 'annual' ? '$279/yr' : '$29/mo';
    
    let ctaSection = '';
    if (failed) {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="recoverDriverPayment()">Retry payment</button>
      `;
    } else if (isActive) {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateDriverSubscription()">Save ${planName} plan</button>
        <button type="button" class="sub-cancel-link" onclick="cancelDriverSubscription()">Cancel subscription</button>
      `;
    } else if (isTrial) {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateDriverSubscription()">Activate ${planName} access (${planPrice})</button>
        <button type="button" class="sub-btn-secondary-link" onclick="continueDriverTrial()">Keep free trial for now</button>
      `;
    } else {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateDriverSubscription()">Start 14-day free trial</button>
      `;
    }

    el.innerHTML = `
      <div class="sub-simple-intro">
        <h3 class="sub-screen-lede">Choose your plan</h3>
        <p class="sub-screen-note">Platform fee — not your ride rate.</p>
      </div>
      <div class="sub-status-strip" data-status="${esc(sub.status)}">
        <span class="sub-status-kicker">${kicker}</span>
        <strong class="sub-status-title">${title}</strong>
        <span class="sub-status-sub">${subtitle}</span>
      </div>
      <div class="sub-plan-block" role="radiogroup" aria-label="Driver plan">
        <button type="button" class="sub-plan-card ${sub.plan === 'annual' ? 'active' : ''}" onclick="selectDriverPlan('annual')">
          <span class="sub-plan-radio" aria-hidden="true"><i data-lucide="check"></i></span>
          <span class="sub-plan-copy">
            <span class="sub-plan-name">Annual</span>
            <span class="sub-plan-desc">Best value for the school year</span>
          </span>
          <span class="sub-plan-pricing">
            <span class="sub-plan-price">$279/year</span>
            <span class="sub-plan-compare">$348/year</span>
          </span>
          <span class="sub-plan-badge sub-plan-badge-save">Save 20%</span>
        </button>
        <button type="button" class="sub-plan-card ${sub.plan === 'monthly' ? 'active' : ''}" onclick="selectDriverPlan('monthly')">
          <span class="sub-plan-radio" aria-hidden="true"><i data-lucide="check"></i></span>
          <span class="sub-plan-copy">
            <span class="sub-plan-name">Monthly</span>
            <span class="sub-plan-desc">Individual platform access</span>
          </span>
          <span class="sub-plan-pricing">
            <span class="sub-plan-price">$29/month</span>
          </span>
        </button>
      </div>

      <div class="sub-actions">
        ${ctaSection}
      </div>
    `;
    icons();
  }

  window.selectDriverPlan = function (plan) {
    ensureDriver().subscription.plan = plan;
    renderSubscription();
    icons();
  };

  window.continueDriverTrial = function () {
    const d = ensureDriver();
    d.subscription.status = 'trial';
    d.subscription.history = d.subscription.history || [];
    d.subscription.history.unshift({ id: 'dsub-' + Date.now(), label: '14-day driver trial continued', date: 'Sep 8, 2026', amount: '$0.00' });
    persist();
    toast('Free trial active. 14 days remaining.');
    if (typeof window.backNested === 'function') window.backNested('driverProfile');
    else window.navigateTo('driverProfile');
  };

  window.activateDriverSubscription = function () {
    const d = ensureDriver();
    d.subscription.status = 'active';
    d.subscription.history = d.subscription.history || [];
    d.subscription.history.unshift({
      id: 'dsub-' + Date.now(),
      label: d.subscription.plan === 'annual' ? 'Annual plan activated' : 'Monthly plan activated',
      date: 'Sep 8, 2026',
      amount: d.subscription.plan === 'annual' ? '$279.00' : '$29.00'
    });
    persist();
    toast('Platform access activated');
    if (typeof window.backNested === 'function') window.backNested('driverProfile');
    else window.navigateTo('driverProfile');
  };

  window.cancelDriverSubscription = function () {
    const d = ensureDriver();
    d.subscription.status = 'cancelled';
    d.subscription.history = d.subscription.history || [];
    d.subscription.history.unshift({
      id: 'dsub-' + Date.now(),
      label: 'Automatic renewal cancelled',
      date: 'Sep 8, 2026',
      amount: '$0.00'
    });
    persist();
    renderSubscription();
    toast('Renewal cancelled. Access continues until period ends.');
  };

  window.recoverDriverPayment = function () {
    const d = ensureDriver();
    if (d.subscription.status !== 'failed') return;
    d.subscription.status = 'active';
    d.subscription.history = d.subscription.history || [];
    d.subscription.history.unshift({
      id: 'dsub-' + Date.now(),
      label: 'Failed payment recovered',
      date: 'Sep 8, 2026',
      amount: d.subscription.plan === 'annual' ? '$279.00' : '$29.00'
    });
    persist();
    renderSubscription();
    toast('Payment recovered');
  };

  function newRequests() {
    return ensureDriver().requests.filter((r) => r.status === 'new');
  }

  function assignedBookings() {
    return (state().bookings || []).filter((b) => b.providerId === ensureDriver().id && ['confirmed', 'in_progress'].includes(b.status));
  }

  function passengerKids(booking) {
    if (Array.isArray(booking?.children) && booking.children.length) {
      return booking.children.filter(Boolean);
    }
    return (booking?.childIds || []).map((id) => {
      const c = (state().children || []).find((ch) => ch.id === id);
      return c ? { id: c.id, name: c.name, age: c.age, grade: c.grade, notes: c.notes, photo: c.photo } : null;
    }).filter(Boolean);
  }

  function parentLabel(item) {
    return item?.parentName || 'Parent';
  }

  function passengerSub(item, kind) {
    const kids = kind === 'request' ? childShort(item) : (item.childNames || childShort(item) || 'Passengers');
    return `${kids} · ${parentLabel(item)}`;
  }

  function deriveSchedule() {
    const d = ensureDriver();
    const items = [];
    assignedBookings().forEach((b) => {
      const roster = passengerKids(b);
      const names = roster.map((c) => c.name.split(' ')[0]).join(' + ') || 'Passengers';
      const seats = roster.length || 1;
      const active = b.status === 'in_progress';
      items.push({
        id: b.id + '-am',
        bookingId: b.id,
        requestId: null,
        time: b.outboundTime || '07:30 AM',
        childNames: names,
        children: roster,
        parentId: b.parentId || 'PRNT-9042',
        parentName: b.parentName || 'Sadia Khan',
        route: `${b.pickupLocation} → ${b.schoolLocation}`,
        from: b.pickupLocation,
        to: b.schoolLocation,
        leg: 'morning',
        legLabel: 'Morning · home → school',
        seats,
        notes: b.notes || roster.map((c) => c.notes).filter(Boolean)[0] || '',
        status: active && (d.activeTrip?.leg !== 'afternoon') ? 'active' : 'upcoming',
        isActionableNow: true,
        when: b.scheduleText || 'Tue, Sep 9, 2026'
      });
      if (b.direction === 'bothway' && b.returnTime) {
        items.push({
          id: b.id + '-pm',
          bookingId: b.id,
          requestId: null,
          time: b.returnTime,
          childNames: names,
          children: roster,
          parentId: b.parentId || 'PRNT-9042',
          parentName: b.parentName || 'Sadia Khan',
          route: `${b.schoolLocation} → ${b.pickupLocation}`,
          from: b.schoolLocation,
          to: b.pickupLocation,
          leg: 'afternoon',
          legLabel: 'Afternoon · school → home',
          seats,
          notes: b.notes || roster.map((c) => c.notes).filter(Boolean)[0] || '',
          status: 'upcoming',
          isActionableNow: false,
          when: b.scheduleText || 'Tue, Sep 9, 2026'
        });
      }
    });
    d.requests.filter((r) => r.status === 'accepted').forEach((r) => {
      if (items.some((item) => item.requestId === r.id)) return;
      items.push({
        id: r.id + '-am',
        requestId: r.id,
        bookingId: r.bookingId,
        time: r.pickupTime,
        childNames: childShort(r),
        children: kids(r),
        parentId: r.parentId,
        parentName: r.parentName,
        route: `${r.pickupLocation} → ${r.dropoffLocation}`,
        from: r.pickupLocation,
        to: r.dropoffLocation,
        leg: 'morning',
        legLabel: 'Morning · home → school',
        seats: r.seatsNeeded,
        notes: r.notes || '',
        status: 'upcoming',
        isActionableNow: true,
        when: r.dateLabel,
        frequency: r.frequency
      });
      if (r.returnTime) {
        items.push({
          id: r.id + '-pm',
          requestId: r.id,
          bookingId: r.bookingId,
          time: r.returnTime,
          childNames: childShort(r),
          children: kids(r),
          parentId: r.parentId,
          parentName: r.parentName,
          route: `${r.dropoffLocation} → ${r.pickupLocation}`,
          from: r.dropoffLocation,
          to: r.pickupLocation,
          leg: 'afternoon',
          legLabel: 'Afternoon · school → home',
          seats: r.seatsNeeded,
          notes: r.notes || '',
          status: 'upcoming',
          isActionableNow: false,
          when: r.dateLabel,
          frequency: r.frequency
        });
      }
    });
    return items.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }

  function timeInWindows(timeStr, windows) {
    const mins = toMinutes(timeStr);
    return (windows || []).some((w) => {
      if (!w || w.enabled === false) return false;
      return mins >= toMinutes(w.start) && mins <= toMinutes(w.end);
    });
  }

  function seatsBookedAt(timeStr, ignoreId) {
    return deriveSchedule().filter((item) => item.time === timeStr && item.requestId !== ignoreId && item.bookingId !== ignoreId).reduce((sum, item) => sum + (item.seats || 0), 0);
  }

  function homeMode() {
    const d = ensureDriver();
    const demo = d.homeScenario;
    const schedule = deriveSchedule();
    const incoming = newRequests();
    const active = schedule.find((item) => item.status === 'active') || (d.activeTripStage > 0 ? schedule[0] : null);
    if (demo === 'A') return { kind: incoming.length ? 'requests' : 'idle', incoming, schedule: [], next: null };
    if (active && demo !== 'A') return { kind: 'active', incoming, schedule, next: active };
    if (demo === 'C' && schedule[0]) return { kind: 'soon', incoming, schedule, next: schedule[0] };
    if (schedule.length) return { kind: 'upcoming', incoming, schedule, next: schedule[0] };
    if (incoming.length) return { kind: 'requests', incoming, schedule, next: null };
    return { kind: 'idle', incoming, schedule, next: null };
  }

  function renderHome() {
    const d = ensureDriver();
    const greet = document.getElementById('driverHomeGreeting');
    const meta = document.getElementById('driverHomeMeta');
    const avatar = document.getElementById('driverHomeAvatar');
    const first = (d.name || 'Tariq').split(' ')[0];
    if (greet) greet.textContent = `Hello, ${first}`;
    if (meta) {
      meta.textContent = isApproved(d)
        ? `${d.vehicle?.make || ''} ${d.vehicle?.model || ''} • ${d.vehicle?.capacity || 0} seats`
        : 'Finish setup to accept school rides';
    }
    syncDriverOnlineUi(d);
    if (avatar) {
      avatar.src = d.photo || '/assets/avatar_tariq.jpg';
      avatar.alt = d.name || 'Driver';
      avatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_tariq.jpg'; };
    }
    const view = homeMode();
    const hero = document.getElementById('driverHeroContainer');
    const feedEl = document.getElementById('driverHomeFeed');
    if (hero) hero.innerHTML = renderHero(view, d);
    const rest = view.schedule.filter((item) => !view.next || item.id !== view.next.id);
    if (feedEl) {
      feedEl.innerHTML = `
        <div class="drv-home-section">
          <h3 class="drv-home-heading">Quick actions</h3>
          <div class="drv-home-actions">
            <button type="button" class="drv-home-action drv-qa-availability" onclick="openNestedScreen('driverOnboardAvailability')">
              <span class="drv-home-action-ico"><i data-lucide="clock"></i></span>
              <span class="drv-home-action-label">Availability</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-docs" onclick="openNestedScreen('driverOnboardDocs')">
              <span class="drv-home-action-ico"><i data-lucide="shield-check"></i></span>
              <span class="drv-home-action-label">Documents</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-earnings" onclick="openNestedScreen('driverPayment')">
              <span class="drv-home-action-ico"><i data-lucide="credit-card"></i></span>
              <span class="drv-home-action-label">Earnings</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-sos" onclick="window.openEmergencySOSModal()">
              <span class="drv-home-action-ico"><i data-lucide="shield-alert"></i></span>
              <span class="drv-home-action-label">Safety SOS</span>
            </button>
          </div>
        </div>
        <div class="drv-home-section">
          <div class="drv-home-section-row">
            <h3 class="drv-home-heading">Today’s trips</h3>
            <button type="button" class="drv-home-see-all" onclick="navigateTo('driverSchedule')">See all <i data-lucide="chevron-right"></i></button>
          </div>
          ${rest.length
            ? `<div class="drv-home-trip-list">${rest.map((item) => homeTripRow(item)).join('')}</div>`
            : `<div class="drv-home-empty">No more trips today</div>`}
        </div>
      `;
    }
    ['A', 'B', 'C'].forEach((sc) => {
      document.getElementById('dchipScenario' + sc)?.classList.toggle('active', d.homeScenario === sc);
    });
    icons();
  }

  function timeParts(label) {
    const raw = String(label || '').trim();
    const m = raw.match(/(\d{1,2}:\d{2})\s*(AM|PM)?/i);
    return { clock: m ? m[1] : raw || '--', mer: m && m[2] ? m[2].toUpperCase() : '' };
  }

  function routeShort(route) {
    return String(route || '')
      .replace(/\s*→\s*/g, ' → ')
      .replace(/Greenfield International School/gi, 'Greenfield International')
      .trim();
  }

  function routeEnds(route) {
    const parts = routeShort(route).split(/\s*→\s*/).filter(Boolean);
    return {
      from: parts[0] || 'Pickup',
      to: parts[1] || parts[0] || 'Drop-off'
    };
  }

  function routeRailMarkup(route, compact) {
    const ends = routeEnds(route);
    return `<div class="drv-route-rail${compact ? ' is-compact' : ''}" aria-hidden="true">
      <div class="drv-route-rail-track">
        <span class="drv-route-dot is-filled"></span>
        <span class="drv-route-line"></span>
        <span class="drv-route-dot is-hollow"></span>
      </div>
      <div class="drv-route-rail-copy">
        <span class="drv-route-stop">${esc(ends.from)}</span>
        <span class="drv-route-stop">${esc(ends.to)}</span>
      </div>
    </div>`;
  }

  function homeTripRow(item) {
    const d = dateParts(item.when || item.dateLabel);
    const click = item.isActionableNow ? `onclick="startDriverTrip('${item.id}')"` : `onclick="navigateTo('driverSchedule')"`;
    const badge = item.leg === 'afternoon' ? 'Return' : 'Round trip';
    return `<button type="button" class="drv-home-trip" ${click}>
      <div class="drv-home-trip-date">
        <span class="drv-home-trip-month">${esc(d.month)}</span>
        <span class="drv-home-trip-day">${esc(d.day)}</span>
        <span class="drv-home-trip-wd">${esc(d.weekday || '')}</span>
      </div>
      <div class="drv-home-trip-body">
        <div class="drv-home-trip-top">
          <span class="drv-home-trip-time">${esc(item.time)}</span>
          <span class="drv-home-trip-badge">${esc(badge)}</span>
        </div>
        ${routeRailMarkup(item.route, true)}
        <p class="drv-home-trip-kids">${esc(item.childNames || passengerSub(item, 'schedule'))}</p>
      </div>
      <i data-lucide="chevron-right" class="drv-home-trip-chevron"></i>
    </button>`;
  }

  function compactTrip(item, kind) {
    if (kind === 'request') {
      const d = dateParts(item.dateLabel);
      const kindLabel = tripKindLabel(item);
      return `<div class="trip-card-compact" onclick="openDriverRequest('${item.id}')">
        <div class="trip-date-block">
          <span class="td-month">${esc(d.month)}</span>
          <span class="td-day">${esc(d.day)}</span>
          <span class="td-weekday">${esc(d.weekday || 'New')}</span>
        </div>
        <div class="trip-compact-content">
          <div class="trip-compact-top">
            <span class="trip-compact-time">${esc(timeLine(item))}</span>
            <span class="${item.direction === 'oneway' ? 'one-way-badge' : 'both-way-badge'}">${esc(kindLabel)}</span>
          </div>
          <div class="trip-compact-route">${esc(item.pickupLocation || '')} ⇄ ${esc(item.dropoffLocation || '')}</div>
          <div class="trip-compact-sub">${esc(passengerSub(item, 'request'))} · ${esc(item.rateLabel || '')}</div>
        </div>
      </div>`;
    }
    return homeTripRow(item);
  }

  function renderHero(view, d) {
    if (view.kind === 'idle') {
      return `<div class="drv-home-section">
        <div class="drv-home-empty-card">
          <div class="drv-home-empty-ico"><i data-lucide="calendar-x"></i></div>
          <h4>No trips on deck</h4>
          <p>New requests show up here.</p>
          <button type="button" class="btn-primary" onclick="navigateTo('driverRequests')">View requests</button>
        </div>
        ${!canAccept(d) ? `<p class="drv-home-gate">Finish setup to accept.</p>` : ''}
      </div>`;
    }
    if (view.kind === 'requests') {
      const req = view.incoming[0];
      return `<div class="drv-home-section">
        <div class="drv-home-section-row">
          <h3 class="drv-home-heading">New request</h3>
          <button type="button" class="drv-home-see-all" onclick="navigateTo('driverRequests')">See all <i data-lucide="chevron-right"></i></button>
        </div>
        ${compactTrip(req, 'request')}
      </div>`;
    }
    if (view.kind === 'upcoming') {
      const next = view.next;
      return `<div class="drv-home-section">
        <div class="drv-home-section-row">
          <h3 class="drv-home-heading">Upcoming trip</h3>
          <button type="button" class="drv-home-see-all" onclick="navigateTo('driverSchedule')">See all <i data-lucide="chevron-right"></i></button>
        </div>
        ${activeTripCard(next, d, 'upcoming')}
      </div>`;
    }
    return `<div class="drv-home-section">${activeTripCard(view.next, d, 'active')}</div>`;
  }

  function activeTripCard(next, d, mode) {
    if (!next) return '';
    const live = mode === 'active';
    const cta = live ? 'Open trip' : "I'm On the Way";
    const kids = next.children || [];
    const avatars = kids.slice(0, 2).map((c, i) => `<img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" onerror="this.src='/assets/avatar_arman.jpg'" />`).join('')
      || `<img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" onerror="this.src='/assets/avatar_arman.jpg'" />`;
    const parentPhoto = PARENTS[next.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const parentId = next.parentId || 'PRNT-9042';
    const seats = d.vehicle?.capacity || 4;
    return `<div class="drv-active-card">
      <div class="drv-active-head">
        <h3 class="drv-home-heading">${live ? 'Active trip' : 'Upcoming trip'}</h3>
        <span class="drv-live-pill${live ? '' : ' is-soon'}"><span class="drv-live-dot"></span>${live ? 'Live' : 'Soon'}</span>
      </div>
      <div class="drv-active-meta">
        <span><i data-lucide="clock"></i> ${esc(next.time)}</span>
        <span class="drv-active-meta-divider" aria-hidden="true"></span>
        <span><i data-lucide="users"></i> ${seats} seats</span>
      </div>
      ${routeRailMarkup(next.route || '')}
      <div class="drv-active-kids-row">
        <div class="child-avatar-cluster">${avatars}</div>
        <div class="drv-active-kids">${esc(next.childNames)}</div>
      </div>
      <div class="drv-active-parent">
        <div class="drv-active-parent-info">
          <img src="${esc(parentPhoto)}" alt="" class="drv-active-parent-avatar" onerror="this.src='/assets/avatar_sadia.jpg'" />
          <div>
            <div class="drv-active-parent-name">${esc(parentLabel(next))}</div>
            <div class="drv-active-parent-role">Parent</div>
          </div>
        </div>
        <div class="drv-active-parent-actions">
          <button type="button" class="drv-active-ico-btn mvp-hide-phone" onclick="event.stopPropagation()" aria-label="Call" style="display:none;"><i data-lucide="phone"></i></button>
          <button type="button" class="drv-active-ico-btn" onclick="event.stopPropagation(); openChatWith('${esc(parentId)}')" aria-label="Message"><i data-lucide="message-square"></i></button>
        </div>
      </div>
      <button type="button" class="btn-primary drv-active-cta" onclick="startDriverTrip('${next.id}', '${mode}')">
        <span>${cta}</span>
        <i data-lucide="arrow-right"></i>
      </button>
    </div>`;
  }

  function scheduleRow(item) {
    return homeTripRow(item);
  }

  function ensureParentRequestChrome() {
    const screen = document.getElementById('screen-driverRequests');
    if (!screen) return;
    screen.classList.add('drv-req-screen');
    screen.querySelector('.dreq-sticky')?.remove();
    let bar = screen.querySelector('.top-bar-sticky');
    if (!bar) {
      bar = document.createElement('div');
      bar.className = 'top-bar-sticky drv-req-topbar';
      const status = screen.querySelector('.status-bar');
      if (status) status.insertAdjacentElement('afterend', bar);
    }
    bar.classList.add('drv-req-topbar');
    if (!bar.querySelector('.drv-req-heading')) {
      bar.innerHTML = `
        <button type="button" class="back-btn" onclick="navigateTo('driverHome')" aria-label="Back"><i data-lucide="chevron-left"></i></button>
        <div class="drv-req-heading">
          <h2 class="top-bar-title">Requests</h2>
        </div>
        <span class="drv-req-top-spacer" aria-hidden="true"></span>`;
    }
    let tabs = screen.querySelector('.drv-req-tabs') || screen.querySelector('.segmented-control');
    if (!tabs) {
      tabs = document.createElement('div');
      tabs.className = 'segmented-control drv-req-tabs';
      tabs.setAttribute('role', 'tablist');
      tabs.setAttribute('aria-label', 'Request status');
      tabs.innerHTML = `<button type="button" class="segment-btn active" id="btnDReqNew" role="tab" aria-selected="true" onclick="switchDriverRequestsTab('new')">New</button><button type="button" class="segment-btn" id="btnDReqAccepted" role="tab" aria-selected="false" onclick="switchDriverRequestsTab('accepted')">Accepted</button><button type="button" class="segment-btn" id="btnDReqDeclined" role="tab" aria-selected="false" onclick="switchDriverRequestsTab('declined')">Declined</button>`;
    }
    tabs.classList.add('segmented-control', 'drv-req-tabs');
    tabs.querySelectorAll('button').forEach((btn) => {
      btn.classList.remove('dreq-tab');
      btn.classList.add('segment-btn');
    });
    let tabWrap = screen.querySelector('.drv-req-tabs-wrap');
    if (!tabWrap) {
      tabWrap = document.createElement('div');
      tabWrap.className = 'drv-req-tabs-wrap';
      bar.insertAdjacentElement('afterend', tabWrap);
    }
    if (tabs.parentElement !== tabWrap) tabWrap.appendChild(tabs);
    const scroll = screen.querySelector('.screen-scroll-body');
    if (scroll) {
      scroll.classList.remove('dreq-scroll');
      scroll.classList.add('drv-req-scroll');
    }
    const wrap = document.getElementById('driverRequestsListWrap');
    if (wrap) wrap.className = 'drv-req-list';
  }

  function setRequestTabButtons(tab, counts) {
    const buttons = [
      ['btnDReqNew', 'new', `New (${counts.new})`],
      ['btnDReqAccepted', 'accepted', `Accepted (${counts.accepted})`],
      ['btnDReqDeclined', 'declined', `Declined (${counts.declined})`]
    ];
    buttons.forEach(([id, key, label]) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      btn.textContent = label;
      btn.classList.toggle('active', tab === key);
      btn.setAttribute('aria-selected', tab === key ? 'true' : 'false');
    });
  }

  function requestStatusChip(status) {
    if (status === 'accepted') return '<span class="drv-req-chip drv-req-chip-status"><i data-lucide="check"></i> Accepted</span>';
    if (status === 'declined') return '<span class="drv-req-chip drv-req-chip-status is-declined"><i data-lucide="x"></i> Declined</span>';
    return '';
  }

  function formatScheduleTitle(raw) {
    if (!raw) return 'Mon, Sep 7, 2026';
    let s = String(raw).trim();
    if (/mon.*fri/i.test(s)) return 'Mon – Fri Weekly';
    if (/mon.*wed/i.test(s)) return 'Mon – Wed Weekly';
    if (/tue.*thu/i.test(s)) return 'Tue – Thu Weekly';
    if (s.includes('•') || s.includes('|')) {
      s = s.split('•')[0].split('|')[0].trim();
    }
    return s || 'Today';
  }

  function requestCard(req, tabArg) {
    const tab = tabArg || state()._driverReqTab || 'new';
    const name = req.parentName || 'Parent';
    const from = cleanPlace(req.pickupLocation) || 'Pickup';
    const to = cleanPlace(req.dropoffLocation) || 'Drop-off';
    const photo = req.parentPhoto || PARENTS[req.parentId]?.photo || '/assets/avatar_sadia.jpg';
    
    // Format Date & Times
    const displayDate = formatScheduleTitle(req.frequency === 'recurring' 
      ? (req.recurringDays && req.recurringDays.length ? 'Weekly (' + req.recurringDays.join(', ') + ')' : 'Mon – Fri Weekly')
      : (dateShort(req.dateLabel) || 'Sep 17, 2026'));
    
    const pickupT = req.pickupTime || '07:30 AM';
    const returnT = req.returnTime || '';
    const timesText = returnT ? pickupT + ' & ' + returnT : pickupT;
    
    const isBoth = req.direction === 'bothway' || (returnT && returnT.length > 0);
    const dirPillHtml = isBoth
      ? `<span style="background:rgba(27,43,104,0.08); color:#1B2B68; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="refresh-cw" style="width:11px; height:11px;"></i> Round Trip</span>`
      : `<span style="background:#FFF7ED; color:#EA580C; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right" style="width:11px; height:11px;"></i> One-way</span>`;

    // Parse price
    const priceVal = String(req.rate || (req.rateLabel ? req.rateLabel.replace(/\D/g, '') : '45') || '45');

    // Contextual actions
    let actionHtml = '';
    if (tab === 'new') {
      actionHtml = `
        <div style="display:flex; align-items:center; gap:6px;" onclick="event.stopPropagation();">
          <button type="button" onclick="declineDriverRequest('${req.id}')" style="background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; border-radius:99px; padding:5px 12px; font-size:11.5px; font-weight:700; cursor:pointer;">
            Decline
          </button>
          <button type="button" onclick="acceptDriverRequest('${req.id}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:5px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
            Accept
          </button>
        </div>`;
    } else if (req.status === 'declined') {
      actionHtml = '<span style="background:#FEE2E2; color:#DC2626; font-size:11px; font-weight:700; padding:3px 8px; border-radius:99px;">Declined</span>';
    } else {
      actionHtml = `
        <div style="width:28px; height:28px; border-radius:50%; background:#F8FAFC; color:#94A3B8; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:15px; height:15px;"></i>
        </div>`;
    }

    return `
      <article class="h2s-booking-card" onclick="openDriverRequest('${req.id}')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:12px 14px; margin-bottom:10px; box-shadow:0 1px 3px rgba(15,23,42,0.03); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.15s ease;">
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

        <!-- Middle Row: Route Rail & Payout -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:10px;">
          <div style="display:flex; flex-direction:column; gap:6px; flex:1; min-width:0; position:relative; padding-left:2px;">
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; background:#1B2B68; flex-shrink:0;"></span>
              <span style="font-size:12.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${from}</span>
            </div>
            <div style="position:absolute; left:5px; top:6px; bottom:6px; width:1.5px; border-left:1.5px dashed #CBD5E1; z-index:1;"></div>
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; border:2px solid #1B2B68; background:#FFFFFF; flex-shrink:0; box-sizing:border-box;"></span>
              <span style="font-size:12.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${to}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:12px; flex-shrink:0; padding-left:12px; border-left:1px solid #F1F5F9;">
            <div style="font-size:21px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">$${priceVal.replace(/^\$/, '')}</div>
          </div>
        </div>

        <!-- Footer Row: Parent & Kids Info & Actions -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:9px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${photo}" alt="" style="width:32px; height:32px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_sadia.jpg';" />
            <div>
              <div style="font-size:12.5px; font-weight:700; color:#0F172A; line-height:1.2;">${name}</div>
              <div style="font-size:11px; font-weight:600; color:#64748B; margin-top:1px;">${childShort(req)}</div>
            </div>
          </div>
          ${actionHtml}
        </div>
      </article>`;
  }

  function syncParentBookingStatus(req, next) {
    const bookings = state().bookings || [];
    const booking = bookings.find((b) => b.id === req.bookingId);
    if (!booking) return;
    if (next === 'accepted') booking.status = 'confirmed';
    if (next === 'declined') booking.status = 'declined';
  }

  function refreshRequestViews(tab) {
    if (tab) state()._driverReqTab = tab;
    renderRequests(state()._driverReqTab || 'new');
    if (document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
      renderRequestDetail();
    }
  }
  window.refreshDriverRequests = refreshRequestViews;

  function ingestBookingAsRequest(booking) {
    const d = ensureDriver();
    if (!booking || booking.providerId !== d.id) return;
    if ((d.requests || []).some((r) => r.bookingId === booking.id)) return;
    const roster = passengerKids(booking);
    const period = booking.frequency === 'recurring' ? 'week' : 'day';
    const rate = booking.amount || d.rate?.amount || 0;
    const user = state().user || {};
    const mapped = booking.status === 'confirmed' || booking.status === 'in_progress'
      ? 'accepted'
      : (booking.status === 'declined' || booking.status === 'cancelled' ? 'declined' : 'new');
    d.requests.unshift(normalizeRequest({
      id: 'dreq-' + booking.id,
      bookingId: booking.id,
      parentId: booking.parentId || user.id,
      parentName: booking.parentName || user.name || 'Parent',
      parentRole: booking.parentRole || 'Parent',
      parentPhoto: booking.parentPhoto || user.photo,
      parentPhone: booking.parentPhone || user.phone,
      children: roster,
      seatsNeeded: roster.length || (booking.childIds || []).length || 1,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.schoolLocation,
      dateLabel: booking.scheduleText || booking.createdAt || '',
      pickupTime: booking.outboundTime,
      returnTime: booking.returnTime || '',
      recurringDays: booking.frequency === 'recurring' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] : [],
      frequency: booking.frequency === 'recurring' ? 'recurring' : 'onetime',
      direction: booking.direction === 'oneway' ? 'oneway' : 'bothway',
      rate,
      rateLabel: `$${rate} / ${period}`,
      notes: '',
      status: mapped
    }));
    persist();
  }

  function paymentHandleBlock(req, d) {
    const booking = (state().bookings || []).find((b) => b.id === req.bookingId || b.id === req.id || ('dreq-' + b.id) === req.id);
    const handleStatus = booking?.paymentHandleStatus || (req.status === 'accepted' ? 'shared' : 'not_requested');
    const handleValue = booking?.paymentHandle || d.rate?.paymentHandle || d.paymentHandle || 'tariq.ahmed@interac.ca';

    if (handleStatus === 'requested') {
      return `
      <section class="drv-req-block" style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <i data-lucide="shield-alert" style="width:18px; height:18px; color:#2563EB;"></i>
          <h4 class="drv-req-label" style="margin:0; font-size:13.5px; font-weight:700; color:#1E40AF;">Payment Details Requested</h4>
        </div>
        <p class="drv-req-note" style="margin:0 0 12px 0; color:#334155; font-size:12.5px; line-height:1.4;">
          Parent requested your Interac e-Transfer handle to send ride payments directly. Home2School never collects ride fees or processes escrow.
        </p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-primary" style="flex:1; min-width:140px; padding:9px 12px; font-size:12.5px;" onclick="window.consentPaymentDetails('${esc(booking ? booking.id : req.bookingId)}')">
            Share e-Transfer (${esc(handleValue)})
          </button>
          <button type="button" class="btn-secondary" style="flex:1; min-width:110px; padding:9px 12px; font-size:12.5px;" onclick="window.chooseCashPayment('${esc(booking ? booking.id : req.bookingId)}')">
            Agree on Cash
          </button>
        </div>
      </section>`;
    }

    if (handleStatus === 'shared') {
      return `
      <section class="drv-req-block" style="background:#F0FDF4; border:1.5px solid #BBF7D0; border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <i data-lucide="check-circle-2" style="width:18px; height:18px; color:#16A34A;"></i>
          <h4 class="drv-req-label" style="margin:0; font-size:13.5px; font-weight:700; color:#166534;">Payment Handle Shared</h4>
        </div>
        <p class="drv-req-value" style="font-weight:700; color:#0F172A; margin:4px 0 2px 0; font-size:14px;">${esc(handleValue)}</p>
        <p class="drv-req-note" style="margin:0; font-size:12px; color:#475569;">Parent has direct access to send payment via Interac e-Transfer. 100% of ride fees stay with you.</p>
      </section>`;
    }

    if (handleStatus === 'cash') {
      return `
      <section class="drv-req-block" style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <i data-lucide="banknote" style="width:18px; height:18px; color:#D97706;"></i>
          <h4 class="drv-req-label" style="margin:0; font-size:13.5px; font-weight:700; color:#92400E;">Cash Payment Confirmed</h4>
        </div>
        <p class="drv-req-note" style="margin:0; font-size:12px; color:#475569;">Parent will pay in cash directly to you on the first day of the schedule.</p>
      </section>`;
    }

    if (req.status === 'accepted') {
      return `
      <section class="drv-req-block">
        <h4 class="drv-req-label">Payment</h4>
        <p class="drv-req-note">${esc(d.rate?.paymentMethod || 'e-Transfer · Cash')}. Home2School does not collect the ride fee.</p>
      </section>`;
    }

    return '';
  }

  function scheduleDetailRows(req) {
    const rows = [];
    if (req.dateLabel) rows.push(['Date', dateShort(req.dateLabel)]);
    if (req.pickupTime) rows.push(['Pickup', req.pickupTime]);
    if (req.direction !== 'oneway' && req.returnTime) rows.push(['Return', req.returnTime]);
    if (req.frequency === 'recurring') {
      const days = (req.recurringDays || []).join(', ') || 'Mon–Fri';
      const until = req.untilLabel || req.recurrenceEndDate || '';
      rows.push(['Repeats', until ? `${days} · until ${until}` : days]);
    } else {
      rows.push(['Trip', tripKindLabel(req)]);
    }
    return rows.map(([label, value]) => `
      <div class="drv-req-kv">
        <span class="drv-req-kv-label">${esc(label)}</span>
        <span class="drv-req-kv-value">${esc(value)}</span>
      </div>`).join('');
  }

  function renderRequests(tab) {
    ensureParentRequestChrome();
    const d = ensureDriver();
    state()._driverReqTab = tab;
    const wrap = document.getElementById('driverRequestsListWrap');
    if (!wrap) return;
    const counts = {
      new: d.requests.filter((r) => r.status === 'new').length,
      accepted: d.requests.filter((r) => r.status === 'accepted').length,
      declined: d.requests.filter((r) => r.status === 'declined').length
    };
    setRequestTabButtons(tab, counts);
    const list = d.requests.filter((r) => r.status === tab);
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-trips-card"><div class="empty-trips-icon"><i data-lucide="inbox"></i></div><h4 class="empty-trips-title">No ${tab} requests</h4><p class="empty-trips-desc">New requests show up here.</p></div>`;
      icons();
      return;
    }
    wrap.innerHTML = list.map((req) => requestCard(req, tab)).join('');
    icons();
  }

  window.openDriverRequest = function (id) {
    ensureDriver().selectedRequestId = id;
    window.navigateTo('driverRequestDetail');
  };

  window.openDriverDocsFromRequest = function () {
    state()._docsReturnTo = 'driverRequestDetail';
    if (typeof window.openNestedScreen === 'function') window.openNestedScreen('driverOnboardDocs');
    else window.navigateTo('driverOnboardDocs');
  };

  function selectedRequest() {
    const d = ensureDriver();
    return d.requests.find((r) => r.id === d.selectedRequestId) || null;
  }

  function renderRequestDetail() {
    const d = ensureDriver();
    const req = selectedRequest();
    const el = feed('driverRequestDetailFeed');
    if (!el) return;
    const screen = el.closest('.screen-view');
    const titleEl = screen?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Request';
    const back = screen?.querySelector('.back-btn');
    if (back) back.setAttribute('onclick', "navigateTo('driverRequests')");
    if (!req) {
      el.innerHTML = `<div class="empty-trips-card"><div class="empty-trips-icon"><i data-lucide="inbox"></i></div><h4 class="empty-trips-title">This request is no longer available</h4></div>`;
      icons();
      return;
    }
    const reason = acceptBlockReason(d) || requestCapacityBlock(d, req);
    const blocked = !reason;
    const docsBlocked = missingRequiredDocs(d).length > 0;
    const isNew = req.status === 'new';
    const passengers = kids(req).map((c) => {
      const school = c.school || req.dropoffLocation || '';
      const sub = [c.grade, school].filter(Boolean).join(' · ');
      const kidPhoto = c.photo || (c.id === 'arman' ? '/assets/avatar_arman.jpg' : c.id === 'emma' ? '/assets/avatar_emma.jpg' : '/assets/avatar_zara.jpg');
      return `<div class="drv-req-passenger" style="display:flex; align-items:center; gap:12px; padding:8px 0; border-bottom:1px solid #F1F5F9;">
        <img class="drv-req-passenger-avatar" src="${esc(kidPhoto)}" alt="" style="width:40px; height:40px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_arman.jpg'" />
        <div style="min-width:0; flex:1;">
          <div class="drv-req-passenger-name" style="font-size:14px; font-weight:700; color:#0F172A;">${esc(c.name)}</div>
          ${sub ? `<div class="drv-req-passenger-sub" style="font-size:12px; color:#64748B; margin-top:2px;">${esc(sub)}</div>` : ''}
        </div>
      </div>`;
    }).join('') || `<p class="drv-req-note">No passengers listed</p>`;
    const booking = (state().bookings || []).find((b) => b.id === req.bookingId || b.id === req.id || ('dreq-' + b.id) === req.id);
    const hasAgreedRate = booking && booking.agreedRate && booking.rateStatus === 'agreed';
    const displayRate = hasAgreedRate ? booking.agreedRate : (booking?.listedRate || req.rate || 28);
    const period = req.frequency === 'recurring' ? 'week' : 'trip';
    const rateText = hasAgreedRate 
      ? `Agreed rate: ${displayRate} / ${period}`
      : `Listed rate: ${displayRate} / ${period}${d.rate?.negotiable && isNew ? ' · negotiable' : ''}`;

    const parentPhoto = req.parentPhoto || PARENTS[req.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const parentName = req.parentName || PARENTS[req.parentId]?.name || 'Sadia Khan';
    const parentPhone = req.parentPhone || PARENTS[req.parentId]?.phone || '+1 (416) 555-0192';

    el.innerHTML = `
      <!-- 1. Top Parent Profile Card with Direct Message Icon -->
      <section class="drv-req-parent-card">
        <div style="display:flex; align-items:center; gap:12px; min-width:0; flex:1; text-align:left;">
          <div style="position:relative; flex-shrink:0;">
            <img src="${esc(parentPhoto)}" alt="${esc(parentName)}" style="width:46px; height:46px; border-radius:50%; object-fit:cover; border:2px solid var(--color-primary, #1B2B68);" onerror="this.src='/assets/avatar_sadia.jpg';" />
            <span style="position:absolute; bottom:0; right:0; background:#10B981; border:2px solid #fff; width:11px; height:11px; border-radius:50%;" title="Verified Parent"></span>
          </div>
          <div style="min-width:0; flex:1; text-align:left;">
            <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
              <h3 style="font-size:15px; font-weight:800; color:#0F172A; margin:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${esc(parentName)}</h3>
              <span style="background:#EFF6FF; color:#1D4ED8; font-size:10px; font-weight:700; padding:1px 6px; border-radius:99px;">Verified</span>
            </div>
            <div style="font-size:12px; color:#64748B; margin-top:2px; font-weight:500;">
              Primary Guardian • ${esc(parentPhone)}
            </div>
          </div>
        </div>
        <button type="button" class="btn-icon-subtle" onclick="openChatWith('${esc(req.parentId || 'sadia')}')" title="Message Parent" aria-label="Message Parent" style="width:38px; height:38px; border-radius:10px; background:#EFF6FF; color:var(--color-primary, #1B2B68); border:1px solid #BFDBFE; display:inline-flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:all 0.15s;" onmouseover="this.style.background='#DBEAFE'" onmouseout="this.style.background='#EFF6FF'">
          <i data-lucide="message-square" style="width:18px; height:18px;"></i>
        </button>
      </section>

      <!-- 2. Children Card -->
      <section class="drv-req-block" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-bottom:12px;">
        <h4 class="drv-req-label" style="font-size:11px; font-weight:800; color:#1B2B68; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">Children</h4>
        <div style="display:flex; flex-direction:column; gap:4px;">
          ${passengers}
        </div>
      </section>

      <!-- 3. Route Card -->
      <section class="drv-req-block" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-bottom:12px;">
        <h4 class="drv-req-label" style="font-size:11px; font-weight:800; color:#1B2B68; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">Route</h4>
        <p class="drv-req-route drv-req-route-detail" style="font-size:13.5px; font-weight:700; color:#0F172A; display:flex; align-items:center; gap:8px; margin:0;"><i data-lucide="map-pin" style="color:var(--color-primary, #1B2B68); width:16px; height:16px; flex-shrink:0;"></i><span>${esc(req.pickupLocation || '')} → ${esc(req.dropoffLocation || '')}</span></p>
        <div style="display:flex; gap:8px; margin-top:8px; font-size:12px; color:#475569; align-items:center; flex-wrap:wrap;">
          <span style="display:inline-flex; align-items:center; gap:4px; font-weight:700; color:#0F172A;"><i data-lucide="navigation" style="width:13px; height:13px; color:var(--color-primary, #1B2B68);"></i> 8.6 km route</span>
          <span>•</span>
          <span>Est. 22 min driving</span>
          <span>•</span>
          <span style="color:#16A34A; font-weight:700;">Within 15 km corridor</span>
        </div>
      </section>

      <!-- 4. Schedule Card -->
      <section class="drv-req-block" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-bottom:12px;">
        <h4 class="drv-req-label" style="font-size:11px; font-weight:800; color:#1B2B68; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">Schedule</h4>
        ${scheduleDetailRows(req)}
      </section>

      ${req.notes ? `<section class="drv-req-block" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-bottom:12px;"><h4 class="drv-req-label" style="font-size:11px; font-weight:800; color:#1B2B68; text-transform:uppercase; letter-spacing:0.5px; margin:0 0 8px 0;">Special Notes</h4><p class="drv-req-note" style="font-size:13px; color:#475569; line-height:1.45; margin:0;">${esc(req.notes)}</p></section>` : ''}

      ${paymentHandleBlock(req, d)}

      ${isNew && blocked ? `<div class="drv-req-gate" role="status" style="margin-bottom:12px;">
        <p>${esc(reason)}</p>
        ${docsBlocked ? `<button type="button" class="drv-req-gate-link" onclick="openDriverDocsFromRequest()">Documents</button>` : ''}
      </div>` : ''}

      <!-- Bottom CTAs: Accept & Decline (No redundant message button) -->
      <div class="drv-req-detail-actions" style="display:flex; flex-direction:column; gap:10px; margin-top:8px; margin-bottom:24px;">
        ${isNew ? `
          <button type="button" class="btn-primary${blocked ? ' is-disabled' : ''}" ${blocked ? 'disabled' : ''} onclick="acceptDriverRequest('${req.id}')" style="height:46px; font-size:14px; font-weight:800; border-radius:12px;">Accept at ${displayRate}/${period}</button>
          <button type="button" class="drv-req-decline-btn" onclick="declineDriverRequest('${req.id}')" style="height:44px; font-size:13.5px; font-weight:700; border-radius:12px; background:#FFF1F2; border:1px solid #FECDD3; color:#E11D48; cursor:pointer;">Decline</button>
        ` : ''}
      </div>
    `;
    icons();
  }

  window.acceptDriverRequest = function (reqId) {
    const d = ensureDriver();
    // Demo-ready: keep partner docs approved so Accept works in the prototype.
    (d.documents || []).forEach((doc) => {
      if (doc && doc.status !== 'approved') {
        doc.status = 'approved';
        if (!doc.fileDoc) doc.fileDoc = { name: `${doc.id}.pdf`, attached: true };
        else doc.fileDoc.attached = true;
      }
    });
    if (!isApproved(d)) d.verificationStatus = 'approved';
    if (!hasAccess(d)) {
      d.subscription = d.subscription || {};
      d.subscription.status = 'trial';
      d.subscription.trialDaysLeft = d.subscription.trialDaysLeft || 14;
    }
    const req = d.requests.find((r) => r.id === reqId);
    if (!req) {
      toast('Request not found', 'error');
      return;
    }
    if (req.status !== 'new') {
      toast('This request was already handled', 'info');
      refreshRequestViews(req.status === 'accepted' ? 'accepted' : 'declined');
      return;
    }
    const reason = acceptBlockReason(d) || requestCapacityBlock(d, req);
    if (reason) {
      toast(reason, 'error');
      if (document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
        renderRequestDetail();
      }
      return;
    }
    req.status = 'accepted';
    syncParentBookingStatus(req, 'accepted');
    persist();
    toast('Accepted');
    if (document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
      window.navigateTo('driverRequests');
    }
    refreshRequestViews('accepted');
  };

  window.declineDriverRequest = function (reqId) {
    const d = ensureDriver();
    const req = d.requests.find((r) => r.id === reqId);
    if (!req) {
      toast('Request not found', 'error');
      return;
    }
    if (req.status !== 'new') {
      toast('This request was already handled', 'info');
      refreshRequestViews(req.status === 'accepted' ? 'accepted' : 'declined');
      return;
    }
    req.status = 'declined';
    syncParentBookingStatus(req, 'declined');
    persist();
    toast('Request declined — moved to Declined');
    if (document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
      window.navigateTo('driverRequests');
    }
    refreshRequestViews('declined');
  };

  function renderSchedule(tab) {
    state()._driverSchedTab = tab;
    const wrap = document.getElementById('driverScheduleListWrap');
    const screen = document.getElementById('screen-driverSchedule');
    if (screen) screen.classList.add('drv-sched-screen');
    if (!wrap) return;
    const all = deriveSchedule().map((item) => {
      if (!item.when) item.when = 'Tue, Sep 9, 2026';
      return item;
    });
    const today = all.filter((item) => item.leg === 'morning' || item.leg === 'afternoon');
    const morning = today.filter((item) => item.leg === 'morning');
    const returns = today.filter((item) => item.leg === 'afternoon');
    const upcoming = all.filter((item) => item.frequency === 'onetime');
    const listMode = tab === 'upcoming' ? 'upcoming' : 'today';
    const btnT = document.getElementById('btnDSchedToday');
    const btnU = document.getElementById('btnDSchedUpcoming');
    if (btnT) {
      btnT.textContent = `Today (${morning.length + returns.length})`;
      btnT.classList.toggle('active', listMode === 'today');
    }
    if (btnU) {
      const upCount = upcoming.length || Math.max(all.length - (morning.length + returns.length), 0);
      btnU.textContent = `Upcoming (${upCount || all.length})`;
      btnU.classList.toggle('active', listMode === 'upcoming');
    }

    if (listMode === 'upcoming') {
      const pool = upcoming.length ? upcoming : all;
      if (!pool.length) {
        wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="calendar"></i></div><h4>Nothing scheduled</h4><p>Accepted trips show here.</p></div>`;
        icons();
        return;
      }
      wrap.innerHTML = `<div class="drv-sched-list" style="display:flex; flex-direction:column; gap:12px;">${pool.map((item) => scheduleCard(item)).join('')}</div>`;
      icons();
      return;
    }

    if (!morning.length && !returns.length) {
      wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="calendar"></i></div><h4>Nothing scheduled</h4><p>Accepted trips show here.</p></div>`;
      icons();
      return;
    }
    const todayAll = [...morning, ...returns];
    wrap.innerHTML = `<div class="drv-sched-list" style="display:flex; flex-direction:column; gap:12px;">${todayAll.map((item) => scheduleCard(item)).join('')}</div>`;
    icons();
  }

  function passengerAvatars(item) {
    const roster = (item.children || []).slice(0, 3);
    const tones = ['rose', 'mint', 'sky', 'sand'];
    const bits = roster.map((c, i) => {
      const label = String(c.name || 'C').trim().split(/\s+/)[0];
      const initial = (label[0] || 'C').toUpperCase();
      return `<span class="drv-sched-ava tone-${tones[i % tones.length]}" title="${esc(label)}">${esc(initial)}</span>`;
    });
    if (item.parentName) {
      const initial = parentInitials(item.parentName).slice(0, 1);
      bits.push(`<span class="drv-sched-ava tone-sand" title="${esc(item.parentName)}">${esc(initial)}</span>`);
    }
    return bits.join('');
  }

  function passengerLine(item) {
    const kidBits = (item.children || []).map((c) => String(c.name || '').split(' ')[0]).filter(Boolean);
    const fallback = String(item.childNames || '').split(/\s*\+\s*/).map((s) => s.trim()).filter(Boolean);
    const kids = kidBits.length ? kidBits : fallback;
    if (item.parentName) return `${kids.join(' • ')}${kids.length ? ' • ' : ''}${item.parentName}`;
    return kids.join(' • ') || 'Passengers';
  }

  function scheduleCard(item) {
    const actionable = !!item.isActionableNow;
    const open = item.status === 'active';
    
    // Format Date & Time cleanly
    const rawDate = item.when || item.dateLabel || 'Mon, Sep 7, 2026';
    const displayDate = formatScheduleTitle(rawDate);
    const timeText = item.time || '07:30 AM';
    
    const from = cleanPlace(item.from || item.pickupLocation) || 'Pickup';
    const to = cleanPlace(item.to || item.dropoffLocation || item.schoolLocation) || 'School';
    const parentPhoto = PARENTS[item.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const parentName = item.parentName || 'Sadia Khan';
    const kidsText = item.childNames || 'Children';

    let ctaHtml = '';
    if (open) {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startDriverTrip('${item.id}', 'active')" style="background:var(--color-primary, #1B2B68); color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(27,43,104,0.25);">
            <span class="live-dot-pulse" style="width:6px; height:6px; background:#60A5FA; border-radius:50%;"></span>
            <span>Live Trip</span>
          </button>
        </div>`;
    } else if (actionable) {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startDriverTrip('${item.id}', 'soon')" style="background:var(--color-primary, #1B2B68); color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
            <i data-lucide="send" style="width:11px; height:11px;"></i>
            <span>Start</span>
          </button>
        </div>`;
    } else {
      ctaHtml = `
        <div style="width:28px; height:28px; border-radius:50%; background:#F8FAFC; color:#94A3B8; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:15px; height:15px;"></i>
        </div>`;
    }

    // Determine Round Trip vs 1-Way Trip
    const booking = (state().bookings || []).find((b) => b.id === item.bookingId);
    const isRound = item.isRoundTrip || (item.returnTime != null) || (item.leg === 'afternoon') || (booking && booking.direction === 'bothway') || (item.frequency === 'recurring');
    const tripTypePill = isRound
      ? `<span style="background:rgba(27,43,104,0.08); color:#1B2B68; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="repeat" style="width:11px; height:11px;"></i> Round Trip</span>`
      : `<span style="background:#F1F5F9; color:#475569; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right" style="width:11px; height:11px;"></i> 1-Way Trip</span>`;

    return `
      <article class="h2s-booking-card" onclick="startDriverTrip('${item.id}', '${open ? 'active' : (actionable ? 'soon' : 'prep')}')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; box-shadow:0 1px 4px rgba(15,23,42,0.04); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.15s ease;">
        <!-- Top Row: Date & Trip Type Pill -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(27,43,104,0.08); color:#1B2B68; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="calendar" style="width:17px; height:17px;"></i>
            </div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#0F172A; line-height:1.2;">${displayDate}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:2px;">${timeText}</div>
            </div>
          </div>
          ${tripTypePill}
        </div>

        <!-- Middle Row: Route Rail (Clean, full width without redundant seats count) -->
        <div style="margin-bottom:12px; background:#F8FAFC; border-radius:12px; padding:10px 12px; border:1px solid #F1F5F9;">
          <div style="display:flex; flex-direction:column; gap:8px; position:relative; padding-left:2px;">
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; background:#1B2B68; flex-shrink:0;"></span>
              <span style="font-size:12.5px; font-weight:700; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${from}</span>
            </div>
            <div style="position:absolute; left:5.5px; top:8px; bottom:8px; width:1px; border-left:1.5px dashed #CBD5E1; z-index:1;"></div>
            <div style="display:flex; align-items:center; gap:8px; position:relative; z-index:2;">
              <span style="width:8px; height:8px; border-radius:50%; border:2px solid #1B2B68; background:#FFFFFF; flex-shrink:0; box-sizing:border-box;"></span>
              <span style="font-size:12.5px; font-weight:700; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${to}</span>
            </div>
          </div>
        </div>

        <!-- Footer Row: Parent & Kids Info & Action -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${parentPhoto}" alt="" style="width:34px; height:34px; border-radius:50%; object-fit:cover; border:1.5px solid #E2E8F0;" onerror="this.src='/assets/avatar_sadia.jpg';" />
            <div>
              <div style="font-size:13px; font-weight:800; color:#0F172A; line-height:1.2;">${parentName}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:1px;">${kidsText}</div>
            </div>
          </div>
          ${ctaHtml}
        </div>
      </article>`;
  }

  function findLeg(id) {
    return deriveSchedule().find((item) => item.id === id) || deriveSchedule()[0];
  }

    window.startDriverTrip = function (legId, mode) {
    const d = ensureDriver();
    const leg = findLeg(legId);
    if (!leg) return;
    d.activeTrip = {
      id: leg.id,
      bookingId: leg.bookingId,
      requestId: leg.requestId,
      parentId: leg.parentId,
      leg: leg.leg,
      childState: {}
    };
    (leg.children || []).forEach((c) => { d.activeTrip.childState[c.id || c.name] = 'riding'; });
    const live = assignedBookings().some((b) => b.id === leg.bookingId && b.status === 'in_progress');
    if (mode === 'soon' || mode === 'way') d.activeTripStage = 1;
    else if (live || mode === 'active') d.activeTripStage = Math.max(d.activeTripStage, 3);
    else d.activeTripStage = 0;
    persist();
    if (d.activeTripStage > 0) window.navigateTo('driverActiveTrip');
    else window.navigateTo('driverTripPrep');
  };

  function tripContext() {
    const d = ensureDriver();
    if (d.activeTrip) {
      const fromReq = d.requests.find((r) => r.id === d.activeTrip.requestId);
      const fromLeg = deriveSchedule().find((item) => item.id === d.activeTrip.id);
      return fromLeg || (fromReq && {
        childNames: childShort(fromReq),
        children: kids(fromReq),
        from: d.activeTrip.leg === 'afternoon' ? fromReq.dropoffLocation : fromReq.pickupLocation,
        to: d.activeTrip.leg === 'afternoon' ? fromReq.pickupLocation : fromReq.dropoffLocation,
        time: d.activeTrip.leg === 'afternoon' ? fromReq.returnTime : fromReq.pickupTime,
        parentId: fromReq.parentId,
        parentName: fromReq.parentName,
        notes: fromReq.notes,
        legLabel: d.activeTrip.leg === 'afternoon' ? 'Afternoon · school → home' : 'Morning · home → school'
      });
    }
    return deriveSchedule()[0];
  }

  function renderTripPrep() {
    const ctx = tripContext();
    const el = feed('driverTripPrepFeed');
    if (!el || !ctx) return;
    el.innerHTML = `
      <div class="trip-card">
        <div class="trip-card-top">
          <div class="date-badge-box">
            <span class="db-month">${esc(dateParts(ctx.when || ctx.dateLabel).month)}</span>
            <span class="db-day">${esc(dateParts(ctx.when || ctx.dateLabel).day)}</span>
            <span class="db-weekday">${esc(dateParts(ctx.when || ctx.dateLabel).weekday || 'Wed')}</span>
          </div>
          <div>
            <h3 class="card-title-navy">${esc(ctx.childNames)}</h3>
            <p class="card-desc-muted">${esc(ctx.legLabel || 'Next trip')} · ${esc(ctx.time || '')}</p>
            <p class="card-desc-muted">${esc(ctx.from)} → ${esc(ctx.to)}</p>
            <p class="card-desc-muted">${esc(ctx.parentName || 'Parent')}</p>
          </div>
        </div>
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="beginDriverTrip()">I'm On the Way</button>
      </div>
    `;
    icons();
  }

  window.beginDriverTrip = function () {
    const d = ensureDriver();
    d.activeTripStage = 1;
    persist();
    window.navigateTo('driverActiveTrip');
  };

  function tripNote(ctx) {
    const kidsList = Array.isArray(ctx?.children) ? ctx.children : [];
    const withNote = kidsList.find((c) => c && c.notes);
    if (withNote) {
      const firstName = String(withNote.name || '').split(' ')[0];
      const note = String(withNote.notes || '').trim();
      if (/booster/i.test(note) && firstName) return `Booster seat for ${firstName}`;
      if (note) return note.length > 42 ? note.slice(0, 40) + '…' : note;
    }
    if (ctx?.notes) {
      const first = String(ctx.notes).split(/[.;]/)[0].trim();
      if (first) return first.length > 42 ? first.slice(0, 40) + '…' : first;
    }
    return '';
  }

  function shortPlace(value) {
    const cleaned = cleanPlace(value);
    if (!cleaned) return value || '';
    return cleaned.replace(/,\s*Toronto.*$/i, '').trim() || cleaned;
  }

  function renderActiveTrip() {
    const d = ensureDriver();
    const ctx = tripContext() || {};
    const stage = TRIP_STAGES[d.activeTripStage] || TRIP_STAGES[0];
    const chip = document.getElementById('driverMilestoneText');
    const title = document.getElementById('driverActiveTargetTitle');
    const desc = document.getElementById('driverActiveTargetDesc');
    const eta = document.getElementById('driverActiveTripTimeLeft');
    const btn = document.getElementById('btnDriverMilestoneText');
    const btnWrap = document.getElementById('btnDriverMilestoneAction');
    const msg = document.getElementById('driverTripMessageBtn');
    const pin = document.getElementById('driverCockpitPin');
    const progressPath = document.getElementById('drvRouteProgress');
    const avatars = document.getElementById('driverActiveKidsAvatars');
    const noteChip = document.getElementById('driverActiveNoteChip');
    const slideWrap = document.getElementById('driverSlideConfirm');
    const place = d.activeTripStage >= 3 ? (ctx.to || '') : (ctx.from || '');
    const kidsList = Array.isArray(ctx.children) ? ctx.children.filter(Boolean) : [];
    const useSlide = /arrived/i.test(stage.cta || '') && !stage.attendance;

    if (chip) chip.textContent = stage.chip;
    if (title) title.textContent = shortPlace(place);
    if (desc) {
      const leg = (ctx.legLabel || '').replace(/^Morning\s*·\s*/i, 'Morning · ').replace(/^Afternoon\s*·\s*/i, 'Afternoon · ');
      const shortLeg = /morning/i.test(leg) ? 'Morning pickup' : (/afternoon/i.test(leg) ? 'Afternoon drop-off' : (leg || 'Trip'));
      desc.textContent = `${ctx.childNames || childShort(ctx) || 'Children'} · ${shortLeg}`;
    }
    if (eta) eta.textContent = ctx.time || '';
    if (btn) btn.textContent = stage.cta;
    if (msg) msg.setAttribute('onclick', `openChatWith('${ctx.parentId || 'PRNT-9042'}')`);
    if (avatars) {
      avatars.innerHTML = kidsList.slice(0, 3).map((c, i) => {
        const src = esc(c.photo || '/assets/avatar_arman.jpg');
        return `<img src="${src}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" onerror="this.src='/assets/avatar_arman.jpg'" />`;
      }).join('') || `
        <img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" onerror="this.onerror=null;this.src='/assets/avatar_arman.jpg';" />
        <img src="/assets/avatar_emma.jpg" alt="" class="avatar-img-circle overlap" onerror="this.onerror=null;this.src='/assets/avatar_arman.jpg';" />`;
    }
    if (noteChip) {
      const note = tripNote(ctx);
      noteChip.textContent = note || '';
      noteChip.classList.toggle('is-hidden', !note);
    }
    if (btnWrap) btnWrap.hidden = !!useSlide;
    if (slideWrap) {
      slideWrap.hidden = !useSlide;
      if (useSlide) resetDriverSlide(stage.cta);
    }
    if (pin && stage.pin) {
      pin.style.left = stage.pin.left;
      pin.style.top = stage.pin.top;
    }
    if (progressPath) {
      const p = Math.max(6, Math.min(96, stage.progress || 22));
      progressPath.style.strokeDasharray = `${p} 100`;
    }
    state().trackingStageIndex = stage.parentSync;
    icons();
  }

  function resetDriverSlide(cta) {
    const track = document.getElementById('driverSlideTrack');
    const thumb = document.getElementById('driverSlideThumb');
    const label = document.getElementById('driverSlideLabel');
    if (!track || !thumb) return;
    track.classList.remove('is-done');
    thumb.style.transform = 'translateX(0)';
    if (label) label.textContent = /destination/i.test(cta || '') ? 'Slide to confirm arrival' : 'Slide to confirm arrival';
    bindDriverSlide();
  }

  let slideBound = false;
  function bindDriverSlide() {
    const track = document.getElementById('driverSlideTrack');
    const thumb = document.getElementById('driverSlideThumb');
    if (!track || !thumb || slideBound) return;
    slideBound = true;
    let dragging = false;
    let startX = 0;
    let startLeft = 0;

    const maxTravel = () => Math.max(0, track.clientWidth - thumb.offsetWidth - 8);

    const setX = (x) => {
      const max = maxTravel();
      const next = Math.max(0, Math.min(max, x));
      thumb.style.transform = `translateX(${next}px)`;
      return next;
    };

    const onStart = (clientX) => {
      if (track.classList.contains('is-done')) return;
      dragging = true;
      startX = clientX;
      const match = /translateX\(([-\d.]+)px\)/.exec(thumb.style.transform || '');
      startLeft = match ? parseFloat(match[1]) : 0;
    };

    const onMove = (clientX) => {
      if (!dragging) return;
      setX(startLeft + (clientX - startX));
    };

    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      const match = /translateX\(([-\d.]+)px\)/.exec(thumb.style.transform || '');
      const cur = match ? parseFloat(match[1]) : 0;
      const max = maxTravel();
      if (cur >= max * 0.88) {
        setX(max);
        track.classList.add('is-done');
        const label = document.getElementById('driverSlideLabel');
        if (label) label.textContent = 'Confirmed';
        setTimeout(() => window.advanceDriverActiveTrip(), 180);
      } else {
        setX(0);
      }
    };

    thumb.addEventListener('pointerdown', (e) => {
      thumb.setPointerCapture?.(e.pointerId);
      onStart(e.clientX);
    });
    thumb.addEventListener('pointermove', (e) => onMove(e.clientX));
    thumb.addEventListener('pointerup', onEnd);
    thumb.addEventListener('pointercancel', onEnd);
  }

  window.advanceDriverActiveTrip = function () {
    const d = ensureDriver();
    const stage = TRIP_STAGES[d.activeTripStage] || TRIP_STAGES[0];
    if (stage.attendance) {
      openAttendance();
      return;
    }
    if (d.activeTripStage >= TRIP_STAGES.length - 1) {
      d.activeTripStage = 0;
      if (d.activeTrip) d.activeTrip.completedLeg = d.activeTrip.leg;
      persist();
      window.navigateTo('driverRateParent');
      toast('Trip complete. Return leg stays on your schedule.');
      return;
    }
    d.activeTripStage += 1;
    persist();
    renderActiveTrip();
    toast(TRIP_STAGES[d.activeTripStage].chip);
  };

  function openAttendance() {
    const ctx = tripContext() || {};
    const list = document.getElementById('driverAttendanceList');
    const d = ensureDriver();
    if (list) {
      const children = ctx.children || [];
      list.innerHTML = children.map((c) => {
        const key = c.id || c.name;
        const on = d.activeTrip?.childState?.[key] !== 'not_riding';
        return `<div class="attendance-child-card ${on ? 'selected' : ''}" onclick="toggleDriverChild('${key}')">
          <div class="drv-child-mini">
            <img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" onerror="this.src='/assets/avatar_arman.jpg'" />
            <div><div class="menu-title-text">${esc(c.name)}</div><div class="menu-subtitle">${esc(c.notes || c.grade || '')}</div></div>
          </div>
          <span class="${on ? 'both-way-badge' : 'one-way-badge'}">${on ? 'Riding' : 'Not riding'}</span>
        </div>`;
      }).join('');
    }
    document.getElementById('driverAttendanceModal')?.classList.add('active');
    icons();
  }

  window.toggleDriverChild = function (key) {
    const d = ensureDriver();
    if (!d.activeTrip) d.activeTrip = { childState: {} };
    if (!d.activeTrip.childState) d.activeTrip.childState = {};
    d.activeTrip.childState[key] = d.activeTrip.childState[key] === 'not_riding' ? 'riding' : 'not_riding';
    persist();
    openAttendance();
  };

  window.toggleChildAttendance = window.toggleDriverChild;

  window.confirmDriverAttendance = function () {
    document.getElementById('driverAttendanceModal')?.classList.remove('active');
    const d = ensureDriver();
    d.activeTripStage = 3;
    persist();
    renderActiveTrip();
    toast('Pickup confirmed. Booking stays open for children not riding today.');
  };

  function renderRateParent() {
    const ctx = tripContext() || {};
    const el = feed('driverRateParentFeed');
    if (!el) return;
    const screen = document.getElementById('screen-driverRateParent');
    if (screen) screen.classList.add('rt-screen');
    el.classList.add('rt-compose');
    el.innerHTML = `
      <div class="rt-hero">
        <div class="rt-avatar-wrap">
          <img src="${esc(PARENTS[ctx.parentId]?.photo || '/assets/avatar_sadia.jpg')}" alt="" class="rt-avatar" width="64" height="64" onerror="this.src='/assets/avatar_sadia.jpg'" />
        </div>
        <div class="rt-hero-copy">
          <h2 class="rt-title">Rate ${esc(ctx.parentName || 'parent')}</h2>
          <p class="rt-sub">Trip complete</p>
        </div>
      </div>
      <div class="rt-block">
        <p class="rt-label">Your rating</p>
        <div class="stars-row rt-stars" id="driverRateStars">
          ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="star-btn" onclick="setDriverParentScore(${n})" aria-label="${n} stars"><i data-lucide="star"></i></button>`).join('')}
        </div>
      </div>
      <div class="rt-block">
        <p class="rt-label">What went well</p>
        <div class="rating-tags-wrap rt-tags">
          <button type="button" class="rating-tag-pill active" onclick="this.classList.toggle('active')">On time</button>
          <button type="button" class="rating-tag-pill active" onclick="this.classList.toggle('active')">Clear chat</button>
          <button type="button" class="rating-tag-pill" onclick="this.classList.toggle('active')">Kids ready</button>
          <button type="button" class="rating-tag-pill" onclick="this.classList.toggle('active')">Respectful</button>
        </div>
      </div>
      <div class="rt-block">
        <p class="rt-label">Note <span class="rt-optional">optional</span></p>
        <textarea class="rating-comment-box" id="driverRateNote" placeholder="Short private note"></textarea>
      </div>
      <div class="rt-actions">
        <button type="button" class="btn-primary" onclick="submitDriverParentRating()">Submit</button>
        <button type="button" class="btn-secondary-link" onclick="skipDriverParentRating()">Skip</button>
      </div>
    `;
    icons();
    if (typeof window.setDriverParentScore === 'function') window.setDriverParentScore(5);
  }

  function renderMyRatings() {
    const d = ensureDriver();
    const el = feed('driverRatingsFeed');
    if (!el) return;
    const provider = (state().providers || []).find((p) => p.id === 'tariq') || { rating: d.rating || 4.9, reviewsCount: d.reviewsCount || 128, name: d.name };
    const reviews = typeof window.getProviderReviews === 'function' ? window.getProviderReviews(provider) : [];
    const rating = Number(provider.rating || d.rating || 4.9);
    const count = provider.reviewsCount || reviews.length;
    const full = Math.round(rating);
    el.innerHTML = `
      <div class="partner-ratings-feed">
        <div class="provider-reviews-summary">
          <div class="provider-reviews-score">${rating.toFixed(1)}</div>
          <div class="provider-reviews-score-meta">
            <div class="profile-rating-stars-gold">${'★★★★★'.slice(0, full)}${'☆☆☆☆☆'.slice(0, 5 - full)}</div>
            <div class="profile-rating-reviews-count">${count} parent reviews</div>
          </div>
        </div>
        ${reviews.map((r) => {
          const stars = '★'.repeat(r.rating || 5);
          const photo = typeof window.personAvatar === 'function' ? window.personAvatar(r.name, '/assets/avatar_sadia.jpg') : '/assets/avatar_sadia.jpg';
          return `<article class="provider-review-card">
            <div class="profile-review-top-row">
              <div class="profile-reviewer-info">
                <div class="provider-review-avatar"><img src="${esc(photo)}" alt="" onerror="this.src='/assets/avatar_sadia.jpg'" /></div>
                <div>
                  <div class="profile-reviewer-name">${esc(r.name)}</div>
                  <div class="profile-reviewer-sub">Verified parent</div>
                </div>
              </div>
              <div class="provider-review-meta">
                <span class="profile-rating-stars-gold">${stars}</span>
                <span class="profile-review-date">${esc(r.date || '')}</span>
              </div>
            </div>
            <p class="profile-review-quote">${esc(r.text || '')}</p>
          </article>`;
        }).join('') || '<p class="drv-lede">No reviews yet.</p>'}
      </div>
    `;
    icons();
  }

  window.setDriverParentScore = function (score) {
    state()._driverParentScore = score;
    document.querySelectorAll('#driverRateStars .star-btn').forEach((btn, idx) => btn.classList.toggle('active', idx < score));
  };

  window.submitDriverParentRating = function () {
    toast('Thanks. Your parent review is saved privately.');
    skipDriverParentRating();
  };

  window.skipDriverParentRating = function () {
    window.navigateTo('driverHome');
  };

  function renderSetup() {
    const d = ensureDriver();
    const el = document.getElementById('driverSetupFeed');
    if (!el) return;
    const steps = [
      ['profile', '1. Profile', d.name + ' · ' + d.phone, 'driverOnboardProfile'],
      ['vehicle', '2. Vehicle', `${d.vehicle.make} ${d.vehicle.model} · ${d.vehicle.capacity} seats`, 'driverOnboardVehicle'],
      ['docs', '3. Documents', d.documents.filter((doc) => doc.status === 'approved').length + ' / ' + d.documents.length + ' approved', 'driverOnboardDocs'],
      ['availability', '4. Availability', availSummary(d.availability), 'driverOnboardAvailability'],
      ['rate', '5. Payment & Rates', `$${d.rate.amount} / week · ${d.rate.paymentMethod || 'Interac'}`, 'driverOnboardRate']
    ];
    const ready = onboardingDone(d);
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:0;">${isApproved(d) ? 'Verified driver' : ready ? 'Submitted for review' : 'Driver setup'}</h3>
        <p class="drv-lede">${isApproved(d) ? 'You can go online and accept bookings.' : 'Profile, vehicle, docs, hours, then rate. Parents do not upload these.'}</p>
      </div>
      <div class="profile-menu-section">
      ${steps.map(([key, title, sub, screen]) => `
        <div class="profile-menu-item" onclick="navigateTo('${screen}')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap">${d.onboarding[key] ? '<i data-lucide="check"></i>' : '<i data-lucide="circle"></i>'}</div>
            <div>
              <div class="menu-title-text">${title}</div>
              <div class="menu-subtitle">${esc(sub)}</div>
            </div>
          </div>
          <i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--color-body);"></i>
        </div>
      `).join('')}
      </div>
      ${ready && !isApproved(d) ? `<button type="button" class="btn-primary" onclick="navigateTo('driverPending')">View verification status</button>` : ''}
      ${isApproved(d) ? `<button type="button" class="btn-primary" onclick="navigateTo('driverHome')">Back to home</button>` : ''}
    `;
    icons();
  }

  function profileMenuRow(icon, label, onclick) {
    return `<button type="button" class="profile-menu-item" onclick="${onclick}">
      <div class="menu-item-left">
        <div class="menu-icon-wrap"><i data-lucide="${icon}"></i></div>
        <span class="menu-title-text">${label}</span>
      </div>
      <i data-lucide="chevron-right" class="profile-menu-chevron"></i>
    </button>`;
  }

  function renderProfile() {
    const d = ensureDriver();
    state()._docsReturnTo = null;
    const el = feed('driverProfileFeed');
    if (!el) return;
    bindChildTitle(el, 'Driver Profile');
    const photo = d.photo || '/assets/avatar_sadia.jpg';
    el.innerHTML = `
      <!-- User Profile Header Card -->
      <div class="profile-user-card" style="margin-bottom: 12px;">
        <div class="profile-user-avatar-wrap">
          <img src="${esc(photo)}" alt="Profile photo" class="profile-user-avatar" id="drvProfileHeaderPhoto" onerror="this.src='/assets/avatar_sadia.jpg'" />
          <button type="button" class="profile-user-avatar-edit-btn" onclick="openDriverProfileChild('driverOnboardProfile', event)" aria-label="Change photo">
            <i data-lucide="camera"></i>
          </button>
        </div>
        <div class="profile-user-info">
          <div class="profile-user-name-row" onclick="openDriverProfileChild('driverOnboardProfile', event)">
            <h3 class="profile-user-name">${esc(d.name || 'Sadia Driver')}</h3>
            <i data-lucide="chevron-right" class="profile-user-chevron"></i>
          </div>
          <p class="profile-user-role">School Driver · ★ ${Number(d.rating || 4.9).toFixed(1)} (142 trips)</p>
        </div>
      </div>

      <!-- Online Status & Public Preview -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${partnerOnlineRow('driver', !!d.isOnline && isApproved(d), !isApproved(d), 'window.setDriverOnlineStatus(this.checked)')}
        ${profileMenuRow('eye', 'Preview Public Profile & Rates', "openDriverProfile('tariq', 'driverProfile')")}
        ${profileMenuRow('star', 'Ratings & reviews', "openDriverProfileChild('driverRatings', event)")}
      </div>

      <!-- Section 1: Operations & Vehicle -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${profileMenuRow('car', 'Vehicle info', "openDriverProfileChild('driverOnboardVehicle', event)")}
        ${profileMenuRow('file-check', 'Verification documents', "openDriverProfileChild('driverOnboardDocs', event)")}
        ${profileMenuRow('clock', 'Availability', "openDriverProfileChild('driverOnboardAvailability', event)")}
        ${profileMenuRow('wallet', 'Payment & Rates', "openDriverProfileChild('driverPayment', event)")}
      </div>

      <!-- Section 2: Subscription, FAQ, Support & Policies -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${profileMenuRow('crown', 'Driver subscription', "openDriverProfileChild('driverSubscription', event)")}
        ${profileMenuRow('help-circle', 'FAQ', "openDriverProfileChild('faq', event)")}
        ${profileMenuRow('headphones', 'Contact Support', "openDriverProfileChild('contactSupport', event)")}
        ${profileMenuRow('alert-triangle', 'Safety Center', "openDriverProfileChild('report', event)")}
        ${profileMenuRow('shield', 'Privacy Policy', "openDriverProfileChild('privacy', event)")}
        ${profileMenuRow('file-text', 'Terms of Service', "openDriverProfileChild('legal', event)")}
        ${profileMenuRow('info', 'About Home2School', "openDriverProfileChild('about', event)")}
      </div>

      <!-- Role Switcher Card -->
      <div class="profile-workspace-card" role="button" tabindex="0" onclick="window.openRoleSwitcherModal()" style="margin-bottom:12px;">
        <div class="pwc-left">
          <div class="pwc-icon-wrap driver"><i data-lucide="layers"></i></div>
          <div class="pwc-info">
            <div class="pwc-title">Active Role: Driver</div>
            <div class="pwc-subtitle">Switch to Parent or WalkShare mode</div>
          </div>
        </div>
        <button type="button" class="pwc-action-btn" onclick="event.stopPropagation(); window.openRoleSwitcherModal()">Switch</button>
      </div>

      <!-- Log Out Button -->
      <button type="button" class="profile-logout-btn" onclick="navigateTo('authWelcome')" style="margin-bottom:24px;">
        <i data-lucide="log-out"></i>
        Log out
      </button>
    `;
    if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('driver');
    icons();
  }

  function driverInboxThreads() {
    const map = {};
    DEMO_INBOX.forEach((t) => {
      map[t.id] = Object.assign({}, t);
    });
    ensureDriver().requests.forEach((r) => {
      if (!r.parentId) return;
      if (!map[r.parentId]) {
        map[r.parentId] = {
          id: r.parentId,
          name: r.parentName || 'Parent',
          photo: r.parentPhoto || '/assets/avatar_sadia.jpg',
          preview: r.notes || `${childShort(r)} commute`,
          time: r.pickupTime || '',
          unread: r.status === 'new' ? 1 : 0
        };
      }
    });
    assignedBookings().forEach((b) => {
      const pid = b.parentId || 'PRNT-9042';
      if (map[pid]) return;
      map[pid] = {
        id: pid,
        name: b.parentName || 'Parent',
        photo: b.parentPhoto || '/assets/avatar_sadia.jpg',
        preview: `${(passengerKids(b).map((c) => c.name.split(' ')[0]).join(' + ') || 'Passengers')} school commute`,
        time: b.outboundTime || '',
        unread: 0
      };
    });
    return Object.values(map);
  }

  function renderDriverInbox() {
    if (state().activeRole !== 'driver') return;
    const wrap = document.getElementById('inboxThreadList');
    if (!wrap) return;
    const threads = driverInboxThreads();
    wrap.innerHTML = threads.map((t) => `
      <button type="button" class="mvp-inbox-row${t.unread ? ' is-unread' : ''}" onclick="openChatWith('${t.id}')">
        <img src="${t.photo || '/assets/avatar_sadia.jpg'}" alt="${esc(t.name)}" onerror="this.src='/assets/avatar_sadia.jpg'" />
        <div style="flex:1;min-width:0;">
          <div class="mvp-inbox-name">${esc(t.name)}${t.unread ? `<span class="mvp-inbox-unread">${t.unread > 9 ? '9+' : t.unread}</span>` : ''}</div>
          <div class="mvp-inbox-preview">${esc(t.preview)}</div>
        </div>
        <span class="notif-time-text">${esc(t.time)}</span>
      </button>
    `).join('');
  }

  function parentParty(id) {
    if (PARENTS[id]) return PARENTS[id];
    const req = ensureDriver().requests.find((r) => r.parentId === id || r.id === id);
    if (req) return { id: req.parentId, name: req.parentName, photo: req.parentPhoto || '/assets/avatar_sadia.jpg', sub: 'Parent · ' + childShort(req) };
    const demo = DEMO_INBOX.find((t) => t.id === id);
    if (demo) return { id: demo.id, name: demo.name, photo: demo.photo || '/assets/avatar_sadia.jpg', sub: 'Parent' };
    return null;
  }

  const origChat = window.openChatWith;
  window.openChatWith = function (partyId) {
    window.activeChatProviderId = partyId;
    if (state().activeRole === 'driver') {
      window.navigateTo('messages');
      return;
    }
    if (typeof origChat === 'function') origChat(partyId);
  };

  function chatBubbleHtml(item) {
    if (item.type === 'system') {
      const tone = item.tone === 'amber'
        ? 'background:#FEF3C7;border-color:#FDE68A;color:#B45309;'
        : '';
      return `<div class="system-status-bubble" style="${tone}display:flex;align-items:center;justify-content:flex-start;gap:6px;">
        <i data-lucide="clock" style="width:14px;height:14px;"></i>
        <span>${esc(item.text)}</span>
      </div>`;
    }
    // In driver chat, "provider" bubble = parent message; "parent" bubble = driver (me)
    const cls = item.type === 'provider' ? 'provider' : 'parent';
    return `<div class="chat-bubble ${cls}">
      <div class="chat-bubble-text">${esc(item.text)}</div>
      <div class="chat-timestamp">
        ${esc(item.time || '')}
        ${cls === 'parent' ? '<i data-lucide="check-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;opacity:0.85;"></i>' : ''}
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
    </div>`;
  }

  function paintDriverChat(party) {
    const stream = document.getElementById('chatStream');
    if (!stream) return;
    const key = party.id || window.activeChatProviderId || 'PRNT-9042';
    if (parentChatHtml === null) parentChatHtml = stream.innerHTML;
    const script = DEMO_CHATS[key] || DEMO_CHATS['PRNT-9042'];
    stream.dataset.driverParty = key;
    stream.innerHTML = script.map(chatBubbleHtml).join('');
    icons();
    stream.scrollTop = stream.scrollHeight;
  }

  function renderDriverChatHeader() {
    if (state().activeRole !== 'driver') return;
    const party = parentParty(window.activeChatProviderId) || PARENTS['PRNT-9042'];
    const avatar = document.getElementById('chatDriverAvatar');
    const nameEl = document.getElementById('chatDriverName');
    const subEl = document.getElementById('chatDriverSub');
    const input = document.getElementById('chatInputField');
    const header = document.getElementById('chatHeaderProfileBtn');
    const callBtn = document.getElementById('chatDriverCallBtn');
    if (avatar) {
      avatar.src = party.photo || '/assets/avatar_sadia.jpg';
      avatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_sadia.jpg'; };
    }
    if (nameEl) nameEl.textContent = party.name;
    if (subEl) {
      subEl.textContent = 'Parent • Safe in-app chat';
      subEl.style.display = 'block';
    }
    if (input) input.placeholder = `Message ${party.name.split(' ')[0]}…`;
    if (header) { header.onclick = null; header.style.cursor = 'default'; }
    if (callBtn) {
      callBtn.style.display = 'flex';
      callBtn.title = `Call ${party.name}`;
      callBtn.onclick = function() { window.callCurrentChatParty(); };
    }
    const quick = document.getElementById('chatQuickReplies');
    if (quick) {
      quick.innerHTML = [
        "I'm on my way",
        "I've arrived",
        'Running a few minutes late',
        'Picked up',
        'Dropped off'
      ].map((t) => `<button class="quick-reply-pill" onclick="sendQuickReply('${t.replace(/'/g, "\\'")}')">${t}</button>`).join('');
    }
    paintDriverChat(party);
  }

  const origQuick = window.sendQuickReply;
  window.sendQuickReply = function (text) {
    if (state().activeRole === 'driver') {
      appendMine(text);
      setTimeout(() => appendTheirs('Thank you — we will be ready.'), 900);
      return;
    }
    if (typeof origQuick === 'function') origQuick(text);
  };

  const origSend = window.handleSendChatMessage;
  window.handleSendChatMessage = function (e) {
    if (state().activeRole !== 'driver') {
      if (typeof origSend === 'function') return origSend(e);
      return;
    }
    e.preventDefault();
    const input = document.getElementById('chatInputField');
    if (!input || !input.value.trim()) return;
    appendMine(input.value.trim());
    input.value = '';
    setTimeout(() => appendTheirs('Got it.'), 900);
  };

  function appendMine(text) {
    const stream = document.getElementById('chatStream');
    if (!stream) return;
    const empty = document.getElementById('chatEmptyState');
    if (empty) empty.remove();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble parent';
    bubble.innerHTML = `
      <div class="chat-bubble-text">${esc(text)}</div>
      <div class="chat-timestamp">${timeStr} <i data-lucide="check-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;opacity:0.85;"></i></div>
      <div class="chat-bubble-actions">
        <button type="button" class="bubble-act-btn" onclick="copyChatMessageText(this)" title="Copy message" aria-label="Copy"><i data-lucide="copy"></i></button>
        <button type="button" class="bubble-act-btn danger" onclick="deleteIndividualChatMessage(this)" title="Delete message" aria-label="Delete"><i data-lucide="trash-2"></i></button>
        <button type="button" class="bubble-act-btn" onclick="reactToChatMessage(this, '👍')" title="Thumbs up" aria-label="React"><span>👍</span></button>
      </div>
    `;
    stream.appendChild(bubble);
    icons();
    stream.scrollTop = stream.scrollHeight;
  }

  function appendTheirs(text) {
    const stream = document.getElementById('chatStream');
    if (!stream) return;
    const empty = document.getElementById('chatEmptyState');
    if (empty) empty.remove();

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble provider';
    bubble.innerHTML = `
      <div class="chat-bubble-text">${esc(text)}</div>
      <div class="chat-timestamp">${timeStr}</div>
      <div class="chat-bubble-actions">
        <button type="button" class="bubble-act-btn" onclick="copyChatMessageText(this)" title="Copy message" aria-label="Copy"><i data-lucide="copy"></i></button>
        <button type="button" class="bubble-act-btn danger" onclick="deleteIndividualChatMessage(this)" title="Delete message" aria-label="Delete"><i data-lucide="trash-2"></i></button>
        <button type="button" class="bubble-act-btn" onclick="reactToChatMessage(this, '👍')" title="Thumbs up" aria-label="React"><span>👍</span></button>
      </div>
    `;
    stream.appendChild(bubble);
    icons();
    stream.scrollTop = stream.scrollHeight;
  }

  function renderDriverNotifications() {
    const list = document.getElementById('notifFeedList');
    if (!list) return;
    const notes = ensureDriver().notifications || [];
    list.innerHTML = notes.map((n) => `
      <div class="notification-card ${n.unread ? 'unread' : ''}" onclick="navigateTo('${n.action === 'inbox' ? 'inbox' : 'driverRequests'}')">
        ${n.unread ? '<span class="notif-indicator-dot"></span>' : ''}
        <div class="notif-content-block">
          <div class="notif-title-row"><span class="notif-title-text">${esc(n.title)}</span><span class="notif-time-text">${esc(n.time)}</span></div>
          <p class="notif-desc-text">${esc(n.body)}</p>
        </div>
      </div>
    `).join('');
  }

  const origInbox = window.renderInboxScreen;
  window.renderInboxScreen = function () {
    if (state().activeRole === 'driver') {
      renderDriverInbox();
      return;
    }
    if (typeof origInbox === 'function') origInbox();
  };

  window.switchDriverRequestsTab = function (tab) {
    renderRequests(tab);
  };

  let driverParentStars = 5;
  let driverParentTags = [];

  function renderRateParent() {
    const el = feed('driverRateParentFeed') || document.getElementById('driverRateParentFeed');
    if (!el) return;
    bindChildTitle(el, 'Rate Parent & Trip');
    bindChildBack(el, "navigateTo('driverHome')");

    const parentName = 'Sadia Khan';
    const parentPhoto = '/assets/avatar_sadia.jpg';
    const children = 'Arman (Gr 2) & Emma (JK)';
    const route = 'Home (12 Elm St) → Greenfield Int.';

    el.innerHTML = `
      <!-- Clean Hero Profile Header (No unnecessary heavy boxes) -->
      <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin: 8px 0 20px;">
        <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(27, 43, 104, 0.12); margin-bottom: 10px;">
          <img src="${parentPhoto}" alt="${parentName}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />
        </div>
        <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 4px;">${parentName}</h2>
        <p style="font-size: 13px; font-weight: 600; color: #64748B; margin: 0 0 2px;">Passengers: ${children}</p>
        <p style="font-size: 12px; color: #94A3B8; margin: 0;">${route}</p>
      </div>

      <!-- 1. Star Rating (1-5) -->
      <div style="text-align: center; margin-bottom: 22px;">
        <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 0 0 10px;">How was your trip experience? <span style="color:#EF4444;">*</span></p>
        <div id="driverRateParentStarsRow" style="display: flex; justify-content: center; gap: 14px; font-size: 38px; cursor: pointer;">
          <span class="rate-star" data-val="1" onclick="setDriverParentRatingStars(1)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="2" onclick="setDriverParentRatingStars(2)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="3" onclick="setDriverParentRatingStars(3)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="4" onclick="setDriverParentRatingStars(4)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          <span class="rate-star" data-val="5" onclick="setDriverParentRatingStars(5)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
        </div>
        <div id="driverRateParentSentiment" style="font-size: 13px; font-weight: 700; color: #1E293B; margin-top: 8px;">5.0 · Punctual & Respectful Parent</div>
      </div>

      <!-- 2. Experience Highlights / Quick Tags -->
      <div style="margin-bottom: 20px;">
        <p style="font-size: 12.5px; font-weight: 700; color: #475569; margin: 0 0 8px;">What went well</p>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${['⏰ On Time', '🎒 Kids Ready', '🤝 Polite & Respectful', '💬 Responsive on Chat', '🚗 Smooth Handover'].map(tag => `
            <button type="button" class="review-tag-chip" onclick="toggleDriverParentTag(this, '${tag}')" style="padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 700; border: 1px solid #CBD5E1; background: #FFFFFF; color: #475569; cursor: pointer; transition: all 0.15s;">
              ${tag}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- 3. Notes / Comments -->
      <div style="margin-bottom: 24px;">
        <label for="driverParentComment" style="font-size: 12.5px; font-weight: 700; color: #475569; display: block; margin-bottom: 8px;">
          Comment <span style="font-weight: 400; color: #94A3B8;">(Optional)</span>
        </label>
        <textarea id="driverParentComment" rows="3" class="form-input" placeholder="Share a short note about this trip experience..." style="width: 100%; border-radius: 12px; border: 1.5px solid #E2E8F0; padding: 10px 14px; font-size: 13.5px; font-family: inherit; resize: none; box-sizing: border-box;"></textarea>
      </div>

      <div class="drv-actions-col" style="display: flex; flex-direction: column; gap: 10px;">
        <button type="button" class="btn-primary" onclick="submitDriverParentRating()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">Submit Rating</button>
        <button type="button" class="btn-secondary-link" onclick="navigateTo('driverHome')" style="text-align: center; font-size: 13px; color: #64748B; background: none; border: none; padding: 8px; cursor: pointer;">Skip for now</button>
      </div>
    `;
    icons();
  }

  window.setDriverParentRatingStars = function (val) {
    driverParentStars = Number(val);
    const row = document.getElementById('driverRateParentStarsRow');
    if (row) {
      const stars = row.querySelectorAll('.rate-star');
      stars.forEach((s) => {
        const v = Number(s.getAttribute('data-val'));
        s.textContent = v <= val ? '★' : '☆';
        s.style.color = v <= val ? '#F59E0B' : '#CBD5E1';
      });
    }
    const sentimentEl = document.getElementById('driverRateParentSentiment');
    const sentiments = {
      1: '1.0 · Major Issues / Late Handover',
      2: '2.0 · Needs Better Communication',
      3: '3.0 · Average Handover',
      4: '4.0 · Good & Cooperative Parent',
      5: '5.0 · Punctual & Respectful Parent'
    };
    if (sentimentEl) sentimentEl.textContent = sentiments[val] || `${val}.0`;
  };

  window.toggleDriverParentTag = function (btn, tag) {
    btn.classList.toggle('selected');
    if (btn.classList.contains('selected')) {
      btn.style.background = '#EFF6FF';
      btn.style.borderColor = '#1B2B68';
      btn.style.color = '#1B2B68';
      if (!driverParentTags.includes(tag)) driverParentTags.push(tag);
    } else {
      btn.style.background = '#FFFFFF';
      btn.style.borderColor = '#CBD5E1';
      btn.style.color = '#475569';
      driverParentTags = driverParentTags.filter(t => t !== tag);
    }
  };

  window.submitDriverParentRating = function () {
    const stars = Number(driverParentStars || 5);
    const comment = (document.getElementById('driverParentComment')?.value || '').trim();
    const tags = driverParentTags.slice();
    if (!state().parentFeedback) state().parentFeedback = [];
    state().parentFeedback.push({
      id: 'fb-' + Date.now(),
      parentId: 'PRNT-9042',
      parentName: 'Sadia Khan',
      rating: stars,
      date: 'Today',
      comment: comment,
      tags: tags
    });
    persist();
    toast(`★ ${stars}-star rating submitted for Sadia Khan!`);
    window.navigateTo('driverHome');
  };

  window.renderDriverHome = renderHome;
  window.renderDriverRequests = renderRequests;
  window.renderDriverSchedule = renderSchedule;
  window.renderDriverActiveTrip = renderActiveTrip;
  window.renderDriverSetup = renderSetup;
  window.renderDriverProfile = renderProfile;
  window.renderDriverOnboardProfile = renderOnboardProfile;
  window.renderDriverOnboardVehicle = renderOnboardVehicle;
  window.renderDriverOnboardDocs = renderOnboardDocs;
  window.renderDriverDocDetail = renderDocDetail;
  window.renderDriverOnboardAvailability = renderOnboardAvailability;
  window.renderDriverOnboardRate = renderOnboardRate;
  window.renderDriverPayment = renderPayment;
  window.renderDriverPending = renderPending;
  window.renderDriverSubscription = renderSubscription;
  window.renderDriverRequestDetail = renderRequestDetail;
  window.renderDriverTripPrep = renderTripPrep;
  window.renderDriverRateParent = renderRateParent;
  window.setDriverScenario = function (sc) {
    const d = ensureDriver();
    d.homeScenario = sc;
    persist();
    ['A', 'B', 'C'].forEach((s) => {
      document.getElementById('dchipScenario' + s)?.classList.toggle('active', s === sc);
    });
    renderHome();
  };

  function applyTariqAvailabilityToSearch() {
    if (window.H2SAvailability) {
      const d = ensureDriver();
      const provider = (state().providers || []).find((p) => p.id === 'tariq');
      if (provider) provider.availability = d.availability;
      window.H2SAvailability.applyToProviderCards(state().bookingDraft || {});
      if (window.H2SZone) window.H2SZone.paintProviderCards();
      return;
    }
    document.querySelectorAll('#providersResultList .provider-result-card').forEach((card) => {
      if (card.style.display === 'none') return;
      const id = (card.getAttribute('data-provider-id') || '').toLowerCase();
      const name = card.querySelector('.provider-name-verified span')?.textContent || '';
      const isTariq = id === 'tariq' || /tariq/i.test(name);
      if (!isTariq) return;
      if (!window.driverMatchesParentSearch(state().bookingDraft || {})) {
        card.style.display = 'none';
      }
    });
  }

  const origFilterProviders = window.filterBookingProviders;
  if (typeof origFilterProviders === 'function') {
    window.filterBookingProviders = function (filterType, btnEl) {
      origFilterProviders(filterType, btnEl);
      applyTariqAvailabilityToSearch();
    };
  }

  const origCompactFilter = window.applyProviderCompactFilter;
  if (typeof origCompactFilter === 'function') {
    window.applyProviderCompactFilter = function (filter, btnEl) {
      origCompactFilter(filter, btnEl);
      applyTariqAvailabilityToSearch();
    };
  }

  const origSubmitBooking = window.submitBookingRequest;
  if (typeof origSubmitBooking === 'function') {
    window.submitBookingRequest = function () {
      origSubmitBooking.apply(this, arguments);
      ingestBookingAsRequest((state().bookings || [])[0]);
    };
  }

  window.applyDriverPromoCode = function () {
    const input = document.getElementById('inputDriverPromoCode');
    const code = (input?.value || '').trim().toUpperCase();
    const badge = document.getElementById('driverPromoBadge');
    if (code === 'PRO20' || code === 'PRO2026' || code === 'SCHOOL20' || code.length >= 3) {
      if (badge) badge.style.display = 'inline';
      alert(`🎉 Promo Code "${code || 'PRO2026'}" applied! 20% discount activated on your driver platform fee.`);
    } else {
      alert('Please enter a valid driver promo code (e.g. PRO2026)');
    }
  };

  injectScreens();
  ensureDriver();
  ingestBookingAsRequest((state().bookings || []).find((b) => b.id === 'H2S-REQ-9042'));
  applyRoleChrome();
  window.__h2sDriverReady = true;
})();
