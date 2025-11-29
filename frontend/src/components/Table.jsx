import { FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

const statusConfig = {
  pending: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: FiClock,
    iconColor: "text-amber-600",
  },
  approved: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: FiCheckCircle,
    iconColor: "text-emerald-600",
  },
  rejected: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: FiXCircle,
    iconColor: "text-rose-600",
  },
};

export default function Table({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50">
            <tr>
              {columns.map((col, index) => {
                const colKey = col.key || col.header || col.accessor || `col-${index}`;
                return (
                  <th
                    key={colKey}
                    className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600"
                  >
                    {col.label || col.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-sm text-slate-500"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="rounded-full bg-slate-100 p-3 mb-3">
                      <FiClock className="text-2xl text-slate-400" />
                    </div>
                    <p className="font-medium">No data available</p>
                  </div>
                </td>
              </tr>
            )}
            {data.map((row, rowIndex) => {
              const rowId = row._id || row.id || `row-${rowIndex}`;
              return (
                <tr
                  key={rowId}
                  className="hover:bg-slate-50/50 transition-colors duration-150"
                >
                  {columns.map((col, colIndex) => {
                    const colKey = col.key || col.header || col.accessor || `col-${colIndex}`;
                    const cellKey = `${rowId}-${colKey}`;
                    const value = row[col.key || col.accessor];

                    if (col.key === "status" || col.accessor === "status") {
                      const status = value?.toLowerCase();
                      const config = statusConfig[status] || statusConfig.pending;
                      const StatusIcon = config.icon;
                      
                      return (
                        <td key={cellKey} className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.text} ${config.border} border`}
                          >
                            <StatusIcon className={`${config.iconColor} text-sm`} />
                            {value?.toUpperCase() || "PENDING"}
                          </span>
                        </td>
                      );
                    }
                    if (col.render) {
                      return (
                        <td key={cellKey} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                          {col.render(row)}
                        </td>
                      );
                    }
                    return (
                      <td key={cellKey} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
