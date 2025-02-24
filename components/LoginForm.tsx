import React, { useState } from "react";
import {
	TextInput,
	Button,
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

interface LoginFormProps {
	onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		if (username && password) {
			onLogin(username, password);
		} else {
			alert("Please fill in all fields");
		}
	};

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.input}
				placeholder="Username"
				value={username}
				onChangeText={setUsername}
			/>
			<TextInput
				style={styles.input}
				placeholder="Password"
				secureTextEntry
				value={password}
				onChangeText={setPassword}
			/>
			{/* <Button title="Login" onPress={handleLogin} /> */}
			<TouchableOpacity
				style={styles.button}
				onPress={() => handleLogin()}
			>
				<Text style={styles.buttonText}>Login</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "#fff",
		justifyContent: "center",
		height: "100%",
		width: "100%",
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
});

export default LoginForm;
