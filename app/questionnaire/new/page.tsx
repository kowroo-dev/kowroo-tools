import { NewQuestionnaireCreator } from "@/components/questionnaire-creater"

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <br />
            <h1 className="text-3xl font-semibold mb-6 text-center">Questionnaire Creator</h1>
            <NewQuestionnaireCreator />
        </div>
    )
}