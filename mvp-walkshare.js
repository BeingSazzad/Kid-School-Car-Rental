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
    'PRNT-2201': { id: 'PRNT-2201', name: 'Nadia Rahman', photo: '/assets/avatar_rehana.jpg', sub: 'Parent · Yusuf & Ayla' }
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
      { id: 'id', title: 'Government ID', status: 'approved', file: demoUpload('sarah-id.pdf'), number: 'ON-4819203' },
      { id: 'criminal', title: 'Criminal Background Check', status: 'approved', file: demoUpload('cbc-sarah.pdf') },
      { id: 'vulnerable', title: 'Vulnerable Sector Check', status: 'approved', file: demoUpload('vsc-sarah.pdf') },
      { id: 'firstaid', title: 'Pediatric First-Aid / CPR', status: 'approved', file: demoUpload('cpr-sarah.pdf'), expires: 'Aug 2027' }
    ];
  }

  function ensureWalk() {
    if (!state().walkshare) {
      state().walkshare = defaultWalkState();
    }
    const w = state().walkshare;
    if (!w.onboarding) w.onboarding = { profile: true, group: true, docs: true, availability: true, rate: true };
    if (!w.group) w.group = { label: 'Walking School Bus Escort', capacity: 3, route: 'Elm → Greenfield sidewalk corridor', safety: ['High-Vis Vests', 'Crossing Guard', 'Pediatric CPR'] };
    if (!Array.isArray(w.documents) || !w.documents.length) w.documents = demoDocuments();
    if (!w.availability) {
      w.availability = {
        weekly: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        windows: [
          { id: 'w1', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '07:15', end: '08:45', enabled: true },
          { id: 'w2', days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], start: '14:30', end: '16:00', enabled: true }
        ],
        exceptions: []
      };
    }
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
      serviceArea: 'Greenfield / Midtown sidewalk corridor',
      rating: 4.9,
      reviewsCount: 45,
      isOnline: true,
      verificationStatus: 'approved',
      onboarding: { profile: true, group: true, docs: true, availability: true, rate: true },
      group: {
        label: 'Walking School Bus Escort',
        capacity: 3,
        route: 'Elm → Greenfield sidewalk corridor',
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
        { id: 'wn-1', title: 'New WalkShare request', body: 'Sadia Khan requested a morning walking escort for Arman and Emma.', time: '18 min ago', unread: true },
        { id: 'wn-2', title: 'Message from parent', body: 'Nadia: Yusuf will wait at the corner with his high-vis vest.', time: 'Yesterday', unread: true }
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
          pickupLocation: 'Home (12 Elm Street)',
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

  function kids(req) {
    return Array.isArray(req?.children) ? req.children.filter(Boolean) : [];
  }

  function childShort(req) {
    return kids(req).map((c) => String(c.name || '').split(' ')[0]).join(' + ') || req?.childNamesShort || 'Children';
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
    if (!list.length) return 'Mon–Fri';
    if (list.length === 5) return 'Mon–Fri';
    return list.join(', ');
  }

  function dateShort(label) {
    return String(label || '').replace(/,?\s*\d{4}\s*$/, '').replace(/^Starts\s+/i, '').trim();
  }

  function tripKindLabel(req) {
    if (req.frequency === 'recurring') return 'Recurring';
    if (req.direction === 'oneway') return 'One way';
    return 'Round trip';
  }

  function timeLineCard(req) {
    if (req.direction === 'oneway' || !req.returnTime) return req.pickupTime || '';
    return `${req.pickupTime || ''} & ${req.returnTime}`;
  }

  function dateLineCard(req) {
    if (req.frequency === 'recurring') return compactDays(req.recurringDays);
    return dateShort(req.dateLabel) || 'Select date';
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
        from: r.pickupLocation,
        to: r.dropoffLocation,
        route: `${r.pickupLocation} → ${r.dropoffLocation}`,
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
          from: r.dropoffLocation,
          to: r.pickupLocation,
          route: `${r.dropoffLocation} → ${r.pickupLocation}`,
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
    if (!hasAccess(w)) return 'wsSubscription';
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
    const btnP = document.getElementById('btnRoleParent');
    const btnD = document.getElementById('btnRoleDriver');
    const btnW = document.getElementById('btnRoleWalkShare');
    [btnP, btnD, btnW].forEach((btn) => {
      if (!btn) return;
      btn.classList.remove('active', 'driver-active', 'walkshare-active');
    });
    if (role === 'driver' && btnD) btnD.classList.add('active', 'driver-active');
    else if (role === 'walkshare' && btnW) btnW.classList.add('active', 'walkshare-active');
    else if (btnP) btnP.classList.add('active');
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
          <h3 class="drv-home-heading">Quick Actions</h3>
          <div class="drv-home-actions">
            <button type="button" class="drv-home-action${incoming.length ? ' has-badge' : ''}" onclick="navigateTo('wsRequests')">
              <span class="drv-home-action-ico"><i data-lucide="inbox"></i></span>
              <span class="drv-home-action-label">Requests</span>
              ${incoming.length ? `<span class="drv-home-action-badge">${incoming.length}</span>` : ''}
            </button>
            <button type="button" class="drv-home-action" onclick="navigateTo('wsSchedule')">
              <span class="drv-home-action-ico"><i data-lucide="calendar"></i></span>
              <span class="drv-home-action-label">Schedule</span>
            </button>
            <button type="button" class="drv-home-action" onclick="openNestedScreen('wsOnboardAvailability')">
              <span class="drv-home-action-ico"><i data-lucide="clock"></i></span>
              <span class="drv-home-action-label">Availability</span>
            </button>
            <button type="button" class="drv-home-action" onclick="navigateTo('inbox')">
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
    const avatars = kidsList.slice(0, 2).map((c, i) => `<img src="${esc(c.photo || '/assets/avatar_arman.jpg')}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" />`).join('')
      || `<img src="/assets/avatar_arman.jpg" alt="" class="avatar-img-circle" />`;
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
          <img src="${esc(parentPhoto)}" alt="" class="drv-active-parent-avatar" />
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
    const kindIcon = req.frequency === 'recurring' ? 'refresh-cw' : 'calendar';
    const kindLabel = req.frequency === 'recurring' ? 'Recurring' : 'One-time';
    const seats = Number(req.seatsNeeded) || kids(req).length || 1;
    const seatsText = seats === 1 ? '1 spot' : `${seats} spots`;
    const actions = req.status === 'new' ? `
      <div class="drv-req-card-actions" onclick="event.stopPropagation()">
        <button type="button" class="drv-req-accept" onclick="acceptWalkShareRequest('${esc(req.id)}')" ${canAccept(ensureWalk()) ? '' : 'disabled'}>
          <span class="drv-req-btn-ico" aria-hidden="true"><i data-lucide="check"></i></span>
          Accept
        </button>
        <button type="button" class="drv-req-decline" onclick="declineWalkShareRequest('${esc(req.id)}')">
          <span class="drv-req-btn-ico" aria-hidden="true"><i data-lucide="x"></i></span>
          Decline
        </button>
      </div>` : '';
    return `<article class="drv-req-card" role="button" tabindex="0" onclick="openWalkShareRequest('${esc(req.id)}')">
      <div class="drv-req-card-head">
        <div class="drv-req-avatar tone-${avatarTone(name)}" aria-hidden="true">${esc(parentInitials(name))}</div>
        <div class="drv-req-head-copy">
          <h3 class="drv-req-parent">${esc(name)}</h3>
          <p class="drv-req-kids">${esc(childShort(req))}</p>
        </div>
        <div class="drv-req-head-end">
          <span class="drv-req-price">${esc(req.rateLabel || '')}</span>
          <i data-lucide="chevron-right" class="drv-req-chevron"></i>
        </div>
      </div>
      <div class="drv-req-route-block">
        <div class="drv-req-route-rail" aria-hidden="true">
          <span class="drv-req-dot start"></span>
          <span class="drv-req-rail-line"></span>
          <span class="drv-req-dot end"><i data-lucide="map-pin"></i></span>
        </div>
        <div class="drv-req-route-copy">
          <p class="drv-req-stop">${esc(req.pickupLocation || 'Meetup')}</p>
          <p class="drv-req-stop is-end">${esc(req.dropoffLocation || 'School')}</p>
        </div>
      </div>
      <div class="drv-req-schedule">
        <div class="drv-req-sched-item">
          <i data-lucide="calendar"></i>
          <span>${esc(dateLineCard(req))}</span>
        </div>
        <div class="drv-req-sched-item">
          <i data-lucide="clock"></i>
          <span>${esc(timeLineCard(req))}</span>
        </div>
      </div>
      <div class="drv-req-chips">
        <span class="drv-req-chip"><i data-lucide="${kindIcon}"></i> ${esc(kindLabel)}</span>
        <span class="drv-req-chip"><i data-lucide="users"></i> ${esc(seatsText)}</span>
        <span class="drv-req-chip"><i data-lucide="footprints"></i> WalkShare</span>
      </div>
      ${actions}
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
    if (countEl) countEl.textContent = tab === 'new' ? 'New walking escort requests from families' : tab === 'accepted' ? 'Walks you have accepted' : 'Declined WalkShare requests';
    const wrap = document.getElementById('wsRequestsListWrap');
    if (!wrap) return;
    if (!list.length) {
      wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="inbox"></i></div><h4>No ${tab} requests</h4><p>Parents book WalkShare from Search when they need a walking escort.</p></div>`;
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
      toast(docsApproved(w) ? 'Platform access required before you can accept.' : 'Documents must be approved before you can accept.');
      return;
    }
    const req = w.requests.find((r) => r.id === id);
    if (!req || req.status !== 'new') return;
    req.status = 'accepted';
    syncParentBookingStatus(req, 'accepted');
    persist();
    toast('WalkShare request accepted');
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
    toast('Request declined. Parent is notified in-app.');
    renderRequests(state()._wsReqTab || 'new');
    if (document.getElementById('screen-wsRequestDetail')?.classList.contains('active')) renderRequestDetail();
  };

  function renderRequestDetail() {
    const w = ensureWalk();
    const req = w.requests.find((r) => r.id === w.selectedRequestId) || w.requests[0];
    const el = feed('wsRequestDetailFeed');
    if (!el || !req) return;
    el.innerHTML = `
      <div class="trip-card">
        <div style="display:flex;gap:12px;align-items:center;margin-bottom:12px;">
          <img src="${esc(req.parentPhoto || '/assets/avatar_sadia.jpg')}" alt="" class="provider-large-avatar" style="width:56px;height:56px;" />
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
            <p class="drv-req-stop">${esc(req.pickupLocation)}</p>
            <p class="drv-req-stop is-end">${esc(req.dropoffLocation)}</p>
          </div>
        </div>
        <p class="card-desc-muted">${esc(dateLineCard(req))} · ${esc(timeLineCard(req))}</p>
        <p class="card-desc-muted" style="margin-top:8px;">${esc(req.notes || '')}</p>
      </div>
      ${req.status === 'new' ? `<div class="drv-actions-col">
        <button type="button" class="btn-primary" onclick="acceptWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')" ${canAccept(w) ? '' : 'disabled'}>Accept WalkShare</button>
        <button type="button" class="btn-secondary-link" onclick="declineWalkShareRequest('${esc(req.id)}');navigateTo('wsRequests')">Decline</button>
      </div>` : `<button type="button" class="btn-primary" onclick="openChatWith('${esc(req.parentId)}')">Message parent</button>`}
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
      wrap.innerHTML = `<div class="drv-home-empty-card"><div class="drv-home-empty-ico"><i data-lucide="calendar"></i></div><h4>Nothing scheduled</h4><p>Accepted morning and return walks appear here.</p></div>`;
      icons();
      return;
    }
    const section = (title, items) => {
      if (!items.length) return '';
      const dateLabel = dateShort(items[0].when || items[0].dateLabel) || 'Tue, Sep 9';
      return `<div class="drv-sched-section">
        <div class="drv-sched-section-head">
          <h3 class="drv-sched-section-title">${esc(title)}</h3>
          <span>${esc(dateLabel)}</span>
        </div>
        ${items.map((item) => schedCard(item)).join('')}
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
    const list = item.children || [];
    if (!list.length) return '';
    const dots = list.slice(0, 3).map((c) => {
      const letter = String(c.name || '?')[0].toUpperCase();
      const tone = avatarTone(c.name);
      return `<span class="drv-sched-avatar tone-${tone}">${esc(letter)}</span>`;
    }).join('');
    const names = list.map((c) => String(c.name || '').split(' ')[0]).join(' · ');
    return `<div class="drv-sched-passengers">${dots}<span class="drv-sched-pass-names">${esc(names)}</span></div>`;
  }

  function schedCard(item) {
    const d = dateParts(item.when);
    const cta = item.isActionableNow
      ? `<button type="button" class="btn-primary" onclick="startWalkShareWalk('${esc(item.id)}')"><i data-lucide="footprints" style="width:16px;height:16px;"></i> Open walk</button>`
      : item.leg === 'morning'
        ? `<button type="button" class="btn-secondary-surface" onclick="startWalkShareWalk('${esc(item.id)}')"><i data-lucide="navigation" style="width:16px;height:16px;"></i> I'm on the way</button>`
        : '';
    return `<article class="drv-sched-card">
      <button type="button" class="drv-sched-card-main" onclick="startWalkShareWalk('${esc(item.id)}')">
        <div class="drv-sched-date">
          <span class="drv-home-trip-month">${esc(d.month)}</span>
          <span class="drv-home-trip-day">${esc(d.day)}</span>
          <span class="drv-home-trip-wd">${esc(d.weekday || '')}</span>
        </div>
        <div class="drv-sched-body">
          <div class="drv-sched-top">
            <span class="drv-sched-time">${esc(item.time)}</span>
            <span class="drv-sched-badge ${item.leg === 'afternoon' ? 'return' : ''}">${esc(item.badge)}</span>
          </div>
          <div class="drv-req-route-block">
            <div class="drv-req-route-rail" aria-hidden="true">
              <span class="drv-req-dot start"></span>
              <span class="drv-req-rail-line"></span>
              <span class="drv-req-dot end"><i data-lucide="map-pin"></i></span>
            </div>
            <div class="drv-req-route-copy">
              <p class="drv-req-stop">${esc(item.from)}</p>
              <p class="drv-req-stop is-end">${esc(item.to)}</p>
            </div>
          </div>
          ${passengerAvatars(item)}
        </div>
        <i data-lucide="chevron-right" class="drv-home-trip-chevron"></i>
      </button>
      ${cta ? `<div class="drv-sched-cta">${cta}</div>` : ''}
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
    { key: 0, chip: 'Confirmed', cta: "I'm on the way", pin: 12 },
    { key: 1, chip: 'On the way', cta: 'Arrived at meetup', pin: 28 },
    { key: 2, chip: 'At meetup', cta: 'Confirm children with me', pin: 42 },
    { key: 3, chip: 'Walking', cta: 'Arrived at school gate', pin: 68 },
    { key: 4, chip: 'At school gate', cta: 'Confirm handoff', pin: 86 },
    { key: 5, chip: 'Handoff', cta: 'Complete walk', pin: 96 }
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
    const path = document.getElementById('wsCockpitPath');
    if (chip) chip.textContent = stage.chip;
    if (title) title.textContent = atDest ? (item.to || 'School gate') : (item.from || 'Meetup');
    if (desc) desc.textContent = `${item.childNames || 'Children'} · sidewalk escort`;
    if (eta) eta.textContent = item.time || '';
    if (btn) btn.textContent = stage.cta;
    if (note) {
      note.textContent = atDest
        ? 'Stay on verified sidewalks. Hand children only to authorized school staff.'
        : 'High-vis vest on. Parent sees live WalkShare status.';
    }
    if (pin) pin.style.left = `${stage.pin}%`;
    if (path) path.style.setProperty('--ws-progress', `${Math.max(18, stage.pin)}%`);
    const msg = document.getElementById('wsWalkMessageBtn');
    if (msg) msg.setAttribute('onclick', `openChatWith('${item.parentId || 'PRNT-9042'}')`);
    // Fallback feed if HTML cockpit missing
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
        <p class="drv-lede">Walking escorts — no vehicle. Complete each step to accept family requests.</p>
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

  function renderProfile() {
    const w = ensureWalk();
    const el = document.getElementById('wsProfileFeed');
    if (!el) return;
    const badge = isApproved(w) ? 'Verified WalkShare' : onboardingDone(w) ? 'Pending review' : 'Setup incomplete';
    const chevron = '<i data-lucide="chevron-right" style="width: 16px; height: 16px; color: #94A3B8;"></i>';
    el.innerHTML = `
      <div class="profile-user-card" role="button" tabindex="0" onclick="openNestedScreen('wsOnboardProfile', event)">
        <div style="position: relative; width: 64px; height: 64px; flex-shrink: 0;">
          <img src="${esc(w.photo || '/assets/avatar_sarah.jpg')}" alt="${esc(w.name)}" class="profile-avatar-lg" />
          <span style="position: absolute; bottom: 0; right: 0; background: var(--color-secondary, #F2600C); color: #fff; border-radius: 50%; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center; font-size: 11px; border: 2px solid #09122C;">
            <i data-lucide="edit-2" style="width:11px;height:11px;"></i>
          </span>
        </div>
        <div style="flex: 1; min-width: 0;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <h3 style="font-size: 18px; font-weight: 800; color: #FFFFFF; margin: 0;">${esc(w.name)}</h3>
            <i data-lucide="chevron-right" style="width: 16px; height: 16px; color: rgba(255, 255, 255, 0.7);"></i>
          </div>
          <p style="font-size: 13px; color: rgba(255, 255, 255, 0.78); margin: 3px 0 0 0;">${esc(w.phone)}</p>
          <div style="display: flex; gap: 6px; margin-top: 8px; flex-wrap: wrap;">
            <span class="profile-child-count-pill"><i data-lucide="shield-check" style="width: 11px; height: 11px;"></i> ${esc(badge)}</span>
            <span class="profile-child-count-pill" style="background: rgba(255, 255, 255, 0.22);"><i data-lucide="footprints" style="width: 11px; height: 11px;"></i> ${esc(w.group.capacity)} kids</span>
          </div>
        </div>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsOnboardGroup', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="users"></i></div><span class="menu-title-text">${esc(w.group.label)}</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsOnboardDocs', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="file-check"></i></div><span class="menu-title-text">Verification documents</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsOnboardAvailability', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="clock"></i></div><span class="menu-title-text">Availability</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsOnboardRate', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="banknote"></i></div><span class="menu-title-text">Posted rate</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsPayment', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="wallet"></i></div><span class="menu-title-text">Payment preference</span></div>${chevron}
        </button>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('wsSubscription', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="sparkles"></i></div><span class="menu-title-text">WalkShare subscription</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('faq', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="help-circle"></i></div><span class="menu-title-text">FAQ</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('contactSupport', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="headset"></i></div><span class="menu-title-text">Contact Support</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('privacy', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="shield"></i></div><span class="menu-title-text">Privacy Policy</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('legal', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="file-text"></i></div><span class="menu-title-text">Terms of Service</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="openNestedScreen('about', event)">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="info"></i></div><span class="menu-title-text">About Home2School</span></div>${chevron}
        </button>
      </div>

      <div class="profile-menu-section">
        <button type="button" class="profile-menu-item" onclick="window.switchRole('parent')">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="users"></i></div><span class="menu-title-text">Switch to Parent</span></div>${chevron}
        </button>
        <button type="button" class="profile-menu-item" onclick="window.switchRole('driver')">
          <div class="menu-item-left"><div class="menu-icon-wrap"><i data-lucide="car"></i></div><span class="menu-title-text">Switch to Driver</span></div>${chevron}
        </button>
      </div>

      <button type="button" onclick="navigateTo('authWelcome')" style="width:100%;padding:13px 16px;font-size:14px;font-weight:700;border-radius:12px;border:1.5px solid #FEE2E2;background:#FFF5F5;color:#DC2626;display:flex;align-items:center;justify-content:center;gap:8px;cursor:pointer;">
        <i data-lucide="log-out" style="width:15px;height:15px;"></i>
        Log Out
      </button>
    `;
    icons();
  }

  function renderOnboardProfile() {
    const w = ensureWalk();
    const el = feed('wsOnboardProfileFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="form-group"><label class="form-label">Full name</label><input class="form-input" id="wsProfileName" value="${esc(w.name)}" /></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="wsProfilePhone" value="${esc(w.phone)}" /></div>
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="wsProfileEmail" value="${esc(w.email)}" /></div>
      <div class="form-group"><label class="form-label">Service area</label><input class="form-input" id="wsProfileArea" value="${esc(w.serviceArea)}" /></div>
      <button type="button" class="btn-primary" onclick="saveWalkShareProfile()">Save profile</button>
    `;
    icons();
  }

  window.saveWalkShareProfile = function () {
    const w = ensureWalk();
    w.name = document.getElementById('wsProfileName')?.value || w.name;
    w.phone = document.getElementById('wsProfilePhone')?.value || w.phone;
    w.email = document.getElementById('wsProfileEmail')?.value || w.email;
    w.serviceArea = document.getElementById('wsProfileArea')?.value || w.serviceArea;
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
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:4px;">Walking group</h3>
        <p class="drv-lede">No vehicle. Set capacity and the sidewalk corridor parents already see on your WalkShare card.</p>
      </div>
      <div class="form-group"><label class="form-label">Group label</label><input class="form-input" id="wsGroupLabel" value="${esc(w.group.label)}" /></div>
      <div class="form-group"><label class="form-label">Max children</label><input class="form-input" id="wsGroupCap" type="number" min="1" max="8" value="${esc(w.group.capacity)}" /></div>
      <div class="form-group"><label class="form-label">Route corridor</label><input class="form-input" id="wsGroupRoute" value="${esc(w.group.route)}" /></div>
      <div class="drv-req-chips" style="margin-bottom:16px;">
        ${(w.group.safety || []).map((s) => `<span class="provider-safety-chip walkshare"><i data-lucide="check"></i> ${esc(s)}</span>`).join('')}
      </div>
      <button type="button" class="btn-primary" onclick="saveWalkShareGroup()">Save walking group</button>
    `;
    icons();
  }

  window.saveWalkShareGroup = function () {
    const w = ensureWalk();
    w.group.label = document.getElementById('wsGroupLabel')?.value || w.group.label;
    w.group.capacity = Number(document.getElementById('wsGroupCap')?.value || w.group.capacity);
    w.group.route = document.getElementById('wsGroupRoute')?.value || w.group.route;
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
      <p class="drv-lede" style="margin-bottom:12px;">Same trust bar parents see on WalkShare profiles — ID, background, vulnerable sector, first-aid.</p>
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
        ${doc.expires ? `<p class="card-desc-muted">Expires: ${esc(doc.expires)}</p>` : ''}
        <p class="card-desc-muted" style="margin-top:8px;">File: ${esc(doc.file?.name || 'Attached')}</p>
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
    const a = w.availability;
    const el = feed('wsOnboardAvailabilityFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="trip-card">
        <h3 class="section-heading" style="margin-bottom:4px;">Weekly walking hours</h3>
        <p class="drv-lede">Morning and after-school windows parents match against.</p>
      </div>
      ${(a.windows || []).map((win, idx) => `
        <div class="trip-card">
          <div class="form-group"><label class="form-label">From</label><input class="form-input" id="wsAvailStart${idx}" value="${esc(win.start)}" /></div>
          <div class="form-group"><label class="form-label">To</label><input class="form-input" id="wsAvailEnd${idx}" value="${esc(win.end)}" /></div>
        </div>
      `).join('')}
      <p class="card-desc-muted" style="margin-bottom:12px;">Days: Mon–Fri</p>
      <button type="button" class="btn-primary" onclick="saveWalkShareAvailability()">Save availability</button>
    `;
    icons();
  }

  window.saveWalkShareAvailability = function () {
    const w = ensureWalk();
    (w.availability.windows || []).forEach((win, idx) => {
      win.start = document.getElementById('wsAvailStart' + idx)?.value || win.start;
      win.end = document.getElementById('wsAvailEnd' + idx)?.value || win.end;
    });
    w.onboarding.availability = true;
    persist();
    toast('Availability saved');
    window.navigateTo(onboardingDone(w) ? 'wsProfile' : 'wsOnboardRate');
  };

  function renderOnboardRate() {
    const w = ensureWalk();
    const el = feed('wsOnboardRateFeed');
    if (!el) return;
    el.innerHTML = `
      <div class="form-group"><label class="form-label">Posted weekly rate (CAD)</label><input class="form-input" id="wsRateAmount" type="number" value="${esc(w.rate.amount)}" /></div>
      <label class="mvp-check-row" style="display:flex;gap:8px;align-items:center;margin-bottom:16px;">
        <input type="checkbox" id="wsRateNeg" ${w.rate.negotiable ? 'checked' : ''} />
        <span>Negotiable with parent</span>
      </label>
      <button type="button" class="btn-primary" onclick="saveWalkShareRate()">Save posted rate</button>
    `;
  }

  window.saveWalkShareRate = function () {
    const w = ensureWalk();
    w.rate.amount = Number(document.getElementById('wsRateAmount')?.value || w.rate.amount);
    w.rate.negotiable = !!document.getElementById('wsRateNeg')?.checked;
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
        <p class="drv-lede">${w.subscription.status === 'trial' ? `${w.subscription.trialDaysLeft} days left on trial` : 'Choose a plan to keep accepting escorts.'}</p>
        <p class="card-desc-muted">$${w.subscription.priceMonthly}/mo · $${w.subscription.priceAnnual}/yr</p>
      </div>
      <button type="button" class="btn-primary" onclick="activateWalkShareTrial()">Continue with trial</button>
    `;
  }

  window.activateWalkShareTrial = function () {
    const w = ensureWalk();
    w.subscription.status = 'trial';
    persist();
    toast('Trial active');
    window.navigateTo('wsHome');
  };

  function renderInbox() {
    if (state().activeRole !== 'walkshare') return;
    const wrap = document.getElementById('inboxThreadList');
    if (!wrap) return;
    const map = {};
    ensureWalk().requests.forEach((r) => {
      if (!r.parentId) return;
      map[r.parentId] = {
        id: r.parentId,
        name: r.parentName,
        photo: r.parentPhoto || '/assets/avatar_sadia.jpg',
        preview: r.notes || `${childShort(r)} walking escort`,
        time: r.pickupTime || ''
      };
    });
    Object.values(PARENTS).forEach((p) => {
      if (!map[p.id]) map[p.id] = { id: p.id, name: p.name, photo: p.photo, preview: p.sub, time: '' };
    });
    wrap.innerHTML = Object.values(map).map((t) => `
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

  const prevChat = window.openChatWith;
  window.openChatWith = function (partyId) {
    window.activeChatProviderId = partyId;
    if (state().activeRole === 'walkshare') {
      window.navigateTo('messages');
      return;
    }
    if (typeof prevChat === 'function') prevChat(partyId);
  };

  function renderChatHeader() {
    if (state().activeRole !== 'walkshare') return;
    const id = window.activeChatProviderId || 'PRNT-9042';
    const p = PARENTS[id] || { name: 'Parent', photo: '/assets/avatar_sadia.jpg', sub: 'Parent' };
    const nameEl = document.getElementById('chatDriverName');
    if (nameEl) {
      nameEl.innerHTML = `${esc(p.name)} <i data-lucide="chevron-right" style="width:14px;height:14px;"></i>`;
    }
    const avatar = document.querySelector('#screen-messages .chat-header-avatar, #chatHeaderAvatar');
    if (avatar && avatar.tagName === 'IMG') avatar.src = p.photo;
    icons();
  }

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