import React from "react";
import MenuScreen from "./MenuScreen";

const IncomeMenu: React.FC = () => {
	const options = [
		{ id: "1", title: "Crear Ingreso", screen: "/CreateExpense" },
		{ id: "2", title: "Ver Ingresos", screen: "/SeeExpenses" },
	];

	return <MenuScreen title="Ingresos" options={options} />;
};

export default IncomeMenu;
