import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-950 text-white p-6 border-r border-zinc-800">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">
        Neuli Fitness Coach
      </h1>

      <nav className="space-y-4 text-zinc-300">
        <Link href="/dashboard/students" className="block hover:text-white cursor-pointer">👤 Students</Link>
        <Link href="/dashboard/workouts" className="block hover:text-white cursor-pointer">💪 Workouts</Link>
        <Link href="/dashboard/payments" className="block hover:text-white cursor-pointer">💳 Payments</Link>
        <Link href="/dashboard/schedule" className="block hover:text-white cursor-pointer">📅 Schedule</Link>
        <Link href="/dashboard/analytics" className="block hover:text-white cursor-pointer">📊 Analytics</Link>
        <Link href="/dashboard" className="block hover:text-white cursor-pointer">⚙️ Settings</Link>
      </nav>
    </aside>
  );
}
