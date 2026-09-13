---
name: mobile-ux
description: Enforces mobile-first UX standards, proper touch targets, state handling, accessibility, existing design system usage, and real-world pattern research using Mobbin MCP.
---

# Mobile UX Skill

This skill governs screen design, UI component usage, and user experience patterns for mobile development in this repository.

## Core Mandate

Every screen must feel like a polished, production-grade mobile product. Avoid generic AI-generated UI clichés.

---

## 1. Design System First

Before creating any new UI element or screen, Antigravity MUST inspect and reuse existing theme tokens and components in `frontend/`:

- **Theme Files**:
  - `frontend/theme/colors.ts`
  - `frontend/theme/typography.ts`
  - `frontend/theme/motion.ts`
  - `frontend/theme/config.ts`
- **Reusable Components**:
  - Auth inputs & headers: `frontend/components/auth/`
  - Common UI (Toast, EntrySplashLoader, NetworkStatusBanner, SceneVideoPlayer): `frontend/components/common/`
  - File picker & upload fields: `frontend/components/FilePicker.tsx`, `frontend/components/FileUploadField.tsx`
  - Domain & feature components: `frontend/components/domain/`, `frontend/components/notifications/`, `frontend/components/onboarding/`

> **Do NOT introduce a secondary design system, third-party component kit, or parallel styling framework.**

---

## 2. Mobile UX Rules & Constraints

### Layout & Spacing
- **Mobile-First**: Design exclusively for mobile screen sizes (Android/iOS phone viewports).
- **Safe Areas**: Always wrap top-level screens in `SafeAreaView` or use `react-native-safe-area-context` hooks.
- **Hierarchy & Spacing**: Establish clean visual hierarchy using consistent vertical padding (e.g. 16pt / 24pt). Avoid cramped views and avoid meaningless empty voids.

### Touch Targets
- Ensure interactive buttons, touchables, and icon triggers meet the minimum touch target size of approximately **44–48pt**.

### Form Controls & Keyboard Safety
- Wrap form screens in `KeyboardAvoidingView` with appropriate `behavior` (e.g. `padding` on iOS, `height` on Android) and `ScrollView`.
- Provide explicit focus states, inline validation errors, clear loading indicators on submit buttons, and disabled states when forms are incomplete.
- Include password visibility toggles where password inputs exist.

### State Management & Feedback
Always account for appropriate state conditions without adding unnecessary bloat:
- **Loading State**: Subtle activity indicators or skeleton loaders during data fetch.
- **Empty State**: Friendly illustration/icon and guidance when data lists are empty.
- **Error State**: Informative Toast or banner with retry actions on API failure.
- **Success State**: Immediate visual feedback or Toast on completion.
- **Offline State**: Utilize `NetworkStatusBanner` when network disconnects.

### Accessibility & Dynamic Text
- Add `accessible={true}` and meaningful `accessibilityLabel` props to custom touchables and icon buttons.
- Ensure color contrast ratios meet WCAG AA standards.
- Ensure dynamic text scales properly without breaking container bounds or overlapping adjacent elements.

### Motion & Micro-Interactions
- Use the existing motion system in `frontend/theme/motion.ts` and `react-native-animated` / `react-native-reanimated`.
- Animations must be:
  - **Purposeful**: Guiding user attention or indicating state change.
  - **Subtle & Fast**: Duration typically between 150ms–300ms.
  - **Performance-Safe**: Animate native driver properties (`transform`, `opacity`).
- **Do NOT introduce excessive, distracting, or blocking screen animations.**

---

## 3. Ban Generic AI-Generated Design Clichés

Antigravity must NEVER output generic AI aesthetic tropes such as:
- Random multi-colored decorative gradients without brand purpose.
- Heavy, unreadable glassmorphism on content cards.
- Giant glowing background blobs or floating shapes.
- Rows of generic cards with zero distinction.
- Meaningless decorative icons next to plain text labels.
- Harsh, stacked drop shadows.
- Unnecessary continuous bouncing or rotating animations.

**Every visual element must serve a distinct UX purpose.**

---

## 4. Mobbin MCP UX Research Workflow

When designing a major new screen or complex user journey, use the **Mobbin MCP server** to research real-world mobile app design patterns:

$$\text{Mobbin Research} \longrightarrow \text{Identify Patterns} \longrightarrow \text{Extract Principles} \longrightarrow \text{Create Original Implementation}$$

1. **Query Mobbin**: Search for equivalent production screens in top apps using `search_screens` or `search_flows`.
2. **Identify Patterns**: Analyze navigation structures, form layouts, action bar placements, and state handling.
3. **Extract Principles**: Note key usability lessons (e.g. bottom sheet placement, primary CTA sticky bar).
4. **Create Original Implementation**: Implement the screen using existing workspace components and theme tokens.

> **Do NOT copy any individual product UI directly.**
