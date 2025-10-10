import { Calendar, Home, Inbox, Search, Settings, ChevronDown } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import logo from '@/assets/react.svg';
import { Label } from "./components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "./components/ui/collapsible";
import { useState, useEffect } from "react";
import { HashRouter, useNavigate, Routes, Route } from "react-router";
import HomePage from '@/pages/Home';
import LoginPage from '@/pages/Login';

// Menu items.
const data = [
  {
    title: "Home",
    icon: Home,
    items: [
      {
        title: "Installation",
        url: "#",
        icon: Inbox,
      },
      {
        title: "Project Structure",
        url: "#",
        icon: Inbox,
      },
    ],
  },
  {
    title: "Inbox",
    url: "/home",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

// 创建一个内部组件来使用useSidebar hook
function SidebarContentWrapper() {
  let navigate = useNavigate();
  const { open } = useSidebar()
  const [activeKey, setActiveKey] = useState()
  const [collapsibleStates, setCollapsibleStates] = useState([])

  // 处理Collapsible状态变化
  const handleCollapsibleChange = (title, isOpen) => {
    setCollapsibleStates(prev => ({
      ...prev,
      [title]: isOpen
    }))
  }

  // 收缩所有Collapsible
  const collapseAll = () => {
    const allStates = {}
    data.forEach(item => {
      if (item.items) {
        allStates[item.title] = false
      }
    })
    setCollapsibleStates(allStates)
  }

  useEffect(() => {
    if (!open) {
      collapseAll()
    }
  }, [open])

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex flex-row justify-between content-center items-center">
            <img src={logo} width={30} className="flex flex-row m-2 group-data-[collapsible=icon]:hidden" />
            <SidebarTrigger className="-ml-1 !outline-none w-5" />
          </div>
        </SidebarHeader>
        <SidebarContent className='p-1'>
          <SidebarGroupContent>
            <SidebarMenu>
              {
                data.map(item => {
                  if (item.items) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={collapsibleStates[item.title] || false}
                        className="group/collapsible"
                        onOpenChange={(isOpen) => handleCollapsibleChange(item.title, isOpen)}
                      >
                        <SidebarGroup>
                          <SidebarGroupLabel asChild className={`${!open ? '-ml-1' : ''}`}>
                            <CollapsibleTrigger className='h-8 w-full !border-0 !outline-none ring-0 focus:!ring-0 focus-visible:!ring-0 hover:!bg-purple-400 hover:text-white transition-colors group-data-[collapsible=icon]:!opacity-100 group-data-[collapsible=icon]:!mt-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center '>
                              <item.icon className="size-4 shrink-0" />
                              <span className="ml-3 text-sm group-data-[collapsible=icon]:hidden">{item.title}</span>
                              <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180 group-data-[collapsible=icon]:hidden" />
                            </CollapsibleTrigger>
                          </SidebarGroupLabel>
                          <CollapsibleContent className="pt-4">
                            <SidebarGroupContent className="list-none p-0">
                              {item.items.map((subItem) => (
                                <SidebarMenuItem
                                  key={subItem.title}
                                  className={`mb-2 px-2 py-2 rounded-lg cursor-pointer hover:bg-purple-400 hover:text-white! ${activeKey === subItem.title ? 'bg-purple-700! text-white!' : ''}`}
                                  onClick={() => {
                                    setActiveKey(subItem.title)
                                    navigate(subItem.url)
                                  }}
                                >
                                  <div className={'flex items-center space-x-3 pl-10 truncate'}>
                                    <span className="text-sm">{subItem.title}</span>
                                  </div>
                                </SidebarMenuItem>
                              ))}
                            </SidebarGroupContent>
                          </CollapsibleContent>
                        </SidebarGroup>
                      </Collapsible>
                    )
                  } else {
                    return <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild
                        className={`h-10 hover:bg-purple-400 hover:text-white cursor-pointer pl-6.5 ${activeKey === item.title ? 'bg-purple-700 text-white' : ''} ${!open ? 'ml-1' : ''}`}>
                        <div href={item.url} className="flex flex-row" onClick={() => {
                          setActiveKey(item.title)
                          navigate(item.url)
                        }}>
                          <item.icon />
                          <span className="ml-2 content-center">{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  }
                })
              }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarContent>
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger className='border-none!'>
              <div className="flex flex-row -ml-5 h-8">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Label className='ml-3 group-data-[collapsible=icon]:hidden'>超级管理员</Label>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuItem>Subscription</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Routes>
          <Route path='/' Component={LoginPage} />
          <Route path='/login' Component={LoginPage} />
          <Route path='/home' Component={HomePage} />
          <Route path='/*' element={
            <SidebarProvider>
              <SidebarContentWrapper />
            </SidebarProvider>
          } />
        </Routes>
      </SidebarInset>
    </>
  )
}

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path='/' Component={LoginPage} />
        <Route path='/login' Component={LoginPage} />
        <Route path='/home' Component={HomePage} />
        <Route path='/*' element={
          <SidebarProvider>
            <SidebarContentWrapper />
          </SidebarProvider>
        } />
      </Routes>
    </HashRouter>
  )
}