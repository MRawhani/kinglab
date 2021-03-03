import Vue from 'vue';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	results: [],
};

export const getters = {};

export const mutations = {
	SET_RESULTES(state, newResults) {
		state.results = [];

		newResults.forEach((result, i) => {
			Vue.set(state.results, i, result);
		});
	},
	ADD_RESULT(state, newResult) {
		if (newResult.id) state.results.push(newResult);
		else
			state.results.push({
				id: generateId(state.results),
				...newResult,
				state: 1,
			});
	},
	EDIT_RESULT(state, resultData) {
		const current = state.results.find((result) => result.id === resultData.id);
		const data = {
			...resultData,
			state: current.state === 0 ? 2 : 1,
		};

		state.results.filter((result, i) => {
			if (result.id === resultData.id) {
				Vue.set(state.results, i, data);
			}
		});
	},
};

export const actions = {
	saveResult({ commit }, newResult) {
		commit('ADD_RESULT', newResult);

		// return api.post('/testResults', newResult).then((res) => {
		// 	const { data } = res.data;
		// 	return data;
		// });
	},
	getResult({ state }, id) {
		return new Promise((resolve, reject) => {
			const result = state.results.find((result) => result.operation_id === id);
			if (!result) reject(new Error('Result not found'));

			resolve(result);
		});
	},
	editResult({ commit }, { resultData, resultId }) {
		commit('EDIT_RESULT', {
			...resultData,
			id: resultId,
		});

		// return api.put(`/testResults/${resultId}`, resultData).then((res) => {
		// 	const { data } = res.data;
		// 	return data;
		// });
	},

	async _sync({ state }, createdInvoices) {
		const requests = [];
		const results = state.results;

		console.log(createdInvoices);

		const newResults = results.filter((result) => result.state === 1);
		const editedResults = results.filter((result) => result.state === 2);

		newResults.forEach((result) => {
			const operationId = !createdInvoices.length
				? result.operation_id
				: createdInvoices.find((invoice) => invoice.old === result.operation_id).new;

			requests.push(api.post('/testResults', { result, operation_id: operationId }));
		});

		editedResults.forEach((result) => {
			requests.push(
				api.put(`/testResults/${result.id}`, {
					operation_id: result.operation_id,
					result: result.result,
					note: result.note,
				})
			);
		});

		await Promise.all(requests);
	},
};
