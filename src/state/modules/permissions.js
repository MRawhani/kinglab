import Vue from 'vue';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	permissions: [],
};

export const getters = {};

export const mutations = {
	SET_PERMISSIONS(state, permissions) {
		state.permissions = [];

		permissions.forEach((permission, i) => {
			Vue.set(state.permissions, i, permission);
		});
	},
	EDIT_USER_PERMISSIONS(state, data) {
		const current = state.permissions.find((perm) => perm.user_id === data.user_id);
		if (current) {
			current.permissions = data.permissions;
			current.state = current.state === 0 ? 2 : 1;
		}

		state.permissions.filter((perm, i) => {
			if (perm.user_id === data.user_id) {
				Vue.set(state.permissions, i, current);
			}
		});
	},
	SET_USER_PERMISSIONS(state, data) {
		if (data.id) state.permissions.push(data);
		else
			state.permissions.push({
				id: generateId(state.permissions),
				...data,
				state: 1,
			});
	},
};

export const actions = {
	getUserPermissions({ state }, userId) {
		return new Promise((resolve, reject) => {
			const permissions = state.permissions.find((perm) => perm.user_id === userId);
			if (!permissions) reject(new Error('User not found'));

			resolve(permissions);
		});

		// return api.get(`/permissions/${userId}`).then((res) => {
		// 	return res.data;
		// });
	},
	saveUserPermissions({ commit }, data) {
		commit('SET_USER_PERMISSIONS', data);

		// return api.post('/permissions', data).then((res) => {
		// 	return res.data;
		// });
	},
	editUserPermissions({ commit }, data) {
		commit('EDIT_USER_PERMISSIONS', data);

		// return api.put(`/permissions`, data).then((res) => {
		// 	return res.data;
		// });
	},

	async _sync({ state }, createdUsers) {
		const requests = [];
		const permissions = state.permissions;

		const newPermissions = permissions.filter((perm) => perm.state === 1);
		const editedPermissions = permissions.filter((perm) => perm.state === 2);

		newPermissions.forEach((perm) => {
			const userId = !createdUsers.length ? perm.user_id : createdUsers.find((user) => user.old === perm.user_id).new;
			requests.push(api.post('/permissions', { ...perm, user_id: userId }));
		});

		editedPermissions.forEach((perm) => {
			requests.push(api.put('/permissions', perm));
		});

		await Promise.all(requests);
	},
};
