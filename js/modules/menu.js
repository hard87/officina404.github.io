/**
 * MÓDULO: Menu Mobile
 * Controla a abertura/fechamento do menu de navegação em dispositivos móveis
 */

export function initMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!menuToggle || !navLinks) return;

    const getFocusableLinks = () => Array.from(navLinks.querySelectorAll('a[href]'));
    const setMenuState = isOpen => {
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
        menuToggle.classList.toggle('active', isOpen);
        navLinks.classList.toggle('active', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    // Toggle do menu ao clicar no botao
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';

        setMenuState(!isExpanded);

        if (!isExpanded) {
            const focusableLinks = getFocusableLinks();
            focusableLinks[0]?.focus();
        }
    });

    // Fechar menu ao clicar em um link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Fechar menu ao clicar fora dele
    document.addEventListener('click', (e) => {
        const isClickInsideMenu = navLinks.contains(e.target);
        const isClickOnToggle = menuToggle.contains(e.target);

        if (!isClickInsideMenu && !isClickOnToggle && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
            menuToggle.focus();
        }

        if (e.key === 'Tab' && navLinks.classList.contains('active')) {
            const focusableLinks = getFocusableLinks();
            if (focusableLinks.length === 0) {
                return;
            }

            const first = focusableLinks[0];
            const last = focusableLinks[focusableLinks.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    });

    // Funcao auxiliar para fechar o menu
    function closeMenu() {
        setMenuState(false);
    }
}
