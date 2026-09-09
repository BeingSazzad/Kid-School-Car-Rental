/* Driver MVP layer. Reuses the live design system and appState.driver. */

(function () {
  const STORE = 'h2s_driver_mvp_v2';
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
  const PARENTS = {
    'PRNT-9042': { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Arman, Emma & Zara' },
    sadia: { id: 'PRNT-9042', name: 'Sadia Khan', photo: '/assets/avatar_sadia.jpg', sub: 'Parent · Arman, Emma & Zara' },
    'PRNT-2201': { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', sub: 'Parent · Yusuf & Ayla' }
  };
  const TRIP_STAGES = [
    { key: 0, chip: 'Confirmed', cta: "I'm On the Way", parentSync: 0 },
    { key: 1, chip: 'On the Way', cta: 'Arrived at pickup', parentSync: 1 },
    { key: 2, chip: 'Arrived Pickup', cta: 'Confirm child pickup', attendance: true, parentSync: 1 },
    { key: 3, chip: 'Active', cta: 'Arrived at destination', parentSync: 2 },
    { key: 4, chip: 'Arrived Destination', cta: 'Confirm drop-off', parentSync: 3 },
    { key: 5, chip: 'Drop-off', cta: 'Complete trip', parentSync: 4 }
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
        status: 'under_review',
        rejectReason: ''
      },
      vulnerable: {
        issuer: '',
        issueDate: '',
        expiry: '',
        fileDoc: emptyUpload(),
        status: 'not_submitted',
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
    if (!d.vehicle) d.vehicle = { type: 'Minivan', make: 'Toyota', model: 'Sienna', year: '2023', color: 'Celestial Silver', plate: 'SCH-4091', capacity: 4, photo: '/assets/sienna.jpg' };
    if (!Array.isArray(d.requests)) d.requests = [];
    if (!Array.isArray(d.notifications)) d.notifications = [];
    d.requests.forEach(normalizeRequest);
    if (!restored) {
      restored = true;
      try {
        const saved = JSON.parse(localStorage.getItem(STORE) || 'null');
        if (saved && typeof saved === 'object') {
          ['name', 'phone', 'email', 'photo', 'serviceArea', 'verificationStatus', 'isOnline', 'homeScenario', 'activeTripStage'].forEach((key) => {
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
    const wasSeeded = !!d.docsIdentitySeeded;
    d.documents = normalizeDocuments(d.documents, { seeded: wasSeeded });
    d.docsIdentitySeeded = true;
    if (!wasSeeded) persist();
    normalizeAvailability(d);
    syncTariqProviderAvailability();
    return d;
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

  function kids(req) {
    return Array.isArray(req?.children) ? req.children.filter(Boolean) : [];
  }

  function childShort(req) {
    const names = kids(req).map((c) => String(c.name || c).split(' ')[0]);
    return names.join(' + ') || req?.childNamesShort || 'Children';
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
    return seats === 1 ? '1 seat' : `${seats} seats`;
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
    if (missing.length) {
      return `You can’t accept until these documents are Approved: ${missing.map((spec) => docShortTitle(spec.id)).join(', ')}.`;
    }
    if (!isApproved(d)) return 'You can’t accept until Home2School approves your account.';
    if (!hasAccess(d)) return 'You can’t accept until platform access (trial or paid) is active.';
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

  window.getDriverLanding = function () {
    const d = ensureDriver();
    if (!d.onboarding.profile) return 'driverOnboardProfile';
    if (!d.onboarding.vehicle) return 'driverOnboardVehicle';
    if (!d.onboarding.docs) return 'driverOnboardDocs';
    if (!d.onboarding.availability) return 'driverOnboardAvailability';
    if (!d.onboarding.rate) return 'driverOnboardRate';
    if (!isApproved(d)) return 'driverPending';
    if (!hasAccess(d)) return 'driverSubscription';
    return 'driverHome';
  };

  function resolveScreen(name) {
    const role = state().activeRole || 'parent';
    if (AUTH.has(name)) return name;
    if (role === 'parent' && DRIVER_ONLY.has(name)) return 'home';
    if (role !== 'driver') return name;
    if (name === 'tracking') {
      return ensureDriver().activeTripStage > 0 ? 'driverActiveTrip' : window.getDriverLanding();
    }
    if (name === 'profile' || name === 'profilePersonalInfo') return 'driverProfile';
    if (name === 'subscription' || name === 'profilePayments') return 'driverSubscription';
    if (name === 'home' || name === 'bookings' || name === 'myChildren' || PARENT_ONLY.has(name) || String(name).indexOf('booking') === 0) {
      return window.getDriverLanding();
    }
    if (DRIVER_ONLY.has(name)) {
      if (name === 'driverHome' || name === 'driverRequests' || name === 'driverSchedule' || name === 'driverActiveTrip' || name === 'driverTripPrep') {
        const land = window.getDriverLanding();
        if (land !== 'driverHome') return land;
      }
      return name;
    }
    if (SHARED.has(name) || name === 'rating') return name;
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
      ['driverOnboardVehicle', 'Your vehicle', "backNested('driverProfile')"],
      ['driverOnboardDocs', 'Documents', "backNested('driverProfile')"],
      ['driverDocDetail', 'Document', "backNested('driverOnboardDocs')"],
      ['driverOnboardAvailability', 'Availability', "backNested('driverProfile')"],
      ['driverOnboardRate', 'Posted rate', "backNested('driverProfile')"],
      ['driverPayment', 'Payment preference', "backNested('driverProfile')"],
      ['driverPending', 'Verification', "navigateTo('driverSetup')"],
      ['driverSubscription', 'Platform access', "backNested('driverProfile')"],
      ['driverRequestDetail', 'Request', "navigateTo('driverRequests')"],
      ['driverTripPrep', 'Next trip', "navigateTo('driverSchedule')"],
      ['driverRateParent', 'Rate parent', "navigateTo('driverHome')"]
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
    const btnP = document.getElementById('btnRoleParent');
    const btnD = document.getElementById('btnRoleDriver');
    if (!btnP || !btnD) return;
    if (role === 'driver') {
      btnP.classList.remove('active');
      btnD.classList.add('active', 'driver-active');
    } else {
      btnD.classList.remove('active', 'driver-active');
      btnP.classList.add('active');
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
    const back = document.getElementById('inboxBackBtn');
    if (parentNav) parentNav.style.display = role === 'driver' ? 'none' : '';
    if (driverNav) driverNav.style.display = role === 'driver' ? 'flex' : 'none';
    if (back) back.setAttribute('onclick', role === 'driver' ? "backNested('driverHome')" : "backNested('home')");
    const notifBack = document.querySelector('#screen-notifications .back-btn');
    if (notifBack) notifBack.setAttribute('onclick', role === 'driver' ? "backNested('driverHome')" : "backNested('home')");
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
        const fallback = role === 'driver' ? 'driverProfile' : 'profile';
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
    const next = role === 'driver' ? 'driver' : 'parent';
    if (typeof window.clearNavStacks === 'function') window.clearNavStacks();
    state().activeRole = next;
    localStorage.setItem('h2s_active_role', next);
    applyRoleChrome();
    // replaceState landing so Back cannot re-enter the previous role's hash trail
    window.navigateTo(next === 'driver' ? window.getDriverLanding() : 'home', true);
  };

  window.leaveDriverGate = function () {
    // Never switch to Parent. In-app Back stays inside the Driver shell.
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested('driverProfile');
      return;
    }
    if (fromProfileEdit() || onboardingDone(ensureDriver())) {
      window.navigateTo('driverProfile', true);
      return;
    }
    window.navigateTo(state().driverEntryFromAuth ? 'authWelcome' : 'driverSetup', true);
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
    if (file.type && file.type.indexOf('image/') === 0 && file.size < 900000) {
      const reader = new FileReader();
      reader.onload = () => cb({ name: file.name, attached: true, preview: String(reader.result || '') });
      reader.onerror = () => cb(meta);
      reader.readAsDataURL(file);
      return;
    }
    cb(meta);
  }

  function renderOnboardProfile() {
    const d = ensureDriver();
    const el = feed('driverOnboardProfileFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, editing ? 'Edit profile' : 'Your profile');
    bindChildBack(el, "leaveDriverGate()");
    el.innerHTML = `
      ${editing ? '' : stepIntro(1, 5, 'Who you are', 'Parents see your name and service area before they request a school commute.')}
      <div class="drv-photo-hero">
        <div class="drv-photo-wrap">
          <img src="${esc(d.photo || '/assets/avatar_tariq.jpg')}" alt="${esc(d.name)}" id="drvProfileImg" />
          <button type="button" class="drv-photo-cam" onclick="document.getElementById('drvPhotoFile').click()" aria-label="Change photo">
            <i data-lucide="camera"></i>
          </button>
          <input type="file" accept="image/*" id="drvPhotoFile" class="drv-file-input" onchange="onDriverProfilePhoto(event)" />
        </div>
      </div>
      ${field('Legal name', `<input class="form-input" id="drvName" value="${esc(d.name)}" placeholder="Tariq Ahmed" />`, 'user')}
      ${field('Phone', `<input class="form-input" id="drvPhone" value="${esc(d.phone)}" placeholder="+1 (416) 555-0182" />`, 'phone')}
      ${field('Email', `<input class="form-input" id="drvEmail" value="${esc(d.email)}" placeholder="name@email.com" />`, 'mail')}
      ${field('Service area', `<input class="form-input" id="drvArea" value="${esc(d.serviceArea || '')}" placeholder="Neighbourhoods or schools you cover" />`, 'map-pin')}
      <div class="drv-actions-col"><button type="button" class="btn-primary" onclick="saveDriverOnboardProfile()">${editing ? 'Save' : 'Continue'}</button></div>
    `;
  }

  window.onDriverProfilePhoto = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    readLocalFile(file, (meta) => {
      const d = ensureDriver();
      d.photoName = meta.name;
      if (meta.preview) d.photo = meta.preview;
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
    d.onboarding.profile = true;
    persist();
    if (finishNestedOr()) return;
    window.navigateTo(editingProfileChild() ? 'driverProfile' : 'driverOnboardVehicle');
  };

  function renderOnboardVehicle() {
    const d = ensureDriver();
    const v = d.vehicle;
    const el = feed('driverOnboardVehicleFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, 'Your vehicle');
    bindChildBack(el, "navigateTo('driverOnboardProfile')");
    const photoName = v.photoName || (v.photo ? 'Vehicle photo' : '');
    el.innerHTML = `
      ${editing ? '' : stepIntro(2, 5, 'One vehicle', 'Capacity is used when you accept a request. Add the vehicle parents will see.')}
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
        <label class="form-label">Vehicle photo</label>
        <button type="button" class="drv-upload-tile" onclick="document.getElementById('drvVehicleFile').click()">
          <img class="drv-upload-thumb" src="${esc(v.photo || '/assets/sienna.jpg')}" alt="" />
          <span class="drv-upload-copy">
            <span class="drv-upload-name">${esc(photoName || 'Add vehicle photo')}</span>
            <span class="drv-upload-hint">JPG or PNG</span>
          </span>
        </button>
        <input type="file" accept="image/*" id="drvVehicleFile" class="drv-file-input" onchange="onDriverVehiclePhoto(event)" />
      </div>
      <div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="saveDriverVehicle()">${editing ? 'Save' : 'Continue'}</button>
      </div>
    `;
  }

  window.onDriverVehiclePhoto = function (event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    readLocalFile(file, (meta) => {
      const d = ensureDriver();
      d.vehicle.photoName = meta.name;
      if (meta.preview) d.vehicle.photo = meta.preview;
      persist();
      renderOnboardVehicle();
      icons();
      toast('Vehicle photo attached');
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
    const name = attached ? (file.name || 'File attached') : 'No file yet';
    return `
      <div class="form-group">
        <label class="form-label">${label}</label>
        <button type="button" class="drv-upload-tile" onclick="document.getElementById('drvUpload_${key}').click()">
          <div class="menu-icon-wrap drv-doc-icon"><i data-lucide="${attached ? 'file-check' : 'upload'}"></i></div>
          <span class="drv-upload-copy">
            <span class="drv-upload-name">${esc(name)}</span>
            <span class="drv-upload-hint">${esc(uploadHint(status, attached, hint))}</span>
          </span>
        </button>
        <input type="file" accept="image/*,.pdf,application/pdf" id="drvUpload_${key}" class="drv-file-input" onchange="onDriverDocFile(event, '${key}')" />
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
    const rows = d.documents.map((doc) => `
      <div class="profile-menu-item drv-doc-row" data-status="${esc(doc.status)}" role="button" tabindex="0" onclick="openDriverDoc('${doc.id}', '${screen}')">
        <div class="menu-item-left">
          <div class="menu-icon-wrap drv-doc-icon"><i data-lucide="${docIcon(doc.id)}"></i></div>
          <span class="menu-title-text">${esc(doc.title)}</span>
        </div>
        <span class="drv-doc-row-end">
          <span class="drv-doc-status ${esc(doc.status)}">${docLabel(doc.status)}</span>
          ${chevron}
        </span>
      </div>
    `).join('');
    return `<div class="profile-menu-section drv-doc-list">${rows}</div>`;
  }

  function docsListBackTarget() {
    const ret = state()._docsReturnTo;
    if (ret) return ret;
    return editingProfileChild() ? 'driverProfile' : 'driverOnboardVehicle';
  }

  function renderOnboardDocs() {
    const d = ensureDriver();
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
      <p class="drv-docs-meta">${editing ? `${approved} / ${d.documents.length} approved` : `${submitted} / ${d.documents.length} submitted`}</p>
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

  window.openDriverDoc = function (id, listScreen) {
    const d = ensureDriver();
    const doc = d.documents.find((item) => item.id === id);
    if (!doc) return;
    if (listScreen) state()._docListScreen = listScreen;
    state()._activeDocId = id;
    docDraft = JSON.parse(JSON.stringify(doc));
    docDraft._fileTouched = false;
    window.openNestedScreen('driverDocDetail');
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
      window.backNested(state()._docListScreen || 'driverOnboardDocs');
      return;
    }
    const spec = docFormSpec(docDraft.id);
    const listScreen = state()._docListScreen || 'driverOnboardDocs';
    const rejected = docDraft.status === 'action_required' || docDraft.status === 'rejected';
    bindChildTitle(el, docDraft.title);
    bindChildBack(el, `backNested('${listScreen}')`);
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

  window.onDriverDocFile = function (event, key) {
    const file = event.target.files && event.target.files[0];
    if (!file || !docDraft) return;
    harvestDocDraft();
    readLocalFile(file, (meta) => {
      docDraft[key] = meta;
      docDraft._fileTouched = true;
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
    const next = nextDocStatus(prev, docDraft, docDraft._fileTouched);
    const saved = JSON.parse(JSON.stringify(docDraft));
    delete saved._fileTouched;
    saved.status = next;
    if (next !== 'action_required' && next !== 'rejected') saved.rejectReason = '';
    d.documents[idx] = Object.assign({}, d.documents[idx], saved);
    persist();
    toast(next === 'under_review' ? 'Submitted for review' : 'Document saved');
    if (window.navReturnStack && window.navReturnStack.length) {
      window.backNested();
      return;
    }
    window.navigateTo(state()._docListScreen || 'driverOnboardDocs');
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
    const w = d.availability.windows;
    availDraft = {
      morningOn: w[0].enabled !== false,
      afternoonOn: w[1].enabled !== false,
      morningStart: w[0].start,
      morningEnd: w[0].end,
      afternoonStart: w[1].start,
      afternoonEnd: w[1].end,
      exceptions: (d.availability.exceptions || []).slice(),
      pendingDate: ''
    };
  }

  function isoToMdY(iso) {
    const parts = String(iso || '').split('-');
    if (parts.length !== 3) return iso || '';
    return `${parts[1]}/${parts[2]}/${parts[0]}`;
  }

  function availTimeField(key) {
    return `<button type="button" class="drv-time-field" onclick="openDriverAvailTime('${key}')">
      <span class="drv-time-field-value">${esc(toLabel(availDraft[key]))}</span>
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
    if (!list.length) return '<p class="drv-lede" id="drvExceptionList">No exceptions yet</p>';
    return `<div class="drv-exception-list" id="drvExceptionList">${list.map((iso) => `
      <span class="drv-exception-chip">
        <span>${esc(isoToMdY(iso))}</span>
        <button type="button" class="drv-exception-remove" onclick="removeDriverException('${esc(iso)}')" aria-label="Remove exception">
          <i data-lucide="x"></i>
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
    const opts = values.map((val) => `<button type="button" class="book-ride-time-opt${val === selected ? ' selected' : ''}" data-val="${val}" onclick="selectDriverAvailTimePart(this)">${val}</button>`).join('');
    col.innerHTML = `<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>${opts}<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>`;
    scrollAvailTimeOpt(col, col.querySelector('.book-ride-time-opt.selected'));
  }

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
    bindChildTitle(el, 'Availability');
    bindChildBack(el, "navigateTo('driverOnboardDocs')");
    const editing = editingProfileChild();
    const pending = availDraft.pendingDate;
    el.innerHTML = `
      ${editing ? '' : stepHint(4, 5, 'Weekly time windows')}
      <div class="drv-avail-card">
        <div class="drv-avail-card-head">
          <span class="drv-avail-title">Weekly hours</span>
          <span class="drv-avail-days-chip">Mon–Fri</span>
        </div>
        ${availWindowRow('morningStart', 'morningEnd')}
        <div class="drv-avail-divider" role="presentation"></div>
        ${availWindowRow('afternoonStart', 'afternoonEnd')}
      </div>
      <div class="form-group drv-avail-exception">
        <label class="form-label">Exception date (optional)</label>
        <div class="drv-avail-exception-row">
          <button type="button" class="drv-date-field" id="drvExceptionTrigger" onclick="openDriverAvailDate()">
            <span class="drv-date-field-value${pending ? '' : ' is-placeholder'}">${pending ? esc(isoToMdY(pending)) : 'mm/dd/yyyy'}</span>
            <i data-lucide="calendar"></i>
          </button>
          <button type="button" class="drv-btn-outline drv-avail-add" onclick="addDriverException()">Add</button>
        </div>
        ${exceptionChips()}
      </div>
      <button type="button" class="btn-primary" onclick="saveDriverAvailability()">${editing ? 'Save' : 'Continue'}</button>
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
      ['drvAvailHourCol', 'drvAvailMinuteCol', 'drvAvailPeriodCol'].forEach((id) => {
        const col = document.getElementById(id);
        scrollAvailTimeOpt(col, col?.querySelector('.book-ride-time-opt.selected'));
      });
    });
    icons();
  };

  window.confirmDriverAvailTime = function () {
    const hour = document.querySelector('#drvAvailHourCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '07';
    const minute = document.querySelector('#drvAvailMinuteCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '30';
    const period = document.querySelector('#drvAvailPeriodCol .book-ride-time-opt.selected')?.getAttribute('data-val') || 'AM';
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

  function syncTariqProviderAvailability() {
    const d = state().driver;
    if (!d || !d.availability) return;
    const provider = (state().providers || []).find((p) => p.id === 'tariq');
    if (provider) provider.availability = d.availability;
  }

  window.saveDriverAvailability = function () {
    if (!availDraft) resetAvailDraft();
    if (toMinutes(availDraft.morningEnd) <= toMinutes(availDraft.morningStart)) {
      toast('First window: To must be after From', 'error');
      return;
    }
    if (toMinutes(availDraft.afternoonEnd) <= toMinutes(availDraft.afternoonStart)) {
      toast('Second window: To must be after From', 'error');
      return;
    }
    const d = ensureDriver();
    d.availability.windows = [
      { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: availDraft.morningStart, end: availDraft.morningEnd, label: 'Morning', enabled: true },
      { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: availDraft.afternoonStart, end: availDraft.afternoonEnd, label: 'Afternoon', enabled: true }
    ];
    d.availability.weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    d.availability.exceptions = availDraft.exceptions.slice();
    d.availability.morningSlot = formatWindow(d.availability.windows[0]);
    d.availability.afternoonSlot = formatWindow(d.availability.windows[1]);
    d.onboarding.availability = true;
    syncTariqProviderAvailability();
    persist();
    if (finishNestedOr()) return;
    window.navigateTo(d.onboarding.rate ? 'driverProfile' : 'driverOnboardRate');
  };

  window.driverMatchesParentSearch = function (draft) {
    const d = ensureDriver();
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

  function renderOnboardRate() {
    const r = ensureDriver().rate;
    const el = feed('driverOnboardRateFeed');
    if (!el) return;
    const editing = editingProfileChild();
    bindChildTitle(el, 'Posted rate');
    bindChildBack(el, "navigateTo('driverOnboardAvailability')");
    el.innerHTML = `
      ${editing ? '' : stepIntro(5, 5, 'Posted rate', 'This is informational. Home2School does not pay out ride fees. Parents may share a payment handle after a booking is confirmed.')}
      ${field('Weekly posted rate (CAD)', `<input class="form-input" id="drvRateAmt" type="number" value="${esc(r.amount)}" />`, 'banknote')}
      <div class="form-group"><label class="form-label">Negotiable</label>
        <div class="drv-toggle-row">
          <button type="button" id="drvNegYes" class="${r.negotiable ? 'active' : ''}" onclick="setDriverNegotiable(true)">Yes</button>
          <button type="button" id="drvNegNo" class="${!r.negotiable ? 'active' : ''}" onclick="setDriverNegotiable(false)">No</button>
        </div>
      </div>
      ${editing ? '' : selectField('Preferred payment method', `<select class="form-select" id="drvPayMethod">${['Interac e-Transfer', 'Cash', 'Cheque'].map((m) => `<option ${r.paymentMethod === m ? 'selected' : ''}>${m}</option>`).join('')}</select>`)}
      <div class="drv-actions-col"><button type="button" class="btn-primary" onclick="saveDriverRate()">${editing ? 'Save' : 'Submit for review'}</button></div>
    `;
  }

  window.setDriverNegotiable = function (yes) {
    ensureDriver().rate.negotiable = yes;
    renderOnboardRate();
    icons();
  };

  window.saveDriverRate = function () {
    const d = ensureDriver();
    d.rate.amount = Number(val('drvRateAmt') || d.rate.amount);
    const pay = val('drvPayMethod');
    if (pay) d.rate.paymentMethod = pay;
    d.onboarding.rate = true;
    persist();
    if (finishNestedOr()) return;
    d.verificationStatus = 'pending';
    persist();
    window.navigateTo('driverPending');
  };

  function renderPayment() {
    const d = ensureDriver();
    const r = d.rate;
    const el = feed('driverPaymentFeed');
    if (!el) return;
    bindChildTitle(el, 'Payment preference');
    bindChildBack(el, "navigateTo('driverProfile')");
    el.innerHTML = `
      <p class="page-subtitle" style="margin:0;text-align:left;">Ride fees stay between you and the parent. Home2School does not collect or pay out commute fees.</p>
      ${selectField('Preferred method', `<select class="form-select" id="drvPayMethod">${['Interac e-Transfer', 'Cash', 'Cheque'].map((m) => `<option ${r.paymentMethod === m ? 'selected' : ''}>${m}</option>`).join('')}</select>`)}
      ${field('Interac handle or phone', `<input class="form-input" id="drvPayHandle" value="${esc(r.paymentHandle || d.email || '')}" placeholder="name@email.com" />`, 'at-sign')}
      <div class="drv-actions-col"><button type="button" class="btn-primary" onclick="saveDriverPayment()">Save</button></div>
    `;
  }

  window.saveDriverPayment = function () {
    const d = ensureDriver();
    d.rate.paymentMethod = val('drvPayMethod') || d.rate.paymentMethod;
    d.rate.paymentHandle = val('drvPayHandle') || d.rate.paymentHandle;
    persist();
    if (finishNestedOr()) return;
    window.navigateTo('driverProfile');
  };

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
        <p>Prototype admin — not shown to real drivers</p>
        <button type="button" class="btn-primary" onclick="mockApproveDriver()">Approve driver</button>
        <button type="button" class="btn-secondary-surface" style="margin-top:8px;" onclick="mockDriverDocReject()">Mark licence as action required</button>
      </div>
    `;
  }

  window.mockApproveDriver = function () {
    const d = ensureDriver();
    d.verificationStatus = 'approved';
    d.documents.forEach((doc) => { doc.status = 'approved'; doc.rejectReason = ''; });
    persist();
    toast('Driver approved');
    window.navigateTo(hasAccess(d) ? 'driverHome' : 'driverSubscription');
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
    bindChildBack(el, "navigateTo('driverPending')");
    const titleEl = el.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Platform access';
    el.classList.add('sub-screen-body');
    const failed = sub.status === 'failed';
    const kicker = sub.status === 'trial' ? 'Free trial' : sub.status === 'active' ? 'Active' : sub.status === 'failed' ? 'Payment failed' : 'Not started';
    const title = sub.status === 'trial'
      ? `${sub.trialDaysLeft} days remaining`
      : sub.status === 'active'
        ? (sub.plan === 'annual' ? '$279 / year' : '$29 / month')
        : 'Start a trial to accept bookings';
    const subtitle = sub.status === 'none' ? 'Monthly or annual platform access' : `Renews ${sub.renewal || 'Oct 8, 2026'}`;
    const history = (sub.history || []).map((row) => `
      <div class="sub-history-row">
        <div class="sub-history-icon"><i data-lucide="receipt"></i></div>
        <div class="sub-history-copy">
          <div class="sub-history-label">${esc(row.label)}</div>
          <div class="sub-history-meta">${esc(row.date)} · ${esc(row.amount)}</div>
        </div>
      </div>
    `).join('') || `<p class="drv-lede">No billing events yet.</p>`;
    el.innerHTML = `
      <div class="sub-simple-intro">
        <h3 class="sub-screen-lede">Choose your plan</h3>
        <p class="sub-screen-note">This is the Home2School platform fee, not your posted ride rate. Ride fees stay between you and the parent.</p>
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
      ${failed ? `<div class="drv-failed-pay"><div class="drv-section-label">Last payment failed</div><button type="button" class="btn-primary" style="margin-top:10px;" onclick="recoverDriverPayment()">Retry payment</button></div>` : ''}
      <div class="sub-actions">
        <button type="button" class="btn-primary" onclick="continueDriverTrial()">Continue with free trial</button>
        <button type="button" class="btn-primary" onclick="activateDriverSubscription()">Activate ${sub.plan === 'annual' ? 'annual' : 'monthly'} access</button>
      </div>
      <div class="sub-history-card">
        <h3 class="sub-section-title">Billing history</h3>
        ${history}
      </div>
    `;
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
    d.subscription.history.unshift({ id: 'dsub-' + Date.now(), label: '14-day driver trial started', date: 'Sep 8, 2026', amount: '$0.00' });
    persist();
    toast('Trial started. You can accept bookings.');
    window.navigateTo('driverHome');
  };

  window.activateDriverSubscription = function () {
    const d = ensureDriver();
    d.subscription.status = 'active';
    persist();
    toast('Platform access activated');
    window.navigateTo('driverHome');
  };

  window.recoverDriverPayment = function () {
    const d = ensureDriver();
    if (d.subscription.status !== 'failed') return;
    d.subscription.status = 'active';
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
        status: active && (d.activeTrip?.leg !== 'afternoon') ? 'active' : 'upcoming',
        isActionableNow: true
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
          status: 'upcoming',
          isActionableNow: false
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
        ? `${d.vehicle?.make || ''} ${d.vehicle?.model || ''} · ${d.vehicle?.capacity || 0} seats`
        : 'Finish setup to accept school rides';
    }
    if (avatar) {
      avatar.src = d.photo || '/assets/avatar_tariq.jpg';
      avatar.alt = d.name || 'Driver';
    }
    const view = homeMode();
    const hero = document.getElementById('driverHeroContainer');
    const feedEl = document.getElementById('driverHomeFeed');
    const newCount = view.incoming.length;
    if (hero) hero.innerHTML = renderHero(view, d);
    const rest = view.schedule.filter((item) => !view.next || item.id !== view.next.id);
    if (feedEl) {
      feedEl.innerHTML = `
        <div class="section-block">
          <h3 class="section-heading">Quick Actions</h3>
          <div class="quick-actions-grid">
            <div class="action-card navy" onclick="navigateTo('driverRequests')">
              <div class="action-icon-circle white-glass"><i data-lucide="inbox"></i></div>
              <h4 class="card-title-white">Requests</h4>
              <p class="card-desc-white">${newCount ? newCount + ' new from parents' : 'Incoming from parents'}</p>
            </div>
            <div class="action-card light" onclick="navigateTo('driverSchedule')">
              <div class="action-icon-circle blue-tint"><i data-lucide="calendar"></i></div>
              <h4 class="card-title-navy">Schedule</h4>
              <p class="card-desc-muted">Pickup &amp; return legs</p>
            </div>
            <div class="action-card light horizontal" onclick="openNestedScreen('driverOnboardAvailability')">
              <div class="action-icon-circle blue-tint"><i data-lucide="clock"></i></div>
              <h4 class="card-title-navy">Availability</h4>
            </div>
            <div class="action-card light horizontal" onclick="navigateTo('inbox')">
              <div class="action-icon-circle blue-tint"><i data-lucide="message-square"></i></div>
              <h4 class="card-title-navy">Messages</h4>
            </div>
          </div>
        </div>
        ${rest.length ? `<div class="section-block">
          <div class="section-header-row">
            <h3 class="section-heading">Today's trips</h3>
            <a href="#driverSchedule" onclick="navigateTo('driverSchedule');return false;" class="link-see-all">See All <i data-lucide="chevron-right" style="width:14px;height:14px;"></i></a>
          </div>
          <div class="upcoming-trips-list">${rest.map((item) => scheduleRow(item)).join('')}</div>
        </div>` : ''}
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
    const d = dateParts(item.when || item.dateLabel);
    const click = item.isActionableNow ? `onclick="startDriverTrip('${item.id}')"` : `onclick="navigateTo('driverSchedule')"`;
    return `<div class="trip-card-compact" ${click}>
      <div class="trip-date-block">
        <span class="td-month">${esc(d.month)}</span>
        <span class="td-day">${esc(d.day)}</span>
        <span class="td-weekday">${esc(d.weekday || (item.leg === 'afternoon' ? 'PM' : 'AM'))}</span>
      </div>
      <div class="trip-compact-content">
        <div class="trip-compact-top">
          <span class="trip-compact-time">${esc(item.time)}</span>
          <span class="${item.leg === 'afternoon' ? 'one-way-badge' : 'both-way-badge'}">${esc(item.leg === 'afternoon' ? 'Return' : 'Round trip')}</span>
        </div>
        <div class="trip-compact-route">${esc(item.route || '')}</div>
        <div class="trip-compact-sub">${esc(passengerSub(item, 'schedule'))}</div>
      </div>
    </div>`;
  }

  function renderHero(view, d) {
    if (view.kind === 'idle') {
      return `<div class="section-block">
        <h3 class="section-heading">Upcoming Trips</h3>
        <div class="empty-trips-card">
          <div class="empty-trips-icon"><i data-lucide="calendar-x"></i></div>
          <h4 class="empty-trips-title">No trips on deck</h4>
          <p class="empty-trips-desc">Parent commute requests for your area will show here.</p>
          <button type="button" class="btn-primary" onclick="navigateTo('driverRequests')">View requests</button>
        </div>
        ${!canAccept(d) ? `<div class="safety-reassurance-card">
          <div class="reassurance-icon-badge"><i data-lucide="shield-check" style="width:20px;height:20px;"></i></div>
          <div>
            <div class="reassurance-title">Accept is gated on approval</div>
            <div class="reassurance-desc">Finish documents and wait for Admin review before you can take school rides.</div>
          </div>
        </div>` : ''}
      </div>`;
    }
    if (view.kind === 'requests') {
      const req = view.incoming[0];
      return `<div class="section-block">
        <div class="section-header-row">
          <h3 class="section-heading">New request</h3>
          <a href="#driverRequests" onclick="navigateTo('driverRequests');return false;" class="link-see-all">See All <i data-lucide="chevron-right" style="width:14px;height:14px;"></i></a>
        </div>
        ${compactTrip(req, 'request')}
        <button type="button" class="btn-primary" style="margin-top:12px;" onclick="openDriverRequest('${req.id}')">View request</button>
      </div>`;
    }
    const next = view.next;
    if (view.kind === 'upcoming') {
      return `<div class="section-block">
        <div class="section-header-row">
          <h3 class="section-heading">Upcoming Trips</h3>
          <a href="#driverSchedule" onclick="navigateTo('driverSchedule');return false;" class="link-see-all">See All <i data-lucide="chevron-right" style="width:14px;height:14px;"></i></a>
        </div>
        ${compactTrip(next, 'schedule')}
      </div>`;
    }
    const cta = view.kind === 'active' ? 'Open trip' : "I'm On the Way";
    const kids = next.children || [];
    const avatars = kids.slice(0, 2).map((c, i) => `<img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" />`).join('')
      || `<img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" />`;
    const parentPhoto = PARENTS[next.parentId]?.photo || '/assets/avatar_sadia.jpg';
    return `<div class="section-block">
      <h3 class="section-heading">${view.kind === 'active' ? 'Active trip' : 'Upcoming Trips'}</h3>
      <div class="active-trip-hero-card">
        <div class="active-trip-top-row">
          <div class="active-trip-child-meta">
            <div class="child-avatar-cluster">${avatars}</div>
            <div>
              <div class="child-name-text">${esc(next.childNames)}</div>
              <div class="child-dest-text">${esc(next.legLabel || '')} · ${esc(next.route || '')}</div>
            </div>
          </div>
          <div class="active-trip-status-col">
            <span class="live-pill-tag"><span class="live-dot-pulse"></span><span>${view.kind === 'active' ? 'Live' : 'Soon'}</span></span>
            <span class="active-trip-eta-text">${esc(next.time)}</span>
          </div>
        </div>
        <div class="active-driver-contact-row">
          <div class="driver-mini-info">
            <img src="${esc(parentPhoto)}" alt="" class="driver-mini-avatar" />
            <div class="driver-meta-text">
              <div class="driver-mini-name"><span>${esc(parentLabel(next))}</span></div>
              <div class="driver-mini-sub">Parent</div>
            </div>
          </div>
        </div>
        <button type="button" class="btn-primary" onclick="startDriverTrip('${next.id}', '${view.kind}')">${cta}</button>
      </div>
    </div>`;
  }

  function scheduleRow(item) {
    return compactTrip(item, 'schedule');
  }

  function ensureParentRequestChrome() {
    const screen = document.getElementById('screen-driverRequests');
    if (!screen) return;
    screen.querySelector('.dreq-sticky')?.remove();
    if (!screen.querySelector('.top-bar-sticky')) {
      const bar = document.createElement('div');
      bar.className = 'top-bar-sticky';
      bar.innerHTML = `<button type="button" class="back-btn" onclick="navigateTo('driverHome')"><i data-lucide="chevron-left"></i></button><h2 class="top-bar-title">Requests</h2><span style="width:26px;"></span>`;
      const status = screen.querySelector('.status-bar');
      if (status) status.insertAdjacentElement('afterend', bar);
    }
    const title = screen.querySelector('.top-bar-title');
    if (title) title.textContent = 'Requests';
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
      const bar = screen.querySelector('.top-bar-sticky');
      if (bar) bar.insertAdjacentElement('afterend', tabWrap);
      else screen.querySelector('.status-bar')?.insertAdjacentElement('afterend', tabWrap);
    }
    if (tabs.parentElement !== tabWrap) tabWrap.appendChild(tabs);
    const scroll = screen.querySelector('.screen-scroll-body');
    if (scroll) scroll.classList.remove('dreq-scroll');
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
    if (status === 'accepted') return '<span class="drv-req-chip drv-req-chip-status">Accepted</span>';
    if (status === 'declined') return '<span class="drv-req-chip drv-req-chip-status is-declined">Declined</span>';
    return '';
  }

  function requestCard(req, tab) {
    const actions = tab === 'new' ? `
      <div class="drv-req-card-actions" onclick="event.stopPropagation()">
        <button type="button" class="btn-primary" onclick="acceptDriverRequest('${req.id}')">Accept</button>
        <button type="button" class="drv-req-decline-link" onclick="declineDriverRequest('${req.id}')">Decline</button>
      </div>` : '';
    return `<article class="drv-req-card" role="button" tabindex="0" onclick="openDriverRequest('${req.id}')">
      <div class="drv-req-card-top">
        <h3 class="drv-req-parent">${esc(req.parentName || 'Parent')}</h3>
        <span class="drv-req-price">${esc(req.rateLabel || '')}</span>
      </div>
      <p class="drv-req-kids">${esc(childScanLine(req))}</p>
      <p class="drv-req-route"><i data-lucide="map-pin"></i><span>${esc(routeLine(req))}</span></p>
      <p class="drv-req-meta">${esc(metaLine(req))}</p>
      <div class="drv-req-chips">
        <span class="drv-req-chip">${esc(seatsLabel(req.seatsNeeded))}</span>
        ${req.frequency === 'recurring' ? '<span class="drv-req-chip">Recurring</span>' : ''}
        ${requestStatusChip(req.status)}
      </div>
      ${actions}
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
    const handle = state().paymentHandle || {};
    const user = state().user || {};
    const sameParent = req.parentId === user.id || req.parentName === user.name;
    if (sameParent && handle.status === 'revealed' && handle.handle) {
      return `<section class="drv-req-block">
        <h4 class="drv-req-label">Payment handle</h4>
        <p class="drv-req-value">${esc(handle.handle)}</p>
        <p class="drv-req-note">Parent shared this Interac handle. Home2School does not collect the ride fee.</p>
      </section>`;
    }
    if (req.status === 'accepted') {
      return `<section class="drv-req-block">
        <h4 class="drv-req-label">Payment</h4>
        <p class="drv-req-note">${esc(d.rate?.paymentMethod || 'Interac e-Transfer')}. Home2School does not collect the ride fee.</p>
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
      wrap.innerHTML = `<div class="empty-trips-card"><div class="empty-trips-icon"><i data-lucide="inbox"></i></div><h4 class="empty-trips-title">No ${tab} requests</h4><p class="empty-trips-desc">Parent commute requests for your area appear here.</p></div>`;
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
    const reason = acceptBlockReason(d);
    const blocked = !!reason;
    const docsBlocked = missingRequiredDocs(d).length > 0;
    const isNew = req.status === 'new';
    const passengers = kids(req).map((c) => {
      const school = c.school || req.dropoffLocation || '';
      const sub = [c.grade, school].filter(Boolean).join(' · ');
      return `<div class="drv-req-passenger">
        <div class="drv-req-passenger-name">${esc(c.name)}</div>
        ${sub ? `<div class="drv-req-passenger-sub">${esc(sub)}</div>` : ''}
      </div>`;
    }).join('') || `<p class="drv-req-note">No passengers listed</p>`;
    el.innerHTML = `
      <header class="drv-req-hero">
        <div class="drv-req-hero-row">
          <h3 class="drv-req-hero-name">${esc(req.parentName || 'Parent')}</h3>
          ${requestStatusChip(req.status)}
        </div>
        <p class="drv-req-hero-price">${esc(req.rateLabel || '')}${d.rate?.negotiable && isNew ? ' · negotiable' : ''}</p>
        <div class="drv-req-chips">
          <span class="drv-req-chip">${esc(seatsLabel(req.seatsNeeded))}</span>
          <span class="drv-req-chip">${esc(tripKindLabel(req))}</span>
        </div>
      </header>
      <section class="drv-req-block">
        <h4 class="drv-req-label">Children</h4>
        ${passengers}
      </section>
      <section class="drv-req-block">
        <h4 class="drv-req-label">Route</h4>
        <p class="drv-req-route drv-req-route-detail"><i data-lucide="map-pin"></i><span>${esc(req.pickupLocation || '')} → ${esc(req.dropoffLocation || '')}</span></p>
      </section>
      <section class="drv-req-block">
        <h4 class="drv-req-label">Schedule</h4>
        ${scheduleDetailRows(req)}
      </section>
      ${req.notes ? `<section class="drv-req-block"><h4 class="drv-req-label">Notes</h4><p class="drv-req-note">${esc(req.notes)}</p></section>` : ''}
      ${paymentHandleBlock(req, d)}
      ${isNew && blocked ? `<div class="drv-req-gate" role="status">
        <p>${esc(reason)}</p>
        ${docsBlocked ? `<button type="button" class="drv-req-gate-link" onclick="openDriverDocsFromRequest()">Documents</button>` : ''}
      </div>` : ''}
      <div class="drv-req-detail-actions">
        ${isNew ? `
          <button type="button" class="btn-primary${blocked ? ' is-disabled' : ''}" ${blocked ? 'disabled' : ''} onclick="acceptDriverRequest('${req.id}')">Accept</button>
          <button type="button" class="drv-req-decline-btn" onclick="declineDriverRequest('${req.id}')">Decline</button>
        ` : ''}
        <button type="button" class="drv-req-text-link" onclick="openChatWith('${req.parentId}')">Message parent</button>
      </div>
    `;
    icons();
  }

  window.acceptDriverRequest = function (reqId) {
    const d = ensureDriver();
    const req = d.requests.find((r) => r.id === reqId);
    if (!req || req.status !== 'new') return;
    const reason = acceptBlockReason(d);
    if (reason) {
      toast(reason, 'error');
      if (document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
        renderRequestDetail();
      }
      return;
    }
    if (req.seatsNeeded > (d.vehicle.capacity || 0)) {
      toast('Not enough seats for this request', 'error');
      return;
    }
    const booked = seatsBookedAt(req.pickupTime, req.id);
    if (booked + req.seatsNeeded > d.vehicle.capacity) {
      toast('This pickup overlaps a full vehicle', 'error');
      return;
    }
    if (!timeInWindows(req.pickupTime, d.availability.windows) || (req.returnTime && !timeInWindows(req.returnTime, d.availability.windows))) {
      toast('This request sits outside your availability windows', 'error');
      return;
    }
    const conflict = deriveSchedule().some((item) => item.time === req.pickupTime && item.leg === 'morning');
    if (conflict) {
      toast('You already have a trip at this pickup time', 'error');
      return;
    }
    req.status = 'accepted';
    syncParentBookingStatus(req, 'accepted');
    persist();
    toast('Booking accepted. Pickup and return are on your schedule.');
    const onDetail = document.getElementById('screen-driverRequestDetail')?.classList.contains('active');
    refreshRequestViews(onDetail ? 'accepted' : (state()._driverReqTab || 'new'));
  };

  window.declineDriverRequest = function (reqId) {
    const req = ensureDriver().requests.find((r) => r.id === reqId);
    if (!req || req.status !== 'new') return;
    req.status = 'declined';
    syncParentBookingStatus(req, 'declined');
    persist();
    toast('Request declined. Parent is notified in-app.');
    const onDetail = document.getElementById('screen-driverRequestDetail')?.classList.contains('active');
    refreshRequestViews(onDetail ? 'declined' : (state()._driverReqTab || 'new'));
  };

  function renderSchedule(tab) {
    state()._driverSchedTab = tab;
    const wrap = document.getElementById('driverScheduleListWrap');
    if (!wrap) return;
    const all = deriveSchedule();
    const today = all.filter((item) => item.frequency !== 'onetime');
    const upcoming = all.filter((item) => item.frequency === 'onetime');
    const list = tab === 'upcoming' ? upcoming : today;
    const btnT = document.getElementById('btnDSchedToday');
    const btnU = document.getElementById('btnDSchedUpcoming');
    if (btnT) { btnT.textContent = `Today (${today.length})`; btnT.classList.toggle('active', tab === 'today'); }
    if (btnU) { btnU.textContent = `Upcoming (${Math.max(upcoming.length, all.length - today.length) || all.length})`; btnU.classList.toggle('active', tab === 'upcoming'); }
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-trips-card"><div class="empty-trips-icon"><i data-lucide="calendar"></i></div><h4 class="empty-trips-title">Nothing scheduled</h4><p class="empty-trips-desc">Accepted pickup and return legs appear here.</p></div>`;
      icons();
      return;
    }
    wrap.innerHTML = list.map((item) => `
      <div class="drv-home-block">
        ${compactTrip(item, 'schedule')}
        ${item.isActionableNow ? `<button type="button" class="btn-primary" onclick="startDriverTrip('${item.id}')">${item.status === 'active' ? 'Open trip' : "I'm On the Way"}</button>` : ''}
      </div>
    `).join('');
    icons();
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

  function renderActiveTrip() {
    const d = ensureDriver();
    const ctx = tripContext() || {};
    const stage = TRIP_STAGES[d.activeTripStage] || TRIP_STAGES[0];
    const chip = document.getElementById('driverMilestoneText');
    const title = document.getElementById('driverActiveTargetTitle');
    const desc = document.getElementById('driverActiveTargetDesc');
    const eta = document.getElementById('driverActiveTripTimeLeft');
    const btn = document.getElementById('btnDriverMilestoneText');
    const msg = document.getElementById('driverTripMessageBtn');
    if (chip) chip.textContent = stage.chip;
    if (title) title.textContent = d.activeTripStage >= 3 ? (ctx.to || '') : (ctx.from || '');
    if (desc) desc.textContent = `${ctx.childNames || ''} · ${ctx.legLabel || ''}`;
    if (eta) eta.textContent = ctx.time || '';
    if (btn) btn.textContent = stage.cta;
    if (msg) msg.setAttribute('onclick', `openChatWith('${ctx.parentId || 'PRNT-9042'}')`);
    state().trackingStageIndex = stage.parentSync;
    icons();
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
            <img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" />
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
    el.innerHTML = `
      <div style="align-items:center;justify-content:center;text-align:center;display:flex;flex-direction:column;gap:16px;padding-top:12px;">
        <img src="${esc(PARENTS[ctx.parentId]?.photo || '/assets/avatar_sadia.jpg')}" alt="" class="provider-large-avatar" />
        <div>
          <h2 style="font-size:22px;font-weight:800;color:var(--color-title);">Rate ${esc(ctx.parentName || 'this parent')}</h2>
          <p class="page-subtitle" style="margin-top:4px;">Optional. Pickup and communication only — not a public directory.</p>
        </div>
        <div class="stars-row" id="driverRateStars">
          ${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="star-btn" onclick="setDriverParentScore(${n})"><i data-lucide="star" style="width:28px;height:28px;fill:currentColor;"></i></button>`).join('')}
        </div>
        <div class="rating-tags-wrap">
          <span class="rating-tag-pill active" onclick="this.classList.toggle('active')">Punctual pickup</span>
          <span class="rating-tag-pill active" onclick="this.classList.toggle('active')">Clear communication</span>
          <span class="rating-tag-pill" onclick="this.classList.toggle('active')">Children ready</span>
          <span class="rating-tag-pill" onclick="this.classList.toggle('active')">Respectful</span>
        </div>
        <div style="width:100%;text-align:left;">
          <textarea class="rating-comment-box" id="driverRateNote" placeholder="Optional note"></textarea>
        </div>
        <div class="drv-actions-col" style="width:100%;">
          <button type="button" class="btn-primary" onclick="submitDriverParentRating()">Submit review</button>
          <button type="button" class="btn-secondary-link" onclick="skipDriverParentRating()">Skip for now</button>
        </div>
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
      ['rate', '5. Posted rate', `$${d.rate.amount} / week · ${d.rate.negotiable ? 'negotiable' : 'fixed'}`, 'driverOnboardRate']
    ];
    const ready = onboardingDone(d);
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:0;">${isApproved(d) ? 'Verified driver' : ready ? 'Submitted for review' : 'Finish setup'}</h3>
        <p class="drv-lede">${isApproved(d) ? 'You can accept bookings during your trial.' : 'Complete each step. You cannot accept bookings until you are approved.'}</p>
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

  function renderProfile() {
    const d = ensureDriver();
    state()._docsReturnTo = null;
    const el = document.getElementById('driverProfileFeed');
    if (!el) return;
    bindChildTitle(el, 'Driver Profile');
    const badge = isApproved(d) ? 'Verified driver' : onboardingDone(d) ? 'Pending review' : 'Setup incomplete';
    const chevron = '<i data-lucide="chevron-right" style="width: 16px; height: 16px; color: #94A3B8;"></i>';
    el.innerHTML = `
      <div class="profile-user-card" role="button" tabindex="0" onclick="openDriverProfileChild('driverOnboardProfile', event)">
        <div style="position: relative; width: 64px; height: 64px; flex-shrink: 0;">
          <img src="${esc(d.photo || '/assets/avatar_tariq.jpg')}" alt="${esc(d.name)}" class="profile-avatar-lg" />
          <span style="position: absolute; bottom: 0; right: 0; background: var(--color-secondary, #F2600C); color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; border: 2px solid #09122C; box-shadow: 0 2px 5px rgba(0,0,0,0.35);">
            <i data-lucide="edit-2" style="width:11px;height:11px;"></i>
          </span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <h3 style="font-size: 18px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.2px; margin: 0;">${esc(d.name)}</h3>
            </div>
            <i data-lucide="chevron-right" style="width: 16px; height: 16px; color: rgba(255, 255, 255, 0.7);"></i>
          </div>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.78); margin: 3px 0 0 0;">${esc(d.phone)}</p>
          <div style="display: flex; gap: 6px; margin-top: 8px; align-items: center; flex-wrap: wrap;">
            <span class="profile-child-count-pill"><i data-lucide="shield-check" style="width: 11px; height: 11px;"></i> ${esc(badge)}</span>
            <span class="profile-child-count-pill" style="background: rgba(255, 255, 255, 0.22);"><i data-lucide="car" style="width: 11px; height: 11px;"></i> ${esc(d.vehicle.plate)}</span>
          </div>
        </div>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverOnboardVehicle', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="car"></i></div>
            <span class="menu-title-text">${esc(d.vehicle.make)} ${esc(d.vehicle.model)} (${esc(d.vehicle.year)})</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverOnboardDocs', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="file-check"></i></div>
            <span class="menu-title-text">Verification documents</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverOnboardAvailability', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="clock"></i></div>
            <span class="menu-title-text">Availability</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverOnboardRate', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="banknote"></i></div>
            <span class="menu-title-text">Posted rate</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverPayment', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="wallet"></i></div>
            <span class="menu-title-text">Payment preference</span>
          </div>
          ${chevron}
        </button>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('driverSubscription', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="sparkles"></i></div>
            <span class="menu-title-text">Driver subscription</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('faq', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="help-circle"></i></div>
            <span class="menu-title-text">FAQ</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('contactSupport', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="headset"></i></div>
            <span class="menu-title-text">Contact Support</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('privacy', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="shield"></i></div>
            <span class="menu-title-text">Privacy Policy</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('legal', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="file-text"></i></div>
            <span class="menu-title-text">Terms of Service</span>
          </div>
          ${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openDriverProfileChild('about', event)">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="info"></i></div>
            <span class="menu-title-text">About Home2School</span>
          </div>
          ${chevron}
        </button>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="window.switchRole('parent')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="users"></i></div>
            <span class="menu-title-text">Switch to Parent</span>
          </div>
          ${chevron}
        </button>
      </div>

      <button type="button" onclick="navigateTo('authWelcome')" style="width:100%;padding:13px 16px;font-size:14px;font-weight:700;border-radius:12px;border:1.5px solid #FEE2E2;background:#FFF5F5;color:#DC2626;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;">
        <i data-lucide="log-out" style="width:15px;height:15px;"></i>
        Log Out
      </button>
    `;
    icons();
  }

  function driverInboxThreads() {
    const map = {};
    ensureDriver().requests.forEach((r) => {
      if (!r.parentId) return;
      map[r.parentId] = {
        id: r.parentId,
        name: r.parentName || 'Parent',
        photo: r.parentPhoto || '/assets/avatar_sadia.jpg',
        preview: r.notes || `${childShort(r)} commute`,
        time: r.pickupTime || ''
      };
    });
    assignedBookings().forEach((b) => {
      const pid = b.parentId || 'PRNT-9042';
      if (map[pid]) return;
      map[pid] = {
        id: pid,
        name: b.parentName || 'Parent',
        photo: b.parentPhoto || '/assets/avatar_sadia.jpg',
        preview: `${(passengerKids(b).map((c) => c.name.split(' ')[0]).join(' + ') || 'Passengers')} school commute`,
        time: b.outboundTime || ''
      };
    });
    Object.keys(PARENTS).forEach((key) => {
      const p = PARENTS[key];
      if (p && p.id && !map[p.id]) {
        map[p.id] = { id: p.id, name: p.name, photo: p.photo, preview: p.sub, time: '' };
      }
    });
    return Object.values(map);
  }

  function renderDriverInbox() {
    if (state().activeRole !== 'driver') return;
    const wrap = document.getElementById('inboxThreadList');
    if (!wrap) return;
    const threads = driverInboxThreads();
    wrap.innerHTML = threads.map((t) => `
      <button type="button" class="mvp-inbox-row" onclick="openChatWith('${t.id}')">
        <img src="${t.photo}" alt="${esc(t.name)}" />
        <div style="flex:1;min-width:0;">
          <div class="mvp-inbox-name">${esc(t.name)}</div>
          <div class="mvp-inbox-preview">${esc(t.preview)}</div>
        </div>
        <span class="notif-time-text">${esc(t.time)}</span>
      </button>
    `).join('');
  }

  function parentParty(id) {
    if (PARENTS[id]) return PARENTS[id];
    const req = ensureDriver().requests.find((r) => r.parentId === id || r.id === id);
    if (req) return { id: req.parentId, name: req.parentName, photo: req.parentPhoto, sub: 'Parent · ' + childShort(req) };
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

  function renderDriverChatHeader() {
    if (state().activeRole !== 'driver') return;
    const party = parentParty(window.activeChatProviderId) || PARENTS['PRNT-9042'];
    const avatar = document.getElementById('chatDriverAvatar');
    const nameEl = document.getElementById('chatDriverName');
    const subEl = document.getElementById('chatDriverSub');
    const input = document.getElementById('chatInputField');
    const header = document.getElementById('chatHeaderProfileBtn');
    const callBtn = document.getElementById('chatDriverCallBtn');
    if (avatar) avatar.src = party.photo;
    if (nameEl) {
      const label = nameEl.querySelector('span');
      if (label) label.textContent = party.name;
      else nameEl.textContent = party.name;
      const chev = nameEl.querySelector('i, svg');
      if (chev) chev.style.display = 'none';
    }
    if (subEl) {
      subEl.textContent = party.sub || 'Parent';
      subEl.style.color = 'var(--color-body)';
    }
    if (input) input.placeholder = `Message ${String(party.name).split(' ')[0]}…`;
    if (header) { header.onclick = null; header.style.cursor = 'default'; }
    if (callBtn) callBtn.style.display = 'none';
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
    const stream = document.getElementById('chatStream');
    if (stream && !stream.dataset.driverPainted) {
      if (parentChatHtml === null) parentChatHtml = stream.innerHTML;
      const first = String(party.name || 'Parent').split(' ')[0];
      stream.dataset.driverPainted = '1';
      stream.innerHTML = `
        <div class="system-status-bubble">
          <i data-lucide="clock" style="width:14px;height:14px;"></i>
          <span>In-app messages only · phone stays private</span>
        </div>
        <div class="chat-bubble provider">
          ${esc(first)} here — the children will be at the porch.
          <div class="chat-timestamp">07:25 AM</div>
        </div>
        <div class="chat-bubble parent">
          Thanks. I’m on the way in the Sienna.
          <div class="chat-timestamp">07:26 AM</div>
        </div>
      `;
    }
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

  window.switchDriverScheduleTab = function (tab) {
    renderSchedule(tab);
  };

  window.setDriverScenario = function (scenario) {
    ensureDriver().homeScenario = scenario;
    persist();
    renderHome();
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

  function applyTariqAvailabilityToSearch() {
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

  injectScreens();
  ensureDriver();
  ingestBookingAsRequest((state().bookings || []).find((b) => b.id === 'H2S-REQ-9042'));
  applyRoleChrome();
})();
