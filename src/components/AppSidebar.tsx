import { NavLink, useLocation } from "react-router-dom";
import {
  BookOpen,
  Plus,
  Upload,
  FileText,
  Play,
  BookmarkIcon,
  LayoutDashboard,
  Menu,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Generar examen IA", url: "/generate", icon: Plus },
  { title: "Subir examen Aiken", url: "/upload-aiken", icon: Upload },
  { title: "Mis exámenes", url: "/exams", icon: FileText },
  { title: "Practicar", url: "/practice", icon: Play },
  { title: "Flash-cards", url: "/flashcards", icon: BookmarkIcon },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavCls = (active: boolean) =>
    active 
      ? "bg-blue-100 text-blue-700 font-medium border-r-2 border-blue-500" 
      : "hover:bg-blue-50 text-gray-700 hover:text-blue-600";

  return (
    <Sidebar collapsible="icon" className={`flex-shrink-0 border-r border-blue-200 bg-white shadow-sm transition-all duration-300 ${collapsed ? 'w-[76px]' : ''}`}>
      <div className="flex flex-col justify-center h-full">
        <div className="p-4  border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {!collapsed ? (
              <>
                <div className="w-9 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <div>
                    <h1 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                      Exam Maker
                      <button
                        className="ml-2 w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-blue-100 border border-gray-200 transition"
                        onClick={toggleSidebar}
                        title="Plegar menú"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    </h1>
                    <p className="text-xs text-gray-500">Generador de exámenes</p>
                  </div>
                </div>
              </>
            ) : (
              <button
                className="w-6 h-6 flex items-center justify-center rounded-full  transition mx-auto"
                onClick={toggleSidebar}
                title="Expandir menú"
              >
                <ChevronRight className="w-6 h-6 text-gray" />
              </button>
            )}
          </div>
        </div>

        <SidebarContent className="py-4">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={collapsed ? item.title : undefined}>
                      <NavLink 
                        to={item.url} 
                        end={item.url === "/"} 
                        className={`${getNavCls(isActive(item.url))} transition-all duration-200 rounded-lg mx-2 px-3 py-2 flex items-center gap-3`}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && <span className="truncate">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </div>
    </Sidebar>
  );
}
