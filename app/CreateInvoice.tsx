import React, { useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Alert,
	Platform,
	View,
} from "react-native";
import { createInvoice } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";

import { useRouter } from "expo-router";

const CreateInvoice: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [currency, setCurrency] = useState("Bs"); // Default is Bs
	const [dueDate, setDueDate] = useState(new Date()); // Default date is today
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // Para mostrar el selector de fecha

	const router = useRouter();

	const onSubmit = (data: any) => {
		// Convert date to yyyy-mm-dd format
		const formattedDate = dueDate.toISOString().split("T")[0];

		// Send data to the API
		const invoiceData = {
			...data, // Incluye los campos del formulario
			currency, // Tipo de moneda
			type: "Proveedor",
			dueDate: formattedDate, // Fecha seleccionada en formato correcto
		};

		// Llamada a la API para guardar el gasto
		createInvoice(invoiceData)
			.then((response) => {
				Alert.alert(
					"Factura creada",
					"La factura ha sido registrada correctamente",
				);
				router.replace(`/MainMenu?type=invoices`); // Navegar a la pantalla de gastos
			})
			.catch((error) => {
				console.error("Error al guardar el gasto:", error);
				Alert.alert("Error", "Hubo un problema al guardar el gasto");
			});
	};
	const onDateChange = (event: any, selectedDate: Date | undefined) => {
		const currentDate = selectedDate || dueDate;
		setShowDatePicker(Platform.OS === "ios" ? true : false);
		setDueDate(currentDate); // Actualizar la fecha de pago seleccionada
	};

	return (
		<ThemedView style={styles.container}>
			{/* <ThemedText style={styles.title}>Crear Gasto</ThemedText> */}

			{/* Nombre del Proveedor */}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Nombre del proveedor"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value || ""}
					/>
				)}
				name="supplier"
				rules={{ required: "El proveedor es obligatorio" }}
			/>
			{errors.supplier && (
				<ThemedText style={styles.error}>
					{errors.supplier.message?.toString()}
				</ThemedText>
			)}

			{/* Selección de moneda (Bs o $) */}
			<ThemedText align="flex-start">Tipo de moneda:</ThemedText>
			<View style={styles.buttonGroup}>
				<TouchableOpacity
					style={[
						styles.paymentButton,
						currency === "Bs" && styles.selectedButton,
					]}
					onPress={() => setCurrency("Bs")}
				>
					<ThemedText style={styles.buttonText}>
						Bolívares (Bs)
					</ThemedText>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.paymentButton,
						currency === "$" && styles.selectedButton,
					]}
					onPress={() => setCurrency("$")}
				>
					<ThemedText style={styles.buttonText}>
						Dólares ($)
					</ThemedText>
				</TouchableOpacity>
			</View>

			{/* Monto del gasto */}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Monto"
						keyboardType="numeric"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value || ""}
					/>
				)}
				name="amount"
				rules={{ required: "El monto es obligatorio" }}
			/>
			{errors.amount && (
				<ThemedText style={styles.error}>
					{errors.amount.message?.toString()}
				</ThemedText>
			)}

			{/* Selección de subtipo de gasto 
            <ThemedText align="flex-start">SubTipo de Gasto</ThemedText>
            <ThemedPicker
                selectedValue={subType}
                onValueChange={setSubType}
                items={[
                    { label: 'Electricidad', value: 'electricidad' },
                    { label: 'Internet', value: 'internet' },
                    { label: 'Alquiler', value: 'alquiler' },
                ]}
            />*/}

			{/* Fecha del gasto */}
			<ThemedText style={styles.label}>Fecha a pagar</ThemedText>
			{Platform.OS === "web" ? (
				<input
					type="date"
					value={dueDate ? dueDate.toISOString().split("T")[0] : ""}
					onChange={(e) => setDueDate(new Date(e.target.value))}
				/>
			) : (
				<TouchableOpacity onPress={() => setShowDatePicker(true)}>
					<ThemedText>
						{dueDate
							? dueDate.toLocaleDateString()
							: "Selecciona una fecha"}
					</ThemedText>
				</TouchableOpacity>
			)}

			{/* Mostrar DateTimePicker en móvil */}
			{showDatePicker && (
				<DateTimePicker
					value={dueDate || new Date()}
					mode="date"
					display="default"
					onChange={onDateChange}
				/>
			)}

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit(onSubmit)}
			>
				<ThemedText style={styles.buttonText}>
					Registrar Factura
				</ThemedText>
			</TouchableOpacity>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 20,
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		maxWidth: 650,
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
	buttonGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginVertical: 10,
	},
	paymentButton: {
		flex: 1,
		backgroundColor: "#ddd",
		padding: 15,
		borderRadius: 8,
		marginHorizontal: 5,
		alignItems: "center",
	},
	selectedButton: {
		backgroundColor: "#007bff",
	},
});

export default CreateInvoice;
