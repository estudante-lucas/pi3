import { DataTypes, Model } from "sequelize";
import Usuario from "./Usuario";
import { sequelize } from "./index";

class Coluna extends Model {
	public id!: number;
	public nome!: string;
	public quadro!: number;
	public posicao!: number;
	public criadoEm!: Date;
	public atualizadoEm?: Date;
	public criadoPor!: number;
	public atualizadoPor?: number;
	public apagadoEm?: Date;
}

Coluna.init(
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
		quadro: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Quadro,
				key: "id",
			},
		},
		posicao: {
			type: DataTypes.INTEGER,
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
				model: Usuario,
				key: "id",
			},
		},
		atualizadoPor: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Usuario,
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
		modelName: "Coluna",
		tableName: "colunas",
		timestamps: false,
		underscored: true,
	}
);

import Quadro from "./Quadro";

Quadro.hasMany(Coluna, { foreignKey: "quadro" });
Coluna.belongsTo(Quadro, { as: "quadroId", foreignKey: "quadro" });

Coluna.belongsTo(Usuario, { as: "atualizador", foreignKey: "atualizadoPor" });
Coluna.belongsTo(Usuario, { as: "criador", foreignKey: "criadoPor" });

export default Coluna;
