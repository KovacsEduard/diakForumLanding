 /**
     * Initialize theme state based on user preference or saved choice
     */
    (function initTheme() {
      try {
        const saved = localStorage.getItem('diakforum_theme');
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (saved === 'light') {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {
        // Ignore storage restrictions in sandboxed environments
      }
    })();

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        try {
          localStorage.setItem('diakforum_theme', isDark ? 'dark' : 'light');
        } catch (e) {
          // Ignore storage error
        }
      });
    }

    /**
     * Copy target application URL with execCommand fallback for sandboxed frames
     */
    function copyAppUrl() {
      const url = 'https://kovacseduard.github.io/diakForum';
      const feedback = document.getElementById('copyFeedback');
      let copied = false;

      try {
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        tempInput.select();
        copied = document.execCommand('copy');
        document.body.removeChild(tempInput);
      } catch (err) {
        copied = false;
      }

      if (feedback) {
        feedback.classList.remove('hidden');
        feedback.textContent = copied
          ? 'Link kimásolva: https://kovacseduard.github.io/diakForum'
          : 'Másold ki innen: https://kovacseduard.github.io/diakForum';
      }
    }

    /**
     * Switch between Ranks and Messenger/Chat showcase inside Section 2
     */
    function switchCommunityTab(tab) {
      const ranksBtn = document.getElementById('tabRanksBtn');
      const msgBtn = document.getElementById('tabMessengerBtn');
      const ranksPanel = document.getElementById('panelRanks');
      const msgPanel = document.getElementById('panelMessenger');

      if (!ranksBtn || !msgBtn || !ranksPanel || !msgPanel) return;

      if (tab === 'ranks') {
        ranksPanel.classList.remove('hidden');
        msgPanel.classList.add('hidden');
        ranksBtn.className =
          'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition cursor-pointer';
        msgBtn.className =
          'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer';
      } else {
        msgPanel.classList.remove('hidden');
        ranksPanel.classList.add('hidden');
        msgBtn.className =
          'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition cursor-pointer';
        ranksBtn.className =
          'flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition cursor-pointer';
      }
    }

    /**
     * Interactive Promo Video Controls & Scene Jump Logic
     */
    const videoEl = document.getElementById('promoVideoPlayer');
    const scrubberEl = document.getElementById('videoScrubber');
    const currentTimeLabel = document.getElementById('currentTimeLabel');
    const durationLabel = document.getElementById('durationLabel');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const playPauseLabel = document.getElementById('playPauseLabel');
    const muteLabel = document.getElementById('muteLabel');
    const sceneCaption = document.getElementById('activeSceneCaption');
    const fallbackBanner = document.getElementById('videoFallbackBanner');

    let simulatedTime = 0;
    let isSimulating = false;
    let simTimer = null;

    function formatTime(sec) {
      const s = Math.max(0, Math.floor(Number(sec) || 0));
      const mins = Math.floor(s / 60);
      const rem = s % 60;
      return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
    }

    function handleVideoFallback() {
      if (fallbackBanner) {
        fallbackBanner.classList.remove('hidden');
      }
    }

    function togglePlayPause() {
      if (!videoEl) return;

      if (videoEl.readyState >= 2 && !videoEl.error) {
        if (videoEl.paused) {
          videoEl.play().catch(() => startSimulatedPlayback());
        } else {
          videoEl.pause();
        }
      } else {
        startSimulatedPlayback();
      }
    }

    function startSimulatedPlayback() {
      if (isSimulating) {
        isSimulating = false;
        clearInterval(simTimer);
        if (playPauseIcon) playPauseIcon.textContent = '▶';
        if (playPauseLabel) playPauseLabel.textContent = 'Lejátszás';
        return;
      }

      isSimulating = true;
      if (playPauseIcon) playPauseIcon.textContent = '⏸';
      if (playPauseLabel) playPauseLabel.textContent = 'Szünet';

      simTimer = setInterval(() => {
        simulatedTime += 1;
        if (simulatedTime > 75) simulatedTime = 0;
        if (scrubberEl) scrubberEl.value = simulatedTime;
        if (currentTimeLabel) currentTimeLabel.textContent = formatTime(simulatedTime);
      }, 1000);
    }

    function toggleMuteVideo() {
      if (!videoEl) return;
      videoEl.muted = !videoEl.muted;
      if (muteLabel) {
        muteLabel.textContent = videoEl.muted ? '🔇 Némítva' : '🔊 Hang be/ki';
      }
    }

    function scrubVideo(value) {
      const timeVal = Number(value) || 0;
      simulatedTime = timeVal;
      if (currentTimeLabel) currentTimeLabel.textContent = formatTime(timeVal);
      if (videoEl && videoEl.readyState >= 1 && !videoEl.error) {
        try {
          videoEl.currentTime = timeVal;
        } catch (e) {
          // Ignore seek errors before metadata is ready
        }
      }
    }

    function jumpToScene(seconds, title) {
      simulatedTime = seconds;
      if (scrubberEl) scrubberEl.value = seconds;
      if (currentTimeLabel) currentTimeLabel.textContent = formatTime(seconds);
      if (sceneCaption) sceneCaption.textContent = `Aktív jelenet: ${title}`;

      if (videoEl && videoEl.readyState >= 1 && !videoEl.error) {
        try {
          videoEl.currentTime = seconds;
          videoEl.play().catch(() => {});
        } catch (e) {
          // Ignore if source isn't loaded locally
        }
      }
    }

    if (videoEl) {
      videoEl.addEventListener('loadedmetadata', () => {
        if (durationLabel && isFinite(videoEl.duration) && videoEl.duration > 0) {
          durationLabel.textContent = formatTime(videoEl.duration);
          if (scrubberEl) scrubberEl.max = Math.floor(videoEl.duration);
        }
      });

      videoEl.addEventListener('timeupdate', () => {
        if (!videoEl.error) {
          if (scrubberEl) scrubberEl.value = videoEl.currentTime;
          if (currentTimeLabel) currentTimeLabel.textContent = formatTime(videoEl.currentTime);
        }
      });

      videoEl.addEventListener('play', () => {
        if (playPauseIcon) playPauseIcon.textContent = '⏸';
        if (playPauseLabel) playPauseLabel.textContent = 'Szünet';
      });

      videoEl.addEventListener('pause', () => {
        if (!isSimulating) {
          if (playPauseIcon) playPauseIcon.textContent = '▶';
          if (playPauseLabel) playPauseLabel.textContent = 'Lejátszás';
        }
      });
    }

    /**
     * Modal Viewer for Adatkezelési tájékoztató & Törlési kérelem kezelése
     */
    const docModal = document.getElementById('docModal');
    const docModalTitle = document.getElementById('docModalTitle');
    const docModalBody = document.getElementById('docModalBody');

    function openDocModal(docType) {
      if (!docModal || !docModalTitle || !docModalBody) return;

      if (docType === 'privacy') {
        docModalTitle.textContent = 'Adatkezelési tájékoztató – DiákFórum';
        docModalBody.innerHTML = `
          <p><strong>1. Adatkezelő és jogszabályi alap:</strong> A DiákFórum projektcsapata (közös adatkezelők) a <strong>GDPR (EU) 2016/679</strong> rendelet és az <strong>Infotv. (2011. évi CXII. tv.)</strong> alapján jár el. (Utolsó frissítés: 2026.)</p>
          <p><strong>2. Kezelt adatok és jogalapok:</strong><br/>
          • <em>Kötelező adatok (szerződés teljesítése – GDPR 6. cikk (1) b):</em> Név (profil megjelenítése, azonosítás) és e-mail cím (regisztráció, bejelentkezés e-mail + jelszóval vagy Google-fiókkal, kapcsolattartás).<br/>
          • <em>Opcionális adatok (önkéntes hozzájárulás – GDPR 6. cikk (1) a):</em> Profilkép, posztokban feltöltött képek, Messenger link.</p>
          <p><strong>3. 16 év alatti felhasználók:</strong> Magyarországon a digitális hozzájárulás korhatára 16 év. 16 év alatti diák esetén a szülő vagy törvényes képviselő hozzájárulása szükséges, amelyet a regisztrációval nyilatkoznak.</p>
          <p><strong>4. Tárolás és biztonság:</strong> Az adatokat a <strong>Supabase</strong> szolgáltatásában tároljuk (GDPR 28. cikk szerinti adatfeldolgozó), HTTPS kapcsolaton keresztül, hashelt jelszavakkal, a fiók aktív fennállásáig.</p>
          <p><strong>5. Érintetti jogok:</strong> Tájékoztatás, hozzáférés, helyesbítés, törlés („elfeledtetéshez való jog”), korlátozás, adathordozhatóság, tiltakozás és hozzájárulás visszavonása (max. 30 napon belüli ügyintézéssel), valamint panaszjog a <strong>NAIH</strong>-nál (www.naih.hu).</p>
        `;
      } else {
        docModalTitle.textContent = 'Törlési kérelem kezelése (GDPR 17. cikk)';
        docModalBody.innerHTML = `
          <p><strong>1. Kérelem fogadása:</strong> A felhasználó e-mailben vagy az alkalmazáson belül kérheti adatai törlését. Rövid visszaigazolást küldünk, és legfeljebb <strong>30 napon belül</strong> végrehajtjuk.</p>
          <p><strong>2. Azonosítás:</strong> Ellenőrizzük, hogy a kérelem valóban a fiók tulajdonosától érkezett-e (e-mail egyezés / bejelentkezés), és csak ezután történik a törlés.</p>
          <p><strong>3. Mit törlünk (Supabase):</strong><br/>
          • <em>Storage:</em> profilkép és a posztokban lévő képek törlése.<br/>
          • <em>Adatbázis:</em> név, e-mail, Messenger link, profiladatok törlése; posztok szövegének törlése vagy anonimizálása („Törölt felhasználó”).<br/>
          • <em>Supabase Auth:</em> felhasználói fiók és a hozzá tartozó jelszó-hash megszüntetése.</p>
          <p><strong>4. Biztonsági mentések, visszajelzés és naplózás:</strong> A biztonsági mentésekből ésszerű időn belül eltávolítjuk/felülírjuk az adatokat, visszajelzést küldünk a felhasználónak, és a GDPR 5. cikk (2) elszámoltathatósága miatt belső feljegyzést készítünk.</p>
        `;
      }

      docModal.classList.remove('hidden');
      docModal.classList.add('flex');
    }

    function closeDocModal() {
      if (!docModal) return;
      docModal.classList.add('hidden');
      docModal.classList.remove('flex');
    }

    if (docModal) {
      docModal.addEventListener('click', (e) => {
        if (e.target === docModal) {
          closeDocModal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeDocModal();
      }
    });