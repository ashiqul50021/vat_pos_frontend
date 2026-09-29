import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface RouterContextType {
  pathname: string;
  navigate: (to: string, options?: { replace?: boolean }) => void;
}

const RouterContext = createContext<RouterContextType>({
  pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
  navigate: () => {},
});

export const Router: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window === 'undefined') return '/';
    // If on root, default to /counters
    return window.location.pathname === '/' ? '/counters' : window.location.pathname;
  });

  useEffect(() => {
    // Check if handling SSO /auth-bridge
    if (window.location.pathname === '/auth-bridge') {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');
      const branchId = params.get('branchId');
      const userName = params.get('userName');
      const userRole = params.get('userRole');
      const userId = params.get('userId');
      const branchName = params.get('branchName');

      if (token) localStorage.setItem('auth_token', token);
      if (branchId) localStorage.setItem('branch_id', branchId);
      if (userName && userName !== 'undefined' && userName !== 'null') localStorage.setItem('user_name', userName);
      if (userRole && userRole !== 'undefined' && userRole !== 'null') localStorage.setItem('user_role', userRole);
      if (userId && userId !== 'undefined' && userId !== 'null') localStorage.setItem('user_id', userId);
      if (branchName && branchName !== 'undefined' && branchName !== 'null') localStorage.setItem('branch_name', branchName);

      window.history.replaceState({}, '', '/counters');
      setPathname('/counters');
      return;
    }

    // Ensure default route is always /counters unless on /pos
    if (window.location.pathname !== '/pos' && window.location.pathname !== '/counters') {
      window.history.replaceState({}, '', '/counters');
      setPathname('/counters');
    }

    const handlePopState = () => {
      const current = window.location.pathname;
      if (current !== '/pos' && current !== '/counters') {
        window.history.replaceState({}, '', '/counters');
        setPathname('/counters');
      } else {
        setPathname(current);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string, options?: { replace?: boolean }) => {
    if (options?.replace) {
      window.history.replaceState({}, '', to);
    } else {
      window.history.pushState({}, '', to);
    }
    setPathname(to);
  }, []);

  return (
    <RouterContext.Provider value={{ pathname, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => useContext(RouterContext);

export const useNavigate = () => {
  const { navigate } = useRouter();
  return navigate;
};

export const useLocation = () => {
  const { pathname } = useRouter();
  return { pathname };
};

export interface RouteProps {
  path: string;
  element: ReactNode;
}

export const Route: React.FC<RouteProps> = ({ path, element }) => {
  const { pathname } = useRouter();
  if (pathname !== path) return null;
  return <>{element}</>;
};

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string;
  replace?: boolean;
}

export const Link: React.FC<LinkProps> = ({ to, replace, onClick, children, ...props }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.altKey && !e.shiftKey) {
      e.preventDefault();
      navigate(to, { replace });
    }
  };

  return (
    <a href={to} onClick={handleClick} {...props}>
      {children}
    </a>
  );
};

export const Navigate: React.FC<{ to: string; replace?: boolean }> = ({ to, replace = true }) => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace });
  }, [to, replace, navigate]);
  return null;
};
