const Div = () => <div style={{ width:80, height:2, background:"linear-gradient(90deg,transparent,#D4AF37,transparent)", margin:"16px auto" }} />;

export default function TarotPage({ tarotDeck, revealed, revealCard, tarotType, setTarotType, newDraw, onQOpen }) {
  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"60px 24px", textAlign:"center" }}>
      <h1 style={{ fontFamily:"'Cinzel',serif", fontSize:40, fontWeight:700, color:"#D4AF37", marginBottom:8 }}>Tarot De Marseille</h1>
      <Div />
      <p style={{ color:"#8a7a60", fontSize:17, marginBottom:32 }}>Concentrez-vous sur votre intention et cliquez sur chaque carte pour la r&eacute;v&eacute;ler</p>
      <div style={{ display:"flex", gap:10, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
        {[["amour","♥ Amour"],["carriere","★ Carrière"],["general","✦ Général"],["spirituel","☽ Spirituel"]].map(([t,l])=>(
          <button key={t} className={`cb ${tarotType===t?"act":""}`} onClick={()=>{setTarotType(t);newDraw()}}>{l}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20, marginBottom:36 }}>
        {tarotDeck.map((card,i)=>(
          <div key={i} className={`tc ${revealed.includes(i)?"rev":""}`} style={{ aspectRatio:"2/3" }} onClick={()=>revealCard(i)}>
            {revealed.includes(i) ? <>
              <div style={{ fontSize:36, marginBottom:10 }}>{card.emoji}</div>
              <h4 style={{ fontFamily:"'Cinzel',serif", fontSize:12, color:"#D4AF37", marginBottom:4 }}>{card.name}</h4>
              <span style={{ fontSize:10, color:"#D4AF37", fontFamily:"'Cinzel',serif", letterSpacing:1, marginBottom:8 }}>{card.tag}</span>
              <p style={{ fontFamily:"'Crimson Text',serif", fontSize:12, color:"#b0a080", lineHeight:1.6 }}>{card.message}</p>
            </> : <>
              <div style={{ fontSize:34, marginBottom:10 }}>✦</div>
              <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, color:"#8a7a60", lineHeight:1.7 }}>Cliquez pour<br />r&eacute;v&eacute;ler</p>
            </>}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
        <button className="bg" onClick={newDraw}>✦ Nouveau Tirage</button>
        <button className="bo" onClick={()=>onQOpen()}>Consulter un Voyant</button>
      </div>
      {revealed.length===4 && (
        <div style={{ background:"rgba(212,175,55,.05)", border:"1px solid rgba(212,175,55,.25)", borderRadius:12, padding:32, textAlign:"left" }}>
          <h3 style={{ fontFamily:"'Cinzel',serif", fontSize:20, color:"#D4AF37", marginBottom:16, textAlign:"center" }}>✦ Interprétation de Votre Tirage ✦</h3>
          <p style={{ fontFamily:"'Crimson Text',serif", fontSize:17, lineHeight:1.9, color:"#d0c0a0" }}>
            Votre tirage de type <strong style={{ color:"#D4AF37" }}>{tarotType}</strong> r&eacute;v&egrave;le une p&eacute;riode de transformation profonde. Les cartes align&eacute;es indiquent que vous &ecirc;tes &agrave; l'aube d'un renouveau significatif. Faites confiance aux synchronicit&eacute;s &mdash; les obstacles pr&eacute;sents sont des tremplins vers votre v&eacute;ritable destin&eacute;e.
          </p>
          <div style={{ marginTop:20, textAlign:"center" }}>
            <button className="bg" onClick={()=>onQOpen()}>✦ Approfondir avec un Voyant</button>
          </div>
        </div>
      )}
    </div>
  );
}