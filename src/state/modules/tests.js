import Vue from 'vue';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	tests: [],
};

export const getters = {
	active(state) {
		return state.tests.filter((test) => test.state !== 3);
	},
};

export const mutations = {
	SET_TESTS(state, testsList) {
		state.tests = [];

		testsList.forEach((test, i) => {
			Vue.set(state.tests, i, test);
		});
	},
	ADD_TEST(state, newTest) {
		if (newTest.id) state.tests.push(newTest);
		else
			state.tests.push({
				id: generateId(state.tests),
				...newTest,
				state: 1,
			});
	},
	DELETE_TEST(state, testId) {
		const current = state.tests.find((test) => test.id === testId);
		if (current.state === 1) state.tests = state.tests.filter((test) => test.id !== testId);
		else {
			current.state = 3;
			state.tests.filter((test, i) => {
				if (test.id === testId) {
					Vue.set(state.tests, i, current);
				}
			});
		}
	},
	EDIT_TEST(state, testData) {
		const current = state.tests.find((test) => test.id === testData.id);
		const data = {
			...testData,
			state: current.state === 0 ? 2 : 1,
		};

		state.tests.filter((test, i) => {
			if (test.id === testData.id) {
				Vue.set(state.tests, i, data);
			}
		});
	},
};

export const actions = {
	getTestsList({ commit }) {
		return api.get('/tests').then((response) => {
			const { data } = response.data;
			commit('SET_TESTS', data);
			return data;
		});
	},
	saveTest({ commit }, newTest) {
		commit('ADD_TEST', newTest);

		// return api.post('/tests', newTest).then((res) => {
		// 	const { data } = res.data;
		// 	commit('ADD_TEST', data);
		// 	return data;
		// });
	},
	deleteTest({ commit }, testId) {
		commit('DELETE_TEST', testId);

		// return api.delete(`/tests/${testId}`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('DELETE_TEST', testId);
		// 	return data;
		// });
	},
	editTest({ commit }, { testData, testId }) {
		commit('EDIT_TEST', {
			...testData,
			id: testId,
		});

		// return api.put(`/tests/${testId}`, testData).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_TEST', data);
		// 	return data;
		// });
	},

	async sync({ state }) {
		const requests = [];
		const tests = state.tests;

		const newTests = tests.filter((test) => test.state === 1);
		const editedTests = tests.filter((test) => test.state === 2);
		const deletedTests = tests.filter((test) => test.state === 3);

		newTests.forEach((test) => {
			requests.push(api.post('/tests', test));
		});

		editedTests.forEach((test) => {
			requests.push(api.put(`/tests/${test.id}`, test));
		});

		deletedTests.forEach((test) => {
			requests.push(api.delete(`/tests/${test.id}`));
		});

		await Promise.all(requests);
	},
};
