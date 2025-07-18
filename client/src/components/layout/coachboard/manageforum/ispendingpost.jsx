import { GetIsPendingSocialPosts } from '../../../utils/forumUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export default function IsPendingPost() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)
    const postsPerPage = 3

    const {
        isPending,
        data: qPost,
    } = useQuery({
        queryKey: ['isPendingPost'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return null
            return await GetIsPendingSocialPosts(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: isAuthenticated && !!user,
    })

    const posts = qPost?.data?.recordset || []

    const totalPages = Math.ceil(posts.length / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const pagedPosts = posts.slice(startIndex, startIndex + postsPerPage)

    const handleReload = () => {
        queryClient.invalidateQueries({ queryKey: ['isPendingPost'] })
        setCurrentPage(1)
    }

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

    if (isPending) {
        return <div className="text-center mt-6 text-gray-500">Đang tải dữ liệu...</div>
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Bài viết đang chờ duyệt</h2>
                <button
                    onClick={handleReload}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Tải lại
                </button>
            </div>

            {posts.length === 0 ? (
                <p className="text-gray-500">Không có bài viết nào đang chờ duyệt.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {pagedPosts.map((post) => (
                            <li
                                key={post.post_id}
                                className="bg-white rounded-xl shadow p-4 border"
                            >
                                <h3 className="text-lg font-bold text-gray-800">{post.title}</h3>
                                <p className="text-sm text-gray-500 mb-1">
                                    Người đăng: <span className="font-medium">{post.username}</span> | Chuyên mục:{' '}
                                    <span className="italic">{post.category_name}</span>
                                </p>
                                <p className="text-gray-700">{post.content}</p>
                                <p className="text-xs text-gray-400 mt-2">
                                    Ngày đăng: {new Date(post.created_at).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination controls */}
                    <div className="flex justify-center gap-4 mt-6">
                        <button
                            onClick={handlePrev}
                            disabled={currentPage === 1}
                            className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Trang trước
                        </button>
                        <span className="text-sm text-gray-600">
                            Trang {currentPage} / {totalPages}
                        </span>
                        <button
                            onClick={handleNext}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}
