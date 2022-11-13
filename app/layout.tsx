
import '../styles/globals.scss'
import Footer from './footer'
import NavBar from './nav-bar'
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html>
      <head />
      <body className=''>
        <NavBar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
