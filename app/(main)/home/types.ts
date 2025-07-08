export interface NavigationContextProps {
    handlerNavigation: (navigation: string | null) => void 
    nav: string
}

export interface TabObject {
    key: string;
    label: string;
}


export interface PageStyles {
    name: string
    path: string[]
    icon:React.ReactNode
}