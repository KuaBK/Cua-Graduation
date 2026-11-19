/**
 * Thiệp Mời Tốt Nghiệp - Nguyễn Tuấn Phong
 * Script tương tác & Xử lý nhạc, phong bì, đếm ngược, gallery, RSVP
 */

(function () {
  'use strict';

  // --- 1. DỮ LIỆU GALLERY 16 HÌNH ẢNH ---
  const GALLERY_IMAGES = [
    {
      id: "img-c1",
      local: "images/gallery_01_img-c1.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795067176928_trungtuyen.jpg",
      caption: "Ngày trúng tuyển"
    },
    {
      id: "img-c2",
      local: "images/gallery_02_img-c2.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795067217444_ngyadau.jpg",
      caption: "Ngày đầu lên trường"
    },
    {
      id: "img-c3",
      local: "images/gallery_03_img-c3.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795068813257_hoitraikhoa.jpg",
      caption: "Hội trại khoa"
    },
    {
      id: "img-c4",
      local: "images/gallery_04_img-c4.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795068906727_vatly.jpg",
      caption: "Học vật lý bách khoa :)"
    },
    {
      id: "78527mj",
      local: "images/gallery_05_78527mj.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795068925051_thuchanh.jpg",
      caption: "Học thực hành"
    },
    {
      id: "7snupr2",
      local: "images/gallery_06_7snupr2.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795068962835_danhgiai.jpg",
      caption: "Đánh giải liên minh bách khoa"
    },
    {
      id: "p4dmcdp",
      local: "images/gallery_07_p4dmcdp.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069007399_quansu.jpg",
      caption: "Học quân sự"
    },
    {
      id: "1meb8sk",
      local: "images/gallery_08_1meb8sk.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069031556_caulacbo.jpg",
      caption: "Tham gia câu lạc bộ"
    },
    {
      id: "ainvtct",
      local: "images/gallery_09_ainvtct.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069059003_thuchanhvoidoanhnghiep.jpg",
      caption: "Code với doanh nghiệp"
    },
    {
      id: "q48asax",
      local: "images/gallery_10_q48asax.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069076896_chungchi.jpg",
      caption: "Rồi nhận cert =))"
    },
    {
      id: "8tomy15",
      local: "images/gallery_11_8tomy15.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069094873_thuctap.jpg",
      caption: "Thực tập ở VNPT"
    },
    {
      id: "waf7v81",
      local: "images/gallery_12_waf7v81.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069109658_vodich.jpg",
      caption: "Top 1 giải code ở trường hehe"
    },
    {
      id: "jn9d0zu",
      local: "images/gallery_13_jn9d0zu.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069132792_firstoffer.jpg",
      caption: "Công việc đầu tiên"
    },
    {
      id: "0f3h2om",
      local: "images/gallery_14_0f3h2om.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069148382_doan.jpg",
      caption: "Bảo vệ xong đồ án (9.5) =))"
    },
    {
      id: "fgakvdh",
      local: "images/gallery_15_fgakvdh.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069179848_newoffer.jpg",
      caption: "Công việc mớiii"
    },
    {
      id: "hlx7mgd",
      local: "images/gallery_16_hlx7mgd.jpg",
      remote: "https://fkgnwlypualzwxblqwsl.supabase.co/storage/v1/object/public/images/1795069196764_totnghiep.jpg",
      caption: "Nhận quyết định tốt nghiệp"
    }
  ];

  // Tùy biến người nhận từ URL (?name=... hoặc ?to=...)
  const urlParams = new URLSearchParams(window.location.search);
  const customGuest = urlParams.get('name') || urlParams.get('to') || urlParams.get('guest');
  if (customGuest) {
    const guestElements = document.querySelectorAll('.dynamic-guest-name');
    guestElements.forEach(el => el.textContent = customGuest);
  }

  // --- 2. YOUTUBE MUSIC CONTROLLER (Video ID: b-FHfiM8ILo) ---
  const YOUTUBE_VIDEO_ID = 'b-FHfiM8ILo';
  let ytPlayer = null;
  let isPlaying = false;
  let isPlayerReady = false;

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const ytIframe = document.getElementById('youtube-bg-player');

  // Khởi tạo YouTube Iframe API
  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('youtube-bg-player', {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function onPlayerReady(event) {
    isPlayerReady = true;
  }

  function onPlayerStateChange(event) {
    // 1: Playing, 2: Paused
    if (event.data === 1) {
      setMusicUIState(true);
    } else if (event.data === 2 || event.data === 0) {
      setMusicUIState(false);
    }
  }

  function playMusic() {
    isPlaying = true;
    setMusicUIState(true);
    if (ytPlayer && ytPlayer.playVideo) {
      try {
        ytPlayer.playVideo();
      } catch (e) {
        console.log('Play error:', e);
      }
    } else if (ytIframe && ytIframe.contentWindow) {
      ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  }

  function pauseMusic() {
    isPlaying = false;
    setMusicUIState(false);
    if (ytPlayer && ytPlayer.pauseVideo) {
      try {
        ytPlayer.pauseVideo();
      } catch (e) {
        console.log('Pause error:', e);
      }
    } else if (ytIframe && ytIframe.contentWindow) {
      ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
    }
  }

  function toggleMusic() {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  }

  function setMusicUIState(active) {
    isPlaying = active;
    if (musicToggleBtn) {
      if (active) {
        musicToggleBtn.classList.add('playing');
        musicToggleBtn.title = 'Tắt nhạc nền';
        musicToggleBtn.innerHTML = `
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
            </svg>
            <div class="eq-bars-wrap">
              <span class="eq-bar eq-bar-1"></span>
              <span class="eq-bar eq-bar-2"></span>
              <span class="eq-bar eq-bar-3"></span>
            </div>
          </div>
        `;
      } else {
        musicToggleBtn.classList.remove('playing');
        musicToggleBtn.title = 'Bật nhạc nền';
        musicToggleBtn.innerHTML = `
          <div class="flex items-center gap-1.5">
            <svg class="w-4 h-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="23" y1="9" x2="17" y2="15"></line>
              <line x1="17" y1="9" x2="23" y2="15"></line>
            </svg>
          </div>
        `;
      }
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleMusic();
    });
  }

  // --- 3. PHONG BÌ THIỆP MỜI (ENVELOPE INTRO) ---
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeScene = document.getElementById('envelope-scene');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeLetter = document.getElementById('envelope-letter');
  const envelopeTapHint = document.getElementById('envelope-tap-hint');
  const letterOpenBtn = document.getElementById('letter-open-btn');

  let isUnsealed = false;

  function unsealEnvelope() {
    if (isUnsealed) return;
    isUnsealed = true;

    // Phát nhạc ngay khi chạm con dấu sáp (Cử chỉ hợp lệ của người dùng trên Mobile)
    playMusic();

    envelopeScene.classList.add('unsealed');
    if (envelopeTapHint) {
      envelopeTapHint.textContent = 'Đang mở phong bì...';
    }

    setTimeout(() => {
      if (envelopeTapHint) {
        envelopeTapHint.textContent = 'Chạm bất kỳ đâu để vào thiệp';
      }
    }, 1200);
  }

  function openInvitation() {
    if (!isUnsealed) {
      unsealEnvelope();
      return;
    }

    // Đảm bảo nhạc đã phát
    if (!isPlaying) {
      playMusic();
    }

    // Ẩn phong bì mượt mà
    envelopeOverlay.classList.add('hide');

    // Bắn pháo hoa Confetti chào mừng
    fireConfetti();

    // Hiển thị nút loa góc phải
    if (musicToggleBtn) {
      musicToggleBtn.style.display = 'flex';
    }
  }

  if (waxSealBtn) {
    waxSealBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      unsealEnvelope();
    });
  }

  if (envelopeScene) {
    envelopeScene.addEventListener('click', function (e) {
      if (!isUnsealed) {
        unsealEnvelope();
      } else {
        openInvitation();
      }
    });
  }

  if (letterOpenBtn) {
    letterOpenBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      openInvitation();
    });
  }

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', function (e) {
      if (isUnsealed) {
        openInvitation();
      }
    });
  }

  // --- 4. RENDER GALLERY POLAROID ---
  const galleryGrid = document.getElementById('gallery-grid');
  const angles = [-3, 2, -1.5, 3, -2, 1, 2.5, -2.5, 1.5, -1, 3, -3, 2, -1.5, 2, -2];

  function renderGallery() {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    GALLERY_IMAGES.forEach((item, idx) => {
      const angle = angles[idx % angles.length];
      const card = document.createElement('div');
      card.className = 'polaroid-card';
      card.style.transform = `rotate(${angle}deg)`;
      card.setAttribute('data-index', idx);

      card.innerHTML = `
        <div class="polaroid-img-box">
          <img src="${item.local}" alt="${item.caption}" loading="lazy" onerror="this.onerror=null;this.src='${item.remote}';">
        </div>
        <div class="polaroid-caption" title="${item.caption}">${item.caption}</div>
      `;

      card.addEventListener('click', () => openLightbox(idx));
      galleryGrid.appendChild(card);
    });
  }

  renderGallery();

  // --- 5. LIGHTBOX MODAL ---
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIdx = 0;

  function openLightbox(idx) {
    currentPhotoIdx = idx;
    updateLightboxContent();
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = GALLERY_IMAGES[currentPhotoIdx];
    if (!item) return;
    lightboxImg.src = item.local;
    lightboxImg.onerror = function () {
      this.src = item.remote;
    };
    lightboxCaption.textContent = `${item.caption} (${currentPhotoIdx + 1} / ${GALLERY_IMAGES.length})`;
  }

  function nextPhoto() {
    currentPhotoIdx = (currentPhotoIdx + 1) % GALLERY_IMAGES.length;
    updateLightboxContent();
  }

  function prevPhoto() {
    currentPhotoIdx = (currentPhotoIdx - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
    updateLightboxContent();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); nextPhoto(); });
  if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); prevPhoto(); });

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('click', function (e) {
      if (e.target === lightboxOverlay) closeLightbox();
    });
  }

  // Hỗ trợ vuốt trên điện thoại cho Lightbox
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) {
        nextPhoto();
      } else {
        prevPhoto();
      }
    }
  }

  // Keyboard navigation
  window.addEventListener('keydown', function (e) {
    if (!lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // --- 6. ĐẾM NGƯỢC THỜI GIAN (COUNTDOWN) ---
  // Ngày tổ chức: 28/11/2026 16:30 (GMT+7)
  const TARGET_DATE = new Date('2026-11-28T16:30:00+07:00').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = TARGET_DATE - now;

    if (distance <= 0) {
      if (daysEl) daysEl.textContent = '00';
      if (hoursEl) hoursEl.textContent = '00';
      if (minutesEl) minutesEl.textContent = '00';
      if (secondsEl) secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // --- 7. BẢN ĐỒ & SAO CHÉP ĐỊA CHỈ ---
  const copyAddressBtn = document.getElementById('copy-address-btn');
  const toastMsg = document.getElementById('toast-msg');
  const FULL_ADDRESS = 'Trường Đại học Bách khoa - ĐHQG TPHCM (Cổng 1: 268 Lý Thường Kiệt, Phường 14, Quận 10, TP.HCM)';

  function showToast(msg) {
    if (!toastMsg) return;
    toastMsg.textContent = msg;
    toastMsg.classList.add('show');
    setTimeout(() => {
      toastMsg.classList.remove('show');
    }, 2800);
  }

  if (copyAddressBtn) {
    copyAddressBtn.addEventListener('click', function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(FULL_ADDRESS).then(() => {
          showToast('✓ Đã sao chép địa chỉ Bách Khoa!');
        }).catch(() => {
          fallbackCopyText(FULL_ADDRESS);
        });
      } else {
        fallbackCopyText(FULL_ADDRESS);
      }
    });
  }

  function fallbackCopyText(text) {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('✓ Đã sao chép địa chỉ Bách Khoa!');
  }

  // --- 8. FORM RSVP (XÁC NHẬN THAM DỰ) ---
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const rsvpRadioLabels = document.querySelectorAll('.rsvp-radio-btn');

  // Xử lý active radio
  rsvpRadioLabels.forEach(label => {
    const radio = label.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        rsvpRadioLabels.forEach(l => l.classList.remove('selected'));
        if (radio.checked) {
          label.classList.add('selected');
        }
      });
    }
  });

  // Kiểm tra nếu đã phản hồi trước đó
  const savedRsvp = localStorage.getItem('graduation_rsvp_tuanphong');
  if (savedRsvp) {
    try {
      const data = JSON.parse(savedRsvp);
      if (rsvpSuccess && rsvpForm) {
        rsvpForm.style.display = 'none';
        rsvpSuccess.style.display = 'block';
        document.getElementById('rsvp-success-name').textContent = data.name || 'Quý khách';
      }
    } catch (e) { }
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameInput = document.getElementById('rsvp-name');
      const guestsInput = document.getElementById('rsvp-guests');
      const wishInput = document.getElementById('rsvp-wish');
      const statusInput = document.querySelector('input[name="attendance"]:checked');
      const submitBtn = document.getElementById('rsvp-submit-btn');

      const rsvpData = {
        name: nameInput ? nameInput.value.trim() : '',
        status: statusInput ? statusInput.value : 'attend',
        guests: guestsInput ? guestsInput.value : '1',
        wish: wishInput ? wishInput.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Đang gửi phản hồi...</span>
        `;
      }

      setTimeout(() => {
        localStorage.setItem('graduation_rsvp_tuanphong', JSON.stringify(rsvpData));
        fireConfetti();

        if (rsvpForm) rsvpForm.style.display = 'none';
        if (rsvpSuccess) {
          rsvpSuccess.style.display = 'block';
          document.getElementById('rsvp-success-name').textContent = rsvpData.name || 'Quý khách';
        }
      }, 700);
    });
  }

  // --- 9. CONFETTI CANNON (CANVAS NATIVE TỰ VIẾT 100% OFFLINE) ---
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#f59e0b', '#fbbf24', '#ffffff', '#ec4899', '#10b981'];
    const particles = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.45,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    let animationId = null;
    let startTime = performance.now();

    function render(currentTime) {
      const elapsed = currentTime - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35; // gravity
        p.vx *= 0.985; // drag
        p.rotation += p.rSpeed;
        p.opacity = Math.max(0, 1 - elapsed / 2800);

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }

      if (alive && elapsed < 3000) {
        animationId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationId);
      }
    }

    animationId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', () => {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

})();
