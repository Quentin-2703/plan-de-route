/* Plan de route — programmes et illustrations d'exercices (dessins originaux, générés en SVG). */
(function(){
const INK="#1b1b1b", SKIN="#ffffff", FAR="#dcdcdc", HL="#C2369A", GEAR="#3FC29F", IRON="#3d4447";
const P=(x,y)=>({x,y});

/* ---------- drawing primitives ---------- */
function seg(a,b,w,fill){return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${INK}" stroke-width="${w+4}" stroke-linecap="round"/><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${fill}" stroke-width="${w}" stroke-linecap="round"/>`}
function hl(a,b,w){return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${HL}" stroke-width="${w}" stroke-linecap="round"/>`}
const lerp=(a,b,t)=>P(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t);
const off=(p,v,k)=>P(p.x+v.x*k,p.y+v.y*k);
function head(c,face){ // hair cap toward the back of the head, no facial features
  const bx=-face*3.2, by=-3.2;
  return `<circle cx="${c.x}" cy="${c.y}" r="13" fill="${INK}"/><circle cx="${c.x+bx}" cy="${c.y+by}" r="11.4" fill="${INK}"/><circle cx="${c.x-bx*0.55}" cy="${c.y-by*0.55}" r="10.6" fill="${SKIN}"/>`}
function limb(pts,ws,fill,hls){ // pts: chain of joints, ws: widths per segment, hls: index list to highlight
  let s="";for(let i=0;i<pts.length-1;i++)s+=seg(pts[i],pts[i+1],ws[i],fill);
  (hls||[]).forEach(i=>{if(pts[i+1])s+=hl(pts[i],pts[i+1],ws[i]-5)});
  for(let i=1;i<pts.length-1;i++)s+=`<circle cx="${pts[i].x}" cy="${pts[i].y}" r="${ws[i]/2}" fill="${fill}"/>`;
  return s}
/* equipment */
const bar=(a,b,w=5)=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${INK}" stroke-width="${w+3}" stroke-linecap="round"/><line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${GEAR}" stroke-width="${w}" stroke-linecap="round"/>`;
const plate=(c,r=17)=>`<circle cx="${c.x}" cy="${c.y}" r="${r}" fill="${IRON}" stroke="${INK}" stroke-width="2"/><circle cx="${c.x}" cy="${c.y}" r="${r*0.28}" fill="#9aa3a6"/>`;
const db=(c,ang=0)=>`<g transform="translate(${c.x} ${c.y}) rotate(${ang})"><rect x="-13" y="-2.5" width="26" height="5" fill="${INK}"/><rect x="-16" y="-8" width="8" height="16" rx="2" fill="${IRON}" stroke="${INK}" stroke-width="1.5"/><rect x="8" y="-8" width="8" height="16" rx="2" fill="${IRON}" stroke="${INK}" stroke-width="1.5"/></g>`;
const pad=(x,y,w,h,r=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="#e9efee" stroke="${INK}" stroke-width="2.5"/>`;
const cable=(a,b)=>`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${INK}" stroke-width="1.8"/>`;
const pulley=c=>`<circle cx="${c.x}" cy="${c.y}" r="6" fill="${GEAR}" stroke="${INK}" stroke-width="2"/>`;
const floor=`<ellipse cx="100" cy="188" rx="78" ry="5" fill="#000" opacity=".08"/>`;

/* ---------- figure ---------- */
function figure(f){
  const m=new Set(f.hl||[]), face=f.face||1;
  const d0=P(f.Hp.x-f.N.x,f.Hp.y-f.N.y),L=Math.hypot(d0.x,d0.y),d=P(d0.x/L,d0.y/L);
  const front=P(-d.y*f.fr,d.x*f.fr);  // unit vector toward the chest
  const tw=f.tw||28;
  const armHL=a=>[...(m.has('triceps')||m.has('biceps')?[0]:[]),...(m.has('forearm')?[1]:[])];
  const legHL=[...(m.has('quads')||m.has('hams')?[0]:[]),...(m.has('calves')?[1]:[])];
  let s=f.back||"";
  if(f.arm2)s+=limb(f.arm2,[11,9],FAR,armHL());
  if(f.leg2)s+=limb(f.leg2,[16,12,7],FAR,legHL);
  // torso
  s+=seg(f.N,f.Hp,tw,SKIN);
  if(m.has('glutes'))s+=`<circle cx="${off(f.Hp,front,-tw*0.28).x}" cy="${off(f.Hp,front,-tw*0.28).y}" r="${tw*0.3}" fill="${HL}"/>`;
  const patch=(a,b,side)=>hl(off(lerp(f.N,f.Hp,a),front,side*tw*0.2),off(lerp(f.N,f.Hp,b),front,side*tw*0.2),tw*0.42);
  if(m.has('chest'))s+=patch(.18,.42,1);
  if(m.has('abs'))s+=patch(.5,.86,1);
  if(m.has('back'))s+=patch(.16,.62,-1);
  if(m.has('lowback'))s+=patch(.62,.88,-1);
  if(f.leg)s+=limb(f.leg,[16,12,7],SKIN,legHL);
  s+=f.mid||"";
  s+=head(f.H,face);
  if(m.has('shoulders')&&f.arm2)s+=`<circle cx="${f.arm2[0].x}" cy="${f.arm2[0].y}" r="7" fill="${HL}" opacity=".85"/>`;
  if(f.arm)s+=limb(f.arm,[11,9],SKIN,armHL());
  if(m.has('shoulders')&&f.arm)s+=`<circle cx="${f.arm[0].x}" cy="${f.arm[0].y}" r="8.5" fill="${INK}"/><circle cx="${f.arm[0].x}" cy="${f.arm[0].y}" r="6.5" fill="${HL}"/>`;
  s+=f.front||"";
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${floor}${s}</svg>`;
}

/* ---------- poses (side views face right unless noted) ---------- */
const POSES={
bench:()=>figure({H:P(46,104),N:P(64,110),Hp:P(122,114),fr:-1,face:-1,hl:['chest','shoulders','triceps'],
  back:pad(36,120,112,10)+`<line x1="60" y1="130" x2="60" y2="184" stroke="${INK}" stroke-width="5"/><line x1="128" y1="130" x2="128" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg:[P(122,114),P(152,120),P(160,180),P(172,182)],leg2:[P(118,114),P(146,122),P(150,180),P(162,182)],
  arm2:[P(60,108),P(60,86),P(62,62)],arm:[P(68,110),P(70,86),P(68,62)],front:bar(P(30,58),P(106,58),4)+plate(P(30,58),19)+plate(P(106,58),19)}),
incline_db:()=>figure({H:P(60,72),N:P(72,90),Hp:P(100,138),fr:-1,hl:['chest','shoulders','triceps'],
  back:`<line x1="56" y1="76" x2="98" y2="148" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><line x1="56" y1="76" x2="98" y2="148" stroke="#e9efee" stroke-width="9" stroke-linecap="round"/>`+pad(92,144,46,9)+`<line x1="112" y1="153" x2="112" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg:[P(100,136),P(138,130),P(140,180),P(152,182)],arm2:[P(70,88),P(90,74),P(92,48)],arm:[P(76,92),P(98,78),P(98,50)],front:db(P(98,46))}),
shoulder_press:()=>figure({H:P(100,56),N:P(100,74),Hp:P(100,132),fr:-1,hl:['shoulders','triceps'],
  back:`<line x1="84" y1="66" x2="84" y2="140" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="84" y1="66" x2="84" y2="140" stroke="#e9efee" stroke-width="7" stroke-linecap="round"/>`+pad(78,140,52,9)+`<line x1="104" y1="149" x2="104" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg:[P(100,132),P(138,132),P(140,180),P(152,182)],arm2:[P(98,76),P(92,50),P(98,22)],arm:[P(104,76),P(114,52),P(108,22)],front:db(P(108,20))}),
lateral_raise:()=>figure({H:P(100,36),N:P(100,56),Hp:P(100,110),fr:-1,tw:34,hl:['shoulders'],
  leg2:[P(110,110),P(114,146),P(116,182),P(126,184)],leg:[P(90,110),P(86,146),P(84,182),P(74,184)],
  arm2:[P(120,62),P(144,66),P(166,70)],arm:[P(80,62),P(56,66),P(34,70)],front:db(P(30,72),90)+db(P(170,72),90)}),
dips:()=>figure({H:P(98,48),N:P(100,66),Hp:P(106,116),fr:-1,hl:['chest','triceps','shoulders'],
  back:bar(P(62,104),P(150,104),6)+bar(P(70,104),P(70,184),5)+bar(P(142,104),P(142,184),5),
  leg2:[P(104,116),P(96,146),P(70,140),P(64,132)],leg:[P(108,116),P(104,148),P(78,146),P(72,138)],
  arm:[P(100,70),P(80,86),P(102,104)],arm2:[P(98,68),P(78,84),P(98,102)],front:bar(P(62,106),P(150,106),6)}),
triceps_pushdown:()=>figure({H:P(104,40),N:P(102,58),Hp:P(98,112),fr:-1,hl:['triceps'],
  back:`<rect x="168" y="12" width="10" height="174" fill="#e9efee" stroke="${INK}" stroke-width="2.5"/>`+pulley(P(164,22))+cable(P(164,22),P(114,128)),
  leg2:[P(96,112),P(94,148),P(92,182),P(104,184)],leg:[P(100,112),P(102,148),P(100,182),P(112,184)],
  arm:[P(104,62),P(104,96),P(114,128)],front:bar(P(108,128),P(122,128),4)}),
pullup:()=>figure({H:P(112,30),N:P(104,48),Hp:P(98,104),fr:-1,hl:['back','biceps'],
  back:bar(P(52,16),P(150,16),6),leg2:[P(96,104),P(104,138),P(88,160),P(84,170)],leg:[P(100,104),P(110,136),P(94,160),P(90,170)],
  arm2:[P(102,50),P(120,44),P(98,18)],arm:[P(106,52),P(124,48),P(104,18)]}),
barbell_row:()=>figure({H:P(146,70),N:P(130,82),Hp:P(80,104),fr:-1,hl:['back','biceps'],
  leg2:[P(78,104),P(90,142),P(80,182),P(92,184)],leg:[P(82,104),P(96,142),P(86,182),P(98,184)],
  arm:[P(126,86),P(102,96),P(120,118)],front:bar(P(108,120),P(134,120),4)+plate(P(120,122),17)}),
close_pulldown:()=>figure({H:P(94,66),N:P(96,84),Hp:P(100,138),fr:-1,hl:['back','biceps'],
  back:pulley(P(118,10))+cable(P(118,10),P(118,82))+pad(76,144,62,9)+`<line x1="104" y1="153" x2="104" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg:[P(100,138),P(138,136),P(140,182),P(152,184)],mid:pad(122,118,26,12,6),
  arm:[P(100,88),P(112,114),P(118,84)],front:bar(P(112,82),P(126,82),4)}),
db_row:()=>figure({H:P(148,86),N:P(132,92),Hp:P(72,96),fr:-1,hl:['back','biceps'],
  back:pad(92,118,82,10)+`<line x1="104" y1="128" x2="104" y2="184" stroke="${INK}" stroke-width="5"/><line x1="162" y1="128" x2="162" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg2:[P(74,96),P(104,114),P(78,114),P(70,112)],arm2:[P(134,94),P(140,106),P(148,118)],
  leg:[P(70,96),P(66,140),P(64,182),P(76,184)],arm:[P(128,92),P(104,78),P(114,108)],front:db(P(114,110))}),
face_pull:()=>figure({H:P(102,38),N:P(100,56),Hp:P(96,112),fr:-1,hl:['shoulders','back'],
  back:`<rect x="168" y="12" width="10" height="174" fill="#e9efee" stroke="${INK}" stroke-width="2.5"/>`+pulley(P(164,46))+cable(P(164,46),P(122,40)),
  leg2:[P(94,112),P(90,148),P(88,182),P(100,184)],leg:[P(98,112),P(102,148),P(102,182),P(114,184)],
  arm:[P(100,62),P(80,50),P(118,40)]}),
curl_db:()=>figure({H:P(100,38),N:P(100,56),Hp:P(100,112),fr:-1,hl:['biceps'],
  leg2:[P(98,112),P(96,148),P(94,182),P(106,184)],leg:[P(102,112),P(104,148),P(102,182),P(114,184)],
  arm2:[P(98,60),P(96,96),P(96,128)],arm:[P(102,62),P(102,98),P(126,76)],front:db(P(128,74),90)+db(P(96,132))}),
hammer_curl:()=>figure({H:P(100,38),N:P(100,56),Hp:P(100,112),fr:-1,hl:['biceps','forearm'],
  leg2:[P(98,112),P(96,148),P(94,182),P(106,184)],leg:[P(102,112),P(104,148),P(102,182),P(114,184)],
  arm2:[P(98,60),P(96,96),P(96,128)],arm:[P(102,62),P(102,98),P(124,72)],front:db(P(126,70),20)+db(P(96,132),90)}),
hanging_leg_raise:()=>figure({H:P(112,46),N:P(102,58),Hp:P(98,110),fr:-1,hl:['abs'],
  back:bar(P(52,16),P(150,16),6),arm2:[P(100,58),P(98,38),P(96,18)],
  leg2:[P(96,110),P(132,104),P(166,100),P(172,92)],leg:[P(100,112),P(136,110),P(170,108),P(176,100)],
  arm:[P(104,60),P(104,40),P(102,18)]}),
cable_crunch:()=>figure({H:P(136,138),N:P(122,126),Hp:P(80,138),fr:-1,hl:['abs'],
  back:pulley(P(140,10))+cable(P(140,10),P(128,116)),
  leg2:[P(78,138),P(84,176),P(50,180),P(42,176)],leg:[P(82,140),P(90,178),P(56,182),P(48,178)],
  arm:[P(120,124),P(118,104),P(130,116)]}),
squat:()=>figure({H:P(112,56),N:P(104,72),Hp:P(76,126),fr:-1,hl:['quads','glutes'],
  leg2:[P(74,126),P(112,128),P(102,182),P(114,184)],leg:[P(78,128),P(118,132),P(108,182),P(120,184)],
  arm:[P(102,76),P(84,88),P(96,66)],front:bar(P(54,66),P(140,66),4)+plate(P(97,66),20)}),
rdl:()=>figure({H:P(146,88),N:P(128,94),Hp:P(78,100),fr:-1,hl:['hams','glutes','lowback'],
  leg2:[P(76,100),P(84,142),P(82,182),P(94,184)],leg:[P(80,102),P(90,142),P(88,182),P(100,184)],
  arm:[P(124,98),P(122,122),P(120,144)],front:bar(P(104,146),P(136,146),4)+plate(P(120,148),18)}),
leg_press:()=>figure({H:P(42,98),N:P(54,112),Hp:P(86,150),fr:-1,face:1,hl:['quads','glutes'],
  back:`<line x1="34" y1="96" x2="92" y2="164" stroke="${INK}" stroke-width="14" stroke-linecap="round"/><line x1="34" y1="96" x2="92" y2="164" stroke="#e9efee" stroke-width="9" stroke-linecap="round"/>`+bar(P(120,184),P(186,60),5),
  leg2:[P(84,150),P(104,104),P(146,92),P(150,82)],leg:[P(88,152),P(110,108),P(150,98),P(154,88)],
  arm:[P(56,116),P(70,138),P(86,160)],front:`<line x1="140" y1="66" x2="168" y2="120" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="140" y1="66" x2="168" y2="120" stroke="${GEAR}" stroke-width="7" stroke-linecap="round"/>`}),
walking_lunge:()=>figure({H:P(100,42),N:P(100,60),Hp:P(98,116),fr:-1,hl:['quads','glutes'],
  leg2:[P(96,116),P(80,166),P(56,176),P(50,184)],leg:[P(100,118),P(132,138),P(130,182),P(142,184)],
  arm:[P(100,64),P(98,96),P(98,124)],front:db(P(98,128),90)}),
leg_curl:()=>figure({H:P(90,62),N:P(92,80),Hp:P(98,136),fr:-1,hl:['hams'],
  back:`<line x1="78" y1="70" x2="84" y2="140" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><line x1="78" y1="70" x2="84" y2="140" stroke="#e9efee" stroke-width="7" stroke-linecap="round"/>`+pad(76,142,64,9)+`<line x1="104" y1="151" x2="104" y2="184" stroke="${INK}" stroke-width="5"/>`,
  leg:[P(98,136),P(138,138),P(126,174),P(118,182)],mid:`<circle cx="124" cy="176" r="8" fill="${GEAR}" stroke="${INK}" stroke-width="2.5"/>`+pad(112,124,30,9,5),
  arm:[P(94,84),P(102,110),P(116,130)]}),
calf_raise:()=>figure({H:P(100,30),N:P(100,48),Hp:P(100,104),fr:-1,hl:['calves'],
  back:`<rect x="82" y="174" width="60" height="12" rx="2" fill="#e9efee" stroke="${INK}" stroke-width="2.5"/>`,
  leg2:[P(98,104),P(96,140),P(94,166),P(106,176)],leg:[P(102,104),P(104,140),P(100,166),P(112,176)],
  arm:[P(102,54),P(102,88),P(102,118)],front:db(P(102,122),90)}),
plank:()=>figure({H:P(160,146),N:P(142,156),Hp:P(86,160),fr:-1,hl:['abs'],
  arm2:[P(140,156),P(136,178),P(160,180)],leg2:[P(84,160),P(58,168),P(32,176),P(28,184)],
  leg:[P(88,162),P(60,170),P(34,178),P(30,186)],arm:[P(144,158),P(142,180),P(166,182)]}),
cardio:()=>figure({H:P(108,34),N:P(104,52),Hp:P(96,104),fr:-1,hl:['quads','calves'],
  back:`<rect x="30" y="172" width="150" height="10" rx="4" fill="#e9efee" stroke="${INK}" stroke-width="2.5"/>`+bar(P(160,172),P(150,90),4)+bar(P(150,90),P(136,90),4),
  leg2:[P(94,104),P(72,132),P(58,160),P(52,170)],leg:[P(98,106),P(122,134),P(116,168),P(128,170)],
  arm2:[P(102,56),P(116,78),P(130,66)],arm:[P(106,58),P(90,80),P(78,72)]})
};

/* ---------- programs ---------- */
const E=(key,name,sets,lo,hi,muscles,opts={})=>({key,name,sets,lo,hi,muscles,rest:opts.rest||(lo<=8?'2–3 min':'60–90 s'),kind:opts.kind||'weight',note:opts.note||''});
const PROGRAMS=[
 {key:'push',name:'Push',sub:'Pecs, épaules, triceps',color:'#E07A5F',ex:[
   E('bench','Développé couché barre',4,6,8,'Pecs · épaules · triceps',{note:'Exercice roi : on suit la charge.'}),
   E('incline_db','Développé incliné haltères',3,8,10,'Haut des pecs · épaules'),
   E('shoulder_press','Développé militaire haltères assis',3,8,10,'Épaules · triceps'),
   E('lateral_raise','Élévations latérales',3,12,15,'Épaules (côtés)',{rest:'60 s'}),
   E('dips','Dips',3,8,12,'Pecs · triceps',{kind:'bodyweight',note:'Ajoute du lest quand tu dépasses 12.'}),
   E('triceps_pushdown','Extension triceps poulie haute',3,10,12,'Triceps')]},
 {key:'pull',name:'Pull',sub:'Dos, biceps, abdos',color:'#5B8DEF',ex:[
   E('pullup','Tractions',4,6,10,'Dos · biceps',{kind:'bodyweight',note:'Objectif : +1 répétition par séance.'}),
   E('barbell_row','Rowing barre',3,8,10,'Dos · biceps'),
   E('close_pulldown','Tirage vertical prise serrée',3,10,12,'Dos · biceps'),
   E('db_row','Rowing haltère un bras',3,10,10,'Dos (par bras)'),
   E('face_pull','Face pull',3,12,15,'Arrière d’épaules · posture',{rest:'60 s'}),
   E('curl_db','Curl haltères',3,10,12,'Biceps',{rest:'60 s'}),
   E('hammer_curl','Curl marteau',2,10,12,'Biceps · avant-bras',{rest:'60 s'}),
   E('hanging_leg_raise','Relevés de jambes suspendu',3,10,15,'Abdos',{kind:'bodyweight',rest:'60 s'}),
   E('cable_crunch','Crunch à la poulie haute',3,12,15,'Abdos',{rest:'60 s'})]},
 {key:'legs',name:'Jambes',sub:'Cuisses, fessiers, mollets',color:'#4CAF7A',ex:[
   E('squat','Squat barre',4,6,8,'Cuisses · fessiers'),
   E('rdl','Soulevé de terre roumain',3,8,10,'Ischios · fessiers · lombaires'),
   E('leg_press','Presse à cuisses',3,10,12,'Cuisses · fessiers'),
   E('walking_lunge','Fentes marchées haltères',3,10,10,'Cuisses · fessiers (par jambe)'),
   E('leg_curl','Leg curl assis',3,12,12,'Ischios',{rest:'60 s'}),
   E('calf_raise','Mollets debout',3,15,15,'Mollets',{rest:'60 s'}),
   E('plank','Planche',3,45,45,'Abdos · gainage',{kind:'time',rest:'60 s'})]},
 {key:'cardio',name:'Cardio',sub:'Tapis, vélo, rameur',color:'#F2B33D',ex:[]}
];
const CARDIO_TYPES=[
 {key:'endurance',name:'Endurance',hint:'30–40 min à 9–10 km/h, tu peux encore parler'},
 {key:'fractionne',name:'Fractionné',hint:'5 min échauffement · 8 × (1 min à 13 km/h + 1 min à 7 km/h) · 4 min calme'},
 {key:'doux',name:'Doux',hint:'20–30 min vélo, rameur ou marche inclinée'}];

const cache={};
window.PDR_SPORT={PROGRAMS,CARDIO_TYPES,draw:k=>cache[k]||(cache[k]=(POSES[k]||POSES.cardio)())};
})();
