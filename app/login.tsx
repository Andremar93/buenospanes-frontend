import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, TouchableOpacity, Text, Image } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { login } from "../services/api";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";

const bpLogo = require("../assets/images/buenos-panes-logo.jpeg");

const LoginForm: React.FC = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { setUser } = useUser();
	const { user } = useUser();
	const router = useRouter();

	useEffect(() => {
		const checkLoginStatus = async () => {
			if (user.token) {
				router.replace("/PrincipalMenu");
			}
		};
		checkLoginStatus();
	}, [user, router]);

	const handleLogin = async () => {
		if (!username || !password) {
			Alert.alert("Error", "Por favor, completa todos los campos");
			return;
		}

		try {
			const response = await login(username, password);
			const userData = { username, token: response.token };
			setUser(userData);
			Alert.alert("Éxito", "Inicio de sesión exitoso");
			setUsername(username);
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
