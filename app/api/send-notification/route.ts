import { NextResponse } from 'next/server'
import { initializeApp, cert, getApps } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

export async function POST(request: Request) {
    try {
        const { serviceAccount, title, body, notificationData, target } = await request.json()

        if (getApps().length === 0) {
            initializeApp({
                credential: cert(JSON.parse(serviceAccount))
            })
        }

        const message = {
            notification: {
                title,
                body,
            },
            data: notificationData || {},
            topic: target === 'android' ? 'android' : target === 'ios' ? 'ios' : 'all',
        }

        const response = await getMessaging().send(message)

        return NextResponse.json({ messageId: response }, { status: 200 })
    } catch (error) {
        console.error('Error sending notification:', error)
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
    }
}