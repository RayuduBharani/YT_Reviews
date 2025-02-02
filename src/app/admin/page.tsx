import { ModeToggle } from '@/components/Toggle'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import DeleteQuestions from '@/components/DeleteQuestions'
import { FindQuestion } from '@/app/actions/actions'

export default async function AdminQuestionsView() {
    const questionsData = await FindQuestion()
    return (
        <div className='w-full max-w-4xl h-full mx-auto py-8 px-4'>
            <div className="h-fit flex justify-between mx-auto">
                <div className="flex items-center justify-center gap-3 mb-10">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33" height="33" viewBox="0 0 48 48">
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
                            opacity=".05" ></path>
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

            <div className='w-full h-fit space-y-6'></div>
                <div className='flex items-center justify-between'>
                    <p className='text-lg text-primary font-bold'>All Questions</p>
                    <Button asChild><Link href={"/admin/add"}>Add Question</Link></Button>
                </div>
                {questionsData.length != 0 ?
                    questionsData.map((question, index) => (
                        <div key={index} className='group p-4 mt-5 sm:p-6 h-fit overflow-hidden rounded-lg border border-border hover:border-primary transition-all duration-300 shadow-sm'>
                            <div className='flex w-full h-fit items-start justify-between gap-2 sm:gap-4'>
                                <div className='flex gap-2 sm:gap-4 min-w-0 flex-1'>
                                    <span className='text-red-500 font-bold flex-shrink-0 min-w-[20px] sm:min-w-[24px] text-sm sm:text-base'>{index + 1}.</span>
                                    <div className='space-y-2 w-full'>
                                        <p className='text-xs sm:text-sm font-semibold text-foreground/70 mb-5'>{question.name}</p>
                                        <div className='grid grid-cols-2 gap-2 text-xs'>
                                            {question.options.map((option, idx) => (
                                                <div key={idx} className='p-4 rounded-md bg-muted'>
                                                    {option.text} - {option.percentage}%
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <button className='flex-shrink-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200 hover:scale-110'>
                                    <DeleteQuestions id={question.id} />
                                </button>
                            </div>
                        </div>
                    )) :
                    <p className='text-center font-bold animate-pulse'>No questions found</p>
                }
            </div>
    )
}


