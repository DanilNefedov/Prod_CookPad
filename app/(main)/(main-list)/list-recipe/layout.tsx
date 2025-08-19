import { AlertsProvider } from "@/app/components/ui-helpers/AlertsProvider";




export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <AlertsProvider sliceKeys={['listRecipe']}> 
            {children}
        </AlertsProvider>
    )
}
