"use client";
import React, { ReactNode } from "react";
import { tableStyles, TableStyleProps } from "@/styles/components/tableStyles";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((item: T) => ReactNode);
  align?: "left" | "center" | "right";
  width?: string;
  isAction?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyField: keyof T;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  styleProps?: TableStyleProps;
}

const Table = <T extends object>({
  data,
  columns,
  keyField,
  isLoading = false,
  emptyMessage = "Aucune donnée disponible",
  className = "",
  styleProps,
}: TableProps<T>) => {
  const styles = tableStyles(styleProps);

  const getHeaderCellStyle = (column: TableColumn<T>): React.CSSProperties => {
    return {
      ...styles.headerStyle,
      textAlign: column.align || "left",
      width: column.width,
    };
  };

  const getCellStyle = (
    column: TableColumn<T>,
    isEven: boolean
  ): React.CSSProperties => {
    if (column.isAction) {
      return {
        ...styles.actionsCellStyle,
        textAlign: column.align || "center",
      };
    }

    return {
      ...styles.cellStyle(isEven),
      textAlign: column.align || "left",
    };
  };

  const renderCell = (item: T, column: TableColumn<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(item);
    }
    return item[column.accessor] as ReactNode;
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: "20px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          margin: "0 auto",
          maxWidth: styleProps?.maxWidth || "1200px",
        }}
      >
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div style={styles.containerStyle} className={className}>
      <table style={styles.tableStyle}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} style={getHeaderCellStyle(column)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "16px", textAlign: "center" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={String(item[keyField])}
                style={{
                  ...styles.rowStyle(rowIndex % 2 === 1),
                }}
              >
                {columns.map((column, colIndex) => (
                  <td
                    key={colIndex}
                    style={getCellStyle(column, rowIndex % 2 === 1)}
                  >
                    {renderCell(item, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
