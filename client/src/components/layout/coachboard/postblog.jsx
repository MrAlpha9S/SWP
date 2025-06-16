import React, { useState } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Select } from 'antd'
import Swal from 'sweetalert2'

export default function PostBlog({user_id}) {
    const [currentTopic, setCurrentTopic] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentDescription, setCurrentDescription] = useState('')

    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: '<p>Hãy viết gì đó ở đây</p>',
    })

    const isFormValid = () => {
        const html = editor?.getHTML().trim()
        return (
            currentTopic &&
            currentTitle.trim() &&
            currentDescription.trim() &&
            html &&
            html !== '<p></p>'
        )
    }

    const handleSubmit = () => {
        if (!isFormValid()) {
            Swal.fire({
                icon: 'warning',
                title: 'Thiếu thông tin',
                text: 'Vui lòng điền đầy đủ các trường trước khi đăng bài!',
            })
            return
        }

        const post = {
            user_id,
            topic: currentTopic,
            title: currentTitle,
            description: currentDescription,
            content: editor.getHTML(),
        }

        console.log('Submit:', post)

        Swal.fire({
            icon: 'success',
            title: 'Đăng bài thành công',
            text: 'Bài viết của bạn đã được lưu!',
        })

        // Gửi lên API hoặc lưu Firestore ở đây nếu cần
    }

    return (
        <div>
            {/* Chọn chủ đề */}
            <div className="bg-white max-w-3xl mx-auto rounded-lg mt-10 p-4">
                <div className="mb-2 font-semibold text-lg">Chủ Đề</div>
                <Select
                    showSearch
                    placeholder="Hãy chọn một chủ đề"
                    optionFilterProp="label"
                    onChange={(value) => setCurrentTopic(value)}
                    value={currentTopic || undefined}
                    options={[
                        { value: 'preparing-to-quit', label: 'Chuẩn bị để bỏ thuốc' },
                        { value: 'smoking-and-your-health', label: 'Hút thuốc và sức khỏe của bạn' },
                        { value: 'smoking-and-pregnancy', label: 'Hút thuốc và mang thai' },
                        { value: 'helping-friends-and-family-quit', label: 'Giúp bạn bè và gia đình bỏ thuốc lá' },
                        { value: 'cravings-triggers-and-routines', label: 'Sự thèm muốn, nguyên nhân và thói quen' },
                        { value: 'preparing-to-stop-smoking', label: 'Chuẩn bị bỏ thuốc lá' },
                        { value: 'vaping', label: 'Hút thuốc lá điện tử' },
                        { value: 'resources-for-health-professionals', label: 'Tài nguyên cho Chuyên gia Y tế' },
                    ]}
                />
            </div>

            {/* Tiêu đề & Miêu tả */}
            <div className="bg-white max-w-3xl mx-auto rounded-lg mt-10 p-4">
                <div className="mb-4">
                    <label className="block font-medium mb-1">Tiêu Đề</label>
                    <input
                        type="text"
                        value={currentTitle}
                        onChange={(e) => setCurrentTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập tiêu đề bài viết"
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium mb-1">Miêu Tả</label>
                    <textarea
                        value={currentDescription}
                        onChange={(e) => setCurrentDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập miêu tả ngắn về bài viết"
                        rows={3}
                    />
                </div>
            </div>

            {/* Editor */}
            <div className="bg-white max-w-3xl mx-auto rounded-lg mt-10 p-4">
                <div className="mb-2 font-semibold text-lg">Post</div>

                <div className="border rounded-md shadow-sm">
                    {/* Toolbar */}
                    <div className="flex flex-wrap gap-1 border-b p-2">
                        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">H₁</button>
                        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H₂</button>
                        <button onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()} className="btn">H₃</button>
                        <button onClick={() => editor?.chain().focus().toggleBold().run()} className="btn font-bold">B</button>
                        <button onClick={() => editor?.chain().focus().toggleItalic().run()} className="btn italic">I</button>
                        <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className="btn underline">U</button>
                        <button onClick={() => editor?.chain().focus().setTextAlign('left').run()} className="btn">⬅</button>
                        <button onClick={() => editor?.chain().focus().setTextAlign('center').run()} className="btn">↔</button>
                        <button onClick={() => editor?.chain().focus().setTextAlign('right').run()} className="btn">➡</button>
                        <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className="btn">• List</button>
                        <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
                        <button onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} className="btn">✎</button>
                        <button
                            onClick={() => {
                                const url = window.prompt('Enter image URL')
                                if (url) {
                                    editor?.chain().focus().setImage({ src: url }).run()
                                }
                            }}
                            className="btn"
                        >
                            🌐 Img URL
                        </button>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                const reader = new FileReader()
                                reader.onload = () => {
                                    editor?.chain().focus().setImage({ src: reader.result }).run()
                                }
                                reader.readAsDataURL(file)
                            }}
                            className="hidden"
                            id="upload-img"
                        />
                        <label htmlFor="upload-img" className="btn cursor-pointer">📷 Upload</label>
                    </div>

                    <EditorContent editor={editor} className="min-h-[150px] p-3 focus:outline-none list-disc list-inside" />
                </div>

                {/* Nút Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!isFormValid()}
                    className={`mt-3 px-4 py-2 rounded text-white ${
                        isFormValid()
                            ? 'bg-black hover:bg-gray-800'
                            : 'bg-gray-400 cursor-not-allowed'
                    }`}
                >
                    Xong
                </button>
            </div>
        </div>
    )
}
