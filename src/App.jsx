import { useState, useEffect } from "react";
import { Auth } from "./Auth";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import HoroscopePage from "./components/HoroscopePage";
import TarotPage from "./components/TarotPage";
import ShopPage from "./components/ShopPage";
import ContactPage from "./components/ContactPage";
import Dashboard from "./components/Dashboard";
import CartModal from "./components/CartModal";
import QuestionModal from "./components/QuestionModal";
import "./App.css";

export default function App() {
  const [zodiac,      setZodiac]      = useState([]);
  const [products,    setProducts]    = useState([]);
  const [tarot,       setTarot]       = useState([]);
  const [page,        setPage]        = useState("home");
  const [cart,        setCart]        = useState([]);
  const [cartOpen,    setCartOpen]    = useState(false);
  const [checkStep,   setCheckStep]   = useState(0);
  const [selSign,     setSelSign]     = useState(null);
  const [cat,         setCat]         = useState("Tous");
  const [qOpen,       setQOpen]       = useState(false);
  const [question,    setQuestion]    = useState("");
  const [answer,      setAnswer]      = useState("");
  const [aiLoading,   setAiLoading]   = useState(false);
  const [notif,       setNotif]       = useState(null);
  const [tarotDeck,   setTarotDeck]   = useState([]);
  const [revealed,    setRevealed]    = useState([]);
  const [tarotType,   setTarotType]   = useState("amour");
  const [wishlist,    setWishlist]    = useState([]);
  const [contactForm, setContactForm] = useState({ name:"", email:"", msg:"" });
  const [contactSent, setContactSent] = useState(false);
  const [orderInfo,   setOrderInfo]   = useState({ name:"", addr:"" });
  const [authOpen,    setAuthOpen]    = useState(false);
  const [user,        setUser]        = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [zodiacRes, productsRes, tarotRes] = await Promise.all([
          fetch('http://localhost:5000/api/zodiac'),
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/tarot')
        ]);
        const zodiacData = await zodiacRes.json();
        const productsData = await productsRes.json();
        const tarotData = await tarotRes.json();
        setZodiac(zodiacData);
        setProducts(productsData);
        setTarot(tarotData);
        if (tarotData.length > 0) {
          const shuffled = [...tarotData].sort(() => Math.random() - 0.5);
          setTarotDeck(shuffled.slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast('⚠ Erreur de connexion au serveur');
      }
    };
    fetchData();
  }, []);

  const addToCart = (p) => {
    setCart(prev => {
      const ex = prev.find(i=>i.id===p.id);
      if (ex) return prev.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i);
      return [...prev,{...p,qty:1}];
    });
    toast(`✦ ${p.name} ajouté au panier`);
  };
  const removeFromCart = (id) => setCart(prev=>prev.filter(i=>i.id!==id));
  const changeQty = (id, d) => setCart(prev=>prev.map(i=>i.id===id?{...i,qty:Math.max(1,i.qty+d)}:i));
  const cartTotal = cart.reduce((s,i)=>s+i.price*i.qty, 0);
  const cartCount = cart.reduce((s,i)=>s+i.qty, 0);
  const toggleWish = (id) => {
    setWishlist(prev=>prev.includes(id)?prev.filter(x=>x!==id):[...prev,id]);
    toast(wishlist.includes(id)?`Retiré des souhaits`:`♥ Ajouté aux souhaits`);
  };
  const toast = (msg) => { setNotif(msg); setTimeout(()=>setNotif(null), 2600); };
  const nav = (pg) => { setPage(pg); window.scrollTo(0,0); };
  const filtered = cat==="Tous"?products:products.filter(p=>p.category===cat);

  const askVoyant = async () => {
    if (!question.trim()) return;
    setAiLoading(true); setAnswer("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",
          max_tokens:1000,
          system:"Tu es un voyant mystique et bienveillant. Réponds avec sagesse, poésie et mystère en français. Utilise des métaphores cosmiques. Sois encourageant et positif. Maximum 3 paragraphes courts.",
          messages:[{role:"user",content:question}]
        })
      });
      const data = await res.json();
      setAnswer(data.content?.[0]?.text || "Les étoiles gardent silence pour l'instant…");
    } catch {
      setAnswer("Les énergies cosmiques sont perturbées. Réessayez dans un moment.");
    }
    setAiLoading(false);
  };

  const newDraw = () => {
    const shuffled = [...tarot].sort(() => Math.random() - 0.5);
    setTarotDeck(shuffled.slice(0,4));
    setRevealed([]);
  };
  const revealCard = (i) => { if(!revealed.includes(i)) setRevealed(prev=>[...prev,i]); };
  const sendContact = () => {
    if (!contactForm.name||!contactForm.email||!contactForm.msg) { toast("⚠ Veuillez remplir tous les champs"); return; }
    setContactSent(true);
    toast("✦ Message envoyé avec succès !");
  };
  const placeOrder = async () => {
    const name = orderInfo.name || user?.name;
    if (!name||!orderInfo.addr) { toast("⚠ Veuillez remplir tous les champs"); return; }
    if (!user) { toast("⚠ Vous devez être connecté pour commander"); return; }
    const token = localStorage.getItem('authToken');
    if (!token) { toast("⚠ Session expirée, reconnectez-vous"); return; }
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          customer_name: name,
          email: user.email,
          address: orderInfo.addr,
          total_price: cartTotal,
          items: cart.map(i => ({ id: i.id, qty: i.qty, price: i.price }))
        })
      });
      const data = await res.json();
      if (!res.ok) { toast(`⚠ ${data.error}`); return; }
      console.log('[Order] Created:', data);
      setCheckStep(3); setCart([]);
      toast("✦ Commande confirmée !");
    } catch (err) {
      console.error('[Order] Error:', err);
      toast("⚠ Erreur lors de la commande");
    }
  };

  const openCart = () => { setCartOpen(true); setCheckStep(0); };

  return (
    <div style={{ fontFamily:"'Crimson Text',serif", background:"#0a0612", color:"#e8d5b7", minHeight:"100vh" }}>
      <Header
        page={page} onNav={nav} user={user} setUser={setUser}
        cartCount={cartCount} onCartOpen={openCart}
        onQOpen={() => setQOpen(true)}
        authOpen={authOpen} setAuthOpen={setAuthOpen}
      />

      <div style={{ paddingTop:62 }}>
        {page==="home" && (
          <HomePage
            zodiac={zodiac} products={products} tarot={tarot}
            selSign={selSign} setSelSign={setSelSign}
            onNav={nav} onQOpen={() => setQOpen(true)}
            addToCart={addToCart} toggleWish={toggleWish}
            wishlist={wishlist}
          />
        )}
        {page==="horoscope" && (
          <HoroscopePage
            zodiac={zodiac} selSign={selSign} setSelSign={setSelSign}
            onNav={nav} onQOpen={() => setQOpen(true)}
          />
        )}
        {page==="tarot" && (
          <TarotPage
            tarotDeck={tarotDeck} revealed={revealed}
            revealCard={revealCard} tarotType={tarotType}
            setTarotType={setTarotType} newDraw={newDraw}
            onQOpen={() => setQOpen(true)}
          />
        )}
        {page==="boutique" && (
          <ShopPage
            products={products} cat={cat} setCat={setCat}
            filtered={filtered} wishlist={wishlist}
            addToCart={addToCart} toggleWish={toggleWish}
          />
        )}
        {page==="contact" && (
          <ContactPage
            contactForm={contactForm} setContactForm={setContactForm}
            contactSent={contactSent} setContactSent={setContactSent}
            sendContact={sendContact}
          />
        )}
        {page==="dashboard" && (
          <Dashboard user={user} onNav={nav} toast={toast} />
        )}
      </div>

      <Footer onNav={nav} onQOpen={() => setQOpen(true)} setCat={setCat} />

      <CartModal
        cartOpen={cartOpen} setCartOpen={setCartOpen}
        cart={cart} checkStep={checkStep} setCheckStep={setCheckStep}
        cartTotal={cartTotal} orderInfo={orderInfo} setOrderInfo={setOrderInfo}
        changeQty={changeQty} removeFromCart={removeFromCart}
        addToCart={addToCart} placeOrder={placeOrder}
        onNav={nav} toast={toast}
        user={user} setAuthOpen={setAuthOpen}
      />

      <QuestionModal
        qOpen={qOpen} setQOpen={setQOpen}
        question={question} setQuestion={setQuestion}
        answer={answer} setAnswer={setAnswer}
        aiLoading={aiLoading} askVoyant={askVoyant}
      />

      <Auth
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />

      {notif && <div className="notif">{notif}</div>}
    </div>
  );
}