// store/useStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
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
			// USER
			userId: null,
			username: null,
			token: null,

			// ESTADO DE TASA
			exchangeRate: null,
			lastUpdated: null,
			loading: false,

			// === USER ===
			setUser: async ({ id, username, token }) => {
				await SecureStore.setItemAsync("userId", id);
				await SecureStore.setItemAsync("username", username);
				await SecureStore.setItemAsync("userToken", token);
				set({ userId: id, username, token });
			},

			loadUser: async () => {
				const id = await SecureStore.getItemAsync("userId");
				const username = await SecureStore.getItemAsync("username");
				const token = await SecureStore.getItemAsync("userToken");

				if (id && username && token) {
					set({ userId: id, username, token });
				}
			},

			logout: async () => {
				await SecureStore.deleteItemAsync("userId");
				await SecureStore.deleteItemAsync("username");
				await SecureStore.deleteItemAsync("userToken");
				set({ userId: null, username: null, token: null });
				await AsyncStorage.removeItem(storageKey);
			},

			// === APP ===
			setLoading: (loading) => set({ loading }),

			setExchangeRate: async (rate) => {
				const token = get().token;
				try {
					await createExchangeRate(rate, token);
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
				const { lastUpdated, token } = get();
				const today = getFormattedToday();

				if (lastUpdated !== today && token) {
					set({ loading: true });
					try {
						const rateData = await getExchangeRateByDate(
							today,
							token,
						);
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
			},

			resetStore: () => {
				set({
					username: null,
					userId: null,
					token: null,
					exchangeRate: null,
					lastUpdated: null,
				});
				AsyncStorage.removeItem(storageKey);
			},
		}),
		{
			name: storageKey,
			storage: createJSONStorage(() => AsyncStorage),
			partialize: (state) => ({
				// Solo se persiste lo necesario en AsyncStorage (token sensible va en SecureStore)
				exchangeRate: state.exchangeRate,
				lastUpdated: state.lastUpdated,
			}),
		},
	),
);

export default useStore;
