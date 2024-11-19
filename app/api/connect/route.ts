import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
	try {
		const newUser = await prisma.user.create({
			data: {
				name: 'Nikhil',
				email: 'sharma@gmail.com',
			},
		})

		console.log(newUser)
		return NextResponse.json({ message: 'Hello' })
	} catch (error) {
		console.log(error)
		// console.error('Error fetching users:', error)
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
	}
}
