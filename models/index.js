"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const process = require("process");
const pg = require("pg");
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.PI3_URL, {
	dialectModule: pg,
	dialectOptions: {
		ssl: {
			require: true,
		},
	},
});

fs.readdirSync(__dirname)
	.filter((file) => {
		return file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts" && file.indexOf(".test.js") === -1;
	})
	.forEach((file) => {
		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
		db[model.name] = model;
	});

Object.keys(db).forEach((modelName) => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
