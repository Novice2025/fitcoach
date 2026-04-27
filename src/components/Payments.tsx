'use client'
import React, { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

interface Payment {
  id: number
  student: string
  amount: string
  date: string
  status: string
}

interface Student {
  id: number
  name: string
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ student: '', amount: '', date: '', status: 'Pago' })

  useEffect(() => {
    fetchPayments()
    fetchStudents()
  }, [])

  async function fetchPayments() {
    try {
      const res = await fetch(`${API}/payments`)
      const data = await res.json()
      setPayments(data)
    } catch (e) { console.error('Erro ao buscar pagamentos', e) }
  }

  async function fetchStudents() {
    try {
      const res = await fetch(`${API}/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) { console.error('Erro ao buscar alunos', e) }
  }

  function openAdd() {
    setForm({ student: '', amount: '', date: '', status: 'Pago' })
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(p: Payment) {
    setForm({ student: p.student, amount: p.amount, date: p.date, status: p.status })
    setEditingId(p.id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.student.trim()) return
    if (editingId !== null) {
      await fetch(`${API}/payments/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(`${API}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setShowModal(false)
    fetchPayments()
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/payments/${id}`, { method: 'DELETE' })
    fetchPayments()
  }

  const statusColor = (s: string) => {
    if (s === 'Pago') return 'text-green-400'
    if (s === 'Pendente') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">💳 Pagamentos</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Adicionar Pagamento
        </button>
      </div>

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Aluno</th>
            <th className="text-left pb-3">Valor</th>
            <th className="text-left pb-3">Data</th>
            <th className="text-left pb-3">Status</th>
            <th className="text-left pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {payments.map(p => (
            <tr key={p.id} className="border-t border-zinc-800">
              <td className="py-3">{p.student}</td>
              <td>{p.amount}</td>
              <td>{p.date}</td>
              <td className={statusColor(p.status)}>{p.status}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(p)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Editar</button>
                <button onClick={() => handleDelete(p.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Excluir</button>
              </td>
            </tr>
          ))}
          {payments.length === 0 && (
            <tr><td colSpan={5} className="text-zinc-500 py-6 text-center">Nenhum pagamento encontrado.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? 'Editar Pagamento' : 'Adicionar Pagamento'}</h3>
            <div className="space-y-4">
              <select value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700">
                <option value="">Selecionar Aluno</option>
                {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <input type="text" placeholder="Valor (ex: R$120)" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700">
                <option value="Pago">Pago</option>
                <option value="Pendente">Pendente</option>
                <option value="Atrasado">Atrasado</option>
              </select>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold">Salvar</button>
              <button onClick={() => setShowModal(false)} className="flex-1 bg-zinc-700 hover:bg-zinc-600 text-white py-2 rounded-lg">Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}