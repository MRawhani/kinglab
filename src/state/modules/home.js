export const state = {
	stats: null,
	branchAgents: [],
	branchTests: [],
};

export const mutations = {
	SET_STATS(state, stats) {
		state.stats = stats;
	},
	SET_BRANCH_AGENTS(state, data) {
		state.branchAgents = data;
	},
	SET_BRANCH_TESTS(state, data) {
		state.branchTests = data;
	},
};
