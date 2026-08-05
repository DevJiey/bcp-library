import {
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaTimesCircle
} from "react-icons/fa";

function Toast({
    show,
    type = "success",
    message
}) {

    if (!show) return null;

    const styles = {
        success: {
            icon: <FaCheckCircle />,
            bg: "bg-green-600"
        },
        error: {
            icon: <FaTimesCircle />,
            bg: "bg-red-600"
        },
        warning: {
            icon: <FaExclamationTriangle />,
            bg: "bg-amber-500"
        },
        info: {
            icon: <FaInfoCircle />,
            bg: "bg-blue-600"
        }
    };

    return (

        <div className="fixed top-5 right-5 z-[200]">

            <div className={`${styles[type].bg} flex items-center gap-3 rounded-xl px-5 py-4 text-white shadow-2xl animate-[fadeIn_.25s]`}>

                <div className="text-lg">

                    {styles[type].icon}

                </div>

                <p className="font-medium">

                    {message}

                </p>

            </div>

        </div>

    );

}

export default Toast;