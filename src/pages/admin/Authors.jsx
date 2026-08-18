import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaUserEdit,
  FaPlus,
  FaSearch,
  FaEdit,
  FaTimes,
} from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";
import apiRequest from "../../services/api";
import { useToast } from "../../context/ToastContext";

function Authors() {
  const { showToast } = useToast();

  const [authors, setAuthors] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [showAddModal, setShowAddModal] =
    useState(false);

  const [editingAuthor, setEditingAuthor] =
    useState(null);

  const [form, setForm] =
    useState({
      firstName: "",
      middleName: "",
      lastName: "",
      isActive: true,
    });

  const loadAuthors = async () => {
    try {
      setLoading(true);
      setError("");

      const response =
        await apiRequest(
          "/authors"
        );

      setAuthors(
        response?.data || []
      );
    } catch (err) {
      setError(
        err.message ||
          "Failed to load authors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const getFullName = (
    author
  ) => {
    return [
      author.first_name ??
        author.firstName,
      author.middle_name ??
        author.middleName,
      author.last_name ??
        author.lastName,
    ]
      .filter(Boolean)
      .join(" ");
  };

  const filteredAuthors =
    useMemo(() => {
      const keyword =
        search
          .trim()
          .toLowerCase();

      if (!keyword) {
        return authors;
      }

      return authors.filter(
        (author) =>
          getFullName(author)
            .toLowerCase()
            .includes(keyword)
      );
    }, [
      authors,
      search,
    ]);

  const resetForm = () => {
    setForm({
      firstName: "",
      middleName: "",
      lastName: "",
      isActive: true,
    });
  };

  const openAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const openEditModal = (
    author
  ) => {
    setEditingAuthor(
      author
    );

    setForm({
      firstName:
        author.first_name ??
        author.firstName ??
        "",

      middleName:
        author.middle_name ??
        author.middleName ??
        "",

      lastName:
        author.last_name ??
        author.lastName ??
        "",

      isActive:
        author.is_active !==
        false,
    });
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setShowAddModal(false);
    setEditingAuthor(null);
    resetForm();
  };

  const handleCreate = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      showToast(
        "First name and last name are required.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        "/authors",
        {
          method: "POST",

          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            middleName:
              form.middleName.trim() ||
              null,

            lastName:
              form.lastName.trim(),
          }),
        }
      );

      showToast(
        "Author created successfully!",
        "success"
      );

      closeModal();

      await loadAuthors();
    } catch (err) {
      const message =
        err.message ||
        "Failed to create author.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.firstName.trim() ||
      !form.lastName.trim()
    ) {
      showToast(
        "First name and last name are required.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);
      setError("");

      await apiRequest(
        `/authors/${editingAuthor.id}`,
        {
          method: "PATCH",

          body: JSON.stringify({
            firstName:
              form.firstName.trim(),

            middleName:
              form.middleName.trim() ||
              null,

            lastName:
              form.lastName.trim(),

            isActive:
              form.isActive,
          }),
        }
      );

      showToast(
        "Author updated successfully!",
        "success"
      );

      closeModal();

      await loadAuthors();
    } catch (err) {
      const message =
        err.message ||
        "Failed to update author.";

      setError(message);

      showToast(
        message,
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <p className="text-sm font-semibold text-blue-700">
            Catalog Information
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            Author Management
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Manage authors associated with books in the library catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openAddModal
          }
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-4 py-2.5 font-semibold text-white transition hover:bg-blue-800"
        >
          <FaPlus />
          Add Author
        </button>

      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* TOOLBAR */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              <FaUserEdit />
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                Author Records
              </h2>

              <p className="text-sm text-slate-500">
                {loading
                  ? "Loading..."
                  : `${filteredAuthors.length} record${
                      filteredAuthors.length !==
                      1
                        ? "s"
                        : ""
                    } found`}
              </p>
            </div>

          </div>

          <div className="flex items-center rounded-xl border border-slate-300 px-3 transition focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">

            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder="Search author..."
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event.target
                    .value
                )
              }
              className="w-full px-3 py-2 outline-none sm:w-72"
            />

          </div>

        </div>

      </section>

      {/* TABLE */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[720px]">

            <thead className="bg-slate-50">
              <tr>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Author
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

              {!loading &&
                filteredAuthors.map(
                  (author) => (
                    <tr
                      key={
                        author.id
                      }
                      className="border-t border-slate-100 transition hover:bg-blue-50/40"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {[
                              author.first_name ??
                                author.firstName,
                              author.last_name ??
                                author.lastName,
                            ]
                              .filter(Boolean)
                              .map(
                                (
                                  name
                                ) =>
                                  name[0]
                              )
                              .join("")
                              .toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-slate-900">
                              {getFullName(
                                author
                              )}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              Catalog author
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            author.is_active ===
                            false
                              ? "bg-slate-100 text-slate-600"
                              : "bg-emerald-100 text-emerald-700"
                          }`}
                        >
                          {author.is_active ===
                          false
                            ? "Inactive"
                            : "Active"}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(
                              author
                            )
                          }
                          className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                        >
                          <FaEdit />
                          Edit
                        </button>

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

        </div>

        {loading && (
          <div className="px-6 py-14 text-center text-sm text-slate-400">
            Loading authors...
          </div>
        )}

        {!loading &&
          filteredAuthors.length ===
            0 && (
            <div className="px-6 py-14 text-center">

              <FaUserEdit className="mx-auto text-3xl text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-800">
                No authors found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try changing the search keyword.
              </p>

            </div>
          )}

      </section>

      {showAddModal && (
        <AuthorModal
          title="Add Author"
          form={form}
          setForm={
            setForm
          }
          saving={
            saving
          }
          onCancel={
            closeModal
          }
          onSubmit={
            handleCreate
          }
          showStatus={
            false
          }
          submitLabel="Save Author"
        />
      )}

      {editingAuthor && (
        <AuthorModal
          title="Edit Author"
          form={form}
          setForm={
            setForm
          }
          saving={
            saving
          }
          onCancel={
            closeModal
          }
          onSubmit={
            handleUpdate
          }
          showStatus
          submitLabel="Update Author"
        />
      )}

    </AdminLayout>
  );
}

function AuthorModal({
  title,
  form,
  setForm,
  saving,
  onCancel,
  onSubmit,
  showStatus,
  submitLabel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">

      <form
        onSubmit={
          onSubmit
        }
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
      >

        <div className="flex items-center justify-between bg-gradient-to-r from-[#0F4C97] to-blue-700 px-6 py-5 text-white">

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">
              Catalog Information
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {title}
            </h2>
          </div>

          <button
            type="button"
            disabled={
              saving
            }
            onClick={
              onCancel
            }
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-white/15 disabled:opacity-50"
          >
            <FaTimes />
          </button>

        </div>

        <div className="space-y-5 p-6">

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              First Name *
            </label>

            <input
              type="text"
              value={
                form.firstName
              }
              onChange={(
                event
              ) =>
                setForm({
                  ...form,
                  firstName:
                    event.target
                      .value,
                })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Middle Name
            </label>

            <input
              type="text"
              value={
                form.middleName
              }
              onChange={(
                event
              ) =>
                setForm({
                  ...form,
                  middleName:
                    event.target
                      .value,
                })
              }
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Last Name *
            </label>

            <input
              type="text"
              value={
                form.lastName
              }
              onChange={(
                event
              ) =>
                setForm({
                  ...form,
                  lastName:
                    event.target
                      .value,
                })
              }
              required
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
            />
          </div>

          {showStatus && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Status
              </label>

              <select
                value={
                  form.isActive
                    ? "active"
                    : "inactive"
                }
                onChange={(
                  event
                ) =>
                  setForm({
                    ...form,
                    isActive:
                      event.target
                        .value ===
                      "active",
                  })
                }
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">

            <button
              type="button"
              disabled={
                saving
              }
              onClick={
                onCancel
              }
              className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                saving
              }
              className="rounded-xl bg-[#0F4C97] px-5 py-3 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : submitLabel}
            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default Authors;