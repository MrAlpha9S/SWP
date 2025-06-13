import React from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'

export default function Editor() {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: '<p>hello world</p>',
  })

  const handleSubmit = () => {
    if (editor) {
      const html = editor.getHTML()
      console.log('Submitted content:', html)
    }
  }

  return (
    <div className="bg-white max-w-3xl mx-auto rounded-md mt-10 p-10">
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
        </div>

        {/* Editor area */}
        <EditorContent editor={editor} className="min-h-[150px] p-3 focus:outline-none list-disc ml-6" />
      </div>

      {/* Submit */}
      <button onClick={handleSubmit} className="mt-3 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
        Submit
      </button>
    </div>
  )
}
