"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useAuth } from "@/hooks";
import {
  Navbar as NavShell,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarLogo,
  NavbarButton,
} from "@/components/ui";

const LINKS = [
  { name: "Events", link: "/explore" },
  { name: "Cosmic Weather", link: "/cosmic-weather" },
  { name: "Missions", link: "/missions" },
  { name: "Earth Impact", link: "/earth-impact" },
  { name: "Learn", link: "/learn" },
];

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((s) => !s);

  return (
    <NavShell>
      <NavBody>
        <div className="flex items-center">
          <NavbarLogo />
        </div>

        <NavItems items={LINKS} />

        <div className="flex items-center gap-2">
          {isAuthenticated && user ? (
            <>
              <span className="hidden sm:inline text-sm">{user.name}</span>
              {user.role === "scientist" && (
                <NavbarButton href="/scientist" as="a">Dashboard</NavbarButton>
              )}
              {user.role === "admin" && (
                <NavbarButton href="/admin" as="a" variant="dark">
                  Admin
                </NavbarButton>
              )}
              <NavbarButton as="button" onClick={logout} variant="secondary">
                Logout
              </NavbarButton>
            </>
          ) : (
            <>
              <NavbarButton href="/login" as="a" variant="secondary">
                Login
              </NavbarButton>
              <NavbarButton href="/signup" as="a">Sign Up</NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      <MobileNav>
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={mobileOpen} onClick={toggleMobile} />
        </MobileNavHeader>
        <MobileNavMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)}>
          {LINKS.map((l) => (
            <Link key={l.link} href={l.link} onClick={() => setMobileOpen(false)}>
              <a className="w-full py-2">{l.name}</a>
            </Link>
          ))}
          <div className="w-full pt-4">
            {isAuthenticated ? (
              <button className="w-full text-left" onClick={logout}>
                Logout
              </button>
            ) : (
              <div className="flex w-full gap-2">
                <Link href="/login">
                  <a className="flex-1">Login</a>
                </Link>
                <Link href="/signup">
                  <a className="flex-1">Sign Up</a>
                </Link>
              </div>
            )}
          </div>
        </MobileNavMenu>
      </MobileNav>
    </NavShell>
  );
}
