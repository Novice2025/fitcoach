"use client";

import { useState } from "react";

interface Payment {
  id: number;
  student: string;
  amount: string;
  date: string;
  status: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([
    { id: 1, student: "Maria Silva", amount: "$120", date: "2026-04-01", status: "Paid" },
    { id: 2, student: "João Pereira", amount: "$120", date: "2026-04-01", status: "Pending" },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ student: "", amount: "", date: "", status: "Paid" });

  function openAdd() {
    setForm({ student: "", amount: "", date: "", status: "Paid" });
    setEditingId(null);
    setShowModal(true);
  }

  function openEdit(p: Payment) {
    setForm({ student: p.student, amount: p.amount, date: p.date, status: p.status });
    setEditingId(p.id);
    setShowModal(true);
  }

  function handleSave() {
    if (!form.student.trim()) return;
    if (editingId !== null) {
      setPayments(payments.map((p) => p.id === editingId ? { ...p, ...form } : p));
    } else {
      setPayments([...payments, { id: Date.now(), ...form }]);
    }
    setShowModal(false);
  }

  function handleDelete(id: number) {
    setPayments(payments.filter((p) => p.id !== id));
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">💳 Payments</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Add Payment
        </button>
      </div>

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Student</th>
            <th className="text-left pb-3">Amount</th>
            <th className="text-left pb-3">Date</th>
            <th className="text-left pb-3">Status</th>
            <th className="text-left pb-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t border-zinc-800">
              <td className="py-3">{p.student}</td>
              <td>{p.amount}</td>
              <td>{p.date}</td>
              <td className={p.status === "Paid" ? "text-green-400" : "text-yellow-400"}>{p.status}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(p)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Edit</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? "Edit Payment" : "Add Payment"}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Student Name" value={form.student} onChange={(e) => setForm({ ...form, student: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Amount (e.g. $120)" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700">
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Overdue">Overdue</option>
              </select>
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
