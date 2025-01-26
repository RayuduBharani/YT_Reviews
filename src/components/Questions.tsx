"use client"
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

export default function Questions() {
    const questions = [
        { name: "Content Quality" },
        { name: "Production Value" },
        { name: "Engagement Level" },
        { name: "Improvement Suggestions" },
        { name: "Channel Description Review" },
        { name: "Niche Authority" },
        { name: "Audience Interaction" },
        { name: "SEO Optimization" },
        { name: "Thumbnail Quality" },
    ];
    const percentageOptions = [
        { value: 100, label: "100%" },
        { value: 75, label: "75%" },
        { value: 50, label: "50%" },
        { value: 25, label: "25%" },
        { value: 10, label: "10%" },
        { value: 0, label: "None" },
    ];

    const [visable, setVisable] = useState<{ [key: string]: number }>({});

    function handleGetReview(questionName: string, value: number) {
        setVisable(prev => ({
            ...prev,
            [questionName]: value
        }));
    }
    console.log(visable)

    return (
        <>
            {
                questions.map((item, index) => (
                    <div key={index} className="space-y-4">
                        <label className="font-semibold"><span>{index + 1} . </span>{item.name}</label>
                        <RadioGroup defaultValue="0" name='value' className="flex gap-4 flex-wrap">
                            {percentageOptions.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <RadioGroupItem
                                        onClick={() => handleGetReview(item.name, option.value)}
                                        value={option.value.toString()}
                                        id={`${item.name}-${option.value}`}
                                    />
                                    <Label htmlFor={`${item.name}-${option.value}`}>
                                        {option.label}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>

                        <div className="mt-4 w-full h-fit">
                            {visable[item.name] === 100 && (
                                <p className="text-green-600 font-semibold">
                                    Exceptional work! Your content stands out with top-notch quality.
                                </p>
                            )}
                            {visable[item.name] === 75 && (
                                <p className="text-blue-600 font-semibold">
                                    Great job! Your content is impressive and well-received.
                                </p>
                            )}
                            {visable[item.name] === 50 && (
                                <p className="text-yellow-600 font-semibold">
                                    Decent effort! Your content is satisfactory but has room for improvement.
                                </p>
                            )}
                            {visable[item.name] === 25 && (
                                <p className="text-orange-600 font-semibold">
                                    Fair attempt! Consider enhancing certain aspects to make your content shine.
                                </p>
                            )}
                            {visable[item.name] === 10 && (
                                <p className="text-red-600 font-semibold">
                                    Needs work! Focus on improving critical areas to elevate your content quality.
                                </p>
                            )}
                        </div>

                        <Separator className='mt-3' />
                    </div>
                ))
            }
            <div className='space-y-2'>
                <Label id='comments'>Additional Comments</Label>
                <Textarea name='comments' />
            </div>
        </>
    )
}
