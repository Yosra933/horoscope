export default function QuestionModal({ qOpen, setQOpen, question, setQuestion, answer, setAnswer, aiLoading, askVoyant }) {
  const handleClose = () => { setQOpen(false); setAnswer(""); setQuestion(""); };

  return qOpen ? (
    <div className="ov" onClick={handleClose}>
      <div className="mb" onClick={e=>e.stopPropagation()}>
        <button onClick={handleClose} style={{ position:"absolute", top:14, right:16, background:"none", border:"none", color:"#D4AF37", fontSize:22, cursor:"pointer" }}>✕</button>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div className="flt" style={{ fontSize:44, marginBottom:8 }}>🔮</div>
          <h2 style={{ fontFamily:"'Cinzel',serif", fontSize:22, color:"#D4AF37", marginBottom:4 }}>Question Gratuite</h2>
          <p style={{ color:"#8a7a60", fontSize:15 }}>Notre voyant IA vous r&eacute;pond instantan&eacute;ment</p>
        </div>
        <textarea rows={4} placeholder="Posez votre question spirituelle, amoureuse, professionnelle…" value={question} onChange={e=>setQuestion(e.target.value)} style={{ marginBottom:16 }} />
        <button className="bg" style={{ width:"100%", marginBottom:20 }} onClick={askVoyant} disabled={aiLoading||!question.trim()}>
          {aiLoading ? "✦ Les astres consultent…" : "✦ Obtenir Ma Réponse"}
        </button>
        {answer && (
          <div style={{ background:"rgba(212,175,55,.05)", border:"1px solid rgba(212,175,55,.3)", borderRadius:8, padding:20 }}>
            <p style={{ fontFamily:"'Cinzel',serif", fontSize:11, letterSpacing:2, color:"#D4AF37", marginBottom:12 }}>✦ MESSAGE DE L'UNIVERS</p>
            <p style={{ fontFamily:"'Crimson Text',serif", fontSize:16, lineHeight:1.9, color:"#d0c0a0" }}>{answer}</p>
            <div style={{ marginTop:16, textAlign:"right" }}>
              <button className="bo" style={{ fontSize:10 }} onClick={()=>{setAnswer("");setQuestion("")}}>Nouvelle Question</button>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;
}