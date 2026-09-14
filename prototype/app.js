/* ========================================
   ASORA - Application JavaScript
   ======================================== */

// ---- Sidebar Sub-Navigation Toggle ----
function toggleSubNav(navId) {
  const navItem = document.getElementById(navId);
  if (!navItem) {
    // Try parent
    const el = event.currentTarget.closest('.nav-item');
    if (el) el.classList.toggle('expanded');
    return;
  }
  navItem.classList.toggle('expanded');
}

// ---- Mobile Sidebar Toggle ----
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  sidebar.classList.toggle('open');
}

// ---- Groups Navigation (Grupos page) ----
let currentGroupIndex = 0;

function navigateGroups(direction) {
  const container = document.getElementById('groupCardsContainer');
  if (!container) return;

  const cards = container.querySelectorAll('.group-card');
  if (cards.length === 0) return;

  // Hide current card
  cards[currentGroupIndex].style.display = 'none';

  // Calculate new index
  currentGroupIndex += direction;
  if (currentGroupIndex < 0) currentGroupIndex = cards.length - 1;
  if (currentGroupIndex >= cards.length) currentGroupIndex = 0;

  // Show new card with animation
  const newCard = cards[currentGroupIndex];
  newCard.style.display = 'block';
  newCard.style.opacity = '0';
  newCard.style.transform = 'translateX(' + (direction > 0 ? '30px' : '-30px') + ')';

  requestAnimationFrame(() => {
    newCard.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    newCard.style.opacity = '1';
    newCard.style.transform = 'translateX(0)';
  });
}

// Initialize groups - show only the first card
function initGroups() {
  const container = document.getElementById('groupCardsContainer');
  if (!container) return;

  const cards = container.querySelectorAll('.group-card');
  cards.forEach((card, index) => {
    if (index !== 0) {
      card.style.display = 'none';
    }
  });
}

// ---- Info Modal (Grupos page) ----
const modalData = {
  metodos: {
    title: 'Información de Asesoría',
    items: [
      { icon: '📚', label: 'Asesoría', value: 'Métodos Numéricos' },
      { icon: '📝', label: 'Temas', value: 'Unidad 2' },
      { icon: '📅', label: 'Fecha', value: 'Martes 5 - Mayo 2025' },
      { icon: '📍', label: 'Lugar', value: 'Biblioteca, cubículo 3' },
      { icon: '🕐', label: 'Hora', value: '8:00 - 9:00 am' }
    ]
  },
  metodos2: {
    title: 'Información de Asesoría',
    items: [
      { icon: '📚', label: 'Asesoría', value: 'Métodos Numéricos' },
      { icon: '📝', label: 'Temas', value: 'Unidad 2' },
      { icon: '📅', label: 'Fecha', value: 'Jueves 7 - Mayo 2025' },
      { icon: '📍', label: 'Lugar', value: 'Biblioteca, cubículo 3' },
      { icon: '🕐', label: 'Hora', value: '11:00 - 12:00 pm' }
    ]
  },
  graficacion: {
    title: 'Información de Asesoría',
    items: [
      { icon: '📚', label: 'Asesoría', value: 'Graficación' },
      { icon: '📝', label: 'Temas', value: 'Escalamiento - Desplazamiento' },
      { icon: '📅', label: 'Fecha', value: 'Sábado 10 - Mayo 2025' },
      { icon: '🌐', label: 'Modalidad', value: 'Online — Google Meet' },
      { icon: '🕐', label: 'Hora', value: '7:00 - 8:00 am' }
    ]
  },
  graficacion2: {
    title: 'Información de Asesoría',
    items: [
      { icon: '📚', label: 'Asesoría', value: 'Graficación' },
      { icon: '📝', label: 'Temas', value: 'Escalamiento - Desplazamiento' },
      { icon: '📅', label: 'Fecha', value: 'Martes 6 - Mayo 2025' },
      { icon: '🌐', label: 'Modalidad', value: 'Online — Google Meet' },
      { icon: '🕐', label: 'Hora', value: '10:00 - 11:00 am' }
    ]
  },
  calculo: {
    title: 'Información de Asesoría',
    items: [
      { icon: '📚', label: 'Asesoría', value: 'Cálculo Integral' },
      { icon: '📝', label: 'Temas', value: 'Unidad 3 — Integrales por partes' },
      { icon: '📅', label: 'Fecha', value: 'Lunes, Miércoles, Viernes — Mayo 2025' },
      { icon: '📍', label: 'Lugar', value: 'Edificio C, Aula 201' },
      { icon: '🕐', label: 'Hora', value: '9:00 - 10:00 am' }
    ]
  }
};

function showInfoModal(key) {
  const modal = document.getElementById('infoModal');
  const title = document.getElementById('modalTitle');
  const body = document.getElementById('modalBody');

  if (!modal || !modalData[key]) return;

  const data = modalData[key];
  title.textContent = data.title;

  body.innerHTML = data.items.map(item => `
    <div class="modal-info-item">
      <div class="modal-info-icon">${item.icon}</div>
      <div>
        <div class="modal-info-label">${item.label}</div>
        <div class="modal-info-value">${item.value}</div>
      </div>
    </div>
  `).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeInfoModal() {
  const modal = document.getElementById('infoModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeInfoModal();
  }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeInfoModal();
  }
});

// ---- Carousel Dots ----
function initCarouselDots() {
  const dots = document.querySelectorAll('.carousel-dot');
  const track = document.getElementById('carouselTrack');
  if (!dots.length || !track) return;

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');

      // Scroll to card position
      const cards = track.querySelectorAll('.carousel-card');
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
    });
  });

  // Update dots on scroll
  track.addEventListener('scroll', () => {
    const scrollLeft = track.scrollLeft;
    const cardWidth = track.querySelector('.carousel-card')?.offsetWidth || 220;
    const gap = 24;
    const activeIndex = Math.round(scrollLeft / (cardWidth + gap));

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
  });
}

// ---- Search Functionality (basic filter) ----
function initSearch() {
  const searchInput = document.querySelector('.search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    // Filter advisory cards
    const cards = document.querySelectorAll('.advisory-card');
    cards.forEach(card => {
      const subject = card.querySelector('.card-subject')?.textContent.toLowerCase() || '';
      const username = card.querySelector('.card-username')?.textContent.toLowerCase() || '';
      const match = subject.includes(query) || username.includes(query) || query === '';
      card.style.display = match ? '' : 'none';
      card.style.opacity = match ? '1' : '0';
    });

    // Filter carousel cards
    const carouselCards = document.querySelectorAll('.carousel-card');
    carouselCards.forEach(card => {
      const subject = card.querySelector('.card-subject')?.textContent.toLowerCase() || '';
      const username = card.querySelector('.card-username')?.textContent.toLowerCase() || '';
      const match = subject.includes(query) || username.includes(query) || query === '';
      card.style.display = match ? '' : 'none';
    });
  });
}

// ---- Intersection Observer for Scroll Animations ----
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-fade-in-up').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(el);
  });
}

// ---- Responsive: show/hide mobile menu button ----
function handleResize() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (!menuBtn) return;

  if (window.innerWidth <= 1024) {
    menuBtn.style.display = 'flex';
  } else {
    menuBtn.style.display = 'none';
    document.getElementById('sidebar')?.classList.remove('open');
  }
}

// ---- Initialize Everything ----
document.addEventListener('DOMContentLoaded', () => {
  initGroups();
  initCarouselDots();
  initSearch();
  initScrollAnimations();
  handleResize();
  window.addEventListener('resize', handleResize);
});
