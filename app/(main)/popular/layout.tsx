import { AlertsProvider } from "@/app/components/ui-helpers/alerts-provider";









export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['popular', 'comments']}> 
            {children}
        </AlertsProvider>
    )
}
