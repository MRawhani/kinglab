import Vue from 'vue';
import { getState } from '../../utils/local-stoage-utils';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	branches: getState('vuex.branches') || [],
	main: {
		id: 0,
		state: 0,
	},
};

export const getters = {
	active(state) {
		return state.branches.filter((branch) => branch.state !== 3);
	},
};

export const mutations = {
	SET_BRANCHES(state, branchesList) {
		state.branches = [];

		branchesList.forEach((branch, i) => {
			Vue.set(state.branches, i, branch);
		});

		state.main.id = state.branches.find((branch) => branch.is_main).id;
		state.main.state = 0;
	},
	ADD_BRANCH(state, newBranch) {
		if (newBranch.id) state.branches.push(newBranch);
		else
			state.branches.push({
				id: generateId(state.branches),
				...newBranch,
				is_main: 0,
				state: 1,
			});
	},
	DELETE_BRANCH(state, branchId) {
		const current = state.branches.find((branch) => branch.id === branchId);
		if (current.state === 1) state.branches = state.branches.filter((branch) => branch.id !== branchId);
		else {
			current.state = 3;
			state.branches.filter((branch, i) => {
				if (branch.id === branchId) {
					Vue.set(state.branches, i, current);
				}
			});
		}
	},
	EDIT_BRANCH(state, branchData) {
		const current = state.branches.find((branch) => branch.id === branchData.id);
		const data = {
			...branchData,
			state: current.state === 0 ? 2 : 1,
		};

		state.branches.filter((branch, i) => {
			if (branch.id === branchData.id) {
				Vue.set(state.branches, i, data);
			}
		});
	},
	EDIT_MAIN(state, id) {
		state.branches = state.branches.map((branch) => ({
			...branch,
			is_main: false,
		}));

		state.branches.filter((branch, i) => {
			if (branch.id === id) {
				Vue.set(state.branches, i, {
					...branch,
					is_main: true,
				});
			}
		});

		state.main.id = id;
		state.main.state = 1;
	},
};

export const actions = {
	getBranchesList({ commit }) {
		return api.get('/branches').then((response) => {
			const { data } = response.data;
			commit('SET_BRANCHES', data);
			return data;
		});
	},
	saveBranch({ commit }, newBranch) {
		commit('ADD_BRANCH', newBranch);

		// return api.post('/branches', newBranch).then((res) => {
		// 	const { data } = res.data;
		// 	commit('ADD_BRANCH', data);
		// 	return data;
		// });
	},
	deleteBranch({ commit }, branchId) {
		commit('DELETE_BRANCH', branchId);

		// return api.delete(`/branches/${branchId}`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('DELETE_BRANCH', branchId);
		// 	return data;
		// });
	},
	editBranch({ commit }, { branchData, branchId }) {
		commit('EDIT_BRANCH', {
			...branchData,
			id: branchId,
		});

		// return api.put(`/branches/${branchId}`, branchData).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_BRANCH', data);
		// 	return data;
		// });
	},
	editMain({ commit }, branchId) {
		commit('EDIT_MAIN', branchId);

		// return api.put(`/branches/${branchId}/main`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_MAIN', data.id);
		// 	return data;
		// });
	},

	async sync({ state }) {
		const requests = [];
		const branches = state.branches;
		const mainChanged = state.main.state === 1;

		const newBranches = branches.filter((branch) => branch.state === 1);
		const editedBranches = branches.filter((branch) => branch.state === 2);
		const deletedBranches = branches.filter((branch) => branch.state === 3);

		newBranches.forEach((branch) => {
			requests.push(api.post('/branches', branch));
		});

		editedBranches.forEach((branch) => {
			requests.push(api.put(`/branches/${branch.id}`, branch));
		});

		deletedBranches.forEach((branch) => {
			requests.push(api.delete(`/branches/${branch.id}`));
		});

		if (mainChanged) {
			requests.push(api.put(`/branches/${state.main.id}/main`));
		}

		await Promise.all(requests);
	},
};
