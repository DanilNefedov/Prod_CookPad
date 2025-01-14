import ThemeRegistry from "@/config/ThemeMUI/provider-theme-mui";
import "./globals.css";
import { Roboto } from 'next/font/google'


const IBM = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: 'CookPad',
  description: 'CookPad is a recipe sharing platform',
}


export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={IBM.className}>
        <ThemeRegistry options={{ key: 'mui' }}>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
