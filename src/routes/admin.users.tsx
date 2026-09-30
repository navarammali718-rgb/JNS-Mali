import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Users, ShieldOff, ShieldCheck, Search, X } from "lucide-react";
import { getAllUsersFn, blockUserFn } from "@/server-functions";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [reasonModal, setReasonModal] = useState<{ user: any } | null>(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setIsLoading(true);
    try {
      const data = await getAllUsersFn();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleBlock(user: any, block: boolean, blockReason = "") {
    setTogglingId(user.clerkId);
    setError("");
    try {
      await blockUserFn({ data: { clerkId: user.clerkId, isBlocked: block, reason: blockReason } });
      setUsers(prev => prev.map(u =>
        u.clerkId === user.clerkId ? { ...u, isBlocked: block, blockedReason: blockReason } : u
      ));
    } catch (e: any) {
      setError(e?.message ?? "Action failed.");
    } finally {
      setTogglingId(null);
      setReasonModal(null);
      setReason("");
    }
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.email?.toLowerCase().includes(q) ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q);
  });

  const blockedCount = users.filter(u => u.isBlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Users</h1>
          <p className="mt-1 font-medium text-slate-500">
            {users.length} registered · {blockedCount} blocked
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 border border-red-200">
          {error}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <X className="size-4" />
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <Users className="mx-auto mb-4 size-12 text-slate-400" />
          <p className="font-medium text-slate-500">
            {users.length === 0 ? "No users yet." : "No users match your search."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Mobile */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map(u => (
              <div key={u.clerkId} className={`p-4 ${u.isBlocked ? "bg-red-50/60" : ""}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-900 truncate">
                      {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">{u.email}</p>
                    <div className="mt-1 flex gap-3 text-xs text-slate-500">
                      <span>{u.orderCount} orders</span>
                      <span>{formatPrice(u.orderTotal)} spent</span>
                    </div>
                    {u.isBlocked && (
                      <p className="mt-1 text-xs font-semibold text-red-600">
                        🔒 Blocked{u.blockedReason ? `: ${u.blockedReason}` : ""}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {u.isBlocked ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-xs"
                        onClick={() => handleBlock(u, false)}
                        disabled={togglingId === u.clerkId}
                      >
                        {togglingId === u.clerkId ? <Loader2 className="size-3.5 animate-spin" /> : <><ShieldCheck className="size-3.5 mr-1" />Unblock</>}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-400 text-red-600 hover:bg-red-50 text-xs"
                        onClick={() => { setReasonModal({ user: u }); setReason(""); }}
                        disabled={togglingId === u.clerkId}
                      >
                        <ShieldOff className="size-3.5 mr-1" />Block
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                  <th className="px-4 py-3 font-semibold">User</th>
                  <th className="px-4 py-3 font-semibold">Orders</th>
                  <th className="px-4 py-3 font-semibold">Total Spent</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(u => (
                  <tr key={u.clerkId} className={`transition ${u.isBlocked ? "bg-red-50/60" : "hover:bg-slate-50"}`}>
                    <td className="px-4 py-3">
                      <p className="font-bold text-slate-900">
                        {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "—"}
                      </p>
                      <p className="text-xs text-slate-500 max-w-[220px] truncate">{u.email}</p>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{u.orderCount}</td>
                    <td className="px-4 py-3 font-medium text-slate-700">{formatPrice(u.orderTotal)}</td>
                    <td className="px-4 py-3">
                      {u.isBlocked ? (
                        <div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
                            🔒 Blocked
                          </span>
                          {u.blockedReason && (
                            <p className="mt-0.5 text-[11px] text-red-500 max-w-[160px] truncate">{u.blockedReason}</p>
                          )}
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                          ✓ Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.isBlocked ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                          onClick={() => handleBlock(u, false)}
                          disabled={togglingId === u.clerkId}
                        >
                          {togglingId === u.clerkId ? <Loader2 className="size-3.5 animate-spin mr-1" /> : <ShieldCheck className="size-3.5 mr-1" />}
                          Unblock
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-400 text-red-600 hover:bg-red-50"
                          onClick={() => { setReasonModal({ user: u }); setReason(""); }}
                          disabled={togglingId === u.clerkId}
                        >
                          <ShieldOff className="size-3.5 mr-1" />
                          Block
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Block Reason Modal */}
      {reasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <h2 className="text-xl font-black text-slate-900">Block user?</h2>
            <p className="mt-1 text-sm text-slate-500">
              This will prevent <span className="font-semibold text-slate-700">{reasonModal.user.email}</span> from placing orders.
            </p>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Reason <span className="font-normal text-slate-400">(optional — shown to you only)</span>
              </label>
              <input
                type="text"
                value={reason}
                onChange={e => setReason(e.target.value)}
                placeholder="e.g. Fake account, spam orders…"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                onKeyDown={e => { if (e.key === "Enter") handleBlock(reasonModal.user, true, reason); }}
              />
            </div>
            <div className="mt-5 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => { setReasonModal(null); setReason(""); }}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleBlock(reasonModal.user, true, reason)}
                disabled={togglingId === reasonModal.user.clerkId}
              >
                {togglingId === reasonModal.user.clerkId
                  ? <Loader2 className="size-4 animate-spin mr-2" />
                  : <ShieldOff className="size-4 mr-2" />}
                Yes, block this user
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
