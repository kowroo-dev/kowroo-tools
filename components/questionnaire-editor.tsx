"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save } from "lucide-react"
import { PhonePreview } from "./questionnaire-phone-preview"

interface FileInfo {
    filename: string
    version: string
    lastModified: string
}

interface Question {
    id: string
    question: string
    options?: string[]
    type: "singleChoice" | "multiChoice" | "textEntry" | "numberEntry"
    isOptional: boolean
}

interface Questionnaire {
    surveyId: string
    initPage: {
        title: string
        description: string
        isOptional: boolean
    }
    questions: Question[]
    exitPage: {
        title: string
        description: string
    }
}

export function QuestionnaireEditor() {
    const [files, setFiles] = useState<FileInfo[]>([])
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const [questionnaire, setQuestionnaire] = useState<Questionnaire | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetchFileList()
    }, [])

    useEffect(() => {
        if (selectedFile) {
            fetchQuestionnaireContent(selectedFile)
        }
    }, [selectedFile])

    async function fetchFileList() {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/s3", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: "https://kowroo-questionnaire.s3.eu-west-1.amazonaws.com/fileList.json",
                }),
            })
            if (!response.ok) {
                throw new Error("Failed to fetch file list")
            }
            const data = await response.json()
            setFiles(data.questionnaireFiles)
        } catch (error) {
            console.error("Error fetching file list:", error)
            setError("Failed to fetch file list. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    async function fetchQuestionnaireContent(filename: string) {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("/api/s3", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    url: `https://kowroo-questionnaire.s3.eu-west-1.amazonaws.com/${filename}`,
                }),
            })
            if (!response.ok) {
                throw new Error("Failed to fetch questionnaire content")
            }
            const data = await response.json()
            setQuestionnaire(data)
        } catch (error) {
            console.error("Error fetching questionnaire content:", error)
            setError("Failed to fetch questionnaire content. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    function handleQuestionnaireChange(field: string, value: string) {
        if (questionnaire) {
            setQuestionnaire({ ...questionnaire, [field]: value })
        }
    }

    function handleInitPageChange(field: string, value: string | boolean) {
        if (questionnaire) {
            setQuestionnaire({
                ...questionnaire,
                initPage: { ...questionnaire.initPage, [field]: value },
            })
        }
    }

    function handleExitPageChange(field: string, value: string) {
        if (questionnaire) {
            setQuestionnaire({
                ...questionnaire,
                exitPage: { ...questionnaire.exitPage, [field]: value },
            })
        }
    }

    function handleQuestionChange(index: number, field: string, value: string | boolean | string[]) {
        if (questionnaire) {
            const updatedQuestions = [...questionnaire.questions]
            updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
            setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
        }
    }

    function addQuestion() {
        if (questionnaire) {
            const newQuestion: Question = {
                id: `q${questionnaire.questions.length + 1}`,
                question: "",
                type: "singleChoice",
                isOptional: false,
                options: [""],
            }
            setQuestionnaire({
                ...questionnaire,
                questions: [...questionnaire.questions, newQuestion],
            })
        }
    }

    function removeQuestion(index: number) {
        if (questionnaire) {
            const updatedQuestions = questionnaire.questions.filter((_, i) => i !== index)
            setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
        }
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Select a file</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <p>Loading...</p>
                            ) : error ? (
                                <p className="text-red-500">{error}</p>
                            ) : (
                                <Select onValueChange={(value) => setSelectedFile(value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a file" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {files.map((file) => (
                                            <SelectItem key={file.filename} value={file.filename}>
                                                {file.filename} (v{file.version})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </CardContent>
                    </Card>

                    {questionnaire && !isLoading && !error && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Questionnaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="surveyId">Survey ID</Label>
                                    <Input
                                        id="surveyId"
                                        value={questionnaire.surveyId}
                                        disabled
                                        onChange={(e) => handleQuestionnaireChange("surveyId", e.target.value)}
                                    />
                                </div>

                                <hr />

                                <div>
                                    <h3 className="text-lg font-semibold">Initial Page</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <Label htmlFor="initTitle">Title</Label>
                                            <Input
                                                id="initTitle"
                                                value={questionnaire.initPage.title}
                                                onChange={(e) => handleInitPageChange("title", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="initDescription">Description</Label>
                                            <Textarea
                                                id="initDescription"
                                                value={questionnaire.initPage.description}
                                                onChange={(e) => handleInitPageChange("description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <hr />

                                <div>
                                    <h3 className="text-lg font-semibold">Questions</h3>
                                    {questionnaire.questions.map((question, index) => (
                                        <Card key={question.id} className="mt-4">
                                            <CardContent className="space-y-2">
                                                <div>
                                                    <Label htmlFor={`question-${index}`}>Question</Label>
                                                    <Input
                                                        id={`question-${index}`}
                                                        value={question.question}
                                                        onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`type-${index}`}>Type</Label>
                                                    <Select
                                                        value={question.type}
                                                        onValueChange={(value) => handleQuestionChange(index, "type", value)}
                                                    >
                                                        <SelectTrigger id={`type-${index}`}>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="singleChoice">Single Choice</SelectItem>
                                                            <SelectItem value="multiChoice">Multiple Choice</SelectItem>
                                                            <SelectItem value="textEntry">Text Entry</SelectItem>
                                                            <SelectItem value="numberEntry">Number Entry</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                {(question.type === "singleChoice" || question.type === "multiChoice") && (
                                                    <div>
                                                        <Label>Options</Label>
                                                        {question.options?.map((option, optionIndex) => (
                                                            <Input
                                                                key={optionIndex}
                                                                value={option}
                                                                onChange={(e) => {
                                                                    const newOptions = [...(question.options || [])]
                                                                    newOptions[optionIndex] = e.target.value
                                                                    handleQuestionChange(index, "options", newOptions)
                                                                }}
                                                                className="mt-2"
                                                            />
                                                        ))}
                                                        <Button
                                                            onClick={() => {
                                                                const newOptions = [...(question.options || []), ""]
                                                                handleQuestionChange(index, "options", newOptions)
                                                            }}
                                                            className="mt-2"
                                                        >
                                                            Add Option
                                                        </Button>
                                                    </div>
                                                )}
                                                <div className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        id={`optional-${index}`}
                                                        checked={question.isOptional}
                                                        onChange={(e) => handleQuestionChange(index, "isOptional", e.target.checked)}
                                                    />
                                                    <Label htmlFor={`optional-${index}`}>Optional</Label>
                                                </div>
                                                <Button variant="destructive" onClick={() => removeQuestion(index)}>
                                                    <Trash2 className="mr-2 h-4 w-4" /> Remove Question
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                    <Button onClick={addQuestion} className="mt-4">
                                        <PlusCircle className="mr-2 h-4 w-4" /> Add Question
                                    </Button>
                                </div>

                                <hr />

                                <div>
                                    <h3 className="text-lg font-semibold">Exit Page</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <Label htmlFor="exitTitle">Title</Label>
                                            <Input
                                                id="exitTitle"
                                                value={questionnaire.exitPage.title}
                                                onChange={(e) => handleExitPageChange("title", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="exitDescription">Description</Label>
                                            <Textarea
                                                id="exitDescription"
                                                value={questionnaire.exitPage.description}
                                                onChange={(e) => handleExitPageChange("description", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    className="mt-4 w-full"
                                    onClick={() => {
                                        console.log("Save questionnaire", questionnaire)
                                        // download the json file
                                        const element = document.createElement("a")
                                        const file = new Blob([JSON.stringify(questionnaire, null, 2)], { type: "application/json" })
                                        element.href = URL.createObjectURL(file)
                                        element.download = `${questionnaire.surveyId}.json`
                                        document.body.appendChild(element)
                                        element.click()
                                        document.body.removeChild(element)

                                        // update the date in fileList.json and download that too
                                        const updatedFiles = files.map((file) => {
                                            if (file.filename === selectedFile) {
                                                return { ...file, lastModified: new Date().toISOString() }
                                            }
                                            return file
                                        })

                                        const fileListElement = document.createElement("a")
                                        const fileList = new Blob([JSON.stringify({ questionnaireFiles: updatedFiles }, null, 2)], {
                                            type: "application/json",
                                        })
                                        fileListElement.href = URL.createObjectURL(fileList)
                                        fileListElement.download = "fileList.json"
                                        document.body.appendChild(fileListElement)
                                        fileListElement.click()
                                        document.body.removeChild(fileListElement)
                                    }}
                                >
                                    <Save className="mr-2 h-4 w-4" /> Save
                                </Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-4">
                        <h2 className="text-2xl font-bold mb-4">Phone Preview</h2>
                        {questionnaire && <PhonePreview questionnaire={questionnaire} />}
                    </div>
                </div>
            </div>
        </div>
    )
}

