"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { cache } from "react"

export const AddQuestionFormData = async(formData: FormData) => {
    try {
        const questionsData = JSON.parse(formData.get('questionsData') as string);
        
        for (const qData of questionsData) {
            if(qData.question.trim().length > 300) {
                throw new Error("Question must be less than 300 characters");
            }

            if (qData.question.trim()) {
                await prisma.question.create({
                    data: {
                        name: qData.question.trim(),
                        options: {
                            create: qData.options.map((opt: { text: string, percentage: number }) => ({
                                text: opt.text.trim(),
                                percentage: opt.percentage
                            }))
                        }
                    }
                })
            }
        }
        redirect("/admin")
    } catch (error) {
        console.error("Error adding question:", error)
    }
}

export const deleteQuestion = async(id: number) => {
    try {
        await prisma.$transaction([
            prisma.option.deleteMany({
                where: { questionId: id }
            }),
            prisma.question.delete({
                where: { id }
            })
        ])
        revalidatePath("/admin")
    } catch (error) {
        console.error("Error deleting question:", error)
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