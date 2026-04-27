'use client'
import React, { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

interface Student {
  id: number
  name: string
  goal: string
  status: string
  phone: string
  email: string
}

export default function StudentsTable() {
  const [students, setStudents] = useState<Student[]>([])
  const [showModal, setShowModal] = useState(false)
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ name: '', goal: '', status: 'Ativo', phone: '', email: '' })

  useEffect(() => { fetchStudents() }, [])

  async function fetchStudents() {
    try {
      const res = await fetch(`${API}/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) { console.error('Erro ao buscar alunos', e) }
  }

  function openAdd() {
    setForm({ name: '', goal: '', status: 'Ativo', phone: '', email: '' })
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(s: Student) {
    setForm({ name: s.name, goal: s.goal, status: s.status, phone: s.phone || '', email: s.email || '' })
    setEditingId(s.id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.name.trim()) return
    if (editingId !== null) {
      await fetch(`${API}/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(`${API}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setShowModal(false)
    fetchStudents()
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/students/${id}`, { method: 'DELETE' })
    fetchStudents()
  }

  const filtered = students.filter(s =>
    s.name?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">🎓 Alunos</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Adicionar Aluno
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar aluno..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none border border-zinc-700"
      />

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Nome</th>
            <th className="text-left pb-3">Objetivo</th>
            <th className="text-left pb-3">Telefone</th>
            <th className="text-left pb-3">Email</th>
            <th className="text-left pb-3">Status</th>
            <th className="text-left pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.id} className="border-t border-zinc-800">
              <td className="py-3">{s.name}</td>
              <td>{s.goal}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
              <td className={s.status === 'Ativo' ? 'text-green-400' : 'text-red-400'}>{s.status}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(s)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Editar</button>
                <button onClick={() => handleDelete(s.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Excluir</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="text-zinc-500 py-6 text-center">Nenhum aluno encontrado.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? 'Editar Aluno' : 'Adicionar Aluno'}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Objetivo (ex: Perda de Peso)" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Telefone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700">
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
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