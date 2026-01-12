# Icon Component - Flamingo 2.0 Design System

## Usage

```jsx
import { Icon } from "./components/Icon";

// Default state (Text 02 color, no background)
<Icon name="Calendar" size="24" state="default" />

// Hover state (Hover background, corner radius)
<Icon name="Calendar" size="24" state="hover" />

// Selected state (Primary color icon, Hover background)
<Icon name="Calendar" size="24" state="selected" />

// Toggle state (Primary color icon, Hover background, corner radius)
<Icon name="Calendar" size="24" state="toggle" />
```

## Available Sizes
- `16` - 16px container
- `24` - 24px container (default)
- `32` - 32px container

## Available States
- `default` - Text 02 color (#4B4C6A), no background
- `hover` - Hover background (#F5F5F5), corner radius based on size
- `selected` - Primary color icon, Hover background
- `toggle` - Primary color icon, Hover background, corner radius

## Material Design Icons
All icons are from Material Design. Use the icon name as it appears in Material Design (e.g., "Calendar", "Home", "Settings", "Menu", etc.).

## Examples

```jsx
// Navigation icon
<Icon name="Home" size="24" state={active ? "selected" : "default"} />

// Button icon
<button className="flex items-center gap-2">
  <Icon name="Add" size="24" state="default" />
  Add Item
</button>

// Interactive icon with hover
<div className="group">
  <Icon name="Settings" size="32" state="hover" />
</div>
```
