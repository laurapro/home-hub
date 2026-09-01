import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectCompleteButton } from "@/components/projects/ProjectCompleteButton";
import { useProjects } from "@/lib/projects";
import { formatDayTime } from "@/lib/household";
import { cn, getInteractiveCardClasses } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  action_required: "Action required",
  waiting_external: "Waiting on someone",
  scheduled: "Scheduled",
  blocked: "Blocked",
};

export function ProjectsSection({
  enabled,
  hasAttention,
}: {
  enabled: boolean;
  hasAttention: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  const projects = useProjects(enabled);

  const list = projects.data ?? [];

  if (!enabled || projects.isPending) return null;
  if (!projects.error && list.length === 0 && !hasAttention) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Projects
      </h2>
      {projects.error ? (
        <p className="text-sm text-critical">{(projects.error as Error).message}</p>
      ) : list.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active projects.</p>
      ) : (
        <div className="space-y-3">
          {list.length > 2 && (
            <Button
              size="sm"
              variant="ghost"
              className="h-11 px-2"
              onClick={() => setExpanded((value) => !value)}
              aria-expanded={expanded}
            >
              {expanded ? "Show fewer" : `Show all ${list.length} projects`}
            </Button>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {(expanded ? list : list.slice(0, 2)).map((project) => {
              const followUp = formatDayTime(project.follow_up_at);
              return (
                <div
                  key={project.id}
                  className="overflow-hidden rounded-xl border bg-projects/45 shadow-sm"
                >
                  <Link
                    to="/projects/$projectId"
                    params={{ projectId: project.id }}
                    className={cn("group flex gap-3 p-4", getInteractiveCardClasses())}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="break-words font-medium text-foreground">{project.name}</p>
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                          {STATUS_LABELS[project.status] ?? project.status}
                        </span>
                      </div>
                      <div className="mt-1 space-y-0.5 text-sm text-muted-foreground">
                        {project.next_action && <p>Next: {project.next_action}</p>}
                        {project.waiting_on && <p>Waiting on: {project.waiting_on}</p>}
                        {followUp && <p>Follow up {followUp}</p>}
                      </div>
                    </div>
                    <ChevronRight className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                  <div className="flex flex-wrap gap-2 border-t px-4 py-3">
                    <ProjectDialog
                      project={project}
                      trigger={
                        <Button size="sm" variant="outline" className="h-11">
                          Edit
                        </Button>
                      }
                    />
                    <ProjectCompleteButton project={project} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
