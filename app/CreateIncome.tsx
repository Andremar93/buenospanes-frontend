import {
	View,
	Platform,
	TouchableOpacity,
	Text,
	ScrollView,
	Alert,
	KeyboardAvoidingView,
	ActivityIndicator,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import React, { useCallback, useMemo, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ThemedTextInput } from "@/components/ThemedTextInput";
import { ThemedDatePicker } from "@/components/ThemedDatePicker";
import { styles } from "@/app/styles/CreateIncome.style";
import { createIncome } from "@/services/api";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

const formatDate = (date: Date) => date.toISOString().split("T")[0];
const requiredRule = { required: "Este campo es obligatorio" };

// Memoized Button
const SubmitButton = React.memo(
	({ onPress, loading }: { onPress: () => void; loading: boolean }) => (
		<TouchableOpacity
			onPress={onPress}
			style={[styles.submitButton, loading && { opacity: 0.6 }]}
			disabled={loading}
		>
			{loading ? (
				<ActivityIndicator color="#fff" />
			) : (
				<ThemedText
					style={styles.submitButtonText}
					type="defaultSemiBold"
				>
					Registrar
				</ThemedText>
			)}
		</TouchableOpacity>
	),
);
SubmitButton.displayName = "SubmitButton";

// Memoized Input
const MonetaryInput = React.memo(
	({
		control,
		name,
		label,
		error,
		disabled,
	}: {
		control: any;
		name: string;
		label: string;
		error?: any;
		disabled?: boolean;
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
							editable={!disabled}
						/>
					)}
				/>
				{error && <Text style={styles.error}>{error.message}</Text>}
			</View>
		</View>
	),
);
MonetaryInput.displayName = "MonetaryInput";

export default function CreateIncome() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: useMemo(
			() => ({
				date: new Date(),
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
			}),
			[],
		),
	});

	const onSubmit = useCallback(
		async (data: any) => {
			setIsSubmitting(true);
			const payload = {
				...data,
				date: formatDate(data.date),
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
				const response = await createIncome(payload, token);
				if (response.expense.status === 404) {
					Alert.alert("Ingreso NO creado", response.expense.message);
				} else {
					Alert.alert(
						"Ingreso creado",
						"El ingreso ha sido registrado correctamente",
					);
					router.replace(`/MainMenu?type=incomes`);
				}
			} catch (error) {
				console.error("Error al guardar el ingreso:", error);
				Alert.alert("Error", "Hubo un problema al guardar el ingreso");
			} finally {
				setIsSubmitting(false);
			}
		},
		[router],
	);

	const memoizedHandleSubmit = useCallback(
		() => handleSubmit(onSubmit)(),
		[handleSubmit, onSubmit],
	);

	const paymentFields = useMemo(
		() => [
			{ name: "efectivoBs", label: "Efectivo (BS):" },
			{ name: "efectivoDolares", label: "Efectivo ($):" },
			{ name: "sitef", label: "Sitef:" },
			{ name: "puntoExterno", label: "Punto Externo:" },
			{ name: "pagomovil", label: "PagoMovil:" },
			{ name: "biopago", label: "Biopago:" },
			{ name: "gastosBs", label: "Gasto Bs:" },
			{ name: "gastosDolares", label: "Gasto $:" },
			{ name: "totalSistema", label: "Total Sistema:" },
		],
		[],
	);

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
					{/* Selector de Fecha */}
					<Controller
						control={control}
						name="date"
						rules={requiredRule}
						render={({ field: { onChange, value } }) => (
							<ThemedDatePicker
								label="Fecha del ingreso"
								value={value}
								onChange={onChange}
								disabled={isSubmitting}
							/>
						)}
					/>

					{/* Campos Monetarios */}
					{paymentFields.map((field) => (
						<MonetaryInput
							key={field.name}
							control={control}
							name={field.name}
							label={field.label}
							error={errors[field.name]}
							disabled={isSubmitting}
						/>
					))}

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
								editable={!isSubmitting}
							/>
						)}
					/>
					{errors.notas && (
						<ThemedText style={styles.error}>
							{errors.notas.message?.toString()}
						</ThemedText>
					)}
				</ScrollView>

				<SubmitButton
					onPress={memoizedHandleSubmit}
					loading={isSubmitting}
				/>
			</ThemedView>
		</KeyboardAvoidingView>
	);
}
