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
import * as SecureStore from "expo-secure-store";

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
			return;
		}

		const fetchExchangeRate = async () => {
			const token = await SecureStore.getItemAsync("userToken");
			if (token) {
				checkExchangeRate(token);
			} else {
				// Si no hay token, tal vez redirigir o manejar error
				router.replace("/login");
			}
		};

		fetchExchangeRate();
	}, [navigationState?.key, user?.token]);

	const handleSaveExchangeRate = async () => {
		const rate = parseFloat(newExchangeRate);
		if (isNaN(rate) || rate <= 0) {
			Alert.alert("Error", "Ingrese una tasa de cambio válida");
			return;
		}

		const token = await SecureStore.getItemAsync("userToken");
		const success = await setExchangeRate(rate, token);

		if (success) {
			Alert.alert("Éxito", "Tasa de cambio guardada correctamente");
		} else {
			Alert.alert("Error", "No se pudo guardar la tasa de cambio");
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
			{!exchangeRate && (
				<ThemedText
					type="default"
					style={{ marginBottom: 10, color: "#999" }}
				>
					Debes ingresar una tasa de cambio para habilitar el menú.
				</ThemedText>
			)}
			<FlatList
				data={menuData.mainMenu.options} // Cargar opciones desde el JSON
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => {
					const isDisabled = !exchangeRate;
					return (
						<TouchableOpacity
							style={[
								styles.button,
								isDisabled && styles.disabledButton,
							]}
							onPress={() => handlePress(item.screen, item.type)}
							disabled={isDisabled}
						>
							<Text
								style={[
									styles.buttonText,
									isDisabled && styles.disabledButtonText,
								]}
							>
								{item.title}
							</Text>
						</TouchableOpacity>
					);
				}}
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
	disabledButton: {
		backgroundColor: "#ccc",
	},
	disabledButtonText: {
		color: "#888",
	},
});

export default PrincipalMenu;
