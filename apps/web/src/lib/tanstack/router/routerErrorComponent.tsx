interface RouterErrorComponentProps {
  error: Error;
}

export function RouterErrorComponent({ error }: RouterErrorComponentProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="card w-full max-w-lg border border-error bg-base-100">
        <div className="card-body">
          <h2 className="card-title text-error">{error.name}</h2>
          <p className="text-base-content/70">{error.message}</p>
        </div>
      </div>
    </div>
  );
}
