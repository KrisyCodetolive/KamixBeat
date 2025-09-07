import {
 Sidebar,
 SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="h-20 flex justify-center items-center"
      >KAMIX SHOP </SidebarHeader>
      
      <SidebarContent>
        <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}





// Menu items.
const items = [
  {
    title: "Tableau de bord",
    url: "/admin/dashbord",
    //icon: Inbox,
  },
  {
    title: "Vente",
    url: "/admin/sale",
    //icon: Inbox,
  },
  {
    title: "Commentaire",
    url: "/admin/comment",
    //icon: Calendar,
  },
//   {
//     title: "Search",
//     url: "#",
//     icon: Search,
//   },
//   {
//     title: "Settings",
//     url: "#",
//     icon: Settings,
//   },
]