import Vue from 'vue';
import api from '../../utils/api';
import { dataTableQuery, generateId } from '../../utils/helpers';

export const state = {
	items: [],
};

export const getters = {
	active(state) {
		return state.items.filter((agent) => agent.state !== 3);
	},
};

export const mutations = {
	SET_AGENTS(state, agentsList) {
		state.items = [];

		agentsList.forEach((agent, i) => {
			Vue.set(state.items, i, agent);
		});
	},
	ADD_AGENT(state, newAgent) {
		if (newAgent.id) state.items.push(newAgent);
		else
			state.items.push({
				id: generateId(state.items),
				...newAgent,
				state: 1,
			});
	},
	DELETE_AGENT(state, agentId) {
		const current = state.items.find((agent) => agent.id === agentId);
		if (current.state === 1) state.items = state.items.filter((agent) => agent.id !== agentId);
		else {
			current.state = 3;
			state.items.filter((agent, i) => {
				if (agent.id === agentId) {
					Vue.set(state.items, i, current);
				}
			});
		}
	},
	EDIT_AGENT(state, agentData) {
		const current = state.items.find((agent) => agent.id === agentData.id);
		const data = {
			...agentData,
			state: current.state === 0 ? 2 : 1,
		};

		state.items.filter((agent, i) => {
			if (agent.id === agentData.id) {
				Vue.set(state.items, i, data);
			}
		});
	},
};

export const actions = {
	getAgentsList({ commit }, options) {
		return api.get(`/agents?${dataTableQuery(options)}`).then((response) => {
			const data = response.data;
			commit('SET_AGENTS', {
				data: data.data,
				total: data.meta.total,
			});
			return data;
		});
	},
	saveAgent({ commit }, newAgent) {
		commit('ADD_AGENT', newAgent);

		// return api.post('/agents', newAgent).then((res) => {
		// 	const { data } = res.data;
		// 	commit('ADD_AGENT', data);
		// 	return data;
		// });
	},
	deleteAgent({ commit }, agentId) {
		commit('DELETE_AGENT', agentId);
		commit('invoices/DELETE_AGENT_INVOICES', agentId, { root: true });

		// return api.delete(`/agents/${agentId}`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('DELETE_AGENT', agentId);
		// 	return data;
		// });
	},
	editAgent({ commit }, { agentData, agentId }) {
		commit('EDIT_AGENT', {
			...agentData,
			id: agentId,
		});

		// return api.put(`/agents/${agentId}`, agentData).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_AGENT', data);
		// 	return data;
		// });
	},

	async sync({ state, dispatch }) {
		const requests = [];
		const agents = state.items;

		const newAgents = agents.filter((agent) => agent.state === 1);
		const editedAgents = agents.filter((agent) => agent.state === 2);
		const deletedAgents = agents.filter((agent) => agent.state === 3);

		newAgents.forEach((agent) => {
			requests.push(api.post('/agents', agent));
		});

		const results = await Promise.all(requests);
		const newIds = [];
		results.forEach(({ data }, i) => {
			newIds.push({
				old: newAgents[i].id,
				new: data.data.id,
			});
		});

		if (newIds.length) await dispatch('invoices/updateInvoiceAgents', newIds, { root: true });

		results.length = 0;

		editedAgents.forEach((agent) => {
			requests.push(api.put(`/agents/${agent.id}`, agent));
		});

		deletedAgents.forEach((agent) => {
			requests.push(api.delete(`/agents/${agent.id}`));
		});

		await Promise.all(requests);
	},
};
