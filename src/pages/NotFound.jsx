import { useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaHome,
  FaSearch,
} from "react-icons/fa";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-2xl rounded-3xl bg-white p-10 text-center shadow-xl ring-1 ring-slate-200">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100 text-3xl text-blue-700">
          <FaSearch />
        </div>

        <p className="mt-6 text-7xl font-black text-[#0F4C97]">
          404
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
          The page you are looking for does not exist, was moved, or the URL may be incorrect.
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

export default NotFound;