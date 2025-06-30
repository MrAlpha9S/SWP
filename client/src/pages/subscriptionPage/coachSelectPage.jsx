import {useState, useMemo, useEffect} from 'react';
import SearchFilter from '../../components/layout/coachboard/searchFilter.jsx';
import CoachCard from '../../components/layout/coachboard/CoachCard';
import {getCoaches} from "../../components/utils/userUtils.js";
import {useQuery} from "@tanstack/react-query";

// const coaches = [
//     {
//         id: 1,
//         name: "Sarah Johnson",
//         title: "Certified Life Coach & Wellness Expert",
//         specialty: "Life Coaching",
//         image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.9,
//         reviews: 127,
//         experience: 8,
//         hourlyRate: 85,
//         description: "Passionate about helping individuals discover their true potential and create meaningful change in their lives. Specializing in personal development, goal setting, and work-life balance.",
//         tags: ["Personal Development", "Goal Setting", "Work-Life Balance", "Mindfulness", "Stress Management"]
//     },
//     {
//         id: 2,
//         name: "Michael Chen",
//         title: "Executive Business Coach",
//         specialty: "Business Coaching",
//         image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.8,
//         reviews: 89,
//         experience: 12,
//         hourlyRate: 150,
//         description: "Former Fortune 500 executive turned coach. I help leaders and entrepreneurs scale their businesses while maintaining their core values and vision.",
//         tags: ["Leadership", "Strategy", "Team Building", "Entrepreneurship", "Scaling"]
//     },
//     {
//         id: 3,
//         name: "Emily Rodriguez",
//         title: "Career Transition Specialist",
//         specialty: "Career Coaching",
//         image: "https://images.pexels.com/photos/1181391/pexels-photo-1181391.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.7,
//         reviews: 156,
//         experience: 6,
//         hourlyRate: 95,
//         description: "Dedicated to helping professionals navigate career transitions, negotiate salaries, and build fulfilling careers aligned with their values and aspirations.",
//         tags: ["Career Change", "Resume Building", "Interview Prep", "Salary Negotiation", "Professional Growth"]
//     },
//     {
//         id: 4,
//         name: "Dr. James Wilson",
//         title: "Health & Wellness Coach",
//         specialty: "Health & Wellness",
//         image: "https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.9,
//         reviews: 203,
//         experience: 15,
//         hourlyRate: 120,
//         description: "Medical doctor turned wellness coach. I combine medical expertise with holistic approaches to help clients achieve optimal health and vitality.",
//         tags: ["Nutrition", "Fitness", "Mental Health", "Preventive Care", "Lifestyle Medicine"]
//     },
//     {
//         id: 5,
//         name: "Amanda Foster",
//         title: "Executive Leadership Coach",
//         specialty: "Executive Coaching",
//         image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.8,
//         reviews: 94,
//         experience: 10,
//         hourlyRate: 180,
//         description: "Empowering C-suite executives and senior leaders to excel in their roles while fostering high-performing, inclusive teams and sustainable business growth.",
//         tags: ["C-Suite Coaching", "Team Performance", "Change Management", "Strategic Planning", "Executive Presence"]
//     },
//     {
//         id: 6,
//         name: "David Kim",
//         title: "Relationship & Communication Coach",
//         specialty: "Relationship Coaching",
//         image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.6,
//         reviews: 78,
//         experience: 7,
//         hourlyRate: 100,
//         description: "Helping individuals and couples build stronger, more authentic relationships through improved communication, emotional intelligence, and conflict resolution skills.",
//         tags: ["Communication", "Conflict Resolution", "Emotional Intelligence", "Couples Therapy", "Family Dynamics"]
//     },
//     {
//         id: 7,
//         name: "Lisa Thompson",
//         title: "Performance & Productivity Coach",
//         specialty: "Life Coaching",
//         image: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.7,
//         reviews: 112,
//         experience: 9,
//         hourlyRate: 110,
//         description: "Specialist in helping high achievers optimize their performance, overcome procrastination, and create systems for sustained success and fulfillment.",
//         tags: ["Performance Optimization", "Time Management", "Productivity Systems", "Habit Formation", "Peak Performance"]
//     },
//     {
//         id: 8,
//         name: "Robert Martinez",
//         title: "Small Business Growth Coach",
//         specialty: "Business Coaching",
//         image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400",
//         rating: 4.8,
//         reviews: 67,
//         experience: 14,
//         hourlyRate: 125,
//         description: "Passionate about helping small business owners and startups build profitable, sustainable businesses through strategic planning, marketing, and operational excellence.",
//         tags: ["Small Business", "Marketing Strategy", "Operations", "Financial Planning", "Growth Hacking"]
//     }
// ];

function CoachSelectPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [coaches, setCoaches] = useState([]);

    const {isPending, data} = useQuery({
        queryFn: async () => {
            return await getCoaches()
        },
        queryKey: ['coaches']
    })

    useEffect(() => {
        if (!isPending) {
            setCoaches(data.data);
            console.log(data.data)
        }
    }, [isPending]);

    const filteredCoaches = useMemo(() => {
        return coaches.filter(coach => {
            const matchesSearch = coach.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.bio.toLowerCase().includes(searchTerm.toLowerCase())


            return matchesSearch ;
        });
    }, [searchTerm]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">
                            Hãy chọn Huấn luyện viên
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Hãy chọn một Huấn luyện viên để đồng hành cùng bạn trong hành trình cai thuốc.
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SearchFilter
                    onSearch={handleSearch}
                />

                {/* Results Summary */}
                <div className="flex items-center justify-between mb-8">
                    <div className="text-sm text-gray-600">
                        Hiển thị <span className="font-medium text-gray-900">{filteredCoaches.length} huấn luyện viên</span>

                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        All coaches are verified professionals
                    </div>
                </div>

                {/* Coaches Grid */}
                {filteredCoaches.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-gray-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
                        <p className="text-gray-600">Try adjusting your search criteria or browse all available coaches.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCoaches.map((coach) => (
                            <CoachCard key={coach.user_id} coach={coach} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default CoachSelectPage;