import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PROJECT_STATUSES,
  createProject,
  updateProject,
  useProjectAction,
  validateProject,
  type Project,
  type ProjectStatus,
} from "@/lib/projects";
import { HOUSEHOLD_SLUG, HOUSEHOLD_TIMEZONE } from "@/lib/household";

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: HOUSEHOLD_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}`;
}

function householdLocalInputToIso(value: string): string | undefined {
  if (!value) return undefined;
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const desiredUtc = Date.UTC(year, month - 1, day, hour, minute);
  let candidate = desiredUtc;

  // Resolve the household wall time to an instant, including Chicago DST.
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const rendered = new Intl.DateTimeFormat("en-CA", {
      timeZone: HOUSEHOLD_TIMEZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(new Date(candidate));
    const values = Object.fromEntries(rendered.map((item) => [item.type, item.value]));
    const renderedUtc = Date.UTC(
      Number(values["year"]),
      Number(values["month"]) - 1,
      Number(values["day"]),
      Number(values["hour"]),
      Number(values["minute"]),
    );
    candidate += desiredUtc - renderedUtc;
  }

  return new Date(candidate).toISOString();
}

const STATUS_LABELS: Record<string, string> = {
  action_required: "Action required",
  waiting_external: "Waiting on someone",
  scheduled: "Scheduled",
  blocked: "Blocked",
};

export function ProjectDialog({
  project,
  trigger,
}: {
  project?: Project;
  trigger: React.ReactNode;
}) {
  const isEdit = !!project;
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("action_required");
  const [waitingOn, setWaitingOn] = useState("");
  const [lastAction, setLastAction] = useState("");
  const [nextAction, setNextAction] = useState("");
  const [followUpAt, setFollowUpAt] = useState("");
  const [notes, setNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const create = useProjectAction(createProject, "Project created");
  const update = useProjectAction(updateProject, "Project updated");
  const action = isEdit ? update : create;

  useEffect(() => {
    if (!open) return;
    setName(project?.name ?? "");
    setStatus(
      PROJECT_STATUSES.includes(project?.status as ProjectStatus)
        ? (project?.status as ProjectStatus)
        : "action_required",
    );
    setWaitingOn(project?.waiting_on ?? "");
    setLastAction(project?.last_action ?? "");
    setNextAction(project?.next_action ?? "");
    setFollowUpAt(toLocalInput(project?.follow_up_at ?? null));
    setNotes(project?.notes ?? "");
    setValidationError(null);
  }, [open, project]);

  function submit() {
    const error = validateProject({
      name,
      status,
      waiting_on: waitingOn,
      next_action: nextAction,
      follow_up_at: followUpAt,
    });
    setValidationError(error);
    if (error) return;

    const followUpIso = householdLocalInputToIso(followUpAt);
    const shared = {
      p_household_slug: HOUSEHOLD_SLUG,
      p_name: name.trim(),
      p_status: status,
      ...(nextAction.trim() ? { p_next_action: nextAction.trim() } : {}),
      ...(notes.trim() ? { p_notes: notes.trim() } : {}),
      ...(waitingOn.trim() ? { p_waiting_on: waitingOn.trim() } : {}),
      ...(followUpIso ? { p_follow_up_at: followUpIso } : {}),
    };

    const options = { onSuccess: () => setOpen(false) };
    if (project) {
      update.mutate(
        {
          ...shared,
          p_project_id: project.id,
          ...(lastAction.trim() ? { p_last_action: lastAction.trim() } : {}),
        },
        options,
      );
    } else {
      create.mutate(shared, options);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit project" : "New project"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the project. Completion is a separate action."
              : "Track something the household needs to move forward."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Name</Label>
            <Input
              id="project-name"
              className="h-11"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Fix fence gate"
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as ProjectStatus)}>
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROJECT_STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {STATUS_LABELS[s] ?? s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {status === "waiting_external" && (
            <div className="space-y-2">
              <Label htmlFor="project-waiting-on">Waiting on</Label>
              <Input
                id="project-waiting-on"
                className="h-11"
                value={waitingOn}
                onChange={(e) => setWaitingOn(e.target.value)}
                placeholder="e.g. Plumber callback"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project-next-action">
              Next action
              {(status === "action_required" || status === "blocked") && " (required)"}
            </Label>
            <Input
              id="project-next-action"
              className="h-11"
              value={nextAction}
              onChange={(e) => setNextAction(e.target.value)}
              placeholder="e.g. Call for a quote"
            />
          </div>

          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="project-last-action">Last action (optional)</Label>
              <Input
                id="project-last-action"
                className="h-11"
                value={lastAction}
                onChange={(e) => setLastAction(e.target.value)}
              />
            </div>
          )}

          {(status === "waiting_external" || status === "scheduled") && (
            <div className="space-y-2">
              <Label htmlFor="project-follow-up">
                {status === "scheduled" ? "Scheduled for" : "Follow up"} (required)
              </Label>
              <Input
                id="project-follow-up"
                className="h-11"
                type="datetime-local"
                value={followUpAt}
                onChange={(e) => setFollowUpAt(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="project-notes">Notes (optional)</Label>
            <Textarea
              id="project-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          {validationError && <p className="text-sm text-critical">{validationError}</p>}
        </div>

        <DialogFooter>
          <Button className="h-11 w-full sm:w-auto" disabled={action.isPending} onClick={submit}>
            {action.isPending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
