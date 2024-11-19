import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	try {
		const body = await req.json()
		const newNote = await prisma.notes.create({ data: { name: body.name, content: body.content } })
		console.log(newNote)

		return NextResponse.json({ newNote })
	} catch (error) {
		return NextResponse.json({ Message: 'Something went wrong.' }, { status: 500 })
	}
}
