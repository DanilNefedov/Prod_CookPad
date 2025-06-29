export interface NavigationContextProps {
    handlerNavigation: (navigation: string | null) => void 
    nav: string
}

export interface TabObject {
    key: string;
    label: string;
}