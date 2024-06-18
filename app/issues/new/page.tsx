"use client";
import { ErrorMessage, Spinner } from "@/app/components";
import { createIssueSchema } from "@/app/validationSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, TextField } from "@radix-ui/themes";
import axios from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type IssueForm = z.infer<typeof createIssueSchema>;

function NewIssuePage() {
  const { push } = useRouter();
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueSchema),
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
            await axios.post("/api/issues", data);
            push("/issues");
          } catch (error) {
            setIsSubmitting(false);
            setError("An unexpected error occured.");
          }
        })}
      >
        <TextField.Root
          placeholder="Search the issue..."
          {...register("title")}
        >
          <TextField.Slot></TextField.Slot>
        </TextField.Root>
        {errors.title && <ErrorMessage>{errors?.title?.message}</ErrorMessage>}
        <Controller
          name="description"
          control={control}
          render={({ field }) => {
            return <SimpleMDE placeholder="Description" {...field} />;
          }}
        />
        {errors.description && (
          <ErrorMessage>{errors?.description?.message}</ErrorMessage>
        )}
        <Button>{isSubmitting ? <Spinner /> : "Submit New Issue"}</Button>
      </form>
    </div>
  );
}

export default NewIssuePage;
