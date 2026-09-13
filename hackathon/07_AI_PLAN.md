# 07 — AI Plan

> **STATUS**: TEMPLATE / UNGENERATED  
> *This document will be updated by Antigravity after completing [`06_API_PLAN.md`](file:///d:/Code_A_Thon/hackathon/06_API_PLAN.md).*

---

## Is AI Actually Necessary?

**Answer**: `YES / NO`

*(If NO, state clearly: "The problem statement does not require AI. Skip AI integration and rely on standard business logic.")*

---

## AI Use Case Specification

*(Fill only if AI is YES)*

* **User Action Triggering AI**: [e.g., User taps "Analyze Record" or creates a new item]
* **Input Data**: [Item title, description, category, attached tags]
* **Context Provided**: [Domain system prompt defined in `appConfig.aiSystemPrompt`]
* **System Prompt**:
  ```text
  You are an expert AI assistant specialized in [DOMAIN]. 
  Analyze the provided item and produce a concise, actionable output...
  ```
* **Expected Output Format**: JSON structure or structured markdown text.
* **UI Presentation**: Displayed inside `AIOutputBox` component on Item Detail or Creation modal.
* **Loading Behavior**: Spinner animation with message "Generating AI insights...".
* **Failure Behavior**: Fallback to predefined template response if network/API fails.

---

## Why AI Adds Real Value

Explain how AI improves the actual solution:
* **Value 1**: Saves user time by auto-generating structured sub-tasks.
* **Value 2**: Extracts critical action items from unstructured user input.
* **Hackathon Impact**: Demonstrates practical AI integration without being a generic wrapper.

---

## Existing AI Infrastructure Mapping

The starter kit contains an OpenRouter integration in [`backend/src/services/ai.service.ts`](file:///d:/Code_A_Thon/backend/src/services/ai.service.ts).

* **OpenRouter Configuration**: Configured via `OPENROUTER_API_KEY` and `OPENROUTER_MODEL` in `backend/.env`.
* **Endpoints Reused**:
  * `POST /api/ai/summarize` — Generates domain summaries.
  * `POST /api/ai/generate-subtasks` — Generates structured subtask arrays.
* **Prompt Tailoring**: Override system prompts dynamically via [`frontend/config/appConfig.ts`](file:///d:/Code_A_Thon/frontend/config/appConfig.ts) (`aiSystemPrompt`).

---

## AI Cost & Latency Considerations

* **Token Limit**: Max tokens capped at 500 per call to ensure sub-2-second response times.
* **Model Selection**: Default to fast, low-cost LLMs via OpenRouter (e.g. `google/gemini-flash-1.5` or `meta-llama/llama-3.1-8b-instruct`).
* **Debouncing**: Prevent multiple simultaneous requests on button taps.

---

## AI Failure Fallback

If OpenRouter is unavailable, offline, or returns an error:
1. Catch execution failure silently in `ai.service.ts`.
2. Return a deterministic fallback mock response based on item title and category.
3. Show inline user notification: *"Generated offline fallback summary."*
4. Ensure core CRUD and application features remain **100% functional**.
