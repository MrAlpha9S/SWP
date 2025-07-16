export function ReplyForm({ replyContent, setReplyContent, onSubmit, isSubmitting, isAuthenticated }) {
    if (!isAuthenticated) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">Bạn cần đăng nhập để trả lời bài viết này.</p>
                <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    Đăng nhập
                </button>
            </div>
        );
    }

    return (
        <div>
            <textarea
                onChange={(e) => setReplyContent(e.target.value)}
                value={replyContent}
                placeholder="Viết câu trả lời tại đây..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows="4"
                disabled={isSubmitting}
            />
            <div className="flex gap-3 mt-3">
                <button
                    onClick={onSubmit}
                    type="submit"
                    disabled={isSubmitting || !replyContent.trim()}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                    {isSubmitting ? 'Đang gửi...' : 'Trả lời'}
                </button>
            </div>
        </div>
    );
}