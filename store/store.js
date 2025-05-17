import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getExchangeRateByDate, createExchangeRate } from "../services/api";

const storageKey = "app-storage";

const getFormattedToday = () => {
	const now = new Date();
	now.setUTCHours(now.getUTCHours() - 4);
	return now.toISOString().split("T")[0];
};

const useStore = create(
	persist(
		(set, get) => ({
			username: "",
			exchangeRate: null,
			lastUpdated: null,
			loading: false,

			setUsername: (name) => set({ username: name }),
			setLoading: (loading) => set({ loading }),

			setExchangeRate: async (rate) => {
				try {
					await createExchangeRate(rate);
					set({
						exchangeRate: rate,
						lastUpdated: getFormattedToday(),
					});
					return true;
				} catch (error) {
					console.error("Error al guardar la tasa:", error);
					return false;
				}
			},

			checkExchangeRate: async () => {
				const { lastUpdated } = get();
				const today = getFormattedToday();

				if (lastUpdated !== today) {
					set({ loading: true });
					try {
						const rateData = await getExchangeRateByDate(today);
						if (rateData && typeof rateData.rate === "number") {
							set({
								exchangeRate: rateData.rate,
								lastUpdated: today,
							});
						} else {
							set({ exchangeRate: null, lastUpdated: today });
						}
					} catch (err) {
						console.error("Error al obtener tasa:", err);
					} finally {
						set({ loading: false });
					}
				}
				// get().resetStore();
			},

			resetStore: () => {
				set({
					username: "",
					exchangeRate: null,
					lastUpdated: null,
				});
				AsyncStorage.removeItem(storageKey);
			},
		}),
		{
			name: storageKey,
			storage: createJSONStorage(() => AsyncStorage),
		},
	),
);

export default useStore;
