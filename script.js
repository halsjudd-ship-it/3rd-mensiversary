console.log("Website berhasil dimuat!");

const $ = id => document.getElementById(id);

const show = n => {
    document.querySelectorAll('.scr').forEach(s => s.classList.remove('on'));
    if($('s' + n)) $('s' + n).classList.add('on');
};

document.addEventListener("DOMContentLoaded", () => {
    if($('t0')) $('t0').textContent = C.judul.toUpperCase();
    if($('d0')) $('d0').textContent = C.tanggal + ' \u2022 untuk ' + C.dia;

    if($('pw')) {
        $('pw').addEventListener('click', () => {
            initAudio();
            show(1);
            if($('led')) $('led').classList.add('on');
            tune(88);
        });
    }

    setInterval(() => {
        if(!$('hearts')) return;
        const h = document.createElement('i');
        h.textContent = ['\u2665', '\u2764', '\u2727'][Math.random() * 3 | 0];
        h.style.cssText = `left:${Math.random() * 100}vw; font-size:${10 + Math.random() * 22}px; color:#e8708a; animation-duration:${6 + Math.random() * 6}s`;
        $('hearts').appendChild(h);
        setTimeout(() => h.remove(), 12000);
    }, 600);
    
    if($('tk')) {
        C.stations.forEach(s => {
            const t = document.createElement('div');
            t.className = 'tick';
            t.style.left = ((s.freq - 88) / 20 * 100) + '%';
            $('tk').appendChild(t);
        });
    }

    if($('gb')) $('gb').onclick = check;
    if($('gi')) $('gi').onkeydown = e => { if (e.key === 'Enter') check(); };
    
    let sd = 7;
    const rnd = () => (sd = sd * 16807 % 2147483647) / 2147483647;
    if($('bar')) {
        for (let i = 0; i < 46; i++) {
            const e = document.createElement('i');
            e.style.width = (1 + (rnd() * 4 | 0)) + 'px';
            e.style.marginRight = (1 + (rnd() * 3 | 0)) + 'px';
            $('bar').appendChild(e);
        }
    }
    
    if($('nx')) {
        $('nx').onclick = () => {
            if(song) song.pause();
            if (ng) ng.gain.value = 0;
            show('g');
            if($('gi')) $('gi').focus();
        };
    }

    document.querySelectorAll('[data-f]').forEach(b => b.onclick = () => {
        if (ac) beep(520, ac.currentTime, .08);
        const f = b.dataset.f;
        
        if (f === 'surat' && C.surat) open('<h2>Surat-suratku</h2>' + C.surat.map(s => `<div class="lt" onclick="this.classList.toggle('o')"><b>${s.judul}</b><div>${s.isi}</div></div>`).join(''));
        if (f === 'foto' && C.foto) open('<h2>Galeri Kita</h2>' + C.foto.map(p => `<div class="ph"><img src="${p.src}" alt=""><p>${p.cap}</p></div>`).join(''));
        if (f === 'momen' && C.momen) open('<h2>Momen Kita</h2><div class="tl">' + C.momen.map(m => `<div><small>${m.tgl}</small><br><b>${m.judul}</b><br>${m.isi}</div>`).join('') + '</div>');
        if (f === 'kita') open(`
            <h2 style="text-align:center; margin-bottom:20px;">Chibi Kita 🥰</h2>
            <div style="background:#fff; padding:15px 15px 40px; box-shadow:0 10px 20px rgba(0,0,0,0.1); transform:rotate(-2deg); max-width:300px; margin:0 auto;">
                <img src="media/chibi.jpg" style="width:100%; border-radius:5px; display:block;">
                <p style="text-align:center; font-family:'Georgia', serif; font-style:italic; font-size:15px; color:#b8325a; margin-top:15px; transform:rotate(1deg);">"Gemes banget, ya? Sama kayak kita."</p>
            </div>
        `);
    });

    if($('cx')) $('cx').onclick = () => { if($('mod')) $('mod').classList.remove('on'); };
    if($('mod')) $('mod').onclick = e => { if (e.target.id === 'mod') $('mod').classList.remove('on'); };

    if($('bar')) {
        $('bar').onclick = async () => {
            if (window.busy) return;
            window.busy = true;
            const bar = $('bar'), st = $('sts');
            bar.classList.add('scan');
            if(st) st.textContent = 'SCANNING...';
            
            for (let i = 0; i < 6; i++) {
                if (ac) beep(900 + i * 60, ac.currentTime, .07);
                await sleep(350);
            }
            
            bar.classList.remove('scan');
            if(st) st.innerHTML = '<span class="ok">&#10003; ACCESS GRANTED</span>';
            if (ac) { beep(880, ac.currentTime, .2); beep(1320, ac.currentTime + .18, .4); }
            
            await sleep(900);
            if($('pass')) $('pass').classList.add('rip');
            rip();
            if($('stub')) $('stub').classList.add('tear');
            
            for (let i = 0; i < 30; i++) {
                setTimeout(() => {
                    if(!$('hearts')) return;
                    const h = document.createElement('i');
                    h.textContent = '\u2764';
                    h.style.cssText = `left:${20 + Math.random() * 60}vw; font-size:${16 + Math.random() * 26}px; color:#ff6b8f; animation-duration:${3 + Math.random() * 3}s`;
                    $('hearts').appendChild(h);
                }, i * 80);
            }
            
            await sleep(2200);
            
            open(`
                <h2 style="text-align:center; color:#b8325a;">&#9992; Boarding Complete</h2>
                <p style="line-height:1.8; font-style:italic; text-align:center;">${C.akhir}</p>
                <div style="text-align:center; margin-top:20px;">
                    <p style="font-size:14px; margin-bottom:10px;">Aku punya satu kejutan lagi di TikTok...</p>
                    <a href="https://www.tiktok.com/@khalilyaze" target="_blank" class="tiktok-btn" onclick="setTimeout(()=>{document.getElementById('mod').classList.remove('on');show(3);}, 500)">
                        Buka TikTok & Lihat Kejutan
                    </a>
                </div>
                <p style="margin-top:14px;text-align:right; font-style:italic;">- ${C.aku}</p>
            `);
        };
    }
});

// ====== AUDIO & LOVELY MUSIC BOX ======
let ac, filt, ng, song = new Audio();

function initAudio() {
    try {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        // Suara desis radio
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
    } catch(e) { console.log("Audio error:", e); }
}

function beep(f, t, d = .15) {
    if (!ac) return;
    try {
        const o = ac.createOscillator(), g = ac.createGain();
        o.frequency.value = f;
        g.gain.setValueAtTime(.2, t);
        g.gain.exponentialRampToValueAtTime(.001, t + d);
        o.connect(g);
        g.connect(ac.destination);
        o.start(t);
        o.stop(t + d);
    } catch(e) {}
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ====== MELODI KOTAK MUSIK (LOVELY) ======
let bgmPlaying = false;
// Nada-nada ceria, hangat, dan romantis (seperti lagu pengantar tidur)
const lovelyMelody = [
    [523.25, 0.5], [659.25, 0.5], [783.99, 0.5], [1046.50, 1.0], [0, 0.5], // C5 E5 G5 C6
    [880.00, 0.5], [783.99, 0.5], [659.25, 0.5], [783.99, 1.0], [0, 0.5], // A5 G5 E5 G5
    [698.46, 0.5], [880.00, 0.5], [1046.50, 0.5], [1318.51, 1.0], [0, 0.5], // F5 A5 C6 E6
    [1174.66, 0.5], [1046.50, 0.5], [880.00, 0.5], [1046.50, 1.5] // D6 C6 A5 C6
];

function playLovelyMusicBox(index = 0) {
    if (!bgmPlaying) return;
    if (index >= lovelyMelody.length) index = 0; // Loop

    const [freq, duration] = lovelyMelody[index];

    if (freq > 0 && ac) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        
        // Tipe 'sine' menghasilkan suara paling murni (seperti kotak musik)
        osc.type = 'sine'; 
        osc.frequency.value = freq;

        const now = ac.currentTime;
        
        // Envelope khusus "Music Box" (bunyi 'ting' yang memudar cepat)
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.02); // Serangan sangat cepat
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration + 0.5); // Memudar perlahan

        osc.connect(gain);
        gain.connect(ac.destination);

        osc.start(now);
        osc.stop(now + duration + 0.6);
    }

    // Jadwalkan nada berikutnya
    setTimeout(() => playLovelyMusicBox(index + 1), duration * 1000);
}

function startBgm() {
    if (!ac) initAudio();
    if (!bgmPlaying) {
        bgmPlaying = true;
        setTimeout(() => playLovelyMusicBox(0), 1000); // Mulai setelah 1 detik
    }
}

function toggleMusic() {
    const btn = $('music-toggle');
    if (bgmPlaying) {
        bgmPlaying = false;
        btn.textContent = '🔇';
        btn.classList.add('paused');
    } else {
        bgmPlaying = true;
        btn.textContent = '🎵';
        btn.classList.remove('paused');
        playLovelyMusicBox(0); // Lanjut main dari awal
    }
}

// ====== RADIO FUNCTIONS ======
const seen = new Set();
let cur = null, typing = 0;

function clearScr(html) {
    if($('screen')) $('screen').innerHTML = html || '<div class="static">~ krrzzzt ~ ssshhh ~ kzzt ~</div>';
}

function tune(v) {
    v = +v;
    if(!$('sl')) return;
    $('sl').value = v;
    if($('fd')) $('fd').textContent = v.toFixed(1);
    if($('nd')) $('nd').style.left = ((v - 88) / 20 * 100) + '%';
    
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

if($('sl')) $('sl').oninput = e => tune(e.target.value);
if($('bl')) $('bl').onclick = () => tune(Math.max(88, +$('sl').value - .1));
if($('br')) $('br').onclick = () => tune(Math.min(108, +$('sl').value + .1));

async function play(s) {
    const my = ++typing;
    song.pause();
    const el = $('screen');
    if(!el) return;
    
    if (!seen.has(s.freq)) {
        seen.add(s.freq);
        if($('pg')) $('pg').textContent = 'Saluran ditemukan: ' + seen.size + ' / ' + C.stations.length;
        if (seen.size === C.stations.length && $('nx')) $('nx').style.display = 'inline-block';
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
            const tw = el.querySelector('.tw');
            if(tw) tw.appendChild(p);
            for (const c of l) {
                if (my !== typing) return;
                p.textContent += c;
                await sleep(38);
            }
            await sleep(500);
        }
    } else {
        el.innerHTML = `<div class="st">${s.title}</div><div class="env">&#9993;</div><div class="ar">ketuk amplop untuk membuka</div>`;
        const env = el.querySelector('.env');
        if(env) {
            env.onclick = () => {
                el.innerHTML = `<div class="paper"></div>`;
                const p = el.querySelector('.paper');
                if(p) p.textContent = s.text;
            };
        }
    }
}

// ====== PASSWORD & BOARDING ======
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');

function check() {
    if (norm($('gi').value) === norm(C.password)) {
        const t = ac ? ac.currentTime : 0;
        if (ac) { beep(660, t); beep(880, t + .2); beep(1320, t + .4, .3); }
        show(2);
        startBgm();
    } else {
        const g = $('gt');
        if(g) {
            g.classList.remove('bad');
            void g.offsetWidth;
            g.classList.add('bad');
        }
        if (ac) beep(160, ac.currentTime, .3);
        if($('gh')) $('gh').textContent = C.hint || 'Password belum tepat, coba lagi ya.';
        if($('gi')) $('gi').select();
    }
}

const P = C.pass;
if($('kl')) $('kl').textContent = P.kelas;
if($('dr')) $('dr').textContent = P.dari;
if($('ke')) $('ke').textContent = P.ke;
if($('inf')) {
    $('inf').innerHTML = [['PENUMPANG', C.dia], ['FLIGHT', P.flight], ['GATE', P.gate], ['SEAT', P.seat]]
        .map(x => `<div><small>${x[0]}</small><b>${x[1]}</b></div>`).join('');
}

const open = h => {
    if($('mb')) $('mb').innerHTML = h;
    if($('mod')) $('mod').classList.add('on');
};

function rip() {
    if (!ac) return;
    try {
        const l = ac.sampleRate * .7, b = ac.createBuffer(1, l, ac.sampleRate), d = b.getChannelData(0);
        for (let i = 0; i < l; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / l) * (Math.random() > .6 ? 1 : .2);
        const s = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
        f.type = 'highpass';
        f.frequency.value = 1800;
        g.gain.value = .5;
        s.buffer = b;
        s.connect(f);
        f.connect(g);
        g.connect(ac.destination);
        s.start();
    } catch(e) {}
}