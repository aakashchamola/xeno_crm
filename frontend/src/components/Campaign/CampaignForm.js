import { useState, useRef } from "react";
import RuleBuilder from "../RuleBuilder/RuleBuilder";
import axios from "axios";

export default function CampaignForm({ onCreated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [rules, setRules] = useState({ combinator: 'and', rules: [] });
  const [aiPrompt, setAiPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewCount, setPreviewCount] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const AI_URL = process.env.NEXT_PUBLIC_AI_URL;
  const [messageSuggestions, setMessageSuggestions] = useState([]);
  const [suggestedTime, setSuggestedTime] = useState('');
  const [lookalike, setLookalike] = useState([]);
  const [tags, setTags] = useState([]);
  const errorRef = useRef(null);

  // Helper: Validate all rules have field, op, value
  function validateRules(rulesObj) {
    if (!rulesObj || !Array.isArray(rulesObj.rules) || !rulesObj.rules.length) return false;
    return rulesObj.rules.every(
      r => r.field && (r.op || r.operator) && r.value !== undefined && r.value !== ""
    );
  }

  function mapRulesForBackend(rulesObj) {
    return {
      combinator: rulesObj.combinator,
      rules: rulesObj.rules.map(r => ({
        field: r.field,
        op: r.op || r.operator || '=', // Always provide op
        value: r.value
      })),
    };
  }

  const handlePreview = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    setPreviewCount(null);
    if (!validateRules(rules)) {
      setError("Please add at least one valid rule (field, operator, value).");
      setLoading(false);
      errorRef.current?.focus();
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt");
      const mappedRules = mapRulesForBackend(rules);
      const res = await axios.post(
        `${API_URL}/preview`,
        { segmentRules: mappedRules },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setPreviewCount(res.data.count);
      setSuccess("Audience size calculated!");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError("Preview failed: " + err.response.data.error);
      } else {
        setError("Preview failed: Network or server error.");
      }
      setPreviewCount(null);
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleLookalike = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/lookalike`, { segmentRules: rules });
      setLookalike(res.data.lookalike || []);
      setSuccess("Lookalike segment generated!");
    } catch (err) {
      setError('Failed to get lookalike segment');
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleAutoTag = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/auto-tag`, { campaignName: name, message });
      setTags(res.data.tags || []);
      setSuccess("Tags generated!");
    } catch (err) {
      setError('Failed to get tags');
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleSuggestTime = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/suggest-send-time`, {
        campaignName: name, 
      });
      setSuggestedTime(res.data.suggestedTime);
      setSuccess("Suggested send time generated!");
    } catch (err) {
      setError('Failed to get suggested time');
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleMessageAI = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/suggest-message`, {
        segmentRules: rules,
        campaignName: name,
      });
      setMessageSuggestions(res.data.suggestions || []);
      setSuccess("Message suggestions generated!");
    } catch (err) {
      setError('Failed to get message suggestions');
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleAIGenerate = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(`${AI_URL}/ai/parse-rules`, {
        prompt: aiPrompt,
      });
      setRules({
        combinator: 'and',
        rules: (res.data.rules || []).map(r => ({
          ...r,
          op: r.op || r.operator || '=' // Ensure op is present
        }))
      });
      setSuccess("AI rules generated!");
    } catch (err) {
      setError("AI service error");
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (!name.trim()) {
      setError("Campaign name is required.");
      errorRef.current?.focus();
      setLoading(false);
      return;
    }
    if (!message.trim()) {
      setError("Message is required.");
      errorRef.current?.focus();
      setLoading(false);
      return;
    }
    if (!validateRules(rules)) {
      setError("Please add at least one valid rule (field, operator, value).");
      errorRef.current?.focus();
      setLoading(false);
      return;
    }
    try {
      const jwt = localStorage.getItem("jwt");
      await axios.post(
        `${API_URL}/campaigns`,
        { name, message, segmentRules: mapRulesForBackend(rules), customerIds: [] },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setSuccess("Campaign created!");
      setError("");
      if (onCreated) onCreated();
    } catch (err) {
      setError("Failed to create campaign");
      errorRef.current?.focus();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Create Campaign Form" style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2 tabIndex={0}>Create Campaign</h2>
      {error && <div role="alert" tabIndex={-1} ref={errorRef}>{error}</div>}
      {success && <div role="status">{success}</div>}
      <label htmlFor="campaign-name">Campaign Name:</label>
      <input
        id="campaign-name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
        aria-required="true"
        aria-label="Campaign Name"
        autoComplete="off"
        disabled={loading}
      />
      <br />
      <label htmlFor="campaign-message">Message:</label>
      <input
        id="campaign-message"
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
        aria-required="true"
        aria-label="Message"
        autoComplete="off"
        disabled={loading}
      />
      <br />
      <label htmlFor="ai-prompt">Describe your segment (AI):</label>
      <input
        id="ai-prompt"
        value={aiPrompt}
        onChange={e => setAiPrompt(e.target.value)}
        aria-label="AI Segment Description"
        autoComplete="off"
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleAIGenerate}
        disabled={loading || !aiPrompt.trim()}
        style={{ marginLeft: 8 }}
        aria-label="Suggest Rules"
      >
        {loading ? "Generating..." : "Suggest Rules"}
      </button>
      <br />
      <button
        type="button"
        onClick={handlePreview}
        disabled={loading || !validateRules(rules)}
        aria-label="Preview Segment Size"
      >
        {loading ? "Loading..." : "Preview Segment Size"}
      </button>
      {previewCount !== null && (
        <span style={{ marginLeft: 8 }}>Audience Size: {previewCount}</span>
      )}
      <button type="button" onClick={handleLookalike} disabled={loading || !validateRules(rules)} aria-label="Suggest Lookalike Segment">
        Suggest Lookalike Segment
      </button>
      {lookalike.length > 0 && (
        <pre aria-live="polite">{JSON.stringify(lookalike, null, 2)}</pre>
      )}
      <button type="button" onClick={handleAutoTag} disabled={loading || !name.trim() || !message.trim()} aria-label="Auto-tag Campaign">
        Auto-tag Campaign
      </button>
      {tags.length > 0 && (
        <div aria-live="polite">Tags: {tags.join(', ')}</div>
      )}
      <button type="button" onClick={handleMessageAI} disabled={loading || !validateRules(rules) || !name.trim()} aria-label="Suggest Messages">
        Suggest Messages
      </button>
     {messageSuggestions.length > 0 && (
  <div>
    <h5>Suggestions:</h5>
    <ul>
      {messageSuggestions.map((msg, i) => {
        const display =
          typeof msg === "string"
            ? msg
            : msg.text
            ? msg.text
            : JSON.stringify(msg);
        return (
          <li key={i}>
            <button
              type="button"
              onClick={() => setMessage(display)}
              aria-label={`Use suggestion: ${display}`}
            >
              {display}
            </button>
          </li>
        );
      })}
    </ul>
  </div>
)}
      <button type="button" onClick={handleSuggestTime} disabled={loading || !name.trim()} aria-label="Suggest Send Time">
        Suggest Send Time
      </button>
      {suggestedTime && <div aria-live="polite">Suggested Send Time: {suggestedTime}</div>}
      <RuleBuilder rules={rules} setRules={setRules} />
      <button
        type="submit"
        disabled={loading || !name.trim() || !message.trim() || !validateRules(rules)}
        style={{ marginTop: 12 }}
        aria-label="Create Campaign"
      >
        {loading ? "Submitting..." : "Create Campaign"}
      </button>
    </form>
  );
}