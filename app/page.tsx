import prisma from "@/prisma/client";
import LatestIssue from "./LatestIssue";
import IssueSummary from "./IssueSummary";
import IssueChart from "./IssueChart";
import { Flex, Grid } from "@radix-ui/themes";
import { Metadata } from "next";

export default async function Home() {
  const openIssueCount = await prisma.issue.count({
    where: {
      status: "OPEN",
    },
  });
  const closedIssueCount = await prisma.issue.count({
    where: {
      status: "CLOSED",
    },
  });
  const inProgressIssueCount = await prisma.issue.count({
    where: {
      status: "IN_PROGRESS",
    },
  });
  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary
          open={openIssueCount}
          inProgress={inProgressIssueCount}
          closed={closedIssueCount}
        />
        <IssueChart
          open={openIssueCount}
          inProgress={inProgressIssueCount}
          closed={closedIssueCount}
        />
      </Flex>
      <LatestIssue />
    </Grid>
  );
}

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Dashboard",
  description: "View a summary of project issues",
};