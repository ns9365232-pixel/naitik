import React, { useState, useEffect, useMemo } from 'react';
import {
  Users, Package, ShoppingCart, Truck, Shield, DollarSign,
  TrendingUp, TrendingDown, AlertTriangle, FileText, Settings,
  LogOut, Lock, Key, CheckCircle, XCircle, Search, Filter,
  Calendar, RotateCcw, Building, Smartphone, MapPin, Eye,
  EyeOff, Plus, Trash2, Edit, Save, Download, RefreshCw, BarChart2
} from 'lucide-react';

// ============================================================================
// INITIAL DATA ARCHITECTURE (State Initializer)
// ============================================================================
const INITIAL_STATE = {
  currentUser: null,
  activeRole: null, // 'OWNER', 'MANAGER', 'SALESMAN', 'DELIVERY'
  users: [
    { id: 'usr-1', username: 'owner', name: 'Rajesh Sharma (Owner)', role: 'OWNER', phone: '9876543210', active: true },
    { id: 'usr-2', username: 'manager', name: 'Vikram Singh (Manager)', role: 'MANAGER', phone: '9876543211', active: true },
    { id: 'usr-3', username: 'salesman1', name: 'Amit Kumar (Salesman)', role: 'SALESMAN', phone: '9876543212', active: true },
    { id: 'usr-4', username: 'delivery1', name: 'Suresh Verma (Delivery)', role: 'DELIVERY', phone: '9876543213', active: true }
  ],
  customers: [
    { id: 'cust-101', name: 'Gupta Kirana Store', owner: 'Ramesh Gupta', phone: '9811223344', address: 'Shop 14, Main Market', gstin: '03AAAAA0000A1Z5', creditLimit: 100000, udhar: 34500, priceCat: 'Wholesale' },
    { id: 'cust-102', name: 'Sharma General Traders', owner: 'Sunil Sharma', phone: '9811223355', address: 'G.T. Road, Rayya', gstin: '03BBBBB1111B1Z2', creditLimit: 200000, udhar: 125000, priceCat: 'Dealer' },
    { id: 'cust-103', name: 'Verma Supermarket', owner: 'Vijay Verma', phone: '9811223366', address: 'Court Road', gstin: '03CCCCC2222C1Z9', creditLimit: 50000, udhar: 0, priceCat: 'Retail' }
  ],
  suppliers: [
    { id: 'sup-1', name: 'Hindustan Unilever Depot', factory: 'HUL Plant - Rajpura', contact: '9899001122', gstin: '03AAAAL1234F1ZP', address: 'Industrial Area Phase 1', pendingPay: 450000 },
    { id: 'sup-2', name: 'Nestle India Distribution', factory: 'Nestle Moga Plant', contact: '9899001133', gstin: '03AAAAN5678G1ZQ', address: 'GT Road Moga', pendingPay: 210000 }
  ],
  inventory: [
    { id: 'item-1', name: 'Fortune Refined Mustard Oil 1L', brand: 'Fortune', category: 'Edible Oil', sku: 'OIL-FOR-1L', barcode: '8901234567890', hsn: '1514', gst: 5, purchasePrice: 110, wholesalePrice: 122, retailPrice: 135, dealerPrice: 118, mrp: 145, currentStock: 450, boxCount: 30, minStock: 50, location: 'Rack A-12' },
    { id: 'item-2', name: 'Tata Tea Gold 500g', brand: 'Tata', category: 'Beverages', sku: 'TEA-TAT-500G', barcode: '8901234567891', hsn: '0902', gst: 5, purchasePrice: 280, wholesalePrice: 310, retailPrice: 340, dealerPrice: 300, mrp: 360, currentStock: 180, boxCount: 15, minStock: 30, location: 'Rack B-04' },
    { id: 'item-3', name: 'Surf Excel Easy Wash 1Kg', brand: 'HUL', category: 'Detergents', sku: 'DET-SUR-1KG', barcode: '8901234567892', hsn: '3402', gst: 18, purchasePrice: 115, wholesalePrice: 132, retailPrice: 145, dealerPrice: 128, mrp: 155, currentStock: 12, boxCount: 1, minStock: 40, location: 'Rack C-01' }
  ],
  invoices: [
    {
      id: 'INV-2026-001',
      date: '2026-08-08',
      time: '10:30 AM',
      customerId: 'cust-101',
      customerName: 'Gupta Kirana Store',
      salesman: 'Amit Kumar',
      manager: 'Vikram Singh',
      vehicle: 'PB-02-CB-1234',
      items: [
        { itemId: 'item-1', name: 'Fortune Refined Mustard Oil 1L', qty: 60, boxes: 4, rate: 122, gstPct: 5, total: 7320 },
        { itemId: 'item-2', name: 'Tata Tea Gold 500g', qty: 20, boxes: 2, rate: 310, gstPct: 5, total: 6200 }
      ],
      grossAmount: 13520,
      returnedAmount: 0,
      finalAmount: 13520,
      cash: 5000,
      upi: 0,
      udhar: 8520,
      status: 'DELIVERED',
      deliveryPerson: 'Suresh Verma'
    }
  ],
  purchases: [
    { id: 'PUR-2026-801', date: '2026-08-05', supplierId: 'sup-1', supplierName: 'Hindustan Unilever Depot', invoiceNo: 'HUL-998822', items: [{ itemId: 'item-3', qty: 200, rate: 115 }], grossAmount: 23000, gstAmount: 4140, transportCost: 1000, totalValue: 28140 }
  ],
  returns: [],
  activityLogs: [
    { id: 'log-1', timestamp: '2026-08-08 09:00:00', user: 'owner', role: 'OWNER', action: 'SYSTEM_BOOTUP', details: 'System initialization successfully logged.' }
  ],
  handoverBoard: {
    date: '2026-08-08',
    physicalCash: 5000,
    onlineUpi: 0,
    marketUdhar: 8520,
    expenses: 200,
    adjustments: 0,
    locked: false,
    authorizedBy: null
  }
};

// ============================================================================
// MAIN APPLICATION CONTAINER
// ============================================================================
export default function App() {
  const [store, setStore] = useState(() => {
    const saved = localStorage.getItem('RSWM_ERP_STATE');
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem('RSWM_ERP_STATE', JSON.stringify(store));
  }, [store]);

  const logActivity = (action, details) => {
    const newLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: store.currentUser ? store.currentUser.username : 'SYSTEM',
      role: store.activeRole || 'NONE',
      action,
      details
    };
    setStore(prev => ({ ...prev, activityLogs: [newLog, ...prev.activityLogs] }));
  };

  const handleLogin = (username, password) => {
    const matchedUser = store.users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!matchedUser) return { success: false, msg: 'Invalid Credentials' };
    if (!matchedUser.active) return { success: false, msg: 'ACCOUNT DISABLED. Contact Owner immediately.' };

    setStore(prev => ({ ...prev, currentUser: matchedUser, activeRole: matchedUser.role }));
    logActivity('USER_LOGIN', `User ${matchedUser.username} logged in as ${matchedUser.role}`);
    return { success: true };
  };

  const handleLogout = () => {
    logActivity('USER_LOGOUT', `User ${store.currentUser?.username} logged out`);
    setStore(prev => ({ ...prev, currentUser: null, activeRole: null }));
  };

  if (!store.currentUser) {
    return <LoginScreen onLogin={handleLogin} users={store.users} setStore={setStore} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      {store.activeRole === 'OWNER' && <OwnerModule store={store} setStore={setStore} onLogout={handleLogout} logActivity={logActivity} />}
      {store.activeRole === 'MANAGER' && <ManagerModule store={store} setStore={setStore} onLogout={handleLogout} logActivity={logActivity} />}
      {store.activeRole === 'SALESMAN' && <SalesmanModule store={store} setStore={setStore} onLogout={handleLogout} logActivity={logActivity} />}
      {store.activeRole === 'DELIVERY' && <DeliveryModule store={store} setStore={setStore} onLogout={handleLogout} logActivity={logActivity} />}
    </div>
  );
}

// ============================================================================
// 1. LOGIN & AUTHENTICATION MODULE
// ============================================================================
function LoginScreen({ onLogin, users, setStore }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetPhone, setResetPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVal, setOtpVal] = useState('');
  const [newPass, setNewPass] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const submitLogin = (e) => {
    e.preventDefault();
    const res = onLogin(username, password);
    if (!res.success) setError(res.msg);
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!otpSent) {
      const found = users.find(u => u.phone === resetPhone);
      if (found) {
        setOtpSent(true);
        setError('');
      } else {
        setError('Registered phone number not found.');
      }
    } else {
      if (otpVal === '1234') { // Mock OTP Verification
        setStore(prev => ({
          ...prev,
          users: prev.users.map(u => u.phone === resetPhone ? { ...u, password: newPass } : u)
        }));
        setResetSuccess(true);
      } else {
        setError('Invalid OTP code. Enter 1234 for testing.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/10 text-blue-500 mb-3 border border-blue-500/20">
            <Building className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">RADHA SWAMI</h1>
          <p className="text-xs uppercase tracking-widest text-blue-400 font-semibold mt-1">Wholesale Mart ERP</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!forgotMode ? (
          <form onSubmit={submitLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Username / ID</label>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 transition duration-200"
            >
              Sign In
            </button>

            <div className="flex justify-between items-center pt-2 text-xs">
              <button
                type="button"
                onClick={() => { setForgotMode(true); setError(''); }}
                className="text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
              <span className="text-slate-500">v2.4 Production</span>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <h3 className="text-sm font-semibold text-white mb-2">Account Recovery (OTP System)</h3>
            {!resetSuccess ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Registered Phone Number</label>
                  <input
                    type="text"
                    required
                    value={resetPhone}
                    onChange={e => setResetPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    disabled={otpSent}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                  />
                </div>

                {otpSent && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">Enter OTP (Test OTP: 1234)</label>
                      <input
                        type="text"
                        required
                        value={otpVal}
                        onChange={e => setOtpVal(e.target.value)}
                        placeholder="1234"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1">New Password</label>
                      <input
                        type="password"
                        required
                        value={newPass}
                        onChange={e => setNewPass(e.target.value)}
                        placeholder="Enter new password"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white"
                      />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition"
                >
                  {!otpSent ? 'Send OTP Code' : 'Verify & Reset Password'}
                </button>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto" />
                <p className="text-sm text-emerald-400 font-medium">Password successfully reset!</p>
              </div>
            )}

            <button
              type="button"
              onClick={() => { setForgotMode(false); setOtpSent(false); setResetSuccess(false); setError(''); }}
              className="w-full bg-slate-800 text-slate-300 font-medium py-2 rounded-lg text-xs"
            >
              Back to Sign In
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-500 mb-2">Default Quick Test Credentials:</p>
          <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400">
            <span>Owner: <code className="text-blue-400">owner</code></span>
            <span>Manager: <code className="text-blue-400">manager</code></span>
            <span>Salesman: <code className="text-blue-400">salesman1</code></span>
            <span>Delivery: <code className="text-blue-400">delivery1</code></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. OWNER MODULE (Premium Dark ERP Dashboard & Full Operations)
// ============================================================================
function OwnerModule({ store, setStore, onLogout, logActivity }) {
  const [activeTab, setActiveTab] = useState('DASHBOARD');
  const [dateFilter, setDateFilter] = useState('THIS_MONTH');

  // Calculations for Owner Financial Ledger
  const metrics = useMemo(() => {
    let sales = 0, profit = 0, udhar = 0, cash = 0, upi = 0, returnsVal = 0;
    store.invoices.forEach(inv => {
      sales += inv.finalAmount;
      udhar += inv.udhar;
      cash += inv.cash;
      upi += inv.upi;
      returnsVal += inv.returnedAmount;
      // Simple 15% estimated margin calculation on sales
      profit += (inv.finalAmount * 0.15);
    });

    const inventoryValue = store.inventory.reduce((acc, item) => acc + (item.currentStock * item.purchasePrice), 0);
    const lowStockCount = store.inventory.filter(i => i.currentStock <= i.minStock).length;

    return { sales, profit, udhar, cash, upi, returnsVal, inventoryValue, lowStockCount };
  }, [store]);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden">
      {/* OWNER SIDEBAR */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/30">
              RS
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white leading-none">RADHA SWAMI</h2>
              <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase">Owner Console</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <SidebarLink icon={BarChart2} label="Master Dashboard" active={activeTab === 'DASHBOARD'} onClick={() => setActiveTab('DASHBOARD')} />
            <SidebarLink icon={FileText} label="Sales Ledger" active={activeTab === 'SALES'} onClick={() => setActiveTab('SALES')} />
            <SidebarLink icon={Building} label="Factory Inward" active={activeTab === 'PURCHASES'} onClick={() => setActiveTab('PURCHASES')} />
            <SidebarLink icon={Package} label="Inventory / Stock" active={activeTab === 'INVENTORY'} count={metrics.lowStockCount} onClick={() => setActiveTab('INVENTORY')} />
            <SidebarLink icon={Users} label="Customer Directory" active={activeTab === 'CUSTOMERS'} onClick={() => setActiveTab('CUSTOMERS')} />
            <SidebarLink icon={Truck} label="Suppliers" active={activeTab === 'SUPPLIERS'} onClick={() => setActiveTab('SUPPLIERS')} />
            <SidebarLink icon={RotateCcw} label="Returns Log" active={activeTab === 'RETURNS'} onClick={() => setActiveTab('RETURNS')} />
            <SidebarLink icon={TrendingUp} label="Profit & Loss" active={activeTab === 'PROFIT_LOSS'} onClick={() => setActiveTab('PROFIT_LOSS')} />
            <SidebarLink icon={Shield} label="Staff & Security" active={activeTab === 'SECURITY'} onClick={() => setActiveTab('SECURITY')} />
          </nav>
        </div>

        <div className="p-3 border-t border-slate-800">
          <div className="px-3 py-2 mb-2 bg-slate-800/50 rounded-lg flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-medium text-white truncate">{store.currentUser.name}</p>
              <p className="text-[10px] text-slate-400 uppercase">Role: {store.currentUser.role}</p>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Lock & Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-slate-950">
        <header className="px-8 py-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/50 sticky top-0 z-10 backdrop-blur-md">
          <h1 className="text-xl font-bold text-white tracking-tight">
            {activeTab.replace('_', ' ')}
          </h1>

          <div className="flex items-center gap-4">
            <select
              value={dateFilter}
              onChange={e => setDateFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-xs font-medium rounded-lg px-3 py-2 text-slate-200 focus:outline-none"
            >
              <option value="TODAY">Today</option>
              <option value="YESTERDAY">Yesterday</option>
              <option value="THIS_WEEK">This Week</option>
              <option value="THIS_MONTH">This Month</option>
            </select>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'DASHBOARD' && <OwnerDashboardView metrics={metrics} store={store} />}
          {activeTab === 'SALES' && <OwnerSalesView invoices={store.invoices} />}
          {activeTab === 'INVENTORY' && <InventoryView inventory={store.inventory} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'SECURITY' && <StaffSecurityView store={store} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'PROFIT_LOSS' && <ProfitLossView metrics={metrics} store={store} />}
          {activeTab === 'PURCHASES' && <PurchasesView store={store} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'CUSTOMERS' && <CustomersView customers={store.customers} setStore={setStore} />}
          {activeTab === 'SUPPLIERS' && <SuppliersView suppliers={store.suppliers} setStore={setStore} />}
          {activeTab === 'RETURNS' && <ReturnsView store={store} />}
        </div>
      </main>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, active, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
        active ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      {count > 0 && (
        <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-amber-500/30">
          {count}
        </span>
      )}
    </button>
  );
}

function OwnerDashboardView({ metrics, store }) {
  return (
    <div className="space-y-8">
      {/* TOP KPI METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <KpiCard title="Gross Sales" value={`₹${metrics.sales.toLocaleString()}`} icon={DollarSign} color="blue" subtitle="Total gross billed" />
        <KpiCard title="Net Operational Profit" value={`₹${metrics.profit.toLocaleString()}`} icon={TrendingUp} color="emerald" subtitle="Estimated net margin" />
        <KpiCard title="Outstanding Udhar" value={`₹${metrics.udhar.toLocaleString()}`} icon={AlertTriangle} color="amber" subtitle="Market receivables" />
        <KpiCard title="Inventory Value" value={`₹${metrics.inventoryValue.toLocaleString()}`} icon={Package} color="purple" subtitle="Stock at cost" />
      </div>

      {/* DETAILED STATS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span>Payment Collection Split</span>
            <DollarSign className="w-4 h-4 text-slate-400" />
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Cash Collection</span>
                <span className="text-white font-semibold">₹{metrics.cash.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full" style={{ width: `${metrics.sales ? (metrics.cash / metrics.sales) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">UPI / Online</span>
                <span className="text-white font-semibold">₹{metrics.upi.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full" style={{ width: `${metrics.sales ? (metrics.upi / metrics.sales) * 100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Market Credit (Udhar)</span>
                <span className="text-amber-400 font-semibold">₹{metrics.udhar.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full" style={{ width: `${metrics.sales ? (metrics.udhar / metrics.sales) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT INVOICES MONITOR */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-4">Recent Billed Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                  <th className="pb-3">Invoice</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs text-slate-300">
                {store.invoices.slice(0, 5).map(inv => (
                  <tr key={inv.id}>
                    <td className="py-3 font-mono text-blue-400">{inv.id}</td>
                    <td className="py-3 font-medium text-white">{inv.customerName}</td>
                    <td className="py-3 font-semibold">₹{inv.finalAmount.toLocaleString()}</td>
                    <td className="py-3">
                      {inv.udhar > 0 ? (
                        <span className="text-amber-400 font-medium">Udhar: ₹{inv.udhar}</span>
                      ) : (
                        <span className="text-emerald-400 font-medium">Paid Cash/UPI</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {inv.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, icon: Icon, color, subtitle }) {
  const colorMap = {
    blue: 'border-blue-500/20 text-blue-400 bg-blue-500/10',
    emerald: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10',
    amber: 'border-amber-500/20 text-amber-400 bg-amber-500/10',
    purple: 'border-purple-500/20 text-purple-400 bg-purple-500/10'
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-medium text-slate-400 uppercase">{title}</span>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-extrabold text-white tracking-tight">{value}</div>
      <p className="text-[11px] text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

// ============================================================================
// STAFF SECURITY & ACCOUNT MANAGEMENT (OWNER CONTROLLED)
// ============================================================================
function StaffSecurityView({ store, setStore, logActivity }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', username: '', role: 'SALESMAN', phone: '', password: '' });

  const toggleUserStatus = (userId) => {
    setStore(prev => {
      const updated = prev.users.map(u => {
        if (u.id === userId) {
          const newStatus = !u.active;
          logActivity('SECURITY_USER_TOGGLE', `User ${u.username} status set to ${newStatus ? 'ACTIVE' : 'DISABLED'}`);
          return { ...u, active: newStatus };
        }
        return u;
      });
      return { ...prev, users: updated };
    });
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const created = {
      id: `usr-${Date.now()}`,
      ...newUser,
      active: true
    };
    setStore(prev => ({ ...prev, users: [...prev.users, created] }));
    logActivity('SECURITY_USER_CREATE', `Created new staff account: ${created.username} (${created.role})`);
    setShowAddModal(false);
    setNewUser({ name: '', username: '', role: 'SALESMAN', phone: '', password: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-white">Staff Credentials & Instant Revocation</h2>
          <p className="text-xs text-slate-400">Manage employee access, reset credentials, or freeze terminated personnel instantly.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase bg-slate-900/80">
              <th className="p-4">Staff Name</th>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions / Controls</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {store.users.map(u => (
              <tr key={u.id} className="hover:bg-slate-800/30">
                <td className="p-4 font-semibold text-white">{u.name}</td>
                <td className="p-4 font-mono text-blue-400">{u.username}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                    {u.role}
                  </span>
                </td>
                <td className="p-4">{u.phone}</td>
                <td className="p-4">
                  {u.active ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="text-red-400 font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Frozen / Revoked
                    </span>
                  )}
                </td>
                <td className="p-4 text-right space-x-2">
                  {u.role !== 'OWNER' && (
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`px-3 py-1 rounded text-[11px] font-semibold transition ${
                        u.active
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                      }`}
                    >
                      {u.active ? 'Freeze Access' : 'Reactivate'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ADD USER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Create New Staff Account</h3>
            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={newUser.username}
                  onChange={e => setNewUser({ ...newUser, username: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Role</label>
                  <select
                    value={newUser.role}
                    onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="SALESMAN">SALESMAN</option>
                    <option value="DELIVERY">DELIVERY</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={newUser.phone}
                    onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Initial Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-full bg-slate-800 text-slate-300 text-xs font-semibold py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold py-2 rounded-lg"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Additional Views (Inventory, Sales, Profit & Loss, Customers, Suppliers, Purchases, Returns)
function InventoryView({ inventory, setStore, logActivity }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">Central Stock Inventory Ledger</h2>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase bg-slate-900/80">
              <th className="p-4">SKU / Item Name</th>
              <th className="p-4">HSN / GST</th>
              <th className="p-4">Purchase Price</th>
              <th className="p-4">Wholesale Rate</th>
              <th className="p-4">Stock Level</th>
              <th className="p-4">Location</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
            {inventory.map(item => (
              <tr key={item.id}>
                <td className="p-4">
                  <div className="font-semibold text-white">{item.name}</div>
                  <div className="text-[10px] text-slate-500 font-mono">{item.sku}</div>
                </td>
                <td className="p-4">{item.hsn} ({item.gst}%)</td>
                <td className="p-4 font-mono">₹{item.purchasePrice}</td>
                <td className="p-4 font-mono font-semibold text-blue-400">₹{item.wholesalePrice}</td>
                <td className="p-4">
                  <span className={`font-bold ${item.currentStock <= item.minStock ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {item.currentStock} pcs
                  </span>
                  <span className="text-slate-500 text-[10px] block">({item.boxCount} boxes)</span>
                </td>
                <td className="p-4 text-slate-400">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OwnerSalesView({ invoices }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
            <th className="p-4">Invoice ID</th>
            <th className="p-4">Date & Time</th>
            <th className="p-4">Customer</th>
            <th className="p-4">Salesman</th>
            <th className="p-4">Final Value</th>
            <th className="p-4">Payment Breakdown</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
          {invoices.map(inv => (
            <tr key={inv.id}>
              <td className="p-4 font-mono text-blue-400">{inv.id}</td>
              <td className="p-4">{inv.date} {inv.time}</td>
              <td className="p-4 font-medium text-white">{inv.customerName}</td>
              <td className="p-4">{inv.salesman}</td>
              <td className="p-4 font-bold text-white">₹{inv.finalAmount.toLocaleString()}</td>
              <td className="p-4 text-[11px] space-y-0.5">
                <div>Cash: ₹{inv.cash}</div>
                <div>UPI: ₹{inv.upi}</div>
                <div className="text-amber-400 font-semibold">Udhar: ₹{inv.udhar}</div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ProfitLossView({ metrics }) {
  return (
    <div className="max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
      <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-4">Profit & Loss Financial Analysis</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-slate-300">
          <span>Gross Invoice Sales</span>
          <span className="font-mono text-white">₹{metrics.sales.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Cost of Goods Sold (COGS Approx)</span>
          <span className="font-mono text-red-400">- ₹{(metrics.sales * 0.85).toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span>Damaged & Returned Deductions</span>
          <span className="font-mono text-red-400">- ₹{metrics.returnsVal.toLocaleString()}</span>
        </div>
        <div className="pt-3 border-t border-slate-800 flex justify-between font-bold text-lg text-emerald-400">
          <span>Net Operational Profit</span>
          <span className="font-mono">₹{metrics.profit.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

function PurchasesView({ store }) { return <div className="text-slate-400 text-sm">Factory Inward Purchases Ledger active ({store.purchases.length} invoices recorded).</div>; }
function CustomersView({ customers }) { return <div className="text-slate-400 text-sm">Customer Directory active ({customers.length} business accounts).</div>; }
function SuppliersView({ suppliers }) { return <div className="text-slate-400 text-sm">Suppliers List active ({suppliers.length} vendors).</div>; }
function ReturnsView({ store }) { return <div className="text-slate-400 text-sm">Returns Audit Ledger active.</div>; }

// ============================================================================
// 3. MANAGER TERMINAL (High-Contrast Light Theme)
// ============================================================================
function ManagerModule({ store, setStore, onLogout, logActivity }) {
  const [activeTab, setActiveTab] = useState('BILLING');

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans">
      {/* MANAGER LIGHT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-5 border-b border-slate-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
              RS
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 leading-none">RADHA SWAMI</h2>
              <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">Manager Terminal</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            <ManagerSidebarLink icon={ShoppingCart} label="Counter Billing" active={activeTab === 'BILLING'} onClick={() => setActiveTab('BILLING')} />
            <ManagerSidebarLink icon={RotateCcw} label="Log Return / Deduct" active={activeTab === 'RETURNS'} onClick={() => setActiveTab('RETURNS')} />
            <ManagerSidebarLink icon={DollarSign} label="Evening Handover" active={activeTab === 'HANDOVER'} onClick={() => setActiveTab('HANDOVER')} />
            <ManagerSidebarLink icon={Package} label="Stock Check" active={activeTab === 'STOCK'} onClick={() => setActiveTab('STOCK')} />
          </nav>
        </div>

        <div className="p-3 border-t border-slate-200">
          <div className="px-3 py-2 mb-2 bg-slate-100 rounded-lg">
            <p className="text-xs font-bold text-slate-800">{store.currentUser.name}</p>
            <p className="text-[10px] text-slate-500">Billing Counter #1</p>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Terminal</span>
          </button>
        </div>
      </aside>

      {/* MANAGER WORKSPACE */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="px-8 py-4 bg-white border-b border-slate-200 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-lg font-bold text-slate-800">{activeTab}</h1>
          <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
            System Online & Connected
          </span>
        </header>

        <div className="p-8">
          {activeTab === 'BILLING' && <ManagerBillingTerminal store={store} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'RETURNS' && <ManagerReturnsTerminal store={store} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'HANDOVER' && <ManagerHandoverBoard store={store} setStore={setStore} logActivity={logActivity} />}
          {activeTab === 'STOCK' && <ManagerStockView inventory={store.inventory} />}
        </div>
      </main>
    </div>
  );
}

function ManagerSidebarLink({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition ${
        active ? 'bg-blue-600 text-white shadow-md' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span>{label}</span>
    </button>
  );
}

// Manager Billing Counter
function ManagerBillingTerminal({ store, setStore, logActivity }) {
  const [selectedCust, setSelectedCust] = useState(store.customers[0]?.id || '');
  const [cart, setCart] = useState([]);
  const [paymentMode, setPaymentMode] = useState('CASH'); // CASH, UPI, UDHAR
  const [cashVal, setCashVal] = useState(0);
  const [upiVal, setUpiVal] = useState(0);

  const addItemToCart = (item) => {
    const existing = cart.find(c => c.itemId === item.id);
    if (existing) {
      setCart(cart.map(c => c.itemId === item.id ? { ...c, qty: c.qty + 10, boxes: c.boxes + 1 } : c));
    } else {
      setCart([...cart, { itemId: item.id, name: item.name, rate: item.wholesalePrice, qty: 10, boxes: 1, gstPct: item.gst }]);
    }
  };

  const totals = useMemo(() => {
    let gross = cart.reduce((acc, i) => acc + (i.qty * i.rate), 0);
    return { gross };
  }, [cart]);

  const generateInvoice = () => {
    if (cart.length === 0) return;
    const cust = store.customers.find(c => c.id === selectedCust);

    let finalCash = paymentMode === 'CASH' ? totals.gross : (paymentMode === 'SPLIT' ? cashVal : 0);
    let finalUpi = paymentMode === 'UPI' ? totals.gross : (paymentMode === 'SPLIT' ? upiVal : 0);
    let finalUdhar = paymentMode === 'UDHAR' ? totals.gross : Math.max(0, totals.gross - (finalCash + finalUpi));

    const newInvoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      date: new Date().toISOString().substring(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerId: cust.id,
      customerName: cust.name,
      salesman: 'Counter Direct',
      manager: store.currentUser.name,
      vehicle: 'Shop Counter',
      items: cart,
      grossAmount: totals.gross,
      returnedAmount: 0,
      finalAmount: totals.gross,
      cash: finalCash,
      upi: finalUpi,
      udhar: finalUdhar,
      status: 'DELIVERED',
      deliveryPerson: 'Direct Pickup'
    };

    setStore(prev => {
      // Deduct Stock
      const updatedStock = prev.inventory.map(inv => {
        const inCart = cart.find(c => c.itemId === inv.id);
        if (inCart) {
          return { ...inv, currentStock: Math.max(0, inv.currentStock - inCart.qty) };
        }
        return inv;
      });

      // Update Customer Udhar
      const updatedCust = prev.customers.map(c => {
        if (c.id === cust.id && finalUdhar > 0) {
          return { ...c, udhar: c.udhar + finalUdhar };
        }
        return c;
      });

      return {
        ...prev,
        inventory: updatedStock,
        customers: updatedCust,
        invoices: [newInvoice, ...prev.invoices]
      };
    });

    logActivity('BILL_GENERATED', `Generated invoice ${newInvoice.id} for ${cust.name} - Value: ₹${totals.gross}`);
    setCart([]);
    alert(`Invoice ${newInvoice.id} created successfully!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* ITEM CATALOG SELECTOR */}
      <div className="lg:col-span-2 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm">Select Wholesale Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {store.inventory.map(item => (
            <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-bold text-xs text-slate-800">{item.name}</h4>
                <p className="text-[10px] text-slate-500">Stock: {item.currentStock} pcs | Rate: ₹{item.wholesalePrice}</p>
              </div>
              <button
                onClick={() => addItemToCart(item)}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* BILLING CART & CHECKOUT */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="font-bold text-slate-800 text-sm border-b border-slate-100 pb-3">Active Order Register</h3>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select Customer</label>
          <select
            value={selectedCust}
            onChange={e => setSelectedCust(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
          >
            {store.customers.map(c => (
              <option key={c.id} value={c.id}>{c.name} (Udhar: ₹{c.udhar})</option>
            ))}
          </select>
        </div>

        <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
          {cart.map((item, idx) => (
            <div key={idx} className="py-2 flex justify-between text-xs">
              <div>
                <p className="font-bold text-slate-800">{item.name}</p>
                <p className="text-[10px] text-slate-500">{item.qty} pcs @ ₹{item.rate}</p>
              </div>
              <span className="font-mono font-bold text-slate-900">₹{item.qty * item.rate}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-200 space-y-2">
          <div className="flex justify-between font-bold text-base text-slate-900">
            <span>Bill Total:</span>
            <span>₹{totals.gross}</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Payment Method</label>
            <select
              value={paymentMode}
              onChange={e => setPaymentMode(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800"
            >
              <option value="CASH">Full Cash Collection</option>
              <option value="UPI">UPI / Online Transfer</option>
              <option value="UDHAR">Market Credit (Udhar)</option>
            </select>
          </div>

          <button
            onClick={generateInvoice}
            disabled={cart.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md transition disabled:opacity-50"
          >
            Complete Billing & Print Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 10. CRITICAL RETURN & DAMAGED GOODS DEDUCTION LOGIC
// ============================================================================
function ManagerReturnsTerminal({ store, setStore, logActivity }) {
  const [invoiceId, setInvoiceId] = useState('');
  const [returnVal, setReturnVal] = useState(0);
  const [reason, setReason] = useState('Box Damaged during Transit');

  const executeReturnDeduction = (e) => {
    e.preventDefault();
    const targetInv = store.invoices.find(i => i.id.toLowerCase() === invoiceId.toLowerCase());
    if (!targetInv) {
      alert('Invoice number not found.');
      return;
    }

    const deductedVal = parseFloat(returnVal);
    if (isNaN(deductedVal) || deductedVal <= 0 || deductedVal > targetInv.finalAmount) {
      alert('Invalid return deduction amount.');
      return;
    }

    setStore(prev => {
      const updatedInvoices = prev.invoices.map(inv => {
        if (inv.id === targetInv.id) {
          const newFinal = inv.finalAmount - deductedVal;
          // Recalculate Udhar / Cash proportionately
          let newUdhar = Math.max(0, inv.udhar - deductedVal);
          let newReturned = inv.returnedAmount + deductedVal;
          return {
            ...inv,
            returnedAmount: newReturned,
            finalAmount: newFinal,
            udhar: newUdhar
          };
        }
        return inv;
      });

      return { ...prev, invoices: updatedInvoices };
    });

    logActivity('RETURN_DEDUCTION_LOGGED', `Deducted ₹${deductedVal} from invoice ${targetInv.id}. Reason: ${reason}`);
    alert(`LOG RETURN DEDUCTED: Invoice ${targetInv.id} successfully reduced by ₹${deductedVal}. New Bill Total: ₹${targetInv.finalAmount - deductedVal}`);
    setInvoiceId('');
    setReturnVal(0);
  };

  return (
    <div className="max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div>
        <h2 className="text-base font-bold text-slate-900">Log Return Deduct Routine</h2>
        <p className="text-xs text-slate-500">Instantly recalculate final invoice totals and adjust receivables upon vehicle dispatch return.</p>
      </div>

      <form onSubmit={executeReturnDeduction} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Invoice Number</label>
          <input
            type="text"
            required
            placeholder="e.g. INV-2026-001"
            value={invoiceId}
            onChange={e => setInvoiceId(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Returned / Damaged Goods Value (₹)</label>
          <input
            type="number"
            required
            value={returnVal}
            onChange={e => setReturnVal(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Return</label>
          <select
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900"
          >
            <option value="Box Damaged during Transit">Box Damaged during Transit</option>
            <option value="Customer Rejected Items">Customer Rejected Items</option>
            <option value="Incorrect Item Dispatched">Incorrect Item Dispatched</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-md transition text-xs"
        >
          Execute Log Return Deduct & Recalculate Invoice
        </button>
      </form>
    </div>
  );
}

// Evening Handover Board
function ManagerHandoverBoard({ store, setStore, logActivity }) {
  const [board, setBoard] = useState(store.handoverBoard);

  const lockBoard = () => {
    setStore(prev => ({
      ...prev,
      handoverBoard: { ...board, locked: true, authorizedBy: store.currentUser.name }
    }));
    logActivity('HANDOVER_BOARD_LOCKED', `Manager ${store.currentUser.name} locked evening collection handover.`);
    alert('Evening Collection Handover locked successfully!');
  };

  return (
    <div className="max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-center border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">Evening Collection Handover Register</h2>
          <p className="text-xs text-slate-500">Date: {board.date}</p>
        </div>
        {board.locked && (
          <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 text-xs font-bold rounded-full flex items-center gap-1">
            <Lock className="w-3 h-3" /> Locked Read-Only
          </span>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Physical Cash Counted (₹)</label>
            <input
              type="number"
              disabled={board.locked}
              value={board.physicalCash}
              onChange={e => setBoard({ ...board, physicalCash: parseFloat(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Online UPI Received (₹)</label>
            <input
              type="number"
              disabled={board.locked}
              value={board.onlineUpi}
              onChange={e => setBoard({ ...board, onlineUpi: parseFloat(e.target.value) || 0 })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-bold"
            />
          </div>
        </div>

        {!board.locked && (
          <button
            onClick={lockBoard}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs"
          >
            Authorize & Lock Handover to Owner
          </button>
        )}
      </div>
    </div>
  );
}

function ManagerStockView({ inventory }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase bg-slate-50">
            <th className="p-4">Item</th>
            <th className="p-4">Wholesale Rate</th>
            <th className="p-4">Current Stock</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
          {inventory.map(item => (
            <tr key={item.id}>
              <td className="p-4 font-bold text-slate-900">{item.name}</td>
              <td className="p-4 font-mono font-bold text-blue-600">₹{item.wholesalePrice}</td>
              <td className="p-4 font-bold">{item.currentStock} pcs</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// 4. SALESMAN & DELIVERY MOBILE APPS (Touch-Optimized)
// ============================================================================
function SalesmanModule({ store, setStore, onLogout, logActivity }) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="font-bold text-sm text-blue-400">Salesman Mobile Terminal</h2>
          <button onClick={onLogout} className="text-xs text-red-400 font-bold">Sign Out</button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Assigned Market Routes</h3>
          {store.customers.map(c => (
            <div key={c.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-sm text-white">{c.name}</h4>
                  <p className="text-xs text-slate-400">{c.address}</p>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-bold">{c.priceCat}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/50 text-xs">
                <span className="text-amber-400 font-semibold">Udhar: ₹{c.udhar}</span>
                <button className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg font-bold text-[11px]">
                  + Take Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-[10px] text-slate-500 pt-4">Radha Swami ERP — Salesman Touch Mobile v2.4</div>
    </div>
  );
}

function DeliveryModule({ store, onLogout }) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-900 text-white flex flex-col justify-between p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h2 className="font-bold text-sm text-emerald-400">Delivery Dispatch Terminal</h2>
          <button onClick={onLogout} className="text-xs text-red-400 font-bold">Sign Out</button>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase text-slate-400">Today's Delivery Runs</h3>
          {store.invoices.map(inv => (
            <div key={inv.id} className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-blue-400">{inv.id}</span>
                  <h4 className="font-bold text-sm text-white">{inv.customerName}</h4>
                </div>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">
                  {inv.status}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-1 bg-slate-900/50 p-2 rounded-lg">
                <div className="flex justify-between"><span>Cash to Collect:</span><span className="font-bold text-emerald-400">₹{inv.cash}</span></div>
                <div className="flex justify-between"><span>Udhar Ledger:</span><span className="font-bold text-amber-400">₹{inv.udhar}</span></div>
              </div>

              <button className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs">
                Mark Delivered / Record Cash
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="text-center text-[10px] text-slate-500 pt-4">Radha Swami ERP — Dispatch Mobile Touch v2.4</div>
    </div>
  );
}
