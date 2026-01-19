import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import {
  LayoutDashboard,
  Search,
  Briefcase,
  ShoppingBag,
  Settings,
  LogOut,
  History,
  Newspaper,
} from "lucide-react";

export function Sidebar({ className }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "pb-12 h-screen border-r border-border bg-sidebar/50 backdrop-blur-xl flex flex-col justify-between",
        className,
      )}
    >
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-6 px-4 text-xl font-black tracking-tight text-foreground flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            SENTINEL
          </h2>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <LayoutDashboard className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <Search className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Search
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Jobs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <ShoppingBag className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Products
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <Newspaper className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              News
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <History className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              History
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h3 className="mb-2 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Settings
          </h3>
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 font-medium text-foreground/80 hover:text-foreground hover:bg-sidebar-accent/50 group transition-all"
            >
              <Settings className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              Preferences
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-border bg-sidebar/20">
        <div className="flex items-center gap-3 group cursor-pointer hover:bg-sidebar-accent/50 p-2 rounded-lg transition-colors">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-medium text-foreground truncate">
              Sentinel User
            </span>
            <span className="text-xs text-muted-foreground truncate">
              pro@sentinel.ai
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
