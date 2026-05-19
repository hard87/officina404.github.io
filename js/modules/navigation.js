/**
 * Module: Navigation
 * Sticky header behavior and smooth hash navigation.
 */

function initHeaderScroll() {
    const header = document.getElementById('header');
    if (!header) {
        return;
    }

    let lastScroll = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > lastScroll && currentScroll > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
}

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    const navLinks = document.querySelector('.nav-links');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const getTargetFromHash = hash => {
        if (!hash || hash === '#') {
            return null;
        }

        try {
            const id = decodeURIComponent(hash.slice(1));
            return document.getElementById(id);
        } catch (error) {
            return null;
        }
    };

    links.forEach(link => {
        link.addEventListener('click', event => {
            if (link.classList.contains('skip-link')) {
                return;
            }

            const href = link.getAttribute('href');
            if (!href || href === '#') {
                return;
            }

            const target = getTargetFromHash(href);
            if (!target) {
                return;
            }

            event.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
            const behavior = prefersReducedMotion ? 'auto' : 'smooth';

            window.scrollTo({ top: targetTop, behavior });

            if (history.pushState) {
                history.pushState(null, '', `#${target.id}`);
            }

            if (navLinks?.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuToggle?.classList.remove('active');
                menuToggle?.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    });
}

export function initNavigation() {
    initHeaderScroll();
    initSmoothScroll();
}
