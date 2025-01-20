'use client'

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Bell } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function DevToolsGrid() {
  const tools = [
    {
      title: "Emailer",
      description: "SES email management tool",
      icon: <Mail className="h-6 w-6" />,
      badge: "New",
      route: "/emailer",
    },
    {
      title: "Notifier",
      description: "Firebase-powered notification system",
      icon: <Bell className="h-6 w-6" />,
      badge: "New",
      route: "/app-notifier",
    },
    {
      title: "Questionnaire Editor",
      description: "Create and manage questionnaires",
      icon: <Bell className="h-6 w-6" />,
      badge: "New",
      route: "/questionnaire",
    },
    
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Developer Toolbox
        </motion.h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool, index) => (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={tool.route}>
                <Card className="hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {tool.icon}
                        <CardTitle className="text-xl">{tool.title}</CardTitle>
                      </div>
                      <Badge variant="secondary">{tool.badge}</Badge>
                    </div>
                    <CardDescription className="mt-2">{tool.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}