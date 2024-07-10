import authOptions from "@/app/auth/authOptions";
import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 })
    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);
    if (!validation.success) NextResponse.json(validation.error.format(), { status: 400 });
    const { assignedToUserId, title, description, status } = body;
    if (assignedToUserId) {
        const user = await prisma.user.findUnique({
            where: {
                id: assignedToUserId
            }
        })
        if (!user)
            return NextResponse.json({ error: 'Invalid user' }, { status: 400 })
    }
    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(params?.id)
        }
    });
    if (!issue) NextResponse.json({ error: 'Invalid Issue' }, { status: 404 });
    const updatedIssue = await prisma.issue.update({
        where: {
            id: issue?.id
        },
        data: {
            title,
            description,
            assignedToUserId,
            status
        }
    });
    return NextResponse.json({ data: updatedIssue }, { status: 200 })
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({ message: 'Unauthorized access' }, { status: 401 })
    const issue = await prisma.issue.findUnique({
        where: {
            id: parseInt(params?.id)
        }
    });

    if (!issue) NextResponse.json({ error: 'Invalid Issue' }, { status: 404 });

    const deletedIssue = await prisma.issue.delete({
        where: {
            id: issue?.id
        }
    });
    return NextResponse.json({ data: deletedIssue }, { status: 200 })
}