import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import { createExchangeRate } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { useRouter } from "expo-router";
import { useExchangeRate } from "@/contexts/ExchangeRateContext";

const SetExchangeRate: React.FC = () => {
	console.log("EXHANGERATEPAGE");
	const router = useRouter();
	const { setExchangeRate } = useExchangeRate();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();

	const onSubmit = (data: any) => {
		const rateData = {
			...data,
		};

		const newRate = parseFloat(data.rate);
		if (isNaN(newRate) || newRate <= 0) {
			Alert.alert("Error", "Ingrese un valor válido para la tasa");
			return;
		}

		// Llamada a la API para guardar el gasto
		createExchangeRate(rateData)
			.then((response) => {
				setExchangeRate(newRate);
				Alert.alert(
					"Tasa Seteada",
					"La tasa ha sido registrado correctamente",
				);
				router.replace("/PrincipalMenu");
			})
			.catch((error) => {
				console.error("Error al guardar la tasa:", error);
				Alert.alert("Error", "Hubo un problema al guardar la tasa");
			});
	};

	return (
		<ThemedView style={[styles.container]}>
			<ThemedText style={styles.title}>Setear tasa del día</ThemedText>

			{/* Monto del gasto */}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						style={styles.input}
						placeholder="Monto"
						keyboardType="numeric"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value ?? ""}
					/>
				)}
				name="rate"
				defaultValue=""
				rules={{ required: "El monto es obligatorio" }}
			/>

			{errors.rate && (
				<ThemedText style={styles.error}>
					{errors.rate.message?.toString()}
				</ThemedText>
			)}

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit(onSubmit)}
			>
				<ThemedText style={styles.buttonText}>Setear Tasa</ThemedText>
			</TouchableOpacity>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
	},
	input: {
		width: "100%",
		padding: 10,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		marginBottom: 10,
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
	label: {
		fontSize: 18,
		marginBottom: 10,
	},
	picker: {
		height: 50,
		width: "100%",
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 5,
	},
	dateText: {
		fontSize: 16,
		color: "#333",
	},
	error: {
		color: "red",
		fontSize: 12,
	},
});

export default SetExchangeRate;
