import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options) {
          res.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options) {
          res.cookies.set({
            name,
            value: '',
            ...options,
            maxAge: 0,
          });
        },
      },
    }
  );

  // Example: read the current session; adjust redirects/guards later as needed.
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // You can restrict routes here, e.g. protect /dashboard:
  // if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
  //   const redirectUrl = new URL('/login', req.url);
  //   return NextResponse.redirect(redirectUrl);
  // }

  return res;
}

export const config = {
  // Match all routes except Next.js internals and static files.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

