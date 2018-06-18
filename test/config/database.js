module.exports = {
	stores: {
		users: {
			connection: { uri: 'mongodb://localhost/db-users' },
			adapter: 'mongoose',
    },
    articles: {
			connection: { uri: 'mongodb://localhost/db-articles' },
			adapter: 'mongoose',
		},
	},
	storeDefault: 'users',
};
