import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

// const API_URL = "http://localhost:3000";
const API_URL = "https://buenospanes-backend-staging.up.railway.app"; // Cambia esto según tu backend
// const API_URL = "https://buenospanes-backend-production.up.railway.app";

export function usePushNotifications() {
	const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
	useEffect(() => {
		const register = async () => {
			try {
				const token = await registerForPushNotificationsAsync();
				const jwt = await SecureStore.getItemAsync("userToken");

				console.log("📌 Hook usePushNotifications ejecutado");
				console.log("📲 Token generado:", token);
				console.log("🔐 JWT recuperado:", jwt);

				if (!token || !jwt) {
					console.warn("⚠️ Faltan token o JWT");
					return;
				}

				setExpoPushToken(token); // ✅ ¡Esto es importante!

				const response = await fetch(`${API_URL}/register-push-token`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${jwt}`,
					},
					body: JSON.stringify({ expoPushToken: token }),
				});

				console.log("📡 Respuesta del backend:", response.status);
				const responseText = await response.text();
				console.log("📨 Body de respuesta:", responseText);
			} catch (error) {
				console.error("❌ Error durante el registro del token:", error);
			}
		};

		register();
	}, []);

	return expoPushToken;
}

async function registerForPushNotificationsAsync() {
	const { status } = await Notifications.requestPermissionsAsync();
	if (status !== "granted") {
		alert("Se requieren permisos para recibir notificaciones");
		return null;
	}
	const token = (await Notifications.getExpoPushTokenAsync()).data;
	return token;
}
