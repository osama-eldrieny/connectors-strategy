// Sidebar HTML content
const SIDEBAR_HTML = `<div class="side-nav" id="sideNav">
  <div class="side-nav-panel open" id="sideNavPanel">
    <div class="side-nav-header">Nintex Connector Suite</div>
    <div class="side-nav-section-label">📄 Pages</div>
    <a class="side-nav-link" href="nintex-connector-framework.html" data-page="framework"><span class="icon">📋</span> Framework Review</a>
    <a class="side-nav-link" href="connector-prioritizer.html" data-page="prioritizer"><span class="icon">⚙️</span> Scoring Tool</a>
    <div class="side-nav-divider"></div>
    <div class="side-nav-section-label" id="onPageSection">🔖 On This Page</div>
    <div id="onPageLinks"></div>
  </div>
</div>`;

// Detect current page reliably
function detectCurrentPage() {
  let pageName = '';

  // Try different methods to detect the page
  const pathname = window.location.pathname;
  const href = window.location.href;

  if (pathname.includes('nintex-connector-framework.html') || href.includes('nintex-connector-framework.html')) {
    pageName = 'framework';
  } else if (pathname.includes('connector-prioritizer.html') || href.includes('connector-prioritizer.html')) {
    pageName = 'prioritizer';
  } else {
    // Default fallback
    pageName = 'prioritizer';
  }

  return pageName;
}

// Load sidebar and set up navigation
function loadSidebar() {
  // Create sidebar if it doesn't exist
  if (!document.getElementById('sideNav')) {
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = SIDEBAR_HTML;
    document.body.prepend(sidebarContainer.firstElementChild);
  }

  // Detect current page
  const currentPageKey = detectCurrentPage();

  // Set active state on page links
  document.querySelectorAll('.side-nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPageKey) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Set up page-specific links
  setupPageLinks(currentPageKey);

  // Set up smooth scrolling for anchor links
  document.querySelectorAll('.side-nav-link[href^="#"]').forEach(link => {
    link.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({behavior: 'smooth'});
      }
    });
  });
}

// Set up page-specific links based on current page
function setupPageLinks(pageKey) {
  const onPageLinks = document.getElementById('onPageLinks');
  const onPageSection = document.getElementById('onPageSection');

  let links = [];

  if (pageKey === 'framework') {
    links = [
      { href: '#overview', icon: '🏢', text: 'Overview' },
      { href: '#why', icon: '❓', text: 'Why Criteria' },
      { href: '#criteria', icon: '📊', text: 'The 5 Criteria' },
      { href: '#tiers', icon: '🏆', text: 'Priority Tiers' },
      { href: '#workflow', icon: '🔄', text: 'Process Steps' },
      { href: '#examples', icon: '📋', text: 'Examples' }
    ];
  } else if (pageKey === 'prioritizer') {
    links = [
      { href: '#scoring', icon: '➕', text: 'Add Connector' },
      { href: '#results', icon: '📊', text: 'View Rankings' }
    ];
  }

  if (onPageLinks && links.length > 0) {
    onPageSection.style.display = 'block';
    onPageLinks.innerHTML = links.map(link =>
      `<a class="side-nav-link" href="${link.href}"><span class="icon">${link.icon}</span> ${link.text}</a>`
    ).join('');

    // Re-attach smooth scroll listeners to newly created links
    document.querySelectorAll('#onPageLinks .side-nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({behavior: 'smooth'});
        }
      });
    });
  } else if (onPageSection) {
    onPageSection.style.display = 'none';
  }
}

// Load sidebar when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSidebar);
} else {
  loadSidebar();
}
