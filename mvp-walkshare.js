/* WalkShare MVP role layer. Reuses Parent/Driver design system; Sarah Jenkins identity. */

(function () {
  const STORE = 'h2s_walkshare_mvp_v1';
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
  const WS_ONLY = new Set([
    'wsHome', 'wsRequests', 'wsSchedule', 'wsProfile', 'wsSetup',
    'wsOnboardProfile', 'wsOnboardGroup', 'wsOnboardDocs', 'wsDocDetail', 'wsOnboardAvailability',
    'wsOnboardRate', 'wsPayment', 'wsPending', 'wsSubscription', 'wsRequestDetail', 'wsWalkPrep', 'wsActiveWalk', 'wsRatings'
  ]);
  const PARENTS = {
    'PRNT-9042': { id: 'PRNT-9042', name: 'Sarah Tremblay', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Liam, Emma & Chloe' },
    'PRNT-2201': { id: 'PRNT-2201', name: 'Amanda Roy', photo: '/assets/avatar_rehana.jpg', sub: 'Parent · Noah & Olivia' },
    'PRNT-3310': { id: 'PRNT-3310', name: 'Jessica Taylor', photo: '/assets/avatar_farhana.jpg', sub: 'Parent · Charlotte' },
    'PRNT-1188': { id: 'PRNT-1188', name: 'Marcus Vance', photo: '/assets/avatar_john.png', sub: 'Parent · Leo & Mia' }
  };
  const DEMO_INBOX = [
    { id: 'PRNT-9042', name: 'Sarah Tremblay', photo: '/assets/avatar_sadia.jpg', preview: 'Chloe is at the corner with her high-vis vest.', time: '08:06 AM', unread: 2 },
    { id: 'PRNT-2201', name: 'Amanda Roy', photo: '/assets/avatar_rehana.jpg', preview: 'Noah will wait at Maple & 2nd — blue backpack.', time: '07:48 AM', unread: 1 },
    { id: 'PRNT-3310', name: 'Jessica Taylor', photo: '/assets/avatar_farhana.jpg', preview: 'Can Charlotte join the west-gate group next week?', time: 'Yesterday', unread: 1 },
    { id: 'PRNT-1188', name: 'Marcus Vance', photo: '/assets/avatar_john.png', preview: 'Thanks for walking Leo to the after-care door.', time: 'Mon', unread: 0 }
  ];
  const DEMO_CHATS = {
    'PRNT-9042': [
      { type: 'system', text: 'WalkShare escort · Chloe · Sunshine Pre-school' },
      { type: 'provider', text: 'Morning Sarah — Chloe is ready for the Elm & Maple meet-up.', time: '08:02 AM' },
      { type: 'parent', text: 'Leaving the corner in 2 minutes with the group.', time: '08:04 AM' },
      { type: 'provider', text: 'Chloe is at the corner with her high-vis vest.', time: '08:06 AM' },
      { type: 'system', text: 'Child joined walking group · 08:07 AM', tone: 'blue' },
      { type: 'parent', text: 'Got her — sidewalks are clear. Heading to Sunshine.', time: '08:08 AM' },
      { type: 'provider', text: 'Please hand to Ms. Jenkins at the west gate.', time: '08:09 AM' },
      { type: 'parent', text: 'Will do. About 4 minutes out.', time: '08:10 AM' }
    ],
    'PRNT-2201': [
      { type: 'system', text: 'Morning walk · Noah · Greenfield International' },
      { type: 'provider', text: 'Hi Sarah — Noah will wait at Maple & 2nd — blue backpack.', time: '07:42 AM' },
      { type: 'parent', text: 'Perfect. Group reaches Maple around 07:50.', time: '07:44 AM' },
      { type: 'provider', text: 'He’s wearing the neon jacket today.', time: '07:48 AM' },
      { type: 'parent', text: 'Seen him — joining now. Crosswalk light is green.', time: '07:51 AM' },
      { type: 'system', text: 'En route to Greenfield · sidewalk escort', tone: 'amber' },
      { type: 'provider', text: 'Text when you reach the school loop please.', time: '07:52 AM' }
    ],
    'PRNT-3310': [
      { type: 'system', text: 'Capacity inquiry · west-gate walk group' },
      { type: 'provider', text: 'Can Charlotte join the west-gate group next week?', time: 'Yesterday 6:10 PM' },
      { type: 'parent', text: 'We have one spot Mon–Thu mornings. Pickup near Birchwood?', time: 'Yesterday 6:18 PM' },
      { type: 'provider', text: 'Yes — 42 Birchwood at 07:55. She has an inhaler in the front pocket.', time: 'Yesterday 6:22 PM' },
      { type: 'parent', text: 'Noted on the roster. I’ll confirm Thursday night.', time: 'Yesterday 6:25 PM' }
    ],
    'PRNT-1188': [
      { type: 'system', text: 'After-care handoff · Leo' },
      { type: 'provider', text: 'Thanks for walking Leo to the after-care door yesterday.', time: 'Mon 4:40 PM' },
      { type: 'parent', text: 'Happy to help. Staff signed him in at 3:52.', time: 'Mon 4:44 PM' },
      { type: 'provider', text: 'Great — same route Wednesday?', time: 'Mon 4:46 PM' },
      { type: 'parent', text: 'Yes — same meet point at Elm.', time: 'Mon 4:48 PM' }
    ]
  };
  const REQUIRED_DOCS = [
    { id: 'licence', title: "Driver's License", subtitle: "Valid driver's license (Front & Back)" },
    { id: 'residency_tax_tenancy', title: "Proof of Residency 1: Property Tax / Tenancy", subtitle: "Property tax statement or tenancy agreement" },
    { id: 'residency_utility', title: "Proof of Residency 2: Utility Bill", subtitle: "Recent utility bill (Electricity, Gas, Water, Internet)" },
    { id: 'criminal', title: 'Criminal Background Check', subtitle: 'Police records check clearance' },
    { id: 'vulnerable', title: 'Vulnerable Sector Check', subtitle: 'Vulnerable sector screening certificate' },
    { id: 'firstaid', title: 'Pediatric First-Aid / CPR', subtitle: 'Emergency care & CPR certification' }
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
    const w = state().walkshare;
    if (!w) return;
    try {
      localStorage.setItem(STORE, JSON.stringify({
        name: w.name,
        phone: w.phone,
        email: w.email,
        photo: w.photo,
        serviceArea: w.serviceArea,
        verificationStatus: w.verificationStatus,
        onboarding: w.onboarding,
        group: w.group,
        documents: w.documents,
        availability: w.availability,
        rate: w.rate,
        subscription: w.subscription,
        requests: w.requests,
        isOnline: w.isOnline,
        skipDemoUnlock: !!w.skipDemoUnlock,
        activeWalkStage: w.activeWalkStage,
        activeWalk: w.activeWalk,
        notifications: w.notifications
      }));
    } catch (err) { /* ignore */ }
  }

  function demoUpload(name) {
    return { name: name, attached: true, preview: '' };
  }

  function demoDocuments() {
    return [
      {
        id: 'licence',
        title: "Driver's License",
        status: 'approved',
        file: demoUpload('sarah-drivers-license.pdf'),
        number: 'D4819-20381-90412',
        province: 'Ontario',
        expiry: '2028-09-15'
      },
      {
        id: 'residency_tax_tenancy',
        title: "Proof of Residency 1: Property Tax / Tenancy",
        status: 'approved',
        file: demoUpload('sarah-property-tax-2026.pdf'),
        residencyType: 'Property Tax Statement',
        address: '124 Greenfield Ave, Toronto, ON M4B 1B3',
        issuer: 'City of Toronto Revenue Services'
      },
      {
        id: 'residency_utility',
        title: "Proof of Residency 2: Utility Bill",
        status: 'approved',
        file: demoUpload('sarah-toronto-hydro-bill.pdf'),
        issuer: 'Toronto Hydro',
        address: '124 Greenfield Ave, Toronto, ON M4B 1B3',
        billDate: '2026-08-10'
      },
      {
        id: 'criminal',
        title: 'Criminal Background Check',
        status: 'approved',
        file: demoUpload('crc-sarah.pdf'),
        issuer: 'Toronto Police Service'
      },
      {
        id: 'vulnerable',
        title: 'Vulnerable Sector Check',
        status: 'approved',
        file: demoUpload('vsc-sarah.pdf'),
        issuer: 'Toronto Police Service'
      },
      {
        id: 'firstaid',
        title: 'Pediatric First-Aid / CPR',
        status: 'approved',
        file: demoUpload('cpr-sarah.pdf'),
        issuer: 'Red Cross'
      }
    ];
  }

  function normalizeWalkDocs(docs, useDemo) {
    const list = Array.isArray(docs) ? docs : [];
    const demo = demoDocuments();
    return REQUIRED_DOCS.map((spec) => {
      let existing = list.find((d) => d.id === spec.id);
      if (!existing && (spec.id === 'licence' || spec.id === 'id')) {
        existing = list.find((d) => d.id === 'licence' || d.id === 'id');
      }
      const demoItem = demo.find((d) => d.id === spec.id) || {};
      const src = useDemo ? demoItem : (existing || (demoItem.status === 'approved' && !list.length ? demoItem : {}));
      return {
        id: spec.id,
        title: spec.title,
        subtitle: spec.subtitle || '',
        status: src.status || (useDemo ? 'approved' : 'not_submitted'),
        number: src.number || (spec.id === 'licence' ? (demoItem.number || '') : ''),
        province: src.province || (spec.id === 'licence' ? 'Ontario' : ''),
        expiry: src.expiry || (spec.id === 'licence' ? '2028-09-15' : ''),
        residencyType: src.residencyType || (spec.id === 'residency_tax_tenancy' ? 'Property Tax Statement' : ''),
        address: src.address || (spec.id.startsWith('residency') ? '124 Greenfield Ave, Toronto, ON M4B 1B3' : ''),
        billDate: src.billDate || (spec.id === 'residency_utility' ? '2026-08-10' : ''),
        issuer: src.issuer || demoItem.issuer || '',
        file: src.file || (useDemo ? demoItem.file : { name: '', attached: false }),
        rejectReason: src.rejectReason || ''
      };
    });
  }

  function ensureWalk() {
    if (!state().walkshare) {
      state().walkshare = defaultWalkState();
    }
    const w = state().walkshare;
    if (!w.onboarding) w.onboarding = { profile: true, group: true, docs: true, availability: true, rate: true };
    if (!w.group) w.group = { label: 'Neighborhood Walking Group', capacity: 3, route: 'Elm → Greenfield', safety: ['High-Vis Vests', 'Crossing Guard', 'Pediatric CPR'] };
    if (w.group && (w.group.label === 'Walking School Bus' || w.group.label === 'Greenfield Walking Bus')) {
      w.group.label = 'Neighborhood Walking Group';
    }
    if (!Array.isArray(w.documents) || !w.documents.length) w.documents = demoDocuments();
    if (!w.availability) {
      w.availability = {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '07:15', end: '08:45', label: 'Morning', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '14:30', end: '16:00', label: 'Afternoon', enabled: true }
        ],
        exceptions: []
      };
    }
    if (window.H2SAvailability) w.availability = window.H2SAvailability.normalize(w.availability);
    if (!w.rate) w.rate = { amount: 75, period: 'week', negotiable: true, paymentMethod: 'Interac e-Transfer', paymentHandle: w.email || '' };
    if (!w.subscription) w.subscription = { status: 'trial', plan: 'monthly', priceMonthly: 19, priceAnnual: 179, trialDaysLeft: 14, history: [] };
    if (!Array.isArray(w.requests)) w.requests = [];
    if (!Array.isArray(w.notifications)) w.notifications = [];
    if (!restored) {
      restored = true;
      try {
        const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
        if (saved && typeof saved === 'object') {
          ['name', 'phone', 'email', 'photo', 'serviceArea', 'verificationStatus', 'isOnline', 'activeWalkStage', 'skipDemoUnlock'].forEach((key) => {
            if (saved[key] !== undefined) w[key] = saved[key];
          });
          ['onboarding', 'group', 'availability', 'rate', 'subscription', 'activeWalk'].forEach((key) => {
            if (saved[key]) w[key] = saved[key];
          });
          if (Array.isArray(saved.documents)) w.documents = saved.documents;
          if (Array.isArray(saved.requests)) w.requests = saved.requests;
          if (Array.isArray(saved.notifications)) w.notifications = saved.notifications;
        }
      } catch (err) { /* ignore */ }
    }
    if (w.skipDemoUnlock) {
      w.documents = normalizeWalkDocs(w.documents, false);
    } else {
      w.documents = normalizeWalkDocs(w.documents, !w.documents || !w.documents.length);
      if (w.verificationStatus !== 'approved' && w.verificationStatus !== 'verified') {
        w.verificationStatus = 'approved';
      }
      if (!w.onboarding) w.onboarding = {};
      ['profile', 'group', 'docs', 'availability', 'rate'].forEach((k) => { w.onboarding[k] = true; });
    }
    return w;
  }

  function defaultWalkState() {
    return {
      id: 'sarah',
      name: 'Sarah Jenkins',
      phone: '+1 (416) 555-0185',
      email: 'sarah.jenkins@walkshare.ca',
      photo: '/assets/avatar_sarah.jpg',
      serviceArea: 'Elm → Greenfield',
      rating: 4.9,
      reviewsCount: 45,
      isOnline: true,
      verificationStatus: 'approved',
      onboarding: { profile: true, group: true, docs: true, availability: true, rate: true },
      group: {
        label: 'Neighborhood Walking Group',
        capacity: 3,
        route: 'Elm → Greenfield',
        safety: ['High-Vis Vests', 'Crossing Guard', 'Pediatric CPR']
      },
      documents: demoDocuments(),
      availability: {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '07:15', end: '08:45', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '14:30', end: '16:00', enabled: true }
        ],
        exceptions: []
      },
      rate: { amount: 75, period: 'week', negotiable: true, paymentMethod: 'Interac e-Transfer', paymentHandle: 'sarah.jenkins@walkshare.ca' },
      subscription: { status: 'trial', plan: 'monthly', priceMonthly: 19, priceAnnual: 179, trialDaysLeft: 14, history: [] },
      activeWalkStage: 0,
      activeWalk: null,
      selectedRequestId: null,
      notifications: [
        { id: 'wn-1', title: 'New request', body: 'Sarah asked for a morning walk for Liam and Emma.', time: '18 min ago', unread: true },
        { id: 'wn-2', title: 'Message', body: 'Amanda: Noah will wait at the corner.', time: 'Yesterday', unread: true }
      ],
      requests: [
        {
          id: 'wreq-1',
          bookingId: 'H2S-WS-9042',
          parentId: 'PRNT-9042',
          parentName: 'Sarah Tremblay',
          parentPhoto: '/assets/avatar_sadia.jpg',
          children: [
            { id: 'liam', name: 'Liam Tremblay', grade: 'Grade 4', photo: '/assets/avatar_arman.jpg' },
            { id: 'emma', name: 'Emma Tremblay', grade: 'Grade 2', photo: '/assets/avatar_emma.jpg' }
          ],
          childNamesShort: 'Liam + Emma',
          seatsNeeded: 2,
          pickupLocation: '12 Elm Street',
          dropoffLocation: 'Greenfield International School',
          dateLabel: 'Starts Mon, Sep 14, 2026',
          pickupTime: '07:40 AM',
          returnTime: '03:20 PM',
          recurringDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          frequency: 'recurring',
          direction: 'bothway',
          rateLabel: '$75 / week',
          notes: 'Sidewalk-only route. Hand children to loop supervisor at the west gate.',
          status: 'new'
        },
        {
          id: 'wreq-2',
          bookingId: 'H2S-WS-2201',
          parentId: 'PRNT-2201',
          parentName: 'Amanda Roy',
          parentPhoto: '/assets/avatar_rehana.jpg',
          children: [
            { id: 'noah', name: 'Noah Roy', grade: 'Grade 3', photo: '/assets/avatar_arman.jpg' }
          ],
          childNamesShort: 'Noah',
          seatsNeeded: 1,
          pickupLocation: '18 Maple Avenue',
          dropoffLocation: 'Greenfield International School',
          dateLabel: 'Tue, Sep 15, 2026',
          pickupTime: '07:50 AM',
          returnTime: '',
          recurringDays: [],
          frequency: 'onetime',
          direction: 'oneway',
          rateLabel: '$18 / day',
          notes: 'One-way morning walk. High-vis vest provided.',
          status: 'accepted'
        }
      ]
    };
  }

  function isApproved(w) {
    return w.verificationStatus === 'approved' || w.verificationStatus === 'verified';
  }

  window.startWalkShareSignupFlow = function (name, email) {
    if (!state().walkshare) state().walkshare = defaultWalkState();
    const w = state().walkshare;
    w.name = name || '';
    w.email = email || '';
    w.phone = '';
    w.photo = '';
    w.photoName = '';
    w.serviceArea = '';
    w.bio = '';
    w.about = '';
    w.verificationStatus = 'not_submitted';
    w.isOnline = false;
    w.skipDemoUnlock = true;
    w.group = { route: '', maxKids: 6, morningTime: '08:00', returnTime: '15:15', meetingPoint: '', school: '', pickupStops: [] };
    w.onboarding = { profile: false, group: false, docs: false, availability: false, rate: false };
    w.subscription = { status: 'trial', plan: 'monthly', priceMonthly: 19, priceAnnual: 179, trialDaysLeft: 14, history: [] };
    persist();
    return w;
  };

  function syncWalkOnlineUi(w) {
    const online = !!w.isOnline;
    const chip = document.getElementById('wsOnlineChip');
    const label = document.getElementById('wsOnlineLabel');
    if (chip) {
      chip.classList.toggle('is-online', online);
      chip.classList.toggle('is-offline', !online);
      chip.disabled = false;
      chip.title = online ? 'Go offline' : 'Go online';
    }
    if (label) label.textContent = online ? 'Online' : 'Offline';
    const toggle = document.getElementById('wsOnlineToggle');
    if (toggle) {
      toggle.checked = online;
      toggle.disabled = false;
    }
    const sub = document.getElementById('wsOnlineSub');
    if (sub) {
      sub.textContent = online
        ? 'Accepting new walks'
        : 'Hidden from new requests';
    }
  }

  window.setWalkShareOnlineStatus = function (on) {
    const w = ensureWalk();
    if (!isApproved(w)) {
      w.verificationStatus = 'approved';
      (w.documents || []).forEach((doc) => { if (doc.status !== 'approved') doc.status = 'approved'; });
    }
    w.isOnline = !!on;
    persist();
    syncWalkOnlineUi(w);
    toast(w.isOnline ? '✓ You are Online · Accepting new walks' : 'You are now Offline');
  };

  window.toggleWalkShareOnline = function () {
    window.setWalkShareOnlineStatus(!ensureWalk().isOnline);
  };

  function partnerOnlineRow(checked, disabled) {
    return `<div class="partner-status-row profile-menu-item" style="cursor:pointer;" onclick="window.toggleWalkShareOnline()">
      <div class="partner-status-copy">
        <span class="partner-status-title">Online status</span>
        <span class="partner-status-sub" id="wsOnlineSub">${checked ? 'Accepting new walks' : 'Hidden from new requests'}</span>
      </div>
      <label class="partner-status-switch" onclick="event.stopPropagation()">
        <input type="checkbox" id="wsOnlineToggle" ${checked ? 'checked' : ''} onchange="window.setWalkShareOnlineStatus(this.checked)" />
        <span class="partner-status-slider"></span>
      </label>
    </div>`;
  }

  function hasAccess(w) {
    return w.subscription && (w.subscription.status === 'trial' || w.subscription.status === 'active');
  }

  function onboardingDone(w) {
    const o = w.onboarding || {};
    return o.profile && o.group && o.docs && o.availability && o.rate;
  }

  function docsApproved(w) {
    return REQUIRED_DOCS.every((spec) => {
      const doc = (w.documents || []).find((d) => d.id === spec.id);
      return doc && doc.status === 'approved';
    });
  }

  function canAccept(w) {
    return isApproved(w) && hasAccess(w) && docsApproved(w);
  }

  function acceptedSeatsAt(timeStr, ignoreId) {
    if (!timeStr) return 0;
    const t = String(timeStr).trim();
    return ensureWalk().requests
      .filter((r) => r.status === 'accepted' && r.id !== ignoreId)
      .filter((r) => String(r.pickupTime || '') === t || String(r.returnTime || '') === t)
      .reduce((sum, r) => sum + (Number(r.seatsNeeded) || kids(r).length || 1), 0);
  }

  function requestCapacityBlock(w, req) {
    if (!req) return '';
    const seats = Number(req.seatsNeeded) || kids(req).length || 1;
    const cap = Number(w.group?.capacity) || 0;
    if (!cap) return 'Set group capacity first';
    if (seats > cap) return `Need ${seats} spots — group holds ${cap}`;
    const pickup = req.pickupTime || '';
    if (pickup) {
      const used = acceptedSeatsAt(pickup, req.id);
      if (used + seats > cap) return `Only ${Math.max(0, cap - used)} spot(s) free at ${pickup}`;
    }
    const ret = req.returnTime || '';
    if (ret && req.direction !== 'oneway') {
      const usedR = acceptedSeatsAt(ret, req.id);
      if (usedR + seats > cap) return `Only ${Math.max(0, cap - usedR)} spot(s) free at ${ret}`;
    }
    return '';
  }

  function kids(req) {
    return Array.isArray(req?.children) ? req.children.filter(Boolean) : [];
  }

  function childShort(req) {
    return kids(req).map((c) => String(c.name || '').split(' ')[0]).join(' + ') || req?.childNamesShort || 'Children';
  }

  function cleanPlace(value) {
    let s = String(value || '').trim();
    if (!s) return '';
    s = s.replace(/^(Home|School|Pickup|Drop-?off|Meetup|Meeting point)\s*[:(–-]\s*/i, '');
    s = s.replace(/\)\s*$/, '').trim();
    return s || String(value || '').trim();
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

  function compactDays(days) {
    const list = Array.isArray(days) ? days.filter(Boolean) : [];
    if (!list.length || list.length === 5) return 'Mon–Fri';
    return list.join(', ');
  }

  function dateShort(label) {
    return String(label || '').replace(/,?\s*\d{4}\s*$/, '').replace(/^Starts\s+/i, '').replace(/\s*•.*$/, '').trim();
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

  function tripKindLabel(req) {
    if (req.frequency === 'recurring') return 'Recurring';
    if (req.direction === 'oneway') return 'One-time';
    return 'Round trip';
  }

  function timeLineCard(req) {
    if (req.direction === 'oneway' || !req.returnTime) return req.pickupTime || '';
    return `${req.pickupTime || ''} · ${req.returnTime}`;
  }

  function dateLineCard(req) {
    return formatCardDate(req);
  }

  function cardMetaLine(req) {
    const seats = Number(req.seatsNeeded) || kids(req).length || 1;
    const seatBit = seats === 1 ? '1 child' : `${seats} children`;
    return `${tripKindLabel(req)} · ${seatBit}`;
  }

  function scheduleMetaLine(req) {
    return [formatCardDate(req), timeLineCard(req)].filter(Boolean).join(' · ');
  }

  function toMinutes(label) {
    const m = String(label || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
    if (!m) return 0;
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    const mer = (m[3] || '').toUpperCase();
    if (mer === 'PM' && h < 12) h += 12;
    if (mer === 'AM' && h === 12) h = 0;
    return h * 60 + min;
  }

  function dateParts(label) {
    const raw = String(label || 'Tue, Sep 9, 2026');
    const m = raw.match(/([A-Za-z]{3}),?\s*([A-Za-z]{3})\s*(\d{1,2})/);
    if (m) return { weekday: m[1], month: m[2].toUpperCase(), day: m[3] };
    return { weekday: 'Tue', month: 'SEP', day: '9' };
  }

  function formatWindow(w) {
    if (!w) return '';
    const fmt = (t) => {
      const m = String(t || '').match(/(\d{1,2}):(\d{2})/);
      if (!m) return t;
      let h = parseInt(m[1], 10);
      const min = m[2];
      const mer = h >= 12 ? 'PM' : 'AM';
      if (h > 12) h -= 12;
      if (h === 0) h = 12;
      return `${h}:${min} ${mer}`;
    };
    return `${fmt(w.start)} – ${fmt(w.end)}`;
  }

  function availSummary(a) {
    const w = (a && a.windows) || [];
    const bits = [];
    if (w[0] && w[0].enabled !== false) bits.push(formatWindow(w[0]));
    if (w[1] && w[1].enabled !== false) bits.push(formatWindow(w[1]));
    return bits.length ? ('Mon–Fri · ' + bits.join(' · ')) : 'Set weekly hours';
  }

  function newRequests() {
    return ensureWalk().requests.filter((r) => r.status === 'new');
  }

  function deriveSchedule() {
    const w = ensureWalk();
    const items = [];
    w.requests.filter((r) => r.status === 'accepted').forEach((r) => {
      items.push({
        id: r.id + '-am',
        requestId: r.id,
        time: r.pickupTime || '07:40 AM',
        childNames: childShort(r),
        children: kids(r),
        parentId: r.parentId,
        parentName: r.parentName,
        from: cleanPlace(r.pickupLocation),
        to: cleanPlace(r.dropoffLocation),
        route: `${cleanPlace(r.pickupLocation)} → ${cleanPlace(r.dropoffLocation)}`,
        leg: 'morning',
        badge: r.direction === 'oneway' ? 'One way' : 'Round trip',
        status: 'upcoming',
        isActionableNow: true,
        when: r.dateLabel || 'Tue, Sep 9, 2026'
      });
      if (r.returnTime) {
        items.push({
          id: r.id + '-pm',
          requestId: r.id,
          time: r.returnTime,
          childNames: childShort(r),
          children: kids(r),
          parentId: r.parentId,
          parentName: r.parentName,
          from: cleanPlace(r.dropoffLocation),
          to: cleanPlace(r.pickupLocation),
          route: `${cleanPlace(r.dropoffLocation)} → ${cleanPlace(r.pickupLocation)}`,
          leg: 'afternoon',
          badge: 'Return',
          status: 'upcoming',
          isActionableNow: false,
          when: r.dateLabel || 'Tue, Sep 9, 2026'
        });
      }
    });
    return items.sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
  }

  window.getWalkShareLanding = function () {
    const w = ensureWalk();
    if (!hasAccess(w)) {
      w.subscription = w.subscription || {};
      w.subscription.status = 'trial';
      w.subscription.trialDaysLeft = w.subscription.trialDaysLeft || 14;
      persist();
    }
    return 'wsHome';
  };

  function ensureWalkRole() {
    state().activeRole = 'walkshare';
    localStorage.setItem('h2s_active_role', 'walkshare');
    document.body.setAttribute('data-role', 'walkshare');
    const shell = document.getElementById('appShell');
    if (shell) shell.setAttribute('data-role', 'walkshare');
    if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('walkshare');
  }

  function isWalkPartnerFlowScreen(name) {
    return name === 'wsDocDetail'
      || name === 'wsSetup'
      || name === 'wsPending'
      || String(name || '').indexOf('wsOnboard') === 0;
  }

  function resolveScreen(name) {
    if (AUTH.has(name)) return name;
    if (WS_ONLY.has(name) || isWalkPartnerFlowScreen(name) || String(name || '').indexOf('ws') === 0) {
      if (state().activeRole !== 'walkshare') ensureWalkRole();
      return name;
    }
    const role = state().activeRole || 'parent';
    if (role === 'walkshare') {
      if (name === 'tracking') return ensureWalk().activeWalkStage > 0 ? 'wsActiveWalk' : 'wsHome';
      if (name === 'profile' || name === 'profilePersonalInfo') return 'wsProfile';
      if (name === 'subscription' || name === 'profilePayments') return 'wsSubscription';
      if (name === 'home') return 'wsHome';
      if (name === 'bookings') return 'wsSchedule';
      if (DRIVER_ONLY.has(name)) {
        if (name === 'driverHome') return 'wsHome';
        if (name === 'driverRequests') return 'wsRequests';
        if (name === 'driverSchedule') return 'wsSchedule';
        if (name === 'driverProfile') return 'wsProfile';
        return 'wsHome';
      }
      return name;
    }
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
      ['wsOnboardProfile', 'Your profile', "leaveWalkShareGate()"],
      ['wsOnboardGroup', 'Walking group', "navigateTo('wsOnboardProfile')"],
      ['wsOnboardDocs', 'Documents', "navigateTo('wsOnboardGroup')"],
      ['wsDocDetail', 'Document', "navigateTo('wsOnboardDocs')"],
      ['wsOnboardAvailability', 'Availability', "navigateTo('wsOnboardDocs')"],
      ['wsOnboardRate', 'Posted rate', "navigateTo('wsOnboardAvailability')"],
      ['wsPayment', 'Payment preference', "backNested('wsProfile')"],
      ['wsPending', 'Verification', "navigateTo('wsSetup')"],
      ['wsSubscription', 'Platform access', "backNested('wsProfile')"],
      ['wsRequestDetail', 'Request', "navigateTo('wsRequests')"],
      ['wsWalkPrep', 'Next walk', "navigateTo('wsSchedule')"],
      ['wsActiveWalk', 'Active walk', "navigateTo('wsHome')"],
      ['wsSetup', 'WalkShare setup', "backNested('wsHome')"],
      ['wsRatings', 'Your ratings', "backNested('wsProfile')"]
    ];
    screens.forEach(([id, title, back]) => {
      if (document.getElementById('screen-' + id)) return;
      const section = document.createElement('section');
      section.className = 'screen-view';
      section.id = 'screen-' + id;
      section.style.backgroundColor = '#FFFFFF';
      const extra = id === 'wsSubscription' ? ' sub-screen-body' : '';
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

  function applyRoleChrome() {
    const role = state().activeRole || 'parent';
    const shell = document.getElementById('appShell');
    if (shell) shell.setAttribute('data-role', role);
    document.body.setAttribute('data-role', role);
    syncPills();
    syncSharedChrome();
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
    });
  }

  function feed(id) {
    return document.getElementById(id);
  }

  function paint(name) {
    if (state().activeRole !== 'walkshare') {
      applyRoleChrome();
      return;
    }
    applyRoleChrome();
    if (name === 'wsHome') renderHome();
    else if (name === 'wsRequests') renderRequests(state()._wsReqTab || 'new');
    else if (name === 'wsSchedule') renderSchedule(state()._wsSchedTab || 'today');
    else if (name === 'wsProfile') renderProfile();
    else if (name === 'wsSetup') renderSetup();
    else if (name === 'wsOnboardProfile') renderOnboardProfile();
    else if (name === 'wsOnboardGroup') renderOnboardGroup();
    else if (name === 'wsOnboardDocs') renderOnboardDocs();
    else if (name === 'wsDocDetail') renderDocDetail();
    else if (name === 'wsOnboardAvailability') renderOnboardAvailability();
    else if (name === 'wsOnboardRate') renderOnboardRate();
    else if (name === 'wsRatings') renderMyRatings();
    else if (name === 'wsPayment') renderPayment();
    else if (name === 'wsPending') renderPending();
    else if (name === 'wsSubscription') renderSubscription();
    else if (name === 'wsRequestDetail') renderRequestDetail();
    else if (name === 'wsWalkPrep') renderWalkPrep();
    else if (name === 'wsActiveWalk') renderActiveWalk();
    else if (name === 'inbox') renderInbox();
    else if (name === 'messages') renderChatHeader();
    else if (name === 'notifications') renderNotifications();
    icons();
  }

  const prevNavigate = window.navigateTo;
  window.navigateTo = function (screenName, isBack) {
    const role = state().activeRole || 'parent';
    let next = screenName;
    if (role === 'walkshare') next = resolveScreen(screenName);
    else if (WS_ONLY.has(screenName)) next = resolveScreen(screenName);
    prevNavigate.call(window, next, isBack);
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
    if (next === 'walkshare') window.navigateTo(window.getWalkShareLanding(), true);
    else if (next === 'driver') window.navigateTo(typeof window.getDriverLanding === 'function' ? window.getDriverLanding() : 'driverHome', true);
    else window.navigateTo('home', true);
  };

  window.enterWalkShareFromAuth = function () {
    state().activeRole = 'walkshare';
    state().walkshareEntryFromAuth = true;
    localStorage.setItem('h2s_active_role', 'walkshare');
    applyRoleChrome();
    window.navigateTo('authOtp');
  };

  function fromProfileEdit() {
    const stack = window.navReturnStack || [];
    const role = state().activeRole || 'walkshare';
    for (let i = stack.length - 1; i >= 0; i--) {
      const entry = stack[i];
      if (entry && entry.role === role) return entry.screen === 'wsProfile' || entry.screen === 'profile';
    }
    return false;
  }

  function editingProfileChild() {
    if (fromProfileEdit()) return true;
    if (state()._docsReturnTo) return false;
    return onboardingDone(ensureWalk());
  }

  function bindChildBack(el, onboardBack) {
    const back = el?.closest('.screen-view')?.querySelector('.back-btn');
    if (!back) return;
    back.setAttribute('type', 'button');
    const useProfileReturn = (window.navReturnStack && window.navReturnStack.length) || fromProfileEdit() || editingProfileChild();
    if (useProfileReturn) {
      if (String(onboardBack || '').indexOf('backNested') === 0) {
        back.setAttribute('onclick', `event.preventDefault();event.stopPropagation();${onboardBack}`);
      } else {
        back.setAttribute('onclick', "event.preventDefault();event.stopPropagation();backNested('wsProfile')");
      }
    } else {
      back.setAttribute('onclick', `event.preventDefault();event.stopPropagation();${onboardBack}`);
    }
  }

  function bindChildTitle(el, title) {
    const titleEl = el?.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl && title) titleEl.textContent = title;
  }

  window.leaveWalkShareGate = function () {
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested('wsProfile');
      return;
    }
    if (editingProfileChild()) {
      window.navigateTo('wsProfile', true);
    } else {
      window.navigateTo('authRoleSelect', true);
    }
  };

  function openWsChild(screen, evt) {
    if (typeof window.openNestedScreen === 'function') window.openNestedScreen(screen, evt);
    else window.navigateTo(screen, true);
  }

  function renderHome() {
    const w = ensureWalk();
    const greet = document.getElementById('wsHomeGreeting');
    const meta = document.getElementById('wsHomeMeta');
    const avatar = document.getElementById('wsHomeAvatar');
    const first = (w.name || 'Sarah').split(' ')[0];
    if (greet) greet.textContent = `Hello, ${first}`;
    if (meta) {
      meta.textContent = isApproved(w)
        ? `${w.group.label} · ${w.group.capacity} kids`
        : 'Finish setup to accept walking escorts';
    }
    syncWalkOnlineUi(w);
    if (avatar) {
      avatar.src = w.photo || '/assets/avatar_sarah.jpg';
      avatar.alt = w.name || 'WalkShare';
      avatar.onerror = function () { this.onerror = null; this.src = '/assets/avatar_sarah.jpg'; };
    }
    const schedule = deriveSchedule();
    const incoming = newRequests();
    let next = schedule[0] || null;
    const live = w.activeWalkStage > 0 && w.activeWalk;
    if (live) next = w.activeWalk;
    const rest = schedule.filter((item) => !next || item.id !== next.id);
    const hero = document.getElementById('wsHeroContainer');
    const feedEl = document.getElementById('wsHomeFeed');
    if (hero) {
      if (next) {
        hero.innerHTML = `<div class="drv-home-section">${activeWalkCard(next, !!live)}</div>`;
      } else if (incoming[0]) {
        hero.innerHTML = `<div class="drv-home-section">
          <div class="drv-home-section-row">
            <h3 class="drv-home-heading">New request</h3>
            <button type="button" class="drv-home-see-all" onclick="navigateTo('wsRequests')">See all <i data-lucide="chevron-right"></i></button>
          </div>
          ${requestCard(incoming[0])}
        </div>`;
      } else {
        hero.innerHTML = `<div class="drv-home-section">
          <div class="drv-home-empty-card">
            <div class="drv-home-empty-ico"><i data-lucide="footprints"></i></div>
            <h4>No walks today</h4>
            <p>Accepted walking escorts appear here. Parents book you as WalkShare.</p>
          </div>
        </div>`;
      }
    }
    if (feedEl) {
      feedEl.innerHTML = `
        <div class="drv-home-section">
          <h3 class="drv-home-heading">Quick actions</h3>
          <div class="drv-home-actions">
            <button type="button" class="drv-home-action drv-qa-availability" onclick="openNestedScreen('wsOnboardAvailability')">
              <span class="drv-home-action-ico"><i data-lucide="clock"></i></span>
              <span class="drv-home-action-label">Availability</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-docs" onclick="openNestedScreen('wsOnboardDocs')">
              <span class="drv-home-action-ico"><i data-lucide="shield-check"></i></span>
              <span class="drv-home-action-label">Documents</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-earnings" onclick="openNestedScreen('wsOnboardRate')">
              <span class="drv-home-action-ico"><i data-lucide="credit-card"></i></span>
              <span class="drv-home-action-label">Rates</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-sos" onclick="window.openEmergencySOSModal()">
              <span class="drv-home-action-ico"><i data-lucide="shield-alert"></i></span>
              <span class="drv-home-action-label">Safety SOS</span>
            </button>
          </div>
        </div>
        <div class="drv-home-section">
          <div class="drv-home-section-row">
            <h3 class="drv-home-heading">Today's walks</h3>
            <button type="button" class="drv-home-see-all" onclick="navigateTo('wsSchedule')">See all <i data-lucide="chevron-right"></i></button>
          </div>
          ${rest.length
            ? `<div class="drv-home-trip-list">${rest.map((item) => homeWalkRow(item)).join('')}</div>`
            : `<div class="drv-home-empty">No more walks today</div>`}
        </div>
      `;
    }
    icons();
  }

  function activeWalkCard(item, live) {
    const kidsList = item.children || [];
    const avatars = kidsList.slice(0, 2).map((c, i) => `<img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" onerror="this.src='/assets/avatar_arman.jpg'" />`).join('')
      || `<img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" onerror="this.src='/assets/avatar_arman.jpg'" />`;
    const parentPhoto = PARENTS[item.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const cap = ensureWalk().group?.capacity || 3;
    return `<div class="drv-active-card">
      <div class="drv-active-head">
        <h3 class="drv-home-heading">${live ? 'Active walk' : 'Upcoming walk'}</h3>
        <span class="drv-live-pill${live ? '' : ' is-soon'}"><span class="drv-live-dot"></span>${live ? 'Live' : 'Soon'}</span>
      </div>
      <div class="drv-active-passengers">
        <div class="child-avatar-cluster">${avatars}</div>
        <div class="drv-active-pass-copy">
          <div class="drv-active-kids">${esc(item.childNames)}</div>
          <div class="drv-active-route">${esc(item.route || '')}</div>
          <div class="drv-active-meta">
            <span><i data-lucide="clock"></i> ${esc(item.time)}</span>
            <span><i data-lucide="users"></i> ${cap} kids</span>
          </div>
        </div>
      </div>
      <div class="drv-active-parent">
        <div class="drv-active-parent-info">
          <img src="${esc(parentPhoto)}" alt="" class="drv-active-parent-avatar" onerror="this.src='/assets/avatar_sadia.jpg'" />
          <div>
            <div class="drv-active-parent-name">${esc(item.parentName || 'Parent')}</div>
            <div class="drv-active-parent-role">Parent</div>
          </div>
        </div>
        <div class="drv-active-parent-actions">
          <button type="button" class="drv-active-ico-btn" onclick="event.stopPropagation(); openChatWith('${esc(item.parentId || 'PRNT-9042')}')" aria-label="Message"><i data-lucide="message-square"></i></button>
        </div>
      </div>
      <button type="button" class="btn-primary drv-active-cta" onclick="startWalkShareWalk('${esc(item.id)}')">
        <span>${live ? 'Open walk' : "I'm on the way"}</span>
        <i data-lucide="arrow-right"></i>
      </button>
    </div>`;
  }

  function homeWalkRow(item) {
    const d = dateParts(item.when);
    return `<button type="button" class="drv-home-trip" onclick="navigateTo('wsSchedule')">
      <div class="drv-home-trip-date">
        <span class="drv-home-trip-month">${esc(d.month)}</span>
        <span class="drv-home-trip-day">${esc(d.day)}</span>
        <span class="drv-home-trip-wd">${esc(d.weekday || '')}</span>
      </div>
      <div class="drv-home-trip-body">
        <div class="drv-home-trip-top">
          <span class="drv-home-trip-time">${esc(item.time)}</span>
          <span class="drv-home-trip-badge">${esc(item.badge || 'Walk')}</span>
        </div>
        <p class="drv-home-trip-route">${esc(item.route)}</p>
        <p class="drv-home-trip-kids">${esc(item.childNames)}</p>
      </div>
      <i data-lucide="chevron-right" class="drv-home-trip-chevron"></i>
    </button>`;
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

  function requestCard(req) {
    const from = cleanPlace(req.pickupLocation) || 'Pickup';
    const to = cleanPlace(req.dropoffLocation) || 'Drop-off';
    const name = req.parentName || 'Parent';
    const photo = req.parentPhoto || PARENTS[req.parentId]?.photo || '/assets/avatar_sadia.jpg';
    
    // Format Date & Times
    const displayDate = formatScheduleTitle(req.frequency === 'recurring'
      ? (req.recurringDays && req.recurringDays.length ? 'Weekly (' + req.recurringDays.join(', ') + ')' : 'Mon – Fri Weekly')
      : (dateShort(req.dateLabel) || 'Sep 17, 2026'));
    
    const pickupT = req.pickupTime || '07:45 AM';
    const returnT = req.returnTime || '';
    const timesText = returnT ? pickupT + ' & ' + returnT : pickupT;
    
    const isBoth = req.direction === 'bothway' || (returnT && returnT.length > 0);
    const dirPillHtml = isBoth
      ? `<span style="background:rgba(27,43,104,0.08); color:#1B2B68; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="refresh-cw" style="width:11px; height:11px;"></i> Round Trip</span>`
      : `<span style="background:#FFF7ED; color:#EA580C; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right" style="width:11px; height:11px;"></i> One-way</span>`;

    // Parse price
    const priceVal = String(req.rate || (req.rateLabel ? req.rateLabel.replace(/\D/g, '') : '35') || '35');

    // Contextual actions
    let actionHtml = '';
    if (req.status === 'new') {
      actionHtml = `
        <div style="display:flex; align-items:center; gap:6px;" onclick="event.stopPropagation();">
          <button type="button" onclick="declineWalkShareRequest('${esc(req.id)}')" style="background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; border-radius:99px; padding:5px 12px; font-size:11.5px; font-weight:700; cursor:pointer;">
            Decline
          </button>
          <button type="button" onclick="acceptWalkShareRequest('${esc(req.id)}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:5px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
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
      <article class="h2s-booking-card" onclick="openWalkShareRequest('${esc(req.id)}')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:12px 14px; margin-bottom:10px; box-shadow:0 1px 3px rgba(15,23,42,0.03); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.15s ease;">
        <!-- Top Row: Date & Direction -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(27,43,104,0.08); color:#1B2B68; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="footprints" style="width:17px; height:17px;"></i>
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

  window.switchWalkShareRequestsTab = function (tab) {
    state()._wsReqTab = tab;
    renderRequests(tab);
  };

  function renderRequests(tab) {
    const w = ensureWalk();
    const list = w.requests.filter((r) => r.status === tab);
    ['new', 'accepted', 'declined'].forEach((key) => {
      const btn = document.getElementById('btnWsReq' + key.charAt(0).toUpperCase() + key.slice(1));
      if (btn) {
        btn.classList.toggle('active', key === tab);
        btn.setAttribute('aria-selected', key === tab ? 'true' : 'false');
      }
    });
    const wrap = document.getElementById('wsRequestsListWrap');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="inbox"></i></div><h4>No ${tab} requests</h4><p>New requests show up here.</p></div>`;
    } else {
      wrap.innerHTML = list.map((r) => requestCard(r)).join('');
    }
    icons();
  }

  window.openWalkShareRequest = function (id) {
    ensureWalk().selectedRequestId = id;
    window.navigateTo('wsRequestDetail');
  };

  function syncParentBookingStatus(req, next) {
    const bookings = state().bookings || [];
    const booking = bookings.find((b) => b.id === req.bookingId);
    if (!booking) return;
    if (next === 'accepted') {
      booking.status = 'confirmed';
      if (!booking.agreedRate) {
        booking.agreedRate = booking.listedRate || req.rate || 75;
        booking.rateStatus = 'agreed';
      }
    }
    if (next === 'declined') booking.status = 'declined';
  }

  window.acceptWalkShareRequest = function (id) {
    const w = ensureWalk();
    if (!canAccept(w)) {
      toast(docsApproved(w) ? 'Start trial first' : 'Docs must be approved');
      return;
    }
    const req = w.requests.find((r) => r.id === id);
    if (!req || req.status !== 'new') return;
    const block = requestCapacityBlock(w, req);
    if (block) {
      toast(block, 'error');
      return;
    }
    req.status = 'accepted';
    syncParentBookingStatus(req, 'accepted');
    persist();
    toast('Accepted');
    renderRequests(state()._wsReqTab || 'new');
    if (document.getElementById('screen-wsRequestDetail')?.classList.contains('active')) renderRequestDetail();
  };

  window.declineWalkShareRequest = function (id) {
    const w = ensureWalk();
    const req = w.requests.find((r) => r.id === id);
    if (!req || req.status !== 'new') return;
    req.status = 'declined';
    syncParentBookingStatus(req, 'declined');
    persist();
    toast('Request declined');
    renderRequests(state()._wsReqTab || 'new');
    if (document.getElementById('screen-wsRequestDetail')?.classList.contains('active')) renderRequestDetail();
  };

  function walkPaymentHandleBlock(req, w, booking) {
    const handleStatus = booking?.paymentHandleStatus || (req.status === 'accepted' ? 'shared' : 'not_requested');
    const handleValue = booking?.paymentHandle || w.rate?.paymentHandle || 'sarah.jenkins@walkshare.ca';

    if (handleStatus === 'requested') {
      return `
      <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px;">
          <i data-lucide="shield-alert" style="width:18px; height:18px; color:#2563EB;"></i>
          <h4 style="margin:0; font-size:13.5px; font-weight:700; color:#1E40AF;">Payment Details Requested</h4>
        </div>
        <p style="margin:0 0 12px 0; color:#334155; font-size:12.5px; line-height:1.4;">
          Parent requested your Interac e-Transfer handle to send escort fees directly. Home2School never processes escort fees.
        </p>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-primary" style="flex:1; min-width:140px; padding:9px 12px; font-size:12.5px;" onclick="window.consentPaymentDetails('${esc(booking ? booking.id : req.bookingId)}')">
            Share e-Transfer (${esc(handleValue)})
          </button>
          <button type="button" class="btn-secondary" style="flex:1; min-width:110px; padding:9px 12px; font-size:12.5px;" onclick="window.chooseCashPayment('${esc(booking ? booking.id : req.bookingId)}')">
            Agree on Cash
          </button>
        </div>
      </div>`;
    }

    if (handleStatus === 'shared') {
      return '';
    }

    if (handleStatus === 'cash') {
      return `
      <div style="background:#FFFBEB; border:1.5px solid #FDE68A; border-radius:12px; padding:14px; margin-top:12px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
          <i data-lucide="banknote" style="width:18px; height:18px; color:#D97706;"></i>
          <h4 style="margin:0; font-size:13.5px; font-weight:700; color:#92400E;">Cash Payment Confirmed</h4>
        </div>
        <p style="margin:0; font-size:12px; color:#475569;">Parent will pay escort fees directly in cash on the first morning walk.</p>
      </div>`;
    }

    return '';
  }

  function renderRequestDetail() {
    const w = ensureWalk();
    const req = w.requests.find((r) => r.id === w.selectedRequestId) || w.requests[0];
    const el = feed('wsRequestDetailFeed');
    if (!el || !req) return;
    const screen = el.closest('.screen-view');
    const titleEl = screen?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Request details';
    const back = screen?.querySelector('.back-btn');
    if (back) back.setAttribute('onclick', "navigateTo('wsRequests')");

    const block = req.status === 'new' ? (canAccept(w) ? requestCapacityBlock(w, req) : (docsApproved(w) ? 'Start trial first' : 'Docs must be approved')) : '';

    const booking = (state().bookings || []).find((b) => b.id === req.bookingId || b.id === req.id || ('wreq-' + b.id) === req.id);
    const hasAgreedRate = booking && booking.agreedRate && booking.rateStatus === 'agreed';
    const displayRate = hasAgreedRate ? booking.agreedRate : (booking?.listedRate || (req.rate ? `$${req.rate}` : '$75'));
    const period = req.frequency === 'recurring' ? 'week' : 'walk';

    const parentPhoto = req.parentPhoto || (PARENTS[req.parentId] && PARENTS[req.parentId].photo) || '/assets/avatar_sarah.jpg';
    const parentName = req.parentName || (PARENTS[req.parentId] && PARENTS[req.parentId].name) || 'Claire Dubois';
    const parentPhone = req.parentPhone || (PARENTS[req.parentId] && PARENTS[req.parentId].phone) || '+1 (416) 555-0133';

    // Parse Date & Days for schedule card
    let fromDate = 'Sep 21';
    const dl = String(req.dateLabel || '');
    const dateMatch = dl.match(/(?:starting|starts|from)\s+([A-Za-z]+(?:\s+\d{1,2})?(?:,?\s*\d{4})?)/i) ||
                      dl.match(/([A-Za-z]{3,}\s+\d{1,2})/i);
    if (dateMatch && dateMatch[1]) {
      fromDate = dateMatch[1].replace(/^(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)[a-z]*[,.\s]*/i, '').trim();
    }
    const daysLabel = (Array.isArray(req.recurringDays) && req.recurringDays.length === 5)
      ? 'Mon–Fri'
      : (Array.isArray(req.recurringDays) && req.recurringDays.length > 0)
        ? req.recurringDays.join(', ')
        : (req.frequency === 'recurring' ? 'Mon–Fri' : 'One-time');

    const pickupTimeStr = req.pickupTime || '08:05 AM';
    const returnTimeStr = (req.direction === 'oneway' || !req.returnTime) ? 'One-way' : req.returnTime;

    const childList = kids(req);
    const passengersHtml = childList.length > 0
      ? childList.map((c) => {
          const kidPhoto = c.photo || (c.id === 'arman' ? '/assets/avatar_arman.jpg' : c.id === 'emma' ? '/assets/avatar_emma.jpg' : c.id === 'omar' ? '/assets/avatar_arman.jpg' : '/assets/avatar_zara.jpg');
          const sub = c.grade || c.age || 'Grade 5';
          return `
            <div style="display:flex; align-items:center; gap:14px; margin-bottom:8px;">
              <img src="${esc(kidPhoto)}" alt="${esc(c.name)}" style="width:44px; height:44px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_arman.jpg'" />
              <div>
                <div style="font-size:15px; font-weight:700; color:#0F172A;">${esc(c.name)}</div>
                <div style="font-size:13px; color:#64748B; font-weight:500; margin-top:2px;">${esc(sub)}</div>
              </div>
            </div>`;
        }).join('')
      : `
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:8px;">
          <img src="/assets/avatar_arman.jpg" alt="Child" style="width:44px; height:44px; border-radius:50%; object-fit:cover;" />
          <div>
            <div style="font-size:15px; font-weight:700; color:#0F172A;">${esc(childShort(req) || 'Benjamin Dubois')}</div>
            <div style="font-size:13px; color:#64748B; font-weight:500; margin-top:2px;">Grade 5</div>
          </div>
        </div>`;

    const isNew = req.status === 'new';

    el.innerHTML = `
      <div style="padding:4px 0 24px;">
        <!-- 1. Guardian Header -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:12px;">
          <div style="display:flex; align-items:center; gap:14px; min-width:0; flex:1;">
            <div style="position:relative; flex-shrink:0;">
              <img src="${esc(parentPhoto)}" alt="${esc(parentName)}" style="width:52px; height:52px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_sarah.jpg';" />
            </div>
            <div style="min-width:0; flex:1;">
              <div style="display:flex; align-items:center; gap:6px;">
                <h3 style="font-size:16px; font-weight:800; color:#0F172A; margin:0; line-height:1.2;">${esc(parentName)}</h3>
                <svg style="width:16px; height:16px; flex-shrink:0; color:#2563EB;" viewBox="0 0 24 24" fill="currentColor">
                  <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
                </svg>
              </div>
              <div style="font-size:13px; color:#64748B; font-weight:500; margin-top:2px;">Primary guardian</div>
              <div style="font-size:13.5px; color:#0F172A; font-weight:600; margin-top:2px;">${esc(parentPhone)}</div>
            </div>
          </div>
          <button type="button" class="btn-icon-subtle" onclick="openChatWith('${esc(req.parentId || 'PRNT-9042')}')" title="Message Parent" aria-label="Message Parent" style="width:44px; height:44px; border-radius:14px; background:#EFF6FF; color:#2563EB; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer; flex-shrink:0; transition:background 0.15s ease;" onmouseover="this.style.background='#DBEAFE'" onmouseout="this.style.background='#EFF6FF'">
            <i data-lucide="message-square" style="width:20px; height:20px;"></i>
          </button>
        </div>

        <div style="height:1px; background:#F1F5F9; margin:18px 0;"></div>

        <!-- 2. Child Section -->
        <div>
          <div style="font-size:11px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px; margin-bottom:12px;">
            ${childList.length > 1 ? 'CHILDREN' : 'CHILD'}
          </div>
          ${passengersHtml}
        </div>

        <div style="height:1px; background:#F1F5F9; margin:18px 0;"></div>

        <!-- 3. Route Section -->
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
            <h3 style="font-size:18px; font-weight:800; color:#0F172A; margin:0;">Route</h3>
            <span style="font-size:13px; color:#64748B; font-weight:500;">1.2 km · Est. 14 min</span>
          </div>
          <div style="display:flex; flex-direction:column;">
            <div style="display:flex; align-items:flex-start; gap:14px;">
              <div style="display:flex; flex-direction:column; align-items:center; width:20px; flex-shrink:0; padding-top:2px;">
                <div style="width:18px; height:18px; border-radius:50%; border:2.5px solid #2563EB; background:#FFFFFF;"></div>
                <div style="width:2px; height:26px; border-left:2px dotted #94A3B8; margin:3px 0;"></div>
              </div>
              <div style="min-width:0; flex:1;">
                <div style="font-size:11px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px;">PICKUP</div>
                <div style="font-size:14.5px; font-weight:700; color:#0F172A; margin-top:2px;">${esc(cleanPlace(req.pickupLocation) || '77 Rosedale Valley Road')}</div>
              </div>
            </div>
            <div style="display:flex; align-items:flex-start; gap:14px;">
              <div style="display:flex; align-items:center; justify-content:center; width:20px; flex-shrink:0; padding-top:2px;">
                <i data-lucide="building-2" style="width:20px; height:20px; color:#2563EB;"></i>
              </div>
              <div style="min-width:0; flex:1;">
                <div style="font-size:11px; font-weight:700; color:#64748B; text-transform:uppercase; letter-spacing:0.5px;">DROP-OFF</div>
                <div style="font-size:14.5px; font-weight:700; color:#0F172A; margin-top:2px;">${esc(cleanPlace(req.dropoffLocation) || 'Rosedale Public School')}</div>
              </div>
            </div>
          </div>
          <div style="font-size:13px; color:#64748B; font-weight:500; margin-top:14px;">
            Sidewalks & Crossing Care
          </div>
        </div>

        <div style="height:1px; background:#F1F5F9; margin:18px 0;"></div>

        <!-- 4. Schedule Section -->
        <div>
          <h3 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 14px 0;">Schedule</h3>
          <div style="background:#F0F5FD; border-radius:16px; padding:16px;">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <div style="display:flex; align-items:center; gap:10px;">
                <i data-lucide="calendar" style="width:18px; height:18px; color:#2563EB;"></i>
                <span style="font-size:14.5px; color:#0F172A;">From <strong style="font-weight:800;">${esc(fromDate)}</strong></span>
              </div>
              <div style="font-size:13px; font-weight:600; color:#475569;">
                ${esc(daysLabel)}
              </div>
            </div>
            <div style="height:1px; background:rgba(203, 213, 225, 0.6); margin:14px 0;"></div>
            <div style="display:flex; align-items:center;">
              <div style="flex:1;">
                <div style="font-size:12px; color:#64748B; font-weight:500;">Pickup</div>
                <div style="font-size:18px; font-weight:800; color:#0F172A; margin-top:2px;">${esc(pickupTimeStr)}</div>
              </div>
              <div style="width:1px; height:36px; background:rgba(203, 213, 225, 0.8); margin:0 16px;"></div>
              <div style="flex:1;">
                <div style="font-size:12px; color:#64748B; font-weight:500;">Return</div>
                <div style="font-size:18px; font-weight:800; color:#0F172A; margin-top:2px;">${esc(returnTimeStr)}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Special Notes -->
        ${req.notes ? `
          <div style="height:1px; background:#F1F5F9; margin:18px 0;"></div>
          <div>
            <h3 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 14px 0;">Special notes</h3>
            <div style="display:flex; align-items:flex-start; gap:12px;">
              <i data-lucide="file-text" style="width:20px; height:20px; color:#64748B; flex-shrink:0; margin-top:2px;"></i>
              <div>
                <div style="font-size:13.5px; color:#334155; line-height:1.45;">
                  ${esc(req.notes)}
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        ${walkPaymentHandleBlock(req, w, booking)}

        ${block ? `<p class="drv-home-gate" style="margin-top:14px; margin-bottom:12px;">${esc(block)}</p>` : ''}

        <!-- 6. Bottom Actions / Status -->
        <div style="margin-top:24px;">
          ${isNew ? `
            <div style="display:flex; flex-direction:column; gap:10px;">
              <button type="button" class="btn-primary" onclick="acceptWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')" ${(!canAccept(w) || block) ? 'disabled' : ''} style="height:48px; font-size:15px; font-weight:800; border-radius:12px; background:#1B2B68; color:#FFFFFF; border:none; cursor:pointer;">
                Accept at ${displayRate}/${period}
              </button>
              <button type="button" onclick="declineWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')" style="height:44px; font-size:14px; font-weight:700; border-radius:12px; background:#FFF1F2; border:1px solid #FECDD3; color:#E11D48; cursor:pointer;">
                Decline
              </button>
            </div>
          ` : req.status === 'declined' ? `
            <div style="padding:14px 16px; background:#FEF2F2; border:1px solid #FECDD3; border-radius:14px; display:flex; align-items:center; gap:10px; color:#991B1B; font-size:14px; font-weight:700;">
              <i data-lucide="x-circle" style="width:20px; height:20px; color:#DC2626;"></i>
              <span>Request declined</span>
            </div>
          ` : `
            <div style="padding:14px 16px; background:#F0FDF4; border:1px solid #BBF7D0; border-radius:14px; display:flex; align-items:center; gap:10px; color:#166534; font-size:14px; font-weight:700;">
              <i data-lucide="check-circle-2" style="width:20px; height:20px; color:#16A34A;"></i>
              <span>Accepted · Scheduled in Calendar</span>
            </div>
          `}
        </div>
      </div>
    `;
    icons();
  }

  window.switchWalkShareScheduleTab = function (tab) {
    state()._wsSchedTab = tab;
    renderSchedule(tab);
  };

  function renderSchedule(tab) {
    const mode = tab === 'upcoming' ? 'upcoming' : 'today';
    state()._wsSchedTab = mode;
    const wrap = document.getElementById('wsScheduleListWrap');
    if (!wrap) return;
    const all = deriveSchedule().map((item) => {
      if (!item.when) item.when = item.dateLabel || 'Tue, Sep 9, 2026';
      return item;
    });
    const morning = all.filter((i) => i.leg === 'morning');
    const returns = all.filter((i) => i.leg === 'afternoon');
    const todayItems = all.filter((i) => i.leg === 'morning' || i.leg === 'afternoon');
    const upcoming = all.filter((i) => i.frequency === 'onetime' || /Sep\s*1[4-9]|Sep\s*2/i.test(String(i.when || i.dateLabel || '')));
    const list = mode === 'upcoming'
      ? (upcoming.length ? upcoming : all)
      : todayItems;
    const btnT = document.getElementById('btnWsSchedToday');
    const btnU = document.getElementById('btnWsSchedUpcoming');
    if (btnT) {
      btnT.textContent = `Today (${todayItems.length})`;
      btnT.classList.toggle('active', mode === 'today');
    }
    if (btnU) {
      btnU.textContent = `Upcoming (${upcoming.length || all.length})`;
      btnU.classList.toggle('active', mode === 'upcoming');
    }
    if (!list.length) {
      wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="calendar"></i></div><h4>Nothing scheduled</h4><p>Accepted walks show here.</p></div>`;
      icons();
      return;
    }
    const section = (title, items) => {
      if (!items.length) return '';
      const dateLabel = dateShort(items[0].when || items[0].dateLabel) || 'Tue, Sep 9';
      return `<div class="drv-sched-section">
        <div class="drv-sched-section-head">
          <h3 class="drv-sched-section-title">${esc(title)}</h3>
          <span class="drv-sched-section-date">${esc(dateLabel)}</span>
        </div>
        <div class="drv-sched-list">${items.map((item) => schedCard(item)).join('')}</div>
      </div>`;
    };
    if (mode === 'upcoming') {
      wrap.innerHTML = section('Upcoming walks', list);
    } else {
      wrap.innerHTML = section('Morning walks', morning) + section('Return walks', returns);
    }
    icons();
  }

  function passengerAvatars(item) {
    const roster = (item.children || []).slice(0, 3);
    const tones = ['rose', 'mint', 'sky', 'sand'];
    if (roster.length) {
      return roster.map((c, i) => {
        const label = String(c.name || 'C').trim().split(/\s+/)[0];
        const initial = (label[0] || 'C').toUpperCase();
        return `<span class="drv-sched-ava tone-${tones[i % tones.length]}" aria-hidden="true">${esc(initial)}</span>`;
      }).join('');
    }
    const fallback = String(item.childNames || '')
      .split(/\s*[+·•,]\s*/)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 3);
    return fallback.map((name, i) => {
      const initial = (name[0] || 'C').toUpperCase();
      return `<span class="drv-sched-ava tone-${tones[i % tones.length]}" aria-hidden="true">${esc(initial)}</span>`;
    }).join('');
  }

  function passengerLine(item) {
    const kidBits = (item.children || []).map((c) => String(c.name || '').split(' ')[0]).filter(Boolean);
    const fallback = String(item.childNames || '').split(/\s*[+·•,]\s*/).map((s) => s.trim()).filter(Boolean);
    const kids = kidBits.length ? kidBits : fallback;
    return kids.join(' · ') || 'Children';
  }

  function schedCard(item) {
    const isReturn = item.leg === 'afternoon';
    const open = !!item.isActionableNow || item.status === 'active';
    
    // Format Date & Time cleanly
    const rawDate = item.when || item.dateLabel || 'Mon, Sep 7, 2026';
    const displayDate = formatScheduleTitle(rawDate);
    const timeText = item.time || '07:45 AM';
    
    const from = cleanPlace(item.from || item.pickupLocation) || 'Pickup';
    const to = cleanPlace(item.to || item.dropoffLocation || item.schoolLocation) || 'School';
    const parentPhoto = PARENTS[item.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const parentName = item.parentName || 'Sarah Tremblay';
    const kidsText = item.childNames || 'Children';

    let ctaHtml = '';
    if (open) {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
            <span class="live-dot-pulse" style="width:6px; height:6px; background:#fff; border-radius:50%;"></span>
            <span>Live Walk</span>
          </button>
        </div>`;
    } else if (item.leg === 'morning') {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#1B2B68; color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:11.5px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:5px; box-shadow:0 2px 6px rgba(27,43,104,0.2);">
            <i data-lucide="navigation" style="width:11px; height:11px;"></i>
            <span>Start</span>
          </button>
        </div>`;
    } else {
      ctaHtml = `
        <div style="width:28px; height:28px; border-radius:50%; background:#F8FAFC; color:#94A3B8; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:15px; height:15px;"></i>
        </div>`;
    }

    const isRound = item.badge === 'Round trip' || (item.returnTime != null) || (item.leg === 'afternoon');
    const dirPillHtml = isRound
      ? `<span style="background:rgba(27,43,104,0.08); color:#1B2B68; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="refresh-cw" style="width:11px; height:11px;"></i> Round Trip</span>`
      : `<span style="background:#FFF7ED; color:#EA580C; border-radius:99px; padding:4px 10px; font-size:11px; font-weight:700; display:inline-flex; align-items:center; gap:4px;"><i data-lucide="arrow-right" style="width:11px; height:11px;"></i> 1-Way Trip</span>`;

    return `
      <article class="h2s-booking-card" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:16px; padding:14px 16px; margin-bottom:12px; box-shadow:0 1px 4px rgba(15,23,42,0.04); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.15s ease;">
        <!-- Top Row: Date & Direction -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <div style="width:36px; height:36px; border-radius:10px; background:rgba(27,43,104,0.08); color:#1B2B68; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="footprints" style="width:17px; height:17px;"></i>
            </div>
            <div>
              <div style="font-size:14px; font-weight:800; color:#0F172A; line-height:1.2;">${displayDate}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:2px;">${timeText}</div>
            </div>
          </div>
          ${dirPillHtml}
        </div>

        <!-- Middle Row: Route Rail (Full width clean route without redundant kids count) -->
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

  window.startWalkShareWalk = function (id) {
    const w = ensureWalk();
    const item = deriveSchedule().find((x) => x.id === id) || deriveSchedule()[0];
    if (!item) {
      window.navigateTo('wsSchedule');
      return;
    }
    w.activeWalk = item;
    w.activeWalkStage = 1;
    persist();
    window.navigateTo('wsActiveWalk');
  };

  function renderWalkPrep() {
    const item = ensureWalk().activeWalk || deriveSchedule()[0];
    const el = feed('wsWalkPrepFeed');
    if (!el || !item) return;
    const d = dateParts(item.when || 'Tue, Sep 9, 2026');

    el.innerHTML = `
      <div class="trip-card">
        <div class="trip-card-top">
          <div class="date-badge-box">
            <span class="db-month">${esc(d.month)}</span>
            <span class="db-day">${esc(d.day)}</span>
            <span class="db-weekday">${esc(d.weekday || 'Wed')}</span>
          </div>
          <div style="flex:1;min-width:0;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
              <span class="status-chip in-progress" style="font-size:11px;padding:2px 8px;">
                <span class="status-dot"></span>
                <span>Walking Escort Group</span>
              </span>
              <span class="card-desc-muted" style="font-weight:700;color:var(--color-title);font-size:13px;">${esc(item.time || '07:40 AM')}</span>
            </div>
            <h3 class="card-title-navy" style="font-size:16px;margin:0 0 4px;">${esc(item.childNames || 'Liam + Emma')}</h3>
            <p class="card-desc-muted" style="margin:0 0 2px;">${esc(item.from || '12 Elm Street')} → ${esc(item.to || 'Greenfield Elementary')}</p>
            <p class="card-desc-muted" style="margin:0;font-size:12px;">Parent: <strong style="color:var(--color-title);">${esc(item.parentName || 'Sarah Tremblay')}</strong></p>
          </div>
        </div>
      </div>

      <!-- Safety & Readiness Checklist -->
      <div class="trip-card" style="margin-top:12px;">
        <h4 style="font-size:13px;font-weight:800;color:var(--color-title);margin:0 0 10px;display:flex;align-items:center;gap:6px;">
          <i data-lucide="shield-check" style="width:16px;height:16px;color:#1B2B68;"></i> Escort Safety Checklist
        </h4>
        <div style="display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--color-title);">
            <i data-lucide="check-circle-2" style="width:16px;height:16px;color:#1B2B68;flex-shrink:0;"></i>
            <span>High-vis safety vest & escort lanyard on</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--color-title);">
            <i data-lucide="check-circle-2" style="width:16px;height:16px;color:#1B2B68;flex-shrink:0;"></i>
            <span>Backpack reflective bands & walking ropes ready</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--color-title);">
            <i data-lucide="check-circle-2" style="width:16px;height:16px;color:#1B2B68;flex-shrink:0;"></i>
            <span>Pedestrian signal crosswalk route confirmed</span>
          </div>
          <div style="display:flex;align-items:center;gap:10px;font-size:12.5px;color:var(--color-title);">
            <i data-lucide="check-circle-2" style="width:16px;height:16px;color:#1B2B68;flex-shrink:0;"></i>
            <span>Live parent GPS tracking active</span>
          </div>
        </div>
      </div>

      <div class="drv-actions-col" style="margin-top:16px;">
        <button type="button" class="btn-primary drv-trip-cta" onclick="startWalkShareWalk('${esc(item.id)}')">I'm on the way</button>
      </div>
    `;
    icons();
  }

  const WALK_STAGES = [
    { key: 0, chip: 'Confirmed', cta: "I'm on the way", progress: 8, pin: { left: '19%', top: '74%' } },
    { key: 1, chip: 'On the way', cta: 'Arrived at meetup', progress: 22, pin: { left: '19%', top: '58%' } },
    { key: 2, chip: 'At meetup', cta: 'Confirm children with me', attendance: true, progress: 34, pin: { left: '19%', top: '36%' } },
    { key: 3, chip: 'Walking', cta: 'Arrived at school gate', progress: 58, pin: { left: '48%', top: '24%' } },
    { key: 4, chip: 'At school gate', cta: 'Confirm handoff', progress: 78, pin: { left: '78%', top: '28%' } },
    { key: 5, chip: 'Handoff', cta: 'Complete walk', progress: 92, pin: { left: '80%', top: '48%' } }
  ];

  function renderActiveWalk() {
    const w = ensureWalk();
    const item = w.activeWalk || deriveSchedule()[0] || {};
    const stage = WALK_STAGES[Math.min(w.activeWalkStage || 1, WALK_STAGES.length - 1)] || WALK_STAGES[1];
    const atDest = (w.activeWalkStage || 0) >= 3;
    const chip = document.getElementById('wsMilestoneText');
    const title = document.getElementById('wsActiveTargetTitle');
    const desc = document.getElementById('wsActiveTargetDesc');
    const eta = document.getElementById('wsActiveWalkTimeLeft');
    const btn = document.getElementById('btnWsMilestoneText');
    const btnWrap = document.getElementById('btnWsMilestoneAction');
    const slideWrap = document.getElementById('wsSlideConfirm');
    const note = document.getElementById('wsActiveWalkNote');
    const pin = document.getElementById('wsCockpitPin');
    const progressPath = document.getElementById('wsRouteProgress');
    const avatars = document.getElementById('wsActiveKidsAvatars');
    const kidsList = Array.isArray(item.children) ? item.children.filter(Boolean) : [];
    const useSlide = /arrived/i.test(stage.cta || '') && !stage.attendance;

    if (chip) chip.textContent = stage.chip;
    if (title) title.textContent = atDest ? (item.to || 'Greenfield Elementary') : (item.from || '12 Elm Street (Meetup)');
    if (desc) desc.textContent = `${item.childNames || 'Liam + Emma'} · ${atDest ? 'School gate arrival' : 'Morning walking escort'}`;
    if (eta) eta.textContent = item.time || '07:50 AM';
    if (btn) btn.textContent = stage.cta;
    if (note) {
      note.textContent = atDest
        ? 'Hand children only to authorized school staff at the gate.'
        : 'High-vis vests on. Parent sees live WalkShare status.';
    }
    if (avatars) {
      avatars.innerHTML = kidsList.slice(0, 3).map((c, i) => {
        const src = esc(c.photo || '/assets/avatar_arman.jpg');
        return `<img src="${src}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" onerror="this.src='/assets/avatar_arman.jpg'" />`;
      }).join('') || `
        <img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" onerror="this.onerror=null;this.src='/assets/avatar_arman.jpg';" />
        <img src="/assets/avatar_emma.jpg" alt="" class="avatar-img-circle overlap" onerror="this.onerror=null;this.src='/assets/avatar_arman.jpg';" />`;
    }
    if (btnWrap) btnWrap.hidden = !!useSlide;
    if (slideWrap) {
      slideWrap.hidden = !useSlide;
      if (useSlide) resetWalkShareSlide(stage.cta);
    }
    if (pin && stage.pin) {
      pin.style.left = stage.pin.left;
      pin.style.top = stage.pin.top;
    }
    if (progressPath) {
      const p = Math.max(6, Math.min(96, stage.progress || 22));
      progressPath.style.strokeDasharray = `${p} 100`;
    }
    const msg = document.getElementById('wsWalkMessageBtn');
    if (msg) msg.setAttribute('onclick', `openChatWith('${item.parentId || 'PRNT-9042'}')`);
    icons();
  }

  function resetWalkShareSlide(cta) {
    const track = document.getElementById('wsSlideTrack');
    const thumb = document.getElementById('wsSlideThumb');
    const label = document.getElementById('wsSlideLabel');
    if (!track || !thumb) return;
    track.classList.remove('is-done');
    thumb.style.transform = 'translateX(0)';
    if (label) label.textContent = 'Slide to confirm arrival';
    bindWalkShareSlide();
  }

  let wsSlideBound = false;
  function bindWalkShareSlide() {
    const track = document.getElementById('wsSlideTrack');
    const thumb = document.getElementById('wsSlideThumb');
    if (!track || !thumb || wsSlideBound) return;
    wsSlideBound = true;
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
        const label = document.getElementById('wsSlideLabel');
        if (label) label.textContent = 'Confirmed';
        setTimeout(() => window.advanceWalkShareWalk(), 180);
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

  window.advanceWalkShareWalk = function () {
    const w = ensureWalk();
    const stage = WALK_STAGES[Math.min(w.activeWalkStage || 1, WALK_STAGES.length - 1)] || WALK_STAGES[1];
    if (stage.attendance) {
      openWalkShareAttendance();
      return;
    }
    if (w.activeWalkStage >= WALK_STAGES.length - 1) {
      w.activeWalkStage = 0;
      const completedMeta = {
        bookingId: 'WS-88421',
        parentName: 'Sarah Tremblay',
        parentId: 'PRNT-9042',
        parentPhoto: '/assets/avatar_sadia.jpg',
        childNames: 'Liam (Gr 4) & Emma (Gr 2)',
        route: 'Annex Corridor → Sunshine Pre-school'
      };
      w.activeWalk = null;
      persist();
      toast('Walk complete. Parent can see the drop-off update.');
      window.navigateTo('wsHome');
      setTimeout(() => {
        if (typeof window.openWalkShareRateParentModal === 'function') {
          window.openWalkShareRateParentModal(completedMeta);
        }
      }, 500);
      return;
    }
    w.activeWalkStage += 1;
    persist();
    renderActiveWalk();
    toast(WALK_STAGES[w.activeWalkStage].chip);
  };

  function openWalkShareAttendance() {
    const w = ensureWalk();
    const item = w.activeWalk || deriveSchedule()[0] || {};
    const list = document.getElementById('wsAttendanceList');
    if (list) {
      const children = item.children || [
        { id: 'liam', name: 'Liam Tremblay', grade: 'Grade 4 · High-vis vest', photo: '/assets/avatar_arman.jpg' },
        { id: 'emma', name: 'Emma Tremblay', grade: 'Grade 2 · Reflective band', photo: '/assets/avatar_emma.jpg' }
      ];
      list.innerHTML = children.map((c) => {
        const key = c.id || c.name;
        const on = w.activeWalkChildState?.[key] !== 'not_walking';
        return `<div class="attendance-child-card ${on ? 'selected' : ''}" onclick="toggleWalkShareChild('${esc(key)}')">
          <div class="drv-child-mini">
            <img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" onerror="this.src='/assets/avatar_arman.jpg'" />
            <div><div class="menu-title-text">${esc(c.name)}</div><div class="menu-subtitle">${esc(c.grade || c.notes || '')}</div></div>
          </div>
          <span class="${on ? 'both-way-badge' : 'one-way-badge'}">${on ? 'Walking' : 'Not walking'}</span>
        </div>`;
      }).join('');
    }
    document.getElementById('wsAttendanceModal')?.classList.add('active');
    icons();
  }

  window.toggleWalkShareChild = function (key) {
    const w = ensureWalk();
    if (!w.activeWalkChildState) w.activeWalkChildState = {};
    w.activeWalkChildState[key] = w.activeWalkChildState[key] === 'not_walking' ? 'walking' : 'not_walking';
    persist();
    openWalkShareAttendance();
  };

  window.closeWalkShareAttendanceModal = function () {
    document.getElementById('wsAttendanceModal')?.classList.remove('active');
  };

  window.confirmWalkShareAttendance = function () {
    document.getElementById('wsAttendanceModal')?.classList.remove('active');
    const w = ensureWalk();
    w.activeWalkStage = 3;
    persist();
    renderActiveWalk();
    toast('Walking group confirmed. Parents see live sidewalk progress.');
  };

  function renderSetup() {
    const w = ensureWalk();
    const el = feed('wsSetupFeed');
    if (!el) return;
    const steps = [
      ['profile', '1. Profile', w.name + ' · ' + w.phone, 'wsOnboardProfile'],
      ['group', '2. Walking group', `${w.group.label} · ${w.group.capacity} kids`, 'wsOnboardGroup'],
      ['docs', '3. Documents', (w.documents.filter((d) => d.status === 'approved').length) + ' / ' + w.documents.length + ' approved', 'wsOnboardDocs'],
      ['availability', '4. Availability', availSummary(w.availability), 'wsOnboardAvailability'],
      ['rate', '5. Payment & Rates', `$${w.rate.amount} / week · ${w.rate.paymentMethod || 'Interac'}`, 'wsOnboardRate']
    ];
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:0;">${isApproved(w) ? 'Verified WalkShare' : 'WalkShare setup'}</h3>
        <p class="drv-lede">${isApproved(w) ? 'You can go online and accept walks.' : 'Profile, group, docs, hours, then rate. Parents do not upload these.'}</p>
      </div>
      <div class="profile-menu-section">
        ${steps.map(([key, title, sub, screen]) => `
          <div class="profile-menu-item" onclick="navigateTo('${screen}')">
            <div class="menu-item-left">
              <div class="menu-icon-wrap">${w.onboarding[key] ? '<i data-lucide="check"></i>' : '<i data-lucide="circle"></i>'}</div>
              <div>
                <div class="menu-title-text">${title}</div>
                <div class="menu-subtitle">${esc(sub)}</div>
              </div>
            </div>
            <i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--color-body);"></i>
          </div>
        `).join('')}
      </div>
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
    const w = ensureWalk();
    const el = document.getElementById('wsProfileFeed');
    if (!el) return;
    el.innerHTML = `
      <!-- 1. Escort Profile Hero Card -->
      <div class="profile-user-card" role="button" tabindex="0" onclick="openNestedScreen('wsOnboardProfile', event)" style="margin-bottom:12px;">
        <div style="position: relative; flex-shrink: 0;">
          <img src="${esc(w.photo || '/assets/avatar_sarah.jpg')}" alt="${esc(w.name)}" class="profile-user-avatar" style="width: 58px; height: 58px; border-radius: 50%; object-fit: cover; border: 2.5px solid rgba(255,255,255,0.3); box-shadow: 0 4px 12px rgba(0,0,0,0.25);" onerror="this.src='/assets/avatar_sarah.jpg'" />
          <span style="position: absolute; bottom: 0; right: 0; background: ${w.isOnline ? '#10B981' : '#94A3B8'}; border: 2px solid #09122C; border-radius: 50%; width: 12px; height: 12px;" title="${w.isOnline ? 'Online' : 'Offline'}"></span>
        </div>
        <div class="profile-user-meta">
          <div class="profile-user-top">
            <div class="profile-user-name-row">
              <h3 class="profile-user-name">${esc(w.name || 'Sarah Jenkins')}</h3>
              ${isApproved(w) ? `
                <span class="profile-verified-badge-wrap" title="Verified Escort">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" style="vertical-align:middle;">
                    <circle cx="12" cy="12" r="10" fill="#38BDF8"/>
                    <path d="M8.5 12.5L11 15L16 9.5" stroke="#09122C" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </span>` : ''}
            </div>
            <i data-lucide="chevron-right" class="profile-user-chevron"></i>
          </div>
          <p class="profile-user-role" style="font-size:12.5px; color:#BAE6FD; margin:2px 0 0 0; font-weight:500;">
            WalkShare Escort
          </p>
          <p class="profile-user-rating" style="margin:2px 0 0 0; font-size:12px; color:#FCD34D; font-weight:600; display:flex; align-items:center; gap:4px;">
            <span>★ ${Number(w.rating || 4.9).toFixed(1)}</span>
            <span style="color:rgba(255,255,255,0.75); font-weight:400;">(38 walks)</span>
          </p>
        </div>
      </div>

      <!-- Online Status -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${partnerOnlineRow(!!w.isOnline && isApproved(w), !isApproved(w))}
      </div>

      <!-- Section 1: Walking Group & Operations (3 links) -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${profileMenuRow('users', esc(w.group.label || 'Neighborhood Walking Group'), "openNestedScreen('wsOnboardGroup', event)")}
        ${profileMenuRow('file-check', 'Verification documents', "openNestedScreen('wsOnboardDocs', event)")}
        ${profileMenuRow('clock', 'Availability', "openNestedScreen('wsOnboardAvailability', event)")}
      </div>

      <!-- Section 2: Earnings, Reviews & Subscription (3 links) -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${profileMenuRow('wallet', 'Payment & Rates', "openNestedScreen('wsPayment', event)")}
        ${profileMenuRow('star', 'Ratings & reviews', "openNestedScreen('wsRatings', event)")}
        ${profileMenuRow('crown', 'WalkShare subscription', "openNestedScreen('wsSubscription', event)")}
      </div>

      <!-- Section 3: FAQ, Support & Policies -->
      <div class="profile-menu-section" style="margin-bottom:12px;">
        ${profileMenuRow('help-circle', 'FAQ', "openNestedScreen('faq', event)")}
        ${profileMenuRow('headphones', 'Help & Safety Support', "openNestedScreen('contactSupport', event)")}
        ${profileMenuRow('shield', 'Privacy Policy', "openNestedScreen('privacy', event)")}
        ${profileMenuRow('file-text', 'Terms of Service', "openNestedScreen('legal', event)")}
        ${profileMenuRow('info', 'About Home2School', "openNestedScreen('about', event)")}
      </div>

      <!-- Role Switcher Card -->
      <div class="profile-workspace-card" role="button" tabindex="0" onclick="window.openRoleSwitcherModal()" style="margin-bottom:12px;">
        <div class="pwc-left">
          <div class="pwc-icon-wrap walkshare"><i data-lucide="layers"></i></div>
          <div class="pwc-info">
            <div class="pwc-title">Active Role: WalkShare Escort</div>
            <div class="pwc-subtitle">Switch to Parent or Driver mode</div>
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
    if (typeof window.syncRoleCapsuleUI === 'function') window.syncRoleCapsuleUI('walkshare');
    icons();
  }

  function renderOnboardProfile() {
    const w = ensureWalk();
    const el = feed('wsOnboardProfileFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Personal Details' : 'Your Escort Profile');
    bindChildBack(el, "navigateTo('authRoleSelect')");

    el.innerHTML = `
      ${editing ? '' : `
        <div style="margin-bottom: 16px;">
          <span style="display:inline-block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#1B2B68; background:rgba(27,43,104,0.08); padding:3px 8px; border-radius:6px; margin-bottom:6px;">Step 1 of 5</span>
          <h2 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 4px 0;">Escort Profile Details</h2>
          <p style="font-size:13px; color:#64748B; margin:0; line-height:1.4;">Enter your legal name, contact details, and parent-facing bio.</p>
        </div>
      `}

      <!-- Avatar Hero with Name & Verified Badge -->
      <div style="display: flex; flex-direction: column; align-items: center; margin: 4px 0 16px;">
        <div style="position: relative;">
          <div class="drv-photo-wrap" style="width: 76px; height: 76px; border-radius: 50%; overflow: hidden; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(27, 43, 104, 0.12); background: #F1F5F9; display: flex; align-items: center; justify-content: center;">
            ${w.photo
              ? `<img src="${esc(w.photo)}" alt="${esc(w.name || 'Escort')}" id="wsProfileImg" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.parentNode.innerHTML='<div style=\\\'width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#94A3B8;background:#F8FAFC;\\\'><i data-lucide=\\\'user\\\' style=\\\'width:36px;height:36px;\\\'></i></div>';if(window.lucide)window.lucide.createIcons();" />`
              : `<div id="wsProfileImgPlaceholder" style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;color:#94A3B8;background:#F8FAFC;"><i data-lucide="user" style="width:36px;height:36px;"></i></div>`}
          </div>
          <button type="button" class="drv-photo-cam" onclick="document.getElementById('wsPhotoFile').click()" aria-label="Change photo" style="position: absolute; bottom: -2px; right: -2px; background: var(--color-primary, #1B2B68); color: #fff; border: 2px solid #fff; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.15);">
            <i data-lucide="camera" style="width:13px;height:13px;"></i>
          </button>
          <input type="file" accept="image/*" id="wsPhotoFile" class="drv-file-input" onchange="onWalkShareProfilePhoto(event)" style="display:none;" />
        </div>
        <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-top: 8px; display: inline-flex; align-items: center; gap: 6px;">
          <span>${esc(w.name || (editing ? 'Your Profile' : 'New WalkShare Escort'))}</span>
          ${isApproved(w) ? `
          <span class="fb-verified-badge" title="Verified Account">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#1877F2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.2 14.6l-3.9-3.9 1.41-1.41 2.49 2.48 5.69-5.69 1.41 1.41-7.1 7.11z"/>
            </svg>
          </span>` : ''}
        </div>
      </div>

      <!-- Unified WalkShare Profile Details Card -->
      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Full Legal Name</label>
          <div class="input-box-wrapper">
            <input type="text" class="form-input" id="wsProfileName" value="${esc(w.name || '')}" placeholder="e.g. Sarah Jenkins" />
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
            <input type="tel" class="form-input" id="wsProfilePhone" value="${esc(w.phone || '')}" placeholder="(416) 555-0199" style="border: none; border-radius: 0; padding: 0 12px; height: 100%; flex: 1; background: transparent;" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <div class="input-box-wrapper">
            <input type="email" class="form-input" id="wsProfileEmail" value="${esc(w.email || '')}" placeholder="e.g. escort@example.com" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Service Area / Corridor</label>
          <div class="input-box-wrapper">
            <input type="text" class="form-input" id="wsProfileArea" value="${esc(w.serviceArea || '')}" placeholder="e.g. Elm → Greenfield" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">About / Bio (Shown to parents)</label>
          <textarea class="form-textarea" id="wsProfileBio" rows="3" placeholder="Tell parents about your neighborhood walking group, supervised sidewalk escort care, and morning route...">${esc(w.bio || w.about || '')}</textarea>
        </div>
      </div>

      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveWalkShareProfile()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">${editing ? 'Save Profile Changes' : 'Save and Continue to Walking Group'}</button>
      </div>
    `;
    icons();
  }

  window.onWalkShareProfilePhoto = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const w = ensureWalk();
      w.photo = e.target.result;
      persist();
      const img = document.getElementById('wsProfileImg');
      if (img) img.src = w.photo;
      toast('Photo attached');
    };
    reader.readAsDataURL(file);
  };

  window.saveWalkShareProfile = function () {
    const w = ensureWalk();
    w.name = document.getElementById('wsProfileName')?.value || w.name;
    w.phone = document.getElementById('wsProfilePhone')?.value || w.phone;
    w.email = document.getElementById('wsProfileEmail')?.value || w.email;
    w.serviceArea = document.getElementById('wsProfileArea')?.value || w.serviceArea;
    w.bio = document.getElementById('wsProfileBio')?.value || w.bio;
    w.about = w.bio;
    const provider = (state().providers || []).find((p) => p.id === 'sarah');
    if (provider) {
      provider.name = w.name;
      provider.phone = w.phone;
      provider.email = w.email;
      provider.bio = w.bio;
      provider.about = w.bio;
      provider.serviceArea = w.serviceArea;
      provider.zone = window.H2SZone
        ? window.H2SZone.clean(w.group?.route || w.serviceArea)
        : (w.group?.route || w.serviceArea);
    }
    w.onboarding.profile = true;
    persist();
    if (editingProfileChild()) {
      toast('Profile updated');
      window.backNested('wsProfile');
    } else {
      toast('Profile saved — continue to walking group');
      window.navigateTo('wsOnboardGroup');
    }
  };

  function renderOnboardGroup() {
    const w = ensureWalk();
    const el = feed('wsOnboardGroupFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Walking Group' : 'Walking Group & Route');
    bindChildBack(el, editing ? "backNested('wsProfile')" : "navigateTo('wsOnboardProfile')");

    el.innerHTML = `
      ${editing ? '' : `
        <div style="margin-bottom: 16px;">
          <span style="display:inline-block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#1B2B68; background:rgba(27,43,104,0.08); padding:3px 8px; border-radius:6px; margin-bottom:6px;">Step 2 of 5</span>
          <h2 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 4px 0;">Walking Group & Route</h2>
          <p style="font-size:13px; color:#64748B; margin:0; line-height:1.4;">Configure group capacity and your daily sidewalk walking corridor.</p>
        </div>
      `}

      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Walking Group Name</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsGroupLabel" value="${esc(w.group.label || 'Neighborhood Walking Group')}" placeholder="e.g. Neighborhood Walking Group" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Max Student Capacity (Kids)</label>
          <div class="input-box-wrapper">
            <input class="form-input" type="number" min="2" max="10" id="wsGroupCap" value="${esc(w.group.capacity || 6)}" placeholder="6" />
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">Walking Corridor / Route</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsGroupRoute" value="${esc(w.group.route || 'Elm St → Greenfield Public School')}" placeholder="e.g. Elm St → Greenfield Public School" />
          </div>
        </div>
      </div>

      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveWalkShareGroup()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">${editing ? 'Save Changes' : 'Save and Continue to Documents'}</button>
      </div>
    `;
    icons();
  }

  window.saveWalkShareGroup = function () {
    const w = ensureWalk();
    w.group.label = document.getElementById('wsGroupLabel')?.value || w.group.label;
    w.group.capacity = Number(document.getElementById('wsGroupCap')?.value || w.group.capacity);
    w.group.route = document.getElementById('wsGroupRoute')?.value || w.group.route;
    const provider = (state().providers || []).find((p) => p.id === 'sarah');
    if (provider) {
      provider.zone = window.H2SZone ? window.H2SZone.clean(w.group.route || w.serviceArea) : (w.group.route || w.serviceArea);
      provider.seats = w.group.capacity;
    }
    w.onboarding.group = true;
    persist();
    if (editingProfileChild()) {
      toast('Walking group updated');
      window.backNested('wsProfile');
    } else {
      toast('Walking group saved — continue to documents');
      window.navigateTo('wsOnboardDocs');
    }
  };

  function readLocalFile(file, cb) {
    if (!file) return;
    const meta = { name: file.name, attached: true, preview: '' };
    const isImage = !!(file.type && file.type.indexOf('image/') === 0);
    if (!isImage) {
      cb(meta);
      return;
    }
    if (file.size > 12 * 1024 * 1024) {
      toast('Choose a photo under 12 MB');
      cb(meta);
      return;
    }
    const reader = new FileReader();
    reader.onload = () => cb({ name: file.name, attached: true, preview: String(reader.result || '') });
    reader.onerror = () => cb(meta);
    reader.readAsDataURL(file);
  }

  function wsDocReady(doc) {
    if (!doc) return false;
    const hasFile = !!(doc.file && (doc.file.attached || doc.file.name));
    if (doc.id === 'licence' || doc.id === 'id') {
      return hasFile && !!String(doc.number || '').trim();
    }
    if (doc.id === 'residency_tax_tenancy') {
      return hasFile && !!String(doc.address || '').trim();
    }
    if (doc.id === 'residency_utility') {
      return hasFile && !!String(doc.issuer || '').trim();
    }
    if (doc.id === 'firstaid') return hasFile && !!String(doc.issuer || '').trim();
    return hasFile && !!String(doc.issuer || '').trim();
  }

  function renderOnboardDocs() {
    const w = ensureWalk();
    const el = feed('wsOnboardDocsFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Verification Documents' : 'Documents & Safety');
    bindChildBack(el, editing ? "backNested('wsProfile')" : "navigateTo('wsOnboardGroup')");

    const submitted = w.documents.filter((doc) => doc.status !== 'not_submitted' && doc.status !== 'action_required' && doc.status !== 'rejected').length;
    el.innerHTML = `
      ${editing ? '' : `
        <div style="margin-bottom: 16px;">
          <span style="display:inline-block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#1B2B68; background:rgba(27,43,104,0.08); padding:3px 8px; border-radius:6px; margin-bottom:6px;">Step 3 of 5</span>
          <h2 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 4px 0;">Verification Documents</h2>
          <p style="font-size:13px; color:#64748B; margin:0; line-height:1.4;">Submit your photo ID, proof of residency, and police record checks.</p>
        </div>
      `}
      <p class="drv-docs-meta" style="margin-bottom: 12px;">${submitted} / ${w.documents.length} submitted · ID, Residency, VSC & CPR</p>
      <div class="profile-menu-section drv-doc-list" style="margin-bottom: 16px;">
        ${w.documents.map((doc) => {
          const needs = doc.status === 'not_submitted' || doc.status === 'action_required' || doc.status === 'rejected';
          return `
          <div class="profile-menu-item drv-doc-row" role="button" tabindex="0" onclick="openWalkShareDoc('${esc(doc.id)}')">
            <div class="menu-item-left">
              <div class="menu-icon-wrap drv-doc-icon"><i data-lucide="${doc.id === 'licence' || doc.id === 'id' ? 'credit-card' : (doc.id.startsWith('residency') ? 'home' : (doc.id === 'firstaid' ? 'heart-pulse' : 'shield-check'))}"></i></div>
              <div>
                <span class="menu-title-text">${esc(doc.title)}</span>
                ${doc.subtitle ? `<span class="menu-subtitle" style="display:block;font-size:11px;color:#64748B;">${esc(doc.subtitle)}</span>` : ''}
                ${needs ? '<span class="menu-subtitle" style="color:var(--color-primary);font-weight:700;">Tap to upload</span>' : ''}
              </div>
            </div>
            <span class="drv-doc-row-end">
              <span class="drv-doc-status ${esc(doc.status || 'not_submitted')}">${esc(doc.status === 'approved' ? 'Approved' : (doc.status === 'under_review' ? 'Under Review' : (doc.status === 'action_required' ? 'Action Required' : 'Not Submitted')))}</span>
              <i data-lucide="chevron-right" style="width:16px;height:16px;color:#94A3B8;"></i>
            </span>
          </div>`;
        }).join('')}
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveWalkShareDocsDone()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">${editing ? 'Done' : 'Save and Continue to Availability'}</button>
      </div>
    `;
    icons();
  }

  window.openWalkShareDoc = function (id) {
    const w = ensureWalk();
    ensureWalkRole();
    w.selectedDocId = id;
    const current = window.currentScreen || '';
    if (current && current !== 'wsDocDetail') {
      window.navReturnStack = window.navReturnStack || [];
      window.navReturnStack.push({ screen: current, role: 'walkshare' });
    }
    window.navigateTo('wsDocDetail', true);
  };

  function renderDocDetail() {
    const w = ensureWalk();
    const doc = w.documents.find((d) => d.id === w.selectedDocId) || w.documents[0];
    const el = feed('wsDocDetailFeed');
    if (!el || !doc) {
      window.navigateTo('wsOnboardDocs', true);
      return;
    }
    const attached = !!(doc.file && (doc.file.attached || doc.file.name));
    const fileName = attached ? (doc.file.name || 'File attached') : 'Tap to upload';
    const thumb = attached && doc.file.preview
      ? `<img class="drv-upload-thumb" src="${esc(doc.file.preview)}" alt="" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />`
      : `<span class="menu-icon-wrap drv-doc-icon" aria-hidden="true"><i data-lucide="${attached ? 'file-check' : 'upload'}"></i></span>`;
    
    let fieldHtml = '';
    let helpNote = '';

    if (doc.id === 'licence' || doc.id === 'id') {
      helpNote = 'Upload a valid government driver\'s license (front & back). We verify identity and driving credentials.';
      fieldHtml = `
        <div class="form-group">
          <label class="form-label" for="wsDocNumber">Driver's License Number</label>
          <input class="form-input" id="wsDocNumber" value="${esc(doc.number || '')}" placeholder="e.g. D4819-20381-90412" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocProvince">Issuing Province / State</label>
          <input class="form-input" id="wsDocProvince" value="${esc(doc.province || 'Ontario')}" placeholder="Ontario" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocExpiry">Expiry Date</label>
          <input class="form-input" type="date" id="wsDocExpiry" value="${esc(doc.expiry || '2028-09-15')}" />
        </div>
      `;
    } else if (doc.id === 'residency_tax_tenancy') {
      helpNote = 'Proof of Residency #1: Submit your latest annual Property Tax Statement or active signed Residential Tenancy Agreement.';
      fieldHtml = `
        <div class="form-group">
          <label class="form-label" for="wsDocResidencyType">Proof of Residency Type</label>
          <select class="form-input" id="wsDocResidencyType">
            <option value="Property Tax Statement" ${(doc.residencyType || '') === 'Property Tax Statement' ? 'selected' : ''}>Property Tax Statement</option>
            <option value="Residential Tenancy Agreement" ${(doc.residencyType || '') === 'Residential Tenancy Agreement' ? 'selected' : ''}>Tenancy Agreement (Lease)</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocAddress">Residential Address on Document</label>
          <input class="form-input" id="wsDocAddress" value="${esc(doc.address || '')}" placeholder="e.g. 124 Greenfield Ave, Toronto, ON M4B 1B3" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocIssuer">Issuing Municipality / Landlord</label>
          <input class="form-input" id="wsDocIssuer" value="${esc(doc.issuer || '')}" placeholder="e.g. City of Toronto Revenue Services or Landlord" />
        </div>
      `;
    } else if (doc.id === 'residency_utility') {
      helpNote = 'Proof of Residency #2: Submit an official utility bill (electricity, natural gas, municipal water, or internet) issued within 90 days.';
      fieldHtml = `
        <div class="form-group">
          <label class="form-label" for="wsDocIssuer">Utility Service Provider</label>
          <input class="form-input" id="wsDocIssuer" value="${esc(doc.issuer || '')}" placeholder="e.g. Toronto Hydro, Enbridge Gas, Rogers / Bell, City Water" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocAddress">Service / Billing Address</label>
          <input class="form-input" id="wsDocAddress" value="${esc(doc.address || '')}" placeholder="e.g. 124 Greenfield Ave, Toronto, ON M4B 1B3" />
        </div>
        <div class="form-group">
          <label class="form-label" for="wsDocBillDate">Bill / Statement Date</label>
          <input class="form-input" type="date" id="wsDocBillDate" value="${esc(doc.billDate || '2026-08-10')}" />
        </div>
      `;
    } else if (doc.id === 'firstaid') {
      helpNote = 'Certified pediatric emergency first-aid and CPR Level C certification.';
      fieldHtml = `
        <div class="form-group">
          <label class="form-label" for="wsDocIssuer">Certification Body</label>
          <input class="form-input" id="wsDocIssuer" value="${esc(doc.issuer || '')}" placeholder="e.g. Red Cross / St. John Ambulance" />
        </div>
      `;
    } else {
      helpNote = 'Official police record clearance for escorting and supervising children.';
      fieldHtml = `
        <div class="form-group">
          <label class="form-label" for="wsDocIssuer">Issuing Police Service</label>
          <input class="form-input" id="wsDocIssuer" value="${esc(doc.issuer || '')}" placeholder="e.g. Toronto Police Service" />
        </div>
      `;
    }

    const back = el?.closest('.screen-view')?.querySelector('.back-btn');
    if (back) {
      back.setAttribute('onclick', "event.preventDefault();event.stopPropagation();navigateTo('wsOnboardDocs', true)");
    }
    const titleEl = el?.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = doc.title;
    el.innerHTML = `
      <div class="drv-doc-detail-head">
        <span class="drv-doc-status ${esc(doc.status || 'not_submitted')}">${esc(doc.status === 'under_review' ? 'Under Review' : (doc.status === 'approved' ? 'Approved' : 'Not Submitted'))}</span>
      </div>
      <h3 class="card-title-navy" style="margin:0 0 4px;">${esc(doc.title)}</h3>
      ${helpNote ? `<p class="card-desc-muted" style="font-size:12px;margin:0 0 14px;line-height:1.4;">${esc(helpNote)}</p>` : ''}
      ${fieldHtml}
      <div class="form-group">
        <label class="form-label" for="wsDocFile">Document File (PDF or Photo)</label>
        <label class="drv-upload-tile" for="wsDocFile">
          ${thumb}
          <span class="drv-upload-copy">
            <span class="drv-upload-name">${esc(fileName)}</span>
            <span class="drv-upload-hint">${attached ? 'Tap to replace · JPG, PNG, or PDF' : 'Tap to upload · JPG, PNG, or PDF'}</span>
          </span>
        </label>
        <input type="file" accept="image/*,.pdf,application/pdf" id="wsDocFile" class="drv-file-input" onchange="onWalkShareDocFile(event)" />
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveWalkShareDoc()">${doc.status === 'not_submitted' ? 'Submit for review' : 'Save changes'}</button>
      </div>
    `;
    icons();
  }

  window.onWalkShareDocFile = function (event) {
    const input = event.target;
    const file = input.files && input.files[0];
    if (!file) return;
    const w = ensureWalk();
    const doc = w.documents.find((d) => d.id === w.selectedDocId);
    if (!doc) return;
    readLocalFile(file, (meta) => {
      doc.file = { name: meta.name, attached: true, preview: meta.preview || '' };
      doc._fileTouched = true;
      persist();
      input.value = '';
      toast('File attached');
      renderDocDetail();
    });
  };

  window.saveWalkShareDoc = function () {
    const w = ensureWalk();
    const doc = w.documents.find((d) => d.id === w.selectedDocId);
    if (!doc) return;
    if (doc.id === 'licence' || doc.id === 'id') {
      doc.number = (document.getElementById('wsDocNumber')?.value || '').trim();
      doc.province = (document.getElementById('wsDocProvince')?.value || '').trim();
      doc.expiry = (document.getElementById('wsDocExpiry')?.value || '').trim();
    } else if (doc.id === 'residency_tax_tenancy') {
      doc.residencyType = (document.getElementById('wsDocResidencyType')?.value || '').trim();
      doc.address = (document.getElementById('wsDocAddress')?.value || '').trim();
      doc.issuer = (document.getElementById('wsDocIssuer')?.value || '').trim();
    } else if (doc.id === 'residency_utility') {
      doc.issuer = (document.getElementById('wsDocIssuer')?.value || '').trim();
      doc.address = (document.getElementById('wsDocAddress')?.value || '').trim();
      doc.billDate = (document.getElementById('wsDocBillDate')?.value || '').trim();
    } else {
      doc.issuer = (document.getElementById('wsDocIssuer')?.value || '').trim();
    }
    if (!wsDocReady(doc)) {
      toast('Add the required details and upload a file');
      return;
    }
    doc.status = 'under_review';
    delete doc._fileTouched;
    persist();
    toast('Submitted for review');
    const stack = window.navReturnStack || [];
    while (stack.length) {
      const top = stack[stack.length - 1];
      if (top && (top.screen === 'wsOnboardDocs' || top.screen === 'wsDocDetail')) {
        stack.pop();
        if (top.screen === 'wsOnboardDocs') break;
        continue;
      }
      break;
    }
    window.navigateTo('wsOnboardDocs', true);
  };

  window.saveWalkShareDocsDone = function () {
    const w = ensureWalk();
    w.onboarding.docs = true;
    persist();
    if (editingProfileChild()) {
      toast('Documents saved');
      window.backNested('wsProfile');
    } else {
      toast('Documents saved — continue to availability');
      window.navigateTo('wsOnboardAvailability');
    }
  };

  function renderOnboardAvailability() {
    const w = ensureWalk();
    if (window.H2SAvailability) w.availability = window.H2SAvailability.normalize(w.availability);
    const a = w.availability;
    const el = feed('wsOnboardAvailabilityFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Availability' : 'Escort Schedule & Shifts');
    bindChildBack(el, editing ? "backNested('wsProfile')" : "navigateTo('wsOnboardDocs')");

    const m = a.windows[0] || {};
    const n = a.windows[1] || {};
    el.innerHTML = `
      ${editing ? '' : `
        <div style="margin-bottom: 16px;">
          <span style="display:inline-block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#1B2B68; background:rgba(27,43,104,0.08); padding:3px 8px; border-radius:6px; margin-bottom:6px;">Step 4 of 5</span>
          <h2 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 4px 0;">Weekly Walking Schedule</h2>
          <p style="font-size:13px; color:#64748B; margin:0; line-height:1.4;">Set morning and afternoon escort time windows (Mon–Fri).</p>
        </div>
      `}

      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div class="form-group">
          <label class="form-label">Morning Escort Start</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsAvailMStart" value="${esc(m.start || '07:15')}" placeholder="07:15" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Morning Escort End</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsAvailMEnd" value="${esc(m.end || '08:45')}" placeholder="08:45" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Afternoon Escort Start</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsAvailAStart" value="${esc(n.start || '14:30')}" placeholder="14:30" />
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Afternoon Escort End</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsAvailAEnd" value="${esc(n.end || '16:00')}" placeholder="16:00" />
          </div>
        </div>
      </div>

      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveWalkShareAvailability()" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">${editing ? 'Save Changes' : 'Save and Continue to Rates'}</button>
      </div>
    `;
    icons();
  }

  window.saveWalkShareAvailability = function () {
    const w = ensureWalk();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    w.availability = window.H2SAvailability
      ? window.H2SAvailability.normalize({
          weekly: days,
          windows: [
            { id: 'w1', days, start: document.getElementById('wsAvailMStart')?.value || '07:15', end: document.getElementById('wsAvailMEnd')?.value || '08:45', label: 'Morning', enabled: true },
            { id: 'w2', days, start: document.getElementById('wsAvailAStart')?.value || '14:30', end: document.getElementById('wsAvailAEnd')?.value || '16:00', label: 'Afternoon', enabled: true }
          ],
          exceptions: []
        })
      : w.availability;
    w.onboarding.availability = true;
    const provider = (state().providers || []).find((p) => p.id === 'sarah');
    if (provider) provider.availability = w.availability;
    persist();
    if (editingProfileChild()) {
      toast('Availability updated');
      window.backNested('wsProfile');
    } else {
      toast('Availability saved — continue to rates');
      window.navigateTo('wsOnboardRate');
    }
  };

  window.walkshareMatchesParentSearch = function (draft) {
    const w = ensureWalk();
    if (window.H2SAvailability) return window.H2SAvailability.matchesSearch(w.availability, draft || {});
    return true;
  };

  function renderWalkSharePaymentRates(feedId, isEditing) {
    const w = ensureWalk();
    const r = w.rate || {};
    const el = feed(feedId);
    if (!el) return;
    const editing = isEditing !== undefined ? isEditing : editingProfileChild();
    bindChildTitle(el, editing ? 'Payment & Rates' : 'Posted Rate & Payment');
    bindChildBack(el, editing ? "backNested('wsProfile')" : "navigateTo('wsOnboardAvailability')");

    el.innerHTML = `
      ${editing ? `
        <div class="p2p-payment-notice" style="display:flex; align-items:flex-start; gap:12px; background:#F8FAFC; border:1.5px solid #E2E8F0; border-radius:14px; padding:14px; margin-bottom:16px;">
          <div style="width:36px; height:36px; border-radius:10px; background:#EFF6FF; color:#2563EB; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
            <i data-lucide="shield-check" style="width:18px; height:18px;"></i>
          </div>
          <div>
            <div style="font-size:13.5px; font-weight:700; color:#0F172A; margin-bottom:2px;">100% Direct Escort Payments</div>
            <div style="font-size:12px; color:#64748B; line-height:1.4;">Peer-to-peer escort compensation. Home2School takes 0% commission on your walks.</div>
          </div>
        </div>
      ` : `
        <div style="margin-bottom:16px;">
          <span style="display:inline-block; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.5px; color:#1B2B68; background:rgba(27,43,104,0.08); padding:3px 8px; border-radius:6px; margin-bottom:6px;">Step 5 of 5 · Final Step</span>
          <h2 style="font-size:18px; font-weight:800; color:#0F172A; margin:0 0 4px 0;">Posted Rates & Payout Setup</h2>
          <p style="font-size:13px; color:#64748B; margin:0; line-height:1.4;">Set your weekly escort rate, walking corridor, and payment method.</p>
        </div>
      `}

      <!-- Escort Rates Card -->
      <div class="profile-form-section-card" style="margin-bottom: 14px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
          <i data-lucide="banknote" style="width:16px; height:16px; color:#1B2B68;"></i>
          <span style="font-size:14px; font-weight:700; color:#0F172A;">Escort Pricing & Rates</span>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Weekly posted rate ($ / child)</label>
          <div class="input-box-wrapper">
            <input class="form-input" type="number" id="wsRateAmount" value="${esc(r.amount || 75)}" placeholder="75" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Single walk rate (optional $)</label>
          <div class="input-box-wrapper">
            <input class="form-input" type="number" id="wsDailyAmount" value="${esc(r.dailyAmount || 25)}" placeholder="25" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Rate Flexibility</label>
          <div class="drv-toggle-row" style="display:flex; gap:8px; margin-top:4px;">
            <button type="button" id="wsNegYes" class="avail-type-btn ${r.negotiable !== false ? 'active' : ''}" style="height:42px; font-size:13px; font-weight:700;" onclick="setWalkShareNegotiable(true)">
              <i data-lucide="message-circle" style="width:14px; height:14px;"></i>
              <span>Yes, negotiable</span>
            </button>
            <button type="button" id="wsNegNo" class="avail-type-btn ${r.negotiable === false ? 'active' : ''}" style="height:42px; font-size:13px; font-weight:700;" onclick="setWalkShareNegotiable(false)">
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
            <select class="form-select" id="wsPayMethod">
              ${['Interac e-Transfer · Cash', 'Interac e-Transfer', 'Cash'].map((m) => `<option ${(r.paymentMethod || 'Interac e-Transfer · Cash') === m ? 'selected' : ''}>${m}</option>`).join('')}
            </select>
            <i data-lucide="chevron-down" class="select-chevron" style="width:18px;height:18px;color:currentColor;"></i>
          </div>
        </div>

        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Payment handle (e-Transfer email or phone)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsPayHandle" value="${esc(r.paymentHandle || w.email)}" placeholder="sarah@walkshare.ca" />
          </div>
        </div>
      </div>

      <!-- Walking Zone & Route Card -->
      <div class="profile-form-section-card" style="margin-bottom: 16px;">
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px; padding-bottom:8px; border-bottom:1px solid #F1F5F9;">
          <i data-lucide="map-pin" style="width:16px; height:16px; color:#1B2B68;"></i>
          <span style="font-size:14px; font-weight:700; color:#0F172A;">Walking Corridor & Range</span>
        </div>

        <div class="form-group" style="margin-bottom:12px;">
          <label class="form-label">Walking corridor / route</label>
          <div class="input-box-wrapper">
            <input class="form-input" type="text" id="wsServiceArea" value="${esc(w.serviceArea || 'Elm → Greenfield')}" placeholder="Elm → Greenfield" />
          </div>
        </div>

        <div class="form-group" style="margin-bottom:4px;">
          <label class="form-label">Max walking distance (km)</label>
          <div class="input-box-wrapper">
            <input class="form-input" id="wsMaxDistance" type="number" value="${esc(w.maxDistanceKm || 3)}" placeholder="3" />
          </div>
        </div>
      </div>

      <!-- Action Button -->
      <button type="button" class="avail-save-btn" onclick="saveWalkSharePaymentAndRates()">
        ${editing ? 'Save payment & rates' : 'Complete Setup & Go to Dashboard'}
      </button>
    `;
    icons();
  }

  function renderOnboardRate() {
    renderWalkSharePaymentRates('wsOnboardRateFeed', false);
  }

  function renderPayment() {
    renderWalkSharePaymentRates('wsPaymentFeed', true);
  }

  window.setWalkShareNegotiable = function (yes) {
    const w = ensureWalk();
    w.rate = w.rate || {};
    w.rate.negotiable = yes;
    const btnYes = document.getElementById('wsNegYes');
    const btnNo = document.getElementById('wsNegNo');
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

  window.saveWalkSharePaymentAndRates = function () {
    const w = ensureWalk();
    w.rate = w.rate || {};
    w.rate.amount = Number(document.getElementById('wsRateAmount')?.value || w.rate.amount || 75);
    w.rate.dailyAmount = Number(document.getElementById('wsDailyAmount')?.value || 25);
    w.rate.paymentMethod = document.getElementById('wsPayMethod')?.value || 'Interac e-Transfer · Cash';
    w.rate.paymentHandle = document.getElementById('wsPayHandle')?.value || w.rate.paymentHandle || w.email;
    w.serviceArea = document.getElementById('wsServiceArea')?.value || w.serviceArea || 'Elm → Greenfield';
    w.maxDistanceKm = Number(document.getElementById('wsMaxDistance')?.value || 3);
    w.onboarding.rate = true;
    w.onboarding.complete = true;
    const prov = (state().providers || []).find((p) => p.id === 'sarah' || p.id === 'elena');
    if (prov) {
      prov.baseWeekly = w.rate.amount;
      prov.listedRate = w.rate.amount;
      prov.oneTimeRate = w.rate.dailyAmount;
      prov.negotiable = w.rate.negotiable !== false;
      prov.preferredPayment = w.rate.paymentMethod;
      prov.serviceArea = w.serviceArea;
    }
    persist();
    if (editingProfileChild()) {
      toast('Payment & rates updated');
      window.backNested('wsProfile');
    } else {
      toast('🎉 WalkShare Escort setup complete! Welcome to your dashboard.');
      window.navigateTo('wsHome');
    }
  };

  window.saveWalkShareRate = window.saveWalkSharePaymentAndRates;
  window.saveWalkSharePayment = window.saveWalkSharePaymentAndRates;

  function renderMyRatings() {
    const w = ensureWalk();
    const el = feed('wsRatingsFeed');
    if (!el) return;
    bindChildTitle(el, 'Your ratings');
    bindChildBack(el, "backNested('wsProfile')");
    const provider = (state().providers || []).find((p) => p.id === 'sarah' || p.id === 'elena')
      || { rating: w.rating || 4.9, reviewsCount: w.reviewsCount || 45, name: w.name, category: 'walkshare', quote: w.quote };
    provider.category = 'walkshare';
    const reviews = typeof window.getProviderReviews === 'function' ? window.getProviderReviews(provider) : [];
    const rating = Number(provider.rating || w.rating || 4.9);
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

  function renderPending() {
    const w = ensureWalk();
    const el = feed('wsPendingFeed');
    if (!el) return;
    bindChildTitle(el, 'Verification status');
    bindChildBack(el, "backNested('wsProfile')");
    const approvedCount = (w.documents || []).filter((d) => d.status === 'approved').length;
    const totalCount = (w.documents || []).length;
    el.innerHTML = `
      <div class="trip-card" style="text-align:center;">
        <div class="drv-home-empty-ico" style="margin:0 auto 12px;"><i data-lucide="shield-check"></i></div>
        <h3 class="card-title-navy">${isApproved(w) ? 'Verification Approved' : 'Verification Under Review'}</h3>
        <p class="card-desc-muted">${isApproved(w) ? 'All WalkShare documents are verified and approved. You are ready to accept walks!' : 'Home2School is verifying your Driver\'s License, Proofs of Residency, and Safety background check.'}</p>
        <div style="margin-top:12px;display:inline-block;padding:4px 12px;background:#EFF6FF;border-radius:999px;font-size:12px;font-weight:700;color:#1D4ED8;">
          ${approvedCount} of ${totalCount} documents approved
        </div>
      </div>
      <div class="profile-menu-section drv-doc-list" style="margin-bottom: 16px;">
        ${(w.documents || []).map((doc) => `
          <div class="profile-menu-item drv-doc-row" role="button" tabindex="0" onclick="openWalkShareDoc('${esc(doc.id)}')">
            <div class="menu-item-left">
              <div class="menu-icon-wrap drv-doc-icon"><i data-lucide="${doc.id === 'licence' ? 'credit-card' : (doc.id.startsWith('residency') ? 'home' : (doc.id === 'firstaid' ? 'heart-pulse' : 'shield-check'))}"></i></div>
              <div>
                <span class="menu-title-text">${esc(doc.title)}</span>
                ${doc.subtitle ? `<span class="menu-subtitle" style="display:block;font-size:11px;color:#64748B;">${esc(doc.subtitle)}</span>` : ''}
              </div>
            </div>
            <span class="drv-doc-status ${esc(doc.status || 'not_submitted')}">${esc(doc.status === 'approved' ? 'Approved' : (doc.status === 'under_review' ? 'Under Review' : 'Pending'))}</span>
          </div>
        `).join('')}
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="backNested('wsProfile')" style="height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">Back to Profile</button>
      </div>
    `;
    icons();
  }

  function renderSubscription() {
    const w = ensureWalk();
    const sub = w.subscription || { status: 'trial', plan: 'monthly', trialDaysLeft: 14, priceMonthly: 19, priceAnnual: 189, renewal: 'Oct 8, 2026' };
    const el = feed('wsSubscriptionFeed');
    if (!el) return;
    bindChildTitle(el, 'Platform access');
    bindChildBack(el, "backNested('wsProfile')");
    el.classList.add('sub-screen-body');

    const isTrial = sub.status === 'trial';
    const isActive = sub.status === 'active';
    const kicker = isTrial ? 'Free trial' : isActive ? 'Active' : 'Platform access';
    const title = isTrial ? `${sub.trialDaysLeft || 14} days remaining` : isActive ? (sub.plan === 'annual' ? '$189 / year' : '$19 / month') : 'Manage platform access';
    const subtitle = `Renews ${sub.renewal || 'Oct 8, 2026'}`;
    const planName = sub.plan === 'annual' ? 'annual' : 'monthly';
    const planPrice = sub.plan === 'annual' ? '$189/yr' : '$19/mo';

    let ctaSection = '';
    if (isTrial) {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateWalkShareTrial()">Activate ${planName} access (${planPrice})</button>
        <button type="button" class="sub-btn-secondary-link" onclick="continueWalkShareTrial()">Keep free trial for now</button>
      `;
    } else if (isActive) {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateWalkShareTrial()">Save ${planName} plan</button>
        <button type="button" class="sub-cancel-link" onclick="cancelWalkShareSubscription()">Cancel subscription</button>
      `;
    } else {
      ctaSection = `
        <button type="button" class="btn-primary sub-btn-primary" onclick="activateWalkShareTrial()">Start 14-day free trial</button>
      `;
    }

    el.innerHTML = `
      <div class="sub-simple-intro">
        <h3 class="sub-screen-lede">Choose your plan</h3>
        <p class="sub-screen-note">WalkShare platform fee — not your escort rate.</p>
      </div>
      <div class="sub-status-strip" data-status="${esc(sub.status)}">
        <span class="sub-status-kicker">${kicker}</span>
        <strong class="sub-status-title">${title}</strong>
        <span class="sub-status-sub">${subtitle}</span>
      </div>
      <div class="sub-plan-block" role="radiogroup" aria-label="WalkShare plan">
        <button type="button" class="sub-plan-card ${sub.plan === 'annual' ? 'active' : ''}" onclick="selectWalkSharePlan('annual')">
          <span class="sub-plan-radio" aria-hidden="true"><i data-lucide="check"></i></span>
          <span class="sub-plan-copy">
            <span class="sub-plan-name">Annual</span>
            <span class="sub-plan-desc">Best value for the school year</span>
          </span>
          <span class="sub-plan-pricing">
            <span class="sub-plan-price">$189/year</span>
            <span class="sub-plan-compare">$228/year</span>
          </span>
          <span class="sub-plan-badge sub-plan-badge-save">Save 17%</span>
        </button>
        <button type="button" class="sub-plan-card ${sub.plan === 'monthly' ? 'active' : ''}" onclick="selectWalkSharePlan('monthly')">
          <span class="sub-plan-radio" aria-hidden="true"><i data-lucide="check"></i></span>
          <span class="sub-plan-copy">
            <span class="sub-plan-name">Monthly</span>
            <span class="sub-plan-desc">Individual escort platform access</span>
          </span>
          <span class="sub-plan-pricing">
            <span class="sub-plan-price">$19/month</span>
          </span>
        </button>
      </div>

      <div class="sub-actions">
        ${ctaSection}
      </div>
    `;
    icons();
  }

  window.selectWalkSharePlan = function (plan) {
    ensureWalk().subscription.plan = plan;
    renderSubscription();
    icons();
  };

  window.continueWalkShareTrial = function () {
    const w = ensureWalk();
    w.subscription.status = 'trial';
    persist();
    toast('Free trial active. 14 days remaining.');
    window.backNested('wsProfile');
  };

  window.cancelWalkShareSubscription = function () {
    const w = ensureWalk();
    w.subscription.status = 'cancelled';
    persist();
    toast('Renewal cancelled. Access continues until end of period.');
    renderSubscription();
  };

  window.applyWalkSharePromoCode = function () {
    const input = document.getElementById('inputWsPromoCode');
    const code = (input?.value || '').trim().toUpperCase();
    const badge = document.getElementById('wsPromoBadge');
    if (code === 'WALK20' || code === 'SCHOOL20' || code.length >= 3) {
      if (badge) badge.style.display = 'inline';
      alert(`🎉 Promo Code "${code || 'WALK20'}" applied! 20% discount activated on your WalkShare platform fee.`);
    } else {
      alert('Please enter a valid WalkShare promo code (e.g. WALK20)');
    }
  };

  window.activateWalkShareTrial = function () {
    const w = ensureWalk();
    w.subscription.status = 'trial';
    persist();
    toast('Trial active');
    if (typeof window.backNested === 'function') window.backNested('wsProfile');
    else window.navigateTo('wsProfile');
  };

  function walkInboxThreads() {
    const map = {};
    DEMO_INBOX.forEach((t) => {
      map[t.id] = { ...t };
    });
    (ensureWalk().requests || []).forEach((r) => {
      if (!r.parentId || map[r.parentId]) return;
      map[r.parentId] = {
        id: r.parentId,
        name: r.parentName,
        photo: r.parentPhoto || '/assets/avatar_sadia.jpg',
        preview: r.notes || `${childShort(r)} walking escort`,
        time: r.pickupTime || '',
        unread: 0
      };
    });
    return Object.values(map);
  }

  function renderInbox() {
    if (state().activeRole !== 'walkshare') return;
    const wrap = document.getElementById('inboxThreadList');
    if (!wrap) return;
    const threads = walkInboxThreads();
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
    const demo = DEMO_INBOX.find((t) => t.id === id);
    if (demo) return { id: demo.id, name: demo.name, photo: demo.photo, sub: 'Parent' };
    const req = (ensureWalk().requests || []).find((r) => r.parentId === id);
    if (req) return { id: req.parentId, name: req.parentName, photo: req.parentPhoto || '/assets/avatar_sadia.jpg', sub: 'Parent · ' + childShort(req) };
    return PARENTS['PRNT-9042'];
  }

  const prevChat = window.openChatWith;
  window.openChatWith = function (partyId) {
    window.activeChatProviderId = partyId;
    if (state().activeRole === 'walkshare') {
      window.navigateTo('messages');
      return;
    }
    if (typeof prevChat === 'function') prevChat(partyId);
  };

  function chatBubbleHtml(item) {
    if (item.type === 'system') {
      const tone = item.tone === 'amber'
        ? 'background:#FEF3C7;border-color:#FDE68A;color:#B45309;'
        : item.tone === 'blue'
          ? 'background:#EFF6FF;border-color:#DBEAFE;color:var(--color-primary);'
          : '';
      return `<div class="system-status-bubble" style="${tone}display:flex;align-items:center;justify-content:flex-start;gap:6px;">
        <i data-lucide="clock" style="width:14px;height:14px;"></i>
        <span>${esc(item.text)}</span>
      </div>`;
    }
    // WalkShare chat: "provider" = parent message; "parent" = escort (me)
    const cls = item.type === 'provider' ? 'provider' : 'parent';
    return `<div class="chat-bubble ${cls}">
      <div class="chat-bubble-text">${esc(item.text)}</div>
      <div class="chat-timestamp">
        ${esc(item.time || '')}
        ${cls === 'parent' ? '<i data-lucide="check-check" style="width:12px;height:12px;display:inline-block;vertical-align:middle;margin-left:2px;opacity:0.85;"></i>' : ''}
      </div>
      <div class="chat-bubble-actions">
        <button type="button" class="bubble-act-btn" onclick="copyChatMessageText(this)" title="Copy message" aria-label="Copy"><i data-lucide="copy"></i></button>
        <button type="button" class="bubble-act-btn danger" onclick="deleteIndividualChatMessage(this)" title="Delete message" aria-label="Delete"><i data-lucide="trash-2"></i></button>
        <button type="button" class="bubble-act-btn" onclick="reactToChatMessage(this, '👍')" title="Thumbs up" aria-label="React"><span>👍</span></button>
      </div>
    </div>`;
  }

  function paintWalkChat(party) {
    const stream = document.getElementById('chatStream');
    if (!stream) return;
    const key = party.id || window.activeChatProviderId || 'PRNT-9042';
    const script = DEMO_CHATS[key] || DEMO_CHATS['PRNT-9042'];
    stream.dataset.walkParty = key;
    stream.innerHTML = script.map(chatBubbleHtml).join('');
    icons();
    stream.scrollTop = stream.scrollHeight;
  }

  function renderChatHeader() {
    if (state().activeRole !== 'walkshare') return;
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
      subEl.textContent = 'Parent • WalkShare safe chat';
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
        'Group is leaving now',
        'Arrived at school gate',
        'Child joined the group',
        'Handed off safely'
      ].map((t) => `<button class="quick-reply-pill" onclick="sendQuickReply('${t.replace(/'/g, "\\'")}')">${t}</button>`).join('');
    }
    paintWalkChat(party);
  }

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

  function appendTheirs(text) {
    const stream = document.getElementById('chatStream');
    if (!stream) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble provider';
    bubble.innerHTML = `${esc(text)}<div class="chat-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
    stream.appendChild(bubble);
    stream.scrollTop = stream.scrollHeight;
  }

  const prevQuick = window.sendQuickReply;
  window.sendQuickReply = function (text) {
    if (state().activeRole === 'walkshare') {
      appendMine(text);
      setTimeout(() => appendTheirs('Thank you — we will be ready.'), 900);
      return;
    }
    if (typeof prevQuick === 'function') prevQuick(text);
  };

  const prevSend = window.handleSendChatMessage;
  window.handleSendChatMessage = function (e) {
    if (state().activeRole !== 'walkshare') {
      if (typeof prevSend === 'function') return prevSend(e);
      return;
    }
    e.preventDefault();
    const input = document.getElementById('chatInputField');
    if (!input || !input.value.trim()) return;
    appendMine(input.value.trim());
    input.value = '';
    setTimeout(() => appendTheirs('Got it — thanks Sarah.'), 900);
  };

  function renderNotifications() {
    if (state().activeRole !== 'walkshare') return;
    const list = document.getElementById('notificationsList') || document.querySelector('#screen-notifications .screen-scroll-body');
    if (!list) return;
    const notes = ensureWalk().notifications || [];
    const host = document.getElementById('notificationsList') || list;
    if (host.id === 'notificationsList' || host.classList.contains('notif-list')) {
      host.innerHTML = notes.map((n) => `
        <div class="notif-item ${n.unread ? 'unread' : ''}">
          <div class="notif-icon-wrap"><i data-lucide="footprints"></i></div>
          <div class="notif-content">
            <div class="notif-title">${esc(n.title)}</div>
            <div class="notif-body">${esc(n.body)}</div>
            <div class="notif-time-text">${esc(n.time)}</div>
          </div>
        </div>
      `).join('') || '<p class="card-desc-muted">No notifications yet.</p>';
    }
    icons();
  }

  // Keep Driver pill sync from fighting WalkShare when Driver's applyRoleChrome runs first.
  const prevDriverSync = null;

  function bookingChildren(booking) {
    const ids = booking.childIds || [];
    const all = state().children || [];
    return ids.map((id) => {
      const c = all.find((ch) => ch.id === id);
      if (!c) return { id, name: id, grade: '', photo: '/assets/avatar_arman.jpg' };
      return { id: c.id, name: c.name, grade: c.grade || '', photo: c.photo || '/assets/avatar_arman.jpg', school: c.school || booking.schoolLocation };
    });
  }

  function ingestWalkShareBooking(booking) {
    const w = ensureWalk();
    if (!booking) return;
    const provider = (state().providers || []).find((p) => p.id === booking.providerId);
    const isWalk = provider?.category === 'walkshare' || booking.providerId === 'sarah' || booking.providerId === 'elena';
    // MVP WalkShare shell (Sarah) receives all WalkShare-category bookings for demo routing.
    if (!isWalk) return;
    const status = String(booking.status || '').toLowerCase();
    // Live pipeline only — skip archived declined noise on cold load.
    if (!['pending', 'confirmed', 'in_progress'].includes(status)) {
      // Still allow live decline updates for requests already on the board.
      if ((status === 'declined' || status === 'cancelled') && (w.requests || []).some((r) => r.bookingId === booking.id)) {
        const existing = w.requests.find((r) => r.bookingId === booking.id);
        if (existing && existing.status !== 'declined') {
          existing.status = 'declined';
          persist();
        }
      }
      return;
    }
    if ((w.requests || []).some((r) => r.bookingId === booking.id)) {
      const existing = w.requests.find((r) => r.bookingId === booking.id);
      if (existing) {
        const mapped = status === 'confirmed' || status === 'in_progress'
          ? 'accepted'
          : (status === 'declined' || status === 'cancelled' ? 'declined' : existing.status);
        if (existing.status !== mapped && (status === 'confirmed' || status === 'declined' || status === 'cancelled' || status === 'in_progress')) {
          existing.status = mapped;
          persist();
        }
      }
      return;
    }
    const roster = bookingChildren(booking);
    const period = booking.frequency === 'recurring' ? 'week' : 'day';
    const rate = booking.amount || w.rate?.amount || 75;
    const user = state().user || {};
    const mapped = status === 'confirmed' || status === 'in_progress'
      ? 'accepted'
      : (status === 'declined' || status === 'cancelled' ? 'declined' : 'new');
    w.requests.unshift({
      id: 'wreq-' + booking.id,
      bookingId: booking.id,
      parentId: booking.parentId || user.id || 'PRNT-9042',
      parentName: booking.parentName || user.name || 'Parent',
      parentPhoto: booking.parentPhoto || user.photo || '/assets/avatar_sadia.jpg',
      children: roster,
      childNamesShort: roster.map((c) => String(c.name || '').split(' ')[0]).join(' + ') || 'Children',
      seatsNeeded: roster.length || (booking.childIds || []).length || 1,
      pickupLocation: booking.pickupLocation,
      dropoffLocation: booking.schoolLocation,
      dateLabel: booking.scheduleText || booking.createdAt || '',
      pickupTime: booking.outboundTime,
      returnTime: booking.returnTime || '',
      recurringDays: booking.frequency === 'recurring'
        ? (booking.selectedDays?.length ? booking.selectedDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])
        : [],
      frequency: booking.frequency === 'recurring' ? 'recurring' : 'onetime',
      direction: booking.direction === 'oneway' ? 'oneway' : 'bothway',
      rateLabel: `$${rate} / ${period}`,
      notes: 'Sidewalk-only WalkShare escort. Hand children to authorized school staff.',
      status: mapped
    });
    if (mapped === 'new') {
      w.notifications = w.notifications || [];
      w.notifications.unshift({
        id: 'wn-' + booking.id,
        title: 'New WalkShare request',
        body: `${booking.parentName || 'A parent'} requested a walking escort for ${roster.map((c) => String(c.name || '').split(' ')[0]).join(' + ') || 'children'}.`,
        time: 'Just now',
        unread: true
      });
    }
    persist();
  }

  /* ==========================================================
     Spec 4.8 Post-Walk Rating Prompt (WalkShare Rates Parent)
     ========================================================== */
  let wsParentStars = 5;
  let wsParentTags = [];
  let wsCurrentRateMeta = null;

  window.openWalkShareRateParentModal = function (meta) {
    wsCurrentRateMeta = meta || {
      bookingId: 'WS-88421',
      parentName: 'Sarah Tremblay',
      parentId: 'PRNT-9042',
      parentPhoto: '/assets/avatar_sadia.jpg',
      childNames: 'Liam & Emma',
      route: 'Annex Corridor → Greenfield Elementary'
    };
    wsParentStars = 5;
    wsParentTags = [];

    let modal = document.getElementById('modal-walkShareRateParent');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'modal-walkShareRateParent';
      modal.className = 'safety-modal-overlay';
      modal.style.cssText = 'position:fixed; inset:0; background:rgba(15,23,42,0.65); z-index:99999; display:flex; align-items:flex-end; justify-content:center; backdrop-filter:blur(4px);';
      document.body.appendChild(modal);
    }

    const parentName = wsCurrentRateMeta.parentName || 'Sarah Tremblay';
    const parentPhoto = wsCurrentRateMeta.parentPhoto || '/assets/avatar_sadia.jpg';
    const children = wsCurrentRateMeta.childNames || 'Liam (Gr 4) & Emma (Gr 2)';
    const route = wsCurrentRateMeta.route || 'Annex Corridor → Greenfield Elementary';

    modal.innerHTML = `
      <div class="safety-pin-modal-card" style="max-width:430px; width:100%; margin:0 auto; background:#FFFFFF; border-radius:24px 24px 0 0; padding:24px 20px 28px; box-sizing:border-box; animation:slideUp 0.25s cubic-bezier(0.16,1,0.3,1);">
        <!-- Top bar with close button -->
        <div style="display:flex; justify-content:flex-end; margin-bottom:8px;">
          <button type="button" onclick="closeWalkShareRateParentModal()" style="width:32px; height:32px; border-radius:50%; background:#F1F5F9; border:none; color:#64748B; display:flex; align-items:center; justify-content:center; cursor:pointer;" aria-label="Close">
            <i data-lucide="x" style="width:18px;height:18px;"></i>
          </button>
        </div>

        <!-- Clean Profile Hero -->
        <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 20px;">
          <div style="width: 72px; height: 72px; border-radius: 50%; overflow: hidden; border: 3px solid #FFFFFF; box-shadow: 0 4px 14px rgba(27, 43, 104, 0.12); margin-bottom: 10px;">
            <img src="${parentPhoto}" alt="${esc(parentName)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.onerror=null;this.src='/assets/avatar_sadia.jpg';" />
          </div>
          <h2 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 4px;">${esc(parentName)}</h2>
          <p style="font-size: 13px; font-weight: 600; color: #64748B; margin: 0 0 2px;">Children: ${esc(children)}</p>
          <p style="font-size: 12px; color: #94A3B8; margin: 0;">${esc(route)}</p>
        </div>

        <!-- 1. Star Rating -->
        <div style="text-align: center; margin-bottom: 20px;">
          <p style="font-size: 13px; font-weight: 700; color: #475569; margin: 0 0 10px;">How was the walk & handover? <span style="color:#EF4444;">*</span></p>
          <div id="wsRateParentStarsRow" style="display: flex; justify-content: center; gap: 14px; font-size: 38px; cursor: pointer;">
            <span class="rate-star" data-val="1" onclick="setWalkShareParentRatingStars(1)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
            <span class="rate-star" data-val="2" onclick="setWalkShareParentRatingStars(2)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
            <span class="rate-star" data-val="3" onclick="setWalkShareParentRatingStars(3)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
            <span class="rate-star" data-val="4" onclick="setWalkShareParentRatingStars(4)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
            <span class="rate-star" data-val="5" onclick="setWalkShareParentRatingStars(5)" style="color:#F59E0B; transition:transform 0.15s;">★</span>
          </div>
          <div id="wsRateParentSentiment" style="font-size: 13px; font-weight: 700; color: #1E293B; margin-top: 8px;">5.0 · Punctual & Cooperative Parent</div>
        </div>

        <!-- 2. Quick Highlights Tags -->
        <div style="margin-bottom: 18px;">
          <p style="font-size: 12.5px; font-weight: 700; color: #475569; margin: 0 0 8px;">What went well</p>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            ${['⏰ On Time', '🎒 High-Vis Ready', '🤝 Smooth Handover', '💬 Responsive', '🚪 School Gate Staff Alerted'].map(tag => `
              <button type="button" class="review-tag-chip" onclick="toggleWsParentTag(this, '${tag}')" style="padding: 7px 14px; border-radius: 99px; font-size: 12px; font-weight: 700; border: 1px solid #CBD5E1; background: #FFFFFF; color: #475569; cursor: pointer; transition: all 0.15s;">
                ${tag}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 3. Notes / Comments -->
        <div style="margin-bottom: 22px;">
          <label for="wsParentReviewComment" style="font-size: 12.5px; font-weight: 700; color: #475569; display: block; margin-bottom: 8px;">
            Comment <span style="font-weight: 400; color: #94A3B8;">(Optional)</span>
          </label>
          <textarea id="wsParentReviewComment" rows="3" placeholder="Any feedback about the curbside handover or walking group readiness..." style="width: 100%; border-radius: 12px; border: 1.5px solid #E2E8F0; padding: 10px 14px; font-size: 13.5px; font-family: inherit; resize: none; box-sizing: border-box;"></textarea>
        </div>

        <!-- Submit & Skip Actions -->
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <button type="button" class="btn-primary" onclick="submitWsParentRating()" style="width: 100%; height: 48px; font-size: 15px; font-weight: 700; border-radius: 12px;">Submit Rating</button>
          <button type="button" class="btn-secondary-link" onclick="closeWalkShareRateParentModal()" style="width: 100%; text-align: center; font-size: 13px; color: #64748B; background: none; border: none; padding: 8px; cursor: pointer;">Skip for now</button>
        </div>
      </div>
    `;
    modal.style.display = 'flex';
    icons();
  };

  window.closeWalkShareRateParentModal = function () {
    const modal = document.getElementById('modal-walkShareRateParent');
    if (modal) modal.style.display = 'none';
  };

  window.setWalkShareParentRatingStars = function (val) {
    wsParentStars = Number(val);
    const row = document.getElementById('wsRateParentStarsRow');
    if (row) {
      const stars = row.querySelectorAll('.rate-star');
      stars.forEach((s) => {
        const v = Number(s.getAttribute('data-val'));
        s.textContent = v <= val ? '★' : '☆';
        s.style.color = v <= val ? '#F59E0B' : '#CBD5E1';
      });
    }
    const sentimentEl = document.getElementById('wsRateParentSentiment');
    const sentiments = {
      1: '1.0 · Major Delay / Handover Issue',
      2: '2.0 · Needs Better Group Readiness',
      3: '3.0 · Average Handover',
      4: '4.0 · Good & Cooperative Parent',
      5: '5.0 · Punctual & Cooperative Parent'
    };
    if (sentimentEl) sentimentEl.textContent = sentiments[val] || `${val}.0`;
  };

  window.toggleWsParentTag = function (btn, tag) {
    btn.classList.toggle('selected');
    if (btn.classList.contains('selected')) {
      btn.style.background = '#EFF6FF';
      btn.style.borderColor = '#1B2B68';
      btn.style.color = '#1B2B68';
      if (!wsParentTags.includes(tag)) wsParentTags.push(tag);
    } else {
      btn.style.background = '#FFFFFF';
      btn.style.borderColor = '#CBD5E1';
      btn.style.color = '#475569';
      wsParentTags = wsParentTags.filter(t => t !== tag);
    }
  };

  window.submitWsParentRating = function () {
    const stars = Number(wsParentStars || 5);
    const comment = (document.getElementById('wsParentReviewComment')?.value || '').trim();
    const tags = wsParentTags.slice();
    const meta = wsCurrentRateMeta || {};
    const parentName = meta.parentName || 'Sarah Tremblay';
    const parentId = meta.parentId || 'PRNT-9042';

    if (!state().parentFeedback) state().parentFeedback = [];
    state().parentFeedback.push({
      id: 'ws-fb-' + Date.now(),
      parentId: parentId,
      parentName: parentName,
      service: 'walkshare',
      rating: stars,
      date: 'Today',
      comment: comment,
      tags: tags
    });
    persist();
    closeWalkShareRateParentModal();
    toast(`★ ${stars}-star rating submitted for ${parentName}!`);
  };

  window.ingestWalkShareBooking = ingestWalkShareBooking;

  const origSubmitBooking = window.submitBookingRequest;
  if (typeof origSubmitBooking === 'function') {
    window.submitBookingRequest = function () {
      origSubmitBooking.apply(this, arguments);
      const booking = (state().bookings || [])[0];
      ingestWalkShareBooking(booking);
    };
  }

  const origAccept = window.simulateProviderAcceptance;
  if (typeof origAccept === 'function') {
    window.simulateProviderAcceptance = function () {
      origAccept.apply(this, arguments);
      const booking = (state().bookings || []).find((b) => b.id === state().activeBookingId) || (state().bookings || [])[0];
      ingestWalkShareBooking(booking);
    };
  }

  injectScreens();
  ensureWalk();
  (state().bookings || []).forEach(ingestWalkShareBooking);
  applyRoleChrome();
  window.__h2sWalkShareReady = true;
  if (typeof window.__h2sTryBoot === 'function') window.__h2sTryBoot();
})();