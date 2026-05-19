/**
 * Officina 404 - Main entrypoint
 * Composes independent UI modules.
 */

import { initMenu } from './modules/menu.js';
import { initNavigation } from './modules/navigation.js';
import { initScrollAnimations } from './modules/scroll-animations.js';
import { initContactForms } from './modules/contact-form.js';

document.addEventListener('DOMContentLoaded', () => {
    initMenu();
    initNavigation();
    initScrollAnimations();
    initContactForms();
});
