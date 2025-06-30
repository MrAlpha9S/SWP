const CoachCard = ({coach}) => {
    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-primary-200 transition-all duration-300 group flex flex-col">
            <div className="relative">
                <img
                    src={coach.avatar}
                    alt={coach.username}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                    {/*<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">*/}
                    {/*  {coach.specialty}*/}
                    {/*</span>*/}
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{coach.username}</h3>
                        {/*<p className="text-sm text-gray-600">{coach.title}</p>*/}
                    </div>
                    <div className="flex items-center">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <svg
                                    key={i}
                                    className={`w-4 h-4 ${
                                        i < Math.floor(coach.rating) ? 'text-yellow-400' : 'text-gray-200'
                                    }`}
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                </svg>
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">({5})</span>
                    </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{coach.bio}</p>

                <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{coach.years_of_exp}</span> năm kinh nghiệm
                    </div>
                </div>

            {/*    <div className="flex gap-2 mb-4">*/}
            {/*        {coach.tags.slice(0, 3).map((tag, index) => (*/}
            {/*            <span*/}
            {/*                key={index}*/}
            {/*                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"*/}
            {/*            >*/}
            {/*            {tag}*/}
            {/*            </span>*/}
            {/*        ))}*/}
            {/*        {coach.tags.length > 3 && (*/}
            {/*            <span*/}
            {/*                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">*/}
            {/*  +{coach.tags.length - 3} more*/}
            {/*</span>*/}
            {/*        )}*/}
            {/*    </div>*/}


            </div>
            <div className="flex gap-3 p-3 mt-auto">
                <button
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Chọn
                </button>
                <button
                    className="px-4 py-2.5 border border-gray-200 hover:border-primary-300 text-gray-700 hover:text-primary-700 font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
};

export default CoachCard;