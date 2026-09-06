/**
 * ORACARE DENTAL CLINIC - INTERACTIVE JAVASCRIPT
 * Doctor: Dr. Pratiksha Barge | Dental Surgeon (MUHS) | Reg No. A-51828
 * Phone / WhatsApp: +91 9545058909
 * Timings: 10:00 AM - 3:00 PM & 5:00 PM - 9:00 PM
 */

document.addEventListener('DOMContentLoaded', () => {
  initClinicStatus();
  initMobileNav();
  initSymptomChecker();
  initBeforeAfterSlider();
  initAppointmentBooking();
  initFaqAccordion();
  initHeaderScroll();
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
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const openBtn = document.getElementById('mobileMenuToggle');
  const closeBtn = document.getElementById('drawerClose');
  const drawer = document.getElementById('mobileNavDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeDrawer();
  });

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
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
