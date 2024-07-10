"use client";

import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { statuses } from "../list/IssueStatusFilter";
import { useRouter } from "next/navigation";

export default function UpdateStatus({ issue }: { issue: Issue }) {
  const { push, refresh } = useRouter();
  async function handleAssignee(status: Status) {
    try {
      await axios.patch(`/api/issues/${issue.id}`, {
        status: status || null,
      });
      toast.success("Status is updated.");
      push("/");
      refresh();
    } catch (error) {
      toast.error("Not able to update status.");
    }
  }
  return (
    <>
      <Select.Root
        defaultValue={issue.status || ""}
        onValueChange={handleAssignee}
      >
        <Select.Trigger placeholder="Status" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Status</Select.Label>
            {statuses.map((status) => (
              <Select.Item key={status.value} value={status.value || ""}>
                {status.label}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
}
