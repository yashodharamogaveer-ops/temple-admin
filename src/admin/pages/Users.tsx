import React, { useCallback, useEffect, useState } from 'react';
import { errMsg, sb } from '../api';
import { Badge, Button, Card, ConfirmButton, Loading, PageHeader, Select, TextInput, useToast } from '../ui';

export default function UsersPage({ isSuper, myId }: { isSuper: boolean; myId: string }) {
  const [rows, setRows] = useState<any[] | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('editor');
  const [busy, setBusy] = useState(false);
  const { push } = useToast();
  const load = useCallback(async () => {
    const { data, error } = await sb().from('admin_users').select('*').order('created_at');
    if (error) push('err', errMsg(error)); setRows(data || []);
  }, []);
  useEffect(() => { load(); }, [load]);

  const add = async () => {
    setBusy(true);
    const { error } = await sb().rpc('admin_add_user', { p_email: email.trim(), p_role: role });
    setBusy(false);
    if (error) { push('err', errMsg(error)); return; }
    setEmail(''); push('ok', 'User added'); load();
  };
  return (
    <div>
      <PageHeader title="Admin users" subtitle="Who can log in to this panel. Admins manage users; editors can change content only." />
      {rows === null ? <Loading /> : (
        <div className="space-y-5">
          <Card>
            <ul className="divide-y divide-stone-100">
              {rows.map(r => (
                <li key={r.user_id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0"><div className="font-semibold truncate">{r.email}</div><Badge tone={r.role === 'admin' ? 'amber' : 'blue'}>{r.role}</Badge></div>
                  {isSuper && r.user_id !== myId && <ConfirmButton label="Remove" onConfirm={async () => { const { error } = await sb().rpc('admin_remove_user', { p_user_id: r.user_id }); if (error) push('err', errMsg(error)); else load(); }} />}
                </li>
              ))}
            </ul>
          </Card>
          {isSuper && (
            <Card title="Add a user" subtitle="First create the account in Supabase → Authentication → Users → Add user (tick “Auto confirm”). Then enter the same email here.">
              <div className="space-y-4">
                <TextInput label="Email" type="email" value={email} onChange={setEmail} />
                <Select label="Role" value={role} onChange={setRole} options={[{ value: 'editor', label: 'Editor — content only' }, { value: 'admin', label: 'Admin — everything' }]} />
                <Button onClick={add} loading={busy} disabled={!email}>Add user</Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
