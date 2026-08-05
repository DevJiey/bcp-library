function ConfirmDialog({
    open,
    title,
    message,
    icon,
    confirmText = "Confirm",
    cancelText = "Cancel",
    confirmColor = "bg-red-600 hover:bg-red-700",
    onConfirm,
    onCancel
}) {

    if (!open) return null;

    return (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                <div className="p-6 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">

                        {icon}

                    </div>

                    <h2 className="mt-5 text-xl font-bold text-slate-900">

                        {title}

                    </h2>

                    <p className="mt-2 leading-6 text-slate-500">

                        {message}

                    </p>

                    <div className="mt-6 flex gap-3">

                        <button
                            onClick={onCancel}
                            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                        >

                            {cancelText}

                        </button>

                        <button
                            onClick={onConfirm}
                            className={`flex-1 rounded-xl px-4 py-3 font-semibold text-white transition ${confirmColor}`}
                        >

                            {confirmText}

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default ConfirmDialog;