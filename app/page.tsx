import Image from "next/image";
import { ArrowUpRight, Instagram, Facebook, Linkedin, Mail, Menu, Palette, Layers3, CreditCard, FileText } from "lucide-react";
import { supabase } from "@/lib/supabase";
import ContactForm from "@/components/ContactForm";

type Item = { id: string; title: string; description: string; price?: string; delivery?: string; image_url?: string; category?: string; featured?: boolean; };

const defaults: Item[] = [
  {id:"logo",title:"Logo Design",description:"Distinctive, memorable identities built around your brand's purpose.",category:"Brand Identity"},
  {id:"social",title:"Social Media Cover Design",description:"Consistent, eye-catching covers and creative assets for your social platforms.",category:"Social Media"},
  {id:"letterhead",title:"Letterhead Design",description:"Professional stationery that gives every business document a polished look.",category:"Stationery"},
  {id:"card",title:"Visiting Card Design",description:"A refined first impression with a clean, print-ready business card.",category:"Stationery"}
];
const packages: Item[] = [
  {id:"basic",title:"Basic",price:"Starting at $25",description:"One focused design concept, final JPG/PNG files.",delivery:"3 days"},
  {id:"standard",title:"Standard",price:"Starting at $60",description:"More creative direction, revisions and print/web-ready exports.",delivery:"5 days"},
  {id:"premium",title:"Premium",price:"Starting at $120",description:"A complete visual package with source files and brand-ready assets.",delivery:"7 days"}
];

async function getContent(table: string, fallback: Item[]) {
  if (!supabase) return fallback;
  const { data, error } = await supabase.from(table).select("*").eq("active", true).order("created_at", {ascending:false});
  return error || !data?.length ? fallback : data as Item[];
}

export default async function Home() {
  const [services, offers, works] = await Promise.all([
    getContent("services", defaults), getContent("packages", packages), getContent("portfolio", [])
  ]);
  return <main>
    <header className="topbar wrap">
      <a className="brand" href="#" aria-label="Raw Pixel home"><span className="brand-mark">R</span><span>RAW PIXEL</span></a>
      <nav><a href="#services">Services</a><a href="#work">Works</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
      <a className="nav-cta" href="#contact">Let&apos;s Talk <ArrowUpRight size={15}/></a>
    </header>

    <section className="hero wrap">
      <div className="hero-copy">
        <p className="eyebrow"><span/> INDEPENDENT GRAPHIC DESIGNER</p>
        <h1>MD Shehab<br/>Ahmed<span className="yellow-dot">.</span></h1>
        <div className="small-rule"/>
        <p className="hero-lead">I create thoughtful visual identities and designs that help brands stand out.</p>
        <div className="hero-actions"><a className="button button-yellow" href="#work">Explore my work <ArrowUpRight size={16}/></a><a className="text-link" href="#about">More about me <ArrowUpRight size={15}/></a></div>
        <div className="socials"><a aria-label="Instagram" href="#"><Instagram size={16}/></a><a aria-label="Facebook" href="#"><Facebook size={16}/></a><a aria-label="LinkedIn" href="#"><Linkedin size={16}/></a></div>
      </div>
      <div className="hero-photo">
        <div className="photo-frame"><Image src="/shehab-portrait.png" alt="Portrait of MD Shehab Ahmed" fill priority sizes="(max-width: 800px) 90vw, 48vw" style={{objectFit:"cover",objectPosition:"center 25%"}}/></div>
        <div className="photo-caption"><span>RAW PIXEL</span><span>DESIGN WITH PURPOSE — EST. 2026</span></div>
      </div>
      <div className="hero-intro"><p className="eyebrow">A LITTLE INTRODUCTION</p><h2>Designing ideas<br/>into identities.</h2><p>From a memorable logo to a consistent brand presence, I help turn your ideas into clear, confident visuals.</p><a className="gold-link" href="#about">My story <ArrowUpRight size={15}/></a></div>
    </section>

    <section className="intro-band" id="about"><div className="wrap intro-grid">
      <div><p className="eyebrow">A NOTE ON DESIGN</p><h2>Good design is not decoration.<br/><span>It is a clear point of view.</span></h2></div>
      <div><p className="body-copy">I&apos;m MD Shehab Ahmed, the designer behind RAW PIXEL. I work across logo design, social media graphics and business stationery, creating clean and purposeful visuals for growing brands.</p><a className="gold-link" href="#contact">Start a project <ArrowUpRight size={15}/></a></div>
    </div></section>

    <section className="section wrap" id="services"><div className="section-heading"><div><p className="eyebrow">WHAT I CAN DO FOR YOU</p><h2>Selected Services<span className="yellow-dot">.</span></h2></div><p>Creative solutions, shaped around<br/>your brand and your audience.</p></div>
      <div className="service-grid">{services.map((s,i)=><article className={`service-card ${i===0?"featured":""}`} key={s.id}>{s.image_url ? <div className="service-thumb"><img src={s.image_url} alt={s.title}/></div> : <div className="service-icon">{i===0?<Palette/>:i===1?<Layers3/>:i===2?<FileText/>:<CreditCard/>}</div>}<span className="service-number">0{i+1}</span><h3>{s.title}</h3><p>{s.description}</p><a href="#contact" aria-label={`Ask about ${s.title}`}><ArrowUpRight/></a></article>)}</div>
    </section>

    <section className="section work-section" id="work"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">A FEW RECENT PROJECTS</p><h2>Selected Works<span className="yellow-dot">.</span></h2></div><p>Every project starts with a question<br/>and ends with a clear visual story.</p></div>
      {works.length ? <div className="work-grid">{works.map(w=><article className="work-card" key={w.id}><div className="work-image">{w.image_url&&<img src={w.image_url} alt={w.title}/>}</div><div><h3>{w.title}</h3><p>{w.category||"Graphic Design"}</p></div></article>)}</div> : <div className="work-empty"><span className="empty-mark">RP</span><p>Your next favourite project could be here.</p><small>Portfolio projects will appear here when added from the admin dashboard.</small></div>}
    </div></section>

    <section className="section wrap" id="packages"><div className="section-heading"><div><p className="eyebrow">SIMPLE & TRANSPARENT</p><h2>Choose a Package<span className="yellow-dot">.</span></h2></div><p>Flexible starting points for<br/>projects of different sizes.</p></div>
      <div className="package-grid">{offers.map((p,i)=><article className={`package-card ${i===1?"popular":""}`} key={p.id}>{i===1&&<span className="popular-label">POPULAR CHOICE</span>}<p className="eyebrow">0{i+1} / {p.title.toUpperCase()}</p><h3>{p.title}</h3><div className="package-price">{p.price||"Let's discuss"}</div><p>{p.description}</p><div className="package-meta">Delivery: {p.delivery||"As agreed"}</div><a className={i===1?"button button-yellow":"button button-outline"} href={`#contact`}>Choose package <ArrowUpRight size={15}/></a></article>)}</div>
      <p className="fine-print">Prices shown are starting estimates. Final pricing depends on project scope and requirements.</p>
    </section>

    <section className="contact-section" id="contact"><div className="wrap contact-grid"><div><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let&apos;s make<br/>something <span>meaningful.</span></h2><p className="body-copy">Tell me a little about your project. I&apos;ll get back to you to discuss the next steps.</p><a className="gold-link" href="mailto:hello@rawpixel.design">hello@rawpixel.design <ArrowUpRight size={15}/></a></div><ContactForm/></div></section>
    <footer className="footer wrap"><a className="brand" href="#"><span className="brand-mark">R</span><span>RAW PIXEL</span></a><p>© 2026 RAW PIXEL · MD Shehab Ahmed. All rights reserved.</p><a href="/admin">Admin login <ArrowUpRight size={14}/></a></footer>
  </main>;
}
