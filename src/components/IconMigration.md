# Icon Migration Guide - Lucide to Material Design

## Overview
We're migrating from `lucide-react` to Material Design icons following the Flamingo 2.0 design system anatomy.

## Icon Component Usage

### Before (Lucide React)
```jsx
import { Home, Settings, Menu } from "lucide-react";

<Home className="w-6 h-6 text-gray-600" />
```

### After (Material Design with Icon Component)
```jsx
import { Icon } from "./components/Icon";

<Icon name="Home" size="24" state="default" />
```

## Icon Name Mapping

| Lucide React | Material Design | Notes |
|-------------|----------------|-------|
| `Home` | `Home` | Same name |
| `Settings` | `Settings` | Same name |
| `Menu` | `Menu` | Same name |
| `Store` | `Store` | Same name |
| `Search` | `Search` | Same name |
| `ArrowRight` | `ArrowForward` | Different name |
| `ArrowLeft` | `ArrowBack` | Different name |
| `ChevronRight` | `ChevronRight` | Same name |
| `ChevronLeft` | `ChevronLeft` | Same name |
| `User` | `Person` | Different name |
| `LogOut` | `Logout` | Different name |
| `Moon` | `DarkMode` | Different name |
| `Sun` | `LightMode` | Different name |
| `X` | `Close` | Different name |
| `Copy` | `Copy` | Same name |
| `Trash2` | `Trash` | Different name |
| `Edit` | `Edit` | Same name |
| `Plus` | `Add` | Different name |
| `Check` | `Check` | Same name |
| `Clock` | `Clock` | Same name |
| `Bell` | `Bell` | Same name |
| `FileText` | `FileText` | Same name |
| `BookOpen` | `BookOpen` | Same name |
| `BarChart3` | `BarChart` | Different name |
| `TrendingUp` | `TrendingUp` | Same name |
| `ClipboardList` | `ClipboardList` | Same name |
| `Sparkles` | `Sparkles` | Same name |
| `Headphones` | `HeadsetMic` | Different name |
| `Zap` | `Zap` | Same name |
| `Brain` | `Brain` | Same name |
| `Wand2` | `Wand` | Different name |
| `MessageCircle` | `MessageCircle` | Same name |
| `Mic` | `Mic` | Same name |
| `Activity` | `Activity` | Same name |
| `Cpu` | `Cpu` | Same name |
| `AlertCircle` | `AlertCircle` | Same name |
| `CheckCircle2` | `CheckCircle2` | Same name |
| `Cloud` | `Cloud` | Same name |
| `Mail` | `Mail` | Same name |
| `Send` | `Send` | Same name |
| `Phone` | `Phone` | Same name |
| `ExternalLink` | `ExternalLink` | Same name |
| `Loader2` | `Loader` | Different name |
| `Layers` | `Layers` | Same name |
| `Store` | `Store` | Same name |
| `Monitor` | `Monitor` | Same name |
| `MessageSquare` | `MessageSquare` | Same name |

## State Examples

### Default State
```jsx
<Icon name="Home" size="24" state="default" />
// Text 02 color (#4B4C6A), no background
```

### Hover State
```jsx
<Icon name="Settings" size="24" state="hover" />
// Hover background (#F5F5F5), corner radius
```

### Selected State
```jsx
<Icon name="Home" size="24" state="selected" />
// Primary color icon, Hover background
```

### Toggle State
```jsx
<Icon name="Menu" size="32" state="toggle" />
// Primary color icon, Hover background, corner radius
```

## Migration Steps

1. Replace `lucide-react` imports with `Icon` component
2. Update icon names according to the mapping table
3. Replace className-based sizing with `size` prop
4. Replace className-based colors with `state` prop
5. Remove manual styling - the component handles it

## Example Migration

### Before
```jsx
import { Home, Settings } from "lucide-react";

<button className="flex items-center gap-2">
  <Home className="w-6 h-6 text-gray-600" />
  Home
</button>

<div className="group">
  <Settings className="w-6 h-6 text-gray-600 group-hover:text-primary" />
</div>
```

### After
```jsx
import { Icon } from "./components/Icon";

<button className="flex items-center gap-2">
  <Icon name="Home" size="24" state="default" />
  Home
</button>

<div className="group">
  <Icon name="Settings" size="24" state="hover" />
</div>
```
