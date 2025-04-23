import React, { useEffect, useState } from "react";
import {
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	View,
	TextInput,
	Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { HelloWave } from "@/components/HelloWave";
import { useUser } from "@/contexts/UserContext";
import { useRootNavigationState } from "expo-router";
import menuData from "@/data/menuOptions.json"; // Importar el JSON
import useStore from "../store/store";

const PrincipalMenu: React.FC = () => {
	const router = useRouter();
	const { user } = useUser();
	const { exchangeRate, setExchangeRate, checkExchangeRate } = useStore();

	const navigationState = useRootNavigationState(); // Detecta si el router está listo
	const [newExchangeRate, setNewExchangeRate] = useState(""); // Capturar la tasa de cambio

	// useEffect para verificar la tasa de cambio cuando el usuario inicia sesión
	useEffect(() => {
		if (!navigationState?.key) return; // Espera hasta que el Root Layout esté montado
		if (!user?.token) {
			router.replace("/login");
		}
		// Verificar si ya hay una tasa de cambio
		checkExchangeRate();
	}, [navigationState?.key]);

	// Guardar la tasa de cambio ingresada en el formulario
	const handleSaveExchangeRate = () => {
		const rate = parseFloat(newExchangeRate);
		if (isNaN(rate) || rate <= 0) {
			Alert.alert("Error", "Ingrese una tasa de cambio válida");
			return;
		}
		const exchangeRateSet = setExchangeRate(rate); // ✅ Guardamos en Zustand
		console.log("exchangeRateSet", exchangeRateSet);
		if (exchangeRateSet) {
			Alert.alert("Éxito", "Tasa de cambio guardada correctamente");
		} else {
			Alert.alert("ERROR? ", exchangeRateSet);
		}
	};

	const handlePress = (menu: string, type: string) => {
		router.push(`/MainMenu?type=${type}`); // Pasar el tipo como parámetro en la URL
	};

	return (
		<ThemedView style={styles.container}>
			<View style={styles.titleContainer}>
				<ThemedText type="title">
					Hola {user?.username || "Guest"}!
				</ThemedText>
				<HelloWave />
			</View>

			{/* FORMULARIO PARA LA TASA DE CAMBIO (visible solo si no hay tasa) */}
			{!exchangeRate && (
				<View style={styles.exchangeRateContainer}>
					<Text style={styles.modalTitle}>
						Ingresar Tasa de Cambio
					</Text>
					<TextInput
						style={styles.input}
						keyboardType="numeric"
						placeholder="Ejemplo: 38.5"
						value={newExchangeRate}
						onChangeText={setNewExchangeRate}
					/>
					<TouchableOpacity
						style={styles.button}
						onPress={handleSaveExchangeRate}
					>
						<Text style={styles.buttonText}>Guardar</Text>
					</TouchableOpacity>
				</View>
			)}
			{/* MOSTRAR TASA DE CAMBIO SI YA ESTÁ DEFINIDA */}
			<View style={styles.exchangeMessage}>
				{exchangeRate && (
					<ThemedText type="subtitle">
						Tasa del día: Bs. {exchangeRate}
					</ThemedText>
				)}
			</View>
			{/* MENÚ PRINCIPAL */}
			<FlatList
				data={menuData.mainMenu.options} // Cargar opciones desde el JSON
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.button}
						onPress={() => handlePress(item.screen, item.type)}
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
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
		paddingBottom: 10,
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
	exchangeRateContainer: {
		backgroundColor: "#f8f9fa",
		padding: 20,
		borderRadius: 10,
		width: "90%",
		alignItems: "center",
		marginBottom: 20,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 7,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		width: "100%",
		marginBottom: 10,
		borderRadius: 5,
		textAlign: "center",
	},
	exchangeMessage: {
		paddingBottom: 5,
	},
});

export default PrincipalMenu;
