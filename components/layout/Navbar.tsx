"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    // @ts-expect-error - NavShell children type mismatch
    <NavShell>
      {/* @ts-expect-error - NavBody children type mismatch */}
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
                // @ts-expect-error - NavbarButton missing children
                <NavbarButton href="/scientist" as="a">Dashboard</NavbarButton>
              )}
              {user.role === "admin" && (
                // @ts-expect-error - NavbarButton missing children
                <NavbarButton href="/admin" as="a" variant="dark">
                  Admin
                </NavbarButton>
              )}
              {/* @ts-expect-error - NavbarButton missing children */}
              <NavbarButton as="button" onClick={logout} variant="secondary">
                Logout
              </NavbarButton>
            </>
          ) : (
            <>
              {/* @ts-expect-error - NavbarButton missing children */}
              <NavbarButton href="/login" as="a" variant="secondary">
                Login
              </NavbarButton>
              {/* @ts-expect-error - NavbarButton missing children */}
              <NavbarButton href="/signup" as="a">Sign Up</NavbarButton>
            </>
          )}
        </div>
      </NavBody>

      {/* @ts-expect-error - MobileNav children type mismatch */}
      <MobileNav>
        {/* @ts-expect-error - MobileNavHeader children type mismatch */}
        <MobileNavHeader>
          <NavbarLogo />
          <MobileNavToggle isOpen={mobileOpen} onClick={toggleMobile} />
        </MobileNavHeader>
        {/* @ts-expect-error - MobileNavMenu children type mismatch */}
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
