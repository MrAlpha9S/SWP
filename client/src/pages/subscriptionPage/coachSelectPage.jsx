import {useState, useMemo, useEffect} from 'react';
import SearchFilter from '../../components/layout/coachboard/searchFilter.jsx';
import CoachCard from '../../components/layout/coachboard/CoachCard';
import {getCoaches} from "../../components/utils/userUtils.js";
import {useQuery} from "@tanstack/react-query";
import PageFadeWrapper from "../../components/utils/PageFadeWrapper.jsx";

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
        }
    }, [isPending]);

    const filteredCoaches = useMemo(() => {
        return coaches.filter(coach => {
            const matchesSearch = coach.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                coach.bio.toLowerCase().includes(searchTerm.toLowerCase())


            return matchesSearch;
        });
    }, [searchTerm, coaches]);

    const handleSearch = (term) => {
        setSearchTerm(term);
    };

    return (
        <PageFadeWrapper>
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                            All coaches are verified professionals
                        </div>
                    </div>

                    {/* Coaches Grid */}
                    {filteredCoaches.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
                            <p className="text-gray-600">Try adjusting your search criteria or browse all available
                                coaches.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCoaches.map((coach) => (
                                <CoachCard key={coach.user_id} coach={coach}/>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </PageFadeWrapper>

    );
}

export default CoachSelectPage;