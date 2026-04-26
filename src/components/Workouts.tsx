"use client";

import { useState } from "react";

interface Workout {
  id: number;
  student: string;
  exercise: string;
  sets: string;
  reps: string;
  day: string;
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([
    { id: 1, student: "Maria Silva", exercise: "Squat", sets: "4", reps: "12", day: "Monday" },
    { id: 2, student: "João Pereira", exercise: "Bench Press", sets: "3", reps: "10", day: "Wednesday" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ student: "", exercise: "", sets: "", reps: "", day: "" });

  const filtered = workouts.filter((w) =>
    w.student.toLowerCase().includes(search.toLowerCase()) ||
    w.exercise.toLowerCase().includes(search.toLowerCase())
  );

  function openAdd() {
    setForm({ student: "", exercise: "", sets: "", reps: "", day: "" });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(w: Workout) {
    setForm({ student: w.student, exercise: w.exercise, sets: w.sets, reps: w.reps, day: w.day });
    setEditingId(w.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.student.trim() || !form.exercise.trim()) return;
    if (editingId !== null) {
      setWorkouts(workouts.map((w) => w.id === editingId ? { ...w, ...form } : w));
    } else {
      setWorkouts([...workouts, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setWorkouts(workouts.filter((w) => w.id !== id));
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">💪 Workouts</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Workout
        </button>
      </div>

      <input
        type="text"
        placeholder="Search by student or exercise..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-4 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none border border-zinc-700"
      />

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Student</th>
            <th className="text-left pb-3">Exercise</th>
            <th className="text-left pb-3">Sets</th>
            <th className="text-left pb-3">Reps</th>
            <th className="text-left pb-3">Day</th>
            <th className="text-left pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((w) => (
            <tr key={w.id} className="border-t border-zinc-800">
              <td className="py-3">{w.student}</td>
              <td>{w.exercise}</td>
              <td>{w.sets}</td>
              <td>{w.reps}</td>
              <td>{w.day}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(w)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                <button onClick={() => handleDelete(w.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="text-zinc-500 py-6 text-center">No workouts found.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? "Edit Workout" : "Add Workout"}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Student Name" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Exercise" value={form.exercise} onChange={(e) => setForm({ ...form, exercise: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Sets" value={form.sets} onChange={(e) => setForm({ ...form, sets: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Reps" value={form.reps} onChange={(e) => setForm({ ...form, reps: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Day (e.g. Monday)" value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
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
}≈
