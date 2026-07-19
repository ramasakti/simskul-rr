import type { Route } from "./+types/page";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { columns } from "@/components/users/columns";
import { DataTable } from "@/components/DataTable";
import type { Meta } from "@/type/Meta";
import { fetcher } from "@/lib/fetcher";

export function meta({ }: Route.MetaArgs) {
    return [
        { title: "Users | SIMSKUL" },
        { name: "description", content: "Sistem Informasi Manajemen Sekolah Indonesia" },
    ];
}

export default function Users() {
    const [searchParams, setSearchParams] = useSearchParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchInput, setSearchInput] = useState(
        searchParams.get("search") || ""
    );

    const page = Number(searchParams.get("page") || 1);
    const search = searchParams.get("search") || "";

    const [meta, setMeta] = useState<Meta>({
        current_page: 1,
        last_page: 1,
        total: 0,
    });

    // debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            setSearchParams({
                page: "1",
                search: searchInput,
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchInput]);

    useEffect(() => {
        fetchData();
    }, [page, search]);

    async function fetchData() {
        try {
            setLoading(true);

            const response = await fetcher(`/users?page=${page}&search=${search}`);

            const result = await response.json();

            const metaData = result.meta || {
                current_page: 1,
                last_page: 1,
                total: 0,
                per_page: 10,
            };

            const mappedData = (result.payload || []).map((item: any, index: number) => ({
                ...item,
                rowIndex: (metaData.current_page - 1) * (metaData.per_page || 10) + index + 1
            }));

            setData(mappedData);

            setMeta(metaData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handlePageChange(newPage: any) {
        setSearchParams({
            page: String(newPage),
            search,
        });
    }

    return (
        <>
            <div className="p-6 space-y-6">
                <div>
                    <h1 className="text-2xl font-bold">Users</h1>
                    <p className="text-muted-foreground">
                        Server side data table
                    </p>
                </div>

                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    page={meta.current_page}
                    lastPage={meta.last_page}
                    total={meta.total}
                    search={searchInput}
                    onSearchChange={setSearchInput}
                    onPageChange={handlePageChange}
                />
            </div>
        </>
    )
};
