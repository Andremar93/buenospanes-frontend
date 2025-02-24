import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
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
			const storedUsername = await AsyncStorage.getItem("username");
			const storedToken = await AsyncStorage.getItem("userToken");

			if (storedUsername && storedToken) {
				setUser({ username: storedUsername, token: storedToken });
			}
		};

		loadUser();
	}, []);

	const logout = async () => {
		await AsyncStorage.removeItem("username");
		await AsyncStorage.removeItem("userToken");
		setUser({ username: null, token: null });
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
