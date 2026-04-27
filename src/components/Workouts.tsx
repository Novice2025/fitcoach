'use client'
import React, { useState, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL

const exercisesByGroup: Record<string, string[]> = {
  'Peito': [
    'Supino Reto', 'Supino Inclinado', 'Supino Declinado', 'Flexão de Braço',
    'Flexão Diamante', 'Flexão Inclinada', 'Crucifixo', 'Crucifixo Inclinado',
    'Cross Over', 'Peck Deck', 'Mergulho no Paralelo', 'Press no Cabo'
  ],
  'Costas': [
    'Barra Fixa', 'Barra Fixa Supinada', 'Levantamento Terra', 'Remada Curvada',
    'Remada Unilateral', 'Remada Sentada', 'Puxada Frontal', 'Puxada Aberta',
    'Remada T', 'Hiperextensão', 'Good Morning', 'Pull Over', 'Face Pull'
  ],
  'Pernas': [
    'Agachamento', 'Agachamento Frontal', 'Agachamento Sumô', 'Agachamento Búlgaro',
    'Leg Press', 'Leg Press 45°', 'Afundo', 'Avanço', 'Avanço com Halteres',
    'Cadeira Extensora', 'Mesa Flexora', 'Elevação de Panturrilha',
    'Panturrilha Sentado', 'Step', 'Hack Squat', 'Stiff', 'Hip Thrust',
    'Ponte de Glúteo', 'Agachamento Livre'
  ],
  'Ombros': [
    'Desenvolvimento com Barra', 'Desenvolvimento com Haltere', 'Press Arnold',
    'Elevação Lateral', 'Elevação Frontal', 'Elevação 90°', 'Encolhimento',
    'Remada Alta', 'Face Pull', 'Crucifixo Inverso', 'Rotação Externa'
  ],
  'Bíceps': [
    'Rosca Direta', 'Rosca Alternada', 'Rosca Martelo', 'Rosca Concentrada',
    'Rosca Scott', 'Rosca no Cabo', 'Rosca Inclinada', 'Rosca 21',
    'Rosca Inversa', 'Rosca Zottman'
  ],
  'Tríceps': [
    'Tríceps Mergulho', 'Tríceps Testa', 'Tríceps Pulley', 'Tríceps Corda',
    'Tríceps Coice', 'Supino Fechado', 'Extensão Testa com Haltere',
    'Tríceps Francês', 'Tríceps no Cabo', 'Dip na Máquina'
  ],
  'Core': [
    'Prancha', 'Prancha Lateral', 'Abdominal Crunch', 'Abdominal Bicicleta',
    'Elevação de Pernas', 'Elevação de Pernas na Barra', 'Torção Russa',
    'Roda Abdominal', 'Escalador', 'Dead Bug', 'Abdominal no Cabo',
    'Dragon Flag', 'Abdominal Oblíquo'
  ],
  'Glúteos / Posterior': [
    'Hip Thrust', 'Ponte de Glúteo', 'Coice no Cabo', 'Donkey Kick',
    'Stiff', 'Levantamento Terra Sumô', 'Abdução no Cabo', 'Agachamento Búlgaro',
    'Step Up', 'Hiperextensão Reversa', 'Caminhada com Band', 'Leg Press Sumô'
  ],
  'Cardio': [
    'Corrida', 'Esteira', 'Bicicleta', 'Bike Ergométrica', 'Corda',
    'Remo Ergométrico', 'Burpee', 'Polichinelo', 'Escada', 'Natação',
    'Elíptico', 'Sprint', 'Caminhada Inclinada', 'Battle Rope', 'Box Jump'
  ]
}

const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']

interface Workout {
  id: number
  student_name: string
  exercise: string
  sets: string
  reps: string
  day: string
}

interface Student {
  id: number
  name: string
}

export default function Workouts() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [form, setForm] = useState({
    student: '', exercise: '', sets: '', reps: '', day: ''
  })

  useEffect(() => {
    fetchWorkouts()
    fetchStudents()
  }, [])

  async function fetchWorkouts() {
    try {
      const res = await fetch(`${API}/workouts`)
      const data = await res.json()
      setWorkouts(data)
    } catch (e) {
      console.error('Erro ao buscar treinos', e)
    }
  }

  async function fetchStudents() {
    try {
      const res = await fetch(`${API}/students`)
      const data = await res.json()
      setStudents(data)
    } catch (e) {
      console.error('Erro ao buscar alunos', e)
    }
  }

  function openAdd() {
    setForm({ student: '', exercise: '', sets: '', reps: '', day: '' })
    setSelectedGroup('')
    setEditingId(null)
    setShowModal(true)
  }

  function openEdit(w: Workout) {
    setForm({ student: w.student_name, exercise: w.exercise, sets: w.sets, reps: w.reps, day: w.day })
    setEditingId(w.id)
    setShowModal(true)
  }

  async function handleSave() {
    if (!form.student || !form.exercise || !form.sets || !form.reps || !form.day) return
    if (editingId !== null) {
      await fetch(`${API}/workouts/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    } else {
      await fetch(`${API}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setShowModal(false)
    setEditingId(null)
    setSelectedGroup('')
    fetchWorkouts()
  }

  async function handleDelete(id: number) {
    await fetch(`${API}/workouts/${id}`, { method: 'DELETE' })
    fetchWorkouts()
  }

  const filtered = workouts.filter(w =>
    w.student_name?.toLowerCase().includes(search.toLowerCase()) ||
    w.exercise?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">💪 Treinos</h2>
        <button onClick={openAdd} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
          + Adicionar Treino
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por aluno ou exercício..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full mb-4 bg-zinc-800 text-white rounded-lg px-4 py-2 text-sm outline-none border border-zinc-700"
      />

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Aluno</th>
            <th className="text-left pb-3">Exercício</th>
            <th className="text-left pb-3">Séries</th>
            <th className="text-left pb-3">Reps</th>
            <th className="text-left pb-3">Dia</th>
            <th className="text-left pb-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(w => (
            <tr key={w.id} className="border-t border-zinc-800">
              <td className="py-3">{w.student_name}</td>
              <td>{w.exercise}</td>
              <td>{w.sets}</td>
              <td>{w.reps}</td>
              <td>{w.day}</td>
              <td className="flex gap-2 py-3">
                <button onClick={() => openEdit(w)} className="bg-zinc-700 hover:bg-zinc-600 text-white px-3 py-1 rounded text-xs">Editar</button>
                <button onClick={() => handleDelete(w.id)} className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-xs">Excluir</button>
              </td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={6} className="text-zinc-500 py-6 text-center">Nenhum treino encontrado.</td></tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-md">
            <h3 className="text-white text-xl font-bold mb-6">{editingId ? 'Editar Treino' : 'Adicionar Treino'}</h3>
            <div className="space-y-4">

              <select
                value={form.student}
                onChange={e => setForm({ ...form, student: e.target.value })}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
              >
                <option value="">Selecionar Aluno</option>
                {students.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>

              <select
                value={selectedGroup}
                onChange={e => { setSelectedGroup(e.target.value); setForm({ ...form, exercise: '' }) }}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
              >
                <option value="">Selecionar Grupo Muscular</option>
                {Object.keys(exercisesByGroup).map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>

              <select
                value={form.exercise}
                onChange={e => setForm({ ...form, exercise: e.target.value })}
                disabled={!selectedGroup}
                className="w-full bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700 disabled:opacity-40"
              >
                <option value="">Selecionar Exercício</option>
                {selectedGroup && exercisesByGroup[selectedGroup].map(ex => (
                  <option key={ex} value={ex}>{ex}</option>
                ))}
              </select>

              <div className="grid grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Séries"
                  value={form.sets}
                  onChange={e => setForm({ ...form, sets: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
                />
                <input
                  type="text"
                  placeholder="Reps"
                  value={form.reps}
                  onChange={e => setForm({ ...form, reps: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
                />
                <select
                  value={form.day}
                  onChange={e => setForm({ ...form, day: e.target.value })}
                  className="bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none border border-zinc-700"
                >
                  <option value="">Dia</option>
                  {days.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

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