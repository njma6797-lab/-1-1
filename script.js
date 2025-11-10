// عناصر DOM
const profileFile = document.getElementById('profileFile');
const nameEl = document.getElementById('name');
const phoneEl = document.getElementById('phone');
const jobEl = document.getElementById('job');
const dobEl = document.getElementById('dob');
const notesEl = document.getElementById('notes');
const whInput = document.getElementById('whInput');
const addWhatsBtn = document.getElementById('addWhatsBtn');
const whList = document.getElementById('whList');
const addToList = document.getElementById('addToList');
const clearForm = document.getElementById('clearForm');
const cards = document.getElementById('cards');

let profileDataURL = '';
let whatsNumbers = []; // قائمة الأرقام المضافة مؤقتاً

// قراءة الصورة الشخصية وتحويلها إلى dataURL
profileFile.addEventListener('change', e=>{
  const f = e.target.files[0];
  if(!f) { profileDataURL = ''; return; }
  const reader = new FileReader();
  reader.onload = ()=> profileDataURL = reader.result;
  reader.readAsDataURL(f);
});

// إضافة رقم واتساب للقائمة المؤقتة
addWhatsBtn.addEventListener('click', ()=>{
  const raw = whInput.value.trim();
  const clean = raw.replace(/\D/g,'');
  if(!clean){ alert('أدخل رقم صحيح'); return; }
  if(whatsNumbers.includes(clean)){ whInput.value = ''; return; }
  whatsNumbers.push(clean);
  renderWhList();
  whInput.value = '';
});

function renderWhList(){
  whList.innerHTML = '';
  whatsNumbers.forEach(num=>{
    const el = document.createElement('div');
    el.className = 'wh-item';
    el.innerHTML = `<span class="wh-pill">+${num}</span> <button data-num="${num}" class="btn muted remove">حذف</button>`;
    whList.appendChild(el);
  });
  // ربط أزرار الحذف
  whList.querySelectorAll('.remove').forEach(b=>{
    b.addEventListener('click', ()=> {
      const n = b.dataset.num;
      whatsNumbers = whatsNumbers.filter(x=>x!==n);
      renderWhList();
    });
  });
}

// إضافة بطاقة جديدة لقائمة الملصقات
addToList.addEventListener('click', ()=>{
  const data = {
    name: nameEl.value.trim() || 'الاسم غير مُدخل',
    phone: phoneEl.value.trim() || '---',
    job: jobEl.value.trim() || '',
    dob: dobEl.value.trim() || '',
    notes: notesEl.value.trim() || '',
    profile: profileDataURL,
    whats: [...whatsNumbers] // نسخة
  };
  const node = createCardNode(data);
  cards.prepend(node);
  // إعادة تعيين النموذج
  resetForm();
});

// مسح الحقول
clearForm.addEventListener('click', resetForm);
function resetForm(){
  profileFile.value = '';
  profileDataURL = '';
  nameEl.value = '';
  phoneEl.value = '';
  jobEl.value = '';
  dobEl.value = '';
  notesEl.value = '';
  whatsNumbers = [];
  renderWhList();
}

// إنشاء عنصر البطاقة
function createCardNode(data){
  const wrapper = document.createElement('div');
  wrapper.className = 'cd-card card';

  // معاينة دائرية (CD)
  const preview = document.createElement('div');
  preview.className = 'preview';
  if(data.profile){
    const img = document.createElement('img');
    img.src = data.profile;
    preview.appendChild(img);
  } else {
    const t = document.createElement('div');
    t.style.color = '#fff';
    t.style.fontSize = '20px';
    t.style.fontWeight = '700';
    t.textContent = (data.name||'شخص').split(' ')[0];
    preview.appendChild(t);
  }

  // معلومات
  const info = document.createElement('div');
  info.className = 'cd-info';
  info.innerHTML = `<h3>${escapeHtml(data.name)}</h3>
                    <p>${escapeHtml(data.job)} ${data.dob?('• '+escapeHtml(data.dob)):''}</p>
                    <p class="muted">${escapeHtml(data.notes)}</p>`;

  // شارات واتساب دائرية
  const whBadges = document.createElement('div');
  whBadges.className = 'wh-badges';
  (data.whats||[]).forEach(num=>{
    const b = document.createElement('div');
    b.className = 'wh-badge green';
    b.title = 'شارك عبر واتساب: +' + num;
    b.innerHTML = whatsappSVG();
    b.addEventListener('click', ()=> {
      // فتح دردشة واتساب مع نص الملصق
      const text = buildShareText(data);
      const url = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
      window.open(url,'_blank');
    });
    whBadges.appendChild(b);
  });

  info.appendChild(whBadges);

  // أزرار الحفظ والمشاركة والحذف
  const actions = document.createElement('div');
  actions.className = 'card-actions';
  const dl = document.createElement('button');
  dl.className = 'small-btn download-btn';
  dl.textContent = 'حفظ كصورة';
  dl.addEventListener('click', ()=> downloadCardAsPNG(wrapper, data.name || 'label'));

  const shareAll = document.createElement('button');
  shareAll.className = 'small-btn';
  shareAll.textContent = 'مشاركة (بدون رقم)';
  shareAll.addEventListener('click', ()=> {
    const text = buildShareText(data);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url,'_blank');
  });

  const remove = document.createElement('button');
  remove.className = 'small-btn muted';
  remove.textContent = 'حذف';
  remove.addEventListener('click', ()=> wrapper.remove());

  actions.appendChild(dl);
  actions.appendChild(shareAll);
  actions.appendChild(remove);

  wrapper.appendChild(preview);
  wrapper.appendChild(info);
  wrapper.appendChild(actions);

  return wrapper;
}

// نص المشاركة المبني من البيانات
function buildShareText(data){
  let t = `ملصق سي دي\nالاسم: ${data.name}\nالهاتف: ${data.phone}\n`;
  if(data.job) t += `الوظيفة: ${data.job}\n`;
  if(data.dob) t += `العمر/تاريخ الميلاد: ${data.dob}\n`;
  if(data.notes) t += `ملاحظات: ${data.notes}\n`;
  t += `\nمرفق كصورة عند الحفظ.`;
  return t;
}

// تنزيل العنصر كصورة PNG عبر رسم كانْفاس مبسّط
function downloadCardAsPNG(element, filename){
  // نرسم تمثيلاً للبطاقة: دائرة خلفية + نص + صورة شخصية إن وجدت
  const width = 1000;
  const height = 1000;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // خلفية
  ctx.fillStyle = '#0b1116';
  ctx.fillRect(0,0,width,height);

  // دائرة CD
  const cx = width/2, cy = height/2, r = Math.min(width,height)*0.42;
  ctx.beginPath();
  ctx.arc(cx,cy,r,0,Math.PI*2);
  ctx.fillStyle = '#0f2330';
  ctx.fill();

  // صورة شخصية في منتصف الدائرة إن وجدت
  if(dataURLofElement(element)){
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = dataURLofElement(element);
    img.onload = ()=>{
      // crop square center
      const side = Math.min(img.width, img.height);
      // draw clipped circular image
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx,cy,r*0.92,0,Math.PI*2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(img, (img.width-side)/2, (img.height-side)/2, side, side, cx-r*0.92, cy-r*0.92, r*1.84, r*1.84);
      ctx.restore();
      drawTextAndExport();
    };
    img.onerror = ()=> drawTextAndExport();
  } else {
    drawTextAndExport();
  }

  function drawTextAndExport(){
    // اسم
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 48px sans-serif';
    const nameText = element.querySelector('.cd-info h3') ? element.querySelector('.cd-info h3').innerText : '';
    ctx.fillText(nameText, cx, cy - r*0.05);

    // وظيفة ومعلومات صغيرة
    ctx.fillStyle = '#cfe7d9';
    ctx.font = '24px sans-serif';
    const p = element.querySelector('.cd-info p') ? element.querySelector('.cd-info p').innerText : '';
    ctx.fillText(p, cx, cy + r*0.2);

    // ملاحظات
    ctx.fillStyle = '#99b0b6';
    ctx.font = '20px sans-serif';
    const notes = element.querySelector('.cd-info .muted') ? element.querySelector('.cd-info .muted').innerText : '';
    ctx.fillText(notes, cx, cy + r*0.33);

    // حفظ الصورة
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = sanitizeFilename(filename) + '.png';
    a.click();
  }
}

// helper: استخراج dataURL للصورة داخل preview إن وُجدت
function dataURLofElement(el){
  const img = el.querySelector('.preview img');
  return img ? img.src : null;
}

// مساعدة escape
function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
}

// sanitize filename
function sanitizeFilename(name){ return String(name).replace(/[^0-9\u0600-\u06FFa-zA-Z\-_ ]+/g,'').trim().replace(/\s+/g,'_').slice(0,80); }

// svg أيقونة واتساب
function whatsappSVG(){
  return `<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20.52 3.48a11.8 11.8 0 00-16.69 0 11.8 11.8 0 000 16.69L2 22l2.03-.53A11.8 11.8 0 0021 4.02 11.8 11.8 0 0020.52 3.48zM12 21c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" fill="rgba(0,0,0,0)"></path>
    <path d="M17.2 14.1c-.3-.15-1.77-.88-2.05-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.95 1.18-.17.2-.33.22-.63.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.65-2.07-.17-.3-.02-.46.13-.61.13-.12.3-.31.45-.47.15-.15.2-.26.3-.43.1-.17.05-.32-.02-.47-.07-.15-.68-1.64-.93-2.24-.24-.58-.48-.5-.68-.51-.18-.01-.38-.01-.58-.01-.2 0-.52.07-.79.32-.24.22-.96.94-.96 2.3 0 1.36.98 2.67 1.12 2.86.14.2 1.93 2.95 4.68 4.02 3.25 1.28 3.25.86 3.84.81.59-.05 1.92-.78 2.19-1.53.27-.75.27-1.39.19-1.53-.07-.13-.26-.2-.56-.34z" fill="#fff"/>
  </svg>`;
}
