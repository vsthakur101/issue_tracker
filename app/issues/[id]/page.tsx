import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./IssueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import authOptions from "@/app/auth/authOptions";
import AssigneeSelect from "./AssigneeSelect";
import { cache } from "react";
import UpdateStatus from "./UpdateStatus";

interface Props {
  params: { id: string };
}

const fetchUser = cache((issueId: number) =>
  prisma.issue.findUnique({ where: { id: issueId } })
);

async function IssueDetailsPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (typeof +params.id !== "number") notFound();
  const issue = await fetchUser(parseInt(params.id));
  if (!issue) notFound();
  return (
    <Grid columns={{ initial: "1", md: "5" }} gap="5">
      <Box className="col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <UpdateStatus issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton IssueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
}

export async function generateMetadata({ params }: Props) {
  const issue = await fetchUser(parseInt(params.id));

  return {
    title: issue?.title,
    description: "Details of issue " + issue?.id,
  };
}

export default IssueDetailsPage;
