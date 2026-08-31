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
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { completeProject, useProjectAction, useProjects, type Project } from "@/lib/projects";
import { HOUSEHOLD_SLUG, formatDayTime } from "@/lib/household";

const STATUS_LABELS: Record<string, string> = {
  action_required: "Action required",
  waiting_external: "Waiting on someone",
  scheduled: "Scheduled",
  blocked: "Blocked",
};

export function ProjectsSection({ enabled }: { enabled: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [completing, setCompleting] = useState<Project | null>(null);

  const projects = useProjects(enabled);
  const complete = useProjectAction(completeProject, "Project completed");

  const list = projects.data ?? [];

  if (!enabled) return null;
  if (projects.isPending) return null;
  if (projects.error) {
    return <p className="text-sm text-critical">{(projects.error as Error).message}</p>;
  }
  if (list.length === 0) return null;

  return (
    <div className="space-y-3">
      {list.length > 2 && (
        <Button
          size="sm"
          variant="ghost"
          className="h-10 px-2"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show fewer" : `Show all ${list.length} projects`}
        </Button>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {(expanded ? list : list.slice(0, 2)).map((project) => (
          <div key={project.id} className="rounded-xl border bg-card p-4 shadow-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-medium text-foreground">{project.name}</p>
              {project.status && (
                <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                  {STATUS_LABELS[project.status] ?? project.status}
                </span>
              )}
            </div>
            <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
              {project.next_action && <p>Next: {project.next_action}</p>}
              {project.waiting_on && <p>Waiting on: {project.waiting_on}</p>}
              {project.follow_up_at && (
                <p>Follow up {formatDayTime(project.follow_up_at) ?? project.follow_up_at}</p>
              )}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <ProjectDialog
                project={project}
                trigger={
                  <Button size="sm" variant="outline" className="h-10">
                    Edit
                  </Button>
                }
              />
              <Button
                size="sm"
                variant="ghost"
                className="h-10"
                disabled={complete.isPending}
                onClick={() => setCompleting(project)}
              >
                Complete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={completing !== null} onOpenChange={(o) => !o && setCompleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete “{completing?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              The project will be marked complete in the household record. This cannot be undone
              from here.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={complete.isPending}>Keep active</AlertDialogCancel>
            <AlertDialogAction
              disabled={complete.isPending}
              onClick={(e) => {
                e.preventDefault();
                const project = completing;
                setCompleting(null);
                if (project) {
                  complete.mutate({
                    p_household_slug: HOUSEHOLD_SLUG,
                    p_project_id: project.id,
                    p_confirm: true,
                  });
                }
              }}
            >
              Complete project
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
