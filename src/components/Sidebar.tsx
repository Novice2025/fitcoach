interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const items = [
    { label: '👤 Students', key: 'students' },
    { label: '💪 Workouts', key: 'workouts' },
    { label: '💳 Payments', key: 'payments' },
    { label: '📅 Schedule', key: 'schedule' },
    { label: '📊 Analytics', key: 'analytics' },
    { label: '⚙️ Settings', key: 'settings' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-zinc-950 text-white p-6 border-r border-zinc-800">
      <h1 className="text-2xl font-bold mb-10 tracking-wide">
        Neuli Fitness Coach
      </h1>
      <nav className="space-y-4 text-zinc-300">
        {items.map((item) => (
          <p
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`cursor-pointer hover:text-white ${activeTab === item.key ? 'text-white font-bold' : ''}`}
          >
            {item.label}
          </p>
        ))}
      </nav>
    </aside>
  );
}
