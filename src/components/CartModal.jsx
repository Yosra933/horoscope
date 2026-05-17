export default function CartModal({ cartOpen, setCartOpen, cart, checkStep, setCheckStep, cartTotal, orderInfo, setOrderInfo, changeQty, removeFromCart, addToCart, placeOrder, onNav, toast, user, setAuthOpen }) {
  const handleClose = () => { setCartOpen(false); setCheckStep(0); };

  return cartOpen ? (
    <div className="ov" onClick={handleClose}>
      <div className="mb" onClick={e=>e.stopPropagation()} style={{ maxWidth:500 }}>
        <button onClick={handleClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", color:"#D4AF37", fontSize:22, cursor:"pointer" }}>✕</button>
        
        {checkStep===0 && <>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:"#D4AF37", marginBottom:24 }}>🛒 Mon Panier</h2>
          {cart.length===0 ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <p style={{ color:"#8a7a60", marginBottom:20, fontFamily:"'Crimson Text',serif", fontSize:16 }}>Votre panier est vide</p>
              <button className="bg" onClick={()=>{handleClose();onNav("boutique")}}>Découvrir la Boutique</button>
            </div>
          ) : <>
            {cart.map(item=>(
              <div key={item.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid rgba(212,175,55,.1)" }}>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <span style={{ fontSize:28 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontFamily:"'Cinzel',serif", fontSize:13 }}>{item.name}</p>
                    <p style={{ color:"#D4AF37", fontSize:13, fontWeight:700 }}>{(item.price*item.qty).toFixed(2)}€</p>
                  </div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <button onClick={()=>changeQty(item.id,-1)} style={{ background:"rgba(212,175,55,.15)", border:"none", color:"#D4AF37", width:28, height:28, borderRadius:4, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                  <span style={{ minWidth:22, textAlign:"center", fontFamily:"'Cinzel',serif" }}>{item.qty}</span>
                  <button onClick={()=>changeQty(item.id,+1)} style={{ background:"rgba(212,175,55,.15)", border:"none", color:"#D4AF37", width:28, height:28, borderRadius:4, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                  <button onClick={()=>removeFromCart(item.id)} style={{ background:"none", border:"none", color:"#6a6050", cursor:"pointer", fontSize:18, marginLeft:4 }}>✕</button>
                </div>
              </div>
            ))}
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid rgba(212,175,55,.18)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:20 }}>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:"#8a7a60" }}>Total</span>
                <span style={{ fontFamily:"'Cinzel',serif", fontSize:20, color:"#D4AF37", fontWeight:700 }}>{cartTotal.toFixed(2)}€</span>
              </div>
              <button className="bg" style={{ width:"100%" }} onClick={()=>setCheckStep(1)}>✦ Passer la Commande →</button>
            </div>
          </>}
        </>}

        {checkStep===1 && <>
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:24 }}>
            <button onClick={()=>setCheckStep(0)} style={{ background:"none", border:"none", color:"#D4AF37", cursor:"pointer", fontSize:20 }}>←</button>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:20, color:"#D4AF37" }}>📦 Adresse de Livraison</h2>
          </div>
          {!user ? (
            <div style={{ textAlign:"center", padding:"30px 0" }}>
              <p style={{ color:"#8a7a60", marginBottom:20, fontSize:16 }}>🔒 Connectez-vous pour finaliser votre commande</p>
              <button className="bg" onClick={() => { setCartOpen(false); setAuthOpen(true); }}>✦ Se connecter / S'inscrire</button>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
              <div>
                <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:6 }}>NOM COMPLET</label>
                <input type="text" placeholder="Prénom Nom" value={orderInfo.name || user.name} onChange={e=>setOrderInfo(o=>({...o,name:e.target.value}))} />
              </div>
              <div>
                <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:6 }}>EMAIL</label>
                <input type="email" value={user.email} disabled style={{ opacity:0.6 }} />
                <p style={{ color:"#5a5040", fontSize:11, marginTop:4 }}>Email utilisée pour la confirmation</p>
              </div>
              <div>
                <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:6 }}>ADRESSE COMPLÈTE</label>
                <textarea rows={3} placeholder="Rue, Code postal, Ville, Pays" value={orderInfo.addr} onChange={e=>setOrderInfo(o=>({...o,addr:e.target.value}))} />
              </div>
              <button className="bg" style={{ width:"100%", marginTop:6 }} onClick={placeOrder}>✦ Confirmer la Commande</button>
            </div>
          )}
        </>}

        {checkStep===3 && (
          <div style={{ textAlign:"center", padding:"20px 0" }}>
            <div className="flt" style={{ fontSize:62, marginBottom:16 }}>✦</div>
            <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:26, color:"#D4AF37", marginBottom:12 }}>Commande Confirmée !</h2>
            <p style={{ color:"#8a7a60", fontFamily:"'Crimson Text',serif", fontSize:17, marginBottom:28, lineHeight:1.8 }}>
              Merci pour votre commande.<br />Vous recevrez un email de confirmation.<br />Les astres veillent sur votre colis !
            </p>
            <button className="bg" onClick={()=>{setCartOpen(false);setCheckStep(0);onNav("boutique")}}>Retour à la Boutique</button>
          </div>
        )}
      </div>
    </div>
  ) : null;
}