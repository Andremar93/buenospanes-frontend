import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:3000"; // Cambia esto según tu backend
// const API_URL = "https://buenospanes-backend-production.up.railway.app";

const api = axios.create({
	baseURL: API_URL,
	timeout: 5000,
});

export const login = async (username: string, password: string) => {
	try {
		const loginResponse = await api.post("/login", { username, password });
		return { ...loginResponse.data };
	} catch (error) {
		if (error instanceof AxiosError) {
			console.log("🔴 Error en login API:", error.message);
			if (error.response) {
				console.log("📌 Respuesta del servidor:", error.response.data);
				console.log("📌 Código de estado:", error.response.status);
				const errorMessage =
					typeof error.response.data === "string"
						? error.response.data
						: error.response.data?.error || "Error desconocido";
				throw new Error(errorMessage);
			} else if (error.request) {
				throw new Error("No hubo respuesta del servidor.");
			}
		}
		throw new Error(`🚨 Error inesperado: ${String(error)}`);
	}
};

// EXHANGE RATE APIS START

export const createExchangeRate = async (rate: number, token: string) => {
	try {
		console.log("token", token);
		const response = await api.post(
			"/exchange-rate/create",
			{ rate },
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error al crear la tasa:", JSON.stringify(error));
		throw error;
	}
};

export const getExchangeRateByDate = async (date: string, token: string) => {
	try {
		const response = await api.get(`/exchange-rate/get/${date}`, {
			headers: { Authorization: `Bearer ${token}` },
		});
		if (response.status === 204 || !response.data) {
			return {
				message: "No hay tasa de cambio para esta fecha.",
				exchangeRate: null,
			};
		}
		return response.data;
	} catch (error) {
		console.error("Error al obtener la tasa de cambio:", error);
		throw error;
	}
};

// EXHANGE RATE APIS END

// EXPENSES APIS START

export const createExpense = async (expenseData: any, token: string) => {
	try {
		const response = await api.post("/expenses/create", expenseData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al crear el gasto:", error);
		throw error;
	}
};

export const createExpenseByInvoice = async (
	invoiceId: string,
	paymentMethod: string,
	date: Date,
	token: string,
) => {
	try {
		const expenseData = {
			invoiceId,
			paymentMethod,
			paid: true,
			date,
		};
		const response = await api.post(
			"/expenses/create-by-invoice",
			expenseData,
			{
				headers: { Authorization: `Bearer ${token}` },
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error al crear el gasto:", error);
		throw error;
	}
};

export const getExpenses = async (token: string) => {
	try {
		const response = await api.get("/expenses/get", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener los gastos", error);
		throw error;
	}
};

export const getExpensesResume = async (
	dates: { startDate: string; endDate: string },
	token: string,
) => {
	try {
		const response = await api.get("/expenses/expenses-resume", {
			params: dates,
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener el resumen de gastos:", error);
		throw error;
	}
};

// EXPENSES APIS END

// INOVICES APIS START
export const createInvoice = async (invoiceData: any, token: string) => {
	try {
		const response = await api.post("/invoices/create", invoiceData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al crear la factura:", error);
		throw error;
	}
};

export const getInvoices = async (token: string) => {
	try {
		const response = await api.get("/invoices/get", {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener las facturas", error);
		throw error;
	}
};

// INOVICES APIS END

// INCOME APIS START
export const createIncome = async (incomeData: any, token: string) => {
	try {
		const response = await api.post("/incomes/create", incomeData, {
			headers: { Authorization: `Bearer ${token}` },
		});
		return response.data;
	} catch (error) {
		console.error("Error al crear el ingreso:", error);
		throw error;
	}
};
// INCOME APIS END
