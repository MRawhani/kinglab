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

export { dataTableQuery, generateId };
