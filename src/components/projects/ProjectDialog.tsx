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
} from "@/lib/projects";
import { HOUSEHOLD_SLUG } from "@/lib/household";

function toLocalInput(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
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
  const [status, setStatus] = useState<string>("action_required");
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
    setStatus(PROJECT_STATUSES.includes(project?.status as never) ? project!.status : "action_required");
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

    const followUpIso = followUpAt ? new Date(followUpAt).toISOString() : undefined;
    const shared = {
      p_household_slug: HOUSEHOLD_SLUG,
      p_name: name.trim(),
      p_status: status,
      p_next_action: nextAction.trim() || undefined,
      p_notes: notes.trim() || undefined,
      ...(waitingOn.trim() ? { p_waiting_on: waitingOn.trim() } : {}),
      ...(followUpIso ? { p_follow_up_at: followUpIso } : {}),
    };

    const args = isEdit
      ? { ...shared, p_project_id: project!.id, p_last_action: lastAction.trim() || undefined }
      : shared;

    action.mutate(args as never, {
      onSuccess: () => setOpen(false),
    });
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
            <Select value={status} onValueChange={setStatus}>
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
          <Button
            className="h-11 w-full sm:w-auto"
            disabled={action.isPending}
            onClick={submit}
          >
            {action.isPending ? "Saving…" : isEdit ? "Save changes" : "Create project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
