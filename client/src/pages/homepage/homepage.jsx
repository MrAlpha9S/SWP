import Hero from '../../components/layout/homepage/hero.jsx'
import Stats from '../../components/layout/homepage/stats.jsx'
import SupportMethods from '../../components/layout/homepage/supportMethods.jsx'
import Membership from '../../components/layout/homepage/membership.jsx'
import Testimonials from '../../components/layout/homepage/testimonials.jsx'
import LeaderBoard from "../../components/layout/homepage/leaderboard.jsx";

function Homepage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main>
                <Hero />
                <LeaderBoard/>
                <Stats />
                <SupportMethods />
                <Membership />
                <Testimonials />
            </main>
        </div>
    )
}

export default Homepage