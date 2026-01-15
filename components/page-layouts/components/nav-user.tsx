"use client";

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/Button";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "https://ui.shadcn.com/avatars/shadcn.jpg"
};

// NavUser removed — placeholder to keep imports stable while cleaning up.
import * as React from "react";

export function NavUser() {
  return null;
}
