'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import IPhoneNotification from '@/components/iphone-notification'

type NotificationData = {
  [key: string]: string
}

// type NotificationType = {
//   title: string
//   body: string
//   data: NotificationData
//   target: "all" | "test" | "android-version" | "ios-version"
// }

// type NotificationTemplateType = {
//   [key: string]: NotificationType
// }

// const templates: NotificationTemplateType = {
//   "new-update-all": {
//     title: "New Feature Out Now",
//     body: "Check out our new feature!",
//     data: {
//       type: "new-update",
//       version: "1.0.0",
//       action: "open-updates-page",
//     },
//     target: "all",
//   },
//   "new-update-android": {
//     title: "New Feature Out Now",
//     body: "Check out our new feature!",
//     data: {
//       type: "new-update",
//       version: "1.0.0",
//       action: "open-updates-page",
//     },
//     target: "android-version",
//   },
//   "new-update-ios": {
//     title: "New Feature Out Now",
//     body: "Check out our new feature!",
//     data: {
//       type: "new-update",
//       version: "1.0.0",
//       action: "open-updates-page",
//     },
//     target: "ios-version",
//   },
// };

export default function Page() {
  const [serviceAccount, setServiceAccount] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [notificationData, setNotificationData] = useState<NotificationData>({})
  const [target, setTarget] = useState('all')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          JSON.parse(e.target?.result as string)
          setServiceAccount(e.target?.result as string)
          toast.success("Service account loaded. You can now send notifications.")
        } catch (error) {
          toast.error("Invalid JSON file.", {
            description: (error as Error).message,
          })
        }
      }
      reader.readAsText(file)
    }
  }

  const sendNotification = async () => {
    if (!serviceAccount) {
      toast.error("Please upload a service account JSON file first.")
      return
    }

    try {
      const response = await fetch('/api/send-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceAccount,
          title,
          body,
          notificationData,
          target: target,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success(`Notification sent successfully. Message ID: ${data.messageId}`)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast.error(`Failed to send notification: ${error}`)
    }
  }

  return (
    <main
      className="flex items-center justify-center gap-10 min-h-screen"
    >
      {
        serviceAccount && (
          <div className="fixed top-4 right-4 z-50">
            <Button
              onClick={() => setServiceAccount(null)}
              variant="ghost"
            >
              Clear Service Account
            </Button>
          </div>
        )
      }
      {
        serviceAccount &&
        <IPhoneNotification notification={
          {
            title: title,
            description: body,
            image: "kowroo_logo.png"
          }
        } />

      }
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Firebase Notification Sender</CardTitle>
          <CardDescription>Upload your service account JSON and send notifications to your users.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="serviceAccount">Upload Service Account JSON</Label>
            <Input id="serviceAccount" className='mt-2' type="file" accept=".json" onChange={handleFileUpload} />
          </div>
          {serviceAccount && (
            <>
              <div>
                <Label htmlFor="title">Notification Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="body">Notification Body</Label>
                <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} />
              </div>
              <div>
                <Label>Notification Data (Key-Value Pairs)</Label>
                <div className="space-y-2">
                  {Object.entries(notificationData).map(([key, value], index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder="Key"
                        value={key}
                        onChange={(e) => {
                          const newNotificationData = { ...notificationData }
                          const newKey = e.target.value
                          newNotificationData[newKey] = newNotificationData[key]
                          delete newNotificationData[key]
                          setNotificationData(newNotificationData)
                        }}
                      />
                      <Input
                        placeholder="Value"
                        value={value as string}
                        onChange={(e) => {
                          const newNotificationData = { ...notificationData }
                          newNotificationData[key] = e.target.value
                          setNotificationData(newNotificationData)
                        }}
                      />
                      <Button
                        variant="ghost"
                        onClick={() => {
                          const newNotificationData = { ...notificationData }
                          delete newNotificationData[key]
                          setNotificationData(newNotificationData)
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newNotificationData = { ...notificationData }
                      newNotificationData[`key${Object.keys(newNotificationData).length + 1}`] = ''
                      setNotificationData(newNotificationData)
                    }}
                  >
                    Add Key-Value Pair
                  </Button>
                </div>
              </div>
              <div>
                <Label>Target Audience (Topics)</Label>
              </div>
              <RadioGroup value={target} onValueChange={setTarget}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All Users</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="test" id="test" />
                  <Label htmlFor="test">Test Channel (all users)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="android-version" id="android" />
                  <Label htmlFor="android">Android Users Only</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ios-version" id="ios" />
                  <Label htmlFor="ios">iOS Users Only</Label>
                </div>
              </RadioGroup>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={sendNotification} disabled={!serviceAccount || !title || !body}>
            Send Notification
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}