// عناصر
const profileFile = document.getElementById('profileFile');
const nameEl = document.getElementById('name');
const jobEl = document.getElementById('job');
const phoneEl = document.getElementById('phone');
const emailEl = document.getElementById('email');
const bioEl = document.getElementById('bio');
const skillsEl = document.getElementById('skills');
const yearSel = document.getElementById('year');
const monthSel = document.getElementById('month');
const daySel = document.getElementById('day');
const addWhats = document.getElementById('addWhats');
const whInput = document.getElementById('whInput');
const whList = document.getElementById('whList');
const previewBtn = document.getElementById('previewBtn');
const clearBtn = document.getElementById('clearBtn');
const cvPreviewContainer = document.getElementById('cvPreviewContainer');
const downloadBtn = document.getElementById('downloadBtn');
const shareBtn = document.getElementById('shareBtn');

let profileDataURL = '';
let whats = [];

// ملء السنوات والشهور والأيام
(function initDateSelectors(){
  for(let y=2025; y>=1900; y--){ const o=document.createElement('option'); o.value=y; o.textContent=y; yearSel.appendChild(o); }
  for(let m=1; m<=12; m++){ const o=document.createElement('option'); o.value=m; o.textContent=m; monthSel.appendChild(o); }
  updateDays();
  yearSel.addEventListener('change', updateDays);
  monthSel.addEventListener('change', updateDays);
})();
function isLeap(y){ return (y%4===0 && y%100!==0) || (y%400===0); }
function updateDays(){
  const y = parseInt(yearSel.value||2025,10);
  const m = parseInt(monthSel.value||1,10);
  let days = 31;
  if([4,6,9,11].includes(m)) days = 30;
  else if(m===2) days = isLeap(y)?29:28;
  daySel.innerHTML = '';
  for(let d=1; d<=days; d++){ const o=document.createElement('option'); o.value=d; o.textContent=d; daySel.appendChild(o); }
}

// صورة شخصية
profileFile.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f){ profileDataURL=''; return; }
  const r = new FileReader();
  r.onload = ()=> profileDataURL = r.result;
  r.readAsDataURL(f);
});

// واتساب
addWhats.addEventListener('click', ()=>{
  const raw = whInput.value.trim();
  const clean = raw.replace(/\D/g,'');
  if(!clean){ alert('أدخل رقم صحيح'); return; }
  if(!whats.includes(clean)) whats.push(clean);
  whInput.value='';
  renderWhats();
});
function renderWhats(){
  whList.innerHTML='';
  whats.forEach(n=>{
    const b = document.createElement('div');
    b.className = 'wh-badge green';
    b.title = 'واتساب +'+n;
    b.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="white"><path d="M17.2 14.1c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.33.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.12.3-.31.45-.47.15-.15.2-.26.3-.43.1-.17.05-.32-.02-.47-.07-.15-.68-1.64-.93-2.24-.24-.58-.48-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.79.32-.24.22-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.86.14.2 1.93 2.95 4.68 4.02 3.25 1.28 3.25.86 3.84.81.59-.05 1.92-.78 2.19-1.53.27-.75.27-1.39.19-1.53-.07-.13-.26-.2-.56-.34z"/></svg>
    <span>+${n}</span>
    <button class="remove" data-num="${n}" style="margin-inline-start:6px;background:transparent;border:0;color:var(--muted);cursor:pointer">✕</button>`;
    whList.appendChild(b);
  });
  whList.querySelectorAll('.remove').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      whats = whats.filter(x=>x!==btn.dataset.num);
      renderWhats();
    });
  });
}

// توليد المعاينة
previewBtn.addEventListener('click', ()=> {
  const data = collectForm();
  const node = buildCVNode(data);
  cvPreviewContainer.innerHTML = '';
  cvPreviewContainer.appendChild(node);
  // تمرير إلى زر التحميل
});

// جمع البيانات
function collectForm(){
  return {
    name: nameEl.value.trim() || 'الاسم غير مُدخل',
    job: jobEl.value.trim(),
    phone: phoneEl.value.trim(),
    email: emailEl.value.trim(),
    bio: bioEl.value.trim(),
    skills: skillsEl.value.split(',').map(s=>s.trim()).filter(Boolean),
    year: yearSel.value,
    month: monthSel.value,
    day: daySel.value,
    profile: profileDataURL,
    whats: [...whats]
  };
}

// بناء عقدة المعاينة (DOM)
function buildCVNode(d){
  const wrap = document.createElement('div');
  wrap.className = 'cv-card';

  const inner = document.createElement('div');
  inner.className = 'cv-inner';

  // مربع الصورة
  const photo = document.createElement('div');
  photo.className = 'photo-square';
  if(d.profile){
    const im = document.createElement('img'); im.src = d.profile; photo.appendChild(im);
  } else {
    const txt = document.createElement('div'); txt.style.color='#fff'; txt.style.fontWeight='800'; txt.style.fontSize='28px'; txt.textContent = (d.name.split(' ')[0]||'N'); photo.appendChild(txt);
  }

  const nameElDom = document.createElement('div');
  nameElDom.className = 'cv-name';
  nameElDom.textContent = d.name;

  const jobDom = document.createElement('div');
  jobDom.className = 'cv-job';
  jobDom.textContent = d.job || '';

  const meta = document.createElement('div');
  meta.className = 'cv-meta';
  meta.textContent = `تاريخ الميلاد: ${d.day}/${d.month}/${d.year} • هاتف: ${d.phone || '---'}`;

  const divider = document.createElement('div'); divider.className='divider';

  const skillsRow = document.createElement('div'); skillsRow.className='skills';
  (d.skills||[]).slice(0,8).forEach(s=>{
    const p = document.createElement('div'); p.className='skill-pill'; p.textContent = s; skillsRow.appendChild(p);
  });

  const bioDom = document.createElement('div'); bioDom.className='muted'; bioDom.style.marginTop='8px'; bioDom.style.textAlign='center'; bioDom.textContent = d.bio || '';

  // واتساب badges
  const socials = document.createElement('div'); socials.className='socials';
  // social icons placeholders
  ['f','t','y','tt'].forEach(x=>{
    const ic = document.createElement('div'); ic.className='social-icon'; ic.textContent = x.toUpperCase(); socials.appendChild(ic);
  });

  inner.appendChild(photo);
  inner.appendChild(nameElDom);
  inner.appendChild(jobDom);
  inner.appendChild(meta);
  inner.appendChild(divider);
  inner.appendChild(skillsRow);
  inner.appendChild(bioDom);
  inner.appendChild(socials);

  // actions overlay: whatsapp badges below
  const badgeWrap = document.createElement('div');
  badgeWrap.style.position='absolute';
  badgeWrap.style.bottom='18px';
  badgeWrap.style.left='50%';
  badgeWrap.style.transform='translateX(-50%)';
  badgeWrap.style.display='flex';
  badgeWrap.style.gap='10px';
  (d.whats||[]).forEach(num=>{
    const b = document.createElement('div'); b.className='wh-badge green';
    b.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.2 14.1c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.33.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.12.3-.31.45-.47.15-.15.2-.26.3-.43.1-.17.05-.32-.02-.47-.07-.15-.68-1.64-.93-2.24-.24-.58-.48-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.79.32-.24.22-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.86.14.2 1.93 2.95 4.68 4.02 3.25 1.28 3.25.86 3.84.81.59-.05 1.92-.78 2.19-1.53.27-.75.27-1.39.19-1.53-.07-.13-.26-.2-.56-.34z"/></svg>`;
    b.title = 'مشاركة عبر واتساب +'+num;
    b.addEventListener('click', ()=> shareToWhatsAppWithImage(d, num));
    badgeWrap.appendChild(b);
  });

  wrap.appendChild(inner);
  wrap.appendChild(badgeWrap);
  return wrap;
}

// تنزيل كصورة PNG: نرسم تمثيلاً على كانفاس
downloadBtn.addEventListener('click', async ()=>{
  const node = cvPreviewContainer.querySelector('.cv-card');
  if(!node){ alert('أنشئ المعاينة أولاً'); return; }
  const dataUrl = await renderCVToDataURL(node);
  triggerDownload(dataUrl, sanitizeFilename((nameEl.value||'cv')) + '.png');
});

// مشاركة / واتساب
shareBtn.addEventListener('click', async ()=>{
  const node = cvPreviewContainer.querySelector('.cv-card');
  if(!node){ alert('أنشئ المعاينة أولاً'); return; }
  const dataUrl = await renderCVToDataURL(node);
  // تحويل إلى blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  // إذا يدعم Web Share API للصور
  if(navigator.canShare && navigator.canShare({ files: [new File([blob], 'cv.png', {type: blob.type})] })){
    try{
      await navigator.share({ files: [new File([blob], 'cv.png', {type: blob.type})], title: 'سيرتي الذاتية', text: nameEl.value || '' });
      return;
    }catch(e){ console.warn('share failed', e); }
  }

  // خلاف ذلك افتح واتساب مع نص جاهز (المستخدم يضيف الصورة يدوياً)
  const text = buildShareText(collectForm());
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url,'_blank');
});

// مشاركة محددة برقم
async function shareToWhatsAppWithImage(data, number){
  const node = cvPreviewContainer.querySelector('.cv-card');
  if(!node){ alert('إنشئ المعاينة'); return; }
  const dataUrl = await renderCVToDataURL(node);
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  // try Web Share with files for direct send
  if(navigator.canShare && navigator.canShare({ files: [new File([blob], 'cv.png', {type: blob.type})] })){
    try{ await navigator.share({ files: [new File([blob], 'cv.png', {type: blob.type})], title: 'سيرة ذاتية', text: data.name }); return; }catch(e){ console.warn(e); }
  }
  // fallback: open wa.me with text
  const text = buildShareText(data) + '\n(الملف محفوظ محلياً، أرفقه يدوياً)';
  window.open(`https://wa.me/${number}?text=${encodeURIComponent(text)}`,'_blank');
}

// رسم تمثيلي للـ CV في كانفاس وإرجاع dataURL
async function renderCVToDataURL(cvNode){
  // نرسم نسخة مبسطة: دائرة + صورة + نص
  const size = 1200;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');

  // خلفية
  ctx.fillStyle = '#07121a'; ctx.fillRect(0,0,size,size);

  // دائرة كبيرة
  ctx.beginPath(); ctx.arc(size/2,size/2,size*0.45,0,Math.PI*2); ctx.fillStyle = '#0b1116'; ctx.fill();

  // داخل الدائرة: صورة (إن وُجدت)
  const imgEl = cvNode.querySelector('.photo-square img');
  if(imgEl){
    const img = new Image(); img.crossOrigin='anonymous'; img.src = imgEl.src;
    await new Promise(res=>{
      img.onload = ()=> res();
      img.onerror = ()=> res();
    });
    // مركز الصورة مربع داخل الدائرة
    const side = size*0.28;
    const x = size/2 - side/2;
    const y = size/2 - side/2 - 120;
    // دائرة clip
    ctx.save();
    roundRect(ctx, x, y, side, side, 18);
    ctx.clip();
    // draw
    try { ctx.drawImage(img, x, y, side, side); } catch(e){}
    ctx.restore();
  } else {
    // اسم مختصر
    ctx.fillStyle = '#fff'; ctx.font = 'bold 88px sans-serif'; ctx.textAlign='center';
    ctx.fillText((collectForm().name||'N').split(' ')[0], size/2, size/2 - 60);
  }

  // اسم
  ctx.fillStyle = '#d4af37'; ctx.font = '700 56px sans-serif'; ctx.textAlign='center';
  ctx.fillText((cvNode.querySelector('.cv-name')?.textContent)||collectForm().name, size/2, size/2 + 70);

  // وظيفة ونصوص
  ctx.fillStyle = '#cfe7d9'; ctx.font = '24px sans-serif';
  const job = cvNode.querySelector('.cv-job')?.textContent || '';
  wrapText(ctx, job, size/2, size/2 + 110, 640, 28);

  // نبذة
  ctx.fillStyle = '#99b0b6'; ctx.font = '20px sans-serif';
  const bio = cvNode.querySelector('.muted')?.textContent || '';
  wrapText(ctx, bio, size/2, size/2 + 170, 720, 22);

  // مهارات
  const skills = Array.from(cvNode.querySelectorAll('.skill-pill')).map(s=>s.textContent).join(' • ');
  ctx.fillStyle = '#e6f0f0'; ctx.font = '20px sans-serif';
  wrapText(ctx, skills, size/2, size/2 + 230, 800, 20);

  // أرقام واتساب في الأسفل
  const badges = Array.from(cvNode.querySelectorAll('.wh-badge'));
  let bx = size/2 - (badges.length*38)/2;
  badges.forEach((b,i)=>{
    ctx.beginPath();
    ctx.arc(bx + i*46, size - 90, 18, 0, Math.PI*2);
    ctx.fillStyle = '#05a85a'; ctx.fill();
    ctx.fillStyle = '#fff'; ctx.font='bold 12px sans-serif'; ctx.textAlign='center';
    const text = b.querySelector('span') ? b.querySelector('span').textContent : '';
    ctx.fillText(text.replace('+',''), bx + i*46, size - 86);
  });

  return canvas.toDataURL('image/png');
}

// أدوات رسم
function wrapText(ctx, text, x, y, maxWidth, lineHeight){
  if(!text) return;
  const words = text.split(' ');
  let line = '', testLine='', lineCount=0;
  for(let n=0;n<words.length;n++){
    testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if(metrics.width > maxWidth && n>0){ ctx.fillText(line, x, y + lineCount*lineHeight); line = words[n] + ' '; lineCount++; }
    else line = testLine;
  }
  ctx.fillText(line, x, y + lineCount*lineHeight);
}
function roundRect(ctx, x, y, w, h, r){
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y, x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x, y+h, r);
  ctx.arcTo(x, y+h, x, y, r);
  ctx.arcTo(x, y, x+w, y, r);
  ctx.closePath();
}

// تنزيل
function triggerDownload(dataUrl, filename){
  const a = document.createElement('a'); a.href = dataUrl; a.download = filename; a.click();
}
function sanitizeFilename(name){ return String(name||'cv').replace(/[^0-9\u0600-\u06FFa-zA-Z\-_ ]+/g,'').trim().replace(/\s+/g,'_').slice(0,80); }

// نص المشاركة
function buildShareText(d){
  return `سيرتي الذاتية\nالاسم: ${d.name}\nالوظيفة: ${d.job}\nالهاتف: ${d.phone}\nالبريد: ${d.email}\nتاريخ الميلاد: ${d.day}/${d.month}/${d.year}\n\n${d.bio}\n\n*NEGM*`;
}

// مسح الحقول
clearBtn.addEventListener('click', ()=>{
  profileFile.value=''; profileDataURL=''; nameEl.value=''; jobEl.value=''; phoneEl.value=''; emailEl.value=''; bioEl.value=''; skillsEl.value=''; whats=[]; renderWhats(); cvPreviewContainer.innerHTML='';
});

// مساعدة: استخراج صورة داخل cvNode لـ canvas (ليست ضرورية هنا)
function renderWhats(){
  whList.innerHTML='';
  whats.forEach(n=>{
    const el = document.createElement('div'); el.className='wh-badge green'; el.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="white"><path d="M17.2 14.1c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.33.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.12.3-.31.45-.47.15-.15.2-.26.3-.43.1-.17.05-.32-.02-.47-.07-.15-.68-1.64-.93-2.24-.24-.58-.48-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.79.32-.24.22-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.86.14.2 1.93 2.95 4.68 4.02 3.25 1.28 3.25.86 3.84.81.59-.05 1.92-.78 2.19-1.53.27-.75.27-1.39.19-1.53-.07-.13-.26-.2-.56-.34z"/></svg><span>+${n}</span><button class="remove" data-num="${n}" style="background:transparent;border:0;color:var(--muted);cursor:pointer">✕</button>`;
    whList.appendChild(el);
  });
  whList.querySelectorAll('.remove').forEach(b=> b.addEventListener('click', ()=>{ whats = whats.filter(x=>x!==b.dataset.num); renderWhats(); }));
}

// renderWhats initial
renderWhats();
