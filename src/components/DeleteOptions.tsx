"use client"
import { deleteOptions } from '@/app/actions/actions'
import { Trash } from 'lucide-react'
import React from 'react'

export default function DeleteOptions({ id }: { id: number }) {

    return (
        <Trash onClick={()=>deleteOptions(id)} className='h-5 w-5 text-red-500 hover:text-red-600' />
    )
}
