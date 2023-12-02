// src/i18n.js
// import { addMessages } from 'svelte-i18n';
import { register, init, getLocaleFromNavigator } from 'svelte-i18n';

import es from '$lib/locale/es.json';
// import enUS from './en-US.json';
// import pt from './pt.json';
register('es', () => import('$lib/locale/es.json'));
init({
	fallbackLocale: 'es',
	initialLocale: getLocaleFromNavigator()
});
// addMessages('es', es);
// addMessages('en-US', enUS);
// addMessages('pt', pt);

// en, en-US and pt are available
