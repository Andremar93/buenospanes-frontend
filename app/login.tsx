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
			console.log("checkLoginStatus", user);
			console.log("user on login", user);
			if (user.token) {
				router.replace("/PrincipalMenu");
			}
		};
		checkLoginStatus();
	}, []);

	const handleLogin = async (username: string, password: string) => {
		if (!username || !password) {
			Alert.alert("Error", "Por favor, completa todos los campos");
			return;
		}

		try {
			const response = await login(username, password);
			const userData = { username, token: response.token };

			setUser(userData);
			console.log("userData", userData);

			if (response.redirectToSetExchangeRate) {
				Alert.alert(
					"Éxito",
					"Por favor establecer la tasa del día de hoy",
				);
				router.replace("/SetExchangeRate"); // Redirigir al home si ya está logueado
				// Redirigir a la pantalla de tasa
			} else {
				Alert.alert("Éxito", "Inicio de sesión exitoso");
				setUsername(username);
				router.replace("/PrincipalMenu"); // Redirigir a la pantalla de inicio
			}

			// router.replace('/'); // Redirigir a la pantalla principal
		} catch (error) {
			console.log(error);
			Alert.alert("Error", "No se pudo iniciar sesión");
		}
	};

	// Wrap handleLogin in a function that doesn't take parameters
	const handleLoginPress = () => {
		handleLogin(username, password);
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
			<TouchableOpacity style={styles.button} onPress={handleLoginPress}>
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
});

export default LoginForm;
