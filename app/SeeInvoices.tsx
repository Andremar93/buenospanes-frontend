import React, { useState, useEffect, useRef } from "react";
import {
	Text,
	StyleSheet,
	FlatList,
	View,
	TouchableOpacity,
	Platform,
	Alert,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { getInvoices, createExpenseByInvoice } from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker";

const SeeInvoices: React.FC = () => {
	const [invoices, setInvoices] = useState<any[]>([]);
	const [expandedInvoices, setExpandedInvoices] = useState<{
		[key: string]: boolean;
	}>({});
	const [paymentDate, setPaymentDate] = useState<Date | null>(null);
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
	const flatListRef = useRef<FlatList<any>>(null);

	useEffect(() => {
		fetchInvoices();
	}, []);

	const fetchInvoices = async () => {
		try {
			const invoicesData = await getInvoices();
			setInvoices(invoicesData);
		} catch (error) {
			console.error("Error fetching invoices:", error);
		}
	};

	const handlePayInvoice = async (
		invoiceId: string,
		paymentMethod: string,
	) => {
		try {
			if (!paymentDate) {
				alert("Por favor selecciona una fecha de pago.");
				return;
			}
			const response = await createExpenseByInvoice(
				invoiceId,
				paymentMethod,
				paymentDate,
			);
			if (response.status === 201) {
				Alert.alert("Factura pagada con éxito");

				// Filtrar la factura que se pagó
				const updatedInvoices = invoices.filter(
					(invoice) => invoice._id !== invoiceId,
				);
				setInvoices(updatedInvoices);
			} else {
				Alert.alert("Error al procesar el pago.");
			}
		} catch (error) {
			console.error("Error al pagar la factura", error);
			Alert.alert("Error al procesar el pago");
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	const onDateChange = (event: any, selectedDate: Date | undefined) => {
		setShowDatePicker(Platform.OS === "ios" ? true : false);
		setPaymentDate(selectedDate || paymentDate);
	};

	const toggleInvoice = (invoiceId: string, index: number) => {
		setExpandedInvoices((prevState) => {
			const newState = {
				...prevState,
				[invoiceId]: !prevState[invoiceId],
			};

			// Si es el último item, hacemos scroll al final
			if (index === invoices.length - 1) {
				setTimeout(() => {
					flatListRef.current?.scrollToEnd({ animated: true });
				}, 200); // Delay pequeño para que el re-render no interrumpa el scroll
			}

			return newState;
		});
	};

	const renderInvoice = ({ item, index }: { item: any; index: number }) => (
		<View style={styles.card}>
			<Text style={styles.expenseTitle}>
				{item.description} - {item.currency}
			</Text>
			<Text style={styles.expenseTitle}>
				{item.amountDollars}$ - {item.amountBs.toFixed(2)}Bs.
			</Text>

			<TouchableOpacity
				onPress={() => toggleInvoice(item._id, index)}
				style={styles.expandButton}
			>
				<Text>{expandedInvoices[item._id] ? "🔼" : "🔽"}</Text>
			</TouchableOpacity>

			<Text style={styles.supplier}>{item.supplier}</Text>
			<Text
				style={[
					styles.expenseDate,
					{ fontSize: 14, alignSelf: "flex-end" },
				]}
			>
				{formatDate(item.date)}
			</Text>

			{/* Opciones de pago solo si está expandido */}
			{expandedInvoices[item._id] && (
				<View style={styles.paymentOptions}>
					<View style={styles.datePickerRow}>
						{Platform.OS === "web" ? (
							<input
								type="date"
								value={
									paymentDate
										? paymentDate
											.toISOString()
											.split("T")[0]
										: ""
								}
								onChange={(e) =>
									setPaymentDate(new Date(e.target.value))
								}
							/>
						) : (
							<>
								<TouchableOpacity
									onPress={() => setShowDatePicker(true)}
								>
									<ThemedText>Fecha de pago:</ThemedText>
								</TouchableOpacity>
								{showDatePicker && (
									<DateTimePicker
										value={paymentDate || new Date()}
										mode="date"
										display="default"
										onChange={onDateChange}
									/>
								)}
							</>
						)}
					</View>
					<View style={styles.buttons}>
						<TouchableOpacity
							style={styles.paymentButton}
							onPress={() =>
								handlePayInvoice(item._id, "Efectivo")
							}
						>
							<Text>💵 Efectivo</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.paymentButton}
							onPress={() =>
								handlePayInvoice(item._id, "Transferencia")
							}
						>
							<Text>🏦 Transferencia</Text>
						</TouchableOpacity>
					</View>
				</View>
			)}
		</View>
	);

	return (
		<ThemedView style={styles.container}>
			{invoices.length === 0 ? (
				<Text style={styles.successMessage}>
					🎉 ¡Iujuuuu! Ya pagamos todo 🎉
				</Text>
			) : (
				<FlatList
					ref={flatListRef}
					data={invoices}
					keyExtractor={(item) => item._id.toString()}
					renderItem={renderInvoice}
					style={{ width: "100%" }}
					ListFooterComponent={<View style={{ height: 100 }} />} // Espaciado para evitar ocultamiento
				/>
			)}
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingTop: 20,
		paddingHorizontal: 20,
	},
	card: {
		backgroundColor: "#f8f8f8",
		borderRadius: 10,
		padding: 15,
		marginVertical: 10,
		width: "100%",
		maxWidth: 500,
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3,
		position: "relative",
	},
	expandButton: {
		position: "absolute",
		left: 10,
		top: 90,
		padding: 5,
	},
	expenseTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
		textTransform: "uppercase",
	},
	supplier: {
		fontSize: 16,
		fontStyle: "italic",
		color: "#666",
		marginBottom: 5,
		textTransform: "capitalize",
	},
	expenseDate: {
		fontSize: 14,
		color: "#888",
	},
	paymentOptions: {
		marginTop: 10,
		flexDirection: "column",
		justifyContent: "flex-start",
		alignItems: "center",
	},
	paymentButton: {
		backgroundColor: "#eee",
		padding: 8,
		borderRadius: 5,
		marginTop: 10,
	},
	successMessage: {
		fontSize: 20,
		fontWeight: "bold",
		color: "green",
		textAlign: "center",
		marginTop: 20,
	},
	datePickerRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		width: "100%",
		marginBottom: 10,
	},
	datePickerLabel: {
		fontSize: 16,
		color: "#333",
	},
	buttons: {
		flexDirection: "row",
		justifyContent: "space-evenly",
		width: "100%",
	},
});

export default SeeInvoices;
