import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { AddOptions, FindOptions } from '@/app/actions/actions'
import { Input } from './ui/input'
import DeleteOptions from './DeleteOptions'

export default async function AdminQuestionsView() {
    const optionsData = await FindOptions()
    const usedPercentages = optionsData.map(option => option.percentage)
    
    return (
        <div className='w-full h-fit space-y-6 p-4'>
            <form action={AddOptions}>
                <h2 className="text-lg font-bold mb-4">Add Options</h2>
                <div className="flex flex-col sm:flex-row gap-2">
                    <Input
                        className='w-full sm:w-[80%]'
                        name='options'
                        placeholder='Enter option'
                    />
                    <Select name="percentage">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Percentage" />
                        </SelectTrigger>
                        <SelectContent>
                            {[100, 75, 50, 10].map((percent) => (
                                <SelectItem 
                                    key={percent}
                                    value={percent.toString()}
                                    disabled={usedPercentages.includes(percent)}
                                >
                                    {percent}%
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button disabled={optionsData.length >= 4} className="w-full mt-5 mb-5">Save Options</Button>
            </form>

            <div className='flex items-center justify-between'>
                <p className='text-lg text-primary font-bold'>All Questions</p>
            </div>
            {optionsData.length != 0 ?
                <div className='grid grid-cols-1 md:grid-cols-1 gap-4'>
                    {optionsData.map((option, index) => (
                        <div key={index} className='group p-4 sm:p-6 h-fit overflow-hidden rounded-lg border border-border hover:border-primary transition-all duration-300 shadow-sm'>
                            <div className='flex w-full h-auto items-start justify-between gap-2 sm:gap-4'>
                                <div className='flex gap-2 sm:gap-4 w-full h-auto'>
                                    <span className='text-red-500 font-bold min-w-[24px]'>{index + 1}.</span>
                                    <div>
                                        <p className='text-sm font-semibold text-foreground/70 break-words'>{option.option} <span className="text-primary pl-10">{option.percentage}%</span></p>
                                    </div>
                                </div>
                                <button className='opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-110'>
                                    <DeleteOptions id={option.id} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div> :
                <p className='text-center font-bold animate-pulse'>No questions found</p>
            }
        </div>
    )
}


