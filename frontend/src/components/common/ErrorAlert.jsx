export default function ErrorAlert({ message }) {
  if (!message) return null;
  return (
    <div className="alert alert-error" role="alert">
      <span>⚠</span>
      <span>{message}</span>
    </div>
  );
}
