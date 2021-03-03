import { mapActions, mapGetters, mapState } from 'vuex';

// auth helpers
export const authComputed = {
	...mapState('global/auth', ['currentUser']),
	...mapGetters('global/auth', ['isLoggedIn']),
};

export const homeComputed = {
	...mapState('home', ['stats', 'branchAgents', 'branchTests']),
};

export const authActions = {
	...mapActions('global/auth', ['logIn', 'logOut']),
};

// Users helpers
export const usersComputed = {
	...mapState('users', ['users']),
	...mapGetters('users', ['active']),
};

export const usersActions = {
	...mapActions('users', {
		getUsersAction: 'getUsersList',
		saveUserAction: 'saveUser',
		deleteUserAction: 'deleteUser',
		editUserAction: 'editUser',
		suspendUserAction: 'suspendUser',
		activateUserAction: 'activateUser',
	}),
};

// Branches helpers
export const branchesComputed = {
	...mapState('branches', ['branches']),
	...mapGetters('branches', ['active']),
};

export const branchesActions = {
	...mapActions('branches', {
		getBranchesAction: 'getBranchesList',
		saveBranchAction: 'saveBranch',
		deleteBranchAction: 'deleteBranch',
		editBranchAction: 'editBranch',
		editMainAction: 'editMain',
	}),
};

// Branches helpers
export const agentsComputed = {
	...mapState('agents', ['items']),
	...mapGetters('agents', ['active']),
};

export const agentsActions = {
	...mapActions('agents', {
		getAgentsAction: 'getAgentsList',
		saveAgentAction: 'saveAgent',
		deleteAgentAction: 'deleteAgent',
		editAgentAction: 'editAgent',
	}),
};

// Companies helpers
export const companiesComputed = {
	...mapState('companies', ['companies']),
	...mapGetters('companies', ['active']),
};

export const companiesActions = {
	...mapActions('companies', {
		getCompaniesAction: 'getCompaniesList',
		saveCompanyAction: 'saveCompany',
		deleteCompanyAction: 'deleteCompany',
		getCompanyAction: 'getCompany',
		editCompanyAction: 'editCompany',
	}),
};

// Batches helpers
export const batchesComputed = {
	...mapState('batches', ['batches']),
};

export const batchesActions = {
	...mapActions('batches', {
		getBatchesAction: 'getBatchesList',
		saveBatchAction: 'saveBatch',
		deleteBatchAction: 'deleteBatch',
		editBatchAction: 'editBatch',
		getBatchAction: 'getBatch',
	}),
};

// Tests helpers
export const testsComputed = {
	...mapState('tests', ['tests']),
	...mapGetters('tests', ['active']),
};

export const testsActions = {
	...mapActions('tests', {
		getTestsAction: 'getTestsList',
		saveTestAction: 'saveTest',
		deleteTestAction: 'deleteTest',
		editTestAction: 'editTest',
	}),
};

// Invoices helpers
export const invoicesComputed = {
	...mapState('invoices', ['items']),
	...mapGetters('invoices', ['active']),
};

export const invoicesActions = {
	...mapActions('invoices', {
		getInvoicesAction: 'getInvoicesList',
		saveInvoiceAction: 'saveInvoice',
		editRemainAction: 'editRemain',
		isAgentExistAction: 'isAgentExist',
	}),
};

export const resultsActions = {
	...mapActions('results', {
		saveResultAction: 'saveResult',
		editResultAction: 'editResult',
		getResultAction: 'getResult',
		editDeliveredAction: 'editDelivered',
	}),
};

export const reportsActions = {
	...mapActions('reports', ['getFinancialData', 'getFinancialSummary']),
};

export const permissionsActions = {
	...mapActions('permissions', ['getUserPermissions', 'saveUserPermissions', 'editUserPermissions']),
};
