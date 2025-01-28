import { ModeToggle } from '@/components/Toggle'
import Link from 'next/link'

export default async function Options() {
    return (
        <div className='w-full max-w-4xl h-full mx-auto py-8 px-4'>
            <div className="h-fit flex justify-between mx-auto">
                // ...existing header code...
            </div>
            <div className="text-center">
                <p>Options are now managed within questions.</p>
                <Link href="/admin" className="text-primary hover:underline">
                    Go to Questions
                </Link>
            </div>
        </div>
    )
}
