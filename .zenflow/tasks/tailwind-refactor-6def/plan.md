# Spec and build

## Configuration
- **Artifacts Path**: {@artifacts_path} → `.zenflow/tasks/{task_id}`

---

## Agent Instructions

Ask the user questions when anything is unclear or needs their input. This includes:
- Ambiguous or incomplete requirements
- Technical decisions that affect architecture or user experience
- Trade-offs that require business context

Do not make assumptions on important decisions — get clarification first.

---

## Workflow Steps

### [x] Step: Technical Specification

**Difficulty**: Medium - refactoring existing CSS to Tailwind while maintaining complex responsive grid layouts.

**Approach**: Use Tailwind CSS v4 CLI with CSS-based configuration (@theme). Keep complex grid layout rules in CSS while converting utility classes (typography, colors, spacing, transitions) to Tailwind utilities.

---

### [x] Step: Implementation

Implemented Tailwind CSS refactor for static HTML portfolio site:

1. **Setup**: Installed Tailwind CSS v4 with @tailwindcss/cli
2. **Configuration**: Created `src/input.css` with:
   - Custom theme variables (accent color, spacing, typography)
   - Base styles (reset, body grid, list styles)
   - Complex responsive grid layouts (l-* classes) preserved in CSS
   - Component styles (c-img, card-bottom, etc.)
3. **HTML Refactoring**: Updated all 4 HTML files to use Tailwind utility classes:
   - `index.html`
   - `404.html`
   - `works/appulate/index.html`
   - `works/muranofood/index.html`
4. **Build**: Successfully compiled with `npm run build`

**Files modified**:
- `.gitignore` - added node_modules/
- `package.json` - created with build/dev scripts
- `src/input.css` - Tailwind source with custom theme
- `style.css` - generated output (~10KB minified)
- All 4 HTML files - refactored to use Tailwind utilities

**Commands**:
- `npm run build` - build for production
- `npm run dev` - watch mode for development
