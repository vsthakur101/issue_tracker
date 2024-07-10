"use client";

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AssigneeSelect({ issue }: { issue: Issue }) {
  const { data: users, error, isLoading } = useUsers();
  const { push, refresh } = useRouter();

  async function handleAssignee(userId: string) {
    try {
      await axios.patch(`/api/issues/${issue.id}`, {
        assignedToUserId: userId || issue.assignedToUserId,
      });
      toast.success("User assigned to this issue.");
      push("/");
      refresh();
    } catch (error) {
      toast.error("Changed could not be saved.");
    }
  }

  if (error) return null;
  if (isLoading) return <Skeleton />;
  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || "ALL"}
        onValueChange={handleAssignee}
      >
        <Select.Trigger placeholder="Assign..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="unassigned">Unassigned</Select.Item>
            {users?.map((user) => (
              <Select.Item key={user?.id} value={user?.id}>
                {user?.name}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
      <Toaster />
    </>
  );
}

const useUsers = () =>
  useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });