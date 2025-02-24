import React, { useEffect } from "react";
import { Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HelloWave } from "@/components/HelloWave";
import { useUser } from "@/contexts/UserContext";
import { useExchangeRate } from "@/contexts/ExchangeRateContext";
import { useRootNavigationState } from "expo-router";

const options = [
	{ id: "1", title: "Gastos", screen: "/ExpensesMenu" as const },
	{ id: "2", title: "Facturas", screen: "/InvoiceMenu" as const },
	{ id: "3", title: "Ingresos", screen: "/IncomeMenu" as const },
	{ id: "4", title: "Empleados", screen: "/employees" as const },
] as const;

const HomeScreen: React.FC = () => {
	const router = useRouter();
	const exchangeRate = useExchangeRate();
	const { user } = useUser();
	const handlePress = (screen: (typeof options)[number]["screen"]) => {
		router.push(screen);
	};

	const navigationState = useRootNavigationState(); // Detecta si el router está listo

	useEffect(() => {
		if (!navigationState?.key) return; // Espera hasta que el Root Layout esté montado

		if (!user?.token) {
			router.replace("/login");
		}
	}, [navigationState?.key]);

	return (
		<ThemedView style={[styles.container]}>
			<ThemedView style={styles.titleContainer}>
				<ThemedText type="title">
					Hola {user?.username || "Guest"}!
				</ThemedText>
				<HelloWave />
			</ThemedView>
			<ThemedText type="subtitle">
				Tasa del día:{" "}
				{exchangeRate.exchangeRate !== null
					? `Bs. ${exchangeRate.exchangeRate}`
					: "No disponible"}
			</ThemedText>
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
	containerDark: {
		backgroundColor: "#121212",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#000",
	},
	textDark: {
		color: "#fff",
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
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});

export default HomeScreen;
