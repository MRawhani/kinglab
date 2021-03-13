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

		state.results.forEach((result, i) => {
			if (result.id === resultData.id) {
				Vue.set(state.results, i, data);
			}
		});
	},
	DELIVER_RESULT(state, resultId) {
		const current = state.results.find((result) => result.operation_id == resultId);

		const data = {
			...current,
			delivered: 1,
			delivered_at: new Date(),
			state: current.state === 0 ? 2 : 1,
		};

		state.results.forEach((result, i) => {
			if (result.id === data.id) {
				Vue.set(state.results, i, data);
			}
		});
	},
};

export const actions = {
	saveResult({ commit }, newResult) {
		commit('ADD_RESULT', newResult);
	},

	getResult({ state }, id) {
		return new Promise((resolve, reject) => {
			const result = state.results.find((result) => result.operation_id === id);
			if (!result) reject(new Error('Result not found'));

			resolve(result);
		});
	},

	getResultData({ state, rootState }, id) {
		return new Promise((resolve, reject) => {
			const result = state.results.find((result) => result.operation_id == id);
			const invoice = rootState.invoices.items.find((invoice) => invoice.id == id);
			const agentId = invoice.agent_id ? invoice.agent_id : invoice.agents[0].id;
			const agent = rootState.agents.items.find((agent) => agent.id === agentId);
			if (!result) reject(new Error('Result not found'));
			if (!agent) reject(new Error('Agent not found'));

			resolve({ result, invoice, agent });
		});
	},

	editResult({ commit }, { resultData, resultId }) {
		commit('EDIT_RESULT', {
			...resultData,
			id: resultId,
		});
	},

	editDelivered({ commit }, resultId) {
		commit('DELIVER_RESULT', resultId);
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
					delivered: result.delivered,
					note: result.note,
				})
			);
		});

		await Promise.all(requests);
	},
};
