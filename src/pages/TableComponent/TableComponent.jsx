import { useEffect, useState } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
} from 'material-react-table';
import { Box, Card, IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import { get } from 'lodash';
import { keepPreviousData } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import RestoreIcon from '@mui/icons-material/Restore';
import ExporterTable from './ExporterTable';
import { Columns, DeleteIcon, Filter, FilterX, GripVertical, List, MoreVertical, Search, Trash, X } from 'lucide-react';
import { useDelete, useFetch } from "../../utils/hooks/api_hooks";
import { API_ROUTES } from "../../utils/api_constants";
import DeleteConfirmationDialog from "../../components/common/DeleteConfirmDialog";
import toast from 'react-hot-toast';
import { queryClient } from '../../lib/queryClient';

const tableIcons = {
    FilterListIcon: () => <Filter size={18} />,
    FilterListOffIcon: () => <FilterX size={18} />,
    ViewColumnIcon: () => <Columns size={18} />,

    DensityLargeIcon: () => <Menu size={18} />,
    DensityMediumIcon: () => <Menu size={18} />,
    DensitySmallIcon: () => <List size={18} />,

    SearchIcon: () => <Search size={18} />,
    ClearAllIcon: () => <X size={18} />,

    DragHandleIcon: () => <GripVertical size={24} />,
    MoreVertIcon: () => <MoreVertical size={18} />,
};

const caseInsensitiveSortingFn = (rowA, rowB, columnId) => {
    const a = rowA?.getValue(columnId)?.toString().toLowerCase() ?? '';
    const b = rowB?.getValue(columnId)?.toString().toLowerCase() ?? '';
    return a?.localeCompare(b);
};

const tableVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

const TableComponent = (props) => {
    const {
        columns = [],
        rows,
        actions = [],
        actionsType = "icons", // 'icons' | 'menu'
        slug = "item",
        querykey = "get-items",
        apiEndpointId = null,
        getApiEndPoint,
        deleteApiEndPoint,
        deleteAction = false,
        params = {},
        isDataLoading = false,
        enableRowSelection = false,
        enableExportTable = true,
        enableRefetch = false,
        handleRowSelection,
        exporterTableProps = {},
        initialState = {},
        manualPagination = false,
        serialNo = false,
        enableRowDrag = false,
        onRowDragEnd,
        afterSuccessfullDeletion
    } = props;

    const [rowSelection, setRowSelection] = useState({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: params?.limit || 10,
    });
    const [globalFilter, setGlobalFilter] = useState("");
    const [deleteState, setDeleteState] = useState({
        open: false,
        id: null,
        name: "",
    });

    // Handle API calls
    const { data, isLoading, isError, error, refetch, isRefetching } = useFetch(
        getApiEndPoint ? querykey : "",
        apiEndpointId ? `${API_ROUTES[getApiEndPoint]}/${apiEndpointId}` : API_ROUTES[getApiEndPoint],
        {
            ...params,
            ...(globalFilter && { search: globalFilter }),
            ...(manualPagination && {
                ...(!globalFilter && { page: pagination.pageIndex }),
                limit: pagination.pageSize,
            }),
        },
        {
            enabled: Boolean(getApiEndPoint),
            placeholderData: keepPreviousData
        }
    );

    const { mutate: deleteMutation, isPending: isDeletePending} = useDelete(API_ROUTES[deleteApiEndPoint], {
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [
                    querykey,
                    {
                        ...(globalFilter && { search: globalFilter }),
                    }
                ]
            });
            setDeleteState({ open: false, id: null, name: "" });
            afterSuccessfullDeletion && afterSuccessfullDeletion();
            toast.error(`${slug} has been successfully deleted.`)
        },
        onError: (error) => {
            toast.error(error ?? 'Something went wrong')
        },
    });

    const handleClickDelete = (row) => {
        console.log(row)
        setDeleteState({
            open: true,
            id: get(row, "original._id"),
            name: get(row, "original.name", ""),
        });
    };

    const handleConfirmDelete = () => {
        console.log(deleteState)
        deleteMutation(deleteState.id);
    };

    const table = useMaterialReactTable({
        columns,
        data: rows ?? get(data, "result.results", []),


        enableSortingRemoval: false,
        sortingFns: {
            caseInsensitive: caseInsensitiveSortingFn,
        },

        // handle table initial State
        initialState: {
            ...initialState,
            showGlobalFilter: true,
            density: "spacious",//'comfortable' | 'compact' | 'spacious'
            columnPinning: {
                right: ['mrt-row-actions'],
            },
            ...(manualPagination && { pagination }),
        },

        // handle table current State
        state: {
            ...(
                !rows && {
                    globalFilter: globalFilter,
                }
            ),
            rowSelection,
            isLoading: isLoading || isDataLoading || isRefetching,
            ...(manualPagination && { pagination }),
        },

        // handle table icons
        icons: tableIcons,

        // handle column filter, move and grouping
        enableColumnFilterModes: false,

        // handle column filter by column or grouping
        enableGrouping: false,

        // handle column move or ordering
        enableColumnOrdering: false,

        // handle column actions dot icon
        enableColumnActions: false,
        enableDensityToggle: false,
        enableFilters: false,
        enableHiding: false,

        // handle column resizing
        enableColumnResizing: true,
        layoutMode: 'grid',// for getting rid of an extra space
        columnResizeMode: 'onChange', //default, onChange, onEnd
        defaultColumn: {
            maxSize: 400,
            minSize: 100,
            size: 200,
            grow: true,
            sortingFn: 'caseInsensitive',
        },
        // handle serial number
        enableRowNumbers: serialNo,
        displayColumnDefOptions: {
            'mrt-row-actions': {
                header: 'Actions',
                size: 150,
            },
            'mrt-row-numbers': {
                muiTableHeadCellProps: {
                    children: 'S. No.',
                },
                size: 50,
                minSize: 80,
            },
        },


        // handle row selection
        // enableRowSelection: enableRowSelection,
        // onRowSelectionChange: (newRowSelection) => {
        //     setRowSelection(newRowSelection)
        // },
        enableRowSelection: enableRowSelection,
        onRowSelectionChange: setRowSelection,

        // getRowId: (row) => row?._id,
        positionToolbarAlertBanner: 'none',

        // handle row actions like edit/delete
        enableRowActions: (actions?.length || deleteAction) ?? false,
        [actionsType === "icons" ? "renderRowActions" : "renderRowActionMenuItems"]: ({ row, closeMenu }) => {
            const tableActions = deleteAction ? [
                ...actions,
                {
                    label: deleteAction?.label ? deleteAction?.label : "Delete",
                    // complete delete flow
                    onClick: deleteAction?.onClick ? deleteAction?.onClick : () => handleClickDelete(row),
                    isDisabled: deleteAction?.isDisabled ? deleteAction?.isDisabled : false,
                    icon: Trash,
                    color: '#f00'
                }
            ] : actions;

            return tableActions.map((action, i) => {
                const isDisabled = action?.isDisabled ? action?.isDisabled(row) : false;
                return (
                    actionsType === "icons" ? (
                        <Tooltip
                            title={action?.label}
                            key={`material-react-table-action-${action?.label}-${i}`}
                        >
                            <IconButton
                                onClick={() => {
                                    setTimeout(action?.onClick(row));
                                }}
                                disabled={isDisabled}
                            >
                                {action?.icon && (
                                    <action.icon
                                        size={22}
                                        color={isDisabled ? undefined : action?.color}
                                    />
                                )}
                            </IconButton>
                        </Tooltip>
                    ) : (
                        <MenuItem
                            key={`material-react-table-action-${action?.label}-${i}`}
                            onClick={() => {
                                closeMenu();
                                setTimeout(action?.onClick(row));
                            }}
                            disabled={isDisabled}
                        >
                            {action?.icon && (
                                <action.icon
                                    size={18}
                                    className="mr-8"
                                    color={isDisabled ? undefined : action?.color}
                                />
                            )}
                            {action?.label}
                        </MenuItem>
                    )
                );

            })
        },

        renderTopToolbarCustomActions: (props) => (
            <Box className="w-full flex justify-end">
                {enableRefetch && <Tooltip title="Refresh"><IconButton onClick={refetch}><RestoreIcon size={24} /></IconButton></Tooltip>}
                {enableExportTable && <ExporterTable {...{ ...props, ...exporterTableProps }} />}
            </Box>
        ),

        // handle full screen table toggle button
        enableFullScreenToggle: false,

        // handle row searching
        enableGlobalFilterModes: true,
        positionGlobalFilter: 'left',

        ...(
            !rows && {
                manualGlobalFilter: true,
                onGlobalFilterChange: (search) => {
                    setGlobalFilter(search);
                },
            }
        ),

        // handle table paginations
        enablePagination: true,
        muiPaginationProps: {
            rowsPerPageOptions: [5, 10, 20, 50, 100, 500, 1000],
            showRowsPerPage: true,
            shape: 'rounded',
        },
        paginationDisplayMode: 'pages',
        ...(manualPagination && { onPaginationChange: setPagination }),
        manualPagination,
        rowCount: manualPagination
            ? get(data, "result.totalResults", 0)
            : (rows?.length ?? get(data, "result.totalResults", 0)),

        // Update the table UI
        muiSearchTextFieldProps: {
            placeholder: `Search`,
            sx: { minWidth: '300px' },
            variant: 'outlined',
        },

        muiTableBodyProps: {
            className: 'row-hover-shadow',
            sx: {
                '& tr > td': {
                    borderBottom: '0.1rem solid #e4e4e4',
                    backgroundColor: '#fff',
                }
            },
        },

        muiTableHeadProps: {
            sx: {
                '& tr > th': {
                    borderTop: '0.1rem solid #e4e4e4',
                    borderBottom: '0.1rem solid #e4e4e4',
                    backgroundColor: '#fff',
                    paddingBottom: "10px"
                },
                '& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Labels': {
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                },
                '& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-Content-Actions > button': {
                    width: "auto",
                    height: "auto",
                    background: 'none'
                },
                '& tr > th > .Mui-TableHeadCell-Content > .Mui-TableHeadCell-ResizeHandle-Wrapper': {
                    position: 'static',
                    padding: 0,
                    margin: 0
                },
            },
        },

        enableRowOrdering: enableRowDrag,
        muiRowDragHandleProps: enableRowDrag ? {
            onDragEnd: (event) => {
                const { draggingRow, hoveredRow } = table.getState();
                if (hoveredRow && draggingRow) {
                    const dataSource = rows ? localRows : get(data, "result.results", []);
                    const newData = [...dataSource];

                    newData.splice(
                        hoveredRow.index,
                        0,
                        newData.splice(draggingRow.index, 1)[0]
                    );

                    if (rows) {
                        setLocalRows(newData);
                        if (onRowDragEnd) {
                            onRowDragEnd(newData);
                        }
                    } else {
                        if (onRowDragEnd) {
                            onRowDragEnd(newData);
                        }
                    }
                }
            }
        } : undefined,
    });

    // useEffect(() => {
    //     if (handleRowSelection) {
    //         const selectedRowIds = Object.keys(rowSelection);
    //         const selectedRows = rows ? rows.filter(row => selectedRowIds.includes(row._id)) : get(data, "result.results", []) ? get(data, "result.results", []).filter(row => selectedRowIds.includes(row._id)) : [];
    //         handleRowSelection(selectedRows);
    //     }
    // }, [rowSelection])

    useEffect(() => {
        if (!handleRowSelection) return;

        const selectedRows = table
            .getSelectedRowModel()
            .rows
            .map(row => row.original);

        console.log("SELECTED ROWS FROM TABLE:", selectedRows);

        handleRowSelection(selectedRows);
    }, [rowSelection]);

    if (isError) return <div>{error}</div>;

    return <motion.div
        variants={tableVariants}
        initial="hidden"
        animate="visible"
    >
        <Card className='w-full material-react-table bg-white rounded pt-8 px-8'>
            <MaterialReactTable
                table={table}
            />
        </Card>
        <DeleteConfirmationDialog
            open={deleteState.open}
            onClose={() => setDeleteState({ open: false, id: null, name: "" })}
            onConfirm={handleConfirmDelete}
            slug={slug}
            name={deleteState.name}
            loading={isDeletePending}
        />
    </motion.div>

};

export default TableComponent;
