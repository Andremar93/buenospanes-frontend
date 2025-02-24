import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getExchangeRateByDate } from "@/services/api";

// Definir el tipo del contexto
interface ExchangeRateContextType {
	exchangeRate: number | null;
	setExchangeRate: (rate: number) => void;
	fetchExchangeRate: () => Promise<void>;
	resetExchangeRate: () => void;
}

// Crear el contexto
const ExchangeRateContext = createContext<ExchangeRateContextType | undefined>(
	undefined,
);

// Proveedor del contexto
export const ExchangeRateProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [exchangeRate, setExchangeRate] = useState<number | null>(null);
	const router = useRouter();

	// Función para obtener la tasa del día desde la API
	const fetchExchangeRate = async () => {
		try {
			const storedRate = await AsyncStorage.getItem("exchangeRate");
			if (storedRate) {
				setExchangeRate(parseFloat(storedRate));
				return;
			}

			// Obtener la fecha actual en formato YYYY-MM-DD
			const selectedDate = new Date();
			selectedDate.setUTCHours(selectedDate.getUTCHours() - 4); // Ajuste a UTC-4 (Venezuela)
			const formattedDate = selectedDate.toISOString().split("T")[0];

			// Llamar a la API
			const exchangeRateData = await getExchangeRateByDate(formattedDate);

			if (exchangeRateData.exchangeRate !== null) {
				setExchangeRate(exchangeRateData.exchangeRate);
				console.log("exchangeRateData", exchangeRateData);
				await AsyncStorage.setItem(
					"exchangeRate",
					exchangeRateData.rate.toString(),
				);
			} else {
				console.warn(exchangeRateData.message);
				// Redirigir a la pantalla de creación de tasa si no hay tasa
				router.push("/SetExchangeRate");
			}
		} catch (error) {
			console.error("Error al obtener la tasa de cambio:", error);
		}
	};

	// Función para resetear el estado
	const resetExchangeRate = () => {
		setExchangeRate(null);
	};

	useEffect(() => {
		fetchExchangeRate();
	}, []);

	return (
		<ExchangeRateContext.Provider
			value={{
				exchangeRate,
				setExchangeRate,
				fetchExchangeRate,
				resetExchangeRate,
			}}
		>
			{children}
		</ExchangeRateContext.Provider>
	);
};

// Hook personalizado para usar el contexto
export const useExchangeRate = () => {
	const context = useContext(ExchangeRateContext);
	if (!context) {
		throw new Error(
			"useExchangeRate debe usarse dentro de un ExchangeRateProvider",
		);
	}
	return context;
};
