import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Alert, Platform } from "react-native";
import { createExpense } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedPicker } from "@/components/ThemedPicker";

import { useRouter } from "expo-router";

const CreateExpense: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [currency, setCurrency] = useState("Bs");
	const [type, setType] = useState("fixed");
	const [paymentMethod, setpaymentMethod] = useState("bsAccounts");
	const [date, setDate] = useState(new Date());
	const [showDatePicker, setShowDatePicker] = useState(false);
	const router = useRouter();

	const onSubmit = (data: any) => {
		// Convert date to yyyy-mm-dd format
		const formattedDate = date.toISOString().split("T")[0];

		// Send data to the API
		const expenseData = {
			...data, // Incluye los campos del formulario
			currency, // Tipo de moneda
			type,
			paymentMethod,
			paid: true,
			date: formattedDate, // Fecha seleccionada en formato correcto
		};
		console.log(expenseData);
		// Llamada a la API para guardar el gasto
		createExpense(expenseData)
			.then((response) => {
				Alert.alert(
					"Gasto creado",
					"El gasto ha sido registrado correctamente",
				);
				router.replace("/ExpensesMenu"); // Navegar a la pantalla de gastos
			})
			.catch((error) => {
				console.error("Error al guardar el gasto:", error);
				Alert.alert("Error", "Hubo un problema al guardar el gasto");
			});

		Alert.alert(
			"Gasto creado",
			"El gasto ha sido registrado correctamente",
		);
		//navigation.navigate('Expenses'); // Descomenta si deseas redirigir después de guardar el gasto
	};

	const handleDateChange = (event: any, selectedDate: Date | undefined) => {
		setShowDatePicker(Platform.OS === "ios" ? true : false); // Si es iOS, mantener el picker abierto
		const currentDate = selectedDate || date;
		setDate(currentDate); // Establecer la fecha seleccionada
	};

	return (
		<ThemedView style={styles.container}>
			{/* <ThemedText style={styles.title}>Crear Gasto</ThemedText> */}

			{/* Nombre del gasto */}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Descripción del Gasto"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
					/>
				)}
				name="description"
				rules={{ required: "La descripción es obligatoria" }}
			/>
			{errors.description && (
				<ThemedText style={styles.error}>
					{errors.description.message?.toString()}
				</ThemedText>
			)}

			{/* Selección de moneda (Bs o $) */}
			<ThemedText align="flex-start">Tipo de moneda</ThemedText>
			<ThemedPicker
				selectedValue={currency}
				onValueChange={setCurrency}
				items={[
					{ label: "Bolívares (Bs)", value: "Bs" },
					{ label: "Dólares ($)", value: "$" },
				]}
			/>

			{/* Monto del gasto */}
			<Controller
				control={control}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Monto"
						keyboardType="numeric"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
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

			{/* Selección de medio de pago */}
			<ThemedText align="flex-start">Medio de pago</ThemedText>
			<ThemedPicker
				selectedValue={paymentMethod}
				onValueChange={setpaymentMethod}
				items={[
					{ label: "Cuentas Bs.", value: "cuentaBs" },
					{ label: "Efectivo Bs.", value: "bsEfectivo" },
					{ label: "Efectivo $", value: "dolaresEfectivo" },
				]}
			/>

			{/* Selección de tipo de gasto */}
			<ThemedText align="flex-start">Tipo de Gasto</ThemedText>
			<ThemedPicker
				selectedValue={type}
				onValueChange={setType}
				items={[
					{ label: "Gasto Fijos", value: "gastosFijos" },
					{ label: "Compras Diarias", value: "comprasDiarias" },
					{ label: "Gastos Personales", value: "gastosPersonales" },
				]}
			/>

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
			<ThemedText style={styles.label}>Fecha del Gasto</ThemedText>
			{/* Mostrar el DatePicker si el estado showDatePicker es true */}

			<DateTimePicker
				value={date}
				mode="date"
				display="default"
				onChange={handleDateChange}
			/>

			<TouchableOpacity
				style={styles.button}
				onPress={handleSubmit(onSubmit)}
			>
				<ThemedText style={styles.buttonText}>
					Registrar Gasto
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
});

export default CreateExpense;
