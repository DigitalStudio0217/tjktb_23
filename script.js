/* ==========================================================================
   TJKT Smart Network - Interactive Search & Solution Engine + Geometry Dash
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    const categoryPills = document.querySelectorAll('.category-pills .pill');
    const layananCards = document.querySelectorAll('.layanan-card');
    const searchStatus = document.getElementById('searchStatus');
    const noResultsBox = document.getElementById('noResultsBox');
    const noResultsQuery = document.getElementById('noResultsQuery');
    const waNoResultsBtn = document.getElementById('waNoResultsBtn');
    
    // Modal Elements
    const solutionModal = document.getElementById('solutionModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalTag = document.getElementById('modalTag');
    const modalImage = document.getElementById('modalImage');
    const modalDescription = document.getElementById('modalDescription');
    const modalSteps = document.getElementById('modalSteps');
    const modalWaBtn = document.getElementById('modalWaBtn');
    const modalClose = document.getElementById('modalClose');

    // Database of detailed solutions for customer issues
    const detailedSolutions = {
        'Jaringan Komputer': {
            tag: 'Instalasi & Konfigurasi',
            tagClass: 'tag-blue',
            image: 'gambar jaringan kompuyter.jpeg',
            description: 'Layanan instalasi dan konfigurasi jaringan LAN, WLAN/Wi-Fi, serta setting router/switch untuk rumah, kantor, sekolah, dan tempat usaha Anda.',
            steps: [
                'Survei lokasi dan perencanaan topologi jaringan yang optimal.',
                'Pemasangan kabel UTP/STP & instalasi perangkat keras berkualitas.',
                'Konfigurasi router, IP Address, Bandwidth Management, & Subnetting.',
                'Pengujian stabilitas koneksi dan kecepatan secara menyeluruh.'
            ]
        },
        'Pemeliharaan Jaringan': {
            tag: 'Maintenance',
            tagClass: 'tag-green',
            image: 'gambar pemeliharaan komputer.jpeg',
            description: 'Perawatan berkala perangkat komputer dan infrastruktur jaringan untuk mencegah kerusakan, menekan risiko lemot, serta membasmi virus/malware.',
            steps: [
                'Pembersihan fisik & pengecekan suhu operasional perangkat.',
                'Scanning virus, ransomware, serta pembersihan file sampah (cache).',
                'Pembaruan firmware router, antivirus, dan sistem operasi.',
                'Monitoring trafik data untuk mencegah overload atau serangan malware.'
            ]
        },
        'Troubleshooting': {
            tag: 'Troubleshooting',
            tagClass: 'tag-orange',
            image: 'troubleshoot.jpeg',
            description: 'Solusi perbaikan cepat saat terjadi koneksi terputus, Wi-Fi tidak bisa terkoneksi, IP conflict, kabel rusak, atau masalah perangkat jaringan lainnya.',
            steps: [
                'Diagnosa tepat untuk menemukan titik masalah teknis.',
                'Perbaikan atau penggantian komponen jaringan yang bermasalah.',
                'Re-konfigurasi DNS, Gateway, atau Mikrotik jika terjadi bentrok IP.',
                'Verifikasi ulang hingga koneksi kembali 100% lancar dan normal.'
            ]
        },
        'Keamanan Jaringan': {
            tag: 'Keamanan',
            tagClass: 'tag-purple',
            image: 'keamanan jaringan.jpeg',
            description: 'Perlindungan sistem jaringan komputer dari ancaman peretasan (hacking), penyusup tak dikenal, kebocoran data, dan malware berbahaya.',
            steps: [
                'Pemasangan Firewall & Proteksi Akses Wi-Fi (WPA3 / MAC Filtering).',
                'Isolasi jaringan sensitif (VLAN) untuk keamanan data perusahaan.',
                'Audit celah keamanan pada sistem dan router secara berkala.',
                'Backup data otomatis & edukasi keamanan jaringan pengguna.'
            ]
        }
    };

    // 1. Perform Search Function
    function performSearch(queryStr) {
        const query = (queryStr || searchInput.value || '').trim().toLowerCase();
        let matchCount = 0;

        if (query.length > 0) {
            categoryPills.forEach(p => p.classList.remove('active'));
        }

        layananCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const text = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
            const keywords = card.getAttribute('data-keywords') || '';
            const tag = card.querySelector('.card-tag')?.textContent.toLowerCase() || '';

            if (!query || title.includes(query) || text.includes(query) || keywords.includes(query) || tag.includes(query)) {
                card.style.display = 'flex';
                matchCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (query.length > 0) {
            if (matchCount > 0) {
                searchStatus.innerHTML = `Menampilkan <strong>${matchCount}</strong> solusi terbaik untuk kata kunci "<em>${escapeHTML(query)}</em>"`;
                searchStatus.style.display = 'block';
                noResultsBox.style.display = 'none';
            } else {
                searchStatus.style.display = 'none';
                noResultsQuery.textContent = query;
                noResultsBox.style.display = 'block';

                const encodedQuery = encodeURIComponent(`Halo TJKT Smart Network, saya sedang mencari solusi untuk masalah: "${query}". Apakah bisa dibantu?`);
                waNoResultsBtn.href = `https://wa.me/62895322211425?text=${encodedQuery}`;
            }
        } else {
            searchStatus.style.display = 'none';
            noResultsBox.style.display = 'none';
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    if (searchInput) {
        searchInput.addEventListener('input', function () {
            performSearch(this.value);
        });

        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch(this.value);
                scrollToLayanan();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function () {
            performSearch(searchInput.value);
            scrollToLayanan();
        });
    }

    function scrollToLayanan() {
        const target = document.getElementById('layanan');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }

    categoryPills.forEach(pill => {
        pill.addEventListener('click', function (e) {
            e.preventDefault();
            categoryPills.forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            if (searchInput) searchInput.value = '';

            let matchCount = 0;
            layananCards.forEach(card => {
                const cardCat = card.getAttribute('data-category');
                if (category === 'all' || category === cardCat) {
                    card.style.display = 'flex';
                    matchCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            if (category !== 'all') {
                searchStatus.innerHTML = `Kategori: <strong>${this.textContent}</strong> (${matchCount} solusi)`;
                searchStatus.style.display = 'block';
            } else {
                searchStatus.style.display = 'none';
            }

            noResultsBox.style.display = 'none';
            scrollToLayanan();
        });
    });

    // Modal Handler
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const card = this.closest('.layanan-card');
            const title = card.querySelector('.card-title')?.textContent.trim();
            const data = detailedSolutions[title];

            if (data && solutionModal) {
                modalTitle.textContent = title;
                modalTag.textContent = data.tag;
                modalTag.className = `card-tag ${data.tagClass}`;
                modalImage.src = data.image;
                modalImage.alt = title;
                modalDescription.textContent = data.description;

                modalSteps.innerHTML = '';
                data.steps.forEach(step => {
                    const li = document.createElement('li');
                    li.textContent = step;
                    modalSteps.appendChild(li);
                });

                const waMessage = encodeURIComponent(`Halo TJKT Smart Network, saya ingin konsultasi mengenai layanan: *${title}* (${data.tag}). Mohon info selengkapnya.`);
                modalWaBtn.href = `https://wa.me/62895322211425?text=${waMessage}`;

                solutionModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        if (solutionModal) {
            solutionModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (solutionModal) {
        solutionModal.addEventListener('click', function (e) {
            if (e.target === solutionModal) closeModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeModal();
    });

    /* ==========================================================================
       GEOMETRY DASH MINI GAME ENGINE (TJKT SPECIAL EDITION)
       ========================================================================== */
    const canvas = document.getElementById('gdCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const gdProgressText = document.getElementById('gdProgressText');
    const gdProgressBar = document.getElementById('gdProgressBar');
    const gdStartOverlay = document.getElementById('gdStartOverlay');
    const gdGameOverOverlay = document.getElementById('gdGameOverOverlay');
    const gdWinOverlay = document.getElementById('gdWinOverlay');
    const gdFinalProgress = document.getElementById('gdFinalProgress');
    const gdStartBtn = document.getElementById('gdStartBtn');
    const gdRetryBtn = document.getElementById('gdRetryBtn');
    const gdPlayAgainBtn = document.getElementById('gdPlayAgainBtn');

    // Audio Synthesizer (Retro Web Audio API)
    let audioCtx = null;
    function playRetroSound(type) {
        try {
            if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            const now = audioCtx.currentTime;
            if (type === 'jump') {
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                osc.start(now);
                osc.stop(now + 0.12);
            } else if (type === 'crash') {
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(300, now);
                osc.frequency.linearRampToValueAtTime(40, now + 0.25);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === 'win') {
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.setValueAtTime(600, now + 0.1);
                osc.frequency.setValueAtTime(800, now + 0.2);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
                osc.start(now);
                osc.stop(now + 0.4);
            }
        } catch (e) {
            // Audio context not allowed or failed
        }
    }

    // Game Variables
    const GROUND_HEIGHT = 35;
    const GROUND_Y = canvas.height - GROUND_HEIGHT;
    const PLAYER_SIZE = 28;
    const TOTAL_LEVEL_DISTANCE = 2200; // Level length in px
    const GAME_SPEED = 5.2;

    let gameState = 'IDLE'; // 'IDLE', 'PLAYING', 'GAMEOVER', 'WON'
    let animFrameId = null;
    let distanceScrolled = 0;

    // Player
    let player = {
        x: 65,
        y: GROUND_Y - PLAYER_SIZE,
        vy: 0,
        gravity: 0.7,
        jumpPower: -11.5,
        rotation: 0,
        isGrounded: true
    };

    // Particles array for jump and death
    let particles = [];
    let confetti = [];

    // Obstacles Layout (Spikes & Blocks)
    // type: 'spike' (triangle) or 'block' (rectangle)
    const levelObstaclesMaster = [
        { x: 450, type: 'spike' },
        { x: 700, type: 'spike' },
        { x: 950, type: 'block', w: 32, h: 30 },
        { x: 950, type: 'spikeOnBlock', w: 32, h: 30 },
        { x: 1200, type: 'spike' },
        { x: 1360, type: 'spike' },
        { x: 1550, type: 'block', w: 50, h: 25 },
        { x: 1750, type: 'spike' },
        { x: 1900, type: 'spike' },
        { x: 2050, type: 'spike' }
    ];

    let obstacles = [];

    function resetGame() {
        distanceScrolled = 0;
        player.y = GROUND_Y - PLAYER_SIZE;
        player.vy = 0;
        player.rotation = 0;
        player.isGrounded = true;
        particles = [];
        confetti = [];

        // Deep copy obstacles
        obstacles = levelObstaclesMaster.map(o => ({ ...o, hit: false }));

        if (gdProgressText) gdProgressText.textContent = '0%';
        if (gdProgressBar) gdProgressBar.style.width = '0%';
    }

    function jump() {
        if (gameState !== 'PLAYING') return;
        if (player.isGrounded) {
            player.vy = player.jumpPower;
            player.isGrounded = false;
            playRetroSound('jump');

            // Jump particles
            for (let i = 0; i < 6; i++) {
                particles.push({
                    x: player.x + PLAYER_SIZE / 2,
                    y: player.y + PLAYER_SIZE,
                    vx: (Math.random() - 0.5) * 4,
                    vy: Math.random() * 2,
                    size: Math.random() * 4 + 2,
                    color: '#38bdf8',
                    life: 1
                });
            }
        }
    }

    // Input handlers
    canvas.addEventListener('mousedown', function (e) {
        e.preventDefault();
        jump();
    });

    canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        jump();
    });

    document.addEventListener('keydown', function (e) {
        if (e.code === 'Space' || e.code === 'ArrowUp') {
            if (gameState === 'PLAYING') {
                e.preventDefault();
                jump();
            }
        }
    });

    function createConfetti() {
        const colors = ['#38bdf8', '#22c55e', '#f59e0b', '#ec4899', '#8b5cf6'];
        for (let i = 0; i < 60; i++) {
            confetti.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                vx: (Math.random() - 0.5) * 3,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 6 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * 360
            });
        }
    }

    function triggerGameOver() {
        gameState = 'GAMEOVER';
        playRetroSound('crash');
        const progress = Math.min(100, Math.floor((distanceScrolled / TOTAL_LEVEL_DISTANCE) * 100));
        if (gdFinalProgress) gdFinalProgress.textContent = `${progress}%`;
        if (gdGameOverOverlay) gdGameOverOverlay.style.display = 'flex';
    }

    function triggerVictory() {
        gameState = 'WON';
        playRetroSound('win');
        createConfetti();
        if (gdProgressText) gdProgressText.textContent = '100%';
        if (gdProgressBar) gdProgressBar.style.width = '100%';
        if (gdWinOverlay) gdWinOverlay.style.display = 'flex';
    }

    // Main Game Loop
    function gameLoop() {
        if (gameState !== 'PLAYING' && gameState !== 'WON') return;

        // Clear canvas
        ctx.fillStyle = '#091329';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Animated Background Grid
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
        ctx.lineWidth = 1;
        const gridOffset = (distanceScrolled * 0.5) % 30;
        for (let x = -gridOffset; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, GROUND_Y);
            ctx.stroke();
        }

        // 1. Update Physics
        if (gameState === 'PLAYING') {
            distanceScrolled += GAME_SPEED;
            player.vy += player.gravity;
            player.y += player.vy;

            // Ground Collision
            if (player.y >= GROUND_Y - PLAYER_SIZE) {
                player.y = GROUND_Y - PLAYER_SIZE;
                player.vy = 0;
                player.isGrounded = true;
                player.rotation = Math.round(player.rotation / (Math.PI / 2)) * (Math.PI / 2);
            } else {
                player.rotation += 0.15; // Air spin
            }

            // Update Progress UI
            const progressPct = Math.min(100, Math.floor((distanceScrolled / TOTAL_LEVEL_DISTANCE) * 100));
            if (gdProgressText) gdProgressText.textContent = `${progressPct}%`;
            if (gdProgressBar) gdProgressBar.style.width = `${progressPct}%`;

            // Check Victory
            if (distanceScrolled >= TOTAL_LEVEL_DISTANCE) {
                triggerVictory();
            }
        }

        // 2. Draw Ground
        ctx.fillStyle = '#0d255c';
        ctx.fillRect(0, GROUND_Y, canvas.width, GROUND_HEIGHT);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, GROUND_Y);
        ctx.lineTo(canvas.width, GROUND_Y);
        ctx.stroke();

        // 3. Draw & Test Obstacles
        obstacles.forEach(obs => {
            const obsScreenX = obs.x - distanceScrolled;

            // Render only if on screen
            if (obsScreenX > -60 && obsScreenX < canvas.width + 60) {
                if (obs.type === 'spike') {
                    // Triangle Spike
                    const spikeW = 26;
                    const spikeH = 30;
                    const spikeY = GROUND_Y;

                    ctx.fillStyle = '#ef4444';
                    ctx.strokeStyle = '#f87171';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(obsScreenX, spikeY);
                    ctx.lineTo(obsScreenX + spikeW / 2, spikeY - spikeH);
                    ctx.lineTo(obsScreenX + spikeW, spikeY);
                    ctx.closePath();
                    ctx.fill();
                    ctx.stroke();

                    // Collision Detection (Hitbox)
                    if (gameState === 'PLAYING') {
                        const px = player.x + 4;
                        const py = player.y + 4;
                        const pw = PLAYER_SIZE - 8;
                        const ph = PLAYER_SIZE - 8;

                        if (px < obsScreenX + spikeW && px + pw > obsScreenX && py + ph > spikeY - spikeH) {
                            triggerGameOver();
                        }
                    }
                } else if (obs.type === 'block') {
                    // Rectangle Block
                    const blockW = obs.w || 32;
                    const blockH = obs.h || 30;
                    const blockY = GROUND_Y - blockH;

                    ctx.fillStyle = '#3b82f6';
                    ctx.strokeStyle = '#60a5fa';
                    ctx.lineWidth = 2;
                    ctx.fillRect(obsScreenX, blockY, blockW, blockH);
                    ctx.strokeRect(obsScreenX, blockY, blockW, blockH);

                    // Block Collision (Side hit = dead, Top hit = land)
                    if (gameState === 'PLAYING') {
                        const px = player.x;
                        const py = player.y;
                        const pw = PLAYER_SIZE;
                        const ph = PLAYER_SIZE;

                        if (px < obsScreenX + blockW && px + pw > obsScreenX) {
                            // Check top landing
                            if (py + ph >= blockY && py + ph <= blockY + 12 && player.vy >= 0) {
                                player.y = blockY - ph;
                                player.vy = 0;
                                player.isGrounded = true;
                            } else if (py + ph > blockY + 8) {
                                triggerGameOver();
                            }
                        }
                    }
                }
            }
        });

        // 4. Draw Player (Glowing Geometry Cube)
        ctx.save();
        ctx.translate(player.x + PLAYER_SIZE / 2, player.y + PLAYER_SIZE / 2);
        ctx.rotate(player.rotation);

        // Cube Fill & Glow
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-PLAYER_SIZE / 2, -PLAYER_SIZE / 2, PLAYER_SIZE, PLAYER_SIZE);

        // Inner Face Details
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-6, -6, 4, 4);
        ctx.fillRect(2, -6, 4, 4);
        ctx.fillRect(-5, 3, 10, 2);

        ctx.restore();

        // 5. Draw Particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.04;

            if (p.life <= 0) {
                particles.splice(i, 1);
            } else {
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.life;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                ctx.globalAlpha = 1.0;
            }
        }

        // 6. Draw Victory Confetti if WON
        if (gameState === 'WON') {
            for (let i = 0; i < confetti.length; i++) {
                let c = confetti[i];
                c.x += c.vx;
                c.y += c.vy;
                c.rotation += 5;

                ctx.save();
                ctx.translate(c.x, c.y);
                ctx.rotate((c.rotation * Math.PI) / 180);
                ctx.fillStyle = c.color;
                ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size / 2);
                ctx.restore();
            }
        }

        animFrameId = requestAnimationFrame(gameLoop);
    }

    // Start Game Button Handlers
    function startGame() {
        resetGame();
        gameState = 'PLAYING';
        if (gdStartOverlay) gdStartOverlay.style.display = 'none';
        if (gdGameOverOverlay) gdGameOverOverlay.style.display = 'none';
        if (gdWinOverlay) gdWinOverlay.style.display = 'none';
        
        cancelAnimationFrame(animFrameId);
        gameLoop();
    }

    if (gdStartBtn) gdStartBtn.addEventListener('click', startGame);
    if (gdRetryBtn) gdRetryBtn.addEventListener('click', startGame);
    if (gdPlayAgainBtn) gdPlayAgainBtn.addEventListener('click', startGame);

    // Initial canvas render frame
    ctx.fillStyle = '#091329';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0d255c';
    ctx.fillRect(0, GROUND_Y, canvas.width, GROUND_HEIGHT);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, GROUND_Y);
    ctx.lineTo(canvas.width, GROUND_Y);
    ctx.stroke();

    // Draw initial idle player
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(player.x, GROUND_Y - PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE);
    ctx.strokeStyle = '#ffffff';
    ctx.strokeRect(player.x, GROUND_Y - PLAYER_SIZE, PLAYER_SIZE, PLAYER_SIZE);

    /* ==========================================================================
       LOCATION WI-FI SELECTOR & DISTANCE-BASED PRICING ENGINE
       ========================================================================== */
    const locTabs = document.querySelectorAll('.loc-tab');
    const locTitle = document.getElementById('locTitle');
    const locDesc = document.getElementById('locDesc');
    const locFeatures = document.getElementById('locFeatures');
    const locOldPrice = document.getElementById('locOldPrice');
    const locPrice = document.getElementById('locPrice');
    const locWaOrderBtn = document.getElementById('locWaOrderBtn');

    // Base prices for package types (Surakarta / Solo HQ = Base 0 Surcharge)
    const packageBasePrices = {
        'rumah': { base: 150000, oldBase: 300000 },
        'kantor': { base: 250000, oldBase: 500000 },
        'sekolah': { base: 300000, oldBase: 600000 },
        'cafe': { base: 200000, oldBase: 400000 }
    };

    // Distance Surcharge Dictionary per City (Base HQ: Surakarta / Solo)
    const cityDistanceConfig = {
        'Surakarta / Solo': { surcharge: 0, tag: 'HQ Solo (Bebas Biaya Jarak)' },
        'Yogyakarta': { surcharge: 25000, tag: '~60 km (Zona 1 JATENG)' },
        'Semarang': { surcharge: 40000, tag: '~100 km (Zona 1 JATENG)' },
        'Surabaya': { surcharge: 75000, tag: '~260 km (Zona 2 JATIM)' },
        'Bandung': { surcharge: 100000, tag: '~450 km (Zona 2 JABAR)' },
        'Jakarta': { surcharge: 125000, tag: '~550 km (Zona 3 Jabodetabek)' },
        'Denpasar / Bali': { surcharge: 150000, tag: '~650 km (Zona 3 Bali)' },
        'Medan': { surcharge: 200000, tag: '~1.800 km (Zona 4 Sumatra)' },
        'Makassar': { surcharge: 225000, tag: '~1.400 km (Zona 4 Sulawesi)' },
        'Kota Lainnya': { surcharge: 250000, tag: 'Zona Ekspedisi Nasional' }
    };

    const locationWifiData = {
        'rumah': {
            title: 'Pemasangan Wi-Fi Paket Rumah & Kos',
            desc: 'Sangat ideal untuk hunian pribadi, kamar kos, dan rumah keluarga. Jangkauan sinyal Wi-Fi luas dan stabil untuk streaming 4K, WFH, dan gaming.',
            features: [
                '✅ Kecepatan s.d 30-50 Mbps Unlimited (Tanpa Batas Kuota)',
                '✅ Gratis Setting Wi-Fi Router Dual-Band High Power',
                '✅ Garansi Maintenance & Pemasangan Kabel Rapih'
            ]
        },
        'kantor': {
            title: 'Pemasangan Wi-Fi & LAN Paket Kantor / Bisnis',
            desc: 'Didesain khusus untuk kebutuhan perusahaan, kantor perbankan, dan co-working space dengan prioritas trafik data, Mikrotik Bandwidth Management, & VLAN.',
            features: [
                '✅ Kecepatan s.d 100-200 Mbps Dedicated / High Speed',
                '✅ Mikrotik Router & Managed Switch Configuration',
                '✅ Firewall Protection & Isolasi Jaringan Keuangan'
            ]
        },
        'sekolah': {
            title: 'Pemasangan Wi-Fi Paket Sekolah & Kampus',
            desc: 'Solusi jaringan kapasitas besar untuk lab komputer sekolah, ruang guru, dan gedung perkuliahan agar ratusan siswa dapat terkoneksi secara lancar.',
            features: [
                '✅ Multi Access Point Wi-Fi Roaming Support',
                '✅ Load Balancing & Safe Search Filtering untuk Siswa',
                '✅ Garansi & Pendampingan Teknisi Sertifikasi TJKT'
            ]
        },
        'cafe': {
            title: 'Pemasangan Wi-Fi Paket Cafe & Tempat Usaha',
            desc: 'Tingkatkan kenyamanan pengunjung warung, cafe, minimarket, atau resto Anda dengan halaman Login Hotspot Custom bertema brand usaha Anda.',
            features: [
                '✅ Portal Login Captive Portal (Bisa Pasang Logo Cafe)',
                '✅ Pembatasan Kecepatan per Pengunjung (Agar Wi-Fi Adil)',
                '✅ Anti Lemot & Tahan Hingga 50+ Perangkat bersamaan'
            ]
        }
    };

    let currentCity = 'Surakarta / Solo';
    const citySelect = document.getElementById('citySelect');
    const cityStatusBadge = document.getElementById('cityStatusBadge');
    const btnCityPills = document.querySelectorAll('.btn-city-pill');
    const btnCityCards = document.querySelectorAll('.btn-city-card');

    function formatRupiah(number) {
        return 'Rp ' + number.toLocaleString('id-ID');
    }

    function updateCitySelection(cityName) {
        currentCity = cityName;
        const cityConfig = cityDistanceConfig[cityName] || { surcharge: 150000, tag: 'Zona Jarak Jauh' };

        if (citySelect) {
            citySelect.value = cityName;
        }

        if (cityStatusBadge) {
            const distanceNote = cityConfig.surcharge > 0 ? ` (+ Transport Jarak ${formatRupiah(cityConfig.surcharge)})` : ' (HQ Utama)';
            cityStatusBadge.innerHTML = `✅ ${cityName} Terjangkau Teknisi <small style="opacity:0.85;">${distanceNote}</small>`;
        }

        btnCityCards.forEach(card => {
            if (card.getAttribute('data-city') === cityName) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        btnCityPills.forEach(btn => {
            if (btn.getAttribute('data-city') === cityName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const activeTab = document.querySelector('.loc-tab.active');
        const locKey = activeTab ? activeTab.getAttribute('data-loc') : 'rumah';
        updateOrderLink(locKey);
    }

    function updateAllCityCardPriceTags() {
        const basePrice = selectedService ? selectedService.basePrice : 150000;
        btnCityCards.forEach(card => {
            const surcharge = parseInt(card.getAttribute('data-surcharge') || '0', 10);
            const totalForCity = basePrice + surcharge;
            const priceTag = card.querySelector('.city-card-price-tag');
            if (priceTag) {
                priceTag.textContent = formatRupiah(totalForCity);
            }
        });
    }

    btnCityCards.forEach(card => {
        card.addEventListener('click', function () {
            const city = this.getAttribute('data-city');
            updateCitySelection(city);
        });
    });

    // Service Selection & Domicile Distance Pricing Engine State
    let selectedService = {
        id: 'instalasi',
        name: 'Instalasi & Konfigurasi Jaringan',
        basePrice: 150000,
        oldPrice: 300000
    };

    const btnSelectServices = document.querySelectorAll('.btn-select-service');
    const serviceSelectedBanner = document.getElementById('serviceSelectedBanner');
    const bannerServiceName = document.getElementById('bannerServiceName');
    const bannerServicePrice = document.getElementById('bannerServicePrice');
    const pilihDomisiliBox = document.getElementById('pilih-domisili-box');

    btnSelectServices.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const serviceId = this.getAttribute('data-service-id');
            const serviceName = this.getAttribute('data-service-name');
            const basePrice = parseInt(this.getAttribute('data-base-price') || '150000', 10);
            const oldPrice = parseInt(this.getAttribute('data-old-price') || '300000', 10);

            selectedService = {
                id: serviceId,
                name: serviceName,
                basePrice: basePrice,
                oldPrice: oldPrice
            };

            // Update Selected Service Banner
            if (serviceSelectedBanner && bannerServiceName && bannerServicePrice) {
                bannerServiceName.textContent = serviceName;
                bannerServicePrice.textContent = `Base Harga: ${formatRupiah(basePrice)}`;
                serviceSelectedBanner.style.display = 'flex';
                serviceSelectedBanner.classList.add('banner-pulse');
            }

            // Update Price Tags on All Indonesian City Cards Grid
            updateAllCityCardPriceTags();

            // Smooth Scroll to Domicile / City Selector Box
            if (pilihDomisiliBox) {
                pilihDomisiliBox.scrollIntoView({ behavior: 'smooth', block: 'start' });

                // Highlight pulse animation on city selector
                const citySelectorBox = document.querySelector('.city-selector-box');
                if (citySelectorBox) {
                    citySelectorBox.classList.add('city-box-highlight');
                    setTimeout(() => {
                        citySelectorBox.classList.remove('city-box-highlight');
                    }, 2500);
                }
            }

            // Recalculate Total Price based on selected service + domicile distance
            const activeTab = document.querySelector('.loc-tab.active');
            const locKey = activeTab ? activeTab.getAttribute('data-loc') : 'rumah';
            updateOrderLink(locKey);
        });
    });

    function buildAestheticWaReceipt(serviceName, cityName, cityTag, basePrice, surcharge, totalPrice) {
        const today = new Date();
        const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const timeStr = today.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
        const randomInvoiceNum = 'INV-TJKT-' + today.getFullYear() + String(today.getMonth()+1).padStart(2,'0') + String(today.getDate()).padStart(2,'0') + '-' + Math.floor(1000 + Math.random() * 9000);

        const formattedBase = formatRupiah(basePrice);
        const formattedSurcharge = surcharge > 0 ? formatRupiah(surcharge) : 'Rp 0 (Bebas Transport)';
        const formattedTotal = formatRupiah(totalPrice);

        const lines = [
            "---------------------------------------",
            "🧾 *FORMULIR KUITANSI PEMBAYARAN LUNAS*",
            "🌐 *TJKT SMART NETWORK INDONESIA*",
            "---------------------------------------",
            "",
            "*STATUS TRANSAKSI:* ✅ *LUNAS (VERIFIED)*",
            "*NO. REFERENSI:* `" + randomInvoiceNum + "`",
            "*TANGGAL & WAKTU:* `" + dateStr + " | " + timeStr + "`",
            "",
            "📋 *DETAIL PESANAN LAYANAN:*",
            "• Jenis Layanan: *" + serviceName + "*",
            "• Wilayah Domisili: 📍 *" + cityName + "* (" + cityTag + ")",
            "• Homebase Teknisi: *SMKN 2 Surakarta*",
            "",
            "💳 *RINCIAN BIAYA PEMBAYARAN:*",
            "• Base Biaya Layanan: " + formattedBase,
            "• Biaya Transport Jarak: " + formattedSurcharge,
            "---------------------------------------",
            "💰 *TOTAL DIBAYAR LUNAS: " + formattedTotal + "*",
            "---------------------------------------",
            "",
            "🏦 *METODE PEMBAYARAN RESMI:*",
            "• QRIS GPN Standar Pembayaran Nasional",
            "• Merchant Name: *FARELZZ STORE 21 OK2150807*",
            "• NMID: *ID2024361841644*",
            "",
            "Mohon tim teknisi TJKT Smart Network dapat segera mengonfirmasi jadwal kedatangan ke lokasi domisili saya. Terima kasih! 🙏",
            "",
            "_TJKT Smart Network - Solusi Jaringan Terpercaya_"
        ];

        return lines.join('\n');
    }

    function updateOrderLink(locKey) {
        const data = locationWifiData[locKey];
        const baseInfo = packageBasePrices[locKey] || { base: 150000, oldBase: 300000 };
        const cityConfig = cityDistanceConfig[currentCity] || { surcharge: 150000, tag: 'Zona Jarak Jauh' };

        // Use selected service base price if customer picked a specific service card, else fallback to loc package base
        const activeBasePrice = selectedService ? selectedService.basePrice : baseInfo.base;
        const activeOldPrice = selectedService ? selectedService.oldPrice : baseInfo.oldBase;
        const activeServiceName = selectedService ? selectedService.name : (data ? data.title : 'Pemasangan Wi-Fi');

        const calculatedPrice = activeBasePrice + cityConfig.surcharge;
        const calculatedOldPrice = activeOldPrice + Math.floor(cityConfig.surcharge * 1.5);

        const formattedPrice = formatRupiah(calculatedPrice);
        const formattedOldPrice = formatRupiah(calculatedOldPrice);

        if (locPrice) locPrice.textContent = formattedPrice;
        if (locOldPrice) locOldPrice.textContent = formattedOldPrice;

        if (locWaOrderBtn) {
            const customWaMessage = `Halo TJKT Smart Network, saya memilih layanan: *[${activeServiceName}]* untuk domisili area: *${currentCity}* (${cityConfig.tag}). Base Harga: ${formatRupiah(activeBasePrice)} + Biaya Transport Jarak Domisili: ${formatRupiah(cityConfig.surcharge)}. Total Biaya: *${formattedPrice}*. Mohon konfirmasi jadwal kedatangan teknisi.`;
            locWaOrderBtn.href = `https://api.whatsapp.com/send?phone=62895322211425&text=${encodeURIComponent(customWaMessage)}`;
        }

        // Real-time synchronization for Section Pembayaran QRIS (disebelah kontak)
        const secPayServiceName = document.getElementById('secPayServiceName');
        const secPayCityName = document.getElementById('secPayCityName');
        const secPayBasePrice = document.getElementById('secPayBasePrice');
        const secPaySurcharge = document.getElementById('secPaySurcharge');
        const secPayTotalAmount = document.getElementById('secPayTotalAmount');

        if (secPayServiceName) secPayServiceName.textContent = activeServiceName;
        if (secPayCityName) secPayCityName.textContent = `${currentCity} (${cityConfig.tag})`;
        if (secPayBasePrice) secPayBasePrice.textContent = formatRupiah(activeBasePrice);
        if (secPaySurcharge) secPaySurcharge.textContent = cityConfig.surcharge > 0 ? formatRupiah(cityConfig.surcharge) : 'Rp 0 (Bebas Transport)';
        if (secPayTotalAmount) secPayTotalAmount.textContent = formattedPrice;

        // Build High-End Aesthetic WhatsApp Digital Receipt URL
        const waProofText = buildAestheticWaReceipt(activeServiceName, currentCity, cityConfig.tag, activeBasePrice, cityConfig.surcharge, calculatedPrice);
        const waAppUrl = `https://api.whatsapp.com/send?phone=62895322211425&text=${encodeURIComponent(waProofText)}`;
        currentOrderWaUrl = waAppUrl;

        // Update direct native anchor links for 100% reliable WhatsApp App launching
        const btnConfirmQrisPaid = document.getElementById('btnConfirmQrisPaid');
        const btnSecConfirmPaid = document.getElementById('btnSecConfirmPaid');
        if (btnConfirmQrisPaid) btnConfirmQrisPaid.href = waAppUrl;
        if (btnSecConfirmPaid) btnSecConfirmPaid.href = waAppUrl;

        // Render Canvas on section QRIS card
        drawQrisCanvasToId('secQrisCanvas');
    }

    /* ==========================================================================
       QRIS PAYMENT MODAL & AUTOMATIC WHATSAPP REDIRECT ENGINE
       ========================================================================== */
    const qrisModal = document.getElementById('qrisModal');
    const qrisModalClose = document.getElementById('qrisModalClose');
    const btnOpenQrisModal = document.getElementById('btnOpenQrisModal');
    const btnConfirmQrisPaid = document.getElementById('btnConfirmQrisPaid');

    const qrisServiceName = document.getElementById('qrisServiceName');
    const qrisCityName = document.getElementById('qrisCityName');
    const qrisTotalPrice = document.getElementById('qrisTotalPrice');

    const qrisSuccessModal = document.getElementById('qrisSuccessModal');
    const successTotalAmount = document.getElementById('successTotalAmount');
    const countdownSec = document.getElementById('countdownSec');
    const btnDirectToWa = document.getElementById('btnDirectToWa');

    let currentOrderWaUrl = '';

    function drawQrisCanvasToId(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Check if sibling image is loaded and visible
        const imgSibling = canvas.parentElement ? canvas.parentElement.querySelector('img.qris-barcode-img') : null;
        if (imgSibling && imgSibling.complete && imgSibling.naturalWidth > 0 && imgSibling.style.display !== 'none') {
            canvas.style.display = 'none';
            return;
        }

        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        ctx.clearRect(0, 0, size, size);

        // White background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        // Standard QR code matrix pattern simulation for FARELZZ STORE 21
        ctx.fillStyle = '#000000';
        const modules = 25;
        const cellSize = Math.floor(size / modules);
        const padding = Math.floor((size - (modules * cellSize)) / 2);

        // Seeded QR Pattern Grid
        const qrGrid = [
            [1,1,1,1,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,1,0,0,1,0,1,1,0,1,0,0,0,1,0,0,0,0,0,1],
            [1,0,1,1,1,0,1,0,1,0,1,0,0,1,0,1,0,0,1,0,1,1,1,0,1],
            [1,0,1,1,1,0,1,0,0,1,1,0,1,0,1,1,1,0,1,0,1,1,1,0,1],
            [1,0,1,1,1,0,1,0,1,1,0,1,0,1,0,0,1,0,1,0,1,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,1,1,1,0,0,0,1,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
            [0,0,0,0,0,0,0,0,1,1,0,1,0,1,0,1,1,0,0,0,0,0,0,0,0],
            [1,0,1,1,0,0,1,1,0,1,0,0,1,1,1,0,0,1,1,0,1,1,0,1,0],
            [0,1,0,1,1,0,0,1,1,0,1,1,0,1,0,1,0,1,0,1,0,1,1,0,1],
            [1,1,1,0,0,1,1,0,1,1,0,1,1,0,1,0,1,0,1,1,1,0,0,1,1],
            [0,0,0,1,1,0,0,1,0,0,1,1,0,1,0,1,1,1,0,0,0,1,1,0,0],
            [1,1,0,0,1,1,1,0,1,1,0,0,1,0,1,0,0,1,1,1,0,0,1,1,0],
            [0,1,1,1,0,0,0,1,0,1,1,0,1,1,0,1,1,0,0,0,1,1,1,0,1],
            [1,0,0,1,1,1,1,0,1,0,0,1,0,0,1,0,1,1,1,1,0,0,1,1,0],
            [0,0,0,0,0,0,0,0,1,1,0,1,1,1,0,1,0,1,0,0,1,0,1,0,1],
            [1,1,1,1,1,1,1,0,0,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0],
            [1,0,0,0,0,0,1,0,1,0,1,0,1,0,0,1,0,1,0,1,1,0,1,1,1],
            [1,0,1,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,0,0,1,0,1,0],
            [1,0,1,1,1,0,1,0,0,0,1,1,1,0,0,1,0,1,0,1,1,0,1,0,1],
            [1,0,1,1,1,0,1,0,1,1,0,0,0,1,1,0,1,0,1,0,1,1,0,1,0],
            [1,0,0,0,0,0,1,0,0,1,1,1,0,1,0,1,0,1,0,0,1,1,1,0,1],
            [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,1,1,1,0,0,1,0]
        ];

        for (let r = 0; r < qrGrid.length; r++) {
            for (let c = 0; c < qrGrid[r].length; c++) {
                if (qrGrid[r][c] === 1) {
                    ctx.fillRect(padding + (c * cellSize), padding + (r * cellSize), cellSize, cellSize);
                }
            }
        }
    }

    function drawQrisCanvas() {
        drawQrisCanvasToId('qrisCanvasBarcode');
        drawQrisCanvasToId('secQrisCanvas');
    }

    function redirectToPaymentSection() {
        const sectionPembayaran = document.getElementById('pembayaran');
        if (sectionPembayaran) {
            sectionPembayaran.scrollIntoView({ behavior: 'smooth', block: 'start' });

            const payBox = sectionPembayaran.querySelector('.pembayaran-box');
            if (payBox) {
                payBox.classList.add('pay-box-highlight');
                setTimeout(() => {
                    payBox.classList.remove('pay-box-highlight');
                }, 2500);
            }
        }
        // Ensure QRIS barcode canvas is refreshed
        drawQrisCanvas();
    }

    function openQrisPaymentModal() {
        // Smooth scroll to Section Pembayaran QRIS first
        redirectToPaymentSection();

        const activeTab = document.querySelector('.loc-tab.active');
        const locKey = activeTab ? activeTab.getAttribute('data-loc') : 'rumah';
        const data = locationWifiData[locKey];
        const baseInfo = packageBasePrices[locKey] || { base: 150000, oldBase: 300000 };
        const cityConfig = cityDistanceConfig[currentCity] || { surcharge: 150000, tag: 'Zona Jarak Jauh' };

        const activeBasePrice = selectedService ? selectedService.basePrice : baseInfo.base;
        const activeServiceName = selectedService ? selectedService.name : (data ? data.title : 'Pemasangan Wi-Fi');
        const calculatedPrice = activeBasePrice + cityConfig.surcharge;
        const formattedPrice = formatRupiah(calculatedPrice);

        if (qrisServiceName) qrisServiceName.textContent = activeServiceName;
        if (qrisCityName) qrisCityName.textContent = `${currentCity} (${cityConfig.tag})`;
        if (qrisTotalPrice) qrisTotalPrice.textContent = formattedPrice;

        // Build WhatsApp payment proof URL
        const waProofText = `Halo TJKT Smart Network, BUKTI PEMBAYARAN LUNAS (STATUS: VERIFIED SUCCESS!)\n\n` +
            `📌 Layanan: *${activeServiceName}*\n` +
            `📍 Domisili: *${currentCity}* (${cityConfig.tag})\n` +
            `💳 Merchant: *FARELZZ STORE 21 OK2150807*\n` +
            `💰 Base Harga: ${formatRupiah(activeBasePrice)}\n` +
            `🚘 Transport Jarak: ${formatRupiah(cityConfig.surcharge)}\n` +
            `✅ TOTAL LUNAS: *${formattedPrice}*\n\n` +
            `Mohon segera jadwalkan kedatangan teknisi ke lokasi domisili saya. Terima kasih!`;

        currentOrderWaUrl = `https://wa.me/62895322211425?text=${encodeURIComponent(waProofText)}`;
    }

    if (btnOpenQrisModal) btnOpenQrisModal.addEventListener('click', redirectToPaymentSection);
    
    const locPriceEl = document.getElementById('locPrice');
    const priceDisplayClickable = document.getElementById('priceDisplayClickable');
    if (locPriceEl) locPriceEl.addEventListener('click', redirectToPaymentSection);
    if (priceDisplayClickable) priceDisplayClickable.addEventListener('click', redirectToPaymentSection);

    // Make ALL nominal price displays across the site redirect to Menu Pembayaran when clicked!
    document.querySelectorAll('.price-amount, .city-card-price-tag, .loc-price-box, #bannerServicePrice, .price-display').forEach(el => {
        el.style.cursor = 'pointer';
        el.title = 'Klik nominal ini untuk masuk ke Menu Pembayaran QRIS 💳';
        el.addEventListener('click', function(e) {
            redirectToPaymentSection();
        });
    });

    if (qrisModalClose) {
        qrisModalClose.addEventListener('click', function () {
            if (qrisModal) qrisModal.style.display = 'none';
        });
    }

    // Handle audio sound chime when customer clicks Saya Sudah Bayar link
    function onSayaSudahBayarClick() {
        playWinSound();
        if (qrisModal) qrisModal.style.display = 'none';
    }

    if (btnConfirmQrisPaid) {
        btnConfirmQrisPaid.addEventListener('click', onSayaSudahBayarClick);
    }

    const btnSecConfirmPaid = document.getElementById('btnSecConfirmPaid');
    if (btnSecConfirmPaid) {
        btnSecConfirmPaid.addEventListener('click', onSayaSudahBayarClick);
    }

    // Process payment verification & DIRECT NATIVE WHATSAPP APP LAUNCH
    function processPaymentSuccess() {
        const activeTab = document.querySelector('.loc-tab.active');
        const locKey = activeTab ? activeTab.getAttribute('data-loc') : 'rumah';
        const data = locationWifiData[locKey];
        const baseInfo = packageBasePrices[locKey] || { base: 150000, oldBase: 300000 };
        const cityConfig = cityDistanceConfig[currentCity] || { surcharge: 150000, tag: 'Zona Jarak Jauh' };
        const activeBasePrice = selectedService ? selectedService.basePrice : baseInfo.base;
        const activeServiceName = selectedService ? selectedService.name : (data ? data.title : 'Pemasangan Wi-Fi');
        const calculatedPrice = activeBasePrice + cityConfig.surcharge;
        const formattedPrice = formatRupiah(calculatedPrice);

        // Build High-End Aesthetic WhatsApp Digital Receipt URL
        const waProofText = buildAestheticWaReceipt(activeServiceName, currentCity, cityConfig.tag, activeBasePrice, cityConfig.surcharge, calculatedPrice);
        const waAppUrl = `https://wa.me/62895322211425?text=${encodeURIComponent(waProofText)}`;
        currentOrderWaUrl = waAppUrl;

        if (successTotalAmount) successTotalAmount.textContent = formattedPrice;
        if (btnDirectToWa) btnDirectToWa.href = currentOrderWaUrl;

        // Play Success Audio Chime
        playWinSound();

        // Open Success Notification Modal
        if (qrisSuccessModal) qrisSuccessModal.style.display = 'flex';

        // DIRECT LAUNCH INTO WHATSAPP APP IMMEDIATELY (Bypasses popup blockers)
        setTimeout(() => {
            window.location.href = waAppUrl;
        }, 150);
    }

    if (citySelect) {
        citySelect.addEventListener('change', function () {
            updateCitySelection(this.value);
        });
    }

    btnCityPills.forEach(btn => {
        btn.addEventListener('click', function () {
            const city = this.getAttribute('data-city');
            updateCitySelection(city);
        });
    });

    locTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            locTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const locKey = this.getAttribute('data-loc');
            const data = locationWifiData[locKey];

            if (data && locTitle && locDesc && locFeatures && locPrice && locWaOrderBtn) {
                locTitle.textContent = data.title;
                locDesc.textContent = data.desc;

                locFeatures.innerHTML = '';
                data.features.forEach(feat => {
                    const li = document.createElement('li');
                    li.textContent = feat;
                    locFeatures.appendChild(li);
                });

                updateOrderLink(locKey);
            }
        });
    });

    /* ==========================================================================
       ARCADE GAME TAB SWITCHER & QUIZ SHOOTER ENGINE (DISKON 25% / 35% / 50%)
       ========================================================================== */
    const arcadeTabs = document.querySelectorAll('.arcade-tab');
    const gdGameView = document.getElementById('gdGameView');
    const shooterGameView = document.getElementById('shooterGameView');

    arcadeTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            arcadeTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            const gameType = this.getAttribute('data-game');
            if (gameType === 'gd') {
                if (gdGameView) gdGameView.style.display = 'block';
                if (shooterGameView) shooterGameView.style.display = 'none';
            } else if (gameType === 'shooter') {
                if (gdGameView) gdGameView.style.display = 'none';
                if (shooterGameView) shooterGameView.style.display = 'block';
                initShooterGame();
            }
        });
    });

    // Quiz Shooter Variables & Elements
    const shooterCanvas = document.getElementById('shooterCanvas');
    if (!shooterCanvas) return;
    const shooterCtx = shooterCanvas.getContext('2d');

    const shooterScoreEl = document.getElementById('shooterScore');
    const shooterLivesEl = document.getElementById('shooterLives');
    const shooterQNum = document.getElementById('shooterQNum');
    const shooterQText = document.getElementById('shooterQText');
    const shooterStartOverlay = document.getElementById('shooterStartOverlay');
    const shooterGameOverOverlay = document.getElementById('shooterGameOverOverlay');
    const shooterWinOverlay = document.getElementById('shooterWinOverlay');
    const shooterFinalScore = document.getElementById('shooterFinalScore');
    const shooterStartBtn = document.getElementById('shooterStartBtn');
    const shooterRetryBtn = document.getElementById('shooterRetryBtn');
    const shooterPlayAgainBtn = document.getElementById('shooterPlayAgainBtn');

    // Customer Selectable Difficulty Level Configurations
    const difficultyConfigs = {
        'easy': {
            label: '🟢 Level: Mudah',
            speedMult: 0.9,
            discountText: 'Voucher Diskon 25% Berhasil Dibuka!',
            voucherCode: 'TJKTEASY25',
            waText: 'Halo TJKT Smart Network, saya berhasil menyelesaikan 10 Soal Quiz Shooter tingkat MUDAH! Saya ingin klaim VOUCHER DISKON 25%: TJKTEASY25'
        },
        'medium': {
            label: '🟡 Level: Sedang',
            speedMult: 1.8,
            discountText: 'Voucher Diskon 35% Berhasil Dibuka!',
            voucherCode: 'TJKTSHOOT35',
            waText: 'Halo TJKT Smart Network, saya berhasil menyelesaikan 10 Soal Quiz Shooter tingkat SEDANG! Saya ingin klaim VOUCHER DISKON 35%: TJKTSHOOT35'
        },
        'hard': {
            label: '🔴 Level: Expert',
            speedMult: 3.2,
            discountText: 'Voucher Diskon 50% SUPER PRO Berhasil Dibuka!',
            voucherCode: 'TJKTEXPERT50',
            waText: 'Halo TJKT Smart Network, saya berhasil menyelesaikan 10 Soal Quiz Shooter tingkat EXPERT! Saya ingin klaim VOUCHER DISKON 50%: TJKTEXPERT50'
        }
    };

    let selectedDifficulty = 'easy';

    const btnDiffSelects = document.querySelectorAll('.btn-diff-select');
    btnDiffSelects.forEach(btn => {
        btn.addEventListener('click', function () {
            btnDiffSelects.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            selectedDifficulty = this.getAttribute('data-diff') || 'easy';

            const config = difficultyConfigs[selectedDifficulty];
            const shooterDifficultyBadge = document.getElementById('shooterDifficultyBadge');
            if (shooterDifficultyBadge && config) {
                shooterDifficultyBadge.textContent = config.label;
            }
        });
    });

    const quizQuestions = [
        {
            question: "Perangkat mana yang berfungsi menghubungkan jaringan LAN ke Internet?",
            options: ["A. Router", "B. Printer", "C. Flashdisk"],
            correct: 0
        },
        {
            question: "Kabel yang paling umum digunakan untuk jaringan lokal (LAN) komputer adalah?",
            options: ["A. Kabel UTP / LAN", "B. Kabel Power", "C. Kabel Audio"],
            correct: 0
        },
        {
            question: "Teknologi Wi-Fi untuk mengamankan kata sandi dari peretas dinamakan?",
            options: ["A. AirDrop", "B. WPA3 / Firewall", "C. Bluetooth"],
            correct: 1
        },
        {
            question: "Fungsi utama dari Mikrotik Router dalam jaringan komputer adalah?",
            options: ["A. Main Game", "B. Cetak Dokumen", "C. Manaj. Bandwidth & IP"],
            correct: 2
        },
        {
            question: "Singkatan dari IP dalam istilah IP Address pada jaringan adalah?",
            options: ["A. Internet Protocol", "B. Internal Phone", "C. Important Program"],
            correct: 0
        },
        {
            question: "Topologi jaringan komputer yang menggunakan satu switch/hub pusat disebut?",
            options: ["A. Topologi Ring", "B. Topologi Star", "C. Topologi Bus"],
            correct: 1
        },
        {
            question: "Jika Wi-Fi terhubung tapi bertanda seru (No Internet), penyebab tersering adalah?",
            options: ["A. IP Conflict / Gateway Error", "B. Keyboard Rusak", "C. Layar Terlalu Terang"],
            correct: 0
        },
        {
            question: "Port standar yang digunakan oleh protokol HTTP dan HTTPS secara berturut-turut adalah?",
            options: ["A. Port 21 & 22", "B. Port 80 & 443", "C. Port 3306 & 8080"],
            correct: 1
        },
        {
            question: "Perangkat keras jaringan yang bekerja pada Layer 2 (Data Link) OSI Layer adalah?",
            options: ["A. Repeater", "B. Switch", "C. Application Software"],
            correct: 1
        },
        {
            question: "Singkatan dari TJKT dalam jurusan keahlian SMK adalah?",
            options: ["A. Teknik Jaringan Komputer & Telekomunikasi", "B. Tata Boga", "C. Teknik Mesin"],
            correct: 0
        }
    ];

    let currentQIndex = 0;
    let shooterScore = 0;
    let shooterLives = 3;
    let shooterGameState = 'IDLE';
    let shooterAnimId = null;
    let crosshair = { x: 230, y: 125 };
    let lasers = [];
    let targetOrbs = [];

    function initShooterGame() {
        shooterScore = 0;
        shooterLives = 3;
        currentQIndex = 0;
        lasers = [];
        updateShooterUI();
    }

    function updateShooterUI() {
        if (shooterScoreEl) shooterScoreEl.textContent = `${shooterScore}/10`;
        if (shooterLivesEl) shooterLivesEl.textContent = shooterLives;
    }

    function loadQuestion(index) {
        if (index >= quizQuestions.length) {
            triggerShooterWin();
            return;
        }

        const qData = quizQuestions[index];
        if (shooterQNum) shooterQNum.textContent = `SOAL ${index + 1} DARI 10:`;
        if (shooterQText) shooterQText.textContent = qData.question;

        const config = difficultyConfigs[selectedDifficulty] || difficultyConfigs['easy'];
        const shooterDifficultyBadge = document.getElementById('shooterDifficultyBadge');
        if (shooterDifficultyBadge) shooterDifficultyBadge.textContent = config.label;

        const mult = config.speedMult;
        targetOrbs = [
            { text: qData.options[0], x: 80, y: 110, vx: 1.2 * mult, vy: 0.8 * mult, isCorrect: qData.correct === 0, hit: false },
            { text: qData.options[1], x: 230, y: 130, vx: -1.0 * mult, vy: -0.7 * mult, isCorrect: qData.correct === 1, hit: false },
            { text: qData.options[2], x: 380, y: 110, vx: 1.1 * mult, vy: -0.9 * mult, isCorrect: qData.correct === 2, hit: false }
        ];
    }

    shooterCanvas.addEventListener('mousemove', function (e) {
        const rect = shooterCanvas.getBoundingClientRect();
        crosshair.x = e.clientX - rect.left;
        crosshair.y = e.clientY - rect.top;
    });

    shooterCanvas.addEventListener('click', function (e) {
        if (shooterGameState !== 'PLAYING') return;
        const rect = shooterCanvas.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        lasers.push({ x1: 230, y1: 250, x2: clickX, y2: clickY, life: 1.0 });

        targetOrbs.forEach(orb => {
            if (!orb.hit) {
                const dx = clickX - orb.x, dy = clickY - orb.y;
                if (Math.sqrt(dx * dx + dy * dy) <= 42) {
                    orb.hit = true;
                    if (orb.isCorrect) {
                        shooterScore++;
                        updateShooterUI();
                        setTimeout(() => { currentQIndex++; loadQuestion(currentQIndex); }, 500);
                    } else {
                        shooterLives--;
                        updateShooterUI();
                        if (shooterLives <= 0) triggerShooterGameOver();
                    }
                }
            }
        });
    });

    function triggerShooterGameOver() {
        shooterGameState = 'GAMEOVER';
        if (shooterFinalScore) shooterFinalScore.textContent = `${shooterScore}/10`;
        if (shooterGameOverOverlay) shooterGameOverOverlay.style.display = 'flex';
    }

    function triggerShooterWin() {
        shooterGameState = 'WON';
        const config = difficultyConfigs[selectedDifficulty] || difficultyConfigs['easy'];
        const shooterWinDiffText = document.getElementById('shooterWinDiffText');
        const shooterVoucherCode = document.getElementById('shooterVoucherCode');
        const shooterClaimWaBtn = document.getElementById('shooterClaimWaBtn');

        if (shooterWinDiffText) shooterWinDiffText.textContent = config.discountText;
        if (shooterVoucherCode) shooterVoucherCode.textContent = config.voucherCode;
        if (shooterClaimWaBtn) {
            shooterClaimWaBtn.href = `https://wa.me/62895322211425?text=${encodeURIComponent(config.waText)}`;
        }

        if (shooterWinOverlay) shooterWinOverlay.style.display = 'flex';
    }

    function startShooterGame() {
        initShooterGame();
        shooterGameState = 'PLAYING';
        if (shooterStartOverlay) shooterStartOverlay.style.display = 'none';
        if (shooterGameOverOverlay) shooterGameOverOverlay.style.display = 'none';
        if (shooterWinOverlay) shooterWinOverlay.style.display = 'none';
        loadQuestion(0);
        cancelAnimationFrame(shooterAnimId);
        shooterGameLoop();
    }

    if (shooterStartBtn) shooterStartBtn.addEventListener('click', startShooterGame);
    if (shooterRetryBtn) shooterRetryBtn.addEventListener('click', startShooterGame);
    if (shooterPlayAgainBtn) shooterPlayAgainBtn.addEventListener('click', startShooterGame);

    function shooterGameLoop() {
        if (shooterGameState !== 'PLAYING' && shooterGameState !== 'WON') return;

        // Reset canvas shadows for crisp graphics
        shooterCtx.shadowBlur = 0;

        // Clear Canvas with Sci-Fi Dark Blue background
        shooterCtx.fillStyle = '#091329';
        shooterCtx.fillRect(0, 0, shooterCanvas.width, shooterCanvas.height);

        // Draw background stars
        shooterCtx.fillStyle = 'rgba(56, 189, 248, 0.4)';
        for (let i = 0; i < 18; i++) {
            const sx = (i * 29) % shooterCanvas.width;
            const sy = (i * 17) % shooterCanvas.height;
            shooterCtx.fillRect(sx, sy, 2, 2);
        }

        // Draw Target Orbs
        if (shooterGameState === 'PLAYING') {
            targetOrbs.forEach(orb => {
                if (!orb.hit) {
                    orb.x += orb.vx;
                    orb.y += orb.vy;

                    if (orb.x < 55 || orb.x > shooterCanvas.width - 55) orb.vx *= -1;
                    if (orb.y < 45 || orb.y > shooterCanvas.height - 45) orb.vy *= -1;
                }

                shooterCtx.save();
                shooterCtx.translate(orb.x, orb.y);

                // Render Orb Body (Solid & Sharp)
                shooterCtx.shadowBlur = 0; // Explicitly remove shadow blur
                shooterCtx.fillStyle = orb.hit ? (orb.isCorrect ? '#16a34a' : '#dc2626') : '#0f172a';
                shooterCtx.beginPath();
                shooterCtx.arc(0, 0, 42, 0, Math.PI * 2);
                shooterCtx.fill();

                // Crisp Orb Border
                shooterCtx.strokeStyle = orb.hit ? '#ffffff' : '#38bdf8';
                shooterCtx.lineWidth = 3;
                shooterCtx.stroke();

                // Sharp Crisp White Option Text
                shooterCtx.fillStyle = '#ffffff';
                shooterCtx.font = 'bold 12px "Plus Jakarta Sans", sans-serif';
                shooterCtx.textAlign = 'center';
                shooterCtx.textBaseline = 'middle';

                // Text background contrast pill inside orb
                shooterCtx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                shooterCtx.fillRect(-36, -11, 72, 22);

                shooterCtx.fillStyle = '#ffffff';
                let txt = orb.text;
                if (txt.length > 16) txt = txt.substring(0, 14) + '..';
                shooterCtx.fillText(txt, 0, 0);

                shooterCtx.restore();
            });
        }

        // Draw Laser Beams
        for (let i = lasers.length - 1; i >= 0; i--) {
            let l = lasers[i];
            shooterCtx.strokeStyle = '#38bdf8';
            shooterCtx.lineWidth = 4 * l.life;
            shooterCtx.globalAlpha = l.life;
            shooterCtx.beginPath();
            shooterCtx.moveTo(l.x1, l.y1);
            shooterCtx.lineTo(l.x2, l.y2);
            shooterCtx.stroke();
            shooterCtx.globalAlpha = 1.0;

            l.life -= 0.15;
            if (l.life <= 0) lasers.splice(i, 1);
        }

        // Draw Crosshair (Sight Aim 🎯)
        if (shooterGameState === 'PLAYING') {
            shooterCtx.save();
            shooterCtx.translate(crosshair.x, crosshair.y);
            shooterCtx.strokeStyle = '#ef4444';
            shooterCtx.lineWidth = 2;

            // Outer Circle Sight
            shooterCtx.beginPath();
            shooterCtx.arc(0, 0, 14, 0, Math.PI * 2);
            shooterCtx.stroke();

            // Cross Lines
            shooterCtx.beginPath();
            shooterCtx.moveTo(-20, 0); shooterCtx.lineTo(-6, 0);
            shooterCtx.moveTo(6, 0); shooterCtx.lineTo(20, 0);
            shooterCtx.moveTo(0, -20); shooterCtx.lineTo(0, -6);
            shooterCtx.moveTo(0, 6); shooterCtx.lineTo(0, 20);
            shooterCtx.stroke();

            // Center Red Dot
            shooterCtx.fillStyle = '#ef4444';
            shooterCtx.fillRect(-2, -2, 4, 4);
            shooterCtx.restore();
        }

        shooterAnimId = requestAnimationFrame(shooterGameLoop);
    }

    shooterCtx.fillStyle = '#091329';
    shooterCtx.fillRect(0, 0, shooterCanvas.width, shooterCanvas.height);

    /* ==========================================================================
       BARASUARA.MP3 BACKSOUND MUSIC ENGINE
       ========================================================================== */
    const bgmAudio = document.getElementById('bgmAudio');
    const bgmToggleBtn = document.getElementById('bgmToggleBtn');
    const bgmStatusText = document.getElementById('bgmStatusText');
    let isBgmPlaying = false;

    function startBgmMusic() {
        if (bgmAudio) {
            bgmAudio.volume = 0.5; // Comfortable listening volume
            const playPromise = bgmAudio.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isBgmPlaying = true;
                    if (bgmStatusText) bgmStatusText.textContent = 'Musik: ON';
                    if (bgmToggleBtn) bgmToggleBtn.classList.add('playing');
                }).catch(err => {
                    console.log('Autoplay waiting for user gesture:', err);
                });
            }
        }
    }

    function stopBgmMusic() {
        if (bgmAudio) {
            bgmAudio.pause();
        }
        isBgmPlaying = false;
        if (bgmStatusText) bgmStatusText.textContent = 'Musik: OFF';
        if (bgmToggleBtn) bgmToggleBtn.classList.remove('playing');
    }

    function toggleBgm() {
        if (isBgmPlaying) {
            stopBgmMusic();
        } else {
            startBgmMusic();
        }
    }

    if (bgmToggleBtn) {
        bgmToggleBtn.addEventListener('click', toggleBgm);
    }

    // Auto-start Barasuara.mp3 on load & on first user interaction
    function autoStartBgmOnGesture() {
        startBgmMusic();
        window.removeEventListener('click', autoStartBgmOnGesture);
        window.removeEventListener('scroll', autoStartBgmOnGesture);
        window.removeEventListener('keydown', autoStartBgmOnGesture);
        window.removeEventListener('touchstart', autoStartBgmOnGesture);
    }

    window.addEventListener('click', autoStartBgmOnGesture, { once: true });
    window.addEventListener('scroll', autoStartBgmOnGesture, { once: true });
    window.addEventListener('keydown', autoStartBgmOnGesture, { once: true });
    window.addEventListener('touchstart', autoStartBgmOnGesture, { once: true });

    // Direct Email Click Routing Handler
    const emailActionElements = document.querySelectorAll('#emailContactLink, #btnSendEmail, #footerEmailLink, a[href^="mailto:"]');
    emailActionElements.forEach(el => {
        el.addEventListener('click', function (e) {
            const mailtoTarget = this.getAttribute('href');
            if (mailtoTarget && mailtoTarget.startsWith('mailto:')) {
                // Ensure immediate direct dispatch to client's default email handler
                window.location.href = mailtoTarget;
            }
        });
    });

    // Attempt instant playback on page load
    startBgmMusic();
});
