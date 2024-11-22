import prisma from '@/lib/prisma'
import Link from 'next/link'
import React from 'react'

type AllNotes = {
	id: string
	name: string
	content: string
}

export const revalidate = 1

export default async function Page() {
	const allNotes: AllNotes[] = await prisma.notes.findMany()
	console.log(allNotes)

	return (
		<div className="p-4 flex flex-col gap-4">
			{allNotes.map((note, indx) => (
				<Link href={`/?noteId=${note.id}`} className="text-xl font-medium hover:cursor-pointer" key={indx}>
					<span className="mr-1">{indx + 1}.</span>
					{note.name}
				</Link>
			))}
		</div>
	)
}
