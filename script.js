/* ========================================================
   AVIJIT PAKHIRA — PORTFOLIO INTERACTION ENGINE
   Dynamic Neural Canvas, Preloader, Audio Synth, 
   Command Palette, Live Project Filtering & Search
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------
  // 1. WEB AUDIO API SYNTH (FUTURISTIC SOUND FX)
  // ------------------------------------------------------------------
  let audioEnabled = true;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynthSound(freq = 600, type = 'sine', duration = 0.08, gainVal = 0.04) {
    if (!audioEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + duration);

      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not supported or blocked by browser policy
    }
  }

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      audioEnabled = !audioEnabled;
      soundToggleBtn.innerHTML = audioEnabled 
        ? '<i class="fas fa-volume-high"></i>' 
        : '<i class="fas fa-volume-xmark"></i>';
      soundToggleBtn.style.color = audioEnabled ? 'var(--cyan)' : 'var(--text-muted)';
      showToast(audioEnabled ? 'UI Audio Enabled' : 'UI Audio Muted');
      if (audioEnabled) playSynthSound(800, 'triangle', 0.1);
    });
  }

  // ------------------------------------------------------------------
  // 2. PRELOADER & SYSTEM INITIALIZATION (OPENING STYLE)
  // ------------------------------------------------------------------
  const preloader = document.getElementById('preloader');
  const preloaderProgress = document.getElementById('preloaderProgress');
  const preloaderPercent = document.getElementById('preloaderPercent');
  const preloaderStatusText = document.getElementById('preloaderStatusText');
  const terminalLine = document.getElementById('terminalLine');
  const preloaderSkip = document.getElementById('preloaderSkip');

  const bootMessages = [
    { pct: 15, msg: 'Initializing PyTorch & TensorFlow core...', term: 'Allocating CUDA / Tensor cores...' },
    { pct: 35, msg: 'Loading Computer Vision pipelines (OpenCV)...', term: 'Loaded YOLOv3 & FaceNet embeddings.' },
    { pct: 60, msg: 'Synchronizing academic data [JIS University]...', term: 'Verified CGPA: 9.41 / 10.0' },
    { pct: 85, msg: 'Indexing Springer research publications...', term: 'icSoftComp2024 & Vedic Math papers verified.' },
    { pct: 100, msg: 'All systems operational. Access Granted.', term: 'WELCOME TO AVIJIT PAKHIRA PORTFOLIO.' }
  ];

  let currentBootStep = 0;
  let progressVal = 0;
  let preloaderFinished = false;

  const bootTimer = setInterval(() => {
    if (currentBootStep < bootMessages.length) {
      const step = bootMessages[currentBootStep];
      progressVal = Math.min(step.pct, progressVal + 4);
      preloaderProgress.style.width = `${progressVal}%`;
      preloaderPercent.textContent = `${progressVal}%`;
      preloaderStatusText.textContent = step.msg;
      terminalLine.textContent = step.term;

      if (progressVal >= step.pct) {
        currentBootStep++;
        playSynthSound(400 + currentBootStep * 100, 'sine', 0.05, 0.02);
      }
    } else {
      clearInterval(bootTimer);
      finishPreloader();
    }
  }, 45);

  function finishPreloader() {
    if (preloaderFinished) return;
    preloaderFinished = true;
    preloaderProgress.style.width = '100%';
    preloaderPercent.textContent = '100%';
    preloaderStatusText.textContent = 'System Ready.';
    playSynthSound(1000, 'triangle', 0.15, 0.05);

    setTimeout(() => {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        preloader.style.display = 'none';
        triggerInitialHeroAnimations();
      }, 700);
    }, 400);
  }

  if (preloaderSkip) {
    preloaderSkip.addEventListener('click', () => {
      clearInterval(bootTimer);
      finishPreloader();
    });
  }

  // ------------------------------------------------------------------
  // 3. INTERACTIVE NEURAL NETWORK CANVAS
  // ------------------------------------------------------------------
  (function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [];
    const mouse = { x: -1000, y: -1000, active: false };
    const NODE_COUNT = window.innerWidth < 768 ? 40 : 75;
    const CONNECT_DIST = 145;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
      resize();
      createNodes();
    });

    function createNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.4 ? 'rgba(0, 240, 255,' : 'rgba(139, 92, 246,'
        });
      }
    }
    createNodes();

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    function animate() {
      ctx.clearRect(0, 0, W, H);

      // Update position & repulsion
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 130 && dist > 0) {
            const force = (130 - dist) / 130;
            n.vx -= (dx / dist) * force * 0.4;
            n.vy -= (dy / dist) * force * 0.4;
          }
        }

        n.x += n.vx;
        n.y += n.vy;

        // Gentle drag
        n.vx *= 0.99;
        n.vy *= 0.99;

        // Bounce on boundary
        if (n.x < 0) { n.x = 0; n.vx *= -1; }
        if (n.x > W) { n.x = W; n.vx *= -1; }
        if (n.y < 0) { n.y = 0; n.vy *= -1; }
        if (n.y > H) { n.y = H; n.vy *= -1; }
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.32;
            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = n.color + '0.75)';
        ctx.shadowColor = 'rgba(0, 240, 255, 0.4)';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      requestAnimationFrame(animate);
    }
    animate();
  })();

  // ------------------------------------------------------------------
  // 4. CUSTOM CURSOR GLOW
  // ------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot = document.getElementById('cursorDot');

  if (cursorGlow && cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100, mouseY = -100;
    let glowX = -100, glowY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    function renderCursor() {
      glowX += (mouseX - glowX) * 0.15;
      glowY += (mouseY - glowY) * 0.15;
      cursorGlow.style.left = `${glowX}px`;
      cursorGlow.style.top = `${glowY}px`;
      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover scale
    const hoverables = document.querySelectorAll('a, button, .project-card, .filter-tab, .contact-tile');
    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursorDot.style.background = 'var(--violet)';
        cursorGlow.style.width = '420px';
        cursorGlow.style.height = '420px';
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorDot.style.background = 'var(--cyan)';
        cursorGlow.style.width = '320px';
        cursorGlow.style.height = '320px';
      });
    });
  }

  // ------------------------------------------------------------------
  // 5. HERO TYPING SUBTITLE
  // ------------------------------------------------------------------
  const typedEl = document.getElementById('heroTypedText');
  const roles = [
    'AI & Deep Learning Engineer',
    'Computer Vision & Edge Specialist',
    'Springer-Published Researcher',
    'Quantitative & Algorithmic Builder',
    'Healthcare & Clinical Systems Developer'
  ];
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function typeRoles() {
    if (!typedEl) return;
    const currentText = roles[roleIdx];

    if (!isDeleting) {
      typedEl.textContent = currentText.substring(0, ++charIdx);
      if (charIdx === currentText.length) {
        isDeleting = true;
        setTimeout(typeRoles, 1800);
        return;
      }
    } else {
      typedEl.textContent = currentText.substring(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeRoles, isDeleting ? 40 : 85);
  }
  typeRoles();

  // ------------------------------------------------------------------
  // 6. 3D CARD PERSPECTIVE TILT (AVATAR CARD)
  // ------------------------------------------------------------------
  const avatarCard = document.getElementById('avatarCard');
  if (avatarCard && window.matchMedia('(pointer: fine)').matches) {
    avatarCard.addEventListener('mousemove', (e) => {
      const rect = avatarCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const midX = rect.width / 2;
      const midY = rect.height / 2;

      const rotateY = ((x - midX) / midX) * 12;
      const rotateX = -((y - midY) / midY) * 12;

      avatarCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    avatarCard.addEventListener('mouseleave', () => {
      avatarCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  }

  // ------------------------------------------------------------------
  // 7. STATS NUMBER COUNTER ON SCROLL
  // ------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  let statsCounted = false;

  function runStatsCounters() {
    statNumbers.forEach((counter) => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
      const duration = 1800;
      const startTime = performance.now();

      function update(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentVal = easeOutQuad * target;

        counter.textContent = currentVal.toFixed(decimals);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toFixed(decimals);
        }
      }
      requestAnimationFrame(update);
    });
  }

  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsCounted) {
          statsCounted = true;
          runStatsCounters();
        }
      });
    }, { threshold: 0.3 });
    statsObserver.observe(heroSection);
  }

  // ------------------------------------------------------------------
  // 8. SCROLL REVEAL OBSERVER
  // ------------------------------------------------------------------
  function triggerInitialHeroAnimations() {
    const heroReveals = document.querySelectorAll('#hero .reveal');
    heroReveals.forEach((el, index) => {
      setTimeout(() => el.classList.add('visible'), index * 100);
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // ------------------------------------------------------------------
  // 9. NAVBAR SCROLL & ACTIVE LINK TRACKER
  // ------------------------------------------------------------------
  const mainNav = document.getElementById('mainNav');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTopBtn');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Navbar background
    if (mainNav) {
      mainNav.classList.toggle('scrolled', scrollY > 60);
    }

    // Scroll progress line
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${progressPercent}%`;
    }

    // Back to top button visibility
    if (backToTopBtn) {
      backToTopBtn.classList.toggle('visible', scrollY > 450);
    }

    // Active Section Tracking
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-section') === currentSectionId);
    });
  }, { passive: true });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      playSynthSound(700, 'triangle', 0.1);
    });
  }

  // ------------------------------------------------------------------
  // 10. POPULATE DUAL TECH MARQUEE
  // ------------------------------------------------------------------
  const techStackData = [
    { name: 'Python', icon: 'fab fa-python' },
    { name: 'PyTorch', icon: 'fas fa-fire' },
    { name: 'TensorFlow', icon: 'fas fa-brain' },
    { name: 'OpenCV', icon: 'fas fa-eye' },
    { name: 'YOLOv3 / Vision', icon: 'fas fa-crosshairs' },
    { name: 'Django', icon: 'fab fa-python' },
    { name: 'Streamlit', icon: 'fas fa-bolt' },
    { name: 'Scikit-Learn', icon: 'fas fa-robot' },
    { name: 'Pandas & NumPy', icon: 'fas fa-table' },
    { name: 'Deep Learning', icon: 'fas fa-network-wired' },
    { name: 'Generative AI', icon: 'fas fa-wand-magic-sparkles' },
    { name: 'C++', icon: 'fas fa-code' },
    { name: 'SQL & DBMS', icon: 'fas fa-database' },
    { name: 'MongoDB', icon: 'fas fa-leaf' },
    { name: 'Vercel', icon: 'fas fa-triangle-exclamation' },
    { name: 'Git & GitHub', icon: 'fab fa-github' },
    { name: 'REST APIs', icon: 'fas fa-plug' },
    { name: 'NodeMCU & IoT', icon: 'fas fa-microchip' }
  ];

  function buildMarqueeHTML(data) {
    return [...data, ...data].map(item => `
      <div class="marquee-chip">
        <i class="${item.icon}"></i>
        <span>${item.name}</span>
      </div>
    `).join('');
  }

  const marqueeTrack1 = document.getElementById('marqueeTrack1');
  const marqueeTrack2 = document.getElementById('marqueeTrack2');

  if (marqueeTrack1) marqueeTrack1.innerHTML = buildMarqueeHTML(techStackData);
  if (marqueeTrack2) marqueeTrack2.innerHTML = buildMarqueeHTML([...techStackData].reverse());

  // ------------------------------------------------------------------
  // 11. PROJECTS FILTERING & LIVE SEARCH
  // ------------------------------------------------------------------
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.project-card');
  const searchInput = document.getElementById('projectSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const noProjectsMatch = document.getElementById('noProjectsMatch');
  const countAll = document.getElementById('countAll');

  if (countAll) countAll.textContent = projectCards.length;

  let currentCategory = 'all';
  let currentSearchQuery = '';

  function filterProjects() {
    let visibleCount = 0;

    projectCards.forEach(card => {
      const categories = (card.getAttribute('data-category') || '').toLowerCase().split(' ');
      const title = (card.getAttribute('data-title') || '').toLowerCase();
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const desc = (card.querySelector('.project-description')?.textContent || '').toLowerCase();

      const matchesCategory = (currentCategory === 'all') || categories.includes(currentCategory);
      const matchesSearch = !currentSearchQuery || 
        title.includes(currentSearchQuery) || 
        tags.includes(currentSearchQuery) || 
        desc.includes(currentSearchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (noProjectsMatch) {
      noProjectsMatch.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-filter') || 'all';
      playSynthSound(500, 'sine', 0.06);
      filterProjects();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('active', currentSearchQuery.length > 0);
      }
      filterProjects();
    });
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchQuery = '';
      clearSearchBtn.classList.remove('active');
      filterProjects();
    });
  }

  // ------------------------------------------------------------------
  // 12. COMMAND PALETTE (CTRL+K / ⌘K)
  // ------------------------------------------------------------------
  const cmdPaletteModal = document.getElementById('cmdPaletteModal');
  const cmdPaletteBtn = document.getElementById('cmdPaletteBtn');
  const cmdCloseBtn = document.getElementById('cmdCloseBtn');
  const cmdInput = document.getElementById('cmdInput');
  const cmdItems = document.querySelectorAll('.cmd-item');

  function openCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.add('open');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
    cmdItems.forEach(item => item.style.display = 'flex');
    playSynthSound(750, 'triangle', 0.08);
  }

  function closeCmdPalette() {
    if (!cmdPaletteModal) return;
    cmdPaletteModal.classList.remove('open');
  }

  if (cmdPaletteBtn) cmdPaletteBtn.addEventListener('click', openCmdPalette);
  if (cmdCloseBtn) cmdCloseBtn.addEventListener('click', closeCmdPalette);

  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdPaletteModal.classList.contains('open')) {
        closeCmdPalette();
      } else {
        openCmdPalette();
      }
    }
    if (e.key === 'Escape' && cmdPaletteModal.classList.contains('open')) {
      closeCmdPalette();
    }
  });

  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener('click', (e) => {
      if (e.target === cmdPaletteModal) closeCmdPalette();
    });
  }

  if (cmdInput) {
    cmdInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      cmdItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });
  }

  cmdItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.getAttribute('data-action');
      const target = item.getAttribute('data-target');

      closeCmdPalette();

      if (action === 'goto' && target) {
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else if (action === 'resume') {
        window.open('https://drive.google.com/uc?export=download&id=1atUz9oFpYv6dJkmnclmP7gvQ96bGvcub', '_blank');
      } else if (action === 'copy-email') {
        copyEmailToClipboard();
      }
    });
  });

  // ------------------------------------------------------------------
  // 13. COPY EMAIL TO CLIPBOARD
  // ------------------------------------------------------------------
  function copyEmailToClipboard() {
    const email = 'avijitpakhira2807@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      showToast('Copied: ' + email);
      playSynthSound(900, 'sine', 0.1);
    }).catch(() => {
      showToast('Email: ' + email);
    });
  }

  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', copyEmailToClipboard);
  }

  // ------------------------------------------------------------------
  // 14. TOAST NOTIFICATION UTILITY
  // ------------------------------------------------------------------
  let toastTimer = null;
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    if (!toast) return;

    toast.innerHTML = `<i class="fas fa-circle-check text-cyan"></i> ${message}`;
    toast.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // ------------------------------------------------------------------
  // 15. AUTO-SCROLL TOGGLE
  // ------------------------------------------------------------------
  const autoScrollToggle = document.getElementById('autoScrollToggle');
  let autoScrollActive = false;
  let autoScrollInterval = null;

  function startAutoScroll() {
    autoScrollActive = true;
    autoScrollToggle.classList.add('active');
    autoScrollToggle.innerHTML = '<i class="fas fa-pause"></i>';
    showToast('Auto-Scroll Active');
    playSynthSound(650, 'triangle', 0.08);

    autoScrollInterval = setInterval(() => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (window.scrollY >= maxScroll - 5) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        window.scrollBy({ top: 1.6, behavior: 'auto' });
      }
    }, 16);
  }

  function stopAutoScroll() {
    autoScrollActive = false;
    autoScrollToggle.classList.remove('active');
    autoScrollToggle.innerHTML = '<i class="fas fa-play"></i>';
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = null;
  }

  if (autoScrollToggle) {
    autoScrollToggle.addEventListener('click', () => {
      if (autoScrollActive) {
        stopAutoScroll();
      } else {
        startAutoScroll();
      }
    });
  }

  window.addEventListener('wheel', () => {
    if (autoScrollActive) stopAutoScroll();
  }, { passive: true });

  // ------------------------------------------------------------------
  // 16. MOBILE MENU DRAWER
  // ------------------------------------------------------------------
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuToggle && mobileDrawer) {
    mobileMenuToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      playSynthSound(600, 'triangle', 0.06);
    });
  }

  if (mobileDrawerClose && mobileDrawer) {
    mobileDrawerClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });

  // Sound effects on interactive buttons
  document.querySelectorAll('.btn-primary, .btn-secondary, .filter-tab, .contact-tile').forEach(el => {
    el.addEventListener('mouseenter', () => {
      playSynthSound(850, 'sine', 0.04, 0.015);
    });
  });

});
