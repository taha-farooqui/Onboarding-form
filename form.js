(() => {
  const TOTAL_STEPS = 10;
  let currentStep = 1;
  const uploadedFiles = {};

  // ── DOM refs ──────────────────────────────────────────────────────────────
  const steps       = document.querySelectorAll('.step');
  const btnNext     = document.getElementById('btnNext');
  const btnPrev     = document.getElementById('btnPrev');
  const btnBack     = document.getElementById('btnBack');
  const progressDotsEl = document.getElementById('progressDots');

  // Generate progress dots (one per step)
  for (let i = 0; i < TOTAL_STEPS; i++) {
    const dot = document.createElement('span');
    dot.className = 'progress-dot';
    progressDotsEl.appendChild(dot);
  }

  // ── Validation helpers ────────────────────────────────────────────────────
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    const type     = field.dataset.type;
    const required = field.dataset.required === 'true';
    const val      = field.value.trim();
    const errorEl  = document.getElementById(`${field.id}-error`);

    if (type === 'phone') {
      const digits = val.replace(/\D/g, '');
      if (required && !val) return setError(field, errorEl, 'This field is required.');
      if (val && digits.length !== 10)
        return setError(field, errorEl, 'Phone number must be exactly 10 digits (excluding country code).');
      clearError(field, errorEl);
      return true;
    }
    if (required && !val) {
      return setError(field, errorEl, 'This field is required.');
    }
    if (val && type === 'email' && !EMAIL_RE.test(val)) {
      return setError(field, errorEl, 'Please enter a valid email address.');
    }
    if (val && type === 'number' && (isNaN(val) || Number(val) < 0)) {
      return setError(field, errorEl, 'Please enter a valid number.');
    }
    clearError(field, errorEl);
    return true;
  }

  function validateOptionGrid(grid) {
    const name     = grid.dataset.name;
    const required = grid.dataset.required === 'true';
    const errorEl  = document.getElementById(`${name}-error`);
    const selected = grid.querySelectorAll('.option-card.selected');

    if (required && selected.length === 0) {
      showError(errorEl, 'Please select at least one option.');
      grid.classList.add('has-error');
      return false;
    }
    showError(errorEl, '');
    grid.classList.remove('has-error');
    return true;
  }

  function validateUpload(zone) {
    const name     = zone.dataset.name;
    const required = zone.dataset.required === 'true';
    const errorEl  = document.getElementById(`${name}-error`);
    const files    = uploadedFiles[name] || [];

    if (required && files.length === 0) {
      showError(errorEl, 'Please upload at least one file.');
      zone.classList.add('has-error');
      return false;
    }
    showError(errorEl, '');
    zone.classList.remove('has-error');
    return true;
  }

  function showError(el, msg) { if (el) { el.textContent = msg; el.style.display = msg ? 'block' : 'none'; } }

  function setError(field, errorEl, msg) {
    if (errorEl) { errorEl.textContent = msg; errorEl.style.display = 'block'; }
    field.classList.add('has-error');
    return false;
  }

  function clearError(field, errorEl) {
    if (errorEl) { errorEl.textContent = ''; errorEl.style.display = 'none'; }
    field.classList.remove('has-error');
  }

  // ── Step validation ───────────────────────────────────────────────────────
  function validateStep(stepNum) {
    const stepEl = document.querySelector(`.step[data-step="${stepNum}"]`);
    let valid = true;

    stepEl.querySelectorAll('input[data-required], textarea[data-required], select[data-required]').forEach(field => {
      if (!validateField(field)) valid = false;
    });

    // optional email/phone fields still need format checks when filled
    stepEl.querySelectorAll('input[data-type="email"]:not([data-required]), input[data-type="phone"]:not([data-required])').forEach(field => {
      if (field.value.trim() && !validateField(field)) valid = false;
    });

    stepEl.querySelectorAll('.options-grid').forEach(grid => {
      if (!validateOptionGrid(grid)) valid = false;
    });

    stepEl.querySelectorAll('.custom-select').forEach(select => {
      if (!validateCustomSelect(select)) valid = false;
    });

    stepEl.querySelectorAll('.upload-zone').forEach(zone => {
      if (!validateUpload(zone)) valid = false;
    });

    if (stepEl.querySelector('#userList') && !validateUserList()) valid = false;

    return valid;
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  const formShell = document.querySelector('.form-shell');

  function goTo(stepNum) {
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    currentStep = stepNum;
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
    formShell.classList.toggle('is-intro', stepNum === 1);
    formShell.classList.toggle('is-thankyou', stepNum === TOTAL_STEPS);
    updateUI();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateUI() {
    const isFirst   = currentStep === 1;
    const isLast    = currentStep === TOTAL_STEPS;
    const isThanks  = currentStep === TOTAL_STEPS;

    btnPrev.classList.add('hidden');
    btnBack.classList.toggle('hidden', isFirst || isThanks);
    btnNext.classList.toggle('hidden', isThanks);

    if (!isThanks) {
      const isSecondLast = currentStep === TOTAL_STEPS - 1;
      const label = isFirst ? 'Start' : isSecondLast ? 'Submit' : 'Next';
      btnNext.querySelector('.btn-text').textContent = label;
    }

    // Update progress dots
    const dots = progressDotsEl.querySelectorAll('.progress-dot');
    dots.forEach((dot, i) => {
      dot.classList.remove('active', 'done');
      if (i < currentStep - 1) dot.classList.add('done');
      if (i === currentStep - 1) dot.classList.add('active');
    });
  }

  btnNext.addEventListener('click', () => {
    if (currentStep === TOTAL_STEPS) return;
    if (currentStep > 1 && !validateStep(currentStep)) return;
    goTo(currentStep + 1);
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) goTo(currentStep - 1);
  });

  // ── Custom select ────────────────────────────────────────────────────────
  function initCustomSelect(select) {
    const trigger  = select.querySelector('.custom-select-trigger');
    const valueEl  = select.querySelector('.custom-select-value');
    const dropdown = select.querySelector('.custom-select-dropdown');
    const name     = select.dataset.name;

    trigger.addEventListener('click', () => select.classList.toggle('open'));

    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select.classList.toggle('open'); }
      if (e.key === 'Escape') select.classList.remove('open');
    });

    dropdown.querySelectorAll('.custom-select-option').forEach(opt => {
      opt.addEventListener('click', () => {
        dropdown.querySelectorAll('.custom-select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        valueEl.textContent = opt.textContent;
        valueEl.classList.remove('placeholder');
        select.dataset.value = opt.dataset.value;
        select.classList.remove('open', 'has-error');
        const errorEl = name ? document.getElementById(`${name}-error`) : null;
        showError(errorEl, '');
      });
    });

    document.addEventListener('click', e => {
      if (!select.contains(e.target)) select.classList.remove('open');
    });
  }

  document.querySelectorAll('.custom-select').forEach(initCustomSelect);

  function validateCustomSelect(select) {
    const name     = select.dataset.name;
    const required = select.dataset.required === 'true';
    const errorEl  = document.getElementById(`${name}-error`);
    if (required && !select.dataset.value) {
      select.classList.add('has-error');
      showError(errorEl, 'Please select an option.');
      return false;
    }
    select.classList.remove('has-error');
    showError(errorEl, '');
    return true;
  }

  // ── User list ─────────────────────────────────────────────────────────────
  const userListEl   = document.getElementById('userList');
  const addUserBtn   = document.getElementById('addUserRow');

  function createUserRow() {
    const row = document.createElement('div');
    row.className = 'user-row';
    row.innerHTML = `
      <input class="field-input" type="text"  placeholder="Full Name" />
      <input class="field-input" type="email" placeholder="Email" />
      <div class="custom-select user-role-select">
        <div class="custom-select-trigger" tabindex="0">
          <span class="custom-select-value placeholder">Role</span>
          <svg class="custom-select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </div>
        <div class="custom-select-dropdown">
          <div class="custom-select-option" data-value="Attorney">Attorney</div>
          <div class="custom-select-option" data-value="Legal Assistant">Legal Assistant</div>
          <div class="custom-select-option" data-value="Paralegal">Paralegal</div>
        </div>
      </div>
      <button type="button" class="user-row-remove" aria-label="Remove">&times;</button>
    `;
    initCustomSelect(row.querySelector('.custom-select'));
    row.querySelector('.user-row-remove').addEventListener('click', () => {
      if (userListEl.querySelectorAll('.user-row').length > 1) row.remove();
    });
    return row;
  }

  function validateUserList() {
    const errorEl = document.getElementById('usersList-error');
    const rows    = userListEl.querySelectorAll('.user-row');
    const filled  = Array.from(rows).some(r => r.querySelector('input').value.trim());
    if (!filled) {
      showError(errorEl, 'Please add at least one user.');
      return false;
    }
    // Validate email fields
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valid = true;
    rows.forEach(r => {
      const emailInput = r.querySelector('input[type="email"]');
      const val = emailInput.value.trim();
      if (val && !emailRegex.test(val)) {
        emailInput.classList.add('has-error');
        valid = false;
      } else {
        emailInput.classList.remove('has-error');
      }
    });
    if (!valid) {
      showError(errorEl, 'Please enter valid email addresses.');
      return false;
    }
    showError(errorEl, '');
    return true;
  }

  addUserBtn.addEventListener('click', () => userListEl.appendChild(createUserRow()));
  userListEl.appendChild(createUserRow());

  // ── Option card toggling ──────────────────────────────────────────────────
  document.querySelectorAll('.options-grid').forEach(grid => {
    const mode = grid.dataset.mode;

    grid.querySelectorAll('.option-card').forEach(card => {
      card.addEventListener('click', () => {
        if (mode === 'single') {
          grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
          card.classList.add('selected');
        } else {
          card.classList.toggle('selected');
        }
        // clear option grid error on interaction
        const errorEl = document.getElementById(`${grid.dataset.name}-error`);
        showError(errorEl, '');
        grid.classList.remove('has-error');
      });
    });
  });

  // ── File upload ───────────────────────────────────────────────────────────
  document.querySelectorAll('.upload-zone').forEach(zone => {
    const input    = zone.querySelector('.upload-input');
    const fileList = zone.querySelector('.upload-files');
    const name     = zone.dataset.name;
    uploadedFiles[name] = [];

    function renderFiles() {
      fileList.innerHTML = '';
      uploadedFiles[name].forEach((file, idx) => {
        const item = document.createElement('div');
        item.className = 'upload-file-item';
        item.innerHTML = `
          <span>${file.name}</span>
          <button type="button" class="upload-file-remove" data-idx="${idx}" aria-label="Remove">&times;</button>
        `;
        fileList.appendChild(item);
      });

      fileList.querySelectorAll('.upload-file-remove').forEach(btn => {
        btn.addEventListener('click', e => {
          e.stopPropagation();
          uploadedFiles[name].splice(Number(btn.dataset.idx), 1);
          renderFiles();
        });
      });

      // clear upload error once files present
      if (uploadedFiles[name].length > 0) {
        const errorEl = document.getElementById(`${name}-error`);
        showError(errorEl, '');
        zone.classList.remove('has-error');
      }
    }

    const MAX_FILES = 5;

    function addFiles(fileArr) {
      Array.from(fileArr).forEach(f => {
        if (uploadedFiles[name].length >= MAX_FILES) return;
        if (!uploadedFiles[name].find(x => x.name === f.name && x.size === f.size)) {
          uploadedFiles[name].push(f);
        }
      });
      renderFiles();
      if (uploadedFiles[name].length >= MAX_FILES) {
        const errorEl = document.getElementById(`${name}-error`);
        showError(errorEl, `Maximum ${MAX_FILES} files allowed.`);
      }
    }

    input.addEventListener('change', () => {
      addFiles(input.files);
      input.value = '';
    });

    zone.addEventListener('dragover', e => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

    zone.addEventListener('drop', e => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      addFiles(e.dataTransfer.files);
    });
  });

  // ── Phone: country dropdown + detection ─────────────────────────────────
  const COUNTRIES = [
    {iso:'US',name:'United States',code:'+1'},{iso:'CA',name:'Canada',code:'+1'},
    {iso:'GB',name:'United Kingdom',code:'+44'},{iso:'AU',name:'Australia',code:'+61'},
    {iso:'DE',name:'Germany',code:'+49'},{iso:'FR',name:'France',code:'+33'},
    {iso:'IN',name:'India',code:'+91'},{iso:'MX',name:'Mexico',code:'+52'},
    {iso:'BR',name:'Brazil',code:'+55'},{iso:'JP',name:'Japan',code:'+81'},
    {iso:'CN',name:'China',code:'+86'},{iso:'KR',name:'South Korea',code:'+82'},
    {iso:'SG',name:'Singapore',code:'+65'},{iso:'AE',name:'UAE',code:'+971'},
    {iso:'SA',name:'Saudi Arabia',code:'+966'},{iso:'PK',name:'Pakistan',code:'+92'},
    {iso:'NG',name:'Nigeria',code:'+234'},{iso:'ZA',name:'South Africa',code:'+27'},
    {iso:'EG',name:'Egypt',code:'+20'},{iso:'PH',name:'Philippines',code:'+63'},
    {iso:'ID',name:'Indonesia',code:'+62'},{iso:'MY',name:'Malaysia',code:'+60'},
    {iso:'TH',name:'Thailand',code:'+66'},{iso:'TR',name:'Turkey',code:'+90'},
    {iso:'IT',name:'Italy',code:'+39'},{iso:'ES',name:'Spain',code:'+34'},
    {iso:'NL',name:'Netherlands',code:'+31'},{iso:'SE',name:'Sweden',code:'+46'},
    {iso:'NO',name:'Norway',code:'+47'},{iso:'DK',name:'Denmark',code:'+45'},
    {iso:'CH',name:'Switzerland',code:'+41'},{iso:'AT',name:'Austria',code:'+43'},
    {iso:'BE',name:'Belgium',code:'+32'},{iso:'PL',name:'Poland',code:'+48'},
    {iso:'PT',name:'Portugal',code:'+351'},{iso:'NZ',name:'New Zealand',code:'+64'},
    {iso:'AR',name:'Argentina',code:'+54'},{iso:'CL',name:'Chile',code:'+56'},
    {iso:'CO',name:'Colombia',code:'+57'},{iso:'IL',name:'Israel',code:'+972'},
    {iso:'GH',name:'Ghana',code:'+233'},{iso:'KE',name:'Kenya',code:'+254'},
    {iso:'IE',name:'Ireland',code:'+353'},{iso:'RU',name:'Russia',code:'+7'},
    {iso:'UA',name:'Ukraine',code:'+380'},{iso:'BD',name:'Bangladesh',code:'+880'},
    {iso:'LK',name:'Sri Lanka',code:'+94'},{iso:'NP',name:'Nepal',code:'+977'},
    {iso:'VN',name:'Vietnam',code:'+84'},{iso:'PE',name:'Peru',code:'+51'},
  ];

  const phoneFlag     = document.getElementById('phoneFlag');
  const phoneCode     = document.getElementById('phoneCode');
  const phonePrefix   = document.getElementById('phonePrefix');
  const countryDD     = document.getElementById('countryDropdown');
  const countryList   = document.getElementById('countryList');
  const countrySearch = document.getElementById('countrySearch');

  function setCountry(iso, code) {
    phoneFlag.className = `phone-flag fi fi-${iso.toLowerCase()}`;
    phoneCode.textContent = code;
  }

  function renderCountryList(filter) {
    const q = (filter || '').toLowerCase();
    const filtered = q
      ? COUNTRIES.filter(c => c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q))
      : COUNTRIES;
    countryList.innerHTML = filtered.map(c =>
      `<div class="country-item" data-iso="${c.iso}" data-code="${c.code}">
        <span class="country-item-flag fi fi-${c.iso.toLowerCase()}"></span>
        <span>${c.name}</span>
        <span class="country-item-code">${c.code}</span>
      </div>`
    ).join('');
  }

  function openCountryDropdown() {
    countryDD.classList.add('open');
    countrySearch.value = '';
    renderCountryList('');
    setTimeout(() => countrySearch.focus(), 0);
  }

  function closeCountryDropdown() {
    countryDD.classList.remove('open');
  }

  phonePrefix.addEventListener('click', e => {
    e.stopPropagation();
    if (countryDD.classList.contains('open')) {
      closeCountryDropdown();
    } else {
      openCountryDropdown();
    }
  });

  countrySearch.addEventListener('input', () => {
    renderCountryList(countrySearch.value);
  });

  countrySearch.addEventListener('click', e => e.stopPropagation());

  countryList.addEventListener('click', e => {
    e.stopPropagation();
    const item = e.target.closest('.country-item');
    if (!item) return;
    setCountry(item.dataset.iso, item.dataset.code);
    closeCountryDropdown();
  });

  document.addEventListener('click', e => {
    if (!phonePrefix.contains(e.target)) closeCountryDropdown();
  });

  // Auto-detect country via IP
  fetch('https://ipinfo.io/json?token=')
    .then(r => r.json())
    .then(data => {
      const iso = (data.country || 'US').toUpperCase();
      const match = COUNTRIES.find(c => c.iso === iso);
      setCountry(iso, match ? match.code : '+1');
    })
    .catch(() => {});

  // Strip non-digit chars and enforce max 10 digits
  document.querySelectorAll('input[data-type="phone"]').forEach(el => {
    el.addEventListener('input', () => {
      let digits = el.value.replace(/\D/g, '');
      if (digits.length > 10) digits = digits.slice(0, 10);
      el.value = digits;
    });
  });

  document.querySelectorAll('.field-input, .field-textarea').forEach(el => {
    el.addEventListener('input', () => {
      const errorEl = document.getElementById(`${el.id}-error`);
      if (errorEl) showError(errorEl, '');
      el.classList.remove('has-error');
    });
  });

  // ── Keyboard shortcuts for option cards (A, B, C, D …) ──────────────────
  document.addEventListener('keydown', e => {
    // Skip if user is typing in an input/textarea
    const tag = document.activeElement.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

    const key = e.key.toUpperCase();
    if (key.length !== 1 || key < 'A' || key > 'Z') return;

    const activeStep = document.querySelector(`.step[data-step="${currentStep}"]`);
    if (!activeStep) return;

    // Find all option grids in the current step
    const grids = activeStep.querySelectorAll('.options-grid');
    grids.forEach(grid => {
      const cards = grid.querySelectorAll('.option-card');
      const index = key.charCodeAt(0) - 65; // A=0, B=1, C=2 …
      if (index < 0 || index >= cards.length) return;

      const card = cards[index];
      const mode = grid.dataset.mode;

      if (mode === 'single') {
        grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
      } else {
        card.classList.toggle('selected');
      }

      // Clear error on interaction
      const errorEl = document.getElementById(`${grid.dataset.name}-error`);
      showError(errorEl, '');
      grid.classList.remove('has-error');
    });
  });

  // ── Init ──────────────────────────────────────────────────────────────────
  formShell.classList.add('is-intro');
  goTo(1);
})();
