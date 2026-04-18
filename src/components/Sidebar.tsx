export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-950 text-white p-6 border-r border-zinc-800">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">
        Neuli Fitness Coach
      </h1>

      <nav className="space-y-4 text-zinc-300">
        <p className="hover:text-white cursor-pointer">👤 Students</p>
        <p className="hover:text-white cursor-pointer">💪 Workouts</p>
        <p className="hover:text-white cursor-pointer">💳 Payments</p>
        <p className="hover:text-white cursor-pointer">📅 Schedule</p>
        <p className="hover:text-white cursor-pointer">📊 Analytics</p>
        <p className="hover:text-white cursor-pointer">⚙️ Settings</p>
      </nav>
    </aside>
  );
}