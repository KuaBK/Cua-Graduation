/**
 * Thiệp Mời Tốt Nghiệp — Nguyễn Tuấn Phong
 * Phiên bản Đại học Bách Khoa TP.HCM (HCMUT)
 * Xử lý mở thư 3D, khóa cuộn trang triệt để, nhạc nền YouTube, pháo hoa rơi liên tục & RSVP
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. DỮ LIỆU GALLERY 16 HÌNH ẢNH KỶ NIỆM BÁCH KHOA
  // =========================================================================
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

  // Tùy biến người nhận từ tham số URL (?name=... hoặc ?to=...)
  const urlParams = new URLSearchParams(window.location.search);
  const customGuest = urlParams.get('name') || urlParams.get('to') || urlParams.get('guest');
  if (customGuest) {
    const guestElements = document.querySelectorAll('.dynamic-guest-name');
    guestElements.forEach(el => el.textContent = customGuest);
  }

  // =========================================================================
  // 2. KHÓA CUỘN TRANG TRIỆT ĐỂ KHI CHƯA MỞ PHONG BÌ (FIX 100% LỖI CUỘN ĐƯỢC)
  // =========================================================================
  function isEnvelopeOpen() {
    const overlay = document.getElementById('envelope-overlay');
    return overlay && overlay.classList.contains('hide');
  }

  function preventScrollHandler(e) {
    if (!isEnvelopeOpen()) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function preventKeyScrollHandler(e) {
    if (!isEnvelopeOpen()) {
      // Chặn các phím cuộn: Space (32), PageUp (33), PageDown (34), End (35), Home (36), Arrows (37-40)
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
        return false;
      }
    }
  }

  window.addEventListener('wheel', preventScrollHandler, { passive: false });
  window.addEventListener('touchmove', preventScrollHandler, { passive: false });
  window.addEventListener('keydown', preventKeyScrollHandler, { passive: false });

  // Đảm bảo class envelope-active luôn có trên cả html và body ban đầu
  document.documentElement.classList.add('envelope-active');
  document.body.classList.add('envelope-active');

  // =========================================================================
  // 3. YOUTUBE MUSIC CONTROLLER (Video ID: b-FHfiM8ILo)
  // =========================================================================
  let ytPlayer = null;
  let isPlaying = false;

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const ytIframe = document.getElementById('youtube-bg-player');

  window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('youtube-bg-player', {
      events: {
        'onStateChange': onPlayerStateChange
      }
    });
  };

  function onPlayerStateChange(event) {
    if (event.data === 1) { // Đang phát
      setMusicUIState(true);
    } else if (event.data === 2 || event.data === 0) { // Tạm dừng hoặc hết
      setMusicUIState(false);
    }
  }

  function playMusic() {
    isPlaying = true;
    setMusicUIState(true);
    if (ytPlayer && ytPlayer.playVideo) {
      try { ytPlayer.playVideo(); } catch (e) { }
    } else if (ytIframe && ytIframe.contentWindow) {
      ytIframe.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    }
  }

  function pauseMusic() {
    isPlaying = false;
    setMusicUIState(false);
    if (ytPlayer && ytPlayer.pauseVideo) {
      try { ytPlayer.pauseVideo(); } catch (e) { }
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
          <div class="music-icon-wrap">
            <svg class="speaker-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
          <div class="music-icon-wrap">
            <svg class="speaker-icon icon-muted" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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

  // =========================================================================
  // 4. HIỆU ỨNG MỞ PHONG BÌ 3D HOÀNG GIA & MỞ KHÓA CUỘN
  // =========================================================================
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeScene = document.getElementById('envelope-scene');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeTapHint = document.getElementById('envelope-tap-hint');
  const letterOpenBtn = document.getElementById('letter-open-btn');
  const envelopeLetter = document.getElementById('envelope-letter');

  let isUnsealed = false;

  function unsealEnvelope() {
    if (isUnsealed) return;
    isUnsealed = true;

    // Phát nhạc ngay khi chạm con dấu (thỏa mãn gesture policy của trình duyệt)
    playMusic();

    envelopeScene.classList.add('unsealed');
    if (envelopeTapHint) {
      envelopeTapHint.textContent = '✦ Đang mở phong bì... ✦';
    }

    // Nổ pháo hoa vàng kim nhỏ tại con dấu
    fireWaxSealSparkles();

    setTimeout(() => {
      if (envelopeTapHint) {
        envelopeTapHint.textContent = '✦ Chạm vào lá thư để mở toàn bộ thiệp ✦';
      }
    }, 1100);
  }

  function openInvitation() {
    if (!isUnsealed) {
      unsealEnvelope();
      return;
    }

    if (!isPlaying) {
      playMusic();
    }

    // 1. MỞ KHÓA CUỘN TRANG HOÀN TOÀN
    document.documentElement.classList.remove('envelope-active');
    document.body.classList.remove('envelope-active');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.height = '';
    window.scrollTo(0, 0);

    // 2. Ẩn phong bì mượt mà
    envelopeOverlay.classList.add('hide');

    // 3. Bắn chùm pháo hoa chào mừng hoành tráng
    fireConfettiBurst();

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

  if (envelopeLetter) {
    envelopeLetter.addEventListener('click', function (e) {
      if (isUnsealed) {
        e.stopPropagation();
        openInvitation();
      }
    });
  }

  if (envelopeOverlay) {
    envelopeOverlay.addEventListener('click', function (e) {
      if (isUnsealed) {
        openInvitation();
      }
    });
  }

  // =========================================================================
  // 5. RENDER GALLERY POLAROID (TO HƠN RÕ RỆT TRÊN LAPTOP / PC)
  // =========================================================================
  const galleryGrid = document.getElementById('gallery-grid');
  const angles = [-2.5, 1.8, -1.2, 2.5, -1.8, 1.2, 2, -2, 1.5, -1.5, 2.2, -2.2, 1.6, -1.2, 1.8, -1.8];

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

  // =========================================================================
  // 6. LIGHTBOX MODAL
  // =========================================================================
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

  // Vuốt chuyển ảnh trên màn hình cảm ứng
  let touchStartX = 0;
  let touchEndX = 0;

  if (lightboxOverlay) {
    lightboxOverlay.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxOverlay.addEventListener('touchend', function (e) {
      touchEndX = e.changedTouches[0].screenX;
      if (Math.abs(touchEndX - touchStartX) > 45) {
        if (touchEndX < touchStartX) nextPhoto();
        else prevPhoto();
      }
    }, { passive: true });
  }

  window.addEventListener('keydown', function (e) {
    if (!lightboxOverlay || !lightboxOverlay.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // =========================================================================
  // 7. ĐẾM NGƯỢC THỜI GIAN (COUNTDOWN)
  // =========================================================================
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

  // =========================================================================
  // 8. BẢN ĐỒ & SAO CHÉP ĐỊA CHỈ
  // =========================================================================
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

  // =========================================================================
  // 9. FORM RSVP (XANH LÁ & ĐỎ CHUẨN XÁC THEO ẢNH 4)
  // =========================================================================
  const rsvpForm = document.getElementById('rsvp-form');
  const rsvpSuccess = document.getElementById('rsvp-success');
  const btnAttend = document.getElementById('btn-attend');
  const btnDecline = document.getElementById('btn-decline');
  const attendanceInput = document.getElementById('attendance-value');
  const checkAttend = document.getElementById('check-attend');
  const checkDecline = document.getElementById('check-decline');

  function setAttendanceChoice(choice) {
    if (!attendanceInput) return;
    attendanceInput.value = choice;

    if (choice === 'attend') {
      // Sẽ tham dự -> XANH LÁ ACTIVE
      btnAttend.classList.add('active');
      if (checkAttend) checkAttend.style.display = 'inline';

      // Rất tiếc, không thể -> INACTIVE
      btnDecline.classList.remove('active');
      if (checkDecline) checkDecline.style.display = 'none';
    } else {
      // Rất tiếc, không thể -> ĐỎ ACTIVE (Ảnh 4)
      btnDecline.classList.add('active');
      if (checkDecline) checkDecline.style.display = 'inline';

      // Sẽ tham dự -> INACTIVE
      btnAttend.classList.remove('active');
      if (checkAttend) checkAttend.style.display = 'none';
    }
  }

  if (btnAttend) {
    btnAttend.addEventListener('click', function () {
      setAttendanceChoice('attend');
    });
  }

  if (btnDecline) {
    btnDecline.addEventListener('click', function () {
      setAttendanceChoice('cannot_attend');
    });
  }

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
      const phoneInput = document.getElementById('rsvp-phone');
      const wishInput = document.getElementById('rsvp-wish');
      const submitBtn = document.getElementById('rsvp-submit-btn');

      const rsvpData = {
        name: nameInput ? nameInput.value.trim() : '',
        phone: phoneInput ? phoneInput.value.trim() : '',
        status: attendanceInput ? attendanceInput.value : 'attend',
        wish: wishInput ? wishInput.value.trim() : '',
        timestamp: new Date().toISOString()
      };

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <div style="width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <span>Đang gửi phản hồi...</span>
        `;
      }

      setTimeout(() => {
        localStorage.setItem('graduation_rsvp_tuanphong', JSON.stringify(rsvpData));
        fireConfettiBurst();

        if (rsvpForm) rsvpForm.style.display = 'none';
        if (rsvpSuccess) {
          rsvpSuccess.style.display = 'block';
          document.getElementById('rsvp-success-name').textContent = rsvpData.name || 'Quý khách';
        }
      }, 700);
    });
  }

  // =========================================================================
  // 10. HIỆU ỨNG PHÁO HOA RƠI XUỐNG LIÊN TỤC (ẢNH 1 & 2) + PHÁO HOA NỔ
  // =========================================================================
  const canvas = document.getElementById('confetti-canvas');
  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Bảng màu rực rỡ như Ảnh 2: Teal/Cyan, Amber, Violet, Pink, Green, Sky Blue, Coral Red
  const CONFETTI_COLORS = [
    '#06b6d4', // Teal/Cyan
    '#f59e0b', // Vàng cam hổ phách
    '#a855f7', // Tím nhạt
    '#ec4899', // Hồng đào
    '#10b981', // Xanh ngọc
    '#38bdf8', // Xanh Bách Khoa sáng
    '#0054a6', // Xanh Bách Khoa
    '#ef4444'  // Đỏ tươi
  ];

  // 1. Pháo hoa giấy rơi nhẹ nhàng liên tục (Ảnh 1 & 2)
  const fallingFlakes = [];
  const FLAKE_COUNT = 55;

  function initFallingConfetti() {
    if (!canvas) return;
    fallingFlakes.length = 0;

    for (let i = 0; i < FLAKE_COUNT; i++) {
      fallingFlakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        w: Math.random() * 6 + 7,
        h: Math.random() * 8 + 9,
        vy: Math.random() * 1.3 + 0.7,
        vx: (Math.random() - 0.5) * 0.5,
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 2.2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        opacity: Math.random() * 0.35 + 0.65,
        seed: Math.random() * 100,
        shape: Math.random() > 0.4 ? 'pill' : 'circle'
      });
    }
  }

  // 2. Mảng pháo nổ khi mở thiệp hoặc gửi RSVP
  const burstParticles = [];

  function fireConfettiBurst() {
    if (!canvas) return;
    const count = 130;
    const startX = canvas.width / 2;
    const startY = canvas.height * 0.45;

    for (let i = 0; i < count; i++) {
      burstParticles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.85) * 20,
        size: Math.random() * 8 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        decay: Math.random() * 0.005 + 0.008
      });
    }
  }

  // Mini Sparkles khi bẻ con dấu sáp vàng
  function fireWaxSealSparkles() {
    if (!canvas) return;
    const sealColors = ['#f59e0b', '#fbbf24', '#fef08a', '#38bdf8', '#ffffff'];
    const count = 45;
    const startX = canvas.width / 2;
    const startY = canvas.height / 2;

    for (let i = 0; i < count; i++) {
      burstParticles.push({
        x: startX,
        y: startY,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.5) * 14,
        size: Math.random() * 5 + 3,
        color: sealColors[Math.floor(Math.random() * sealColors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: 'circle',
        decay: Math.random() * 0.015 + 0.015
      });
    }
  }

  // Vòng lặp Render 60fps mượt mà
  function loop(currentTime) {
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render pháo hoa rơi liên tục (Ảnh 1 & 2)
    for (let f of fallingFlakes) {
      f.y += f.vy;
      f.x += Math.sin(currentTime * 0.002 + f.seed) * 0.75 + f.vx;
      f.rotation += f.rSpeed;

      if (f.y > canvas.height + 20) {
        f.y = -20;
        f.x = Math.random() * canvas.width;
      }
      if (f.x < -20) f.x = canvas.width + 10;
      if (f.x > canvas.width + 20) f.x = -10;

      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate((f.rotation * Math.PI) / 180);
      ctx.globalAlpha = f.opacity;
      ctx.fillStyle = f.color;

      if (f.shape === 'pill') {
        ctx.beginPath();
        const r = Math.min(f.w, f.h) / 2.5;
        if (ctx.roundRect) {
          ctx.roundRect(-f.w / 2, -f.h / 2, f.w, f.h, r);
        } else {
          ctx.rect(-f.w / 2, -f.h / 2, f.w, f.h);
        }
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, f.w / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Render pháo nổ
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      let p = burstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.38;
      p.vx *= 0.985;
      p.rotation += p.rSpeed;
      p.opacity -= p.decay;

      if (p.opacity > 0) {
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
      } else {
        burstParticles.splice(i, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  initFallingConfetti();
  requestAnimationFrame(loop);

  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initFallingConfetti();
    }
  });

})();
