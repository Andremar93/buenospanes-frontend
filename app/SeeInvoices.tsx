import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	FlatList,
	View,
	TouchableOpacity,
	Platform,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getInvoices, createExpenseByInvoice } from "@/services/api";
import DateTimePicker from "@react-native-community/datetimepicker"; // Importar el DateTimePicker

const SeeInvoices: React.FC = () => {
	const [invoices, setInvoices] = useState<any[]>([]);
	const [expandedInvoices, setExpandedInvoices] = useState<{
		[key: string]: boolean;
	}>({});
	const [paymentDate, setPaymentDate] = useState<Date | null>(null); // Estado para la fecha de pago
	const [showDatePicker, setShowDatePicker] = useState<boolean>(false); // Para mostrar el selector de fecha

	const toggleInvoice = (invoiceId: string) => {
		setExpandedInvoices((prevState) => ({
			...prevState,
			[invoiceId]: !prevState[invoiceId], // Alterna entre expandido y contraído
		}));
	};

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

			if (response.status === 200) {
				alert("Factura pagada con éxito");

				// Filtrar la factura que se pagó
				const updatedInvoices = invoices.filter(
					(invoice) => invoice.id !== invoiceId,
				);
				setInvoices(updatedInvoices); // Actualizar el estado con la lista filtrada

				fetchInvoices(); // Recargar la lista de facturas si es necesario
			} else {
				alert("Error al procesar el pago.");
			}
			alert("Factura pagada con éxito");
			fetchInvoices(); // Recargar la lista de facturas
		} catch (error) {
			console.error("Error al pagar la factura", error);
			alert("Error al procesar el pago");
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
		const currentDate = selectedDate || paymentDate;
		setShowDatePicker(Platform.OS === "ios" ? true : false);
		setPaymentDate(currentDate); // Actualizar la fecha de pago seleccionada
	};

	const renderInvoice = ({ item }: { item: any }) => (
		<View style={styles.card}>
			<Text style={styles.expenseTitle}>
				{item.description} - {item.currency}
			</Text>
			<Text style={styles.expenseTitle}>
				{item.amountDollars}$ - {item.amountBs}Bs.
			</Text>
			{/* Botón para expandir */}

			<TouchableOpacity
				onPress={() => toggleInvoice(item._id)}
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
					<Text>Selecciona la fecha de pago:</Text>

					{/* Selector de fecha */}
					{Platform.OS === "web" ? (
						<input
							type="date"
							value={
								paymentDate
									? paymentDate.toISOString().split("T")[0]
									: ""
							}
							onChange={(e) =>
								setPaymentDate(new Date(e.target.value))
							}
						/>
					) : (
						<TouchableOpacity
							onPress={() => setShowDatePicker(true)}
						>
							<Text>
								{paymentDate
									? paymentDate.toLocaleDateString()
									: "Selecciona una fecha"}
							</Text>
						</TouchableOpacity>
					)}

					{/* Mostrar DateTimePicker en móvil */}
					{showDatePicker && (
						<DateTimePicker
							value={paymentDate || new Date()}
							mode="date"
							display="default"
							onChange={onDateChange}
						/>
					)}

					<TouchableOpacity
						style={styles.paymentButton}
						onPress={() => handlePayInvoice(item._id, "Efectivo")} // Aquí pasamos la fecha seleccionada
					>
						<Text>💵 Efectivo</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.paymentButton}
						onPress={() =>
							handlePayInvoice(item._id, "Transferencia")
						} // Aquí pasamos la fecha seleccionada
					>
						<Text>🏦 Transferencia</Text>
					</TouchableOpacity>
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
					data={invoices}
					keyExtractor={(item) => item._id.toString()}
					renderItem={renderInvoice}
					style={{ width: "100%" }}
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
});

export default SeeInvoices;
