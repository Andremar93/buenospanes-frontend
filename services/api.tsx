import axios from "axios";

const API_URL = "http://localhost:3000"; // Cambia esto según tu backend

const api = axios.create({
	baseURL: API_URL,
	timeout: 1000,
});

export const login = async (username: string, password: string) => {
	try {
		const loginResponse = await api.post("/login", { username, password });
		const selectedDate = new Date(); // Obtener fecha actual
		selectedDate.setUTCHours(selectedDate.getUTCHours() - 4); // Ajustar a UTC-4 (Venezuela)
		const formattedDate = selectedDate.toISOString().split("T")[0];

		const exchangeRateResponse = await api.get(
			`/exchange-rate/get/${formattedDate}`,
		);
		if (exchangeRateResponse.status === 204) {
			return { ...loginResponse.data, redirectToSetExchangeRate: true };
		}

		return {
			...loginResponse.data,
			exchangeRate: exchangeRateResponse.data,
		};
	} catch (error) {
		throw new Error("Error during login");
	}
};

// EXHANGE RATE APIS START

export const createExchangeRate = async (dayRate: any) => {
	try {
		const response = await axios.post(
			`${API_URL}/exchange-rate/create`,
			dayRate,
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
		return response.data;
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

// EXPENSES APIS END

// INOVICES APIS START

export const createInvoice = async (invoiceData: any) => {
	try {
		console.log("invoiceData", invoiceData);
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
		console.log(response.data);
		return response.data;
	} catch (error) {
		console.error("Error al obtener los gastos", error);
		throw error;
	}
};

// INOVICES APIS END
