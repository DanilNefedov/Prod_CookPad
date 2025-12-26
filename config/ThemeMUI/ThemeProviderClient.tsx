'use client';


import { CacheProvider } from "@emotion/react";
import { ReactNode } from "react";
import createCache from "@emotion/cache";
import ThemeRegistry from "./ProviderThemeMui";



const cache = createCache({ key: "css", prepend: true });


export default function ThemeProviderClient({ children }: { children: ReactNode }) {

    return (
        <CacheProvider value={cache}>
            <ThemeRegistry>
                {children}
            </ThemeRegistry>
        </CacheProvider>
    )

}