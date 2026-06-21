import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: "▦", end: true },
  { to: "/products", label: "Products", icon: "◧" },
  { to: "/customers", label: "Customers", icon: "◔" },
  { to: "/orders", label: "Orders", icon: "▤" },
];

export default function Navbar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-mark">S</div>
        <div className="sidebar-brand-name">Stockroom</div>
      </div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}
          >
            <span className="icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
