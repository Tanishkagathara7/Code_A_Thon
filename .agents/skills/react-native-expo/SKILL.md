---
name: react-native-expo
description: Enforces technical standards for React Native and Expo development aligned with the repository's exact installed dependencies, Expo Router, and Context state architecture.
---

# React Native & Expo Skill

This skill governs all frontend React Native, Expo, Expo Router, and TypeScript development within this workspace.

## Core Mandate

Develop exclusively against the **actual installed versions** of packages in `frontend/package.json`. Do not guess API signatures or introduce unapproved dependencies.

---

## 1. Baseline Stack & Version Awareness

Before writing any frontend code, Antigravity MUST inspect `frontend/package.json`.

**Verified Project Dependencies**:
- **Expo**: `~57.0.21`
- **React**: `19.2.3`
- **React Native**: `0.86.3`
- **Expo Router**: `~57.0.20`
- **React Native Reanimated**: `4.5.1`
- **React Native SVG**: `15.15.4`
- **TypeScript**: `~6.0.3`
- **Expo Modules**: `expo-auth-session`, `expo-secure-store`, `expo-crypto`, `expo-font`, `expo-image-picker`, `expo-document-picker`, `expo-video`, `expo-linear-gradient`

---

## 2. Context7 MCP Verification Protocol

When implementing code that relies on external library APIs or version-sensitive framework features:

1. **Check Package Version**: Inspect `frontend/package.json` to extract exact package version.
2. **Query Context7**: Use Context7 MCP tools (`resolve-library-id`, `query-docs`) with the library name and installed version.
3. **Retrieve Version-Specific Docs**: Fetch official documentation matching the installed version.
4. **Implement Accurate Code**: Write code strictly according to retrieved documentation.

> **NEVER write code based on memory or assumptions when Context7 can verify the installed API version.**

---

## 3. Mandatory Development Rules

1. **Prefer Existing Dependencies**: Use already installed packages to solve problems before considering new packages.
2. **No Unapproved Packages**: Do NOT install any new npm package if the existing stack can fulfill the requirement.
3. **Strict Version Lock**: Never upgrade existing dependencies in `package.json` unless explicitly directed by the user.
4. **Preserve Expo Router Structure**: Keep route files inside `frontend/app/` adhering to file-based routing conventions (`index.tsx`, `_layout.tsx`, dynamic routes `[id].tsx`).
5. **Preserve Auth & Navigation**: Maintain existing Google/GitHub OAuth, session persistence (`expo-secure-store`), and root navigation layouts.
6. **Preserve Context State Architecture**: Maintain the React Context architecture in `frontend/context/`.
7. **No Redux / Zustand**: Do NOT introduce state management libraries like Redux, Zustand, Recoil, or MobX.
8. **Reuse Existing Components**: Inspect `frontend/components/` first before creating new component files.
9. **Strict TypeScript Usage**: Write clean TypeScript with explicit interface/type definitions. Avoid `any` types.
10. **State & Error Handling**: Implement explicit handling for loading, errors, network failures, and empty data states in all async screens.
11. **Render Optimization**: Prevent unnecessary re-renders using `React.memo`, `useCallback`, and `useMemo` where appropriate.
12. **List Virtualization**: Render long lists using `FlatList` or `SectionList` with `keyExtractor` and optimized `getItemLayout`.
13. **Reanimated API Compliance**: Write Reanimated animations using v4.x compliant worklets and shared values.
14. **Android Priority**: Optimize for Android mobile performance, back-button handling, and platform-specific styling (`Platform.OS === 'android'`).
15. **Realistic Viewport Testing**: Design and test for realistic mobile screen sizes.
16. **No Web-Only Assumptions**: Avoid web-specific DOM APIs (`window`, `document`, `localStorage`) inside React Native components. Use Expo/RN equivalents (`expo-secure-store`, `AsyncStorage`, `Platform`).
17. **Zero Unverified Claims**: Never claim a screen or feature builds/passes tests without actual execution and verification.
18. **Backward Compatibility**: Preserve existing component props and utility signatures.
