import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExchangeRateByDate, createExchangeRate } from "../services/api";

// Función para obtener la fecha actual en formato "YYYY-MM-DD"
const getCurrentDate = () => {
	return new Date().toISOString().split("T")[0];
};

const useStore = create(
	persist(
		(set, get) => ({
			username: "",
			exchangeRate: null,
			lastUpdated: null, // Fecha cuando se guardó la tasa

			setUsername: (name) => set({ username: name }),

			setExchangeRate: (rate) => {
				// Llamada a la API para guardar el gasto
				createExchangeRate(rate)
					.then((response) => {
						const today = getCurrentDate();
						set({ exchangeRate: rate, lastUpdated: today });
						return true;
					})
					.catch((error) => {
						console.error("Error al guardar la tasa:", error);
						return `Error al guardar la tasa, error`;
					});
			},

			checkExchangeRate: async () => {
				const { lastUpdated } = get();
				const today = getCurrentDate();
				const selectedDate = new Date();
				selectedDate.setUTCHours(selectedDate.getUTCHours() - 4);
				// Si la tasa es de otro día, resetearla a null
				if (lastUpdated !== today) {
					const formattedDate = selectedDate
						.toISOString()
						.split("T")[0];

					const exchangerate =
						await getExchangeRateByDate(formattedDate);
					console.log("exchangerate getting", exchangerate);
					set({ exchangeRate: null, lastUpdated: today });
				}
			},
		}),
		{
			name: "app-storage",
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default useStore;
