import '@mdi/font/css/materialdesignicons.css';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import Vue from 'vue';
import App from './App.vue';
import VueAlert from './plugins/vue-alert';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './state/store';

Vue.use(VueAlert, {
	// tiem in ms before the alert disapeare
	timeout: 6000,
	// does the alert has close button
	closeBtn: true,
	// where to display the alert
	placement: 'top-center',
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	render: (h) => h(App),
}).$mount('#app');
