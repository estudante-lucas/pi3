import { DataTypes, Model } from "sequelize";
import Projeto from "./Projeto";
import Usuario from "./Usuario";
import { sequelize } from "./index";

class ProjetoLog extends Model {
	public id!: number;
	public coluna!: string;
	public projeto!: number;
	public criadoPor!: number;
	public criadoEm!: Date;
}

ProjetoLog.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		coluna: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		projeto: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Projeto,
				key: "id",
			},
		},
		criadoPor: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Usuario,
				key: "id",
			},
		},
	},
	{
		sequelize,
		modelName: "ProjetoLog",
		tableName: "projetos-logs",
		timestamps: true,
		createdAt: "criadoEm",
		updatedAt: false,
		underscored: true,
	}
);

export default ProjetoLog;
