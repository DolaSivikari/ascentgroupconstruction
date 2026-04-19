
The user is pointing out a real architectural problem: admin pages are visually inconsistent because each page invents its own header, spacing, card style, etc. The fix isn't to redesign every page — it's to create a shared `AdminPageShell` (page header + content container + spacing rules) and adopt it across the most-used pages.

Before I propose a plan I need to actually verify the scope: how many admin pages are there, what header patterns do they use today, and is there already an attempted shared component?
