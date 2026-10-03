import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { inboxDate } from "@/lib/inbox/model";
import {
  loadNotifications,
  markNotificationsRead,
  notificationDestination,
  type InboxNotification,
} from "@/lib/inbox/notifications";

export const NotificationBellInbox = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [authFailed, setAuthFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    let cancelled = false;
    void supabase.auth.getUser().then(({ data, error }) => {
      if (!cancelled) {
        setUserId(data.user?.id || null);
        setAuthFailed(!!error);
      }
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) {
        setUserId(session?.user.id || null);
        setAuthFailed(false);
      }
    });
    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["admin-notifications", userId],
    enabled: !!userId,
    queryFn: () => loadNotifications(userId!),
    refetchInterval: 60_000,
  });
  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`admin-notifications-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "admin_notifications",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          void queryClient.invalidateQueries({
            queryKey: ["admin-notifications", userId],
          });
        },
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
  const markRead = async (notification?: InboxNotification) => {
    if (!userId || busy || notification?.is_read) return;
    setBusy(true);
    try {
      await markNotificationsRead(userId, notification?.id);
      await queryClient.invalidateQueries({
        queryKey: ["admin-notifications", userId],
      });
    } catch {
      toast({
        title: "Could not mark notifications as read",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  };
  const unreadCount = error || authFailed ? 0 : data?.unread || 0;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            error || authFailed
              ? "Inbox notifications unavailable"
              : `Inbox notifications, ${unreadCount} unread`
          }
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-w-[calc(100vw-2rem)]"
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => void markRead()}
              disabled={busy}
              className="h-auto p-0 text-xs text-primary"
            >
              Mark all as read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[400px]">
          {error || authFailed ? (
            <div role="alert" className="p-4 text-sm">
              Could not load notifications.{" "}
              <Button
                variant="outline"
                onClick={() => {
                  if (authFailed) window.location.reload();
                  else void refetch();
                }}
              >
                Retry
              </Button>
            </div>
          ) : isLoading || !userId ? (
            <p className="p-4 text-sm">Loading notifications...</p>
          ) : !data?.recent.length ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No notifications
            </p>
          ) : (
            data.recent.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.is_read ? "bg-muted/50" : ""}`}
                onClick={() => {
                  void markRead(notification);
                  navigate(notificationDestination(notification));
                }}
              >
                <div className="flex items-start justify-between w-full gap-2">
                  <p className="font-medium text-sm break-words">
                    {notification.title}
                  </p>
                  {!notification.is_read && (
                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground break-words">
                  {notification.message}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {inboxDate(notification.created_at)
                    ? formatDistanceToNow(inboxDate(notification.created_at)!, {
                        addSuffix: true,
                      })
                    : "Date unavailable"}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </ScrollArea>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="justify-center cursor-pointer"
          onClick={() => navigate("/admin/inbox")}
        >
          View all in Unified Inbox
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
