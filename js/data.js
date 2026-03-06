'use strict';

// ═══════════════════════════════════════════════════════════
// IMAGE MAPPING BY MUSCLE GROUP
// ═══════════════════════════════════════════════════════════
const MUSCLE_IMAGES = {
  'chest': 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=300&fit=crop',
  'back': 'https://images.unsplash.com/photo-1598971457318-b3d1e678e53d?w=400&h=300&fit=crop',
  'shoulders': 'https://images.unsplash.com/photo-1597594057306-201ebd8d7c9f?w=400&h=300&fit=crop',
  'biceps': 'https://images.unsplash.com/photo-1535743686920-55e06d675f3e?w=400&h=300&fit=crop',
  'triceps': 'https://images.unsplash.com/photo-1612036782180-69c773e2edd0?w=400&h=300&fit=crop',
  'legs': 'https://images.unsplash.com/photo-1623238282019-f2b4d6ab175f?w=400&h=300&fit=crop',
  'glutes': 'https://images.unsplash.com/photo-1605296867004-e92036692add?w=400&h=300&fit=crop',
  'abs': 'https://images.unsplash.com/photo-1608935585620-bd8266be4356?w=400&h=300&fit=crop',
  'cardio': 'https://images.unsplash.com/photo-1552196881-acf06e488b2e?w=400&h=300&fit=crop'
};

// SVG icons for each muscle group
const MUSCLE_SVG = {
  'chest': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11z"/></svg>',
  'back': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>',
  'shoulders': '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/></svg>',
  'biceps': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>',
  'triceps': '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>',
  'legs': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2v8m0 8v4M5 10h14v12H5z"/></svg>',
  'glutes': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" opacity="0.5"/></svg>',
  'abs': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"/></svg>',
  'cardio': '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
};

const DATA = (() => {

  /* ═══════════════════════════════════════════════════════════
     BIBLIOTHÈQUE D'EXERCICES
     Muscles : chest, back, shoulders, biceps, triceps,
               legs, glutes, abs, cardio
  ═══════════════════════════════════════════════════════════ */
  const EXERCISES = [
    // ── PECTORAUX ──────────────────────────────────────────
    { id:'e01', name:'Développé couché', muscle:'chest', icon:'🏋️',
      secondary:['triceps','shoulders'], difficulty:'intermediaire',
      equipment:'Barre + banc', sets:'3–5', reps:'6–12', rest:120,
      steps:[
        { t:'Position', d:'Allonge-toi sur le banc, pieds à plat au sol. Barre au-dessus de la poitrine, prise légèrement plus large que les épaules.' },
        { t:'Descente', d:'Descends la barre lentement (2-3 sec) jusqu\'à effleurer le bas de ta poitrine. <strong>Coudes à 45-75°</strong>, pas à 90°.' },
        { t:'Poussée', d:'Pousse explosif vers le haut en contractant les pectoraux. Expire pendant l\'effort. Ne verrouille pas les coudes en haut.' },
        { t:'Contrôle', d:'Garde les omoplates rétractées et la poitrine haute tout au long du mouvement. Le dos ne décolle pas du banc.' },
      ],
      tips:'Vise le bas des pectoraux pour maximiser l\'activation. Une prise trop large augmente le stress sur les épaules.' },

    { id:'e02', name:'Développé incliné haltères', muscle:'chest', icon:'🏋️',
      secondary:['shoulders','triceps'], difficulty:'intermediaire',
      equipment:'Haltères + banc incliné', sets:'3–4', reps:'8–15', rest:90,
      steps:[
        { t:'Angle', d:'Banc à 30-45°. Plus l\'angle est faible, plus tu cibles le haut des pectoraux.' },
        { t:'Position haltères', d:'Haltères au niveau des épaules, paumes vers l\'avant. Coudes légèrement fléchis.' },
        { t:'Presse', d:'Pousse les haltères vers le haut et légèrement vers l\'intérieur. Contracte les pecs en haut.' },
        { t:'Descente', d:'Descends jusqu\'à un léger étirement des pectoraux. Ne dépasse pas le niveau des épaules.' },
      ],
      tips:'Idéal pour compléter le développé couché et cibler le chef claviculaire souvent négligé.' },

    { id:'e03', name:'Écarté aux haltères', muscle:'chest', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltères + banc', sets:'3', reps:'12–15', rest:75,
      steps:[
        { t:'Départ', d:'Allongé sur banc plat, haltères au-dessus de la poitrine, paumes face à face. Légère flexion des coudes.' },
        { t:'Descente', d:'Ouvre les bras en arc de cercle jusqu\'à ressentir l\'étirement dans la poitrine. <strong>Garde les coudes fléchis</strong>.' },
        { t:'Retour', d:'Remonte en arc de cercle en expirant, comme si tu enlaçais un arbre. Contracte les pecs en haut.' },
      ],
      tips:'Exercice d\'isolation. Préfère des charges légères avec grand amplitude plutôt que de la charge lourde.' },

    { id:'e04', name:'Dips pectoraux', muscle:'chest', icon:'🤸',
      secondary:['triceps','shoulders'], difficulty:'intermediaire',
      equipment:'Barres parallèles', sets:'3–4', reps:'8–15', rest:90,
      steps:[
        { t:'Prise', d:'Mains sur barres, bras tendus. Incline le tronc vers l\'avant à ~30° pour cibler les pecs.' },
        { t:'Descente', d:'Descends jusqu\'à ce que les bras soient à 90°. Ressens l\'étirement dans la poitrine.' },
        { t:'Poussée', d:'Remonte en poussant fort, contracte les pecs en haut. Ne te balance pas.' },
      ],
      tips:'L\'inclinaison du tronc vers l\'avant est essentielle. Si tu restes droit, ce sont les triceps qui travaillent.' },

    { id:'e23', name:'Développé incliné barre', muscle:'chest', icon:'🏋️',
      secondary:['shoulders','triceps'], difficulty:'intermediaire',
      equipment:'Barre + Banc incliné', sets:'3–4', reps:'8–12', rest:120,
      steps:[
        { t:'Position', d:'Banc incliné à 30°. Allonge-toi et saisis la barre un peu plus large que les épaules.' },
        { t:'Descente', d:'Descends la barre de manière contrôlée jusqu\'au haut de tes pectoraux (sous les clavicules).' },
        { t:'Poussée', d:'Pousse la barre vers le haut jusqu\'à l\'extension des bras sans décoller les épaules du banc.' },
      ],
      tips:'Garde les omoplates bien resserrées pour protéger tes épaules et cibler le haut des pectoraux.' },

    // ── DOS ────────────────────────────────────────────────
    { id:'e05', name:'Soulevé de terre', muscle:'back', icon:'🏋️',
      secondary:['legs','glutes','biceps'], difficulty:'avance',
      equipment:'Barre', sets:'3–5', reps:'3–8', rest:180,
      steps:[
        { t:'Position de départ', d:'Pieds à largeur des hanches, barre au-dessus des pieds (5 cm). Dos plat, regard vers le bas, prise en pronation.' },
        { t:'Mise en tension', d:'Avant de tirer : inspire profond, rentre le ventre (Valsalva). Prends le slack de la barre.' },
        { t:'Tirage', d:'Pousse le sol vers le bas avec les jambes. La barre monte le long des tibias. <strong>Garde le dos neutre absolument</strong>.' },
        { t:'Lockout', d:'En haut : hanches poussées vers l\'avant, épaules en arrière. Expire. Descente contrôlée.' },
      ],
      tips:'C\'est l\'exercice roi. Ne négocie jamais la technique pour ajouter du poids. Filmez-vous de profil pour vérifier.' },

    { id:'e06', name:'Tractions (Pull-ups)', muscle:'back', icon:'🤸',
      secondary:['biceps'], difficulty:'intermediaire',
      equipment:'Barre de traction', sets:'3–5', reps:'5–12', rest:120,
      steps:[
        { t:'Prise', d:'Prise pronation (paumes vers l\'avant), légèrement plus large que les épaules.' },
        { t:'Rétraction', d:'Avant de monter : rétracte les omoplates, engage le dos. Pas de momentum.' },
        { t:'Tirage', d:'Tire les coudes vers le bas et vers les hanches. Monte jusqu\'au menton au-dessus de la barre.' },
        { t:'Descente', d:'Descends complètement, bras tendus, pour maximiser l\'amplitude. Contrôlé.' },
      ],
      tips:'Si tu ne peux pas faire une traction, commence par les tractions assistées à la machine ou les rangées horizontales.' },

    { id:'e07', name:'Rowing barre', muscle:'back', icon:'🏋️',
      secondary:['biceps','rear-delts'], difficulty:'intermediaire',
      equipment:'Barre', sets:'3–4', reps:'8–12', rest:90,
      steps:[
        { t:'Position', d:'Penché à ~45°, dos plat, genoux légèrement fléchis. Barre prise en pronation sous les épaules.' },
        { t:'Tirage', d:'Tire la barre vers le bas du ventre. <strong>Coudes proches du corps</strong>, omoplates rétractées en fin de mouvement.' },
        { t:'Contrôle', d:'Descends la barre lentement (2 sec). Ne laisse pas le dos s\'arrondir.' },
      ],
      tips:'L\'angle du tronc détermine quelle partie du dos tu travailles. 45° = dos moyen. Plus horizontal = bas du dos.' },

    { id:'e08', name:'Lat Pulldown', muscle:'back', icon:'💪',
      secondary:['biceps'], difficulty:'debutant',
      equipment:'Poulie haute', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Installation', d:'Assis, cuisses bloquées sous les supports. Prise large en pronation sur la barre.' },
        { t:'Rétraction', d:'Avant de tirer : rentre la poitrine, légère cambrure, omoplates abaissées.' },
        { t:'Tirage', d:'Tire la barre vers le haut de la poitrine. Coudes pointent vers le bas et le sol.' },
        { t:'Retour', d:'Laisse la barre remonter complètement pour étirer les dorsaux. Garde le contrôle.' },
      ],
      tips:'Parfait pour apprendre le mouvement de traction. Évite de tirer derrière la nuque, c\'est inutile et risqué.' },

    { id:'e24', name:'Rowing haltère unilatéral', muscle:'back', icon:'💪',
      secondary:['biceps'], difficulty:'debutant',
      equipment:'Haltère + Banc', sets:'3', reps:'10–12', rest:60,
      steps:[
        { t:'Position', d:'Un genou et une main posés sur un banc horizontal. Dos plat, parallèle au sol.' },
        { t:'Tirage', d:'Tire l\'haltère vers ta hanche en gardant le coude près du corps.' },
        { t:'Contraction', d:'Resserre l\'omoplate en haut du mouvement. Descends en contrôlant jusqu\'à l\'étirement complet.' },
      ],
      tips:'Idéal pour corriger les déséquilibres de force entre le côté gauche et le côté droit.' },

    { id:'e25', name:'Tirage horizontal poulie', muscle:'back', icon:'💪',
      secondary:['biceps'], difficulty:'debutant',
      equipment:'Poulie basse + triangle', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Position', d:'Assis face à la poulie, pieds calés, genoux légèrement fléchis. Garde le buste bien droit.' },
        { t:'Tirage', d:'Tire la poignée vers le nombril en tirant les coudes vers l\'arrière.' },
        { t:'Retour', d:'Raccompagne la charge lentement en laissant les épaules partir légèrement vers l\'avant pour étirer le dos.' },
      ],
      tips:'Ne te balance pas d\'avant en arrière. Le mouvement doit venir du dos et des bras.' },

    // ── ÉPAULES ────────────────────────────────────────────
    { id:'e09', name:'Développé militaire', muscle:'shoulders', icon:'🏋️',
      secondary:['triceps'], difficulty:'intermediaire',
      equipment:'Barre ou haltères', sets:'3–5', reps:'6–12', rest:120,
      steps:[
        { t:'Position debout', d:'Barre à hauteur des clavicules, prise légèrement plus large que les épaules. Abdos contractés.' },
        { t:'Poussée', d:'Pousse la barre directement au-dessus de la tête. <strong>La tête recule légèrement</strong> pour laisser passer la barre.' },
        { t:'Lockout', d:'Bras tendus au-dessus, barre dans le plan des oreilles. Serres les fessiers pour stabiliser.' },
        { t:'Descente', d:'Ramène la barre au départ de façon contrôlée. Inspire pendant la descente.' },
      ],
      tips:'Évite de cambrer excessivement le bas du dos. Si c\'est le cas, la charge est trop lourde ou le core manque de force.' },

    { id:'e10', name:'Élévations latérales', muscle:'shoulders', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltères', sets:'3–4', reps:'12–20', rest:60,
      steps:[
        { t:'Position', d:'Debout, haltères le long du corps, légère flexion des coudes. Dos droit.' },
        { t:'Élévation', d:'Monte les bras sur les côtés jusqu\'à hauteur des épaules. Pouces légèrement vers le bas (comme vider un verre).' },
        { t:'Contrôle', d:'Descends lentement (3 sec). Ne balance pas le corps. L\'effort vient des deltoïdes.' },
      ],
      tips:'Exercice d\'isolation pour les deltoïdes latéraux. Charge légère, amplitude complète, tempo lent = meilleur résultat.' },

    { id:'e11', name:'Face pull', muscle:'shoulders', icon:'💪',
      secondary:['back'], difficulty:'debutant',
      equipment:'Poulie haute + corde', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Installation', d:'Poulie à hauteur de visage, corde. Recule de 1-2 pas pour créer de la tension.' },
        { t:'Tirage', d:'Tire la corde vers le visage, paumes vers le bas puis en rotation vers le haut en fin de mouvement.' },
        { t:'Contraction', d:'En fin de mouvement, les coudes sont hauts, le dos des mains face au plafond. Contracte les arrière-deltoïdes.' },
      ],
      tips:'Exercice indispensable pour la santé des épaules. Contre-équilibre les mouvements de presse. À faire à chaque séance épaules.' },

    { id:'e26', name:'Développé Arnold', muscle:'shoulders', icon:'💪',
      secondary:['triceps'], difficulty:'intermediaire',
      equipment:'Haltères', sets:'3', reps:'10–12', rest:90,
      steps:[
        { t:'Départ', d:'Assis, haltères devant le visage, paumes tournées vers toi (pronation inversée).' },
        { t:'Poussée', d:'Pousse vers le haut tout en effectuant une rotation des poignets.' },
        { t:'Arrivée', d:'En haut, les bras sont tendus et les paumes sont face à l\'avant. Fais le mouvement inverse à la descente.' },
      ],
      tips:'Excellent pour solliciter simultanément l\'avant et le faisceau latéral de l\'épaule.' },

    { id:'e27', name:'Oiseau aux haltères', muscle:'shoulders', icon:'💪',
      secondary:['back'], difficulty:'debutant',
      equipment:'Haltères', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Position', d:'Buste penché en avant (presque parallèle au sol), genoux légèrement fléchis. Haltères pendants.' },
        { t:'Élévation', d:'Ouvre les bras vers l\'extérieur en gardant une légère flexion des coudes.' },
        { t:'Contraction', d:'Resserre les omoplates en fin de mouvement et redescends en contrôlant.' },
      ],
      tips:'Cible parfaitement l\'arrière de l\'épaule (deltoïde postérieur). Reste bien penché pour ne pas utiliser le dos.' },

    // ── BICEPS ─────────────────────────────────────────────
    { id:'e12', name:'Curl barre', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Barre EZ ou droite', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Position', d:'Debout, barre prise en supination (paumes vers le haut), bras tendus. Coudes contre le corps.' },
        { t:'Flexion', d:'Monte la barre en fléchissant les coudes. <strong>Les coudes ne bougent pas</strong>. Contracte les biceps en haut.' },
        { t:'Descente', d:'Descends lentement (2-3 sec) jusqu\'à extension complète. Ne bascule pas le corps.' },
      ],
      tips:'La qualité prime sur la charge. Les trompeurs (balancement du corps) réduisent le travail des biceps.' },

    { id:'e13', name:'Curl marteau', muscle:'biceps', icon:'💪',
      secondary:['forearms'], difficulty:'debutant',
      equipment:'Haltères', sets:'3', reps:'12–15', rest:60,
      steps:[
        { t:'Prise', d:'Haltères en prise neutre (paumes face à face), comme si tu tenais un marteau.' },
        { t:'Flexion', d:'Monte les haltères en gardant la prise neutre. Travaille chaque bras en alternance ou simultanément.' },
        { t:'Descente', d:'Contrôle la descente, extension complète pour maximiser l\'amplitude.' },
      ],
      tips:'Travaille davantage le brachial et le brachio-radial. Excellent pour l\'épaisseur du bras.' },

    { id:'e28', name:'Curl incliné haltères', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'intermediaire',
      equipment:'Haltères + Banc incliné', sets:'3', reps:'10–12', rest:75,
      steps:[
        { t:'Position', d:'Assis sur un banc incliné (45-60°), bras ballants vers le sol.' },
        { t:'Flexion', d:'Fléchis les coudes pour monter les haltères tout en gardant les coudes pointés vers le sol.' },
        { t:'Descente', d:'Descends lentement pour bien ressentir l\'étirement du biceps en bas du mouvement.' },
      ],
      tips:'Cet exercice place le biceps dans une position d\'étirement maximale, idéal pour l\'hypertrophie.' },

    { id:'e29', name:'Curl pupitre (Preacher)', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Banc pupitre + Barre', sets:'3', reps:'10–12', rest:75,
      steps:[
        { t:'Installation', d:'Assis au pupitre, aisselles bien calées sur le haut du support. Bras parallèles.' },
        { t:'Mouvement', d:'Remonte la barre vers tes épaules en contractant fort les biceps.' },
        { t:'Descente', d:'Descends jusqu\'à tendre presque complètement les bras, mais garde une légère flexion pour éviter de blesser le tendon.' },
      ],
      tips:'Impossible de tricher sur ce mouvement. Parfait pour l\'isolation pure du biceps.' },

    // ── TRICEPS ────────────────────────────────────────────
    { id:'e14', name:'Dips triceps', muscle:'triceps', icon:'🤸',
      secondary:['chest'], difficulty:'intermediaire',
      equipment:'Banc ou chaise', sets:'3–4', reps:'10–15', rest:90,
      steps:[
        { t:'Position', d:'Mains sur le banc, derrière toi. Corps vertical, jambes tendues devant (ou fléchies pour faciliter).' },
        { t:'Descente', d:'Descends en fléchissant les coudes, qui pointent vers l\'arrière. Jusqu\'à 90° de flexion.' },
        { t:'Poussée', d:'Remonte en poussant avec les triceps. Garde le tronc vertical pour isoler les triceps.' },
      ],
      tips:'Si c\'est trop facile : jambes tendues, puis ajouter du poids sur les cuisses.' },

    { id:'e15', name:'Pushdown poulie', muscle:'triceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Poulie haute + barre V', sets:'3–4', reps:'12–15', rest:60,
      steps:[
        { t:'Position', d:'Debout face à la poulie, prise de la barre V. Coudes contre le corps, légèrement penchés en avant.' },
        { t:'Extension', d:'Pousse la barre vers le bas jusqu\'à extension complète. <strong>Coudes fixes</strong> – seuls les avant-bras bougent.' },
        { t:'Retour', d:'Remonte doucement jusqu\'à 90° de flexion. Garde le contrôle.' },
      ],
      tips:'Idéal en fin de séance pour finir les triceps avec du volume. Parfait pour apprendre l\'isolation.' },

    { id:'e30', name:'Extension au-dessus de la tête', muscle:'triceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltère ou Poulie', sets:'3', reps:'12–15', rest:75,
      steps:[
        { t:'Position', d:'Assis ou debout, tiens un haltère à deux mains derrière la nuque.' },
        { t:'Mouvement', d:'Tends les bras vers le haut en gardant les coudes proches des oreilles.' },
        { t:'Descente', d:'Descends l\'haltère derrière ta tête en contrôlant pour bien étirer les triceps.' },
      ],
      tips:'Cible parfaitement la longue portion du triceps, responsable du volume du bras.' },

    { id:'e31', name:'Barre au front (Skullcrushers)', muscle:'triceps', icon:'🏋️',
      secondary:[], difficulty:'intermediaire',
      equipment:'Barre EZ + Banc', sets:'3–4', reps:'10–12', rest:90,
      steps:[
        { t:'Position', d:'Allongé sur le banc, bras tendus vers le plafond avec la barre EZ.' },
        { t:'Descente', d:'Fléchis les coudes pour amener la barre juste au-dessus de ton front (ou derrière ta tête).' },
        { t:'Poussée', d:'Remonte la barre à la position de départ en contractant fort les triceps.' },
      ],
      tips:'Garde tes coudes fixes et pointés vers le plafond. Ne les laisse pas s\'écarter vers l\'extérieur.' },

    // ── JAMBES ─────────────────────────────────────────────
    { id:'e16', name:'Squat', muscle:'legs', icon:'🏋️',
      secondary:['glutes','back'], difficulty:'intermediaire',
      equipment:'Barre + rack', sets:'3–5', reps:'5–10', rest:150,
      steps:[
        { t:'Position', d:'Barre sur les trapèzes, pieds à largeur des épaules ou légèrement plus, orteils légèrement tournés.' },
        { t:'Descente', d:'Descends en poussant les genoux dans la direction des orteils. Garde le dos droit, le regard haut.' },
        { t:'Profondeur', d:'Vise les cuisses parallèles au sol minimum. Plus bas = meilleure activation. Garde les talons au sol.' },
        { t:'Remontée', d:'Pousse à travers les talons. Hanches et épaules montent à la même vitesse. Expire.' },
      ],
      tips:'Le roi des exercices pour le bas du corps. La mobilité des chevilles limite souvent la profondeur — travaille-la.' },

    { id:'e17', name:'Leg press', muscle:'legs', icon:'💪',
      secondary:['glutes'], difficulty:'debutant',
      equipment:'Machine leg press', sets:'3–4', reps:'10–15', rest:90,
      steps:[
        { t:'Installation', d:'Dos plat contre le dossier, pieds à largeur des épaules au milieu de la plateforme.' },
        { t:'Descente', d:'Descends jusqu\'à 90° de flexion. <strong>Le bas du dos ne décolle pas</strong> du siège.' },
        { t:'Poussée', d:'Pousse à travers toute la plante des pieds, pas seulement les orteils. Ne verrouille pas les genoux.' },
      ],
      tips:'Excellent pour ajouter du volume sans stress sur la colonne. Pieds hauts = plus de fessiers. Pieds bas = plus de quadriceps.' },

    { id:'e18', name:'Fentes', muscle:'legs', icon:'🤸',
      secondary:['glutes'], difficulty:'debutant',
      equipment:'Poids de corps / haltères', sets:'3', reps:'10–12 par jambe', rest:75,
      steps:[
        { t:'Pas', d:'Fais un grand pas en avant. Pied avant à plat, pied arrière sur la pointe.' },
        { t:'Descente', d:'Descends le genou arrière vers le sol, genou avant à 90°. Tronc droit.' },
        { t:'Remontée', d:'Pousse sur le talon du pied avant pour revenir. Ou avance et recommence (fentes marchées).' },
      ],
      tips:'Exercice unilatéral excellent pour corriger les déséquilibres. Alterne les jambes ou fais tout d\'un côté puis l\'autre.' },

    { id:'e32', name:'Leg Extension', muscle:'legs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine', sets:'3', reps:'12–15', rest:60,
      steps:[
        { t:'Installation', d:'Assis sur la machine, le coussin placé au niveau de tes chevilles. Le dos bien calé au fond du siège.' },
        { t:'Mouvement', d:'Tends les jambes pour soulever la charge en contractant fortement les quadriceps.' },
        { t:'Contrôle', d:'Maintiens une seconde en haut, puis redescends en retenant le poids.' },
      ],
      tips:'Parfait pour finir ta séance jambes et isoler spécifiquement les quadriceps.' },

    // ── FESSIERS ──────────────────────────────────────────
    { id:'e19', name:'Hip thrust', muscle:'glutes', icon:'🏋️',
      secondary:['legs'], difficulty:'intermediaire',
      equipment:'Barre + banc', sets:'3–4', reps:'10–15', rest:90,
      steps:[
        { t:'Position', d:'Épaules appuyées sur le banc, barre sur les hanches protégée par un pad. Pieds à plat, genoux à 90°.' },
        { t:'Poussée', d:'Pousse les hanches vers le haut jusqu\'à alignement corps-cuisses. Serre fort les fessiers.' },
        { t:'Contraction', d:'Tiens 1-2 sec en haut. Pense à pousser les genoux légèrement vers l\'extérieur.' },
        { t:'Descente', d:'Descends contrôlé sans que les fessiers ne touchent le sol entre les répétitions.' },
      ],
      tips:'Meilleur exercice pour les fessiers. Prouve par EMG. La contraction en haut est la clé — ne bâcle pas le lockout.' },

    { id:'e20', name:'Romanian Deadlift', muscle:'glutes', icon:'🏋️',
      secondary:['back','legs'], difficulty:'intermediaire',
      equipment:'Barre ou haltères', sets:'3–4', reps:'8–12', rest:90,
      steps:[
        { t:'Position', d:'Debout, barre devant les cuisses. Dos plat, légère flexion des genoux tout au long.' },
        { t:'Descente', d:'Pousse les hanches vers l\'arrière (hinge). La barre descend le long des jambes. Ressens l\'étirement des ischio-jambiers.' },
        { t:'Remontée', d:'Pousse les hanches vers l\'avant. <strong>Ce sont les fessiers qui tirent, pas le dos</strong>.' },
      ],
      tips:'À ne pas confondre avec le SdT classique. Genoux quasi-fixes, mouvement vient des hanches. Étirement profond des ischio.' },

    // ── ABDOMINAUX ─────────────────────────────────────────
    { id:'e21', name:'Planche', muscle:'abs', icon:'🤸',
      secondary:['back'], difficulty:'debutant',
      equipment:'Poids de corps', sets:'3', reps:'30–90 sec', rest:60,
      steps:[
        { t:'Position', d:'Avant-bras au sol, coudes sous les épaules. Corps en ligne droite des talons à la tête.' },
        { t:'Engagement', d:'Contracte les abdos, les fessiers et les quadriceps. <strong>Ne laisse pas les hanches tomber</strong>.' },
        { t:'Respiration', d:'Respire normalement. Tiens la position sans bloquer la respiration.' },
      ],
      tips:'Qualité > durée. 30 sec parfaite vaut mieux que 2 min avec les hanches qui s\'effondrent.' },

    { id:'e22', name:'Crunch câble', muscle:'abs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Poulie haute + corde', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Position', d:'À genoux face à la poulie, corde tenue derrière la tête. Hanches fixes.' },
        { t:'Flexion', d:'Fléchis le tronc vers le bas, coudes vers les cuisses. <strong>Les hanches ne bougent pas</strong>.' },
        { t:'Contraction', d:'Contracte les abdos fort en bas. Remonte lentement.' },
      ],
      tips:'Supérieur aux crunchs au sol car tu peux ajouter de la résistance et progresser avec du poids.' },

    // ── ABDOMINAUX SUPPLÉMENTAIRES ──────────────────────────
    { id:'e33', name:'Mountain Climbers', muscle:'abs', icon:'🤸',
      secondary:['legs'], difficulty:'debutant',
      equipment:'Poids de corps', sets:'3', reps:'30–45 sec', rest:45,
      steps:[
        { t:'Position', d:'Position de pompe, bras tendus, corps en ligne droite. Poignets sous les épaules.' },
        { t:'Mouvement', d:'Ramène alternativement chaque genou vers la poitrine en gardant les hanches basses.' },
        { t:'Rythme', d:'Commence lentement pour maîtriser la technique, puis accélère progressivement. Expire à chaque genou rentré.' },
      ],
      tips:'Exercice cardio-abdominal excellent pour la densité musculaire et la dépense calorique.' },

    { id:'e34', name:'Crunch inversé', muscle:'abs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Poids de corps / sol', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Position', d:'Allongé sur le dos, jambes tendues vers le plafond, perpendiculaires au sol. Mains sous les fessiers.' },
        { t:'Mouvement', d:'Soulève les hanches du sol en poussant les pieds vers le plafond. Contracte les abdos bas.' },
        { t:'Descente', d:'Redescends les hanches sans que les jambes ne tombent en avant. Garde le contrôle.' },
      ],
      tips:'Cible spécifiquement la partie basse des abdominaux, souvent négligée par les crunchs classiques.' },

    { id:'e35', name:'Russian Twist', muscle:'abs', icon:'🤸',
      secondary:[], difficulty:'debutant',
      equipment:'Poids de corps / disque', sets:'3', reps:'20–30 rotations', rest:60,
      steps:[
        { t:'Position', d:'Assis au sol, jambes fléchies légèrement levées (ou posées). Dos incliné à ~45°.' },
        { t:'Rotation', d:'Tourne le buste de gauche à droite en touchant le sol de chaque côté. Garde le ventre rentré.' },
        { t:'Progression', d:'Ajoute un disque, une bouteille d\'eau ou un haltère pour augmenter la résistance.' },
      ],
      tips:'Excellent pour les obliques. Garde les épaules basses et le mouvement vient de la taille, pas des bras.' },

    // ── MOLLETS ──────────────────────────────────────────────
    { id:'e36', name:'Mollets debout', muscle:'legs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Poids de corps / haltères / machine', sets:'4', reps:'15–25', rest:60,
      steps:[
        { t:'Position', d:'Debout sur le bord d\'une marche ou au sol. Pointe des pieds vers l\'avant. Haltères ou barre pour ajouter du poids.' },
        { t:'Montée', d:'Monte sur la pointe des pieds le plus haut possible. Contracte fort les mollets en haut.' },
        { t:'Descente', d:'Descends lentement sous la ligne du sol pour maximiser l\'étirement (si sur une marche). Tempo 2-0-2.' },
      ],
      tips:'Les mollets récupèrent vite — vise beaucoup de volume (15–25 reps) et un tempo lent pour les fatiguer vraiment.' },

    // ── DOS SUPPLÉMENTAIRES ──────────────────────────────────
    { id:'e37', name:'Hyperextension', muscle:'back', icon:'🤸',
      secondary:['glutes'], difficulty:'debutant',
      equipment:'Banc à lombaires / sol', sets:'3', reps:'12–15', rest:75,
      steps:[
        { t:'Installation', d:'Sur le banc à lombaires, hanches calées sur le pad. Corps à 45° vers le bas, bras croisés sur la poitrine.' },
        { t:'Montée', d:'Remonte le buste jusqu\'à alignement parfait hanches-dos. Contracte les lombaires et les fessiers en haut.' },
        { t:'Descente', d:'Descends lentement. Ne dépasse pas la ligne neutre pour protéger le bas du dos.' },
      ],
      tips:'Indispensable pour renforcer les lombaires et prévenir les blessures. Commence sans poids.' },

    { id:'e38', name:'Good Morning', muscle:'back', icon:'🏋️',
      secondary:['glutes','legs'], difficulty:'intermediaire',
      equipment:'Barre légère', sets:'3', reps:'10–12', rest:90,
      steps:[
        { t:'Position', d:'Barre sur les trapèzes (comme pour le squat), pieds à largeur des épaules. Genoux légèrement fléchis.' },
        { t:'Flexion', d:'Penche le buste vers l\'avant en poussant les hanches vers l\'arrière (hip hinge). Dos reste plat.' },
        { t:'Retour', d:'Remonte en poussant les hanches vers l\'avant. Ce sont les ischio-jambiers qui font le travail.' },
      ],
      tips:'Commence avec une barre vide. Excellent pour la chaîne postérieure et la proprioception lombaire.' },

    // ── PECTORAUX SUPPLÉMENTAIRES ────────────────────────────
    { id:'e39', name:'Pompes', muscle:'chest', icon:'🤸',
      secondary:['triceps','shoulders'], difficulty:'debutant',
      equipment:'Poids de corps', sets:'3–5', reps:'Max / 15–25', rest:75,
      steps:[
        { t:'Position', d:'Mains au sol légèrement plus larges que les épaules. Corps en ligne droite, abdos contractés.' },
        { t:'Descente', d:'Descends jusqu\'à effleurer le sol avec la poitrine. Coudes à 45° du corps, pas écartés à 90°.' },
        { t:'Poussée', d:'Remonte en explosant vers le haut. Pour plus de difficulté : pieds surélevés (haut pecs) ou lest.' },
      ],
      tips:'Le mouvement parfait pour voyager ou s\'échauffer. Les pompes déclinées (pieds en hauteur) ciblent le haut des pecs.' },

    // ── JAMBES SUPPLÉMENTAIRES ───────────────────────────────
    { id:'e40', name:'Squat gobelet', muscle:'legs', icon:'🤸',
      secondary:['glutes','abs'], difficulty:'debutant',
      equipment:'Haltère ou kettlebell', sets:'3', reps:'12–15', rest:75,
      steps:[
        { t:'Prise', d:'Tiens un haltère ou kettlebell à deux mains contre ta poitrine, coudes pointés vers le bas.' },
        { t:'Descente', d:'Descends en squat profond, les coudes passant à l\'intérieur des genoux. Talon au sol.' },
        { t:'Remontée', d:'Pousse à travers les talons. Le contrepoids devant aide à rester bien droit.' },
      ],
      tips:'Parfait pour apprendre la mécanique du squat. Le poids devant améliore naturellement la posture.' },

    { id:'e41', name:'Leg Curl couché', muscle:'legs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine leg curl', sets:'3–4', reps:'12–15', rest:75,
      steps:[
        { t:'Installation', d:'Allongé face vers le bas sur la machine. Le pad repose juste au-dessus des talons.' },
        { t:'Flexion', d:'Fléchis les genoux pour ramener les talons vers les fesses. Contracte fort les ischio-jambiers.' },
        { t:'Descente', d:'Redescends lentement (3 sec). Ne bascule pas les hanches pour aider.' },
      ],
      tips:'Isole parfaitement les ischio-jambiers. Essentiels pour équilibrer le développement avec les quadriceps.' },

    // ── ÉPAULES SUPPLÉMENTAIRES ──────────────────────────────
    { id:'e42', name:'Shrugs haltères', muscle:'shoulders', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltères', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Position', d:'Debout, haltères le long du corps, bras tendus. Dos droit, regard devant.' },
        { t:'Haussement', d:'Monte les épaules vers les oreilles le plus haut possible. Tiens 1 sec en haut.' },
        { t:'Descente', d:'Redescends lentement. Ne tourne pas les épaules — mouvement purement vertical.' },
      ],
      tips:'Cible les trapèzes supérieurs. Pour les trapèzes moyens et inférieurs, préfère les face pulls et rowing.' },

    { id:'e43', name:'Élévations frontales', muscle:'shoulders', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltères / barre', sets:'3', reps:'12–15', rest:60,
      steps:[
        { t:'Position', d:'Debout, haltères devant les cuisses en prise pronation (paumes vers le bas).' },
        { t:'Élévation', d:'Monte les bras devant toi jusqu\'à hauteur des épaules. Garde les coudes légèrement fléchis.' },
        { t:'Descente', d:'Redescends lentement. Ne balance pas le corps pour aider.' },
      ],
      tips:'Cible les deltoïdes antérieurs. À utiliser avec modération — déjà bien travaillés par les développés.' },

    // ── BICEPS SUPPLÉMENTAIRES ───────────────────────────────
    { id:'e44', name:'Curl concentration', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltère', sets:'3', reps:'12–15 par bras', rest:60,
      steps:[
        { t:'Position', d:'Assis sur un banc, jambes écartées. Coude calé contre l\'intérieur de la cuisse. Haltère dans la main.' },
        { t:'Flexion', d:'Monte l\'haltère vers l\'épaule en contractant fort le biceps. Tourne légèrement le poignet vers l\'extérieur.' },
        { t:'Contraction', d:'Tiens 1 sec en haut en serrant fort. Descends lentement jusqu\'à extension complète.' },
      ],
      tips:'Arnold considérait ce mouvement comme le meilleur pour le pic du biceps. L\'isolation est maximale.' },

    // ── TRICEPS SUPPLÉMENTAIRES ──────────────────────────────
    { id:'e45', name:'Pompes diamant', muscle:'triceps', icon:'🤸',
      secondary:['chest'], difficulty:'intermediaire',
      equipment:'Poids de corps', sets:'3–4', reps:'10–20', rest:75,
      steps:[
        { t:'Position', d:'Mains au sol, pouces et index se touchant pour former un diamant sous la poitrine.' },
        { t:'Descente', d:'Descends en gardant les coudes proches du corps. La poitrine descend vers les mains.' },
        { t:'Poussée', d:'Remonte en poussant fort. Les triceps font l\'essentiel du travail.' },
      ],
      tips:'Variante des pompes qui transfère le travail des pectoraux vers les triceps. Parfait sans matériel.' },

    // ── FESSIERS SUPPLÉMENTAIRES ─────────────────────────────
    { id:'e46', name:'Abduction hanche', muscle:'glutes', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine / élastique', sets:'3–4', reps:'15–20', rest:60,
      steps:[
        { t:'Position', d:'Debout ou assis à la machine. Élastique autour des genoux pour la version sol.' },
        { t:'Abduction', d:'Écarte la jambe (ou les deux genoux) vers l\'extérieur contre la résistance. Contracte les fessiers.' },
        { t:'Retour', d:'Ramène lentement. Ne laisse pas les genoux tomber vers l\'intérieur entre les répétitions.' },
      ],
      tips:'Cible le moyen fessier, crucial pour la stabilité des hanches et un aspect arrondi du fessier.' },

    // ── PHASE 8: ADDITIONAL EXERCISES ───────────────────────

    // CHEST
    { id:'e47', name:'Écarté à la poulie basse', muscle:'chest', icon:'🏋️',
      secondary:['shoulders'], difficulty:'intermediaire',
      equipment:'Poulies', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Position', d:'Debout au centre des deux poulies. Poignées au niveau de la poitrine.' },
        { t:'Écart', d:'Écarte les bras largement, paumes vers l\'avant. Sentez un étirement dans la poitrine.' },
        { t:'Contraction', d:'Ramène les poignées ensemble en contractant fortement la poitrine.' },
        { t:'Retour', d:'Retour contrôlé. Pas d\'à-coups. Maintiens une légère flexion au coude.' },
      ],
      tips:'Excellent pour l\'isolation des pectoraux. Finisseur idéal après les movs composés.' },

    { id:'e48', name:'Dips (pectoraux)', muscle:'chest', icon:'💪',
      secondary:['triceps','shoulders'], difficulty:'avance',
      equipment:'Banc / Station dips', sets:'3–4', reps:'8–15', rest:90,
      steps:[
        { t:'Prise', d:'Mains plus larges que les épaules. Corps légèrement penché en avant pour cibler pecs.' },
        { t:'Descente', d:'Descends lentement. Coudes flèchissent vers l\'extérieur, pas vers le corps.' },
        { t:'Bas', d:'Va jusqu\'à un angle de 90° aux coudes. Sentez l\'étirement thoracique.' },
        { t:'Montée', d:'Pousse pour remonter. Contracte fortement les pectoraux en haut.' },
      ],
      tips:'Un des meilleurs movs de poitrine. Ajouter du poids si trop facile. Garde le torse penché!' },

    // BACK
    { id:'e49', name:'Tirage vertical prise neutre', muscle:'back', icon:'💪',
      secondary:['biceps'], difficulty:'intermediaire',
      equipment:'Lat machine', sets:'3–4', reps:'8–12', rest:90,
      steps:[
        { t:'Position', d:'Assis, dos droit. Poignée neutre (paumes face à face).' },
        { t:'Tirage', d:'Tire vers le bas jusqu\'à la poitrine. Coudes vers l\'arrière et vers le bas.' },
        { t:'Retour', d:'Contrôle la machine. N\'utilise pas l\'élan. Tension constante.' },
      ],
      tips:'Meilleur compromis entre lat pulldown et chin-ups. Parfait pour débutants et force.' },

    { id:'e50', name:'Tirage face (Face pulls)', muscle:'back', icon:'🏋️',
      secondary:['shoulders','triceps'], difficulty:'debutant',
      equipment:'Poulie haute', sets:'3–4', reps:'12–15', rest:60,
      steps:[
        { t:'Position', d:'Debout face à la poulie haute. Corde attachée. Mains en pronation.' },
        { t:'Tirage', d:'Tire vers les yeux/haut du visage. Coudes hauts et écartés.' },
        { t:'Contraction', d:'Contracte les rhomboïdes et le dos arrière. Pivote les mains (supination).' },
        { t:'Retour', d:'Retour contrôlé. Tension constante.' },
      ],
      tips:'Excellent pour la santé de l\'épaule. Prévient les blessures. À faire régulièrement.' },

    // SHOULDERS
    { id:'e51', name:'Élévations latérales haltères', muscle:'shoulders', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltères', sets:'3–4', reps:'10–15', rest:60,
      steps:[
        { t:'Position', d:'Debout, haltères de chaque côté. Bras légèrement fléchis (20°), paumes face à face.' },
        { t:'Élévation', d:'Élève les haltères latéralement jusqu\'à la hauteur de l\'épaule.' },
        { t:'Contraction', d:'Courte pause en haut. Le pinky légèrement plus haut que le pouce.' },
        { t:'Descente', d:'Descente lente et contrôlée. Pas de chute libre.' },
      ],
      tips:'Le meilleur exercice pour des épaules larges. Cible le médian. Poids modéré > poids lourd.' },

    { id:'e52', name:'Développé Arnold', muscle:'shoulders', icon:'🏋️',
      secondary:['chest','triceps'], difficulty:'intermediaire',
      equipment:'Haltères / Machine', sets:'3–4', reps:'8–12', rest:90,
      steps:[
        { t:'Position', d:'Assis, dos droit. Haltères au niveau des épaules, paumes face à vous.' },
        { t:'Rotation', d:'Pousse tout en faisant pivoter les paumes vers l\'avant (rotation externe).' },
        { t:'Haut', d:'Presse au-dessus de la tête, bras tendus. Les haltères finissent paumes vers l\'avant.' },
        { t:'Descente', d:'Retour en inversant le mouvement. Rotation paumes vers vous.' },
      ],
      tips:'Cible les 3 chefs de l\'épaule. Plus lourd que les élévations latérales normales.' },

    // BICEPS
    { id:'e53', name:'Curl barre droite', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Barre droite', sets:'3–4', reps:'6–12', rest:90,
      steps:[
        { t:'Position', d:'Debout, barre en prise pronation (paumes vers l\'avant). Bras tendus. Coudes fixes.' },
        { t:'Curl', d:'Plie les coudes. Monte la barre jusqu\'au niveau du menton/épaules. Contraction maximale.' },
        { t:'Descente', d:'Descente lente (2-3 sec). Pas d\'à-coups. Contrôle total.' },
      ],
      tips:'L\'exercice biceps CLASSIQUE. Force et hypertrophie. Poids lourd mais contrôlé.' },

    { id:'e54', name:'Curl pupitre (Preacher curl)', muscle:'biceps', icon:'💪',
      secondary:[], difficulty:'intermediaire',
      equipment:'Banc pupitre / Haltères', sets:'3–4', reps:'8–12', rest:75,
      steps:[
        { t:'Position', d:'Assis au banc pupitre. Triceps appuyés. Haltères en mains.' },
        { t:'Curl', d:'Plie les coudes. Aucun repos en bas (tension continue).' },
        { t:'Contraction', d:'Contracte fortement en haut. Pas de balancement.' },
        { t:'Descente', d:'Lente et contrôlée jusqu\'à ~90° de flexion.' },
      ],
      tips:'Isolement pur. Excellent pour augmenter le pic du biceps. Aucun "triche".' },

    // TRICEPS
    { id:'e55', name:'Tirage corde triceps', muscle:'triceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Poulie haute / Corde', sets:'3–4', reps:'10–15', rest:60,
      steps:[
        { t:'Position', d:'Debout face à la poulie haute. Corde en mains. Coudes fixes près du corps.' },
        { t:'Extension', d:'Tire vers le bas. Pleine extension des coudes. Paumes séparées en bas.' },
        { t:'Contraction', d:'Contracte les triceps fermement. Courte pause.' },
        { t:'Retour', d:'Retour contrôlé. Les coudes restent fixes.' },
      ],
      tips:'Excellent pour définition et isolement. Parfait pour finisseur ou pre-exhaustion.' },

    { id:'e56', name:'Extension triceps assis (Overhead)', muscle:'triceps', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Haltère / Corde', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Position', d:'Assis ou debout. Haltère au-dessus de la tête, mains tenant la tête du poids.' },
        { t:'Descente', d:'Descends derrière la tête. Coudes fixes, 60-90° angle en bas.' },
        { t:'Étirement', d:'Sentez l\'étirement au triceps long (arrière). Tenez brièvement.' },
        { t:'Extension', d:'Pousse vers le haut en contractant. Arrivée presque complète.' },
      ],
      tips:'Cible le triceps long. Excellent pour taille des bras. Poids modéré.' },

    // LEGS (5 exercices)
    { id:'e57', name:'Leg Press', muscle:'legs', icon:'🏋️',
      secondary:['glutes','hamstrings'], difficulty:'debutant',
      equipment:'Machine leg press', sets:'4–5', reps:'8–15', rest:120,
      steps:[
        { t:'Position', d:'Assis. Dos et tête contre les coussinets. Pieds largeur d\'épaules. Pointes légèrement dehors (5-10°).' },
        { t:'Descente', d:'Descends lentement. Genoux vont vers la poitrine. Jamais verrouille complètement en bas.' },
        { t:'Bas', d:'Angle ~90° aux genoux. Dos reste collé au siège.' },
        { t:'Montée', d:'Pousse explosif (mais contrôlé). Ne verrouille pas les genoux en haut.' },
      ],
      tips:'Parfait pour débutants. Permet des poids lourds en sécurité. Reconstruit progressivement.' },

    { id:'e58', name:'Squat à la machine Hack', muscle:'legs', icon:'🏋️',
      secondary:['glutes','quadriceps'], difficulty:'intermediaire',
      equipment:'Machine Hack Squat', sets:'3–4', reps:'8–12', rest:120,
      steps:[
        { t:'Position', d:'Dos contre le coussin. Pieds largeur d\'épaules. Mains sur les poignées.' },
        { t:'Descente', d:'Descends doucement. Genoux suivent la trajectoire de la machine.' },
        { t:'Profondeur', d:'Descends profond si mobilité permet. Jamais verrouille les genoux.' },
        { t:'Montée', d:'Pousse via les talons. Explosion contrôlée.' },
      ],
      tips:'Variante sécuritaire du squat libre. Grand ROM. Excellent pour hypertrophie quad.' },

    { id:'e59', name:'Flexion jambes assis (Leg Curl)', muscle:'legs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine leg curl', sets:'3–4', reps:'10–15', rest:75,
      steps:[
        { t:'Position', d:'Assis. Jambes tendues. Patins contre les mollets.' },
        { t:'Flexion', d:'Plie les genoux. Ramène tes talons vers les fessiers.' },
        { t:'Contraction', d:'Contracte les ischio-jambiers en haut. Courte pause.' },
        { t:'Retour', d:'Retour lent. Pas de chute libre. Tension constante.' },
      ],
      tips:'Isolement pur ischio-jambiers. Prévient les déséquilibres quad/ischio. Essential à faire.' },

    { id:'e60', name:'Élévations mollets assis', muscle:'legs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine / Haltère', sets:'4–5', reps:'15–20', rest:45,
      steps:[
        { t:'Position', d:'Assis. Plante du pied sur la plateforme. Genou ~90°.' },
        { t:'Montée', d:'Lève les talons. Toute la contrition sur les mollets.' },
        { t:'Haut', d:'Contracte maximalement. Courte pause (1-2 sec).' },
        { t:'Descente', d:'Descend lentement. Grand étirement des mollets.' },
      ],
      tips:'Cible le soléaire (moyen mollet). Poids élevé mais ROM complet. Haute reps.' },

    { id:'e61', name:'Squat sumo (barre)', muscle:'legs', icon:'🏋️',
      secondary:['glutes','inner thighs'], difficulty:'intermediaire',
      equipment:'Barre + plaques', sets:'3–4', reps:'8–12', rest:120,
      steps:[
        { t:'Position', d:'Pieds bien écartés (largeur +50% épaules). Pointes vers l\'extérieur (45°).' },
        { t:'Descente', d:'Descends en poussant les genoux extérieurement. Torse droit.' },
        { t:'Profondeur', d:'Va en parallèle ou plus bas si flexibilité permet.' },
        { t:'Montée', d:'Pousse via les talons et l\'intérieur des cuisses. Explosion contrôlée.' },
      ],
      tips:'Grande sollicitation adducteurs et fessiers. Moins de stress genoux qu\'un squat standard.' },

    // GLUTES (3 exercices)
    { id:'e62', name:'Squat Pendulum', muscle:'glutes', icon:'👃',
      secondary:['legs','quads'], difficulty:'intermediaire',
      equipment:'Machine Pendulum', sets:'3–4', reps:'10–15', rest:90,
      steps:[
        { t:'Position', d:'Assis incliné à 45°. Pieds sur la plateforme largeur épaules.' },
        { t:'Descente', d:'Descends en arrière. Amplitude complète. Genoux flexibles.' },
        { t:'Contraction', d:'Contracte fessiers max en haut. Squeeeze 1 sec.' },
        { t:'Retour', d:'Contrôle. Animation continue.' },
      ],
      tips:'Brutal pour les fessiers. Moins sur genoux qu\'un squat libre. Machine parfaite pour hypertrophie glute.' },

    { id:'e63', name:'Glute-Ham Raise', muscle:'glutes', icon:'💪',
      secondary:['hamstrings'], difficulty:'avance',
      equipment:'Machine GHR / Banc', sets:'3–4', reps:'6–12', rest:90,
      steps:[
        { t:'Position', d:'Genoux sur le coussin. Corps penché en avant.' },
        { t:'Montée', d:'Ramène le corps vers le haut via contraction ischio/glute. Lever explosif.' },
        { t:'Haut', d:'Corps en ligne droite. Contracte intensément.' },
        { t:'Descente', d:'Lente. Contrôle excentrique (3-4 sec).' },
      ],
      tips:'L\'un des meilleurs movs ischio-glute. Très lourd. Construis progressivement. Difficile!' },

    { id:'e64', name:'Soulevé de terre sumo (ischio focus)', muscle:'glutes', icon:'🏋️',
      secondary:['hamstrings','lower back'], difficulty:'avance',
      equipment:'Barre + disques', sets:'3–4', reps:'6–10', rest:180,
      steps:[
        { t:'Position', d:'Pieds large. Barre proche du corps. Dos plat. Prise pronation.' },
        { t:'Montée', d:'Pousse via les talons. Dos plat (ne fléchit pas). "Slide" la barre le long des jambes.' },
        { t:'Contraction', d:'Contracte fessiers et ischio-jambiers fermement en haut.' },
        { t:'Descente', d:'Contrôle. Plier les jambes (squat) ou plier le dos (RDL).' },
      ],
      tips:'Mobilise énormément les ischio-jambiers et fessiers. Moins stress bas du dos que sumo classique.' },

    // ABS (3 exercices)
    { id:'e65', name:'Crunch machine', muscle:'abs', icon:'💪',
      secondary:[], difficulty:'debutant',
      equipment:'Machine à abdominaux', sets:'3–4', reps:'15–20', rest:45,
      steps:[
        { t:'Position', d:'Assis. Mains derrière la tête ou poignée. Coudes fixes vers le côté.' },
        { t:'Flexion', d:'Plie vers l\'avant. Contracte les abdos. Sentez l\'écrasement du muscle.' },
        { t:'Contraction', d:'Courte pause en contraction max (1 sec).' },
        { t:'Retour', d:'Lent. Pas de relâchement complet (tension constante).' },
      ],
      tips:'Isolement pur. Grand ROM. Facile à progresser. Poids modéré, haute reps.' },

    { id:'e66', name:'Ab Wheel Rollout', muscle:'abs', icon:'🔄',
      secondary:['chest','shoulders'], difficulty:'avance',
      equipment:'Ab wheel', sets:'3–4', reps:'8–15', rest:75,
      steps:[
        { t:'Position', d:'À genoux ou debout. Wheel en mains devant toi. Core bien gainé.' },
        { t:'Déroulement', d:'Roule vers l\'avant. Corps en planche. Abs sous tension maximale.' },
        { t:'Bas', d:'Amplitude complète si possible. Reste contracté.' },
        { t:'Retour', d:'Roule en arriérée via contraction abdo forcée. Très difficile!' },
      ],
      tips:'Ultra difficile. Construis progressivement. Peut débuter sur table. Anti-extension puissante.' },

    { id:'e67', name:'Crunch à la poulie (Cable crunch)', muscle:'abs', icon:'💪',
      secondary:[], difficulty:'intermediaire',
      equipment:'Poulie haute / Corde', sets:'3–4', reps:'12–18', rest:60,
      steps:[
        { t:'Position', d:'À genoux face à la poulie. Corde sur les épaules. Coudes fixes.' },
        { t:'Flexion', d:'Plie vers le bas. Contracte abdos intensément. JAMAIS détends en bas (tension).' },
        { t:'Contraction', d:'Squeeeze 1-2 sec. Contracte vraiment vraiment.' },
        { t:'Retour', d:'Lent. Contrôle. Jamais relâchement complet.' },
      ],
      tips:'Grand ROM. Poids ajustable. Parfait pour hypertrophie abdo. Rien de mieux!' },

    // CARDIO (5 exercices)
    { id:'e68', name:'Machine à ramer (Rowing)', muscle:'cardio', icon:'🚣',
      secondary:['back','legs','core'], difficulty:'debutant',
      equipment:'Rowing machine', sets:'1', reps:'20–30 min', rest:0,
      steps:[
        { t:'Position', d:'Assis. Pieds sur les repose-pieds. Saisir la poignée. Dos droit.' },
        { t:'Coup', d:'Push des jambes → Tirage bras → Plie le torse légèrement.' },
        { t:'Retour', d:'Inverse: Extend bras → Étend jambes → Penche le torse.' },
        { t:'Rythme', d:'Fluide, régulier. ~20-25 coups/min pour aérobie. Plus rapide pour HIIT.' },
      ],
      tips:'Meilleur cardio full-body. Engage 85% des muscles. Construis endurance et force.' },

    { id:'e69', name:'Escaliers (Stair climber)', muscle:'cardio', icon:'⛰️',
      secondary:['legs','glutes'], difficulty:'debutant',
      equipment:'Stair climber / Vraies escaliers', sets:'1', reps:'10–20 min', rest:0,
      steps:[
        { t:'Position', d:'Mains optionnelles. Posture droite. Engage core.' },
        { t:'Montée', d:'Monte les escaliers régulièrement. Pleine marche (appui complet).' },
        { t:'Effort', d:'Essoufflement contrôlé. Peut parler mais difficilement.' },
        { t:'Cadence', d:'60-80 marches/min pour aérobie. Plus rapide pour intensité.' },
      ],
      tips:'Construit les jambes et fessiers ÉNORMÉMENT. Cardio + musculation combo! "Trop bon"!' },

    { id:'e70', name:'Corde à sauter (Jump rope)', muscle:'cardio', icon:'🔗',
      secondary:['calves','coordination'], difficulty:'debutant',
      equipment:'Jump rope', sets:'1', reps:'10–20 min', rest:0,
      steps:[
        { t:'Prise', d:'Corde au niveau des hanches. Tournée via les poignets (pas les bras).' },
        { t:'Saut', d:'Saute sur les boules des pieds. Genoux légèrement fléchis.' },
        { t:'Rythme', d:'120–160 sauts/min aérobie. 160–180+ pour intensité.' },
        { t:'Respiration', d:'Régulière. Diaphragm breathing.' },
      ],
      tips:'Cardio le plus efficace. Rend les chevilles fortes. Coordination mentale. Très fun!' },

    { id:'e71', name:'Burpees (Cardio explosif)', muscle:'cardio', icon:'🔥',
      secondary:['chest','arms','legs'], difficulty:'avance',
      equipment:'Aucun', sets:'1', reps:'20–50 répétitions', rest:45,
      steps:[
        { t:'Position', d:'Debout, pieds épaule-largeur.' },
        { t:'Squat + Chute', d:'Accroupis. Mains au sol. "Jump" back en planche.' },
        { t:'Pompe', d:'Faits une pompe (optionnel). Reviens à la planche.' },
        { t:'Saut', d:'Jump jambes vers l\'avant. Saute vers le haut explosif!' },
      ],
      tips:'Un des movs cardio les PLUS intenses. Construits force + endurance. HIIT parfait!' },

    { id:'e72', name:'Mountain Climbers', muscle:'cardio', icon:'⛰️',
      secondary:['abs','shoulders','cardio'], difficulty:'intermediaire',
      equipment:'Aucun', sets:'1', reps:'20–40 sec / round', rest:30,
      steps:[
        { t:'Position', d:'Planche. Mains sous les épaules. Corps en ligne droite.' },
        { t:'Mouvement', d:'Ramène les genoux alternativement vers la poitrine très rapidement.' },
        { t:'Rythme', d:'Aussi vite que possible. Full effort. 3-4 secondes par round.' },
        { t:'Contrôle', d:'Hanche ne s\'affaisse jamais. Core gainé.' },
      ],
      tips:'Cardio BRUTAL + core killer. HIIT incroyable. Peu de rest = métabolisme à la folie!' },

  ];

  /* ═══════════════════════════════════════════════════════════
     TEMPLATES DE PROGRAMME
  ═══════════════════════════════════════════════════════════ */
  const PROGRAM_TEMPLATES = {
    // ══════════════════════════════════════════════════════════════
    // DÉBUTANT — Full Body 3x/week (tout le corps, chaque séance)
    // Ojectif: Apprendre la technique, créer une base
    // ══════════════════════════════════════════════════════════════
    fullbody3: {
      name: 'Full Body 3x — Débutant',
      description: 'Idéal pour débuter. Travaille chaque groupe musculaire 2x/sem. Construis une base solide.',
      level: 'beginner',
      focus: 'Apprendre + Hypertrophie légère',
      days: [
        {
          name: '📅 Jour 1 — Full Body A',
          notes: '🎯 Focus: Compound push et jambes',
          exos: [
            // WARM-UP (implicite): 5-10 min cardio léger
            { id:'e01', name:'Développé couché', sets:3, reps:'8–12', rest:120, tempo:'3-1-1', notes:'Compound lourd' },
            { id:'e16', name:'Squat ou Leg Press', sets:3, reps:'8–12', rest:120, notes:'Compound jambes' },
            { id:'e06', name:'Tractions ou Row', sets:3, reps:'8–12', rest:90, notes:'Tirage composé' },
            { id:'e09', name:'Développé militaire', sets:2, reps:'10–12', rest:90, notes:'Épaules + stabilité' },
            { id:'e21', name:'Abs', sets:2, reps:'15–20 reps', rest:60, notes:'Finisheur core' },
          ]
        },
        {
          name: '📅 Jour 2 — Full Body B',
          notes: '🎯 Focus: Compound pull et hypertrophie',
          exos: [
            { id:'e07', name:'Rowing barre ou haltères', sets:3, reps:'8–12', rest:120, notes:'Dos épaisseur' },
            { id:'e19', name:'Leg Curl ou Leg Extension', sets:3, reps:'12–15', rest:90, notes:'Isolation ischio/quad' },
            { id:'e02', name:'Développé haltères', sets:3, reps:'10–12', rest:90, notes:'Variation pecs' },
            { id:'e12', name:'Curl biceps', sets:2, reps:'12–15', rest:75, notes:'Isolation pumpe' },
            { id:'e22', name:'Squat sumo ou fentes', sets:2, reps:'12–15', rest:75, notes:'Volume jambes' },
          ]
        },
        {
          name: '📅 Jour 3 — Full Body C',
          notes: '🎯 Focus: Hypertrophie et pump',
          exos: [
            { id:'e05', name:'Dumbbell Bench Press', sets:3, reps:'10–12', rest:90, notes:'Stabilité + pecs' },
            { id:'e20', name:'Leg Press', sets:3, reps:'12–15', rest:90, notes:'Volume jambes' },
            { id:'e08', name:'Lat Pulldown', sets:3, reps:'12–15', rest:75, notes:'Dos largeur' },
            { id:'e10', name:'Lateral Raise', sets:2, reps:'15–20', rest:60, notes:'Épaules isolées' },
            { id:'e14', name:'Tricep Dips', sets:2, reps:'10–15', rest:75, notes:'Triceps pump' },
          ]
        },
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // INTERMÉDIAIRE — PPL 3x/week (Split par Mouvement)
    // Objectif: Augmenter le volume par groupe, meilleure récupération
    // ══════════════════════════════════════════════════════════════
    ppl3: {
      name: 'PPL 3x — Intermédiaire',
      description: 'Push/Pull/Legs — Chaque groupe 1x/sem. Le classique pour la hypertrophie.',
      level: 'intermediate',
      focus: 'Hypertrophie maximale',
      days: [
        {
          name: '📅 Jour 1 — PUSH (Pecs + Épaules + Triceps)',
          notes: '🎯 Heavy compounds → Volume isolations',
          exos: [
            // COMPOUND HEAVY
            { id:'e01', name:'Développé couché', sets:4, reps:'6–8', rest:180, tempo:'3-1-2', notes:'Composé lourd — Progressive Overload' },
            { id:'e09', name:'Développé militaire', sets:3, reps:'6–8', rest:180, notes:'Épaules force' },
            // VOLUME HYPERTROPHIE
            { id:'e02', name:'Développé haltères incliné', sets:4, reps:'10–12', rest:90, notes:'Haut pecs + stabilité' },
            { id:'e10', name:'Lateral Raise', sets:3, reps:'12–15', rest:60, notes:'Épaules isolées' },
            { id:'e14', name:'Tricep Dips ou extension', sets:3, reps:'10–12', rest:75, notes:'Triceps volume' },
            { id:'e15', name:'Push-ups ou Cable fly', sets:3, reps:'15–20', rest:45, notes:'Finisheur pump' },
          ]
        },
        {
          name: '📅 Jour 2 — PULL (Dos + Biceps)',
          notes: '🎯 Vertical puis Horizontal tirage',
          exos: [
            // VERTICAL TIRAGE (largeur dos)
            { id:'e06', name:'Tractions ou Lat Pulldown', sets:4, reps:'6–10', rest:120, notes:'Dos largeur — Force' },
            // HORIZONTAL TIRAGE (épaisseur dos)
            { id:'e07', name:'Rowing barre ou haltères', sets:4, reps:'8–10', rest:120, notes:'Dos épaisseur — Force' },
            // HYPERTROPHIE DOS
            { id:'e08', name:'Lat Pulldown variations', sets:3, reps:'12–15', rest:75, notes:'Dos volume' },
            { id:'e11', name:'Rowing machine ou face pulls', sets:3, reps:'12–15', rest:60, notes:'Dos arrière + scapulae' },
            // BICEPS
            { id:'e12', name:'Barbell Curl', sets:3, reps:'8–12', rest:75, notes:'Biceps force' },
            { id:'e13', name:'Dumbbell Curl variations', sets:3, reps:'12–15', rest:60, notes:'Biceps finisheur' },
          ]
        },
        {
          name: '📅 Jour 3 — LEGS (Jambes + Fessiers)',
          notes: '🎯 Composés lourds → Iso volume → Core',
          exos: [
            // COMPOSÉ LOURD QUAD
            { id:'e16', name:'Squat ou Hack Squat', sets:4, reps:'6–10', rest:180, notes:'Jambes force — Heavy' },
            // COMPOSÉ LOURD ISCHIO
            { id:'e18', name:'Deadlift ou RDL', sets:3, reps:'6–8', rest:180, notes:'Ischio force' },
            // VOLUME JAMBES AVANT
            { id:'e17', name:'Leg Press', sets:3, reps:'12–15', rest:90, notes:'Quad volume' },
            // VOLUME JAMBES ARRIÈRE
            { id:'e19', name:'Leg Curl', sets:3, reps:'12–15', rest:75, notes:'Ischio isolation' },
            // FESSIERS
            { id:'e20', name:'Hip Thrust ou Squat sumo', sets:3, reps:'10–12', rest:75, notes:'Fessiers hypertrophie' },
            // FINISHEUR
            { id:'e21', name:'Planches ou Cable crunches', sets:3, reps:'15–20 reps', rest:45, notes:'Core finisheur' },
          ]
        },
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // AVANCÉ — Upper/Lower 4x/week (Blocs Force + Hypertrophie)
    // Objectif: Max volume avec bonne récupération + Periodization
    // ══════════════════════════════════════════════════════════════
    ul4: {
      name: 'Upper/Lower 4x — Avancé',
      description: 'Split optimisé. Combine Force (3-5) et Hypertrophie (8-12) dans la semaine.',
      level: 'advanced',
      focus: 'Force + Hypertrophie alternées',
      days: [
        {
          name: '📅 Lundi — UPPER FORCE',
          notes: '🎯 Poids lourd, reps basses, repos long',
          exos: [
            // PRIMARY COMPOUND
            { id:'e01', name:'Bench Press (lourd)', sets:5, reps:'3–6', rest:180, tempo:'3-0-2', notes:'Pecs Force — Focus technique' },
            { id:'e09', name:'OHP (lourd)', sets:4, reps:'4–6', rest:180, notes:'Épaules force' },
            { id:'e06', name:'Weighted Pullups ou Row lourd', sets:4, reps:'5–8', rest:150, notes:'Dos force épaisseur' },
            // SECONDARY ACCESSORIES
            { id:'e07', name:'Chest-to-bar Rows', sets:3, reps:'8–10', rest:120, notes:'Dos complémentaire' },
            { id:'e14', name:'Weighted Dips', sets:3, reps:'6–8', rest:120, notes:'Triceps force' },
          ]
        },
        {
          name: '📅 Mardi — LOWER FORCE',
          notes: '🎯 Jambes lourdes, technique stricte',
          exos: [
            { id:'e16', name:'Squat (lourd)', sets:5, reps:'3–6', rest:180, tempo:'3-0-2', notes:'Quad force — MAX effort' },
            { id:'e18', name:'Deadlift ou Front Squat', sets:4, reps:'4–6', rest:180, notes:'Ischio/Core force' },
            { id:'e20', name:'Hack Squat ou V-squat', sets:3, reps:'8–12', rest:120, notes:'Quad secondary' },
            { id:'e19', name:'Leg Curl machine', sets:3, reps:'8–10', rest:90, notes:'Ischio sécurité' },
            { id:'e21', name:'Ab wheel ou cable crunch', sets:3, reps:'10–15', rest:60, notes:'Core strength' },
          ]
        },
        {
          name: '📅 Jeudi — UPPER HYPERTROPHIE',
          notes: '🎯 Volumé, reps moyennes-hautes, tempo contrôlé',
          exos: [
            // BENCH VARIATIONS
            { id:'e02', name:'Dumbbell Bench (incline)', sets:4, reps:'10–12', rest:75, tempo:'3-1-1', notes:'Pecs hyper (stabilité)' },
            { id:'e05', name:'Machine or Cable Chest Press', sets:3, reps:'12–15', rest:60, notes:'Pecs pump' },
            // ROWING VARIATIONS
            { id:'e08', name:'Lat Pulldown variations', sets:4, reps:'12–15', rest:70, notes:'Dos largeur volume' },
            { id:'e11', name:'Chest-supported Row ou Serratus Rows', sets:3, reps:'12–15', rest:70, notes:'Dos/Serratus' },
            // SHOULDERS
            { id:'e10', name:'Machine Lateral Raise', sets:3, reps:'15–20', rest:60, notes:'Épaules isolées pump' },
            // ARMS
            { id:'e12', name:'Dumbbell Curl', sets:3, reps:'12–15', rest:60, notes:'Biceps volume' },
            { id:'e15', name:'Rope Tricep Extension', sets:3, reps:'15–20', rest:45, notes:'Triceps finisheur' },
          ]
        },
        {
          name: '📅 Vendredi — LOWER HYPERTROPHIE',
          notes: '🎯 Volume jambes, pump maximal',
          exos: [
            { id:'e17', name:'Leg Press (volumé)', sets:4, reps:'12–15', rest:80, notes:'Quad volume' },
            { id:'e22', name:'Squat sumo ou Hack Squat variations', sets:3, reps:'12–15', rest:75, notes:'Inner quad + glutes' },
            // ISCHIO
            { id:'e19', name:'Machine Leg Curl', sets:4, reps:'12–15', rest:70, notes:'Ischio isolation' },
            { id:'e20', name:'Hip Thrust machine', sets:4, reps:'12–15', rest:70, notes:'Glutes hyper' },
            // VASTE
            { id:'e04', name:'Leg Extension machine', sets:3, reps:'15–20', rest:60, notes:'Quad finisheur' },
            // CORE
            { id:'e21', name:'Machine crunch ou hanging leg raise', sets:3, reps:'15–20', rest:45, notes:'Core conditioning' },
          ]
        },
      ]
    },

    // ══════════════════════════════════════════════════════════════
    // AVANCÉ ALTERNATIVE — PPL 6x/week (Volume maximal)
    // Objectif: 2 cycles PPL par semaine, hypertrophie maximale
    // ══════════════════════════════════════════════════════════════
    ppl6: {
      name: 'PPL 6x — Avancé+',
      description: '2 cycles Push/Pull/Legs par semaine. Pour trainingbros très motivés. Hypertrophie MAXIMALE.',
      level: 'advanced',
      focus: 'Volume extrême = Hypertrophie maximale',
      days: [
        {
          name: '📅 Lundi — PUSH 1 (Force)',
          notes: '🎯 Composés lourds',
          exos: [
            { id:'e01', name:'Bench Press', sets:4, reps:'6–8', rest:150, notes:'Heavy' },
            { id:'e09', name:'OHP', sets:3, reps:'6–8', rest:150, notes:'Force épaules' },
            { id:'e02', name:'Incline Dumbbell Press', sets:3, reps:'8–10', rest:90, notes:'Volume' },
            { id:'e10', name:'Lateral Raise', sets:3, reps:'12–15', rest:60, notes:'Iso' },
            { id:'e14', name:'Dips', sets:3, reps:'8–12', rest:75, notes:'Triceps' },
          ]
        },
        {
          name: '📅 Mardi — PULL 1 (Volume)',
          notes: '🎯 Dos épaisseur + Biceps',
          exos: [
            { id:'e06', name:'Tractions', sets:4, reps:'8–12', rest:120, notes:'Largeur' },
            { id:'e07', name:'Barbell Row', sets:4, reps:'8–10', rest:120, notes:'Épaisseur force' },
            { id:'e08', name:'Lat Pulldown', sets:3, reps:'12–15', rest:75, notes:'Volume largeur' },
            { id:'e12', name:'Barbell Curl', sets:3, reps:'8–12', rest:75, notes:'Biceps' },
            { id:'e11', name:'Face Pulls', sets:3, reps:'15–20', rest:60, notes:'Rear delts' },
          ]
        },
        {
          name: '📅 Mercredi — LEGS 1 (Quads)',
          notes: '🎯 Focus jambes avant',
          exos: [
            { id:'e16', name:'Squat', sets:4, reps:'6–10', rest:150, notes:'Jambes force' },
            { id:'e17', name:'Leg Press', sets:3, reps:'10–12', rest:100, notes:'Volume' },
            { id:'e04', name:'Leg Extension', sets:3, reps:'12–15', rest:60, notes:'Quad iso' },
            { id:'e19', name:'Leg Curl', sets:3, reps:'12–15', rest:60, notes:'Ischio' },
            { id:'e21', name:'Abs', sets:2, reps:'15–20', rest:45, notes:'Core' },
          ]
        },
        {
          name: '📅 Jeudi — PUSH 2 (Hypertrophie)',
          notes: '🎯 Volumé et pump',
          exos: [
            { id:'e02', name:'Dumbbell Bench', sets:4, reps:'10–12', rest:80, notes:'Stabilité' },
            { id:'e05', name:'Machine Chest Press', sets:3, reps:'12–15', rest:70, notes:'Volume' },
            { id:'e10', name:'Machine Lateral Raise', sets:4, reps:'15–20', rest:60, notes:'Épaules mega pump' },
            { id:'e15', name:'Rope Extensions', sets:3, reps:'15–20', rest:60, notes:'Triceps finisheur' },
            { id:'e09', name:'Dumbbell Press', sets:3, reps:'10–12', rest:75, notes:'OHP variation' },
          ]
        },
        {
          name: '📅 Vendredi — PULL 2 (Hypertrophie)',
          notes: '🎯 Volume dos + Biceps pump',
          exos: [
            { id:'e08', name:'Machine Lat Pulldown', sets:4, reps:'12–15', rest:75, notes:'Largeur volume' },
            { id:'e11', name:'Chest-supported Row', sets:4, reps:'12–15', rest:75, notes:'Dos épaisseur' },
            { id:'e13', name:'Cable or Machine Curl', sets:3, reps:'15–20', rest:60, notes:'Biceps pump' },
            { id:'e12', name:'Dumbbell Curl', sets:3, reps:'12–15', rest:60, notes:'Biceps volume' },
            { id:'e07', name:'Seal Rows ou incline bench row', sets:3, reps:'12–15', rest:70, notes:'Dos finisheur' },
          ]
        },
        {
          name: '📅 Samedi — LEGS 2 (Ischio/Glutes)',
          notes: '🎯 Focus jambes arrière',
          exos: [
            { id:'e18', name:'Deadlift ou RDL', sets:4, reps:'6–8', rest:150, notes:'Force ischio' },
            { id:'e20', name:'Hip Thrust', sets:4, reps:'10–12', rest:100, notes:'Glutes volume' },
            { id:'e22', name:'Squat sumo', sets:3, reps:'12–15', rest:80, notes:'Inner thigh' },
            { id:'e19', name:'Lying Leg Curl', sets:3, reps:'12–15', rest:70, notes:'Ischio iso' },
            { id:'e21', name:'Crunches', sets:3, reps:'15–20', rest:45, notes:'Core' },
          ]
        },
      ]
    },
  };

  /* ═══════════════════════════════════════════════════════════
     MUSCLES LIST
  ═══════════════════════════════════════════════════════════ */
  const MUSCLES = [
    { id:'all',       label:'Tous les muscles', icon:'💪' },
    { id:'chest',     label:'Pectoraux',        icon:'🏋️' },
    { id:'back',      label:'Dos',              icon:'🔙' },
    { id:'shoulders', label:'Épaules',           icon:'🙆' },
    { id:'biceps',    label:'Biceps',            icon:'💪' },
    { id:'triceps',   label:'Triceps',           icon:'👊' },
    { id:'legs',      label:'Jambes',            icon:'🦵' },
    { id:'glutes',    label:'Fessiers',          icon:'🍑' },
    { id:'abs',       label:'Abdominaux',        icon:'⬛' },
  ];

  function getExercise(id) { return EXERCISES.find(e => e.id === id); }
  function getByMuscle(muscle) { return muscle === 'all' ? EXERCISES : EXERCISES.filter(e => e.muscle === muscle); }

  return { EXERCISES, MUSCLES, PROGRAM_TEMPLATES, getExercise, getByMuscle };
})();