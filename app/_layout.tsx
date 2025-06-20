import * as React from "react";
import { Slot } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "react-native"; // usa el hook de RN directamente
import * as Sentry from "@sentry/react-native";
import useStore from "../store/store";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";



Sentry.init({
	dsn: "https://d041448642b282f000f6c15b642a482f@o4509383973666816.ingest.us.sentry.io/4509384133902336",
	tracesSampleRate: 1.0,
	enableNative: true,
	debug: true,
});

export default Sentry.wrap(function RootLayout() {
	const colorScheme = useColorScheme();


	const [loaded] = useFonts({
		SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
	});

	const token = useStore((state) => state.token);
	const router = useRouter();

	useEffect(() => {
		const prepare = async () => {
			try {
				await SplashScreen.preventAutoHideAsync();
			} catch (e) {
				console.warn("SplashScreen error:", e);
			}
		};

		prepare();
	}, []);


	useEffect(() => {
		// Espera a que el layout esté montado
		const timeout = setTimeout(() => {
			if (!token) {
				router.replace("/login");
			} else {
				router.replace("/PrincipalMenu");
			}
		}, 1000);

		return () => clearTimeout(timeout);
	}, [token]);

	useEffect(() => {
		if (loaded && SplashScreen.hideAsync) {
			SplashScreen.hideAsync();
		}
	}, [loaded]);

	if (!loaded) {
		return null;
	}
	return (
		<ThemeProvider
			value={colorScheme === "dark" ? DefaultTheme : DefaultTheme}
		>
			<Stack>
				<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="login" options={{ headerShown: false }} />
				<Stack.Screen
					name="CreateExpense"
					options={{
						headerShown: true,
						headerTitle: "Crear Gasto",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="CreateInvoice"
					options={{
						headerShown: true,
						headerTitle: "Crear Factura",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="SeeExpenses"
					options={{
						headerShown: true,
						headerTitle: "Gastos",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="ExpensesResume"
					options={{
						headerShown: true,
						headerTitle: "Resumen",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="SeeInvoices"
					options={{
						headerShown: true,
						headerTitle: "Facturas",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="MainMenu"
					options={{
						headerShown: true,
						headerTitle: "",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="PrincipalMenu"
					options={{
						headerShown: true,
						headerTitle: "",
						headerRight: () => <LogoutButton />,
					}}
				/>
				<Stack.Screen
					name="+not-found"
					options={{ headerShown: false }}
				/>
			</Stack>
			<StatusBar style="auto" />
		</ThemeProvider>
	);

});


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

// Componente de botón para cerrar sesión
const LogoutButton = () => {
	const router = useRouter();

	const handleLogout = () => {
		console.log("click on logout");
		useStore.getState().logout();
		router.replace("/login");
	};

	return (
		<TouchableOpacity style={styles.button} onPress={handleLogout}>
			<Text style={styles.buttonText}>Cerrar sesión</Text>
		</TouchableOpacity>
	);
};
