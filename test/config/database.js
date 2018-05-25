module.exports = {
	stores: {
		users: {
			connection: { uri: 'mongodb://localhost/db-users' },
    },
    articles: {
			connection: { uri: 'mongodb://localhost/db-articles' },
		},
	},
	storeDefault: 'users',
};