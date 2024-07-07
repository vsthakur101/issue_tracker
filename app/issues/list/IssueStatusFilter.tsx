"use client";

import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter } from "next/navigation";

const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  const { push } = useRouter();
  const handleFilter = (status: Status) => {
    const query = status && `?status=${status}`;
    push(`/issues/list` + query);
  };
  return (
    <>
      <Select.Root onValueChange={handleFilter}>
        <Select.Trigger placeholder="Filter by status...."></Select.Trigger>
        <Select.Content>
          {statuses.map((item) => (
            <Select.Item key={item.value} value={item.value || " "}>
              {item.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  );
};

export default IssueStatusFilter;
