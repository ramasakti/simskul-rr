import { EditUserAction } from "./EditUserAction";

export const columns = [
    {
        accessorKey: "rowIndex",
        header: "No",
    },
    {
        accessorKey: "name",
        header: "Nama",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "actions",
        header: "Aksi",
        cell: ({ row }) => {
            return <EditUserAction user={row.original} />;
        },
    },
];