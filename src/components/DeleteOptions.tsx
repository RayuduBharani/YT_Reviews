"use client"
import { deleteOptions } from '@/app/actions/actions'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DeleteOptions({ id }: { id: number }) {
    const router = useRouter()
    
    async function handleDelete() {
        if (confirm('Are you sure you want to delete this option?')) {
            await deleteOptions(id)
            router.refresh()
        }
    }

    return (
        <Trash onClick={handleDelete} className="h-4 w-4 cursor-pointer hover:text-red-500" />
    )
}
