import { GetReports, DeleteReport } from '../../../utils/reportUtils'
import { DeleteComment, DeleteSocialPosts } from '../../../utils/forumUtils'
import { useAuth0 } from '@auth0/auth0-react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import {useEffect, useState} from 'react'
import Swal from 'sweetalert2'

export default function Report() {
    const { user, getAccessTokenSilently, isAuthenticated } = useAuth0()
    const queryClient = useQueryClient()
    const [currentPage, setCurrentPage] = useState(1)
    const reportsPerPage = 3

    const {
        isPending,
        data: qReport,
    } = useQuery({
        queryKey: ['getReports'],
        queryFn: async () => {
            if (!isAuthenticated || !user) return null
            return await GetReports(user, getAccessTokenSilently, isAuthenticated)
        },
        enabled: isAuthenticated && !!user,
    })

    useEffect(() => {
        console.log(qReport)
    }, [qReport])

    // Flatten the nested array from your JSON
    const reports = qReport?.data?.flat() || []

    const totalPages = Math.ceil(reports.length / reportsPerPage)
    const startIndex = (currentPage - 1) * reportsPerPage
    const pagedReports = reports.slice(startIndex, startIndex + reportsPerPage)

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1))
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages))

    const handleDelete = async (reportId) => {
    // Find the report to get the post_id or comment_id
    const report = reports.find(r => r.report_id === reportId)
    
    if (!report) {
        await Swal.fire('Lỗi!', 'Không tìm thấy báo cáo.', 'error')
        return
    }

    // Determine if it's a post or comment report
    const isPostReport = report.post_content !== null
    const isCommentReport = report.comment_content !== null
    
    const contentType = isPostReport ? 'bài viết' : 'bình luận'
    const contentTitle = isPostReport ? report.post_title : `"${report.comment_content}"`

    const result = await Swal.fire({
        title: `Bạn có chắc muốn xóa ${contentType} này?`,
        text: `${contentType} "${contentTitle}" sẽ bị xóa vĩnh viễn.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
    })

    if (result.isConfirmed) {
        try {
            if (isPostReport) {
                await DeleteSocialPosts(user, getAccessTokenSilently, isAuthenticated, report.post_id, report.reason, report.post_author_auth0_id, report.post_title,)
            } else if (isCommentReport) {
                await DeleteComment(user, getAccessTokenSilently, isAuthenticated, report.comment_id, report.reason, report.comment_author_auth0_id, report.comment_content)
            }
            await DeleteReport(user, getAccessTokenSilently, isAuthenticated, reportId)
            
            await Swal.fire('Đã xóa!', `${contentType} đã bị xóa.`, 'success')
            queryClient.invalidateQueries({ queryKey: ['getReports'] })
        } catch (error) {
            console.error('Error deleting content:', error)
            await Swal.fire('Lỗi!', `Không thể xóa ${contentType}.`, 'error')
        }
    }
}


    const handleIgnore = async (reportId) => {
        const result = await Swal.fire({
            title: 'Bạn có muốn bỏ qua báo cáo này?',
            text: `Báo cáo #${reportId} sẽ bị đánh dấu là đã xem.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Bỏ qua',
            cancelButtonText: 'Hủy',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#aaa',
        })

        if (result.isConfirmed) {
            // TODO: Call ignoreReport(reportId)
            await DeleteReport(user, getAccessTokenSilently, isAuthenticated, reportId)
            await Swal.fire('Đã bỏ qua!', `Báo cáo #${reportId} đã được bỏ qua.`, 'info')
            queryClient.invalidateQueries({ queryKey: ['getReports'] })
        }
    }


    if (isPending) {
        return <div className="text-center mt-6 text-gray-500">Đang tải dữ liệu...</div>
    }

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Danh sách báo cáo</h2>

            {reports.length === 0 ? (
                <p className="text-gray-500">Không có báo cáo nào.</p>
            ) : (
                <>
                    <ul className="space-y-4">
                        {pagedReports.map((report) => (
                            <li key={report.report_id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
                                <p className="text-sm text-gray-500 mb-1">
                                    Người báo cáo: <span className="font-medium">{report.reporter}</span>
                                </p>
                                <p className="text-sm text-gray-500 mb-1">
                                    Lý do báo cáo: <span className="font-medium">{report.reason}</span>
                                </p>
                                {report.post_content && (
                                    <>
                                        <h3 className="text-lg font-semibold text-blue-700">{report.post_title}</h3>
                                        <p className="text-sm text-gray-600">Tác giả bài viết: {report.post_author}</p>
                                        <p className="mt-2 text-gray-800">{report.post_content}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Ngày đăng: {new Date(report.post_created_at).toLocaleDateString()}
                                        </p>
                                    </>
                                )}
                                {report.comment_content && (
                                    <>
                                        <p className="text-sm text-gray-600">Tác giả bình luận: {report.comment_author}</p>
                                        <p className="mt-2 text-gray-800 italic">"{report.comment_content}"</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Ngày bình luận: {new Date(report.comment_created_at).toLocaleDateString()}
                                        </p>
                                    </>
                                )}
                                <p className="text-xs text-gray-400 mt-2">
                                    Thời gian báo cáo: {new Date(report.report_time).toLocaleString()}
                                </p>
                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => handleDelete(report.report_id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                    >
                                        Xóa Bài Viết
                                    </button>
                                    <button
                                        onClick={() => handleIgnore(report.report_id)}
                                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                                    >
                                        Bỏ qua
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>

                    {/* Pagination Controls */}
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
