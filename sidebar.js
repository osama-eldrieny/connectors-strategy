// Consolidated Sidebar with Collapsible Submenus - Professional Implementation

const SIDEBAR_HTML = `<div class="side-nav" id="sideNav">
  <div class="side-nav-panel open" id="sideNavPanel">
    <div class="side-nav-header">Nintex Connector Suite</div>
    <div class="side-nav-section-label">Pages</div>
    <a class="side-nav-link" href="connector-filtering-framework.html" data-page="filtering"><span class="icon"><i data-lucide="filter"></i></span> Filtering Framework</a>
    <a class="side-nav-link" href="competitors-analysis.html" data-page="competitors"><span class="icon"><i data-lucide="award"></i></span> Competitors Analysis</a>
    <a class="side-nav-link" href="nintex-connector-framework.html" data-page="framework"><span class="icon"><i data-lucide="clipboard-list"></i></span> Framework Review
      <span class="submenu-chevron" data-toggle="submenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-down" aria-hidden="true" class="lucide lucide-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
    </a>
    <div class="submenu" data-submenu="framework"></div>
    <a class="side-nav-link" href="connector-prioritizer.html" data-page="prioritizer"><span class="icon"><i data-lucide="target"></i></span> Connector Scoring
      <span class="submenu-chevron" data-toggle="submenu">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-lucide="chevron-down" aria-hidden="true" class="lucide lucide-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </span>
    </a>
    <div class="submenu" data-submenu="prioritizer"></div>
    <div class="side-nav-divider"></div>
    <a class="side-nav-link" href="feedback-questions.html" data-page="feedback"><span class="icon"><i data-lucide="message-circle"></i></span> Feedback Questions</a>
    <a class="side-nav-link" href="connector-acceleration.html" data-page="acceleration"><span class="icon"><i data-lucide="zap"></i></span> Connector Acceleration</a>
  </div>
</div>`;

// Page-specific submenu links
const SUBMENU_LINKS = {
  framework: [
    { href: '#overview', icon: 'building-2', label: 'Overview' },
    { href: '#why', icon: 'help-circle', label: 'Why Criteria' },
    { href: '#criteria', icon: 'bar-chart-3', label: 'The 5 Criteria' },
    { href: '#tiers', icon: 'award', label: 'Priority Tiers' },
    { href: '#workflow', icon: 'repeat', label: 'Process Steps' },
    { href: '#examples', icon: 'clipboard-list', label: 'Examples' }
  ],
  filtering: [],
  prioritizer: [
    { href: '#score', icon: 'settings', label: 'Score Your Connectors' },
    { href: '#results', icon: 'bar-chart-3', label: 'View Rankings' }
  ]
};

// Sidebar State Management
class SidebarManager {
  constructor() {
    this.initialized = false;
    this.currentPage = null;
  }

  // Detect current page
  detectCurrentPage() {
    const pathname = window.location.pathname;
    const href = window.location.href;

    if (pathname.includes('feedback-questions.html') || href.includes('feedback-questions.html')) {
      return 'feedback';
    } else if (pathname.includes('connector-acceleration.html') || href.includes('connector-acceleration.html')) {
      return 'acceleration';
    } else if (pathname.includes('nintex-connector-framework.html') || href.includes('nintex-connector-framework.html')) {
      return 'framework';
    } else if (pathname.includes('connector-prioritizer.html') || href.includes('connector-prioritizer.html')) {
      return 'prioritizer';
    } else if (pathname.includes('competitors-analysis.html') || href.includes('competitors-analysis.html')) {
      return 'competitors';
    } else if (pathname.includes('connector-filtering-framework.html') || href.includes('connector-filtering-framework.html')) {
      return 'filtering';
    }
    return 'filtering';
  }

  // Initialize sidebar
  loadSidebar() {
    // Always remove existing sidebar to ensure fresh state on page navigation
    const existingSidebar = document.getElementById('sideNav');
    if (existingSidebar) {
      existingSidebar.remove();
    }

    // Insert new sidebar
    const sidebarContainer = document.createElement('div');
    sidebarContainer.innerHTML = SIDEBAR_HTML;
    document.body.prepend(sidebarContainer.firstElementChild);

    this.currentPage = this.detectCurrentPage();
    this.setupEventHandlers();
    this.setActiveLink();
    this.populateSubmenus();
    this.initializeSubmenuStates();
    this.renderIcons();
    this.setupAnchorLinks();
  }

  // Setup event delegation for chevron clicks
  setupEventHandlers() {
    const sidebar = document.getElementById('sideNav');
    if (!sidebar) return;

    sidebar.addEventListener('click', (e) => {
      // Check if click is on chevron or inside it (SVG)
      const chevron = e.target.closest('.submenu-chevron');
      if (chevron) {
        e.preventDefault();
        e.stopPropagation();
        this.toggleSubmenu(chevron);
      }
    });
  }

  // Set active link styling
  setActiveLink() {
    document.querySelectorAll('.side-nav-link[data-page]').forEach(link => {
      if (link.dataset.page === this.currentPage) {
        link.classList.add('active');
        link.style.pointerEvents = 'none';
        link.style.cursor = 'default';
      } else {
        link.classList.remove('active');
        link.style.pointerEvents = 'auto';
        link.style.cursor = 'pointer';
      }
    });
  }

  // Populate submenus with links
  populateSubmenus() {
    Object.keys(SUBMENU_LINKS).forEach(pageKey => {
      const submenuDiv = document.querySelector(`.submenu[data-submenu="${pageKey}"]`);
      const links = SUBMENU_LINKS[pageKey];

      if (submenuDiv) {
        if (links.length > 0) {
          submenuDiv.innerHTML = links.map(link =>
            `<a class="side-nav-link" href="${link.href}">
              ${link.label}
            </a>`
          ).join('');
        }
      }
    });
  }

  // Initialize all submenu states - collapsed by default, NO exceptions
  initializeSubmenuStates() {
    // ALWAYS collapse ALL submenus and chevrons - no conditions
    document.querySelectorAll('.submenu').forEach(submenu => {
      submenu.classList.add('collapsed');
    });

    document.querySelectorAll('.submenu-chevron').forEach(chevron => {
      chevron.classList.add('collapsed');
    });
  }

  // Toggle submenu collapse/expand
  toggleSubmenu(chevron) {
    if (!chevron || !chevron.classList.contains('submenu-chevron')) {
      console.warn('Invalid chevron element');
      return;
    }

    const link = chevron.closest('.side-nav-link');
    if (!link) {
      console.warn('Could not find parent link for chevron');
      return;
    }

    // Find the submenu that follows this link
    let submenu = link.nextElementSibling;
    while (submenu && !submenu.classList.contains('submenu')) {
      submenu = submenu.nextElementSibling;
    }

    if (submenu) {
      const isCollapsed = chevron.classList.contains('collapsed');
      chevron.classList.toggle('collapsed');
      submenu.classList.toggle('collapsed');
      console.log(`Submenu toggled: ${isCollapsed ? 'expanding' : 'collapsing'}`);
    } else {
      console.warn('Could not find submenu for this chevron');
    }
  }

  // Render Lucide icons
  renderIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      // Render immediately
      lucide.createIcons();
      // Retry after DOM settles
      setTimeout(() => lucide.createIcons(), 50);
      setTimeout(() => lucide.createIcons(), 200);
    }
  }

  // Setup smooth scrolling for anchor links
  setupAnchorLinks() {
    document.querySelectorAll('.side-nav-link[href^="#"]').forEach(link => {
      link.addEventListener('click', function(e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}

// Initialize sidebar when DOM is ready
const sidebarManager = new SidebarManager();

function initSidebarWhenReady() {
  if (document.body) {
    sidebarManager.loadSidebar();
    // Ensure icons render after sidebar is loaded
    setTimeout(() => {
      if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
      }
    }, 50);
  } else {
    setTimeout(initSidebarWhenReady, 10);
  }
}

initSidebarWhenReady();

// Ensure icons render after DOM fully loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  });
}
