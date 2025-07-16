// ReportModal.jsx
import React, { useState } from 'react';
import { FaFlag, FaTimes } from 'react-icons/fa';

export function ReportModal({ 
    isOpen, 
    onClose, 
    onSubmit, 
    isSubmitting, 
    reportType, // 'post' or 'comment'
    itemAuthor 
}) {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');

    const reportReasons = [
        { value: 'spam', label: 'Spam hoặc nội dung lặp lại' },
        { value: 'harassment', label: 'Quấy rối hoặc bắt nạt' },
        { value: 'hate_speech', label: 'Ngôn từ thù địch' },
        { value: 'inappropriate', label: 'Nội dung không phù hợp' },
        { value: 'misinformation', label: 'Thông tin sai lệch' },
        { value: 'violence', label: 'Nội dung bạo lực' },
        { value: 'copyright', label: 'Vi phạm bản quyền' },
        { value: 'other', label: 'Khác' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) return;
        
        onSubmit({
            reason: reason,
            description: description.trim()
        });
        
        // Reset form
        setReason('');
        setDescription('');
    };

    const handleClose = () => {
        setReason('');
        setDescription('');
        onClose();
    };

    // Don't render if modal is not open
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            <FaFlag className="text-red-500" />
                            Báo cáo {reportType === 'post' ? 'bài viết' : 'bình luận'}
                        </h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600">
                            Bạn đang báo cáo {reportType === 'post' ? 'bài viết' : 'bình luận'} của{' '}
                            <span className="font-semibold">{itemAuthor}</span>
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Reason Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Lý do báo cáo *
                            </label>
                            <select
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                required
                            >
                                <option value="">Chọn lý do...</option>
                                {reportReasons.map((reasonOption) => (
                                    <option key={reasonOption.value} value={reasonOption.value}>
                                        {reasonOption.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả chi tiết (tuỳ chọn)
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Mô tả thêm về vấn đề..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                                rows="4"
                                maxLength={500}
                            />
                            <div className="text-right text-xs text-gray-500 mt-1">
                                {description.length}/500
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-sm text-yellow-800">
                                <strong>Lưu ý:</strong> Báo cáo sai sự thật có thể dẫn đến việc hạn chế tài khoản của bạn.
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                                disabled={isSubmitting}
                            >
                                Huỷ
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || !reason.trim()}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}