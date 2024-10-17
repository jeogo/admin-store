import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <nav className="bg-blue-600 p-4 text-white">
        <ul className="flex space-x-4">
          <li><a href="/">Home</a></li>
          <li><a href="/users">Users</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/categories">Categories</a></li>
        </ul>
      </nav>
      <main className="p-4">
        {children}
      </main>
    </div>
  );
}
