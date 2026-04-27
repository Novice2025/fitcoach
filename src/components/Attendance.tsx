'use client'
import React from 'react'

export default function Attendance() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 text-white">
      <h2 className="text-xl font-bold mb-4">
        Attendance
      </h2>

      <table className="w-full">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Student</th>
            <th className="text-left pb-3">Presence</th>
            <th className="text-left pb-3">Reason</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-zinc-800">
            <td className="py-3">Maria Silva</td>
            <td>Present</td>
            <td>-</td>
          </tr>

          <tr className="border-t border-zinc-800">
            <td className="py-3">João Pereira</td>
            <td>Absent</td>
            <td>Sick</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}