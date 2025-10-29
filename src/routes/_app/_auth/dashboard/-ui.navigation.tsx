import {
  Settings,
  LogOut,
  Users,
  Calendar,
} from "lucide-react";
import { cn, useSignOut } from "@/utils/misc";
import { ThemeSwitcher } from "@/ui/theme-switcher";
import { LanguageSwitcher } from "@/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/ui/dropdown-menu";
import { Button } from "@/ui/button";
import { buttonVariants } from "@/ui/button-util";
import { Logo } from "@/ui/logo";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import { Route as DashboardRoute } from "@/routes/_app/_auth/dashboard/_layout.index";
import { Route as SettingsRoute } from "@/routes/_app/_auth/dashboard/_layout.settings.index";
import { Route as TherapistsRoute } from "@/routes/_app/_auth/dashboard/_layout.therapists";
import { Route as BookingsRoute } from "@/routes/_app/_auth/dashboard/_layout.bookings";
import { User } from "~/types";

export function Navigation({ user }: { user: User }) {
  const signOut = useSignOut();
  const matchRoute = useMatchRoute();
  const navigate = useNavigate();
  const isDashboardPath = matchRoute({ to: DashboardRoute.fullPath });
  const isSettingsPath = matchRoute({ to: SettingsRoute.fullPath });
  const isTherapistsPath = matchRoute({ to: TherapistsRoute.fullPath });
  const isBookingsPath = matchRoute({ to: BookingsRoute.fullPath });

  if (!user) {
    return null;
  }

  return (
    <nav className="sticky top-0 z-50 flex w-full flex-col border-b border-border bg-card px-6">
      {/* Top Bar */}
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between py-3">
        <Link to={DashboardRoute.fullPath} className="flex items-center gap-2">
          <Logo />
          <span className="text-xl font-bold text-foreground">RelioSkin</span>
        </Link>

        <div className="flex items-center gap-3">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                {user.avatarUrl ? (
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    alt={user.username ?? user.email}
                    src={user.avatarUrl}
                  />
                ) : (
                  <span className="h-8 w-8 rounded-full bg-gradient-to-br from-lime-400 from-10% via-cyan-300 to-blue-500" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              sideOffset={8}
              align="end"
              className="min-w-56 bg-card p-2"
            >
              <DropdownMenuItem className="group flex-col items-start focus:bg-transparent">
                <p className="text-sm font-medium text-primary/80 group-hover:text-primary group-focus:text-primary">
                  {user?.username || ""}
                </p>
                <p className="text-sm text-primary/60">{user?.email}</p>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => navigate({ to: SettingsRoute.fullPath })}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Settings
                </span>
                <Settings className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Theme
                </span>
                <ThemeSwitcher />
              </DropdownMenuItem>

              <DropdownMenuItem
                className={cn(
                  "group flex h-9 justify-between rounded-md px-2 hover:bg-transparent",
                )}
              >
                <span className="w-full text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Language
                </span>
                <LanguageSwitcher />
              </DropdownMenuItem>

              <DropdownMenuSeparator className="mx-0 my-2" />

              <DropdownMenuItem
                className="group h-9 w-full cursor-pointer justify-between rounded-md px-2"
                onClick={() => signOut()}
              >
                <span className="text-sm text-primary/60 group-hover:text-primary group-focus:text-primary">
                  Log Out
                </span>
                <LogOut className="h-[18px] w-[18px] stroke-[1.5px] text-primary/60 group-hover:text-primary group-focus:text-primary" />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mx-auto flex w-full max-w-screen-xl items-center gap-3 overflow-x-auto">
        <Link
          to={DashboardRoute.fullPath}
          className={cn(
            "flex h-12 items-center border-b-2 px-3",
            isDashboardPath ? "border-primary" : "border-transparent"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            isDashboardPath ? "text-primary" : "text-primary/60 hover:text-primary"
          )}>
            Dashboard
          </span>
        </Link>

        <Link
          to={TherapistsRoute.fullPath}
          className={cn(
            "flex h-12 items-center gap-2 border-b-2 px-3",
            isTherapistsPath ? "border-primary" : "border-transparent"
          )}
        >
          <Users className="h-4 w-4" />
          <span className={cn(
            "text-sm font-medium",
            isTherapistsPath ? "text-primary" : "text-primary/60 hover:text-primary"
          )}>
            Browse Therapists
          </span>
        </Link>

        <Link
          to={BookingsRoute.fullPath}
          className={cn(
            "flex h-12 items-center gap-2 border-b-2 px-3",
            isBookingsPath ? "border-primary" : "border-transparent"
          )}
        >
          <Calendar className="h-4 w-4" />
          <span className={cn(
            "text-sm font-medium",
            isBookingsPath ? "text-primary" : "text-primary/60 hover:text-primary"
          )}>
            My Bookings
          </span>
        </Link>

        <Link
          to={SettingsRoute.fullPath}
          className={cn(
            "flex h-12 items-center border-b-2 px-3",
            isSettingsPath ? "border-primary" : "border-transparent"
          )}
        >
          <span className={cn(
            "text-sm font-medium",
            isSettingsPath ? "text-primary" : "text-primary/60 hover:text-primary"
          )}>
            Settings
          </span>
        </Link>
      </div>
    </nav>
  );
}
