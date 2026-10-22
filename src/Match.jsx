import {useState} from "react";
const HAVE=[["React","react"],["Node.js","node"],["TypeScript","typescript"],["JavaScript","javascript"],["Python","python"],["Java","\\bjava\\b"],["C++","c\\+\\+"],["SQL","\\bsql\\b|mysql"],["MongoDB","mongo"],["Express","express"],["FastAPI","fastapi"],["REST APIs","\\brest"],["Tailwind","tailwind"],["Docker","docker"],["AWS","\\baws\\b"],["CI/CD","ci\\/cd|ci-cd"],["JWT / auth","jwt|oauth|authentication"],["LLMs / GenAI","\\bllm|genai|generative|\\bgpt|claude"],["RAG","\\brag\\b|retrieval|vector"],["Prompt engineering","prompt"],["Agile / Scrum","agile|scrum"],["Microservices","microservice"],["System design","system design"],["Machine learning","machine learning|scikit|\\bml\\b"],["HTML / CSS","html|css"]];
const GAPS=[["Kubernetes","kubernetes|k8s"],["Angular","angular"],["Vue","\\bvue"],["Next.js","next\\.?js"],["GraphQL","graphql"],["Redis","redis"],["PostgreSQL","postgres"],["Kafka","kafka"],["Go","\\bgolang\\b|\\bgo\\b"],["C# / .NET","c#|\\.net"],["PHP","\\bphp\\b"],["Azure","azure"],["GCP","\\bgcp\\b|google cloud"],["Terraform","terraform"]];
const scan=(t,list)=>list.filter(([,re])=>new RegExp(re,"i").test(t)).map(x=>x[0]);
export default function Match(){
  const [txt,setTxt]=useState(""),[r,setR]=useState(null);
  const run=()=>{const hit=scan(txt,HAVE),gap=scan(txt,GAPS);setR({hit,gap,score:hit.length+gap.length?Math.round(hit.length/(hit.length+gap.length)*100):null})};
  return <div className="box">
    <textarea value={txt} onChange={e=>setTxt(e.target.value)} placeholder="Paste a job description here. Nothing leaves your browser." aria-label="Job description"/>
    <div className="cta"><button className="btn p" onClick={run} disabled={txt.trim().length<20}>Check the match</button>{r&&<button className="btn ghost" onClick={()=>{setTxt("");setR(null)}}>Clear</button>}</div>
    {r&&(r.score===null?<p style={{marginTop:18}}>No known tech terms found. Paste a fuller job description.</p>:
    <div className="res">
      <div><div className="score">{r.score}%</div><p>of the technologies in this role are already in my stack.</p></div>
      <div><h4>In my stack ({r.hit.length})</h4><div className="chips">{r.hit.map(x=><i key={x} className="hit">{x}</i>)}{!r.hit.length&&<span>None found</span>}</div></div>
      {r.gap.length>0&&<div><h4>Not yet in my stack ({r.gap.length})</h4><div className="chips">{r.gap.map(x=><i key={x} className="gap">{x}</i>)}</div></div>}
    </div>)}
  </div>;
}
