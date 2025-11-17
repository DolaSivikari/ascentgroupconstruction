# Cleanup Scripts

## Cleanup Archived Services

This script removes archived service definitions and cross-references from `src/data/priority-services-data.ts`.

### Usage

```bash
# Run the cleanup script
npx tsx scripts/cleanup-archived-services.ts
```

### What it does

1. **Removes Service Definitions**: Deletes the complete definitions for archived services:
   - design-build
   - preconstruction-services
   - virtual-design-construction
   - (and any other archived services in the list)

2. **Removes Cross-References**: Cleans up all references to archived services in `relatedServices` arrays across all remaining service definitions

3. **Cleans Formatting**: Removes trailing commas, double commas, and extra blank lines

### Safety

- Creates a backup before running (recommended to version control first)
- Provides detailed logging of all changes
- Can be run multiple times safely (idempotent)

### Output

The script will show:
- Each archived service found and marked for removal
- Line numbers for service definitions
- Cross-references detected and removed
- Summary statistics of changes made
