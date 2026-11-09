'use client';

import React from 'react';
import NextLink from 'next/link';
import {
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
  useParams as useNextParams,
} from 'next/navigation';

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  replace?: boolean;
  scroll?: boolean;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, replace, scroll, children, ...props }, ref) => {
    const target = to || href || '#';
    return (
      <NextLink ref={ref} href={target} replace={replace} scroll={scroll} {...props}>
        {children}
      </NextLink>
    );
  }
);
Link.displayName = 'Link';

export const useLocation = () => {
  const pathname = usePathname() || '/';

  return {
    pathname,
    search: typeof window !== 'undefined' ? window.location.search : '',
    hash: typeof window !== 'undefined' ? window.location.hash : '',
    state: null,
    key: 'default',
  };
};

export const useNavigate = () => {
  const router = useRouter();

  return (to: string | number, options?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      if (to === -1) router.back();
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
};

export const useParams = <T extends Record<string, string | string[]>>() => {
  const params = useNextParams();
  return (params || {}) as T;
};

export const useSearchParams = () => {
  const searchParams = useNextSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = (params: Record<string, string> | URLSearchParams) => {
    const newParams = new URLSearchParams(params as any);
    router.replace(`${pathname}?${newParams.toString()}`);
  };

  return [searchParams, setSearchParams] as const;
};

export default {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
};
