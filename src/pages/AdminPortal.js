import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import './AdminPortal.css';
import Header from '../components/Header';

// ── Tab config ──────────────────────────────────────────────
const TABS = [
  { id: 'requests',  label: 'Access Requests',    icon: '👥' },
  { id: 'inquiries', label: 'CC Inquiries',        icon: '✉️' },
  { id: 'faqs',      label: 'FAQ Manager',         icon: '📋' },
  { id: 'actions',   label: 'Committee Actions',   icon: '📰' },
  { id: 'meetings',  label: 'Meeting Notes',       icon: '🗒️' },
];

const FAQ_CATEGORIES = [
  'General', 'Membership', 'Loan Process', 'Credit Policy',
  'Payments', 'Compliance', 'Technical',
];

const INQUIRY_STATUSES = ['received', 'in_review', 'responded', 'closed'];

const MEETING_TYPES = [
  'Monthly Creditors Meeting',
  'Special Session',
  'Emergency Meeting',
  'Annual Review',
];

const MEETING_STATUSES = ['Pending Approval', 'Approved'];

// ── Helpers ─────────────────────────────────────────────────
const fmtDate = (str) => new Date(str).toLocaleDateString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
});
const fmtDateTime = (str) => new Date(str).toLocaleString('en-US', {
  month: 'short', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit',
});

const statusColor = (s) => ({
  pending:    { bg: 'rgba(201,168,76,0.1)',   color: '#92784a', border: 'rgba(201,168,76,0.3)'  },
  approved:   { bg: 'rgba(22,163,74,0.08)',   color: '#15803d', border: 'rgba(22,163,74,0.25)'  },
  denied:     { bg: 'rgba(220,38,38,0.07)',   color: '#DC2626', border: 'rgba(220,38,38,0.2)'   },
  received:   { bg: 'rgba(59,130,246,0.08)',  color: '#1d4ed8', border: 'rgba(59,130,246,0.25)' },
  in_review:  { bg: 'rgba(201,168,76,0.1)',   color: '#92784a', border: 'rgba(201,168,76,0.3)'  },
  responded:  { bg: 'rgba(22,163,74,0.08)',   color: '#15803d', border: 'rgba(22,163,74,0.25)'  },
  closed:     { bg: 'rgba(107,114,128,0.1)',  color: '#4b5563', border: 'rgba(107,114,128,0.25)'},
}[s] || {});

const priorityColor = (p) => ({
  standard: { bg: 'rgba(11,31,58,0.06)',    color: '#0B1F3A' },
  high:     { bg: 'rgba(252,211,77,0.2)',   color: '#78350F' },
  urgent:   { bg: 'rgba(252,165,165,0.2)',  color: '#7F1D1D' },
}[p] || {});

// ── Main component ───────────────────────────────────────────
export default function AdminPortal() {
  const [tab, setTab] = useState('requests');
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <>
      <div className="ap">
        <Header />

        {/* Header banner */}
        <div className="ap-header">
          <div className="ap-header__inner">
            <h1>Admin <span className="ap-header__accent">Dashboard</span></h1>
            <p>Manage access requests, credit committee inquiries, and site content</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="ap-tabs-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`ap-tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="ap-body">
          {tab === 'requests'  && <RequestsTab  showToast={showToast} />}
          {tab === 'inquiries' && <InquiriesTab showToast={showToast} />}
          {tab === 'faqs'      && <FaqsTab      showToast={showToast} />}
          {tab === 'actions'   && <ActionsTab   showToast={showToast} />}
          {tab === 'meetings'  && <MeetingsTab  showToast={showToast} />}
        </div>
      </div>

      {toast && <div className={`ap-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 1 — Access Requests
// ════════════════════════════════════════════════════════════
function RequestsTab({ showToast }) {
  const [requests, setRequests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('pending');
  const [search, setSearch]           = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selected, setSelected]       = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const query = supabase
      .from('access_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (filter !== 'all') query.eq('status', filter);
    const { data, error } = await query;
    if (!error) setRequests(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  const handleApprove = async (r) => {
    setActionLoading(r.id);
    const { error } = await supabase.functions.invoke('invite-user', {
      body: JSON.stringify({ email: r.email }),
      headers: { 'Content-Type': 'application/json' },
    });
    if (error) showToast('Approval saved — invite failed, try manually.', 'warning');
    else showToast(`✓ Invite sent to ${r.email}`);
    await supabase.from('access_requests').update({ status: 'approved' }).eq('id', r.id);
    fetchRequests(); setSelected(null); setActionLoading(null);
  };

  const handleDeny = async (r) => {
    setActionLoading(r.id + '-deny');
    await supabase.from('access_requests').update({ status: 'denied' }).eq('id', r.id);
    showToast(`Request from ${r.full_name} denied.`, 'error');
    fetchRequests(); setSelected(null); setActionLoading(null);
  };

  const counts = {
    pending:  requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    denied:   requests.filter(r => r.status === 'denied').length,
  };

  const filtered = requests.filter(r =>
    [r.full_name, r.email, r.organization].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <>
      {/* Stats row */}
      <div className="ap-stats-row">
        {[
          { key: 'pending',  label: 'Pending',  icon: '⏳', bg: 'rgba(201,168,76,0.1)'   },
          { key: 'approved', label: 'Approved', icon: '✅', bg: 'rgba(22,163,74,0.08)'   },
          { key: 'denied',   label: 'Denied',   icon: '❌', bg: 'rgba(220,38,38,0.07)'   },
        ].map(s => (
          <div
            key={s.key}
            className={`ap-stat-card ${filter === s.key ? 'active' : ''}`}
            onClick={() => setFilter(s.key)}
          >
            <div className="ap-stat-card__icon" style={{ background: s.bg }}>{s.icon}</div>
            <div>
              <div className="ap-stat-card__num">{counts[s.key] ?? 0}</div>
              <div className="ap-stat-card__label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ap-panel ap-panel--mt">
        <div className="ap-toolbar">
          <input
            className="ap-search"
            placeholder="Search name, email, organization…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="ap-filters">
            {['all', 'pending', 'approved', 'denied'].map(f => (
              <button
                key={f}
                className={`ap-filter ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="ap-empty">
            <div className="ap-spinner ap-spinner--lg" />
            <p>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <div className="ap-empty__icon">📭</div>
            <h3>No requests</h3>
            <p>No {filter !== 'all' ? filter : ''} access requests found.</p>
          </div>
        ) : (
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Organization</th>
                <th>Date</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const sc = statusColor(r.status);
                return (
                  <tr key={r.id} onClick={() => setSelected(r)}>
                    <td className="ap-td-bold">{r.full_name}</td>
                    <td className="ap-td-muted">{r.email}</td>
                    <td className="ap-td-muted">{r.organization}</td>
                    <td className="ap-td-date">{fmtDate(r.created_at)}</td>
                    <td>
                      <span className="ap-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                        {r.status}
                      </span>
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      {r.status === 'pending' && (
                        <div className="ap-td-actions">
                          <button
                            className="ap-btn ap-btn-primary"
                            disabled={actionLoading === r.id}
                            onClick={() => handleApprove(r)}
                          >
                            {actionLoading === r.id ? <span className="ap-spinner" /> : 'Approve'}
                          </button>
                          <button
                            className="ap-btn ap-btn-danger"
                            disabled={actionLoading === r.id + '-deny'}
                            onClick={() => handleDeny(r)}
                          >
                            Deny
                          </button>
                        </div>
                      )}
                      {r.status === 'approved' && <span className="ap-td-approved">✓ Approved</span>}
                      {r.status === 'denied'   && <span className="ap-td-denied">✗ Denied</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="ap-overlay" onClick={() => setSelected(null)}>
          <div className="ap-drawer" onClick={e => e.stopPropagation()}>
            <div className="ap-drawer__head">
              <div>
                <h2 className="ap-drawer__title">{selected.full_name}</h2>
                <div className="ap-drawer__subtitle">{selected.email}</div>
              </div>
              <button className="ap-drawer__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">Organization</span>
              <span className="ap-drawer__value">{selected.organization}</span>
            </div>
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">Submitted</span>
              <span className="ap-drawer__value">{fmtDate(selected.created_at)}</span>
            </div>
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">Status</span>
              <span className="ap-drawer__value" style={{ color: statusColor(selected.status).color, textTransform: 'capitalize' }}>
                {selected.status}
              </span>
            </div>
            <div className="ap-drawer__section">
              <span className="ap-drawer__section-label">Reason for Access</span>
              <div className="ap-drawer__body">{selected.reason || 'No reason provided.'}</div>
            </div>
            {selected.status === 'pending' && (
              <div className="ap-drawer__actions">
                <button
                  className="ap-btn ap-btn-gold"
                  disabled={actionLoading === selected.id}
                  onClick={() => handleApprove(selected)}
                >
                  {actionLoading === selected.id ? 'Approving…' : '✓ Approve & Send Invite'}
                </button>
                <button
                  className="ap-btn ap-btn-danger"
                  disabled={actionLoading === selected.id + '-deny'}
                  onClick={() => handleDeny(selected)}
                >
                  ✕ Deny
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 2 — CC Inquiries
// ════════════════════════════════════════════════════════════
function InquiriesTab({ showToast }) {
  const [inquiries, setInquiries]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [selected, setSelected]     = useState(null);
  const [reply, setReply]           = useState('');
  const [newStatus, setNewStatus]   = useState('');
  const [saving, setSaving]         = useState(false);

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    const query = supabase
      .from('cc_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (filter !== 'all') query.eq('status', filter);
    const { data, error } = await query;
    if (!error) setInquiries(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { fetchInquiries(); }, [fetchInquiries]);

  const openInquiry = (inq) => {
    setSelected(inq);
    setReply(inq.admin_reply || '');
    setNewStatus(inq.status || 'received');
  };

  const saveReply = async () => {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from('cc_inquiries')
      .update({ admin_reply: reply, status: newStatus, replied_at: new Date().toISOString() })
      .eq('id', selected.id);
    if (error) showToast('Save failed. Check Supabase.', 'error');
    else { showToast('Inquiry updated'); fetchInquiries(); setSelected(null); }
    setSaving(false);
  };

  const counts = INQUIRY_STATUSES.reduce((acc, s) => {
    acc[s] = inquiries.filter(i => i.status === s).length;
    return acc;
  }, {});

  const filtered = inquiries.filter(i =>
    [i.name, i.email, i.subject, i.inquiry_type].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const priorityBadge = (p) => {
    const pc = priorityColor(p);
    return (
      <span className="ap-badge" style={{ background: pc.bg, color: pc.color, borderColor: pc.bg }}>
        {p}
      </span>
    );
  };

  return (
    <>
      {/* Mini stats */}
      <div className="ap-mini-stats">
        {[
          { key: 'all',       label: 'All',       count: inquiries.length  },
          { key: 'received',  label: 'New',        count: counts.received   },
          { key: 'in_review', label: 'In Review',  count: counts.in_review  },
          { key: 'responded', label: 'Responded',  count: counts.responded  },
          { key: 'closed',    label: 'Closed',     count: counts.closed     },
        ].map(s => (
          <div
            key={s.key}
            className={`ap-mini-stat ${filter === s.key ? 'active' : ''}`}
            onClick={() => setFilter(s.key)}
          >
            <span className="ap-mini-stat__num">{s.count ?? 0}</span>
            <span className="ap-mini-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ap-panel ap-panel--mt">
        <div className="ap-toolbar">
          <input
            className="ap-search"
            placeholder="Search name, email, subject…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="ap-empty">
            <div className="ap-spinner" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
            <p>Loading…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="ap-empty">
            <div className="ap-empty__icon">✉️</div>
            <h3>No inquiries</h3>
            <p>No credit committee inquiries yet.</p>
          </div>
        ) : (
          <table className="ap-table">
            <thead>
              <tr>
                <th>Name</th><th>Subject</th><th>Type</th>
                <th>Priority</th><th>Date</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const sc = statusColor(i.status);
                return (
                  <tr key={i.id} onClick={() => openInquiry(i)}>
                    <td>
                      <div className="ap-td-bold">{i.name}</div>
                      <div className="ap-td-sub">{i.email}</div>
                    </td>
                    <td>
                      <div className="ap-td-subject">{i.subject}</div>
                      {i.member_id && <div className="ap-td-gold">ID: {i.member_id}</div>}
                    </td>
                    <td className="ap-td-muted" style={{ fontSize: 12 }}>{i.inquiry_type}</td>
                    <td>{priorityBadge(i.priority)}</td>
                    <td className="ap-td-date">{fmtDate(i.created_at)}</td>
                    <td>
                      <span className="ap-badge" style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}>
                        {i.status?.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="ap-overlay" onClick={() => setSelected(null)}>
          <div className="ap-drawer" onClick={e => e.stopPropagation()}>
            <div className="ap-drawer__head">
              <div>
                <h2 className="ap-drawer__title">{selected.subject}</h2>
                <div className="ap-drawer__subtitle">{selected.inquiry_type} · {selected.ref_id}</div>
              </div>
              <button className="ap-drawer__close" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">From</span>
              <span className="ap-drawer__value">{selected.name} ({selected.email})</span>
            </div>
            {selected.member_id && (
              <div className="ap-drawer__row">
                <span className="ap-drawer__label">Member ID</span>
                <span className="ap-drawer__value">{selected.member_id}</span>
              </div>
            )}
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">Priority</span>
              <span className="ap-drawer__value" style={{ color: priorityColor(selected.priority).color, textTransform: 'capitalize' }}>
                {selected.priority}
              </span>
            </div>
            <div className="ap-drawer__row">
              <span className="ap-drawer__label">Received</span>
              <span className="ap-drawer__value">{fmtDateTime(selected.created_at)}</span>
            </div>
            {selected.replied_at && (
              <div className="ap-drawer__row">
                <span className="ap-drawer__label">Last Reply</span>
                <span className="ap-drawer__value">{fmtDateTime(selected.replied_at)}</span>
              </div>
            )}

            <div className="ap-drawer__section">
              <span className="ap-drawer__section-label">Message</span>
              <div className="ap-drawer__body">{selected.message}</div>
            </div>

            <div className="ap-drawer__section">
              <span className="ap-drawer__section-label">Update Status</span>
              <div className="ap-select-wrap">
                <select
                  className="ap-status-select"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  {INQUIRY_STATUSES.map(s => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="ap-drawer__section">
              <span className="ap-drawer__section-label">Internal Notes / Reply</span>
              <textarea
                className="ap-reply-textarea"
                placeholder="Add notes or draft a reply…"
                value={reply}
                onChange={e => setReply(e.target.value)}
              />
            </div>

            <div className="ap-drawer__actions">
              <button className="ap-btn ap-btn-gold" onClick={saveReply} disabled={saving} style={{ flex: 2 }}>
                {saving ? 'Saving…' : '✓ Save & Update Status'}
              </button>
              <button className="ap-btn ap-btn-ghost" onClick={() => setSelected(null)} style={{ flex: 1 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 3 — FAQ Manager
// ════════════════════════════════════════════════════════════
function FaqsTab({ showToast }) {
  const [faqs, setFaqs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filterCat, setFilterCat] = useState('All');
  const [search, setSearch]       = useState('');
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);

  const blank = { question: '', answer: '', category: 'General', order_index: 0, published: true };
  const [form, setForm] = useState(blank);

  useEffect(() => { fetchFaqs(); }, []);

  const fetchFaqs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order_index', { ascending: true });
    if (!error) setFaqs(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.question.trim() || !form.answer.trim()) {
      showToast('Question and answer are required.', 'error');
      return;
    }
    setSaving(true);
    if (editing) {
      const { error } = await supabase
        .from('faqs')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
      if (error) showToast('Update failed.', 'error');
      else { showToast('FAQ updated'); setEditing(null); setForm(blank); fetchFaqs(); }
    } else {
      const { error } = await supabase
        .from('faqs')
        .insert([{ ...form, created_at: new Date().toISOString() }]);
      if (error) showToast('Insert failed.', 'error');
      else { showToast('FAQ published'); setForm(blank); fetchFaqs(); }
    }
    setSaving(false);
  };

  const startEdit  = (faq) => {
    setEditing(faq);
    setForm({ question: faq.question, answer: faq.answer, category: faq.category, order_index: faq.order_index, published: faq.published });
  };
  const cancelEdit = () => { setEditing(null); setForm(blank); };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (error) showToast('Delete failed.', 'error');
    else { showToast('FAQ removed', 'error'); fetchFaqs(); }
    setDeleting(null);
  };

  const togglePublish = async (faq) => {
    await supabase.from('faqs').update({ published: !faq.published }).eq('id', faq.id);
    fetchFaqs();
  };

  const filtered = faqs.filter(f =>
    (filterCat === 'All' || f.category === filterCat) &&
    [f.question, f.answer, f.category].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="ap-panel" style={{ marginTop: 20 }}>
      {/* Form */}
      <div className="ap-faq-form">
        <h3>{editing ? '✏️ Edit FAQ' : '+ Add New FAQ'}</h3>
        <div className="ap-faq-grid">
          <div className="ap-field ap-faq-grid__full">
            <label>Question</label>
            <input
              type="text"
              placeholder="e.g. What is the minimum loan amount?"
              value={form.question}
              onChange={e => setForm({ ...form, question: e.target.value })}
            />
          </div>
          <div className="ap-field ap-faq-grid__full">
            <label>Answer</label>
            <textarea
              rows={4}
              placeholder="Write a clear, helpful answer…"
              value={form.answer}
              onChange={e => setForm({ ...form, answer: e.target.value })}
            />
          </div>
          <div className="ap-field">
            <label>Category</label>
            <div className="ap-select-wrap">
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {FAQ_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="ap-field">
            <label>Display Order</label>
            <input
              type="number"
              min={0}
              value={form.order_index}
              onChange={e => setForm({ ...form, order_index: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>
        <div className="ap-faq-form__footer">
          <label className="ap-publish-label">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
            />
            Publish immediately
          </label>
          <div className="ap-faq-form__btns">
            {editing && <button className="ap-btn ap-btn-ghost" onClick={cancelEdit}>Cancel</button>}
            <button className="ap-btn ap-btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update FAQ' : 'Publish FAQ'}
            </button>
          </div>
        </div>
      </div>

      {/* List toolbar */}
      <div className="ap-toolbar">
        <input
          className="ap-search"
          placeholder="Search FAQs…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="ap-filters">
          {['All', ...FAQ_CATEGORIES].map(c => (
            <button
              key={c}
              className={`ap-filter ${filterCat === c ? 'active' : ''}`}
              onClick={() => setFilterCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ list */}
      {loading ? (
        <div className="ap-empty">
          <div className="ap-spinner" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
          <p>Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ap-empty">
          <div className="ap-empty__icon">📋</div>
          <h3>No FAQs yet</h3>
          <p>Add your first FAQ using the form above.</p>
        </div>
      ) : (
        <div className="ap-faq-list">
          {filtered.map((faq, idx) => (
            <div key={faq.id} className={`ap-faq-item ${!faq.published ? 'draft' : ''}`}>
              <div className="ap-faq-order">{faq.order_index ?? idx + 1}</div>
              <div className="ap-faq-content">
                <div className="ap-faq-q">{faq.question}</div>
                <div className="ap-faq-a">{faq.answer}</div>
                <div className="ap-faq-meta">
                  <span className="ap-faq-cat">{faq.category}</span>
                  {!faq.published && <span className="ap-faq-draft-badge">Draft</span>}
                  <span className="ap-faq-date">{fmtDate(faq.created_at)}</span>
                </div>
              </div>
              <div className="ap-faq-actions">
                <button className="ap-btn ap-btn-ghost" onClick={() => togglePublish(faq)}>
                  {faq.published ? 'Unpublish' : 'Publish'}
                </button>
                <button className="ap-btn ap-btn-ghost" onClick={() => startEdit(faq)}>Edit</button>
                <button
                  className="ap-btn ap-btn-danger"
                  disabled={deleting === faq.id}
                  onClick={() => handleDelete(faq.id)}
                >
                  {deleting === faq.id ? <span className="ap-spinner" /> : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 4 — Committee Actions
// ════════════════════════════════════════════════════════════
const ACTION_TYPES = ['Policy Update', 'Resolution', 'Decision'];

function ActionsTab({ showToast }) {
  const [actions, setActions]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filterType, setFilterType] = useState('All');
  const [search, setSearch]       = useState('');
  const [editing, setEditing]     = useState(null);
  const [saving, setSaving]       = useState(false);
  const [deleting, setDeleting]   = useState(null);

  const blank = {
    title: '', summary: '', type: 'Decision',
    doc_url: '', action_date: new Date().toISOString().slice(0, 10), published: false,
  };
  const [form, setForm] = useState(blank);

  useEffect(() => { fetchActions(); }, []);

  const fetchActions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('committee_actions')
      .select('*')
      .order('action_date', { ascending: false });
    if (!error) setActions(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      showToast('Title and summary are required.', 'error');
      return;
    }
    setSaving(true);
    if (editing) {
      const { error } = await supabase
        .from('committee_actions')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
      if (error) showToast('Update failed.', 'error');
      else { showToast('Action updated'); setEditing(null); setForm(blank); fetchActions(); }
    } else {
      const { error } = await supabase
        .from('committee_actions')
        .insert([{ ...form, created_at: new Date().toISOString() }]);
      if (error) showToast('Insert failed.', 'error');
      else { showToast('Action saved'); setForm(blank); fetchActions(); }
    }
    setSaving(false);
  };

  const startEdit  = (a) => { setEditing(a); setForm({ title: a.title, summary: a.summary, type: a.type, doc_url: a.doc_url || '', action_date: a.action_date, published: a.published }); };
  const cancelEdit = () => { setEditing(null); setForm(blank); };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('committee_actions').delete().eq('id', id);
    if (error) showToast('Delete failed.', 'error');
    else { showToast('Action removed', 'error'); fetchActions(); }
    setDeleting(null);
  };

  const togglePublish = async (a) => {
    await supabase.from('committee_actions').update({ published: !a.published }).eq('id', a.id);
    fetchActions();
  };

  const typeColors = {
    'Policy Update': { bg: 'rgba(29,78,216,0.07)', color: '#1D4ED8', border: 'rgba(29,78,216,0.2)' },
    'Resolution':    { bg: 'rgba(22,163,74,0.08)', color: '#15803D', border: 'rgba(22,163,74,0.25)' },
    'Decision':      { bg: 'rgba(201,168,76,0.1)', color: '#92784a', border: 'rgba(201,168,76,0.3)' },
  };

  const filtered = actions.filter(a =>
    (filterType === 'All' || a.type === filterType) &&
    [a.title, a.summary].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="ap-panel" style={{ marginTop: 20 }}>
      {/* Form */}
      <div className="ap-faq-form">
        <h3>{editing ? '✏️ Edit Action' : '+ Add Committee Action'}</h3>
        <div className="ap-faq-grid">
          <div className="ap-field ap-faq-grid__full">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Revised Lending Threshold for Commercial Properties"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="ap-field ap-faq-grid__full">
            <label>Summary</label>
            <textarea
              rows={4}
              placeholder="Brief description of the action taken…"
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="ap-field">
            <label>Action Type</label>
            <div className="ap-select-wrap">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {ACTION_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="ap-field">
            <label>Action Date</label>
            <input
              type="date"
              value={form.action_date}
              onChange={e => setForm({ ...form, action_date: e.target.value })}
            />
          </div>
          <div className="ap-field ap-faq-grid__full">
            <label>Supporting Doc URL <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 10, color: '#C9D0D9', fontWeight: 400 }}>(optional)</span></label>
            <input
              type="text"
              placeholder="https://… or /meeting-notes"
              value={form.doc_url}
              onChange={e => setForm({ ...form, doc_url: e.target.value })}
            />
          </div>
        </div>
        <div className="ap-faq-form__footer">
          <label className="ap-publish-label">
            <input
              type="checkbox"
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
            />
            Publish immediately
          </label>
          <div className="ap-faq-form__btns">
            {editing && <button className="ap-btn ap-btn-ghost" onClick={cancelEdit}>Cancel</button>}
            <button className="ap-btn ap-btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Action' : 'Save Action'}
            </button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="ap-toolbar">
        <input
          className="ap-search"
          placeholder="Search actions…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="ap-filters">
          {['All', ...ACTION_TYPES].map(t => (
            <button
              key={t}
              className={`ap-filter ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="ap-empty">
          <div className="ap-spinner" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
          <p>Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ap-empty">
          <div className="ap-empty__icon">📰</div>
          <h3>No actions yet</h3>
          <p>Add your first committee action using the form above.</p>
        </div>
      ) : (
        <div className="ap-faq-list">
          {filtered.map((a) => {
            const tc = typeColors[a.type] || typeColors['Decision'];
            return (
              <div key={a.id} className={`ap-faq-item ${!a.published ? 'draft' : ''}`}>
                <div className="ap-faq-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span className="ap-badge" style={{ background: tc.bg, color: tc.color, borderColor: tc.border }}>{a.type}</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{new Date(a.action_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {!a.published && <span className="ap-faq-draft-badge">Draft</span>}
                  </div>
                  <div className="ap-faq-q">{a.title}</div>
                  <div className="ap-faq-a">{a.summary}</div>
                  {a.doc_url && (
                    <div style={{ marginTop: 6 }}>
                      <a href={a.doc_url} style={{ fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }} target="_blank" rel="noopener noreferrer">
                        📎 Supporting Doc →
                      </a>
                    </div>
                  )}
                </div>
                <div className="ap-faq-actions">
                  <button className="ap-btn ap-btn-ghost" onClick={() => togglePublish(a)}>
                    {a.published ? 'Unpublish' : 'Publish'}
                  </button>
                  <button className="ap-btn ap-btn-ghost" onClick={() => startEdit(a)}>Edit</button>
                  <button
                    className="ap-btn ap-btn-danger"
                    disabled={deleting === a.id}
                    onClick={() => handleDelete(a.id)}
                  >
                    {deleting === a.id ? <span className="ap-spinner" /> : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════
// TAB 5 — Meeting Notes
// ════════════════════════════════════════════════════════════
function MeetingsTab({ showToast }) {
  const [meetings, setMeetings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const [search, setSearch]         = useState('');
  const [editing, setEditing]       = useState(null);
  const [saving, setSaving]         = useState(false);
  const [deleting, setDeleting]     = useState(null);

  const blank = {
    title: '',
    type: 'Monthly Creditors Meeting',
    meeting_date: new Date().toISOString().slice(0, 10),
    status: 'Pending Approval',
    summary: '',
    pdf_url: '',
  };
  const [form, setForm] = useState(blank);

  useEffect(() => { fetchMeetings(); }, []);

  const fetchMeetings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meeting_notes')
      .select('*')
      .order('meeting_date', { ascending: false });
    if (!error) setMeetings(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.summary.trim()) {
      showToast('Title and summary are required.', 'error');
      return;
    }
    setSaving(true);
    if (editing) {
      const { error } = await supabase
        .from('meeting_notes')
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
      if (error) showToast('Update failed.', 'error');
      else { showToast('Meeting note updated'); setEditing(null); setForm(blank); fetchMeetings(); }
    } else {
      const { error } = await supabase
        .from('meeting_notes')
        .insert([{ ...form, created_at: new Date().toISOString() }]);
      if (error) showToast('Insert failed.', 'error');
      else { showToast('Meeting note published'); setForm(blank); fetchMeetings(); }
    }
    setSaving(false);
  };

  const startEdit = (m) => {
    setEditing(m);
    setForm({
      title: m.title,
      type: m.type,
      meeting_date: m.meeting_date,
      status: m.status,
      summary: m.summary,
      pdf_url: m.pdf_url || '',
    });
    // Scroll form into view
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const cancelEdit = () => { setEditing(null); setForm(blank); };

  const handleDelete = async (id) => {
    setDeleting(id);
    const { error } = await supabase.from('meeting_notes').delete().eq('id', id);
    if (error) showToast('Delete failed.', 'error');
    else { showToast('Meeting note removed', 'error'); fetchMeetings(); }
    setDeleting(null);
  };

  const toggleStatus = async (m) => {
    const next = m.status === 'Approved' ? 'Pending Approval' : 'Approved';
    await supabase.from('meeting_notes').update({ status: next }).eq('id', m.id);
    fetchMeetings();
  };

  const statusColors = {
    'Approved':         { bg: 'rgba(22,163,74,0.08)',  color: '#15803D', border: 'rgba(22,163,74,0.25)'  },
    'Pending Approval': { bg: 'rgba(201,168,76,0.1)',  color: '#92784a', border: 'rgba(201,168,76,0.3)'  },
  };

  const counts = {
    Approved:         meetings.filter(m => m.status === 'Approved').length,
    'Pending Approval': meetings.filter(m => m.status === 'Pending Approval').length,
  };

  const filtered = meetings.filter(m =>
    (filterStatus === 'All' || m.status === filterStatus) &&
    [m.title, m.summary, m.type].some(v =>
      v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="ap-panel" style={{ marginTop: 20 }}>
      {/* Form */}
      <div className="ap-faq-form">
        <h3>{editing ? '✏️ Edit Meeting Note' : '+ Add Meeting Note'}</h3>
        <div className="ap-faq-grid">
          <div className="ap-field ap-faq-grid__full">
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. May 2026 Creditors Meeting"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className="ap-field ap-faq-grid__full">
            <label>Summary</label>
            <textarea
              rows={4}
              placeholder="Brief description of topics discussed and key outcomes…"
              value={form.summary}
              onChange={e => setForm({ ...form, summary: e.target.value })}
            />
          </div>
          <div className="ap-field">
            <label>Meeting Type</label>
            <div className="ap-select-wrap">
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                {MEETING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="ap-field">
            <label>Meeting Date</label>
            <input
              type="date"
              value={form.meeting_date}
              onChange={e => setForm({ ...form, meeting_date: e.target.value })}
            />
          </div>
          <div className="ap-field">
            <label>Approval Status</label>
            <div className="ap-select-wrap">
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {MEETING_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="ap-field">
            <label>
              PDF URL{' '}
              <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 10, color: '#C9D0D9', fontWeight: 400 }}>
                (optional — required to enable download)
              </span>
            </label>
            <input
              type="text"
              placeholder="https://… or /files/meeting-may-2026.pdf"
              value={form.pdf_url}
              onChange={e => setForm({ ...form, pdf_url: e.target.value })}
            />
          </div>
        </div>
        <div className="ap-faq-form__footer">
          <div className="ap-faq-form__btns" style={{ marginLeft: 'auto' }}>
            {editing && <button className="ap-btn ap-btn-ghost" onClick={cancelEdit}>Cancel</button>}
            <button className="ap-btn ap-btn-gold" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>

      {/* Mini stats + toolbar */}
      <div className="ap-mini-stats" style={{ margin: '20px 0 0' }}>
        {[
          { key: 'All',              label: 'All',             count: meetings.length           },
          { key: 'Approved',         label: 'Approved',        count: counts['Approved']        },
          { key: 'Pending Approval', label: 'Pending Approval', count: counts['Pending Approval'] },
        ].map(s => (
          <div
            key={s.key}
            className={`ap-mini-stat ${filterStatus === s.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(s.key)}
          >
            <span className="ap-mini-stat__num">{s.count ?? 0}</span>
            <span className="ap-mini-stat__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="ap-toolbar" style={{ marginTop: 12 }}>
        <input
          className="ap-search"
          placeholder="Search meeting notes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="ap-empty">
          <div className="ap-spinner" style={{ width: 28, height: 28, margin: '0 auto 12px' }} />
          <p>Loading…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="ap-empty">
          <div className="ap-empty__icon">🗒️</div>
          <h3>No meeting notes yet</h3>
          <p>Add your first meeting note using the form above.</p>
        </div>
      ) : (
        <div className="ap-faq-list">
          {filtered.map((m) => {
            const sc = statusColors[m.status] || statusColors['Pending Approval'];
            return (
              <div key={m.id} className="ap-faq-item">
                <div className="ap-faq-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span
                      className="ap-badge"
                      style={{ background: sc.bg, color: sc.color, borderColor: sc.border }}
                    >
                      {m.status}
                    </span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>
                      📅 {new Date(m.meeting_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>·</span>
                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>{m.type}</span>
                  </div>
                  <div className="ap-faq-q">{m.title}</div>
                  <div className="ap-faq-a">{m.summary}</div>
                  {m.pdf_url ? (
                    <div style={{ marginTop: 8 }}>
                      <a
                        href={m.pdf_url}
                        style={{ fontSize: 12, color: '#C9A84C', textDecoration: 'none', fontWeight: 600 }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        📎 PDF Available →
                      </a>
                    </div>
                  ) : (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>
                      No PDF attached
                    </div>
                  )}
                </div>
                <div className="ap-faq-actions">
                  <button className="ap-btn ap-btn-ghost" onClick={() => toggleStatus(m)}>
                    {m.status === 'Approved' ? 'Mark Pending' : 'Approve'}
                  </button>
                  <button className="ap-btn ap-btn-ghost" onClick={() => startEdit(m)}>Edit</button>
                  <button
                    className="ap-btn ap-btn-danger"
                    disabled={deleting === m.id}
                    onClick={() => handleDelete(m.id)}
                  >
                    {deleting === m.id ? <span className="ap-spinner" /> : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}