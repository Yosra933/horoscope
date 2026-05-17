import pkg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const { Client } = pkg;

dotenv.config();

const ZODIAC_DATA = [
  { name:"Bélier",    sym:"♈", date:"21 Mar – 19 Avr", color:"#C0392B",
    love:85, work:70, intuition:60, luck:75,
    text:"Mars, votre planète maîtresse, vous insuffle une énergie débordante. Osez prendre des initiatives audacieuses — l'univers soutient vos élans créateurs aujourd'hui." },
  { name:"Taureau",   sym:"♉", date:"20 Avr – 20 Mai", color:"#27AE60",
    love:78, work:88, intuition:55, luck:80,
    text:"Vénus illumine votre secteur financier. Une stabilité bienvenue s'installe ; profitez-en pour consolider vos projets à long terme et chérir vos proches." },
  { name:"Gémeaux",   sym:"♊", date:"21 Mai – 20 Jun", color:"#F39C12",
    love:90, work:65, intuition:80, luck:70,
    text:"Mercure en trône stimule votre intellect. Les conversations importantes s'avèrent fructueuses ; votre éloquence naturelle ouvre des portes inattendues." },
  { name:"Cancer",    sym:"♋", date:"21 Jun – 22 Jul", color:"#3498DB",
    love:92, work:60, intuition:95, luck:65,
    text:"La Lune, votre souveraine, vous baigne de sensibilité accrue. Vos intuitions sont d'une justesse remarquable — faites-leur confiance sans réserve." },
  { name:"Lion",      sym:"♌", date:"23 Jul – 22 Aoû", color:"#E67E22",
    love:80, work:90, intuition:65, luck:88,
    text:"Le Soleil rayonne dans votre signe. Votre charisme attire des opportunités exceptionnelles ; c'est le moment d'affirmer votre leadership avec bienveillance." },
  { name:"Vierge",    sym:"♍", date:"23 Aoû – 22 Sep", color:"#1ABC9C",
    love:70, work:95, intuition:75, luck:72,
    text:"Mercure affûte votre sens du détail à la perfection. Un projet minutieux vous récompense grandement ; votre rigueur est enfin reconnue à sa juste valeur." },
  { name:"Balance",   sym:"♎", date:"23 Sep – 22 Oct", color:"#9B59B6",
    love:95, work:72, intuition:70, luck:85,
    text:"Vénus danse dans votre maison de l'amour. Les relations s'épanouissent avec grâce ; une rencontre marquante ou un regain de passion vous attend." },
  { name:"Scorpion",  sym:"♏", date:"23 Oct – 21 Nov", color:"#8E44AD",
    love:75, work:82, intuition:98, luck:68,
    text:"Pluton intensifie votre magnétisme naturel. Des vérités profondes émergent à la surface ; votre capacité de transformation est à son apogée aujourd'hui." },
  { name:"Sagittaire",sym:"♐", date:"22 Nov – 21 Déc", color:"#E74C3C",
    love:82, work:75, intuition:72, luck:92,
    text:"Jupiter, votre bienfaiteur céleste, ouvre grand les portes de l'abondance. Un voyage ou une formation transformera votre horizon de manière spectaculaire." },
  { name:"Capricorne",sym:"♑", date:"22 Déc – 19 Jan", color:"#7F8C8D",
    love:68, work:98, intuition:65, luck:78,
    text:"Saturne récompense votre persévérance légendaire. Le sommet que vous visez est plus proche que jamais ; chaque effort compte et l'univers le reconnaît." },
  { name:"Verseau",   sym:"♒", date:"20 Jan – 18 Fév", color:"#2980B9",
    love:78, work:80, intuition:88, luck:82,
    text:"Uranus, votre planète de l'éveil, éclaire votre génie inventif. Une idée révolutionnaire prend forme ; osez briser les conventions pour créer du neuf." },
  { name:"Poissons",  sym:"♓", date:"19 Fév – 20 Mar", color:"#16A085",
    love:88, work:65, intuition:99, luck:76,
    text:"Neptune plonge votre âme dans un océan d'inspiration. Votre créativité et votre empathie touchent les cœurs profondément — partagez vos dons avec le monde." },
];

const PRODUCTS_DATA = [
  { name:"Talisman Hématite",    price:29.99, cat:"Pierres & Cristaux",    badge:"Bestseller", desc:"Protection et ancrage énergétique", g:"linear-gradient(135deg,#8B1A1A,#C0392B)", icon:"🪨" },
  { name:"Bougie Aragonite",     price:19.99, cat:"Bougies & Chandeliers", badge:"Nouveau",    desc:"Purification de l'espace sacré",    g:"linear-gradient(135deg,#4A235A,#7D3C98)", icon:"🕯️" },
  { name:"Pendule Cristal",      price:34.99, cat:"Divination",            badge:null,         desc:"Réponses de l'univers",              g:"linear-gradient(135deg,#1A3A4A,#1F618D)", icon:"🔮" },
  { name:"Bracelet Labradorite", price:24.99, cat:"Bijoux",                badge:"Populaire",  desc:"Intuition et magie lunaire",         g:"linear-gradient(135deg,#0B3D2E,#117A65)", icon:"📿" },
  { name:"Tarot de Marseille",   price:39.99, cat:"Divination",            badge:null,         desc:"Guide spirituel ancestral",           g:"linear-gradient(135deg,#7D6608,#B7950B)", icon:"🃏" },
  { name:"Encens Sagesse",       price:14.99, cat:"Encens & Résines",      badge:"Promo",      desc:"Connexion aux dimensions supérieures",g:"linear-gradient(135deg,#512E5F,#A569BD)", icon:"🧿" },
  { name:"Pierre Améthyste",     price:22.99, cat:"Pierres & Cristaux",    badge:null,         desc:"Calme et clarté spirituelle",         g:"linear-gradient(135deg,#6A0572,#AB47BC)", icon:"💜" },
  { name:"Oracle des Anges",     price:32.99, cat:"Divination",            badge:"Nouveau",    desc:"Messages célestes quotidiens",        g:"linear-gradient(135deg,#1A237E,#3949AB)", icon:"👼" },
];

const TAROT_DATA = [
  { name:"Le Soleil",   emoji:"☀️", msg:"La clarté et la joie illuminent votre chemin. Un succès éclatant vous attend bientôt.", tag:"Victoire" },
  { name:"La Lune",     emoji:"🌙", msg:"Vos rêves sont porteurs de messages importants. Écoutez votre voix intérieure.", tag:"Mystère" },
  { name:"L'Étoile",    emoji:"⭐", msg:"L'espoir renaît après l'épreuve. Gardez la foi — le ciel vous guide vers la lumière.", tag:"Espoir" },
  { name:"Le Roi",      emoji:"👑", msg:"Votre autorité naturelle s'affirme. Assumez votre pouvoir avec sagesse bienveillante.", tag:"Pouvoir" },
  { name:"La Roue",     emoji:"🎡", msg:"Un tournant majeur s'approche. Accueillez le changement avec sérénité et confiance.", tag:"Destin" },
  { name:"L'Amoureux",  emoji:"💕", msg:"Un choix amoureux décisif se profile. Laissez votre cœur parler librement.", tag:"Amour" },
  { name:"La Force",    emoji:"🦁", msg:"Votre courage intérieur triomphe de tous les obstacles. Persévérez avec foi!", tag:"Courage" },
  { name:"L'Hermite",   emoji:"🏔️", msg:"La sagesse naît de la solitude et du recueillement profond. Prenez le temps.", tag:"Sagesse" },
  { name:"La Justice",  emoji:"⚖️", msg:"L'équilibre sera rétabli. La vérité et l'équité sont fermement de votre côté.", tag:"Vérité" },
  { name:"Le Monde",    emoji:"🌍", msg:"Un cycle s'achève brillamment. La réussite totale est à portée de votre main.", tag:"Plénitude" },
  { name:"Le Jugement", emoji:"🎺", msg:"Un renouveau profond vous appelle. Répondez enfin à votre vocation véritable.", tag:"Réveil" },
  { name:"La Papesse",  emoji:"📜", msg:"Les secrets de l'univers vous sont révélés. Faites confiance à vos visions.", tag:"Intuition" },
];

async function seedDatabase() {
  const sslConfig = process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {};
  const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'horoscope_db',
    port: parseInt(process.env.DB_PORT) || 5432,
    ...sslConfig
  });
  await client.connect();

  try {
    const zodiacCount = await client.query('SELECT COUNT(*) as count FROM zodiac_signs');
    const productCount = await client.query('SELECT COUNT(*) as count FROM products');
    const tarotCount = await client.query('SELECT COUNT(*) as count FROM tarot_cards');

    const hasZodiac = parseInt(zodiacCount.rows[0].count, 10) > 0;
    const hasProducts = parseInt(productCount.rows[0].count, 10) > 0;
    const hasTarot = parseInt(tarotCount.rows[0].count, 10) > 0;

    if (hasZodiac && hasProducts && hasTarot) {
      console.log('✓ Database already seeded with data');
      return;
    }

    if (!hasZodiac) {
      for (const sign of ZODIAC_DATA) {
        await client.query(
          'INSERT INTO zodiac_signs (name, symbol, date_range, color, love, work, intuition, luck, message) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [sign.name, sign.sym, sign.date, sign.color, sign.love, sign.work, sign.intuition, sign.luck, sign.text]
        );
      }
      console.log('✓ Zodiac signs seeded');
    }

    if (!hasProducts) {
      for (const product of PRODUCTS_DATA) {
        await client.query(
          'INSERT INTO products (name, price, category, badge, description, gradient, icon) VALUES ($1, $2, $3, $4, $5, $6, $7)',
          [product.name, product.price, product.cat, product.badge || null, product.desc, product.g, product.icon]
        );
      }
      console.log('✓ Products seeded');
    }

    if (!hasTarot) {
      for (const card of TAROT_DATA) {
        await client.query(
          'INSERT INTO tarot_cards (name, emoji, message, tag) VALUES ($1, $2, $3, $4)',
          [card.name, card.emoji, card.msg, card.tag]
        );
      }
      console.log('✓ Tarot cards seeded');
    }

    console.log('✓ Database seeding complete');
  } catch (error) {
    console.error('✗ Seeding failed:', error.message);
  } finally {
    await client.end();
  }
}

export { seedDatabase };

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  seedDatabase();
}
