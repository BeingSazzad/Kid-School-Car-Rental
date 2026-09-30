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

  function slotHtml(doc, slot, handler) {
    const file = doc[slot.key];
    const filled = hasFile(file);
    const preview = filled && file.preview && String(file.preview).indexOf('data:image') === 0 ? file.preview : '';
    const inputId = `dcap_${doc.id}_${slot.key}`;
    const accept = slot.pdf ? 'image/*,.pdf,application/pdf' : 'image/*';
    let body;
    if (preview) {
      body = `<img class="dcap-thumb" src="${esc(preview)}" alt="" />`;
    } else if (filled) {
      body = `<span class="dcap-file"><i data-lucide="file-check-2"></i><span>${esc(file.name || 'File added')}</span></span>`;
    } else {
      body = `<span class="dcap-empty"><i data-lucide="camera"></i></span>`;
    }
    return `
      <label class="dcap-slot${filled ? ' is-filled' : ''}" for="${inputId}">
        ${body}
        <span class="dcap-slot-label">${filled ? `<i data-lucide="refresh-cw"></i>${esc(slot.pdf ? 'Replace' : slot.label)}` : esc(slot.label)}</span>
      </label>
      <input type="file" accept="${accept}" id="${inputId}" hidden onchange="${handler}(event, '${esc(doc.id)}', '${esc(slot.key)}')" />`;
  }

  function cardHtml(doc, spec, handler) {
    const label = STATUS_LABEL[doc.status] || '';
    const retake = doc.status === 'action_required' || doc.status === 'rejected';
    return `
      <section class="dcap-card${retake ? ' needs-retake' : ''}">
        <div class="dcap-head">
          <span class="dcap-icon"><i data-lucide="${esc(spec.icon || 'file')}"></i></span>
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

  function render(docs, specs, handler) {
    const cards = specs.map((spec) => {
      const doc = (docs || []).find((item) => item.id === spec.id) || { id: spec.id, status: 'not_submitted' };
      return cardHtml(doc, spec, handler);
    }).join('');
    return `<div class="dcap">${cards}</div>`;
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
    const missing = specs.filter((spec) => !isComplete((docs || []).find((d) => d.id === spec.id), spec));
    return missing.map((spec) => spec.short || spec.title).join(' and ');
  }

  window.H2SDocCapture = { render, readFile, hasFile, isComplete, statusAfterUpload, missingText };
})();
