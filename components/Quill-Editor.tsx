'use client'

import React, { useEffect, useRef, useState } from 'react'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import hljs from 'highlight.js'
import type Quill from 'quill'
import { useRouter } from 'next/navigation'
import { toolbarOptions } from '@/utils/data'
import axios from 'axios'

export default function QuillEditor({
	noteId,
	contentObj,
}: {
	noteId?: string | string[]
	contentObj?: null | { name: string; content: string; createdAt: Date }
}) {
	const router = useRouter()
	const quillRef = useRef<Quill | null>(null)
	const [loading, setLoading] = useState<boolean>(false)

	useEffect(() => {
		async function initQuill() {
			if (!quillRef.current) {
				const Quill = (await import('quill')).default

				const toolbar = document.querySelector('.ql-toolbar.ql-snow')
				if (toolbar) {
					toolbar.setAttribute(
						'style',
						`position: sticky;
					 top: ${contentObj?.content ? '0' : '3.36rem'};
           background: white;
           z-index: 10;`
					)
				}
				console.log(toolbar)

				quillRef.current = new Quill('#editor', {
					modules: {
						syntax: {
							hljs,
						},
						toolbar: toolbar ? null : toolbarOptions,
					},
					placeholder: 'Hello World',
					theme: 'snow',
				})
				if (!toolbar) {
					const newToolbar = document.querySelector('.ql-toolbar.ql-snow')
					if (newToolbar) {
						newToolbar.setAttribute(
							'style',
							`position: sticky;
					 top: ${contentObj?.content ? '0' : '3.36rem'};
           background: white;
           z-index: 10;`
						)
					}
				}
				quillRef.current.root.innerHTML = contentObj?.content ? contentObj.content : ``
			} else if (contentObj?.content) {
				quillRef.current.root.innerHTML = contentObj?.content ? contentObj.content : ``
			}
		}

		initQuill()

		return () => {
			quillRef.current = null
			const toolbar = document.querySelector('.ql-toolbar.ql-snow')
			toolbar?.remove()
		}
	}, [noteId])

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
				{!contentObj?.content && (
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
