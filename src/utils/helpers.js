import { getState } from './local-stoage-utils';
/**
 * make query params string for data table options
 */

function dataTableQuery({ page, itemsPerPage, search }) {
	return `query=${search.trim()}&page=${page}&itemsPerPage=${itemsPerPage}`;
}

function generateId(items) {
	const id = Math.max(...items.map((item) => item.id)) + 1;
	return id === -Infinity ? 1 : id;
}

function generateInvoiceId() {
	const { data } = getState('currentUser');
	const randomKey = Math.floor(Math.random() * Date.now());
	return `${data.id}${data.branch_id}${randomKey}`;
}

export { dataTableQuery, generateId, generateInvoiceId };
