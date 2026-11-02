import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Loader2,
  ShoppingBag,
  ChevronDown,
  ChevronUp,
  MapPin,
  Printer,
  ArrowLeft,
  Edit3,
  Plus,
  Minus,
  Trash2,
  Check,
  User,
  Shield,
  ExternalLink,
  Database,
  X,
  Search,
  Truck,
  RotateCcw,
  AlertTriangle,
  HardDrive,
  RefreshCw,
} from "lucide-react";
import {
  getAllOrdersFn,
  updateOrderStatusFn,
  getStorefrontFn,
  updateOrderItemsFn,
  updateOrderDeliveryFeeFn,
  deleteOrderFn,
  deleteCancelledOrdersFn,
  deleteOldOrdersFn,
  adminCreateOrderFn,
  getAllUsersFn,
  getAdminProductsFn,
  getDbStatsFn,
} from "@/server-functions";
import { formatPrice } from "@/lib/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  // Edit items state
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editedItems, setEditedItems] = useState<any[]>([]);
  const [editedDeliveryFee, setEditedDeliveryFee] = useState<number>(0);
  const [savingItems, setSavingItems] = useState(false);
  const [itemSaveError, setItemSaveError] = useState("");

  // Standalone Delivery fee edit state
  const [editingFeeOrderId, setEditingFeeOrderId] = useState<string | null>(null);
  const [feeInput, setFeeInput] = useState<string>("");
  const [savingFee, setSavingFee] = useState<boolean>(false);

  // Delete order state
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  // Database Management modal state
  const [showDbModal, setShowDbModal] = useState(false);
  const [dbStats, setDbStats] = useState<any>(null);
  const [loadingDbStats, setLoadingDbStats] = useState(false);
  const [dbActionLoading, setDbActionLoading] = useState(false);
  const [dbActionMsg, setDbActionMsg] = useState("");

  // Admin Create Order modal state
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingCreateData, setLoadingCreateData] = useState(false);
  const [creatingOrder, setCreatingOrder] = useState(false);
  const [createOrderError, setCreateOrderError] = useState("");
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [prodSearchTerm, setProdSearchTerm] = useState("");

  const [selectedUserMode, setSelectedUserMode] = useState<"existing" | "custom">("existing");
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [createShipping, setCreateShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "Bengaluru",
    postalCode: "",
  });
  const [createOrderItems, setCreateOrderItems] = useState<
    Array<{ productId: string; name: string; quantity: number; price: number; image?: string }>
  >([]);
  const [createDeliveryFee, setCreateDeliveryFee] = useState<number>(0);
  const [createPaymentMethod, setCreatePaymentMethod] = useState("COD");
  const [createStatus, setCreateStatus] = useState("pending");

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

  useEffect(() => {
    load();
  }, []);

  // ── Items Editing ──────────────────────────────────────────────────────────
  function startEditingItems(order: any) {
    setEditingOrderId(order._id);
    setEditedItems(order.items.map((i: any) => ({ ...i })));
    const sub = order.items.reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const currentFee = Math.max(0, (order.totalAmount || 0) - sub);
    setEditedDeliveryFee(currentFee);
    setItemSaveError("");
  }

  function cancelEditingItems() {
    setEditingOrderId(null);
    setEditedItems([]);
    setItemSaveError("");
  }

  function updateItemQuantity(index: number, newQty: number) {
    if (newQty < 1) return;
    setEditedItems((prev) => prev.map((item, i) => (i === index ? { ...item, quantity: newQty } : item)));
  }

  function removeItemFromOrder(index: number) {
    if (editedItems.length <= 1) {
      setItemSaveError("An order must have at least one item.");
      return;
    }
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  }

  async function saveEditedItems(orderId: string) {
    setSavingItems(true);
    setItemSaveError("");
    try {
      const res = await updateOrderItemsFn({
        data: {
          id: orderId,
          items: editedItems.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image,
          })),
          deliveryFee: Number(editedDeliveryFee || 0),
        },
      });

      if (res) {
        setOrders((prev) =>
          prev.map((o) =>
            o._id === orderId
              ? {
                ...o,
                items: res.items,
                totalAmount: res.totalAmount,
              }
              : o
          )
        );
      }
      setEditingOrderId(null);
    } catch (err: any) {
      setItemSaveError(err?.message || "Failed to update order items");
    } finally {
      setSavingItems(false);
    }
  }

  // ── Delivery Fee Changing ──────────────────────────────────────────────────
  function startEditingFee(order: any) {
    const sub = order.items.reduce((s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0), 0);
    const currentFee = Math.max(0, (order.totalAmount || 0) - sub);
    setFeeInput(String(currentFee));
    setEditingFeeOrderId(order._id);
  }

  async function handleSaveDeliveryFee(orderId: string) {
    setSavingFee(true);
    try {
      const fee = Math.max(0, Number(feeInput || 0));
      const res = await updateOrderDeliveryFeeFn({ data: { id: orderId, deliveryFee: fee } });
      if (res) {
        setOrders((prev) => (prev.map((o) => (o._id === orderId ? { ...o, totalAmount: res.totalAmount } : o))));
      }
      setEditingFeeOrderId(null);
    } catch (e: any) {
      alert("Failed to update delivery fee: " + e.message);
    } finally {
      setSavingFee(false);
    }
  }

  async function handleQuickFreeDelivery(order: any) {
    if (!confirm("Remove delivery fee completely and set to ₹0 (Free Delivery)?")) return;
    try {
      const res = await updateOrderDeliveryFeeFn({ data: { id: order._id, deliveryFee: 0 } });
      if (res) {
        setOrders((prev) => (prev.map((o) => (o._id === order._id ? { ...o, totalAmount: res.totalAmount } : o))));
      }
    } catch (e: any) {
      alert("Failed to update delivery fee: " + e.message);
    }
  }

  // ── Order Deletion ─────────────────────────────────────────────────────────
  async function handleDeleteOrder(orderId: string) {
    if (!confirm("Are you sure you want to permanently delete this order from the database? This cannot be undone.")) return;
    setDeletingOrderId(orderId);
    try {
      await deleteOrderFn({ data: { orderId } });
      setOrders((prev) => prev.filter((o) => o._id !== orderId));
    } catch (e: any) {
      alert("Failed to delete order: " + e.message);
    } finally {
      setDeletingOrderId(null);
    }
  }

  async function handleStatusChange(id: string, status: string) {
    setUpdatingId(id);
    try {
      await updateOrderStatusFn({ data: { id, status } });
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    } finally {
      setUpdatingId(null);
    }
  }

  // ── Database Stats & Cleanup ───────────────────────────────────────────────
  async function openDbManagement() {
    setShowDbModal(true);
    setLoadingDbStats(true);
    setDbActionMsg("");
    try {
      const stats = await getDbStatsFn();
      setDbStats(stats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDbStats(false);
    }
  }

  async function handleCleanCancelled(days: number) {
    const promptMsg =
      days > 0
        ? `Permanently delete cancelled orders older than ${days} days from the database?`
        : "Permanently delete ALL cancelled orders from the database?";
    if (!confirm(promptMsg)) return;

    setDbActionLoading(true);
    setDbActionMsg("");
    try {
      const res = await deleteCancelledOrdersFn({ data: { olderThanDays: days } });
      setDbActionMsg(`✅ Successfully deleted ${res.deletedCount} cancelled order(s)!`);
      const updatedStats = await getDbStatsFn();
      setDbStats(updatedStats);
      await load();
    } catch (e: any) {
      setDbActionMsg(`❌ Error: ${e.message}`);
    } finally {
      setDbActionLoading(false);
    }
  }

  async function handleCleanOldOrders(months: number) {
    if (
      !confirm(
        `Permanently delete completed/historical orders older than ${months} month(s)? (Pending active orders will NOT be affected).`
      )
    )
      return;

    setDbActionLoading(true);
    setDbActionMsg("");
    try {
      const res = await deleteOldOrdersFn({ data: { months } });
      setDbActionMsg(`✅ Successfully purged ${res.deletedCount} old order(s)!`);
      const updatedStats = await getDbStatsFn();
      setDbStats(updatedStats);
      await load();
    } catch (e: any) {
      setDbActionMsg(`❌ Error: ${e.message}`);
    } finally {
      setDbActionLoading(false);
    }
  }

  // ── Admin Create Order ─────────────────────────────────────────────────────
  async function openCreateOrderModal() {
    setShowCreateOrder(true);
    setLoadingCreateData(true);
    setCreateOrderError("");
    try {
      const [uList, pList] = await Promise.all([getAllUsersFn(), getAdminProductsFn()]);
      setAllUsers(uList);
      setAllProducts(pList.map((p: any) => ({ ...p, id: p._id || p.id })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingCreateData(false);
    }
  }

  function handleSelectUser(clerkId: string) {
    setSelectedUserId(clerkId);
    const u = allUsers.find((x) => x.clerkId === clerkId);
    if (u) {
      setCreateShipping((prev) => ({
        ...prev,
        fullName: `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || prev.fullName,
      }));
    }
  }

  function handleAddProductToOrder(prodId: string) {
    const p = allProducts.find((x) => x.id === prodId);
    if (!p) return;
    const existing = createOrderItems.find((it) => it.productId === prodId);
    if (existing) {
      setCreateOrderItems((prev) =>
        prev.map((it) => (it.productId === prodId ? { ...it, quantity: it.quantity + 1 } : it))
      );
    } else {
      setCreateOrderItems((prev) => [
        ...prev,
        {
          productId: p.id,
          name: p.name,
          price: Number(p.price),
          quantity: 1,
          image: p.imageUrl || p.image || "",
        },
      ]);
    }
  }

  const createSubtotal = createOrderItems.reduce((s, it) => s + it.price * it.quantity, 0);
  const createTotal = createSubtotal + Number(createDeliveryFee || 0);

  async function handleSubmitCreateOrder() {
    if (!createShipping.fullName.trim()) {
      setCreateOrderError("Customer full name is required.");
      return;
    }
    if (!createShipping.phone.trim()) {
      setCreateOrderError("Customer phone number is required.");
      return;
    }
    if (!createShipping.address.trim()) {
      setCreateOrderError("Shipping address is required.");
      return;
    }
    if (createOrderItems.length === 0) {
      setCreateOrderError("Please add at least one product to the order.");
      return;
    }

    setCreatingOrder(true);
    setCreateOrderError("");
    try {
      const finalUserId =
        selectedUserMode === "existing" && selectedUserId ? selectedUserId : `guest_${Date.now()}`;

      const newOrder = await adminCreateOrderFn({
        data: {
          userId: finalUserId,
          items: createOrderItems,
          totalAmount: createTotal,
          paymentMethod: createPaymentMethod,
          status: createStatus,
          shippingDetails: {
            ...createShipping,
          },
        },
      });

      setOrders((prev) => [newOrder, ...prev]);
      setShowCreateOrder(false);
      setCreateOrderItems([]);
      setSelectedUserId("");
      setCreateShipping({ fullName: "", phone: "", address: "", city: "Bengaluru", postalCode: "" });
      setCreateDeliveryFee(0);
    } catch (e: any) {
      setCreateOrderError(e?.message || "Failed to create order.");
    } finally {
      setCreatingOrder(false);
    }
  }

  // ── Download Bill ──────────────────────────────────────────────────────────
  function downloadBill(order: any) {
    const subtotal = order.items.reduce((acc: number, i: any) => acc + i.price * i.quantity, 0);
    const deliveryFee = order.totalAmount - subtotal;

    const getStatusColor = (s: string) => {
      if (s === "pending") return "background: #fef3c7; color: #b45309; border: 1px solid #fde68a;";
      if (s === "packed") return "background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe;";
      if (s === "shipped") return "background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe;";
      if (s === "delivered") return "background: #d1fae5; color: #047857; border: 1px solid #a7f3d0;";
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
                Cleaning &amp; Household Essentials<br/>
                ${storefront?.adminLocationAddress || "Yeshwanthpur, Bengaluru, Karnataka, India"}<br/>
                Phone: ${storefront?.contactPhone || "+91 98765 43210"} | Email: ${storefront?.contactEmail || "contact@jnsmali.com"}
              </div>
            </div>
            <div class="order-info">
              <div style="margin-bottom: 10px;">${statusHtml}</div>
              <div class="meta"><strong>Invoice:</strong> #${order._id.slice(-8).toUpperCase()}</div>
              <div class="meta"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
              <div class="meta"><strong>Payment:</strong> ${order.paymentMethod || "COD"}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 50%;">Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
        .map(
          (i: any) => `
                <tr>
                  <td>
                    <strong>${i.name}</strong>
                  </td>
                  <td style="text-align: center;">${i.quantity}</td>
                  <td style="text-align: right;">₹${i.price}</td>
                  <td style="text-align: right;">₹${i.price * i.quantity}</td>
                </tr>
              `
        )
        .join("")}
            </tbody>
          </table>

          <div class="breakdown">
            <table class="breakdown-table">
              <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">₹${subtotal}</td>
              </tr>
              <tr>
                <td>Delivery Fee</td>
                <td style="text-align: right;">${deliveryFee > 0 ? "₹" + deliveryFee : "FREE"}</td>
              </tr>
              <tr class="total-row">
                <td>Total Paid / Due</td>
                <td style="text-align: right; color: #16a34a;">₹${order.totalAmount}</td>
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

    if (Capacitor.isNativePlatform() && navigator.canShare) {
      const blob = new Blob([html], { type: "text/html" });
      const file = new File([blob], `JNS_MALI_Invoice_${order._id.slice(-8).toUpperCase()}.html`, {
        type: "text/html",
      });
      if (navigator.canShare({ files: [file] })) {
        navigator
          .share({
            title: `JNS MALI Invoice #${order._id.slice(-8).toUpperCase()}`,
            text: "Open this file in Chrome and use Print → Save as PDF",
            files: [file],
          })
          .catch(() => { });
        return;
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `JNS_MALI_Invoice_${order._id.slice(-8).toUpperCase()}.html`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(html);
    w.document.close();
  }

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-100 hover:text-slate-900"
          >
            <ArrowLeft className="size-3.5" />
            <span>Dashboard</span>
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Orders</h1>
            <p className="text-xs sm:text-sm font-medium text-slate-500">{orders.length} total orders recorded</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={openDbManagement}
            variant="outline"
            className="gap-1.5 text-xs font-bold border-slate-200 bg-white hover:bg-slate-50 shadow-sm"
          >
            <Database className="size-3.5 text-amber-600" />
            <span>DB Storage &amp; Cleanup</span>
          </Button>

          <Button onClick={openCreateOrderModal} className="gap-1.5 text-xs font-bold shadow-sm">
            <Plus className="size-4" />
            <span>Create Order for User</span>
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["all", ...STATUS_OPTIONS].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold capitalize transition ${filter === s
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
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
          <p className="font-medium text-slate-500">No orders found for this status.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isOpen = expanded === order._id;
            const subtotal = order.items?.reduce(
              (s: number, it: any) => s + Number(it.price || 0) * Number(it.quantity || 0),
              0
            );
            const deliveryFee = Math.max(0, (order.totalAmount || 0) - subtotal);

            return (
              <div
                key={order._id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition"
              >
                {/* Order header row */}
                <div
                  className="flex w-full flex-wrap items-center gap-3 px-5 py-4 text-left hover:bg-slate-50/80 transition cursor-pointer"
                  onClick={() => setExpanded(isOpen ? null : order._id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-bold capitalize ${statusColor[order.status] ?? "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                      >
                        {order.status}
                      </span>
                      {order.status === "cancelled" && (
                        <span className="text-[10px] font-bold text-slate-400">
                          (Auto-deletes after 15 days)
                        </span>
                      )}
                    </div>

                    {/* Customer Name with direct User Profile link */}
                    <div className="mt-1 flex items-center gap-1.5">
                      <Link
                        to="/admin/users"
                        search={{ q: order.userId || order.shippingDetails?.fullName }}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm font-bold text-slate-900 hover:text-primary transition group"
                        title="Click to view customer in Users section (to manage or block)"
                      >
                        <User className="size-3.5 text-slate-400 group-hover:text-primary transition" />
                        <span className="underline decoration-slate-300 group-hover:decoration-primary">
                          {order.shippingDetails?.fullName ?? "—"}
                        </span>
                        <ExternalLink className="size-3 text-slate-400 opacity-60 group-hover:opacity-100 group-hover:text-primary transition" />
                      </Link>
                    </div>

                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {order.shippingDetails?.phone} · {order.shippingDetails?.city} ·{" "}
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-black text-slate-900">{formatPrice(order.totalAmount)}</p>
                    <p className="text-xs font-medium text-slate-500">
                      {order.items?.length} item{order.items?.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  {isOpen ? (
                    <ChevronUp className="size-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="size-4 text-slate-400 shrink-0" />
                  )}
                </div>

                {/* Expanded details */}
                {isOpen && (
                  <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4 space-y-4">
                    {/* Items Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                          Items in Order ({order.items?.length})
                        </h3>
                        {editingOrderId === order._id ? (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={cancelEditingItems}
                              disabled={savingItems}
                              className="h-7 text-xs font-bold text-slate-600 bg-white"
                            >
                              Cancel
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => saveEditedItems(order._id)}
                              disabled={savingItems}
                              className="h-7 text-xs font-bold gap-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                              {savingItems ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                              Save Changes
                            </Button>
                          </div>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditingItems(order)}
                            className="h-7 text-xs font-bold text-primary hover:bg-primary/10 gap-1.5"
                          >
                            <Edit3 className="size-3.5" /> Edit Items &amp; Quantities
                          </Button>
                        )}
                      </div>

                      {editingOrderId === order._id && itemSaveError && (
                        <div className="mb-2 p-2 rounded-lg bg-red-50 text-red-600 text-xs font-medium border border-red-200">
                          {itemSaveError}
                        </div>
                      )}

                      {editingOrderId === order._id ? (
                        <div className="space-y-2 rounded-xl bg-slate-100/70 p-3 border border-slate-200">
                          {editedItems.map((item, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between gap-3 bg-white p-2.5 rounded-lg border border-slate-200 shadow-sm"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="size-10 rounded-md object-contain bg-slate-50 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs text-slate-500">Unit: {formatPrice(item.price)}</p>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="size-7 bg-white text-slate-700"
                                  onClick={() => updateItemQuantity(i, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="size-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-bold text-slate-900">{item.quantity}</span>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="size-7 bg-white text-slate-700"
                                  onClick={() => updateItemQuantity(i, item.quantity + 1)}
                                >
                                  <Plus className="size-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="size-7 text-red-500 hover:bg-red-50 ml-1"
                                  onClick={() => removeItemFromOrder(i)}
                                  title="Remove item"
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                            </div>
                          ))}
                          <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600">Delivery Fee during Edit:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={editedDeliveryFee}
                                onChange={(e) => setEditedDeliveryFee(Math.max(0, Number(e.target.value)))}
                                className="w-20 rounded border border-slate-300 px-2 py-0.5 text-xs text-slate-900"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {order.items?.map((item: any, i: number) => (
                            <div
                              key={i}
                              className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-slate-100 shadow-sm"
                            >
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="size-10 rounded-md object-contain bg-slate-100 shrink-0"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="truncate text-sm font-bold text-slate-900">{item.name}</p>
                                <p className="text-xs font-medium text-slate-500">
                                  Qty: {item.quantity} × {formatPrice(item.price)}
                                </p>
                              </div>
                              <span className="text-sm font-black text-slate-900 pr-2">
                                {formatPrice(item.price * item.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Order Financial Breakdown & Delivery Fee Controls */}
                    <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm space-y-2.5">
                      <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
                        Order Financials &amp; Delivery Fee
                      </h3>

                      <div className="flex items-center justify-between text-xs text-slate-600">
                        <span>Items Subtotal:</span>
                        <span className="font-bold text-slate-900">{formatPrice(subtotal)}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 border-t border-slate-100 pt-2.5">
                        <div className="flex items-center gap-1.5">
                          <Truck className="size-4 text-primary" />
                          <span className="font-bold text-slate-700">Delivery Fee:</span>
                          {deliveryFee === 0 && (
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              FREE DELIVERY
                            </span>
                          )}
                        </div>

                        {editingFeeOrderId === order._id ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              value={feeInput}
                              onChange={(e) => setFeeInput(e.target.value)}
                              placeholder="0"
                              className="w-16 rounded border border-slate-300 px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <Button
                              size="sm"
                              className="h-7 px-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleSaveDeliveryFee(order._id)}
                              disabled={savingFee}
                            >
                              {savingFee ? <Loader2 className="size-3 animate-spin" /> : "Save"}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs text-slate-500"
                              onClick={() => setEditingFeeOrderId(null)}
                              disabled={savingFee}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-black text-slate-900 text-sm">
                              {deliveryFee === 0 ? "₹0" : formatPrice(deliveryFee)}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-6 px-2 text-[11px] font-bold text-primary border-primary/30 hover:bg-primary/5"
                              onClick={() => startEditingFee(order)}
                            >
                              <Edit3 className="size-3 mr-1" /> Change Fee
                            </Button>
                            {deliveryFee > 0 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 px-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50"
                                onClick={() => handleQuickFreeDelivery(order)}
                              >
                                Make Free (₹0)
                              </Button>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-sm font-black text-slate-900 border-t border-slate-200 pt-2.5">
                        <span>Grand Total:</span>
                        <span className="text-base text-primary font-black">{formatPrice(order.totalAmount)}</span>
                      </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="rounded-xl bg-white p-4 border border-slate-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2">
                          <div className="size-8 rounded-full bg-primary/10 text-primary font-black grid place-items-center text-xs">
                            {(order.shippingDetails?.fullName?.[0] || "U").toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{order.shippingDetails?.fullName}</p>
                            <p className="text-xs text-slate-500">Phone: {order.shippingDetails?.phone}</p>
                          </div>
                        </div>

                        {/* Direct link to user in admin users section to block or unblock */}
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs font-bold gap-1 text-primary border-primary/30 hover:bg-primary/5 shadow-sm"
                        >
                          <Link to="/admin/users" search={{ q: order.userId || order.shippingDetails?.fullName }}>
                            <Shield className="size-3" />
                            <span>View User / Block</span>
                          </Link>
                        </Button>
                      </div>

                      <div>
                        <h4 className="text-[11px] font-bold uppercase text-slate-400">Delivery Address</h4>
                        <p className="text-sm font-medium text-slate-700 mt-0.5">
                          {order.shippingDetails?.address}, {order.shippingDetails?.city} —{" "}
                          {order.shippingDetails?.postalCode}
                        </p>
                        {order.shippingDetails?.lat && order.shippingDetails?.lng && (
                          <a
                            href={`https://www.google.com/maps?q=${order.shippingDetails.lat},${order.shippingDetails.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                          >
                            <MapPin className="size-3.5" />
                            View pinned location on Google Maps ↗
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Status change and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pt-2">
                      <div>
                        <h3 className="mb-2 text-xs font-bold uppercase text-slate-500 tracking-wider">
                          Update Order Status
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {STATUS_OPTIONS.map((s) => {
                            const isActive = order.status === s;
                            return (
                              <Button
                                key={s}
                                size="sm"
                                variant={isActive ? "default" : "outline"}
                                className={`capitalize shadow-sm transition-all text-xs ${isActive
                                    ? "pointer-events-none opacity-100"
                                    : "bg-white text-slate-600 hover:text-slate-900 border-slate-200"
                                  }`}
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

                      <div className="flex flex-wrap sm:flex-col sm:items-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="gap-2 bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-xs font-bold"
                          onClick={() => downloadBill(order)}
                        >
                          <Printer className="size-3.5" />
                          Download Bill (PDF)
                        </Button>

                        {/* Cancelled Order Deletion */}
                        {order.status === "cancelled" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 text-xs font-bold shadow-sm"
                            onClick={() => handleDeleteOrder(order._id)}
                            disabled={deletingOrderId === order._id}
                          >
                            {deletingOrderId === order._id ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                            Delete from DB
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Database Management & Free Tier Limits Modal ── */}
      {showDbModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <Database className="size-5 text-amber-600" />
                <div>
                  <h2 className="text-lg font-black text-slate-900">DBMS Storage &amp; Cleanup</h2>
                  <p className="text-xs text-slate-500">Monitor free tier storage and manage database clutter</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowDbModal(false)}>
                <X className="size-5 text-slate-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {loadingDbStats ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : dbStats ? (
                <>
                  {/* Storage Meter */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HardDrive className="size-4 text-slate-600" />
                        <span className="text-xs font-bold text-slate-700">MongoDB Atlas (M0 Free Tier)</span>
                      </div>
                      <span className="text-xs font-black text-primary">{dbStats.percentUsed}% Used</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${dbStats.percentUsed > 85 ? "bg-red-500" : dbStats.percentUsed > 60 ? "bg-amber-500" : "bg-emerald-600"
                          }`}
                        style={{ width: `${Math.max(2, dbStats.percentUsed)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-600 font-medium">
                      <span>Occupied: <b>{dbStats.storageUsedMB} MB</b></span>
                      <span>Free Remaining: <b className="text-emerald-700">{dbStats.freeStorageMB} MB</b></span>
                      <span>Cap: <b>{dbStats.maxStorageMB} MB</b></span>
                    </div>
                  </div>

                  {/* Document Breakdown */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div className="rounded-lg border border-slate-200 p-3 bg-white text-center">
                      <span className="block text-xl font-black text-slate-900">{dbStats.counts?.orders ?? 0}</span>
                      <span className="text-[11px] font-bold text-slate-500">Orders</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white text-center">
                      <span className="block text-xl font-black text-slate-900">{dbStats.counts?.products ?? 0}</span>
                      <span className="text-[11px] font-bold text-slate-500">Products</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white text-center">
                      <span className="block text-xl font-black text-slate-900">{dbStats.counts?.users ?? 0}</span>
                      <span className="text-[11px] font-bold text-slate-500">Users</span>
                    </div>
                    <div className="rounded-lg border border-slate-200 p-3 bg-white text-center">
                      <span className="block text-xl font-black text-red-600">{dbStats.counts?.cancelledOrders ?? 0}</span>
                      <span className="text-[11px] font-bold text-slate-500">Cancelled</span>
                    </div>
                  </div>

                  {/* Auto-cleanup notification */}
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-3 text-xs text-blue-900 flex items-start gap-2">
                    <RefreshCw className="size-4 shrink-0 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-bold">Automated 15-Day Auto-Purge Policy</p>
                      <p className="mt-0.5 text-blue-800">
                        Orders marked as &quot;cancelled&quot; older than 15 days are automatically removed from your database to ensure free tier storage is never consumed by abandoned orders.
                      </p>
                    </div>
                  </div>

                  {dbActionMsg && (
                    <div className="p-3 rounded-lg border bg-slate-50 text-xs font-bold text-slate-800">
                      {dbActionMsg}
                    </div>
                  )}

                  {/* Manual Cleanup Tools */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Manual Database Purge Tools</h3>

                    <div className="grid gap-2">
                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Purge Cancelled Orders (&gt; 15 Days Old)</p>
                          <p className="text-[11px] text-slate-500">Safely clear stale cancelled orders right now</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCleanCancelled(15)}
                          disabled={dbActionLoading}
                          className="text-xs font-bold shrink-0"
                        >
                          Purge &gt; 15d
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Purge ALL Cancelled Orders</p>
                          <p className="text-[11px] text-slate-500">Permanently remove every cancelled order ({dbStats.counts?.cancelledOrders ?? 0})</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCleanCancelled(0)}
                          disabled={dbActionLoading || !dbStats.counts?.cancelledOrders}
                          className="text-xs font-bold text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                        >
                          Clear All Cancelled
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Delete Historical Orders Older Than 1 Month</p>
                          <p className="text-[11px] text-slate-500">Deletes completed/past orders (pending orders will not be deleted)</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCleanOldOrders(1)}
                          disabled={dbActionLoading}
                          className="text-xs font-bold shrink-0"
                        >
                          Delete &gt; 1 Mo
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-white">
                        <div>
                          <p className="text-xs font-bold text-slate-900">Delete Historical Orders Older Than 3 Months</p>
                          <p className="text-[11px] text-slate-500">Clear database clutter older than 90 days</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCleanOldOrders(3)}
                          disabled={dbActionLoading}
                          className="text-xs font-bold shrink-0"
                        >
                          Delete &gt; 3 Mo
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-sm text-slate-500">Failed to load stats.</p>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex justify-end">
              <Button size="sm" onClick={() => setShowDbModal(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Admin Create Order for User Modal ── */}
      {showCreateOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
              <div>
                <h2 className="text-lg font-black text-slate-900">Create Order for User</h2>
                <p className="text-xs text-slate-500">Order will appear in the customer&apos;s &quot;My Orders&quot; section on the website</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateOrder(false)}>
                <X className="size-5 text-slate-400" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {loadingCreateData ? (
                <div className="py-12 flex justify-center">
                  <Loader2 className="size-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {createOrderError && (
                    <div className="p-3 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-200">
                      {createOrderError}
                    </div>
                  )}

                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">Select Customer</label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant={selectedUserMode === "existing" ? "default" : "outline"}
                        className="text-xs font-bold"
                        onClick={() => setSelectedUserMode("existing")}
                      >
                        Registered User ({allUsers.length})
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={selectedUserMode === "custom" ? "default" : "outline"}
                        className="text-xs font-bold"
                        onClick={() => {
                          setSelectedUserMode("custom");
                          setSelectedUserId("");
                        }}
                      >
                        Guest / Manual User
                      </Button>
                    </div>

                    {selectedUserMode === "existing" ? (
                      <div className="space-y-2 pt-1">
                        <Input
                          placeholder="Search registered users by name or email…"
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="text-xs bg-slate-50"
                        />
                        <div className="max-h-36 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
                          {allUsers
                            .filter((u) => {
                              const q = userSearchTerm.toLowerCase();
                              return (
                                !q ||
                                u.email?.toLowerCase().includes(q) ||
                                u.firstName?.toLowerCase().includes(q) ||
                                u.lastName?.toLowerCase().includes(q)
                              );
                            })
                            .map((u) => (
                              <div
                                key={u.clerkId}
                                onClick={() => handleSelectUser(u.clerkId)}
                                className={`p-2.5 text-xs cursor-pointer flex items-center justify-between transition ${selectedUserId === u.clerkId ? "bg-primary/10 font-bold text-primary" : "hover:bg-slate-50"
                                  }`}
                              >
                                <div>
                                  <span className="font-bold text-slate-900 block">
                                    {u.firstName || u.lastName ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "Registered User"}
                                  </span>
                                  <span className="text-slate-500 text-[11px]">{u.email}</span>
                                </div>
                                {selectedUserId === u.clerkId && <Check className="size-4 text-primary" />}
                              </div>
                            ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {/* Shipping Form */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Customer Full Name *</label>
                      <Input
                        value={createShipping.fullName}
                        onChange={(e) => setCreateShipping((s) => ({ ...s, fullName: e.target.value }))}
                        placeholder="e.g. Ramesh Kumar"
                        className="text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Customer Phone *</label>
                      <Input
                        value={createShipping.phone}
                        onChange={(e) => setCreateShipping((s) => ({ ...s, phone: e.target.value }))}
                        placeholder="e.g. +91 98765 43210"
                        className="text-xs mt-1"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Shipping Address *</label>
                      <Input
                        value={createShipping.address}
                        onChange={(e) => setCreateShipping((s) => ({ ...s, address: e.target.value }))}
                        placeholder="House / Flat / Street address"
                        className="text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">City</label>
                      <Input
                        value={createShipping.city}
                        onChange={(e) => setCreateShipping((s) => ({ ...s, city: e.target.value }))}
                        placeholder="Bengaluru"
                        className="text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Postal Code</label>
                      <Input
                        value={createShipping.postalCode}
                        onChange={(e) => setCreateShipping((s) => ({ ...s, postalCode: e.target.value }))}
                        placeholder="e.g. 560022"
                        className="text-xs mt-1"
                      />
                    </div>
                  </div>

                  {/* Add Products to Order */}
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <label className="text-xs font-bold uppercase text-slate-600 tracking-wider">
                      Add Products from Catalog ({allProducts.length})
                    </label>
                    <Input
                      placeholder="Search catalog products…"
                      value={prodSearchTerm}
                      onChange={(e) => setProdSearchTerm(e.target.value)}
                      className="text-xs bg-slate-50"
                    />

                    <div className="max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white divide-y divide-slate-100">
                      {allProducts
                        .filter((p) => !prodSearchTerm || p.name?.toLowerCase().includes(prodSearchTerm.toLowerCase()))
                        .map((p) => (
                          <div
                            key={p.id}
                            className="p-2.5 text-xs flex items-center justify-between hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              {p.imageUrl && (
                                <img src={p.imageUrl} alt="" className="size-8 rounded object-contain bg-slate-50 shrink-0" />
                              )}
                              <div className="min-w-0">
                                <span className="font-bold text-slate-900 block truncate">{p.name}</span>
                                <span className="text-primary font-bold">{formatPrice(p.price)}</span>
                              </div>
                            </div>
                            <Button
                              type="button"
                              size="sm"
                              className="h-7 text-xs font-bold gap-1 shrink-0"
                              onClick={() => handleAddProductToOrder(p.id)}
                            >
                              <Plus className="size-3" /> Add
                            </Button>
                          </div>
                        ))}
                    </div>

                    {/* Selected Order Items */}
                    {createOrderItems.length > 0 && (
                      <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-slate-700">Selected Items ({createOrderItems.length})</label>
                        {createOrderItems.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-bold text-slate-900 truncate block">{item.name}</span>
                              <span className="text-slate-500">{formatPrice(item.price)} each</span>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) => {
                                  const q = Math.max(1, Number(e.target.value));
                                  setCreateOrderItems((prev) =>
                                    prev.map((it, i) => (i === idx ? { ...it, quantity: q } : it))
                                  );
                                }}
                                className="w-14 rounded border border-slate-300 px-2 py-0.5 text-center text-xs"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="size-6 text-red-500"
                                onClick={() => setCreateOrderItems((prev) => prev.filter((_, i) => i !== idx))}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Payment, Delivery Fee and Total */}
                  <div className="grid gap-3 sm:grid-cols-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-bold text-slate-700">Delivery Fee (₹)</label>
                      <Input
                        type="number"
                        min="0"
                        value={createDeliveryFee}
                        onChange={(e) => setCreateDeliveryFee(Math.max(0, Number(e.target.value)))}
                        placeholder="0 for Free Delivery"
                        className="text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Payment Method</label>
                      <select
                        value={createPaymentMethod}
                        onChange={(e) => setCreatePaymentMethod(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 mt-1 shadow-sm"
                      >
                        <option value="COD">Cash on Delivery (COD)</option>
                        <option value="UPI">UPI / GPay / PhonePe</option>
                        <option value="Prepaid">Prepaid / Bank Transfer</option>
                        <option value="Cash">Cash in Store</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700">Initial Status</label>
                      <select
                        value={createStatus}
                        onChange={(e) => setCreateStatus(e.target.value)}
                        className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 mt-1 shadow-sm capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="packed">Packed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  {/* Total Summary */}
                  <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-500 block">Subtotal: {formatPrice(createSubtotal)}</span>
                      <span className="text-slate-500 block">
                        Delivery: {createDeliveryFee > 0 ? formatPrice(createDeliveryFee) : "FREE"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase text-slate-400 block">Total Amount</span>
                      <span className="text-lg font-black text-primary">{formatPrice(createTotal)}</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={() => setShowCreateOrder(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitCreateOrder}
                disabled={creatingOrder || createOrderItems.length === 0}
                className="gap-1.5 font-bold shadow-sm"
              >
                {creatingOrder ? <Loader2 className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}
                Place Order for User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}