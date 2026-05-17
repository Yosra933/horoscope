import { useState, useEffect } from "react";

const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function Dashboard({ user, onNav, toast }) {
  const [tab, setTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetch('http://localhost:5000/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json()),
      fetch('http://localhost:5000/api/admin/orders', { headers: { 'Authorization': `Bearer ${token}` } }).then(r => r.json())
    ]).then(([usersData, ordersData]) => {
      if (usersData.error) { toast(`⚠ ${usersData.error}`); return; }
      setUsers(usersData);
      setOrders(ordersData);
    }).catch(e => {
      toast("⚠ Erreur chargement dashboard");
      console.error(e);
    }).finally(() => setLoading(false));
  }, []);

  if (user?.role !== 'admin') {
    return (
      <div style={{ maxWidth:600, margin:"60px auto", textAlign:"center", padding:40 }}>
        <div style={{ fontSize:60, marginBottom:20 }}>🔒</div>
        <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:26, color:"#D4AF37", marginBottom:12 }}>Accès Restreint</h2>
        <p style={{ color:"#8a7a60", fontSize:16, marginBottom:24 }}>Cette page est réservée aux administrateurs.</p>
        <button className="bg" onClick={()=>onNav("home")}>Retour à l'accueil</button>
      </div>
    );
  }

  const orderStatusColor = (status) => {
    const map = { confirmed:"#27AE60", pending:"#F39C12", shipped:"#3498DB", cancelled:"#E74C3C" };
    return map[status] || "#8a7a60";
  };

  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:36, color:"#D4AF37", marginBottom:8 }}>✦ Tableau de Bord</h1>
        <p style={{ color:"#D4AF37", fontSize:14 }}>Administrateur: {user?.name}</p>
        <Div />
      </div>

      <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:32 }}>
        {[["users","👥 Utilisateurs"],["orders","📦 Commandes"]].map(([t,l]) => (
          <button key={t} className={`cb ${tab===t?"act":""}`} onClick={()=>setTab(t)}>{l}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign:"center", padding:60, color:"#8a7a60" }}>⟳ Chargement...</div>
      ) : (
        <>
          {tab === "users" && (
            <div style={{ display:"flex", flexDirection:"column", gap:32 }}>
              <div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:"#D4AF37", letterSpacing:1, marginBottom:12 }}>👑 Administrateurs</h3>
                <div style={{ background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.25)", borderRadius:10, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr 160px", gap:8, padding:"14px 20px", background:"rgba(212,175,55,.08)", fontFamily:"'Cinzel',serif", fontSize:11, color:"#D4AF37", letterSpacing:1 }}>
                    <span>#</span><span>EMAIL</span><span>NOM</span><span>INSCRIT LE</span>
                  </div>
                  {users.filter(u=>u.role==='admin').map((u,i) => (
                    <div key={u.id} style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr 160px", gap:8, padding:"12px 20px", borderTop:"1px solid rgba(212,175,55,.06)", fontSize:13, color:"#e8d5b7", alignItems:"center" }}>
                      <span style={{ color:"#6a6050" }}>{i+1}</span>
                      <span>{u.email}</span>
                      <span style={{ color:"#D4AF37" }}>{u.name}</span>
                      <span style={{ color:"#6a6050", fontSize:12 }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:"#8a7a60", letterSpacing:1, marginBottom:12 }}>👤 Utilisateurs</h3>
                <div style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(212,175,55,.12)", borderRadius:10, overflow:"hidden" }}>
                  <div style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr 160px", gap:8, padding:"14px 20px", background:"rgba(212,175,55,.05)", fontFamily:"'Cinzel',serif", fontSize:11, color:"#D4AF37", letterSpacing:1 }}>
                    <span>#</span><span>EMAIL</span><span>NOM</span><span>INSCRIT LE</span>
                  </div>
                  {users.filter(u=>u.role!=='admin').map((u,i) => (
                    <div key={u.id} style={{ display:"grid", gridTemplateColumns:"40px 1fr 1fr 160px", gap:8, padding:"12px 20px", borderTop:"1px solid rgba(212,175,55,.06)", fontSize:13, color:"#e8d5b7", alignItems:"center" }}>
                      <span style={{ color:"#6a6050" }}>{i+1}</span>
                      <span>{u.email}</span>
                      <span>{u.name}</span>
                      <span style={{ color:"#6a6050", fontSize:12 }}>{new Date(u.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              {orders.length === 0 ? (
                <div style={{ textAlign:"center", padding:60, color:"#8a7a60" }}>Aucune commande pour le moment</div>
              ) : orders.map(order => (
                <div key={order.id} style={{ background:"rgba(255,255,255,.02)", border:"1px solid rgba(212,175,55,.15)", borderRadius:10, padding:20 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
                    <div>
                      <span style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:"#D4AF37" }}>Commande #{order.id}</span>
                      <span style={{ color:"#6a6050", fontSize:12, marginLeft:12 }}>{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <span style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:1, padding:"4px 12px", borderRadius:12, background:orderStatusColor(order.status)+"22", color:orderStatusColor(order.status), border:`1px solid ${orderStatusColor(order.status)}44` }}>{order.status}</span>
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, marginBottom:14, fontSize:13, color:"#8a7a60" }}>
                    <span><strong style={{ color:"#e8d5b7" }}>Client:</strong> {order.customer_name}</span>
                    <span><strong style={{ color:"#e8d5b7" }}>Email:</strong> {order.email}</span>
                    <span><strong style={{ color:"#e8d5b7" }}>Total:</strong> <span style={{ color:"#D4AF37" }}>{Number(order.total_price).toFixed(2)}€</span></span>
                  </div>
                  <div style={{ fontSize:12, color:"#6a6050", marginBottom:12 }}>📍 {order.address}</div>
                  <div style={{ borderTop:"1px solid rgba(212,175,55,.08)", paddingTop:10 }}>
                    <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:1, color:"#D4AF37", marginBottom:8 }}>ARTICLES</p>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      {order.items.map(item => (
                        <div key={item.id} style={{ background:"rgba(212,175,55,.05)", borderRadius:6, padding:"6px 12px", display:"flex", alignItems:"center", gap:6, fontSize:12 }}>
                          <span>{item.icon || '📦'}</span>
                          <span style={{ color:"#e8d5b7" }}>{item.product_name || `Produit #${item.product_id}`}</span>
                          <span style={{ color:"#8a7a60" }}>x{item.quantity}</span>
                          <span style={{ color:"#D4AF37" }}>{Number(item.price).toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}