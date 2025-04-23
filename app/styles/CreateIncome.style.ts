import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
	container: {
		padding: 10,
		flex: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		maxWidth: 650,
		paddingBottom: 40,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#fff",
		width: "100%",
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
		marginBottom: 4,
		flexBasis: "30%",
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
	scrollContainer: {
		flexGrow: 1,
		justifyContent: "flex-start",
		alignItems: "center",
		paddingBottom: 60,
	},
	textInput: {
		display: "flex",
		justifyContent: "space-between",
		width: "100%",
		flexDirection: "row",
		padding: 5,
		borderBottomWidth: 1,
		borderBottomColor: "#ccc", // puedes usar cualquier color
		paddingBottom: 10,
		alignItems: "center",
	},
	inputContainer: {
		maxWidth: "60%",
		flexBasis: "70%",
		alignSelf: "flex-start",
	},
	submitButton: {
		backgroundColor: "#007bff",
		padding: 15,
		borderRadius: 10,
		marginVertical: 10,
		width: 200,
		alignItems: "center",
	},
	submitButtonText: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
	},
});
