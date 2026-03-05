'use strict';

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
  ];

  /* ═══════════════════════════════════════════════════════════
     TEMPLATES DE PROGRAMME
  ═══════════════════════════════════════════════════════════ */
  const PROGRAM_TEMPLATES = {
    // ── PPL 3J ──────────────────────────────────────────────
    ppl3: {
      name: 'Push / Pull / Legs — 3 jours',
      description: 'Programme classique pour intermédiaires. Optimal pour 3 séances/semaine.',
      level: 'intermediate',
      days: [
        {
          name: 'Jour A — Push (Pecs + Épaules + Triceps)',
          exos: [
            { id:'e01', sets:4, reps:'6–10', rest:120 },
            { id:'e02', sets:3, reps:'10–12', rest:90 },
            { id:'e09', sets:3, reps:'8–12', rest:90 },
            { id:'e10', sets:3, reps:'15–20', rest:60 },
            { id:'e14', sets:3, reps:'12–15', rest:75 },
          ]
        },
        {
          name: 'Jour B — Pull (Dos + Biceps)',
          exos: [
            { id:'e06', sets:4, reps:'6–10', rest:120 },
            { id:'e07', sets:3, reps:'8–12', rest:90 },
            { id:'e08', sets:3, reps:'12–15', rest:75 },
            { id:'e11', sets:3, reps:'15–20', rest:60 },
            { id:'e12', sets:3, reps:'10–15', rest:75 },
          ]
        },
        {
          name: 'Jour C — Legs (Jambes + Fessiers)',
          exos: [
            { id:'e16', sets:4, reps:'6–10', rest:150 },
            { id:'e17', sets:3, reps:'12–15', rest:90 },
            { id:'e19', sets:3, reps:'10–15', rest:90 },
            { id:'e18', sets:3, reps:'10–12', rest:75 },
            { id:'e21', sets:3, reps:'45 sec', rest:60 },
          ]
        },
      ]
    },

    // ── FULL BODY 3J ─────────────────────────────────────────
    fullbody3: {
      name: 'Full Body — 3 jours',
      description: 'Idéal pour les débutants. Travaille tout le corps à chaque séance.',
      level: 'beginner',
      days: [
        {
          name: 'Séance A',
          exos: [
            { id:'e01', sets:3, reps:'8–12', rest:120 },
            { id:'e06', sets:3, reps:'5–8', rest:120 },
            { id:'e16', sets:3, reps:'8–12', rest:120 },
            { id:'e09', sets:3, reps:'10–15', rest:90 },
            { id:'e21', sets:3, reps:'30 sec', rest:60 },
          ]
        },
        {
          name: 'Séance B',
          exos: [
            { id:'e07', sets:3, reps:'10–12', rest:90 },
            { id:'e02', sets:3, reps:'10–12', rest:90 },
            { id:'e19', sets:3, reps:'12–15', rest:90 },
            { id:'e12', sets:3, reps:'12–15', rest:75 },
            { id:'e14', sets:3, reps:'12–15', rest:75 },
          ]
        },
        {
          name: 'Séance C',
          exos: [
            { id:'e05', sets:3, reps:'5–8', rest:180 },
            { id:'e08', sets:3, reps:'12–15', rest:75 },
            { id:'e17', sets:3, reps:'12–15', rest:90 },
            { id:'e10', sets:3, reps:'15–20', rest:60 },
            { id:'e22', sets:3, reps:'15–20', rest:60 },
          ]
        },
      ]
    },

    // ── UPPER/LOWER 4J ────────────────────────────────────────
    ul4: {
      name: 'Upper / Lower — 4 jours',
      description: 'Programme pour intermédiaires à avancés. Meilleur équilibre volume/récupération.',
      level: 'advanced',
      days: [
        {
          name: 'Lundi — Upper Force',
          exos: [
            { id:'e01', sets:5, reps:'3–6', rest:180 },
            { id:'e06', sets:5, reps:'4–6', rest:180 },
            { id:'e09', sets:4, reps:'6–8', rest:120 },
            { id:'e07', sets:3, reps:'8–10', rest:90 },
          ]
        },
        {
          name: 'Mardi — Lower Force',
          exos: [
            { id:'e16', sets:5, reps:'3–6', rest:180 },
            { id:'e20', sets:4, reps:'6–8', rest:120 },
            { id:'e19', sets:3, reps:'8–12', rest:90 },
            { id:'e21', sets:3, reps:'60 sec', rest:60 },
          ]
        },
        {
          name: 'Jeudi — Upper Volume',
          exos: [
            { id:'e02', sets:4, reps:'10–15', rest:75 },
            { id:'e08', sets:4, reps:'12–15', rest:75 },
            { id:'e10', sets:4, reps:'15–20', rest:60 },
            { id:'e11', sets:4, reps:'15–20', rest:60 },
            { id:'e12', sets:3, reps:'12–15', rest:60 },
            { id:'e15', sets:3, reps:'15–20', rest:60 },
          ]
        },
        {
          name: 'Vendredi — Lower Volume',
          exos: [
            { id:'e17', sets:4, reps:'12–15', rest:90 },
            { id:'e18', sets:3, reps:'12–15', rest:75 },
            { id:'e19', sets:4, reps:'12–15', rest:75 },
            { id:'e22', sets:4, reps:'15–20', rest:60 },
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