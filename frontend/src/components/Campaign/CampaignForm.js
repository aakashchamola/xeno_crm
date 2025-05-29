import { useState } from "react";
import RuleBuilder from "../RuleBuilder/RuleBuilder";
import axios from "axios";

export default function CampaignForm({ onCreated }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  // Always keep rules as an object with .rules array
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


function mapRulesForBackend(rulesObj) {
  return {
    combinator: rulesObj.combinator,
    rules: rulesObj.rules.map(r => ({
      field: r.field,
      op: r.op || r.operator || '=',
      value: r.value
    })),
  };
}

const handlePreview = async () => {
  setLoading(true);
  setError("");
  setSuccess("");
  try {
    const jwt = localStorage.getItem("jwt");
    const mappedRules = mapRulesForBackend(rules);
    const res = await axios.post(
      `${API_URL}/preview`,
      { segmentRules: mappedRules },
      { headers: { Authorization: `Bearer ${jwt}` } }
    );
    setPreviewCount(res.data.count);
  } catch (err) {
    setError("Failed to preview segment");
  }
  setLoading(false);
};

  const handleLookalike = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/lookalike`, { segmentRules: rules });
      setLookalike(res.data.lookalike || []);
    } catch (err) {
      setError('Failed to get lookalike segment');
    }
    setLoading(false);
  };

  const handleAutoTag = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${AI_URL}/ai/auto-tag`, { campaignName: name, message });
      setTags(res.data.tags || []);
    } catch (err) {
      setError('Failed to get tags');
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
  } catch (err) {
    setError('Failed to get suggested time');
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
    } catch (err) {
      setError('Failed to get message suggestions');
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
      // Always set as an object with .rules
      setRules({
        combinator: 'and',
        rules: res.data.rules || []
      });
    } catch (err) {
      setError("AI service error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const jwt = localStorage.getItem("jwt");
      // Send segmentRules as rules.rules array, and add customerIds as required by backend
      await axios.post(
        `${API_URL}/campaigns`,
        { name, message, segmentRules: rules.rules, customerIds: [] },
        { headers: { Authorization: `Bearer ${jwt}` } }
      );
      setSuccess("Campaign created!");
      if (onCreated) onCreated();
    } catch (err) {
      setError("Failed to create campaign");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Create Campaign Form">
      <h2 tabIndex={0}>Create Campaign</h2>
      {error && <div role="alert">{error}</div>}
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
      />
      <br />
      <label htmlFor="ai-prompt">Describe your segment (AI):</label>
      <input
        id="ai-prompt"
        value={aiPrompt}
        onChange={e => setAiPrompt(e.target.value)}
        aria-label="AI Segment Description"
        autoComplete="off"
      />
      <button
        type="button"
        onClick={handleAIGenerate}
        disabled={loading}
        style={{ marginLeft: 8 }}
        aria-label="Suggest Rules"
      >
        {loading ? "Generating..." : "Suggest Rules"}
      </button>
      <br />
      <button
        type="button"
        onClick={handlePreview}
        disabled={loading || !rules || !Array.isArray(rules.rules) || !rules.rules.length}
        style={{ marginBottom: 8 }}
        aria-label="Preview Segment Size"
      >
        Preview Segment Size
      </button>
      {previewCount !== null && (
        <span style={{ marginLeft: 8 }}>Audience Size: {previewCount}</span>
      )}
      <button type="button" onClick={handleLookalike} disabled={loading} aria-label="Suggest Lookalike Segment">
        Suggest Lookalike Segment
      </button>
      {lookalike.length > 0 && (
        <pre aria-live="polite">{JSON.stringify(lookalike, null, 2)}</pre>
      )}
      <button type="button" onClick={handleAutoTag} disabled={loading} aria-label="Auto-tag Campaign">
        Auto-tag Campaign
      </button>
      {tags.length > 0 && (
        <div aria-live="polite">Tags: {tags.join(', ')}</div>
      )}
      <button type="button" onClick={handleMessageAI} disabled={loading} aria-label="Suggest Messages">
        Suggest Messages
      </button>
      {messageSuggestions.length > 0 && (
        <div>
          <h5>Suggestions:</h5>
          <ul>
            {messageSuggestions.map((msg, i) => (
              <li key={i}>
                <button type="button" onClick={() => setMessage(msg)} aria-label={`Use suggestion: ${msg}`}>{msg}</button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button type="button" onClick={handleSuggestTime} disabled={loading} aria-label="Suggest Send Time">
        Suggest Send Time
      </button>
      {suggestedTime && <div aria-live="polite">Suggested Send Time: {suggestedTime}</div>}
      <RuleBuilder rules={rules} setRules={setRules} />
      <button
        type="submit"
        disabled={loading}
        style={{ marginTop: 12 }}
        aria-label="Create Campaign"
      >
        {loading ? "Submitting..." : "Create Campaign"}
      </button>
    </form>
  );
}