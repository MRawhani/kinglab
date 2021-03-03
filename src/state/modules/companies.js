import Vue from 'vue';
import { getState } from '../../utils/local-stoage-utils';
import api from '../../utils/api';
import { generateId } from '../../utils/helpers';

export const state = {
	companies: getState('vuex.companies') || [],
};

export const getters = {
	active(state) {
		return state.companies.filter((company) => company.state !== 3);
	},
};

export const mutations = {
	SET_COMPANIES(state, companiesList) {
		state.companies = [];

		companiesList.forEach((company, i) => {
			Vue.set(state.companies, i, company);
		});
	},
	ADD_COMPANY(state, newCompany) {
		if (newCompany.id) state.companies.push(newCompany);
		else
			state.companies.push({
				id: generateId(state.companies),
				...newCompany,
				state: 1,
			});
	},
	DELETE_COMPANY(state, companyId) {
		const current = state.companies.find((company) => company.id === companyId);
		if (current.state === 1) state.companies = state.companies.filter((company) => company.id !== companyId);
		else {
			current.state = 3;
			state.companies.filter((company, i) => {
				if (company.id === companyId) {
					Vue.set(state.companies, i, current);
				}
			});
		}
	},
	EDIT_COMPANY(state, companyData) {
		const current = state.companies.find((company) => company.id === companyData.id);
		const data = {
			...companyData,
			state: current.state === 0 ? 2 : 1,
		};

		state.companies.filter((company, i) => {
			if (company.id === companyData.id) {
				Vue.set(state.companies, i, data);
			}
		});
	},
};

export const actions = {
	getCompaniesList({ commit }) {
		return api.get('/companies').then((response) => {
			const { data } = response.data;
			commit('SET_COMPANIES', data);
			return data;
		});
	},
	saveCompany({ commit }, newCompany) {
		commit('ADD_COMPANY', newCompany);

		// return api.post('/companies', newCompany).then((res) => {
		// 	const { data } = res.data;
		// 	commit('ADD_COMPANY', data);
		// 	return data;
		// });
	},
	deleteCompany({ commit }, companyId) {
		commit('DELETE_COMPANY', companyId);

		// return api.delete(`/companies/${companyId}`).then((res) => {
		// 	const { data } = res.data;
		// 	commit('DELETE_COMPANY', companyId);
		// 	return data;
		// });
	},
	getCompany(context, companyId) {
		return api.get(`/companies/${companyId}`).then((res) => {
			return res.data.data;
		});
	},
	editCompany({ commit }, { companyData, companyId }) {
		commit('EDIT_COMPANY', {
			...companyData,
			id: companyId,
		});

		// return api.put(`/companies/${companyId}`, companyData).then((res) => {
		// 	const { data } = res.data;
		// 	commit('EDIT_COMPANY', data);
		// 	return data;
		// });
	},

	async sync({ state }) {
		const requests = [];
		const companies = state.companies;

		const newCompanies = companies.filter((branch) => branch.state === 1);
		const editedCompanies = companies.filter((branch) => branch.state === 2);
		const deletedCompanies = companies.filter((branch) => branch.state === 3);

		newCompanies.forEach((branch) => {
			requests.push(api.post('/companies', branch));
		});

		editedCompanies.forEach((branch) => {
			requests.push(api.put(`/companies/${branch.id}`, branch));
		});

		deletedCompanies.forEach((branch) => {
			requests.push(api.delete(`/companies/${branch.id}`));
		});

		await Promise.all(requests);
	},
};
