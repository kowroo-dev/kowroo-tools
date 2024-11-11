import { NextRequest, NextResponse } from 'next/server'
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses"

interface EmailConfig {
    EMAIL_HOST: string;
    EMAIL_PORT: number;
    EMAIL_HOST_USER: string;
    EMAIL_HOST_PASSWORD: string;
    DEFAULT_FROM_EMAIL: string;
}

interface RequestBody {
    config: EmailConfig;
    recipients: string[];
    subject: string;
    message: string;
}

export async function POST(request: NextRequest) {
    const body: RequestBody = await request.json()
    const { config, recipients, subject, message } = body

    if (!config || !recipients || !subject || !message) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    try {
        console.log('Config: ', {
            accessKeyId: config.EMAIL_HOST_USER,
            secretAccessKey: config.EMAIL_HOST_PASSWORD,
        });
        const sesClient = new SESClient({
            region: "eu-west-1",
            credentials: {
                accessKeyId: config.EMAIL_HOST_USER,
                secretAccessKey: config.EMAIL_HOST_PASSWORD,
            },
        });

        const sendPromises = recipients.map(recipient => {
            const params = {
                Destination: {
                    ToAddresses: [recipient],
                },
                Message: {
                    Body: {
                        Html: {
                            Charset: "UTF-8",
                            Data: message,
                        },
                    },
                    Subject: {
                        Charset: "UTF-8",
                        Data: subject,
                    },
                },
                Source: config.DEFAULT_FROM_EMAIL,
            };

            return sesClient.send(new SendEmailCommand(params));
        });

        await Promise.all(sendPromises);

        return NextResponse.json({ message: 'Emails sent successfully' })
    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json({ error: 'Error sending emails' }, { status: 500 })
    }
}