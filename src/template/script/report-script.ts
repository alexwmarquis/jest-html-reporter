import type { ThemePreset } from '../../types';

export function generateScript(options: {
  collapsePassed: boolean;
  collapseAll: boolean;
  expandLevel: number;
  enableThemeToggle: boolean;
  currentTheme: ThemePreset;
}): string {
  return `
    (function() {
      let currentFilter = 'all';
      let currentSearch = '';

      function updateVisibility() {
        const testItems = document.querySelectorAll('.test-item');
        
        testItems.forEach(item => {
          const status = item.dataset.status;
          const isFlaky = item.dataset.flaky === 'true';
          const text = item.textContent.toLowerCase();
          
          let matchesFilter = false;
          if (currentFilter === 'all') {
            matchesFilter = true;
          } else if (currentFilter === 'flaky') {
            matchesFilter = isFlaky;
          } else {
            matchesFilter = currentFilter === 'pending' 
              ? ['pending', 'skipped', 'todo', 'disabled'].includes(status)
              : status === currentFilter;
          }

          const matchesSearch = !currentSearch || text.includes(currentSearch);
          
          item.style.display = (matchesFilter && matchesSearch) ? 'flex' : 'none';
        });

        Array.from(document.querySelectorAll('.describe-group')).reverse().forEach(group => {
          const hasVisible = Array.from(group.querySelectorAll(':scope > .describe-body > .test-item')).some(t => t.style.display !== 'none');
          const hasVisibleNested = Array.from(group.querySelectorAll(':scope > .describe-body > .describe-group')).some(g => g.style.display !== 'none');
          const isVisible = hasVisible || hasVisibleNested;
          group.style.display = isVisible ? 'block' : 'none';
          if (isVisible && currentSearch) {
            group.classList.remove('collapsed');
          }
        });

        document.querySelectorAll('.suite').forEach(suite => {
          const hasVisible = Array.from(suite.querySelectorAll('.test-item')).some(t => t.style.display !== 'none');
          suite.style.display = hasVisible ? 'block' : 'none';
          if (hasVisible && currentSearch) {
            suite.classList.remove('collapsed');
          }
        });
      }

      document.querySelectorAll('.suite-header').forEach(header => {
        header.addEventListener('click', () => {
          header.closest('.suite').classList.toggle('collapsed');
        });
      });

      document.querySelectorAll('.describe-header').forEach(header => {
        header.addEventListener('click', (e) => {
          e.stopPropagation();
          header.closest('.describe-group').classList.toggle('collapsed');
        });
      });

      document.querySelectorAll('.env-header.clickable').forEach(header => {
        header.addEventListener('click', () => {
          header.parentElement.classList.toggle('collapsed');
        });
      });

      document.querySelectorAll('.subnav-item').forEach(navItem => {
        navItem.addEventListener('click', (e) => {
          e.preventDefault();
          currentFilter = navItem.dataset.filter;
          document.querySelectorAll('.subnav-item').forEach(c => c.classList.remove('active'));
          navItem.classList.add('active');
          updateVisibility();
        });
      });

      const searchInput = document.getElementById('search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          currentSearch = e.target.value.toLowerCase();
          updateVisibility();
        });
      }

      document.querySelectorAll('.copy-error-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.stopPropagation();
          const errorText = btn.dataset.error;
          try {
            await navigator.clipboard.writeText(errorText);
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            const originalIcon = icon.className;
            const originalText = text.textContent;
            icon.className = 'bi bi-check';
            text.textContent = 'Copied!';
            setTimeout(() => {
              icon.className = originalIcon;
              text.textContent = originalText;
            }, 2000);
          } catch (err) {
            console.error('Failed to copy:', err);
          }
        });
      });

      document.querySelectorAll('.error-stack-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const targetId = btn.dataset.target;
          const hiddenSection = document.getElementById(targetId);
          const icon = btn.querySelector('i');
          const text = btn.querySelector('span');
          
          if (hiddenSection.style.display === 'none') {
            hiddenSection.style.display = 'block';
            icon.className = 'bi bi-chevron-up';
            text.textContent = 'Show less';
            btn.classList.add('expanded');
          } else {
            hiddenSection.style.display = 'none';
            icon.className = 'bi bi-chevron-down';
            const frameCount = hiddenSection.querySelectorAll('.error-stack-frame').length;
            text.textContent = 'Show ' + frameCount + ' more frame' + (frameCount > 1 ? 's' : '');
            btn.classList.remove('expanded');
          }
        });
      });

      const jumpToTop = document.getElementById('jump-to-top');
      if (jumpToTop) {
        jumpToTop.addEventListener('click', () => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          jumpToTop.blur();
        });

        const toggleJumpToTop = () => {
          if (window.scrollY > 300) {
            jumpToTop.classList.add('visible');
          } else {
            jumpToTop.classList.remove('visible');
          }
        };

        let isScrolling;
        window.addEventListener('scroll', () => {
          if (!isScrolling) {
            window.requestAnimationFrame(() => {
              toggleJumpToTop();
              isScrolling = false;
            });
            isScrolling = true;
          }
        });
        
        /* Initial check */
        toggleJumpToTop();
      }

      ${
        options.enableThemeToggle
          ? `
      const themeToggle = document.getElementById('theme-toggle');
      const themeMenu = document.getElementById('theme-menu');
      
      if (themeToggle && themeMenu) {
        themeToggle.addEventListener('click', (e) => {
          e.stopPropagation();
          themeMenu.classList.toggle('visible');
        });
        
        document.querySelectorAll('.theme-option').forEach(option => {
          option.addEventListener('click', () => {
            const newTheme = option.dataset.theme;
            document.documentElement.className = 'theme-' + newTheme;
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            try {
              localStorage.setItem('jest-reporter-theme', newTheme);
            } catch (e) {}
            themeMenu.classList.remove('visible');
          });
        });
        
        document.addEventListener('click', () => {
          themeMenu.classList.remove('visible');
        });

        const savedTheme = localStorage.getItem('jest-reporter-theme') || '${options.currentTheme}';
        document.querySelectorAll('.theme-option').forEach(o => {
          o.classList.toggle('active', o.dataset.theme === savedTheme);
        });
      }
      `
          : ''
      }
    })();
  `;
}
