import React, { useState } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Platform,
	ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AntDesign } from "@expo/vector-icons";

import { ThemedView } from "../components/ThemedView";
import { ThemedText } from "../components/ThemedText";
import { getExpensesResume } from "../services/api";

const ExpensesResume: React.FC = () => {
	const [resume, setResume] = useState<any>(null);
	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [showStartPicker, setShowStartPicker] = useState(false);
	const [showEndPicker, setShowEndPicker] = useState(false);
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(true);

	const fetchResume = async () => {
		try {
			const data = await getExpensesResume({
				startDate: startDate.toISOString().split("T")[0],
				endDate: endDate.toISOString().split("T")[0],
			});
			setResume(data);
		} catch (error) {
			console.error("Error fetching resume:", error);
		}
	};

	const onStartDateChange = (event: any, selectedDate?: Date) => {
		setShowStartPicker(Platform.OS === "ios");
		if (selectedDate) {
			setStartDate(selectedDate);
		}
	};

	const onEndDateChange = (event: any, selectedDate?: Date) => {
		setShowEndPicker(Platform.OS === "ios");
		if (selectedDate) {
			setEndDate(selectedDate);
		}
	};

	const capitalizeFirstLetter = (str: string) => {
		return str.charAt(0).toUpperCase() + str.slice(1);
	};

	return (
		<ThemedView style={styles.container}>
			<ScrollView style={styles.scrollView}>
				<ThemedText style={styles.title}>Resumen de Gastos</ThemedText>

				<TouchableOpacity
					style={styles.collapsibleHeader}
					onPress={() => setIsDatePickerVisible(!isDatePickerVisible)}
				>
					<ThemedText style={styles.collapsibleTitle}>
						Seleccionar Fechas
					</ThemedText>
					<AntDesign
						name={isDatePickerVisible ? "up" : "down"}
						size={24}
						color="#007bff"
					/>
				</TouchableOpacity>

				{isDatePickerVisible && (
					<View style={styles.dateContainer}>
						<View style={styles.dateSection}>
							<ThemedText>Fecha Inicial:</ThemedText>
							{Platform.OS === "web" ? (
								<input
									type="date"
									value={
										startDate.toISOString().split("T")[0]
									}
									onChange={(e) =>
										onStartDateChange(
											null,
											new Date(e.target.value),
										)
									}
								/>
							) : (
								<>
									<TouchableOpacity
										onPress={() => setShowStartPicker(true)}
									>
										<ThemedText>
											{startDate.toLocaleDateString()}
										</ThemedText>
									</TouchableOpacity>
									{showStartPicker && (
										<DateTimePicker
											value={startDate}
											mode="date"
											onChange={onStartDateChange}
										/>
									)}
								</>
							)}
						</View>

						<View style={styles.dateSection}>
							<ThemedText>Fecha Final:</ThemedText>
							{Platform.OS === "web" ? (
								<input
									type="date"
									value={endDate.toISOString().split("T")[0]}
									onChange={(e) =>
										onEndDateChange(
											null,
											new Date(e.target.value),
										)
									}
								/>
							) : (
								<>
									<TouchableOpacity
										onPress={() => setShowEndPicker(true)}
									>
										<ThemedText>
											{endDate.toLocaleDateString()}
										</ThemedText>
									</TouchableOpacity>
									{showEndPicker && (
										<DateTimePicker
											value={endDate}
											mode="date"
											onChange={onEndDateChange}
										/>
									)}
								</>
							)}
						</View>

						<TouchableOpacity
							style={styles.button}
							onPress={fetchResume}
						>
							<ThemedText style={styles.buttonText}>
								Buscar Resumen
							</ThemedText>
						</TouchableOpacity>
					</View>
				)}

				{resume && (
					<View style={styles.resumeContainer}>
						{resume.expenses?.length > 0 ? (
							<>
								<View style={styles.card}>
									<View key={0} style={styles.rowContainer}>
										<ThemedText style={styles.cardTitle}>
											Gastos en Dólares:
										</ThemedText>
										<ThemedText>
											$
											{resume.totals.totalDollars?.toFixed(
												2,
											) || 0}
										</ThemedText>
									</View>
									<View key={1} style={styles.rowContainer}>
										<ThemedText style={styles.cardTitle}>
											Gastos en Bolívares:
										</ThemedText>
										<ThemedText>
											Bs.{" "}
											{resume.totals.totalBs?.toFixed(
												2,
											) || 0}
										</ThemedText>
									</View>
								</View>

								<View style={styles.card}>
									<ThemedText style={styles.cardTitle}>
										Por Método de Pago
									</ThemedText>
									{resume.paymentMethodTotals?.map(
										(method: any, index: number) => (
											<View
												key={index}
												style={styles.rowContainer}
											>
												<ThemedText type="defaultSemiBold">
													{capitalizeFirstLetter(
														method.paymentMethod,
													)}
													:
												</ThemedText>
												<ThemedText
													style={styles.rowContainer}
												>
													$
													{method.totalDollars.toFixed(
														2,
													)}
													, Bs.{" "}
													{method.totalBs.toFixed(2)}
												</ThemedText>
											</View>
										),
									)}
								</View>

								<View style={styles.card}>
									<ThemedText style={styles.cardTitle}>
										Por Tipo de Gasto
									</ThemedText>
									{resume.byType?.map(
										(type: any, index: number) => (
											<View
												key={index}
												style={styles.rowContainer}
											>
												<ThemedText>
													{capitalizeFirstLetter(
														type.type,
													)}
												</ThemedText>
												<ThemedText>
													{type.currency === "USD"
														? "$"
														: "Bs. "}
													{type.amount.toFixed(2)}
												</ThemedText>
											</View>
										),
									)}
								</View>
							</>
						) : (
							<View style={styles.emptyCard}>
								<ThemedText style={styles.emptyMessage}>
									No hay gastos registrados en este período
								</ThemedText>
							</View>
						)}
					</View>
				)}
			</ScrollView>
		</ThemedView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
	},
	dateContainer: {
		marginBottom: 20,
	},
	dateSection: {
		marginVertical: 10,
	},
	button: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 10,
		alignItems: "center",
		marginTop: 10,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
	resumeContainer: {
		gap: 15,
	},
	card: {
		backgroundColor: "#f8f9fa",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
	},
	cardTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	collapsibleHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 15,
		backgroundColor: "#f8f9fa",
		borderRadius: 10,
		marginBottom: 10,
	},
	collapsibleTitle: {
		fontSize: 18,
		fontWeight: "bold",
	},
	emptyCard: {
		backgroundColor: "#f8f9fa",
		padding: 15,
		borderRadius: 10,
		marginBottom: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	emptyMessage: {
		fontSize: 16,
		fontWeight: "bold",
	},
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

export default ExpensesResume;
