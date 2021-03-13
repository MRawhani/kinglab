import NProgress from 'nprogress/nprogress';
import Vue from 'vue';
import VueMeta from 'vue-meta';
import VueRouter from 'vue-router';
import store from '../state/store';
import routes from './routes';

Vue.use(VueRouter);
Vue.use(VueMeta, {
	keyName: 'page',
});

NProgress.configure({
	showSpinner: false,
});

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	scrollBehavior(to, from, savedPosition) {
		return savedPosition || { x: 0, y: 0 };
	},
	routes,
});

router.beforeEach((to, from, next) => {
	NProgress.start();

	const authRequired = to.matched.some((route) => route.meta.authRequired);

	if (!authRequired || store.getters['global/auth/isLoggedIn']) {
		if (!to.meta.accessLevel) return next();

		const levelAccess = to.meta.accessLevel === store.state.global.auth.currentUser.type;
		const pageAccess = to.name === 'companyAgents' ? true : store.state.global.auth.currentUser.permissions.includes(to.name);

		if (levelAccess && pageAccess) {
			next();
		} else if (from.name === 'accessDenied') {
			next(false);
			NProgress.done();
		} else {
			next({
				name: 'accessDenied',
				query: {
					redirectTo: from.fullPath,
				},
			});
		}
	} else {
		next({
			name: 'login',
			query: {
				redirectFrom: to.fullPath,
			},
		});
	}
});

router.beforeResolve(async (to, from, next) => {
	try {
		for (const route of to.matched) {
			await new Promise((resolve, reject) => {
				if (route.meta && route.meta.beforeResolve) {
					route.meta.beforeResolve(to, from, (...args) => {
						if (args.length) {
							if (args[0].name === from.name) {
								NProgress.done();
							}
							next(...args);
							reject(new Error('Error in redirect'));
						} else {
							resolve();
						}
					});
				} else {
					resolve();
				}
			});
		}
	} catch (error) {
		return;
	}

	next();
});

// eslint-disable-next-line no-unused-vars
router.afterEach((to, from) => {
	NProgress.done();
});

export default router;
