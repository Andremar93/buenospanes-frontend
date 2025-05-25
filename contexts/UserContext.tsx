import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

interface User {
	id: string | null;
	username: string | null;
	token: string | null;
}

interface UserContextType {
	user: User;
	setUser: (user: User) => void;
	logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User>({ username: null, token: null });

	useEffect(() => {
		const loadUser = async () => {
			const storedId = await SecureStore.getItemAsync("userId");
			const storedUsername = await SecureStore.getItemAsync("username");
			const storedToken = await SecureStore.getItemAsync("userToken");

			if (storedId && storedUsername && storedToken) {
				setUser({ id: storedId, username: storedUsername, token: storedToken });
			}
		};

		loadUser();
	}, []);

	const logout = async () => {
		await SecureStore.deleteItemAsync("userId");
		await SecureStore.deleteItemAsync("username");
		await SecureStore.deleteItemAsync("userToken");
		setUser({ id: null, username: null, token: null });
	};

	return (
		<UserContext.Provider value={{ user, setUser, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => {
	const context = useContext(UserContext);
	if (!context) {
		throw new Error("useUser debe usarse dentro de un UserProvider");
	}
	return context;
};
