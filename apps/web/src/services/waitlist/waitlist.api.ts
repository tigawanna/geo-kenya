export type WaitlistJoinResponse = {
  ok: true;
  alreadyJoined: boolean;
};

export type WaitlistEntry = {
  id: string;
  email: string;
  source: string;
  createdAt: string;
};

export type WaitlistMeResponse = {
  entry: WaitlistEntry | null;
};

export async function joinWaitlist(
  email: string,
  source = "landing",
): Promise<WaitlistJoinResponse> {
  const response = await fetch("/api/waitlist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Could not join the waitlist. Try again.");
  }

  return response.json() as Promise<WaitlistJoinResponse>;
}

export async function fetchMyWaitlist(): Promise<WaitlistMeResponse> {
  const response = await fetch("/api/waitlist/me", {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Failed to load waitlist status");
  }

  return response.json() as Promise<WaitlistMeResponse>;
}

export async function removeMyWaitlist(): Promise<void> {
  const response = await fetch("/api/waitlist/me", {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(payload?.error ?? "Failed to remove waitlist email");
  }
}
