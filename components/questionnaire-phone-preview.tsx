import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface PhonePreviewProps {
    questionnaire: {
        initPage: {
            title: string
            description: string
        }
        questions: {
            id: string
            question: string
            type: string
            options?: string[]
            isOptional: boolean
        }[]
        exitPage: {
            title: string
            description: string
        }
    }
}

export function PhonePreview({ questionnaire }: PhonePreviewProps) {
    return (
        <div className="w-[375px] h-[667px] bg-gray-800 rounded-[60px] shadow-xl overflow-hidden border-[14px] border-gray-800 relative">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[30px] bg-gray-800 rounded-b-[20px]"></div>
            <div className="w-full h-full bg-white overflow-y-auto p-4">
                <Card className="mb-4 mt-6">
                    <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-2">{questionnaire.initPage.title}</h2>
                        <p className="text-gray-600 mb-4">{questionnaire.initPage.description}</p>
                        <Button className="w-full">Start</Button>
                    </CardContent>
                </Card>

                {questionnaire.questions.map((question, index) => (
                    <Card key={question.id} className="mb-4">
                        <CardContent className="pt-6">
                            <h3 className="text-lg font-semibold mb-2">
                                {index + 1}. {question.question}
                                {question.isOptional && <span className="text-sm text-gray-500 ml-2">(Optional)</span>}
                            </h3>
                            {question.type === "singleChoice" && (
                                <RadioGroup>
                                    {question.options?.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2">
                                            <RadioGroupItem value={option} id={`${question.id}-${optionIndex}`} />
                                            <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            )}
                            {question.type === "multiChoice" && (
                                <div className="space-y-2">
                                    {question.options?.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center space-x-2">
                                            <Checkbox id={`${question.id}-${optionIndex}`} />
                                            <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {question.type === "textEntry" && (
                                <Input type="text" placeholder="Enter your answer" />
                            )}
                            {question.type === "numberEntry" && (
                                <Input type="number" placeholder="Enter a number" />
                            )}
                        </CardContent>
                    </Card>
                ))}

                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-2">{questionnaire.exitPage.title}</h2>
                        <p className="text-gray-600 mb-4">{questionnaire.exitPage.description}</p>
                        <Button className="w-full">Submit</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
