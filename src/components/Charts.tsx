'use client'
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const API = process.env.NEXT_PUBLIC_API_URL
const COLORS = ['#22c55e', '#facc15', '#ef4444', '#60a5fa', '#a78bfa']

export default function Charts() {
  const [students, setStudents] = useState<{name: string, status: string, goal: string}[]>([])
  const [payments, setPayments] = useState<{amount: string, status: string, date: string}[]>([])

  useEffect(() => {
    fetch(`${API}/students`).then(r => r.json()).then(setStudents).catch(console.error)
    fetch(`${API}/payments`).then(r => r.json()).then(setPayments).catch(console.error)
  }, [])

  const activeCount = students.filter(s => s.status === 'Ativo').length
  const inactiveCount = students.filter(s => s.status === 'Inativo').length

  const statusData = [
    { name: 'Ativos', value: activeCount },
    { name: 'Inativos', value: inactiveCount }
  ]

  const goalMap: Record<string, number> = {}
  students.forEach(s => {
    if (s.goal) goalMap[s.goal] = (goalMap[s.goal] || 0) + 1
  })
  const goalData = Object.entries(goalMap).map(([name, value]) => ({ name, value }))

  const revenueMap: Record<string, number> = {}
  payments.forEach(p => {
    if (p.status === 'Pago' && p.date) {
      const month = p.date.substring(0, 7)
      const amount = parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0
      revenueMap[month] = (revenueMap[month] || 0) + amount
    }
  })
  const revenueData = Object.entries(revenueMap).sort().map(([name, total]) => ({ name, total }))

  const paidCount = payments.filter(p => p.status === 'Pago').length
  const pendingCount = payments.filter(p => p.status === 'Pendente').length
  const overdueCount = payments.filter(p => p.status === 'Atrasado').length
  const totalRevenue = payments
    .filter(p => p.status === 'Pago')
    .reduce((sum, p) => sum + (parseFloat(p.amount.replace(/[^0-9.]/g, '')) || 0), 0)

  return (
    <div className="mt-6 space-y-6">

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-900 rounded-2xl p-4 text-white text-center">
          <p className="text-zinc-400 text-sm">Total Alunos</p>
          <p className="text-3xl font-bold text-green-400">{students.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-white text-center">
          <p className="text-zinc-400 text-sm">Alunos Ativos</p>
          <p className="text-3xl font-bold text-blue-400">{activeCount}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-white text-center">
          <p className="text-zinc-400 text-sm">Pagamentos Recebidos</p>
          <p className="text-3xl font-bold text-yellow-400">{paidCount}</p>
        </div>
        <div className="bg-zinc-900 rounded-2xl p-4 text-white text-center">
          <p className="text-zinc-400 text-sm">Receita Total</p>
          <p className="text-3xl font-bold text-green-400">R${totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-bold mb-4">📊 Receita por Mês</h2>
        {revenueData.length === 0 ? (
          <p className="text-zinc-500 text-center py-10">Sem dados de pagamentos ainda.</p>
        ) : (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueData}>
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip />
                <Bar dataKey="total" fill="#22c55e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-4">👥 Status dos Alunos</h2>
          {students.length === 0 ? (
            <p className="text-zinc-500 text-center py-10">Sem alunos cadastrados ainda.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {statusData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
          <h2 className="text-xl font-bold mb-4">🎯 Objetivos dos Alunos</h2>
          {goalData.length === 0 ? (
            <p className="text-zinc-500 text-center py-10">Sem dados de objetivos ainda.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goalData} layout="vertical">
                  <XAxis type="number" stroke="#888" />
                  <YAxis type="category" dataKey="name" stroke="#888" width={120} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#60a5fa" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
        <h2 className="text-xl font-bold mb-4">💳 Resumo de Pagamentos</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-zinc-400 text-sm">Pagos</p>
            <p className="text-2xl font-bold text-green-400">{paidCount}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-400">{pendingCount}</p>
          </div>
          <div>
            <p className="text-zinc-400 text-sm">Atrasados</p>
            <p className="text-2xl font-bold text-red-400">{overdueCount}</p>
          </div>
        </div>
      </div>

    </div>
  )
}