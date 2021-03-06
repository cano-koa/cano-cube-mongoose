const Cube = require('cano-cube');
const merge = require('lodash/merge');
const keys = require('lodash/keys');
const map = require('lodash/map');
const path = require('path');

/**
 * @class MongooseCube
 * @classdesc This cube is for instance, load and bind mongoose model to the cano app core
 * @extends Cube
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
class MongooseCube extends Cube {
	/**
	 * @constructs
	 * @author Ernesto Rojas <ernesto20145@gmail.com>
	 */
	constructor(cano) {
		super(cano);
	}

	/**
	 * @override
	 * @method prepare
	 * @description Ask if the cano.app.models object exist, if not exist
	 * the method create the proton.app.models object
	 * @author Ernesto Rojas <ernesto20145@gmail.com>
	 */
	prepare() {
		return new Promise((resolve) => {
			if (!this.cano.app.models) this.cano.app.models = {};
			resolve();
		});
	}

	/**
	 * @override
	 * @method up
	 * @description This method run the cube mongoose model main logic, in this case, instance
	 * all the models in the api folder and bind it to the cano app core
	 * @author Ernesto Rojas <ernesto20145@gmail.com>
	 */
	up() {
		return new Promise((resolve) => {
			const models = getModelsClass(this.cano.app.paths.api);
			const databaseConfig = buildConfig(this.cano.app.paths.config);
			const { stores, storeDefault } = databaseConfig;
			map(stores, (store, name) => {
				if (store.adapter === 'mongoose') {
					const modelsStore = getModels(name, storeDefault, models);
					if (keys(modelsStore).length > 0) {
						const mongoose = require('mongoose');
						const uri = store.connection.uri;
						const options = getOptions(store.options);
						const connection = mongoose.createConnection(uri, options);
						map(modelsStore, (store, name) => {
							this.cano.app.models[name] = store.build(connection, name);
							Object.defineProperty(global, name, {
								writable: false,
								value: this.cano.app.models[name]
							})
						});
					}
				}
			});
			resolve();
		})
	}

}

/**
 * @method getModels
 * @param {string} String with store's name.
 * @param {string} String with store default name.
 * @param {object} Object with all models defined into project.
 * @description This methos gel all models of current store.
 * @returns {object} Object with the models of current store.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function getModels(nameStore, storeDefault, modelsClass) {
	const models = {};
	map(modelsClass, (model, name) => {
		const store = model.store || storeDefault;
		if (store === nameStore) {
			models[name]=model;
		}
	});
	return models;
}

/**
 * @method getModelsClass
 * @param {string} String with the path to the configuration database file.
 * @description This method allows configuration database file to be required in the same object.
 * @returns {object} Object with the required configuration database file.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function getModelsClass(path) {
	const modelsRef = require('require-all')(`${path}/models`);
	const models = {};
	map(modelsRef, (Model, name) => {
		models[name] = new Model();
	});
  return models;
}

/**
 * @method buildConfig
 * @param {string} String with the path to the configuration database file.
 * @description This method allows configuration database file to be required in the same object.
 * @returns {object} Object with the required configuration database file.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function buildConfig(_path) {
  return merge({}, dbConfigDefault, require(path.join(_path, '/database.js')));
}

/**
 * @method getOptions
 * @param {object} Object with connection options for mongoose defined in database.js file in config folder at cano project.
 * @description This method return a object with connection options valid for mongoose. If not defined options params, return default options.
 * @returns {object} Object with connection options for mongoose.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function getOptions(options = {}) {
	return Object.assign({}, optionsDefault, options);
}

const optionsDefault = {
	promiseLibrary: global.Promise,
	useCreateIndex: true,
	useNewUrlParser: true,
};

const dbConfigDefault = {
	stores: {
		mongo: {
			connection: { uri: 'mongodb://localhost/test' },
			adapter: 'mongoose',
			options: {
				promiseLibrary: global.Promise,
				useNewUrlParser: true,
				useCreateIndex: true,
			},
		},
	},
	storeDefault: 'mongo',
}

module.exports = MongooseCube;
