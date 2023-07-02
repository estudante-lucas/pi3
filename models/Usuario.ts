import { DataTypes, Model } from "sequelize";
import { sequelize } from "./index";

class Usuario extends Model {
	public id!: number;
	public email!: string;
	public senha!: string;
	public nome!: string;
	public criadoEm!: Date;
	public atualizadoEm?: Date;
	public criadoPor?: number;
	public atualizadoPor?: number;
	public apagadoEm?: Date;
}

Usuario.init(
	{
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
		},
		email: {
			type: DataTypes.STRING(80),
			allowNull: false,
			unique: true,
		},
		senha: {
			type: DataTypes.STRING(100),
			allowNull: false,
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
		modelName: "Usuario",
		tableName: "usuarios",
		timestamps: false,
		underscored: true,
	}
);

export default Usuario;
