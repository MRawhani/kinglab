import store from '../state/store';

import Home from '../pages/Home';
import Tests from '../pages/Tests';
import Users from '../pages/Users';
import Reports from '../pages/Reports';
import Companies from '../pages/Companies';
import Agents from '../pages/Agents';
import Branches from '../pages/Branches';
import Invoices from '../pages/Invoices';
import TestResult from '../pages/print/TestResult';
import ResultQRCode from '../pages/print/ResultQRCode';
import Invoice from '../pages/print/Invoice';
import CompanyAgents from '../pages/CompanyAgents';
import Login from '../pages/Login';
import AccessDenied from '../pages/AccessDenied';
import NotFound from '../pages/NotFound';

export default [
	{
		path: '/',
		name: 'dashboard',
		component: Home,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/tests',
		name: 'tests',
		component: Tests,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/users',
		name: 'users',
		component: Users,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/reports',
		name: 'reports',
		component: Reports,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/companies',
		name: 'companies',
		component: Companies,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/agents',
		name: 'agents',
		component: Agents,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/agents/invoice/:invoiceId',
		name: 'agents',
		component: Invoice,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
		props: true,
	},
	{
		path: '/invoices',
		name: 'invoices',
		component: Invoices,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/invoices/result/:invoiceId',
		name: 'invoices',
		component: TestResult,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
		props: true,
	},
	{
		path: '/invoices/qrcode/:invoiceId',
		name: 'invoices',
		component: ResultQRCode,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
		props: true,
	},
	{
		path: '/company-agents',
		name: 'companyAgents',
		component: CompanyAgents,
		meta: {
			authRequired: true,
			accessLevel: 'company',
		},
	},
	{
		path: '/branches',
		name: 'branches',
		component: Branches,
		meta: {
			authRequired: true,
			accessLevel: 'user',
		},
	},
	{
		path: '/login',
		name: 'login',
		component: Login,
		meta: {
			authRequired: false,
			beforeResolve(to, from, next) {
				// If the user is already logged in
				store.getters['global/auth/isLoggedIn'] ? next({ name: 'home' }) : next();
			},
		},
	},
	{
		path: '/logout',
		name: 'logout',
		meta: {
			authRequired: true,
			beforeResolve(to, from, next) {
				store.dispatch('global/auth/logOut');
				next({ name: 'login', query: { redirectFrom: from.fullPath } });
			},
		},
	},
	{
		path: '/access-denied',
		name: 'accessDenied',
		component: AccessDenied,
		props: true,
	},
	{
		path: '/404',
		name: '404',
		component: NotFound,
		props: true,
	},
	// Redirect any unmatched routes to the 404 page.
	{
		path: '*',
		redirect: '404',
	},
];

// function lazyLoadView(AsyncView) {
// 	const AsyncHandler = () => ({
// 		component: AsyncView,
// 		// A component to use while the component is loading.
// 		loading: require('../components/base/loading.vue').default,
// 		// Delay before showing the loading component.
// 		// Default: 200 (milliseconds)
// 		delay: 300,
// 		// A fallback component in case the timeout is exceeded
// 		// when loading the component.
// 		error: require('../components/base/timeout.vue').default,
// 		// Time before giving up trying to load the component.
// 		// Default: Infinity (milliseconds).
// 		timeout: 120000,
// 	});

// 	return Promise.resolve({
// 		functional: true,
// 		render(h, { data, children }) {
// 			return h(AsyncHandler, data, children);
// 		},
// 	});
// }
