import { useState } from "react";
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

function MasterDataManager({
  title,
  subtitle,
  sectionLabel,
  itemLabel,
  icon,
  initialItems,
}) {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newName, setNewName] = useState("");

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newName.trim()) {
      alert(`Please enter a ${itemLabel.toLowerCase()} name.`);
      return;
    }

    setItems([
      ...items,
      {
        id: Date.now(),
        name: newName.trim(),
        bookCount: 0,
      },
    ]);

    setNewName("");
    setShowAddModal(false);
  };

  const handleUpdate = () => {
    if (!editingItem.name.trim()) {
      alert(`Please enter a ${itemLabel.toLowerCase()} name.`);
      return;
    }

    setItems(
      items.map((item) =>
        item.id === editingItem.id
          ? editingItem
          : item
      )
    );

    setEditingItem(null);
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${itemLabel.toLowerCase()}?`
    );

    if (!confirmed) return;

    setItems(
      items.filter((item) => item.id !== id)
    );
  };

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-blue-700">
            {sectionLabel}
          </p>

          <h1 className="mt-1 text-2xl font-bold text-slate-900 sm:text-3xl">
            {title}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#0F4C97] px-3 py-2 font-semibold text-white transition hover:bg-blue-800"
        >
          <FaPlus />
          Add {itemLabel}
        </button>
      </div>

      {/* Toolbar */}
      <section className="mb-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
              {icon}
            </div>

            <div>
              <h2 className="font-bold text-slate-900">
                {itemLabel} Records
              </h2>

              <p className="text-sm text-slate-500">
                {filteredItems.length} record
                {filteredItems.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex items-center rounded-xl border border-slate-300 px-3 focus-within:border-blue-700 focus-within:ring-4 focus-within:ring-blue-100">
            <FaSearch className="text-slate-400" />

            <input
              type="text"
              placeholder={`Search ${itemLabel.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 outline-none sm:w-72"
            />
          </div>
        </div>
      </section>

      {/* Table */}
      <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  {itemLabel} Name
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Books Count
                </th>

                <th className="px-5 py-4 text-left text-sm font-semibold text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-slate-100 transition hover:bg-blue-50/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {item.name}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {item.bookCount}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingItem({ ...item })
                        }
                        className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
                      >
                        <FaEdit />
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {filteredItems.length === 0 && (
        <div className="mt-6 rounded-2xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            {icon}
          </div>

          <h2 className="mt-4 font-semibold text-slate-800">
            No records found
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Try changing the search keyword.
          </p>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <NameModal
          title={`Add ${itemLabel}`}
          value={newName}
          setValue={setNewName}
          onCancel={() => setShowAddModal(false)}
          onSave={handleAdd}
          saveLabel={`Save ${itemLabel}`}
        />
      )}

      {/* Edit Modal */}
      {editingItem && (
        <NameModal
          title={`Edit ${itemLabel}`}
          value={editingItem.name}
          setValue={(value) =>
            setEditingItem({
              ...editingItem,
              name: value,
            })
          }
          onCancel={() => setEditingItem(null)}
          onSave={handleUpdate}
          saveLabel={`Update ${itemLabel}`}
        />
      )}
    </>
  );
}

function NameModal({
  title,
  value,
  setValue,
  onCancel,
  onSave,
  saveLabel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
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

        <div className="p-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Name
          </label>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />

          <div className="mt-6 flex justify-end gap-3">
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
    </div>
  );
}

export default MasterDataManager;