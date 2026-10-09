/* ==========================================================================
   SG ENTERPRISES EV - INTERACTIVE JAVASCRIPT & CALCULATOR ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initHeroSlider();
    calculateSavings();
});

// Hero Slider Functions
let currentHeroSlideIndex = 0;
let heroSlideTimer = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    startHeroSliderTimer();

    const sliderWrapper = document.getElementById('heroSlidesWrapper');
    if (sliderWrapper) {
        let touchStartX = 0;
        let touchEndX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 40) {
                nextHeroSlide();
            } else if (touchEndX - touchStartX > 40) {
                prevHeroSlide();
            }
        }, { passive: true });
    }
}

function startHeroSliderTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        nextHeroSlide();
    }, 3800);
}

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroSliderDots .dot');
    if (!slides.length) return;

    if (index >= slides.length) currentHeroSlideIndex = 0;
    else if (index < 0) currentHeroSlideIndex = slides.length - 1;
    else currentHeroSlideIndex = index;

    slides.forEach((slide, i) => {
        if (i === currentHeroSlideIndex) slide.classList.add('active');
        else slide.classList.remove('active');
    });

    dots.forEach((dot, i) => {
        if (i === currentHeroSlideIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

function nextHeroSlide() {
    showHeroSlide(currentHeroSlideIndex + 1);
    startHeroSliderTimer();
}

function prevHeroSlide() {
    showHeroSlide(currentHeroSlideIndex - 1);
    startHeroSliderTimer();
}

function goToHeroSlide(index) {
    showHeroSlide(index);
    startHeroSliderTimer();
}

// Mobile Drawer Navigation
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    if (drawer) drawer.classList.toggle('active');
}

// Model Category Filters
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const modelCards = document.querySelectorAll('.model-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            modelCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Interactive Petrol vs EV Savings Calculator
function calculateSavings() {
    const dailyKmInput = document.getElementById('dailyKm');
    const petrolPriceInput = document.getElementById('petrolPrice');
    const mileageInput = document.getElementById('mileageVal');

    if (!dailyKmInput || !petrolPriceInput || !mileageInput) return;

    const dailyKm = parseFloat(dailyKmInput.value);
    const petrolPrice = parseFloat(petrolPriceInput.value);
    const mileage = parseFloat(mileageInput.value);

    // Update Label UI
    document.getElementById('dailyKmVal').textContent = `${dailyKm} KM`;
    document.getElementById('petrolPriceVal').textContent = `₹${petrolPrice} / Litre`;
    document.getElementById('mileageDisplay').textContent = `${mileage} KM/L`;

    // Calculations
    const monthlyDistance = dailyKm * 30; // 30 days
    const monthlyPetrolLitres = monthlyDistance / mileage;
    const monthlyPetrolCost = monthlyPetrolLitres * petrolPrice;

    // EV Electricity Cost (approx 1.5 units per 50 km @ ₹8/unit)
    const unitsPerKm = 1.5 / 50;
    const monthlyEvUnits = monthlyDistance * unitsPerKm;
    const monthlyEvCost = monthlyEvUnits * 8; // ₹8 per electricity unit

    const monthlySavings = monthlyPetrolCost - monthlyEvCost;
    const annualSavings = monthlySavings * 12;

    // Update Result UI
    document.getElementById('monthlyPetrol').textContent = `₹${Math.round(monthlyPetrolCost).toLocaleString('en-IN')}`;
    document.getElementById('monthlyEv').textContent = `₹${Math.round(monthlyEvCost).toLocaleString('en-IN')}`;
    document.getElementById('monthlySavings').textContent = `₹${Math.round(monthlySavings).toLocaleString('en-IN')}`;
    document.getElementById('annualSavings').textContent = `₹${Math.round(annualSavings).toLocaleString('en-IN')}`;
}

// Direct Model WhatsApp Quote Sender
function sendWhatsAppQuote(modelName, price) {
    const message = `Hello SG ENTERPRISES Showroom!\n\nI am interested in getting an On-Road Price Quote & Finance EMI details for:\n\n🛵 Scooter Model: ${modelName}\n💰 Ex-Showroom Price: ₹${price}\n\nPlease share catalog & showroom offers.`;
    const whatsappUrl = `https://wa.me/919031527881?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
}

// Test Drive Modal Functions
function openTestDriveModal(modelName = 'Storm Pro EV') {
    const modal = document.getElementById('testDriveModal');
    const modelSpan = document.getElementById('modalModelName');
    if (modelSpan) modelSpan.textContent = modelName;

    const selectedModelDropdown = document.getElementById('selectedModel');
    if (selectedModelDropdown) {
        for (let i = 0; i < selectedModelDropdown.options.length; i++) {
            if (selectedModelDropdown.options[i].value.toLowerCase().includes(modelName.toLowerCase()) ||
                modelName.toLowerCase().includes(selectedModelDropdown.options[i].value.toLowerCase())) {
                selectedModelDropdown.selectedIndex = i;
                break;
            }
        }
    }

    if (modal) modal.classList.add('active');
}

function closeTestDriveModal() {
    const modal = document.getElementById('testDriveModal');
    if (modal) modal.classList.remove('active');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('testDriveModal');
    if (e.target === modal) {
        closeTestDriveModal();
    }
});

// Form Submissions
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const model = document.getElementById('selectedModel').value;
    const date = document.getElementById('preferredDate').value || 'As soon as possible';
    const city = document.getElementById('userCity').value || 'Lodipur, Patna / Nearby';

    const message = `Hello SG ENTERPRISES Showroom!\n\nI want to book a Free Test Drive / Inquire about Scooter:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🛵 Model: ${model}\n📅 Preferred Date: ${date}\n📍 Location: ${city}`;

    const whatsappUrl = `https://wa.me/919031527881?text=${encodeURIComponent(message)}`;

    alert(`Thank you ${name}! Redirecting your test drive booking to SG ENTERPRISES Showroom on WhatsApp...`);
    window.open(whatsappUrl, '_blank');
}

function handleModalSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const locality = document.getElementById('modalLocality').value || 'Test Drive Booking';
    const model = document.getElementById('modalModelName').textContent;

    const message = `Hello SG ENTERPRISES Showroom!\n\nI want to book a Free Test Drive for ${model}:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📍 City / Date: ${locality}`;

    const whatsappUrl = `https://wa.me/919031527881?text=${encodeURIComponent(message)}`;

    closeTestDriveModal();
    window.open(whatsappUrl, '_blank');
}

// Active Scroll Link Highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});
