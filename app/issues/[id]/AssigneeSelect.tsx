"use client";

import { Issue, User } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import toast, { Toaster } from "react-hot-toast";

export default function AssigneeSelect({ issue }: { issue: Issue }) {
  const {
    data: users,
    error,
    isLoading,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => axios.get("/api/users").then((res) => res.data),
    staleTime: 60 * 1000, //60s
    retry: 3,
  });

  if (error) return null;
  if (isLoading) return <Skeleton />;
  return (
    <>
      <Select.Root
        defaultValue={issue.assignedToUserId || ""}
        onValueChange={async (userId) => {
          try {
            await axios.patch(`/api/issues/${issue.id}`, {
              assignedToUserId: userId || null,
            });
            toast.success("User assigned to this issue.");
          } catch (error) {
            toast.error("Changed could not be saved.");
          }
        }}
      >
        <Select.Trigger placeholder="Assignee..." />
        <Select.Content>
          <Select.Group>
            <Select.Label>Suggestions</Select.Label>
            <Select.Item value="">Unassigned</Select.Item>
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
