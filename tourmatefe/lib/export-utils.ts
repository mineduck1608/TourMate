import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Types for export data
export interface ExportDataRow {
  [key: string]: string | number;
}

// Utility để tạo style cho Excel
export const createExcelWorkbook = () => {
  const wb = XLSX.utils.book_new();
  return wb;
};

// Thêm worksheet với style và formatting
export const addWorksheetToWorkbook = (
  workbook: XLSX.WorkBook,
  data: ExportDataRow[],
  sheetName: string
) => {
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Set column widths based on content
  if (data.length > 0) {
    const colWidths = Object.keys(data[0]).map(key => {
      const maxLength = Math.max(
        key.length, // header length
        ...data.map(row => String(row[key] || '').length) // data length
      );
      return { wch: Math.min(Math.max(maxLength + 2, 10), 50) }; // min 10, max 50 chars
    });
    ws['!cols'] = colWidths;
  }

  // Auto-filter for the data
  if (data.length > 0) {
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
    ws['!autofilter'] = { ref: XLSX.utils.encode_range(range) };
  }

  // Add the worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, ws, sheetName);
  
  return workbook;
};

// Xuất file Excel với metadata
export const exportToExcel = (workbook: XLSX.WorkBook, filename: string) => {
  // Add metadata
  workbook.Props = {
    Title: filename,
    Subject: 'TourMate Export Report',
    Author: 'TourMate Admin',
    CreatedDate: new Date()
  };

  const wbout = XLSX.write(workbook, { 
    bookType: 'xlsx', 
    type: 'array',
    cellStyles: true 
  });
  
  const blob = new Blob([wbout], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
  
  saveAs(blob, `${filename}.xlsx`);
};

// Format currency cho Excel
export const formatCurrencyForExcel = (amount: number) => {
  if (amount === 0 || amount == null) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

// Format date cho Excel
export const formatDateForExcel = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Clean HTML từ text
export const cleanHtmlText = (htmlText: string) => {
  return htmlText?.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() || "";
};
