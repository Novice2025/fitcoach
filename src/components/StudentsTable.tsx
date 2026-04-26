"use client";

import { useState } from "react";

interface Student {
  id: number;
  name: string;
  goal: string;
  status: string;
}

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Maria Silva", goal: "Weight Loss", status: "Active" },
    { id: 2, name: "João Pereira", goal: "Muscle Gain", status: "Active" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", goal: "", status: "Active" });

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ name: "", goal: "", status: "Active" });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(student: Student) {
    setForm({ name: student.name, goal: student.goal, status: student.status });
    setEditingId(student.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.name.trim()) return;
    if (editingId !== null) {
      setStudents(students.map((s) =>
        s.id === editingId ? { ...s, ...form } : s
      ));
    } else {
      setStudents([...students, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setStudents(students.filter((s) => s.id !== id));
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Students</h2>
        <button
          onClick={openAdd}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          + Add Student
        </button>
      </div>

      <input
        type="text"
        placeholder="Search students..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none border border-zinc-700"
      />

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Name</th>
            <th className="text-left pb-3">Goal</th>
            <th className="text-left pb-3">Status</th>
            <th className="text-left pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((s) => (
            <tr key={s.id} className="border-t border-zinc-800">
              <td className="py-3">{s.name}</td>
              <td>{s.goal}</td>
              <td className={s.status === "Active" ? "text-green-400" : "text-red-400"}>
                {s.status}
              </td>
              <td className="flex gap-2 py-3">
                <button
                  onClick={() => openEdit(s)}
                  className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr>
              <td colSpan={4} className="text-zinc-500 py-6 text-center">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">
              {editingId ? "Edit Student" : "Add Student"}
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
              />
              <input
                type="text"
                placeholder="Goal (e.g. Weight Loss)"
                value={form.goal}
                onChange={(e) => setForm({ ...form, goal: e.target.value })}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
              >
                Save
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
