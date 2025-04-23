// MenuScreen.tsx
import React from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";

type Option = {
	id: string;
	title: string;
	screen: string;
};

interface MenuScreenProps {
	title: string;
	options: Option[];
}

const MenuScreen: React.FC<MenuScreenProps> = ({ title, options }) => {
	const router = useRouter();

	const handlePress = (screen: string) => {
		router.push(screen as never);
	};

	return (
		<ThemedView style={styles.container}>
			<Text style={styles.title}>{title}</Text>
			<FlatList
				data={options}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.button}
						onPress={() => handlePress(item.screen)}
					>
						<Text style={styles.buttonText}>{item.title}</Text>
					</TouchableOpacity>
				)}
			/>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 10,
		marginVertical: 10,
		width: 200,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});

export default MenuScreen;
