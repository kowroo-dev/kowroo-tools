"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PlusCircle, Trash2, Save } from "lucide-react"
import { PhonePreview } from "./questionnaire-phone-preview"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export function NewQuestionnaireCreator() {
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>({
        surveyId: "",
        initPage: {
            title: "",
            description: "",
            isOptional: false,
        },
        questions: [],
        exitPage: {
            title: "",
            description: "",
        },
    })

    function handleQuestionnaireChange(field: string, value: string) {
        setQuestionnaire({ ...questionnaire, [field]: value })
    }

    function handleInitPageChange(field: string, value: string | boolean) {
        setQuestionnaire({
            ...questionnaire,
            initPage: { ...questionnaire.initPage, [field]: value },
        })
    }

    function handleExitPageChange(field: string, value: string) {
        setQuestionnaire({
            ...questionnaire,
            exitPage: { ...questionnaire.exitPage, [field]: value },
        })
    }

    function handleQuestionChange(index: number, updatedQuestion: Question) {
        const updatedQuestions = [...questionnaire.questions]
        updatedQuestions[index] = updatedQuestion
        setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
    }

    function addQuestion() {
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

    function removeQuestion(index: number) {
        const updatedQuestions = questionnaire.questions.filter((_, i) => i !== index)
        setQuestionnaire({ ...questionnaire, questions: updatedQuestions })
    }

    function saveQuestionnaire() {
        // Create a new FileInfo object
        const newFileInfo = {
            filename: `${questionnaire.surveyId}.json`,
            version: "1.0",
            lastModified: new Date().toISOString(),
        }

        // Download the questionnaire JSON file
        const questionnaireElement = document.createElement("a")
        const questionnaireFile = new Blob([JSON.stringify(questionnaire, null, 2)], { type: "application/json" })
        questionnaireElement.href = URL.createObjectURL(questionnaireFile)
        questionnaireElement.download = newFileInfo.filename
        document.body.appendChild(questionnaireElement)
        questionnaireElement.click()
        document.body.removeChild(questionnaireElement)

        // Fetch the current fileList.json
        fetch("/api/s3", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: "https://kowroo-questionnaire.s3.eu-west-1.amazonaws.com/fileList.json",
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                // Add the new file info to the list
                const updatedFiles = [...data.questionnaireFiles, newFileInfo]

                // Download the updated fileList.json
                const fileListElement = document.createElement("a")
                const fileList = new Blob([JSON.stringify({ questionnaireFiles: updatedFiles }, null, 2)], {
                    type: "application/json",
                })
                fileListElement.href = URL.createObjectURL(fileList)
                fileListElement.download = "fileList.json"
                document.body.appendChild(fileListElement)
                fileListElement.click()
                document.body.removeChild(fileListElement)
            })
            .catch((error) => {
                console.error("Error fetching fileList.json:", error)
            })
    }

    return (
        <div className="container mx-auto p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New Questionnaire</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="surveyId">Survey ID</Label>
                                <Input
                                    id="surveyId"
                                    value={questionnaire.surveyId}
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
                                            <QuestionEditor
                                                question={question}
                                                onChange={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
                                            />
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

                            <Button className="mt-4 w-full" onClick={saveQuestionnaire}>
                                <Save className="mr-2 h-4 w-4" /> Save Questionnaire
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <div className="hidden lg:block">
                    <div className="sticky top-4">
                        <h2 className="text-2xl font-bold mb-4">Phone Preview</h2>
                        <PhonePreview questionnaire={questionnaire} />
                    </div>
                </div>
            </div>
        </div>
    )
}


interface Question {
    id: string
    question: string
    options?: string[]
    type: "singleChoice" | "multiChoice" | "textEntry" | "numberEntry"
    isOptional: boolean
}

interface QuestionEditorProps {
    question: Question
    onChange: (updatedQuestion: Question) => void
}

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
    function handleChange(field: string, value: string | boolean | string[]) {
        onChange({ ...question, [field]: value })
    }

    return (
        <div className="space-y-2">
            <div>
                <Label htmlFor={`question-${question.id}`}>Question</Label>
                <Input
                    id={`question-${question.id}`}
                    value={question.question}
                    onChange={(e) => handleChange("question", e.target.value)}
                />
            </div>
            <div>
                <Label htmlFor={`type-${question.id}`}>Type</Label>
                <Select value={question.type} onValueChange={(value) => handleChange("type", value)}>
                    <SelectTrigger id={`type-${question.id}`}>
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
                                handleChange("options", newOptions)
                            }}
                            className="mt-2"
                        />
                    ))}
                    <Button
                        onClick={() => {
                            const newOptions = [...(question.options || []), ""]
                            handleChange("options", newOptions)
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
                    id={`optional-${question.id}`}
                    checked={question.isOptional}
                    onChange={(e) => handleChange("isOptional", e.target.checked)}
                />
                <Label htmlFor={`optional-${question.id}`}>Optional</Label>
            </div>
        </div>
    )
}

