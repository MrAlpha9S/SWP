import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Image from '@tiptap/extension-image'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Image,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>Hello world</p>',
  })

  const handleSubmit = () => {
    if (editor) {
      const html = editor.getHTML()
      console.log('', html)
    }
  }

  return (
    <div className="bg-white max-w-3xl mx-auto rounded-lg mt-10 p-4">
      <div className="mb-2 font-semibold text-lg">Post</div>

      <div className="border rounded-md shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 border-b p-2">
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className="btn">H₁</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className="btn">H₂</button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className="btn">H₃</button>
          <button onClick={() => editor.chain().focus().toggleBold().run()} className="btn font-bold">B</button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()} className="btn italic">I</button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="btn underline">U</button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className="btn">⬅</button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className="btn">↔</button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className="btn">➡</button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn">• List</button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn">1. List</button>
          <button onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} className="btn">✎</button>

          {/* Insert Image from URL */}
          <button
            onClick={() => {
              const url = window.prompt('Enter image URL')
              if (url) {
                editor.chain().focus().setImage({ src: url }).run()
              }
            }}
            className="btn"
          >
            🌐 Img URL
          </button>

          {/* Upload local image */}
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const reader = new FileReader()
              reader.onload = () => {
                editor.chain().focus().setImage({ src: reader.result }).run()
              }
              reader.readAsDataURL(file)
            }}
            className="hidden"
            id="upload-img"
          />
          <label htmlFor="upload-img" className="btn cursor-pointer">📷 Upload</label>
        </div>

        {/* Editor content */}
        <EditorContent editor={editor} className="min-h-[150px] p-3 focus:outline-none list-disc list-inside" />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Submit
      </button>
    </div>
  )
}
