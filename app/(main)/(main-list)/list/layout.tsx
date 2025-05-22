import { AlertsProvider } from "@/app/components/ux-helpers/alerts-provider";






export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['list']}> 
            {children}
        </AlertsProvider>
    )
}
