import React from "react";
import '../styles/projects.css'

type Column<T> = {
  key: string;
  title: string;
  render?: (row: T, index: number) => React.ReactNode;
};

type TableWrapperProps<T> = {
  columns: Column<T>[];
  data: T[]; isLoad?: boolean;
  errTxt?: string;
  empTxt?: string;
  tableClsName?: string;
  rowClsName?: string;
};

function TableWrapper<T>({
  columns,
  data,
  isLoad = false,
  errTxt = "",
  empTxt = "No data found.",

  tableClsName = "",
  rowClsName = "",
}: TableWrapperProps<T>) {
  return (
    <table className={tableClsName}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {isLoad ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: "center" }}>
              <span className="loader loader--sm" />
            </td>
          </tr>
        ) : !!errTxt ? (
          <tr>
            <td colSpan={columns.length} className="card-err">
              {errTxt}
            </td>
          </tr>
        ) : !data.length ? (
          <tr>
            <td colSpan={columns.length} className="state-text">
              {empTxt}
            </td>
          </tr>
        ) : (
          data.map((row, rowIndex) => (
            <tr key={rowIndex} className={rowClsName}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render
                    ? col.render(row, rowIndex)
                    : (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export default TableWrapper;