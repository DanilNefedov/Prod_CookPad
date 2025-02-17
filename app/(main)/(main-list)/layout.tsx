import { HeaderList } from "@/app/components/main-list/header-list";
import { Box } from "@mui/material";
import { headers } from "next/headers";
// import { HeaderList } from "./heade-list";




export default async function ListLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headersList = await headers();
    const referer = headersList.get('referer') || '';
    const url = new URL(referer);
    const pathname = url.pathname.startsWith("/") ? url.pathname.slice(1) : url.pathname;

    return (
        <Box sx={{ height: 'inherit' }}>
            <HeaderList pathname={pathname}></HeaderList>
            {children}
        </Box>
    )
}