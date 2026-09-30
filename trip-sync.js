/* Shared trip lifecycle for Parent, Driver and WalkShare: legs, live progress, day reset, persistence, sync. */

(function () {
  const STORE = 'h2s_bookings_v1';
  const TODAY_KEY = 'h2s_demo_today';
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  function S() {
    return window.appState || {};
  }

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function isoOf(date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }

  function dateFromIso(iso) {
    const [y, m, d] = String(iso).split('-').map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  }

  function today() {
    try {
      const forced = localStorage.getItem(TODAY_KEY);
      if (forced && /^\d{4}-\d{2}-\d{2}$/.test(forced)) return forced;
    } catch (err) { /* ignore */ }
    return isoOf(new Date());
  }

  function setToday(iso) {
    try {
      if (iso) localStorage.setItem(TODAY_KEY, iso);
      else localStorage.removeItem(TODAY_KEY);
    } catch (err) { /* ignore */ }
    (S().bookings || []).forEach(freshen);
    save();
  }

  function dayLabel(iso) {
    return dateFromIso(iso || today()).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function clock() {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }

  function find(id) {
    return id ? (S().bookings || []).find((b) => b && b.id === id) || null : null;
  }

  function legCode(value) {
    const v = String(value || '');
    return v === 'pm' || v === 'afternoon' || /-pm$/.test(v) ? 'pm' : 'am';
  }

  /** Legs a booking runs each service day: round trip = am + pm, one way = am (to school) or pm (from school). */
  function legsOf(b) {
    if (!b) return [];
    if (b.direction === 'bothway') return b.returnTime ? ['am', 'pm'] : ['am'];
    return b.oneWayLeg === 'pm' ? ['pm'] : ['am'];
  }

  function hasReturn(b) {
    return legsOf(b).length > 1;
  }

  function legTime(b, leg) {
    if (!b) return '';
    if (legCode(leg) === 'pm') return b.direction === 'bothway' ? (b.returnTime || '') : (b.outboundTime || '');
    return b.outboundTime || '';
  }

  /** Clears leg progress left over from a previous day so recurring bookings start fresh. */
  function freshen(b) {
    if (!b || !b.progressDate || b.progressDate === today()) return b;
    delete b.legProgress;
    delete b.schoolDropoffAt;
    delete b.dayCompletedAt;
    delete b.tracking;
    delete b.progressDate;
    b.activeLeg = null;
    if (b.status === 'in_progress') b.status = 'confirmed';
    return b;
  }

  function progress(b) {
    freshen(b);
    return b ? (b.legProgress || null) : null;
  }

  function tracking(b) {
    freshen(b);
    return b && b.tracking && b.tracking.date === today() ? b.tracking : null;
  }

  function isSkipped(b, iso) {
    return !!b && (b.skippedDates || []).includes(iso || today());
  }

  /** Completion ids are stored as `${legId}@YYYY-MM-DD` so each service day starts clean. */
  function doneKey(legId, iso) {
    return `${legId}@${iso || today()}`;
  }

  function doneSet(list) {
    const tail = '@' + today();
    return new Set((list || []).filter((k) => String(k).endsWith(tail)).map((k) => String(k).slice(0, -tail.length)));
  }

  function markDone(list, legId) {
    const tail = '@' + today();
    const kept = (list || []).filter((k) => String(k).endsWith(tail));
    if (legId && !kept.includes(doneKey(legId))) kept.push(doneKey(legId));
    return kept;
  }

  function startLeg(bookingId, leg, stage) {
    const b = find(bookingId);
    if (!b) return null;
    freshen(b);
    const code = legCode(leg);
    if (code === 'am') {
      delete b.legProgress;
      delete b.schoolDropoffAt;
      delete b.dayCompletedAt;
    }
    b.status = 'in_progress';
    b.activeLeg = code;
    b.progressDate = today();
    b.tracking = { leg: code, stage: stage || 1, date: today() };
    save();
    return b;
  }

  function setStage(bookingId, leg, stage) {
    const b = find(bookingId);
    if (!b || b.status !== 'in_progress') return;
    b.tracking = { leg: legCode(leg), stage, date: today() };
    b.progressDate = today();
    save();
  }

  function finishLeg(bookingId, leg) {
    const b = find(bookingId);
    if (!b) return { final: true, booking: null };
    freshen(b);
    const code = legCode(leg);
    const legs = legsOf(b);
    const final = legs[legs.length - 1] === code;
    const at = clock();
    b.activeLeg = null;
    b.progressDate = today();
    b.tracking = { leg: code, stage: 5, date: today() };
    if (!final) {
      b.legProgress = 'at_school';
      b.schoolDropoffAt = at;
      b.status = 'confirmed';
    } else {
      b.legProgress = 'day_complete';
      b.dayCompletedAt = at;
      if (b.frequency === 'recurring') {
        b.status = 'confirmed';
      } else {
        b.status = 'completed';
        b.completedDate = today();
        b.completedAt = `${dayLabel()} • ${at}`;
      }
    }
    save();
    return { final, booking: b };
  }

  /** Provider dropped an active leg (e.g. parent cancelled mid-flow) without completing it. */
  function abandonLeg(bookingId) {
    const b = find(bookingId);
    if (!b) return;
    b.activeLeg = null;
    delete b.tracking;
    if (b.status === 'in_progress') b.status = 'confirmed';
    save();
  }

  function ratingKey(b) {
    return b && b.frequency === 'recurring' && b.status !== 'completed' ? today() : 'final';
  }

  function needsRating(b) {
    if (!b) return false;
    const finished = b.status === 'completed' || progress(b) === 'day_complete';
    if (!finished) return false;
    if (b.status === 'completed' && b.userRating) return false;
    return !(b.ratedKeys || []).includes(ratingKey(b));
  }

  function markRated(bookingId) {
    const b = find(bookingId);
    if (!b) return;
    b.ratedKeys = Array.from(new Set([...(b.ratedKeys || []), ratingKey(b)]));
    save();
  }

  function nextOccurrence(b) {
    const days = b && b.selectedDays && b.selectedDays.length ? b.selectedDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
    const start = dateFromIso(today());
    for (let i = 0; i < 21; i += 1) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const iso = isoOf(d);
      if (!days.includes(WEEKDAYS[d.getDay()])) continue;
      if (i === 0 && progress(b) === 'day_complete') continue;
      if ((b.skippedDates || []).includes(iso)) continue;
      return iso;
    }
    return today();
  }

  function skipOccurrence(bookingId, iso) {
    const b = find(bookingId);
    if (!b) return null;
    const day = iso || nextOccurrence(b);
    b.skippedDates = Array.from(new Set([...(b.skippedDates || []), day]));
    syncToProviders(b);
    return day;
  }

  /** A cancelled booking gives its seats back to the provider once. */
  function releaseSeats(b) {
    if (!b || b.seatsReleased) return;
    const p = (S().providers || []).find((x) => x.id === b.providerId);
    if (p && typeof p.bookedSeats === 'number') {
      p.bookedSeats = Math.max(0, p.bookedSeats - ((b.childIds || []).length || 1));
      p.seats = Math.max(0, (p.totalCapacity || 4) - p.bookedSeats);
    }
    b.seatsReleased = true;
  }

  /** Pushes a parent-side booking change (cancel, skip, edit) to both provider apps. */
  function syncToProviders(b) {
    if (!b) return;
    if (b.status === 'cancelled') releaseSeats(b);
    save();
    ['__h2sDriverBookingSync', '__h2sWalkBookingSync'].forEach((fn) => {
      try {
        if (typeof window[fn] === 'function') window[fn](b);
      } catch (err) {
        console.warn('booking sync', fn, err);
      }
    });
  }

  function providerFirst(b) {
    const p = (S().providers || []).find((x) => x.id === b?.providerId);
    return String(p?.name || 'Your provider').replace(/\s*\(WalkShare\)/i, '').split(' ')[0];
  }

  function shortPlace(value, fallback) {
    const raw = String(value || '').replace(/^Home\s*\((.+)\)\s*$/i, '$1').split(',')[0].trim();
    return raw || fallback || '';
  }

  /** Parent-facing live copy for the current leg and provider stage (1 on the way … 4 arriving, 5 done). */
  function liveCopy(b) {
    const t = tracking(b);
    const leg = t ? t.leg : (b?.activeLeg || legsOf(b)[0] || 'am');
    const stage = t ? t.stage : 1;
    const name = providerFirst(b);
    const home = shortPlace(b?.pickupLocation, 'Home');
    const school = shortPlace(b?.schoolLocation, 'School');
    const from = leg === 'pm' ? school : home;
    const to = leg === 'pm' ? home : school;
    const steps = {
      1: { chip: 'On the way', title: from, sub: `${name} is heading to ${from}`, pct: 18 },
      2: { chip: 'At pickup', title: from, sub: `${name} has arrived at ${from}`, pct: 40 },
      3: { chip: leg === 'pm' ? 'Heading home' : 'Heading to school', title: to, sub: `On the way to ${to}`, pct: 70 },
      4: { chip: 'Arriving', title: to, sub: `Arriving at ${to}`, pct: 90 },
      5: { chip: leg === 'pm' || !hasReturn(b) ? 'Trip complete' : 'Dropped at school', title: to, sub: `Safely handed over at ${to}`, pct: 100 }
    };
    return Object.assign({ leg, stage, eta: legTime(b, leg) }, steps[Math.max(1, Math.min(5, stage))]);
  }

  /** One-line leg status for parent cards; null when nothing special is happening today. */
  function statusLine(b) {
    if (!b) return null;
    freshen(b);
    if (b.status === 'in_progress') {
      const t = tracking(b);
      return t && t.leg === 'pm' && hasReturn(b) ? 'Return trip live' : 'Live now';
    }
    if (b.status !== 'confirmed') return null;
    if (isSkipped(b)) return 'Skipped today';
    const p = progress(b);
    if (p === 'at_school') return `At school · Return ${b.returnTime || ''}`.trim();
    if (p === 'day_complete') return 'Today complete';
    return null;
  }

  function save() {
    try {
      localStorage.setItem(STORE, JSON.stringify(S().bookings || []));
    } catch (err) { /* ignore quota */ }
  }

  function restore() {
    const list = S().bookings;
    if (!Array.isArray(list)) return;
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    } catch (err) {
      saved = null;
    }
    if (Array.isArray(saved)) {
      const extras = [];
      saved.forEach((sb) => {
        if (!sb || !sb.id) return;
        const seed = list.find((b) => b.id === sb.id);
        if (seed) Object.assign(seed, sb);
        else extras.push(sb);
      });
      if (extras.length) list.unshift(...extras);
    }
    list.forEach((b) => {
      if (b.status === 'in_progress' && !b.progressDate) {
        b.activeLeg = b.activeLeg || legsOf(b)[0] || 'am';
        b.progressDate = today();
        b.tracking = { leg: b.activeLeg, stage: 3, date: today() };
      }
      freshen(b);
    });
  }

  window.H2STrip = {
    today,
    setToday,
    dayLabel,
    clock,
    find,
    legCode,
    legsOf,
    hasReturn,
    legTime,
    freshen,
    progress,
    tracking,
    isSkipped,
    doneKey,
    doneSet,
    markDone,
    startLeg,
    setStage,
    finishLeg,
    abandonLeg,
    needsRating,
    markRated,
    nextOccurrence,
    skipOccurrence,
    syncToProviders,
    liveCopy,
    statusLine,
    save,
    restore
  };

  restore();

  const nav = window.navigateTo;
  if (typeof nav === 'function') {
    window.navigateTo = function () {
      const out = nav.apply(this, arguments);
      save();
      return out;
    };
  }
  window.addEventListener('pagehide', save);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') save();
  });
})();
