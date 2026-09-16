import { useState } from 'react';
import { HoveredLink, Menu, MenuItem } from '@/components/ui/navbar-menu';

export type NavLink = { href: string; label: string };

export interface DesktopNavProps {
  primary: NavLink[];
  learnLabel: string;
  learnLinks: NavLink[];
}

/** Desktop hover navbar: primary links stay visible, the rest drop down. */
export default function DesktopNav({ primary, learnLabel, learnLinks }: DesktopNavProps) {
  const [active, setActive] = useState<string | null>(null);
  const close = () => setActive(null);
  return (
    <Menu setActive={setActive}>
      <NavLinks links={primary.slice(0, 2)} onEnter={close} />
      <LearnMenu active={active} setActive={setActive} label={learnLabel} links={learnLinks} />
      <NavLinks links={primary.slice(2)} onEnter={close} />
    </Menu>
  );
}

function NavLinks({ links, onEnter }: { links: NavLink[]; onEnter: () => void }) {
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          onMouseEnter={onEnter}
          onFocus={onEnter}
          className="text-sm tracking-wide text-[var(--color-muted)] transition-opacity hover:text-[var(--color-fg)] hover:opacity-70"
        >
          {link.label}
        </a>
      ))}
    </>
  );
}

function LearnMenu(props: {
  active: string | null;
  setActive: (item: string) => void;
  label: string;
  links: NavLink[];
}) {
  return (
    <MenuItem setActive={props.setActive} active={props.active} item={props.label}>
      <div className="flex flex-col space-y-3 text-sm">
        {props.links.map((link) => (
          <HoveredLink key={link.href} href={link.href}>
            {link.label}
          </HoveredLink>
        ))}
      </div>
    </MenuItem>
  );
}
