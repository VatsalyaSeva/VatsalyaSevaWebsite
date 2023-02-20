
import Footer from '../components/footer'
import NavBar from './nav-bar'
export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <div className='w-[100vw]'>
      <NavBar />
      {children}
      
    </div>
  )
}
