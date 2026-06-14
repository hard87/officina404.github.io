/**
 * MÓDULO: Menu Mobile
 * Centraliza estado visual, acessibilidade e bloqueio de scroll do menu.
 */

let menuController = null;

function createMenuController(menuToggle, navLinks) {
    const getFocusableLinks = () => Array.from(navLinks.querySelectorAll('a[href]'));
    const isOpen = () => menuToggle.getAttribute('aria-expanded') === 'true';

    const setMenuState = open => {
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        menuToggle.classList.toggle('active', open);
        navLinks.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    };

    const open = () => {
        setMenuState(true);
        getFocusableLinks()[0]?.focus();
    };

    const close = ({ restoreFocus = false } = {}) => {
        setMenuState(false);

        if (restoreFocus) {
            menuToggle.focus();
        }
    };

    const toggle = () => {
        if (isOpen()) {
            close();
            return;
        }

        open();
    };

    return {
        close,
        isOpen,
        toggle
    };
}

export function closeMenu(options) {
    menuController?.close(options);
}

export function isMenuOpen() {
    return Boolean(menuController?.isOpen());
}

export function initMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const controlledId = menuToggle?.getAttribute('aria-controls');
    const navLinks = controlledId ? document.getElementById(controlledId) : document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) {
        return;
    }

    menuController = createMenuController(menuToggle, navLinks);
    menuController.close();

    menuToggle.addEventListener('click', menuController.toggle);

    navLinks.querySelectorAll('a[href]').forEach(link => {
        link.addEventListener('click', () => closeMenu());
    });

    document.addEventListener('click', event => {
        const isClickInsideMenu = navLinks.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);

        if (isMenuOpen() && !isClickInsideMenu && !isClickOnToggle) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', event => {
        if (!isMenuOpen()) {
            return;
        }

        if (event.key === 'Escape') {
            closeMenu({ restoreFocus: true });
            return;
        }

        if (event.key !== 'Tab') {
            return;
        }

        const focusableLinks = Array.from(navLinks.querySelectorAll('a[href]'));
        if (focusableLinks.length === 0) {
            return;
        }

        const first = focusableLinks[0];
        const last = focusableLinks[focusableLinks.length - 1];

        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}
