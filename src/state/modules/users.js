import Vue from 'vue';
import { getState } from '../../utils/local-stoage-utils';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	users: getState('vuex.users') || [],
};

export const getters = {
	active(state) {
		return state.users.filter((user) => user.state !== 3);
	},
};

export const mutations = {
	SET_USERS(state, usersList) {
		state.users = [];

		usersList.forEach((user, i) => {
			Vue.set(state.users, i, user);
		});
	},
	ADD_USER(state, newUser) {
		if (newUser.id) state.users.push(newUser);
		else
			state.users.push({
				id: generateId(state.users),
				...newUser,
				state: 1,
			});
	},
	DELETE_USER(state, userId) {
		const current = state.users.find((user) => user.id === userId);
		if (current.state === 1) state.users = state.users.filter((user) => user.id !== userId);
		else {
			current.state = 3;
			state.users.filter((user, i) => {
				if (user.id === userId) {
					Vue.set(state.users, i, current);
				}
			});
		}
	},
	EDIT_USER(state, userData) {
		const current = state.users.find((user) => user.id === userData.id);
		const data = {
			...userData,
			state: current.state === 0 ? 2 : 1,
		};

		state.users.filter((user, i) => {
			if (user.id === userData.id) {
				Vue.set(state.users, i, data);
			}
		});
	},
};

export const actions = {
	getUsersList({ commit }) {
		return api.get('/users').then((response) => {
			const { data } = response.data;
			commit('SET_USERS', data);
			return data;
		});
	},
	saveUser({ commit }, newUser) {
		commit('ADD_USER', newUser);

		// return api.post('/users', newUser).then((res) => {
		// 	const { data } = res.data;
		// 	commit('ADD_USER', data);
		// 	return data;
		// });
	},
	deleteUser({ commit }, userId) {
		commit('DELETE_USER', userId);

		// return api.delete(`/users/${userId}`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('DELETE_USER', userId);
		// 	return data;
		// });
	},
	editUser({ commit }, { userData, userId }) {
		commit('EDIT_USER', {
			...userData,
			id: userId,
		});

		// return api.put(`/users/${userId}`, userData).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_USER', data);
		// 	return data;
		// });
	},

	async sync({ state, dispatch }) {
		const requests = [];
		const createdUsers = [];
		const users = state.users;

		const newUsers = users.filter((user) => user.state === 1);
		const editedUsers = users.filter((user) => user.state === 2);
		const deletedUsers = users.filter((user) => user.state === 3);

		newUsers.forEach(async (user) => {
			requests.push(api.post('/users', user));
		});

		const results = await Promise.all(requests);
		results.forEach(({ data }, i) => {
			createdUsers.push({
				old: newUsers[i].id,
				new: data.data.id,
			});
		});

		requests.length = 0;

		editedUsers.forEach((user) => {
			requests.push(api.put(`/users/${user.id}`, user));
		});

		deletedUsers.forEach((user) => {
			requests.push(api.delete(`/users/${user.id}`));
		});

		await Promise.all(requests);
		await dispatch('permissions/_sync', createdUsers, { root: true });
	},
};
