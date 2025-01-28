"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cache } from "react";

export const AddQuestionFormData = async(formData : FormData) => {
    const questions = formData.getAll('question') as string[]
    
    for (const question of questions) {
        if(question.trim().length > 255) {
            throw new Error("Question must be less than 255 characters");
        }

        if (question.trim()) {
            await prisma.question.create({
                data: {
                    name: question
                }
            })
        }
    }
    redirect("/admin/questions")
}

export const deleteQuestion = async(id: number) => {
    await prisma.question.delete({
        where: {
            id: id
        }
    })
    revalidatePath("admin/questions/add")
}

export const FindQuestion = cache(async() => {
    const questions = await prisma.question.findMany();
    return questions
} )

export async function AddOptions(formData: FormData) {
    const option = formData.get('options') as string
    const percentage = parseInt(formData.get('percentage') as string)
    
    if (!option || option.trim() === '') {
        throw new Error('Option must be filled');
    }

    if (!percentage || ![100, 75, 50, 10].includes(percentage)) {
        throw new Error('Invalid percentage value');
    }
    
    const result = await prisma.options.findMany()
    if (result.length >= 4) {
        throw new Error('Only 4 options are allowed');
    }

    // Check if percentage is already used
    const existingPercentage = await prisma.options.findFirst({
        where: { percentage: percentage }
    })
    if (existingPercentage) {
        throw new Error('This percentage is already assigned to another option');
    }
    
    if (option.trim().length > 255) {
        throw new Error("Option must be less than 255 characters");
    }

    await prisma.options.create({
        data: {
            option: option.trim(),
            percentage: percentage
        }
    })
    
    revalidatePath("/admin/options")
    redirect("/admin/options")
}

export async function deleteOptions(id: number) {
    await prisma.options.deleteMany({
        where: {
            id: id
        }
    })
    revalidatePath("admin/options")
}

export const FindOptions = cache(async() => {
    const options = await prisma.options.findMany({
        orderBy: {
            percentage: 'desc'
        }
    });
    return options
})