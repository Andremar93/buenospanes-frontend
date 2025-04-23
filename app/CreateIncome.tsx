import {
	View,
	Platform,
	TouchableOpacity,
	Text,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState, useCallback } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { styles } from "@/app/styles/CreateIncome.style";
import { createIncome } from "@/services/api";
import { useRouter } from "expo-router";

// Botón separado y memoizado
const SubmitButton = React.memo(({ onPress }: { onPress: () => void }) => (
	<TouchableOpacity onPress={onPress} style={styles.submitButton}>
		<ThemedText style={styles.submitButtonText} type="defaultSemiBold">
			Registrar
		</ThemedText>
	</TouchableOpacity>
));
SubmitButton.displayName = "SubmitButton";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const requiredRule = { required: "Este campo es obligatorio" };

const MonetaryInput = ({
	control,
	name,
	label,
	error,
}: {
	control: any;
	name: string;
	label: string;
	error?: any;
}) => (
	<View style={styles.textInput}>
		<ThemedText
			style={styles.label}
			align="flex-start"
			type="defaultSemiBold"
		>
			{label}
		</ThemedText>
		<View style={styles.inputContainer}>
			<Controller
				control={control}
				name={name}
				rules={requiredRule}
				render={({ field: { onChange, onBlur, value } }) => (
					<ThemedTextInput
						placeholder="0.0"
						keyboardType="numeric"
						onBlur={onBlur}
						value={value?.toString() || ""}
						onChangeText={(text) => {
							const filtered = text.replace(/[^0-9.]/g, "");
							if (filtered.split(".").length > 2) return;
							onChange(filtered);
						}}
					/>
				)}
			/>
			{error && <Text style={styles.error}>{error.message}</Text>}
		</View>
	</View>
);

export default function CreateIncome() {
	const [showDatePicker, setShowDatePicker] = useState(false);
	const [date, setDate] = useState(new Date());
	const router = useRouter();

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		defaultValues: {
			date: formatDate(date),
			efectivoBs: "0",
			efectivoDolares: "0",
			puntoExterno: "0",
			sitef: "0",
			pagomovil: "0",
			gastosBs: "0",
			gastosDolares: "0",
			biopago: "0",
			totalSistema: "0",
			notas: "",
		},
	});

	const onSubmit = useCallback(
		(data: any) => {
			createIncome(data)
				.then((response) => {
					if (response.expense.status === 404) {
						Alert.alert(
							"Ingreso NO creado",
							response.expense.message,
						);
					} else {
						Alert.alert(
							"Ingreso creado",
							"El ingreso ha sido registrado correctamente",
						);
						router.replace(`/MainMenu?type=incomes`);
					}
				})
				.catch((error) => {
					console.error("Error al guardar el ingreso:", error);
					Alert.alert(
						"Error",
						"Hubo un problema al guardar el ingreso",
					);
				});
		},
		[router],
	);

	const memoizedHandleSubmit = useCallback(
		() => handleSubmit(onSubmit)(),
		[handleSubmit, onSubmit],
	);

	const onDateChange = (event: any, selectedDate: Date | undefined) => {
		const currentDate = selectedDate || date;
		setShowDatePicker(false);
		setDate(currentDate);
		setValue("date", formatDate(currentDate));
	};

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={80}
		>
			<ThemedView style={styles.container}>
				<ScrollView
					style={{ width: "95%" }}
					contentContainerStyle={[
						styles.scrollContainer,
						{ paddingBottom: 100 },
					]}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={true}
				>
					{/* Fecha */}
					<View>
						<ThemedText style={styles.label} type="defaultSemiBold">
							Fecha del Ingreso
						</ThemedText>
						{Platform.OS === "web" ? (
							<input
								type="date"
								value={date.toISOString().split("T")[0]}
								onChange={(e) =>
									setDate(new Date(e.target.value))
								}
							/>
						) : (
							<TouchableOpacity
								onPress={() => setShowDatePicker(true)}
							>
								<ThemedText>
									{date
										? date.toLocaleDateString()
										: "Selecciona una fecha"}
								</ThemedText>
							</TouchableOpacity>
						)}
						{showDatePicker && (
							<DateTimePicker
								value={date}
								mode="date"
								display={
									Platform.OS === "ios" ? "inline" : "default"
								}
								onChange={onDateChange}
							/>
						)}
					</View>

					{/* Métodos de pago */}
					<MonetaryInput
						control={control}
						name="efectivoBs"
						label="Efectivo (BS):"
						error={errors.efectivoBs}
					/>
					<MonetaryInput
						control={control}
						name="efectivoDolares"
						label="Efectivo ($):"
						error={errors.efectivoDolares}
					/>
					<MonetaryInput
						control={control}
						name="sitef"
						label="Sitef:"
						error={errors.sitef}
					/>
					<MonetaryInput
						control={control}
						name="puntoExterno"
						label="Punto Externo:"
						error={errors.puntoExterno}
					/>
					<MonetaryInput
						control={control}
						name="pagomovil"
						label="PagoMovil:"
						error={errors.pagomovil}
					/>
					<MonetaryInput
						control={control}
						name="biopago"
						label="Biopago:"
						error={errors.biopago}
					/>
					<MonetaryInput
						control={control}
						name="gastosBs"
						label="Gasto Bs:"
						error={errors.gastosBs}
					/>
					<MonetaryInput
						control={control}
						name="gastosDolares"
						label="Gasto $:"
						error={errors.gastosDolares}
					/>
					<MonetaryInput
						control={control}
						name="totalSistema"
						label="Total Sistema:"
						error={errors.totalSistema}
					/>

					{/* Notas */}
					<Controller
						control={control}
						name="notas"
						render={({ field: { onChange, onBlur, value } }) => (
							<ThemedTextInput
								placeholder="Notas extras"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value || ""}
							/>
						)}
					/>
					{errors.notas && (
						<ThemedText style={styles.error}>
							{errors.notas.message?.toString()}
						</ThemedText>
					)}
				</ScrollView>

				<SubmitButton onPress={memoizedHandleSubmit} />
			</ThemedView>
		</KeyboardAvoidingView>
	);
}
