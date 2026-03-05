'use strict';

/* ═══════════════════════════════════════════════════════════
   MuscleOS — Contrôleur Principal
   4 modules : Calculateur · Bibliothèque · Programme · Suivi
═══════════════════════════════════════════════════════════ */

const APP = (() => {

  /* ─────────────────────────────────────────────
     ÉTAT GLOBAL
  ───────────────────────────────────────────── */
  const state = {
    // Calc
    age:0, sex:'male', height:0, weight:0, bodyfat:20,
    level:'beginner', activity:1.55, sessions:4, duration:60,
    goal:'lean', meals:3, dietaryProtein:80, wheyPerScoop:25, trainingTime:'afternoon',
    bmr:0, tdee:0, surplus:0, targetCalories:0,
    proteinNeed:0, proteinGap:0, scoopsNeeded:0,
    macros:{protein:0,fat:0,carbs:0},
    monthlyMuscleGain:0, fatRatio:0,

    // Programme généré
    generatedProgram: null,

    // Journal de progression (localStorage)
    logbook: [],

    // Timer
    timerSeconds: 90,
    timerRemaining: 90,
    timerInterval: null,
    timerRunning: false,
  };

  let calcStep = 1;
  const CALC_STEPS = 5;

  /* ─────────────────────────────────────────────
     NAVIGATION PAGES
  ───────────────────────────────────────────── */
  function goPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(b => b.classList.remove('active'));
    const page = document.getElementById('page-' + id);
    if (page) page.classList.add('active');
    document.querySelectorAll(`[data-page="${id}"]`).forEach(b => b.classList.add('active'));
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /* ─────────────────────────────────────────────
     UTILITAIRES
  ───────────────────────────────────────────── */
  function esc(s) {
    return String(s ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function safeNum(id, fb=0) {
    const v = parseFloat(document.getElementById(id)?.value);
    return isNaN(v) ? fb : v;
  }
  function radioVal(name, fb) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value ?? fb;
  }

  function toast(msg, type='error') {
    let t = document.getElementById('mos-toast');
    if (!t) {
      t = document.createElement('div'); t.id = 'mos-toast';
      Object.assign(t.style, {
        position:'fixed', bottom:'24px', left:'50%', transform:'translateX(-50%)',
        zIndex:'9999', fontFamily:"'DM Sans',sans-serif", fontSize:'0.86rem',
        fontWeight:'500', padding:'11px 22px', borderRadius:'100px',
        boxShadow:'0 8px 32px rgba(0,0,0,0.5)', transition:'opacity 0.3s',
        opacity:'0', pointerEvents:'none', maxWidth:'90vw', textAlign:'center',
      });
      document.body.appendChild(t);
    }
    t.style.background = type === 'ok' ? '#22c55e' : '#ef4444';
    t.style.color = '#fff';
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._t);
    t._t = setTimeout(() => { t.style.opacity = '0'; }, 3200);
  }

  function animBar(id, pct, delay=120) {
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.style.width = Math.min(100, pct).toFixed(1) + '%';
    }, delay);
  }

  /* ─────────────────────────────────────────────
     ══════════════════════════════════════════
     MODULE 1 — CALCULATEUR NUTRITION
     ══════════════════════════════════════════
  ───────────────────────────────────────────── */

  function bindSlider(id, displayId, fmt) {
    const el = document.getElementById(id);
    const dsp = document.getElementById(displayId);
    if (!el || !dsp) return;
    const upd = () => { dsp.textContent = fmt(el.value); };
    el.addEventListener('input', upd); upd();
  }

  function validateCalcStep(n) {
    if (n === 1) {
      const a = safeNum('age'), h = safeNum('height'), w = safeNum('weight');
      if (!a || a<14 || a>75) { toast('Âge invalide (14–75 ans)'); return false; }
      if (!h || h<140 || h>220) { toast('Taille invalide (140–220 cm)'); return false; }
      if (!w || w<40  || w>180) { toast('Poids invalide (40–180 kg)'); return false; }
    }
    return true;
  }

  function collectCalcStep(n) {
    if (n===1) {
      state.age=safeNum('age'); state.sex=document.getElementById('sex')?.value||'male';
      state.height=safeNum('height'); state.weight=safeNum('weight');
      state.bodyfat=safeNum('bodyfat',20); state.level=radioVal('level','beginner');
    }
    if (n===2) {
      state.activity=parseFloat(document.getElementById('activity')?.value)||1.55;
      state.sessions=safeNum('sessionsPerWeek',4);
      state.duration=safeNum('sessionDuration',60);
      state.goal=radioVal('goal','lean');
    }
    if (n===3) {
      state.meals=parseInt(document.getElementById('meals')?.value)||3;
      state.dietaryProtein=safeNum('dietaryProtein',0);
      state.wheyPerScoop=safeNum('wheyPerScoop',25);
      state.trainingTime=document.getElementById('trainingTime')?.value||'afternoon';
    }
  }

  function goCalcStep(n) {
    document.querySelectorAll('.step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('cstep'+n)?.classList.add('active');
    document.querySelectorAll('.step-node').forEach((nd,i) => {
      nd.classList.toggle('active', i+1===n);
      nd.classList.toggle('done', i+1<n);
    });
    const line = document.getElementById('stepLine');
    if (line) line.style.width = ((n-1)/(CALC_STEPS-1)*100).toFixed(0)+'%';
    calcStep=n;
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function nextCalcStep(n) {
    if (!validateCalcStep(n)) return;
    collectCalcStep(n); goCalcStep(n+1);
  }

  function runCalc() {
    collectCalcStep(1); collectCalcStep(2); collectCalcStep(3);
    if (!validateCalcStep(1)) { goCalcStep(1); return; }
    const {weight,height,age,sex,bodyfat,activity,sessions,duration,goal,level,dietaryProtein,wheyPerScoop} = state;

    state.bmr    = ALGO.calcBMR(weight,height,age,sex,bodyfat,true);
    state.tdee   = ALGO.calcTDEE(state.bmr,activity,sessions,duration,weight);
    state.surplus = ALGO.calcSurplus(goal,level,bodyfat,sex);
    state.targetCalories = state.tdee + state.surplus;
    state.proteinNeed  = ALGO.calcProteinNeed(weight,level,goal,bodyfat);
    state.proteinGap   = Math.max(0, state.proteinNeed-dietaryProtein);
    state.scoopsNeeded = Math.ceil(state.proteinGap/wheyPerScoop);
    state.monthlyMuscleGain = ALGO.calcMonthlyMuscleGain(level,sex,state.surplus,sessions);
    state.fatRatio = ALGO.calcFatRatio(state.surplus,bodyfat);
    state.macros   = ALGO.calcMacros(state.targetCalories,state.proteinNeed);

    renderCalcResults(); renderCalcProtein();
    goCalcStep(4);
  }

  function renderCalcResults() {
    const s = state;
    const m = s.macros;

    // Métriques
    document.getElementById('res-bmr').textContent  = s.bmr;
    document.getElementById('res-tdee').textContent = s.tdee;
    document.getElementById('res-kcal').textContent = s.targetCalories;
    document.getElementById('res-prot').textContent = s.proteinNeed;
    document.getElementById('res-surplus').textContent = '+'+s.surplus;
    document.getElementById('res-ratio').textContent = (s.proteinNeed/s.weight).toFixed(2)+'g/kg';

    // Macros bars
    const tot = m.protein*4 + m.fat*9 + m.carbs*4;
    document.getElementById('macro-p-g').textContent = m.protein+'g';
    document.getElementById('macro-c-g').textContent = m.carbs+'g';
    document.getElementById('macro-f-g').textContent = m.fat+'g';
    animBar('mb-p', m.protein*4/tot*100, 150);
    animBar('mb-c', m.carbs*4/tot*100, 250);
    animBar('mb-f', m.fat*9/tot*100, 350);

    // Stratégies
    renderStrategies();

    // Projection
    renderProjection();
  }

  function renderStrategies() {
    const s = state;
    const defs = [
      {id:'lean',      name:'Lean Bulk',  surplus:200, badge:'Propre',   risk:'Très faible', gain:'0.5–0.7 kg'},
      {id:'standard',  name:'Standard',   surplus:350, badge:'Équilibre',risk:'Modéré',      gain:'0.7–1.0 kg'},
      {id:'agressive', name:'Agressif',   surplus:550, badge:'Maximal',  risk:'Élevé',       gain:'0.9–1.4 kg'},
    ];
    const wrap = document.getElementById('strat-cards');
    if (!wrap) return;
    wrap.innerHTML = defs.map(d => `
      <div class="strategy-card ${esc(d.id)} ${d.id===s.goal?'selected':''}"
           data-goal="${esc(d.id)}" data-surplus="${d.surplus}"
           tabindex="0" role="button">
        <div class="check-icon">✓</div>
        <div class="strategy-badge">${esc(d.badge)}</div>
        <div class="strategy-name">${esc(d.name)}</div>
        <div class="strategy-range">+${d.surplus} kcal / jour</div>
        <div class="strategy-stat-row"><span>Gain/mois</span><strong>${esc(d.gain)}</strong></div>
        <div class="strategy-stat-row"><span>Graisse</span><strong>${esc(d.risk)}</strong></div>
        <div class="strategy-stat-row"><span>Total</span><strong>${s.tdee+d.surplus} kcal</strong></div>
      </div>`).join('');
    wrap.querySelectorAll('.strategy-card').forEach(c => {
      c.addEventListener('click', () => {
        wrap.querySelectorAll('.strategy-card').forEach(x => x.classList.remove('selected'));
        c.classList.add('selected');
        state.goal = c.dataset.goal;
        state.surplus = +c.dataset.surplus;
        state.targetCalories = state.tdee + state.surplus;
        state.monthlyMuscleGain = ALGO.calcMonthlyMuscleGain(state.level,state.sex,state.surplus,state.sessions);
        state.fatRatio = ALGO.calcFatRatio(state.surplus,state.bodyfat);
        renderProjection();
      });
    });
  }

  function renderProjection() {
    const mg = state.monthlyMuscleGain, fr = state.fatRatio;
    const proj = m => ({
      mus: (mg*m).toFixed(2),
      fat: (mg*m*(fr/(1-fr))).toFixed(2),
    });
    const p3=proj(3), p6=proj(6);
    const el = document.getElementById('proj-cards');
    if (!el) return;
    el.innerHTML = `
      <div class="proj-card">
        <div class="proj-period">3 mois</div>
        <div class="proj-muscle-val">+${esc(p3.mus)}</div>
        <div class="proj-muscle-unit">kg muscle estimé</div>
        <div class="proj-fat-note">+${esc(p3.fat)} kg graisse potentielle</div>
      </div>
      <div class="proj-card">
        <div class="proj-period">6 mois</div>
        <div class="proj-muscle-val">+${esc(p6.mus)}</div>
        <div class="proj-muscle-unit">kg muscle estimé</div>
        <div class="proj-fat-note">+${esc(p6.fat)} kg graisse potentielle</div>
      </div>`;
  }

  function renderCalcProtein() {
    const s = state;
    const pct = Math.min(100, Math.round(s.dietaryProtein/s.proteinNeed*100));
    document.getElementById('prot-need').textContent   = s.proteinNeed;
    document.getElementById('prot-diet').textContent   = s.dietaryProtein;
    document.getElementById('prot-gap').textContent    = s.proteinGap;
    document.getElementById('prot-scoops').textContent = s.scoopsNeeded;
    document.getElementById('prot-pct').textContent    = pct+'%';
    animBar('prot-bar-fill', pct, 200);

    // Timing
    const timing = buildTiming(s);
    const tbody = document.getElementById('timing-body');
    if (tbody) tbody.innerHTML = timing.map(r => `
      <tr>
        <td><span class="dot-indicator"><span class="dot ${esc(r.dot||'')}"></span>${esc(r.moment)}</span></td>
        <td><strong>${esc(r.amount)}g</strong> ${r.scoops>0?`(${r.scoops} scoop${r.scoops>1?'s':''})`:'(alim.)'}</td>
        <td style="color:var(--text3);font-size:0.8em">${r.advice}</td>
      </tr>`).join('');
  }

  function buildTiming(s) {
    const rows=[], wp=s.wheyPerScoop;
    let used=0;
    if (s.trainingTime==='morning') {
      rows.push({moment:'Pré-entraînement matin',amount:20,scoops:Math.ceil(20/wp),dot:'ice',advice:'Whey isolate 30 min avant séance'});
      used+=20;
    }
    const post=Math.min(40,Math.round(s.proteinGap*0.4));
    rows.push({moment:'Post-entraînement',amount:post,scoops:Math.ceil(post/wp),dot:'',advice:'Priorité absolue — fenêtre anabolique < 30 min'});
    used+=post;
    if (s.trainingTime==='evening') {
      rows.push({moment:'Pré-workout soir',amount:20,scoops:Math.ceil(20/wp),dot:'ice',advice:'1h avant la séance'});
      used+=20;
    }
    const rem=Math.max(0,s.proteinGap-used);
    if (rem>10) rows.push({moment:'Entre les repas',amount:rem,scoops:Math.ceil(rem/wp),dot:'gold',advice:`Répartir en ${Math.max(1,s.meals-2)} prise(s), toutes les 3–4h`});
    rows.push({moment:'Alimentation',amount:s.dietaryProtein,scoops:0,dot:'ok',advice:'Viandes, œufs, produits laitiers, légumineuses'});
    return rows;
  }

  /* ─────────────────────────────────────────────
     ══════════════════════════════════════════
     MODULE 2 — BIBLIOTHÈQUE D'EXERCICES
     ══════════════════════════════════════════
  ───────────────────────────────────────────── */
  let activeMuscleFilt = 'all';

  function initLibrary() {
    const fbar = document.getElementById('muscle-filters');
    if (!fbar) return;

    // Filtres muscles
    fbar.innerHTML = DATA.MUSCLES.map(m => `
      <button class="filter-btn ${m.id==='all'?'active':''}" data-muscle="${esc(m.id)}">
        ${m.icon} ${esc(m.label)}
      </button>`).join('');

    fbar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        fbar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeMuscleFilt = btn.dataset.muscle;
        renderExoGrid();
      });
    });

    renderExoGrid();
  }

  function renderExoGrid() {
    const grid = document.getElementById('exo-grid');
    if (!grid) return;
    const list = DATA.getByMuscle(activeMuscleFilt);

    if (!list.length) {
      grid.innerHTML = `<div class="empty-state span-2"><div class="empty-icon">🔍</div><div class="empty-title">Aucun exercice trouvé</div></div>`;
      return;
    }

    grid.innerHTML = list.map(e => `
      <div class="exo-card" data-exo="${esc(e.id)}" tabindex="0" role="button" aria-label="${esc(e.name)}">
        <div class="exo-card-thumb">
          <div class="exo-icon">${e.icon}</div>
          <div class="exo-muscle-tag">${esc(DATA.MUSCLES.find(m=>m.id===e.muscle)?.label||e.muscle)}</div>
          <div class="exo-diff-tag diff-${esc(e.difficulty)}">${esc(e.difficulty)}</div>
        </div>
        <div class="exo-body">
          <div class="exo-name">${esc(e.name)}</div>
          <div class="exo-muscles">${[e.muscle,...(e.secondary||[])].map(m=>DATA.MUSCLES.find(x=>x.id===m)?.label||m).join(' · ')}</div>
          <div class="exo-stats">
            <div class="exo-stat">📦 ${esc(e.equipment)}</div>
            <div class="exo-stat">🔁 ${esc(e.sets)} × ${esc(e.reps)}</div>
          </div>
        </div>
      </div>`).join('');

    grid.querySelectorAll('.exo-card').forEach(card => {
      const open = () => openExoModal(card.dataset.exo);
      card.addEventListener('click', open);
      card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' ') open(); });
    });
  }

  function openExoModal(id) {
    const e = DATA.getExercise(id);
    if (!e) return;
    const modal = document.getElementById('exo-modal');
    const overlay = document.getElementById('modal-overlay');
    if (!modal || !overlay) return;

    document.getElementById('modal-title').textContent = e.name;
    document.getElementById('modal-body').innerHTML = `
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
        <span class="exo-diff-tag diff-${esc(e.difficulty)}" style="position:static">${esc(e.difficulty)}</span>
        <span style="font-size:0.78rem;color:var(--text3)">📦 ${esc(e.equipment)}</span>
        <span style="font-size:0.78rem;color:var(--text3)">⏱️ ${e.rest}s de repos</span>
        <span style="font-size:0.78rem;color:var(--text3)">🔁 ${esc(e.sets)} séries × ${esc(e.reps)}</span>
      </div>
      <div class="section-label" style="margin-bottom:10px;">Exécution étape par étape</div>
      <div class="steps-list">
        ${e.steps.map((s,i) => `
          <div class="step-item">
            <div class="step-num">${i+1}</div>
            <div class="step-text"><strong>${esc(s.t)} —</strong> ${s.d}</div>
          </div>`).join('')}
      </div>
      ${e.tips ? `<div class="tip-box">💡 <strong>Pro tip :</strong> ${esc(e.tips)}</div>` : ''}
      <div style="margin-top:20px;">
        <button class="btn btn-primary" onclick="APP.startRestTimer(${e.rest})">
          ⏱️ Lancer le repos (${e.rest}s)
        </button>
      </div>`;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    document.getElementById('modal-overlay')?.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ─────────────────────────────────────────────
     ══════════════════════════════════════════
     MODULE 3 — GÉNÉRATEUR DE PROGRAMME
     ══════════════════════════════════════════
  ───────────────────────────────────────────── */
  let progGenStep = 1;

  function goProgStep(n) {
    document.querySelectorAll('.prog-step-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('pgstep'+n)?.classList.add('active');
    progGenStep = n;
  }

  function generateProgram() {
    const lvl  = radioVal('prog-level','beginner');
    const freq = parseInt(document.getElementById('prog-freq')?.value)||3;
    const goal = radioVal('prog-goal','mass');

    let template = 'fullbody3';
    if (lvl==='intermediate' || lvl==='advanced') {
      template = freq>=4 ? 'ul4' : 'ppl3';
    }
    if (lvl==='advanced' && freq>=4) template = 'ul4';

    state.generatedProgram = DATA.PROGRAM_TEMPLATES[template];
    renderProgram(state.generatedProgram);
    goProgStep(2);
  }

  function renderProgram(prog) {
    const el = document.getElementById('prog-result');
    if (!el || !prog) return;

    document.getElementById('prog-result-name').textContent = prog.name;
    document.getElementById('prog-result-desc').textContent = prog.description;

    el.innerHTML = prog.days.map((day, di) => `
      <div class="prog-day ${di===0?'open':''}" id="pday-${di}">
        <div class="prog-day-header" onclick="APP.toggleDay(${di})">
          <div class="prog-day-title">
            <span class="day-badge">Jour ${di+1}</span>
            ${esc(day.name)}
          </div>
          <svg class="prog-day-chevron" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
        <div class="prog-day-body">
          ${day.exos.map(ex => {
            const e = DATA.getExercise(ex.id);
            if (!e) return '';
            return `
              <div class="exo-row">
                <div class="exo-row-icon">${e.icon}</div>
                <div class="exo-row-info">
                  <div class="exo-row-name">${esc(e.name)}</div>
                  <div class="exo-row-detail">${esc(e.equipment)}</div>
                </div>
                <div class="exo-row-sets">${ex.sets}×${esc(ex.reps)}</div>
              </div>`;
          }).join('')}
          <div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;">
            ${day.exos.map(ex => {
              const e = DATA.getExercise(ex.id);
              if (!e) return '';
              return `<button class="btn btn-ghost btn-sm" onclick="APP.openExoById('${e.id}')">📖 ${esc(e.name)}</button>`;
            }).join('')}
          </div>
        </div>
      </div>`).join('');
  }

  function toggleDay(i) {
    const el = document.getElementById('pday-'+i);
    el?.classList.toggle('open');
  }

  function openExoById(id) { 
    closeModal();
    goPage('library');
    setTimeout(() => openExoModal(id), 50);
  }

  /* ─────────────────────────────────────────────
     ══════════════════════════════════════════
     MODULE 4 — SUIVI DE PROGRESSION
     ══════════════════════════════════════════
  ───────────────────────────────────────────── */
  function loadLogbook() {
    try { state.logbook = JSON.parse(localStorage.getItem('mos-logbook') || '[]'); }
    catch { state.logbook = []; }
  }

  function saveLogbook() {
    try { localStorage.setItem('mos-logbook', JSON.stringify(state.logbook)); }
    catch {}
  }

  function addLog() {
    const exoId   = document.getElementById('log-exo')?.value;
    const weight  = parseFloat(document.getElementById('log-weight')?.value);
    const reps    = parseInt(document.getElementById('log-reps')?.value);
    const sets    = parseInt(document.getElementById('log-sets')?.value);
    const date    = new Date().toLocaleDateString('fr-FR');

    if (!exoId || isNaN(weight) || isNaN(reps) || weight < 0 || reps <= 0) { 
      toast('Remplis correctement tous les champs (valeurs > 0)'); 
      return; 
    }

    const e = DATA.getExercise(exoId);
    const entry = {
      id: Date.now(),
      exoId, exoName: e?.name || exoId,
      weight, reps, sets: sets||1, date,
    };

    state.logbook.unshift(entry);
    saveLogbook();
    renderLogbook();
    toast('Séance enregistrée !', 'ok');

    // Reset
    ['log-weight','log-reps'].forEach(id => { const el=document.getElementById(id); if(el) el.value=''; });
  }

  function deleteLog(id) {
    state.logbook = state.logbook.filter(e => e.id !== id);
    saveLogbook(); renderLogbook();
  }

  function renderLogbook() {
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return;

    if (!state.logbook.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text3)">Aucune séance enregistrée</td></tr>`;
      return;
    }

    // Calculer les PRs par exercice
    const prs = {};
    state.logbook.forEach(e => {
      const vol = e.weight * e.reps;
      if (!prs[e.exoId] || vol > prs[e.exoId]) prs[e.exoId] = vol;
    });

    tbody.innerHTML = state.logbook.slice(0, 50).map(e => {
      const vol = e.weight * e.reps;
      const isPR = prs[e.exoId] === vol;
      return `
        <tr>
          <td>${esc(e.date)}</td>
          <td>${esc(e.exoName)}${isPR?'<span class="pr-badge">PR</span>':''}</td>
          <td><strong>${esc(e.weight)} kg</strong></td>
          <td>${esc(e.reps)} reps × ${esc(e.sets)} séries</td>
          <td>
            <button class="btn btn-ghost btn-sm" onclick="APP.deleteLog(${e.id})" aria-label="Supprimer">✕</button>
          </td>
        </tr>`;
    }).join('');
  }

  function initLogExoSelect() {
    const sel = document.getElementById('log-exo');
    if (!sel) return;
    const grouped = {};
    DATA.EXERCISES.forEach(e => {
      const m = DATA.MUSCLES.find(x=>x.id===e.muscle)?.label || e.muscle;
      if (!grouped[m]) grouped[m]=[];
      grouped[m].push(e);
    });
    sel.innerHTML = '<option value="">Sélectionner un exercice</option>' +
      Object.entries(grouped).map(([grp, exos]) =>
        `<optgroup label="${esc(grp)}">${exos.map(e=>`<option value="${esc(e.id)}">${esc(e.name)}</option>`).join('')}</optgroup>`
      ).join('');
  }

  /* ─────────────────────────────────────────────
     ══════════════════════════════════════════
     MODULE 5 — TIMER DE REPOS
     ══════════════════════════════════════════
  ───────────────────────────────────────────── */
  function setTimer(sec) {
    stopTimer();
    state.timerSeconds   = sec;
    state.timerRemaining = sec;
    updateTimerDisplay();
    // Marquer preset actif
    document.querySelectorAll('.timer-preset').forEach(b => {
      b.classList.toggle('active', +b.dataset.sec === sec);
    });
    goPage('timer');
  }

  function startRestTimer(sec) {
    closeModal();
    setTimer(sec);
    startTimer();
  }

  function startTimer() {
    if (state.timerRunning) return;
    state.timerRunning = true;
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = '⏸ Pause';

    state.timerInterval = setInterval(() => {
      state.timerRemaining--;
      updateTimerDisplay();

      if (state.timerRemaining <= 0) {
        stopTimer();
        timerDone();
      }
    }, 1000);
  }

  function pauseTimer() {
    if (!state.timerRunning) { startTimer(); return; }
    clearInterval(state.timerInterval);
    state.timerRunning = false;
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = '▶ Reprendre';
  }

  function stopTimer() {
    clearInterval(state.timerInterval);
    state.timerRunning = false;
  }

  function resetTimer() {
    stopTimer();
    state.timerRemaining = state.timerSeconds;
    updateTimerDisplay();
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = '▶ Démarrer';
  }

  function updateTimerDisplay() {
    const r = state.timerRemaining;
    const total = state.timerSeconds;
    const mins = Math.floor(r/60);
    const secs = r%60;
    const txt  = `${mins}:${String(secs).padStart(2,'0')}`;
    const pct  = r/total;
    const circ = 339;
    const offset = circ*(1-pct);

    const disp = document.getElementById('timer-ring-text');
    if (disp) disp.textContent = txt;

    const fill = document.getElementById('timer-ring-fill');
    if (fill) {
      fill.style.strokeDashoffset = offset;
      fill.className = 'timer-ring-fill' + (r<=10&&r>0?' warning':'') + (r<=0?' done':'');
    }
  }

  function timerDone() {
    const disp = document.getElementById('timer-ring-text');
    if (disp) disp.textContent = '✓';
    const btn = document.getElementById('timer-start');
    if (btn) btn.textContent = '▶ Démarrer';
    // Vibration si dispo
    if ('vibrate' in navigator) navigator.vibrate([200,100,200]);
  }

  /* ─────────────────────────────────────────────
     INIT GLOBAL
  ───────────────────────────────────────────── */
  function init() {
    // Navigation
    document.querySelectorAll('[data-page]').forEach(btn => {
      btn.addEventListener('click', () => goPage(btn.dataset.page));
    });

    // Sliders calc
    bindSlider('bodyfat','bfVal', v=>v+'%');
    bindSlider('sessionsPerWeek','spwVal', v=>v+(v>1?' séances':' séance'));
    bindSlider('sessionDuration','sdVal', v=>v+' min');

    // Calc buttons
    const bind = (id, fn) => { document.getElementById(id)?.addEventListener('click', fn); };
    bind('btn-c1-next',   () => nextCalcStep(1));
    bind('btn-c2-back',   () => goCalcStep(1));
    bind('btn-c2-next',   () => nextCalcStep(2));
    bind('btn-c3-back',   () => goCalcStep(2));
    bind('btn-calculate', runCalc);
    bind('btn-c4-back',   () => goCalcStep(3));
    bind('btn-c4-next',   () => goCalcStep(5));
    bind('btn-c5-back',   () => goCalcStep(4));
    bind('btn-print',     () => window.print());

    // Step nodes (click pour retour)
    document.querySelectorAll('.step-node').forEach((nd,i) => {
      nd.addEventListener('click', () => { if(i+1<=calcStep) goCalcStep(i+1); });
    });

    // Bibliothèque
    initLibrary();

    // Programme
    bind('btn-gen-prog', generateProgram);
    bind('btn-prog-back', () => goProgStep(1));

    // Suivi
    loadLogbook();
    initLogExoSelect();
    renderLogbook();
    bind('btn-add-log', addLog);

    // Modal
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });

    // Timer
    document.querySelectorAll('.timer-preset').forEach(btn => {
      btn.addEventListener('click', () => setTimer(+btn.dataset.sec));
    });
    bind('timer-start',  () => { state.timerRunning ? pauseTimer() : startTimer(); });
    bind('timer-reset',  resetTimer);

    // Init étapes
    goCalcStep(1);
    goPage('calc');
    updateTimerDisplay();
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // API publique
  return { goPage, toggleDay, openExoById, deleteLog, setTimer, setTimerPreset: setTimer, startRestTimer };

})();