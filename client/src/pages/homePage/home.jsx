import Navbar from '../../components/layout/Navbar.jsx'
import Hero from '../../components/layout/Hero'
import Stats from '../../components/layout/Stats'
import SupportMethods from '../../components/layout/SupportMethods'
import Tools from '../../components/layout/Tools'
import Membership from '../../components/layout/Membership'
import Testimonials from '../../components/layout/Testimonials'
import Footer from '../../components/layout/Footer'

function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <main>
                <Hero />
                <Stats />
                <SupportMethods />
                <Tools />
                <Membership />
                <Testimonials />
            </main>
            <Footer />
        </div>
    )
}

export default Home