export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type FetcherOptions = {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    payload?: any;
    headers?: Record<string, string>;
};

export const fetcher = async (endpoint: string, options: FetcherOptions = {}) => {
    const { method = "GET", payload, headers = {} } = options;

    const config: RequestInit = {
        method,
        credentials: "include", // Supaya cookie selalu dikirim
        headers: {
            ...headers,
        },
    };

    if (payload) {
        if (payload instanceof FormData) {
            // Jika FormData (seperti upload file/multipart), jangan set Content-Type.
            // Browser akan mengaturnya otomatis beserta boundary-nya.
            config.body = payload;
        } else {
            // Jika payload JSON biasa
            config.headers = {
                "Content-Type": "application/json",
                ...config.headers,
            };
            config.body = JSON.stringify(payload);
        }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        let message = `HTTP Error ${response.status}`;

        try {
            const data = await response.clone().json();
            message = data.message || message;
        } catch {
            try {
                message = await response.text();
            } catch {
                // abaikan, gunakan message default
            }
        }

        const error: any = new Error(message);
        error.status = response.status;
        error.response = response;

        throw error;
    }

    return response;
};
