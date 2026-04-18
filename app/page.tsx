"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Menu } from "lucide-react";

import Sidebar from "@/src/components/Sidebar";
import StudentsTable from "@/src/components/StudentsTable";
import Attendance from "@/src/components/Attendance";

const Charts = dynamic(() => import("@/src/components/Charts"), {
  ssr: false,
});

export default function Home() {
  const [open, setOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black flex">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden bg-black">
          <Sidebar />
          <button
            onClick={() => setOpen(false)}
            className="text-white p-4"
          >
            Close
          </button>
        </div>
      )}

      <section className="flex-1 p-4 md:p-8">

        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Dashboard
            </h1>
            <p className="text-zinc-400">
              Neuli Fitness Coach
            </p>
          </div>

          <button
            onClick={() => setOpen(true)}
            className="md:hidden text-white"
          >
            <Menu size={30} />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-zinc-400">Students</p>
            <h2 className="text-3xl font-bold">12</h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-zinc-400">Revenue</p>
            <h2 className="text-3xl font-bold">$2400</h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-zinc-400">Classes</p>
            <h2 className="text-3xl font-bold">24</h2>
          </div>

          <div className="bg-zinc-900 rounded-2xl p-6 text-white shadow-xl">
            <p className="text-zinc-400">Active</p>
            <h2 className="text-3xl font-bold">9</h2>
          </div>

        </div>

        <StudentsTable />
        <Attendance />
        <Charts />

      </section>
    </main>
  );
}
