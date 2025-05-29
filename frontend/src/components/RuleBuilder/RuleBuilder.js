import { QueryBuilder } from "react-querybuilder";
import "react-querybuilder/dist/query-builder.css";

const fields = [
  { name: "spend", label: "Spend", inputType: "number" },
  { name: "visits", label: "Visits", inputType: "number" },
  { name: "last_purchase_date", label: "Last Purchase Date", inputType: "date" },
  { name: "inactive_days", label: "Inactive Days", inputType: "number" },
  { name: "last_active", label: "Last Active", inputType: "date" }
];

const operators = [
  { name: ">", label: ">" },
  { name: "<", label: "<" },
  { name: "=", label: "=" },
  { name: ">=", label: ">=" },
  { name: "<=", label: "<=" }
];

export default function RuleBuilder({ rules, setRules }) {
  const safeRules =
    rules && typeof rules === "object"
      ? rules
      : {
          combinator: "and",
          rules: [{ field: "spend", op: ">", value: 10000 }],
        };

  // Ensure every rule has an op property
  const handleQueryChange = (q) => {
    const patched = {
      ...q,
      rules: Array.isArray(q.rules)
        ? q.rules.map(r => ({
            ...r,
            op: r.op || r.operator || "="
          }))
        : []
    };
    setRules(patched);
  };

  return (
    <section aria-label="Segment Rule Builder">
      <h4 tabIndex={0}>Segment Rules</h4>
      <QueryBuilder
        fields={fields}
        query={safeRules}
        onQueryChange={handleQueryChange}
        operators={operators}
        operatorKey="op"
        aria-label="Visual Rule Builder"
      />
      <pre aria-live="polite">{JSON.stringify(safeRules, null, 2)}</pre>
    </section>
  );
}