import {
  AlertCircle,
  Zap,
  Key,
  Clock,
  BookOpen,
  Wifi,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type ErrorAction = {
  label: string;
  href?: string;
  action?: () => void;
  icon: string;
};

export type ErrorData = {
  type: string;
  title: string;
  message: string;
  actions: ErrorAction[];
};

export default function ErrorDisplay({
  error,
  onDismiss,
}: {
  error: ErrorData;
  onDismiss: () => void;
}) {
  const getIcon = () => {
    switch (error.type) {
      case "quota":
        return <Zap className="w-8 h-8 text-yellow-500" />;
      case "key":
        return <Key className="w-8 h-8 text-red-500" />;
      case "timeout":
        return <Clock className="w-8 h-8 text-orange-500" />;
      case "no_match":
        return <BookOpen className="w-8 h-8 text-blue-500" />;
      case "network":
        return <Wifi className="w-8 h-8 text-red-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getBgColor = () => {
    switch (error.type) {
      case "quota":
        return "bg-yellow-50 border-yellow-200";
      case "key":
        return "bg-red-50 border-red-200";
      case "timeout":
        return "bg-orange-50 border-orange-200";
      default:
        return "bg-red-50 border-red-200";
    }
  };

  return (
    <div className={`${getBgColor()} border-2 rounded-xl p-6 animate-fadeIn`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {getIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{error.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{error.message}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Actions */}
      {error.actions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {error.actions.map((action, i) =>
            action.href ? (
              <Link
                key={i}
                href={action.href}
                className="inline-flex items-center gap-2 px-4 py-2 text-black bg-white rounded-lg text-sm font-medium hover:shadow-md transition-all border"
              >
                <span>{action.icon}</span>
                {action.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                key={i}
                onClick={action.action}
                className="inline-flex items-center gap-2 px-4 py-2  text-black bg-white rounded-lg text-sm font-medium hover:shadow-md transition-all border"
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
