export default function Header({ page, onNav, user, setUser, cartCount, onCartOpen, onQOpen, setAuthOpen }) {
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, background:"rgba(10,6,18,.96)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(212,175,55,.18)" }}>
      <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 24px", display:"flex", alignItems:"center", justifyContent:"space-between", height:62 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8, cursor:"pointer" }} onClick={()=>onNav("home")}>
          <span style={{ fontSize:22 }}>✦</span>
          <span style={{ fontFamily:"'Cinzel',serif", fontSize:19, fontWeight:700, color:"#D4AF37", letterSpacing:3 }}>HOROSCOPE</span>
        </div>
        <div style={{ display:"flex", gap:2 }}>
          {[["home","Accueil"],["horoscope","Horoscopes"],["tarot","Tarot"],["boutique","Boutique"],["contact","Contact"], ...(user?.role==='admin'?[["dashboard","Dashboard"]]:[])].map(([pg,label])=>(
            <span key={pg} className={`nl ${page===pg?"act":""}`} onClick={()=>onNav(pg)}>{label}</span>
          ))}
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="bo" style={{ fontSize:10, padding:"7px 14px" }} onClick={()=>onQOpen()}>✦ Question Gratuite</button>
          <button className="bo" style={{ fontSize:10, padding:"7px 14px" }} onClick={()=>setAuthOpen(true)}>
            {user ? `👤 ${user.name} ✦` : '✦ Connexion'}
          </button>
          {user && (
            <button className="bo" style={{ fontSize:10, padding:"7px 14px" }} onClick={() => {
              localStorage.removeItem('authToken');
              localStorage.removeItem('user');
              setUser(null);
            }}>
              ✦ Déconnexion
            </button>
          )}
          <div style={{ position:"relative", cursor:"pointer" }} onClick={()=>onCartOpen()}>
            <span style={{ fontSize:22 }}>🛒</span>
            {cartCount>0&&<span style={{ position:"absolute", top:-8, right:-8, background:"#D4AF37", color:"#0a0612", borderRadius:"50%", width:18, height:18, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", fontWeight:700 }}>{cartCount}</span>}
          </div>
        </div>
      </div>
    </nav>
  );
}