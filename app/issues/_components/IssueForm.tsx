"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { issueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue } from "@prisma/client";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import SimpleMDE from "react-simplemde-editor";
import { z } from "zod";

type IssueFormData = z.infer<typeof issueSchema>;

function IssueForm({ issue }: { issue?: Issue }) {
  const { push, refresh } = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueFormData>({
    resolver: zodResolver(issueSchema),
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <div className="max-w-xl">
      {error && (
        <Callout.Root color="red" className="mb-5">
          <Callout.Text>{error}</Callout.Text>
        </Callout.Root>
      )}
      <form
        className="space-y-3"
        onSubmit={handleSubmit(async (data) => {
          try {
            setIsSubmitting(true);
            if (issue) await axios.patch(`/api/issues/${issue.id}`, data);
            else await axios.post("/api/issues", data);
            push("/issues");
            refresh();
          } catch (error) {
            setIsSubmitting(false);
            setError("An unexpected error occured.");
          }
        })}
      >
        <TextField.Root
          placeholder="Search the issue..."
          defaultValue={issue?.title}
          {...register("title")}
        >
          <TextField.Slot></TextField.Slot>
        </TextField.Root>
        {errors.title && <ErrorMessage>{errors?.title?.message}</ErrorMessage>}
        <Controller
          name="description"
          defaultValue={issue?.description}
          control={control}
          render={({ field }) => {
            return <SimpleMDE placeholder="Description" {...field} />;
          }}
        />
        {errors.description && (
          <ErrorMessage>{errors?.description?.message}</ErrorMessage>
        )}
        <Button>
          {isSubmitting ? (
            <Spinner />
          ) : issue ? (
            "Update Issue"
          ) : (
            "Submit New Issue"
          )}
        </Button>
      </form>
    </div>
  );
}

export default IssueForm;
