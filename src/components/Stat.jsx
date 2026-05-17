export default function Stat({ icon, label, val, color }) {
  return (
    <div style={{ background:"rgba(212,175,55,.06)", border:"1px solid rgba(212,175,55,.15)", borderRadius:8, padding:"13px 16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7 }}>
        <span style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:"#8a7a60", letterSpacing:1 }}>{icon} {label}</span>
        <span style={{ color:"#D4AF37", fontWeight:700, fontSize:14 }}>{val}%</span>
      </div>
      <div style={{ background:"rgba(255,255,255,.07)", borderRadius:4, height:5, overflow:"hidden" }}>
        <div style={{ width:`${val}%`, height:"100%", background:color||"#D4AF37", borderRadius:4, transition:"width 1s ease" }} />
      </div>
    </div>
  );
}