import { Link } from "@tanstack/react-router";

export function RouterNotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-lg text-base-content/70">Page not found</p>
      <Link to="/" className="btn btn-link">
        Back home
      </Link>
    </div>
  );
}
