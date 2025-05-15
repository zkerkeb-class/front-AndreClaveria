"use client";
import React, { ReactNode, useState, useEffect } from "react";
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
  pagination?: boolean; // Activer/désactiver la pagination
  defaultItemsPerPage?: 5 | 10 | 25; // Nombre d'éléments par page par défaut
}

const Table = <T extends object>({
  data,
  columns,
  keyField,
  isLoading = false,
  emptyMessage = "Aucune donnée disponible",
  className = "",
  styleProps,
  pagination = true,
  defaultItemsPerPage = 10,
}: TableProps<T>) => {
  const styles = tableStyles(styleProps);

  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState<5 | 10 | 25>(
    defaultItemsPerPage
  );
  const [paginatedData, setPaginatedData] = useState<T[]>([]);

  // Calcul du nombre total de pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // Mettre à jour les données paginées lors des changements
  useEffect(() => {
    // Réinitialiser à la page 1 si les données ou itemsPerPage changent
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    // Calculer les données à afficher pour la page courante
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, data.length);

    // Extraire le sous-ensemble de données
    const currentPageData = data.slice(startIndex, endIndex);
    setPaginatedData(currentPageData);
  }, [data, currentPage, itemsPerPage, totalPages]);

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

  // Gérer les changements de page
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Gérer les changements d'éléments par page
  const handleItemsPerPageChange = (value: 5 | 10 | 25) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Revenir à la première page
  };

  // Style pour les contrôles de pagination
  const paginationStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "16px",
    padding: "8px 16px",
    backgroundColor: "#f7f9fc",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  };

  const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "4px 10px",
    margin: "0 4px",
    backgroundColor: isActive ? "#1976d2" : "#ffffff",
    color: isActive ? "#ffffff" : "#333333",
    border: isActive ? "1px solid #1976d2" : "1px solid #dddddd",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  const disabledButtonStyle: React.CSSProperties = {
    padding: "4px 10px",
    margin: "0 4px",
    backgroundColor: "#f0f0f0",
    color: "#aaaaaa",
    border: "1px solid #dddddd",
    borderRadius: "4px",
    cursor: "not-allowed",
  };

  const selectStyle: React.CSSProperties = {
    padding: "4px 8px",
    borderRadius: "4px",
    border: "1px solid #dddddd",
    backgroundColor: "#ffffff",
    marginLeft: "8px",
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
          {(pagination ? paginatedData : data).length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                style={{ padding: "16px", textAlign: "center" }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            (pagination ? paginatedData : data).map((item, rowIndex) => (
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

      {/* Contrôles de pagination */}
      {pagination && data.length > 0 && (
        <div style={paginationStyle}>
          <div>
            <span style={{ marginRight: "10px" }}>
              Afficher
              <select
                value={itemsPerPage}
                onChange={(e) =>
                  handleItemsPerPageChange(
                    Number(e.target.value) as 5 | 10 | 25
                  )
                }
                style={selectStyle}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
              </select>
              éléments
            </span>

            <span>
              {data.length > 0
                ? `${(currentPage - 1) * itemsPerPage + 1} - ${Math.min(
                    currentPage * itemsPerPage,
                    data.length
                  )} sur ${data.length}`
                : "0 élément"}
            </span>
          </div>

          <div>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              style={
                currentPage === 1 ? disabledButtonStyle : pageButtonStyle(false)
              }
              aria-label="Première page"
            >
              &laquo;
            </button>

            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              style={
                currentPage === 1 ? disabledButtonStyle : pageButtonStyle(false)
              }
              aria-label="Page précédente"
            >
              &lsaquo;
            </button>

            {/* Affichage des numéros de page */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logique pour afficher les numéros de page autour de la page courante
              let pageNum = currentPage;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  style={pageButtonStyle(pageNum === currentPage)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === currentPage ? "page" : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={
                currentPage === totalPages || totalPages === 0
                  ? disabledButtonStyle
                  : pageButtonStyle(false)
              }
              aria-label="Page suivante"
            >
              &rsaquo;
            </button>

            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
              style={
                currentPage === totalPages || totalPages === 0
                  ? disabledButtonStyle
                  : pageButtonStyle(false)
              }
              aria-label="Dernière page"
            >
              &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
