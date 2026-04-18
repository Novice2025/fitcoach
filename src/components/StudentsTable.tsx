export default function StudentsTable() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-6 mt-6 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4 text-white">
        Students
      </h2>

      <table className="w-full text-white">
        <thead className="text-zinc-400">
          <tr>
            <th className="text-left pb-3">Name</th>
            <th className="text-left pb-3">Goal</th>
            <th className="text-left pb-3">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr className="border-t border-zinc-800">
            <td className="py-3">Maria Silva</td>
            <td>Weight Loss</td>
            <td className="text-green-400">Active</td>
          </tr>

          <tr className="border-t border-zinc-800">
            <td className="py-3">João Pereira</td>
            <td>Muscle Gain</td>
            <td className="text-green-400">Active</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}