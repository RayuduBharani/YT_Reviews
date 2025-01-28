"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cache } from "react"

export const AddQuestionFormData = async(formData: FormData) => {
    try {
        const questionsData = JSON.parse(formData.get('questionsData') as string);
        
        if (!Array.isArray(questionsData)) {
            throw new Error("Invalid questions data format");
        }

        for (const qData of questionsData) {
            // Validate question
            if (!qData.question || typeof qData.question !== 'string') {
                throw new Error("Question is required and must be a string");
            }

            if (qData.question.trim().length > 300) {
                throw new Error("Question must be less than 300 characters");
            }

            // Validate options
            if (!Array.isArray(qData.options) || qData.options.length === 0) {
                throw new Error("Each question must have at least one option");
            }

            if (qData.question.trim()) {
                const createdQuestion = await prisma.question.create({
                    data: {
                        name: qData.question.trim(),
                        options: {
                            create: qData.options.map((opt: { text: string, percentage: number }) => {
                                if (!opt.text || typeof opt.text !== 'string') {
                                    throw new Error("Option text is required and must be a string");
                                }
                                if (typeof opt.percentage !== 'number') {
                                    throw new Error("Option percentage must be a number");
                                }
                                return {
                                    text: opt.text.trim(),
                                    percentage: opt.percentage
                                };
                            })
                        }
                    }
                });

                if (!createdQuestion) {
                    throw new Error("Failed to create question");
                }
            }
        }
        revalidatePath("/admin");
        return { success: true };  // Return success status instead of redirect
    } catch (error) {
        console.error("Error adding question:", error);
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
}

export const deleteQuestion = async(id: number) => {
    if (!id || typeof id !== 'number') {
        throw new Error('Invalid question ID');
    }

    try {
        const deleteOptions = prisma.option.deleteMany({
            where: { questionId: id }
        });

        const deleteQuestion = prisma.question.delete({
            where: { id }
        });

        await prisma.$transaction([deleteOptions, deleteQuestion]);
        
        revalidatePath("/admin");
        return { success: true };
    } catch (error) {
        console.error("Error deleting question:", error instanceof Error ? error.message : 'Unknown error');
        return { success: false, error: error instanceof Error ? error.message : 'Failed to delete question' };
    }
}

export const FindQuestion = cache(async() => {
    try {
        const questions = await prisma.question.findMany({
            include: {
                options: true
            }
        });
        return questions;
    } catch (error) {
        console.error("Database query failed:", error);
        return [];
    }
})