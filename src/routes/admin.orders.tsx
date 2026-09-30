import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ShoppingBag, ChevronDown, ChevronUp, MapPin, Printer } from "lucide-react";
import { getAllOrdersFn, updateOrderStatusFn, getStorefrontFn } from "@/server-functions";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Capacitor } from "@capacitor/core";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

const STATUS_OPTIONS = ["pending", "packed", "shipped", "delivered", "cancelled"];

const statusColor: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  packed: "bg-indigo-100 text-indigo-700 border-indigo-200",
  shipped: "bg-blue-100 text-blue-700 border-blue-200",
  delivered: "bg-emerald-100 text-emerald-700 border-emerald-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [storefront, setStorefront] = useState<any>(null);

  async function load() {
    try {
      const [data, sfData] = await Promise.all([getAllOrdersFn(), getStorefrontFn()]);
      setOrders(data);
      setStorefront(sfData);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      await updateOrderStatusFn({ data: { id, status } });
      setOrders((prev) => prev.map((o) => o._id === id ? { ...o, status } : o));
    } finally {
      setUpdatingId(null);
    }
  }

  function downloadBill(order: any) {
    const subtotal = order.items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0);
    const deliveryFee = order.totalAmount - subtotal;
    
    // Status color pill logic for HTML
    const getStatusColor = (s: string) => {
      if(s === "pending") return "background: #fef3c7; color: #b45309; border: 1px solid #fde68a;";
      if(s === "packed") return "background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe;";
      if(s === "shipped") return "background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe;";
      if(s === "delivered") return "background: #d1fae5; color: #047857; border: 1px solid #a7f3d0;";
      return "background: #f1f5f9; color: #334155; border: 1px solid #e2e8f0;";
    };

    const statusHtml = `<span style="display:inline-block; padding: 4px 10px; border-radius: 99px; font-size: 11px; font-weight: bold; text-transform: uppercase; ${getStatusColor(order.status)}">${order.status}</span>`;

    const html = `
      <html>
        <head>
          <title>Bill - Order #${order._id.slice(-8).toUpperCase()}</title>
          <style>
            @page { size: auto; margin: 0mm; }
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #111; max-width: 800px; margin: 0 auto; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .header-flex { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; margin-bottom: 20px; }
            h1 { margin: 0 0 5px 0; font-size: 24px; color: #111; font-weight: 900; }
            .seller-info { font-size: 13px; color: #555; line-height: 1.5; }
            .order-info { text-align: right; }
            .meta { font-size: 14px; margin-bottom: 6px; }
            table { width: 100%; border-collapse: collapse; margin-top: 30px; }
            th, td { text-align: left; padding: 12px 0; border-bottom: 1px solid #eee; font-size: 14px; }
            th { text-transform: uppercase; font-size: 12px; color: #777; font-weight: 700; }
            .breakdown { margin-top: 20px; width: 100%; display: flex; justify-content: flex-end; }
            .breakdown-table { width: 300px; font-size: 14px; }
            .breakdown-table td { padding: 8px 0; border-bottom: none; }
            .total-row td { font-weight: 900; font-size: 18px; border-top: 2px solid #333; padding-top: 15px; }
            .address { margin-top: 40px; font-size: 14px; background: #f8fafc; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; line-height: 1.5; }
            @media print {
              body { padding: 20mm; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header-flex">
            <div>
              <h1>JNS MALI</h1>
              <div class="seller-info">
                ${storefront?.adminLocationAddress || 'Yeshwanthpur, Bengaluru, Karnataka'}<br/>
                ${storefront?.contactPhone || '+91 98765 43210'}<br/>
                ${storefront?.contactEmail || 'contact@jnsmali.com'}
              </div>
            </div>
            <div class="order-info">
              <div class="meta" style="font-size: 18px; font-weight: 800;">INVOICE</div>
              <div class="meta"><strong>Order ID:</strong> #${order._id.slice(-8).toUpperCase()}</div>
              <div class="meta"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</div>
              <div class="meta" style="margin-top:8px;">${statusHtml}</div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th style="text-align:right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map((i: any) => `
                <tr>
                  <td><strong>${i.name}</strong></td>
                  <td>${i.quantity}</td>
                  <td>${formatPrice(i.price)}</td>
                  <td style="text-align:right"><strong>${formatPrice(i.price * i.quantity)}</strong></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <div class="breakdown">
            <table class="breakdown-table">
              <tr>
                <td>Subtotal</td>
                <td style="text-align:right">${formatPrice(subtotal)}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td style="text-align:right">${deliveryFee > 0 ? formatPrice(deliveryFee) : 'FREE'}</td>
              </tr>
              <tr class="total-row">
                <td>Total Amount</td>
                <td style="text-align:right">${formatPrice(order.totalAmount)}</td>
              </tr>
            </table>
          </div>

          <div class="address">
            <strong style="font-size:16px; display:block; margin-bottom:8px;">Billed &amp; Shipped To:</strong>
            <strong>${order.shippingDetails?.fullName}</strong><br/>
            ${order.shippingDetails?.address}<br/>
            ${order.shippingDetails?.city} - ${order.shippingDetails?.postalCode}<br/>
            Phone: ${order.shippingDetails?.phone}
          </div>
          
          <div class="no-print" style="margin-top: 40px; text-align: center;">
            <button onclick="window.print()" style="padding: 12px 24px; background: #10b981; color: #fff; font-weight: bold; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">🖨️ Print / Save as PDF</button>
            <p style="margin-top: 10px; color: #666; font-size: 12px;">Tip: When printing, choose "Save as PDF" as your destination.</p>
          </div>
        </body>
      </html>
    `;

    // ── Android / Capacitor: window.open is blocked in WebView ──
    // Use Web Share API to share the HTML file — user can open in Chrome to print
    if (Capacitor.isNativePlatform() && navigator.canShare) {
      const blob = new Blob([html], { type: "text/html" });
      const file = new File([blob], `JNS_MALI_Invoice_${order._id.slice(-8).toUpperCase()}.html`, { type: "text/html" });
      if (navigator.canShare({ files: [file] })) {
        navigator.share({
          title: `JNS MALI Invoice #${order._id.slice(-8).toUpperCase()}`,
          text: "Open this file in Chrome and use Print → Save as PDF",
          files: [file],
        }).catch(() => {});
        return;
      }
      // Fallback: download as blob URL
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `JNS_MALI_Invoice_${order._id.slice(-8).toUpperCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    // ── Web / Desktop: open in new tab ──
    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Orders</h1>
        <p className="mt-1 font-medium text-slate-500">{orders.length} total orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
              filter === s
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {s}
            <span className="ml-1.5 opacity-70">
              ({s === "all" ? orders.length : orders.filter((o) => o.status === s).length})
            </span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="size-10 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white py-20 text-center shadow-sm">
          <ShoppingBag className="mx-auto mb-4 size-12 text-slate-400" />
          <p className="font-medium text-slate-500">No orders found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expanded === order._id;
            return (
              <div key={order._id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition">
                {/* Order header row */}
                <button
                  className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">#{order._id.slice(-8).toUpperCase()}</span>
                      <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="mt-1 font-bold text-slate-900">{order.shippingDetails?.fullName ?? "—"}</p>
                    <p className="text-xs font-medium text-slate-500">
                      {order.shippingDetails?.phone} · {order.shippingDetails?.city} · {new Date(order.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs font-medium text-slate-500">{order.items?.length} item{order.items?.length !== 1 ? "s" : ""}</p>
                  </div>
                  {isOpen ? <ChevronUp className="size-4 text-slate-400 shrink-0" /> : <ChevronDown className="size-4 text-slate-400 shrink-0" />}
                </button>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 space-y-4">
                    {/* Items */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Items</h3>
                      <div className="space-y-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                            {item.image && <img src={item.image} alt="" className="size-10 rounded-md object-cover bg-slate-100 shrink-0" />}
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                              <p className="text-xs font-medium text-slate-500">Qty: {item.quantity} × {formatPrice(item.price)}</p>
                            </div>
                            <span className="text-sm font-black text-slate-900 pr-2">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Shipping Address</h3>
                      <p className="text-sm font-medium text-slate-700">
                        {order.shippingDetails?.address}, {order.shippingDetails?.city} — {order.shippingDetails?.postalCode}
                      </p>
                      <p className="text-sm font-medium text-slate-700">Phone: {order.shippingDetails?.phone}</p>
                      {order.shippingDetails?.lat && order.shippingDetails?.lng && (
                        <a 
                          href={`https://www.google.com/maps?q=${order.shippingDetails.lat},${order.shippingDetails.lng}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
                        >
                          <MapPin className="size-4" />
                          View pinned location on map
                        </a>
                      )}
                    </div>

                    {/* Status change and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                      <div>
                        <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">Update Status</h3>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => {
                            const isActive = order.status === s;
                            return (
                              <Button
                                key={s}
                                size="sm"
                                variant={isActive ? "default" : "outline"}
                                className={`capitalize shadow-sm transition-all ${isActive ? "pointer-events-none opacity-100" : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"}`}
                                onClick={() => handleStatusChange(order._id, s)}
                                disabled={updatingId === order._id || isActive}
                              >
                                {updatingId === order._id && !isActive ? (
                                  <Loader2 className="mr-1.5 size-3.5 animate-spin" />
                                ) : null}
                                {s}
                              </Button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="sm:text-right">
                        <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider sm:text-right">Actions</h3>
                        <Button size="sm" variant="secondary" className="gap-2 bg-white shadow-sm border border-slate-200 hover:bg-slate-50" onClick={() => downloadBill(order)}>
                          <Printer className="size-4" />
                          Download Bill (PDF)
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
