import {useEffect,useRef,useState} from "react";
import Scene from "./Scene.jsx";
import Match from "./Match.jsx";
import {EMAIL,PHONE,PHONE_HREF,LINKS,RESUME,STATS,TECH,EXPERIENCE,PROJECTS,SKILLS,WINS,QA,REVIEW} from "./data.js";

const ALL=[...REVIEW,"contact"];
const Chips=({items})=><div className="chips">{items.map(x=><i key={x}>{x}</i>)}</div>;
const Bullets=({items})=><ul>{items.map(x=><li key={x}>{x}</li>)}</ul>;
const Sec=({id,title,children})=><section id={id}><h2>{title}</h2>{children}</section>;

function Card({p}){
  const move=e=>{const el=e.currentTarget,r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
    el.style.setProperty("--mx",x*100+"%");el.style.setProperty("--my",y*100+"%");
    if(!matchMedia("(prefers-reduced-motion:reduce)").matches)el.style.transform=`perspective(900px) rotateY(${(x-.5)*8}deg) rotateX(${(.5-y)*8}deg) translateY(-4px)`};
  return <article className="box card" onPointerMove={move} onPointerLeave={e=>{e.currentTarget.style.transform=""}}>
    <h3>{p.name}</h3><Chips items={p.tags}/><Bullets items={p.points}/></article>;
}
function Ask(){
  const [i,setI]=useState(0),q=QA[i];
  return <div className="qa"><div className="qs" role="tablist">{QA.map((x,j)=><button key={x[0]} role="tab" aria-selected={i===j} onClick={()=>setI(j)}>{x[0]}</button>)}</div>
    <div className="box ans" aria-live="polite"><h3>{q[0]}</h3><p>{q[1]}</p><div className="proof">{q[2].map(p=><a key={p[1]} href={"#"+p[1]}>See {p[0]}</a>)}</div></div></div>;
}
export default function App(){
  const [theme,setTheme]=useState(()=>matchMedia("(prefers-color-scheme:light)").matches?"light":"dark");
  const [cur,setCur]=useState("hero"),[seen,setSeen]=useState(()=>new Set()),prog=useRef(null);
  useEffect(()=>{document.documentElement.dataset.theme=theme},[theme]);
  useEffect(()=>{
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const id=e.target.id;setCur(id);setSeen(s=>s.has(id)?s:new Set(s).add(id))}),{rootMargin:"-42% 0px -42% 0px"});
    document.querySelectorAll("main section").forEach(s=>io.observe(s));
    const sc=()=>{prog.current.style.transform=`scaleX(${scrollY/Math.max(1,document.body.scrollHeight-innerHeight)})`};
    addEventListener("scroll",sc,{passive:true});return()=>{io.disconnect();removeEventListener("scroll",sc)};
  },[]);
  const n=REVIEW.filter(id=>seen.has(id)).length,done=n===REVIEW.length;
  return <>
    <Scene section={cur} theme={theme}/>
    <div className="prog" ref={prog}/>
    <nav><b>Ayush Kumar</b><div className="r">
      <span className="lk">{["about","experience","projects","skills","contact"].map(s=><a key={s} href={"#"+s}>{s[0].toUpperCase()+s.slice(1)}</a>)}</span>
      <span id="cnt" className={done?"ok":""}>{done?"All reviewed":`Reviewed ${n}/${REVIEW.length}`}</span>
      <button className="tg" aria-label="Toggle light or dark theme" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")}>Theme</button></div></nav>
    <div className="rail" aria-hidden="true">{ALL.map(id=><a key={id} href={"#"+id} title={id} className={(cur===id?"cur ":"")+(seen.has(id)?"seen":"")}/>)}</div>
    <main>
      <section id="hero">
        <div className="pill"><u/>Open to internships and full-time roles</div>
        <h1>Ayush Kumar</h1>
        <p className="sub">Frontend and full-stack developer building fast interfaces and AI products that ship.</p>
        <p className="lead">Computer Science undergraduate at SRM IST with production experience in React dashboards, REST APIs, and apps built on the Claude API.</p>
        <div className="cta"><a className="btn p" href="#about">Start the 2-minute tour</a><a className="btn" href={RESUME} download>Download resume</a><a className="btn" href={"mailto:"+EMAIL}>Email me</a></div>
        <div className="stats">{STATS.map(([v,l])=><div key={l}><b>{v}</b><span>{l}</span></div>)}</div>
      </section>
      <div className="mq" aria-hidden="true"><div>{[...TECH,...TECH].map((x,i)=><span key={i}>{x}</span>)}</div></div>

      <Sec id="about" title="About"><div className="two">
        <div className="box"><p style={{color:"var(--ink)",fontSize:18,lineHeight:1.55}}>I turn complicated data and AI output into clear, responsive products.</p>
          <p>At Springer Capital I built real-time financial dashboards and worked with backend engineers on API contracts. On my own projects I shipped a streaming LLM pipeline and a role-based MERN platform to production.</p>
          <p style={{margin:0}}>I work well in Agile teams: clear standups, careful code reviews, and releases on schedule.</p></div>
        <div className="box edu"><b>B.Tech, Computer Science &amp; Engineering</b><p>SRM Institute of Science and Technology, Chennai</p><p>2023 – Present</p>
          <p style={{marginTop:16,fontSize:14}}>Coursework: DSA, DBMS, Machine Learning, Web Technologies, OOP, Computer Networks</p></div>
      </div></Sec>

      <Sec id="experience" title="Experience"><div className="box job"><h3>{EXPERIENCE.role}</h3><div className="meta">{EXPERIENCE.dates}</div><Bullets items={EXPERIENCE.points}/></div></Sec>
      <Sec id="projects" title="Projects"><div className="grid3">{PROJECTS.map(p=><Card key={p.name} p={p}/>)}</div></Sec>
      <Sec id="ask" title="What recruiters usually ask"><Ask/></Sec>
      <Sec id="match" title="Check the fit"><p style={{maxWidth:620,marginBottom:18}}>Hiring for a role? Paste the job description. This runs in your browser and compares it with my real skills, gaps included.</p><Match/></Sec>
      <Sec id="skills" title="Skills"><div className="skills">{SKILLS.map(([t,items])=><div className="box" key={t}><h3>{t}</h3><Chips items={items}/></div>)}</div></Sec>
      <Sec id="wins" title="Achievements"><div className="two eq wins">{WINS.map(([t,d])=><div className="box" key={t}><b>{t}</b>{d}</div>)}</div></Sec>
      <section id="contact"><div className="box"><h2>Let’s work together</h2>
        <p>I’m open to internships and full-time frontend, full-stack, and GenAI roles. Email is the fastest way to reach me.</p>
        <div className="cta"><a className="btn p" href={"mailto:"+EMAIL}>{EMAIL}</a><a className="btn" href={"tel:"+PHONE_HREF}>{PHONE}</a>
          {[["LinkedIn",LINKS.li],["GitHub",LINKS.gh],["LeetCode",LINKS.lc]].map(([l,h])=><a key={l} className="btn" href={h} target="_blank" rel="noopener noreferrer">{l}</a>)}
          <a className="btn" href={RESUME} download>Resume (PDF)</a></div></div></section>
    </main>
    <footer>Ayush Kumar, Chennai, Tamil Nadu</footer>
  </>;
}
