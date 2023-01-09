
import Footer from './footer'
import NavBar from './nav-bar'
export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className=''>
      <NavBar />
      {children}
      <Footer />
    </div>
  )
}
