/* Parent MVP missing-flow layer. Reuses the existing design system and prototype state. */

(function () {
  const GRADE_OPTIONS = ['Pre-K', 'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'];

  function state() {
    return window.appState || {};
  }

  function toast(message) {
    if (window.showToast) window.showToast(message, 'info');
    else alert(message);
  }

  function bookingChildIds() {
    const draft = state().bookingDraft || {};
    if (Array.isArray(draft.childIds)) return draft.childIds;
    return [];
  }

  function setBookingChildIds(ids) {
    ensureDraftDefaults();
    const next = Array.isArray(ids) ? ids.slice() : [];
    state().bookingDraft.childIds = next;
    state().selectedChildIds = next.slice();
  }

  function selectedChildren() {
    return bookingChildIds().map((id) => (state().children || []).find((c) => c.id === id)).filter(Boolean);
  }

  function childSchoolKey(child) {
    return String(child?.school || '').toLowerCase().trim();
  }

  function formatChildrenSummary(children) {
    if (!children.length) return 'Select children';
    const firstNames = children.map((c) => c.name.split(' ')[0]);
    if (children.length === 1) return firstNames[0];
    return `${firstNames.join(' + ')} · ${children.length} children`;
  }

  function ensureDraftDefaults() {
    const draft = state().bookingDraft || (state().bookingDraft = {});
    if (draft.direction !== 'oneway' && draft.direction !== 'bothway') draft.direction = 'bothway';
    if (!draft.serviceType || draft.serviceType === 'all') draft.serviceType = 'drivers';
    if (!draft.frequency) draft.frequency = 'onetime';
    if (!Array.isArray(draft.childIds)) draft.childIds = [];
    if (!draft.recurrenceEnds) draft.recurrenceEnds = 'until_cancelled';
    if (typeof draft.untilCancelled !== 'boolean') {
      draft.untilCancelled = draft.recurrenceEnds !== 'date';
    }
    if (draft.untilDate == null) draft.untilDate = draft.recurrenceEndDate || '';
    if (!state().parentSubscription) {
      state().parentSubscription = {
        status: 'trial',
        plan: 'monthly',
        trialDaysLeft: 14,
        priceMonthly: 9.99,
        priceAnnual: 79,
        renewal: 'Sep 22, 2026',
        history: [{ id: 'sub-1', label: '14-day free trial started', date: 'Sep 8, 2026', amount: '$0.00' }]
      };
    }
    if (!state().paymentHandle) {
      state().paymentHandle = { status: 'idle', handle: 'sadia.khan@interac', requestedBy: null };
    }
  }

  window.closeBookingSheet = function (id) {
    document.getElementById(id)?.classList.remove('visible');
    document.getElementById('bookingChildrenTrigger')?.classList.remove('open');
  };

  window.toggleChildrenDropdown = function () {
    const sheet = document.getElementById('bookingChildrenSheet');
    if (!sheet) return;
    const open = !sheet.classList.contains('visible');
    if (open) {
      sheet.classList.add('visible');
      document.getElementById('bookingChildrenTrigger')?.classList.add('open');
      renderChildrenDropdown();
    } else {
      window.closeBookingSheet('bookingChildrenSheet');
    }
  };

  window.toggleChildFromDropdown = function (childId) {
    const children = state().children || [];
    const target = children.find((c) => c.id === childId);
    if (!target) return;
    const list = bookingChildIds().slice();
    const already = list.includes(childId);

    if (already) {
      setBookingChildIds(list.filter((id) => id !== childId));
    } else {
      const current = selectedChildren();
      const currentSchool = current.length ? childSchoolKey(current[0]) : childSchoolKey(target);
      if (current.length && childSchoolKey(target) !== currentSchool) {
        ['bookingChildrenHint', 'bookingChildrenSheetHint'].forEach((id) => {
          const hint = document.getElementById(id);
          if (hint) hint.style.display = 'block';
        });
        toast('Different schools need a separate booking');
        return;
      }
      list.push(childId);
      setBookingChildIds(list);
    }

    const school = selectedChildren()[0]?.school;
    const dropInput = document.getElementById('setupSchoolLocationInput');
    const dropHidden = document.getElementById('setupSchoolLocation');
    if (school) {
      const wasEmptyOrAuto = !dropInput?.value.trim() || dropInput?.dataset.autoSchool === '1';
      if (wasEmptyOrAuto && dropInput) {
        dropInput.value = school;
        dropInput.dataset.autoSchool = '1';
        if (dropHidden) dropHidden.value = school;
        state().bookingDraft.schoolLocation = school;
      }
    } else if (dropInput?.dataset.autoSchool === '1') {
      dropInput.value = '';
      delete dropInput.dataset.autoSchool;
      if (dropHidden) dropHidden.value = '';
      state().bookingDraft.schoolLocation = '';
    }

    renderChildrenDropdown();
    window.updateBookingSearchCta();
  };

  function formatChildrenTitle(children) {
    if (!children.length) return 'Select children';
    return children.map((c) => c.name.split(' ')[0]).join(' + ');
  }

  function formatChildrenSub(children) {
    if (!children.length) return '';
    const school = children[0].school;
    if (children.length === 1) return `${children[0].grade || 'Grade'} • ${school}`;
    return `${children.length} children • ${school}`;
  }

  function renderChildrenAvatars(children) {
    const wrap = document.getElementById('bookingChildrenAvatars');
    if (!wrap) return;
    wrap.innerHTML = children.map((c, i) => {
      const src = c.photo || '/assets/avatar_arman.jpg';
      return `<img src="${src}" alt="" class="avatar-img-circle${i ? ' overlap' : ''}" onerror="this.src='/assets/avatar_arman.jpg';" />`;
    }).join('');
    wrap.hidden = children.length === 0;
  }

  function renderChildrenDropdown() {
    const panel = document.getElementById('bookingChildrenPanel');
    const summary = document.getElementById('bookingChildrenSummary');
    const hint = document.getElementById('bookingChildrenHint');
    const sheetHint = document.getElementById('bookingChildrenSheetHint');
    const done = document.getElementById('btnChildrenSheetDone');
    const trigger = document.getElementById('bookingChildrenTrigger');
    const children = state().children || [];
    const selected = selectedChildren();
    if (summary) {
      summary.textContent = formatChildrenTitle(selected);
      summary.classList.toggle('is-placeholder', selected.length === 0);
    }
    trigger?.classList.toggle('is-empty', selected.length === 0);
    renderChildrenAvatars(selected);
    if (hint) hint.style.display = 'none';
    if (sheetHint) sheetHint.style.display = 'none';
    if (done) done.textContent = selected.length ? `Done (${selected.length} selected)` : 'Done';
    if (!panel) return;

    panel.innerHTML = children.map((c) => {
      const on = bookingChildIds().includes(c.id);
      const photo = c.photo || '/assets/avatar_arman.jpg';
      return `
        <button type="button" class="book-ride-child-row${on ? ' selected' : ''}" aria-pressed="${on ? 'true' : 'false'}" onclick="toggleChildFromDropdown('${c.id}')">
          <span class="mvp-child-check" aria-hidden="true"></span>
          <img src="${photo}" alt="" class="book-ride-child-photo" onerror="this.src='/assets/avatar_arman.jpg';" />
          <div class="book-ride-child-copy">
            <div class="mvp-child-option-name">${c.name}</div>
            <div class="mvp-child-option-meta">${c.grade || 'Grade'} • ${c.school}</div>
          </div>
        </button>
      `;
    }).join('');
    if (window.lucide) window.lucide.createIcons();
  }

  window.clearBookingLocation = function (type) {
    const inputId = type === 'pickup' ? 'setupPickupLocationInput' : 'setupSchoolLocationInput';
    const input = document.getElementById(inputId);
    if (input) input.value = '';
    if (window.syncLocationInput) window.syncLocationInput(type === 'pickup' ? 'pickup' : 'school', '');
    window.updateBookingSearchCta();
  };

  function formatIsoDateLabel(iso) {
    if (!iso) return '';
    const parts = String(iso).split('-');
    if (parts.length !== 3) return iso;
    const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  }

  function formatTimeLabel(hhmm) {
    if (!hhmm) return '';
    const [hRaw, mRaw] = hhmm.split(':');
    let h = parseInt(hRaw, 10);
    const m = (mRaw || '00').slice(0, 2);
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  function setFieldPlaceholder(el, filled, filledText, placeholder) {
    if (!el) return;
    el.textContent = filled ? filledText : placeholder;
    el.classList.toggle('is-placeholder', !filled);
  }

  window.syncBookingDateDisplay = function () {
    const iso = document.getElementById('setupStartDate')?.value || '';
    const label = formatIsoDateLabel(iso);
    const text = document.getElementById('setupOutboundDateText');
    const retText = document.getElementById('setupReturnDateText');
    setFieldPlaceholder(text, !!iso, label, 'Select date');
    if (retText) retText.value = label;
    ensureDraftDefaults();
    state().bookingDraft.tripDate = label;
    state().bookingDraft.startDate = iso;
  };

  window.syncBookingTimeDisplays = function () {
    const out = document.getElementById('setupOutboundTime')?.value || '';
    const ret = document.getElementById('setupReturnTime')?.value || '';
    setFieldPlaceholder(document.getElementById('setupOutboundTimeText'), !!out, formatTimeLabel(out), 'Select pickup');
    setFieldPlaceholder(document.getElementById('setupReturnTimeText'), !!ret, formatTimeLabel(ret), 'Select return');
    if (window.updateTripTime) {
      if (out) window.updateTripTime('outbound', out);
      if (ret) window.updateTripTime('return', ret);
    }
  };

  window.syncUntilCancelledUi = function () {
    ensureDraftDefaults();
    const draft = state().bookingDraft;
    const cancelled = !!draft.untilCancelled;
    const iso = cancelled ? '' : (draft.untilDate || draft.recurrenceEndDate || '');
    const cb = document.getElementById('toggleUntilCancelled');
    if (cb) cb.checked = cancelled;
    const trigger = document.getElementById('bookingEndDateTrigger');
    trigger?.classList.toggle('is-inactive', cancelled);
    if (trigger) trigger.setAttribute('aria-disabled', cancelled ? 'true' : 'false');
    setFieldPlaceholder(document.getElementById('bookingEndDateValue'), !!iso, formatIsoDateLabel(iso), 'End date');
    const input = document.getElementById('repeatEndDateInput');
    if (input) input.value = iso;
  };

  window.syncBookingEndsLabel = window.syncUntilCancelledUi;

  window.clearRecurrenceEndDate = function () {
    window.setRecurrenceEnds('until_cancelled');
  };

  window.handleUntilCancelledChange = function (checked) {
    if (checked) window.setRecurrenceEnds('until_cancelled');
    else {
      ensureDraftDefaults();
      const draft = state().bookingDraft;
      draft.untilCancelled = false;
      draft.recurrenceEnds = 'date';
      window.syncUntilCancelledUi();
    }
    window.updateBookingSearchCta();
  };

  window.openRecurrenceEndDatePicker = function () {
    window.openBookingEndDateSheet();
  };

  let bookingCalCursor = { year: 2026, month: 8 };
  let bookingCalPending = '2026-09-08';
  let bookingCalTarget = 'start';

  function renderBookingCalendar() {
    const grid = document.getElementById('bookingCalGrid');
    const label = document.getElementById('bookingCalMonthLabel');
    if (!grid) return;
    const { year, month } = bookingCalCursor;
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
      const selected = iso === bookingCalPending ? ' selected' : '';
      cells.push(`<button type="button" class="book-ride-cal-day${selected}" onclick="selectBookingCalendarDay('${iso}')">${d}</button>`);
    }
    let next = 1;
    while (cells.length % 7 !== 0) {
      cells.push(`<button type="button" class="book-ride-cal-day muted">${next}</button>`);
      next += 1;
    }
    grid.innerHTML = cells.join('');
  }

  window.shiftBookingCalendar = function (delta) {
    bookingCalCursor.month += delta;
    if (bookingCalCursor.month < 0) {
      bookingCalCursor.month = 11;
      bookingCalCursor.year -= 1;
    } else if (bookingCalCursor.month > 11) {
      bookingCalCursor.month = 0;
      bookingCalCursor.year += 1;
    }
    renderBookingCalendar();
    if (window.lucide) window.lucide.createIcons();
  };

  window.selectBookingCalendarDay = function (iso) {
    bookingCalPending = iso;
    renderBookingCalendar();
  };

  function openCalendarSheet(target, isoHint) {
    bookingCalTarget = target === 'end' ? 'end' : 'start';
    const title = document.getElementById('bookingDateSheetTitle');
    if (title) title.textContent = bookingCalTarget === 'end' ? 'End date' : 'Select Date';
    const iso = isoHint || (bookingCalTarget === 'end'
      ? (state().bookingDraft?.untilDate || state().bookingDraft?.recurrenceEndDate || '')
      : '') || document.getElementById('setupStartDate')?.value || '2026-09-08';
    bookingCalPending = iso;
    const parts = iso.split('-').map(Number);
    bookingCalCursor = { year: parts[0], month: (parts[1] || 9) - 1 };
    renderBookingCalendar();
    document.getElementById('bookingDateSheet')?.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  }

  window.openBookingDateSheet = function () {
    openCalendarSheet('start', document.getElementById('setupStartDate')?.value);
  };

  window.openBookingEndDateSheet = function () {
    openCalendarSheet('end');
  };

  window.confirmBookingDateSheet = function () {
    if (bookingCalTarget === 'end') {
      window.setRecurrenceEndDate(bookingCalPending);
      window.updateBookingSearchCta();
      window.closeBookingSheet('bookingDateSheet');
      if (window.lucide) window.lucide.createIcons();
      return;
    }
    const start = document.getElementById('setupStartDate');
    const ret = document.getElementById('setupReturnDate');
    if (start) start.value = bookingCalPending;
    if (ret) ret.value = bookingCalPending;
    if (window.handleScheduleDateChange) window.handleScheduleDateChange('outbound', bookingCalPending);
    window.syncBookingDateDisplay();
    window.updateBookingSearchCta();
    window.closeBookingSheet('bookingDateSheet');
  };

  let bookingTimeTarget = 'outbound';
  const TIME_HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const TIME_MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));
  const TIME_PERIODS = ['AM', 'PM'];

  function parseTimeParts(hhmm) {
    const [hRaw, mRaw] = (hhmm || '07:30').split(':');
    let h = parseInt(hRaw, 10);
    const period = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    let minute = parseInt(mRaw, 10) || 0;
    minute = Math.round(minute / 5) * 5;
    if (minute === 60) minute = 55;
    return { hour: String(h).padStart(2, '0'), minute: String(minute).padStart(2, '0'), period };
  }

  function scrollTimeOptIntoCenter(col, el) {
    if (!col || !el) return;
    col.scrollTop = el.offsetTop - (col.clientHeight / 2) + (el.clientHeight / 2);
  }

  function fillTimeCol(id, values, selected) {
    const col = document.getElementById(id);
    if (!col) return;
    const opts = values.map((val) => `<button type="button" class="book-ride-time-opt${val === selected ? ' selected' : ''}" data-val="${val}" onclick="selectBookingTimePart(this)">${val}</button>`).join('');
    col.innerHTML = `<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>${opts}<div class="book-ride-time-opt" style="pointer-events:none;visibility:hidden;">00</div>`;
    const active = col.querySelector('.book-ride-time-opt.selected');
    scrollTimeOptIntoCenter(col, active);
  }

  window.selectBookingTimePart = function (btn) {
    const col = btn.parentElement;
    col.querySelectorAll('.book-ride-time-opt').forEach((el) => el.classList.remove('selected'));
    btn.classList.add('selected');
    scrollTimeOptIntoCenter(col, btn);
  };

  window.openBookingTimeSheet = function (target) {
    bookingTimeTarget = target === 'return' ? 'return' : 'outbound';
    const input = document.getElementById(bookingTimeTarget === 'return' ? 'setupReturnTime' : 'setupOutboundTime');
    const parts = parseTimeParts(input?.value || (bookingTimeTarget === 'return' ? '13:00' : '07:30'));
    const title = document.getElementById('bookingTimeSheetTitle');
    if (title) title.textContent = bookingTimeTarget === 'return' ? 'Return' : 'Pickup';
    fillTimeCol('bookingTimeHourCol', TIME_HOURS, parts.hour);
    fillTimeCol('bookingTimeMinuteCol', TIME_MINUTES, parts.minute);
    fillTimeCol('bookingTimePeriodCol', TIME_PERIODS, parts.period);
    document.getElementById('bookingTimeSheet')?.classList.add('visible');
    requestAnimationFrame(() => {
      ['bookingTimeHourCol', 'bookingTimeMinuteCol', 'bookingTimePeriodCol'].forEach((id) => {
        const col = document.getElementById(id);
        scrollTimeOptIntoCenter(col, col?.querySelector('.book-ride-time-opt.selected'));
      });
    });
    if (window.lucide) window.lucide.createIcons();
  };

  window.confirmBookingTimeSheet = function () {
    const hour = document.querySelector('#bookingTimeHourCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '07';
    const minute = document.querySelector('#bookingTimeMinuteCol .book-ride-time-opt.selected')?.getAttribute('data-val') || '30';
    const period = document.querySelector('#bookingTimePeriodCol .book-ride-time-opt.selected')?.getAttribute('data-val') || 'AM';
    let h = parseInt(hour, 10);
    if (period === 'AM') h = h === 12 ? 0 : h;
    else h = h === 12 ? 12 : h + 12;
    const value = `${String(h).padStart(2, '0')}:${minute}`;
    const input = document.getElementById(bookingTimeTarget === 'return' ? 'setupReturnTime' : 'setupOutboundTime');
    if (input) input.value = value;
    window.syncBookingTimeDisplays();
    window.updateBookingSearchCta();
    window.closeBookingSheet('bookingTimeSheet');
  };

  window.setRecurrenceEnds = function (mode) {
    ensureDraftDefaults();
    const untilCancelled = mode !== 'date';
    const draft = state().bookingDraft;
    draft.recurrenceEnds = untilCancelled ? 'until_cancelled' : 'date';
    draft.untilCancelled = untilCancelled;
    if (untilCancelled) {
      draft.recurrenceEndDate = '';
      draft.untilDate = '';
      const endInput = document.getElementById('repeatEndDateInput');
      if (endInput) endInput.value = '';
    }
    window.syncUntilCancelledUi();
  };

  window.setRecurrenceEndDate = function (value) {
    ensureDraftDefaults();
    const draft = state().bookingDraft;
    draft.recurrenceEndDate = value || '';
    draft.untilDate = value || '';
    if (value) {
      draft.recurrenceEnds = 'date';
      draft.untilCancelled = false;
    } else {
      draft.recurrenceEnds = 'until_cancelled';
      draft.untilCancelled = true;
    }
    window.syncUntilCancelledUi();
    window.updateBookingSearchCta();
  };

  function defaultWeekdays() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  }

  function syncRepeatDayButtons(days) {
    const selected = days && days.length ? days : defaultWeekdays();
    document.querySelectorAll('#cleanDaysGrid .clean-day-btn').forEach((btn) => {
      const day = btn.getAttribute('data-day');
      btn.classList.toggle('active', selected.includes(day));
    });
    state().bookingDraft.selectedDays = selected;
  }

  const originalRecurring = window.handleRecurringToggleChange;
  window.handleRecurringToggleChange = function (isRecurring) {
    if (typeof originalRecurring === 'function') originalRecurring(isRecurring);
    const days = document.getElementById('repeatDaysSection');
    if (days) {
      days.hidden = !isRecurring;
      days.style.display = isRecurring ? '' : 'none';
    }
    if (isRecurring) {
      const current = state().bookingDraft.selectedDays || [];
      syncRepeatDayButtons(current.length ? current : defaultWeekdays());
      if (!state().bookingDraft.untilDate && !state().bookingDraft.recurrenceEndDate) {
        window.setRecurrenceEnds('until_cancelled');
      } else {
        state().bookingDraft.untilCancelled = false;
        window.syncUntilCancelledUi();
      }
    } else {
      window.setRecurrenceEnds('until_cancelled');
    }
    window.updateBookingSearchCta();
    if (window.lucide) window.lucide.createIcons();
  };

  const originalToggleDay = window.toggleRepeatDay;
  window.toggleRepeatDay = function (btn) {
    if (typeof originalToggleDay === 'function') originalToggleDay(btn);
    const activeDays = Array.from(document.querySelectorAll('#cleanDaysGrid .clean-day-btn.active'))
      .map((el) => el.getAttribute('data-day'))
      .filter(Boolean);
    state().bookingDraft.selectedDays = activeDays;
    window.updateBookingSearchCta();
  };

  function applyRepeatUiFromDraft(draft) {
    const recurring = draft.frequency === 'recurring';
    const toggle = document.getElementById('toggleRecurringRide');
    if (toggle) toggle.checked = recurring;
    const days = document.getElementById('repeatDaysSection');
    if (days) {
      days.hidden = !recurring;
      days.style.display = recurring ? '' : 'none';
    }
    if (recurring) syncRepeatDayButtons(draft.selectedDays);
    const endInput = document.getElementById('repeatEndDateInput');
    if (endInput) endInput.value = draft.untilDate || draft.recurrenceEndDate || '';
    if (recurring && (draft.untilDate || draft.recurrenceEndDate) && draft.untilCancelled === false) {
      window.setRecurrenceEndDate(draft.untilDate || draft.recurrenceEndDate);
    } else {
      window.setRecurrenceEnds('until_cancelled');
    }
  }

  function syncLocationClearButtons() {
    const pickup = (document.getElementById('setupPickupLocationInput')?.value || '').trim();
    const drop = (document.getElementById('setupSchoolLocationInput')?.value || '').trim();
    const pickupBtn = document.getElementById('btnClearPickup');
    const dropBtn = document.getElementById('btnClearDropoff');
    if (pickupBtn) pickupBtn.hidden = !pickup;
    if (dropBtn) dropBtn.hidden = !drop;
    const schoolInput = document.getElementById('setupSchoolLocationInput');
    if (schoolInput && document.activeElement === schoolInput) {
      delete schoolInput.dataset.autoSchool;
    }
  }

  function parseDisplayTimeToHHMM(text) {
    const raw = String(text || '').trim();
    if (!raw) return '';
    if (/^\d{1,2}:\d{2}$/.test(raw)) return raw.length === 4 ? `0${raw}` : raw;
    const m = raw.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!m) return '';
    let h = parseInt(m[1], 10);
    const period = m[3].toUpperCase();
    if (period === 'AM') h = h === 12 ? 0 : h;
    else h = h === 12 ? 12 : h + 12;
    return `${String(h).padStart(2, '0')}:${m[2]}`;
  }

  function displayPickupValue(val) {
    if (!val) return '';
    if (/elm street/i.test(val) && !/toronto/i.test(val)) return '12 Elm Street, Toronto';
    const wrapped = String(val).match(/^Home\s*\((.+)\)\s*$/i);
    return wrapped ? wrapped[1] : val;
  }

  function applyBookingDraftToForm() {
    const draft = state().bookingDraft || {};
    const pickupInput = document.getElementById('setupPickupLocationInput');
    const pickupHidden = document.getElementById('setupPickupLocation');
    const schoolInput = document.getElementById('setupSchoolLocationInput');
    const schoolHidden = document.getElementById('setupSchoolLocation');
    const pickupVal = displayPickupValue(draft.pickupLocation || '');
    const schoolVal = draft.schoolLocation || '';
    if (pickupInput) pickupInput.value = pickupVal;
    if (pickupHidden) pickupHidden.value = pickupVal;
    if (schoolInput) schoolInput.value = schoolVal;
    if (schoolHidden) schoolHidden.value = schoolVal;

    const start = document.getElementById('setupStartDate');
    const ret = document.getElementById('setupReturnDate');
    if (start) start.value = draft.startDate || '';
    if (ret) ret.value = draft.startDate || '';

    const outTime = document.getElementById('setupOutboundTime');
    const retTime = document.getElementById('setupReturnTime');
    if (outTime) outTime.value = parseDisplayTimeToHHMM(draft.outboundTime);
    if (retTime) retTime.value = parseDisplayTimeToHHMM(draft.returnTime);
    applyRepeatUiFromDraft(draft);
    if (window.setTripDirection) window.setTripDirection(draft.direction === 'oneway' ? 'oneway' : 'bothway');
  }

  window.isBookingSetupComplete = function () {
    ensureDraftDefaults();
    const pickup = (document.getElementById('setupPickupLocationInput')?.value || '').trim();
    const dropoff = (document.getElementById('setupSchoolLocationInput')?.value || '').trim();
    const dateIso = (document.getElementById('setupStartDate')?.value || '').trim();
    const pickupTime = (document.getElementById('setupOutboundTime')?.value || '').trim();
    const returnTime = (document.getElementById('setupReturnTime')?.value || '').trim();
    const kids = bookingChildIds();
    const draft = state().bookingDraft;
    const service = draft.serviceType;
    const isRoundTrip = draft.direction !== 'oneway';
    const returnOk = !isRoundTrip || !!returnTime;
    const daysOk = draft.frequency !== 'recurring' || (draft.selectedDays || []).length > 0;
    const endsOk = draft.frequency !== 'recurring'
      || !!draft.untilCancelled
      || !!(draft.untilDate || draft.recurrenceEndDate);
    return kids.length > 0 && pickup && dropoff && dateIso && pickupTime && returnOk && daysOk && endsOk && (service === 'drivers' || service === 'walkshare');
  };

  window.updateBookingSearchCta = function () {
    syncLocationClearButtons();
    const btn = document.getElementById('btnSearchProviders');
    if (!btn) return;
    const ready = window.isBookingSetupComplete();
    btn.disabled = !ready;
    btn.classList.toggle('is-disabled', !ready);
  };

  window.initBookingSetupPage = function () {
    ensureDraftDefaults();
    const draft = state().bookingDraft;
    if (draft.direction !== 'oneway' && draft.direction !== 'bothway') draft.direction = 'bothway';
    if (draft.setupSource !== 'rebook' && !draft.frequency) draft.frequency = 'onetime';
    if (draft.setupSource !== 'rebook' && !Array.isArray(draft.childIds)) {
      draft.childIds = [];
    }
    if (draft.setupSource === 'rebook' || (draft.childIds && draft.childIds.length) || draft.pickupLocation || draft.schoolLocation || draft.startDate || draft.outboundTime) {
      applyBookingDraftToForm();
    } else {
      setBookingChildIds([]);
      applyBookingDraftToForm();
    }
    window.syncBookingDateDisplay();
    window.syncBookingTimeDisplays();
    renderChildrenDropdown();
    window.updateBookingSearchCta();
    if (window.lucide) window.lucide.createIcons();
  };

  const originalProceed = window.proceedFromTripSetup;
  window.proceedFromTripSetup = function () {
    if (!window.isBookingSetupComplete()) {
      const oneWay = state().bookingDraft?.direction === 'oneway';
      toast(oneWay ? 'Add children, route, date, and pickup time to search' : 'Add children, route, date, and both times to search');
      return;
    }
    ensureDraftDefaults();
    if (state().parentSubscription?.status === 'failed') {
      toast('Search is paused until the platform fee is recovered');
      window.navigateTo('subscription');
      return;
    }
    const direction = state().bookingDraft.direction === 'oneway' ? 'oneway' : 'bothway';
    state().bookingDraft.direction = direction;
    const draft = state().bookingDraft;
    if (draft.frequency === 'recurring') {
      draft.untilCancelled = !!document.getElementById('toggleUntilCancelled')?.checked;
      draft.untilDate = draft.untilCancelled ? '' : (draft.untilDate || draft.recurrenceEndDate || '');
      draft.recurrenceEnds = draft.untilCancelled ? 'until_cancelled' : 'date';
      if (draft.untilCancelled) draft.recurrenceEndDate = '';
      else draft.recurrenceEndDate = draft.untilDate;
    } else {
      draft.untilCancelled = false;
      draft.untilDate = '';
      draft.selectedDays = [];
    }
    state().selectedChildIds = bookingChildIds().slice();
    if (typeof originalProceed === 'function') originalProceed();
    const service = state().bookingDraft.serviceType || 'drivers';
    if (window.filterBookingProviders) window.filterBookingProviders(service);
  };

  const originalConfirmMap = window.confirmMapLocation;
  window.confirmMapLocation = function () {
    if (typeof originalConfirmMap === 'function') originalConfirmMap();
    window.updateBookingSearchCta();
  };

  const originalSetService = window.setServiceType;
  window.setServiceType = function (serviceType) {
    const next = serviceType === 'all' ? 'drivers' : serviceType;
    if (typeof originalSetService === 'function') originalSetService(next);
    window.updateBookingSearchCta();
  };

  window.setProviderSearchView = function (view) {
    const map = document.getElementById('providerSearchMap');
    const list = document.getElementById('providersResultList');
    const listBtn = document.getElementById('searchViewList');
    const mapBtn = document.getElementById('searchViewMap');
    const isMap = view === 'map';
    map?.classList.toggle('visible', isMap);
    if (list) list.style.display = isMap ? 'none' : 'flex';
    listBtn?.classList.toggle('active', !isMap);
    mapBtn?.classList.toggle('active', isMap);
  };

  window.applyProviderCompactFilter = function (filter, btnEl) {
    document.querySelectorAll('#providerFilterRow .mvp-filter-chip').forEach((chip) => chip.classList.remove('active'));
    btnEl?.classList.add('active');
    const service = state().bookingDraft.serviceType === 'walkshare' ? 'walkshare' : 'drivers';
    const cards = Array.from(document.querySelectorAll('#providersResultList .provider-result-card'));
    const seatsNeeded = (state().selectedChildIds || []).length || 1;

    cards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const rating = parseFloat(card.getAttribute('data-rating') || '0');
      const verified = card.getAttribute('data-verified') === 'true';
      let show = cat === service;
      if (filter === 'rating') show = show && rating >= 4.8;
      if (filter === 'verified') show = show && verified;
      const providerId = (card.getAttribute('data-provider-id') || '').toLowerCase();
      const provider = (state().providers || []).find((p) => p.id === providerId);
      if (provider && provider.seats < seatsNeeded) show = false;
      card.style.display = show ? 'flex' : 'none';
    });

    if (filter === 'distance') {
      const wrap = document.getElementById('providersResultList');
      const visible = cards.filter((c) => c.style.display !== 'none');
      visible.sort((a, b) => (parseFloat(a.getAttribute('data-distance') || '99') - parseFloat(b.getAttribute('data-distance') || '99')));
      visible.forEach((card) => wrap.appendChild(card));
    }
  };

  window.initProviderSearchPage = function () {
    const service = state().bookingDraft.serviceType === 'walkshare' ? 'walkshare' : 'drivers';
    document.querySelectorAll('#providersResultList .provider-result-card').forEach((card) => {
      card.classList.add('mvp-compact');
      card.removeAttribute('onclick');
      if (!card.getAttribute('data-provider-id')) {
        const name = card.querySelector('.provider-name-verified span')?.textContent || '';
        const match = (state().providers || []).find((p) => name.includes(p.name.split(' ')[0]) || p.name.includes(name.split(' ')[0]));
        if (match) card.setAttribute('data-provider-id', match.id);
      }
      const distText = card.querySelector('.provider-meta-row')?.textContent || '';
      const km = parseFloat((distText.match(/([\d.]+)\s*km/) || [])[1] || '9');
      card.setAttribute('data-distance', String(km));
      if (!card.querySelector('.mvp-card-actions')) {
        const id = card.getAttribute('data-provider-id') || 'tariq';
        const actions = document.createElement('div');
        actions.className = 'mvp-card-actions';
        actions.innerHTML = `
          <button type="button" class="btn-secondary-surface" onclick="event.stopPropagation(); openDriverProfile('${id}', 'bookingSearchProviders')">View Profile</button>
          <button type="button" class="btn-primary" onclick="event.stopPropagation(); startBookingReview('${id}')">Book</button>
        `;
        card.appendChild(actions);
      }
    });
    window.applyProviderCompactFilter('all', document.querySelector('#providerFilterRow .mvp-filter-chip'));
    window.setProviderSearchView('list');
    if (window.lucide) window.lucide.createIcons();
  };

  window.startBookingReview = function (providerId) {
    const provider = (state().providers || []).find((p) => p.id === providerId) || state().providers[0];
    state().bookingDraft.providerId = provider.id;
    window.navigateTo('bookingSummary');
  };

  window.toggleVerifiedDocuments = function () {
    const panel = document.getElementById('verifiedDocsPanel');
    if (!panel) return;
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
  };

  const originalSummary = window.renderBookingSummary;
  window.renderBookingSummary = function () {
    ensureDraftDefaults();
    const draft = state().bookingDraft;
    const provider = (state().providers || []).find((p) => p.id === draft.providerId) || state().providers[0];
    const children = selectedChildren();
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    setText('summaryChildrenText', formatChildrenSummary(children));
    setText('summaryPickupText', document.getElementById('setupPickupLocationInput')?.value || draft.pickupLocation || 'Pickup');
    setText('summaryDropoffText', document.getElementById('setupSchoolLocationInput')?.value || draft.schoolLocation || 'Drop-off');
    setText('summaryDateText', draft.tripDate || document.getElementById('setupOutboundDateText')?.value || 'Mon, Sep 8');
    setText('summaryOutboundText', draft.outboundTime || '07:30 AM');
    setText('summaryReturnText', draft.returnTime || '01:00 PM');
    if (draft.frequency === 'recurring') {
      const days = (draft.selectedDays || []).join(' ');
      const ends = draft.untilCancelled || !(draft.untilDate || draft.recurrenceEndDate)
        ? 'Until cancelled'
        : `Ends ${draft.untilDate || draft.recurrenceEndDate}`;
      setText('summaryFreqText', `${days || 'M T W T F'} · ${ends}`);
    } else {
      setText('summaryFreqText', 'Off');
    }
    setText('summaryProviderText', (provider?.name || '').replace(/\s*\(WalkShare\)/i, ''));
    setText('summaryVehicleText', provider?.vehicle || 'Vehicle');
    setText('summaryPostedRateText', `$${provider?.baseWeekly || 120} /wk`);
    if (typeof originalSummary === 'function') {
      try { originalSummary(); } catch (err) { /* older summary nodes may be gone */ }
    }
    setText('summaryTripTypeText', draft.direction === 'oneway' ? 'One way' : 'Round trip');
    setText('summaryOutboundText', draft.outboundTime || '07:30 AM');
    setText('summaryReturnText', draft.returnTime || '01:00 PM');
    const returnRow = document.getElementById('summaryReturnRow');
    if (returnRow) returnRow.style.display = draft.direction === 'oneway' ? 'none' : '';
    renderPickupContacts();
  };

  window.openSeriesActionSheet = function (mode, bookingId) {
    state()._seriesAction = { mode, bookingId };
    const sheet = document.getElementById('seriesActionSheet');
    const title = document.getElementById('seriesSheetTitle');
    if (title) title.textContent = mode === 'modify' ? 'Modify this booking' : 'Cancel this booking';
    sheet?.classList.add('visible');
  };

  window.closeSeriesActionSheet = function () {
    document.getElementById('seriesActionSheet')?.classList.remove('visible');
  };

  window.confirmSeriesAction = function (scope) {
    const action = state()._seriesAction || {};
    const booking = (state().bookings || []).find((b) => b.id === action.bookingId);
    window.closeSeriesActionSheet();
    if (!booking) return;
    if (action.mode === 'cancel') {
      booking.status = 'cancelled';
      booking.cancelScope = scope;
      toast(scope === 'series' ? 'Entire series cancelled' : 'This occurrence cancelled');
      if (window.renderBookingDetails) window.renderBookingDetails(booking.id);
      if (window.renderBookingsList) window.renderBookingsList('upcoming');
      return;
    }
    toast(scope === 'series' ? 'Editing the entire series' : 'Editing this occurrence');
    window.navigateTo('bookingTripSetup');
  };

  const originalCancel = window.cancelBooking;
  window.cancelBooking = function (bookingId) {
    const booking = (state().bookings || []).find((b) => b.id === bookingId);
    if (booking && booking.frequency === 'recurring') {
      window.openSeriesActionSheet('cancel', bookingId);
      return;
    }
    if (typeof originalCancel === 'function') originalCancel(bookingId);
  };

  window.modifyBooking = function (bookingId) {
    const booking = (state().bookings || []).find((b) => b.id === bookingId);
    if (booking && booking.frequency === 'recurring') {
      window.openSeriesActionSheet('modify', bookingId);
      return;
    }
    window.navigateTo('bookingTripSetup');
  };

  const originalDetails = window.renderBookingDetails;
  function renderPaymentHandle(booking) {
    const card = document.getElementById('paymentHandleCard');
    if (!card) return;
    const confirmed = booking && (booking.status === 'confirmed' || booking.status === 'in_progress' || booking.status === 'completed');
    card.style.display = confirmed ? 'block' : 'none';
    const handle = state().paymentHandle || { status: 'idle' };
    const label = document.getElementById('paymentHandleStatusLabel');
    const copy = document.getElementById('paymentHandleCopy');
    const value = document.getElementById('paymentHandleValue');
    const primary = document.getElementById('btnPaymentHandlePrimary');
    const secondary = document.getElementById('btnPaymentHandleSecondary');
    const statusMap = {
      idle: 'Request Handle',
      requested: 'Consent',
      consented: 'Revealed',
      revealed: 'Revealed',
      revoked: 'Revoked'
    };
    if (label) label.textContent = statusMap[handle.status] || 'Request Handle';
    if (value) {
      value.style.display = handle.status === 'revealed' ? 'block' : 'none';
      value.textContent = handle.status === 'revealed' ? handle.handle : '';
    }
    if (copy) {
      copy.textContent = handle.status === 'revealed'
        ? 'Handle is visible for this confirmed booking only.'
        : 'After confirmation, parent or provider may request consent to share a payment handle. Home2School does not process the ride fee.';
    }
    if (primary) {
      primary.className = 'btn-secondary-surface';
      primary.style.display = handle.status === 'revoked' ? 'none' : 'inline-flex';
      primary.textContent = handle.status === 'idle' ? 'Request Handle' : handle.status === 'requested' ? 'Give consent' : handle.status === 'consented' ? 'Reveal handle' : 'Handle revealed';
    }
    if (secondary) secondary.style.display = handle.status === 'revealed' ? 'inline-flex' : 'none';
  }

  window.advancePaymentHandle = function () {
    const handle = state().paymentHandle;
    if (!handle) return;
    if (handle.status === 'idle') handle.status = 'requested';
    else if (handle.status === 'requested') handle.status = 'consented';
    else if (handle.status === 'consented') handle.status = 'revealed';
    renderPaymentHandle((state().bookings || []).find((b) => b.id === state().activeBookingId));
  };

  window.revokePaymentHandle = function () {
    if (state().paymentHandle) state().paymentHandle.status = 'revoked';
    renderPaymentHandle((state().bookings || []).find((b) => b.id === state().activeBookingId));
  };

  window.renderBookingDetails = function (bookingId) {
    if (typeof originalDetails === 'function') originalDetails(bookingId);
    const booking = (state().bookings || []).find((b) => b.id === bookingId) || state().bookings[0];
    renderPaymentHandle(booking);
    const actions = document.getElementById('detailContextualActions');
    if (actions && booking && (booking.status === 'confirmed' || booking.status === 'pending')) {
      if (!actions.querySelector('[data-mvp-modify]')) {
        const btn = document.createElement('button');
        btn.className = 'btn-secondary-surface';
        btn.setAttribute('data-mvp-modify', '1');
        btn.textContent = 'Modify booking';
        btn.onclick = () => window.modifyBooking(booking.id);
        actions.insertBefore(btn, actions.firstChild);
      }
    }
    renderPickupContacts();
  };

  function renderPickupContacts() {
    const wrap = document.getElementById('detailPickupContactsList');
    const user = state().user || {};
    const backup = (state().emergencyContacts || []).find((c) => c.pickupAuth);
    if (wrap) {
      wrap.innerHTML = `
        <div class="mvp-pickup-row">
          <img src="${user.photo || '/assets/avatar_sadia.jpg'}" alt="" class="folio-parent-avatar" />
          <div class="folio-parent-info">
            <div class="folio-parent-name-row">
              <span class="folio-parent-name">${user.name || 'Sadia Khan'}</span>
              <span class="folio-parent-you-pill">You</span>
              <span class="mvp-pickup-role">Primary</span>
            </div>
            <div class="folio-parent-sub">${user.role || 'Mother'} · authorized pickup</div>
          </div>
          <button type="button" class="mvp-pickup-edit" onclick="openNestedScreen('profileEmergency', event)">Edit</button>
        </div>
        ${backup ? `
        <div class="folio-backup-guardian-note">
          <div style="display:flex; align-items:center; gap:6px; flex:1; min-width:0;">
            <i data-lucide="shield-alert" style="width: 13px; height: 13px; color: #D97706; flex-shrink: 0;"></i>
            <span style="font-size: 11.5px; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Backup pickup: <strong>${backup.name}</strong> (${backup.rel})</span>
          </div>
          <button type="button" class="mvp-pickup-edit" onclick="openNestedScreen('profileEmergency', event)">Edit</button>
        </div>` : ''}
      `;
    }
    const preview = document.querySelector('#summaryProviderPickupPreview span');
    if (preview) {
      preview.textContent = backup
        ? `Provider will see: ${user.name || 'Sadia Khan'} (primary) · ${backup.name} (backup pickup)`
        : `Provider will see: ${user.name || 'Sadia Khan'} (primary)`;
    }
  }

  window.renderInboxScreen = function () {
    const wrap = document.getElementById('inboxThreadList');
    if (!wrap) return;
    const threads = [
      { id: 'tariq', name: 'Tariq Ahmed', preview: 'Arman and Emma are buckled in.', time: '07:34 AM' },
      { id: 'sarah', name: 'Sarah Jenkins', preview: 'Walking group is 2 minutes from school.', time: 'Yesterday' }
    ];
    wrap.innerHTML = threads.map((t) => `
      <button type="button" class="mvp-inbox-row" onclick="openChatWith('${t.id}')">
        <img src="/assets/avatar_${t.id === 'sarah' ? 'sarah' : 'tariq'}.jpg" alt="${t.name}" />
        <div style="flex:1; min-width:0;">
          <div class="mvp-inbox-name">${t.name}</div>
          <div class="mvp-inbox-preview">${t.preview}</div>
        </div>
        <span style="font-size:11px; color:#64748B; font-weight:700;">${t.time}</span>
      </button>
    `).join('');
  };

  const originalChat = window.openChatWith;
  window.openChatWith = function (providerId) {
    if (typeof originalChat === 'function') originalChat(providerId);
    const callBtn = document.getElementById('chatDriverCallBtn');
    if (callBtn) callBtn.style.display = 'none';
  };

  function liveBookings() {
    return (state().bookings || []).filter((b) => b.status === 'in_progress');
  }

  function childNamesForBooking(booking) {
    const kids = (booking?.childIds || []).map((id) => (state().children || []).find((c) => c.id === id)).filter(Boolean);
    if (!kids.length) return 'Child';
    if (kids.length === 1) return kids[0].name;
    return `${kids.map((c) => c.name.split(' ')[0]).join(' & ')} ${kids[0].name.split(' ').slice(1).join(' ')}`.trim();
  }

  function shortChildLabel(booking) {
    const kids = (booking?.childIds || []).map((id) => (state().children || []).find((c) => c.id === id)).filter(Boolean);
    if (!kids.length) return 'Ride';
    return kids.map((c) => c.name.split(' ')[0]).join(' + ');
  }

  function schoolShort(booking) {
    return String(booking?.schoolLocation || 'School')
      .replace(' International School', '')
      .replace(' Pre-school', '')
      .replace(' School', '')
      .trim() || 'school';
  }

  window.openLiveTracking = function (bookingId) {
    const live = liveBookings();
    if (bookingId && live.some((b) => b.id === bookingId)) {
      state().activeTrackingBookingId = bookingId;
    } else if (live.length) {
      const keep = live.find((b) => b.id === state().activeTrackingBookingId);
      state().activeTrackingBookingId = keep ? keep.id : live[0].id;
    } else {
      state().activeTrackingBookingId = null;
    }
    window.navigateTo('tracking');
  };

  function bindTrackingCopy(booking) {
    if (!booking) return;
    const provider = (state().providers || []).find((p) => p.id === booking.providerId) || state().providers?.[0];
    const setText = (id, value) => {
      const el = document.getElementById(id);
      if (el) el.textContent = value;
    };
    const kidsEl = document.getElementById('trackingHeaderChildren');
    const multi = document.getElementById('trackingRideSwitcher')?.style.display === 'flex';
    if (kidsEl) {
      if (multi) {
        kidsEl.style.display = 'none';
        kidsEl.textContent = '';
      } else {
        kidsEl.style.display = '';
        kidsEl.textContent = shortChildLabel(booking);
      }
    }
    setText('trackingHeaderRoute', `En route to ${schoolShort(booking)}`);
    setText('trackingStageText', `En route to ${booking.schoolLocation || 'school'}`);
    setText('trackingDriverName', String(provider?.name || '').replace(/\s*\(WalkShare\)/i, ''));
    setText('trackingDriverVehicle', [provider?.vehicle, provider?.plate].filter(Boolean).join(' • '));
    const photo = document.getElementById('trackingDriverPhoto');
    if (photo && provider?.photo) photo.src = provider.photo;
    const profileBtn = document.getElementById('trackingDriverProfileBtn');
    if (profileBtn) profileBtn.setAttribute('onclick', `openDriverProfile('${provider?.id || 'tariq'}', 'tracking')`);
    const chatBtn = document.getElementById('trackingChatBtn');
    if (chatBtn) chatBtn.setAttribute('onclick', `openChatWith('${provider?.id || 'tariq'}')`);
    const reportBtn = document.getElementById('trackingReportBtn');
    if (reportBtn) reportBtn.setAttribute('onclick', `openTripReport('${booking.id}')`);
    document.querySelectorAll('.map-pin-label').forEach((el, i) => {
      if (i === 1) el.textContent = schoolShort(booking);
    });
    const carTag = document.querySelector('.map-car-tag');
    if (carTag) carTag.textContent = `${String(provider?.name || 'Provider').split(' ')[0]} • live`;
  }

  function renderRideSwitcher(live, activeId) {
    const wrap = document.getElementById('trackingRideSwitcher');
    const kids = document.getElementById('trackingHeaderChildren');
    if (!wrap) return;
    if (live.length < 2) {
      wrap.style.display = 'none';
      wrap.innerHTML = '';
      if (kids) kids.style.display = '';
      return;
    }
    wrap.style.display = 'flex';
    if (kids) {
      kids.style.display = 'none';
      kids.textContent = '';
    }
    wrap.innerHTML = live.map((b) => {
      const on = b.id === activeId ? ' active' : '';
      return `<button type="button" class="mvp-ride-chip${on}" onclick="openLiveTracking('${b.id}')">${shortChildLabel(b)}</button>`;
    }).join('');
  }

  const originalTracking = window.renderTrackingScreen;
  window.renderTrackingScreen = function () {
    const live = liveBookings();
    const empty = document.getElementById('trackingInactiveState');
    const drawer = document.querySelector('.tracking-drawer-sheet');
    const header = document.getElementById('trackingLiveHeader');
    const mapHost = document.getElementById('liveLeafletMap');
    const fallback = document.getElementById('realisticVectorFallback');
    const controls = document.querySelector('.map-floating-quick-controls');
    const show = (el, on, display) => {
      if (el) el.style.display = on ? display : 'none';
    };

    if (!live.length) {
      state().activeTrackingBookingId = null;
      show(empty, true, 'flex');
      show(drawer, false, '');
      show(header, false, 'flex');
      show(mapHost, false, 'block');
      show(fallback, false, 'block');
      show(controls, false, 'flex');
      renderRideSwitcher(live, null);
      if (window.updateNavLiveBadges) window.updateNavLiveBadges();
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const booking = live.find((b) => b.id === state().activeTrackingBookingId) || live[0];
    state().activeTrackingBookingId = booking.id;
    show(empty, false, 'flex');
    show(drawer, true, '');
    show(header, true, 'flex');
    show(mapHost, true, 'block');
    show(fallback, true, 'block');
    show(controls, true, 'flex');
    renderRideSwitcher(live, booking.id);
    if (typeof originalTracking === 'function') originalTracking();
    bindTrackingCopy(booking);
    if (window.updateNavLiveBadges) window.updateNavLiveBadges();
    if (window.lucide) window.lucide.createIcons();
  };

  function isSubscriptionOnboardingFlow() {
    const hist = window.screenHistory || [];
    return hist[hist.length - 1] === 'authAddChild';
  }

  window.selectSubscriptionPlan = function (plan) {
    ensureDraftDefaults();
    state().parentSubscription.plan = plan;
    document.getElementById('planMonthly')?.classList.toggle('active', plan === 'monthly');
    document.getElementById('planAnnual')?.classList.toggle('active', plan === 'annual');
    window.renderSubscriptionScreen();
  };

  window.renderSubscriptionScreen = function () {
    ensureDraftDefaults();
    const sub = state().parentSubscription;
    const statusCard = document.getElementById('subscriptionStatusCard');
    const kicker = document.getElementById('subscriptionStatusKicker');
    const title = document.getElementById('subscriptionStatusTitle');
    const subLine = document.getElementById('subscriptionStatusSub');
    const activate = document.getElementById('btnActivateSubscription');
    const continueBtn = document.getElementById('btnContinueTrial');
    const continueLabel = document.getElementById('btnContinueTrialLabel');
    const cancelBtn = document.getElementById('btnCancelSubscription');
    const history = document.getElementById('subscriptionHistoryList');
    const planName = sub.plan === 'annual' ? 'Annual' : 'Monthly';
    const planPrice = sub.plan === 'annual' ? '$79/year' : '$9.99/month';
    if (statusCard) statusCard.setAttribute('data-status', sub.status || 'trial');
    if (sub.status === 'trial') {
      if (kicker) kicker.textContent = 'Free trial';
      if (title) title.textContent = `${sub.trialDaysLeft} days left`;
      if (subLine) subLine.textContent = `Next billing ${sub.renewal} · ${planPrice}`;
    } else if (sub.status === 'active') {
      if (kicker) kicker.textContent = 'Active';
      if (title) title.textContent = `${planName} plan`;
      if (subLine) subLine.textContent = `Renews ${sub.renewal} · ${planPrice}`;
    } else if (sub.status === 'cancelled') {
      if (kicker) kicker.textContent = 'Cancelled';
      if (title) title.textContent = 'Access until period ends';
      if (subLine) subLine.textContent = `No further billing after ${sub.renewal}`;
    } else if (sub.status === 'failed') {
      if (kicker) kicker.textContent = 'Payment failed';
      if (title) title.textContent = 'Search is paused';
      if (subLine) subLine.textContent = 'Pay the platform fee to search providers again.';
    } else {
      if (kicker) kicker.textContent = '';
      if (title) title.textContent = '';
      if (subLine) subLine.textContent = '';
    }
    if (activate) {
      activate.textContent = sub.plan === 'annual' ? 'Activate annual access' : 'Activate monthly access';
      activate.style.display = sub.status === 'trial' ? 'none' : 'flex';
    }
    if (continueLabel) continueLabel.textContent = 'Continue with free trial';
    if (continueBtn) continueBtn.style.display = sub.status === 'trial' ? 'flex' : 'none';
    if (cancelBtn) cancelBtn.style.display = sub.status === 'cancelled' ? 'none' : 'inline-flex';
    document.getElementById('btnRetrySubscription')?.remove();
    document.querySelector('#screen-subscription .sub-history-warn')?.remove();
    document.getElementById('planMonthly')?.classList.toggle('active', sub.plan === 'monthly');
    document.getElementById('planAnnual')?.classList.toggle('active', sub.plan === 'annual');
    if (history) {
      history.innerHTML = (sub.history || []).map((row) => `
        <div class="sub-history-row">
          <div class="sub-history-icon"><i data-lucide="file-text"></i></div>
          <div class="sub-history-copy">
            <div class="sub-history-label">${row.label}</div>
          </div>
          <div class="sub-history-meta">${row.amount} • ${row.date}</div>
        </div>
      `).join('');
    }
    if (window.lucide) window.lucide.createIcons();
  };

  window.continueWithParentTrial = function () {
    ensureDraftDefaults();
    state().parentSubscription.status = 'trial';
    if (isSubscriptionOnboardingFlow()) {
      window.navigateTo('authSuccess');
      return;
    }
    window.renderSubscriptionScreen();
    toast('Free trial continues. You can manage renewal anytime.');
  };

  window.activateParentSubscription = function () {
    ensureDraftDefaults();
    const sub = state().parentSubscription;
    sub.status = 'active';
    sub.history.unshift({
      id: 'sub-' + Date.now(),
      label: sub.plan === 'annual' ? 'Annual plan activated' : 'Monthly plan activated',
      date: 'Sep 8, 2026',
      amount: sub.plan === 'annual' ? '$79.00' : '$9.99'
    });
    window.renderSubscriptionScreen();
    toast('Platform access activated');
  };

  window.cancelParentSubscription = function () {
    ensureDraftDefaults();
    state().parentSubscription.status = 'cancelled';
    state().parentSubscription.history.unshift({
      id: 'sub-' + Date.now(),
      label: 'Automatic renewal cancelled',
      date: 'Sep 8, 2026',
      amount: '$0.00'
    });
    window.renderSubscriptionScreen();
    toast('Renewal cancelled. Access continues until the period ends.');
  };

  window.recoverFailedSubscriptionPayment = function () {
    ensureDraftDefaults();
    const sub = state().parentSubscription;
    if (sub.status !== 'failed') return;
    sub.status = 'active';
    sub.history.unshift({
      id: 'sub-' + Date.now(),
      label: 'Failed payment recovered',
      date: 'Sep 8, 2026',
      amount: sub.plan === 'annual' ? '$79.00' : '$9.99'
    });
    window.renderSubscriptionScreen();
    toast('Payment recovered. Provider search is open again.');
  };

  const originalEmerg = window.renderEmergencyContactsList;
  window.renderEmergencyContactsList = function () {
    if (typeof originalEmerg === 'function') originalEmerg();
    document.querySelectorAll('#emergencyContactsListWrap .btn-contact-action-call').forEach((el) => {
      el.classList.add('mvp-hide-phone');
    });
  };

  const originalAddChild = window.openAddChildModal;
  window.openAddChildModal = function () {
    if (typeof originalAddChild === 'function') originalAddChild();
    const grade = document.getElementById('editChildGrade');
    if (grade) grade.value = 'Grade 4';
  };

  const originalEditChild = window.openEditChildModal;
  window.openEditChildModal = function (childId) {
    if (typeof originalEditChild === 'function') originalEditChild(childId);
    const child = (state().children || []).find((c) => c.id === childId);
    const grade = document.getElementById('editChildGrade');
    if (grade && child) {
      grade.value = GRADE_OPTIONS.includes(child.grade) ? child.grade : (child.grade || 'Grade 4');
    }
  };

  const originalSaveChild = window.saveChildProfileForm;
  window.saveChildProfileForm = function (event) {
    if (event) event.preventDefault();
    const name = document.getElementById('editChildName')?.value?.trim();
    const grade = document.getElementById('editChildGrade')?.value?.trim();
    const school = document.getElementById('editChildSchool')?.value?.trim();
    if (!name || !grade || !school) {
      toast('Name, school, and grade are required');
      return;
    }
    if (typeof originalSaveChild === 'function') originalSaveChild(event);
    const child = window.editingChildId
      ? (state().children || []).find((c) => c.id === window.editingChildId)
      : (state().children || [])[(state().children || []).length - 1];
    if (child) {
      child.grade = grade;
      child.school = school;
      child.name = name;
    }
    if (window.renderMyChildrenList) window.renderMyChildrenList();
  };

  if (Array.isArray(state().bookings) && !state().bookings.some((b) => b.id === 'H2S-74012')) {
    state().bookings.push({
      id: 'H2S-74012',
      status: 'in_progress',
      childIds: ['zara'],
      direction: 'oneway',
      frequency: 'onetime',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '',
      providerId: 'sarah',
      amount: 35,
      createdAt: 'Sep 8, 2026'
    });
  }

  if (Array.isArray(state().bookings) && !state().bookings.some((b) => b.status === 'declined')) {
    state().bookings.push({
      id: 'H2S-66211',
      status: 'declined',
      childIds: ['zara'],
      direction: 'bothway',
      frequency: 'onetime',
      pickupLocation: 'Home (12 Elm Street)',
      schoolLocation: 'Sunshine Pre-school',
      outboundTime: '08:15 AM',
      returnTime: '01:30 PM',
      providerId: 'sarah',
      amount: 35,
      createdAt: 'Sep 7, 2026'
    });
  }

  const originalBookingsList = window.renderBookingsList;
  window.renderBookingsList = function (tab) {
    if (typeof originalBookingsList === 'function') originalBookingsList(tab);
    if (tab === 'upcoming' || !tab) {
      const wrap = document.getElementById('bookingsListWrap');
      const declined = (state().bookings || []).filter((b) => b.status === 'declined');
      if (wrap && declined.length && !wrap.querySelector('[data-declined-card]')) {
        declined.forEach((b) => {
          const provider = (state().providers || []).find((p) => p.id === b.providerId);
          const card = document.createElement('div');
          card.className = 'booking-card';
          card.setAttribute('data-declined-card', b.id);
          card.style.cssText = 'padding:14px;border:1.5px solid #FECACA;background:#FEF2F2;border-radius:14px;margin-bottom:10px;';
          card.innerHTML = `
            <div style="font-size:12px;font-weight:800;color:#991B1B;">Declined</div>
            <div style="font-size:14px;font-weight:800;color:#0F172A;margin-top:4px;">${b.schoolLocation}</div>
            <div style="font-size:12px;color:#64748B;">${provider ? provider.name : 'Provider'} did not accept this request.</div>
            <button class="btn-primary" style="height:40px;margin-top:10px;font-size:13px;" onclick="navigateTo('bookingTripSetup')">Book another provider</button>
          `;
          wrap.prepend(card);
        });
      }
    }
  };

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    ['bookingChildrenSheet', 'bookingDateSheet', 'bookingTimeSheet'].forEach((id) => {
      document.getElementById(id)?.classList.remove('visible');
    });
    document.getElementById('bookingChildrenTrigger')?.classList.remove('open');
  });
})();
