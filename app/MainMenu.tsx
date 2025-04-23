import React from "react";
import { useLocalSearchParams } from "expo-router";
import MenuScreen from "../components/MenuScreen";
import menuOptions from "../data/menuOptions.json";

const MainMenu: React.FC = () => {
	const { type } = useLocalSearchParams(); // Obtiene el tipo de menú desde la URL
	// Validar si el tipo existe en los datos
	const selectedMenu = menuOptions[type as keyof typeof menuOptions];

	if (!selectedMenu) {
		return <MenuScreen title="Menú no encontrado" options={[]} />;
	}

	return <MenuScreen {...selectedMenu} />;
};

export default MainMenu;
