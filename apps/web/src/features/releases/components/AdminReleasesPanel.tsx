import {
  adminReleasesQueryOptions,
  clearAppRelease,
  setAppReleaseActive,
  upsertAppRelease,
  type AppRelease,
} from "@/data-access-layer/dashboard/releases";
import { ConfirmAction } from "@/components/ui/confirm-action";
import { RELEASE_CHANNELS, type ReleaseChannel } from "@/lib/drizzle/schema/releases-schema";
import { formatDate } from "@/utils/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const CHANNEL_COPY: Record<
  ReleaseChannel,
  { title: string; description: string; defaultLabel: string }
> = {
  closed_testing: {
    title: "Closed testing",
    description:
      "Invite-only Play track. Landing keeps the waitlist while this is the only public path.",
    defaultLabel: "Closed testing invite",
  },
  open_testing: {
    title: "Open testing",
    description:
      "Public Play testing link. When active, the waitlist is hidden and visitors can try the app.",
    defaultLabel: "Try open testing",
  },
  production: {
    title: "Production",
    description:
      "Stable Play store listing. Can sit alongside open testing so people can pick newest vs stable.",
    defaultLabel: "Get the app",
  },
};

const formSchema = z.object({
  url: z
    .url("Enter a valid URL")
    .refine((value) => value.startsWith("https://"), "URL must start with https://"),
  label: z.string().trim().max(80).optional(),
  isActive: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function AdminReleasesPanel() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = useQuery(adminReleasesQueryOptions);

  if (isLoading) {
    return (
      <section className="flex flex-col gap-6">
        <Header />
        <div className="grid gap-4">
          {RELEASE_CHANNELS.map((channel) => (
            <div key={channel} className="h-56 w-full skeleton rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6">
        <Header />
        <div className="alert alert-error">
          <span>{error instanceof Error ? error.message : "Failed to load releases"}</span>
        </div>
      </section>
    );
  }

  const byChannel = new Map((data ?? []).map((row) => [row.channel, row]));

  return (
    <section className="flex flex-col gap-6">
      <Header />
      <p className="max-w-2xl text-sm text-base-content/70">
        Active open testing or production links hide the landing waitlist. Closed testing alone
        keeps email collection on.
      </p>
      <div className="grid gap-4">
        {RELEASE_CHANNELS.map((channel) => (
          <ChannelCard
            key={channel}
            channel={channel}
            release={byChannel.get(channel) ?? null}
            onChanged={async () => {
              await queryClient.invalidateQueries({ queryKey: ["releases"] });
            }}
          />
        ))}
      </div>
    </section>
  );
}

function Header() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Manage releases</h1>
      <p className="mt-2 max-w-2xl text-base-content/70">
        Publish Play Store links for each testing track. The landing page and dashboard read these
        and switch CTAs automatically.
      </p>
    </div>
  );
}

function ChannelCard({
  channel,
  release,
  onChanged,
}: {
  channel: ReleaseChannel;
  release: AppRelease | null;
  onChanged: () => Promise<void>;
}) {
  const copy = CHANNEL_COPY[channel];
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    values: {
      url: release?.url ?? "",
      label: release?.label ?? "",
      isActive: release?.isActive ?? true,
    },
  });

  const saveMutation = useMutation({
    mutationFn: (values: FormValues) =>
      upsertAppRelease({
        data: {
          channel,
          url: values.url,
          label: values.label?.trim() ? values.label.trim() : null,
          isActive: values.isActive,
        },
      }),
    onSuccess: async () => {
      toast.success(`${copy.title} link saved`);
      await onChanged();
    },
    onError: (err) => {
      toast.error("Could not save release", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (isActive: boolean) => setAppReleaseActive({ data: { channel, isActive } }),
    onSuccess: async (_data, isActive) => {
      toast.success(isActive ? `${copy.title} activated` : `${copy.title} deactivated`);
      await onChanged();
    },
    onError: (err) => {
      toast.error("Could not update status", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearAppRelease({ data: { channel } }),
    onSuccess: async () => {
      toast.success(`${copy.title} cleared`);
      form.reset({ url: "", label: "", isActive: true });
      await onChanged();
    },
    onError: (err) => {
      toast.error("Could not clear release", {
        description: err instanceof Error ? err.message : undefined,
      });
    },
  });

  return (
    <div className="rounded-2xl border border-base-content/10 bg-base-100/70 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs tracking-wide text-base-content/60 uppercase">
            {channel.replaceAll("_", " ")}
          </p>
          <h2 className="mt-2 text-lg font-semibold tracking-tight">{copy.title}</h2>
          <p className="mt-2 max-w-xl text-sm text-base-content/70">{copy.description}</p>
        </div>
        <StatusBadge release={release} />
      </div>

      <form
        className="mt-6 grid gap-4"
        onSubmit={form.handleSubmit((values) => saveMutation.mutate(values))}
        noValidate
      >
        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-base-content/70">Play / store URL</span>
          <input
            type="url"
            placeholder="https://play.google.com/apps/testing/…"
            className="input-bordered input w-full"
            {...form.register("url")}
          />
          {form.formState.errors.url ? (
            <span className="text-sm text-error">{form.formState.errors.url.message}</span>
          ) : null}
        </label>

        <label className="grid gap-1.5">
          <span className="text-xs font-medium text-base-content/70">
            Button label <span className="text-base-content/40">(optional)</span>
          </span>
          <input
            type="text"
            placeholder={copy.defaultLabel}
            className="input-bordered input w-full"
            {...form.register("label")}
          />
        </label>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="checkbox checkbox-sm" {...form.register("isActive")} />
          <span>Active — visible on landing / dashboard when saved</span>
        </label>

        {release ? (
          <p className="text-xs text-base-content/50">
            Last updated {formatDate(release.updatedAt)}
            {release.url ? (
              <>
                {" · "}
                <a
                  href={release.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-flag-green hover:underline"
                >
                  Open link
                </a>
              </>
            ) : null}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            className="btn btn-sm btn-primary"
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving…" : "Save"}
          </button>
          {release ? (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              disabled={toggleMutation.isPending}
              onClick={() => toggleMutation.mutate(!release.isActive)}
            >
              {release.isActive ? "Deactivate" : "Activate"}
            </button>
          ) : null}
          {release ? (
            <ConfirmAction
              title={`Clear ${copy.title}`}
              description={`Remove the ${copy.title} link? Visitors will stop seeing this channel.`}
              confirmLabel="Clear"
              disabled={clearMutation.isPending}
              onConfirm={() => clearMutation.mutate()}
            >
              <button
                type="button"
                className="btn text-error btn-ghost btn-sm"
                disabled={clearMutation.isPending}
              >
                {clearMutation.isPending ? "Clearing…" : "Clear"}
              </button>
            </ConfirmAction>
          ) : null}
        </div>
      </form>
    </div>
  );
}

function StatusBadge({ release }: { release: AppRelease | null }) {
  if (!release) {
    return (
      <span className="rounded-md bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60">
        Not set
      </span>
    );
  }

  if (!release.isActive) {
    return (
      <span className="rounded-md bg-base-200 px-2.5 py-1 text-xs font-medium text-base-content/60">
        Inactive
      </span>
    );
  }

  return (
    <span className="rounded-md bg-flag-green-soft px-2.5 py-1 text-xs font-medium text-flag-green">
      Active
    </span>
  );
}
