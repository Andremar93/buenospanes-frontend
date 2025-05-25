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
			const token = await registerForPushNotificationsAsync();
			const jwt = await SecureStore.getItemAsync("userToken");

			if (!token || !jwt) {
				console.warn("No token de notificación o JWT");
				return;
			}

			setExpoPushToken(token);

			await fetch(`${API_URL}/register-push-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${jwt}`, // ← JWT real aquí
				},
				body: JSON.stringify({ expoPushToken: token }),
			});
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
