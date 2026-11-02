const $ = id => document.getElementById(id);
const show = n => {
    document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
    $('s' + n).classList.add('on');
};

$('t0').textContent = C.judul.toUpperCase();
$('d0').textContent = C.tanggal + ' \u2022 untuk ' + C.dia;

// Efek Hati
setInterval(() => {
    const h = document.createElement('i');
    h.textContent = ['\u2665', '\u2764', '\u2727'][Math.random() * 3 | 0];
    h.style.cssText = `left:${Math.random() * 100}vw; font-size:${10 + Math.random() * 22}px; color:#e8708a; animation-duration:${6 + Math.random() * 6}s`;
    $('hearts').appendChild(h);
    setTimeout(() => h.remove(), 12000);
}, 600);

// Audio
let ac, filt, ng, song = new Audio();

function initAudio() {
    ac = new (window.AudioContext || window.webkitAudioContext)();
    const b = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate), d = b.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const n = ac.createBufferSource();
    n.buffer = b;
    n.loop = true;
    filt = ac.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 2500;
    filt.Q.value = .5;
    ng = ac.createGain();
    ng.gain.value = .3;
    n.connect(filt);
    filt.connect(ng);
    ng.connect(ac.destination);
    n.start();
}

function beep(f, t, d = .15) {
    if (!ac) return;
    const o = ac.createOscillator(), g = ac.createGain();
    o.frequency.value = f;
    g.gain.setValueAtTime(.2, t);
    g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g);
    g.connect(ac.destination);
    o.start(t);
    o.stop(t + d);
}

// Radio
const seen = new Set();
let cur = null, typing = 0;

C.stations.forEach(s => {
    const t = document.createElement('div');
    t.className = 'tick';
    t.style.left = ((s.freq - 88) / 20 * 100) + '%';
    $('tk').appendChild(t);
});

$('pw').onclick = () => {
    initAudio();
    show(1);
    $('led').classList.add('on');
    tune(88);
};

function clearScr(html) {
    $('screen').innerHTML = html || '<div class="static">~ krrzzzt ~ ssshhh ~ kzzt ~</div>';
}

function tune(v) {
    v = +v;
    $('sl').value = v;
    $('fd').textContent = v.toFixed(1);
    $('nd').style.left = ((v - 88) / 20 * 100) + '%';
    
    let best = null, bd = 99;
    C.stations.forEach(s => {
        const d = Math.abs(s.freq - v);
        if (d < bd) { bd = d; best = s; }
    });
    
    const lock = bd < .11;
    if (ng) {
        ng.gain.setTargetAtTime(lock ? .012 : Math.min(.45, .12 + bd * .1), ac.currentTime, .03);
        filt.frequency.value = 700 + Math.random() * 4500;
    }
    
    if (lock) {
        if (cur !== best) { cur = best; play(best); }
    } else if (cur || !$('screen').innerHTML) {
        cur = null;
        song.pause();
        typing++;
        clearScr();
    }
}

$('sl').oninput = e => tune(e.target.value);
$('bl').onclick = () => tune(Math.max(88, +$('sl').value - .1));
$('br').onclick = () => tune(Math.min(108, +$('sl').value + .1));

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function play(s) {
    const my = ++typing;
    song.pause();
    const el = $('screen');
    
    if (!seen.has(s.freq)) {
        seen.add(s.freq);
        $('pg').textContent = 'Saluran ditemukan: ' + seen.size + ' / ' + C.stations.length;
        if (seen.size === C.stations.length) $('nx').style.display = 'inline-block';
    }
    
    if (s.type === 'song') {
        el.innerHTML = `<div class="vinyl"></div><div class="st">${s.title}</div><div class="ar">${s.artist || ''}</div><p class="tw"><p>${s.text || ''}</p></p>`;
        song = new Audio(s.audio);
        song.loop = true;
        song.play().catch(() => {});
    } else if (s.type === 'message') {
        el.innerHTML = `<div class="st" style="margin-bottom:10px">${s.title}</div><div class="tw"></div>`;
        for (const l of s.text) {
            if (my !== typing) return;
            const p = document.createElement('p');
            el.querySelector('.tw').appendChild(p);
            for (const c of l) {
                if (my !== typing) return;
                p.textContent += c;
                await sleep(38);
            }
            await sleep(500);
        }
    } else {
        el.innerHTML = `<div class="st">${s.title}</div><div class="env">&#9993;</div><div class="ar">ketuk amplop untuk membuka</div>`;
        el.querySelector('.env').onclick = () => {
            el.innerHTML = `<div class="paper"></div>`;
            const p = el.querySelector('.paper');
            p.textContent = s.text;
        };
    }
}

$('nx').onclick = () => {
    song.pause();
    if (ng) ng.gain.value = 0;
    show('g');
    $('gi').focus();
};

// Password
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function check() {
    if (norm($('gi').value) === norm(C.password)) {
        const t = ac ? ac.currentTime : 0;
        if (ac) { beep(660, t); beep(880, t + .2); beep(1320, t + .4, .3); }
        show(2);
        startBgm();
    } else {
        const g = $('gt');
        g.classList.remove('bad');
        void g.offsetWidth;
        g.classList.add('bad');
        if (ac) beep(160, ac.currentTime, .3);
        $('gh').textContent = C.hint || 'Password belum tepat, coba lagi ya.';
        $('gi').select();
    }
}

$('gb').onclick = check;
$('gi').