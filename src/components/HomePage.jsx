import Stat from "./Stat";
import ProductCard from "./ProductCard";

const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function HomePage({ zodiac, products, tarot, selSign, setSelSign, onNav, onQOpen, addToCart, toggleWish, wishlist }) {
  return (
    <>
      <div style={{ position:"relative", minHeight:"90vh", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", background:"radial-gradient(ellipse at 50% 30%,rgba(120,60,200,.25) 0%,transparent 60%),radial-gradient(ellipse at 80% 80%,rgba(180,100,50,.15) 0%,transparent 50%),#0a0612" }}>
        <div style={{ position:"absolute", inset:0, overflow:"hidden" }}>
          {[...Array(70)].map((_,i)=>(
            <div key={i} className="star-bg" style={{ width:Math.random()*2+1, height:Math.random()*2+1, left:`${Math.random()*100}%`, top:`${Math.random()*100}%`, animationDelay:`${Math.random()*4}s`, animationDuration:`${2+Math.random()*3}s` }} />
          ))}
        </div>
        <div style={{ textAlign:"center", zIndex:1, padding:"0 24px" }}>
          <div className="flt" style={{ fontSize:66, marginBottom:16 }}>🔮</div>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:5, color:"#D4AF37", marginBottom:16, textTransform:"uppercase" }}>Bienvenue dans l'univers mystique</p>
          <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(36px,6vw,74px)", fontWeight:700, lineHeight:1.15, marginBottom:12, background:"linear-gradient(135deg,#e8d5b7,#D4AF37,#e8d5b7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Question Gratuite !
          </h1>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:"clamp(14px,2.5vw,20px)", color:"#b09060", marginBottom:12, fontStyle:"italic" }}>Un Voyant Vous R&eacute;pond Gratuitement</p>
          <Div />
          <p style={{ fontFamily:"'Crimson Text',serif", fontSize:18, color:"#b0a080", maxWidth:480, margin:"0 auto 36px", lineHeight:1.8 }}>
            Horoscopes personnalis&eacute;s, tirage de tarot, cristaux et conseils spirituels pour illuminer votre chemin.
          </p>
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap" }}>
            <button className="bg glw" onClick={()=>onQOpen()}>✦ Poser Ma Question</button>
            <button className="bo" onClick={()=>onNav("boutique")}>D&eacute;couvrir la Boutique</button>
          </div>
        </div>
      </div>

      <div style={{ background:"linear-gradient(180deg,#0a0612,#0f0820)", padding:"80px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:4, color:"#D4AF37", marginBottom:10, textTransform:"uppercase" }}>✦ Aujourd'hui ✦</p>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:34, fontWeight:700, marginBottom:6 }}>Horoscope Du Jour</h2>
            <p style={{ color:"#8a7a60", fontSize:15 }}>16 Mai 2026 &mdash; Cliquez sur votre signe</p>
            <Div />
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:14, justifyContent:"center", marginBottom:40 }}>
            {zodiac.map(z=>(
              <div key={z.name} style={{ textAlign:"center", cursor:"pointer" }} onClick={()=>setSelSign(selSign?.name===z.name?null:z)}>
                <div className={`zc ${selSign?.name===z.name?"sel":""}`} style={{ margin:"0 auto 8px" }}>{z.symbol}</div>
                <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:1, color:selSign?.name===z.name?"#D4AF37":"#6a6050" }}>{z.name}</p>
              </div>
            ))}
          </div>
          {selSign && (
            <div style={{ maxWidth:660, margin:"0 auto", background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.3)", borderRadius:14, padding:36 }}>
              <div style={{ display:"flex", alignItems:"center", gap:20, marginBottom:22, flexWrap:"wrap" }}>
                <div style={{ width:72, height:72, borderRadius:"50%", background:selSign.color+"33", border:`2px solid ${selSign.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, flexShrink:0 }}>{selSign.symbol}</div>
                <div>
                  <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:24, color:"#D4AF37" }}>{selSign.name}</h3>
                  <p style={{ color:"#8a7a60", fontSize:13 }}>{selSign.date_range}</p>
                </div>
              </div>
              <p style={{ fontFamily:"'Crimson Text',serif", fontSize:17, lineHeight:1.9, color:"#d0c0a0", marginBottom:22 }}>{selSign.message}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
                <Stat icon="♥" label="Amour"     val={selSign.love}      color="#E74C3C" />
                <Stat icon="★" label="Carrière"  val={selSign.work}      color="#F39C12" />
                <Stat icon="☽" label="Intuition" val={selSign.intuition} color="#9B59B6" />
                <Stat icon="✦" label="Chance"    val={selSign.luck}      color="#D4AF37" />
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="bg" style={{ flex:1 }} onClick={()=>onNav("horoscope")}>Horoscope Complet →</button>
                <button className="bo" onClick={()=>onNav("tarot")}>Tirer le Tarot</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ background:"#0a0612", padding:"80px 24px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:44 }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:4, color:"#D4AF37", marginBottom:10, textTransform:"uppercase" }}>✦ Sélection ✦</p>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:34, fontWeight:700 }}>Boutique Ésotérique</h2>
            <Div />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
            {products.slice(0,3).map(p=><ProductCard key={p.id} p={p} onAdd={addToCart} onWish={toggleWish} wished={wishlist.includes(p.id)} />)}
          </div>
          <div style={{ textAlign:"center", marginTop:36 }}>
            <button className="bo" onClick={()=>onNav("boutique")}>Voir Tous les Produits →</button>
          </div>
        </div>
      </div>

      <div style={{ background:"linear-gradient(180deg,#0a0612,#0d0820,#0a0612)", padding:"80px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", textAlign:"center" }}>
          <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:4, color:"#D4AF37", marginBottom:10, textTransform:"uppercase" }}>✦ Tarot De Marseille ✦</p>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:34, fontWeight:700, marginBottom:8 }}>Votre Guide Spirituel</h2>
          <p style={{ color:"#8a7a60", fontSize:17, marginBottom:40 }}>Tirez une carte et découvrez le message de l'univers</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:32 }}>
            {tarot.slice(0,4).map(c=>(
              <div key={c.name} className="tc" style={{ aspectRatio:"2/3" }} onClick={()=>onNav("tarot")}>
                <div style={{ fontSize:38, marginBottom:10 }}>{c.emoji}</div>
                <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:13, color:"#D4AF37", marginBottom:4 }}>{c.name}</h4>
                <span style={{ fontSize:11, color:"#8a7a60", fontFamily:"'Cinzel',serif", letterSpacing:1 }}>{c.tag}</span>
              </div>
            ))}
          </div>
          <button className="bg" onClick={()=>onNav("tarot")}>Faire Mon Tirage Gratuit</button>
        </div>
      </div>
    </>
  );
}