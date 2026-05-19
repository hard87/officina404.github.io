/**
 * MÓDULO: Scroll Animations
 * Usa Intersection Observer para revelar cards com animações leves
 */

export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    if (animatedElements.length === 0) {
        return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
        animatedElements.forEach(element => element.classList.add('is-visible'));
        return;
    }

    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(element => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -80px 0px'
    });

    animatedElements.forEach(element => observer.observe(element));
}
