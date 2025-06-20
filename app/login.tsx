import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { login } from "../services/api";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import * as SecureStore from "expo-secure-store";
import useStore from "../store/store";

const bpLogo = require("../assets/images/buenos-panes-logo.jpeg");

const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { user, setUser, token } = useStore();
	const router = useRouter();
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		setIsReady(true);
	}, []);

	const handleLogin = async () => {
		if (!username || !password) {
			Alert.alert("Error", "Por favor, completa todos los campos");
			return;
		}
		try {
			const response = await login(username, password);

			const userData = {
				id: response.user.id,
				username,
				token: response.token,
			};

			await setUser(userData); // Esto guarda en SecureStore y actualiza Zustand

			Alert.alert("Éxito", "Inicio de sesión exitoso");
			router.replace("/PrincipalMenu");
		} catch (error) {
			Alert.alert(
				"Error",
				error instanceof Error ? error.message : "Error desconocido",
			);
		}
	};

	return (
		<ThemedView style={styles.container}>
			<Image source={bpLogo} style={{ width: 100, height: 100 }} />
			<ThemedText style={styles.title}>Iniciar Sesión</ThemedText>
			<ThemedTextInput
				placeholder="Usuario"
				value={username}
				onChangeText={setUsername}
				autoCapitalize="none"
			/>
			<ThemedTextInput
				placeholder="Contraseña"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			<TouchableOpacity style={styles.button} onPress={handleLogin}>
				<Text style={styles.buttonText}>Ingresar</Text>
			</TouchableOpacity>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		justifyContent: "center",
		alignItems: "center",
		flex: 1,
	},
	title: {
		fontSize: 20,
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
	input: {
		borderWidth: 1,
		borderColor: "#ccc",
		padding: 10,
		width: "100%",
		marginBottom: 10,
		borderRadius: 5,
	},
	modalButton: {
		backgroundColor: "#28a745",
		padding: 10,
		borderRadius: 10,
		width: "100%",
		alignItems: "center",
	},
});

export default LoginForm;
