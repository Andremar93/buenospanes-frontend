import React from "react";
import MenuScreen from "./MenuScreen";

const ExpensesMenu: React.FC = () => {
	const options = [
		{ id: "1", title: "Crear gasto", screen: "/CreateExpense" },
		{ id: "2", title: "Ver Gastos", screen: "/SeeExpenses" },
	];

	return <MenuScreen title="Gastos" options={options} />;
};

export default ExpensesMenu;
