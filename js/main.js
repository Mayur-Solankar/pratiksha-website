/**
 * ORACARE DENTAL CLINIC - INTERACTIVE JAVASCRIPT
 * Doctor: Dr. Pratiksha Barge | Dental Surgeon (MUHS) | Reg No. A-51828
 * Phone / WhatsApp: +91 9545058909
 * Timings: 10:00 AM - 3:00 PM & 5:00 PM - 9:00 PM
 */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatus();
  initMobileNav();
  initToothScrollJourney();
  initSymptomChecker();
  initBeforeAfterSlider();
  initAppointmentBooking();
  initFaqAccordion();
  initHeaderScroll();
  initLanguageSwitcher();
  initDistanceCalculator();
  initReviewModal();
  initToothbrushCoach();
});

/* ==========================================================================
   1. REAL-TIME CLINIC STATUS CHECKER (10am-3pm & 5pm-9pm)
   ========================================================================== */
function initClinicStatus() {
  const statusEl = document.getElementById('clinicLiveStatus');
  if (!statusEl) return;

  function updateStatus() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday...
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMinutes = hours * 60 + minutes;

    const morningStart = 10 * 60;      // 10:00 AM
    const morningEnd = 15 * 60;        // 3:00 PM
    const eveningStart = 17 * 60;      // 5:00 PM
    const eveningEnd = 21 * 60;        // 9:00 PM

    // Sunday logic: By appointment / Emergency
    if (day === 0) {
      statusEl.innerHTML = `
        <span class="status-dot break"></span>
        <span>Sunday: Open by Prior Appointment (Call 9545058909)</span>
      `;
      return;
    }

    if (timeInMinutes >= morningStart && timeInMinutes < morningEnd) {
      statusEl.innerHTML = `
        <span class="status-dot online"></span>
        <span><strong>Open Now:</strong> Morning Clinic (Closes at 3:00 PM)</span>
      `;
    } else if (timeInMinutes >= morningEnd && timeInMinutes < eveningStart) {
      statusEl.innerHTML = `
        <span class="status-dot break"></span>
        <span><strong>Afternoon Break:</strong> Reopens at 5:00 PM (Evening Session)</span>
      `;
    } else if (timeInMinutes >= eveningStart && timeInMinutes < eveningEnd) {
      statusEl.innerHTML = `
        <span class="status-dot online"></span>
        <span><strong>Open Now:</strong> Evening Clinic (Closes at 9:00 PM)</span>
      `;
    } else {
      statusEl.innerHTML = `
        <span class="status-dot closed"></span>
        <span><strong>Closed for the Day:</strong> Opens Tomorrow at 10:00 AM</span>
      `;
    }
  }

  updateStatus();
  setInterval(updateStatus, 60000); // Check every minute
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER (iOS-compatible scroll lock)
   ========================================================================== */
function initMobileNav() {
  const openBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileNavDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer) return;

  let scrollY = 0;

  function openDrawer() {
    // iOS Safari fix: position:fixed prevents background scroll rubber-banding
    scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';
    drawer.classList.add('open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    // Restore scroll position after removing fixed positioning
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, scrollY);
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  // Close when tapping the overlay (outside drawer)
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  // Close when a nav link is tapped, then scroll to section accounting for sticky header
  drawerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      closeDrawer();
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        // Small delay to let drawer close animation complete before scrolling
        setTimeout(() => {
          const target = document.querySelector(href);
          if (target) {
            const headerHeight = document.querySelector('.main-header')?.offsetHeight || 64;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
          }
        }, 300);
      }
    });
  });
}

/* ==========================================================================
   3. SMART SMILE ASSESSMENT & SYMPTOM CHECKER (INTERACTIVE)
   ========================================================================== */
const symptomData = {
  toothache: {
    title: "Possible Deep Cavity or Root Infection",
    service: "Root Canal Treatment (RCT)",
    serviceSelectVal: "Root Canal",
    desc: "Severe throbbing toothache, sensitivity to hot/cold, or pain while chewing usually indicates the tooth pulp is inflamed or infected. Dr. Pratiksha Barge performs gentle, rotary-assisted painless Root Canal treatments to save the natural tooth.",
    badge: "Immediate Pain Relief Available"
  },
  crooked: {
    title: "Teeth Misalignment & Spacing",
    service: "Invisible Aligners & Braces",
    serviceSelectVal: "Aligners & Braces",
    desc: "Crooked, crowded, or gapped teeth can be corrected seamlessly using custom Clear Invisible Aligners or aesthetic ceramic braces. Oracare provides digital treatment simulations to preview your future smile before starting.",
    badge: "Discreet & Comfortable"
  },
  missing: {
    title: "Missing Tooth Replacement",
    service: "Dental Implants / Crown & Bridge",
    serviceSelectVal: "Implants",
    desc: "A missing tooth causes adjacent teeth to drift and hampers natural chewing. Dental Implants are permanent, titanium root replacements topped with realistic zirconia crowns that look and feel 100% natural.",
    badge: "Lifelong Solution"
  },
  discolored: {
    title: "Tooth Staining & Dull Smile",
    service: "Smile Design & Teeth Whitening",
    serviceSelectVal: "Smile Design",
    desc: "Stubborn stains from tea, coffee, smoking, or natural enamel aging can be lifted by 4-8 shades with professional dental-grade whitening or ultra-thin porcelain cosmetic veneers.",
    badge: "Instant Glow in 45 Mins"
  },
  gums: {
    title: "Bleeding Gums & Plaque Buildup",
    service: "Deep Teeth Cleaning & Gum Therapy",
    serviceSelectVal: "General Dentistry",
    desc: "Bleeding during brushing, bad breath, or tartar buildup indicates gingivitis. Ultrasonic scaling gently removes bacteria and calculus without damaging enamel, restoring firm, pink gums.",
    badge: "Preventive Care"
  }
};

function initSymptomChecker() {
  const cards = document.querySelectorAll('.symptom-card');
  const resultCard = document.getElementById('assessmentResultCard');
  const resultTitle = document.getElementById('resultTitle');
  const resultDesc = document.getElementById('resultDesc');
  const resultBadge = document.getElementById('resultBadge');
  const resultBookBtn = document.getElementById('resultBookBtn');

  if (!cards.length || !resultCard) return;

  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');

      const symptomKey = card.getAttribute('data-symptom');
      const data = symptomData[symptomKey];

      if (data) {
        resultTitle.innerHTML = `<span>💡</span> Recommended: ${data.service}`;
        resultDesc.textContent = data.desc;
        resultBadge.textContent = data.badge;

        resultCard.classList.add('active');

        // Scroll smoothly to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Update appointment form pre-selection
        const serviceSelect = document.getElementById('appointmentService');
        if (serviceSelect) {
          serviceSelect.value = data.serviceSelectVal;
        }

        const notesField = document.getElementById('appointmentNotes');
        if (notesField && (!notesField.value || notesField.value.startsWith('Concern:'))) {
          notesField.value = `Concern: ${card.querySelector('h4').innerText}`;
        }
      }
    });
  });

  if (resultBookBtn) {
    resultBookBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const bookingSection = document.getElementById('appointment');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

/* ==========================================================================
   4. INTERACTIVE BEFORE & AFTER SLIDER (BULLETPROOF & ACCESSIBLE)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('baSlider');
  const rangeInput = document.getElementById('baRangeSlider');
  const handle = document.getElementById('baHandle');
  const afterLayer = document.getElementById('baAfterLayer');
  const quickBtns = document.querySelectorAll('.ba-quick-btn');

  if (!container || !handle || !afterLayer) return;

  function setSliderPosition(val) {
    const percentage = Math.max(0, Math.min(100, parseFloat(val)));
    
    if (rangeInput) {
      rangeInput.value = percentage;
    }
    
    handle.style.left = `${percentage}%`;
    afterLayer.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
    afterLayer.style.webkitClipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;

    // Highlight active quick button if matches preset
    quickBtns.forEach(btn => {
      const target = parseFloat(btn.getAttribute('data-pos'));
      if (Math.abs(target - percentage) < 2) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // 1. Range input event (covers mobile touch, desktop drag, keyboard arrows, accessibility)
  if (rangeInput) {
    rangeInput.addEventListener('input', (e) => {
      setSliderPosition(e.target.value);
    });
    rangeInput.addEventListener('change', (e) => {
      setSliderPosition(e.target.value);
    });
  }

  // 2. Direct click / drag on container
  let isPointerDown = false;

  function handlePointerMove(e) {
    if (!isPointerDown) return;
    const rect = container.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const offsetX = clientX - rect.left;
    const percentage = (offsetX / rect.width) * 100;
    setSliderPosition(percentage);
  }

  container.addEventListener('mousedown', (e) => {
    isPointerDown = true;
    handlePointerMove(e);
  });

  window.addEventListener('mousemove', (e) => {
    if (isPointerDown) {
      e.preventDefault();
      handlePointerMove(e);
    }
  });

  window.addEventListener('mouseup', () => {
    isPointerDown = false;
  });

  // Touch fallback
  container.addEventListener('touchstart', (e) => {
    isPointerDown = true;
    handlePointerMove(e);
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isPointerDown) {
      handlePointerMove(e);
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isPointerDown = false;
  });

  // 3. Quick Compare Preset Buttons (50% Split, 100% Before, 100% After)
  quickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pos = btn.getAttribute('data-pos');
      if (pos !== null) {
        setSliderPosition(pos);
      }
    });
  });

  // Initialize at 50%
  setSliderPosition(50);
}

/* ==========================================================================
   5. APPOINTMENT BOOKING FORM & DIRECT WHATSAPP INTEGRATION
   ========================================================================== */
function initAppointmentBooking() {
  const form = document.getElementById('appointmentForm');
  const feedback = document.getElementById('bookingFeedback');
  const dateInput = document.getElementById('appointmentDate');

  if (dateInput) {
    // Restrict date picker to today and future
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Session radio active styling
  const radioCards = document.querySelectorAll('.session-radio-card');
  radioCards.forEach(card => {
    const radio = card.querySelector('input[type="radio"]');
    if (radio) {
      radio.addEventListener('change', () => {
        radioCards.forEach(c => c.classList.remove('active'));
        if (radio.checked) card.classList.add('active');
      });
    }
  });

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('appointmentName').value.trim();
    const phone = document.getElementById('appointmentPhone').value.trim();
    const date = document.getElementById('appointmentDate').value;
    const session = form.querySelector('input[name="session"]:checked')?.value || "Morning (10am-3pm)";
    const service = document.getElementById('appointmentService').value;
    const notes = document.getElementById('appointmentNotes').value.trim();

    if (!name || !phone || !date) {
      alert("Please fill in your name, contact number, and preferred date.");
      return;
    }

    // Build the formatted WhatsApp message for Dr. Pratiksha Barge
    const formattedMsg = 
`*New Dental Appointment Request - Oracare Dental Clinic*
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 *Patient Name:* ${name}
📞 *Contact No:* ${phone}
📅 *Preferred Date:* ${date}
⏰ *Time Slot:* ${session}
🦷 *Service Needed:* ${service}
${notes ? `📝 *Notes/Symptoms:* ${notes}` : ''}
📍 *Clinic Location:* Shop no. 11, Ground Floor, Shantai Divine Vastu, Kate Wasti, Punawale, Pimpri-Chinchwad, 411033
━━━━━━━━━━━━━━━━━━━━━━━━━━
_Sent via Oracare Dental Clinic Website_`;

    const whatsappUrl = `https://wa.me/919545058909?text=${encodeURIComponent(formattedMsg)}`;

    if (feedback) {
      feedback.classList.add('success');
      feedback.innerHTML = `
        <strong>✓ Request Created!</strong> Opening WhatsApp to send your details directly to Dr. Pratiksha Barge (+91 9545058909)...
      `;
    }

    // Open WhatsApp in a new window/app
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 600);
  });
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answerEl = item.querySelector('.faq-answer');

    if (!questionBtn || !answerEl) return;

    // Automatically set height for any pre-expanded active item
    if (item.classList.contains('active')) {
      answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
    }

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close other accordion items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) otherAnswer.style.maxHeight = null;
        }
      });

      if (!isActive) {
        item.classList.add('active');
        answerEl.style.maxHeight = answerEl.scrollHeight + 'px';
      } else {
        item.classList.remove('active');
        answerEl.style.maxHeight = null;
      }
    });
  });
}

/* ==========================================================================
   7. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

/* ==========================================================================
   8. MARATHI / ENGLISH ONE-TAP LANGUAGE SWITCHER
   ========================================================================== */
const i18nDictionary = {
  mr: {
    nav_home: "मुखपृष्ठ",
    nav_services: "उपचार",
    nav_symptoms: "लक्षण तपासणी",
    nav_doctor: "डॉ. प्रतीक्षा बार्गे",
    nav_gallery: "स्माईल मेकओव्हर",
    nav_appointment: "अपॉइंटमेंट",
    nav_location: "क्लिनिक व वेळ",
    nav_faq: "नेहमी विचारले जाणारे प्रश्न",
    nav_call: "कॉल करा",
    nav_book: "अपॉइंटमेंट बुक करा",
    drawer_brush: "२-मिनिट दात घासण्याचा कोच",
    hero_book: "अपॉइंटमेंट बुक करा",
    hero_whatsapp: "व्हॉट्सॲप करा",
    hero_call: "कॉल करा 9545058909",
    hero_brush_btn: "२-मिनिट ब्रशिंग कोच",
    dist_title: "तुम्ही ओराकेअरपासून किती अंतरावर आहात?",
    dist_sub: "तुमच्या स्थानावरून थेट अंतर व प्रवासाचा वेळ तपासा.",
    dist_btn: "अंतर व प्रवासाची वेळ तपासा",
    dist_lbl: "अंतर",
    dist_time_lbl: "अंदाजे वेळ",
    dist_nav_btn: "क्लिनिकसाठी GPS नेव्हिगेशन सुरू करा",
    visit_title: "ओराकेअर क्लिनिकला भेट देणार आहात?",
    visit_sub: "थेट Google Maps GPS ने मार्ग पहा",
    get_directions_btn: "रस्ता शोधा",
    brush_tag: "मुले व संपूर्ण कुटुंबासाठी ब्रशिंग कोच",
    brush_banner_title: "तुमची २-मिनिटांची दात घासण्याची पद्धत सुधारा! 🪥✨",
    brush_banner_sub: "८५% लोक ४५ सेकंदांपेक्षा कमी वेळ दात घासतात. दातांचे आरोग्य व इनॅमल सुरक्षित ठेवण्यासाठी डॉ. प्रतीक्षा बार्गे यांचा ४-क्वाड्रंट ऑडिओ टाइमर वापरा.",
    brush_btn_start: "ब्रशिंग कोच सुरू करा",
    brush_hint: "मुलांसाठी सोपा व मनोरंजक • मोबाईलवर वापरू शकता",
    reviews_modal_title: "गुगल पेशंट रिव्ह्यूज",
    leave_review_btn: "Google Maps वर रिव्ह्यू द्या / पहा",
    coach_modal_title: "२-मिनिट टूथब्रशिंग कोच",
    coach_badge: "डॉ. प्रतीक्षा बार्गे यांची ४-क्वाड्रंट पद्धत",
    q1_name: "वरचा उजवा भाग",
    q2_name: "वरचा डावा भाग",
    q3_name: "खालचा डावा भाग",
    q4_name: "खालचा उजवा भाग",
    seconds_left: "सेकंद शिल्लक",
    timer_start: "ब्रशिंग सुरू करा",
    celeb_title: "छान! चमकदार व निरोगी दात! ✨",
    celeb_msg: "तुम्ही डॉक्टरांनी शिफारस केलेले पूर्ण २-मिनिटांचे ब्रशिंग यशस्वीपणे पूर्ण केले आहे. निरोगी दातांसाठी हे दिवसातून २ वेळा करा!",
    brush_again: "पुन्हा सुरू करा",
    brush_book: "क्लिनिक चेकअप बुक करा",
    nav_journey: "टूथ जर्नी ✨",
    journey_badge: "आधुनिक डिजिटल दंत तंत्रज्ञान",
    journey_title: "निरोगी व सुंदर हास्याचा प्रवास",
    journey_subtitle: "डॉ. प्रतीक्षा बार्गे दात कसे स्वच्छ करतात, वाचवतात व मजबूत करतात हे खाली स्क्रोल करून पहा.",
    journey_step1_nav: "इनॅमल संरक्षण",
    journey_step2_nav: "रूट कॅनल",
    journey_step3_nav: "झिरकोनिया क्राउन",
    journey_step4_nav: "चमकदार हास्य",
    journey_c1_title: "इनॅमल संरक्षण व डीप क्लिनिंग",
    journey_c1_mr: "दातांचे नैसर्गिक इनॅमल संरक्षण व स्वच्छता",
    journey_c1_desc: "दातांचे नैसर्गिक इनॅमल हाडांपेक्षाही मजबूत असते. अल्ट्रासॉनिक क्लिनिंग आणि फ्लोराइड कोटिंगमुळे दातांचे इनॅमल न घासता टार्टर व बॅक्टेरिया पूर्णपणे निघून जातात.",
    journey_c2_title: "वेदनामुक्त रोटरी रूट कॅनल",
    journey_c2_mr: "वेदनामुक्त रोटरी रूट कॅनल उपचार",
    journey_c2_desc: "सड किंवा कीड नसेपर्यंत पोहोचल्यास दात काढण्याची गरज नसते. आधुनिक जर्मन रोटरी तंत्रज्ञानाने डॉ. प्रतीक्षा दात वाचवतात आणि १-२ फेऱ्यांमध्ये पूर्ण आराम देतात.",
    journey_c3_title: "मजबूत झिरकोनिया क्राउन व अलाइनर्स",
    journey_c3_mr: "मजबूत झिरकोनिया क्राउन व इनव्हिजिबल अलाइनर्स",
    journey_c3_desc: "डिजिटल ३D स्कॅनिंगने तयार केलेले झिरकोनिया क्राउन्स चघळण्याची पूर्ण ताकद देतात आणि पारदर्शक अलाइनर्स वाकडे दात सरळ करतात.",
    journey_c4_title: "आयुष्यभरासाठी निरोगी व सुंदर हास्य",
    journey_c4_mr: "आयुष्यभरासाठी निरोगी व सुंदर हास्य",
    journey_c4_desc: "नियमित स्वच्छता ते संपूर्ण स्माइल डिझाइन - ओराकेअरमध्ये प्रत्येक रुग्णाला मिळते सुरक्षित, सौम्य व दीर्घकाळ टिकणारी उपचार सेवा.",
    journey_btn_book: "अपॉइंटमेंट बुक करा"
  },
  en: {
    nav_home: "Home",
    nav_journey: "Tooth Journey",
    journey_badge: "Interactive Dental Engineering",
    journey_title: "The Anatomy of a Healthy Smile",
    journey_subtitle: "Scroll down to discover how Dr. Pratiksha protects, relieves, and restores your natural tooth at every depth.",
    journey_step1_nav: "Enamel Shield",
    journey_step2_nav: "Root Relief",
    journey_step3_nav: "Digital Crown",
    journey_step4_nav: "Radiant Smile",
    journey_c1_title: "Enamel Defense & Deep Hygiene",
    journey_c1_mr: "दातांचे नैसर्गिक इनॅमल संरक्षण व स्वच्छता",
    journey_c1_desc: "Your natural enamel is harder than bone, but vulnerable to micro-acid attacks. With ultrasonic scaling and protective fluoridation, Dr. Pratiksha removes calcified tartar without scraping natural tooth enamel.",
    journey_c2_title: "Painless Rotary Root Canal",
    journey_c2_mr: "वेदनामुक्त रोटरी रूट कॅनल उपचार",
    journey_c2_desc: "When decay reaches the internal nerve pulp, extraction isn't necessary. Using German endodontic rotary motors and apex locators, Dr. Pratiksha gently cleans the root canal system with zero pain.",
    journey_c3_title: "CAD/CAM Zirconia Crowns & Aligners",
    journey_c3_mr: "मजबूत झिरकोनिया क्राउन व इनव्हिजिबल अलाइनर्स",
    journey_c3_desc: "Custom-milled with digital 3D precision to match the natural shade and bite of your surrounding teeth. Zirconia crowns withstand 1,200+ MPa chewing force while clear aligners discreetly align crooked teeth.",
    journey_c4_title: "A Lifetime of Pain-Free Smiles",
    journey_c4_mr: "आयुष्यभरासाठी निरोगी व सुंदर हास्य",
    journey_c4_desc: "From preventive cleaning to full cosmetic smile rehabilitation, every treatment at Oracare is planned with long-term clinical durability and Dr. Pratiksha's gentle, patient-first care.",
    journey_btn_book: "Book Consultation",
    nav_services: "Treatments",
    nav_symptoms: "Symptom Checker",
    nav_doctor: "Dr. Pratiksha",
    nav_gallery: "Smile Gallery",
    nav_appointment: "Book Appointment",
    nav_location: "Clinic & Hours",
    nav_faq: "FAQ",
    nav_call: "Call",
    nav_book: "Book Appointment",
    drawer_brush: "2-Min Toothbrushing Coach",
    hero_book: "Book Consultation",
    hero_whatsapp: "WhatsApp Us",
    hero_call: "Call 9545058909",
    hero_brush_btn: "Try 2-Min Brushing Coach",
    dist_title: "How far are you from Oracare?",
    dist_sub: "Find live distance & driving time from your current location.",
    dist_btn: "Calculate Distance & Drive Time",
    dist_lbl: "Distance",
    dist_time_lbl: "Est. Drive Time",
    dist_nav_btn: "Start GPS Navigation to Clinic",
    visit_title: "Visiting Oracare Clinic?",
    visit_sub: "Navigate directly via Google Maps GPS",
    get_directions_btn: "Get Directions",
    brush_tag: "Kids & Family Interactive Routine",
    brush_banner_title: "Master Your 2-Minute Toothbrushing Routine! 🪥✨",
    brush_banner_sub: "Did you know 85% of people brush for less than 45 seconds? Use Dr. Pratiksha's 4-quadrant interactive brushing timer at home with gentle audio chimes to protect your family's enamel and gums.",
    brush_btn_start: "Start Brushing Coach Now",
    brush_hint: "Kid-friendly • Works on phone while brushing",
    reviews_modal_title: "Google Patient Reviews",
    leave_review_btn: "View / Write a Review on Google Maps",
    coach_modal_title: "2-Minute Toothbrushing Coach",
    coach_badge: "Dr. Pratiksha's 4-Quadrant Routine",
    q1_name: "Upper Right",
    q2_name: "Upper Left",
    q3_name: "Lower Left",
    q4_name: "Lower Right",
    seconds_left: "seconds left",
    timer_start: "Start Brushing",
    celeb_title: "Sparkling Clean Smile! Great Job!",
    celeb_msg: "You completed the full 2-minute dentist-recommended routine. Do this twice daily for cavity-free teeth!",
    brush_again: "Brush Again",
    brush_book: "Book Clean-up Checkup"
  }
};

function initLanguageSwitcher() {
  const desktopBtn = document.getElementById('langToggleBtn');
  const drawerBtn = document.getElementById('drawerLangToggleBtn');
  const desktopLabel = document.getElementById('langLabel');
  const drawerLabel = document.getElementById('drawerLangLabel');

  let currentLang = localStorage.getItem('oracare_lang') || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('oracare_lang', lang);

    // Update buttons
    const nextLangText = lang === 'en' ? 'मराठी' : 'English';
    if (desktopLabel) desktopLabel.textContent = nextLangText;
    if (drawerLabel) drawerLabel.textContent = nextLangText;

    // Translate all [data-i18n] nodes
    const dict = i18nDictionary[lang] || i18nDictionary.en;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'en' ? 'mr' : 'en');
  }

  if (desktopBtn) desktopBtn.addEventListener('click', toggleLanguage);
  if (drawerBtn) drawerBtn.addEventListener('click', toggleLanguage);

  // Apply saved on initial load
  applyLanguage(currentLang);
}

/* ==========================================================================
   9. LIVE DISTANCE & DRIVING TIME CALCULATOR
   ========================================================================== */
function initDistanceCalculator() {
  const calcBtn = document.getElementById('calcDistanceBtn');
  const resultPanel = document.getElementById('distResultPanel');
  const distVal = document.getElementById('distVal');
  const timeVal = document.getElementById('timeVal');
  const distNote = document.getElementById('distNote');

  // Clinic GPS Coordinates: Shantai Divine Vastu, Kate Wasti, Punawale, Pimpri-Chinchwad
  const CLINIC_LAT = 18.63624;
  const CLINIC_LNG = 73.74831;

  if (!calcBtn || !resultPanel) return;

  function calculateHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  calcBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser. You can still tap 'Get Directions' to open Google Maps!");
      return;
    }

    calcBtn.disabled = true;
    calcBtn.innerHTML = `<span>⏳ Detecting location...</span>`;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const straightDist = calculateHaversine(userLat, userLng, CLINIC_LAT, CLINIC_LNG);
        // Estimate road distance (~1.3x straight-line) and speed (~25 km/h urban traffic)
        const roadDistKm = Math.max(0.5, (straightDist * 1.3));
        const driveMins = Math.max(3, Math.round((roadDistKm / 25) * 60));

        distVal.textContent = `${roadDistKm.toFixed(1)} km`;
        timeVal.textContent = `~${driveMins} mins`;

        if (roadDistKm <= 5) {
          distNote.textContent = "📍 You are very close! Punawale, Kate Wasti is just a few minutes drive.";
        } else if (roadDistKm <= 15) {
          distNote.textContent = "📍 Conveniently reachable via Mumbai-Pune Highway / Hinjawadi-Punawale Link.";
        } else {
          distNote.textContent = "📍 Located in Punawale, Pimpri-Chinchwad • Prior appointment recommended.";
        }

        resultPanel.style.display = 'block';
        calcBtn.style.display = 'none';
      },
      (err) => {
        calcBtn.disabled = false;
        calcBtn.innerHTML = `<i data-lucide="crosshair" style="width:16px;height:16px;"></i><span>Recalculate Distance</span>`;
        // Fallback for Punawale/Wakad local estimate
        distVal.textContent = "~2.8 km";
        timeVal.textContent = "~8 mins";
        distNote.textContent = "📍 Approximate estimate from nearby Wakad / Ravet / Tathawade area.";
        resultPanel.style.display = 'block';
        calcBtn.style.display = 'none';
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  });
}

/* ==========================================================================
   10. STICKY GOOGLE REVIEWS BADGE & MODAL
   ========================================================================== */
function initReviewModal() {
  const openBadge = document.getElementById('openReviewModalBtn');
  const modal = document.getElementById('reviewsModal');
  const closeBtn = document.getElementById('closeReviewsModalBtn');

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBadge) openBadge.addEventListener('click', openModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

/* ==========================================================================
   11. INTERACTIVE 2-MINUTE TOOTHBRUSHING COACH & QUADRANT TIMER
   ========================================================================== */
function initToothbrushCoach() {
  const modal = document.getElementById('brushCoachModal');
  const openBannerBtn = document.getElementById('openBrushCoachBtn');
  const openHeroBtn = document.getElementById('heroBrushCoachBtn');
  const openDrawerLink = document.getElementById('drawerBrushTimerLink');
  const closeBtn = document.getElementById('closeBrushCoachBtn');

  const playPauseBtn = document.getElementById('timerPlayPauseBtn');
  const resetBtn = document.getElementById('timerResetBtn');
  const audioToggleBtn = document.getElementById('timerAudioToggleBtn');
  const restartBtn = document.getElementById('restartBrushBtn');

  const progressCircle = document.getElementById('timerProgressCircle');
  const secondsDisplay = document.getElementById('quadrantSeconds');
  const totalDisplay = document.getElementById('totalTimeDisplay');
  const playPauseText = document.getElementById('playPauseText');

  const actionTitle = document.getElementById('brushActionTitle');
  const actionTip = document.getElementById('brushActionTip');
  const celebrationPanel = document.getElementById('brushCelebrationPanel');

  if (!modal) return;

  const quadrants = [
    {
      title: "Brush Upper Right Quadrant (वरचा उजवा भाग)",
      tip: "Clean the outer, chewing, and inner teeth surfaces using gentle small circular motions at a 45° angle to the gumline.",
      quadClass: "top-right",
      stepId: "quadStep1",
      mouthId: "mouthQ1"
    },
    {
      title: "Brush Upper Left Quadrant (वरचा डावा भाग)",
      tip: "Move smoothly to the upper left teeth. Don't press too hard — gentle brushing removes plaque without damaging enamel.",
      quadClass: "top-left",
      stepId: "quadStep2",
      mouthId: "mouthQ2"
    },
    {
      title: "Brush Lower Left Quadrant (खालचा डावा भाग)",
      tip: "Clean lower left teeth. Make sure to reach behind the back molars where food particles often hide.",
      quadClass: "bottom-left",
      stepId: "quadStep3",
      mouthId: "mouthQ3"
    },
    {
      title: "Brush Lower Right Quadrant (खालचा उजवा भाग)",
      tip: "Final quadrant! Finish with gentle strokes along the tongue and inner chewing surfaces for fresh breath.",
      quadClass: "bottom-right",
      stepId: "quadStep4",
      mouthId: "mouthQ4"
    }
  ];

  let currentQuadrantIndex = 0;
  let remainingQuadrantSeconds = 30;
  let totalRemainingSeconds = 120;
  let timerInterval = null;
  let isRunning = false;
  let isAudioEnabled = true;

  // Web Audio API Synth Chime (no external mp3 files needed)
  function playQuadrantChime(frequency = 587.33, duration = 0.3) {
    if (!isAudioEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio not permitted without interaction
    }
  }

  function playCelebrationFanfare() {
    if (!isAudioEnabled) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
      setTimeout(() => playQuadrantChime(freq, 0.4), i * 180);
    });
  }

  function updateQuadrantUI() {
    const quad = quadrants[currentQuadrantIndex];
    if (!quad) return;

    if (actionTitle) actionTitle.textContent = quad.title;
    if (actionTip) actionTip.textContent = quad.tip;

    // Update Steps
    document.querySelectorAll('.quad-step').forEach((step, idx) => {
      step.classList.remove('active', 'completed');
      if (idx < currentQuadrantIndex) {
        step.classList.add('completed');
      } else if (idx === currentQuadrantIndex) {
        step.classList.add('active');
      }
    });

    // Update Mouth Diagram
    document.querySelectorAll('.mouth-quad').forEach(mq => mq.classList.remove('active'));
    const activeMouth = document.getElementById(quad.mouthId);
    if (activeMouth) activeMouth.classList.add('active');
  }

  function updateTimerDisplay() {
    if (secondsDisplay) secondsDisplay.textContent = remainingQuadrantSeconds;

    const mins = Math.floor(totalRemainingSeconds / 60);
    const secs = totalRemainingSeconds % 60;
    if (totalDisplay) {
      totalDisplay.textContent = `Total: ${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Circular SVG Dashoffset (circumference = 540)
    if (progressCircle) {
      const progress = (30 - remainingQuadrantSeconds) / 30;
      const offset = progress * 540;
      progressCircle.style.strokeDashoffset = offset;
    }
  }

  function tick() {
    if (totalRemainingSeconds <= 0) {
      // Finished full routine!
      clearInterval(timerInterval);
      isRunning = false;
      playCelebrationFanfare();

      if (playPauseText) playPauseText.textContent = "Finished!";
      if (celebrationPanel) celebrationPanel.style.display = 'block';

      // Mark all completed
      document.querySelectorAll('.quad-step').forEach(s => s.classList.add('completed'));
      return;
    }

    remainingQuadrantSeconds--;
    totalRemainingSeconds--;

    // Switch quadrant every 30s
    if (remainingQuadrantSeconds <= 0 && totalRemainingSeconds > 0) {
      currentQuadrantIndex++;
      remainingQuadrantSeconds = 30;
      playQuadrantChime(880, 0.5); // Higher bell sound when switching quadrant!
      updateQuadrantUI();
    }

    updateTimerDisplay();
  }

  function startTimer() {
    if (isRunning) return;
    isRunning = true;
    if (playPauseText) playPauseText.textContent = "Pause Routine";
    if (celebrationPanel) celebrationPanel.style.display = 'none';

    playQuadrantChime(523.25, 0.2); // Start chime
    timerInterval = setInterval(tick, 1000);
  }

  function pauseTimer() {
    if (!isRunning) return;
    isRunning = false;
    clearInterval(timerInterval);
    if (playPauseText) playPauseText.textContent = "Resume Brushing";
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    currentQuadrantIndex = 0;
    remainingQuadrantSeconds = 30;
    totalRemainingSeconds = 120;

    if (playPauseText) playPauseText.textContent = "Start Brushing";
    if (celebrationPanel) celebrationPanel.style.display = 'none';

    updateQuadrantUI();
    updateTimerDisplay();
  }

  function openCoach() {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    resetTimer();
  }

  function closeCoach() {
    pauseTimer();
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBannerBtn) openBannerBtn.addEventListener('click', openCoach);
  if (openHeroBtn) openHeroBtn.addEventListener('click', openCoach);
  if (openDrawerLink) openDrawerLink.addEventListener('click', openCoach);
  if (closeBtn) closeBtn.addEventListener('click', closeCoach);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCoach();
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isRunning) {
        pauseTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetBtn) resetBtn.addEventListener('click', resetTimer);
  if (restartBtn) restartBtn.addEventListener('click', resetTimer);

  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      isAudioEnabled = !isAudioEnabled;
      const icon = document.getElementById('audioToggleIcon');
      if (icon) {
        icon.setAttribute('data-lucide', isAudioEnabled ? 'volume-2' : 'volume-x');
        if (window.lucide) lucide.createIcons();
      }
    });
  }

  // Setup initial display
  updateQuadrantUI();
  updateTimerDisplay();
}

/* ==========================================================================
   12. APPLE-STYLE INTERACTIVE TOOTH SCROLL JOURNEY (TIMELINE & PARALLAX)
   ========================================================================== */
function initToothScrollJourney() {
  const section = document.getElementById('tooth-journey');
  const timeline = document.getElementById('appleTimeline');
  if (!section || !timeline) return;

  const traveler = document.getElementById('toothTraveler');
  const tooth3D = document.getElementById('appleTooth3D');
  const internalLayer = document.getElementById('toothInternalLayer');
  const crownLayer = document.getElementById('toothCrownLayer');
  const auraRing = document.getElementById('toothAuraRing');
  const sparkles = document.getElementById('toothSparkles');
  const statusText = document.getElementById('toothStatusText');
  const spineLineFill = document.getElementById('spineLineFill');
  const rows = document.querySelectorAll('.timeline-row');

  // Refresh Lucide icons inside section
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  const stageTitlesEn = [
    "Stage 1: Enamel Protection",
    "Stage 2: Painless Rotary RCT",
    "Stage 3: CAD/CAM Digital Crown",
    "Stage 4: Lifetime Smile"
  ];

  const stageTitlesMr = [
    "टप्पा १: इनॅमल संरक्षण",
    "टप्पा २: वेदनामुक्त रोटरी RCT",
    "टप्पा ३: मजबूत झिरकोनिया क्राउन",
    "टप्पा ४: आयुष्यभरासाठी सुंदर हास्य"
  ];

  let isVisible = true;
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0 });
    observer.observe(section);
  }

  let lastStep = -1;
  window.addEventListener('languageChanged', () => {
    lastStep = -1;
  });

  function onScrollFrame() {
    if (isVisible && rows.length > 0 && traveler) {
      const timelineRect = timeline.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const timelineTop = window.pageYOffset + timelineRect.top;

      // Vertical bounds: clamped strictly between Row 1 and Row 4
      const row1 = rows[0];
      const row4 = rows[rows.length - 1];
      const toothHeight = traveler.offsetHeight || 330;

      const row1Center = row1.offsetTop + (row1.offsetHeight / 2);
      const row4Center = row4.offsetTop + (row4.offsetHeight / 2);

      // minY aligns tooth with Milestone 1 (never overlaps header!)
      const minY = Math.max(20, row1Center - toothHeight / 2);
      // maxY aligns tooth with Milestone 4 (never hangs over into next section!)
      const maxY = Math.max(minY, row4Center - toothHeight / 2);

      // Where the tooth wants to be: centered in user's viewport
      const viewportCenterOnPage = window.pageYOffset + windowHeight * 0.5;
      const targetY = viewportCenterOnPage - timelineTop - toothHeight / 2;

      // Clamp cleanly so tooth stays within timeline bounds
      const clampedY = Math.max(minY, Math.min(maxY, targetY));

      const isMobile = window.innerWidth <= 900;
      let progress = 0;
      let activeIndex = 0;

      if (!isMobile) {
        // Desktop: Physical vertical travel along the center spine
        traveler.style.transform = `translate3d(-50%, ${clampedY.toFixed(1)}px, 0)`;

        // Normalized progress between Row 1 and Row 4 [0.0, 1.0]
        const totalDistance = maxY - minY;
        progress = totalDistance > 0 ? (clampedY - minY) / totalDistance : 0;

        // Check which row is active based on tooth's vertical position
        const toothCenterY = clampedY + toothHeight / 2;
        rows.forEach((row, idx) => {
          const rowCenter = row.offsetTop + row.offsetHeight / 2;
          if (toothCenterY >= rowCenter - 120) {
            activeIndex = idx;
          }
        });
      } else {
        // Mobile: Clean sticky showcase stage under navbar
        traveler.style.transform = '';

        // Progress calculated from active card passing viewport center
        rows.forEach((row, idx) => {
          const rowRect = row.getBoundingClientRect();
          if (rowRect.top <= windowHeight * 0.58) {
            activeIndex = idx;
          }
        });

        const totalSteps = rows.length - 1;
        progress = totalSteps > 0 ? activeIndex / totalSteps : 0;
      }

      // Update spine neon fill line
      if (spineLineFill && !isMobile) {
        spineLineFill.style.height = `${(progress * 100).toFixed(1)}%`;
      }

      // Update active state on rows
      rows.forEach((row, idx) => {
        row.classList.toggle('active', idx === activeIndex);
      });

      // Update status text
      if (activeIndex !== lastStep) {
        lastStep = activeIndex;
        if (statusText) {
          const currentLang = localStorage.getItem('oracare_lang') || 'en';
          statusText.textContent = currentLang === 'mr'
            ? stageTitlesMr[activeIndex]
            : stageTitlesEn[activeIndex];
        }
      }

      // Dynamic 3D tooth tilt
      if (tooth3D) {
        const rotY = (progress - 0.5) * (isMobile ? 24 : 32);
        const rotX = Math.sin(progress * Math.PI) * -8;
        const scale = isMobile 
          ? (0.92 + Math.sin(progress * Math.PI) * 0.08) 
          : (0.95 + Math.sin(progress * Math.PI) * 0.12);
        tooth3D.style.transform = `perspective(1000px) rotateY(${rotY.toFixed(1)}deg) rotateX(${rotX.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
      }

      // Stage 2: Internal Dentin & Pulp Chamber cross-section reveal (progress 0.18 - 0.55)
      if (internalLayer) {
        if (progress > 0.18 && progress < 0.55) {
          let opacity = 0;
          if (progress < 0.35) {
            opacity = (progress - 0.18) / 0.17;
          } else {
            opacity = (0.55 - progress) / 0.15;
          }
          internalLayer.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(2);
        } else {
          internalLayer.style.opacity = '0';
        }
      }

      // Stage 3: Digital Crown Cap sliding down and docking (progress 0.42 - 0.82)
      if (crownLayer) {
        if (progress >= 0.42 && progress <= 0.82) {
          const crownProg = Math.max(0, Math.min(1, (progress - 0.42) / 0.22));
          const translateY = (-60 * (1 - crownProg)).toFixed(1);
          crownLayer.style.transform = `translate(0, ${translateY}px)`;
          crownLayer.style.opacity = crownProg.toFixed(2);
        } else if (progress > 0.82) {
          crownLayer.style.transform = 'translate(0, 0)';
          crownLayer.style.opacity = '1';
        } else {
          crownLayer.style.opacity = '0';
          crownLayer.style.transform = 'translate(0, -60px)';
        }
      }

      // Stage 4: Radiant Aura Glow & Sparkle Burst (progress 0.70 - 1.0)
      if (auraRing) {
        if (progress >= 0.70) {
          const auraProg = Math.min(1, (progress - 0.70) / 0.30);
          auraRing.style.opacity = auraProg.toFixed(2);
          auraRing.style.transform = `translate(-50%, -50%) scale(${(0.85 + auraProg * 0.3).toFixed(2)})`;
        } else {
          auraRing.style.opacity = '0';
          auraRing.style.transform = 'translate(-50%, -50%) scale(0.85)';
        }
      }

      if (sparkles) {
        if (progress >= 0.70) {
          sparkles.classList.add('visible');
        } else {
          sparkles.classList.remove('visible');
        }
      }
    }

    requestAnimationFrame(onScrollFrame);
  }

  requestAnimationFrame(onScrollFrame);
}


