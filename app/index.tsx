import { useEffect, useState } from "react";
import { Button, ActivityIndicator } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import useStore from "../store/store";

import * as Sentry from "@sentry/react-native";

export default function IndexScreen() {
	const [loading, setLoading] = useState(true);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();
	const { token } = useStore();

	useEffect(() => {
		if (!token) {
			setLoading(false);
		}
	}, [token]);

	if (loading) {
		return <ActivityIndicator size="large" color="#0000ff" />;
	}

	return (
		<ThemedView
			style={{
				flex: 1,
				justifyContent: "center",
				alignItems: "center",
				gap: "2rem",
			}}
		>
			<ThemedText type="title">BUENOS PANES CCS</ThemedText>
			<Button
				title="Iniciar sesión"
				onPress={() => router.replace("/login")}
			/>
			{/* <Button title="Registrarse" onPress={() => router.push("/register")} /> */}
		</ThemedView>
	);
}
