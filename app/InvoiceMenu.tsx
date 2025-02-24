import React from "react";
import MenuScreen from "./MenuScreen";

const InvoiceMenu: React.FC = () => {
	const options = [
		{ id: "1", title: "Crear facturas", screen: "/CreateInvoice" },
		{ id: "2", title: "Ver Facturas", screen: "/SeeInvoices" },
	];

	return <MenuScreen title="Facturas" options={options} />;
};

export default InvoiceMenu;
