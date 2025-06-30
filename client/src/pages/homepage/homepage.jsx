import Hero from '../../components/layout/homepage/hero.jsx'
import Stats from '../../components/layout/homepage/stats.jsx'
import SupportMethods from '../../components/layout/homepage/supportMethods.jsx'
import Testimonials from '../../components/layout/homepage/testimonials.jsx'
import LeaderBoard from "../../components/layout/homepage/leaderboard.jsx";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

function Homepage() {
    return (
        <PageFadeWrapper>

    <div className="flex flex-col min-h-screen">
        <main>
            <Hero />
            <Stats />
            <LeaderBoard/>
            <SupportMethods />
            <Testimonials />
        </main>
    </div>
        </PageFadeWrapper>
)
}

export default Homepage