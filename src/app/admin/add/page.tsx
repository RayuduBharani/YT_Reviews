'use client'

import { ModeToggle } from '@/components/Toggle'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash } from 'lucide-react'
import { AddQuestionFormData } from '@/app/actions/actions'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';

export default function AddQuestionPage() {
    const [questions, setQuestions] = useState<Array<{
        question: string;
        options: Array<{ text: string; percentage: number }>
    }>>([{
        question: '',
        options: [
            { text: '', percentage: 100 },
            { text: '', percentage: 75 },
            { text: '', percentage: 50 },
            { text: '', percentage: 10 }
        ]
    }])

    const handleAddQuestion = () => {
        setQuestions([...questions, {
            question: '',
            options: [
                { text: '', percentage: 100 },
                { text: '', percentage: 75 },
                { text: '', percentage: 50 },
                { text: '', percentage: 10 }
            ]
        }])
    }

    const handleDeleteQuestion = (index: number) => {
        const newQuestions = questions.filter((_, i) => i !== index)
        setQuestions(newQuestions)
    }

    const handleQuestionChange = (index: number, value: string) => {
        const newQuestions = [...questions]
        newQuestions[index].question = value
        setQuestions(newQuestions)
    }

    const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
        const newQuestions = [...questions]
        newQuestions[questionIndex].options[optionIndex].text = value
        setQuestions(newQuestions)
    }

    const isFormValid = questions.every(q => 
        q.question.trim() !== '' && 
        q.options.every(opt => opt.text.trim() !== '')
    );

    const router = useRouter();
    
    const handleSubmit = async (formData: FormData) => {
        const questionsData = questions.map(q => ({
            question: q.question,
            options: q.options
        }));
        formData.append('questionsData', JSON.stringify(questionsData));
        const result = await AddQuestionFormData(formData);
        if (result.success) {
            router.push('/admin');
        } else {
            // Handle error case
            console.error(result.error);
        }
    };

    return (
        <form
            action={handleSubmit}
            className="w-full max-w-4xl h-full mx-auto py-6 px-4"
        >
            <div className="h-fit flex justify-between mx-auto">
                <div className="flex items-center justify-center gap-3 mb-10">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        width="33"
                        height="33"
                        viewBox="0 0 48 48"
                    >
                        <linearGradient
                            id="PgB_UHa29h0TpFV_moJI9a_9a46bTk3awwI_gr1"
                            x1="9.816"
                            x2="41.246"
                            y1="9.871"
                            y2="41.301"
                            gradientUnits="userSpaceOnUse"
                        >
                            <stop offset="0" stopColor="#f44f5a"></stop>
                            <stop offset=".443" stopColor="#ee3d4a"></stop>
                            <stop offset="1" stopColor="#e52030"></stop>
                        </linearGradient>
                        <path
                            fill="url(#PgB_UHa29h0TpFV_moJI9a_9a46bTk3awwI_gr1)"
                            d="M45.012,34.56c-0.439,2.24-2.304,3.947-4.608,4.267C36.783,39.36,30.748,40,23.945,40	c-6.693,0-12.728-0.64-16.459-1.173c-2.304-0.32-4.17-2.027-4.608-4.267C2.439,32.107,2,28.48,2,24s0.439-8.107,0.878-10.56	c0.439-2.24,2.304-3.947,4.608-4.267C11.107,8.64,17.142,8,23.945,8s12.728,0.64,16.459,1.173c2.304,0.32,4.17,2.027,4.608,4.267	C45.451,15.893,46,19.52,46,24C45.89,28.48,45.451,32.107,45.012,34.56z"
                        ></path>
                        <path
                            d="M32.352,22.44l-11.436-7.624c-0.577-0.385-1.314-0.421-1.925-0.093C18.38,15.05,18,15.683,18,16.376	v15.248c0,0.693,0.38,1.327,0.991,1.654c0.278,0.149,0.581,0.222,0.884,0.222c0.364,0,0.726-0.106,1.04-0.315l11.436-7.624	c0.523-0.349,0.835-0.932,0.835-1.56C33.187,23.372,32.874,22.789,32.352,22.44z"
                            opacity=".05"
                        ></path>
                        <path
                            d="M20.681,15.237l10.79,7.194c0.689,0.495,1.153,0.938,1.153,1.513c0,0.575-0.224,0.976-0.715,1.334	c-0.371,0.27-11.045,7.364-11.045,7.364c-0.901,0.604-2.364,0.476-2.364-1.499V16.744C18.5,14.739,20.084,14.839,20.681,15.237z"
                            opacity=".07"
                        ></path>
                        <path
                            fill="#fff"
                            d="M19,31.568V16.433c0-0.743,0.828-1.187,1.447-0.774l11.352,7.568c0.553,0.368,0.553,1.18,0,1.549	l-11.352,7.568C19.828,32.755,19,32.312,19,31.568z"
                        ></path>
                    </svg>
                    <h1 className="font-bold sm:text-2xl"><Link href={"/"}>YouTube Channel Review</Link></h1>
                </div>

                <ModeToggle />
            </div>

            <div className="w-full h-fit space-y-6">
                {questions.map((question, index) => (
                    <div key={index} className="flex flex-col space-y-4 p-4 border rounded-lg">
                        <div className="flex flex-col space-y-2">
                            <Label htmlFor={`question-${index}`}>Question {index + 1}</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id={`question-${index}`}
                                    placeholder="Enter the question"
                                    className="bg-muted"
                                    required
                                    value={question.question}
                                    onChange={(e) => handleQuestionChange(index, e.target.value)}
                                />
                                <Trash
                                    color="red"
                                    className="cursor-pointer"
                                    onClick={() => handleDeleteQuestion(index)}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {question.options.map((option, optionIndex) => (
                                <div key={optionIndex} className="flex flex-col space-y-2">
                                    <Label>Option {optionIndex + 1} ({option.percentage}%)</Label>
                                    <Input
                                        placeholder={`Enter option for ${option.percentage}%`}
                                        className="bg-muted"
                                        required
                                        value={option.text}
                                        onChange={(e) => handleOptionChange(index, optionIndex, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-4 mt-8 max-sm:space-y-3 max-sm:flex-col max-sm:gap-0"></div>
                <Button type="button" variant="outline" onClick={handleAddQuestion}>
                    Add New Question
                </Button>
                <Button type="submit" disabled={!isFormValid}>
                    Save Questions
                </Button>
        </form>
    )
}
