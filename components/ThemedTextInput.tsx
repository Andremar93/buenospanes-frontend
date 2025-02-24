import { TextInput, TextInputProps, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextInputProps = TextInputProps & {
	lightColor?: string;
	darkColor?: string;
	type?: "default" | "outlined" | "rounded" | "underlined";
};

export function ThemedTextInput({
	style,
	lightColor,
	darkColor,
	type = "default",
	...rest
}: ThemedTextInputProps) {
	const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
	const backgroundColor = useThemeColor(
		{ light: "#fff", dark: "#222" },
		"background",
	);

	return (
		<TextInput
			style={[
				styles.base,
				{ color, backgroundColor },
				type === "default" ? styles.default : undefined,
				type === "outlined" ? styles.outlined : undefined,
				type === "rounded" ? styles.rounded : undefined,
				type === "underlined" ? styles.underlined : undefined,
				style,
			]}
			placeholderTextColor={color}
			{...rest}
		/>
	);
}

const styles = StyleSheet.create({
	base: {
		fontSize: 16,
		paddingHorizontal: 10,
		paddingVertical: 8,
		borderWidth: 1,
		minWidth: 200,
		width: "100%",
		margin: 10,
	},
	default: {
		borderColor: "#ccc",
		borderRadius: 4,
	},
	outlined: {
		borderColor: "#007bff",
		borderWidth: 2,
		borderRadius: 8,
	},
	rounded: {
		borderColor: "#ccc",
		borderRadius: 20,
	},
	underlined: {
		borderBottomWidth: 2,
		borderColor: "#007bff",
		borderRadius: 0,
		borderWidth: 0,
	},
});
