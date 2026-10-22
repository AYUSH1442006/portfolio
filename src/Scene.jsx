import {useEffect,useRef} from "react";
import * as THREE from "three";
const STOPS={hero:[4.2,14,0],about:[-4.2,13,1.2],experience:[4.2,12,2.4],projects:[-4.2,11,3.6],ask:[4.2,12,4.8],match:[-4.2,11,6],skills:[4.2,12,7.2],wins:[-4.2,11,8.4],contact:[0,9,9.6]};
export default function Scene({section,theme}){
  const cv=useRef(null),st=useRef(section),rc=useRef(()=>{});
  st.current=section;
  useEffect(()=>{const t=setTimeout(()=>rc.current(),40);return()=>clearTimeout(t)},[theme]);
  useEffect(()=>{
    const reduce=matchMedia("(prefers-reduced-motion:reduce)").matches;
    const css=v=>new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue(v).trim());
    let ren;try{ren=new THREE.WebGLRenderer({canvas:cv.current,antialias:true,alpha:true})}catch(e){cv.current.style.display="none";return}
    ren.setPixelRatio(Math.min(devicePixelRatio,2));
    const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(55,1,.1,100);cam.position.z=14;
    const group=new THREE.Group();scene.add(group);
    const N=44,P=[],nodes=[],mats=[],hubs=[],c0=css("--node"),hc=css("--accent2"),sg=new THREE.SphereGeometry(.14,16,16);
    for(let i=0;i<N;i++){
      const hub=i%9===0,m=new THREE.MeshBasicMaterial({color:hub?hc:c0,transparent:true,opacity:hub?1:.8});(hub?hubs:mats).push(m);
      const s=new THREE.Mesh(sg,m),r=5+Math.random()*5,th=Math.random()*6.283,ph=Math.acos(2*Math.random()-1);
      s.position.set(r*Math.sin(ph)*Math.cos(th),r*Math.sin(ph)*Math.sin(th)*.7,r*Math.cos(ph));if(hub)s.scale.setScalar(2);
      s.userData={base:s.position.clone(),o:Math.random()*6.283};group.add(s);nodes.push(s);P.push(s.position);
    }
    const a=[];for(let i=0;i<N;i++)for(let j=i+1;j<N;j++)if(P[i].distanceTo(P[j])<3.9)a.push(P[i].x,P[i].y,P[i].z,P[j].x,P[j].y,P[j].z);
    const lg=new THREE.BufferGeometry();lg.setAttribute("position",new THREE.Float32BufferAttribute(a,3));
    const lm=new THREE.LineBasicMaterial({color:c0,transparent:true,opacity:.28});mats.push(lm);group.add(new THREE.LineSegments(lg,lm));
    const core=new THREE.Mesh(new THREE.IcosahedronGeometry(2.3,1),new THREE.MeshBasicMaterial({color:hc,wireframe:true,transparent:true,opacity:.35}));hubs.push(core.material);group.add(core);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(3.6,.014,8,140),new THREE.MeshBasicMaterial({color:c0,transparent:true,opacity:.5}));ring.rotation.x=1.2;mats.push(ring.material);group.add(ring);
    const dv=[];for(let i=0;i<520;i++)dv.push((Math.random()-.5)*44,(Math.random()-.5)*32,(Math.random()-.5)*32);
    const dg=new THREE.BufferGeometry();dg.setAttribute("position",new THREE.Float32BufferAttribute(dv,3));
    const dm=new THREE.PointsMaterial({color:c0,size:.05,transparent:true,opacity:.5});mats.push(dm);scene.add(new THREE.Points(dg,dm));
    const pulse=[],pg=new THREE.SphereGeometry(.07,8,8),pm=new THREE.MeshBasicMaterial({color:0xffffff});
    for(let i=0;i<10;i++){const p=new THREE.Mesh(pg,pm);p.userData={a:Math.floor(Math.random()*N),b:Math.floor(Math.random()*N),t:Math.random()};group.add(p);pulse.push(p)}
    rc.current=()=>{const c=css("--node"),h=css("--accent2");mats.forEach(m=>m.color.copy(c));hubs.forEach(m=>m.color.copy(h))};
    let mx=0,my=0,px=4.2,cz=14,ry=0,raf=0;
    const move=e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5};addEventListener("pointermove",move);
    const size=()=>{ren.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()};addEventListener("resize",size);size();
    const frame=ms=>{const t=ms*.001,tg=STOPS[st.current]||STOPS.hero,wide=innerWidth>860;
      px+=((wide?tg[0]:0)-px)*.04;cz+=(tg[1]-cz)*.04;ry+=(tg[2]-ry)*.04;
      group.position.set(px,wide?0:2.4,0);cam.position.z=cz;
      group.rotation.y=(reduce?0:t*.06)+ry+mx*.5;group.rotation.x=my*.3;core.rotation.y=t*.15;core.rotation.x=t*.1;ring.rotation.z=t*.2;
      if(!reduce){nodes.forEach(n=>{n.position.y=n.userData.base.y+Math.sin(t*.6+n.userData.o)*.25});
        pulse.forEach(p=>{const d=p.userData;d.t+=.006;if(d.t>1){d.t=0;d.a=d.b;d.b=Math.floor(Math.random()*N)}p.position.lerpVectors(P[d.a],P[d.b],d.t);p.visible=P[d.a].distanceTo(P[d.b])<6})}
      ren.render(scene,cam);if(!reduce)raf=requestAnimationFrame(frame)};
    raf=requestAnimationFrame(frame);
    if(reduce){const s=()=>frame(0);addEventListener("scroll",s,{passive:true})}
    return()=>{cancelAnimationFrame(raf);removeEventListener("pointermove",move);removeEventListener("resize",size);ren.dispose()};
  },[]);
  return <canvas id="gl" ref={cv} aria-hidden="true"/>;
}
