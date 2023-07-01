import * as fs from "fs";
import * as path from "path";
import { Sequelize } from "sequelize";

import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the database configuration from environment variables
const dbConfig = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
};

if (dbConfig.database || dbConfig.user) throw new Error("Configure as variáveis de ambiente corretamente. Veja no arquivo README.md!");

// Cria uma instância do Sequelize
const sequelize = new Sequelize(dbConfig.database!, dbConfig.user!, dbConfig.password, {
	host: dbConfig.host,
	dialect: "mysql",
});

const runMigrations = async (): Promise<void> => {
	try {
		// Define o diretório onde as migrations estão localizadas
		const migrationsDir = path.join(__dirname, "caminho/para/as/migrations");

		// Obtém a lista de arquivos no diretório de migrations
		const migrationFiles = await fs.promises.readdir(migrationsDir);

		// Executa as migrations
		for (const file of migrationFiles) {
			const migrationFilePath = path.join(migrationsDir, file);
			const migration = require(migrationFilePath);

			await migration.up(sequelize.getQueryInterface(), Sequelize);
			console.log(`Migration ${file} executada com sucesso.`);
		}

		console.log("Todas as migrations foram executadas com sucesso.");
	} catch (error: any) {
		console.error("Erro ao executar as migrations:", error.message);
	}
};

const testConnection = async (): Promise<void> => {
	try {
		await sequelize.authenticate();
		console.log("Conexão estabelecida com sucesso!");
	} catch (error: any) {
		console.error("Erro ao estabelecer conexão:", error.message);
	}
};

testConnection();
runMigrations();

export default sequelize;
