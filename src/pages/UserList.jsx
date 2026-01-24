import TableComponent from '@/components/table-component/TableComponent'
import { Chip } from '@mui/material'
import { get } from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
const UserList = () => {
    return (
        <div>
            <TableComponent
                slug="user"
                querykey="get-users"
                getApiEndPoint="getUsers"
                // DeleteAPIEndPiont="deleteUser"
                // manualPagination={true}
                columns={
                    [
                        {
                            id: 'name',
                            header: 'Name',
                            accessorFn: (row) => `${row?.firstName || ""} ${row?.lastName || ""}`,
                            Cell: ({ row }) => `${!get(row, "original.firstName") && !get(row, "original.lastName") ? '-' : `${get(row, "original.firstName") ? get(row, "original.firstName", "") : ''} ${get(row, "original.lastName") ? get(row, "original.lastName", "") : ''}`}`
                        },
                        {
                            id: 'email',
                            accessorKey: 'email',
                            header: 'Email',
                            Cell: ({ cell }) => <Link to={`mailto:${cell.getValue()}`}>{cell.getValue()}</Link>
                        },
                        {
                            id: 'phoneNumber',
                            accessorKey: 'phoneNumber',
                            header: 'Phone Number',
                            // Cell: ({ cell }) => <PhoneNumberFormat value={cell.getValue()} readOnly={true} />
                        },
                        {
                            id: 'isActive',
                            accessorFn: (row) => row?.isActive ? "Active" : "Inactive",
                            header: 'Status',
                            Cell: ({ row }) => <Chip sx={{
                                backgroundColor: get(row, "original.isActive") ? "#d1ffbe" : "#ffdada",
                                color: get(row, "original.isActive") ? "#3db309" : "#FF0000",
                                borderRadius: "4px"
                            }} label={get(row, "original.isActive") ? "Active" : "Inactive"} size="small" />
                        }
                    ]
                }
                // actions={
                //     [
                //         {
                //             label: "View Profile",
                //             icon: 'material-solid:preview',
                //             color: 'paxblue.dark',
                //             onClick: (row) => get(row, "original._id") && navigate(`/user/user-profile-view/${get(row, "original._id")}`),
                //         },
                //         {
                //             label: "Edit",
                //             icon: 'material-solid:edit',
                //             color: 'paxblue.dark',
                //             onClick: (row) => get(row, "original._id") && navigate(`/user/edit/${get(row, "original._id")}`),
                //         },
                //     ]
                // }
                // deleteAction={true}
                // exporterTableProps={
                //     {
                //         fileName: "users",
                //         pdfTitle: "Users"
                //     }
                // }
            />
        </div>
    )
}
export default UserList