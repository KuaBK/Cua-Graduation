/**
 * Thiệp Mời Tốt Nghiệp — Nguyễn Tuấn Phong
 * Phiên bản Đại học Bách Khoa TP.HCM (HCMUT)
 * Xử lý: Nhập tên lần đầu (lưu cookie & localStorage), xưng hô theo tên, mở thư tự động 3.5s,
 * khóa cuộn triệt để, nhạc nền YouTube, pháo hoa rơi liên tục & RSVP tinh gọn
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

  // =========================================================================
  // 2. QUẢN LÝ TÊN KHÁCH MỜI (LƯU COOKIE & LOCALSTORAGE, XƯNG HÔ THEO TÊN)
  // =========================================================================
  const guestNameModal = document.getElementById('guest-name-modal');
  const guestNameForm = document.getElementById('guest-name-form');
  const guestNameInput = document.getElementById('guest-name-input');
  const rsvpEditNameBtn = document.getElementById('rsvp-edit-name-btn');

  function getStoredGuestName() {
    // 1. Kiểm tra tham số URL (?name=... / ?to=...)
    const urlParams = new URLSearchParams(window.location.search);
    const paramName = urlParams.get('name') || urlParams.get('to') || urlParams.get('guest');
    if (paramName && paramName.trim()) {
      saveGuestName(paramName.trim());
      return paramName.trim();
    }

    // 2. Kiểm tra localStorage
    const localName = localStorage.getItem('graduation_guest_name');
    if (localName && localName.trim()) {
      return localName.trim();
    }

    // 3. Kiểm tra Cookie
    const cookies = document.cookie.split(';');
    for (let c of cookies) {
      const parts = c.trim().split('=');
      if (parts[0] === 'graduation_guest_name' && parts[1]) {
        try {
          const val = decodeURIComponent(parts[1]).trim();
          if (val) {
            localStorage.setItem('graduation_guest_name', val);
            return val;
          }
        } catch (e) { }
      }
    }

    return null;
  }

  function saveGuestName(name) {
    if (!name || !name.trim()) return;
    const cleanName = name.trim();
    localStorage.setItem('graduation_guest_name', cleanName);
    // Lưu cookie trong 1 năm
    document.cookie = `graduation_guest_name=${encodeURIComponent(cleanName)}; max-age=31536000; path=/; SameSite=Lax`;
    updateGuestNameDOM(cleanName);
  }

  function updateGuestNameDOM(name) {
    if (!name) return;
    const guestElements = document.querySelectorAll('.dynamic-guest-name');
    guestElements.forEach(el => el.textContent = name);

    // Điền sẵn tên vào ô "Tên của bạn" trong Sổ lưu bút & RSVP
    const nameField = document.getElementById('unified-guest-name') || document.getElementById('wish-author');
    if (nameField) {
      nameField.value = name;
    }
  }

  // =========================================================================
  // BẤT ĐỒNG BỘ: GHI NHẬN LƯỢT CLICK / TRUY CẬP THEO TÊN (ASYNC TRACKING)
  // =========================================================================
  function trackClick(action, details = '') {
    const guestName = getStoredGuestName() || 'Ẩn danh';
    const payload = JSON.stringify({ guest_name: guestName, action, details });
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/track-click', blob);
      } else {
        fetch('/api/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload
        }).catch(() => { });
      }
    } catch (e) { }
  }

  function showGuestNameModal(prefillName = '') {
    if (!guestNameModal) return;
    if (guestNameInput) {
      guestNameInput.value = prefillName;
    }
    guestNameModal.classList.add('show');
    setTimeout(() => {
      if (guestNameInput) guestNameInput.focus();
    }, 200);
  }

  function hideGuestNameModal() {
    if (!guestNameModal) return;
    guestNameModal.classList.remove('show');
  }

  // Khởi tạo kiểm tra tên người dùng
  const existingGuestName = getStoredGuestName();
  if (existingGuestName) {
    updateGuestNameDOM(existingGuestName);
    trackClick('visit', 'Truy cập lại trang thiệp');
  } else {
    // Nếu chưa có tên lưu, bắt buộc nhập tên ngay khi vừa vào trang
    showGuestNameModal();
  }

  if (guestNameForm) {
    guestNameForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const enteredName = guestNameInput ? guestNameInput.value.trim() : '';
      if (!enteredName) {
        if (guestNameInput) guestNameInput.focus();
        return;
      }
      saveGuestName(enteredName);
      hideGuestNameModal();
      showToast(`✓ Chào mừng ${enteredName} đến với thiệp mời!`);
      trackClick('set_name', `Khách nhập tên: ${enteredName}`);
    });
  }

  if (rsvpEditNameBtn) {
    rsvpEditNameBtn.addEventListener('click', function () {
      const current = getStoredGuestName() || '';
      showGuestNameModal(current);
    });
  }

  // =========================================================================
  // 3. KHÓA CUỘN TRANG TRIỆT ĐỂ KHI CHƯA MỞ PHONG BÌ (FIX 100% LỖI CUỘN ĐƯỢC)
  // =========================================================================
  function isEnvelopeOpen() {
    const overlay = document.getElementById('envelope-overlay');
    return overlay && overlay.classList.contains('hide');
  }

  function preventScrollHandler(e) {
    if (!isEnvelopeOpen()) {
      const target = e.target;
      if (target && target.closest && target.closest('#guest-name-modal')) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  }

  function preventKeyScrollHandler(e) {
    const target = e.target;
    // Không chặn phím khi người dùng đang nhập họ tên hoặc gõ trong ô văn bản
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
      return;
    }
    if (!isEnvelopeOpen()) {
      // Chặn các phím cuộn: Space (32), PageUp (33), PageDown (34), End (35), Home (36), Arrows (37-40)
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode || e.which)) {
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
  // 4. BACKGROUND MUSIC CONTROLLER (HTML5 Native Audio - Không redirect app YouTube)
  // =========================================================================
  let isPlaying = false;

  const musicToggleBtn = document.getElementById('music-toggle-btn');
  const bgAudio = document.getElementById('bg-music');

  if (bgAudio) {
    bgAudio.addEventListener('play', () => {
      isPlaying = true;
      setMusicUIState(true);
    });
    bgAudio.addEventListener('pause', () => {
      isPlaying = false;
      setMusicUIState(false);
    });
    bgAudio.addEventListener('ended', () => {
      bgAudio.currentTime = 0;
      bgAudio.play().catch(() => {});
    });
  }

  function playMusic() {
    if (!bgAudio) return;
    const playPromise = bgAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlaying = true;
          setMusicUIState(true);
        })
        .catch(err => {
          console.warn('Audio play prevented or error:', err);
          isPlaying = false;
          setMusicUIState(false);
        });
    }
  }

  function pauseMusic() {
    if (!bgAudio) return;
    bgAudio.pause();
    isPlaying = false;
    setMusicUIState(false);
  }

  function toggleMusic() {
    if (bgAudio && !bgAudio.paused) {
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
      trackClick('music_toggle', isPlaying ? 'Phát nhạc' : 'Dừng nhạc');
    });
  }

  // =========================================================================
  // 4.1. NÚT CUỘN XUỐNG GỬI LỜI CHÚC (HIỆN RÕ KHI SCROLL & MỜ DẦN SAU 2 GIÂY)
  // =========================================================================
  const scrollWishesBtn = document.getElementById('scroll-wishes-btn');
  let scrollWishesTimer = null;

  function showScrollWishesBtn(durationMs = 2000) {
    if (!scrollWishesBtn) return;
    scrollWishesBtn.classList.remove('fading');
    scrollWishesBtn.classList.add('visible');

    if (scrollWishesTimer) {
      clearTimeout(scrollWishesTimer);
    }

    scrollWishesTimer = setTimeout(() => {
      scrollWishesBtn.classList.remove('visible');
      scrollWishesBtn.classList.add('fading');
    }, durationMs);
  }

  function hideScrollWishesBtn() {
    if (!scrollWishesBtn) return;
    scrollWishesBtn.classList.remove('visible');
    scrollWishesBtn.classList.add('fading');
    if (scrollWishesTimer) {
      clearTimeout(scrollWishesTimer);
      scrollWishesTimer = null;
    }
  }

  function updateScrollWishesVisibility() {
    if (!scrollWishesBtn) return;
    if (!isEnvelopeOpen()) {
      hideScrollWishesBtn();
      return;
    }

    const guestbookEl = document.getElementById('guestbook');
    if (guestbookEl) {
      const rect = guestbookEl.getBoundingClientRect();
      // Nếu khu vực sổ lưu bút đã cuộn vào tầm mắt thì ẩn nút
      if (rect.top <= window.innerHeight * 0.7) {
        hideScrollWishesBtn();
        return;
      }
    }

    // Khi cuộn trang: HIỆN RÕ NÉT (sẽ mờ dần sau 2s nếu ngừng cuộn)
    showScrollWishesBtn(2000);
  }

  window.addEventListener('scroll', updateScrollWishesVisibility, { passive: true });

  if (scrollWishesBtn) {
    scrollWishesBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const guestbookEl = document.getElementById('guestbook');
      if (guestbookEl) {
        guestbookEl.scrollIntoView({ behavior: 'smooth' });
        trackClick('scroll_wishes_btn', 'Bấm nút cuộn gửi lời chúc');
      }
    });
  }

  // =========================================================================
  // 5. HIỆU ỨNG MỞ PHONG BÌ 3D HOÀNG GIA: TỰ ĐỘNG VÀO SAU 3.5S (KHÔNG CẦN BẤM THÊM)
  // =========================================================================
  const envelopeOverlay = document.getElementById('envelope-overlay');
  const envelopeScene = document.getElementById('envelope-scene');
  const waxSealBtn = document.getElementById('wax-seal-btn');
  const envelopeTapHint = document.getElementById('envelope-tap-hint');
  const letterOpenBtn = document.getElementById('letter-open-btn');
  const envelopeLetter = document.getElementById('envelope-letter');

  let isUnsealed = false;
  let autoOpenTimer = null;
  let countdownInterval = null;

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

    // Hiển thị đếm lùi 3s trên lá thư và tự động vào trang (người dùng không cần bấm thêm nút nào)
    let secondsLeft = 2;
    const autoSecEl = document.getElementById('auto-seconds');
    if (autoSecEl) autoSecEl.textContent = String(secondsLeft);

    countdownInterval = setInterval(() => {
      secondsLeft--;
      if (autoSecEl && secondsLeft >= 0) {
        autoSecEl.textContent = String(secondsLeft);
      }
      if (secondsLeft <= 0) {
        clearInterval(countdownInterval);
        countdownInterval = null;
      }
    }, 1000);

    // Sau 3.5 giây hiện ra lá thư, tự động chuyển vào website
    autoOpenTimer = setTimeout(() => {
      openInvitation();
    }, 3500);
  }

  function openInvitation() {
    // Xóa timer nếu người dùng bấm chủ động để không bị trigger 2 lần
    if (autoOpenTimer) {
      clearTimeout(autoOpenTimer);
      autoOpenTimer = null;
    }
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
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

    trackClick('open_invitation', 'Mở phong bì vào website');

    if (musicToggleBtn) {
      musicToggleBtn.style.display = 'flex';
    }

    // Hiển thị nút "Kéo xuống để gửi lời chúc" chào mừng khoảng 2.5s rồi fade mờ dần
    setTimeout(() => {
      showScrollWishesBtn(2500);
    }, 1200);
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
  // 6. RENDER GALLERY POLAROID (TO HƠN RÕ RỆT TRÊN LAPTOP / PC)
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

      const thumbUrl = item.local.replace('images/', 'images/thumbs/');
      card.innerHTML = `
        <div class="polaroid-img-box">
          <img src="${thumbUrl}" alt="${item.caption}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${item.local}';">
        </div>
        <div class="polaroid-caption-wrap">
          <span class="polaroid-caption" title="${item.caption}">${item.caption}</span>
        </div>
      `;

      card.addEventListener('click', () => openLightbox(idx));
      galleryGrid.appendChild(card);
    });
  }

  renderGallery();

  // =========================================================================
  // 7. LIGHTBOX MODAL
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
    const item = GALLERY_IMAGES[idx];
    if (item) {
      trackClick('view_photo', `Xem ảnh: ${item.caption}`);
    }
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
  // 8. ĐẾM NGƯỢC THỜI GIAN (COUNTDOWN GỘP TRONG THẺ VINH DANH)
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
  // 9. BẢN ĐỒ & SAO CHÉP ĐỊA CHỈ
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
      trackClick('copy_address', 'Sao chép địa chỉ Bách Khoa');
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
  // 10. SỔ LƯU BÚT & XÁC NHẬN THAM DỰ HOÀNG GIA (GỘP CHUNG & ĐỒNG BỘ)
  // Kết nối Neon PostgreSQL: Load lời chúc THẬT từ DB, gửi phản hồi real-time
  // =========================================================================
  const wishesWall = document.getElementById('wishes-wall');
  const wishesCountNum = document.getElementById('wishes-count-num');
  const unifiedForm = document.getElementById('unified-guestbook-form');
  const unifiedNameInput = document.getElementById('unified-guest-name');
  const unifiedWishText = document.getElementById('unified-wish-text');
  const wishCharCount = document.getElementById('wish-char-count');
  const unifiedSubmitBtn = document.getElementById('unified-submit-btn');
  const unifiedSuccessBanner = document.getElementById('unified-success-banner');
  const btnAttend = document.getElementById('btn-attend');
  const btnDecline = document.getElementById('btn-decline');
  const attendanceInput = document.getElementById('attendance-value');
  const checkAttend = document.getElementById('check-attend');
  const checkDecline = document.getElementById('check-decline');

  // Điền trước tên khách đã lưu vào ô Tên của bạn
  if (unifiedNameInput) {
    const storedName = getStoredGuestName();
    if (storedName) unifiedNameInput.value = storedName;

    unifiedNameInput.addEventListener('input', function () {
      if (this.classList.contains('input-error')) {
        this.classList.remove('input-error');
      }
    });

    unifiedNameInput.addEventListener('change', function () {
      const val = this.value.trim();
      if (val) saveGuestName(val);
    });
  }

  // Đếm ký tự trong khung lời chúc
  if (unifiedWishText && wishCharCount) {
    unifiedWishText.addEventListener('input', function () {
      wishCharCount.textContent = `${this.value.length} / 500`;
    });
  }

  // Gợi ý lời chúc nhanh (Quick Chips)
  document.querySelectorAll('.wish-chip').forEach(chip => {
    chip.addEventListener('click', function () {
      const textToAppend = this.getAttribute('data-text');
      if (!unifiedWishText) return;
      if (unifiedWishText.value.trim().length > 0) {
        unifiedWishText.value += ' ' + textToAppend;
      } else {
        unifiedWishText.value = textToAppend;
      }
      if (wishCharCount) {
        wishCharCount.textContent = `${unifiedWishText.value.length} / 500`;
      }
      unifiedWishText.focus();
    });
  });

  // Chọn trạng thái tham dự (Sẽ tham dự / Rất tiếc, không thể)
  function setAttendanceChoice(choice) {
    if (!attendanceInput) return;
    attendanceInput.value = choice;

    if (choice === 'attend') {
      if (btnAttend) {
        btnAttend.classList.add('active');
        if (checkAttend) checkAttend.style.display = 'inline';
      }
      if (btnDecline) {
        btnDecline.classList.remove('active');
        if (checkDecline) checkDecline.style.display = 'none';
      }
    } else {
      if (btnDecline) {
        btnDecline.classList.add('active');
        if (checkDecline) checkDecline.style.display = 'inline';
      }
      if (btnAttend) {
        btnAttend.classList.remove('active');
        if (checkAttend) checkAttend.style.display = 'none';
      }
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

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Định dạng thời gian
  function formatTimeAgo(dateString) {
    if (!dateString) return 'Vừa xong';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now - date;
      const diffMin = Math.floor(diffMs / (1000 * 60));
      if (diffMin < 1) return 'Vừa xong';
      if (diffMin < 60) return `${diffMin} phút trước`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour} giờ trước`;
      return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    } catch (e) {
      return '';
    }
  }

  // Tạo thẻ thiệp lời chúc THẬT từ Database (Custom Royal Frosted Glass)
  function createRealWishCardElement(item, isNew = false) {
    const card = document.createElement('div');
    card.className = 'real-wish-card' + (isNew ? ' wish-card-pop' : '');

    const safeWish = escapeHtml(item.wish || '');
    const safeName = escapeHtml(item.name || 'Khách mời thương mến');
    const attendance = item.attendance || 'attend';
    const timeStr = formatTimeAgo(item.created_at);

    let badgeHtml = '';
    if (attendance === 'attend') {
      badgeHtml = `<span class="real-wish-badge badge-attend">✓ Sẽ tham dự</span>`;
    } else {
      badgeHtml = `<span class="real-wish-badge badge-decline">Rất tiếc vắng mặt</span>`;
    }

    card.innerHTML = `
      <div class="real-wish-header">
        <div class="real-wish-author">
          <span>🎓</span>
          <span>${safeName}</span>
        </div>
        ${badgeHtml}
      </div>
      <div class="real-wish-text">“${safeWish}”</div>
      <div class="real-wish-footer">
        <span>${timeStr}</span>
        <span class="real-wish-star">✦⁺</span>
      </div>
    `;
    return card;
  }

  // Tải danh sách lời chúc THỰC TẾ từ Neon PostgreSQL
  async function loadWishes() {
    if (!wishesWall) return;
    try {
      const res = await fetch('/api/wishes');
      if (!res.ok) throw new Error('HTTP error ' + res.status);
      const data = await res.json();
      const list = data.wishes || [];

      if (wishesCountNum) {
        wishesCountNum.textContent = String(list.length);
      }

      wishesWall.innerHTML = '';
      if (list.length === 0) {
        wishesWall.innerHTML = `
          <div class="wishes-empty-state">
            <span class="empty-icon">✍️</span>
            <strong style="color: #ffffff; font-size: 1.05rem;">Chưa có lời chúc nào trên bức tường</strong>
            <span>Hãy là người đầu tiên gửi gắm lời chúc ý nghĩa đến tân cử nhân nhé! ✨</span>
          </div>
        `;
        return;
      }

      list.forEach(item => {
        const card = createRealWishCardElement(item);
        wishesWall.appendChild(card);
      });
    } catch (err) {
      console.warn('Lỗi tải danh sách wishes từ DB:', err);
      wishesWall.innerHTML = `
        <div class="wishes-empty-state">
          <span>Không thể kết nối đến database. Vui lòng tải lại trang.</span>
        </div>
      `;
    }
  }

  loadWishes();

  // Xử lý gửi Form Gộp Sổ Lưu Bút & RSVP
  if (unifiedForm) {
    unifiedForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = unifiedNameInput ? unifiedNameInput.value.trim() : '';
      const wish = unifiedWishText ? unifiedWishText.value.trim() : '';
      const attendance = attendanceInput ? attendanceInput.value : 'attend';

      if (!name) {
        if (unifiedNameInput) {
          unifiedNameInput.classList.add('input-error');
          unifiedNameInput.focus();
          setTimeout(() => unifiedNameInput.classList.remove('input-error'), 1800);
        }
        showToast('⚠️ Tên không được để trống! Vui lòng nhập tên của bạn.');
        return;
      }

      saveGuestName(name);

      if (unifiedSubmitBtn) {
        unifiedSubmitBtn.disabled = true;
        unifiedSubmitBtn.innerHTML = `
          <div style="width: 16px; height: 16px; border: 2px solid #fff; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
          <span>Đang gửi đến máy chủ...</span>
        `;
      }

      try {
        const res = await fetch('/api/wishes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, wish, attendance })
        });
        const result = await res.json();

        if (res.ok && result.success) {
          // Xóa empty state nếu có
          const emptyPlaceholder = wishesWall.querySelector('.wishes-empty-state, .wishes-loading');
          if (emptyPlaceholder) emptyPlaceholder.remove();

          // Nếu có lời chúc, dán lên đầu bức tường
          if (result.wish) {
            const newCard = createRealWishCardElement(result.wish, true);
            wishesWall.prepend(newCard);
            wishesWall.scrollTop = 0;

            if (wishesCountNum) {
              const currentNum = parseInt(wishesCountNum.textContent, 10) || 0;
              wishesCountNum.textContent = String(currentNum + 1);
            }
          }

          // Pháo hoa chúc mừng
          fireConfettiBurst();

          // Hiện banner thành công
          if (unifiedSuccessBanner) {
            unifiedSuccessBanner.style.display = 'flex';
          }

          // Xóa nội dung khung lời chúc đã gửi
          if (unifiedWishText) {
            unifiedWishText.value = '';
            if (wishCharCount) wishCharCount.textContent = '0 / 500';
          }

          // Lưu trạng thái RSVP vào localStorage
          localStorage.setItem('graduation_rsvp_tuanphong', JSON.stringify({
            name,
            status: attendance,
            timestamp: new Date().toISOString()
          }));

          showToast('✓ Cảm ơn bạn đã phản hồi & gửi lời chúc!');
        } else {
          showToast('⚠️ ' + (result.error || 'Có lỗi xảy ra, vui lòng thử lại!'));
        }
      } catch (err) {
        console.error('Lỗi khi gửi form:', err);
        showToast('⚠️ Lỗi kết nối đến database!');
      } finally {
        if (unifiedSubmitBtn) {
          unifiedSubmitBtn.disabled = false;
          unifiedSubmitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
            <span>Gửi Lời Chúc & Xác Nhận ✦</span>
          `;
        }
      }
    });
  }

  // =========================================================================
  // HIỆU ỨNG CUỘN XUẤT HIỆN TOÀN TRANG (UNIVERSAL SCROLL REVEAL ANIMATION)
  // =========================================================================
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  }

  initScrollReveal();

  // =========================================================================
  // 11. HIỆU ỨNG PHÁO HOA RƠI XUỐNG LIÊN TỤC (ẢNH 1 & 2) + PHÁO HOA NỔ
  // =========================================================================
  const canvas = document.getElementById('confetti-canvas');
  let ctx = null;
  if (canvas) {
    ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Bảng màu rực rỡ: Teal/Cyan, Amber, Violet, Pink, Green, Sky Blue, Royal Blue, Coral Red
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
