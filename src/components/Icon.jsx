/**
 * Icon Component - Flamingo 2.0 Design System
 * 
 * Follows Material Design icon anatomy:
 * - Default: Text 02 color, no background
 * - Hover: Hover background (#F5F5F5), corner radius based on size
 * - Selected: Primary color icon, Hover background
 * - Toggle: Primary color icon, Hover background, corner radius
 * 
 * Container sizes: 16px, 24px, 32px
 */

import { forwardRef } from "react";
import * as MaterialIcons from "@mui/icons-material";

// Icon name to Material Design icon mapping
const iconMap = {
  // Common
  Calendar: MaterialIcons.CalendarToday,
  CalendarToday: MaterialIcons.CalendarToday,
  Home: MaterialIcons.Home,
  Settings: MaterialIcons.Settings,
  Menu: MaterialIcons.Menu,
  Search: MaterialIcons.Search,
  Add: MaterialIcons.Add,
  Edit: MaterialIcons.Edit,
  Delete: MaterialIcons.Delete,
  CheckCircle: MaterialIcons.CheckCircle,
  CheckCircle2: MaterialIcons.CheckCircle,
  Cancel: MaterialIcons.Cancel,
  ArrowForward: MaterialIcons.ArrowForward,
  ArrowRight: MaterialIcons.ArrowForward,
  ArrowBack: MaterialIcons.ArrowBack,
  ArrowLeft: MaterialIcons.ArrowBack,
  ChevronRight: MaterialIcons.ChevronRight,
  ChevronLeft: MaterialIcons.ChevronLeft,
  ChevronDown: MaterialIcons.ChevronDown,
  MoreVert: MaterialIcons.MoreVert,
  Notifications: MaterialIcons.Notifications,
  Bell: MaterialIcons.Notifications,
  Person: MaterialIcons.Person,
  User: MaterialIcons.Person,
  Store: MaterialIcons.Store,
  Dashboard: MaterialIcons.Dashboard,
  BarChart: MaterialIcons.BarChart,
  BarChart3: MaterialIcons.BarChart,
  Book: MaterialIcons.Book,
  BookOpen: MaterialIcons.MenuBook,
  HeadsetMic: MaterialIcons.HeadsetMic,
  Headphones: MaterialIcons.HeadsetMic,
  Phone: MaterialIcons.Phone,
  Email: MaterialIcons.Email,
  Mail: MaterialIcons.Email,
  CloudUpload: MaterialIcons.CloudUpload,
  Upload: MaterialIcons.Upload,
  Download: MaterialIcons.Download,
  Print: MaterialIcons.Print,
  Wifi: MaterialIcons.Wifi,
  Security: MaterialIcons.Security,
  Speed: MaterialIcons.Speed,
  Storage: MaterialIcons.Storage,
  Database: MaterialIcons.Storage,
  Cloud: MaterialIcons.Cloud,
  LightMode: MaterialIcons.LightMode,
  Sun: MaterialIcons.LightMode,
  DarkMode: MaterialIcons.DarkMode,
  Moon: MaterialIcons.DarkMode,
  Logout: MaterialIcons.Logout,
  LogOut: MaterialIcons.Logout,
  Close: MaterialIcons.Close,
  X: MaterialIcons.Close,
  Check: MaterialIcons.Check,
  Warning: MaterialIcons.Warning,
  AlertTriangle: MaterialIcons.Warning,
  Info: MaterialIcons.Info,
  AlertCircle: MaterialIcons.Info,
  Error: MaterialIcons.Error,
  Send: MaterialIcons.Send,
  FileText: MaterialIcons.Description,
  Description: MaterialIcons.Description,
  Layers: MaterialIcons.Layers,
  Sparkles: MaterialIcons.AutoAwesome,
  AutoAwesome: MaterialIcons.AutoAwesome,
  TrendingUp: MaterialIcons.TrendingUp,
  ClipboardList: MaterialIcons.Assignment,
  Assignment: MaterialIcons.Assignment,
  Package: MaterialIcons.Inventory2,
  Inventory: MaterialIcons.Inventory2,
  Inventory2: MaterialIcons.Inventory2,
  Box: MaterialIcons.Inventory2,
  MessageSquare: MaterialIcons.Message,
  Message: MaterialIcons.Message,
  MessageCircle: MaterialIcons.Message,
  Monitor: MaterialIcons.Monitor,
  Zap: MaterialIcons.FlashOn,
  FlashOn: MaterialIcons.FlashOn,
  Brain: MaterialIcons.Psychology,
  Psychology: MaterialIcons.Psychology,
  Wand: MaterialIcons.AutoFixHigh,
  Wand2: MaterialIcons.AutoFixHigh,
  AutoFixHigh: MaterialIcons.AutoFixHigh,
  Activity: MaterialIcons.Timeline,
  Mic: MaterialIcons.Mic,
  Cpu: MaterialIcons.Memory,
  Memory: MaterialIcons.Memory,
  Clock: MaterialIcons.AccessTime,
  AccessTime: MaterialIcons.AccessTime,
  ExternalLink: MaterialIcons.OpenInNew,
  OpenInNew: MaterialIcons.OpenInNew,
  Plus: MaterialIcons.Add,
  Trash: MaterialIcons.Delete,
  Trash2: MaterialIcons.Delete,
  Copy: MaterialIcons.ContentCopy,
  ContentCopy: MaterialIcons.ContentCopy,
  Eye: MaterialIcons.Visibility,
  Visibility: MaterialIcons.Visibility,
  Save: MaterialIcons.Save,
  Code: MaterialIcons.Code,
  Palette: MaterialIcons.Palette,
  Grid: MaterialIcons.GridOn,
  GridOn: MaterialIcons.GridOn,
  Layout: MaterialIcons.ViewModule,
  ViewModule: MaterialIcons.ViewModule,
  Component: MaterialIcons.Widgets,
  Widgets: MaterialIcons.Widgets,
  Tablet: MaterialIcons.Tablet,
  Smartphone: MaterialIcons.Smartphone,
  Maximize: MaterialIcons.Fullscreen,
  Fullscreen: MaterialIcons.Fullscreen,
  Minimize: MaterialIcons.FullscreenExit,
  FullscreenExit: MaterialIcons.FullscreenExit,
  FilePlus: MaterialIcons.NoteAdd,
  NoteAdd: MaterialIcons.NoteAdd,
  Move: MaterialIcons.DragIndicator,
  DragIndicator: MaterialIcons.DragIndicator,
  AlignLeft: MaterialIcons.FormatAlignLeft,
  FormatAlignLeft: MaterialIcons.FormatAlignLeft,
  AlignCenter: MaterialIcons.FormatAlignCenter,
  FormatAlignCenter: MaterialIcons.FormatAlignCenter,
  AlignRight: MaterialIcons.FormatAlignRight,
  FormatAlignRight: MaterialIcons.FormatAlignRight,
  Bold: MaterialIcons.FormatBold,
  FormatBold: MaterialIcons.FormatBold,
  Italic: MaterialIcons.FormatItalic,
  FormatItalic: MaterialIcons.FormatItalic,
  Link: MaterialIcons.Link,
  Image: MaterialIcons.Image,
  Video: MaterialIcons.Video,
  Type: MaterialIcons.TextFields,
  TextFields: MaterialIcons.TextFields,
  Hash: MaterialIcons.Tag,
  Tag: MaterialIcons.LocalOffer,
  LocalOffer: MaterialIcons.LocalOffer,
  MapPin: MaterialIcons.Place,
  Place: MaterialIcons.Place,
  CreditCard: MaterialIcons.CreditCard,
  Lock: MaterialIcons.Lock,
  Unlock: MaterialIcons.LockOpen,
  LockOpen: MaterialIcons.LockOpen,
  CheckSquare: MaterialIcons.CheckBox,
  CheckBox: MaterialIcons.CheckBox,
  Radio: MaterialIcons.RadioButtonChecked,
  RadioButtonChecked: MaterialIcons.RadioButtonChecked,
  ToggleLeft: MaterialIcons.ToggleOff,
  ToggleOff: MaterialIcons.ToggleOff,
  PieChart: MaterialIcons.PieChart,
  LineChart: MaterialIcons.ShowChart,
  ShowChart: MaterialIcons.ShowChart,
  Badge: MaterialIcons.Badge,
  Loader: MaterialIcons.HourglassEmpty,
  Loader2: MaterialIcons.HourglassEmpty,
  HourglassEmpty: MaterialIcons.HourglassEmpty,
  Sliders: MaterialIcons.Tune,
  Tune: MaterialIcons.Tune,
  GripVertical: MaterialIcons.DragIndicator,
  GripHorizontal: MaterialIcons.DragIndicator,
  Circle: MaterialIcons.RadioButtonUnchecked,
  RadioButtonUnchecked: MaterialIcons.RadioButtonUnchecked,
  Square: MaterialIcons.CropSquare,
  CropSquare: MaterialIcons.CropSquare,
  List: MaterialIcons.List,
  Sidebar: MaterialIcons.ViewSidebar,
  ViewSidebar: MaterialIcons.ViewSidebar,
  Star: MaterialIcons.Star,
  Folder: MaterialIcons.Folder,
  Play: MaterialIcons.PlayArrow,
  PlayArrow: MaterialIcons.PlayArrow,
  MousePointer: MaterialIcons.Mouse,
  Mouse: MaterialIcons.Mouse,
};

/**
 * Icon component with Flamingo 2.0 design system styling
 * @param {string} name - Material Design icon name (e.g., "Calendar", "Home", "Settings")
 * @param {string} size - Icon size: "16" | "24" | "32" (default: "24")
 * @param {string} state - Icon state: "default" | "hover" | "selected" | "toggle" (default: "default")
 * @param {string} className - Additional CSS classes
 * @param {object} iconProps - Additional props to pass to the Material icon
 */
export const Icon = forwardRef(({ 
  name, 
  size = "24", 
  state = "default", 
  className = "",
  ...iconProps 
}, ref) => {
  // Get the Material Design icon component
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Material Design icons. Available icons: ${Object.keys(iconMap).slice(0, 20).join(", ")}...`);
    // Return a placeholder or null
    return null;
  }

  // Container size classes
  const containerSizeMap = {
    "16": "w-4 h-4",
    "24": "w-6 h-6",
    "32": "w-8 h-8",
  };

  // Corner radius based on size (from design system)
  const radiusMap = {
    "16": "rounded-[1px]",
    "24": "rounded-[2px]",
    "32": "rounded-[3px]",
  };

  // State-based styling
  const getStateClasses = () => {
    const baseClasses = "flex items-center justify-center transition-all duration-200";
    const containerSize = containerSizeMap[size];
    const radius = radiusMap[size];

    switch (state) {
      case "default":
        return `${baseClasses} ${containerSize}`;
      
      case "hover":
        return `${baseClasses} ${containerSize} ${radius} bg-hover cursor-pointer`;
      
      case "selected":
        return `${baseClasses} ${containerSize} ${radius} bg-hover`;
      
      case "toggle":
        return `${baseClasses} ${containerSize} ${radius} bg-hover cursor-pointer`;
      
      default:
        return `${baseClasses} ${containerSize}`;
    }
  };

  // Icon color based on state
  const getIconColor = () => {
    switch (state) {
      case "selected":
      case "toggle":
        return "text-primary"; // Primary color for selected/toggle
      default:
        return "text-text02"; // Text 02 color for default
    }
  };

  return (
    <span 
      ref={ref}
      className={`${getStateClasses()} ${className}`}
      style={{ minWidth: `${size}px`, minHeight: `${size}px` }}
    >
      <IconComponent 
        className={getIconColor()}
        style={{ fontSize: `${size}px` }}
        {...iconProps}
      />
    </span>
  );
});

Icon.displayName = "Icon";

export default Icon;
