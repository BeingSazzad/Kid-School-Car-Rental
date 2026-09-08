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
    'driverOnboardProfile', 'driverOnboardVehicle', 'driverOnboardDocs', 'driverOnboardAvailability',
    'driverOnboardRate', 'driverPending', 'driverSubscription', 'driverRequestDetail', 'driverTripPrep', 'driverRateParent'
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
        serviceArea: d.serviceArea,
        verificationStatus: d.verificationStatus,
        onboarding: d.onboarding,
        vehicle: d.vehicle,
        documents: d.documents,
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

  function ensureDriver() {
    const d = state().driver;
    if (!d) return {};
    if (!d.onboarding) d.onboarding = { profile: false, vehicle: false, docs: false, availability: false, rate: false };
    if (!Array.isArray(d.documents)) d.documents = [];
    if (!d.availability) d.availability = {};
    if (!Array.isArray(d.availability.windows)) {
      d.availability.windows = [
        { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '06:30', end: '09:00', label: 'Morning' },
        { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '13:00', end: '16:30', label: 'Afternoon' }
      ];
    }
    if (!Array.isArray(d.availability.exceptions)) d.availability.exceptions = [];
    if (!d.rate) d.rate = { amount: 120, period: 'week', negotiable: true, paymentMethod: 'Interac e-Transfer' };
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
          if (Array.isArray(saved.documents)) d.documents = saved.documents;
          if (Array.isArray(saved.requests)) d.requests = saved.requests.map(normalizeRequest);
          if (Array.isArray(saved.schedule)) d.schedule = saved.schedule;
          if (Array.isArray(saved.notifications)) d.notifications = saved.notifications;
        }
      } catch (err) { /* ignore */ }
    }
    return d;
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
      ['driverOnboardVehicle', 'Your vehicle', "navigateTo('driverOnboardProfile')"],
      ['driverOnboardDocs', 'Documents', "navigateTo('driverOnboardVehicle')"],
      ['driverOnboardAvailability', 'Availability', "navigateTo('driverOnboardDocs')"],
      ['driverOnboardRate', 'Posted rate', "navigateTo('driverOnboardAvailability')"],
      ['driverPending', 'Verification', "navigateTo('driverSetup')"],
      ['driverSubscription', 'Platform access', "navigateTo('driverPending')"],
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
      section.innerHTML = `${statusBar()}${topBar(title, back)}<div class="screen-scroll-body" id="${id}Feed"></div><div class="home-indicator"></div>`;
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
    const back = document.getElementById('inboxBackBtn');
    if (parentNav) parentNav.style.display = role === 'driver' ? 'none' : '';
    if (driverNav) driverNav.style.display = role === 'driver' ? 'flex' : 'none';
    if (back) back.setAttribute('onclick', role === 'driver' ? "navigateTo('driverHome')" : "navigateTo('home')");
    const notifBack = document.querySelector('#screen-notifications .back-btn');
    if (notifBack) notifBack.setAttribute('onclick', role === 'driver' ? "navigateTo('driverHome')" : "navigateTo('home')");
    const msgBack = document.querySelector('#screen-messages .back-btn');
    if (msgBack) msgBack.setAttribute('onclick', "navigateTo('inbox')");
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
    else if (name === 'driverOnboardAvailability') renderOnboardAvailability();
    else if (name === 'driverOnboardRate') renderOnboardRate();
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
    state().activeRole = next;
    localStorage.setItem('h2s_active_role', next);
    applyRoleChrome();
    window.navigateTo(next === 'driver' ? window.getDriverLanding() : 'home');
  };

  window.leaveDriverGate = function () {
    state().activeRole = 'parent';
    localStorage.setItem('h2s_active_role', 'parent');
    applyRoleChrome();
    window.navigateTo(state().driverEntryFromAuth ? 'authWelcome' : 'profile');
  };

  function feed(id) {
    return document.getElementById(id);
  }

  function val(id) {
    return document.getElementById(id)?.value?.trim() || '';
  }

  function stepHint(n, total, copy) {
    return `<p class="drv-lede">Step ${n} of ${total} · ${copy}</p>`;
  }

  function renderOnboardProfile() {
    const d = ensureDriver();
    const el = feed('driverOnboardProfileFeed');
    if (!el) return;
    el.innerHTML = `
      ${stepHint(1, 5, 'Who you are')}
      <p class="drv-lede">Parents see your name and service area before they request a school commute.</p>
      <div class="form-group"><label class="form-label">Full name</label><input class="form-input" id="drvName" value="${esc(d.name)}" /></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="drvPhone" value="${esc(d.phone)}" /></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="drvEmail" value="${esc(d.email)}" /></div>
      <div class="form-group"><label class="form-label">Service area</label><input class="form-input" id="drvArea" value="${esc(d.serviceArea || '')}" placeholder="Neighbourhoods or schools you cover" /></div>
      <button type="button" class="btn-primary" onclick="saveDriverOnboardProfile()">Continue</button>
    `;
  }

  window.saveDriverOnboardProfile = function () {
    const d = ensureDriver();
    d.name = val('drvName') || d.name;
    d.phone = val('drvPhone') || d.phone;
    d.email = val('drvEmail') || d.email;
    d.serviceArea = val('drvArea') || d.serviceArea;
    d.onboarding.profile = true;
    persist();
    window.navigateTo('driverOnboardVehicle');
  };

  function renderOnboardVehicle() {
    const v = ensureDriver().vehicle;
    const el = feed('driverOnboardVehicleFeed');
    if (!el) return;
    el.innerHTML = `
      ${stepHint(2, 5, 'One vehicle')}
      <p class="drv-lede">Capacity is used when you accept a request. Add the vehicle parents will see.</p>
      <div class="form-group"><label class="form-label">Type</label>
        <div class="select-wrapper"><select class="form-select" id="drvVType">
          ${['Minivan', 'SUV', 'Sedan', 'Wagon'].map((t) => `<option ${v.type === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select></div>
      </div>
      <div class="drv-window-row">
        <div class="form-group"><label class="form-label">Make</label><input class="form-input" id="drvVMake" value="${esc(v.make)}" /></div>
        <div class="form-group"><label class="form-label">Model</label><input class="form-input" id="drvVModel" value="${esc(v.model)}" /></div>
      </div>
      <div class="drv-window-row">
        <div class="form-group"><label class="form-label">Year</label><input class="form-input" id="drvVYear" value="${esc(v.year)}" /></div>
        <div class="form-group"><label class="form-label">Colour</label><input class="form-input" id="drvVColor" value="${esc(v.color)}" /></div>
      </div>
      <div class="drv-window-row">
        <div class="form-group"><label class="form-label">Plate</label><input class="form-input" id="drvVPlate" value="${esc(v.plate)}" /></div>
        <div class="form-group"><label class="form-label">Seats</label><input class="form-input" id="drvVSeats" type="number" min="1" max="8" value="${esc(v.capacity)}" /></div>
      </div>
      <button type="button" class="btn-secondary-surface" onclick="showToast('Vehicle photo attached for this prototype','info')">Add vehicle photo</button>
      <button type="button" class="btn-primary" onclick="saveDriverVehicle()">Continue</button>
    `;
  }

  window.saveDriverVehicle = function () {
    const d = ensureDriver();
    d.vehicle = {
      ...d.vehicle,
      type: val('drvVType') || d.vehicle.type,
      make: val('drvVMake'),
      model: val('drvVModel'),
      year: val('drvVYear'),
      color: val('drvVColor'),
      plate: val('drvVPlate'),
      capacity: Number(val('drvVSeats') || d.vehicle.capacity)
    };
    d.onboarding.vehicle = true;
    persist();
    window.navigateTo('driverOnboardDocs');
  };

  function docLabel(status) {
    return { not_submitted: 'Not Submitted', under_review: 'Under Review', approved: 'Approved', action_required: 'Action Required' }[status] || status;
  }

  function renderOnboardDocs() {
    const d = ensureDriver();
    const el = feed('driverOnboardDocsFeed');
    if (!el) return;
    el.innerHTML = `
      ${stepHint(3, 5, 'Safety documents')}
      <p class="drv-lede">Licence, insurance, registration, criminal background, and vulnerable sector check.</p>
      ${d.documents.map((doc) => `
        <div class="drv-doc-row">
          <div>
            <div style="font-size:14px;font-weight:800;color:var(--color-title);">${esc(doc.title)}</div>
            ${doc.rejectReason ? `<p class="drv-lede" style="color:#B91C1C;margin-top:4px;">${esc(doc.rejectReason)}</p>` : ''}
            <button type="button" class="btn-text-link" style="margin-top:6px;font-weight:700;" onclick="uploadDriverDoc('${doc.id}')">${doc.status === 'not_submitted' || doc.status === 'action_required' ? 'Upload' : 'Replace'}</button>
          </div>
          <span class="drv-doc-status ${doc.status}">${docLabel(doc.status)}</span>
        </div>
      `).join('')}
      <button type="button" class="btn-primary" onclick="saveDriverDocs()">Continue</button>
    `;
  }

  window.uploadDriverDoc = function (id) {
    const d = ensureDriver();
    const doc = d.documents.find((item) => item.id === id);
    if (!doc) return;
    doc.status = 'under_review';
    doc.rejectReason = '';
    persist();
    toast('Document uploaded');
    if (document.getElementById('driverOnboardDocsFeed')) renderOnboardDocs();
    else renderSetup();
    icons();
  };

  window.saveDriverDocs = function () {
    const d = ensureDriver();
    d.documents.forEach((doc) => {
      if (doc.status === 'not_submitted') doc.status = 'under_review';
    });
    d.onboarding.docs = true;
    persist();
    window.navigateTo('driverOnboardAvailability');
  };

  function renderOnboardAvailability() {
    const d = ensureDriver();
    const w = d.availability.windows;
    const el = feed('driverOnboardAvailabilityFeed');
    if (!el) return;
    el.innerHTML = `
      ${stepHint(4, 5, 'Weekly time windows')}
      <p class="drv-lede">Morning and afternoon windows for pickup and return. Exceptions skip a date without changing the week.</p>
      <div class="drv-card">
        <div class="drv-section-label">Morning</div>
        <div class="drv-window-row">
          <div class="form-group"><label class="form-label">From</label><input class="form-input" id="drvMStart" type="time" value="${w[0]?.start || '06:30'}" /></div>
          <div class="form-group"><label class="form-label">To</label><input class="form-input" id="drvMEnd" type="time" value="${w[0]?.end || '09:00'}" /></div>
        </div>
        <div class="drv-lede">Mon–Fri</div>
      </div>
      <div class="drv-card">
        <div class="drv-section-label">Afternoon</div>
        <div class="drv-window-row">
          <div class="form-group"><label class="form-label">From</label><input class="form-input" id="drvAStart" type="time" value="${w[1]?.start || '13:00'}" /></div>
          <div class="form-group"><label class="form-label">To</label><input class="form-input" id="drvAEnd" type="time" value="${w[1]?.end || '16:30'}" /></div>
        </div>
        <div class="drv-lede">Mon–Fri</div>
      </div>
      <div class="form-group"><label class="form-label">Exception date (optional)</label><input class="form-input" id="drvException" type="date" /></div>
      <button type="button" class="btn-secondary-surface" onclick="addDriverException()">Add exception</button>
      <div id="drvExceptionList" class="drv-lede">${(d.availability.exceptions || []).map((x) => esc(x)).join(' · ') || 'No exceptions yet'}</div>
      <button type="button" class="btn-primary" onclick="saveDriverAvailability()">Continue</button>
    `;
  }

  window.addDriverException = function () {
    const d = ensureDriver();
    const date = val('drvException');
    if (!date) return toast('Choose a date', 'error');
    d.availability.exceptions = d.availability.exceptions || [];
    if (!d.availability.exceptions.includes(date)) d.availability.exceptions.push(date);
    persist();
    renderOnboardAvailability();
    icons();
  };

  window.saveDriverAvailability = function () {
    const d = ensureDriver();
    d.availability.windows = [
      { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: val('drvMStart') || '06:30', end: val('drvMEnd') || '09:00', label: 'Morning' },
      { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: val('drvAStart') || '13:00', end: val('drvAEnd') || '16:30', label: 'Afternoon' }
    ];
    d.availability.weekly = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    d.availability.morningSlot = formatWindow(d.availability.windows[0]);
    d.availability.afternoonSlot = formatWindow(d.availability.windows[1]);
    d.onboarding.availability = true;
    persist();
    window.navigateTo('driverOnboardRate');
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
    el.innerHTML = `
      ${stepHint(5, 5, 'Posted rate')}
      <p class="drv-lede">This is informational. Home2School does not pay out ride fees. Parents may share a payment handle after a booking is confirmed.</p>
      <div class="form-group"><label class="form-label">Weekly posted rate (CAD)</label><input class="form-input" id="drvRateAmt" type="number" value="${esc(r.amount)}" /></div>
      <div class="form-group"><label class="form-label">Negotiable</label>
        <div class="drv-toggle-row">
          <button type="button" id="drvNegYes" class="${r.negotiable ? 'active' : ''}" onclick="setDriverNegotiable(true)">Yes</button>
          <button type="button" id="drvNegNo" class="${!r.negotiable ? 'active' : ''}" onclick="setDriverNegotiable(false)">No</button>
        </div>
      </div>
      <div class="form-group"><label class="form-label">Preferred payment method</label>
        <div class="select-wrapper"><select class="form-select" id="drvPayMethod">
          ${['Interac e-Transfer', 'Cash', 'Cheque'].map((m) => `<option ${r.paymentMethod === m ? 'selected' : ''}>${m}</option>`).join('')}
        </select></div>
      </div>
      <button type="button" class="btn-primary" onclick="saveDriverRate()">Submit for review</button>
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
    d.rate.paymentMethod = val('drvPayMethod') || d.rate.paymentMethod;
    d.onboarding.rate = true;
    d.verificationStatus = 'pending';
    persist();
    window.navigateTo('driverPending');
  };

  function renderPending() {
    const d = ensureDriver();
    const el = feed('driverPendingFeed');
    if (!el) return;
    const back = el.closest('.screen-view')?.querySelector('.back-btn');
    if (back) back.setAttribute('onclick', "navigateTo('driverSetup')");
    el.innerHTML = `
      <div class="drv-card" style="align-items:center;text-align:center;padding:24px 16px;">
        <div style="width:56px;height:56px;border-radius:50%;background:var(--color-fade);display:flex;align-items:center;justify-content:center;color:var(--color-primary);">
          <i data-lucide="shield" style="width:26px;height:26px;"></i>
        </div>
        <h2 class="page-title">Verification pending</h2>
        <p class="drv-lede">Home2School reviews your documents before you can accept bookings. You will get an in-app notice when a decision is ready.</p>
      </div>
      ${d.documents.map((doc) => `
        <div class="drv-doc-row">
          <div>
            <div style="font-size:14px;font-weight:800;">${esc(doc.title)}</div>
            ${doc.rejectReason ? `<p class="drv-lede" style="color:#B91C1C;margin-top:4px;">${esc(doc.rejectReason)}</p>` : ''}
            ${doc.status === 'action_required' ? `<button type="button" class="btn-text-link" onclick="uploadDriverDoc('${doc.id}')">Re-upload</button>` : ''}
          </div>
          <span class="drv-doc-status ${doc.status}">${docLabel(doc.status)}</span>
        </div>
      `).join('')}
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
    const titleEl = el.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Platform access';
    const failed = sub.status === 'failed';
    el.innerHTML = `
      <p class="drv-lede">This is the Home2School platform fee, not your posted ride rate. Ride fees stay between you and the parent.</p>
      <div class="sub-status-card" data-status="${esc(sub.status)}">
        <div class="sub-status-copy">
          <div class="sub-status-kicker">${sub.status === 'trial' ? 'Free trial' : sub.status === 'active' ? 'Active' : sub.status === 'failed' ? 'Payment failed' : 'Not started'}</div>
          <div class="sub-status-title">${sub.status === 'trial' ? `${sub.trialDaysLeft} days remaining` : sub.status === 'active' ? (sub.plan === 'annual' ? '$279 / year' : '$29 / month') : 'Start a trial to accept bookings'}</div>
          <div class="sub-status-sub">${sub.status === 'none' ? 'Monthly or annual platform access' : `Renews ${sub.renewal || 'Oct 8, 2026'}`}</div>
        </div>
      </div>
      <div class="sub-plan-block">
        <h3 class="sub-section-title">Choose your plan</h3>
        <button type="button" class="sub-plan-card ${sub.plan === 'monthly' ? 'active' : ''}" onclick="selectDriverPlan('monthly')">
          <span class="sub-plan-copy"><span class="sub-plan-name">Monthly</span><span class="sub-plan-price">$29 / month</span></span>
        </button>
        <button type="button" class="sub-plan-card ${sub.plan === 'annual' ? 'active' : ''}" onclick="selectDriverPlan('annual')">
          <span class="sub-plan-copy"><span class="sub-plan-name">Annual</span><span class="sub-plan-price">$279 / year</span></span>
        </button>
      </div>
      ${failed ? `<div class="drv-failed-pay"><div style="font-size:13px;font-weight:800;color:#991B1B;">Last payment failed</div><button type="button" class="btn-primary" style="margin-top:10px;" onclick="recoverDriverPayment()">Retry payment</button></div>` : ''}
      <button type="button" class="btn-primary" onclick="continueDriverTrial()">Continue with free trial</button>
      <button type="button" class="btn-secondary-surface" onclick="activateDriverSubscription()">Activate ${sub.plan === 'annual' ? 'annual' : 'monthly'} access</button>
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
    const name = item?.parentName || 'Parent';
    return `Parent ${name}`;
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
    return (windows || []).some((w) => mins >= toMinutes(w.start) && mins <= toMinutes(w.end));
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
            <div class="action-card light horizontal" onclick="navigateTo('driverOnboardAvailability')">
              <div class="action-icon-circle orange-tint"><i data-lucide="clock"></i></div>
              <h4 class="card-title-navy">Availability</h4>
            </div>
            <div class="action-card light horizontal" onclick="navigateTo('inbox')">
              <div class="action-icon-circle red-tint"><i data-lucide="message-square"></i></div>
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
      const t = timeParts(item.pickupTime);
      return `<div class="trip-card-compact" onclick="openDriverRequest('${item.id}')">
        <div class="trip-date-block">
          <span class="td-month">${esc(t.mer || 'AM')}</span>
          <span class="td-day">${esc(t.clock)}</span>
          <span class="td-weekday">New</span>
        </div>
        <div class="trip-compact-content">
          <div class="trip-compact-top">
            <span class="trip-compact-time">${esc(item.pickupTime)} &amp; ${esc(item.returnTime)}</span>
            <span class="both-way-badge">Request</span>
          </div>
          <div class="trip-compact-route">${esc(item.pickupLocation || '')} ⇄ ${esc(item.dropoffLocation || '')}</div>
          <div class="trip-compact-sub">${esc(passengerSub(item, 'request'))}</div>
        </div>
      </div>`;
    }
    const t = timeParts(item.time);
    const click = item.isActionableNow ? `onclick="startDriverTrip('${item.id}')"` : `onclick="navigateTo('driverSchedule')"`;
    return `<div class="trip-card-compact" ${click}>
      <div class="trip-date-block">
        <span class="td-month">${esc(t.mer || (item.leg === 'afternoon' ? 'PM' : 'AM'))}</span>
        <span class="td-day">${esc(t.clock)}</span>
        <span class="td-weekday">${item.leg === 'afternoon' ? 'Ret' : 'AM'}</span>
      </div>
      <div class="trip-compact-content">
        <div class="trip-compact-top">
          <span class="trip-compact-time">${esc(item.time)}</span>
          <span class="${item.leg === 'afternoon' ? 'one-way-badge' : 'both-way-badge'}">${esc(item.legLabel || (item.leg === 'afternoon' ? 'Return' : 'Morning'))}</span>
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
    return `<div class="section-block">
      <h3 class="section-heading">${view.kind === 'active' ? 'Active trip' : 'Upcoming Trips'}</h3>
      <div class="trip-card ${view.kind === 'soon' || view.kind === 'active' ? 'state-urgent' : ''}">
        <div class="trip-card-top">
          <div class="date-badge-box">
            <span class="db-month">${esc(timeParts(next.time).mer || 'AM')}</span>
            <span class="db-day">${esc(timeParts(next.time).clock)}</span>
            <span class="db-weekday">${view.kind === 'active' ? 'Live' : 'Next'}</span>
          </div>
          <div>
            <h3 class="card-title-navy">${esc(next.childNames)}</h3>
            <p class="card-desc-muted">${esc(parentLabel(next))}</p>
            <p class="card-desc-muted">${esc(next.legLabel)} · ${esc(next.route)}</p>
          </div>
        </div>
        <button type="button" class="btn-primary" onclick="startDriverTrip('${next.id}', '${view.kind}')">${cta}</button>
      </div>
    </div>`;
  }

  function scheduleRow(item) {
    return compactTrip(item, 'schedule');
  }

  function renderRequests(tab) {
    const d = ensureDriver();
    state()._driverReqTab = tab;
    const wrap = document.getElementById('driverRequestsListWrap');
    if (!wrap) return;
    const counts = {
      new: d.requests.filter((r) => r.status === 'new').length,
      accepted: d.requests.filter((r) => r.status === 'accepted').length,
      declined: d.requests.filter((r) => r.status === 'declined').length
    };
    const btnNew = document.getElementById('btnDReqNew');
    const btnAcc = document.getElementById('btnDReqAccepted');
    const btnDec = document.getElementById('btnDReqDeclined');
    if (btnNew) { btnNew.textContent = `New (${counts.new})`; btnNew.classList.toggle('active', tab === 'new'); }
    if (btnAcc) { btnAcc.textContent = `Accepted (${counts.accepted})`; btnAcc.classList.toggle('active', tab === 'accepted'); }
    if (btnDec) { btnDec.textContent = `Declined (${counts.declined})`; btnDec.classList.toggle('active', tab === 'declined'); }
    const list = d.requests.filter((r) => r.status === tab);
    if (!list.length) {
      wrap.innerHTML = `<div class="empty-trips-card"><div class="empty-trips-icon"><i data-lucide="inbox"></i></div><h4 class="empty-trips-title">No ${tab} requests</h4><p class="empty-trips-desc">Parent commute requests for your area appear here.</p></div>`;
      icons();
      return;
    }
    wrap.innerHTML = list.map((req) => `
      <div class="trip-card" onclick="openDriverRequest('${req.id}')">
        <div class="dreq-header">
          <span class="capacity-badge ${req.seatsNeeded <= d.vehicle.capacity ? 'ok' : 'full'}">${req.seatsNeeded} seats</span>
          <span class="card-title-navy" style="margin:0;">${esc(req.rateLabel)}</span>
        </div>
        <h4 class="card-title-navy" style="margin:0;">${esc(req.parentName || 'Parent')}</h4>
        <p class="card-desc-muted">${esc(childLine(req))}</p>
        <p class="card-desc-muted">${esc(req.pickupLocation)} → ${esc(req.dropoffLocation)}</p>
        <p class="card-desc-muted">${esc(req.dateLabel || '')} · Pickup ${esc(req.pickupTime)} · Return ${esc(req.returnTime)}</p>
        ${tab === 'new' ? `<div class="drv-actions-col" onclick="event.stopPropagation();">
          <button type="button" class="btn-primary" onclick="acceptDriverRequest('${req.id}')">Accept booking</button>
          <button type="button" class="btn-secondary-surface" onclick="declineDriverRequest('${req.id}')">Decline</button>
        </div>` : ''}
      </div>
    `).join('');
    icons();
  }

  window.openDriverRequest = function (id) {
    ensureDriver().selectedRequestId = id;
    window.navigateTo('driverRequestDetail');
  };

  function selectedRequest() {
    const d = ensureDriver();
    return d.requests.find((r) => r.id === d.selectedRequestId) || d.requests[0];
  }

  function renderRequestDetail() {
    const d = ensureDriver();
    const req = selectedRequest();
    const el = feed('driverRequestDetailFeed');
    if (!el || !req) return;
    const handle = state().paymentHandle || { status: 'idle' };
    const confirmed = req.status === 'accepted';
    el.innerHTML = `
      <div class="drv-parent-card">
        <img src="${esc(req.parentPhoto || '/assets/avatar_sadia.jpg')}" alt="" />
        <div>
          <div style="font-size:15px;font-weight:800;">${esc(req.parentName)}</div>
          <div class="drv-lede">${esc(req.parentRole || 'Parent')} · requesting this commute</div>
        </div>
      </div>
      <div class="drv-card">
        <div class="drv-section-label">Passengers</div>
        ${kids(req).map((c) => `<div class="drv-child-mini"><img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" /><div><div style="font-weight:800;">${esc(c.name)}</div><div class="drv-lede">${esc(c.grade || '')} ${c.notes ? '· ' + esc(c.notes) : ''}</div></div></div>`).join('')}
      </div>
      <div class="drv-card">
        <div class="drv-section-label">Route & time</div>
        <div style="font-weight:800;">${esc(req.pickupLocation)} → ${esc(req.dropoffLocation)}</div>
        <p class="drv-lede">${esc(req.dateLabel)}</p>
        <p class="drv-lede">Pickup ${esc(req.pickupTime)} · Return ${esc(req.returnTime)}</p>
        ${req.frequency === 'recurring' ? `<p class="drv-lede">Recurring ${(req.recurringDays || []).join(', ')}</p>` : '<p class="drv-lede">One-time, both legs</p>'}
        <p class="drv-lede">${req.seatsNeeded} seats · ${esc(req.rateLabel)}${d.rate?.negotiable ? ' · negotiable' : ''}</p>
      </div>
      ${req.notes ? `<div class="drv-card"><div class="drv-section-label">Safety & care</div><p class="drv-lede">${esc(req.notes)}</p></div>` : ''}
      ${confirmed ? `
        <div class="drv-card">
          <div class="drv-section-label">Payment handle</div>
          <p class="drv-lede">${handle.status === 'revealed' ? esc(handle.handle) : 'After confirmation, request consent to share a payment handle. Home2School does not process the ride fee.'}</p>
          <button type="button" class="btn-secondary-surface" onclick="advancePaymentHandle();renderDriverRequestDetail();">${handle.status === 'idle' ? 'Request handle' : handle.status === 'requested' ? 'Mark consented' : handle.status === 'consented' ? 'Reveal handle' : 'Handle revealed'}</button>
        </div>` : ''}
      <button type="button" class="btn-secondary-surface" onclick="openChatWith('${req.parentId}')">Message parent</button>
      ${req.status === 'new' ? `
        <button type="button" class="btn-primary" onclick="acceptDriverRequest('${req.id}')">Accept booking</button>
        <button type="button" class="btn-secondary-surface" onclick="declineDriverRequest('${req.id}')">Decline</button>
      ` : `<button type="button" class="btn-primary" onclick="navigateTo('driverSchedule')">Open schedule</button>`}
    `;
    icons();
  }

  window.acceptDriverRequest = function (reqId) {
    const d = ensureDriver();
    const req = d.requests.find((r) => r.id === reqId);
    if (!req) return;
    if (!isApproved(d) || !hasAccess(d)) {
      toast('You cannot accept bookings until you are approved and on a trial', 'error');
      window.navigateTo(window.getDriverLanding());
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
    persist();
    toast('Booking accepted. Pickup and return are on your schedule.');
    renderRequests('new');
    if (document.getElementById('driverRequestDetailFeed')) renderRequestDetail();
  };

  window.declineDriverRequest = function (reqId) {
    const req = ensureDriver().requests.find((r) => r.id === reqId);
    if (!req) return;
    req.status = 'declined';
    persist();
    toast('Request declined. Parent is notified in-app.');
    renderRequests('new');
    if (state().activeRole === 'driver' && document.getElementById('screen-driverRequestDetail')?.classList.contains('active')) {
      window.navigateTo('driverRequests');
    }
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
            <span class="db-month">${esc(timeParts(ctx.time).mer || 'AM')}</span>
            <span class="db-day">${esc(timeParts(ctx.time).clock)}</span>
            <span class="db-weekday">Next</span>
          </div>
          <div>
            <h3 class="card-title-navy">${esc(ctx.childNames)}</h3>
            <p class="card-desc-muted">${esc(ctx.legLabel || 'Next trip')}</p>
            <p class="drv-lede">${esc(ctx.from)} → ${esc(ctx.to)}</p>
            <p class="drv-lede">Parent: ${esc(ctx.parentName || 'Parent')}</p>
          </div>
        </div>
      </div>
      <button type="button" class="btn-primary" onclick="beginDriverTrip()">I'm On the Way</button>
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
            <div><div style="font-weight:800;">${esc(c.name)}</div><div class="drv-lede">${esc(c.notes || c.grade || '')}</div></div>
          </div>
          <span class="capacity-badge ${on ? 'ok' : 'full'}">${on ? 'Riding' : 'Not riding'}</span>
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
      <div style="text-align:center;">
        <img src="${esc(PARENTS[ctx.parentId]?.photo || '/assets/avatar_sadia.jpg')}" alt="" class="provider-large-avatar" style="margin:12px auto;" />
        <h2 class="page-title">Rate ${esc(ctx.parentName || 'this parent')}</h2>
        <p class="drv-lede">Optional. Pickup and communication only — not a public directory.</p>
      </div>
      <div class="stars-row" id="driverRateStars">
        ${[1, 2, 3, 4, 5].map((n) => `<button class="star-btn" onclick="setDriverParentScore(${n})"><i data-lucide="star" style="width:28px;height:28px;fill:currentColor;"></i></button>`).join('')}
      </div>
      <textarea class="rating-comment-box" id="driverRateNote" placeholder="Optional note"></textarea>
      <button type="button" class="btn-primary" onclick="submitDriverParentRating()">Submit review</button>
      <button type="button" class="btn-secondary-link" onclick="skipDriverParentRating()">Skip for now</button>
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
      ['availability', '4. Availability', 'Mon–Fri · ' + d.availability.morningSlot, 'driverOnboardAvailability'],
      ['rate', '5. Posted rate', `$${d.rate.amount} / week · ${d.rate.negotiable ? 'negotiable' : 'fixed'}`, 'driverOnboardRate']
    ];
    const ready = onboardingDone(d);
    el.innerHTML = `
      <div class="drv-card">
        <h3 class="section-heading" style="margin-bottom:0;">${isApproved(d) ? 'Verified driver' : ready ? 'Submitted for review' : 'Finish setup'}</h3>
        <p class="drv-lede">${isApproved(d) ? 'You can accept bookings during your trial.' : 'Complete each step. You cannot accept bookings until you are approved.'}</p>
      </div>
      ${steps.map(([key, title, sub, screen]) => `
        <div class="driver-setup-step ${d.onboarding[key] ? 'completed' : ''}" onclick="navigateTo('${screen}')" style="cursor:pointer;">
          <div style="display:flex;align-items:center;gap:10px;">
            <span class="step-num-circle">${d.onboarding[key] ? '✓' : title[0]}</span>
            <div><div style="font-size:13.5px;font-weight:800;">${title}</div><div class="drv-lede">${esc(sub)}</div></div>
          </div>
          <i data-lucide="chevron-right" style="width:16px;height:16px;color:var(--color-body);"></i>
        </div>
      `).join('')}
      ${ready && !isApproved(d) ? `<button type="button" class="btn-primary" onclick="navigateTo('driverPending')">View verification status</button>` : ''}
      ${isApproved(d) ? `<button type="button" class="btn-primary" onclick="navigateTo('driverHome')">Back to home</button>` : ''}
    `;
    icons();
  }

  function renderProfile() {
    const d = ensureDriver();
    const el = document.getElementById('driverProfileFeed');
    if (!el) return;
    const titleEl = el.closest('.screen-view')?.querySelector('.top-bar-title');
    if (titleEl) titleEl.textContent = 'Driver Profile';
    const badge = isApproved(d) ? 'Verified driver' : onboardingDone(d) ? 'Pending review' : 'Setup incomplete';
    const docsOk = d.documents.filter((doc) => doc.status === 'approved').length;
    const sub = d.subscription || {};
    const subLine = sub.status === 'trial'
      ? `${sub.trialDaysLeft || 14}-day trial`
      : sub.status === 'active'
        ? (sub.plan === 'annual' ? '$279 / year' : '$29 / month')
        : 'Not started';
    const chevron = '<i data-lucide="chevron-right" style="width: 16px; height: 16px; color: #94A3B8;"></i>';
    el.innerHTML = `
      <div class="profile-user-card" onclick="navigateTo('driverOnboardProfile')">
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
        <div class="profile-menu-item" onclick="navigateTo('driverOnboardVehicle')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="car"></i></div>
            <div>
              <div class="menu-title-text">${esc(d.vehicle.make)} ${esc(d.vehicle.model)} (${esc(d.vehicle.year)})</div>
              <div class="menu-subtitle">${esc(d.vehicle.color)} · ${d.vehicle.capacity} seats · ${esc(d.vehicle.plate)}</div>
            </div>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('driverOnboardDocs')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="file-check"></i></div>
            <div>
              <div class="menu-title-text">Verification documents</div>
              <div class="menu-subtitle">${docsOk} / ${d.documents.length} approved</div>
            </div>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('driverOnboardAvailability')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="clock"></i></div>
            <div>
              <div class="menu-title-text">Availability</div>
              <div class="menu-subtitle">Mon–Fri · ${esc(d.availability.morningSlot)} · ${esc(d.availability.afternoonSlot)}</div>
            </div>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('driverOnboardRate')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="banknote"></i></div>
            <div>
              <div class="menu-title-text">Posted rate</div>
              <div class="menu-subtitle">$${esc(d.rate.amount)} / week · ${d.rate.negotiable ? 'negotiable' : 'fixed'}</div>
            </div>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('driverOnboardRate')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="wallet"></i></div>
            <div>
              <div class="menu-title-text">Payment preference</div>
              <div class="menu-subtitle">${esc(d.rate.paymentMethod)} · ride fees stay with the parent</div>
            </div>
          </div>
          ${chevron}
        </div>
      </div>

      <div class="profile-menu-section">
        <div class="profile-menu-item" onclick="navigateTo('driverSubscription')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="sparkles"></i></div>
            <div>
              <div class="menu-title-text">Driver subscription</div>
              <div class="menu-subtitle">${esc(subLine)} · platform fee, not your ride rate</div>
            </div>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('faq')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="help-circle"></i></div>
            <span class="menu-title-text">FAQ</span>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('contactSupport')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="headset"></i></div>
            <span class="menu-title-text">Contact Support</span>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('privacy')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="shield"></i></div>
            <span class="menu-title-text">Privacy Policy</span>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('legal')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="file-text"></i></div>
            <span class="menu-title-text">Terms of Service</span>
          </div>
          ${chevron}
        </div>
        <div class="profile-menu-item" onclick="navigateTo('about')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="info"></i></div>
            <span class="menu-title-text">About Home2School</span>
          </div>
          ${chevron}
        </div>
      </div>

      <div class="profile-menu-section">
        <div class="profile-menu-item" onclick="window.switchRole('parent')">
          <div class="menu-item-left">
            <div class="menu-icon-wrap"><i data-lucide="users"></i></div>
            <span class="menu-title-text">Switch to Parent</span>
          </div>
          ${chevron}
        </div>
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
        <span style="font-size:11px;color:var(--color-body);font-weight:700;">${esc(t.time)}</span>
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
    if (nameEl) nameEl.textContent = party.name;
    if (subEl) subEl.textContent = party.sub;
    if (input) input.placeholder = `Message ${party.name.split(' ')[0]}…`;
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
  window.renderDriverOnboardAvailability = renderOnboardAvailability;
  window.renderDriverOnboardRate = renderOnboardRate;
  window.renderDriverPending = renderPending;
  window.renderDriverSubscription = renderSubscription;
  window.renderDriverRequestDetail = renderRequestDetail;
  window.renderDriverTripPrep = renderTripPrep;
  window.renderDriverRateParent = renderRateParent;

  injectScreens();
  ensureDriver();
  applyRoleChrome();
})();
