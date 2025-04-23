import React from "react";
import MenuScreen from "../components/MenuScreen";

interface MenuOptionsScreenProps {
	title: string;
	options: { id: string; title: string; screen: string }[];
}

const MenuOptionsScreen: React.FC<MenuOptionsScreenProps> = ({
	title,
	options,
}) => {
	return <MenuScreen title={title} options={options} />;
};

export default MenuOptionsScreen;
