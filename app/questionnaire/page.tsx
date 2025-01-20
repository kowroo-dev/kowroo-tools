import Link from "next/link"

import { QuestionnaireEditor } from "@/components/questionnaire-editor"

export default function Home() {
    return (
        <div className="container mx-auto p-4">
            <br />
            <h1 className="text-3xl font-semibold mb-6 text-center">Questionnaire Editor</h1>
            <Link className="font-bold py-2 px-4 rounded mb-4 ml-4 border bg-blue-200 hover:bg-blue-300"
                href={`/questionnaire/new`}
            >
                Create New
            </Link>
            <QuestionnaireEditor />
        </div>
    )
}