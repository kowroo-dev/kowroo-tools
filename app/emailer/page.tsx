"use client";

import { useState, ChangeEvent } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface EmailConfig {
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_HOST_USER: string;
    EMAIL_HOST_PASSWORD: string;
    DEFAULT_FROM_EMAIL: string;
}

export default function EmailSender() {
    const [config, setConfig] = useState<EmailConfig | null>(null)
    const [recipients, setRecipients] = useState<string[]>([])
    const [subject, setSubject] = useState<string>('')
    const [message, setMessage] = useState<string>('')

    const handleConfigUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                try {
                    const json = JSON.parse(e.target?.result as string)
                    setConfig(json)
                } catch (error) {
                    console.error('Error parsing JSON:', error)
                }
            }
            reader.readAsText(file)
        }
    }

    const handleRecipientsUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e: ProgressEvent<FileReader>) => {
                const csv = e.target?.result as string
                const lines = csv.split('\n')
                const emails = lines.map(line => line.trim()).filter(line => line)
                setRecipients(emails)
            }
            reader.readAsText(file)
        }
    }

    const handleSendEmail = async () => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    config,
                    recipients,
                    subject,
                    message,
                }),
            })
            const data = await response.json()
            if (response.ok) {
                alert('Emails sent successfully!')
            } else {
                alert(`Error sending emails: ${data.error}`)
            }
        } catch (error) {
            console.error('Error sending emails:', error)
            alert('Error sending emails. Check console for details.')
        }
    }

    return (
        <main className="flex items-center justify-center gap-10 min-h-screen">

            <div className="max-w-2xl w-full">
                <Card className="mb-4 w-full">
                    <CardHeader>
                        <CardTitle>Email Configuration</CardTitle>
                        <CardDescription>Upload your email configuration as JSON</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input type="file" accept=".json" onChange={handleConfigUpload} />
                    </CardContent>
                    <CardFooter>
                        {config && <p className="text-sm text-green-600">Configuration loaded</p>}
                    </CardFooter>
                </Card>

                {
                    config && <Card className="mb-4 w-full">
                        <CardHeader>
                            <CardTitle>Recipient List</CardTitle>
                            <CardDescription>Upload your recipient list as CSV</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Input type="file" accept=".csv" onChange={handleRecipientsUpload} />
                            {
                                recipients.length > 0 &&
                                <div className="mt-4 flex space-x-2 overflow-x-auto">
                                    {recipients.map((recipient, index) => (
                                        <div
                                            key={index}
                                            className="py-1 px-2 bg-gray-200 rounded-2xl whitespace-nowrap text-sm"
                                        >
                                            {recipient}
                                        </div>
                                    ))}
                                </div>

                            }
                        </CardContent>
                        <CardFooter>
                            {recipients.length > 0 && <p className="text-sm text-green-600">{recipients.length} recipients loaded</p>}
                        </CardFooter>
                    </Card>
                }

                {
                    config && recipients.length > 0 &&
                    (
                        <Card className="mb-4 w-full">
                            <CardHeader>
                                <CardTitle>Compose Email</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                                        <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Enter email subject" />
                                    </div>
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                        <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter email message" rows={5} />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button onClick={handleSendEmail} disabled={!config || recipients.length === 0 || !subject || !message}>
                                    Send Emails
                                </Button>
                            </CardFooter>
                        </Card>
                    )
                }
            </div>
        </main>
    )
}