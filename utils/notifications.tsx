// utils/notifications.ts
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
	if (!Device.isDevice) return null;

	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		alert('No se pudo obtener permiso para notificaciones!');
		return null;
	}

	const token = (await Notifications.getExpoPushTokenAsync()).data;
	console.log("Expo Push Token:", token);
	return token;
}
