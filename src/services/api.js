const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api/v1";

const apiRequest = async (
    endpoint,
    options = {}
) => {
    const token =
        localStorage.getItem("token");

    const response = await fetch(
        `${API_BASE_URL}${endpoint}`,
        {
            ...options,
            headers: {
                "Content-Type":
                    "application/json",
                ...(token && {
                    Authorization:
                        `Bearer ${token}`,
                }),
                ...options.headers,
            },
        }
    );

    let result;

    try {
        result = await response.json();
    } catch {
        result = null;
    }

    if (!response.ok) {
        throw new Error(
            result?.message ||
            "Something went wrong."
        );
    }

    return result;
};

export default apiRequest;