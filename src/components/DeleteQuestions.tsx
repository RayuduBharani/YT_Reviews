"use client"
import { deleteQuestion } from '@/app/actions/actions'
import { Trash } from 'lucide-react'
import React from 'react'

export default function DeleteQuestions({ id }: { id: number }) {

    return (
        <Trash onClick={()=>deleteQuestion(id)} className='h-5 w-5 text-red-500 hover:text-red-600' />
    )
}
