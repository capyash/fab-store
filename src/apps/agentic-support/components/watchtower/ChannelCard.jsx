/**
 * Channel Card Component
 * Displays entry channel volume metrics
 * Author: Vinod Kumar V (VKV)
 */

import { Phone, MessageSquare, Mail, MessageCircle, FileText, Smartphone, Code, TrendingUp, TrendingDown } from "lucide-react";

const CHANNEL_ICONS = {
  voice: Phone,
  chat: MessageSquare,
  email: Mail,
  sms: MessageCircle,
  whatsapp: MessageCircle,
  web: FileText,
  mobile: Smartphone,
  api: Code,
};

const CHANNEL_COLORS = {
  voice: "text-neutral02 bg-neutral01 border-neutral01",
  chat: "text-text01 bg-bg02 border-stroke01",
  email: "text-text01 bg-bg02 border-stroke01",
  sms: "text-text01 bg-bg02 border-stroke01",
  whatsapp: "text-text01 bg-bg02 border-stroke01",
  web: "text-text01 bg-bg02 border-stroke01",
  mobile: "text-text01 bg-bg02 border-stroke01",
  api: "text-text01 bg-bg02 border-stroke01",
};

export default function ChannelCard({ channel, volume, auto_resolved, escalated }) {
  const Icon = CHANNEL_ICONS[channel] || MessageSquare;
  const colorClass = CHANNEL_COLORS[channel] || "text-text01 bg-bg02 border-stroke01";
  const channelLabel = channel.charAt(0).toUpperCase() + channel.slice(1).replace(/_/g, " ");
  
  // Calculate trend (mock for now)
  const trend = Math.random() > 0.5 ? "up" : "down";
  const trendPercent = Math.floor(Math.random() * 20) + 5;
  
  return (
    <div className={`relative rounded-lg border bg-white p-4 hover:border-stroke01 hover:shadow-sm transition-all cursor-pointer`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClass.split(' ')[1]} ${colorClass.split(' ')[2]}`}>
          <Icon className={`w-4 h-4 ${colorClass.split(' ')[0]}`} />
        </div>
        {trend === "up" ? (
          <TrendingUp className="w-3 h-3 text-text03" />
        ) : (
          <TrendingDown className="w-3 h-3 text-text03" />
        )}
      </div>
      
      <div className="text-2xl font-semibold text-text01 mb-1">{volume.toLocaleString()}</div>
      <div className="text-xs text-text02 mb-2">{channelLabel}</div>
      
      <div className="flex items-center gap-2 text-xs text-text03">
        <span>{trend === "up" ? "↑" : "↓"} {trendPercent}%</span>
        <span>•</span>
        <span>{auto_resolved.toLocaleString()} auto</span>
      </div>
    </div>
  );
}
