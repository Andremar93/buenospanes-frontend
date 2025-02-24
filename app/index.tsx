import { useEffect, useState } from "react";
import { Button, ActivityIndicator } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useUser } from "@/contexts/UserContext";

export default function IndexScreen() {
	const [loading, setLoading] = useState(true);
	// const [isLoggedIn, setIsLoggedIn] = useState(false);
	const router = useRouter();
	const { user } = useUser();

	useEffect(() => {
		const checkLoginStatus = async () => {
			if (user.token) {
				// setIsLoggedIn(true);
				router.replace("/PrincipalMenu"); // Redirige a la pantalla principal si ya está autenticado
			} else {
				setLoading(false); // Si no hay sesión, muestra los botones
			}
		};

		checkLoginStatus();
	}, [router, user.token]);

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
				onPress={() => router.push("/login")}
			/>
			{/* <Button title="Registrarse" onPress={() => router.push("/register")} /> */}
		</ThemedView>
	);
}
