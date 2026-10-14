import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Check, ImagePlus, Loader2, Trash2, X, AlertTriangle, Upload } from 'lucide-react';
import { uploadMedia, errMsg } from './api';

export const cx = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(' ');

/* ------------------------------ Toasts ------------------------------ */
type Toast = { id: number; kind: 'ok' | 'err' | 'info'; text: string };
const ToastCtx = createContext<{ push: (kind: Toast['kind'], text: string) => void }>({ push: () => {} });
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setItems(p => [...p, { id, kind, text }]);
    setTimeout(() => setItems(p => p.filter(t => t.id !== id)), kind === 'err' ? 7000 : 3200);
  }, []);
  return (
    <ToastCtx.Provider value={{ push }}>
      {children}
      <div className="fixed z-[100] left-0 right-0 bottom-20 lg:bottom-6 flex flex-col items-center gap-2 px-4 pointer-events-none">
        {items.map(t => (
          <div key={t.id} role="status"
            className={cx('pointer-events-auto max-w-md w-full sm:w-auto rounded-xl px-4 py-3 text-sm font-medium shadow-xl flex items-start gap-2.5 border',
              t.kind === 'ok' && 'bg-emerald-600 text-white border-emerald-500',
              t.kind === 'err' && 'bg-red-600 text-white border-red-500',
              t.kind === 'info' && 'bg-stone-900 text-white border-stone-700')}>
            {t.kind === 'ok' ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : t.kind === 'err' ? <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" /> : null}
            <span className="break-words">{t.text}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ------------------------------ Basics ------------------------------ */
export function Spinner({ className = 'w-5 h-5' }: { className?: string }) {
  return <Loader2 className={cx('animate-spin text-saffron-600', className)} />;
}

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex items-center justify-center gap-3 py-16 text-stone-500 text-sm"><Spinner /> {label}</div>;
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; size?: 'sm' | 'md'; loading?: boolean;
};
export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button {...rest} disabled={disabled || loading}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all select-none touch-manipulation',
        'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] cursor-pointer',
        size === 'sm' ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm min-h-[44px]',
        variant === 'primary' && 'bg-saffron-600 hover:bg-saffron-700 text-white shadow-sm',
        variant === 'secondary' && 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300',
        variant === 'danger' && 'bg-red-600 hover:bg-red-700 text-white',
        variant === 'ghost' && 'hover:bg-stone-100 text-stone-700',
        className)}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

export function Card({ title, subtitle, actions, children, className }: {
  title?: React.ReactNode; subtitle?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={cx('bg-white rounded-2xl border border-stone-200 shadow-xs', className)}>
      {(title || actions) && (
        <header className="flex items-start justify-between gap-3 px-4 sm:px-5 pt-4 sm:pt-5">
          <div className="min-w-0">
            {title && <h2 className="text-base sm:text-lg font-bold text-stone-900">{title}</h2>}
            {subtitle && <p className="text-xs sm:text-sm text-stone-500 mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-stone-500 mt-1 max-w-2xl">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Badge({ children, tone = 'stone' }: { children: React.ReactNode; tone?: 'stone' | 'green' | 'amber' | 'red' | 'blue' }) {
  const m = { stone: 'bg-stone-100 text-stone-700', green: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-800', red: 'bg-red-100 text-red-700', blue: 'bg-sky-100 text-sky-700' };
  return <span className={cx('inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-bold', m[tone])}>{children}</span>;
}

export function Empty({ icon, title, hint, action }: { icon?: React.ReactNode; title: string; hint?: string; action?: React.ReactNode }) {
  return (
    <div className="text-center py-12 px-4">
      {icon && <div className="mx-auto w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mb-3">{icon}</div>}
      <p className="font-semibold text-stone-700">{title}</p>
      {hint && <p className="text-sm text-stone-500 mt-1 max-w-sm mx-auto">{hint}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

/* ------------------------------ Form fields ------------------------------ */
const inputCls = 'w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-saffron-500/40 focus:border-saffron-500 min-h-[44px]';

export function Field({ label, help, children, className, counter }: {
  label?: string; help?: string; children: React.ReactNode; className?: string; counter?: React.ReactNode;
}) {
  return (
    <label className={cx('block', className)}>
      {label && (
        <span className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-semibold text-stone-800">{label}</span>
          {counter}
        </span>
      )}
      {children}
      {help && <span className="block text-xs text-stone-500 mt-1.5 leading-relaxed">{help}</span>}
    </label>
  );
}

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  label?: string; help?: string; onChange: (v: string) => void; className?: string;
};
export function TextInput({ label, help, onChange, className, ...rest }: InputProps) {
  return (
    <Field label={label} help={help} className={className}>
      <input {...rest} onChange={e => onChange(e.target.value)} value={rest.value ?? ''} className={inputCls} />
    </Field>
  );
}

export function TextArea({ label, help, value, onChange, rows = 4, className, placeholder, maxLength, showCount }: {
  label?: string; help?: string; value?: string | null; onChange: (v: string) => void; rows?: number; className?: string;
  placeholder?: string; maxLength?: number; showCount?: boolean;
}) {
  const len = (value || '').length;
  return (
    <Field label={label} help={help} className={className}
      counter={showCount ? <span className={cx('text-xs', maxLength && len > maxLength ? 'text-red-600 font-bold' : 'text-stone-400')}>{len}{maxLength ? ` / ${maxLength}` : ''}</span> : null}>
      <textarea value={value ?? ''} rows={rows} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={cx(inputCls, 'resize-y leading-relaxed')} />
    </Field>
  );
}

export function Select({ label, help, value, onChange, options, className }: {
  label?: string; help?: string; value?: string; onChange: (v: string) => void; options: { value: string; label: string }[]; className?: string;
}) {
  return (
    <Field label={label} help={help} className={className}>
      <select value={value ?? ''} onChange={e => onChange(e.target.value)} className={inputCls}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Field>
  );
}

export function Toggle({ label, help, checked, onChange }: { label: string; help?: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-stone-800">{label}</div>
        {help && <div className="text-xs text-stone-500 mt-0.5">{help}</div>}
      </div>
      <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={cx('relative w-12 h-7 rounded-full transition-colors shrink-0 cursor-pointer', checked ? 'bg-emerald-500' : 'bg-stone-300')}>
        <span className={cx('absolute top-0.5 w-6 h-6 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </div>
  );
}

/** Kannada + English side by side (stacked on phones). */
export function BiText({ label, kn, en, onKn, onEn, multiline, rows = 3, help, maxLength }: {
  label: string; kn?: string | null; en?: string | null; onKn: (v: string) => void; onEn: (v: string) => void;
  multiline?: boolean; rows?: number; help?: string; maxLength?: number;
}) {
  return (
    <div>
      <div className="text-sm font-semibold text-stone-800 mb-1.5">{label}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {multiline ? (
          <>
            <TextArea value={kn} onChange={onKn} rows={rows} placeholder="ಕನ್ನಡ" maxLength={maxLength} showCount={!!maxLength} />
            <TextArea value={en} onChange={onEn} rows={rows} placeholder="English" maxLength={maxLength} showCount={!!maxLength} />
          </>
        ) : (
          <>
            <TextInput value={kn ?? ''} onChange={onKn} placeholder="ಕನ್ನಡ" />
            <TextInput value={en ?? ''} onChange={onEn} placeholder="English" />
          </>
        )}
      </div>
      {help && <p className="text-xs text-stone-500 mt-1.5">{help}</p>}
    </div>
  );
}

/* ------------------------------ Image upload ------------------------------ */
export function ImageField({ label, value, onChange, folder = 'uploads', help, maxDim, accept = 'image/*', video, round }: {
  label?: string; value?: string | null; onChange: (url: string) => void; folder?: string; help?: string;
  maxDim?: number; accept?: string; video?: boolean; round?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const { push } = useToast();

  const onFile = async (f?: File | null) => {
    if (!f) return;
    setBusy(true);
    try { onChange(await uploadMedia(f, folder, { maxDim })); push('ok', 'Uploaded'); }
    catch (e) { push('err', 'Upload failed: ' + errMsg(e)); }
    finally { setBusy(false); if (input.current) input.current.value = ''; }
  };

  const isVid = video || /\.(mp4|webm)(\?|$)/i.test(value || '');
  return (
    <Field label={label} help={help}>
      <div className="flex items-start gap-3">
        <div className={cx('w-24 h-24 shrink-0 bg-stone-100 border border-dashed border-stone-300 flex items-center justify-center overflow-hidden text-stone-400', round ? 'rounded-full' : 'rounded-xl')}>
          {busy ? <Spinner /> : value ? (isVid
            ? <video src={value} className="w-full h-full object-cover" muted />
            : <img src={value} alt="" className="w-full h-full object-cover" />) : <ImagePlus className="w-7 h-7" />}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => input.current?.click()} loading={busy}>
              <Upload className="w-3.5 h-3.5" /> Upload
            </Button>
            {value && <Button type="button" variant="ghost" size="sm" onClick={() => onChange('')}><X className="w-3.5 h-3.5" /> Remove</Button>}
          </div>
          <input ref={input} type="file" accept={accept} className="hidden" onChange={e => onFile(e.target.files?.[0])} />
          <input value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder="…or paste an image link (https://)"
            className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-saffron-500/30" />
        </div>
      </div>
    </Field>
  );
}

/* ------------------------------ Modal / sheet ------------------------------ */
export function Modal({ open, title, onClose, children, footer, wide }: {
  open: boolean; title: string; onClose: () => void; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-[2px]" onClick={onClose} />
      <div className={cx('relative bg-white w-full max-h-[92dvh] flex flex-col rounded-t-3xl sm:rounded-2xl shadow-2xl', wide ? 'sm:max-w-3xl' : 'sm:max-w-xl')}>
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-stone-200 shrink-0">
          <h3 className="font-bold text-stone-900 text-lg truncate">{title}</h3>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg hover:bg-stone-100 cursor-pointer" aria-label="Close"><X className="w-5 h-5" /></button>
        </header>
        <div className="overflow-y-auto px-5 py-5 flex-1 overscroll-contain">{children}</div>
        {footer && <footer className="px-5 py-3 border-t border-stone-200 bg-stone-50 rounded-b-2xl flex justify-end gap-2 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">{footer}</footer>}
      </div>
    </div>
  );
}

/** Two-step delete button: first tap asks, second tap confirms. */
export function ConfirmButton({ onConfirm, label = 'Delete', confirmLabel = 'Tap again to confirm', size = 'sm' }: {
  onConfirm: () => void | Promise<void>; label?: string; confirmLabel?: string; size?: 'sm' | 'md';
}) {
  const [armed, setArmed] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => { if (!armed) return; const t = setTimeout(() => setArmed(false), 3500); return () => clearTimeout(t); }, [armed]);
  return (
    <Button type="button" size={size} variant={armed ? 'danger' : 'ghost'} loading={busy}
      className={!armed ? 'text-red-600 hover:bg-red-50' : ''}
      onClick={async () => { if (!armed) { setArmed(true); return; } setBusy(true); try { await onConfirm(); } finally { setBusy(false); setArmed(false); } }}>
      <Trash2 className="w-3.5 h-3.5" /> {armed ? confirmLabel : label}
    </Button>
  );
}

/** Sticky save bar for settings forms (sits above the mobile bottom nav). */
export function SaveBar({ dirty, saving, onSave, onReset, note }: {
  dirty: boolean; saving: boolean; onSave: () => void; onReset?: () => void; note?: string;
}) {
  return (
    <div className={cx('sticky bottom-16 lg:bottom-0 z-30 -mx-4 sm:mx-0 mt-6 transition-transform', dirty ? 'translate-y-0' : 'translate-y-0')}>
      <div className="bg-white/95 backdrop-blur border-t sm:border border-stone-200 sm:rounded-2xl shadow-lg px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0 text-sm">
          {dirty ? <span className="font-semibold text-amber-700">● Unsaved changes</span> : <span className="text-stone-500">{note || 'All changes saved'}</span>}
        </div>
        {onReset && dirty && <Button variant="ghost" size="sm" onClick={onReset}>Discard</Button>}
        <Button onClick={onSave} loading={saving} disabled={!dirty}>Save changes</Button>
      </div>
    </div>
  );
}




export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: NoInfer<T>) => void;
}) {

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`border-b-2 px-3 py-2 text-sm ${
            value === tab.id
              ? "border-current font-semibold"
              : "border-transparent"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}


/** Generic hook for a site_content key: load → edit → save. */
export function useContentKey<T extends object>(
  key: string, loader: () => Promise<T>, saver: (v: T) => Promise<void>
) {
  const [data, setData] = useState<T | null>(null);
  const [orig, setOrig] = useState<string>('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { push } = useToast();

  useEffect(() => {
    let alive = true;
    loader().then(v => { if (alive) { setData(v); setOrig(JSON.stringify(v)); } })
      .catch(e => alive && setError(errMsg(e)));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const dirty = data !== null && JSON.stringify(data) !== orig;
  const save = async () => {
    if (!data) return;
    setSaving(true);
    try { await saver(data); setOrig(JSON.stringify(data)); push('ok', 'Saved — live on the website'); }
    catch (e) { push('err', errMsg(e)); }
    finally { setSaving(false); }
  };
  const reset = () => { if (orig) setData(JSON.parse(orig)); };
  return { data, setData, dirty, saving, save, reset, error };
}
