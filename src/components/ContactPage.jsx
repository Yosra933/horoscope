const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function ContactPage({ contactForm, setContactForm, contactSent, setContactSent, sendContact }) {
  return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"60px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:44 }}>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:40, fontWeight:700, color:"#D4AF37", marginBottom:8 }}>Contactez-Nous</h1>
        <Div />
        <p style={{ color:"#8a7a60", fontSize:17 }}>Notre &eacute;quipe de voyants est &agrave; votre &eacute;coute</p>
      </div>
      {contactSent ? (
        <div style={{ textAlign:"center", padding:"60px 40px", background:"rgba(212,175,55,.05)", border:"1px solid rgba(212,175,55,.3)", borderRadius:14 }}>
          <div className="flt" style={{ fontSize:60, marginBottom:20 }}>✦</div>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:26, color:"#D4AF37", marginBottom:12 }}>Message Envoy&eacute; !</h2>
          <p style={{ fontFamily:"'Crimson Text',serif", fontSize:18, color:"#8a7a60", marginBottom:28, lineHeight:1.8 }}>
            Nos voyants vous r&eacute;pondront sous 24 heures.<br />Les &eacute;toiles veillent sur vous&hellip;
          </p>
          <button className="bg" onClick={()=>{setContactSent(false);setContactForm({name:"",email:"",msg:""})}}>Envoyer un Autre Message</button>
        </div>
      ) : (
        <div style={{ background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.18)", borderRadius:12, padding:40 }}>
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:8 }}>NOM COMPLET</label>
              <input type="text" placeholder="Votre nom&hellip;" value={contactForm.name} onChange={e=>setContactForm(f=>({...f,name:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:8 }}>EMAIL</label>
              <input type="text" placeholder="votre@email.com" value={contactForm.email} onChange={e=>setContactForm(f=>({...f,email:e.target.value}))} />
            </div>
            <div>
              <label style={{ fontFamily:"'Cinzel',serif", fontSize:10, letterSpacing:2, color:"#D4AF37", display:"block", marginBottom:8 }}>MESSAGE</label>
              <textarea rows={5} placeholder="Votre question ou message&hellip;" value={contactForm.msg} onChange={e=>setContactForm(f=>({...f,msg:e.target.value}))} />
            </div>
            <button className="bg" style={{ alignSelf:"center", marginTop:8 }} onClick={sendContact}>✦ Envoyer Mon Message</button>
          </div>
        </div>
      )}
      <div style={{ marginTop:28, display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {[["📧","Email","contact@horoscope.fr"],["📱","Téléphone","+33 1 23 45 67 89"],["🕐","Disponible","7j/7 · 9h–21h"],["📍","Adresse","Paris, France"]].map(([ic,label,val])=>(
          <div key={label} style={{ background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.12)", borderRadius:8, padding:"18px 14px", textAlign:"center" }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{ic}</div>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:10, color:"#D4AF37", letterSpacing:1, marginBottom:4 }}>{label}</p>
            <p style={{ color:"#8a7a60", fontSize:13 }}>{val}</p>
          </div>
        ))}
      </div>
    </div>
  );
}