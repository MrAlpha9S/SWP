import {useEffect, useState, useRef} from 'react'
import {
    Star,
    MessageCircle,
    CheckCircle,
    Users,
    Award,
    Calendar,
    Heart,
    Quote
} from 'lucide-react'
import {useQuery} from '@tanstack/react-query'
import {getCoachByIdOrAuth0Id} from '../../components/utils/userUtils'
import {useHighlightReviewIdStore} from "../../stores/store.js";

const CoachDetailsPage = ({coachId, from}) => {
    const [showAllReviews, setShowAllReviews] = useState(false)
    const [coachInfo, setCoachInfo] = useState()
    const {highlightReviewId, setHighlightReviewId} = useHighlightReviewIdStore()

    // Refs for scroll behavior
    const reviewRefs = useRef({});

    const {isPending, data} = useQuery({
        queryFn: async () => await getCoachByIdOrAuth0Id(coachId),
        queryKey: ['coach', coachId]
    })

    useEffect(() => {
        if (!isPending && data) {
            setCoachInfo(data.data)
            console.log(data.data)
        }
    }, [isPending, data])

    // Scroll to highlighted review
    useEffect(() => {
        if (highlightReviewId && highlightReviewId > 0 && reviews.length > 0) {
            const reviewElement = reviewRefs.current[highlightReviewId];
            if (reviewElement) {
                // Add a small delay to ensure the DOM is fully rendered
                setTimeout(() => {
                    reviewElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }, 100);
            }
        }
    }, [highlightReviewId, coachInfo]);

    // Reset highlight when leaving the page
    useEffect(() => {
        return () => setHighlightReviewId(0);
    }, []);

    const coach = coachInfo?.coach
    const specialties = coachInfo?.specialties || []
    const achievements = coachInfo?.achievements || []
    const reviews = coachInfo?.reviews || []

    const renderStars = (rating) => {
        return Array.from({length: 5}, (_, index) => (
            <Star
                key={index}
                className={`w-5 h-5 ${
                    index < Math.floor(rating)
                        ? 'text-yellow-400 fill-current'
                        : index < rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                }`}
            />
        ))
    }

    // Function to handle review hover (removes highlight)
    const handleReviewHover = (reviewId) => {
        if (highlightReviewId === reviewId) {
            setHighlightReviewId(0);
        }
    };

    const reviewsToShow = showAllReviews ? reviews : reviews.slice(0, 3)

    console.log(reviewsToShow)

    if (isPending || !coach) return <div className="text-center p-10"><div className='loader'></div></div>

    return (
        <div className=" w-full mx-auto h-[80%] p-6 space-y-8">
            {/* Header Section */}
            {!from && <>
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-8">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative">
                                <img
                                    src={coach.avatar}
                                    alt={coach.username}
                                    className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-success-500 rounded-full p-2">
                                    <CheckCircle className="w-6 h-6 text-white"/>
                                </div>
                            </div>
                            <div className="text-center md:text-left text-white">
                                <h1 className="text-3xl font-bold mb-2">{coach.username}</h1>
                                <p className="text-xl text-primary-100 mb-4">Huấn luyện viên cai thuốc</p>
                                <div className="flex flex-col md:flex-row items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        {renderStars(coach.avg_star)}
                                        <span className="text-primary-100 font-semibold">
                    {coach.avg_star} ({coach.num_reviews} đánh giá)
                  </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary-100">
                                        <Users className="w-5 h-5"/>
                                        <span>{coach.total_students} học viên đã chọn</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        className="flex-1 bg-success-600 hover:bg-success-700 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                        <CheckCircle className="w-5 h-5"/>
                        Chọn Huấn luyện viên
                    </button>
                    <button
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-4 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2">
                        <MessageCircle className="w-5 h-5"/>
                        Gửi tin nhắn
                    </button>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Calendar className="w-8 h-8 text-primary-500 mx-auto mb-2"/>
                        <div className="text-2xl font-bold text-gray-900">{coach.years_of_exp}</div>
                        <div className="text-sm text-gray-600">Năm kinh nghiệm</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Users className="w-8 h-8 text-success-500 mx-auto mb-2"/>
                        <div className="text-2xl font-bold text-gray-900">{coach.total_students}</div>
                        <div className="text-sm text-gray-600">Học viên</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                        <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2"/>
                        <div className="text-2xl font-bold text-gray-900">{coach.avg_star}</div>
                        <div className="text-sm text-gray-600">Đánh giá</div>
                    </div>
                </div>

                {/* Detailed Bio */
                }
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-primary-500"/>
                        Về tôi
                    </h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Triết lý làm việc</h3>
                            <div className="bg-primary-50 border-l-4 border-primary-500 p-4 rounded-r-lg">
                                <Quote className="w-6 h-6 text-primary-500 mb-2"/>
                                <p className="text-gray-700 italic">{coach.motto}</p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Câu chuyện của tôi</h3>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{coach.detailed_bio}</p>
                        </div>
                    </div>
                </div>

                {/* Experience & Achievements */
                }
                <div className="bg-white rounded-xl shadow-sm p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Award className="w-6 h-6 text-primary-500"/>
                        Kinh nghiệm & Thành tựu
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Chuyên môn</h3>
                            <ul className="space-y-3">
                                {specialties.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0"/>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thành tựu nổi bật</h3>
                            <ul className="space-y-3">
                                {achievements.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <Award className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0"/>
                                        <span className="text-gray-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </>}


            {/* Reviews Section */}
            {!from && <div className="bg-white rounded-xl shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Đánh giá từ học viên ({coach.num_reviews})
                </h2>
                <div className="space-y-6">
                    {reviewsToShow.map((review, index) => (
                        <div
                            key={index}
                            ref={(el) => reviewRefs.current[review.review_id] = el}
                            className={`border-b border-gray-200 pb-6 last:border-b-0 transition-all duration-300 ${
                                highlightReviewId === review.review_id
                                    ? 'ring-2 ring-primary-400 bg-primary-50 p-4 rounded-lg shadow-lg'
                                    : ''
                            }`}
                            onMouseEnter={() => handleReviewHover(review.review_id)}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {review.reviewer_name.charAt(0)}
                    </span>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-semibold text-gray-900">{review.reviewer_name}</span>
                                            <CheckCircle className="w-4 h-4 text-success-500"/>
                                        </div>
                                        <span className="text-sm text-gray-500">
                      {new Date(review.created_date).toLocaleDateString('vi-VN')}
                    </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    {renderStars(review.stars)}
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.review_content}</p>
                        </div>
                    ))}
                </div>

                {reviews.length > 3 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => setShowAllReviews(!showAllReviews)}
                            className="text-primary-600 hover:text-primary-700 font-semibold"
                        >
                            {showAllReviews ? 'Thu gọn' : `Xem thêm ${reviews.length - 3} đánh giá`}
                        </button>
                    </div>
                )}
            </div>}

            {from && reviews.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6 w-full mx-auto">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Đánh giá từ học viên ({reviews.length})
                    </h2>

                    <div className="space-y-4">
                        {reviewsToShow.map((review, index) => (
                            <div
                                key={index}
                                ref={(el) => reviewRefs.current[review.review_id] = el}
                                className={`border-b last:border-0 pb-4 transition-all duration-300 ${
                                    highlightReviewId === review.review_id
                                        ? 'ring-2 ring-primary-400 bg-primary-50 p-3 rounded-lg shadow-lg'
                                        : ''
                                }`}
                                onMouseEnter={() => handleReviewHover(review.review_id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold uppercase">
                                            {review.reviewer_name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1">
                                                <span className="font-semibold">{review.reviewer_name}</span>
                                                <CheckCircle className="w-4 h-4 text-success-500"/>
                                            </div>
                                            <span className="text-sm text-gray-500">
                  {new Date(review.created_date).toLocaleDateString('vi-VN')}
                </span>
                                        </div>
                                    </div>
                                    <div className="flex">{renderStars(review.stars)}</div>
                                </div>
                                <p className="text-sm text-gray-700 mt-2">{review.review_content}</p>
                            </div>
                        ))}
                    </div>

                    {reviews.length > 3 && (
                        <div className="text-center mt-4">
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="text-primary-600 hover:underline font-medium"
                            >
                                {showAllReviews ? 'Thu gọn' : `Xem thêm ${reviews.length - 3} đánh giá`}
                            </button>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default CoachDetailsPage