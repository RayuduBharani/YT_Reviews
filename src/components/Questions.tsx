"use client"
import React, { useState } from 'react'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import { Input } from "@/components/ui/input";

export default function Questions({ questions }: { questions: { id: number; name: string }[] }) {
    const percentageOptions = [
        { value: 100, label: "100%" },
        { value: 75, label: "75%" },
        { value: 50, label: "50%" },
        { value: 25, label: "25%" },
        { value: 10, label: "10%" },
        { value: 0, label: "None" },
    ];

    const [visable, setVisable] = useState<{ [key: string]: number }>({});
    const [comments, setComments] = useState<string>('');
    const [channelName, setChannelName] = useState('');
    const [formData, setFormData] = useState<{
        responses: { [key: string]: number };
        comments: string;
    }>({ responses: {}, comments: '' });

    function handleGetReview(questionName: string, value: number) {
        const newVisable = {
            ...visable,
            [questionName]: value
        };
        setVisable(newVisable);
        setFormData(prev => ({
            ...prev,
            responses: newVisable
        }));
    }

    function handleCommentsChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const newComments = e.target.value;
        setComments(newComments);
        setFormData(prev => ({
            ...prev,
            comments: newComments
        }));
    }
    const getFeedbackText = (value: number, question: string) => {
        const feedbacks: { [key: string]: { [key: number]: string } } = {
            "Content Quality": {
                100: "Exceptional content quality with excellent structure and engagement.",
                75: "Very good content quality, well-structured and engaging.",
                50: "Good content quality, could improve structure and engagement.",
                25: "Content quality needs work on structure and engagement.",
                10: "Content quality needs significant improvement in structure and engagement."
            },
            "Production Value": {
                100: "Outstanding production value with professional editing and visuals.",
                75: "High production value with good editing and visual elements.",
                50: "Decent production value, consider enhancing editing and visual elements.",
                25: "Basic production value, needs improvement in editing and visuals.",
                10: "Production value requires major improvements."
            },
            "default": {
                100: "Exceptional performance in this area!",
                75: "Very good performance with minor room for improvement.",
                50: "Good performance with some areas needing attention.",
                25: "Needs significant improvement in this area.",
                10: "Requires immediate attention and major improvements."
            }
        };

        return feedbacks[question]?.[value] || feedbacks["default"][value];
    };

    const generatePDF = (e: React.FormEvent) => {
        e.preventDefault();
        if (!channelName.trim()) {
            alert('Please enter a channel name');
            return;
        }
        
        const doc = new jsPDF();
        let yPos = 20;
        const pageHeight = doc.internal.pageSize.height;
        const margin = 15;
        
        const checkAndAddPage = (heightNeeded: number = 10) => {
            if (yPos + heightNeeded >= pageHeight - margin) {
                doc.addPage();
                yPos = 20;
                return true;
            }
            return false;
        };

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 0, 0);
        doc.text("YouTube Content Feedback Report", margin, yPos);
        yPos += 15;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(`Channel Name: ${channelName}`, margin, yPos);
        yPos += 12;

        if (formData.responses) {
            let counter = 1;
            Object.entries(formData.responses).forEach(([question, value]) => {
                checkAndAddPage(30);

                doc.setFont("helvetica", "bold");
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text(`${counter}. ${question}`, margin, yPos);
                yPos += 7;

                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.text(`Rating: ${value}%`, margin + 4, yPos);
                yPos += 7;

                const feedback = getFeedbackText(value as number, question);
                if (feedback) {
                    doc.setFontSize(11);
                    if (value === 100) doc.setTextColor(34, 197, 94);
                    else if (value === 75) doc.setTextColor(59, 130, 246);
                    else if (value === 50) doc.setTextColor(234, 179, 8);
                    else if (value === 25) doc.setTextColor(249, 115, 22);
                    else if (value === 10) doc.setTextColor(239, 68, 68);

                    const splitFeedback = doc.splitTextToSize(feedback, 175);
                    checkAndAddPage(splitFeedback.length * 6 + 10);
                    
                    doc.text(splitFeedback, margin + 4, yPos);
                    yPos += (splitFeedback.length * 6) + 10;
                }

                counter++;
            });
        }

        if (formData.comments) {
            checkAndAddPage(30);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text("Additional Comments:", margin, yPos);
            yPos += 7;

            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            
            const comments = formData.comments.split('\n').filter((comment: string) => comment.trim() !== '');
            comments.forEach((comment: string) => {
                const bulletPoint = `• ${comment.trim()}`;
                const splitComment = doc.splitTextToSize(bulletPoint, 165);
                
                checkAndAddPage(splitComment.length * 6 + 8);
                doc.text(splitComment, margin + 4, yPos);
                yPos += splitComment.length * 6 + 4;
            });
        }

        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "italic");
            doc.setFontSize(9);
            doc.setTextColor(128, 128, 128);
            doc.text(
                `Page ${i} of ${pageCount} | Generated on ${new Date().toLocaleDateString()}`,
                margin,
                pageHeight - 8
            );
        }

        doc.save("youtube-content-feedback-report.pdf");
    };

    if(questions.length === 0) {
        return <p className='w-full h-full text-center animate-pulse font-bold'>No questions found please add questions . . .</p>
    }

    return (
        <form onSubmit={generatePDF} className="max-w-4xl mx-auto space-y-10">
        <div className="space-y-2">
            <label className="font-semibold text-primary">Channel Name</label>
            <Input 
                placeholder="Enter the channel name" 
                className="bg-muted"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
            />
        </div>
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
                        <p className="text-primary font-semibold">
                            Exceptional work! Your content stands out with top-notch quality.
                        </p>
                    )}
                    {visable[item.name] === 75 && (
                        <p className="text-blue-700 font-semibold">
                            Great job! Your content is impressive and well-received.
                        </p>
                    )}
                    {visable[item.name] === 50 && (
                        <p className="text-yellow-500 font-semibold">
                            Decent effort! Your content is satisfactory but has room for improvement.
                        </p>
                    )}
                    {visable[item.name] === 25 && (
                        <p className="text-orange-500 font-semibold">
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
        <Textarea 
            name='comments' 
            className='bg-muted'
            value={comments}
            onChange={handleCommentsChange}
        />
    </div>
        <Button type="submit" className="w-full md:w-auto">
            Submit Review
        </Button>
    </form>
    )
}
