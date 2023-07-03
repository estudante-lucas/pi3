import { DataTypes, Model } from "sequelize";
import Coluna from "./Coluna";
import Usuario from "./Usuario";
import { sequelize } from "./index";

class Projeto extends Model {
	public id!: number;
	public nome!: string;
	public descricao?: string;
	public responsavel?: number;
	public coluna!: number;
	public criadoEm!: Date;
	public atualizadoEm?: Date;
	public criadoPor!: number;
	public atualizadoPor?: number;
	public apagadoEm?: Date;
}

Projeto.init(
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
		descricao: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		responsavel: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: Usuario,
				key: "id",
			},
		},
		coluna: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Coluna,
				key: "id",
			},
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
		modelName: "Projeto",
		tableName: "projetos",
		timestamps: false,
		underscored: true,
	}
);

Coluna.hasMany(Projeto, { foreignKey: "coluna" });
Projeto.belongsTo(Coluna, { as: "colunaId", foreignKey: "coluna" });

Projeto.belongsTo(Usuario, { foreignKey: "responsavel" });
Projeto.belongsTo(Usuario, { as: "atualizador", foreignKey: "atualizadoPor" });
Projeto.belongsTo(Usuario, { as: "criador", foreignKey: "criadoPor" });

export default Projeto;
