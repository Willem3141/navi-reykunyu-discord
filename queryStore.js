let store = {};

function getKeyFor(query) {
	const key = [...Array(8)].map(() =>
			Math.floor(Math.random() * 16).toString(16)).join('');
	store[key] = query;
	console.log('storing ' + key);
	return key;
}

function retrieveQueryFor(key) {
	console.log('retrieving ' + key);
	return store[key];
}

module.exports = {
	getKeyFor: getKeyFor,
	retrieveQueryFor: retrieveQueryFor
};
