import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import {
  ArrowRight,
  Home,
  Menu,
  Sparkles,
  User
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet';

const navItems = [
  { label: 'Home', href: '/', type: 'route' },
  { label: 'Features', href: '/#features', type: 'anchor' },
  { label: 'How it Works', href: '/#how-it-works', type: 'anchor' },
  { label: 'Pricing', href: '/#pricing', type: 'anchor' },
  { label: 'Dashboard', href: '/profile', type: 'route' },
];

const Layout = ({ children }) => {
  const location = useLocation();

  const isActive = item => {
    if (item.href === '/' && location.pathname === '/') return true;
    if (item.href === '/profile' && location.pathname === '/profile') return true;
    if (item.href === '/#features' || item.href === '/#how-it-works' || item.href === '/#pricing') {
      return location.pathname === '/';
    }
    return false;
  };

  return (
    <div className='min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.08),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(124,58,237,0.08),_transparent_26%),linear-gradient(to_bottom,#ffffff_0%,#fafafa_100%)] text-slate-900'>
      <div className='pointer-events-none fixed inset-0 -z-10 overflow-hidden'>
        <div className='absolute left-[-10%] top-16 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl' />
        <div className='absolute right-[-6%] top-44 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl' />
        <div className='absolute bottom-[-10%] left-1/3 h-64 w-64 rounded-full bg-blue-200/20 blur-3xl' />
      </div>

      <header className='sticky top-0 z-50 px-3 pt-3 sm:px-4'>
        <div className='mx-auto max-w-7xl rounded-[28px] border border-white/60 bg-white/70 shadow-[0_10px_40px_rgba(15,23,42,0.08)] backdrop-blur-2xl'>
          <div className='flex items-center justify-between px-4 py-3 sm:px-6'>
            <Link to='/' className='flex items-center gap-3'>
              <div className='flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 text-white shadow-lg shadow-slate-300/60'>
                <Sparkles className='h-5 w-5' />
              </div>
              <div>
                <div className='text-lg font-semibold tracking-tight'>AI Interview</div>
                <div className='text-xs text-slate-500'>Premium interview intelligence</div>
              </div>
            </Link>

            <nav className='hidden items-center gap-1 rounded-full border border-slate-200/70 bg-white/70 p-1.5 lg:flex'>
              {navItems.map(item => (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive(item)
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-300/60'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className='flex items-center gap-3'>
              <SignedOut>
                <SignInButton mode='modal'>
                  <Button variant='outline' size='sm' className='hidden sm:inline-flex'>
                    Login
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link to='/profile' className='hidden items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:inline-flex'>
                  <User className='h-4 w-4' />
                  Dashboard
                </Link>
              </SignedIn>
              <Link to='/form'>
                <Button variant='gradient' size='sm' className='hidden sm:inline-flex'>
                  Start Interview
                  <ArrowRight className='h-4 w-4' />
                </Button>
              </Link>

              <div className='lg:hidden'>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant='outline' size='icon' className='border-slate-200 bg-white/80'>
                      <Menu className='h-5 w-5' />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side='right' className='w-[88vw] border-slate-200 bg-white/95 backdrop-blur-2xl sm:w-[420px]'>
                    <SheetHeader className='text-left'>
                      <SheetTitle className='text-xl'>Navigate</SheetTitle>
                    </SheetHeader>
                    <div className='mt-8 space-y-2'>
                      {navItems.map(item => (
                        <Link
                          key={item.label}
                          to={item.href}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-4 text-base font-medium transition-all duration-300 ${
                            isActive(item)
                              ? 'border-slate-900 bg-slate-900 text-white'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{item.label}</span>
                          <ArrowRight className='h-4 w-4' />
                        </Link>
                      ))}
                    </div>
                    <div className='mt-8 space-y-3 border-t border-slate-200 pt-6'>
                      <SignedOut>
                        <SignInButton mode='modal'>
                          <Button variant='outline' className='w-full rounded-full'>
                            Login
                          </Button>
                        </SignInButton>
                      </SignedOut>
                      <Link to='/form' className='block'>
                        <Button variant='gradient' className='w-full rounded-full'>
                          Start Interview
                        </Button>
                      </Link>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className='relative'>{children}</main>

      <footer className='mt-20 border-t border-slate-200/80 bg-white/70 backdrop-blur-xl'>
        <div className='mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8'>
          <div>
            <p className='text-base font-medium text-slate-900'>AI Interview</p>
            <p className='text-sm text-slate-500'>Premium interview preparation for modern teams.</p>
          </div>
          <div className='flex items-center gap-3 text-sm text-slate-500'>
            <Home className='h-4 w-4' />
            <span>Built for focused practice, feedback, and confidence.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
