export type WaitlistJoinResponse = {
  ok: true;
  alreadyJoined: boolean;
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
