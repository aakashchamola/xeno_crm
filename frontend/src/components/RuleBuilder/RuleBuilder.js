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

// Helper to detect ISO date string (YYYY-MM-DD or YYYY-MM-DDTHH:MM:SS)
function isISODate(val) {
  return typeof val === "string" && /^\d{4}-\d{2}-\d{2}/.test(val);
}

export default function RuleBuilder({ rules, setRules }) {
  const safeRules =
    rules && typeof rules === "object"
      ? rules
      : {
          combinator: "and",
          rules: [{ field: "spend", op: ">", value: 10000 }],
        };

  // Patch rules so that if a rule is for a date field and value is ISO, it is set as the value for the date input
  const patchedRules = {
    ...safeRules,
    rules: Array.isArray(safeRules.rules)
      ? safeRules.rules.map(r => {
          if (["last_purchase_date", "last_active"].includes(r.field) && isISODate(r.value)) {
            // Only keep YYYY-MM-DD for date input
            return { ...r, value: r.value.slice(0, 10) };
          }
          return r;
        })
      : []
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
        query={patchedRules}
        onQueryChange={handleQueryChange}
        operators={operators}
        operatorKey="op"
        aria-label="Visual Rule Builder"
      />
      <pre aria-live="polite">{JSON.stringify(patchedRules, null, 2)}</pre>
    </section>
  );
}