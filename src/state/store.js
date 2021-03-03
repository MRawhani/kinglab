import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import api from '../utils/api';
import runActionInAllModules from '../utils/runModulesAction';
import modules from './modules';

const vuexLocal = new VuexPersistence({
	storage: window.localStorage,
});

Vue.use(Vuex);

export default new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	getters: {
		currentBranch(state) {
			const branchId = state.global.auth.currentUser?.data.branch_id;
			return state.branches.branches.find((branch) => branch.id === branchId);
		},
	},
	actions: {
		loadBaseData({ commit }) {
			return api.get('/data').then((res) => {
				const { data } = res.data;

				commit('users/SET_USERS', data.users);
				commit('branches/SET_BRANCHES', data.branches);
				commit('companies/SET_COMPANIES', data.companies);
				commit('permissions/SET_PERMISSIONS', data.permissions);
				commit('tests/SET_TESTS', data.tests);
				commit('agents/SET_AGENTS', data.agents);
				commit('invoices/SET_INVOICES', data.invoices);
				commit('results/SET_RESULTES', data.results);
				commit('home/SET_STATS', data.dashboard.stats);
				commit('home/SET_BRANCH_AGENTS', data.dashboard.branches);
				commit('home/SET_BRANCH_TESTS', data.dashboard.tests);
			});
		},
	},
	modules,
	plugins: [vuexLocal.plugin],
});

runActionInAllModules('init');
