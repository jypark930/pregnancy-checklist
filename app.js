// ============================================================
// 임신 체크리스트 - 메인 앱 로직 (Supabase 동기화 연동)
// ============================================================

// ─── Supabase Configuration ──────────────────────────────────
const SUPABASE_URL = "https://eajpkydtyxmxsyhzqgho.supabase.co";
const SUPABASE_KEY = "sb_publishable_s1vL9ya3BKvYWtqvDiE4pw_yfXZqig5";
let supabaseClient = null;
let familyCode = localStorage.getItem('family_code') || '';
let syncChannel = null;

// ─── State ──────────────────────────────────────────────────
let checklistData = [];
let showCompleted = false;
let editTarget = null;    // { weekIndex, itemIndex }
let addTarget = null;     // { weekIndex }

const STORAGE_KEY = 'pregnancy-checklist-v1';

// ─── Init ────────────────────────────────────────────────────
function init() {
  loadData();
  renderAll();
  bindGlobalEvents();
  injectSvgDefs();
  initSupabase();
}

// ─── Storage ─────────────────────────────────────────────────
function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      checklistData = JSON.parse(saved);
    } else {
      checklistData = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_DATA));
    }
  } catch(e) {
    checklistData = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_DATA));
  }
}

function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistData));
  uploadToSupabase();
}

function saveDataLocallyOnly() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(checklistData));
}

// ─── Render ───────────────────────────────────────────────────
function renderAll() {
  renderWeekList();
  updateProgress();
}

function renderWeekList() {
  const container = document.getElementById('week-list');
  const emptyState = document.getElementById('empty-state');
  container.innerHTML = '';

  let prevTrimester = null;
  let visibleCount = 0;

  checklistData.forEach((week, wi) => {
    const allDone = week.items.length > 0 && week.items.every(it => it.done);
    const isHidden = allDone && !showCompleted;

    // Trimester divider
    if (!isHidden && week.trimester !== prevTrimester) {
      container.appendChild(makeTrimesterDivider(week.trimester));
      prevTrimester = week.trimester;
    }

    const card = makeWeekCard(week, wi, allDone, isHidden);
    container.appendChild(card);
    if (!isHidden) visibleCount++;
  });

  if (visibleCount === 0) {
    emptyState.style.display = 'block';
    container.style.display = 'none';
  } else {
    emptyState.style.display = 'none';
    container.style.display = 'flex';
  }
}

function makeTrimesterDivider(trimester) {
  const labels = { 1: '1분기 (5~12주)', 2: '2분기 (13~27주)', 3: '3분기 (28~40주)' };
  const div = document.createElement('div');
  div.className = 'trimester-divider';
  div.innerHTML = `
    <div class="trimester-divider-line"></div>
    <span class="trimester-label">${labels[trimester] || ''}</span>
    <div class="trimester-divider-line"></div>
  `;
  return div;
}

function makeWeekCard(week, wi, allDone, isHidden) {
  const done = week.items.filter(it => it.done).length;
  const total = week.items.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const card = document.createElement('div');
  card.className = `week-card${allDone ? ' all-done' : ''}${isHidden ? ' hidden-done' : ''}`;
  card.setAttribute('data-week-index', wi);

  // Gradient for badge based on trimester
  const gradients = {
    1: 'linear-gradient(135deg, #f9a8d4 0%, #c084fc 100%)',
    2: 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)',
    3: 'linear-gradient(135deg, #34d399 0%, #3b82f6 100%)'
  };
  const gradient = allDone
    ? 'linear-gradient(135deg, #6ee7b7 0%, #34d399 100%)'
    : (gradients[week.trimester] || gradients[1]);

  const isNumeric = !isNaN(week.week);
  const badgeNum = week.week;
  const badgeUnit = isNumeric ? '주차' : '';
  const numFontSize = isNumeric ? '18px' : '11px';
  const labelText = isNumeric ? `${week.week}주차` : week.week;

  card.innerHTML = `
    <div class="week-header" id="week-header-${wi}" role="button" tabindex="0"
         aria-expanded="false" aria-controls="week-body-${wi}">
      <div class="week-badge" style="background:${gradient}">
        <span class="week-badge-num" style="font-size:${numFontSize}">${badgeNum}</span>
        <span class="week-badge-unit">${badgeUnit}</span>
      </div>
      <div class="week-header-info">
        <div class="week-title">${week.title}</div>
        <div class="week-progress-text">${done}/${total} 완료</div>
        <div class="week-progress-bar-wrap">
          <div class="week-progress-bar" style="width:${pct}%"></div>
        </div>
      </div>
      <div class="week-header-right">
        <span class="done-badge">✓ 완료</span>
        <svg class="week-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M6 9l6 6 6-6"/>
        </svg>
      </div>
    </div>
    <div class="week-body" id="week-body-${wi}">
      <div class="item-list" id="item-list-${wi}">
        ${week.items.map((item, ii) => makeItemHTML(item, wi, ii)).join('')}
      </div>
      <div class="add-item-row">
        <button class="add-item-btn" id="add-btn-${wi}" aria-label="${labelText} 항목 추가">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
          미션 추가하기
        </button>
      </div>
    </div>
  `;

  // Header click → toggle expand
  const header = card.querySelector(`#week-header-${wi}`);
  header.addEventListener('click', () => toggleWeek(card, wi));
  header.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleWeek(card, wi); }
  });

  // Add button
  card.querySelector(`#add-btn-${wi}`).addEventListener('click', (e) => {
    e.stopPropagation();
    openAddModal(wi);
  });

  // Item events
  bindItemEvents(card, wi);

  return card;
}

function makeItemHTML(item, wi, ii) {
  const catClass = `cat-${item.category}`;
  const catLabels = {
    health: '🏥 건강', prep: '🎒 준비물', admin: '📝 행정',
    baby: '👶 아기용품', mental: '💆 정서', etc: '💡 기타'
  };
  return `
    <div class="checklist-item${item.done ? ' done' : ''}"
         id="item-${wi}-${ii}" data-item-index="${ii}">
      <button class="item-check-btn${item.done ? ' checked' : ''}"
              id="check-btn-${wi}-${ii}"
              aria-label="${item.text} ${item.done ? '완료됨' : '미완료'}"
              data-wi="${wi}" data-ii="${ii}">
      </button>
      <div class="item-content">
        <span class="item-category-tag ${catClass}">${catLabels[item.category] || item.category}</span>
        <div class="item-text">${escapeHTML(item.text)}</div>
      </div>
      <div class="item-actions">
        <button class="item-action-btn edit-btn"
                id="edit-btn-${wi}-${ii}"
                title="편집" aria-label="편집"
                data-wi="${wi}" data-ii="${ii}">✏️</button>
        <button class="item-action-btn delete-btn"
                id="del-btn-${wi}-${ii}"
                title="삭제" aria-label="삭제"
                data-wi="${wi}" data-ii="${ii}">🗑️</button>
      </div>
    </div>
  `;
}

function bindItemEvents(card, wi) {
  // Check buttons
  card.querySelectorAll('.item-check-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ii = parseInt(btn.dataset.ii);
      toggleItem(wi, ii);
    });
  });

  // Edit buttons
  card.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ii = parseInt(btn.dataset.ii);
      openEditModal(wi, ii);
    });
  });

  // Delete buttons
  card.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const ii = parseInt(btn.dataset.ii);
      deleteItem(wi, ii);
    });
  });
}

function toggleWeek(card, wi) {
  const isExpanded = card.classList.contains('expanded');
  // Collapse all others
  document.querySelectorAll('.week-card.expanded').forEach(c => {
    if (c !== card) {
      c.classList.remove('expanded');
      c.querySelector('.week-header').setAttribute('aria-expanded', 'false');
    }
  });
  card.classList.toggle('expanded', !isExpanded);
  card.querySelector('.week-header').setAttribute('aria-expanded', String(!isExpanded));

  // Smooth scroll on mobile
  if (!isExpanded) {
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  }
}

// ─── Item Actions ─────────────────────────────────────────────
function toggleItem(wi, ii) {
  const item = checklistData[wi].items[ii];
  item.done = !item.done;
  saveData();

  const wasAllDone = checklistData[wi].items.every(it => it.done);
  if (wasAllDone && !showCompleted) {
    // All done in this week → collapse and re-render
    const label = !isNaN(checklistData[wi].week) ? `${checklistData[wi].week}주차` : checklistData[wi].week;
    showToast(`🎉 ${label} 모든 미션 완료!`);
    triggerConfetti();
    setTimeout(() => { renderAll(); }, 600);
  } else {
    // Partial update: just re-render the card
    rerenderWeekCard(wi);
    updateProgress();
  }
}

function deleteItem(wi, ii) {
  if (!confirm('이 항목을 삭제할까요?')) return;
  checklistData[wi].items.splice(ii, 1);
  saveData();
  rerenderWeekCard(wi);
  updateProgress();
  showToast('🗑️ 항목이 삭제되었습니다');
}

function rerenderWeekCard(wi) {
  const week = checklistData[wi];
  const allDone = week.items.length > 0 && week.items.every(it => it.done);
  const isHidden = allDone && !showCompleted;
  const oldCard = document.querySelector(`.week-card[data-week-index="${wi}"]`);
  if (!oldCard) return;

  const wasExpanded = oldCard.classList.contains('expanded');
  const newCard = makeWeekCard(week, wi, allDone, isHidden);
  if (wasExpanded) {
    newCard.classList.add('expanded');
    newCard.querySelector('.week-header').setAttribute('aria-expanded', 'true');
  }
  oldCard.replaceWith(newCard);
}

// ─── Progress ─────────────────────────────────────────────────
function updateProgress() {
  let total = 0, completed = 0;
  checklistData.forEach(week => {
    total += week.items.length;
    completed += week.items.filter(it => it.done).length;
  });

  document.getElementById('completed-count').textContent = completed;
  document.getElementById('total-count').textContent = total;

  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  document.getElementById('main-progress-bar').style.width = pct + '%';
  document.getElementById('progress-percent-text').textContent = pct + '%';

  const circumference = 251.2;
  const offset = circumference - (pct / 100) * circumference;
  document.getElementById('progress-ring-fill').style.strokeDashoffset = offset;

  let sub = '';
  if (pct === 0) sub = '첫 번째 미션을 완료해보세요! 🎉';
  else if (pct < 30) sub = `훌륭해요! 임신 여정이 시작됐어요 💕`;
  else if (pct < 60) sub = `절반 이상 왔어요! 잘 하고 있어요 ✨`;
  else if (pct < 100) sub = `거의 다 왔어요! 조금만 더 힘내요 🌸`;
  else sub = `완벽해요! 모든 미션을 완료했어요 🎊`;
  document.getElementById('progress-sub-text').textContent = sub;
}

// ─── Modal: Edit ──────────────────────────────────────────────
function openEditModal(wi, ii) {
  editTarget = { wi, ii };
  const item = checklistData[wi].items[ii];
  document.getElementById('modal-input').value = item.text;
  document.getElementById('modal-category').value = item.category;
  const label = !isNaN(checklistData[wi].week) ? `${checklistData[wi].week}주차` : checklistData[wi].week;
  document.getElementById('modal-title').textContent = `${label} 항목 편집`;
  showModal('modal-overlay');
  setTimeout(() => document.getElementById('modal-input').focus(), 100);
}

function closeEditModal() {
  editTarget = null;
  hideModal('modal-overlay');
}

function confirmEdit() {
  if (!editTarget) return;
  const text = document.getElementById('modal-input').value.trim();
  if (!text) { shakeModal('edit-modal'); return; }
  const { wi, ii } = editTarget;
  checklistData[wi].items[ii].text = text;
  checklistData[wi].items[ii].category = document.getElementById('modal-category').value;
  saveData();
  closeEditModal();
  rerenderWeekCard(wi);
  showToast('✏️ 항목이 수정되었습니다');
}

// ─── Modal: Add ───────────────────────────────────────────────
function openAddModal(wi) {
  addTarget = { wi };
  document.getElementById('add-modal-input').value = '';
  document.getElementById('add-modal-category').value = 'health';
  const label = !isNaN(checklistData[wi].week) ? `${checklistData[wi].week}주차` : checklistData[wi].week;
  document.getElementById('add-modal-title').textContent = `${label} 미션 추가`;
  showModal('add-modal-overlay');
  setTimeout(() => document.getElementById('add-modal-input').focus(), 100);
}

// ─── Modal: Add ───────────────────────────────────────────────
function closeAddModal() {
  addTarget = null;
  hideModal('add-modal-overlay');
}

function confirmAdd() {
  if (!addTarget) return;
  const text = document.getElementById('add-modal-input').value.trim();
  if (!text) { shakeModal('add-modal'); return; }
  const { wi } = addTarget;
  const weekCleanId = checklistData[wi].week.toString().replace(/\s+/g, '');
  const newId = `w${weekCleanId}_custom_${Date.now()}`;
  checklistData[wi].items.push({
    id: newId,
    text,
    category: document.getElementById('add-modal-category').value,
    done: false
  });
  saveData();
  closeAddModal();
  rerenderWeekCard(wi);
  updateProgress();

  // Make sure card is expanded
  const card = document.querySelector(`.week-card[data-week-index="${wi}"]`);
  if (card && !card.classList.contains('expanded')) {
    toggleWeek(card, wi);
  }

  showToast('✅ 새 미션이 추가되었습니다');
}

// ─── Modal Helpers ────────────────────────────────────────────
function showModal(overlayId) {
  document.getElementById(overlayId).classList.add('active');
  document.body.style.overflow = 'hidden';
}
function hideModal(overlayId) {
  document.getElementById(overlayId).classList.remove('active');
  document.body.style.overflow = '';
}
function shakeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.style.animation = 'none';
  modal.offsetHeight;
  modal.style.animation = 'shake 0.4s ease';
  setTimeout(() => modal.style.animation = '', 400);
}

// ─── Global Events ────────────────────────────────────────────
function bindGlobalEvents() {
  // Edit modal
  document.getElementById('modal-close-btn').addEventListener('click', closeEditModal);
  document.getElementById('modal-cancel-btn').addEventListener('click', closeEditModal);
  document.getElementById('modal-confirm-btn').addEventListener('click', confirmEdit);
  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeEditModal();
  });
  document.getElementById('modal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmEdit(); }
  });

  // Add modal
  document.getElementById('add-modal-close-btn').addEventListener('click', closeAddModal);
  document.getElementById('add-modal-cancel-btn').addEventListener('click', closeAddModal);
  document.getElementById('add-modal-confirm-btn').addEventListener('click', confirmAdd);
  document.getElementById('add-modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('add-modal-overlay')) closeAddModal();
  });
  document.getElementById('add-modal-input').addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); confirmAdd(); }
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      closeEditModal();
      closeAddModal();
    }
  });

  // Show completed toggle
  document.getElementById('show-completed-toggle').addEventListener('change', e => {
    showCompleted = e.target.checked;
    renderWeekList();
  });

  // Expand/collapse all
  document.getElementById('expand-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.week-card:not(.hidden-done)').forEach(card => {
      card.classList.add('expanded');
      card.querySelector('.week-header').setAttribute('aria-expanded', 'true');
    });
  });
  document.getElementById('collapse-all-btn').addEventListener('click', () => {
    document.querySelectorAll('.week-card').forEach(card => {
      card.classList.remove('expanded');
      card.querySelector('.week-header').setAttribute('aria-expanded', 'false');
    });
  });

  // Reset all (empty state)
  document.getElementById('reset-all-btn').addEventListener('click', () => {
    if (!confirm('모든 진행 사항을 초기화할까요?')) return;
    checklistData = JSON.parse(JSON.stringify(DEFAULT_CHECKLIST_DATA));
    saveData();
    showCompleted = false;
    document.getElementById('show-completed-toggle').checked = false;
    renderAll();
    showToast('🔄 초기화되었습니다');
  });

  // CTA smooth scroll
  document.getElementById('start-btn').addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('checklist-section').scrollIntoView({ behavior: 'smooth' });
  });

  // Supabase Sync Events
  document.getElementById('connect-sync-btn').addEventListener('click', () => {
    const val = document.getElementById('sync-code-input').value.trim();
    if (!val) { showToast("⚠️ 코드를 입력해 주세요"); return; }
    connectSyncCode(val);
  });
  document.getElementById('create-sync-btn').addEventListener('click', () => {
    generateSyncCode();
  });
  document.getElementById('copy-code-btn').addEventListener('click', () => {
    if (!familyCode) return;
    navigator.clipboard.writeText(familyCode)
      .then(() => showToast("📋 코드가 복사되었습니다! 배우자에게 전달하세요."))
      .catch(() => showToast("❌ 복사에 실패했습니다. 직접 복사해 주세요."));
  });
  document.getElementById('disconnect-sync-btn').addEventListener('click', () => {
    if (confirm("연결을 해제할까요? 로컬 데이터는 유지되지만 동기화가 중단됩니다.")) {
      disconnectSync();
    }
  });
}

// ─── Supabase Sync Logic ──────────────────────────────────────
function initSupabase() {
  if (window.supabase) {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    updateSyncUI();
    if (familyCode) {
      downloadFromSupabase();
      subscribeToRealtime();
    }
  } else {
    console.warn("Supabase SDK is not loaded.");
    setSyncStatusText("⚠️ 동기화 플러그인 로드 실패");
  }
}

function setSyncStatusText(text) {
  const el = document.getElementById('sync-status-text');
  if (el) el.textContent = text;
}

function updateSyncUI() {
  const syncActions = document.getElementById('sync-actions');
  const syncConnectedPanel = document.getElementById('sync-connected-panel');
  const currentCodeDisplay = document.getElementById('current-code-display');
  
  if (familyCode) {
    syncActions.style.display = 'none';
    syncConnectedPanel.style.display = 'flex';
    currentCodeDisplay.textContent = familyCode;
    setSyncStatusText("☁️ 동기화 연결됨");
  } else {
    syncActions.style.display = 'flex';
    syncConnectedPanel.style.display = 'none';
    setSyncStatusText("💡 코드를 만들어 가족과 동기화하세요");
  }
}

async function uploadToSupabase() {
  if (!supabaseClient || !familyCode) return;
  setSyncStatusText("☁️ 동기화 업로드 중...");
  
  try {
    const { error } = await supabaseClient
      .from('pregnancy_checklists')
      .upsert({
        family_code: familyCode,
        checklist_data: checklistData,
        updated_at: new Date().toISOString()
      });
      
    if (error) {
      console.error("Supabase upload error:", error);
      setSyncStatusText("❌ 동기화 실패 (서버 오류)");
    } else {
      setSyncStatusText("☁️ 실시간 동기화 완료");
    }
  } catch (e) {
    console.error("Network error during upload:", e);
    setSyncStatusText("❌ 오프라인 상태 (네트워크 확인)");
  }
}

async function downloadFromSupabase() {
  if (!supabaseClient || !familyCode) return;
  setSyncStatusText("☁️ 서버에서 데이터 가져오는 중...");
  
  try {
    const { data, error } = await supabaseClient
      .from('pregnancy_checklists')
      .select('checklist_data')
      .eq('family_code', familyCode)
      .single();
      
    if (error) {
      // Row not found (PGRST116)
      if (error.code === 'PGRST116') {
        console.log("No remote data found for this code. Uploading local state as default...");
        await uploadToSupabase();
      } else {
        console.error("Supabase download error:", error);
        setSyncStatusText("❌ 데이터 불러오기 실패");
      }
    } else if (data && data.checklist_data) {
      checklistData = data.checklist_data;
      saveDataLocallyOnly();
      renderAll();
      setSyncStatusText("☁️ 실시간 동기화 완료");
      showToast("☁️ 최신 데이터를 동기화했습니다.");
    }
  } catch (e) {
    console.error("Network error during download:", e);
    setSyncStatusText("❌ 불러오기 실패 (오프라인)");
  }
}

function subscribeToRealtime() {
  if (!supabaseClient || !familyCode) return;
  if (syncChannel) {
    supabaseClient.removeChannel(syncChannel);
  }
  
  syncChannel = supabaseClient
    .channel('public:pregnancy_checklists')
    .on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'pregnancy_checklists',
      filter: `family_code=eq.${familyCode}`
    }, payload => {
      console.log("Realtime event received:", payload);
      if (payload.new && payload.new.checklist_data) {
        checklistData = payload.new.checklist_data;
        saveDataLocallyOnly();
        renderAll();
        showToast("☁️ 공동 양육자가 체크리스트를 업데이트했습니다!");
      }
    })
    .subscribe();
}

async function connectSyncCode(code) {
  familyCode = code;
  localStorage.setItem('family_code', familyCode);
  updateSyncUI();
  await downloadFromSupabase();
  subscribeToRealtime();
}

async function generateSyncCode() {
  // Generate random code: baby-xxxx
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const code = `baby-${randNum}`;
  if (confirm(`새 가족 코드를 생성할까요?\n코드: [ ${code} ]\n이 코드를 배우자 기기에 입력하면 공동 동기화가 시작됩니다.`)) {
    familyCode = code;
    localStorage.setItem('family_code', familyCode);
    updateSyncUI();
    await uploadToSupabase();
    subscribeToRealtime();
  }
}

function disconnectSync() {
  if (syncChannel) {
    supabaseClient.removeChannel(syncChannel);
    syncChannel = null;
  }
  familyCode = '';
  localStorage.removeItem('family_code');
  updateSyncUI();
  showToast("🔌 동기화 연결이 해제되었습니다.");
}

// ─── Toast ────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ─── Confetti ─────────────────────────────────────────────────
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#e879a0', '#f9a8d4', '#a78bfa', '#c4b5fd', '#fde68a', '#6ee7b7', '#60a5fa'];

  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (frame > 60) p.opacity -= 0.015;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.translate(p.x + p.w / 2, p.y + p.h / 2);
      ctx.rotate(p.rotation * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.roundRect(-p.w/2, -p.h/2, p.w, p.h, 2);
      ctx.fill();
      ctx.restore();
    });
    frame++;
    if (frame < 120) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ─── SVG Gradient Defs ────────────────────────────────────────
function injectSvgDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `
    <defs>
      <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#e879a0"/>
        <stop offset="100%" stop-color="#a78bfa"/>
      </linearGradient>
    </defs>
  `;
  document.body.prepend(svg);
}

// ─── Utility ──────────────────────────────────────────────────
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// Shake animation
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}
`;
document.head.appendChild(shakeStyle);

// ─── Run ──────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
