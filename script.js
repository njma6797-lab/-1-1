let currentPage = 1;
showPage(currentPage);

function showPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    document.getElementById('page'+pageNum).classList.add('active');
    currentPage = pageNum;
}

function nextPage(pageNum) {
    showPage(pageNum);
}

function prevPage(pageNum) {
    showPage(pageNum);
}

function showCV() {
    // نقل البيانات إلى الـ CV
    const name = document.getElementById('name').value;
    const dob = document.getElementById('dob').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const nationality = document.getElementById('nationality').value;
    const status = document.getElementById('status').value;
    const education = document.getElementById('education').value;
    const experience = document.getElementById('experience').value;
    const skills = document.getElementById('skills').value;
    const languages = document.getElementById('languages').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const idNumber = document.getElementById('idNumber').value;
    const facebook = document.getElementById('facebook').value;
    const instagram = document.getElementById('instagram').value;
    const tiktok = document.getElementById('tiktok').value;
    const youtube = document.getElementById('youtube').value;

    const photoInput = document.getElementById('photo');
    const cvPhoto = document.getElementById('cvPhoto');

    if(photoInput.files[0]){
        cvPhoto.src = URL.createObjectURL(photoInput.files[0]);
    }

    document.getElementById('cvName').innerText = name;
    document.getElementById('cvContact').innerText = `${dob} | ${phone} | ${email}`;
    document.getElementById('cvAddress').innerText = `${address} | ${nationality} | ${status}`;
    document.getElementById('cvEducation').innerText = `${education} | ${experience}`;
    document.getElementById('cvSkills').innerText = `المهارات: ${skills} | اللغات: ${languages} | واتساب: ${whatsapp}`;
    document.getElementById('cvLinks').innerText = `الحسابات: ${facebook}, ${instagram}, ${tiktok}, ${youtube}`;

    showPage('finalCV');
}

// حفظ كصورة
document.getElementById('downloadBtn').addEventListener('click', () => {
    html2canvas(document.getElementById('cvCard')).then(canvas => {
        const link = document.createElement('a');
        link.download = 'CV.png';
        link.href = canvas.toDataURL();
        link.click();
    });
});

// مشاركة واتساب
document.getElementById('whatsappBtn').addEventListener('click', () => {
    const text = encodeURIComponent('شاهد الـ CV الخاص بي!');
    const url = `https://api.whatsapp.com/send?text=${text}`;
    window.open(url, '_blank');
});
