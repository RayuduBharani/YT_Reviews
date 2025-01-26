"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";

export const AddQuestionFormData = async(formData : FormData) => {
    const questions = formData.getAll('question') as string[]
    
    for (const question of questions) {
        if (question.trim()) {
            await prisma.question.create({
                data: {
                    name: question
                }
            })
        }
    }
    redirect("/admin")
}

export const deleteQuestion = async(id: number) => {
    await prisma.question.delete({
        where: {
            id: id
        }
    })
    revalidatePath("admin/add")
}

export const FindQuestion = cache(async() => {
    const questions = await prisma.question.findMany();
    return questions
} )