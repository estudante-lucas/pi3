import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";

class Quadro extends Model {
	public id!: number;
	public nome!: string;
	public criadoEm!: Date;
	public atualizadoEm?: Date;
	public criadoPor?: number;
	public atualizadoPor?: number;
	public apagadoEm?: Date;
}

Quadro.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		nome: {
			type: DataTypes.STRING(100),
			allowNull: false,
		},
		criadoEm: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		atualizadoEm: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		criadoPor: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "usuarios",
				key: "id",
			},
		},
		atualizadoPor: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: "usuarios",
				key: "id",
			},
		},
		apagadoEm: {
			type: DataTypes.DATE,
			allowNull: true,
		},
	},
	{
		sequelize,
		modelName: "Quadro",
		tableName: "quadros",
		timestamps: false,
		underscored: true,
	}
);

export default Quadro;
