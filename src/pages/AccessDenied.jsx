import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaLock,
  FaHome,
} from "react-icons/fa";

function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-3xl text-red-600">
          <FaLock />
        </div>

        <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-red-600">
          Restricted Area
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Access Denied
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
          You do not have permission to access this page. Please return to your authorized portal.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <FaArrowLeft />
            Go Back
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
          >
            <FaHome />
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default AccessDenied;