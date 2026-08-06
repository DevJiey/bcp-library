import { useState } from "react";
import { useToast } from "../../context/ToastContext";
import {
    FaBarcode,
    FaCopy,
    FaEdit,
    FaPlus,
    FaSearch,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import bookCopiesData from "../../data/bookCopies";

function BookCopies() {
    const { showToast } = useToast();
    const [copies, setCopies] = useState(bookCopiesData);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingCopy, setEditingCopy] = useState(null);

    const [newCopy, setNewCopy] = useState({
        barcode: "",
        accessionNumber: "",
        bookTitle: "",
        shelf: "",
        status: "Available",
    });

    const filteredCopies = copies.filter((copy) => {
        const keyword = search.toLowerCase();

        const matchesSearch =
            copy.barcode.toLowerCase().includes(keyword) ||
            copy.accessionNumber.toLowerCase().includes(keyword) ||
            copy.bookTitle.toLowerCase().includes(keyword);

        const matchesStatus =
            statusFilter === "All" ||
            copy.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleAddCopy = () => {
        if (
            !newCopy.barcode.trim() ||
            !newCopy.accessionNumber.trim() ||
            !newCopy.bookTitle.trim() ||
            !newCopy.shelf.trim()
        ) {
            showToast("Please complete all copy information.", "error");
            return;
        }

        setCopies([
            ...copies,
            {
                id: Date.now(),
                ...newCopy,
            },
        ]);

        setShowAddModal(false);

        setNewCopy({
            barcode: "",
            accessionNumber: "",
            bookTitle: "",
            shelf: "",
            status: "Available",
        });
    };

    const handleUpdateCopy = () => {
        setCopies(
            copies.map((copy) =>
                copy.id === editingCopy.id
                    ? editingCopy
                    : copy
            )
        );

        setEditingCopy(null);
    };

    const getStatusStyle = (status) => {
        if (status === "Available") {
            return "bg-emerald-100 text-emerald-700";
        }

        if (status === "Borrowed") {
            return "bg-blue-100 text-blue-700";
        }

        if (status === "Reserved") {
            return "bg-amber-100 text-amber-700";
        }

        if (status === "Damaged") {
            return "bg-orange-100 text-orange-700";
        }

        return "bg-red-100 text-red-700";
    };

    return (
        <AdminLayout>
            {/* Header */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-sm font-semibold text-blue-700">
                        Library Inventory
                    </p>

                    <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
                        Book Copies Management
                    </h1>
                </div>

                <button
                    type="button"
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center justify-center gap-1 rounded-xl bg-[#0F4C97] px-3 py-2 font-semibold text-white transition hover:bg-blue-800"
                >
                    <FaPlus />
                    Add Book Copy
                </button>
            </div>

            {/* Toolbar */}
            <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                            <FaCopy />
                        </div>

                        <div>
                            <h2 className="font-bold text-slate-900">
                                Physical Book Copies
                            </h2>

                            <p className="text-sm text-slate-500">
                                {filteredCopies.length} copy
                                {filteredCopies.length !== 1 ? "ies" : "y"} found
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
                            <FaSearch className="text-slate-400" />

                            <input
                                type="text"
                                placeholder="Search barcode, accession no., or book..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 outline-none sm:w-72"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) =>
                                setStatusFilter(e.target.value)
                            }
                            className="rounded-xl border border-slate-300 px-4 py-2 outline-none focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="All">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Damaged">Damaged</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Table */}
            <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1000px]">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Barcode
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Book
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Accession No.
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Shelf
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Status
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredCopies.map((copy) => (
                                <tr
                                    key={copy.id}
                                    className="border-t border-slate-100 transition hover:bg-blue-50/40"
                                >
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2 font-semibold text-slate-900">
                                            <FaBarcode className="text-slate-400" />
                                            {copy.barcode}
                                        </div>
                                    </td>

                                    <td className="px-5 py-4">
                                        <p className="font-semibold text-slate-900">
                                            {copy.bookTitle}
                                        </p>
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {copy.accessionNumber}
                                    </td>

                                    <td className="px-5 py-4 text-sm text-slate-600">
                                        {copy.shelf}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                                copy.status
                                            )}`}
                                        >
                                            {copy.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingCopy({ ...copy })
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
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

            {filteredCopies.length === 0 && (
                <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
                    <FaCopy className="mx-auto text-3xl text-slate-300" />

                    <h2 className="mt-4 font-semibold text-slate-800">
                        No book copies found
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Try changing the search keyword or status filter.
                    </p>
                </div>
            )}

            {/* Add Modal */}
            {showAddModal && (
                <CopyModal
                    title="Add Book Copy"
                    data={newCopy}
                    setData={setNewCopy}
                    onCancel={() => setShowAddModal(false)}
                    onSave={handleAddCopy}
                    saveLabel="Save Copy"
                />
            )}

            {/* Edit Modal */}
            {editingCopy && (
                <CopyModal
                    title="Edit Book Copy"
                    data={editingCopy}
                    setData={setEditingCopy}
                    onCancel={() => setEditingCopy(null)}
                    onSave={handleUpdateCopy}
                    saveLabel="Update Copy"
                />
            )}
        </AdminLayout>
    );
}

function CopyModal({
    title,
    data,
    setData,
    onCancel,
    onSave,
    saveLabel,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">
                    <h2 className="text-xl font-bold">
                        {title}
                    </h2>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15"
                    >
                        ×
                    </button>
                </div>

                <div className="grid gap-5 p-6 md:grid-cols-2">
                    <CopyField
                        label="Barcode"
                        value={data.barcode}
                        onChange={(value) =>
                            setData({ ...data, barcode: value })
                        }
                    />

                    <CopyField
                        label="Accession Number"
                        value={data.accessionNumber}
                        onChange={(value) =>
                            setData({
                                ...data,
                                accessionNumber: value,
                            })
                        }
                    />

                    <CopyField
                        label="Book Title"
                        value={data.bookTitle}
                        onChange={(value) =>
                            setData({ ...data, bookTitle: value })
                        }
                    />

                    <CopyField
                        label="Shelf Location"
                        value={data.shelf}
                        onChange={(value) =>
                            setData({ ...data, shelf: value })
                        }
                    />

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-slate-700">
                            Status
                        </label>

                        <select
                            value={data.status}
                            onChange={(e) =>
                                setData({
                                    ...data,
                                    status: e.target.value,
                                })
                            }
                            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
                        >
                            <option value="Available">Available</option>
                            <option value="Borrowed">Borrowed</option>
                            <option value="Reserved">Reserved</option>
                            <option value="Lost">Lost</option>
                            <option value="Damaged">Damaged</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-5">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onSave}
                        className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800"
                    >
                        {saveLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CopyField({ label, value, onChange }) {
    return (
        <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
        </div>
    );
}

export default BookCopies;