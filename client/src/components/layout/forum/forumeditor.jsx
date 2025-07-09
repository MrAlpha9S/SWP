import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'
import { Select } from 'antd'
import Swal from 'sweetalert2'
import { getCurrentUTCDateTime } from '../../utils/dateUtils'
import { useMutation } from '@tanstack/react-query';
import { PostSocialPosts } from '../../utils/forumUtils'
import { useAuth0 } from "@auth0/auth0-react";


export default function ForumEditor() {
    const navigate = useNavigate()
    const [currentCategory, setCurrentCategory] = useState('')
    const [currentTitle, setCurrentTitle] = useState('')
    const [currentTag, setCurrentTag] = useState('')

    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();

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
            currentCategory &&
            currentTitle.trim() &&
            html &&
            html !== '<p></p>'
        )
    }


    const postBlogMutation = useMutation({
        mutationFn: async ({ user, getAccessTokenSilently, isAuthenticated, category_id, title, content, created_at }) => {
            return await PostSocialPosts(user, getAccessTokenSilently, isAuthenticated, category_id, title, content, created_at);
        },
        onSuccess: () => {
            Swal.fire({
                icon: 'success',
                title: 'Đăng bài thành công',
            })
            navigate(`/forum/${currentTag}`)
        },
        onError: () => {

        },
    });


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
            category_id: currentCategory,
            title: currentTitle,
            content: editor.getHTML(),
            created_at: getCurrentUTCDateTime().toISOString()
        }
        console.log('Submit:', post)
        postBlogMutation.mutate({ user, getAccessTokenSilently, isAuthenticated, ...post })

    }

    const onCategory = (value, category_tag) => {
        setCurrentCategory(value)
        setCurrentTag(category_tag)
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
                    onChange={(value, option) => onCategory(value, option.category_tag)}
                    value={currentCategory || undefined}
                    options={[
                        { value: 1, category_tag: 'quit-experiences', label: 'Chia sẻ trải nghiệm' },
                        { value: 2, category_tag: 'getting-started', label: 'Bắt đầu hành trình' },
                        { value: 3, category_tag: 'staying-quit', label: 'Duy trì cai thuốc' },
                        { value: 4, category_tag: 'hints-and-tips', label: 'Mẹo và lời khuyên' },
                        { value: 5, category_tag: 'reasons-to-quit', label: 'Lý do bỏ thuốc' },
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
                    className={`mt-3 px-4 py-2 rounded text-white ${isFormValid()
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
