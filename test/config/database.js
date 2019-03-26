module.exports = {
	stores: {
		users: {
			connection: { uri: 'mongodb://localhost/db-users' },
			adapter: 'mongoose',
			options: {
				reconnectTries: 50,
        reconnectInterval: 1000,
			},
    },
    articles: {
			connection: { uri: 'mongodb://localhost/db-articles' },
			adapter: 'mongoose',
			options: {
				reconnectTries: 30,
        reconnectInterval: 1000,
			},
		},
	},
	storeDefault: 'users',
};
