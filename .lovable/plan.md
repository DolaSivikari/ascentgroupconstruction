

# Add New Pages to Navigation Menu

## Changes to `src/data/navigation-structure-enhanced.ts`

### 1. Add "Architects & Consultants" to Markets > Industry Partners
Insert after the Developers entry (line 117):
```
{ name: "Architects & Consultants", link: "/for-architects", description: "Design professional partners", icon: "Ruler", badge: "new" }
```

### 2. Add "Emergency Repair" to Services > Restoration Services  
Insert after Sealant Programs (line 76):
```
{ name: "Emergency Repair", link: "/emergency-repair", description: "24/7 urgent response", icon: "AlertTriangle", badge: "important" }
```

**One file changed, two lines added.**

