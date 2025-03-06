import {
  House,
  Cable,
  Bot,
  Inbox,
  ListTodo,
  NotebookText,
  Settings2,
  UserCog,
  CircleHelp,
  MessageSquareQuote,
} from "lucide-react";

export const Navlinks = {
  main: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: House,
    },
    {
      title: "Agent",
      url: "/agents",
      icon: Bot,
    },
    {
      title: "Email",
      url: "/emails",
      icon: Inbox,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: NotebookText,
    },
    {
      title: "Tasks",
      url: "/tasks",
      icon: ListTodo,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: Cable,
    },
  ],
  settings: [
    {
      title: "General",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Account",
      url: "/profile",
      icon: UserCog,
    },
  ],
  extras: [
    {
      title: "Help",
      url: "/profile",
      icon: CircleHelp,
    },
    {
      title: "Feedback",
      url: "/profile",
      icon: MessageSquareQuote,
    },
  ],
};
