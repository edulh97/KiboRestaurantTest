import React, { useEffect, useRef, useState } from "react";
import { useTable, Column } from "react-table";
import { Bar } from "react-chartjs-2";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Chart, ChartData } from "chart.js";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "../../ChartConfig";
import { Usuario } from "../Users/Usuario-model";
import "./Reports.css";

const Report: React.FC = () => {
  const [data, setData] = useState<Usuario[]>([]);
  const chartRef = useRef<Chart<"bar"> | null>(null);
  const tableRef = useRef<HTMLTableElement | null>(null);
  const registeredCount = data.filter((user) => user.tipoUsuario === "registrado").length;
  const guestCount = data.filter((user) => user.tipoUsuario === "invitado").length;

  useEffect(() => {
    fetch("http://localhost:8080/kibo/usuarios")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  // Configuración de columnas para la tabla
  const columns: Column<Usuario>[] = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Email", accessor: "correoElectronico" },
      { Header: "Tipo", accessor: "tipoUsuario" },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<Usuario>({ columns, data });

  const chartData: ChartData<"bar"> = {
    labels: ["Registrados", "Invitados"],
    datasets: [
      {
        label: "Tipos de usuarios",
        data: [registeredCount, guestCount],
        backgroundColor: [
          "rgba(75, 192, 192)",
          "rgba(255, 99, 132)",
        ],
      },
    ],
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Informe");

    worksheet.columns = columns.map((col) => ({
      header: col.Header as string,
      key: col.accessor as string,
    }));

    data.forEach((user) => {
      worksheet.addRow({
        id: user.id,
        correoElectronico: user.correoElectronico,
        direccion: user.direccion,
        tipoUsuario: user.tipoUsuario,
      });
    });

    const chart = chartRef.current;
    if (chart) {
      const image = chart.toBase64Image();
      const imageId = workbook.addImage({
        base64: image,
        extension: "png",
      });

      worksheet.addImage(imageId, {
        tl: { col: 0, row: data.length + 2 },
        ext: { width: 500, height: 300 },
      });
    }

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "informe.xlsx");
  };

  const exportToPDF = async () => {
    const pdf = new jsPDF("p", "mm", "a4");
    const margin = 10; // Margen en mm
    const pageWidth = pdf.internal.pageSize.getWidth() - 2 * margin;

    // Capturar la tabla como imagen
    if (tableRef.current) {
      const tableCanvas = await html2canvas(tableRef.current);
      const tableImg = tableCanvas.toDataURL("image/png");
      const tableHeight = (tableCanvas.height * pageWidth) / tableCanvas.width;

      pdf.addImage(tableImg, "PNG", margin, margin, pageWidth, tableHeight);
    }

    // Capturar el gráfico como imagen
    if (chartRef.current) {
      const chartCanvas = await html2canvas(chartRef.current.canvas);
      const chartImg = chartCanvas.toDataURL("image/png");
      const chartHeight = (chartCanvas.height * pageWidth) / chartCanvas.width;

      pdf.addPage();
      pdf.addImage(chartImg, "PNG", margin, margin, pageWidth, chartHeight);
    }

    // Guardar el PDF
    pdf.save("informe.pdf");
  };

  return (
    <div className="report-container">
      <h1>Informe de Usuarios</h1>

      {/* Tabla */}
      <table
        {...getTableProps()}
        ref={tableRef}
        className="report-table"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Gráfico */}
      <div className="chart-container">
        <Bar data={chartData} ref={chartRef} />
      </div>

      {/* Botones para exportar */}
      <div className="button-container">
        <button onClick={exportToExcel}>
          Exportar a Excel
        </button>
        <button onClick={exportToPDF}>
          Exportar a PDF
        </button>
      </div>
    </div>
  );
};

export default Report;