const Cube = require('cano-cube');
const requireAll = require('require-all');
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
			const modelsClass = getModelsClass(this.cano.app.paths.api);
			const databaseConfig = buildConfig(this.cano.app.paths.config);
			const { stores, storeDefault } = databaseConfig;
			map(stores, (store, name) => {
				const models = getModels(name, storeDefault, modelsClass);
				if (keys(models).length > 0) {
					const mongoose = require('mongoose');
					const uri = store.connection.uri;
    			mongoose.connect(uri, { promiseLibrary: global.Promise });
					map(models, (store, name) => {
						this.cano.app.models[name] = store.build(mongoose, name);
					});
				}
			});
			resolve();
		})
	}

}

function getModels(nameStore, storeDefault, modelsClass) {
	const currentIsDefault = nameStore === storeDefault;
	const models = {};
	map(modelsClass, (M, name) => {
		const model = new M();
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
function getModelsClass(_path) {
  return require('require-all')(path.join(_path, '/models'));
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

const dbConfigDefault = {
	stores: {
		mongo: {
			connection: { uri: 'mongodb://localhost/test' },
		}
	},
	storeDefault: 'mongo',
}

module.exports = MongooseCube;