# AppBuilder Component Library

Complete list of all components supported by the AI-Native Visual App Builder, organized by category.

## 📐 Layout Components (5)

1. **App Header** (`app-header`)
   - Application header with branding, navbar, avatar
   - Properties: showLogo, showNavbar, showAvatar, showLoginInfo, backgroundColor, sticky

2. **Toolbar** (`toolbar`)
   - Action toolbar with buttons
   - Properties: showSearch, showActions, backgroundColor, padding

3. **Container** (`container`)
   - Content container
   - Properties: padding, margin, backgroundColor, borderRadius

4. **Grid** (`grid`)
   - Grid layout system
   - Properties: columns (1-12), gap, responsive

5. **Section** (`section`)
   - Page section wrapper
   - Properties: padding, backgroundColor

## 🔧 Platform Components (4)

### SOP Executor Platform
1. **SOP Reasoning Card** (`sop-reasoning-card`)
   - AI reasoning card with SOP matching
   - Properties: showConfidence, showSOPReferences, compact

2. **SOP Viewer** (`sop-viewer`)
   - Document viewer for SOPs
   - Properties: showNavigation, showSearch, defaultZoom (50-200%)

### Field Service Platform
3. **Work Order Card** (`work-order-card`)
   - Field service work order display
   - Properties: showStatus, showPriority, showTechnician

4. **Asset Card** (`asset-card`)
   - Asset information card
   - Properties: showHealth, showLocation, showMaintenance

## 📝 Form Controls (11)

1. **Button** (`button`)
   - Clickable button
   - Variants: primary, secondary, outline, ghost, danger
   - Sizes: small, medium, large

2. **Text Input** (`input`)
   - Single-line text input
   - Types: text, email, password, number, tel, url

3. **Textarea** (`textarea`)
   - Multi-line text input
   - Resize options: none, vertical, horizontal, both

4. **Dropdown** (`dropdown`)
   - Select dropdown with optional multiple selection and search

5. **Checkbox** (`checkbox`)
   - Checkbox input

6. **Radio Button** (`radio`)
   - Radio button group
   - Layout: vertical, horizontal

7. **Switch/Toggle** (`switch`)
   - Toggle switch
   - Sizes: small, medium, large

8. **Date Picker** (`date-picker`)
   - Date selection input
   - Modes: single, range

9. **File Upload** (`file-upload`)
   - File upload input
   - Supports multiple files, max size limits

10. **Slider** (`slider`)
    - Range slider input
    - Configurable min, max, step

11. **Rating** (`rating`)
    - Star rating input
    - Configurable max rating (1-10), optional half stars

## 📊 Data Display Components (8)

1. **Data Table** (`data-table`)
   - Sortable, filterable data table
   - Features: search, pagination, sorting, row selection

2. **List** (`list`)
   - Item list display
   - Layouts: vertical, horizontal

3. **Card** (`card`)
   - Content card container
   - Shadow options: none, sm, md, lg

4. **Badge** (`badge`)
   - Status badge
   - Variants: default, primary, success, warning, danger, info

5. **Tag** (`tag`)
   - Tag/label display
   - Optional closable

6. **Metric Card** (`metric-card`)
   - Display key metrics
   - Optional icon and trend indicators

7. **Stat Card** (`stat-card`)
   - Statistics card with icon
   - Trend indicators: up, down, neutral

8. **Timeline** (`timeline`)
   - Timeline/activity feed
   - Modes: left, right, alternate

## 📈 Charts & Graphs (6)

1. **Bar Chart** (`bar-chart`)
   - Bar chart visualization
   - Options: stacked, horizontal

2. **Line Chart** (`line-chart`)
   - Line chart visualization
   - Options: smooth lines, data points

3. **Pie Chart** (`pie-chart`)
   - Pie chart visualization
   - Option: donut style

4. **Area Chart** (`area-chart`)
   - Area chart visualization
   - Option: stacked areas

5. **Gauge** (`gauge`)
   - Gauge/speedometer chart
   - Configurable min, max, value

6. **Heatmap** (`heatmap`)
   - Heatmap visualization

## 🧭 Navigation Components (5)

1. **Tabs** (`tabs`)
   - Tab navigation
   - Positions: top, bottom, left, right
   - Types: line, card, button

2. **Breadcrumbs** (`breadcrumbs`)
   - Breadcrumb navigation
   - Separators: /, >, •, →

3. **Pagination** (`pagination`)
   - Page navigation
   - Features: page size changer, quick jumper

4. **Menu** (`menu`)
   - Navigation menu
   - Modes: vertical, horizontal, inline
   - Themes: light, dark

5. **Steps** (`steps`)
   - Step indicator
   - Directions: horizontal, vertical

## 💬 Feedback Components (9)

1. **Alert** (`alert`)
   - Alert message
   - Types: success, info, warning, error
   - Optional banner style

2. **Progress Bar** (`progress-bar`)
   - Progress indicator
   - Statuses: active, success, exception, normal

3. **Spinner** (`spinner`)
   - Loading spinner
   - Sizes: small, medium, large

4. **Skeleton** (`skeleton`)
   - Loading skeleton
   - Configurable rows and paragraph mode

5. **Toast** (`toast`)
   - Toast notification
   - Positions: topLeft, topRight, bottomLeft, bottomRight, top, bottom

6. **Modal** (`modal`)
   - Modal dialog
   - Configurable width, closable, centered

7. **Drawer** (`drawer`)
   - Side drawer
   - Placements: top, right, bottom, left

8. **Notification** (`notification`)
   - Notification badge
   - Options: count, dot style, overflow

## 🚀 Advanced Components (7)

1. **Splitter** (`splitter`)
   - Resizable split panel
   - Directions: horizontal, vertical

2. **Resizer** (`resizer`)
   - Resizable container
   - Directions: horizontal, vertical, both

3. **Accordion** (`accordion`)
   - Collapsible accordion
   - Optional single-open mode

4. **Carousel** (`carousel`)
   - Image/content carousel
   - Effects: scroll, fade, slide
   - Autoplay support

5. **Advanced Tabs** (`tabs-advanced`)
   - Tabs with add/remove functionality
   - Features: editable, addable, closable

6. **Tree** (`tree`)
   - Tree structure
   - Features: checkable, draggable, expand all

7. **Transfer** (`transfer`)
   - Transfer list (source/target)
   - Optional search functionality

8. **Advanced Timeline** (`timeline-advanced`)
   - Timeline with custom content
   - Modes: left, right, alternate
   - Optional reverse order

## 📦 Component Templates (3)

Pre-built component blocks for quick app creation:

1. **Dashboard Layout** (`dashboard-layout`)
   - Complete dashboard with metrics and charts

2. **Form Layout** (`form-layout`)
   - Complete form with validation

3. **Detail View** (`detail-view`)
   - Detail page with cards and sections

---

**Total Components: 67**

- Layout: 5
- Platform: 4
- Form Controls: 11
- Data Display: 8
- Charts & Graphs: 6
- Navigation: 5
- Feedback: 9
- Advanced: 8
- Templates: 3

---

*All components support drag-and-drop placement, property customization, data binding, and responsive design. Platform components integrate seamlessly with SOP Executor and Field Service platforms.*

