import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedPickerProps = {
	selectedValue: string;
	onValueChange: (itemValue: string) => void;
	items: { label: string; value: string }[];
	lightColor?: string;
	darkColor?: string;
	type?: "default" | "outlined" | "rounded" | "underlined";
};

export function ThemedPicker({
	selectedValue,
	onValueChange,
	items,
	lightColor,
	darkColor,
	type = "default",
}: ThemedPickerProps) {
	const color = useThemeColor(
		{ light: lightColor || "#000", dark: darkColor || "#fff" },
		"text",
	);
	const backgroundColor = useThemeColor(
		{ light: "#fff", dark: "#222" },
		"background",
	);
	const borderColor = useThemeColor(
		{ light: "#ccc", dark: "#444" },
		"border",
	);

	return (
		<View
			style={[
				styles.base,
				{ backgroundColor, borderColor },
				type === "outlined" ? styles.outlined : undefined,
				type === "rounded" ? styles.rounded : undefined,
				type === "underlined" ? styles.underlined : undefined,
			]}
		>
			<Picker
				selectedValue={selectedValue}
				onValueChange={onValueChange}
				style={[styles.picker, { color }, { backgroundColor }]}
				itemStyle={{ color }} // Asegura que los items tengan el color correcto
			>
				{items.map((item) => (
					<Picker.Item
						key={item.value}
						label={item.label}
						value={item.value}
						color={color}
					/>
				))}
			</Picker>
		</View>
	);
}

const styles = StyleSheet.create({
	base: {
		fontSize: 16,
		borderWidth: 1,
		minWidth: 200,
		width: "100%",
		margin: 10,
		borderColor: "#ccc",
		borderRadius: 4,
	},
	picker: {
		height: 40,
		width: "100%",
	},
	outlined: {
		borderWidth: 2,
		borderColor: "#007bff",
		borderRadius: 8,
	},
	rounded: {
		borderRadius: 20,
	},
	underlined: {
		borderBottomWidth: 2,
		borderWidth: 0,
	},
});
