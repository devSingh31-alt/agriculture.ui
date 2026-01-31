// Component Loader
async function loadComponent(elementId, componentPath) {
    try {
        const response = await fetch(componentPath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${componentPath}:`, error);
    }
}

// Load header and footer on page load
async function loadComponents() {
    await loadComponent('header-container', 'header.html');
    await loadComponent('footer-container', 'footer.html');
    
    // After loading components, set up event listeners
    setupEventListeners();
    
    // Set active navigation
    setActiveNavigation();
}

function setActiveNavigation() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const pageMap = {
        'index.html': 'nav-home',
        'marketplace.html': 'nav-marketplace',
        'tracking.html': 'nav-tracking',
        'about.html': 'nav-about'
    };
    
    const activeNavId = pageMap[currentPage] || pageMap['index.html'];
    const activeLink = document.getElementById(activeNavId);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Sample Data
const marketplaceData = [
    {
        id: 1,
        name: "Fresh Tomatoes",
        category: "vegetables",
        location: "Punjab, India",
        price: 45,
        unit: "/kg",
        badge: "Organic",
        icon: "🍅"
    },
    {
        id: 2,
        name: "Basmati Rice",
        category: "grains",
        location: "Haryana, India",
        price: 85,
        unit: "/kg",
        badge: "Premium",
        icon: "🌾"
    },
    {
        id: 3,
        name: "Fresh Milk",
        category: "dairy",
        location: "Gujarat, India",
        price: 55,
        unit: "/liter",
        badge: "A2",
        icon: "🥛"
    },
    {
        id: 4,
        name: "Mangoes",
        category: "fruits",
        location: "Maharashtra, India",
        price: 120,
        unit: "/kg",
        badge: "Alphonso",
        icon: "🥭"
    },
    {
        id: 5,
        name: "Fresh Spinach",
        category: "vegetables",
        location: "West Bengal, India",
        price: 30,
        unit: "/kg",
        badge: "Organic",
        icon: "🥬"
    },
    {
        id: 6,
        name: "Bananas",
        category: "fruits",
        location: "Tamil Nadu, India",
        price: 40,
        unit: "/dozen",
        badge: "Fresh",
        icon: "🍌"
    },
    {
        id: 7,
        name: "Cottage Cheese",
        category: "dairy",
        location: "Punjab, India",
        price: 180,
        unit: "/kg",
        badge: "Fresh",
        icon: "🧀"
    },
    {
        id: 8,
        name: "Carrots",
        category: "vegetables",
        location: "Karnataka, India",
        price: 35,
        unit: "/kg",
        badge: "Organic",
        icon: "🥕"
    },
    {
        id: 9,
        name: "Apples",
        category: "fruits",
        location: "Himachal Pradesh, India",
        price: 150,
        unit: "/kg",
        badge: "Premium",
        icon: "🍎"
    }
];

const trackingDatabase = {
    "FL-2024-8523": {
        status: "In Transit",
        product: "Fresh Tomatoes",
        from: "Punjab",
        to: "Delhi",
        estimated: "2 hours",
        timeline: [
            { status: "Order Placed", time: "Today, 8:00 AM", active: true },
            { status: "Picked Up", time: "Today, 9:30 AM", active: true },
            { status: "In Transit", time: "Today, 11:00 AM", active: true },
            { status: "Out for Delivery", time: "Expected 2:00 PM", active: false },
            { status: "Delivered", time: "Expected 3:00 PM", active: false }
        ]
    },
    "FL-2024-7621": {
        status: "Delivered",
        product: "Basmati Rice",
        from: "Haryana",
        to: "Mumbai",
        estimated: "Delivered",
        timeline: [
            { status: "Order Placed", time: "Yesterday, 7:00 AM", active: true },
            { status: "Picked Up", time: "Yesterday, 10:00 AM", active: true },
            { status: "In Transit", time: "Yesterday, 2:00 PM", active: true },
            { status: "Out for Delivery", time: "Today, 8:00 AM", active: true },
            { status: "Delivered", time: "Today, 10:30 AM", active: true }
        ]
    },
    "FL-2024-9142": {
        status: "Processing",
        product: "Fresh Milk",
        from: "Gujarat",
        to: "Ahmedabad",
        estimated: "4 hours",
        timeline: [
            { status: "Order Placed", time: "Today, 10:00 AM", active: true },
            { status: "Processing", time: "In Progress", active: true },
            { status: "Ready for Pickup", time: "Pending", active: false },
            { status: "In Transit", time: "Pending", active: false },
            { status: "Delivered", time: "Expected 2:00 PM", active: false }
        ]
    }
};

// DOM Elements
const marketplaceGrid = document.getElementById('marketplaceGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const trackingInput = document.getElementById('trackingInput');
const trackBtn = document.getElementById('trackBtn');
const trackingResult = document.getElementById('trackingResult');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await loadComponents();
    renderMarketplace('all');
    animateStats();
    setupSmoothScroll();
    setupSampleIdButtons();
    setupMarketplaceSearch();
});

// Setup Sample ID Buttons
function setupSampleIdButtons() {
    const sampleIdButtons = document.querySelectorAll('.sample-id-btn');
    sampleIdButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const trackingId = btn.dataset.id;
            const trackingInput = document.getElementById('trackingInput');
            if (trackingInput) {
                trackingInput.value = trackingId;
                handleTracking(trackingId);
            }
        });
    });
}

// Marketplace Search and Sort
function setupMarketplaceSearch() {
    const searchInput = document.getElementById('searchInput');
    const sortSelect = document.getElementById('sortSelect');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterAndSortMarketplace();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            filterAndSortMarketplace();
        });
    }
}

function filterAndSortMarketplace() {
    const searchValue = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const sortValue = document.getElementById('sortSelect')?.value || 'name';
    const activeFilter = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    
    let filteredData = marketplaceData.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchValue) || 
                            item.location.toLowerCase().includes(searchValue);
        const matchesFilter = activeFilter === 'all' || item.category === activeFilter;
        return matchesSearch && matchesFilter;
    });
    
    // Sort data
    switch(sortValue) {
        case 'price-low':
            filteredData.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredData.sort((a, b) => b.price - a.price);
            break;
        case 'location':
            filteredData.sort((a, b) => a.location.localeCompare(b.location));
            break;
        default:
            filteredData.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    renderMarketplaceData(filteredData);
}

function renderMarketplaceData(data) {
    const marketplaceGrid = document.getElementById('marketplaceGrid');
    if (!marketplaceGrid) return;
    
    marketplaceGrid.innerHTML = data.map(item => `
        <div class="product-card" data-category="${item.category}">
            <div class="product-image">${item.icon}</div>
            <div class="product-info">
                <div class="product-header">
                    <h3 class="product-name">${item.name}</h3>
                    <span class="product-badge">${item.badge}</span>
                </div>
                <div class="product-location">📍 ${item.location}</div>
                <div class="product-details">
                    <div>
                        <span class="product-price">₹${item.price}</span>
                        <span class="product-unit">${item.unit}</span>
                    </div>
                    <button class="product-btn" onclick="handleContact('${item.name}')">Contact</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Marketplace
function renderMarketplace(filter) {
    let filteredData = filter === 'all' 
        ? marketplaceData 
        : marketplaceData.filter(item => item.category === filter);
    
    renderMarketplaceData(filteredData);
}

// Filter Functionality
filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        renderMarketplace(filter);
    });
});

// Tracking Functionality
trackBtn.addEventListener('click', () => {
    const trackingId = trackingInput.value.trim();
    handleTracking(trackingId);
});

trackingInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const trackingId = trackingInput.value.trim();
        handleTracking(trackingId);
    }
});

function handleTracking(trackingId) {
    const shipment = trackingDatabase[trackingId];
    
    if (!shipment) {
        trackingResult.style.display = 'block';
        trackingResult.innerHTML = `
            <div class="tracking-status">
                <div class="status-icon">❌</div>
                <div class="status-text">
                    <h4>Tracking ID Not Found</h4>
                    <p>Please check the ID and try again. Example: FL-2024-8523</p>
                </div>
            </div>
        `;
        return;
    }
    
    trackingResult.style.display = 'block';
    trackingResult.innerHTML = `
        <div class="tracking-status">
            <div class="status-icon">📦</div>
            <div class="status-text">
                <h4>${shipment.status}</h4>
                <p>${shipment.product} from ${shipment.from} to ${shipment.to}</p>
                <p><strong>Estimated: ${shipment.estimated}</strong></p>
            </div>
        </div>
        <div class="tracking-timeline">
            ${shipment.timeline.map(item => `
                <div class="timeline-item">
                    <div class="timeline-dot ${item.active ? 'active' : ''}"></div>
                    <div class="timeline-content">
                        <h5>${item.status}</h5>
                        <p>${item.time}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Stats Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            element.textContent = end.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// Smooth Scroll
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Event Listeners
function setupEventListeners() {
    // Button click handlers
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        showModal('Login', 'Login functionality would be implemented here.');
    });
    
    document.getElementById('signupBtn')?.addEventListener('click', () => {
        showModal('Sign Up', 'Sign up functionality would be implemented here.');
    });
    
    document.getElementById('getStartedHero')?.addEventListener('click', () => {
        showModal('Get Started', 'Welcome! Create your account to start selling or buying produce directly.');
    });
    
    document.getElementById('learnMoreBtn')?.addEventListener('click', () => {
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.href = 'about.html';
        }
    });
    
    document.getElementById('ctaSignup')?.addEventListener('click', () => {
        showModal('Create Account', 'Sign up now to access all features and start connecting with buyers.');
    });
    
    document.getElementById('ctaDemo')?.addEventListener('click', () => {
        showModal('Schedule Demo', 'Our team will reach out to schedule a personalized demo for you.');
    });
    
    document.getElementById('ctaContact')?.addEventListener('click', () => {
        showModal('Contact Us', 'We\'d love to hear from you! Our team will get back to you within 24 hours.');
    });
    
    // Mobile menu
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    mobileMenuBtn?.addEventListener('click', () => {
        alert('Mobile menu functionality would be implemented here with a sliding drawer navigation.');
    });
}

// Contact Handler
function handleContact(productName) {
    showModal('Contact Seller', `You're interested in ${productName}. In a full implementation, this would open a chat or contact form to connect you directly with the farmer.`);
}

// Modal System
function showModal(title, message) {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.2s ease;
    `;
    
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        padding: 32px;
        border-radius: 12px;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
    `;
    
    modal.innerHTML = `
        <h3 style="margin-bottom: 16px; color: #111827;">${title}</h3>
        <p style="color: #6B7280; line-height: 1.6; margin-bottom: 24px;">${message}</p>
        <button onclick="this.closest('[style*=fixed]').remove()" 
                style="background: #10B981; color: white; border: none; padding: 12px 24px; 
                       border-radius: 8px; font-weight: 600; cursor: pointer; width: 100%;">
            Got it!
        </button>
    `;
    
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
}

// Sample tracking IDs helper
document.addEventListener('DOMContentLoaded', () => {
    const trackingInput = document.getElementById('trackingInput');
    if (trackingInput) {
        trackingInput.placeholder = 'Try: FL-2024-8523, FL-2024-7621, or FL-2024-9142';
    }
});

// Add scroll reveal animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.feature-card, .product-card, .testimonial-card, .step');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

console.log('FarmLink Platform Initialized ✓');
console.log('Available tracking IDs for demo:', Object.keys(trackingDatabase));
