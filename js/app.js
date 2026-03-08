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

    // Auto-save calculation
    saveCalcHistory();

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

    // Get muscle image from mapping
    const muscleImage = document.querySelector('[data-muscle-images]')?.dataset.muscleImages || {};

    // Build video section if available
    const videoSection = e.video ? `
      <div style="margin-bottom:20px;">
        <div class="section-label">📹 Vidéo de démonstration</div>
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:var(--r-lg);margin-bottom:12px;">
          <iframe
            style="position:absolute;top:0;left:0;width:100%;height:100%;"
            src="https://www.youtube.com/embed/${esc(e.video)}"
            title="${esc(e.name)}"
            frameborder="0"
            allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture"
            allowfullscreen>
          </iframe>
        </div>
      </div>` : '';

    // Build image gallery if available
    const imageGallery = e.images && e.images.length > 0 ? `
      <div style="margin-bottom:20px;">
        <div class="section-label">🖼️ Galerie d'exécution</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-bottom:12px;">
          ${e.images.map((img, idx) => `
            <img
              src="${img}"
              alt="Étape ${idx+1}"
              style="width:100%;height:120px;object-fit:cover;border-radius:var(--r-md);cursor:pointer;transition:transform 0.2s;"
              onclick="this.style.transform = this.style.transform === 'scale(1.5)' ? 'scale(1)' : 'scale(1.5)'; this.style.zIndex = this.style.transform === 'scale(1)' ? 'auto' : '999';"
              title="Clique pour agrandir">
          `).join('')}
        </div>
      </div>` : '';

    document.getElementById('modal-title').textContent = e.name;
    document.getElementById('modal-body').innerHTML = `
      <div class="modal-image" style="width:100%;height:240px;background:var(--surface2);border-radius:var(--r-lg);margin-bottom:20px;overflow:hidden;display:flex;align-items:center;justify-content:center;">
        <img src="${e.images && e.images[0] ? e.images[0] : 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop'}" alt="${esc(e.name)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22%3E%3Crect fill=%22%23333%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2240%22 fill=%22%23999%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22%3E${esc(e.muscle.toUpperCase())}%3C/text%3E%3C/svg%3E'">
      </div>

      ${videoSection}
      ${imageGallery}

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

    // Afficher infos principales
    document.getElementById('prog-result-name').textContent = prog.name;
    document.getElementById('prog-result-desc').textContent = prog.description;

    // Afficher focus global (avant le HTML des jours)
    const focusHTML = `
      <div style="background:var(--surface2); padding:12px; border-radius:var(--r-lg); margin-bottom:20px; border-left:3px solid var(--fire);">
        <div style="font-size:0.85rem; color:var(--text3); margin-bottom:4px;">📌 FOCUS</div>
        <div style="font-weight:600; color:var(--text);">${prog.focus || prog.description}</div>
      </div>`;

    // Render chaque jour
    const daysHTML = prog.days.map((day, di) => {
      const dayNotes = day.notes ? `<div style="font-size:0.75rem; color:var(--fire); margin-bottom:12px; padding:8px; background:rgba(249,115,22,0.1); border-radius:var(--r-md);">${day.notes}</div>` : '';

      return `
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
          ${dayNotes}
          ${day.exos.map((ex, ei) => {
            const e = DATA.getExercise(ex.id);
            if (!e) return '';
            const tempo = ex.tempo ? `<div style="font-size:0.7rem; color:var(--text3);">⏱️ ${ex.tempo}</div>` : '';
            const exoNotes = ex.notes ? `<div style="font-size:0.72rem; color:var(--ice); margin-top:4px;">${ex.notes}</div>` : '';
            return `
              <div style="border-bottom:1px solid var(--border); padding:12px 0; ${ei === day.exos.length - 1 ? 'border-bottom:none;' : ''}">
                <div class="exo-row">
                  <div class="exo-row-icon">${e.icon}</div>
                  <div class="exo-row-info" style="flex:1;">
                    <div class="exo-row-name">${esc(e.name)}</div>
                    <div class="exo-row-detail" style="font-size:0.7rem;">${esc(e.equipment)}</div>
                    ${tempo}
                  </div>
                  <div style="text-align:right;">
                    <div class="exo-row-sets">${ex.sets}×${esc(ex.reps)}</div>
                    <div style="font-size:0.7rem; color:var(--text3); margin-top:2px;">${ex.rest}s repos</div>
                  </div>
                </div>
                ${exoNotes}
              </div>`;
          }).join('')}
          <div style="margin-top:16px;display:flex;gap:6px;flex-wrap:wrap;">
            ${day.exos.map(ex => {
              const e = DATA.getExercise(ex.id);
              if (!e) return '';
              return `<button class="btn btn-ghost btn-sm" onclick="APP.openExoById('${e.id}')">📖 ${esc(e.name)}</button>`;
            }).join('')}
          </div>
        </div>
      </div>`;
    }).join('');

    el.innerHTML = focusHTML + daysHTML;
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

  // ─── CALCULATOR HISTORY ─────────────────────────────────────
  function saveCalcHistory(calcResult) {
    try {
      const history = JSON.parse(localStorage.getItem('mos-calc-history') || '[]');
      const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('fr-FR'),
        timestamp: Date.now(),
        age: state.age,
        weight: state.weight,
        height: state.height,
        bodyfat: state.bodyfat,
        level: state.level,
        goal: state.goal,
        activity: state.activity,
        sessions: state.sessions,
        bmr: state.bmr,
        tdee: state.tdee,
        targetCalories: state.targetCalories,
        surplus: state.surplus,
        proteinNeed: state.proteinNeed,
        macros: state.macros,
        monthlyMuscleGain: state.monthlyMuscleGain
      };
      history.unshift(entry); // Add to beginning
      if (history.length > 50) history.pop(); // Keep last 50
      localStorage.setItem('mos-calc-history', JSON.stringify(history));

      // Sync if authenticated
      if (window.AUTH && AUTH.isAuthenticated()) {
        AUTH.syncCalculations(history);
      }
    } catch {}
  }

  function loadCalcHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('mos-calc-history') || '[]');
      return history;
    } catch { return []; }
  }

  function restoreCalcHistoryEntry(id) {
    try {
      const history = loadCalcHistory();
      const entry = history.find(e => e.id === id);
      if (!entry) return false;

      // Restore state
      state.age = entry.age;
      state.weight = entry.weight;
      state.height = entry.height;
      state.bodyfat = entry.bodyfat;
      state.level = entry.level;
      state.goal = entry.goal;
      state.activity = entry.activity;
      state.sessions = entry.sessions;

      // Update form
      document.getElementById('age').value = entry.age;
      document.getElementById('weight').value = entry.weight;
      document.getElementById('height').value = entry.height;
      document.getElementById('bodyfat').value = entry.bodyfat;
      document.getElementById('activity').value = entry.activity;
      document.getElementById('bodyfat').value = entry.bodyfat;

      // Update slider values
      document.getElementById('bfVal').textContent = entry.bodyfat + '%';
      document.getElementById('spwVal').textContent = entry.sessions + ' séances';

      // Set radio buttons
      document.querySelector(`input[name="level"][value="${entry.level}"]`).checked = true;
      document.querySelector(`input[name="goal"][value="${entry.goal}"]`).checked = true;

      // Go back to step 1
      goCalcStep(1);
      toast('Calcul restauré! Continue avec le bouton Activité →');

      return true;
    } catch { return false; }
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
    initChartSelect();
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
    renderLogbookView();
  }

  function renderStatsCards() {
    const el = document.getElementById('log-stats');
    if (!el) return;

    const log = state.logbook;
    if (!log.length) {
      el.innerHTML = '';
      return;
    }

    const totalSessions = log.length;
    const totalVolume   = log.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0);
    const exercises     = new Set(log.map(e => e.exoId)).size;

    // PR total (charge max toutes catégories)
    const topPR = log.reduce((best, e) => e.weight > best ? e.weight : best, 0);
    const topPRName = log.find(e => e.weight === topPR)?.exoName || '—';

    el.innerHTML = `
      <div class="stat-card">
        <div class="stat-icon">🏋️</div>
        <div class="stat-value">${totalSessions}</div>
        <div class="stat-label">Séries enregistrées</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">⚖️</div>
        <div class="stat-value">${(totalVolume/1000).toFixed(1)}t</div>
        <div class="stat-label">Volume total soulevé</div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-value">${exercises}</div>
        <div class="stat-label">Exercices différents</div>
      </div>
      <div class="stat-card gold">
        <div class="stat-icon">🏆</div>
        <div class="stat-value">${topPR} kg</div>
        <div class="stat-label">Meilleur PR — ${esc(topPRName)}</div>
      </div>
    `;
  }

  function renderChart() {
    const canvas = document.getElementById('prog-chart');
    const sel    = document.getElementById('chart-exo-sel');
    if (!canvas || !sel) return;

    const exoId = sel.value;
    const ctx   = canvas.getContext('2d');

    // Effacer
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const filtered = state.logbook
      .filter(e => !exoId || e.exoId === exoId)
      .slice()
      .reverse()
      .slice(-20); // 20 dernières entrées

    if (!filtered.length) {
      ctx.fillStyle = '#4a5858';
      ctx.font = '14px DM Sans, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Pas encore de données pour cet exercice', canvas.width/2, canvas.height/2);
      return;
    }

    // Dimensions
    const W = canvas.width, H = canvas.height;
    const padL = 52, padR = 20, padT = 20, padB = 48;
    const chartW = W - padL - padR;
    const chartH = H - padT - padB;

    const values = filtered.map(e => e.weight);
    const labels = filtered.map(e => e.date);
    const minVal = Math.min(...values) * 0.9;
    const maxVal = Math.max(...values) * 1.05;
    const range  = maxVal - minVal || 1;

    const toX = i => padL + (i / (filtered.length - 1 || 1)) * chartW;
    const toY = v => padT + chartH - ((v - minVal) / range) * chartH;

    // Grille
    ctx.strokeStyle = '#222626';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padT + (chartH / 4) * i;
      ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(padL + chartW, y); ctx.stroke();
      const val = maxVal - (range / 4) * i;
      ctx.fillStyle = '#4a5858';
      ctx.font = '11px DM Sans, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val.toFixed(0) + 'kg', padL - 6, y + 4);
    }

    // Aire sous la courbe (gradient)
    const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
    grad.addColorStop(0, 'rgba(249,115,22,0.25)');
    grad.addColorStop(1, 'rgba(249,115,22,0.0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(values[0]));
    filtered.forEach((e, i) => {
      if (i === 0) return;
      // Courbe lisse (bezier)
      const x0 = toX(i-1), y0 = toY(values[i-1]);
      const x1 = toX(i),   y1 = toY(values[i]);
      const cx  = (x0+x1)/2;
      ctx.bezierCurveTo(cx, y0, cx, y1, x1, y1);
    });
    ctx.lineTo(toX(filtered.length-1), padT+chartH);
    ctx.lineTo(toX(0), padT+chartH);
    ctx.closePath(); ctx.fill();

    // Ligne principale
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(toX(0), toY(values[0]));
    filtered.forEach((e, i) => {
      if (i === 0) return;
      const x0 = toX(i-1), y0 = toY(values[i-1]);
      const x1 = toX(i),   y1 = toY(values[i]);
      const cx  = (x0+x1)/2;
      ctx.bezierCurveTo(cx, y0, cx, y1, x1, y1);
    });
    ctx.stroke();

    // Points
    filtered.forEach((e, i) => {
      const x = toX(i), y = toY(values[i]);
      // PR = gold, sinon fire
      const isPR = values[i] === Math.max(...values);
      ctx.beginPath();
      ctx.arc(x, y, isPR ? 6 : 4, 0, Math.PI * 2);
      ctx.fillStyle = isPR ? '#fbbf24' : '#f97316';
      ctx.fill();
      ctx.strokeStyle = '#080909';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label PR
      if (isPR) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 11px DM Sans, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('PR', x, y - 12);
      }
    });

    // Labels X (toutes les N entrées)
    const step = Math.ceil(filtered.length / 5);
    ctx.fillStyle = '#4a5858';
    ctx.font = '10px DM Sans, sans-serif';
    ctx.textAlign = 'center';
    filtered.forEach((e, i) => {
      if (i % step !== 0 && i !== filtered.length - 1) return;
      ctx.fillText(labels[i], toX(i), H - 8);
    });
  }

  function updateChart() {
    renderChart();
  }

  function initChartSelect() {
    const sel = document.getElementById('chart-exo-sel');
    if (!sel) return;
    // Reprend les exercices du logbook
    const seen = new Set();
    const opts = [{ id:'', name:'Tous les exercices' }];
    state.logbook.forEach(e => {
      if (!seen.has(e.exoId)) { seen.add(e.exoId); opts.push({ id: e.exoId, name: e.exoName }); }
    });
    const prev = sel.value;
    sel.innerHTML = opts.map(o => `<option value="${esc(o.id)}">${esc(o.name)}</option>`).join('');
    sel.value = prev;
    sel.addEventListener('change', updateChart);
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

  // ─── INTERVAL TIMER (HIIT/Tabata) ─────────────────────────
  let intervalState = {
    mode: 'simple',  // simple or interval
    currentRound: 0,
    totalRounds: 8,
    workSeconds: 20,
    restSeconds: 10,
    isWork: true,
  };

  function toggleTimerMode() {
    const simpleBtn = document.getElementById('timer-mode-simple');
    const intervalBtn = document.getElementById('timer-mode-interval');
    const settings = document.getElementById('interval-settings');

    simpleBtn?.addEventListener('click', () => {
      intervalState.mode = 'simple';
      simpleBtn.style.background = 'var(--fire-dim)';
      simpleBtn.style.color = 'var(--fire)';
      intervalBtn.style.background = 'transparent';
      intervalBtn.style.color = 'var(--text3)';
      settings.style.display = 'none';
      resetTimer();
    });

    intervalBtn?.addEventListener('click', () => {
      intervalState.mode = 'interval';
      intervalBtn.style.background = 'var(--fire-dim)';
      intervalBtn.style.color = 'var(--fire)';
      simpleBtn.style.background = 'transparent';
      simpleBtn.style.color = 'var(--text3)';
      settings.style.display = 'block';
      updateIntervalDuration();
    });
  }

  function updateIntervalDuration() {
    const work = parseInt(document.getElementById('interval-work')?.value || 20);
    const rest = parseInt(document.getElementById('interval-rest')?.value || 10);
    const rounds = parseInt(document.getElementById('interval-rounds')?.value || 8);
    const total = ((work + rest) * rounds) - rest;
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    const duration = document.getElementById('total-duration');
    if (duration) duration.textContent = `${mins}:${String(secs).padStart(2,'0')}`;
  }

  function startIntervalTimer() {
    const work = parseInt(document.getElementById('interval-work')?.value || 20);
    const rest = parseInt(document.getElementById('interval-rest')?.value || 10);
    const rounds = parseInt(document.getElementById('interval-rounds')?.value || 8);

    intervalState.workSeconds = work;
    intervalState.restSeconds = rest;
    intervalState.totalRounds = rounds;
    intervalState.currentRound = 1;
    intervalState.isWork = true;

    state.timerRemaining = work;
    state.timerSeconds = work;

    const label = document.querySelector('.timer-label');
    if (label) label.textContent = `🔥 TRAVAIL — Round ${intervalState.currentRound}/${rounds}`;

    startTimer();
  }

  // Modify startTimer to handle intervals
  const originalStartTimer = startTimer;
  function startTimer() {
    if (intervalState.mode === 'interval') {
      if (state.timerRunning) return;
      state.timerRunning = true;
      const btn = document.getElementById('timer-start');
      if (btn) btn.textContent = '⏸ Pause';

      state.timerInterval = setInterval(() => {
        state.timerRemaining--;
        updateTimerDisplay();

        if (state.timerRemaining <= 0) {
          // Toggle between work and rest
          if (intervalState.isWork) {
            // Transition to rest
            if (intervalState.currentRound < intervalState.totalRounds) {
              intervalState.isWork = false;
              state.timerRemaining = intervalState.restSeconds;
              state.timerSeconds = intervalState.restSeconds;
              const label = document.querySelector('.timer-label');
              if (label) label.textContent = `😤 REPOS — Round ${intervalState.currentRound}/${intervalState.totalRounds}`;
              navigator.vibrate([100, 50, 100]);
            } else {
              stopTimer();
              timerDone();
            }
          } else {
            // Transition to next work round
            intervalState.currentRound++;
            if (intervalState.currentRound <= intervalState.totalRounds) {
              intervalState.isWork = true;
              state.timerRemaining = intervalState.workSeconds;
              state.timerSeconds = intervalState.workSeconds;
              const label = document.querySelector('.timer-label');
              if (label) label.textContent = `🔥 TRAVAIL — Round ${intervalState.currentRound}/${intervalState.totalRounds}`;
              navigator.vibrate([100, 50, 100]);
            } else {
              stopTimer();
              timerDone();
            }
          }
          updateTimerDisplay();
        }
      }, 1000);
    } else {
      originalStartTimer();
    }
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
     PHASE 7: SUIVI AVANCÉ
  ───────────────────────────────────────────── */

  let currentView = 'jour'; // 'jour', 'semaine', 'mois'

  function switchView(view) {
    currentView = view;
    // Update toggle buttons
    document.querySelectorAll('.view-toggle').forEach(b => {
      b.classList.toggle('active', b.dataset.view === view);
    });
    // Show/hide heatmap
    const heatmap = document.getElementById('heatmap-container');
    if (heatmap) heatmap.style.display = view === 'semaine' ? 'block' : 'none';

    // Show/hide analytics
    const analytics = document.getElementById('analytics-container');
    if (analytics) analytics.style.display = view === 'analytics' ? 'block' : 'none';

    renderLogbookView();
  }

  function renderLogbookView() {
    if (currentView === 'jour') {
      renderDayView();
    } else if (currentView === 'semaine') {
      renderWeekView();
    } else if (currentView === 'mois') {
      renderMonthView();
    } else if (currentView === 'analytics') {
      renderAnalyticsView();
    }
  }

  function renderDayView() {
    // Afficher le tableau standard avec stats
    const tbody = document.getElementById('log-tbody');
    if (!tbody) return;

    if (!state.logbook.length) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:32px;color:var(--text3)">Aucune séance enregistrée</td></tr>`;
      renderStatsCards();
      renderChart();
      return;
    }

    // PRs par exercice
    const prs = {};
    state.logbook.forEach(e => {
      if (!prs[e.exoId] || e.weight > prs[e.exoId]) prs[e.exoId] = e.weight;
    });

    tbody.innerHTML = state.logbook.slice(0, 60).map(e => {
      const isPR = prs[e.exoId] === e.weight;
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

    renderStatsCards();
    renderChart();
  }

  function renderWeekView() {
    renderHeatmap();
    renderWeeklyStats();
    renderChart();
  }

  function renderMonthView() {
    renderMonthlyStats();
    renderChart();
  }

  function renderHeatmap() {
    const container = document.getElementById('heatmap-grid');
    if (!container) return;

    const today = new Date();
    const days = [];

    // 4 semaines = 28 jours
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push(date);
    }

    // Compter entrées par jour
    const dayMap = {};
    state.logbook.forEach(log => {
      const d = log.date.split('-').reverse().join('-'); // DD-MM-YYYY => YYYY-MM-DD
      if (!dayMap[d]) dayMap[d] = 0;
      dayMap[d]++;
    });

    // Créer grille heatmap
    const maxSessions = Math.max(...Object.values(dayMap), 1);
    const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let html = '';

    days.forEach(date => {
      const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
      const count = dayMap[dateStr] || 0;
      const intensity = count === 0 ? 'empty' : count <= 2 ? 'low' : count <= 5 ? 'medium' : 'high';
      const dayName = dayNames[date.getDay() === 0 ? 6 : date.getDay() - 1];
      const label = date.toLocaleDateString('fr-FR', {day:'numeric', month:'numeric'});

      html += `<div class="heatmap-cell ${intensity}" title="${dayName} ${label} – ${count} sér${count>1?'ies':''}">${count > 0 ? count : '—'}</div>`;
    });

    container.innerHTML = html;
  }

  function renderWeeklyStats() {
    // Caller pendant la semaine view
    const log = state.logbook;
    if (!log.length) return;

    // Dernière semaine (7 jours)
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - 6);

    const weekLog = log.filter(e => {
      const [d, m, y] = e.date.split('-').map(Number);
      const eDate = new Date(y, m-1, d);
      return eDate >= weekStart;
    });

    const sessions = weekLog.length;
    const volume = weekLog.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0);
    const exercises = new Set(weekLog.map(e => e.exoId)).size;

    // Jours consécutifs
    const uniqueDates = [...new Set(weekLog.map(e => e.date))].sort();
    let streak = 0;
    if (uniqueDates.length > 0) {
      const [d, m, y] = uniqueDates[uniqueDates.length - 1].split('-').map(Number);
      const lastDate = new Date(y, m-1, d);
      const yDate = new Date();
      yDate.setDate(yDate.getDate() - streak);

      // Compter jours consécutifs en arrière
      for (let i = 0; i < uniqueDates.length; i++) {
        const [d, m, y] = uniqueDates[uniqueDates.length - 1 - i].split('-').map(Number);
        const checkDate = new Date(y, m-1, d);
        const expectedDate = new Date(today);
        expectedDate.setDate(expectedDate.getDate() - i);
        if (Math.abs(checkDate.getTime() - expectedDate.getTime()) < 86400000) {
          streak = i + 1;
        } else {
          break;
        }
      }
    }

    const statsHtml = `
      <div class="weekly-stats">
        <div class="weekly-stat">
          <span class="weekly-stat-value">⏰</span>
          <span class="weekly-stat-label">Séances</span>
          <span class="weekly-stat-value" style="color:var(--text); font-size:1.2rem;">${sessions}</span>
        </div>
        <div class="weekly-stat">
          <span class="weekly-stat-value">📦</span>
          <span class="weekly-stat-value" style="color:var(--text); font-size:1.2rem;">${(volume/1000).toFixed(1)}t</span>
          <span class="weekly-stat-label">Volume</span>
        </div>
        <div class="weekly-stat">
          <span class="weekly-stat-value">🎯</span>
          <span class="weekly-stat-value" style="color:var(--text); font-size:1.2rem;">${exercises}</span>
          <span class="weekly-stat-label">Exercices</span>
        </div>
        <div class="weekly-stat">
          <span class="weekly-stat-value">🔥</span>
          <span class="weekly-stat-value" style="color:var(--text); font-size:1.2rem;">${streak}</span>
          <span class="weekly-stat-label">Jours consécutifs</span>
        </div>
      </div>
    `;

    // Insérer après heatmap
    const heatmap = document.getElementById('heatmap-container');
    if (heatmap) {
      const existing = heatmap.querySelector('.weekly-stats');
      if (existing) existing.remove();
      heatmap.insertAdjacentHTML('afterend', statsHtml);
    }
  }

  function renderMonthlyStats() {
    // Afficher stats du mois en cours
    const log = state.logbook;
    if (!log.length) return;

    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const monthLog = log.filter(e => {
      const [d, m, y] = e.date.split('-').map(Number);
      const eDate = new Date(y, m-1, d);
      return eDate >= monthStart && eDate <= today;
    });

    const sessions = monthLog.length;
    const volume = monthLog.reduce((acc, e) => acc + e.weight * e.reps * e.sets, 0);
    const exercises = new Set(monthLog.map(e => e.exoId)).size;
    const avgPerSession = sessions > 0 ? (volume / sessions / 1000).toFixed(2) : 0;

    const prs = {};
    monthLog.forEach(e => {
      if (!prs[e.exoId] || e.weight > prs[e.exoId]) prs[e.exoId] = e.weight;
    });
    const prCount = Object.keys(prs).length;

    const statsHtml = `
      <div class="card" style="margin-bottom:24px;">
        <div class="card-header"><div><div class="card-title">📊 Statistiques du mois</div></div></div>
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:16px;">
          <div style="text-align:center; padding:16px; background:var(--surface2); border-radius:var(--r-md);">
            <div style="font-size:1.5rem; font-weight:700; color:var(--fire); margin-bottom:6px;">${sessions}</div>
            <div style="font-size:0.8rem; color:var(--text3);">SÉANCES</div>
          </div>
          <div style="text-align:center; padding:16px; background:var(--surface2); border-radius:var(--r-md);">
            <div style="font-size:1.5rem; font-weight:700; color:var(--fire); margin-bottom:6px;">${(volume/1000).toFixed(1)}t</div>
            <div style="font-size:0.8rem; color:var(--text3);">VOLUME TOTAL</div>
          </div>
          <div style="text-align:center; padding:16px; background:var(--surface2); border-radius:var(--r-md);">
            <div style="font-size:1.5rem; font-weight:700; color:var(--fire); margin-bottom:6px;">${avgPerSession}t</div>
            <div style="font-size:0.8rem; color:var(--text3);">MOY/SÉANCE</div>
          </div>
          <div style="text-align:center; padding:16px; background:var(--surface2); border-radius:var(--r-md);">
            <div style="font-size:1.5rem; font-weight:700; color:var(--fire); margin-bottom:6px;">${prCount}</div>
            <div style="font-size:0.8rem; color:var(--text3);">PRS ÉTABLIS</div>
          </div>
        </div>
      </div>
    `;

    const logStats = document.getElementById('log-stats');
    if (logStats && !logStats.querySelector('[data-monthly]')) {
      logStats.insertAdjacentHTML('afterend', statsHtml.replace('<div class="card"', '<div data-monthly class="card"'));
    }
  }

  function exportToCSV() {
    if (!state.logbook.length) {
      alert('Aucune donnée à exporter');
      return;
    }

    const headers = ['Date', 'Exercice', 'Charge (kg)', 'Répétitions', 'Séries', 'Volume (kg)'];
    const rows = state.logbook.map(e => [
      e.date,
      e.exoName,
      e.weight,
      e.reps,
      e.sets,
      (e.weight * e.reps * e.sets).toFixed(0)
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(v => `"${v}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `muscleos-logbook-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /* ─────────────────────────────────────────────
     PHASE 12: COMMUNAUTÉ / SOCIAL
  ───────────────────────────────────────────── */

  function saveProfile() {
    const username = document.getElementById('profile-username')?.value || 'AnonymousGym';
    const bio = document.getElementById('profile-bio')?.value || '';
    const emoji = document.getElementById('profile-emoji')?.value || '👤';

    const profile = { username, bio, emoji, createdAt: new Date().toISOString() };
    localStorage.setItem('mos-profile', JSON.stringify(profile));

    // Update avatar display
    document.getElementById('profile-avatar').textContent = emoji;

    alert('✓ Profil sauvegardé!');
  }

  function loadProfile() {
    const stored = localStorage.getItem('mos-profile');
    const profile = stored ? JSON.parse(stored) : { username: '', bio: '', emoji: '👤' };

    document.getElementById('profile-username').value = profile.username;
    document.getElementById('profile-bio').value = profile.bio;
    document.getElementById('profile-emoji').value = profile.emoji;
    document.getElementById('profile-avatar').textContent = profile.emoji;

    return profile;
  }

  function generateShareLink() {
    const progIdx = document.getElementById('share-program')?.value;
    if (!progIdx) { alert('Sélectionne un programme'); return; }

    const prog = Object.values(DATA.PROGRAM_TEMPLATES)[progIdx];
    if (!prog) return;

    const shareCode = btoa(JSON.stringify({ prog: prog.name, data: prog })).substring(0,50).replace(/\+/g,'-').replace(/\//g,'_');
    const link = `${location.origin}/?share=${shareCode}`;

    document.getElementById('share-link').value = link;
    document.getElementById('share-link-box').style.display = 'block';
  }

  function copyShareLink() {
    const link = document.getElementById('share-link');
    link.select();
    document.execCommand('copy');
    alert('✓ Lien copié!');
  }

  function addFriend() {
    const code = document.getElementById('friend-code')?.value?.trim();
    if (!code) { alert('Colle un code d\'ami'); return; }

    let friends = JSON.parse(localStorage.getItem('mos-friends') || '[]');
    if (friends.find(f => f.code === code)) { alert('Ami déjà ajouté!'); return; }

    const friend = { code, addedAt: new Date().toISOString() };
    friends.push(friend);
    localStorage.setItem('mos-friends', JSON.stringify(friends));

    document.getElementById('friend-code').value = '';
    renderFriends();
    alert('✓ Ami ajouté!');
  }

  function renderFriends() {
    const friends = JSON.parse(localStorage.getItem('mos-friends') || '[]');
    const container = document.getElementById('friends-list');

    if (friends.length === 0) {
      container.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:32px; color:var(--text3);">Aucun ami encore. Ajoute-en!</div>';
      return;
    }

    container.innerHTML = friends.map((f, i) => `
      <div class="friend-card">
        <div class="friend-avatar">👥</div>
        <div class="friend-name">Ami #${i+1}</div>
        <div class="friend-bio" title="${f.code}">${f.code.substring(0,15)}...</div>
        <button class="btn btn-ghost btn-sm" onclick="APP.removeFriend(${i})" style="width:100%; margin-top:8px;">❌ Retirer</button>
      </div>
    `).join('');

    document.querySelector('[data-tab="friends"]').textContent = `👥 Amis (${friends.length})`;
    document.getElementById('profile-friends').textContent = friends.length;
  }

  function removeFriend(idx) {
    let friends = JSON.parse(localStorage.getItem('mos-friends') || '[]');
    friends.splice(idx, 1);
    localStorage.setItem('mos-friends', JSON.stringify(friends));
    renderFriends();
  }

  function initCommunityTabs() {
    document.querySelectorAll('.community-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        // Deactivate all
        document.querySelectorAll('.community-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.community-tab-content').forEach(c => c.style.display = 'none');

        // Activate clicked
        btn.classList.add('active');
        const tab = btn.dataset.tab;
        const content = document.getElementById(`tab-${tab}`);
        if (content) content.style.display = 'block';
      });
    });

    // Load initial data
    loadProfile();
    renderFriends();
  }

  /* ─────────────────────────────────────────────
     PHASE 13: ANALYTICS AVANCÉES
  ───────────────────────────────────────────── */

  function calculate1RM() {
    const weight = safeNum('1rm-weight', 0);
    const reps = safeNum('1rm-reps', 1);

    if (weight <= 0 || reps <= 0) {
      toast('Remplis poids et reps', 'error');
      return;
    }

    // Formule Epley: 1RM = Poids × (1 + Reps / 30)
    const oneRM = weight * (1 + reps / 30);

    const resultEl = document.getElementById('1rm-result');
    const valueEl = document.getElementById('1rm-value');

    if (resultEl && valueEl) {
      valueEl.textContent = oneRM.toFixed(1);
      resultEl.style.display = 'block';
    }

    toast(`1RM estimé: ${oneRM.toFixed(1)} kg`, 'ok');
  }

  function addBodyfat() {
    const input = document.getElementById('bodyfat-input');
    if (!input || input.value === '') {
      toast('Remplis le % bodyfat', 'error');
      return;
    }

    const bodyfat = parseFloat(input.value);
    if (isNaN(bodyfat) || bodyfat < 0 || bodyfat > 50) {
      toast('% bodyfat invalide (0-50)', 'error');
      return;
    }

    // Charger données existantes
    let bodyfatHistory = JSON.parse(localStorage.getItem('mos-bodyfat') || '[]');

    // Ajouter nouvelle entrée
    bodyfatHistory.push({
      date: new Date().toISOString().split('T')[0],
      bodyfat: bodyfat,
      timestamp: Date.now()
    });

    // Garder les 100 dernières entrées
    bodyfatHistory = bodyfatHistory.slice(-100);

    localStorage.setItem('mos-bodyfat', JSON.stringify(bodyfatHistory));

    input.value = '';
    renderBodyfatChart();
    renderBodyfatList();
    toast('✓ Bodyfat enregistré', 'ok');
  }

  function removeBodyfat(idx) {
    let bodyfatHistory = JSON.parse(localStorage.getItem('mos-bodyfat') || '[]');
    bodyfatHistory.splice(idx, 1);
    localStorage.setItem('mos-bodyfat', JSON.stringify(bodyfatHistory));
    renderBodyfatChart();
    renderBodyfatList();
  }

  function renderBodyfatList() {
    const list = document.getElementById('bodyfat-list');
    if (!list) return;

    let bodyfatHistory = JSON.parse(localStorage.getItem('mos-bodyfat') || '[]');

    if (!bodyfatHistory.length) {
      list.innerHTML = '<div style="text-align:center; color:var(--text3); padding:16px;">Aucune donnée</div>';
      return;
    }

    // Afficher les 10 dernières, inversé (plus recent en premier)
    list.innerHTML = bodyfatHistory.slice(-10).reverse().map((entry, i) => `
      <div style="display:flex; justify-content:space-between; align-items:center; background:var(--surface2); padding:12px; border-radius:var(--r-md);">
        <div>
          <div style="font-weight:600; color:var(--fire);">${entry.bodyfat.toFixed(1)}%</div>
          <div style="font-size:0.75rem; color:var(--text3);">${entry.date}</div>
        </div>
        <button class="btn btn-ghost btn-sm" onclick="APP.removeBodyfat(${bodyfatHistory.length - i - 1})">✕</button>
      </div>
    `).join('');
  }

  function renderBodyfatChart() {
    const canvas = document.getElementById('bodyfat-chart');
    if (!canvas || !canvas.getContext) return;

    let bodyfatHistory = JSON.parse(localStorage.getItem('mos-bodyfat') || '[]');
    if (!bodyfatHistory.length) {
      canvas.style.background = 'var(--surface2)';
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'var(--text3)';
      ctx.font = '14px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Aucune donnée', canvas.width / 2, canvas.height / 2);
      return;
    }

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const graphW = w - 2 * padding;
    const graphH = h - 2 * padding;

    // Points
    const data = bodyfatHistory.slice(-30);
    const minBF = Math.min(...data.map(d => d.bodyfat));
    const maxBF = Math.max(...data.map(d => d.bodyfat));
    const range = Math.max(maxBF - minBF, 5);

    // Élément background
    ctx.fillStyle = '#ffffff05';
    ctx.fillRect(0, 0, w, h);

    // Axe X et Y
    ctx.strokeStyle = 'var(--border)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();

    // Labels et grid
    ctx.fillStyle = 'var(--text3)';
    ctx.font = '11px DM Sans';
    ctx.textAlign = 'center';

    // Points ligne
    ctx.strokeStyle = 'var(--fire)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    data.forEach((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * graphW;
      const y = h - padding - ((d.bodyfat - minBF) / range) * graphH;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();

    // Points cercles
    ctx.fillStyle = 'var(--fire)';
    data.forEach((d, i) => {
      const x = padding + (i / (data.length - 1 || 1)) * graphW;
      const y = h - padding - ((d.bodyfat - minBF) / range) * graphH;

      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fill();
    });
  }

  function renderTonnageChart() {
    const canvas = document.getElementById('tonnage-chart');
    if (!canvas || !canvas.getContext) return;

    const log = state.logbook;
    if (!log.length) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'var(--text3)';
      ctx.font = '14px DM Sans';
      ctx.textAlign = 'center';
      ctx.fillText('Aucune donnée', canvas.width / 2, canvas.height / 2);
      return;
    }

    // Grouper par jour
    const dayMap = {};
    log.forEach(e => {
      const d = e.date; // DD-MM-YYYY
      if (!dayMap[d]) dayMap[d] = 0;
      dayMap[d] += e.weight * e.reps * e.sets;
    });

    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const padding = 40;
    const graphW = w - 2 * padding;
    const graphH = h - 2 * padding;

    // Last 30 days
    const dates = Object.keys(dayMap).slice(-30);
    const tonnages = dates.map(d => dayMap[d] / 1000); // tonnes
    const maxT = Math.max(...tonnages);

    // Background
    ctx.fillStyle = '#ffffff05';
    ctx.fillRect(0, 0, w, h);

    // Axes
    ctx.strokeStyle = 'var(--border)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, h - padding);
    ctx.lineTo(w - padding, h - padding);
    ctx.stroke();

    // Barres
    ctx.fillStyle = 'var(--ice)';
    dates.forEach((d, i) => {
      const x = padding + (i / dates.length) * graphW;
      const barW = graphW / dates.length - 2;
      const barH = (tonnages[i] / maxT) * graphH;
      const y = h - padding - barH;

      ctx.fillRect(x, y, barW, barH);
    });

    // Labels
    ctx.fillStyle = 'var(--text3)';
    ctx.font = '10px DM Sans';
    ctx.textAlign = 'center';

    // Y-axis labels
    for (let i = 0; i <= 4; i++) {
      const val = (maxT * i / 4).toFixed(1);
      const y = h - padding - (i / 4) * graphH;
      ctx.fillText(val + 't', padding - 20, y + 3);
    }
  }

  function renderTopExercises() {
    const container = document.getElementById('top-exercises');
    if (!container) return;

    const log = state.logbook;
    if (!log.length) {
      container.innerHTML = '<div style="text-align:center; color:var(--text3); padding:32px;">Aucune donnée</div>';
      return;
    }

    // Calculer tonnage par exo
    const exoTonnage = {};
    log.forEach(e => {
      if (!exoTonnage[e.exoId]) {
        exoTonnage[e.exoId] = { name: e.exoName, tonnage: 0, count: 0 };
      }
      exoTonnage[e.exoId].tonnage += e.weight * e.reps * e.sets;
      exoTonnage[e.exoId].count++;
    });

    // Trier et top 10
    const sorted = Object.values(exoTonnage)
      .sort((a, b) => b.tonnage - a.tonnage)
      .slice(0, 10);

    const maxTon = sorted[0]?.tonnage || 1;

    container.innerHTML = sorted.map((exo, rank) => {
      const pct = (exo.tonnage / maxTon) * 100;
      return `
        <div style="padding:12px; background:var(--surface2); border-radius:var(--r-md); border-left:3px solid var(--fire);">
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span style="font-weight:600;">#${rank+1} ${esc(exo.name)}</span>
            <span style="color:var(--fire); font-weight:700;">${(exo.tonnage/1000).toFixed(1)}t</span>
          </div>
          <div style="display:grid; grid-template-columns:1fr auto; gap:8px; font-size:0.75rem; color:var(--text3);">
            <div style="background:var(--ice); height:4px; border-radius:2px; overflow:hidden;">
              <div style="background:var(--fire); height:100%; width:${pct}%;"></div>
            </div>
            <span>${exo.count} séries</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderAnalyticsView() {
    const container = document.getElementById('analytics-container');
    if (!container) return;

    container.style.display = 'block';

    // Render all charts/stats
    setTimeout(() => {
      renderBodyfatChart();
      renderTonnageChart();
      renderTopExercises();
      renderBodyfatList();
    }, 100);
  }

  /* ─────────────────────────────────────────────
     PHASE 14: NUTRITION MODULE
  ───────────────────────────────────────────── */

  // Nutrition state
  const nutritionState = {
    meals: JSON.parse(localStorage.getItem('mos-meals') || '[]'),
    recipes: JSON.parse(localStorage.getItem('mos-recipes') || '[]'),
    shoppingList: JSON.parse(localStorage.getItem('mos-shopping') || '[]'),
  };

  const QUICK_FOODS = [
    { name: 'Blanc poulet', cal: 165, protein: 31, carbs: 0, fat: 3.6 },
    { name: 'Riz cuit', cal: 130, protein: 2.7, carbs: 28, fat: 0.3 },
    { name: 'Œufs', cal: 155, protein: 13, carbs: 1.1, fat: 11 },
    { name: 'Brocoli', cal: 34, protein: 2.8, carbs: 7, fat: 0.4 },
    { name: 'Saumon', cal: 208, protein: 20, carbs: 0, fat: 13 },
    { name: 'Avocado', cal: 160, protein: 2, carbs: 9, fat: 15 },
    { name: 'Whey', cal: 110, protein: 24, carbs: 1.5, fat: 0.5 },
    { name: 'Patate douce', cal: 86, protein: 1.6, carbs: 20, fat: 0.1 },
  ];

  function addMeal() {
    const name = document.getElementById('meal-name')?.value?.trim();
    const type = document.getElementById('meal-type')?.value;
    const calories = safeNum('meal-calories', 0);
    const protein = safeNum('meal-protein', 0);
    const carbs = safeNum('meal-carbs', 0);
    const fat = safeNum('meal-fat', 0);

    if (!name || calories <= 0) {
      toast('Remplis nom et calories', 'error');
      return;
    }

    const meal = {
      id: Date.now(),
      name,
      type,
      calories,
      protein,
      carbs,
      fat,
      date: new Date().toISOString().split('T')[0],
    };

    nutritionState.meals.push(meal);
    localStorage.setItem('mos-meals', JSON.stringify(nutritionState.meals));

    // Clearer inputs
    document.getElementById('meal-name').value = '';
    document.getElementById('meal-calories').value = '';
    document.getElementById('meal-protein').value = '';
    document.getElementById('meal-carbs').value = '';
    document.getElementById('meal-fat').value = '';

    renderMeals();
    updateMacros();
    toast('✓ Repas ajouté', 'ok');
  }

  function removeMeal(id) {
    nutritionState.meals = nutritionState.meals.filter(m => m.id !== id);
    localStorage.setItem('mos-meals', JSON.stringify(nutritionState.meals));
    renderMeals();
    updateMacros();
  }

  function renderMeals() {
    const container = document.getElementById('meals-list');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const todayMeals = nutritionState.meals.filter(m => m.date === today);

    if (!todayMeals.length) {
      container.innerHTML = '<div style="text-align:center; color:var(--text3); padding:32px;">Aucun repas aujourd\'hui</div>';
      return;
    }

    container.innerHTML = todayMeals.map(meal => `
      <div style="background:var(--surface2); padding:16px; border-radius:var(--r-md); border-left:3px solid var(--fire);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="font-weight:600;">${esc(meal.name)}</span>
          <button class="btn btn-ghost btn-sm" onclick="APP.removeMeal(${meal.id})">✕</button>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; font-size:0.8rem; color:var(--text3);">
          <div>🔥 ${meal.calories} kcal</div>
          <div>🔴 ${meal.protein.toFixed(1)}g P</div>
          <div>🟦 ${meal.carbs.toFixed(1)}g C</div>
          <div>🟩 ${meal.fat.toFixed(1)}g L</div>
        </div>
      </div>
    `).join('');
  }

  function updateMacros() {
    const today = new Date().toISOString().split('T')[0];
    const todayMeals = nutritionState.meals.filter(m => m.date === today);

    const totals = todayMeals.reduce((acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // Update display
    const calEl = document.getElementById('total-calories');
    if (calEl) calEl.textContent = Math.round(totals.calories);

    // Calculate percentages
    const proteinCal = totals.protein * 4;
    const carbsCal = totals.carbs * 4;
    const fatCal = totals.fat * 9;
    const totalCal = proteinCal + carbsCal + fatCal || 1;

    const proteinPct = Math.round((proteinCal / totalCal) * 100);
    const carbsPct = Math.round((carbsCal / totalCal) * 100);
    const fatPct = Math.round((fatCal / totalCal) * 100);

    // Update bars
    ['macro-protein-bar', 'macro-carbs-bar', 'macro-fat-bar'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        if (id === 'macro-protein-bar') el.style.width = proteinPct + '%';
        else if (id === 'macro-carbs-bar') el.style.width = carbsPct + '%';
        else el.style.width = fatPct + '%';
      }
    });

    // Update pcts and values
    const elements = [
      { pct: 'macro-protein-pct', val: 'macro-protein-val', p: proteinPct, g: totals.protein.toFixed(1), t: 'protéine' },
      { pct: 'macro-carbs-pct', val: 'macro-carbs-val', p: carbsPct, g: totals.carbs.toFixed(1), t: 'glucides' },
      { pct: 'macro-fat-pct', val: 'macro-fat-val', p: fatPct, g: totals.fat.toFixed(1), t: 'lipides' },
    ];

    elements.forEach(e => {
      const pctEl = document.getElementById(e.pct);
      const valEl = document.getElementById(e.val);
      if (pctEl) pctEl.textContent = e.p + '%';
      if (valEl) valEl.textContent = e.g + 'g';
    });

    // Status
    const statusEl = document.getElementById('total-macros-status');
    if (statusEl) {
      if (totals.calories === 0) statusEl.textContent = '—';
      else if (proteinPct >= 25 && proteinPct <= 35) statusEl.textContent = '✅ Équilibré';
      else if (proteinPct > 35) statusEl.textContent = '⚠️ Trop protéiné';
      else statusEl.textContent = '⚠️ Peu protéiné';
    }
  }

  function renderQuickFoods() {
    const container = document.getElementById('quick-foods');
    if (!container) return;

    container.innerHTML = QUICK_FOODS.map(food => `
      <button onclick="APP.addQuickFood('${food.name.replace(/'/g, "\\'")}', ${food.cal}, ${food.protein}, ${food.carbs}, ${food.fat})" style="background:var(--surface2); border:1px solid var(--border); padding:12px; border-radius:var(--r-md); cursor:pointer; transition:all 0.2s; font-size:0.75rem;">
        <div style="font-weight:600; color:var(--text); margin-bottom:4px;">${food.name}</div>
        <div style="color:var(--text3); font-size:0.7rem;">${food.cal} kcal</div>
      </button>
    `).join('');
  }

  function addQuickFood(name, cal, p, c, f) {
    document.getElementById('meal-name').value = name;
    document.getElementById('meal-calories').value = cal;
    document.getElementById('meal-protein').value = p;
    document.getElementById('meal-carbs').value = c;
    document.getElementById('meal-fat').value = f;
    toast(`✓ ${name} sélectionné`, 'ok');
  }

  function addRecipe() {
    const name = document.getElementById('recipe-name')?.value?.trim();
    const ingredients = document.getElementById('recipe-ingredients')?.value?.trim();
    const instructions = document.getElementById('recipe-instructions')?.value?.trim();
    const protein = safeNum('recipe-protein', 0);
    const carbs = safeNum('recipe-carbs', 0);
    const fat = safeNum('recipe-fat', 0);
    const servings = safeNum('recipe-servings', 1);

    if (!name || !ingredients || servings <= 0) {
      toast('Remplis les champs obligatoires', 'error');
      return;
    }

    const recipe = {
      id: Date.now(),
      name,
      ingredients: ingredients.split('\n').filter(l => l.trim()),
      instructions,
      macros: {
        protein: protein / servings,
        carbs: carbs / servings,
        fat: fat / servings,
      },
      servings,
      createdAt: new Date().toISOString(),
    };

    nutritionState.recipes.push(recipe);
    localStorage.setItem('mos-recipes', JSON.stringify(nutritionState.recipes));

    // Clear inputs
    document.getElementById('recipe-name').value = '';
    document.getElementById('recipe-ingredients').value = '';
    document.getElementById('recipe-instructions').value = '';
    document.getElementById('recipe-protein').value = '';
    document.getElementById('recipe-carbs').value = '';
    document.getElementById('recipe-fat').value = '';
    document.getElementById('recipe-servings').value = '';

    renderRecipes();
    toast('✓ Recette sauvegardée', 'ok');
  }

  function removeRecipe(id) {
    nutritionState.recipes = nutritionState.recipes.filter(r => r.id !== id);
    localStorage.setItem('mos-recipes', JSON.stringify(nutritionState.recipes));
    renderRecipes();
  }

  function renderRecipes() {
    const container = document.getElementById('recipes-list');
    if (!container) return;

    if (!nutritionState.recipes.length) {
      container.innerHTML = '<div style="text-align:center; color:var(--text3); padding:32px;">Aucune recette sauvegardée</div>';
      return;
    }

    container.innerHTML = nutritionState.recipes.map(recipe => `
      <div style="background:var(--surface2); padding:16px; border-radius:var(--r-md);">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <div>
            <div style="font-weight:600;">${esc(recipe.name)}</div>
            <div style="font-size:0.75rem; color:var(--text3);">${recipe.servings} portion${recipe.servings > 1 ? 's' : ''}</div>
          </div>
          <button class="btn btn-ghost btn-sm" onclick="APP.removeRecipe(${recipe.id})">✕</button>
        </div>
        <div style="font-size:0.8rem; color:var(--text3); margin-bottom:8px;">
          🔴 ${recipe.macros.protein.toFixed(1)}g P | 🟦 ${recipe.macros.carbs.toFixed(1)}g C | 🟩 ${recipe.macros.fat.toFixed(1)}g L
        </div>
        ${recipe.instructions ? `<div style="font-size:0.75rem; color:var(--text3); margin-bottom:6px; font-style:italic;">📝 Instructions sauvegardées</div>` : ''}
        <button class="btn btn-primary btn-sm" onclick="APP.addMealFromRecipe(${recipe.id})" style="width:100%;">➕ Ajouter au repas</button>
      </div>
    `).join('');
  }

  function addMealFromRecipe(recipeId) {
    const recipe = nutritionState.recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const cal = (recipe.macros.protein * 4) + (recipe.macros.carbs * 4) + (recipe.macros.fat * 9);

    const meal = {
      id: Date.now(),
      name: recipe.name,
      type: 'lunch',
      calories: Math.round(cal),
      protein: recipe.macros.protein,
      carbs: recipe.macros.carbs,
      fat: recipe.macros.fat,
      date: new Date().toISOString().split('T')[0],
    };

    nutritionState.meals.push(meal);
    localStorage.setItem('mos-meals', JSON.stringify(nutritionState.meals));

    renderMeals();
    updateMacros();
    toast(`✓ ${recipe.name} ajouté`, 'ok');
  }

  function generateShoppingList() {
    const items = {};

    nutritionState.recipes.forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        if (ingredient.trim()) {
          items[ingredient] = (items[ingredient] || 0) + 1;
        }
      });
    });

    const list = Object.keys(items).map(item => ({
      item,
      checked: false,
      count: items[item],
    }));

    nutritionState.shoppingList = list;
    localStorage.setItem('mos-shopping', JSON.stringify(list));
    renderShoppingList();
    toast('✓ Liste générée', 'ok');
  }

  function renderShoppingList() {
    const container = document.getElementById('shopping-list');
    if (!container) return;

    if (!nutritionState.shoppingList.length) {
      container.innerHTML = '<div style="text-align:center; color:var(--text3); padding:32px;">Générez une liste à partir de vos recettes</div>';
      return;
    }

    container.innerHTML = nutritionState.shoppingList.map((item, i) => `
      <div style="display:flex; gap:12px; align-items:center; padding:12px; background:var(--surface2); border-radius:var(--r-md);">
        <input type="checkbox" onchange="APP.toggleShoppingItem(${i})" ${item.checked ? 'checked' : ''} style="cursor:pointer; width:18px; height:18px;">
        <div style="flex:1; ${item.checked ? 'text-decoration:line-through; color:var(--text3);' : ''}">
          ${esc(item.item)}
        </div>
        <button class="btn btn-ghost btn-sm" onclick="APP.removeShoppingItem(${i})">✕</button>
      </div>
    `).join('');
  }

  function toggleShoppingItem(idx) {
    if (nutritionState.shoppingList[idx]) {
      nutritionState.shoppingList[idx].checked = !nutritionState.shoppingList[idx].checked;
      localStorage.setItem('mos-shopping', JSON.stringify(nutritionState.shoppingList));
      renderShoppingList();
    }
  }

  function removeShoppingItem(idx) {
    nutritionState.shoppingList.splice(idx, 1);
    localStorage.setItem('mos-shopping', JSON.stringify(nutritionState.shoppingList));
    renderShoppingList();
  }

  function clearShoppingList() {
    if (confirm('Vider la liste?')) {
      nutritionState.shoppingList = [];
      localStorage.setItem('mos-shopping', JSON.stringify([]));
      renderShoppingList();
    }
  }

  function printShoppingList() {
    window.print();
  }

  function initNutritionTabs() {
    document.querySelectorAll('.nutrition-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.nutrition-tab').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.nutrition-tab-content').forEach(c => c.style.display = 'none');

        btn.classList.add('active');
        const tab = btn.dataset.tab;
        const content = document.getElementById(`tab-${tab}`);
        if (content) content.style.display = 'block';

        // Render on tab switch
        if (tab === 'macros') {
          renderQuickFoods();
          updateMacros();
        } else if (tab === 'recipes') {
          renderRecipes();
        } else if (tab === 'meals') {
          renderMeals();
          updateMacros();
        } else if (tab === 'shopping') {
          renderShoppingList();
        }
      });
    });

    // Initial render
    renderMeals();
    renderRecipes();
    renderShoppingList();
    renderQuickFoods();
    updateMacros();
  }
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
    initChartSelect();
    renderLogbook();
    bind('btn-add-log', addLog);

    // Phase 7: View toggles and CSV export
    document.querySelectorAll('.view-toggle').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    bind('btn-export-csv', exportToCSV);

    // Phase 12: Community tabs initialization
    initCommunityTabs();

    // Phase 14: Nutrition tabs initialization
    initNutritionTabs();

    // Modal
    document.getElementById('modal-close')?.addEventListener('click', closeModal);
    document.getElementById('modal-overlay')?.addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });

    // Timer
    document.querySelectorAll('.timer-preset').forEach(btn => {
      btn.addEventListener('click', () => setTimer(+btn.dataset.sec));
    });
    bind('timer-start',  () => {
      if (intervalState.mode === 'interval' && !state.timerRunning && intervalState.currentRound === 0) {
        startIntervalTimer();
      } else {
        state.timerRunning ? pauseTimer() : startTimer();
      }
    });
    bind('timer-reset',  resetTimer);

    // Timer mode toggle & interval inputs
    toggleTimerMode();
    const intervalInputs = ['interval-work', 'interval-rest', 'interval-rounds'];
    intervalInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', updateIntervalDuration);
        el.addEventListener('input', updateIntervalDuration);
      }
    });

    // Init étapes
    goCalcStep(1);
    goPage('calc');
    updateTimerDisplay();
  }

  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // API publique
  return { goPage, toggleDay, openExoById, deleteLog, setTimer, setTimerPreset: setTimer, startRestTimer, updateChart, saveCalcHistory, loadCalcHistory, restoreCalcHistoryEntry, toggleAuthForm: () => AUTH.toggleAuthForm(), syncLogbook: () => AUTH.syncLogbook(state.logbook), syncCalculations: () => AUTH.syncCalculations(loadCalcHistory()), switchView, exportToCSV, saveProfile, loadProfile, addFriend, removeFriend, renderFriends, generateShareLink, copyShareLink, calculate1RM, addBodyfat, removeBodyfat, renderBodyfatChart, renderBodyfatList, renderTonnageChart, renderTopExercises, renderAnalyticsView, addMeal, removeMeal, renderMeals, updateMacros, addQuickFood, addRecipe, removeRecipe, renderRecipes, addMealFromRecipe, generateShoppingList, renderShoppingList, toggleShoppingItem, removeShoppingItem, clearShoppingList, printShoppingList };

})();