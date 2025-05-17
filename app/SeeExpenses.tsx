import React from "react";
import { Text, StyleSheet, FlatList, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { getExpenses } from "@/services/api";
import { ThemedText } from "@/components/ThemedText";

const SeeExpenses: React.FC = () => {
	const [expenses, setExpenses] = React.useState([]);

	React.useEffect(() => {
		const fetchExpenses = async () => {
			try {
				const expensesData = await getExpenses();
				setExpenses(expensesData);
				//console.log("expensesData", expensesData);
			} catch (error) {
				console.error("Error fetching expenses:", error);
			}
		};

		fetchExpenses();
	}, []);

	const formatText = (text: string) => {
		return text
			.replace(/([A-Z])/g, " $1") // Agrega un espacio antes de cada letra mayúscula
			.replace(/^./, (str) => str.toUpperCase()); // Capitaliza la primera letra
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("es-ES", {
			day: "2-digit",
			month: "long",
			year: "numeric",
		});
	};

	const renderExpense = ({ item }: { item: any }) => (
		<View style={styles.card}>
			<Text style={styles.expenseTitle}>
				{item.description} - {item.currency}
			</Text>
			<Text style={styles.expenseTitle}>
				{item.amountDollars}$ - {item.amountBs}Bs.
			</Text>
			<Text style={styles.expenseType}>
				{formatText(item.type)}{" "}
				{item.subType ? `- ${formatText(item.subType)}` : ""}
			</Text>
			<Text
				style={[
					styles.expenseDate,
					{ fontSize: 14, alignSelf: "flex-end" },
				]}
			>
				{formatDate(item.date)}
			</Text>
		</View>
	);

	return (
		<ThemedView style={styles.container}>
			<View>
				<ThemedText>PRoBABLY A FILTER HERE</ThemedText>
			</View>

			<FlatList
				data={expenses}
				keyExtractor={(item) => item._id}
				renderItem={renderExpense}
				style={{ width: "100%" }}
			/>
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
	expenseTitle: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 5,
		color: "#333",
		textTransform: "uppercase",
	},
	expenseType: {
		fontSize: 16,
		fontStyle: "italic",
		color: "#666",
		marginBottom: 5,
	},
	expenseAmount: {
		fontSize: 18,
		fontWeight: "600",
		color: "#007bff",
		marginBottom: 5,
	},
	expenseDate: {
		fontSize: 14,
		color: "#888",
	},
});

export default SeeExpenses;
