import ProductCard from "./ProductCard";

const CATS = ["Tous","Pierres & Cristaux","Bougies & Chandeliers","Divination","Bijoux","Encens & Résines"];
const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function ShopPage({ products, cat, setCat, filtered, wishlist, addToCart, toggleWish }) {
  return (
    <div style={{ maxWidth:1200, margin:"0 auto", padding:"60px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:40 }}>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:40, fontWeight:700, color:"#D4AF37", marginBottom:8 }}>Boutique Ésotérique</h1>
        <Div />
        <p style={{ color:"#8a7a60", fontSize:17 }}>Cristaux, bougies, divination &mdash; tout pour votre chemin spirituel</p>
      </div>
      <div style={{ display:"flex", gap:10, flexWrap:"wrap", justifyContent:"center", marginBottom:40 }}>
        {CATS.map(c=><button key={c} className={`cb ${cat===c?"act":""}`} onClick={()=>setCat(c)}>{c}</button>)}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:24 }}>
        {filtered.map(p=><ProductCard key={p.id} p={p} onAdd={addToCart} onWish={toggleWish} wished={wishlist.includes(p.id)} />)}
      </div>
      {wishlist.length>0 && (
        <div style={{ marginTop:56, background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.18)", borderRadius:12, padding:32 }}>
          <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:18, color:"#D4AF37", marginBottom:20 }}>♥ Ma Liste de Souhaits ({wishlist.length})</h3>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {products.filter(p=>wishlist.includes(p.id)).map(p=>(
              <div key={p.id} style={{ background:"rgba(255,255,255,.03)", border:"1px solid rgba(212,175,55,.2)", borderRadius:8, padding:"12px 18px", display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:24 }}>{p.icon}</span>
                <div>
                  <p style={{ fontFamily:"'Cinzel',serif", fontSize:13, marginBottom:2 }}>{p.name}</p>
                  <p style={{ color:"#D4AF37", fontSize:14, fontWeight:700 }}>{Number(p.price).toFixed(2)}€</p>
                </div>
                <button className="bg" style={{ fontSize:10, padding:"6px 12px" }} onClick={()=>addToCart(p)}>+ Panier</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}