import { Plus, CheckCircle, AlertCircle, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import cn from '../utility/cn'; // adjust path according to your project structure

const Reports = () => {
  const mockReports = [
    {
      id: 1,
      issue: 'Broken Projector',
      teacher: 'John Doe',
      room: 'Room 101',
      date: '2026-03-01',
      status: 'Pending',
    },
    {
      id: 2,
      issue: 'Air Conditioner Not Working',
      teacher: 'Jane Smith',
      room: 'Room 102',
      date: '2026-02-28',
      status: 'Resolved',
    },
    {
      id: 3,
      issue: 'Whiteboard Needs Cleaning',
      teacher: 'Alice Johnson',
      room: 'Room 103',
      date: '2026-02-27',
      status: 'Pending',
    },
  ];

  return (
    <div className="p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Teacher Reports</h2>
          <p className="text-sm sm:text-base text-gray-500">View and manage maintenance or facility reports.</p>
        </div>
        <button className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-sm">
          <Plus size={20} />
          New Report
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {mockReports.map((report) => (
          <div
            key={report.id}
            className="bg-white p-4 sm:p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-white shrink-0",
                  report.status === 'Resolved' ? "bg-emerald-500" : "bg-amber-500"
                )}
              >
                {report.status === 'Resolved' ? <CheckCircle size={20} className="sm:size-6" /> : <AlertCircle size={20} className="sm:size-6" />}
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{report.issue}</h3>
                <p className="text-xs sm:text-sm text-gray-500 truncate">Reported by {report.teacher} • {report.room}</p>
              </div>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4 sm:gap-8 border-t lg:border-t-0 pt-4 lg:pt-0">
              <div className="text-left lg:text-right">
                <p className="text-xs sm:text-sm font-semibold text-gray-900">{format(new Date(report.date), 'MMM dd, yyyy')}</p>
                <p className="text-[10px] sm:text-xs text-gray-500">Report Date</p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider",
                    report.status === 'Resolved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  )}
                >
                  {report.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;