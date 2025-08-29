import { Skeleton } from "@mui/material";







export function SkeletonInfo ({ loading, children }: {loading: boolean; children: React.ReactNode;}) {

    return loading ? <Skeleton variant="text" sx={{flexGrow:1, fontSize: 'inherit', lineHeight: 'inherit',}} /> : <>{children}</>;
}