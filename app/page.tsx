import { Suspense } from 'react'
import QuillEditor from '@/components/Quill-Editor'
import prisma from '@/lib/prisma'

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
	const { noteId } = await searchParams
	let contentObj = null

	if (noteId && typeof noteId === 'string') {
		const response = await prisma.notes.findUnique({
			where: { id: noteId },
		})
		if (response) {
			contentObj = { name: response.name, content: response.content, createdAt: response.createdAt }
		}
	}

	return <Suspense fallback={<>Loading...</>}>{contentObj ? <QuillEditor contentObj={contentObj} /> : <QuillEditor />}</Suspense>
}
