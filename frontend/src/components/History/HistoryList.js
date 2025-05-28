export default function HistoryList({ campaigns }) {
  return (
    <ul>
      {campaigns.map(c => (
        <li key={c.id}>
          <b>{c.name}</b> — {c.status} — Audience: {c.audienceSize}
        </li>
      ))}
    </ul>
  );
}