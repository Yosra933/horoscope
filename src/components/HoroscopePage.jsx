import Stat from "./Stat";

const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function HoroscopePage({ zodiac, selSign, setSelSign, onNav, onQOpen }) {
  return (
    <div style={{ maxWidth:1100, margin:"0 auto", padding:"60px 24px" }}>
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:40, fontWeight:700, color:"#D4AF37", marginBottom:8 }}>Horoscopes</h1>
        <Div />
        <p style={{ color:"#8a7a60", fontSize:17 }}>Choisissez votre signe pour votre horoscope personnalisé</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(155px,1fr))", gap:14, marginBottom:48 }}>
        {zodiac.map(z=>(
          <div key={z.name} className="pc" style={{ padding:22, textAlign:"center", cursor:"pointer", background:selSign?.name===z.name?"rgba(212,175,55,.1)":"rgba(255,255,255,.03)", border:selSign?.name===z.name?"1px solid rgba(212,175,55,.5)":"1px solid rgba(212,175,55,.15)" }} onClick={()=>setSelSign(selSign?.name===z.name?null:z)}>
            <div style={{ width:52, height:52, borderRadius:"50%", background:z.color+"22", border:`2px solid ${z.color}55`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, margin:"0 auto 10px" }}>{z.symbol}</div>
            <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:14, color:selSign?.name===z.name?"#D4AF37":"#e8d5b7", marginBottom:4 }}>{z.name}</h3>
            <p style={{ color:"#6a6050", fontSize:11 }}>{z.date_range}</p>
          </div>
        ))}
      </div>
      {selSign && (
        <div style={{ background:"rgba(212,175,55,.04)", border:"1px solid rgba(212,175,55,.3)", borderRadius:14, padding:48 }}>
          <div style={{ display:"flex", gap:32, alignItems:"flex-start", flexWrap:"wrap" }}>
            <div style={{ width:100, height:100, borderRadius:"50%", background:selSign.color+"33", border:`3px solid ${selSign.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:50, flexShrink:0 }}>{selSign.symbol}</div>
            <div style={{ flex:1, minWidth:260 }}>
              <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:30, color:"#D4AF37", marginBottom:6 }}>{selSign.name}</h2>
              <p style={{ color:"#8a7a60", marginBottom:20, fontFamily:"'Cinzel',serif", fontSize:12, letterSpacing:1 }}>{selSign.date_range}</p>
              <p style={{ fontFamily:"'Crimson Text',serif", fontSize:18, lineHeight:1.9, color:"#d0c0a0", marginBottom:28 }}>{selSign.message}</p>
              <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:28 }}>
                <Stat icon="♥" label="Amour"     val={selSign.love}      color="#E74C3C" />
                <Stat icon="★" label="Travail"   val={selSign.work}      color="#F39C12" />
                <Stat icon="☽" label="Intuition" val={selSign.intuition} color="#9B59B6" />
                <Stat icon="✦" label="Chance"    val={selSign.luck}      color="#D4AF37" />
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                <button className="bg" onClick={()=>onQOpen()}>✦ Question Personnalisée</button>
                <button className="bo" onClick={()=>onNav("tarot")}>Tirage Tarot</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}