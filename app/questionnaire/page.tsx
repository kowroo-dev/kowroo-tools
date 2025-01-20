import { QuestionnaireEditor } from "@/components/questionnaire-editor"

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <br />
            <h1 className="text-3xl font-semibold mb-6 text-center">Questionnaire Editor</h1>
            <QuestionnaireEditor />
        </div>
    )
}