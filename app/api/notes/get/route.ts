import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url)
		const noteId = searchParams.get('noteId')

		const note = await prisma.notes.findUnique({
			where: { id: noteId },
		})

		return NextResponse.json(note)
	} catch (error) {
		// Handle any potential errors
		return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
	}
}
