import React, { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import {
  BookOpen, CalendarDays, Database, ExternalLink, Home, Image, ImageIcon, Inbox, LayoutDashboard, LogOut, Megaphone, Menu,
  Search, Settings, ScrollText, Type, Users, UserCog, X
} from 'lucide-react';
import { supabase } from '../supabase';
import { errMsg } from './api';
import { Button, Loading, TextInput, ToastProvider, cx } from './ui';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const SettingsPage = lazy(() => import('./pages/Settings'));
const HeroPage = lazy(() => import('./pages/Hero'));
const TextsPage = lazy(() => import('./pages/Texts'));
const AboutPage = lazy(() => import('./pages/About'));
const GalleryPage = lazy(() => import('./pages/Gallery'));
const InboxPage = lazy(() => import('./pages/Inbox'));
const SeoPage = lazy(() => import('./pages/Seo'));
const UsersPage = lazy(() => import('./pages/Users'));
const BackupPage = lazy(() => import('./pages/Backup'));
const CrudPage = lazy(() => import('./pages/Crud').then(m => ({ default: m.CrudPage })));
import * as cruds from './pages/cruds';

interface NavItem { id: string; label: string; icon: any; group: string }
const SITE_URL = (import.meta.env.VITE_SITE_URL as string) || 'https://www.haadikereshaneshwara.com';
const NAV: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Overview' },
  { id: 'inbox', label: 'Inbox', icon: Inbox, group: 'Overview' },
  { id: 'settings', label: 'Site settings', icon: Settings, group: 'Website' },
  { id: 'hero', label: 'Home banner', icon: ImageIcon, group: 'Website' },
  { id: 'texts', label: 'Page texts', icon: Type, group: 'Website' },
  { id: 'about', label: 'About & history', icon: BookOpen, group: 'Content' },
  { id: 'sevas', label: 'Sevas & poojas', icon: ScrollText, group: 'Content' },
  { id: 'events', label: 'Events', icon: CalendarDays, group: 'Content' },
  { id: 'announcements', label: 'Announcements', icon: Megaphone, group: 'Content' },
  { id: 'gallery', label: 'Gallery', icon: Image, group: 'Content' },
  { id: 'people', label: 'Trustees & priests', icon: Users, group: 'Content' },
  { id: 'seo', label: 'SEO & AI search', icon: Search, group: 'Growth' },
  { id: 'users', label: 'Admin users', icon: UserCog, group: 'System' },
  { id: 'backup', label: 'Backup & history', icon: Database, group: 'System' }
];
const BOTTOM = ['dashboard', 'inbox', 'gallery', 'settings'];

const pageFromPath = () => {
  const p = window.location.pathname.replace(/^\/+/, '').split('/')[0];
  return NAV.some(n => n.id === p) ? p : 'dashboard';
};

function Login({ onRecovery }: { onRecovery?: boolean }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ t: 'err' | 'ok'; s: string } | null>(null);
  const [mode, setMode] = useState<'in' | 'forgot' | 'new'>(onRecovery ? 'new' : 'in');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setMsg(null);
    try {
      if (!supabase) throw new Error('Supabase is not configured (.env missing).');
      if (mode === 'in') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: pw });
        if (error) throw error;
      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + '/' });
        if (error) throw error;
        setMsg({ t: 'ok', s: 'Check your email for the reset link.' });
      } else {
        if (pw.length < 8) throw new Error('Use at least 8 characters.');
        const { error } = await supabase.auth.updateUser({ password: pw });
        if (error) throw error;
        setMsg({ t: 'ok', s: 'Password changed. You are signed in.' }); setMode('in');
        window.history.replaceState({}, '', '/');
      }
    } catch (err) { setMsg({ t: 'err', s: errMsg(err) }); } finally { setBusy(false); }
  };

  return (
    <div className="min-h-[100dvh] bg-gradient-to-b from-stone-900 to-stone-950 flex items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5">
        <div className="text-center">
          <div className="text-5xl mb-2">🕉️</div>
          <h1 className="text-xl font-bold text-stone-900">Temple Admin</h1>
          <p className="text-sm text-stone-500">Shri Kshetra Haadikere</p>
        </div>
        {mode !== 'new' && <TextInput label="Email" type="email" autoComplete="username" required value={email} onChange={setEmail} />}
        {mode !== 'forgot' && <TextInput label={mode === 'new' ? 'New password' : 'Password'} type="password" autoComplete={mode === 'new' ? 'new-password' : 'current-password'} required value={pw} onChange={setPw} />}
        {msg && <div className={cx('text-sm rounded-xl px-3.5 py-2.5', msg.t === 'err' ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700')}>{msg.s}</div>}
        <Button type="submit" loading={busy} className="w-full">{mode === 'in' ? 'Sign in' : mode === 'forgot' ? 'Send reset link' : 'Save new password'}</Button>
        {mode !== 'new' && (
          <button type="button" className="w-full text-sm text-stone-500 hover:text-saffron-700 cursor-pointer" onClick={() => { setMode(mode === 'in' ? 'forgot' : 'in'); setMsg(null); }}>
            {mode === 'in' ? 'Forgot password?' : '← Back to sign in'}
          </button>
        )}
      </form>
    </div>
  );
}

function Shell({ session, role }: { session: any; role: string }) {
  const [page, setPage] = useState(pageFromPath);
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  const go = useCallback((p: string) => {
    setPage(p); setOpen(false);
    window.history.pushState({}, '', p === 'dashboard' ? '/' : `/${p}`);
    window.scrollTo({ top: 0 });
  }, []);
  useEffect(() => { const h = () => setPage(pageFromPath()); window.addEventListener('popstate', h); return () => window.removeEventListener('popstate', h); }, []);
  useEffect(() => {
    supabase?.from('contact_messages').select('*', { count: 'exact', head: true }).eq('is_read', false).then(({ count }) => setUnread(count || 0));
  }, [page]);

  const cur = NAV.find(n => n.id === page)!;
  const groups = Array.from(new Set(NAV.map(n => n.group)));
  const isSuper = role === 'admin';

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard go={go} email={session.user.email} />;
      case 'inbox': return <InboxPage />;
      case 'settings': return <SettingsPage />;
      case 'hero': return <HeroPage />;
      case 'texts': return <TextsPage />;
      case 'about': return <AboutPage />;
      case 'sevas': return <CrudPage cfg={cruds.sevasCfg} />;
      case 'events': return <CrudPage cfg={cruds.eventsCfg} />;
      case 'announcements': return (<div className="space-y-10"><CrudPage cfg={cruds.announcementsCfg} /><CrudPage cfg={cruds.notificationsCfg} /></div>);
      case 'gallery': return <GalleryPage />;
      case 'people': return <CrudPage cfg={cruds.committeeCfg} />;
      case 'seo': return <SeoPage />;
      case 'users': return <UsersPage isSuper={isSuper} myId={session.user.id} />;
      case 'backup': return <BackupPage />;
      default: return null;
    }
  };

  const NavList = (
    <nav className="space-y-5">
      {groups.map(g => (
        <div key={g}>
          <div className="px-3 mb-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">{g}</div>
          {NAV.filter(n => n.group === g).map(n => (
            <button key={n.id} onClick={() => go(n.id)}
              className={cx('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px]',
                page === n.id ? 'bg-saffron-600 text-white' : 'text-stone-300 hover:bg-stone-800')}>
              <n.icon className="w-[18px] h-[18px] shrink-0" /> <span className="flex-1 text-left">{n.label}</span>
              {n.id === 'inbox' && unread > 0 && <span className="bg-white text-saffron-700 text-[11px] font-bold rounded-full px-1.5 min-w-5 text-center">{unread}</span>}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
  const Footer = (
    <div className="space-y-2 pt-4 border-t border-stone-800">
      <a href={SITE_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-300 hover:bg-stone-800"><ExternalLink className="w-[18px] h-[18px]" /> View website</a>
      <button onClick={() => supabase?.auth.signOut()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-stone-300 hover:bg-stone-800 cursor-pointer"><LogOut className="w-[18px] h-[18px]" /> Sign out</button>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-stone-100 lg:flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-stone-900 p-4 h-[100dvh] sticky top-0 overflow-y-auto">
        <div className="flex items-center gap-2.5 px-3 py-3 mb-4"><span className="text-2xl">🕉️</span><div><div className="text-white font-bold leading-tight">Temple Admin</div><div className="text-[11px] text-stone-400">Haadikere</div></div></div>
        <div className="flex-1">{NavList}</div>{Footer}
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-40 bg-stone-900 text-white flex items-center gap-3 px-4 h-14 pt-[env(safe-area-inset-top)] box-content">
        <button onClick={() => setOpen(true)} className="p-2 -ml-2 cursor-pointer" aria-label="Menu"><Menu className="w-6 h-6" /></button>
        <div className="font-bold flex-1 truncate">{cur.label}</div>
        <a href={SITE_URL} target="_blank" rel="noopener noreferrer" aria-label="View website" className="p-2"><ExternalLink className="w-5 h-5" /></a>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-stone-900 p-4 overflow-y-auto flex flex-col">
            <div className="flex items-center justify-between mb-4"><span className="text-white font-bold">Menu</span><button onClick={() => setOpen(false)} className="text-white p-2 cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button></div>
            <div className="flex-1">{NavList}</div>{Footer}
          </div>
        </div>
      )}

      <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-10 py-5 lg:py-8 pb-28 lg:pb-10 max-w-5xl w-full mx-auto">
        <Suspense fallback={<Loading />}>{renderPage()}</Suspense>
      </main>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-stone-200 grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {BOTTOM.map(id => { const n = NAV.find(x => x.id === id)!; return (
          <button key={id} onClick={() => go(id)} className={cx('relative flex flex-col items-center justify-center gap-0.5 h-16 text-[11px] font-semibold cursor-pointer', page === id ? 'text-saffron-600' : 'text-stone-500')}>
            <n.icon className="w-5 h-5" />{n.label.split(' ')[0]}
            {id === 'inbox' && unread > 0 && <span className="absolute top-2 right-[28%] bg-saffron-600 text-white text-[10px] rounded-full px-1.5">{unread}</span>}
          </button>); })}
        <button onClick={() => setOpen(true)} className="flex flex-col items-center justify-center gap-0.5 h-16 text-[11px] font-semibold text-stone-500 cursor-pointer"><Menu className="w-5 h-5" />More</button>
      </nav>
    </div>
  );
}

export default function AdminApp() {
  const [session, setSession] = useState<any>(undefined);
  const [role, setRole] = useState<string | null | undefined>(undefined);
  const [recovery, setRecovery] = useState(false);

  useEffect(() => {
    if (!supabase) { setSession(null); return; }
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((ev, s) => { if (ev === 'PASSWORD_RECOVERY') setRecovery(true); setSession(s); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session || !supabase) { setRole(undefined); return; }
    supabase.from('admin_users').select('role').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => setRole(data?.role ?? null));
  }, [session?.user?.id]);

  useEffect(() => {
    document.title = 'Temple Admin';
    if ('serviceWorker' in navigator && import.meta.env.PROD) navigator.serviceWorker.register('/sw.js').catch(() => {});
  }, []);

  let body: React.ReactNode;
  if (session === undefined) body = <div className="min-h-[100dvh] flex items-center justify-center"><Loading /></div>;
  else if (!session || recovery) body = <Login onRecovery={recovery} />;
  else if (role === undefined) body = <div className="min-h-[100dvh] flex items-center justify-center"><Loading label="Checking access…" /></div>;
  else if (role === null) body = (
    <div className="min-h-[100dvh] flex items-center justify-center p-6 bg-stone-100">
      <div className="max-w-md bg-white rounded-2xl p-6 shadow text-center space-y-3">
        <h1 className="text-lg font-bold">No admin access</h1>
        <p className="text-sm text-stone-600"><b>{session.user.email}</b> is not an admin yet. Run <code className="bg-stone-100 px-1 rounded">select public.make_admin('{session.user.email}');</code> in the Supabase SQL editor.</p>
        <Button variant="secondary" onClick={() => supabase?.auth.signOut()}>Sign out</Button>
      </div>
    </div>
  );
  else body = <Shell session={session} role={role} />;

  return <ToastProvider>{body}</ToastProvider>;
}
