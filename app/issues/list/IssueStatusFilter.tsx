"use client";

import { Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";

const statuses: { label: string; value?: Status }[] = [
  { label: "All" },
  { label: "Open", value: "OPEN" },
  { label: "In Progress", value: "IN_PROGRESS" },
  { label: "Closed", value: "CLOSED" },
];

const IssueStatusFilter = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const handleFilter = (status: Status) => {
    const params = new URLSearchParams();
    if (status) {
      params.append("status", status);
    }
    if (searchParams.get("orderBy")) {
      params.append("orderBy", searchParams.get("orderBy")!);
    }
    const query = params.size ? "?" + params.toString() : "";
    push(`/issues/list` + query);
  };
  return (
    <>
      <Select.Root
        defaultValue={searchParams.get("status") || ""}
        onValueChange={handleFilter}
      >
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
