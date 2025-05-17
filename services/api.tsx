import axios, { AxiosError } from "axios";

const API_URL = "http://localhost:3000"; // Cambia esto según tu backend

const api = axios.create({
	baseURL: API_URL,
	timeout: 1000,
});

export const login = async (username: string, password: string) => {
	try {
		const loginResponse = await api.post("/login", { username, password });

		return {
			...loginResponse.data,
		};
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
				console.log(
					"🚨 No hubo respuesta del servidor:",
					error.request,
				);
				throw new Error(
					"No hubo respuesta del servidor. Intenta de nuevo.",
				);
			}
		} else {
			throw new Error(`🚨 Error inesperado: ${String(error)}`);
		}
	}
};

// EXHANGE RATE APIS START

export const createExchangeRate = async (rate: any) => {
	try {
		const response = await axios.post(
			`${API_URL}/exchange-rate/create`,
			{ rate },
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error al crear la tasa:", error);
		throw error;
	}
};

export const getExchangeRateByDate = async (date: string) => {
	try {
		const response = await api.get(`/exchange-rate/get/${date}`);

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

export const createExpense = async (expenseData: any) => {
	try {
		console.log(expenseData);
		const response = await axios.post(
			`${API_URL}/expenses/create`,
			expenseData,
		);
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
) => {
	try {
		const expenseData = {
			invoiceId, // Enviar el ID de la factura
			paymentMethod, // Enviar el método de pago
			paid: true,
			date, // Marcar la factura como pagada
			// Puedes agregar más datos aquí si es necesario, como la fecha o tipo de gasto
		};

		const response = await axios.post(
			`${API_URL}/expenses/create-by-invoice`,
			expenseData,
		);
		return response;
	} catch (error) {
		console.error("Error al crear el gasto:", error);
		throw error;
	}
};

export const getExpenses = async () => {
	try {
		const response = await axios.get(`${API_URL}/expenses/get`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener los gastos", error);
		throw error;
	}
};

export const getExpensesResume = async (dates: {
	startDate: string;
	endDate: string;
}) => {
	try {
		const response = await api.get("/expenses/expenses-resume", {
			params: dates, // Esto se convierte en query params: /expenses/expenses-resume?startDate=X&endDate=Y
		});
		return response.data;
	} catch (error) {
		console.error("Error al obtener el resumen de gastos:", error);
		throw error;
	}
};

// EXPENSES APIS END

// INOVICES APIS START
export const createInvoice = async (invoiceData: any) => {
	try {
		const response = await axios.post(
			`${API_URL}/invoices/create`,
			invoiceData,
		);
		return response.data;
	} catch (error) {
		console.error("Error al crear el gasto:", error);
		throw error;
	}
};

export const getInvoices = async () => {
	try {
		const response = await axios.get(`${API_URL}/invoices/get`);
		return response.data;
	} catch (error) {
		console.error("Error al obtener los gastos", error);
		throw error;
	}
};

// INOVICES APIS END

// INCOME APIS START
export const createIncome = async (incomeData: any) => {
	try {
		const response = await axios.post(
			`${API_URL}/incomes/create`,
			incomeData,
		);
		return response.data;
	} catch (error) {
		console.error("Error al crear el ingreso:", error);
		throw error;
	}
};
// INCOME APIS END
