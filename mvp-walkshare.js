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
    'driverOnboardRate', 'driverPayment', 'driverPending', 'driverSubscription', 'driverRequestDetail', 'driverTripPrep', 'driverRateParent'
  ]);
  const WS_ONLY = new Set([
    'wsHome', 'wsRequests', 'wsSchedule', 'wsProfile', 'wsSetup',
    'wsOnboardProfile', 'wsOnboardGroup', 'wsOnboardDocs', 'wsDocDetail', 'wsOnboardAvailability',
    'wsOnboardRate', 'wsPayment', 'wsPending', 'wsSubscription', 'wsRequestDetail', 'wsWalkPrep', 'wsActiveWalk'
  ]);
  const PARENTS = {
    'PRNT-9042': { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Arman, Emma & Zara' },
    'PRNT-2201': { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', sub: 'Parent · Yusuf & Ayla' },
    'PRNT-3310': { id: 'PRNT-3310', name: 'Priya Patel', photo: '/assets/avatar_farhana.jpg', sub: 'Parent · Riya' },
    'PRNT-1188': { id: 'PRNT-1188', name: 'Marcus Chen', photo: '/assets/avatar_john.png', sub: 'Parent · Leo & Mia' }
  };
  const DEMO_INBOX = [
    { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', preview: 'Zara is at the corner with her high-vis vest.', time: '08:06 AM', unread: 2 },
    { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', preview: 'Yusuf will wait at Maple & 2nd — blue backpack.', time: '07:48 AM', unread: 1 },
    { id: 'PRNT-3310', name: 'Priya Patel', photo: '/assets/avatar_farhana.jpg', preview: 'Can Riya join the west-gate group next week?', time: 'Yesterday', unread: 1 },
    { id: 'PRNT-1188', name: 'Marcus Chen', photo: '/assets/avatar_john.png', preview: 'Thanks for walking Leo to the after-care door.', time: 'Mon', unread: 0 }
  ];
  const DEMO_CHATS = {
    'PRNT-9042': [
      { type: 'system', text: 'WalkShare escort · Zara · Sunshine Pre-school' },
      { type: 'provider', text: 'Morning Sarah — Zara is ready for the Elm & Maple meet-up.', time: '08:02 AM' },
      { type: 'parent', text: 'Leaving the corner in 2 minutes with the group.', time: '08:04 AM' },
      { type: 'provider', text: 'Zara is at the corner with her high-vis vest.', time: '08:06 AM' },
      { type: 'system', text: 'Child joined walking group · 08:07 AM', tone: 'blue' },
      { type: 'parent', text: 'Got her — sidewalks are clear. Heading to Sunshine.', time: '08:08 AM' },
      { type: 'provider', text: 'Please hand to Ms. Jenkins at the west gate.', time: '08:09 AM' },
      { type: 'parent', text: 'Will do. About 4 minutes out.', time: '08:10 AM' }
    ],
    'PRNT-2201': [
      { type: 'system', text: 'Morning walk · Yusuf · Greenfield International' },
      { type: 'provider', text: 'Hi Sarah — Yusuf will wait at Maple & 2nd — blue backpack.', time: '07:42 AM' },
      { type: 'parent', text: 'Perfect. Group reaches Maple around 07:50.', time: '07:44 AM' },
      { type: 'provider', text: 'He’s wearing the neon jacket today.', time: '07:48 AM' },
      { type: 'parent', text: 'Seen him — joining now. Crosswalk light is green.', time: '07:51 AM' },
      { type: 'system', text: 'En route to Greenfield · sidewalk escort', tone: 'amber' },
      { type: 'provider', text: 'Text when you reach the school loop please.', time: '07:52 AM' }
    ],
    'PRNT-3310': [
      { type: 'system', text: 'Capacity inquiry · west-gate walk group' },
      { type: 'provider', text: 'Can Riya join the west-gate group next week?', time: 'Yesterday 6:10 PM' },
      { type: 'parent', text: 'We have one spot Mon–Thu mornings. Pickup near Birchwood?', time: 'Yesterday 6:18 PM' },
      { type: 'provider', text: 'Yes — 42 Birchwood at 07:55. She has an epi-pen in the front pocket.', time: 'Yesterday 6:22 PM' },
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
    { id: 'id', title: 'Government ID' },
    { id: 'criminal', title: 'Criminal Background Check' },
    { id: 'vulnerable', title: 'Vulnerable Sector Check' },
    { id: 'firstaid', title: 'Pediatric First-Aid / CPR' }
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
      { id: 'id', title: 'Government-Issued Photo ID', status: 'approved', file: demoUpload('sarah-passport.pdf'), number: 'ON-4819203' },
      { id: 'proofAddress', title: 'Proof of Address (Utility Bill)', status: 'approved', file: demoUpload('utility-bill-sarah.pdf') },
      { id: 'vulnerable', title: 'Vulnerable Sector Check (VSC)', status: 'approved', file: demoUpload('vsc-sarah.pdf') },
      { id: 'references', title: 'Two Personal References', status: 'approved', ref1: 'Principal Miller (Greenfield School) · (416) 555-0144', ref2: 'Dr. Rebecca Vance · (416) 555-0189' },
      { id: 'safetyAgreement', title: 'Signed Safety Agreement', status: 'approved', file: demoUpload('signed-safety-agreement.pdf') }
    ];
  }

  function ensureWalk() {
    if (!state().walkshare) {
      state().walkshare = defaultWalkState();
    }
    const w = state().walkshare;
    if (!w.onboarding) w.onboarding = { profile: true, group: true, docs: true, availability: true, rate: true };
    if (!w.group) w.group = { label: 'Walking School Bus', capacity: 3, route: 'Elm → Greenfield', safety: ['High-Vis Vests', 'Crossing Guard', 'Pediatric CPR'] };
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
          ['name', 'phone', 'email', 'photo', 'serviceArea', 'verificationStatus', 'isOnline', 'activeWalkStage'].forEach((key) => {
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
        label: 'Walking School Bus',
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
        { id: 'wn-1', title: 'New request', body: 'Sadia asked for a morning walk for Arman and Emma.', time: '18 min ago', unread: true },
        { id: 'wn-2', title: 'Message', body: 'Nadia: Yusuf will wait at the corner.', time: 'Yesterday', unread: true }
      ],
      requests: [
        {
          id: 'wreq-1',
          bookingId: 'H2S-WS-9042',
          parentId: 'PRNT-9042',
          parentName: 'Sadia Khan',
          parentPhoto: '/assets/avatar_sadia.jpg',
          children: [
            { id: 'arman', name: 'Arman Khan', grade: 'Grade 3', photo: '/assets/avatar_arman.jpg' },
            { id: 'emma', name: 'Emma Khan', grade: 'Grade 1', photo: '/assets/avatar_emma.jpg' }
          ],
          childNamesShort: 'Arman + Emma',
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
          parentName: 'Nadia Rahman',
          parentPhoto: '/assets/avatar_rehana.jpg',
          children: [
            { id: 'yusuf', name: 'Yusuf Rahman', grade: 'Grade 3', photo: '/assets/avatar_arman.jpg' }
          ],
          childNamesShort: 'Yusuf',
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
    if (!w.onboarding.profile) return 'wsOnboardProfile';
    if (!w.onboarding.group) return 'wsOnboardGroup';
    if (!w.onboarding.docs) return 'wsOnboardDocs';
    if (!w.onboarding.availability) return 'wsOnboardAvailability';
    if (!w.onboarding.rate) return 'wsOnboardRate';
    if (!isApproved(w)) return 'wsPending';
    // Subscription stays inside Profile — never block signup/onboarding
    if (!hasAccess(w)) {
      w.subscription = w.subscription || {};
      w.subscription.status = 'trial';
      w.subscription.trialDaysLeft = w.subscription.trialDaysLeft || 14;
      persist();
    }
    return 'wsHome';
  };

  function resolveScreen(name) {
    const role = state().activeRole || 'parent';
    if (AUTH.has(name)) return name;
    if (role === 'walkshare') {
      if (name === 'tracking') return ensureWalk().activeWalkStage > 0 ? 'wsActiveWalk' : window.getWalkShareLanding();
      if (name === 'profile' || name === 'profilePersonalInfo') return 'wsProfile';
      if (name === 'subscription' || name === 'profilePayments') return 'wsSubscription';
      if (name === 'home' || name === 'bookings' || name === 'myChildren' || PARENT_ONLY.has(name) || String(name).indexOf('booking') === 0) {
        return window.getWalkShareLanding();
      }
      if (DRIVER_ONLY.has(name)) return window.getWalkShareLanding();
      if (WS_ONLY.has(name)) {
        if (name === 'wsHome' || name === 'wsRequests' || name === 'wsSchedule' || name === 'wsActiveWalk' || name === 'wsWalkPrep') {
          const land = window.getWalkShareLanding();
          if (land !== 'wsHome') return land;
        }
        return name;
      }
      if (SHARED.has(name) || name === 'rating') return name;
      return name;
    }
    if (role !== 'walkshare' && WS_ONLY.has(name)) {
      return role === 'driver' ? (typeof window.getDriverLanding === 'function' ? window.getDriverLanding() : 'driverHome') : 'home';
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
      ['wsOnboardGroup', 'Walking group', "backNested('wsProfile')"],
      ['wsOnboardDocs', 'Documents', "backNested('wsProfile')"],
      ['wsDocDetail', 'Document', "backNested('wsOnboardDocs')"],
      ['wsOnboardAvailability', 'Availability', "backNested('wsProfile')"],
      ['wsOnboardRate', 'Posted rate', "backNested('wsProfile')"],
      ['wsPayment', 'Payment preference', "backNested('wsProfile')"],
      ['wsPending', 'Verification', "navigateTo('wsSetup')"],
      ['wsSubscription', 'Platform access', "backNested('wsProfile')"],
      ['wsRequestDetail', 'Request', "navigateTo('wsRequests')"],
      ['wsWalkPrep', 'Next walk', "navigateTo('wsSchedule')"],
      ['wsSetup', 'WalkShare setup', "backNested('wsHome')"]
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

  window.leaveWalkShareGate = function () {
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested('wsProfile');
      return;
    }
    if (onboardingDone(ensureWalk())) {
      window.navigateTo('wsProfile', true);
      return;
    }
    window.navigateTo(state().walkshareEntryFromAuth ? 'authWelcome' : 'wsSetup', true);
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
            <button type="button" class="drv-home-action drv-qa-requests${incoming.length ? ' has-badge' : ''}" onclick="navigateTo('wsRequests')">
              <span class="drv-home-action-ico"><i data-lucide="inbox"></i></span>
              <span class="drv-home-action-label">Requests</span>
              ${incoming.length ? `<span class="drv-home-action-badge">${incoming.length}</span>` : ''}
            </button>
            <button type="button" class="drv-home-action drv-qa-schedule" onclick="navigateTo('wsSchedule')">
              <span class="drv-home-action-ico"><i data-lucide="calendar"></i></span>
              <span class="drv-home-action-label">Schedule</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-availability" onclick="openNestedScreen('wsOnboardAvailability')">
              <span class="drv-home-action-ico"><i data-lucide="clock"></i></span>
              <span class="drv-home-action-label">Availability</span>
            </button>
            <button type="button" class="drv-home-action drv-qa-messages" onclick="navigateTo('inbox')">
              <span class="drv-home-action-ico"><i data-lucide="message-square"></i></span>
              <span class="drv-home-action-label">Messages</span>
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

  function requestCard(req) {
    const name = req.parentName || 'Parent';
    const from = cleanPlace(req.pickupLocation) || 'Pickup';
    const to = cleanPlace(req.dropoffLocation) || 'School';
    const photo = req.parentPhoto || PARENTS[req.parentId]?.photo || '/assets/avatar_sadia.jpg';

    // Format Date & Times
    const displayDate = req.frequency === 'recurring' 
      ? (req.recurringDays && req.recurringDays.length ? 'Weekly (' + req.recurringDays.join(', ') + ')' : 'Mon – Fri Weekly')
      : (dateShort(req.dateLabel) || 'Sep 17, 2026');
    
    const pickupT = req.pickupTime || '07:45 AM';
    const returnT = req.returnTime || '';
    const timesText = returnT ? pickupT + ' & ' + returnT : pickupT;
    
    const isBoth = req.direction === 'bothway' || (returnT && returnT.length > 0);
    const dirPillHtml = `<span style="background:#F0FDFA; color:#0F766E; font-size:11.5px; font-weight:800; padding:6px 12px; border-radius:99px; display:inline-flex; align-items:center; gap:5px; flex-shrink:0;">
        <i data-lucide="footprints" style="width:12px; height:12px;"></i>
        <span>${isBoth ? 'Round Walk' : 'Walking Bus'}</span>
      </span>`;

    // Parse price
    const priceVal = String(req.rate || (req.rateLabel ? req.rateLabel.replace(/\D/g, '') : '25') || '25');

    // Contextual actions
    let actionHtml = '';
    if (req.status === 'new') {
      actionHtml = `
        <div style="display:flex; align-items:center; gap:8px;" onclick="event.stopPropagation();">
          <button type="button" onclick="declineWalkShareRequest('${esc(req.id)}')" style="background:#F8FAFC; color:#64748B; border:1px solid #E2E8F0; border-radius:99px; padding:6px 12px; font-size:12px; font-weight:700; cursor:pointer;">
            Decline
          </button>
          <button type="button" onclick="acceptWalkShareRequest('${esc(req.id)}')" style="background:#0F766E; color:#FFFFFF; border-radius:99px; padding:6px 16px; font-size:12px; font-weight:700; border:none; cursor:pointer;">
            Accept
          </button>
        </div>`;
    } else if (req.status === 'declined') {
      actionHtml = '<span style="background:#FEE2E2; color:#DC2626; font-size:11.5px; font-weight:800; padding:4px 10px; border-radius:99px;">Declined</span>';
    } else {
      actionHtml = `
        <div style="width:32px; height:32px; border-radius:50%; background:#F0FDFA; color:#0F766E; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:16px; height:16px;"></i>
        </div>`;
    }

    return `
      <article class="h2s-booking-card" onclick="openWalkShareRequest('${esc(req.id)}')" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:22px; padding:18px 20px; margin-bottom:14px; box-shadow:0 4px 16px rgba(15,23,42,0.03); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.2s ease;">
        <!-- Top Row: Date & Direction -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; border-radius:12px; background:#F0FDFA; color:#0D9488; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="footprints" style="width:20px; height:20px;"></i>
            </div>
            <div>
              <div style="font-size:15px; font-weight:800; color:#0F172A; line-height:1.2;">${displayDate}</div>
              <div style="font-size:12px; font-weight:600; color:#64748B; margin-top:2px;">${timesText}</div>
            </div>
          </div>
          ${dirPillHtml}
        </div>

        <!-- Middle Row: Route Rail & Payout -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px;">
          <div style="display:flex; flex-direction:column; gap:8px; flex:1; min-width:0; position:relative; padding-left:2px;">
            <div style="display:flex; align-items:center; gap:10px; position:relative; z-index:2;">
              <span style="width:9px; height:9px; border-radius:50%; background:#0D9488; flex-shrink:0;"></span>
              <span style="font-size:13.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${from}</span>
            </div>
            <div style="position:absolute; left:6px; top:8px; bottom:8px; width:1.5px; border-left:1.5px dashed #CBD5E1; z-index:1;"></div>
            <div style="display:flex; align-items:center; gap:10px; position:relative; z-index:2;">
              <span style="width:9px; height:9px; border-radius:50%; border:2px solid #0D9488; background:#FFFFFF; flex-shrink:0; box-sizing:border-box;"></span>
              <span style="font-size:13.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${to}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:16px; flex-shrink:0; padding-left:16px; border-left:1px solid #F1F5F9;">
            <div style="font-size:24px; font-weight:800; color:#0F172A; letter-spacing:-0.5px;">${priceVal}</div>
          </div>
        </div>

        <!-- Footer Row: Parent & Kids Info & Actions -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${photo}" alt="" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_sadia.jpg';" />
            <div>
              <div style="font-size:13.5px; font-weight:700; color:#0F172A; line-height:1.2;">${name}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:2px;">${childShort(req)}</div>
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
    const countEl = document.getElementById('wsReqSub');
    if (countEl) countEl.textContent = tab === 'new' ? 'Incoming family requests' : tab === 'accepted' ? 'Accepted walks' : 'Declined requests';
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
    if (next === 'accepted') booking.status = 'confirmed';
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

  function renderRequestDetail() {
    const w = ensureWalk();
    const req = w.requests.find((r) => r.id === w.selectedRequestId) || w.requests[0];
    const el = feed('wsRequestDetailFeed');
    if (!el || !req) return;
    const block = req.status === 'new' ? (canAccept(w) ? requestCapacityBlock(w, req) : (docsApproved(w) ? 'Start trial first' : 'Docs must be approved')) : '';
    el.innerHTML = `
      <div class="trip-card">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
          <img src="${esc(req.parentPhoto || '/assets/avatar_sadia.jpg')}" alt="" class="provider-large-avatar" style="width:56px;height:56px;" onerror="this.src='/assets/avatar_sadia.jpg'" />
          <div>
            <h3 class="card-title-navy" style="margin:0;">${esc(req.parentName)}</h3>
            <p class="card-desc-muted" style="margin:2px 0 0;">${esc(childShort(req))} · ${esc(req.rateLabel || '')}</p>
          </div>
        </div>
        <div class="drv-req-route-block" style="margin:12px 0;">
          <div class="drv-req-route-rail" aria-hidden="true">
            <span class="drv-req-dot start"></span>
            <span class="drv-req-rail-line"></span>
            <span class="drv-req-dot end"><i data-lucide="map-pin"></i></span>
          </div>
          <div class="drv-req-route-copy">
            <p class="drv-req-stop">${esc(cleanPlace(req.pickupLocation))}</p>
            <p class="drv-req-stop is-end">${esc(cleanPlace(req.dropoffLocation))}</p>
          </div>
        </div>
        <p class="card-desc-muted">${esc(dateLineCard(req))} · ${esc(timeLineCard(req))}</p>
        ${req.notes ? `<p class="card-desc-muted" style="margin-top:8px;">${esc(req.notes)}</p>` : ''}
        ${block ? `<p class="drv-home-gate" style="margin-top:10px;">${esc(block)}</p>` : ''}
      </div>
      ${req.status === 'new' ? `<div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="acceptWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')" ${(!canAccept(w) || block) ? 'disabled' : ''}>Accept</button>
        <button type="button" class="btn-secondary-link" onclick="declineWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')">Decline</button>
      </div>` : `<button type="button" class="btn-primary" onclick="openChatWith('${esc(req.parentId)}')">Message</button>`}
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
    const badge = isReturn ? 'Return Walk' : 'Morning Walk';
    const open = !!item.isActionableNow || item.status === 'active';
    
    // Format Date & Time
    const displayDate = item.when || item.dateLabel || 'Tue, Sep 9, 2026';
    const timeText = item.time || '07:45 AM';
    
    const from = cleanPlace(item.from || item.pickupLocation) || 'Pickup';
    const to = cleanPlace(item.to || item.dropoffLocation || item.schoolLocation) || 'School';
    const parentPhoto = PARENTS[item.parentId]?.photo || '/assets/avatar_sadia.jpg';
    const parentName = item.parentName || 'Sadia Khan';
    const kidsText = item.childNames || 'Children';
    const cap = ensureWalk().group?.capacity || 3;

    let ctaHtml = '';
    if (open) {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#0D9488; color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:12px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            <span class="live-dot-pulse" style="width:6px; height:6px; background:#fff;"></span>
            <span>Live Walk</span>
          </button>
        </div>`;
    } else if (item.leg === 'morning') {
      ctaHtml = `
        <div style="display:flex; align-items:center;" onclick="event.stopPropagation();">
          <button type="button" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#0F766E; color:#FFFFFF; border-radius:99px; padding:6px 14px; font-size:12px; font-weight:700; border:none; cursor:pointer; display:inline-flex; align-items:center; gap:4px;">
            <i data-lucide="navigation" style="width:12px; height:12px;"></i>
            <span>Start</span>
          </button>
        </div>`;
    } else {
      ctaHtml = `
        <div style="width:32px; height:32px; border-radius:50%; background:#F0FDFA; color:#0F766E; display:flex; align-items:center; justify-content:center;">
          <i data-lucide="chevron-right" style="width:16px; height:16px;"></i>
        </div>`;
    }

    return `
      <article class="h2s-booking-card" onclick="startWalkShareWalk('${esc(item.id)}')" style="background:#FFFFFF; border:1.5px solid #E2E8F0; border-radius:22px; padding:18px 20px; margin-bottom:14px; box-shadow:0 4px 16px rgba(15,23,42,0.03); cursor:pointer; text-align:left; box-sizing:border-box; width:100%; transition: all 0.2s ease;">
        <!-- Top Row: Date & Direction -->
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;">
          <div style="display:flex; align-items:center; gap:12px;">
            <div style="width:42px; height:42px; border-radius:12px; background:#F0FDFA; color:#0D9488; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
              <i data-lucide="footprints" style="width:20px; height:20px;"></i>
            </div>
            <div>
              <div style="font-size:15px; font-weight:800; color:#0F172A; line-height:1.2;">${displayDate}</div>
              <div style="font-size:12px; font-weight:600; color:#64748B; margin-top:2px;">${timeText}</div>
            </div>
          </div>
          <span style="background:${isReturn ? '#FFF7ED' : '#F0FDFA'}; color:${isReturn ? '#C2410C' : '#0F766E'}; font-size:11.5px; font-weight:800; padding:6px 12px; border-radius:99px; display:inline-flex; align-items:center; gap:5px; flex-shrink:0;">
            <i data-lucide="${isReturn ? 'corner-down-left' : 'corner-up-right'}" style="width:12px; height:12px;"></i>
            <span>${badge}</span>
          </span>
        </div>

        <!-- Middle Row: Route Rail & Squad Info -->
        <div style="display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:14px;">
          <div style="display:flex; flex-direction:column; gap:8px; flex:1; min-width:0; position:relative; padding-left:2px;">
            <div style="display:flex; align-items:center; gap:10px; position:relative; z-index:2;">
              <span style="width:9px; height:9px; border-radius:50%; background:#0D9488; flex-shrink:0;"></span>
              <span style="font-size:13.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${from}</span>
            </div>
            <div style="position:absolute; left:6px; top:8px; bottom:8px; width:1.5px; border-left:1.5px dashed #CBD5E1; z-index:1;"></div>
            <div style="display:flex; align-items:center; gap:10px; position:relative; z-index:2;">
              <span style="width:9px; height:9px; border-radius:50%; border:2px solid #0D9488; background:#FFFFFF; flex-shrink:0; box-sizing:border-box;"></span>
              <span style="font-size:13.5px; font-weight:600; color:#1E293B; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${to}</span>
            </div>
          </div>

          <div style="display:flex; align-items:center; gap:6px; flex-shrink:0; padding-left:16px; border-left:1px solid #F1F5F9; font-size:13px; font-weight:800; color:#0F172A;">
            <i data-lucide="users" style="width:16px; height:16px; color:#64748B;"></i>
            <span>${cap} kids max</span>
          </div>
        </div>

        <!-- Footer Row: Parent & Kids Info & Action -->
        <div style="display:flex; align-items:center; justify-content:space-between; border-top:1px solid #F1F5F9; padding-top:12px;">
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${parentPhoto}" alt="" style="width:36px; height:36px; border-radius:50%; object-fit:cover;" onerror="this.src='/assets/avatar_sadia.jpg';" />
            <div>
              <div style="font-size:13.5px; font-weight:700; color:#0F172A; line-height:1.2;">${parentName}</div>
              <div style="font-size:11.5px; font-weight:600; color:#64748B; margin-top:2px;">${kidsText}</div>
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
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="card-title-navy">${esc(item.childNames)}</h3>
        <p class="card-desc-muted">${esc(item.time)} · ${esc(item.from)} → ${esc(item.to)}</p>
      </div>
      <button type="button" class="btn-primary" onclick="startWalkShareWalk('${esc(item.id)}')">I'm on the way</button>
    `;
    icons();
  }

  const WALK_STAGES = [
    { key: 0, chip: 'Confirmed', cta: "I'm on the way", progress: 8, pin: { left: '19%', top: '74%' } },
    { key: 1, chip: 'On the way', cta: 'Arrived at meetup', progress: 22, pin: { left: '19%', top: '58%' } },
    { key: 2, chip: 'At meetup', cta: 'Confirm children with me', progress: 34, pin: { left: '19%', top: '36%' } },
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
    const note = document.getElementById('wsActiveWalkNote');
    const pin = document.getElementById('wsCockpitPin');
    const progressPath = document.getElementById('wsRouteProgress');
    if (chip) chip.textContent = stage.chip;
    if (title) title.textContent = atDest ? (item.to || 'School gate') : (item.from || 'Meetup');
    if (desc) desc.textContent = `${item.childNames || 'Children'} · sidewalk escort`;
    if (eta) eta.textContent = item.time || '07:50 AM';
    if (btn) btn.textContent = stage.cta;
    if (note) {
      note.textContent = atDest
        ? 'Stay on verified sidewalks. Hand children only to authorized school staff.'
        : 'High-vis vest on. Parent sees live WalkShare status.';
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
    const el = feed('wsActiveWalkFeed');
    if (el && !document.getElementById('wsMilestoneText')) {
      el.innerHTML = `<div class="trip-card"><span class="status-chip in-progress"><span class="status-dot"></span><span>${esc(stage.chip)}</span></span><h3 class="card-title-navy" style="margin-top:12px;">${esc(atDest ? item.to : item.from)}</h3><p class="card-desc-muted">${esc(item.childNames)} · sidewalk escort</p></div><button type="button" class="btn-primary" onclick="advanceWalkShareWalk()">${esc(stage.cta)}</button>`;
    }
    icons();
  }

  window.advanceWalkShareWalk = function () {
    const w = ensureWalk();
    if (w.activeWalkStage >= WALK_STAGES.length - 1) {
      w.activeWalkStage = 0;
      w.activeWalk = null;
      persist();
      toast('Walk complete. Parent can see the drop-off update.');
      window.navigateTo('wsHome');
      return;
    }
    w.activeWalkStage += 1;
    persist();
    renderActiveWalk();
    toast(WALK_STAGES[w.activeWalkStage].chip);
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
      ['rate', '5. Posted rate', `$${w.rate.amount} / week · ${w.rate.negotiable ? 'negotiable' : 'fixed'}`, 'wsOnboardRate']
    ];
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:0;">${isApproved(w) ? 'Verified WalkShare' : 'Finish setup'}</h3>
        <p class="drv-lede">Complete setup to accept walks.</p>
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
    const idLabel = `ID: WS-${String(w.group?.capacity || 3).padStart(2, '0')}15-2201`;
    el.innerHTML = `
      <div class="profile-user-card" role="button" tabindex="0" onclick="openNestedScreen('wsOnboardProfile', event)">
        <img src="${esc(w.photo || '/assets/avatar_sarah.jpg')}" alt="${esc(w.name)}" class="profile-avatar-lg" onerror="this.src='/assets/avatar_sarah.jpg'" />
        <div class="profile-user-meta">
          <div class="profile-user-top">
            <div class="profile-user-name-row">
              <h3 class="profile-user-name">${esc(w.name)}</h3>
              ${isApproved(w) ? '<i data-lucide="badge-check" class="profile-verified-badge"></i>' : ''}
            </div>
            <i data-lucide="chevron-right" class="profile-user-chevron"></i>
          </div>
          <p class="profile-user-phone">${esc(w.phone)}</p>
          <span class="profile-id-pill">${esc(idLabel)}</span>
        </div>
      </div>

      <div class="profile-menu-section">
        ${profileMenuRow('users', esc(w.group.label), "openNestedScreen('wsOnboardGroup', event)")}
        ${profileMenuRow('file-check', 'Verification documents', "openNestedScreen('wsOnboardDocs', event)")}
        ${profileMenuRow('clock', 'Availability', "openNestedScreen('wsOnboardAvailability', event)")}
        ${profileMenuRow('circle-dollar-sign', 'Posted rate', "openNestedScreen('wsOnboardRate', event)")}
        ${profileMenuRow('wallet', 'Payment preference', "openNestedScreen('wsPayment', event)")}
      </div>

      <div class="profile-menu-section">
        ${profileMenuRow('credit-card', 'WalkShare subscription', "openNestedScreen('wsSubscription', event)")}
        ${profileMenuRow('bell', 'Notifications', "openNestedScreen('profileNotifications', event)")}
        ${profileMenuRow('help-circle', 'FAQ', "openNestedScreen('faq', event)")}
        ${profileMenuRow('headphones', 'Contact Support', "openNestedScreen('contactSupport', event)")}
        ${profileMenuRow('shield', 'Privacy Policy', "openNestedScreen('privacy', event)")}
        ${profileMenuRow('file-text', 'Terms of Service', "openNestedScreen('legal', event)")}
        ${profileMenuRow('info', 'About Home2School', "openNestedScreen('about', event)")}
      </div>

      <div class="profile-menu-section">
        ${profileMenuRow('users', 'Switch to Parent', 'window.openRoleSwitcherModal()')}
      </div>

      <button type="button" class="profile-logout-btn" onclick="navigateTo('authWelcome')">
        <i data-lucide="log-out"></i>
        Log out
      </button>
    `;
    icons();
  }

  function renderOnboardProfile() {
    const w = ensureWalk();
    const el = feed('wsOnboardProfileFeed');
    if (!el) return;
    el.innerHTML = `
      <p class="drv-lede" style="margin-bottom:12px;">Name, photo, zone.</p>
      <div class="form-group"><label class="form-label">Full name</label><input class="form-input" id="wsProfileName" value="${esc(w.name)}" /></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="wsProfilePhone" value="${esc(w.phone)}" /></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="wsProfileEmail" value="${esc(w.email)}" /></div>
      <div class="form-group"><label class="form-label">Service zone</label><input class="form-input" id="wsProfileArea" value="${esc(w.serviceArea)}" placeholder="e.g. Elm → Greenfield" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkShareProfile()">Save and continue</button>
    `;
    icons();
  }

  window.saveWalkShareProfile = function () {
    const w = ensureWalk();
    w.name = document.getElementById('wsProfileName')?.value || w.name;
    w.phone = document.getElementById('wsProfilePhone')?.value || w.phone;
    w.email = document.getElementById('wsProfileEmail')?.value || w.email;
    w.serviceArea = document.getElementById('wsProfileArea')?.value || w.serviceArea;
    const provider = (state().providers || []).find((p) => p.id === 'sarah');
    if (provider) {
      provider.serviceArea = w.serviceArea;
      provider.zone = window.H2SZone
        ? window.H2SZone.clean(w.group?.route || w.serviceArea)
        : (w.group?.route || w.serviceArea);
    }
    w.onboarding.profile = true;
    persist();
    toast('Profile saved');
    window.navigateTo(onboardingDone(w) ? 'wsProfile' : 'wsOnboardGroup');
  };

  function renderOnboardGroup() {
    const w = ensureWalk();
    const el = feed('wsOnboardGroupFeed');
    if (!el) return;
    el.innerHTML = `
      <p class="drv-lede" style="margin-bottom:12px;">Size and walking path.</p>
      <div class="form-group"><label class="form-label">Group label</label><input class="form-input" id="wsGroupLabel" value="${esc(w.group.label)}" /></div>
      <div class="form-group"><label class="form-label">Capacity</label><input class="form-input" type="number" min="2" max="10" id="wsGroupCap" value="${esc(w.group.capacity)}" /></div>
      <div class="form-group"><label class="form-label">Corridor</label><input class="form-input" id="wsGroupRoute" value="${esc(w.group.route)}" placeholder="e.g. Elm → Greenfield" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkShareGroup()">Save and continue</button>
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
    toast('Walking group saved');
    window.navigateTo(onboardingDone(w) ? 'wsProfile' : 'wsOnboardDocs');
  };

  function renderOnboardDocs() {
    const w = ensureWalk();
    const el = feed('wsOnboardDocsFeed');
    if (!el) return;
    el.innerHTML = `
      <p class="drv-lede" style="margin-bottom:12px;">ID, address, VSC, references, agreement.</p>
      <div class="profile-menu-section">
        ${w.documents.map((doc) => `
          <button type="button" class="profile-menu-item" onclick="openWalkShareDoc('${esc(doc.id)}')">
            <div class="menu-item-left">
              <div class="menu-icon-wrap"><i data-lucide="file-check"></i></div>
              <div>
                <div class="menu-title-text">${esc(doc.title)}</div>
                <div class="menu-subtitle">${esc(doc.status === 'approved' ? 'Approved' : doc.status || 'Under review')}</div>
              </div>
            </div>
            <i data-lucide="chevron-right" style="width:16px;height:16px;color:#94A3B8;"></i>
          </button>
        `).join('')}
      </div>
      <button type="button" class="btn-primary" onclick="saveWalkShareDocsDone()">Mark documents complete</button>
    `;
    icons();
  }

  window.openWalkShareDoc = function (id) {
    ensureWalk().selectedDocId = id;
    window.navigateTo('wsDocDetail');
  };

  function renderDocDetail() {
    const w = ensureWalk();
    const doc = w.documents.find((d) => d.id === w.selectedDocId) || w.documents[0];
    const el = feed('wsDocDetailFeed');
    if (!el || !doc) return;
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="card-title-navy">${esc(doc.title)}</h3>
        <p class="card-desc-muted">Status: ${esc(doc.status || 'Under review')}</p>
        ${doc.number ? `<p class="card-desc-muted">ID: ${esc(doc.number)}</p>` : ''}
        ${doc.ref1 ? `<div style="background:#F8FAFC; padding:10px; border-radius:8px; margin:8px 0; font-size:12px;"><strong>Ref 1:</strong> ${esc(doc.ref1)}<br><strong>Ref 2:</strong> ${esc(doc.ref2)}</div>` : ''}
        <p class="card-desc-muted" style="margin-top:8px;">File: ${esc(doc.file?.name || 'Verified Record On File')}</p>
      </div>
      <button type="button" class="btn-primary" onclick="navigateTo('wsOnboardDocs')">Back to documents</button>
    `;
  }

  window.saveWalkShareDocsDone = function () {
    const w = ensureWalk();
    w.onboarding.docs = true;
    persist();
    toast('Documents saved');
    window.navigateTo(onboardingDone(w) ? 'wsProfile' : 'wsOnboardAvailability');
  };

  function renderOnboardAvailability() {
    const w = ensureWalk();
    if (window.H2SAvailability) w.availability = window.H2SAvailability.normalize(w.availability);
    const a = w.availability;
    const el = feed('wsOnboardAvailabilityFeed');
    if (!el) return;
    const m = a.windows[0] || {};
    const n = a.windows[1] || {};
    el.innerHTML = `
      <p class="drv-lede" style="margin-bottom:12px;">Morning & afternoon windows (Mon–Fri).</p>
      <div class="form-group"><label class="form-label">Morning from</label><input class="form-input" id="wsAvailMStart" value="${esc(m.start || '07:15')}" placeholder="07:15" /></div>
      <div class="form-group"><label class="form-label">Morning to</label><input class="form-input" id="wsAvailMEnd" value="${esc(m.end || '08:45')}" placeholder="08:45" /></div>
      <div class="form-group"><label class="form-label">Afternoon from</label><input class="form-input" id="wsAvailAStart" value="${esc(n.start || '14:30')}" placeholder="14:30" /></div>
      <div class="form-group"><label class="form-label">Afternoon to</label><input class="form-input" id="wsAvailAEnd" value="${esc(n.end || '16:00')}" placeholder="16:00" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkShareAvailability()">Save and continue</button>
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
    toast('Availability saved');
    window.navigateTo(onboardingDone(ensureWalk()) ? 'wsProfile' : 'wsOnboardRate');
  };

  window.walkshareMatchesParentSearch = function (draft) {
    const w = ensureWalk();
    if (window.H2SAvailability) return window.H2SAvailability.matchesSearch(w.availability, draft || {});
    return true;
  };

  function renderOnboardRate() {
    const w = ensureWalk();
    const el = feed('wsOnboardRateFeed');
    if (!el) return;
    el.innerHTML = `
      <p class="drv-lede" style="margin-bottom:12px;">Rate per child / week.</p>
      <div class="form-group"><label class="form-label">Weekly rate ($ CAD / child)</label><input class="form-input" type="number" id="wsRateAmount" value="${esc(w.rate.amount)}" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkShareRate()">Save and continue</button>
    `;
  }

  window.saveWalkShareRate = function () {
    const w = ensureWalk();
    w.rate.amount = Number(document.getElementById('wsRateAmount')?.value || w.rate.amount);
    w.onboarding.rate = true;
    persist();
    toast('Posted rate saved');
    window.navigateTo('wsProfile');
  };

  function renderPayment() {
    const w = ensureWalk();
    const el = feed('wsPaymentFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="form-group"><label class="form-label">Payment method</label><input class="form-input" id="wsPayMethod" value="${esc(w.rate.paymentMethod)}" /></div>
      <div class="form-group"><label class="form-label">Payment handle</label><input class="form-input" id="wsPayHandle" value="${esc(w.rate.paymentHandle || w.email)}" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkSharePayment()">Save preference</button>
    `;
  }

  window.saveWalkSharePayment = function () {
    const w = ensureWalk();
    w.rate.paymentMethod = document.getElementById('wsPayMethod')?.value || w.rate.paymentMethod;
    w.rate.paymentHandle = document.getElementById('wsPayHandle')?.value || w.rate.paymentHandle;
    persist();
    toast('Payment preference saved');
    window.navigateTo('wsProfile');
  };

  function renderPending() {
    const el = feed('wsPendingFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="trip-card" style="text-align:center;">
        <div class="drv-home-empty-ico" style="margin:0 auto 12px;"><i data-lucide="shield-check"></i></div>
        <h3 class="card-title-navy">Under review</h3>
        <p class="card-desc-muted">Home2School is verifying your WalkShare documents. You cannot accept requests until approved.</p>
      </div>
      <button type="button" class="btn-primary" onclick="navigateTo('wsSetup')">Back to setup</button>
    `;
    icons();
  }

  function renderSubscription() {
    const w = ensureWalk();
    const el = feed('wsSubscriptionFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:4px;">WalkShare platform access</h3>
        <p class="drv-lede">${w.subscription.status === 'trial' ? `${w.subscription.trialDaysLeft} days left on trial` : 'Choose a plan to continue.'}</p>
        <p class="card-desc-muted">$${w.subscription.priceMonthly}/mo · $${w.subscription.priceAnnual}/yr</p>
      </div>

      <!-- Promo / Discount Code Box for WalkShare -->
      <div class="sub-promo-box" style="margin-top: 10px; margin-bottom: 12px; background: #F8FAFC; border: 1.5px dashed #CBD5E1; border-radius: 12px; padding: 10px 12px;">
        <div style="font-size: 12px; font-weight: 700; color: #475569; margin-bottom: 6px; display: flex; align-items: center; justify-content: space-between;">
          <span>Have a WalkShare Promo Code?</span>
          <span id="wsPromoBadge" style="display:none; color:#16A34A; font-weight:800; font-size:10px;">✓ Applied 20% OFF</span>
        </div>
        <div style="display: flex; gap: 8px;">
          <input type="text" id="inputWsPromoCode" placeholder="Enter code (e.g. WALK20)" style="flex: 1; height: 38px; border: 1.5px solid #CBD5E1; border-radius: 8px; padding: 0 10px; font-size: 12px; font-weight: 600; text-transform: uppercase;" />
          <button type="button" onclick="window.applyWalkSharePromoCode()" style="height: 38px; padding: 0 14px; background: var(--color-primary); color: #FFFFFF; border: none; border-radius: 8px; font-size: 12px; font-weight: 700; cursor: pointer;">
            Apply
          </button>
        </div>
      </div>

      <!-- Supported Payment Methods -->
      <div style="margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: #FFFFFF; border: 1px solid #E2E8F0; border-radius: 10px;">
        <span style="font-size: 10px; font-weight: 700; color: #64748B;">Supported via Stripe:</span>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 10px; font-weight: 800; color: #1E293B;">
          <span style="background:#F1F5F9; padding:2px 6px; border-radius:4px;">💳 Cards</span>
          <span style="background:#000; color:#fff; padding:2px 6px; border-radius:4px;"> Pay</span>
          <span style="background:#F1F5F9; padding:2px 6px; border-radius:4px;">G Pay</span>
        </div>
      </div>

      <button type="button" class="btn-primary" onclick="activateWalkShareTrial()">Save</button>
      <button type="button" onclick="window.openSubscriptionReceiptModal()" style="margin-top:8px; background:none; border:none; color:var(--color-primary); font-size:12px; font-weight:700; cursor:pointer; text-decoration:underline;">View Receipt &amp; Billing History</button>
    `;
    icons();
  }

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
      ${esc(item.text)}
      <div class="chat-timestamp">${esc(item.time || '')}</div>
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
      subEl.textContent = '';
      subEl.style.display = 'none';
    }
    if (input) input.placeholder = 'Message…';
    if (header) { header.onclick = null; header.style.cursor = 'default'; }
    if (callBtn) callBtn.style.display = 'none';
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
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble parent';
    bubble.innerHTML = `${esc(text)}<div class="chat-timestamp">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
    stream.appendChild(bubble);
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