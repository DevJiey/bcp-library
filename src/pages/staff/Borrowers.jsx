import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
  FaSearch,
  FaUserPlus,
  FaUsers,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaEnvelope,
  FaUser,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

import StaffLayout from "../../layouts/StaffLayout";
import borrowersData from "../../data/borrowers";

function Borrowers() {
  const { showToast } = useToast();
  const [borrowers, setBorrowers] = useState(borrowersData);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState(null);

  const [newBorrower, setNewBorrower] = useState({
    name: "",
    email: "",
    type: "Student",
  });

  const filteredBorrowers = borrowers.filter((borrower) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      borrower.name.toLowerCase().includes(keyword) ||
      borrower.email.toLowerCase().includes(keyword);

    const matchesType =
      typeFilter === "All" || borrower.type === typeFilter;

    return matchesSearch && matchesType;
  });

  const handleAddBorrower = () => {
    if (
      !newBorrower.name.trim() ||
      !newBorrower.email.trim()
    ) {
      showToast("Please complete the borrower information.", "error");
      return;
    }

    const borrower = {
      id: Date.now(),
      ...newBorrower,
      name: newBorrower.name.trim(),
      email: newBorrower.email.trim(),
    };

    setBorrowers([...borrowers, borrower]);

    setShowModal(false);

    setNewBorrower({
      name: "",
      email: "",
      type: "Student",
    });
  };

  const handleUpdateBorrower = () => {
    if (
      !editingBorrower.name.trim() ||
      !editingBorrower.email.trim()
    ) {
      showToast("Please complete the borrower information.", "error");
      return;
    }

    setBorrowers(
      borrowers.map((borrower) =>
        borrower.id === editingBorrower.id
          ? {
              ...editingBorrower,
              name: editingBorrower.name.trim(),
              email: editingBorrower.email.trim(),
            }
          : borrower
      )
    );

    setEditingBorrower(null);
  };

  return (
    <StaffLayout>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            Borrower Records
          </p>

          <h1 className="mt-1 text-3xl font-bold text-slate-900">
            Borrower Management
          </h1>

          <p className="mt-2 text-slate-500">
            Register new borrowers and maintain student and faculty accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-800"
        >
          <FaUserPlus />
          New Borrower
        </button>
      </div>

      {/* Toolbar */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaUsers />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Registered Borrowers
              </h2>

              <p className="text-sm text-slate-500">
                {filteredBorrowers.length} borrower
                {filteredBorrowers.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
              <FaSearch className="text-slate-400" />

              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 outline-none sm:w-64"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-2 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
            </select>
          </div>
        </div>
      </section>

      {/* Borrower Table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Email Address
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Borrower Type
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredBorrowers.map((borrower) => (
                <tr
                  key={borrower.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                        {borrower.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {borrower.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Registered library borrower
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FaEnvelope className="text-slate-400" />
                      {borrower.email}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                        borrower.type === "Student"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-violet-100 text-violet-700"
                      }`}
                    >
                      {borrower.type === "Student" ? (
                        <FaUserGraduate />
                      ) : (
                        <FaChalkboardTeacher />
                      )}

                      {borrower.type}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingBorrower({ ...borrower })
                      }
                      className="flex items-center gap-2 rounded-lg border border-amber-200 px-4 py-2 text-sm font-semibold text-amber-700 transition hover:bg-amber-50"
                    >
                      <FaEdit />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Empty State */}
      {filteredBorrowers.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
          <FaUsers className="mx-auto text-3xl text-slate-300" />

          <h2 className="mt-4 font-semibold text-slate-800">
            No borrowers found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search keyword or borrower type.
          </p>
        </div>
      )}

      {/* Add Borrower Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
                  Borrower Registration
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Add New Borrower
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <FaUser className="text-slate-400" />

                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={newBorrower.name}
                    onChange={(e) =>
                      setNewBorrower({
                        ...newBorrower,
                        name: e.target.value,
                      })
                    }
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <div className="flex items-center rounded-xl border border-slate-300 px-4 transition focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-100">
                  <FaEnvelope className="text-slate-400" />

                  <input
                    type="email"
                    placeholder="Enter email address"
                    value={newBorrower.email}
                    onChange={(e) =>
                      setNewBorrower({
                        ...newBorrower,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 py-3 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Borrower Type
                </label>

                <select
                  value={newBorrower.type}
                  onChange={(e) =>
                    setNewBorrower({
                      ...newBorrower,
                      type: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleAddBorrower}
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  <FaSave />
                  Save Borrower
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Borrower Modal */}
      {editingBorrower && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                  Borrower Record
                </p>

                <h2 className="mt-1 text-xl font-bold">
                  Edit Borrower
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingBorrower(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={editingBorrower.name}
                  onChange={(e) =>
                    setEditingBorrower({
                      ...editingBorrower,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={editingBorrower.email}
                  onChange={(e) =>
                    setEditingBorrower({
                      ...editingBorrower,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Borrower Type
                </label>

                <select
                  value={editingBorrower.type}
                  onChange={(e) =>
                    setEditingBorrower({
                      ...editingBorrower,
                      type: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                </select>
              </div>

              <div className="flex gap-3 border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={() => setEditingBorrower(null)}
                  className="flex-1 rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleUpdateBorrower}
                  className="flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600"
                >
                  <FaSave />
                  Update Borrower
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </StaffLayout>
  );
}

export default Borrowers;