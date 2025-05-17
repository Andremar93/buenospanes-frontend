import React, { useState } from "react";
import {
	Platform,
	TouchableOpacity,
	View,
	Text,
	StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ThemedText } from "./ThemedText";

interface ThemedDatePickerProps {
	value: Date;
	onChange: (date: Date) => void;
	disabled?: boolean;
	label?: string;
}

export const ThemedDatePicker: React.FC<ThemedDatePickerProps> = ({
	value,
	onChange,
	disabled = false,
	label = "Selecciona una fecha",
}) => {
	const [showPicker, setShowPicker] = useState(false);

	const handleChange = (_event: any, selectedDate?: Date) => {
		setShowPicker(false);
		if (selectedDate) {
			onChange(selectedDate);
		}
	};

	return (
		<View style={styles.wrapper}>
			<ThemedText style={styles.label}>{label}</ThemedText>

			{Platform.OS === "web" ? (
				<input
					type="date"
					disabled={disabled}
					value={value.toISOString().split("T")[0]}
					onChange={(e) => onChange(new Date(e.target.value))}
					style={styles.webInput}
				/>
			) : (
				<TouchableOpacity
					onPress={() => !disabled && setShowPicker(true)}
					disabled={disabled}
					style={styles.touchable}
				>
					<ThemedText>{value.toLocaleDateString()}</ThemedText>
				</TouchableOpacity>
			)}

			{showPicker && (
				<DateTimePicker
					value={value}
					mode="date"
					display={Platform.OS === "ios" ? "inline" : "default"}
					onChange={handleChange}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		width: "100%",
		marginVertical: 10,
	},
	label: {
		fontSize: 16,
		marginBottom: 5,
	},
	touchable: {
		padding: 12,
		borderWidth: 1,
		borderColor: "#ccc",
		borderRadius: 8,
		backgroundColor: "#f0f0f0",
	},
	webInput: {
		padding: 10,
		borderRadius: 5,
		border: "1px solid #ccc",
	},
});
