import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { completeProject, useProjectAction, type Project } from "@/lib/projects";
import { HOUSEHOLD_SLUG } from "@/lib/household";

export function ProjectCompleteButton({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const complete = useProjectAction(completeProject, "Project completed");

  if (project.status === "complete") return null;

  return (
    <>
      <Button
        size="sm"
        variant="ghost"
        className="h-11"
        disabled={complete.isPending}
        onClick={() => setOpen(true)}
      >
        Complete
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete “{project.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The project will be marked complete in the household record. This cannot be undone
              from here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={complete.isPending}>Keep active</AlertDialogCancel>
            <AlertDialogAction
              disabled={complete.isPending}
              onClick={(event) => {
                event.preventDefault();
                complete.mutate(
                  {
                    p_household_slug: HOUSEHOLD_SLUG,
                    p_project_id: project.id,
                    p_confirm: true,
                  },
                  { onSuccess: () => setOpen(false) },
                );
              }}
            >
              {complete.isPending ? "Completing…" : "Complete project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
