import React, { useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Alert,
	Platform,
	View,
} from "react-native";
import { createExpense } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useRouter } from "expo-router";

const CreateExpense: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm();
	const [currency, setCurrency] = useState("Bs");
	const [type, setType] = useState("gastosFijos");
	const [paymentMethod, setpaymentMethod] = useState("cuentaBs");
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
		// Llamada a la API para guardar el gasto
		createExpense(expenseData)
			.then((response) => {
				if (response.expense.status === 404) {
					Alert.alert("Gasto NO creado", response.expense.message);
				} else {
					Alert.alert(
						"Gasto creado",
						"El gasto ha sido registrado correctamente",
					);
					router.replace(`/MainMenu?type=expenses`);
				}
			})
			.catch((error) => {
				console.error("Error al guardar el gasto:", error);
				Alert.alert("Error", "Hubo un problema al guardar el gasto");
			});
	};

	const onDateChange = (event: any, selectedDate: Date | undefined) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(false);
		//setShowDatePicker(Platform.OS === "ios" ? true : false);
		setDate(currentDate); // Actualizar la fecha de pago seleccionada
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
			<ThemedText align="flex-start">Medio de pago:</ThemedText>
			<ThemedView style={{ height: 70, width: "100%" }}>
				<Dropdown
					style={styles.dropdown}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					inputSearchStyle={styles.inputSearchStyle}
					iconStyle={styles.iconStyle}
					data={[
						{ label: "Cuentas Bs.", value: "cuentaBs" },
						{ label: "Efectivo Bs.", value: "bsEfectivo" },
						{ label: "Efectivo $", value: "dolaresEfectivo" },
					]}
					search
					maxHeight={300}
					labelField="label"
					valueField="value"
					placeholder="Select item"
					searchPlaceholder="Search..."
					value={paymentMethod}
					onChange={(item) => {
						setpaymentMethod(item.value);
					}}
					renderLeftIcon={() => (
						<AntDesign
							style={styles.icon}
							color="black"
							name="Safety"
							size={20}
						/>
					)}
				/>
			</ThemedView>

			{/* Selección de tipo de gasto */}
			<ThemedText align="flex-start">Tipo de Gasto</ThemedText>
			<ThemedView style={{ height: 70, width: "100%" }}>
				<Dropdown
					style={styles.dropdown}
					placeholderStyle={styles.placeholderStyle}
					selectedTextStyle={styles.selectedTextStyle}
					inputSearchStyle={styles.inputSearchStyle}
					iconStyle={styles.iconStyle}
					data={[
						{ label: "Gasto Fijos", value: "gastosFijos" },
						{ label: "Compras Diarias", value: "comprasDiarias" },
						{
							label: "Gastos Personales",
							value: "gastosPersonales",
						},
						{
							label: "Gastos Extraordinarios",
							value: "gastosExtraordinarios",
						},
					]}
					search
					maxHeight={300}
					labelField="label"
					valueField="value"
					placeholder="Select item"
					searchPlaceholder="Search..."
					value={type}
					onChange={(item) => {
						setType(item.value);
					}}
					renderLeftIcon={() => (
						<AntDesign
							style={styles.icon}
							color="black"
							name="Safety"
							size={20}
						/>
					)}
				/>
			</ThemedView>

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
			{Platform.OS === "web" ? (
				<input
					type="date"
					value={date ? date.toISOString().split("T")[0] : ""}
					onChange={(e) => setDate(new Date(e.target.value))}
				/>
			) : (
				<TouchableOpacity onPress={() => setShowDatePicker(true)}>
					<ThemedText>
						{date
							? date.toLocaleDateString()
							: "Selecciona una fecha"}
					</ThemedText>
				</TouchableOpacity>
			)}

			{/* Mostrar DateTimePicker en móvil */}
			{showDatePicker && (
				<DateTimePicker
					value={date || new Date()}
					mode="date"
					display={Platform.OS === "ios" ? "inline" : "default"}
					onChange={onDateChange}
				/>
			)}

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
	paymentButton: {
		flex: 1,
		backgroundColor: "#ddd",
		padding: 15,
		borderRadius: 8,
		marginHorizontal: 5,
		alignItems: "center",
	},
	buttonGroup: {
		flexDirection: "row",
		justifyContent: "space-between",
		width: "100%",
		marginVertical: 10,
	},
	selectedButton: {
		backgroundColor: "#007bff",
	},
	dropdown: {
		margin: 16,
		height: 50,
		borderBottomColor: "gray",
		borderBottomWidth: 0.5,
	},
	icon: {
		marginRight: 5,
	},
	placeholderStyle: {
		fontSize: 16,
	},
	selectedTextStyle: {
		fontSize: 16,
	},
	iconStyle: {
		width: 20,
		height: 20,
	},
	inputSearchStyle: {
		height: 40,
		fontSize: 16,
	},
});

export default CreateExpense;
