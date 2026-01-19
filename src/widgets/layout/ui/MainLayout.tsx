import { Sidebar } from "@/widgets/sidebar/ui/Sidebar";
import { ScrollArea } from "@/shared/ui/scroll-area";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground font-sans selection:bg-primary selection:text-primary-foreground">
      <Sidebar className="w-64 hidden lg:block" />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        <ScrollArea className="flex-1 h-full">
          <div className="container max-w-7xl mx-auto p-6 lg:p-10 space-y-8">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
