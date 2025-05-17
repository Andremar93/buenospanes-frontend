import React, { useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Alert,
	View,
	ActivityIndicator,
} from "react-native";
import { createExpense } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemedDatePicker } from "@/components/ThemedDatePicker";
import * as SecureStore from "expo-secure-store";

const CreateExpense: React.FC = () => {
	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm();

	const [currency, setCurrency] = useState("Bs");
	const [type, setType] = useState("gastosFijos");
	const [paymentMethod, setPaymentMethod] = useState("cuentaBs");
	const [date, setDate] = useState(new Date());
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (data: any) => {
		if (isSubmitting) return;

		setIsSubmitting(true);

		const formattedDate = date.toISOString().split("T")[0];

		const expenseData = {
			...data,
			currency,
			type,
			paymentMethod,
			paid: true,
			date: formattedDate,
		};

		try {
			const token = await SecureStore.getItemAsync("userToken");
			if (!token) {
				Alert.alert(
					"Error",
					"No se encontró el token de autenticación",
				);
				return;
			}
			const response = await createExpense(expenseData, token);
			if (response.expense?.status === 404) {
				Alert.alert("Gasto NO creado", response.expense.message);
			} else {
				Alert.alert(
					"Gasto creado",
					"El gasto ha sido registrado correctamente",
				);
				reset(); // limpia el formulario
				// router.replace("/MainMenu?type=expenses");
			}
		} catch (error) {
			console.error("Error al guardar el gasto:", error);
			Alert.alert("Error", "Hubo un problema al guardar el gasto");
		} finally {
			setIsSubmitting(false);
		}
	};

	const onDateChange = (selectedDate: Date) => {
		setDate(selectedDate);
	};

	return (
		<ThemedView style={styles.container}>
			{/* Descripción */}
			<Controller
				control={control}
				name="description"
				rules={{ required: "La descripción es obligatoria" }}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Descripción del Gasto"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						editable={!isSubmitting}
					/>
				)}
			/>
			{errors.description && (
				<ThemedText style={styles.error}>
					{errors.description.message?.toString()}
				</ThemedText>
			)}

			{/* Moneda */}
			<ThemedText align="flex-start">Tipo de moneda:</ThemedText>
			<View style={styles.buttonGroup}>
				{["Bs", "$"].map((c) => (
					<TouchableOpacity
						key={c}
						style={[
							styles.paymentButton,
							currency === c && styles.selectedButton,
						]}
						onPress={() => setCurrency(c)}
						disabled={isSubmitting}
					>
						<ThemedText style={styles.buttonText}>
							{c === "Bs" ? "Bolívares (Bs)" : "Dólares ($)"}
						</ThemedText>
					</TouchableOpacity>
				))}
			</View>

			{/* Monto */}
			<Controller
				control={control}
				name="amount"
				rules={{ required: "El monto es obligatorio" }}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Monto"
						keyboardType="numeric"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						editable={!isSubmitting}
					/>
				)}
			/>
			{errors.amount && (
				<ThemedText style={styles.error}>
					{errors.amount.message?.toString()}
				</ThemedText>
			)}

			{/* Medio de pago */}
			<ThemedText align="flex-start">Medio de pago:</ThemedText>
			<ThemedView style={{ height: 70, width: "100%" }}>
				<Dropdown
					style={styles.dropdown}
					disabled={isSubmitting}
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
					placeholder="Selecciona un medio"
					searchPlaceholder="Buscar..."
					value={paymentMethod}
					onChange={(item) => setPaymentMethod(item.value)}
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

			{/* Tipo de Gasto */}
			<ThemedText align="flex-start">Tipo de Gasto</ThemedText>
			<ThemedView style={{ height: 70, width: "100%" }}>
				<Dropdown
					style={styles.dropdown}
					disabled={isSubmitting}
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
					placeholder="Selecciona un tipo"
					searchPlaceholder="Buscar..."
					value={type}
					onChange={(item) => setType(item.value)}
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

			{/* Fecha */}
			<ThemedDatePicker
				value={date}
				onChange={onDateChange}
				disabled={isSubmitting}
				label="Fecha del Gasto"
			/>
			{/* Botón de envío */}
			<TouchableOpacity
				style={[
					styles.button,
					isSubmitting && { backgroundColor: "#ccc" },
				]}
				onPress={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<ActivityIndicator color="#fff" />
				) : (
					<ThemedText style={styles.buttonText}>
						Registrar Gasto
					</ThemedText>
				)}
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
