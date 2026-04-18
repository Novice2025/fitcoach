"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", progress: 4 },
  { name: "Feb", progress: 6 },
  { name: "Mar", progress: 8 },
  { name: "Apr", progress: 10 },
];

export default function Charts() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 text-white shadow-xl">
      <h2 className="text-xl font-bold mb-4">
        Student Progress
      </h2>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" stroke="#888" />
            <YAxis stroke="#888" />
            <Tooltip />
            <Bar dataKey="progress" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
