import {
    createContext,
    useContext,
    useState,
} from "react";

import Toast from "../components/Toast";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
    const [toast, setToast] = useState({
        show: false,
        type: "success",
        message: "",
    });

    const showToast = (
        message,
        type = "success"
    ) => {
        setToast({
            show: true,
            type,
            message,
        });

        setTimeout(() => {
            setToast((currentToast) => ({
                ...currentToast,
                show: false,
            }));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            <Toast
                show={toast.show}
                type={toast.type}
                message={toast.message}
            />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used inside ToastProvider"
        );
    }

    return context;
}