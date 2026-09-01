import { createFileRoute } from "@tanstack/react-router";
import { DetailPage, UnavailableDetail } from "@/components/DetailPage";
import { ProjectDialog } from "@/components/projects/ProjectDialog";
import { ProjectCompleteButton } from "@/components/projects/ProjectCompleteButton";
import { Button } from "@/components/ui/button";
import { formatDayTime, useHouseholdMembership } from "@/lib/household";
import { useProject } from "@/lib/projects";

export const Route = createFileRoute("/_authenticated/projects/$projectId")({
  component: ProjectDetailPage,
});

const STATUS_LABELS: Record<string, string> = {
  action_required: "Action required",
  waiting_external: "Waiting on someone",
  scheduled: "Scheduled",
  blocked: "Blocked",
  complete: "Complete",
};

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
    </div>
  );
}

function ProjectDetailPage() {
  const { projectId } = Route.useParams();
  const membership = useHouseholdMembership();
  const project = useProject(projectId, !!membership.data);
  const value = project.data;

  return (
    <DetailPage title={value?.name ?? "Project"} eyebrow="Project">
      {membership.isPending || project.isPending ? (
        <p className="text-sm text-muted-foreground">Loading project…</p>
      ) : membership.error || project.error ? (
        <p className="text-sm text-critical">
          {((membership.error ?? project.error) as Error).message}
        </p>
      ) : !membership.data || !value ? (
        <UnavailableDetail />
      ) : (
        <div className="space-y-5">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">
                {STATUS_LABELS[value.status] ?? value.status}
              </span>
              {value.completed_at && (
                <span className="text-xs text-muted-foreground">
                  Completed {formatDayTime(value.completed_at)}
                </span>
              )}
            </div>
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <Field label="Next action" value={value.next_action} />
              <Field label="Waiting on" value={value.waiting_on} />
              <Field label="Follow up" value={formatDayTime(value.follow_up_at)} />
              <Field label="Last action" value={value.last_action} />
              <Field label="Last action at" value={formatDayTime(value.last_action_at)} />
              <Field label="Notes" value={value.notes} />
            </dl>
          </div>
          <div className="flex flex-wrap gap-2">
            {value.status !== "complete" && (
              <ProjectDialog
                project={value}
                trigger={
                  <Button variant="outline" className="h-11">
                    Edit project
                  </Button>
                }
              />
            )}
            <ProjectCompleteButton project={value} />
          </div>
        </div>
      )}
    </DetailPage>
  );
}
