"use client";

import { useStore } from "@/store/useStore";
import { Users, Package, ShoppingCart, DollarSign, Activity, Tag, Save, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'offers'>('dashboard');
  
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    totalOrdersCount: 0,
    productsCount: 0,
    usersCount: 0,
    recentOrders: [] as any[]
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Offers State
  const [settings, setSettings] = useState({
    offerTitle: '',
    offerDescription: '',
    offerCode: '',
    offerEndDate: '',
    isActive: true
  });
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'admin') {
      router.push('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        const [statsRes, settingsRes] = await Promise.all([
           api.get('/dashboard/stats'),
           api.get('/settings')
        ]);
        
        setStats(statsRes.data);
        
        if (settingsRes.data) {
           const { offerTitle, offerDescription, offerCode, offerEndDate, isActive } = settingsRes.data;
           setSettings({
             offerTitle: offerTitle || '',
             offerDescription: offerDescription || '',
             offerCode: offerCode || '',
             offerEndDate: offerEndDate ? new Date(offerEndDate).toISOString().slice(0,16) : '',
             isActive: isActive !== undefined ? isActive : true
           });
        }
      } catch (err: any) {
        toast.error('Failed to load admin data');
      } finally {
        setLoadingStats(false);
        setLoadingSettings(false);
      }
    };

    fetchDashboardData();
  }, [user, router]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const payload = {
        ...settings,
        offerEndDate: new Date(settings.offerEndDate).toISOString()
      };
      await api.put('/settings', payload);
      toast.success('Promotional offer updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSavingSettings(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="container py-12 px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Control Center</h1>
          <p className="text-muted-foreground text-sm">Manage orders, view insights, and update live promotions.</p>
        </div>
        <div className="text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-full border border-primary/20 flex items-center shadow-inner">
          <div className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></div>
          Admin privileges
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border mb-8 overflow-x-auto scrollbar-hide">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'dashboard' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
        >
          <LayoutDashboard size={18} /> Dashboard & Orders
        </button>
        <button 
          onClick={() => setActiveTab('offers')}
          className={`flex items-center gap-2 px-6 py-3 border-b-2 font-bold transition-all whitespace-nowrap ${activeTab === 'offers' ? 'border-primary text-primary bg-primary/5' : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'}`}
        >
          <Tag size={18} /> Promotions & Offers
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            
            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Monthly Revenue</p>
                  <h3 className="text-3xl font-black text-primary">
                    {loadingStats ? '...' : `₹${stats.monthlyRevenue?.toLocaleString() || 0}`}
                  </h3>
                </div>
                <div className="h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-xs text-green-500 font-medium">This calendar month</div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Lifetime Revenue</p>
                  <h3 className="text-2xl font-bold">
                    {loadingStats ? '...' : `₹${stats.totalRevenue.toLocaleString()}`}
                  </h3>
                </div>
                <div className="h-10 w-10 bg-muted text-muted-foreground rounded-xl flex items-center justify-center">
                  <DollarSign size={20} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-medium">All-time aggregate</div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Total Orders</p>
                  <h3 className="text-3xl font-black">{loadingStats ? '...' : stats.totalOrdersCount}</h3>
                </div>
                <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={20} />
                </div>
              </div>
              <div className="text-xs text-muted-foreground font-medium">Lifetime count</div>
            </div>

            <div className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs text-muted-foreground font-bold tracking-widest uppercase mb-1">Registered Users</p>
                  <h3 className="text-3xl font-black">{loadingStats ? '...' : stats.usersCount}</h3>
                </div>
                <div className="h-10 w-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center">
                  <Users size={20} />
                </div>
              </div>
              <div className="text-xs text-green-500 font-medium">Verified accounts</div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[2rem] overflow-hidden shadow-lg">
            <div className="px-8 py-6 border-b border-border bg-muted/20 flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2 uppercase tracking-widest text-sm"><Activity size={18}/> Recent Transactions</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase tracking-widest bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-8 py-5 font-bold">Order ID</th>
                    <th className="px-8 py-5 font-bold">Customer</th>
                    <th className="px-8 py-5 font-bold">Date</th>
                    <th className="px-8 py-5 font-bold">Status</th>
                    <th className="px-8 py-5 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStats ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-muted-foreground">Loading specific orders...</td>
                    </tr>
                  ) : stats.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-10 text-center text-muted-foreground bg-muted/5 font-medium">No orders in system yet.</td>
                    </tr>
                  ) : (
                    stats.recentOrders.map((order: any) => (
                      <tr key={order._id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                        <td className="px-8 py-5 font-mono text-xs text-muted-foreground">{order._id.substring(0, 10)}...</td>
                        <td className="px-8 py-5 font-bold">{order.user?.name || 'Guest'}</td>
                        <td className="px-8 py-5 text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="px-8 py-5">
                          {order.isPaid ? (
                            <span className="bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">PAID</span>
                          ) : (
                            <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider">PENDING</span>
                          )}
                        </td>
                        <td className="px-8 py-5 text-right font-black font-mono">₹{order.totalPrice.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl bg-card border border-border p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full border-b border-l border-primary/20 flex items-start justify-end p-6 pointer-events-none">
            <Sparkles size={24} className="text-primary" />
          </div>

          <h2 className="text-xl font-bold mb-2">Live Promotion Settings</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-md">Customize the hero promo card displayed on the public landing page (e.g. Diwali Sale specifics and dynamic countdown).</p>
          
          {loadingSettings ? (
            <div className="h-64 flex items-center justify-center my-8 text-primary font-bold animate-pulse">Loading settings...</div>
          ) : (
            <form onSubmit={handleSaveSettings} className="space-y-6 relative z-10">
              <div className="flex items-center justify-between p-4 bg-muted/30 border border-border rounded-xl">
                 <div>
                   <label className="font-bold text-sm block">Promotion Status</label>
                   <span className="text-xs text-muted-foreground">Is the promo card visible?</span>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={settings.isActive}
                      onChange={(e) => setSettings({...settings, isActive: e.target.checked})}
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary shadow-inner"></div>
                 </label>
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold ml-1">Offer Title</label>
                <input
                  type="text"
                  value={settings.offerTitle}
                  onChange={(e) => setSettings({...settings, offerTitle: e.target.value})}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                  placeholder="e.g. Diwali Sale"
                  required
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-bold ml-1">Subtitle / Description</label>
                <textarea
                  value={settings.offerDescription}
                  onChange={(e) => setSettings({...settings, offerDescription: e.target.value})}
                  className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all min-h-[100px] resize-y font-medium text-sm"
                  placeholder="e.g. Up to 30% Off Industrial Machinery"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="grid gap-2">
                   <label className="text-sm font-bold ml-1">Promo Code</label>
                   <input
                     type="text"
                     value={settings.offerCode}
                     onChange={(e) => setSettings({...settings, offerCode: e.target.value})}
                     className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-mono uppercase font-bold"
                     placeholder="DIWALI20"
                     required
                   />
                 </div>
                 <div className="grid gap-2">
                   <label className="text-sm font-bold ml-1">Countdown End Date & Time</label>
                   <input
                     type="datetime-local"
                     value={settings.offerEndDate}
                     onChange={(e) => setSettings({...settings, offerEndDate: e.target.value})}
                     className="w-full bg-background border border-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all font-medium"
                     required
                   />
                 </div>
              </div>

              <div className="pt-4 border-t border-border mt-8">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="px-8 py-4 bg-primary text-primary-foreground font-black tracking-widest uppercase rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center w-full shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                >
                  {savingSettings ? 'Syncing...' : <><Save size={18} className="mr-2" /> Publish Live Updates</>}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// Keep a local import for Sparkles here if not globally available, otherwise lucide-react has it. 
import { Sparkles } from "lucide-react";
