"use client";

import { useState } from "react";

interface ClassItem {
  id: number;
  title: string;
  student: string;
  date: string;
  time: string;
  location: string;
}

export default function Schedule() {
  const [classes, setClasses] = useState<ClassItem[]>([
    { id: 1, title: "Personal Training", student: "Maria Silva", date: "2026-04-28", time: "08:00", location: "Gym A" },
    { id: 2, title: "Cardio Session", student: "João Pereira", date: "2026-04-29", time: "10:00", location: "Gym B" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", student: "", date: "", time: "", location: "" });

  function openAdd() {
    setForm({ title: "", student: "", date: "", time: "", location: "" });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(c: ClassItem) {
    setForm({ title: c.title, student: c.student, date: c.date, time: c.time, location: c.location });
    setEditingId(c.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.title.trim()) return;
    if (editingId !== null) {
      setClasses(classes.map((c) => c.id === editingId ? { ...c, ...form } : c));
    } else {
      setClasses([...classes, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setClasses(classes.filter((c) => c.id !== id));
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">📅 Schedule</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Class
        </button>
      </div>

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Title</th>
            <th className="text-left pb-3">Student</th>
            <th className="text-left pb-3">Date</th>
            <th className="text-left pb-3">Time</th>
            <th className="text-left pb-3">Location</th>
            <th className="text-left pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id} className="border-t border-zinc-800">
              <td className="py-3">{c.title}</td>
              <td>{c.student}</td>
              <td>{c.date}</td>
              <td>{c.time}</td>
              <td>{c.location}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(c)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                <button onClick={() => handleDelete(c.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? "Edit Class" : "Add Class"}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Class Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Student Name" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">Save</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
