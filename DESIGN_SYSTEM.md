# Design System

VideoTube deviates from the standard "Material Design" look of traditional YouTube clones. We aim for a premium, modern, "Glassmorphism" aesthetic.

## Core Aesthetic Principles

1. **Glassmorphism:** Use of translucent backgrounds and background blurs to create depth and hierarchy.
2. **Soft Shadows & Borders:** Elements should feel tactile but subtle, utilizing soft drop shadows and delicate borders rather than stark lines.
3. **Micro-animations:** Interactive elements (buttons, cards) should provide immediate, fluid feedback via transform scaling and color transitions.
4. **Vibrant Accents:** While the core theme relies on slate/gray tones, interactions should pop with vibrant, modern colors (e.g., bright blue focus rings, vivid red logos).

## Tailwind CSS Conventions

We leverage standard Tailwind CSS utilities, customized to fit our aesthetic.

### Backgrounds & Glass
- **Header/Navbars:** `bg-white/80 backdrop-blur-md`
- **Search Inputs:** `bg-slate-100/50 focus-within:bg-white`

### Borders
- **Standard Border:** `border border-slate-200/80`
- **Focus Rings:** `focus-visible:ring-2 focus-visible:ring-blue-500`

### Shadows
- **Cards/Containers:** `shadow-sm hover:shadow-md transition-shadow`

### Typography
- **Headings:** `text-slate-900 font-bold tracking-tight`
- **Subtext:** `text-slate-500 text-sm`

## Shared UI Primitives (`src/shared/ui/`)

To maintain consistency, we encapsulate common patterns into reusable UI components:

- `<Skeleton />`: Used for loading states. Supports standard bounding boxes and circular variants with built-in pulsing animations.
- `<IconButton />`: (To be implemented) A standardized circular button with hover/active states for Lucide icons.

## Icons

We use `lucide-react` for all iconography. Icons should maintain a consistent stroke width (usually `strokeWidth={2}`) and utilize Slate colors (`text-slate-700` defaulting, `text-slate-900` on active/hover).
