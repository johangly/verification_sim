import {
  ElementType,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface DataTableHeader<T> {
  icon: ElementType;
  title: string;
  key: keyof T;
  render?: (value: T[keyof T], row: T) => ReactNode;
  cellClassName?: string | ((value: T[keyof T], row: T) => string);
  sortable?: boolean | ((a: T, b: T) => number);
}

interface DataTableComponentProps<T extends Record<string, unknown>> {
  headers: DataTableHeader<T>[];
  data: T[];
  footer?: ReactNode;
  rowClassName?: string | ((row: T, index: number) => string);
  showPagination?: boolean;
  setPage?: Dispatch<SetStateAction<number>>;
  currentPage?: number;
  totalPages?: number;
  setRowsPerPage?: Dispatch<SetStateAction<number>>;
  showRowsPerPageOptions?: boolean;
  rowsPerPageOptions?: number[];
  rowsPerPage?: number;
  page?: number;
}

export default function DataTableComponent<T extends Record<string, unknown>>({
  headers,
  data,
  footer,
  rowClassName,
  setPage,
  currentPage,
  setRowsPerPage,
  rowsPerPage,
  rowsPerPageOptions,
  showRowsPerPageOptions = false,
  totalPages,
  showPagination = false,
}: DataTableComponentProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const sortedData = (() => {
    if (!sortConfig.key) return data;

    const header = headers.find((h) => h.key === sortConfig.key);
    if (!header?.sortable) return data;

    const sorter =
      typeof header.sortable === "function"
        ? header.sortable
        : (a: T, b: T) => {
            if (a[header.key] < b[header.key]) return -1;
            if (a[header.key] > b[header.key]) return 1;
            return 0;
          };

    return [...data].sort((a, b) => {
      const result = sorter(a, b);
      return sortConfig.direction === "asc" ? result : -result;
    });
  })();

  const pagesArray: number[] = Array.from({ length: totalPages }, (_, i) => i);
  const maxButtons = 15;
  const startPage = Math.max(
    0,
    Math.min(currentPage - Math.floor(maxButtons / 2), totalPages - maxButtons)
  );
  const endPage = Math.min(totalPages, startPage + maxButtons);
  const visiblePages = pagesArray.slice(startPage, endPage);
  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
      <table className="min-w-full rounded-xl overflow-hidden">
        <thead className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-200 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          <tr>
            {headers.length === 0 ? (
              <th className="px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide">
                No headers defined.
              </th>
            ) : (
              headers.map((header, index) => (
                <th
                  key={index}
                  onClick={() => header.sortable && handleSort(header.key)}
                  className={`px-6 py-4 text-left font-semibold text-gray-700 dark:text-gray-200 tracking-wide cursor-${
                    header.sortable ? "pointer" : "default"
                  } select-none`}
                >
                  <div className="flex items-center">
                    {header.icon && (
                      <header.icon className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                    )}
                    <span>{header.title}</span>
                    {sortConfig.key === header.key && (
                      <span className="ml-2 text-xs text-gray-500">
                        {sortConfig.direction === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </div>
                </th>
              ))
            )}
          </tr>
        </thead>

        <tbody>
          {sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No data available.
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  typeof rowClassName === "function"
                    ? rowClassName(row, rowIndex)
                    : rowClassName || ""
                }
              >
                {headers.map((header, colIndex) => {
                  const value = row[header.key];
                  const cellClass =
                    typeof header.cellClassName === "function"
                      ? header.cellClassName(value, row)
                      : header.cellClassName || "";

                  return (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 border-b border-gray-100 dark:border-gray-800 text-gray-800 dark:text-gray-100 ${cellClass}`}
                    >
                      {header.render
                        ? header.render(value, row)
                        : String(value)}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>

        {footer && (
          <tfoot>
            {showPagination && (
              <tr>
                <td className="w-[50%]">
                  <div className="px-6 py-4 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
                    Page {currentPage} of {totalPages}
                  </div>
                </td>
                <td
                  colSpan={headers.length}
                  className="px-6 py-4 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-b-xl w-[50%]"
                >
                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                      disabled={currentPage === 1}
                      onClick={() =>
                        setPage && setPage((prev) => (prev || 1) - 1)
                      }
                    >
                      Previous
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() =>
                        setPage && setPage((prev) => (prev || 1) + 1)
                      }
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={headers.length}>
                <div className="flex justify-center space-x-2 my-4">
                  {visiblePages.map((pageNumber) => (
                    <button
                      key={pageNumber}
                      className={`px-3 py-1 rounded transition-colors duration-200
            ${
              currentPage === pageNumber + 1
                ? "bg-blue-700 text-white cursor-not-allowed opacity-70"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
                      onClick={() => setPage && setPage(pageNumber + 1)}
                      disabled={currentPage === pageNumber + 1}
                    >
                      {pageNumber + 1}
                    </button>
                  ))}
                </div>
              </td>
            </tr>

            <tr className="w-full">
              <td
                colSpan={headers.length}
                className="px-6 py-4 bg-blue-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-b-xl"
              >
                {footer}
                {showRowsPerPageOptions && setRowsPerPage && rowsPerPage && (
                  <div className="mt-2 w-full">
                    <label className="mr-2 font-semibold">
                      Clientes por pagina:
                    </label>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => setRowsPerPage(Number(e.target.value))}
                      className="border border-gray-300 rounded px-2 py-1 font-semibold"
                    >
                      {rowsPerPageOptions?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
