'use client'
import React, { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

interface ClassItem {
  id: number
  title: string
  student: string
  date: string
  time: string
  location: string
}

interface Student {
  id: number
  name: string
}

export default function Schedule() {
  const [classes, setClasses] = useState<ClassItem[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', student: '', date: '', time: '', location: '' })

  useEffect(() => {
    fetchClasses()
    fetchStudents()
  }, [])

  async function fetchClasses() {
    try {
      const res = await fetch(`${API}/schedules`)
      const data = await res.json()
      setClasses(data)
    } catch (e) { console.error('Erro ao buscar agenda', e) }
  }

  async function fetchStudents() {
    try {
      const res = await fetch(`${API}/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) { console.error('Erro ao buscar alunos', e) }
  }

  function openAdd() {
    setForm({ title: '', student: '', date: '', time: '', location: '' })
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(c: ClassItem) {
    setForm({ title: c.title, student: c.student, date: c.date, time: c.time, location: c.location })
    setEditingId(c.id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.title.trim()) return
    if (editingId !== null) {
      await fetch(`${API}/schedules/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(`${API}/schedules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setShowModal(false)
    fetchClasses()
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/schedules/${id}`, { method: 'DELETE' })
    fetchClasses()
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">📅 Agenda</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Adicionar Aula
        </button>
      </div>

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Título</th>
            <th className="text-left pb-3">Aluno</th>
            <th className="text-left pb-3">Data</th>
            <th className="text-left pb-3">Hora</th>
            <th className="text-left pb-3">Local</th>
            <th className="text-left pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {classes.map(c => (
            <tr key={c.id} className="border-t border-zinc-800">
              <td className="py-3">{c.title}</td>
              <td>{c.student}</td>
              <td>{c.date}</td>
              <td>{c.time}</td>
              <td>{c.location}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(c)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Editar</button>
                <button onClick={() => handleDelete(c.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Excluir</button>
              </td>
            </tr>
          ))}
          {classes.length === 0 && (
            <tr><td colSpan={6} className="text-zinc-500 py-6 text-center">Nenhuma aula encontrada.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? 'Editar Aula' : 'Adicionar Aula'}</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Título da Aula" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <select value={form.student} onChange={e => setForm({ ...form, student: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700">
                <option value="">Selecionar Aluno</option>
                {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
              <input type="text" placeholder="Local (ex: Academia A)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700" />
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