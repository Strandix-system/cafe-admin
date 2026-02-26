import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { IconButton } from '@mui/material';
import { get } from 'lodash';
import { mkConfig, generateCsv, download } from "export-to-csv";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';
import { Download } from 'lucide-react';
import { useMemo, useState } from 'react';

const loadImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject({ url, err });
    });
};

export const exportPdfWithCustomTitles = async (columns, data, fileName, pdfTitle) => {
    const doc = new jsPDF();

    if (pdfTitle) {
        doc.text(pdfTitle, 14, 10);
    }

    // Create table body and map of image cells to their row/col
    const imageTasks = [];
    const body = data.map((rowData, rowIndex) =>
        columns.map((col, colIndex) => {
            const value = rowData[col.title] || '';
            const isImageUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

            if (isImageUrl) {
                const task = loadImage(value).then((img) => ({
                    rowIndex,
                    colIndex,
                    img,
                }));
                imageTasks.push(task);
                return { content: '', isImage: true }; // Mark placeholder
            }

            return value;
        })
    );

    // Step 1: Generate table
    autoTable(doc, {
        head: [columns.map(col => col.title)],
        body,
        didDrawCell: (data) => {
            // Placeholder: images will be drawn later after loading
        },
        columnStyles: {
            1: { cellWidth: 25 },
        },
        styles: {
            fontSize: 8,
            overflow: 'linebreak'
        },
        theme: 'grid'
    });

    // Step 2: Wait for all images to load
    try {
        const images = await Promise.all(imageTasks);

        images.forEach(({ rowIndex, colIndex, img }) => {
            const table = doc.lastAutoTable;
            const cell = table?.body[rowIndex]?.cells[colIndex];
            if (!cell) return;

            const x = cell.x + 2;
            const y = cell.y + 1;
            const size = cell.height - 2;

            doc.addImage(img, 'JPEG', x, y, size, size);
        });

        doc.save(`${fileName}.pdf`);

        toast.success("PDF exported successfully");
    } catch (error) {
        console.error('Failed to load one or more images:', error);
        toast.error("Failed to export PDF: One or more images could not be loaded.',");
    }
};

export const exportPdfWithCustomTitle = async (columns, data, fileName, pdfTitle) => {
    const doc = new jsPDF();

    if (pdfTitle) {
        doc.text(pdfTitle, 14, 10);
    }

    const imageTasks = [];

    const MAX_COLUMNS_PER_PAGE = columns.length > 8 ? 6 : columns.length; // Adjust based on page width and font size

    // Split columns into chunks
    const columnChunks = [];
    for (let i = 0; i < columns.length; i += MAX_COLUMNS_PER_PAGE) {
        columnChunks.push(columns.slice(i, i + MAX_COLUMNS_PER_PAGE));
    }

    // Loop through each chunk
    for (let chunkIndex = 0; chunkIndex < columnChunks.length; chunkIndex++) {
        const colChunk = columnChunks[chunkIndex];

        const body = data.map((rowData, rowIndex) =>
            colChunk.map((col, colIndex) => {
                const value = rowData[col.title] || '';
                const isImageUrl = typeof value === 'string' && (value.startsWith('http://') || value.startsWith('https://'));

                if (isImageUrl) {
                    const task = loadImage(value).then((img) => ({
                        rowIndex,
                        colIndex,
                        img,
                        tableIndex: chunkIndex
                    }));
                    imageTasks.push(task);
                    return { content: '', isImage: true };
                }

                return value;
            })
        );

        if (chunkIndex > 0) {
            doc.addPage();
        }

        autoTable(doc, {
            head: [colChunk.map(col => col.title)],
            body,
            startY: pdfTitle && chunkIndex === 0 ? 15 : 10,
            columnStyles: {
                1: { cellWidth: 25 },
            },
            styles: {
                fontSize: 8,
                overflow: 'linebreak',
            },
            theme: 'grid',
        });
    }

    try {
        const images = await Promise.all(imageTasks);

        // Draw images on the correct page
        images.forEach(({ rowIndex, colIndex, img, tableIndex }) => {
            const table = doc.autoTable.previous?.[tableIndex];
            const cell = table?.body[rowIndex]?.cells[colIndex];
            if (!cell) return;

            const x = cell.x + 2;
            const y = cell.y + 1;
            const size = cell.height - 2;

            doc.setPage(tableIndex + 1);
            doc.addImage(img, 'JPEG', x, y, size, size);
        });

        doc.save(`${fileName}.pdf`);

        toast.success("PDF exported successfully");
    } catch (error) {
        console.error('Failed to load one or more images:', error);
        toast.success('Failed to export PDF: One or more images could not be loaded.');
    }
};


const exportToExcel = (columns, data, fileName) => {
    if (!data.length) {
        console.error("No data available for export");
        return;
    }
    const formattedData = data.map(row => {
        const formattedRow = {};
        columns.forEach(col => {
            formattedRow[col.title] = row[col.title] || ""; // Ensure correct mapping
        });
        return formattedRow;
    });

    // Ensure the worksheet is correctly created
    const worksheet = XLSX.utils.json_to_sheet(formattedData);

    // Ensure correct column headers
    XLSX.utils.sheet_add_aoa(worksheet, [columns.map(col => col.title)], { origin: "A1" });

    // Set column widths
    worksheet['!cols'] = columns.map(col => ({ wpx: col.width || 100 }));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const exportCsvWithHeaders = (columns, data, fileName) => {
    const csvConfig = mkConfig({
        filename: fileName,
        useKeysAsHeaders: true,
    });

    const formattedData = data.map(row =>
        columns.reduce((acc, col) => {
            acc[col.title] = row[col.title] || "";
            return acc;
        }, {})
    );

    const csv = generateCsv(csvConfig)(formattedData);
    download(csvConfig)(csv);
};


export const ExporterTable = ({ table, fileName = "data", pdfTitle = null }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const exportColumns = useMemo(() => {
        return (table?.getVisibleFlatColumns() ?? [])
            .filter(col => !col?.id.includes("mrt-row"))
            .map(col => ({
                title: get(col, "columnDef.header", ""),
                field: col?.columnDef?.accessorKey?.replace(".", "_") || col?.id, // Ensure correct field mapping
                accessorFn: col?.columnDef?.accessorFn, // Store accessor function for computed values
                width: 150
            }));
    }, [table?.getVisibleFlatColumns()]);

    var data = table.options.data.map((row) => {
        const formattedRow = {};

        exportColumns.forEach((col) => {
            // Get column definition
            const columnDef = table.getAllColumns().find(c => c.id === col.field.replace("_", "."))?.columnDef;

            if (columnDef?.accessorFn) {
                formattedRow[col.title] = columnDef.accessorFn(row); // Apply computed function
            } else {
                formattedRow[col.title] = get(row, col.field.replace("_", "."), ""); // Handle normal fields
            }
        });

        return formattedRow;
    });

    const nestedAccessorKeyColumns = (table?.getVisibleFlatColumns() ?? []).filter(col => (get(col, "columnDef.accessorKey", "")?.includes("."))).map(col => get(col, "columnDef.accessorKey", ""));

    if (nestedAccessorKeyColumns?.length) {
        data = data.map(item => ({
            ...item,
            ...(nestedAccessorKeyColumns.reduce((pre, cur) => ({
                ...pre,
                [cur?.replace(".", "_")]: get(item, cur, ""),
            }), {})),
        }));
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const downloadData = (value) => {
        setAnchorEl(null);

        switch (value) {
            case "csv":
                exportCsvWithHeaders(exportColumns, data, fileName);
                break;

            case "pdf":
                exportPdfWithCustomTitle(exportColumns, data, fileName, pdfTitle);
                break;

            case "excel":
                exportToExcel(exportColumns, data, fileName);
                break;

            default: return;
        }
    };

    return (
        <div>
            <IconButton
                id="export-button"
                aria-controls={open ? 'export-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                <Download size={18} />
            </IconButton>
            <Menu
                id="export-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'export-button',
                }}
            >
                <MenuItem onClick={() => downloadData("csv")}>Export CSV</MenuItem>
                <MenuItem onClick={() => downloadData("pdf")}>Export PDF</MenuItem>
                <MenuItem onClick={() => downloadData("excel")}>Export Excel</MenuItem>
            </Menu>
        </div>
    )
}
