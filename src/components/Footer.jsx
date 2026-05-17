const CATS = ["Tous","Pierres & Cristaux","Bougies & Chandeliers","Divination","Bijoux","Encens & Résines"];

export default function Footer({ onNav, onQOpen, setCat }) {
  return (
    <footer style={{ background:"#050310", borderTop:"1px solid rgba(212,175,55,.12)", padding:"48px 24px 24px" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:36, marginBottom:36 }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, cursor:"pointer" }} onClick={()=>onNav("home")}>
              <span style={{ fontSize:18 }}>✦</span>
              <span style={{ fontFamily:"'Cinzel',serif", fontSize:17, fontWeight:700, color:"#D4AF37" }}>HOROSCOPE</span>
            </div>
            <p style={{ color:"#5a5040", fontSize:14, lineHeight:1.8 }}>Votre guide spirituel et ésotérique depuis 2010. Voyants certifiés, cristaux authentiques.</p>
          </div>
          <div>
            <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2, color:"#D4AF37", marginBottom:14 }}>NAVIGATION</h4>
            {[["home","Accueil"],["horoscope","Horoscopes"],["tarot","Tarot"],["boutique","Boutique"],["contact","Contact"]].map(([pg,l])=>(
              <p key={pg} style={{ color:"#5a5040", fontSize:14, marginBottom:8, cursor:"pointer" }} onClick={()=>onNav(pg)}>{l}</p>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2, color:"#D4AF37", marginBottom:14 }}>CATÉGORIES</h4>
            {CATS.slice(1).map(c=>(
              <p key={c} style={{ color:"#5a5040", fontSize:14, marginBottom:8, cursor:"pointer" }} onClick={()=>{onNav("boutique");setCat(c)}}>{c}</p>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2, color:"#D4AF37", marginBottom:14 }}>SERVICES</h4>
            <p style={{ color:"#5a5040", fontSize:14, marginBottom:8, cursor:"pointer" }} onClick={()=>onQOpen()}>Question Gratuite</p>
            <p style={{ color:"#5a5040", fontSize:14, marginBottom:8, cursor:"pointer" }} onClick={()=>onNav("tarot")}>Tirage Tarot</p>
            <p style={{ color:"#5a5040", fontSize:14, marginBottom:8, cursor:"pointer" }} onClick={()=>onNav("contact")}>Nous Contacter</p>
          </div>
        </div>
        <div style={{ borderTop:"1px solid rgba(212,175,55,.07)", paddingTop:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:10 }}>
          <p style={{ color:"#3a3030", fontSize:12 }}>&copy; 2026 Horoscope.fr &mdash; Tous droits réservés ✦ Paiement sécurisé 🔒</p>
          <div style={{ display:"flex", gap:16 }}>
            {["Facebook","Instagram","TikTok"].map(s=><span key={s} style={{ color:"#3a3030", fontSize:12, cursor:"pointer" }}>{s}</span>)}
          </div>
        </div>
      </div>
    </footer>
  );
}