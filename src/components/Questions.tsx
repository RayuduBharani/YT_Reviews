"use client"
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import jsPDF from 'jspdf';
import { Input } from "@/components/ui/input";
import { Chart, ChartConfiguration } from 'chart.js/auto';
import html2canvas from 'html2canvas';

export default function Questions({ questions, options }: { questions: { id: number; name: string }[], options: { id: number; option: string; percentage: number }[] }) {

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

    const createPieChart = async (rating: number, primaryColor: [number, number, number]) => {
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '200px';
        chartContainer.style.height = '200px';
        chartContainer.style.backgroundColor = 'white';
        document.body.appendChild(chartContainer);

        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 200;
        chartContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            document.body.removeChild(chartContainer);
            return null;
        }

        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Rating', 'Remaining'],
                datasets: [{
                    data: [rating, 100 - rating],
                    backgroundColor: [
                        `rgb(${primaryColor.join(',')})`,
                        '#e5e7eb'
                    ]
                }]
            },
            options: {
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    }
                },
                animation: false
            }
        } as ChartConfiguration);

        await new Promise(resolve => setTimeout(resolve, 100));

        try {
            const chartImage = await html2canvas(chartContainer);
            document.body.removeChild(chartContainer);
            return chartImage.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating chart:', error);
            document.body.removeChild(chartContainer);
            return null;
        }
    };

    const loadImage = async (url: string): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                // Create a canvas with fixed dimensions for the circular image
                const canvas = document.createElement('canvas');
                const size = Math.min(img.width, img.height);
                canvas.width = size;
                canvas.height = size;
                const ctx = canvas.getContext('2d');
                
                if (ctx) {
                    // Create circular clipping path
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2, 0, Math.PI * 2);
                    ctx.closePath();
                    ctx.clip();

                    // Calculate dimensions to maintain aspect ratio
                    const aspectRatio = img.width / img.height;
                    let drawWidth = size;
                    let drawHeight = size;
                    let offsetX = 0;
                    let offsetY = 0;

                    if (aspectRatio > 1) {
                        // Image is wider than tall
                        drawWidth = size * aspectRatio;
                        offsetX = -(drawWidth - size) / 2;
                    } else {
                        // Image is taller than wide
                        drawHeight = size / aspectRatio;
                        offsetY = -(drawHeight - size) / 2;
                    }

                    // Draw the image within the circular clip
                    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

                    // Optional: Add a circle border
                    ctx.beginPath();
                    ctx.arc(size/2, size/2, size/2 - 1, 0, Math.PI * 2);
                    ctx.strokeStyle = '#22A34A'; // Match the primary color
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    resolve(canvas.toDataURL('image/png'));
                } else {
                    reject(new Error('Failed to get canvas context'));
                }
            };
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = url;
        });
    };
    

    const generatePDF = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!channelName.trim()) {
            alert('Please enter a channel name');
            return;
        }
        
        const doc = new jsPDF();
        
        const primaryColor: [number, number, number] = [22, 163, 74];
        const secondaryColor: [number, number, number] = [255, 255, 255];
        const watermarkColor: [number, number, number] = [240, 240, 240];
        const pageWidth = doc.internal.pageSize.width;
        const pageHeight = doc.internal.pageSize.height;
        
        const addWatermark = (page: number) => {
            doc.setPage(page);
            doc.setFontSize(60);
            doc.setTextColor(...watermarkColor);
            doc.setFont("helvetica", "bold");
            doc.text("Telugu TechPad", pageWidth/1.5, pageHeight/1.5, {
                align: 'center',
                angle: 45
            });
        };
        
        const addHeaderBackground = async () => {
            doc.setFillColor(245, 245, 245);
            doc.rect(0, 0, pageWidth, 25, 'F');
            
            try {
                const logoUrl = 'https://i.postimg.cc/2y1sBtJz/Whats-App-Image-2025-01-27-at-14-03-43-c22d23b7.jpg';
                const base64Image = await loadImage(logoUrl);
                doc.addImage(base64Image, 'PNG', 8, 3, 19, 19); // Slightly adjusted dimensions for better circular appearance
            } catch (error) {
                console.error('Error adding logo:', error);

                doc.setFillColor(...primaryColor);
                doc.circle(17.5, 12.5, 7.5, 'F');
                doc.setFillColor(...secondaryColor);
                doc.circle(17.5, 12.5, 5.5, 'F');
            }
            
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Telugu TechPad", 35, 14);
            
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text("Professional Channel Analysis Report", 35, 20);
        };
    
        let yPos = 40;
        const margin = 20;
        
        const checkAndAddPage = (heightNeeded: number = 10) => {
            if (yPos + heightNeeded >= pageHeight - margin) {
                doc.addPage();
                addWatermark(doc.getNumberOfPages());
                yPos = 40;
                return true;
            }
            return false;
        };
    
        await addHeaderBackground();
        addWatermark(1);
    
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(20);
        doc.setFont("helvetica", "bold");
        doc.text("Channel Performance Analysis", pageWidth/2, yPos, { align: 'center' });
        yPos += 15;
        
        doc.setFontSize(12);
        doc.text("Channel:", margin, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(channelName.toUpperCase(), margin + 19, yPos);
        
        doc.setFont("helvetica", "bold");
        doc.text("Review Date:", pageWidth - margin - 40, yPos);
        doc.setFont("helvetica", "normal");
        doc.text(new Date().toLocaleDateString(), pageWidth - margin - 13.6, yPos);
        yPos += 20;

        let totalScore = 0;
        let answeredQuestions = 0;
        
        if (formData.responses) {
            Object.values(formData.responses).forEach(value => {
                if (value > 0) {
                    totalScore += value;
                    answeredQuestions++;
                }
            });
        }

        const averageScore = answeredQuestions > 0 ? Math.round(totalScore / answeredQuestions) : 0;
        
        if (formData.responses) {
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(...primaryColor);
            doc.text("Detailed Performance Analysis", margin, yPos);
            yPos += 8;

            Object.entries(formData.responses).forEach(([question, value], index) => {
                checkAndAddPage(30);
                
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                const splitQuestion = doc.splitTextToSize(`${index + 1}. ${question}`, pageWidth - (2 * margin));
                doc.text(splitQuestion, margin, yPos);
                yPos += splitQuestion.length * 6;
                
                doc.setFillColor(...primaryColor);
                doc.roundedRect(margin, yPos - 4, 35, 6, 1, 1, 'F');
                doc.setFont("helvetica", "normal");
                doc.setTextColor(...secondaryColor);
                doc.setFontSize(9);
                doc.text(`${value}%`, margin + 5, yPos);
                
                // Find the matching option text
                const optionText = options.find(opt => opt.percentage === value)?.option;
if (optionText) {
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    const splitFeedback = doc.splitTextToSize(optionText, pageWidth - (2 * margin) - 10);
    doc.text(splitFeedback, margin + 45, yPos);
    yPos += (splitFeedback.length * 5) + 8;
}
            });
        }

        const chartImage = await createPieChart(averageScore, primaryColor);
        
        if (chartImage) {
            checkAndAddPage(80);
            yPos += 10;

            doc.setFillColor(245, 245, 245);
            doc.roundedRect(margin, yPos, pageWidth - (2 * margin), 70, 3, 3, 'F');

            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(...primaryColor);
            doc.text("Overall Rating", margin + 10, yPos + 10);

            doc.addImage(chartImage, 'PNG', margin + 10, yPos + 15, 40, 40);

            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const summaryText = [
                `Overall Rating: ${averageScore}%`,
                `Performance Level: ${averageScore >= 75 ? 'Excellent' : averageScore >= 50 ? 'Good' : 'Needs Improvement'}`,
                `Total Categories Evaluated: ${answeredQuestions}`,
                `Rating Status: ${averageScore >= 90 ? 'Outstanding' : averageScore >= 75 ? 'Very Good' : averageScore >= 50 ? 'Satisfactory' : 'Requires Attention'}`
            ];

            summaryText.forEach((text, index) => {
                doc.text(text, margin + 60, yPos + 25 + (index * 6));
            });

            yPos += 75;
        }

        if (formData.comments) {
            checkAndAddPage(40);
            
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor(...primaryColor);
            doc.text("Additional Insights", margin, yPos);
            yPos += 10;
            
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(80, 80, 80);
            
            formData.comments.split('\n')
                .filter(comment => comment.trim() !== '')
                .forEach(comment => {
                    const bulletPoint = `• ${comment.trim()}`;
                    const splitComment = doc.splitTextToSize(bulletPoint, pageWidth - (2 * margin) - 10);
                    
                    checkAndAddPage(splitComment.length * 6 + 8);
                    doc.text(splitComment, margin + 5, yPos);
                    yPos += splitComment.length * 6 + 4;
                });
        }

        checkAndAddPage(35);
        yPos += 10;
        
        doc.setFillColor(245, 245, 245);
        doc.roundedRect(margin, yPos, pageWidth - (2 * margin), 25, 3, 3, 'F');
        
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(...primaryColor);
        const finalStatement = "This report has been professionally reviewed and rated by Telugu TechPad, " +
                             "providing expert insights for YouTube channel optimization and growth.";
        const wrappedStatement = doc.splitTextToSize(finalStatement, pageWidth - (2 * margin) - 20);
        doc.text(wrappedStatement, pageWidth/2, yPos + 10, { align: 'center' });
    
        const pageCount = doc.getNumberOfPages();
        for(let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFont("helvetica", "normal"); 
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text(
                `© ${new Date().getFullYear()} Telugu TechPad | Professional Channel Review | Page ${i} of ${pageCount}`,
                pageWidth/2,
                pageHeight - 10,
                { align: 'center' }
            );
        }
    
        doc.save(`${channelName.toLowerCase()}-tech-pad-review.pdf`);
    };

    if(questions.length === 0) {
        return <p className='w-full h-full text-center animate-pulse font-bold'>No questions found please add questions . . .</p>
    }

    return (
        <form onSubmit={generatePDF} className="max-w-4xl mx-auto space-y-10 p-4">
            <div className="space-y-2">
                <label className="font-semibold text-primary">Channel Name</label>
                <Input 
                    placeholder="Enter the channel name" 
                    className="bg-muted"
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    required
                />
            </div>
            {questions.map((item, index) => (
                <div key={index} className="space-y-4">
                    <label className="font-semibold block whitespace-normal break-words">
                        <span>{index + 1} . </span>
                        {item.name}
                    </label>
                    <RadioGroup defaultValue="0" name='value' className="flex gap-4 flex-wrap">
                        {options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                                <RadioGroupItem
                                    onClick={() => handleGetReview(item.name, option.percentage)}
                                    value={option.percentage.toString()}
                                    id={`${item.name}-${option.percentage}`}
                                />
                                <Label 
                                    htmlFor={`${item.name}-${option.percentage}`}
                                    className="whitespace-nowrap"
                                >
                                    {`${option.percentage}%`}
                                </Label>
                            </div>
                        ))}
                    </RadioGroup>

                    <div className="mt-4 w-full">
                        {visable[item.name] && (
                            <p className={`font-semibold break-words ${
                                visable[item.name] >= 90 ? "text-primary" :
                                visable[item.name] >= 70 ? "text-blue-700" :
                                visable[item.name] >= 40 ? "text-yellow-500" :
                                visable[item.name] >= 20 ? "text-orange-500" : "text-red-600"
                            }`}>
                                {options.find(opt => opt.percentage === visable[item.name])?.option || 
                                "Please select an option"}
                            </p>
                        )}
                    </div>

                    <Separator className='mt-3' />
                </div>
            ))}
            <div className='space-y-2'>
                <Label id='comments'>Additional Comments</Label>
                <Textarea 
                    name='comments' 
                    className='bg-muted min-h-[100px]'
                    value={comments}
                    onChange={handleCommentsChange}
                    placeholder="Enter any additional observations or recommendations..."
                />
            </div>
            <Button type="submit" className="w-full md:w-auto">
                Generate Professional Review
            </Button>
        </form>
    );
}