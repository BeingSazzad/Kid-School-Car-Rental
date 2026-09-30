/**
 * Shared document capture for Driver and WalkShare signup.
 * Each document is a card with one or two photo slots (e.g. front / back).
 * A document is sent for review as soon as every slot has a file.
 */
(function () {
  const STATUS_LABEL = {
    not_submitted: '',
    under_review: 'In review',
    approved: 'Approved',
    action_required: 'Retake needed',
    rejected: 'Retake needed'
  };

  function esc(value) {
    return String(value || '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function hasFile(file) {
    return !!(file && (file.attached || file.name || file.preview));
  }

  function isComplete(doc, spec) {
    return !!doc && spec.slots.every((slot) => hasFile(doc[slot.key]));
  }

  /** Status after a file lands in a slot. */
  function statusAfterUpload(doc, spec) {
    return isComplete(doc, spec) ? 'under_review' : (doc.status || 'not_submitted');
  }

  function isReady(doc, spec) {
    return !!doc && (doc.status === 'approved' || isComplete(doc, spec));
  }

  function slotHtml(doc, slot, handler) {
    const file = doc[slot.key];
    const filled = hasFile(file);
    const onFile = !filled && doc.status === 'approved';
    const preview = filled && file.preview && String(file.preview).indexOf('data:image') === 0 ? file.preview : '';
    const inputId = `dcap_${doc.id}_${slot.key}`;
    const accept = slot.pdf ? 'image/*,.pdf,application/pdf' : 'image/*';
    let body;
    let cls = '';
    if (preview) {
      cls = ' is-filled has-thumb';
      body = `
        <img class="dcap-thumb" src="${esc(preview)}" alt="${esc(slot.label)}" />
        <span class="dcap-badge"><i data-lucide="check"></i></span>
        <span class="dcap-pill"><i data-lucide="refresh-cw"></i>${esc(slot.pdf ? 'Replace' : slot.label)}</span>`;
    } else if (filled || onFile) {
      cls = ' is-filled';
      body = `
        <span class="dcap-circle is-done"><i data-lucide="${onFile ? 'shield-check' : 'file-check-2'}"></i></span>
        <span class="dcap-text">
          <span class="dcap-label">${esc(onFile ? (slot.pdf ? 'On file' : `${slot.label} on file`) : (file.name || 'File added'))}</span>
          <span class="dcap-sub">Tap to replace</span>
        </span>`;
    } else {
      body = `
        <span class="dcap-circle"><i data-lucide="${slot.pdf ? 'upload' : 'camera'}"></i></span>
        <span class="dcap-text">
          <span class="dcap-label">${esc(slot.pdf ? 'Add photo or PDF' : slot.label)}</span>
          <span class="dcap-sub">${slot.pdf ? 'Camera, gallery or file' : 'Tap to add'}</span>
        </span>`;
    }
    return `
      <label class="dcap-slot${cls}" for="${inputId}">
        ${body}
        <span class="dcap-loading"><span class="dcap-spinner"></span></span>
      </label>
      <input type="file" accept="${accept}" id="${inputId}" hidden onchange="if (this.files && this.files[0]) this.previousElementSibling.classList.add('is-loading'); ${handler}(event, '${esc(doc.id)}', '${esc(slot.key)}')" />`;
  }

  function cardHtml(doc, spec, handler) {
    const label = STATUS_LABEL[doc.status] || '';
    const retake = doc.status === 'action_required' || doc.status === 'rejected';
    const ready = !retake && isReady(doc, spec);
    return `
      <section class="dcap-card${retake ? ' needs-retake' : ''}${ready ? ' is-ready' : ''}">
        <div class="dcap-head">
          <span class="dcap-icon"><i data-lucide="${ready ? 'check' : esc(spec.icon || 'file')}"></i></span>
          <div class="dcap-titles">
            <p class="dcap-title">${esc(spec.title)}</p>
            <p class="dcap-hint">${esc(spec.hint || '')}</p>
          </div>
          ${label ? `<span class="dcap-chip is-${esc(doc.status)}">${esc(label)}</span>` : ''}
        </div>
        ${retake && doc.rejectReason ? `<p class="dcap-reject">${esc(doc.rejectReason)}</p>` : ''}
        <div class="dcap-slots${spec.slots.length === 1 ? ' is-single' : ''}">
          ${spec.slots.map((slot) => slotHtml(doc, slot, handler)).join('')}
        </div>
      </section>`;
  }

  function findDoc(docs, spec) {
    return (docs || []).find((item) => item.id === spec.id) || { id: spec.id, status: 'not_submitted' };
  }

  function readyCount(docs, specs) {
    return specs.filter((spec) => isReady(findDoc(docs, spec), spec)).length;
  }

  function render(docs, specs, handler) {
    const done = readyCount(docs, specs);
    const pct = specs.length ? Math.round((done / specs.length) * 100) : 0;
    const cards = specs.map((spec) => cardHtml(findDoc(docs, spec), spec, handler)).join('');
    return `
      <div class="dcap">
        <div class="dcap-progress">
          <div class="dcap-progress-row">
            <span>${done === specs.length ? 'All documents added' : `${done} of ${specs.length} added`}</span>
            <span>${pct}%</span>
          </div>
          <div class="dcap-bar"><span style="width:${pct}%"></span></div>
        </div>
        ${cards}
      </div>`;
  }

  /** Sticky submit bar; stays tappable while waiting so the tap can explain what is missing. */
  function footer(label, onclick, ready) {
    return `
      <div class="dcap-footer">
        <button type="button" class="dcap-submit${ready ? '' : ' is-waiting'}" onclick="${onclick}">${label}</button>
      </div>`;
  }

  /** Reads an image (downscaled to keep localStorage small) or a PDF name. */
  function readFile(file, cb) {
    if (!file) return;
    const meta = { name: file.name, attached: true, preview: '' };
    if (!(file.type && file.type.indexOf('image/') === 0)) {
      cb(meta);
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => cb(meta);
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const img = new Image();
      img.onerror = () => cb(Object.assign(meta, { preview: dataUrl }));
      img.onload = () => {
        try {
          const scale = Math.min(1, 960 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
          cb(Object.assign(meta, { preview: canvas.toDataURL('image/jpeg', 0.78) }));
        } catch (err) {
          cb(Object.assign(meta, { preview: dataUrl }));
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  function missingText(docs, specs) {
    const missing = specs.filter((spec) => !isReady(findDoc(docs, spec), spec));
    return missing.map((spec) => spec.short || spec.title).join(' and ');
  }

  window.H2SDocCapture = { render, footer, readFile, hasFile, isComplete, statusAfterUpload, missingText };
})();
