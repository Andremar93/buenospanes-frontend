import React, { useState } from "react";
import {
	StyleSheet,
	TouchableOpacity,
	Alert,
	View,
	ActivityIndicator,
} from "react-native";
import { createInvoice } from "../services/api";
import { useForm, Controller } from "react-hook-form";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedDatePicker } from "@/components/ThemedDatePicker";

const CreateInvoice: React.FC = () => {
	const {
		control,
		handleSubmit,
		watch,
		formState: { errors },
		reset,
	} = useForm();

	const [currency, setCurrency] = useState("Bs");
	const [dueDate, setDueDate] = useState(new Date());
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onSubmit = async (data: any) => {
		if (isSubmitting) return; // Previene múltiples envíos

		setIsSubmitting(true);

		try {
			const formattedDate = dueDate.toISOString().split("T")[0];

			const invoiceData = {
				...data,
				currency,
				type: "Proveedor",
				dueDate: formattedDate,
			};

			await createInvoice(invoiceData);

			Alert.alert(
				"Factura creada",
				"La factura ha sido registrada correctamente",
			);
			console.log("Valores del formulario:", watch());
			reset(); // Limpia el formulario
			setDueDate(new Date()); // Reinicia la fecha
		} catch (error) {
			console.error("Error al guardar la factura:", error);
			Alert.alert("Error", "Hubo un problema al guardar la factura");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ThemedView style={styles.container}>
			{/* Proveedor */}
			<Controller
				control={control}
				name="supplier"
				defaultValue=""
				rules={{ required: "El proveedor es obligatorio" }}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Nombre del proveedor"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						editable={!isSubmitting}
					/>
				)}
			/>
			{errors.supplier && (
				<ThemedText style={styles.error}>
					{errors.supplier.message?.toString()}
				</ThemedText>
			)}

			{/* Número de factura */}
			<Controller
				control={control}
				name="numeroFactura"
				defaultValue=""
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="Número de factura"
						onBlur={onBlur}
						onChangeText={onChange}
						value={value}
						editable={!isSubmitting}
					/>
				)}
			/>

			{/* Moneda */}
			<ThemedText align="flex-start">Tipo de moneda:</ThemedText>
			<View style={styles.buttonGroup}>
				{["Bs", "$"].map((item) => (
					<TouchableOpacity
						key={item}
						style={[
							styles.paymentButton,
							currency === item && styles.selectedButton,
						]}
						onPress={() => setCurrency(item)}
						disabled={isSubmitting}
					>
						<ThemedText style={styles.buttonText}>
							{item === "Bs" ? "Bolívares (Bs)" : "Dólares ($)"}
						</ThemedText>
					</TouchableOpacity>
				))}
			</View>

			{/* Monto */}
			<Controller
				control={control}
				name="amount"
				defaultValue=""
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

			{/* Fecha */}
			<ThemedDatePicker
				value={dueDate}
				onChange={setDueDate}
				disabled={isSubmitting}
				label="Fecha del Gasto"
			/>

			{/* Botón de envío */}
			<TouchableOpacity
				style={[styles.button, isSubmitting && { opacity: 0.7 }]}
				onPress={handleSubmit(onSubmit)}
				disabled={isSubmitting}
			>
				{isSubmitting ? (
					<ActivityIndicator color="#fff" />
				) : (
					<ThemedText style={styles.buttonText}>
						Registrar Factura
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
		textAlign: "center",
	},
	label: {
		fontSize: 18,
		marginBottom: 10,
	},
	error: {
		color: "red",
		fontSize: 12,
		marginTop: 5,
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
