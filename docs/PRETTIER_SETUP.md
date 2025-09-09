# Prettier Configuration

This document outlines the Prettier configuration for the monorepo project.

## Configuration Files

### `.prettierrc.json`
The main Prettier configuration file located at the root of the project. This configuration applies to all workspaces (frontend and backend).

**Key Settings:**
- **Semi**: `true` - Always add semicolons
- **Trailing Comma**: `all` - Add trailing commas wherever possible
- **Single Quote**: `true` - Use single quotes instead of double quotes
- **Print Width**: `80` - Wrap lines at 80 characters
- **Tab Width**: `2` - Use 2 spaces for indentation
- **Use Tabs**: `false` - Use spaces instead of tabs
- **JSX Single Quote**: `true` - Use single quotes in JSX
- **Bracket Spacing**: `true` - Add spaces between brackets
- **Arrow Parens**: `avoid` - Omit parentheses when possible in arrow functions

**File-specific Overrides:**
- **JSON files**: 120 character width, no trailing commas
- **Markdown files**: 100 character width, always wrap prose
- **HTML files**: 120 character width, ignore whitespace sensitivity
- **CSS/SCSS files**: Use double quotes, 100 character width
- **JS/JSX files**: Specific JSX and semicolon rules

### `.prettierignore`
Specifies files and directories that Prettier should ignore:
- `node_modules/`, `dist/`, `build/`
- Cache directories
- Generated files
- Package manager lock files
- Logs and temporary files
- Project-specific directories: `design/`, `presentation/`, `progress/`, `sample/`, `testing/`

## Scripts

### Root Level Scripts
```bash
# Format all files in the project
npm run format

# Check if all files are formatted correctly
npm run format:check

# Format with warnings for issues
npm run format:fix

# Format specific workspace
npm run format:frontend
npm run format:backend

# Check specific workspace formatting
npm run format:check:frontend
npm run format:check:backend

# Format documentation files
npm run format:docs
```

### Frontend Scripts
```bash
cd frontend

# Format frontend files
npm run format

# Check frontend formatting
npm run format:check

# Format with warnings
npm run format:fix
```

### Backend Scripts
```bash
cd backend

# Format backend files
npm run format

# Check backend formatting
npm run format:check

# Format with warnings
npm run format:fix
```

## VS Code Integration

### Settings (`.vscode/settings.json`)
- **Format on Save**: Enabled
- **Format on Paste**: Enabled
- **Prettier Config Path**: Points to root `.prettierrc.json`
- **Require Config**: Ensures Prettier only runs when config is present
- **File Settings**: Automatic final newline, trim whitespace

### Recommended Extensions (`.vscode/extensions.json`)
- `esbenp.prettier-vscode` - Prettier formatter
- `ms-vscode.vscode-eslint` - ESLint integration
- `bradlc.vscode-tailwindcss` - Tailwind CSS support

## Development Workflow

### Before Committing
1. Run `npm run format:check` to ensure all files are formatted
2. If issues are found, run `npm run format` to fix them
3. Commit your changes

### Pre-commit Hooks
Both workspaces have `precommit` scripts that:
1. Check formatting with `format:check`
2. Run linting
3. Fail if formatting or linting issues exist

### Build Process
The frontend has a `prebuild` script that ensures formatting and linting before building.

## File Extensions Supported

- **JavaScript**: `.js`, `.mjs`, `.cjs`
- **TypeScript**: `.ts`, `.tsx`
- **React**: `.jsx`, `.tsx`
- **Styling**: `.css`, `.scss`, `.less`
- **Markup**: `.html`, `.htm`
- **Data**: `.json`, `.jsonc`
- **Documentation**: `.md`, `.mdx`

## Plugins

### Tailwind CSS Plugin
- **`prettier-plugin-tailwindcss`**: Automatically sorts Tailwind CSS classes
- Applies to all HTML, JSX, and template files
- Ensures consistent class ordering

## Best Practices

1. **Always run `npm run format:check` before committing**
2. **Use `npm run format` to fix formatting issues**
3. **Configure your editor to format on save**
4. **Don't commit files with formatting issues**
5. **Keep the `.prettierrc.json` configuration consistent across the team**

## Troubleshooting

### Common Issues

1. **Prettier not formatting in VS Code**
   - Ensure the Prettier extension is installed
   - Check that `.prettierrc.json` exists in the root
   - Verify VS Code settings point to the correct config file

2. **Conflicting ESLint and Prettier rules**
   - ESLint should handle code quality
   - Prettier should handle code formatting
   - Use `eslint-config-prettier` to disable conflicting ESLint rules

3. **Files not being formatted**
   - Check if the file extension is supported
   - Verify the file isn't listed in `.prettierignore`
   - Ensure the file path is correct in scripts

### Commands for Debugging

```bash
# Check which files Prettier will format
npx prettier --check . --list-different

# See what changes Prettier would make
npx prettier --check . --write --dry-run

# Format a specific file
npx prettier --write path/to/file.js

# Check if a file is ignored
npx prettier --check path/to/file.js
```

## Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# Example GitHub Actions step
- name: Check Prettier formatting
  run: npm run format:check

# Example pre-push git hook
#!/bin/sh
npm run format:check || exit 1
```

This ensures all code merged into main branches follows the established formatting standards.
