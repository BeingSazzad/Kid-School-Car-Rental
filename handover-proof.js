(function () {
  const STORE = 'h2s_handover_proofs';
  const MAX_BOOKINGS = 8;
  const MAX_EDGE = 1024;
  const FALLBACK_MAX_AGE_MS = 5 * 60 * 1000;

  function loadAll() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORE) || '{}');
      return raw && typeof raw === 'object' ? raw : {};
    } catch (err) {
      return {};
    }
  }

  function saveAll(all) {
    const keys = Object.keys(all).filter((k) => k !== 'latest');
    keys.sort((a, b) => (all[b]?.updatedAt || 0) - (all[a]?.updatedAt || 0));
    keys.slice(MAX_BOOKINGS).forEach((k) => { delete all[k]; });
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        localStorage.setItem(STORE, JSON.stringify(all));
        return true;
      } catch (err) {
        const live = Object.keys(all).filter((k) => k !== 'latest' && k !== all.latest);
        if (!live.length) break;
        live.sort((a, b) => (all[a]?.updatedAt || 0) - (all[b]?.updatedAt || 0));
        delete all[live[0]];
      }
    }
    return false;
  }

  function timeLabel(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  window.saveHandoverProof = function (bookingId, leg, record) {
    const key = String(bookingId || 'current');
    const all = loadAll();
    const now = new Date();
    const entry = Object.assign({
      time: timeLabel(now),
      takenAt: now.toISOString()
    }, record || {});
    all[key] = Object.assign({}, all[key], { [leg]: entry, updatedAt: now.getTime() });
    all.latest = key;
    const ok = saveAll(all);
    if (window.photoProofData) {
      window.photoProofData[leg] = Object.assign({}, entry);
    }
    if (typeof window.syncPhotoProofThumbnails === 'function') window.syncPhotoProofThumbnails();
    return ok;
  };

  window.getHandoverProofs = function (bookingId) {
    const all = loadAll();
    if (bookingId && all[bookingId]) return all[bookingId];
    return null;
  };

  window.getLatestHandoverProofs = function () {
    const all = loadAll();
    const rec = all.latest && all[all.latest];
    if (!rec) return null;
    const sameDay = new Date(rec.updatedAt || 0).toDateString() === new Date().toDateString();
    return sameDay ? rec : null;
  };

  function isMobileDevice() {
    const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return coarse || /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
  }

  function stampAndCompress(source, width, height, stampText, crop) {
    const src = crop || { x: 0, y: 0, w: width, h: height };
    const scale = Math.min(1, MAX_EDGE / Math.max(src.w, src.h));
    const w = Math.round(src.w * scale);
    const h = Math.round(src.h * scale);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(source, src.x, src.y, src.w, src.h, 0, 0, w, h);
    if (stampText) {
      const pad = Math.round(w * 0.03);
      const fontSize = Math.max(14, Math.round(w * 0.032));
      ctx.font = `700 ${fontSize}px Manrope, sans-serif`;
      const textW = ctx.measureText(stampText).width;
      const boxH = fontSize + pad;
      ctx.fillStyle = 'rgba(26, 29, 36, 0.72)';
      ctx.fillRect(pad, h - boxH - pad, textW + pad * 2, boxH);
      ctx.fillStyle = '#FFFFFF';
      ctx.textBaseline = 'middle';
      ctx.fillText(stampText, pad * 2, h - pad - boxH / 2);
    }
    return canvas.toDataURL('image/jpeg', 0.78);
  }

  let cam = null;

  function stopStream() {
    if (cam && cam.stream) {
      cam.stream.getTracks().forEach((t) => t.stop());
      cam.stream = null;
    }
  }

  function el(id) {
    return document.getElementById(id);
  }

  function ensureOverlay() {
    let root = el('hpCam');
    if (root) return root;
    const host = (el('driverAttendanceModal') || el('wsAttendanceModal'))?.parentElement || document.body;
    root = document.createElement('div');
    root.id = 'hpCam';
    root.className = 'hp-cam';
    root.setAttribute('role', 'dialog');
    root.setAttribute('aria-modal', 'true');
    root.hidden = true;
    root.innerHTML = `
      <div class="hp-cam-top">
        <button type="button" class="hp-cam-close" onclick="closeLiveProofCamera()" aria-label="Close camera"><i data-lucide="x"></i></button>
        <div class="hp-cam-head">
          <div class="hp-cam-title" id="hpCamTitle">Photo proof</div>
          <div class="hp-cam-hint" id="hpCamHint"></div>
        </div>
      </div>
      <div class="hp-cam-stage">
        <video id="hpCamVideo" class="hp-cam-video" playsinline autoplay muted></video>
        <img id="hpCamDemo" class="hp-cam-video hp-cam-demo" alt="" hidden />
        <img id="hpCamShot" class="hp-cam-shot" alt="Captured proof" hidden />
        <div class="hp-cam-frame" id="hpCamFrame" aria-hidden="true"><span></span><span></span><span></span><span></span></div>
        <div id="hpCamMsg" class="hp-cam-msg" hidden>
          <i data-lucide="camera-off"></i>
          <p id="hpCamMsgText"></p>
        </div>
        <span class="hp-cam-live" id="hpCamLive"><span></span><b id="hpCamLiveText">Live camera</b></span>
      </div>
      <div class="hp-cam-bar">
        <div class="hp-cam-row" id="hpCamCaptureRow">
          <button type="button" class="hp-cam-shutter" onclick="captureLiveProof()" aria-label="Take photo"><span></span></button>
        </div>
        <div class="hp-cam-row" id="hpCamReviewRow" hidden>
          <button type="button" class="hp-cam-btn is-ghost" onclick="retakeLiveProof()"><i data-lucide="rotate-ccw"></i>Retake</button>
          <button type="button" class="hp-cam-btn is-primary" onclick="useLiveProof()"><i data-lucide="check"></i>Use photo</button>
        </div>
        <div class="hp-cam-row" id="hpCamErrorRow" hidden>
          <button type="button" class="hp-cam-btn is-ghost" onclick="startLiveProofStream()"><i data-lucide="refresh-cw"></i>Try again</button>
          <label class="hp-cam-btn is-primary" id="hpCamNativeBtn" hidden>
            <i data-lucide="camera"></i>Open camera
            <input type="file" accept="image/*" capture="environment" onchange="onNativeProofCapture(event)" hidden />
          </label>
        </div>
      </div>`;
    host.appendChild(root);
    return root;
  }

  function demoImageFor(opts) {
    const text = `${opts.stamp || ''} ${opts.title || ''}`;
    return /drop|handoff|meetup/i.test(text) ? '/assets/onboarding3.jpg' : '/assets/onboarding1.jpg';
  }

  function setMode(mode, message) {
    const shooting = mode === 'capture' || mode === 'demo';
    el('hpCamCaptureRow').hidden = !shooting;
    el('hpCamReviewRow').hidden = mode !== 'review';
    el('hpCamErrorRow').hidden = mode !== 'error';
    el('hpCamVideo').hidden = mode !== 'capture';
    el('hpCamDemo').hidden = mode !== 'demo';
    el('hpCamFrame').hidden = !shooting;
    el('hpCamShot').hidden = mode !== 'review';
    el('hpCamLive').hidden = !shooting;
    el('hpCamLiveText').textContent = mode === 'demo' ? 'Demo camera' : 'Live camera';
    el('hpCamMsg').hidden = mode !== 'error';
    if (mode === 'error') {
      el('hpCamMsgText').textContent = message || 'Camera is not available.';
      el('hpCamNativeBtn').hidden = !isMobileDevice();
    }
    if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
  }

  function startDemoCamera() {
    if (!cam) return;
    cam.demo = true;
    const img = el('hpCamDemo');
    if (img.getAttribute('src') !== cam.demoSrc) img.src = cam.demoSrc;
    setMode('demo');
  }

  window.startLiveProofStream = async function () {
    if (!cam) return;
    stopStream();
    cam.demo = false;
    const media = navigator.mediaDevices;
    if (!isMobileDevice() && (!media || typeof media.getUserMedia !== 'function')) {
      startDemoCamera();
      return;
    }
    if (!media || typeof media.getUserMedia !== 'function') {
      setMode('error', isMobileDevice()
        ? 'Live preview is blocked on this connection. Tap Open camera to take the photo.'
        : 'This browser cannot open the camera. Use a phone or a device with a camera.');
      return;
    }
    try {
      cam.stream = await media.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 960 } },
        audio: false
      });
      const video = el('hpCamVideo');
      video.srcObject = cam.stream;
      await video.play().catch(() => {});
      setMode('capture');
    } catch (err) {
      if (!isMobileDevice()) {
        startDemoCamera();
        return;
      }
      const denied = err && (err.name === 'NotAllowedError' || err.name === 'SecurityError');
      const missing = err && (err.name === 'NotFoundError' || err.name === 'OverconstrainedError');
      setMode('error', denied
        ? 'Camera permission is blocked. Allow camera access for this site, then tap Try again.'
        : missing ? 'No camera found on this device.' : 'Could not start the camera. Tap Try again.');
    }
  };

  window.openLiveProofCamera = function (options) {
    const opts = options || {};
    ensureOverlay();
    cam = { onCapture: opts.onCapture, stamp: opts.stamp || '', shot: '', stream: null, demo: false, demoSrc: demoImageFor(opts) };
    el('hpCamTitle').textContent = opts.title || 'Photo proof';
    el('hpCamHint').textContent = opts.hint || '';
    el('hpCam').hidden = false;
    window.startLiveProofStream();
  };

  window.closeLiveProofCamera = function () {
    stopStream();
    const root = el('hpCam');
    if (root) root.hidden = true;
    const video = el('hpCamVideo');
    if (video) video.srcObject = null;
    cam = null;
  };

  function stampText() {
    const now = new Date();
    const date = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
    return `${cam && cam.stamp ? cam.stamp + ' · ' : ''}${date} · ${timeLabel(now)}`;
  }

  window.captureLiveProof = function () {
    if (cam && cam.demo) {
      const img = el('hpCamDemo');
      if (!img.complete || !img.naturalWidth) {
        if (window.showToast) window.showToast('Camera is still starting. Try again in a second.');
        return;
      }
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      const viewRatio = img.clientWidth && img.clientHeight ? img.clientWidth / img.clientHeight : nw / nh;
      const cw = Math.min(nw, nh * viewRatio);
      const ch = Math.min(nh, nw / viewRatio);
      const crop = { x: (nw - cw) / 2, y: (nh - ch) / 2, w: cw, h: ch };
      cam.shot = stampAndCompress(img, nw, nh, stampText(), crop);
      el('hpCamShot').src = cam.shot;
      setMode('review');
      return;
    }
    const video = el('hpCamVideo');
    if (!cam || !video || !video.videoWidth) {
      if (window.showToast) window.showToast('Camera is still starting. Try again in a second.');
      return;
    }
    cam.shot = stampAndCompress(video, video.videoWidth, video.videoHeight, stampText());
    el('hpCamShot').src = cam.shot;
    stopStream();
    setMode('review');
  };

  window.retakeLiveProof = function () {
    if (!cam) return;
    cam.shot = '';
    if (cam.demo) {
      startDemoCamera();
      return;
    }
    window.startLiveProofStream();
  };

  window.useLiveProof = function () {
    if (!cam || !cam.shot) return;
    const done = cam.onCapture;
    const photo = cam.shot;
    window.closeLiveProofCamera();
    if (typeof done === 'function') done(photo);
  };

  window.onNativeProofCapture = function (event) {
    const input = event.target;
    const file = input.files && input.files[0];
    input.value = '';
    if (!file || !cam) return;
    if (file.lastModified && Date.now() - file.lastModified > FALLBACK_MAX_AGE_MS) {
      if (window.showToast) window.showToast('Take a new photo now. Saved gallery photos are not accepted.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        if (!cam) return;
        cam.shot = stampAndCompress(img, img.naturalWidth, img.naturalHeight, stampText());
        el('hpCamShot').src = cam.shot;
        setMode('review');
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };
})();
