export default function ProductCard({ p, onAdd, onWish, wished }) {
  return (
    <div className="pc">
      <div style={{ height:170, background:p.gradient, display:"flex", alignItems:"center", justifyContent:"center", fontSize:56, position:"relative" }}>
        {p.icon}
        {p.badge && (
          <span className="bdg" style={{ position:"absolute", top:12, right:12,
            background:p.badge==="Nouveau"?"#0d9488":p.badge==="Promo"?"#dc2626":"#D4AF37",
            color:p.badge==="Nouveau"||p.badge==="Promo"?"white":"#0a0612" }}>
            {p.badge}
          </span>
        )}
        <button onClick={()=>onWish(p.id)} style={{ position:"absolute", top:10, left:12, background:"none", border:"none", fontSize:22, cursor:"pointer", color:wished?"#E74C3C":"rgba(255,255,255,.35)", transition:"all .3s" }}>&hearts;</button>
      </div>
      <div style={{ padding:22 }}>
        <p style={{ color:"#D4AF37", fontSize:10, fontFamily:"'Cinzel',serif", letterSpacing:1, marginBottom:6 }}>{p.category}</p>
        <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:16, marginBottom:6 }}>{p.name}</h3>
        <p style={{ color:"#8a7a60", fontSize:14, lineHeight:1.6, marginBottom:12 }}>{p.description}</p>
        <div style={{ color:"#D4AF37", fontSize:12, marginBottom:14 }}>&#9733;&#9733;&#9733;&#9733;&#9733;</div>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <span style={{ fontSize:21, fontWeight:700, color:"#D4AF37", fontFamily:"'Cinzel',serif" }}>{Number(p.price).toFixed(2)}€</span>
          <button className="bg" style={{ fontSize:11, padding:"8px 16px" }} onClick={()=>onAdd(p)}>+ Panier</button>
        </div>
      </div>
    </div>
  );
}