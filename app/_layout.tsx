import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { UserProvider, useUser } from "@/contexts/UserContext"; // Aquí importas el contexto
import {
	ExchangeRateProvider,
	useExchangeRate,
} from "@/contexts/ExchangeRateContext"; // Aquí importas el contexto
import { useColorScheme } from "@/hooks/useColorScheme";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

import { useRouter } from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const colorScheme = useColorScheme();
	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}

	return (
		<UserProvider>
			<ExchangeRateProvider>
				<ThemeProvider
					value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
				>
					<Stack>
						<Stack.Screen
							name="(tabs)"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="index"
							options={{ headerShown: false }}
						/>
						<Stack.Screen
							name="login"
							options={{
								headerShown: false,
							}}
						/>
						<Stack.Screen
							name="ExpensesMenu"
							options={{
								headerShown: true,
								headerTitle: "Gastos",
								headerRight: () => <LogoutButton />, // Botón de logout en el header
							}}
						/>
						<Stack.Screen
							name="CreateExpense"
							options={{
								headerShown: true,
								headerTitle: "Crear Gasto",
								headerRight: () => <LogoutButton />, // Botón de logout en el header
							}}
						/>
						<Stack.Screen
							name="SeeExpenses"
							options={{
								headerShown: true,
								headerTitle: "Gastos",
								headerRight: () => <LogoutButton />, // Botón de logout en el header
							}}
						/>
						<Stack.Screen
							name="SeeInvoices"
							options={{
								headerShown: true,
								headerTitle: "Facturas",
								headerRight: () => <LogoutButton />, // Botón de logout en el header
							}}
						/>
						<Stack.Screen
							name="PrincipalMenu"
							options={{
								headerShown: true,
								headerTitle: "Menu Principal",
								headerRight: () => <LogoutButton />, // Botón de logout en el header
							}}
						/>
						<Stack.Screen
							name="+not-found"
							options={{ headerShown: false }}
						/>
					</Stack>
					<StatusBar style="auto" />
				</ThemeProvider>
			</ExchangeRateProvider>
		</UserProvider>
	);
}

const styles = StyleSheet.create({
	button: {
		backgroundColor: "#007bff",
		padding: 10,
		borderRadius: 10,
		marginVertical: 5,
		marginHorizontal: 10,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 10,
		fontWeight: "bold",
	},
});

// Este componente se encargará de manejar el logout dentro del contexto de UserProvider
const LogoutButton = () => {
	const { logout } = useUser();

	const { resetExchangeRate } = useExchangeRate();
	const router = useRouter();

	const handleLogout = () => {
		logout();
		resetExchangeRate();
		router.push("/login");
	};

	return (
		<TouchableOpacity style={styles.button} onPress={handleLogout}>
			<Text style={styles.buttonText}>Cerrar sesión</Text>
		</TouchableOpacity>
	);
};
