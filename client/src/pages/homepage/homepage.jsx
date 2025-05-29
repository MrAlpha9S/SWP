import Navbar from '../../components/layout/navbar.jsx'
import Hero from '../../components/layout/hero.jsx'
import Stats from '../../components/layout/stats.jsx'
import SupportMethods from '../../components/layout/supportMethods.jsx'
import Tools from '../../components/layout/tools.jsx'
import Membership from '../../components/layout/membership.jsx'
import Testimonials from '../../components/layout/testimonials.jsx'
import Footer from '../../components/layout/footer.jsx'

function Homepage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main>
                <Hero />
                <Stats />
                <SupportMethods />
                <Membership />
                <Testimonials />
            </main>
            <Footer />
        </div>
    )
}

export default Homepage