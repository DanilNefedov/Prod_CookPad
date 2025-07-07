import ThemeRegistry from "@/config/ThemeMUI/provider-theme-mui";
import "./globals.css";
import { Roboto } from 'next/font/google'
import { ProviderAuth } from "@/config/auth/provider-auth";
import { ProviderStore } from "@/config/state/provider-store";
import WrapperLayout from "@/config/wrapper/wrapper-layout";


const IBM = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'CookPad',
  description: 'CookPad is a recipe sharing platform',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/android-icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon-57x57.png', sizes: '57x57', type: 'image/png' },
      { url: '/apple-icon-60x60.png', sizes: '60x60', type: 'image/png' },
      { url: '/apple-icon-72x72.png', sizes: '72x72', type: 'image/png' },
      { url: '/apple-icon-76x76.png', sizes: '76x76', type: 'image/png' },
      { url: '/apple-icon-114x114.png', sizes: '114x114', type: 'image/png' },
      { url: '/apple-icon-120x120.png', sizes: '120x120', type: 'image/png' },
      { url: '/apple-icon-144x144.png', sizes: '144x144', type: 'image/png' },
      { url: '/apple-icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/apple-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon-96x96.png',
  },
  manifest: '/manifest.json',
}





export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={IBM.className}>
        <ThemeRegistry options={{ key: 'mui' }}>
          <ProviderStore>
            <ProviderAuth>
              <WrapperLayout>
                {children}
              </WrapperLayout>
            </ProviderAuth>
          </ProviderStore>
        </ThemeRegistry>
      </body>
    </html>
  );
}
