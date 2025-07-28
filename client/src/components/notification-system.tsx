import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, X, Check, MessageCircle, Heart, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface NotificationSystemProps {
  userId: string;
}

export function NotificationSystem({ userId }: NotificationSystemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["/api/notifications", userId],
    enabled: !!userId,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      await apiRequest(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications", userId] });
    },
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "devotional":
        return <Heart className="w-4 h-4 text-lilac-500" />;
      case "prayer":
        return <MessageCircle className="w-4 h-4 text-sky-500" />;
      case "sponsor":
        return <Gift className="w-4 h-4 text-gold-500" />;
      default:
        return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "devotional":
        return "border-l-lilac-500 bg-lilac-50";
      case "prayer":
        return "border-l-sky-500 bg-sky-50";
      case "sponsor":
        return "border-l-gold-500 bg-gold-50";
      default:
        return "border-l-gray-500 bg-gray-50";
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsReadMutation.mutate(notificationId);
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        size="sm"
        className="relative p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="w-5 h-5 text-lilac-600" />
        {unreadCount > 0 && (
          <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-gold-500 text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 max-h-96 bg-white border border-lilac-200 rounded-lg shadow-lg z-50 overflow-hidden">
          <CardHeader className="pb-3 bg-cream-100">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-display text-lilac-800">
                Notificações
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="p-1 h-auto"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">Nenhuma notificação</p>
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg border-l-4 transition-all cursor-pointer hover:bg-gray-50",
                      getNotificationColor(notification.type),
                      !notification.isRead && "ring-1 ring-lilac-200"
                    )}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "text-sm font-medium text-lilac-800 line-clamp-1",
                          !notification.isRead && "font-semibold"
                        )}>
                          {notification.title}
                        </h4>
                        <p className="text-xs text-lilac-600 line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: ptBR
                          })}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-lilac-500 rounded-full mt-1 flex-shrink-0"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && unreadCount > 0 && (
            <div className="p-3 border-t border-lilac-200 bg-cream-50">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-lilac-600 hover:text-lilac-700"
                onClick={() => {
                  notifications
                    .filter(n => !n.isRead)
                    .forEach(n => markAsReadMutation.mutate(n.id));
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Marcar todas como lidas
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationSystem;