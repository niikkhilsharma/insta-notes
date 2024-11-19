'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import hljs from 'highlight.js'
import axios from 'axios'
import { useSearchParams } from 'next/navigation'
import type Quill from 'quill'
import { useRouter } from 'next/navigation'

function Editor() {
	const quillRef = useRef<Quill | null>(null)
	const [loading, setLoading] = useState<boolean>(false)
	const [isMounted, setIsMounted] = useState(false)
	const router = useRouter()

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],
		['link', 'image', 'video', 'formula'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],

		['clean'], // remove formatting button
	]
	const params = useSearchParams()
	const noteId = params.get('noteId')

	async function getNoteContent() {
		const res = await axios.get(`/api/notes/get?noteId=${noteId}`)
		const response = res.data

		if (quillRef.current) {
			quillRef.current.root.innerHTML = response.content
		}
	}

	useEffect(() => {
		if (noteId && isMounted) getNoteContent()
	}, [noteId, isMounted])

	useEffect(() => {
		async function initQuill() {
			if (!quillRef.current) {
				const Quill = (await import('quill')).default

				quillRef.current = new Quill('#editor', {
					modules: {
						syntax: {
							hljs,
						},
						toolbar: toolbarOptions,
					},
					placeholder: 'Hello World',
					theme: 'snow',
				})

				quillRef.current.root.innerHTML = ``

				const toolbar = document.querySelector('.ql-toolbar.ql-snow')
				if (toolbar) {
					toolbar.setAttribute(
						'style',
						`position: sticky;
					 top: ${noteId ? '0' : '3.36rem'};
           background: white;
           z-index: 10;`
					)
				}
			}
		}
		if (isMounted) {
			initQuill()
		}

		return () => {
			quillRef.current = null
			const toolbar = document.querySelector('.ql-toolbar.ql-snow')
			toolbar?.remove()
		}
	}, [isMounted])

	const submitContent = async () => {
		if (typeof window !== 'undefined' && quillRef.current) {
			const name = prompt('Kindly enter the note name')
			const content = quillRef.current.root.innerHTML
			console.log(content)

			setLoading(true)
			try {
				const res = await axios.post('/api/notes/upload', {
					name,
					content,
				})
				alert('Success')
				router.push('/all-notes')
				console.log(res)
			} catch (error) {
				console.log(error)
				alert('Error uploading note')
			} finally {
				setLoading(false) // Stop loading
			}
		}
	}

	return (
		<div className="flex h-svh max-h-svh flex-col items-center justify-center gap-4 px-4">
			<div className="mx-auto my-2 h-full w-full max-w-screen-xl overflow-hidden overflow-y-scroll rounded-xl border-4 border-black">
				{!noteId && (
					<div id="toolbar" className="flex justify-end items-center sticky top-0 bg-white z-10">
						<button
							onClick={submitContent}
							className="border border-black m-2 py-2 px-4 rounded-md bg-black text-white hover:bg-black/90 text-sm font-medium"
							disabled={loading}
						>
							{loading ? 'Uploading...' : 'Save'}
						</button>
						<button
							onClick={() => {
								if (quillRef.current) {
									quillRef.current.root.innerHTML = ''
								}
							}}
							className="border border-red-500 m-2 py-2 px-4 rounded-md bg-red-500 text-white hover:bg-red-500/90 text-sm font-medium"
							disabled={loading}
						>
							Clear
						</button>
					</div>
				)}
				<div id="editor" />
			</div>
		</div>
	)
}

export default function Home() {
	return (
		<Suspense>
			<Editor />
		</Suspense>
	)
}
