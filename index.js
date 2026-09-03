<!DOCTYPE html>
<html lang="hi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <title>Sutra Token Mining</title>
    <script src="https://telegram.org/js/telegram-web-app.js"></script>
    <style>
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        body { background: #0b0e14; color: #ffffff; padding: 15px; display: flex; flex-direction: column; align-items: center; min-height: 100vh; }
        
        /* टॉप बार */
        .top-bar { width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .profile-box { display: flex; align-items: center; gap: 10px; background: rgba(255,255,255,0.08); padding: 5px 12px; border-radius: 25px; }
        .profile-pic { width: 36px; height: 36px; border-radius: 50%; background: #00d2ff; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; color: #000; }
        .profile-name { font-size: 14px; font-weight: 600; }

        /* SST Coin बैज */
        .sst-badge { background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 5px 12px; border-radius: 20px; text-align: right; }
        .sst-title { font-size: 12px; font-weight: bold; }
        .sst-sub { font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; opacity: 0.9; }

        /* बैलेंस */
        .balance-card { text-align: center; margin: 10px 0 20px 0; }
        .balance-title { font-size: 12px; color: #9ca3af; text-transform: uppercase; }
        .balance-amount { font-size: 42px; font-weight: 900; color: #38bdf8; text-shadow: 0 0 15px rgba(56, 189, 248, 0.4); margin-top: 5px; }

        /* माइनिंग बटन */
        .mine-container { margin: 15px 0; position: relative; }
        .mine-btn {
            width: 180px; height: 180px; border-radius: 50%; border: none;
            background: radial-gradient(circle, #2563eb, #1e3a8a);
            box-shadow: 0 0 30px rgba(37, 99, 235, 0.5);
            color: #ffffff; display: flex; flex-direction: column; align-items: center; justify-content: center;
            cursor: pointer; transition: transform 0.1s;
        }
        .mine-btn:active { transform: scale(0.95); }
        .mine-btn.disabled { background: radial-gradient(circle, #4b5563, #1f2937); box-shadow: none; pointer-events: none; }
        .mine-icon { font-size: 40px; margin-bottom: 5px; }
        .mine-text { font-size: 18px; font-weight: bold; }
        .mine-time { font-size: 12px; color: #93c5fd; margin-top: 5px; }

        /* बूस्टर सिस्टम */
        .booster-card { width: 100%; background: #1e1b4b; border: 1px solid #4338ca; border-radius: 15px; padding: 15px; margin-top: 15px; text-align: center; }
        .booster-title { font-size: 14px; font-weight: bold; color: #c7d2fe; margin-bottom: 5px; }
        .booster-btn { background: linear-gradient(90deg, #ec4899, #8b5cf6); border: none; color: white; padding: 10px 20px; border-radius: 10px; font-weight: bold; font-size: 14px; cursor: pointer; width: 100%; margin-top: 10px; }
        .booster-btn:active { opacity: 0.8; }

        /* रेफरल व सोशल शेयर */
        .ref-card { width: 100%; background: #1f2937; border-radius: 15px; padding: 15px; margin-top: 15px; }
        .ref-card h3 { font-size: 14px; margin-bottom: 10px; color: #f3f4f6; }
        .social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .s-btn { padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; color: white; text-align: center; text-decoration: none; display: block; }
        .btn-wa { background: #25D366; } .btn-tg { background: #0088cc; }
        .btn-fb { background: #1877F2; } .btn-x { background: #000000; border: 1px solid #333; }

        /* वीडियो ऐड सिम्युलेटर (Overlay) */
        #adOverlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: #000000e6; z-index: 1000; flex-direction: column; align-items: center; justify-content: center; }
        .ad-text { font-size: 20px; font-weight: bold; color: white; margin-bottom: 20px; text-align: center; }
        .ad-timer { font-size: 60px; font-weight: 900; color: #facc15; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #facc15; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-top: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
    </style>
</head>
<body>

    <!-- 15 सेकंड का वीडियो ऐड सिम्युलेटर -->
    <div id="adOverlay">
        <div class="ad-text">Sponsor Video<br><small style="font-size: 14px; font-weight: normal; color: #9ca3af;">Please wait for the video to finish</small></div>
        <div class="ad-timer" id="adTimerNumber">15</div>
        <div class="loader"></div>
    </div>

    <!-- टॉप प्रोफाइल -->
    <div class="top-bar">
        <div class="profile-box">
            <div class="profile-pic" id="uPic">S</div>
            <div class="profile-name" id="uName">Miner</div>
        </div>
        <div class="sst-badge">
            <div class="sst-title">🪙 $SST Coin</div>
            <div class="sst-sub">Coming Soon</div>
        </div>
    </div>

    <!-- लाइव बैलेंस -->
    <div class="balance-card">
        <div class="balance-title">कुल सूत्र टोकन ($SUTRA)</div>
        <div class="balance-amount" id="tokenBalance">0.000</div>
    </div>

    <!-- माइनिंग बटन -->
    <div class="mine-container">
        <button class="mine-btn" id="mineBtn" onclick="startMiningProcess()">
            <div class="mine-icon">▶️</div>
            <div class="mine-text" id="mineText">Play / Start</div>
            <div class="mine-time" id="mineSubText">Watch Ad to Mine</div>
        </button>
    </div>

    <!-- 3-स्टेप बूस्टर कार्ड -->
    <div class="booster-card">
        <div class="booster-title">🚀 3x माइनिंग बूस्टर (1000 SUTRA / 4h)</div>
        <div style="font-size: 11px; color: #9ca3af; margin-bottom: 5px;">वीडियो देखकर बूस्ट लेवल बढ़ाएं (3 घंटे के लिए)</div>
        <button class="booster-btn" id="boostBtn" onclick="handleBooster()">⚡ Upgrade: Watch Ad (1x ➔ 2x)</button>
    </div>

    <!-- सोशल शेयरिंग -->
    <div class="ref-card">
        <h3>👥 रेफरल और सोशल शेयर</h3>
        <div class="social-grid">
            <a id="waShare" class="s-btn btn-wa" target="_blank">WhatsApp</a>
            <a id="tgShare" class="s-btn btn-tg" target="_blank">Telegram</a>
            <a id="fbShare" class="s-btn btn-fb" target="_blank">Facebook</a>
            <a id="xShare"  class="s-btn btn-x"  target="_blank">X (Twitter)</a>
        </div>
    </div>

    <script>
        const tg = window.Telegram?.WebApp;
        if (tg) { tg.expand(); tg.ready(); }

        // प्रोफाइल लोड
        const user = tg?.initDataUnsafe?.user;
        const displayName = user ? user.first_name : "Kishan";
        document.getElementById('uName').innerText = displayName;
        document.getElementById('uPic').innerText = displayName.charAt(0).toUpperCase();

        // माइनिंग और बूस्ट कॉन्फ़िगरेशन
        const DURATION_24H = 24 * 60 * 60 * 1000;
        const DURATION_3H = 3 * 60 * 60 * 1000;
        
        // बेस स्पीड: 2017 टोकन 24 घंटे में (~0.02334 प्रति सेकंड)
        const BASE_RATE = 2017 / (24 * 60 * 60);
        // बूस्ट स्पीड: 1000 टोकन 4 घंटे में (लगभग 3 गुना)
        const BOOST_RATE = 1000 / (4 * 60 * 60); 

        // लोकस्टोरेज डेटा
        let balance = parseFloat(localStorage.getItem('sst_bal')) || 0;
        let lastCalcTime = parseInt(localStorage.getItem('sst_last_calc')) || Date.now();
        let miningStartTime = parseInt(localStorage.getItem('sst_mine_start')) || 0;
        
        // बूस्टर स्टेप्स: 0 = नॉर्मल, 1 = 1st Ad watched, 2 = 2nd Ad watched, 3 = 3x Active
        let boostStep = parseInt(localStorage.getItem('sst_boost_step')) || 0;
        let boostStartTime = parseInt(localStorage.getItem('sst_boost_start')) || 0;

        // लाइव माइनिंग कैलकुलेटर (हर सेकंड चलता है)
        function calculateEarnings() {
            let now = Date.now();
            let deltaSec = (now - lastCalcTime) / 1000;
            
            let isMiningActive = (now - miningStartTime) < DURATION_24H && miningStartTime > 0;
            let isBoostActive = boostStep === 3 && (now - boostStartTime) < DURATION_3H;

            if (isMiningActive) {
                let currentRate = isBoostActive ? BOOST_RATE : BASE_RATE;
                balance += (deltaSec * currentRate);
            } else if (now - miningStartTime >= DURATION_24H && miningStartTime > 0) {
                // 24 घंटे पूरे, माइनिंग स्टॉप
                miningStartTime = 0; 
                localStorage.setItem('sst_mine_start', 0);
            }

            // अगर 3 घंटे का बूस्ट खत्म हो गया
            if (boostStep === 3 && now - boostStartTime >= DURATION_3H) {
                boostStep = 0;
                localStorage.setItem('sst_boost_step', 0);
            }

            lastCalcTime = now;
            localStorage.setItem('sst_bal', balance);
            localStorage.setItem('sst_last_calc', lastCalcTime);

            updateUI(now, isMiningActive, isBoostActive);
        }

        function formatTime(ms) {
            let h = Math.floor(ms / (1000*60*60));
            let m = Math.floor((ms % (1000*60*60)) / (1000*60));
            let s = Math.floor((ms % (1000*60)) / 1000);
            return `${h}h ${m}m ${s}s`;
        }

        function updateUI(now, isMiningActive, isBoostActive) {
            document.getElementById('tokenBalance').innerText = balance.toFixed(3);

            // माइनिंग UI अपडेट
            const mBtn = document.getElementById('mineBtn');
            const mText = document.getElementById('mineText');
            const mSubText = document.getElementById('mineSubText');

            if (isMiningActive) {
                mBtn.classList.add('disabled');
                mText.innerText = "⛏️ Mining...";
                let timeLeft = DURATION_24H - (now - miningStartTime);
                mSubText.innerText = formatTime(timeLeft) + " left";
            } else {
                mBtn.classList.remove('disabled');
                mText.innerText = "▶️ Play / Start";
                mSubText.innerText = "Watch Ad to Mine";
            }

            // बूस्टर UI अपडेट
            const bBtn = document.getElementById('boostBtn');
            if (boostStep === 0) bBtn.innerText = "⚡ Watch Ad (Unlock 2x Step)";
            else if (boostStep === 1) bBtn.innerText = "⚡ Watch Ad (Unlock 3x Step)";
            else if (boostStep === 2) bBtn.innerText = "🔥 Watch Ad (Activate 3x Boost)";
            else if (boostStep === 3) {
                let boostLeft = DURATION_3H - (now - boostStartTime);
                bBtn.innerText = "🔥 3x Boost Active (" + formatTime(boostLeft) + ")";
            }
        }

        // ऐड सिम्युलेटर (15 सेकंड)
        function showAd(callback) {
            const overlay = document.getElementById('adOverlay');
            const timerEl = document.getElementById('adTimerNumber');
            let timeLeft = 15;
            
            overlay.style.display = 'flex';
            timerEl.innerText = timeLeft;

            let adInterval = setInterval(() => {
                timeLeft--;
                timerEl.innerText = timeLeft;
                if (timeLeft <= 0) {
                    clearInterval(adInterval);
                    overlay.style.display = 'none';
                    callback();
                }
            }, 1000);
        }

        // स्टार्ट माइनिंग लॉजिक
        function startMiningProcess() {
            if (miningStartTime > 0 && Date.now() - miningStartTime < DURATION_24H) return; // पहले से चल रही है
            
            showAd(() => {
                miningStartTime = Date.now();
                lastCalcTime = Date.now();
                localStorage.setItem('sst_mine_start', miningStartTime);
                alert("✅ माइनिंग सफलतापूर्वक शुरू हो गई है (24 घंटे के लिए)!");
            });
        }

        // बूस्टर लॉजिक (3 स्टेप्स)
        function handleBooster() {
            if (boostStep === 3) {
                alert("आपका 3x बूस्ट पहले से एक्टिव है!");
                return;
            }

            showAd(() => {
                boostStep++;
                if (boostStep === 3) {
                    boostStartTime = Date.now();
                    localStorage.setItem('sst_boost_start', boostStartTime);
                    alert("🔥 शानदार! आपका 3x बूस्टर (1000 SUTRA/4h) 3 घंटे के लिए चालू हो गया है!");
                } else {
                    alert(`✅ स्टेप ${boostStep} पूरा हुआ! 3x बूस्ट चालू करने के लिए आगे बढ़ें।`);
                }
                localStorage.setItem('sst_boost_step', boostStep);
            });
        }

        // हर 1 सेकंड में कैलकुलेशन
        setInterval(calculateEarnings, 1000);

        // रेफरल शेयरिंग (Social Media)
        const refLink = `https://t.me/SutraTokenBot?start=ref_${user?.id || 'm'}`;
        const sTxt = encodeURIComponent(`🚀 Sutra Token माइनिंग चालू है! फ्री $SUTRA कमाएं और $SST Coin एयरड्रॉप के लिए तैयार रहें: ${refLink}`);

        document.getElementById('waShare').href = `https://api.whatsapp.com/send?text=${sTxt}`;
        document.getElementById('tgShare').href = `https://t.me/share/url?url=${refLink}&text=${sTxt}`;
        document.getElementById('fbShare').href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(refLink)}`;
        document.getElementById('xShare').href = `https://twitter.com/intent/tweet?text=${sTxt}`;

    </script>
</body>
</html>
