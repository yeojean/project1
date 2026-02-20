// ============================================================
//  스파이럴 텍스트
// ============================================================
const text = "He believed in an infinite series of times, in a dizzily growing, ever spreading network of diverging, converging and parallel times. This web of time\u2014the strands of which approach one another, bifurcate, intersect or ignore each other through the centuries\u2014embraces every possibility. We do not exist in most of them. In some you exist and not I, while in others I do, and you do not, and in yet others both of us exist. In this one, in which chance has favored me, you have come to my gate. In another, you, crossing the garden, have found me dead. In yet another, I say these very same words, but am an error, a phantom.";
const canvas = document.getElementById('canvas');
const timerEl = document.getElementById('timer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const enterPortal = document.getElementById('enterPortal');
const centerClick = document.getElementById('centerClick');
let letterElements = [], currentIndex = 0, startTime = null, timerInterval = null;
const centerX = window.innerWidth/2, centerY = window.innerHeight/2;
const SPIRAL = {
  baseCharSpacing: 10,
  charSpacingGrowth: 0.05,
  baseEdgeLength: 20,
  edgeGrowth: 12,
  centerFontSize: 12,
  outerFontSize: 12,
  centerOpacity: 0.3,
  outerOpacity: 0.95,
  rotationSpeed: 0.18,
  startSpeed: -20,
  endSpeed: -5,
  portalRevealRatio: 0.6,
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: "300",
};
const directions=[{dx:1,dy:0,rot:0},{dx:0,dy:1,rot:90},{dx:-1,dy:0,rot:180},{dx:0,dy:-1,rot:270}];
function createLetters(){canvas.innerHTML='';letterElements=[];currentIndex=0;const chars=text.split(''),tc=chars.length;let x=centerX,y=centerY,di=0,el=SPIRAL.baseEdgeLength,dOE=0,eICR=0;chars.forEach((c,i)=>{const d=directions[di],rd=d.rot+90,dp=i/tc,fs=SPIRAL.centerFontSize+(SPIRAL.outerFontSize-SPIRAL.centerFontSize)*dp,to=SPIRAL.centerOpacity+(SPIRAL.outerOpacity-SPIRAL.centerOpacity)*dp,id=1-dp,cv=Math.round(232-(232-40)*id*id);const s=document.createElement('span');s.className='letter';s.textContent=c===' '?'\u00A0':c;s.style.left=x+'px';s.style.top=y+'px';s.style.fontSize=fs+'pt';s.style.fontFamily=SPIRAL.fontFamily;s.style.fontWeight=SPIRAL.fontWeight;s.style.color=`rgb(${cv},${cv-4},${cv-8})`;s.style.transform=`translate(-50%,-50%) rotate(${rd}deg)`;s.dataset.targetOpacity=to;canvas.appendChild(s);letterElements.push(s);const cs=SPIRAL.baseCharSpacing+(i*SPIRAL.charSpacingGrowth);x+=d.dx*cs;y+=d.dy*cs;dOE+=cs;if(dOE>=el){di=(di+1)%4;dOE=0;eICR++;if(eICR%2===0)el+=SPIRAL.edgeGrowth;}});}
let rotationAngle=0,spinRAF=null,isPaused=false,isFinished=false;
let portalShown=false;
function spin(){if(!isPaused){rotationAngle+=SPIRAL.rotationSpeed;canvas.style.transform=`rotate(${rotationAngle}deg)`;}spinRAF=requestAnimationFrame(spin);}
let revealTimeout=null;
function revealNext(){if(isPaused){revealTimeout=setTimeout(revealNext,30);return;}if(currentIndex<letterElements.length){const e=letterElements[currentIndex];e.classList.add('visible');e.style.opacity=e.dataset.targetOpacity;currentIndex++;if(!portalShown&&currentIndex>=Math.floor(letterElements.length*SPIRAL.portalRevealRatio)){enterPortal.classList.add('visible');portalShown=true;}const speed=SPIRAL.startSpeed+(SPIRAL.endSpeed-SPIRAL.startSpeed)*(currentIndex/letterElements.length);revealTimeout=setTimeout(revealNext,Math.max(0,speed));}else{isFinished=true;pauseIcon.style.display='none';playIcon.style.display='block';enterPortal.classList.add('visible');portalShown=true;}}
function updateTimer(){if(!startTime||isPaused)return;const e=Math.floor((Date.now()-startTime)/1000);timerEl.textContent=`${Math.floor(e/60)}:${String(e%60).padStart(2,'0')}`;}
function start(){if(revealTimeout)clearTimeout(revealTimeout);if(timerInterval)clearInterval(timerInterval);if(spinRAF)cancelAnimationFrame(spinRAF);rotationAngle=0;isPaused=false;isFinished=false;portalShown=false;canvas.style.transform='rotate(0deg)';enterPortal.classList.remove('visible');pauseIcon.style.display='block';playIcon.style.display='none';createLetters();startTime=Date.now();timerInterval=setInterval(updateTimer,1000);spinRAF=requestAnimationFrame(spin);revealNext();}
playPauseBtn.addEventListener('click',()=>{if(isFinished){start();return;}isPaused=!isPaused;pauseIcon.style.display=isPaused?'none':'block';playIcon.style.display=isPaused?'block':'none';});
// ============================================================
//  화면 전환
// ============================================================
const SCREEN_SWITCH_DELAY_MS=140;
const SAND_GIF_EXTRA_HOLD_MS=1500;
const SAND_GIF_FADE_OUT_MS=950;
const PRELUDE_SWITCH_DELAY_MS=260;
const spiralScreen=document.getElementById('spiral-screen'), menuScreen=document.getElementById('menu-screen'), backBtn=document.getElementById('backBtn');
function goToMenu(){spiralScreen.classList.add('fade-out');isPaused=true;if(revealTimeout)clearTimeout(revealTimeout);if(timerInterval)clearInterval(timerInterval);setTimeout(()=>{menuScreen.classList.add('visible');backBtn.classList.add('visible');},SCREEN_SWITCH_DELAY_MS);}
enterPortal.addEventListener('click',goToMenu);
centerClick.addEventListener('click',()=>{if(!isFinished)goToMenu();});
backBtn.addEventListener('click',()=>{menuScreen.classList.remove('visible');backBtn.classList.remove('visible');setTimeout(()=>{spiralScreen.classList.remove('fade-out');start();},SCREEN_SWITCH_DELAY_MS);});
const gardenScreen=document.getElementById('garden-screen'), sandScreen=document.getElementById('sand-screen'), ruinsScreen=document.getElementById('ruins-screen'), overlapPreludeScreen=document.getElementById('overlap-prelude-screen'), overlapScreen=document.getElementById('overlap-screen'), mixedScreen=document.getElementById('mixed-screen'), waveScreen=document.getElementById('wave-screen'), glyphScreen=document.getElementById('glyph-screen'), framesScreen=document.getElementById('frames-screen');
const screens={garden:gardenScreen,sand:sandScreen,ruins:ruinsScreen};
const overlapPreludeCanvas=document.getElementById('overlapPreludeCanvas');
const overlapPreludeCtx=overlapPreludeCanvas?overlapPreludeCanvas.getContext('2d'):null;
const waveCanvas=document.getElementById('waveCanvas');
const waveCtx=waveCanvas?waveCanvas.getContext('2d'):null;
const glyphCanvas=document.getElementById('glyphCanvas');
const glyphCtx=glyphCanvas?glyphCanvas.getContext('2d'):null;
const framesCanvas=document.getElementById('framesCanvas');
const framesCtx=framesCanvas?framesCanvas.getContext('2d'):null;
let overlapPreludeRAF=null,overlapPreludeRunning=false,overlapPreludeDense=[],overlapPreludeFlow=[],overlapPreludeStartTs=0;
const OVERLAP_PRELUDE={denseCount:2400,flowCount:980,bandRatio:0.65,charSize:11,minLife:120,maxLife:340};
const OVERLAP_PRELUDE_TOKENS=[
  "A","D","M","?","!","-","time","dream","fire","infinite",
  "the word is chess.","all paths now.","how then am I mad?",
  "forking","labyrinth","present","none is the first page.",
  "someone else was dreaming him.","things happen now."
];
let waveRAF=null,waveRunning=false,waveStartTs=0,waveStreams=[];
let glyphRAF=null,glyphRunning=false,glyphStartTs=0,glyphLayout=[];
let framesRAF=null,framesRunning=false,framesLastSpawn=0,frameSquares=[];
const WAVE_TEXTS=[
  "the word is chess.",
  "time divides and returns.",
  "all paths are present now.",
  "a brief line crosses the dark.",
  "the corridor remembers footsteps.",
  "the sentence passes beneath the wave."
];
function getPreludeChar(){const pick=OVERLAP_PRELUDE_TOKENS[Math.floor(Math.random()*OVERLAP_PRELUDE_TOKENS.length)]||"M";if(pick.length>1&&Math.random()<0.62)return pick.split('')[0];return pick;}
function setupOverlapPreludeCanvas(){if(!overlapPreludeCanvas||!overlapPreludeCtx)return;const d=window.devicePixelRatio||1;overlapPreludeCanvas.width=window.innerWidth*d;overlapPreludeCanvas.height=window.innerHeight*d;overlapPreludeCanvas.style.width=window.innerWidth+'px';overlapPreludeCanvas.style.height=window.innerHeight+'px';overlapPreludeCtx.setTransform(d,0,0,d,0,0);}
function resetOverlapPreludeFlow(g,fromBand){
  const W=window.innerWidth,H=window.innerHeight,bandX=W*OVERLAP_PRELUDE.bandRatio,mode=Math.random();
  if(mode<0.42){
    g.x=bandX+Math.random()*(W-bandX+40);
    g.vx=-(1.2+Math.random()*3.2);
    g.tone='light';
  }else if(mode<0.84){
    g.x=-20-Math.random()*W*0.22;
    g.vx=1.1+Math.random()*3.1;
    g.tone='dark';
  }else{
    g.x=bandX+(Math.random()-0.5)*W*0.2;
    g.vx=(Math.random()-0.5)*2.2;
    g.tone=Math.random()<0.5?'light':'dark';
  }
  if(fromBand){g.x=bandX+(Math.random()-0.5)*W*0.16;}
  g.y=Math.random()*H;
  g.vy=(Math.random()-0.5)*1.05;
  g.life=OVERLAP_PRELUDE.minLife+Math.random()*(OVERLAP_PRELUDE.maxLife-OVERLAP_PRELUDE.minLife);
  g.alpha=0.2+Math.random()*0.62;
  g.seed=Math.random()*Math.PI*2;
  g.char=getPreludeChar();
  g.fromBand=fromBand;
}
function buildOverlapPreludeScene(){
  if(!overlapPreludeCtx)return;
  setupOverlapPreludeCanvas();
  const W=window.innerWidth,H=window.innerHeight,bandX=W*OVERLAP_PRELUDE.bandRatio;
  overlapPreludeDense=Array.from({length:OVERLAP_PRELUDE.denseCount},()=>{
    const rightHeavy=Math.random()<0.86;
    const x=rightHeavy
      ? bandX-W*0.08+Math.random()*(W-bandX+W*0.13)
      : Math.random()*(bandX*0.95);
    const onRight=x>bandX;
    const token=onRight&&Math.random()<0.62
      ? OVERLAP_PRELUDE_TOKENS[Math.floor(Math.random()*OVERLAP_PRELUDE_TOKENS.length)]
      : getPreludeChar();
    return{
      x,y:Math.random()*H,seed:Math.random()*Math.PI*2,
      alpha:onRight?(0.16+Math.random()*0.56):(0.08+Math.random()*0.28),
      char:token,
      jitter:0.2+Math.random()*2.2,
      size:onRight?(8+Math.random()*3.8):(9+Math.random()*4.2),
      tone:onRight?'light':'dark',
    };
  });
  overlapPreludeFlow=Array.from({length:OVERLAP_PRELUDE.flowCount},()=>{
    const g={x:0,y:0,vx:0,vy:0,life:0,alpha:0,char:'M',seed:0,fromBand:false,tone:'dark'};
    resetOverlapPreludeFlow(g,Math.random()<0.62);
    return g;
  });
}
function stopOverlapPrelude(){overlapPreludeRunning=false;if(overlapPreludeRAF)cancelAnimationFrame(overlapPreludeRAF);overlapPreludeRAF=null;overlapPreludeDense=[];overlapPreludeFlow=[];}
function enterOverlapFromPrelude(){if(!overlapPreludeScreen||!overlapPreludeScreen.classList.contains('visible'))return;overlapPreludeScreen.classList.remove('visible');setTimeout(()=>{stopOverlapPrelude();overlapScreen.classList.add('visible');randomizeDoorMotion();},PRELUDE_SWITCH_DELAY_MS);}
function animateOverlapPrelude(ts){
  if(!overlapPreludeRunning||!overlapPreludeCtx)return;
  const W=window.innerWidth,H=window.innerHeight,d=window.devicePixelRatio||1,ctx=overlapPreludeCtx,t=(ts-overlapPreludeStartTs)/1000,bandX=W*OVERLAP_PRELUDE.bandRatio;
  ctx.setTransform(d,0,0,d,0,0);
  const bg=ctx.createLinearGradient(0,0,W,0);
  bg.addColorStop(0,'#949494');
  bg.addColorStop(0.34,'#828282');
  bg.addColorStop(0.67,'#131313');
  bg.addColorStop(1,'#020202');
  ctx.fillStyle=bg;
  ctx.fillRect(0,0,W,H);
  ctx.textBaseline='middle';
  ctx.textAlign='center';
  for(let i=0;i<overlapPreludeDense.length;i++){
    const d0=overlapPreludeDense[i];
    if(Math.random()<0.014)d0.char=(d0.tone==='light'&&Math.random()<0.56)?OVERLAP_PRELUDE_TOKENS[Math.floor(Math.random()*OVERLAP_PRELUDE_TOKENS.length)]:getPreludeChar();
    const x=d0.x+Math.sin(t*1.2+d0.seed)*d0.jitter+(Math.random()-0.5)*d0.jitter;
    const y=d0.y+Math.cos(t*0.9+d0.seed*0.7)*(d0.jitter*0.9)+(Math.random()-0.5)*0.7;
    const nearBand=1-Math.min(1,Math.abs(x-bandX)/(W*0.24));
    const alpha=Math.max(0.03,Math.min(0.76,d0.alpha+nearBand*0.16));
    ctx.font=`300 ${d0.size}pt 'Cormorant Garamond', serif`;
    if(d0.tone==='light')ctx.fillStyle=`rgba(234,230,224,${alpha})`;
    else ctx.fillStyle=`rgba(14,14,14,${alpha*0.9})`;
    ctx.fillText(d0.char,x,y);
  }
  for(let i=0;i<overlapPreludeFlow.length;i++){
    const g=overlapPreludeFlow[i];
    const attractX=bandX+Math.sin(t*1.05+g.seed)*W*0.042;
    if(g.fromBand){g.vx+=(g.x<attractX?-0.03:0.03);g.vx*=0.986;}
    else{g.vx+=(attractX-g.x)*0.007;g.vx*=0.992;}
    g.vy+=(Math.sin(t*1.6+g.seed)-0.5)*0.012;
    g.vy*=0.986;
    g.x+=g.vx;
    g.y+=g.vy;
    g.life-=1;
    g.alpha*=0.997;
    const out=g.x<-60||g.x>W+60||g.y<-50||g.y>H+50;
    if(g.life<=0||g.alpha<0.04||out){resetOverlapPreludeFlow(g,Math.random()<0.62);continue;}
    ctx.font=`300 ${OVERLAP_PRELUDE.charSize}pt 'Cormorant Garamond', serif`;
    if(g.tone==='light')ctx.fillStyle=`rgba(234,230,224,${Math.min(0.74,g.alpha)})`;
    else ctx.fillStyle=`rgba(8,8,8,${Math.min(0.82,g.alpha)})`;
    ctx.fillText(g.char,g.x,g.y);
  }
  const rightCloud=ctx.createLinearGradient(bandX+W*0.08,0,W,0);
  rightCloud.addColorStop(0,'rgba(0,0,0,0)');
  rightCloud.addColorStop(0.5,'rgba(0,0,0,0.08)');
  rightCloud.addColorStop(1,'rgba(0,0,0,0.22)');
  ctx.fillStyle=rightCloud;
  ctx.fillRect(bandX,0,W-bandX,H);
  const bandGrad=ctx.createLinearGradient(bandX-W*0.14,0,bandX+W*0.16,0);
  bandGrad.addColorStop(0,'rgba(0,0,0,0)');
  bandGrad.addColorStop(0.5,'rgba(0,0,0,0.16)');
  bandGrad.addColorStop(1,'rgba(0,0,0,0.36)');
  ctx.fillStyle=bandGrad;
  ctx.fillRect(bandX-W*0.22,0,W*0.44,H);
  ctx.fillStyle='rgba(0,0,0,0.14)';
  ctx.fillRect(0,0,W,H);
  for(let i=0;i<6;i++){
    const y=Math.random()*H;
    const h=1+Math.random()*2;
    const a=0.03+Math.random()*0.05;
    ctx.fillStyle=`rgba(255,255,255,${a})`;
    ctx.fillRect(0,y,W,h);
  }
  if(Math.random()<0.72){
    const slices=1+Math.floor(Math.random()*3);
    for(let i=0;i<slices;i++){
      const sy=Math.random()*H*0.92;
      const sh=10+Math.random()*42;
      const sxShift=(Math.random()-0.5)*34;
      ctx.globalAlpha=0.11+Math.random()*0.1;
      ctx.drawImage(overlapPreludeCanvas,0,sy,W,sh,sxShift,sy,W,sh);
      ctx.globalAlpha=1;
    }
  }
  overlapPreludeRAF=requestAnimationFrame(animateOverlapPrelude);
}
function startOverlapPrelude(){if(!overlapPreludeScreen||!overlapPreludeCtx){overlapScreen.classList.add('visible');randomizeDoorMotion();return;}buildOverlapPreludeScene();overlapPreludeScreen.classList.add('visible');overlapPreludeRunning=true;overlapPreludeStartTs=performance.now();if(overlapPreludeRAF)cancelAnimationFrame(overlapPreludeRAF);overlapPreludeRAF=requestAnimationFrame(animateOverlapPrelude);}
if(overlapPreludeScreen){overlapPreludeScreen.addEventListener('click',enterOverlapFromPrelude);}
function setupWaveCanvas(){if(!waveCanvas||!waveCtx)return;const d=window.devicePixelRatio||1;waveCanvas.width=window.innerWidth*d;waveCanvas.height=window.innerHeight*d;waveCanvas.style.width=window.innerWidth+'px';waveCanvas.style.height=window.innerHeight+'px';waveCtx.setTransform(d,0,0,d,0,0);}
function pickWaveText(){return WAVE_TEXTS[Math.floor(Math.random()*WAVE_TEXTS.length)]||WAVE_TEXTS[0];}
function initWaveStreams(){const W=window.innerWidth,H=window.innerHeight;const yBase=H*0.9;waveStreams=Array.from({length:9},(_,i)=>({text:pickWaveText(),x:-(Math.random()*W+W*0.38)+i*84,y:yBase+(Math.random()-0.5)*6,speed:1.35+Math.random()*1.35,alpha:0.56+Math.random()*0.28}));}
function animateWaveScene(ts){
  if(!waveRunning||!waveCtx)return;
  const W=window.innerWidth,H=window.innerHeight,ctx=waveCtx,t=(ts-waveStartTs)/1000;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle='#060606';
  ctx.fillRect(0,0,W,H);
  const baseY=H*0.46;
  const points=[];
  for(let x=0;x<=W;x+=5){
    const y=baseY+Math.sin((x*0.013)+t*2.35)*14+Math.sin((x*0.005)-t*1.2)*6;
    points.push({x,y});
  }
  const thickHead=((t*220)%(W+480))-240;
  for(let i=1;i<points.length;i++){
    const p0=points[i-1],p1=points[i];
    const ratio=i/(points.length-1);
    const pulse=0.9+Math.sin(t*2.4+ratio*4.2)*0.14;
    const nearHead=Math.max(0,1-Math.abs(p1.x-thickHead)/260);
    const width=(0.24+Math.pow(ratio,1.75)*4.8+nearHead*5.8)*pulse;
    const alpha=Math.min(0.92,0.2+ratio*0.55+nearHead*0.28);
    ctx.beginPath();
    ctx.moveTo(p0.x,p0.y);
    ctx.lineTo(p1.x,p1.y);
    ctx.lineWidth=width;
    ctx.strokeStyle=`rgba(232,228,223,${alpha})`;
    ctx.stroke();
  }
  ctx.font=`300 13pt 'Cormorant Garamond', serif`;
  ctx.textBaseline='middle';
  for(let i=0;i<waveStreams.length;i++){
    const s=waveStreams[i];
    s.x+=s.speed;
    if(s.x>W+420){
      s.x=-(220+Math.random()*W*0.44);
      s.y=H*0.9+(Math.random()-0.5)*6;
      s.speed=1.35+Math.random()*1.35;
      s.alpha=0.56+Math.random()*0.28;
      s.text=pickWaveText();
    }
    ctx.fillStyle=`rgba(232,228,223,${s.alpha})`;
    ctx.fillText(s.text,s.x,s.y);
  }
  waveRAF=requestAnimationFrame(animateWaveScene);
}
function startWaveScene(){if(!waveScreen||!waveCtx)return;setupWaveCanvas();initWaveStreams();waveRunning=true;waveStartTs=performance.now();if(waveRAF)cancelAnimationFrame(waveRAF);waveRAF=requestAnimationFrame(animateWaveScene);}
function stopWaveScene(){waveRunning=false;if(waveRAF)cancelAnimationFrame(waveRAF);waveRAF=null;waveStreams=[];}
function openWaveScreenFromDoor(){if(!overlapScreen.classList.contains('visible'))return;stopMixedHoverMode();overlapScreen.classList.remove('visible');setTimeout(()=>{waveScreen.classList.add('visible');startWaveScene();},SCREEN_SWITCH_DELAY_MS);}
function handleWaveBack(){stopWaveScene();waveScreen.classList.remove('visible');setTimeout(()=>{overlapScreen.classList.add('visible');randomizeDoorMotion();},SCREEN_SWITCH_DELAY_MS);}
const GLYPH_TOKENS=["time","dream","infinite","fire","the word is chess","forking","paths","none is the first page","all paths now","###","ooo","::","am I mad?","the invisible","happens now"];
function setupGlyphCanvas(){if(!glyphCanvas||!glyphCtx)return;const d=window.devicePixelRatio||1;glyphCanvas.width=window.innerWidth*d;glyphCanvas.height=window.innerHeight*d;glyphCanvas.style.width=window.innerWidth+'px';glyphCanvas.style.height=window.innerHeight+'px';glyphCtx.setTransform(d,0,0,d,0,0);}
function pickGlyphToken(){return GLYPH_TOKENS[Math.floor(Math.random()*GLYPH_TOKENS.length)]||"time";}
function buildGlyphLayout(){const W=window.innerWidth,H=window.innerHeight;glyphLayout=[];for(let i=0;i<96;i++){const kindRoll=Math.random();glyphLayout.push({x:Math.random()*W,y:Math.random()*H,angle:(Math.random()-0.5)*Math.PI*0.95,size:7.2+Math.random()*8.8,token:pickGlyphToken(),kind:kindRoll<0.52?'ribbon':(kindRoll<0.82?'cluster':'fragment'),count:kindRoll<0.52?8+Math.floor(Math.random()*16):4+Math.floor(Math.random()*10),spacing:7+Math.random()*13,jitter:0.6+Math.random()*4.2,drift:0.15+Math.random()*0.75,seed:Math.random()*Math.PI*2,alpha:0.38+Math.random()*0.45});}}
function drawGlyphUnit(ctx,u,t){const ox=Math.sin(t*u.drift+u.seed)*u.jitter,oy=Math.cos(t*u.drift*0.8+u.seed*0.7)*u.jitter;ctx.save();ctx.translate(u.x+ox,u.y+oy);ctx.rotate(u.angle);ctx.fillStyle=`rgba(236,236,236,${u.alpha})`;ctx.font=`300 ${u.size}pt 'Cormorant Garamond', serif`;if(u.kind==='ribbon'){for(let j=0;j<u.count;j++){ctx.fillText(u.token,j*u.spacing,Math.sin(j*0.4+t*1.1+u.seed)*1.2);}}else if(u.kind==='cluster'){const unit=String(u.token)[0]||"#";for(let r=0;r<5;r++){for(let c=0;c<5;c++){if(Math.random()<0.18)continue;ctx.fillText(unit,c*u.spacing*0.34,r*u.spacing*0.34);}}}else{ctx.fillText(u.token,0,0);if(Math.random()<0.46)ctx.fillText(u.token,u.spacing*0.9,u.spacing*0.22);}ctx.restore();}
function animateGlyphScene(ts){if(!glyphRunning||!glyphCtx)return;const ctx=glyphCtx,W=window.innerWidth,H=window.innerHeight,t=(ts-glyphStartTs)/1000;ctx.clearRect(0,0,W,H);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);for(let i=0;i<glyphLayout.length;i++){drawGlyphUnit(ctx,glyphLayout[i],t);}glyphRAF=requestAnimationFrame(animateGlyphScene);}
function startGlyphScene(){if(!glyphScreen||!glyphCtx)return;setupGlyphCanvas();buildGlyphLayout();glyphRunning=true;glyphStartTs=performance.now();if(glyphRAF)cancelAnimationFrame(glyphRAF);glyphRAF=requestAnimationFrame(animateGlyphScene);}
function stopGlyphScene(){glyphRunning=false;if(glyphRAF)cancelAnimationFrame(glyphRAF);glyphRAF=null;glyphLayout=[];}
function openGlyphScreenFromDoor(){if(!overlapScreen.classList.contains('visible'))return;stopMixedHoverMode();overlapScreen.classList.remove('visible');setTimeout(()=>{glyphScreen.classList.add('visible');startGlyphScene();},SCREEN_SWITCH_DELAY_MS);}
function handleGlyphBack(){stopGlyphScene();glyphScreen.classList.remove('visible');setTimeout(()=>{overlapScreen.classList.add('visible');randomizeDoorMotion();},SCREEN_SWITCH_DELAY_MS);}
function setupFramesCanvas(){if(!framesCanvas||!framesCtx)return;const d=window.devicePixelRatio||1;framesCanvas.width=window.innerWidth*d;framesCanvas.height=window.innerHeight*d;framesCanvas.style.width=window.innerWidth+'px';framesCanvas.style.height=window.innerHeight+'px';framesCtx.setTransform(d,0,0,d,0,0);}
function spawnFrameSquare(){frameSquares.push({size:10+Math.random()*24,grow:2.2+Math.random()*3.8,alpha:0.72+Math.random()*0.24,line:0.9+Math.random()*1.6,tilt:(Math.random()-0.5)*0.03});}
function animateFramesScene(ts){if(!framesRunning||!framesCtx)return;const ctx=framesCtx,W=window.innerWidth,H=window.innerHeight,cx=W*0.5,cy=H*0.5;ctx.clearRect(0,0,W,H);ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);if(!framesLastSpawn||ts-framesLastSpawn>95){spawnFrameSquare();framesLastSpawn=ts;}for(let i=frameSquares.length-1;i>=0;i--){const s=frameSquares[i];s.size+=s.grow;s.alpha*=0.986;if(s.alpha<0.02||s.size>Math.max(W,H)*1.8){frameSquares.splice(i,1);continue;}ctx.save();ctx.translate(cx,cy);ctx.rotate(s.tilt*s.size*0.1);ctx.strokeStyle=`rgba(232,228,223,${s.alpha})`;ctx.lineWidth=s.line;ctx.strokeRect(-s.size*0.5,-s.size*0.5,s.size,s.size);ctx.restore();}framesRAF=requestAnimationFrame(animateFramesScene);}
function startFramesScene(){if(!framesScreen||!framesCtx)return;setupFramesCanvas();frameSquares=[];framesLastSpawn=0;framesRunning=true;if(framesRAF)cancelAnimationFrame(framesRAF);framesRAF=requestAnimationFrame(animateFramesScene);}
function stopFramesScene(){framesRunning=false;if(framesRAF)cancelAnimationFrame(framesRAF);framesRAF=null;frameSquares=[];framesLastSpawn=0;}
function openFramesScreenFromDoor(){if(!overlapScreen.classList.contains('visible'))return;stopMixedHoverMode();overlapScreen.classList.remove('visible');setTimeout(()=>{framesScreen.classList.add('visible');startFramesScene();},SCREEN_SWITCH_DELAY_MS);}
function handleFramesBack(){stopFramesScene();framesScreen.classList.remove('visible');setTimeout(()=>{overlapScreen.classList.add('visible');randomizeDoorMotion();},SCREEN_SWITCH_DELAY_MS);}
document.querySelectorAll('.menu-rect').forEach(r=>{r.addEventListener('click',()=>{const p=r.dataset.page;menuScreen.classList.remove('visible');backBtn.classList.remove('visible');setTimeout(()=>{screens[p].classList.add('visible');if(p==='garden')startGarden();if(p==='sand')startSand();if(p==='ruins')startRuins();},SCREEN_SWITCH_DELAY_MS);});});
function goToOverlapScreen(){menuScreen.classList.remove('visible');backBtn.classList.remove('visible');setTimeout(startOverlapPrelude,SCREEN_SWITCH_DELAY_MS);}
function backToMenu(s,fn){s.classList.remove('visible');if(fn)fn();setTimeout(()=>{menuScreen.classList.add('visible');backBtn.classList.add('visible');},SCREEN_SWITCH_DELAY_MS);}
document.getElementById('gardenBack').addEventListener('click',handleGardenBack);
document.getElementById('sandBack').addEventListener('click',handleSandBack);
document.getElementById('ruinsBack').addEventListener('click',handleRuinsBack);
document.getElementById('overlapBack').addEventListener('click',()=>backToMenu(overlapScreen));
document.getElementById('mixedBack').addEventListener('click',handleMixedBack);
document.getElementById('waveBack').addEventListener('click',handleWaveBack);
document.getElementById('glyphBack').addEventListener('click',handleGlyphBack);
document.getElementById('framesBack').addEventListener('click',handleFramesBack);
// ============================================================
//  마우스 빛 + 겹치는 영역
// ============================================================
const mouseGlow=document.getElementById('mouseGlow');
document.addEventListener('mousemove',e=>{mouseGlow.style.left=e.clientX+'px';mouseGlow.style.top=e.clientY+'px';});
const overlapGlow=document.getElementById('overlapGlow');
function calcOverlap(){const c=document.querySelector('.menu-container');if(!c)return;const cR=c.getBoundingClientRect(),rs=document.querySelectorAll('.menu-rect');if(rs.length<3)return;const b=[];rs.forEach(r=>{const x=r.getBoundingClientRect();b.push({left:x.left,right:x.right,top:x.top,bottom:x.bottom});});const oL=Math.max(b[0].left,b[1].left,b[2].left),oR=Math.min(b[0].right,b[1].right,b[2].right),oT=Math.max(b[0].top,b[1].top,b[2].top),oB=Math.min(b[0].bottom,b[1].bottom,b[2].bottom);if(oL<oR&&oT<oB){overlapGlow.style.left=(oL-cR.left)+'px';overlapGlow.style.top=(oT-cR.top)+'px';overlapGlow.style.width=(oR-oL)+'px';overlapGlow.style.height=(oB-oT)+'px';overlapGlow.style.display='block';overlapGlow.classList.add('active');}}
const obs=new MutationObserver(()=>{if(menuScreen.classList.contains('visible'))setTimeout(calcOverlap,100);});
obs.observe(menuScreen,{attributes:true,attributeFilter:['class']});
window.addEventListener('resize',()=>{calcOverlap();if(overlapPreludeRunning)buildOverlapPreludeScene();if(waveRunning){setupWaveCanvas();initWaveStreams();}if(glyphRunning){setupGlyphCanvas();buildGlyphLayout();}if(framesRunning){setupFramesCanvas();}});
overlapGlow.addEventListener('mouseenter',()=>overlapGlow.classList.add('hovering'));
overlapGlow.addEventListener('mouseleave',()=>overlapGlow.classList.remove('hovering'));
overlapGlow.addEventListener('click',()=>{if(menuScreen.classList.contains('visible'))goToOverlapScreen();});
// ============================================================
//  Garden (동일)
// ============================================================
const gardenText=`In all fiction, when a man is faced with alternatives he chooses one at the expense of the others. In the almost unfathomable Ts'ui Pen, he chooses\u2014simultaneously\u2014all of them. He thus creates various futures, various times which start others that will in their turn branch out and bifurcate in other times. This is the cause of the contradictions in the novel. Fang, let us say, has a secret. A stranger knocks at his door. Fang makes up his mind to kill him. Naturally there are various possible outcomes. Fang can kill the intruder, the intruder can kill Fang, both can be saved, both can die and so on and so on. In Ts'ui Pen's work, all the possible solutions occur, each one being the point of departure for other bifurcations. \uBAA8\uB4E0 \uC18C\uC124\uC5D0\uC11C, \uC0AC\uB78C\uC774 \uC120\uD0DD\uC758 \uAE30\uB85C\uC5D0 \uB193\uC600\uC744 \uB54C \uADF8\uB294 \uB2E4\uB978 \uAC83\uB4E4\uC744 \uD76C\uC0DD\uD558\uBA70 \uD558\uB098\uB97C \uC120\uD0DD\uD55C\uB2E4. \uAC70\uC758 \uD5E4\uC544\uB9B4 \uC218 \uC5C6\uB294 \uCD5C\uD68C\uD39C\uC758 \uACBD\uC6B0, \uADF8\uB294 \uBAA8\uB4E0 \uAC83\uC744 \uB3D9\uC2DC\uC5D0 \uC120\uD0DD\uD55C\uB2E4. In a guessing game to which the answer is chess, which word is the only one prohibited? I thought for a moment and then replied: 'The word is chess.' 'Precisely,' said Albert. 'The Garden of Forking Paths is an enormous guessing game, or parable, in which the subject is time. The rules of the game forbid the use of the word itself. To eliminate a word completely, to refer to it by means of inept phrases and obvious paraphrases, is perhaps the best way of drawing attention to it. This, then, is the tortuous method of approach preferred by the oblique Ts'ui Pen in every meandering of his interminable novel.' \uB2F5\uC774 \uCCB4\uC2A4\uC778 \uC218\uC218\uAED8\uB07C \uAC8C\uC784\uC5D0\uC11C, \uC720\uC77C\uD558\uAC8C \uAE08\uC9C0\uB41C \uB2E8\uC5B4\uB294 \uBB34\uC5C7\uC778\uAC00? Then I reflected that all things happen, happen to one, precisely now. Century follows century, and things happen only in the present. There are countless men in the air, on land and at sea, and all that really happens happens to me. \uADF8\uB54C \uB098\uB294 \uBAA8\uB4E0 \uAC83\uC774 \uC77C\uC5B4\uB098\uACE0, \uD55C \uC0AC\uB78C\uC5D0\uAC8C \uC77C\uC5B4\uB098\uBA70, \uC815\uD655\uD788 \uC9C0\uAE08 \uC77C\uC5B4\uB09C\uB2E4\uB294 \uAC83\uC744 \uAE68\uB2EC\uC558\uB2E4. For a moment I thought that Richard Madden might in some way have divined my desperate intent. I know something about labyrinths. Not for nothing am I the greatgrandson of Ts'ui Pen. He was Governor of Yunnan and gave up temporal power to write a novel with more characters than there are in the Hung Lou Meng, and to create a maze in which all men would lose themselves. He spent thirteen years on these oddly assorted tasks before he was assassinated by a stranger. \uC7A0\uC2DC \uB098\uB294 \uB9AC\uCCD0\uB4DC \uB9E4\uB4E0\uC774 \uC5B4\uB5A4 \uC2DD\uC73C\uB85C\uB4E0 \uB098\uC758 \uD544\uC0AC\uC801\uC778 \uC758\uB3C4\uB97C \uC54C\uC544\uCC28\uB838\uC744\uC9C0\uB3C4 \uBAA8\uB978\uB2E4\uACE0 \uC0DD\uAC01\uD588\uB2E4.`;
const gardenTailText=" He spent thirteen years on these oddly assorted tasks before he was assassinated by a stranger. Not for nothing am I the greatgrandson of Ts'ui Pen who was Governor of Yunnan and gave up temporal power to write a novel and to create a maze in which all men would lose themselves forever and ever and ever...";
const gardenBridgeText=`"In a guessing game to which the answer is chess, which word is the only one prohibited? I thought for a moment and then replied: 'The word is chess.' 'Precisely,' said Albert. 'The Garden of Forking Paths is an enormous guessing game, or parable, in which the subject is time. The rules of the game forbid the use of the word itself. To eliminate a word completely, to refer to it by means of inept phrases and obvious paraphrases, is perhaps the best way of drawing attention to it. This, then, is the tortuous method of approach preferred by the oblique Ts'ui Pen in every meandering of his interminable novel.'"`;
const gardenSpiralText=gardenText.replace(/In a guessing game to which the answer is chess,[\s\S]*?interminable novel\.'\s*/,'');
const gardenCanvas=document.getElementById('gardenCanvas'), gCtx=gardenCanvas.getContext('2d'), gardenScroller=document.getElementById('gardenScroller');
const gardenWordsEl=document.getElementById('gardenWords');
const gardenQuoteEl=document.getElementById('gardenQuote');
const gardenNowEl=document.getElementById('gardenNow');
const gardenPage1El=document.getElementById('gardenPage1');
let gardenAnimRAF=null,gardenDrawn=0,gardenLetters=[],gardenDone=false,gardenRevealCarry=0,gardenLastTs=0,gardenBridgeStartY=0,gardenBridgeEndY=0;
let gardenQuoteExited=false,gardenTransitioning=false;
const G={centerX:0.5,centerY:0.5,baseRadius:20,ringSpacing:15,fontSize:14,fontUnit:'pt',charSpacing:6.5,wobbleAmt:20,wobbleFreq:2.2,typingCharsPerSec:1300,fontFamily:"'Cormorant Garamond', serif",fontWeight:'300',textColor:[232,228,223],textOpacity:0.88,tailStartAngle:0.3,tailCurve:0.001,tailCharSpacing:7,bridgeTailCurve:0.00045,bridgeTailCharSpacing:7.1,scrollHeightRatio:2.62};
function ringRadius(bR,a,s){return bR+Math.sin(a*G.wobbleFreq+s)*G.wobbleAmt*(bR/160)+Math.sin(a*G.wobbleFreq*1.8+s*2.1)*G.wobbleAmt*0.5*(bR/180)+Math.cos(a*G.wobbleFreq*0.6+s*0.8)*G.wobbleAmt*0.35*(bR/200);}
function getGardenLayoutHeight(){return Math.round(window.innerHeight*G.scrollHeightRatio);}
function setupGardenCanvas(){const d=window.devicePixelRatio||1;const layoutH=getGardenLayoutHeight();if(gardenPage1El)gardenPage1El.style.height=layoutH+'px';gardenCanvas.width=window.innerWidth*d;gardenCanvas.height=layoutH*d;gardenCanvas.style.width=window.innerWidth+'px';gardenCanvas.style.height=layoutH+'px';gCtx.setTransform(d,0,0,d,0,0);}
function pushGardenTail(chars,startX,startY,startAngle,spacing,curve,limitW,limitH){let tx=startX,ty=startY,ta=startAngle,firstY=null,lastY=startY;for(let i=0;i<chars.length;i++){tx+=Math.cos(ta)*spacing;ty+=Math.sin(ta)*spacing;ta+=curve;if(tx>limitW+120||tx<-120||ty>limitH+160||ty<-120)break;gardenLetters.push({char:chars[i],x:tx,y:ty,rotation:ta+Math.PI/2,opacity:G.textOpacity,fontSize:G.fontSize});if(firstY===null)firstY=ty;lastY=ty;}return{x:tx,y:ty,a:ta,startY:firstY===null?startY:firstY,endY:lastY};}
function pushGardenBridgeTail(chars,startX,startY,startAngle,spacing,limitW,limitH){let tx=startX,ty=startY,ta=startAngle,firstY=null,lastY=startY;for(let i=0;i<chars.length;i++){const bend=Math.sin(i*0.06)*0.25;const stepA=ta+bend;tx+=Math.cos(stepA)*spacing;ty+=Math.sin(stepA)*spacing+0.9;ta+=G.bridgeTailCurve+Math.sin(i*0.03)*0.00008;if(tx>limitW+140||tx<-140||ty>limitH+180||ty<-120)break;gardenLetters.push({char:chars[i],x:tx,y:ty,rotation:stepA+Math.PI/2,opacity:G.textOpacity,fontSize:G.fontSize});if(firstY===null)firstY=ty;lastY=ty;}return{x:tx,y:ty,a:ta,startY:firstY===null?startY:firstY,endY:lastY};}
function precomputeGarden(){gardenLetters=[];gardenBridgeStartY=0;gardenBridgeEndY=0;setupGardenCanvas();const W=window.innerWidth,H=getGardenLayoutHeight(),cx=W*G.centerX,cy=window.innerHeight*G.centerY,chars=gardenSpiralText.split('');let ci=0,ri=0;while(ci<chars.length&&ri<80){const bR=G.baseRadius+ri*G.ringSpacing,seed=ri*1.9;let a=ri*0.45+Math.sin(ri*0.8)*0.35;const ea=a+Math.PI*2;while(a<ea&&ci<chars.length){const r=ringRadius(bR,a,seed),x=cx+r*Math.cos(a),y=cy+r*Math.sin(a);if(x<-40||x>W+40||y<-40||y>H+40){a+=G.charSpacing/r;continue;}gardenLetters.push({char:chars[ci],x,y,rotation:a+Math.PI/2,opacity:G.textOpacity,fontSize:G.fontSize});ci++;a+=G.charSpacing/r;}ri++;}if(gardenLetters.length>0){const l=gardenLetters[gardenLetters.length-1];const t1=pushGardenTail(gardenTailText.split(''),l.x,l.y,G.tailStartAngle,G.tailCharSpacing,G.tailCurve,W,H);const t2=pushGardenBridgeTail(gardenBridgeText.split(''),t1.x,t1.y,t1.a,G.bridgeTailCharSpacing,W,H);gardenBridgeStartY=t2.startY;gardenBridgeEndY=t2.endY;}}
function drawGarden(){const d=window.devicePixelRatio||1;const clearH=parseFloat(gardenCanvas.style.height)||window.innerHeight;gCtx.setTransform(d,0,0,d,0,0);gCtx.clearRect(0,0,window.innerWidth,clearH);gCtx.textAlign='center';gCtx.textBaseline='middle';const c=Math.min(gardenDrawn,gardenLetters.length);for(let i=0;i<c;i++){const l=gardenLetters[i];gCtx.save();gCtx.translate(l.x,l.y);gCtx.rotate(l.rotation);gCtx.font=`${G.fontWeight} ${l.fontSize}${G.fontUnit} ${G.fontFamily}`;gCtx.fillStyle=`rgba(${G.textColor[0]},${G.textColor[1]},${G.textColor[2]},${l.opacity})`;gCtx.fillText(l.char,0,0);gCtx.restore();}}
function finishGardenTyping(){if(gardenDone)return;if(gardenAnimRAF)cancelAnimationFrame(gardenAnimRAF);gardenAnimRAF=null;gardenDrawn=gardenLetters.length;gardenDone=true;drawGarden();}
function gardenRevealFrame(ts){if(gardenDone)return;if(!gardenLastTs)gardenLastTs=ts;const dt=Math.min(50,ts-gardenLastTs);gardenLastTs=ts;gardenRevealCarry+=(G.typingCharsPerSec*dt)/1000;const add=Math.floor(gardenRevealCarry);if(add>0){gardenDrawn=Math.min(gardenLetters.length,gardenDrawn+add);gardenRevealCarry-=add;drawGarden();}if(gardenDrawn>=gardenLetters.length){gardenDone=true;gardenAnimRAF=null;drawGarden();return;}gardenAnimRAF=requestAnimationFrame(gardenRevealFrame);}
function hideGardenWords(){
  if(gardenQuoteEl)gardenQuoteEl.classList.remove('visible','exiting');
  if(gardenNowEl)gardenNowEl.classList.remove('visible');
  if(gardenWordsEl)gardenWordsEl.classList.remove('quote-cleared');
  gardenQuoteExited=false;
}
function revealGardenWordsImmediately(){
  if(gardenQuoteEl)gardenQuoteEl.classList.add('visible');
  if(gardenNowEl)gardenNowEl.classList.add('visible');
}
function gardenScrollCheck(){
  const s=gardenScroller.scrollTop,H=window.innerHeight;
  const page1H=gardenPage1El?gardenPage1El.offsetHeight:getGardenLayoutHeight();
  const maxScroll=Math.max(0,gardenScroller.scrollHeight-gardenScroller.clientHeight);
  if(s>H*0.05)finishGardenTyping();
  const baseRevealStart=Math.max(H*0.42,page1H-H*1.18);
  const bridgeRevealStart=gardenBridgeEndY>0?Math.max(H*0.62,gardenBridgeEndY-H*0.78):baseRevealStart;
  const revealStart=Math.max(baseRevealStart,bridgeRevealStart);
  if(s<revealStart)return;
  const quoteRevealStart=revealStart+H*0.02;
  const nowRevealStart=Math.min(revealStart+H*1.15,Math.max(quoteRevealStart+H*0.55,maxScroll-H*0.18));
  const quoteExitStart=Math.min(nowRevealStart+H*0.62,maxScroll-H*0.03);
  if(s>quoteRevealStart&&gardenQuoteEl)gardenQuoteEl.classList.add('visible');
  if(s>nowRevealStart&&gardenNowEl)gardenNowEl.classList.add('visible');
  if(s>quoteExitStart&&!gardenQuoteExited){
    if(gardenQuoteEl)gardenQuoteEl.classList.add('exiting');
    if(gardenWordsEl)gardenWordsEl.classList.add('quote-cleared');
    gardenQuoteExited=true;
  }else if(s<quoteExitStart-H*0.08&&gardenQuoteExited){
    if(gardenQuoteEl)gardenQuoteEl.classList.remove('exiting');
    if(gardenWordsEl)gardenWordsEl.classList.remove('quote-cleared');
    gardenQuoteExited=false;
  }
  if(s>maxScroll-H*0.04)revealGardenWordsImmediately();
}
function startGarden(){
  gardenDrawn=0;gardenDone=false;gardenRevealCarry=0;gardenLastTs=0;
  gardenTransitioning=false;
  gardenScreen.classList.remove('garden-exit');
  gardenScroller.scrollTop=0;
  hideGardenWords();
  precomputeGarden();
  drawGarden();
  gardenScroller.addEventListener('scroll',gardenScrollCheck);
  gardenAnimRAF=requestAnimationFrame(gardenRevealFrame);
}
function stopGarden(){
  if(gardenAnimRAF)cancelAnimationFrame(gardenAnimRAF);
  gardenAnimRAF=null;
  gardenScroller.removeEventListener('scroll',gardenScrollCheck);
  gardenScroller.scrollTop=0;
  gardenDrawn=0;gardenDone=false;gardenRevealCarry=0;gardenLastTs=0;
  gardenTransitioning=false;
  hideGardenWords();
}
function handleGardenBack(){if(gardenTransitioning)return;if(gardenScroller.scrollTop>window.innerHeight*0.15){gardenScroller.scrollTo({top:0,behavior:'smooth'});return;}backToMenu(gardenScreen,stopGarden);}
function goFromGardenNow(){
  if(gardenTransitioning||!gardenScreen.classList.contains('visible'))return;
  if(!gardenNowEl||!gardenNowEl.classList.contains('visible'))return;
  gardenTransitioning=true;
  gardenScreen.classList.add('garden-exit');
  setTimeout(()=>{
    stopGarden();
    gardenScreen.classList.remove('visible');
    gardenScreen.classList.remove('garden-exit');
    startOverlapPrelude();
    gardenTransitioning=false;
  },520);
}
if(gardenNowEl){
  gardenNowEl.addEventListener('click',(e)=>{
    e.stopPropagation();
    goFromGardenNow();
  });
}
window.addEventListener('resize',()=>{if(gardenScreen.classList.contains('visible')&&gardenDone){precomputeGarden();gardenDrawn=gardenLetters.length;drawGarden();}});
// ============================================================
//  Book of Sand (동일)
// ============================================================
const sandParagraphs = [
  `'The number of pages in this book is no more or less than infinite. None is the first page, none the last. I don't know why they're numbered in this arbitrary way. Perhaps to suggest that the terms of an infinite series admit any number.' Then, as if he were thinking aloud, he said, 'If space is infinite, we may be at any point in space. If time is infinite, we may be at any point in time.'`,
  `If space is infinite, we may be at any point in space. If time is infinite, we may be at any point in time.`,
  `I thought of keeping the Book of Sand in the space left on the shelf by the Wiclif, but in the end I decided to hide it behind the volumes of a broken set of The Thousand and One Nights. I went to bed and did not sleep. At three or four in the morning, I turned on the light. I got down the impossible book and leafed through its pages. On one of them I saw engraved a mask. The upper corner of the page carried a number, which I no longer recall, elevated to the ninth power. I showed no one my treasure. To the luck of owning it was added the fear of having it stolen, and then the misgiving that it might not truly be infinite.`,
  `Summer came and went, and I realized that the book was monstrous. What good did it do me to think that I, who looked upon the volume with my eyes, who held it in my hands, was any less monstrous? I felt that the book was a nightmarish object, an obscene thing that affronted and tainted reality itself. I thought of fire, but I feared that the burning of an infinite book might likewise prove infinite and suffocate the planet with smoke.`
];
const sandPageStyles = [
  { fontSizeDelta: 0, lineHeightDelta: 0, centerOffsetY: 0, entryMode: 'fly', flySpeedMultiplier: 1, showClock: false, showNumbers: false },
  { fontSizeDelta: 0, lineHeightDelta: 7, centerOffsetY: 0, entryMode: 'instant', flySpeedMultiplier: 1, showClock: true, showNumbers: false },
  { fontSizeDelta: 0, lineHeightDelta: 4, centerOffsetY: 0, entryMode: 'fly', flySpeedMultiplier: 1, showClock: false, showNumbers: true },
  { fontSizeDelta: 0, lineHeightDelta: 6, centerOffsetY: 0, entryMode: 'fly', flySpeedMultiplier: 0.72, showClock: false, showNumbers: false },
];
const sandCanvas = document.getElementById('sandCanvas');
const sCtx = sandCanvas.getContext('2d');
const sandFxCanvas = document.getElementById('sandFxCanvas');
const fxCtx = sandFxCanvas.getContext('2d');
const clockCanvas = document.getElementById('clockCanvas');
const clkCtx = clockCanvas.getContext('2d');
const sandFeuOverlay = document.getElementById('sandFeuOverlay');
const sandContinueBtn = document.getElementById('sandContinueBtn');
const sandFlash = document.getElementById('sandFlash');
let sandParticles = [], sandPhase = 0, sandAnimRAF = null, sandReady = false;
let clockRunning = false, clockRAF = null, clockLines = [];
let sandNumbers = [];
let sandTransitioning = false, sandBurningOut = false;
let sandSwapTimeout = null, sandWormholeTimeout = null, sandFlashTimeout = null;
let sandPendingPhase = null;
let sandNumberMode = false;
const S = {
  fontSize: 14, fontUnit: 'pt', lineHeight: 24, maxWidthRatio: 0.78,
  fontFamily: "'Cormorant Garamond', serif", fontWeight: '300',
  textColor: [232, 228, 223], textOpacity: 0.85,
  flySpeed: 0.06, flySpread: 600,
  collapseGravity: 0.15, collapseSpreadX: 3, collapseFade: 0.003,
  fadeOutSpeed: 0.04, fadeInSpeed: 0.06,
  suckSpeed: 0.04, suckRotateSpeed: 0.08,
  clockRadius: 80, clockHandColor: [232, 228, 223], clockHandWidth: 1.5,
  clockSpeed: 0.02, lineGrowSpeed: 8, lineSpawnRate: 3,
  lineColor: [232, 228, 223], lineOpacity: 0.5, lineWidth: 0.8, maxLines: 200,
  numberCount: 85, numberSpeedMin: 0.12, numberSpeedMax: 0.55,
  ashFade: 0.024, ashLift: 0.6, ashSpreadX: 1.2, ashSpreadY: 0.55,
  ashJitter: 0.11, ashRotate: 0.03, ashColor: [170, 170, 170],
};
function getSandStyle(phase){return sandPageStyles[Math.max(0,Math.min(phase,sandPageStyles.length-1))];}
function showSandFeuOverlay(){if(sandFeuOverlay)sandFeuOverlay.classList.add('visible');}
function hideSandFeuOverlay(){if(sandFeuOverlay)sandFeuOverlay.classList.remove('visible');}
function setupSandCanvas(){const d=window.devicePixelRatio||1;sandCanvas.width=window.innerWidth*d;sandCanvas.height=window.innerHeight*d;sandCanvas.style.width=window.innerWidth+'px';sandCanvas.style.height=window.innerHeight+'px';sCtx.setTransform(d,0,0,d,0,0);}
function setupSandFxCanvas(){const d=window.devicePixelRatio||1;sandFxCanvas.width=window.innerWidth*d;sandFxCanvas.height=window.innerHeight*d;sandFxCanvas.style.width=window.innerWidth+'px';sandFxCanvas.style.height=window.innerHeight+'px';fxCtx.setTransform(d,0,0,d,0,0);}
function setupClockCanvas(){const d=window.devicePixelRatio||1;clockCanvas.width=window.innerWidth*d;clockCanvas.height=window.innerHeight*d;clockCanvas.style.width=window.innerWidth+'px';clockCanvas.style.height=window.innerHeight+'px';clkCtx.setTransform(d,0,0,d,0,0);}
function layoutText(txt,style){const fontSize=S.fontSize+style.fontSizeDelta;const lineHeight=S.lineHeight+style.lineHeightDelta;const W=window.innerWidth,maxW=W*S.maxWidthRatio;sCtx.font=`${S.fontWeight} ${fontSize}${S.fontUnit} ${S.fontFamily}`;const words=txt.split(' ');let line='';const lines=[];words.forEach(word=>{const test=line+(line?' ':'')+word;if(sCtx.measureText(test).width>maxW&&line){lines.push(line);line=word;}else{line=test;}});if(line)lines.push(line);const result=[];const totalH=lines.length*lineHeight;const startY=(window.innerHeight-totalH)*0.5+(lineHeight*0.5)+(style.centerOffsetY||0);lines.forEach((ln,i)=>{const lineW=sCtx.measureText(ln).width;let xPos=(window.innerWidth-lineW)*0.5;const yPos=startY+(i*lineHeight);for(const c of ln){result.push({char:c,homeX:xPos,homeY:yPos});xPos+=sCtx.measureText(c).width;}});return result;}
function createSandParticles(txt,mode,style){setupSandCanvas();const layout=layoutText(txt,style);sandParticles=layout.map(l=>{const angle=Math.random()*Math.PI*2;const dist=S.flySpread+Math.random()*S.flySpread;const isFly=mode==='fly';const isInstant=mode==='instant';return{char:l.char,homeX:l.homeX,homeY:l.homeY,x:isFly?l.homeX+Math.cos(angle)*dist:l.homeX,y:isFly?l.homeY+Math.sin(angle)*dist:l.homeY,alpha:isFly?0:(isInstant?S.textOpacity:0),targetAlpha:S.textOpacity,vx:0,vy:0,flySpeed:S.flySpeed*style.flySpeedMultiplier,arrived:mode!=='fly',falling:false,sucking:false,ashing:false,rot:0,scale:1,ashGlyph:null,};});}
function initSandNumbers(){sandNumbers=Array.from({length:S.numberCount},()=>({digit:String(Math.floor(Math.random()*10)),x:Math.random()*window.innerWidth,y:Math.random()*window.innerHeight,size:14,vx:(Math.random()-0.5)*0.28,vy:S.numberSpeedMin+Math.random()*(S.numberSpeedMax-S.numberSpeedMin),alpha:0.08+Math.random()*0.35,}));}
function drawSandNumbers(){const d=window.devicePixelRatio||1;fxCtx.setTransform(d,0,0,d,0,0);fxCtx.clearRect(0,0,window.innerWidth,window.innerHeight);if(!sandNumberMode)return;sandNumbers.forEach(n=>{n.y-=n.vy;n.x+=n.vx;if(n.y<-30){n.y=window.innerHeight+20;n.x=Math.random()*window.innerWidth;}if(n.x<-20)n.x=window.innerWidth+20;if(n.x>window.innerWidth+20)n.x=-20;if(Math.random()<0.015)n.digit=String(Math.floor(Math.random()*10));fxCtx.font=`300 ${n.size}${S.fontUnit} ${S.fontFamily}`;fxCtx.fillStyle=`rgba(232,228,223,${n.alpha})`;fxCtx.fillText(n.digit,n.x,n.y);});}
function drawSand(){const d=window.devicePixelRatio||1;sCtx.setTransform(d,0,0,d,0,0);sCtx.clearRect(0,0,window.innerWidth,window.innerHeight);const style=getSandStyle(Math.min(sandPhase,sandPageStyles.length-1));const fontSize=S.fontSize+style.fontSizeDelta;sCtx.font=`${S.fontWeight} ${fontSize}${S.fontUnit} ${S.fontFamily}`;sCtx.textBaseline='middle';sCtx.textAlign='left';sandParticles.forEach(p=>{if(p.alpha<=0)return;sCtx.save();sCtx.translate(p.x,p.y);if(p.rot)sCtx.rotate(p.rot);if(p.scale!==1)sCtx.scale(p.scale,p.scale);sCtx.fillStyle=p.ashing?`rgba(${S.ashColor[0]},${S.ashColor[1]},${S.ashColor[2]},${p.alpha})`:`rgba(${S.textColor[0]},${S.textColor[1]},${S.textColor[2]},${p.alpha})`;sCtx.fillText((p.ashing&&p.ashGlyph)?p.ashGlyph:p.char,0,0);sCtx.restore();});}
function animateSand(){
  let allDone=true;
  const cx=window.innerWidth/2,cy=window.innerHeight/2;
  sandParticles.forEach(p=>{
    if(p.sucking){
      const dx=cx-p.x,dy=cy-p.y;
      const dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>5){
        p.x+=dx*S.suckSpeed;
        p.y+=dy*S.suckSpeed;
        p.rot+=S.suckRotateSpeed;
        p.alpha*=0.98;
        allDone=false;
      }else{
        p.alpha=0;
      }
    }else if(p.ashing){
      p.vx+=(Math.random()-0.5)*S.ashJitter;
      p.vy+=(Math.random()-0.5)*S.ashJitter;
      p.vy-=S.ashLift*0.01;
      p.x+=p.vx;
      p.y+=p.vy;
      p.rot+=(Math.random()-0.5)*S.ashRotate;
      p.scale=Math.max(0.35,p.scale*0.992);
      p.alpha=Math.max(0,p.alpha-S.ashFade);
      if(p.alpha>0.01)allDone=false;
    }else if(p.falling){
      p.vy+=S.collapseGravity;
      p.vx+=(Math.random()-0.5)*S.collapseSpreadX;
      p.x+=p.vx;
      p.y+=p.vy;
      p.alpha-=S.collapseFade;
      if(p.alpha>0)allDone=false;
    }else if(!p.arrived){
      p.x+=(p.homeX-p.x)*p.flySpeed;
      p.y+=(p.homeY-p.y)*p.flySpeed;
      p.alpha+=(p.targetAlpha-p.alpha)*p.flySpeed;
      if(Math.abs(p.x-p.homeX)<0.5&&Math.abs(p.y-p.homeY)<0.5){
        p.x=p.homeX;
        p.y=p.homeY;
        p.alpha=p.targetAlpha;
        p.arrived=true;
      }else{
        allDone=false;
      }
    }else if(p.targetAlpha!==p.alpha){
      if(p.targetAlpha<p.alpha)p.alpha=Math.max(p.targetAlpha,p.alpha-S.fadeOutSpeed);
      else p.alpha=Math.min(p.targetAlpha,p.alpha+S.fadeInSpeed);
      if(Math.abs(p.alpha-p.targetAlpha)>0.01)allDone=false;
    }
  });
  if(sandPendingPhase!==null&&allDone){
    const pending=sandPendingPhase;
    sandPendingPhase=null;
    setSandPhase(pending,'instant');
    sandTransitioning=false;
    allDone=false;
  }
  drawSandNumbers();
  drawSand();
  if(allDone&&!sandTransitioning&&!sandReady&&sandPhase<4){
    sandReady=true;
    sandCanvas.style.cursor='pointer';
    sandContinueBtn.classList.add('visible');
  }
  if(sandBurningOut&&allDone){
    sandBurningOut=false;
    sandTransitioning=false;
    setTimeout(()=>{
      hideSandFeuOverlay();
      setTimeout(()=>{
        sandScreen.classList.remove('visible');
        stopSand();
        setTimeout(()=>{overlapScreen.classList.add('visible');randomizeDoorMotion();},SCREEN_SWITCH_DELAY_MS);
      },SAND_GIF_FADE_OUT_MS);
    },SAND_GIF_EXTRA_HOLD_MS);
  }
  sandAnimRAF=requestAnimationFrame(animateSand);
}
let clockAngle=0;let clockFrameCount=0;
function drawClock(){const d=window.devicePixelRatio||1;clkCtx.setTransform(d,0,0,d,0,0);clkCtx.clearRect(0,0,window.innerWidth,window.innerHeight);const cx=window.innerWidth/2,cy=window.innerHeight/2;const R=S.clockRadius;clkCtx.beginPath();clkCtx.arc(cx,cy,R,0,Math.PI*2);clkCtx.strokeStyle=`rgba(${S.clockHandColor[0]},${S.clockHandColor[1]},${S.clockHandColor[2]},0.3)`;clkCtx.lineWidth=1;clkCtx.stroke();clkCtx.beginPath();clkCtx.arc(cx,cy,2,0,Math.PI*2);clkCtx.fillStyle=`rgba(${S.clockHandColor[0]},${S.clockHandColor[1]},${S.clockHandColor[2]},0.8)`;clkCtx.fill();clockAngle+=S.clockSpeed;const h1x=cx+Math.cos(clockAngle)*R*0.7;const h1y=cy+Math.sin(clockAngle)*R*0.7;clkCtx.beginPath();clkCtx.moveTo(cx,cy);clkCtx.lineTo(h1x,h1y);clkCtx.strokeStyle=`rgba(${S.clockHandColor[0]},${S.clockHandColor[1]},${S.clockHandColor[2]},0.7)`;clkCtx.lineWidth=S.clockHandWidth;clkCtx.stroke();const h2a=clockAngle*0.08;const h2x=cx+Math.cos(h2a)*R*0.5;const h2y=cy+Math.sin(h2a)*R*0.5;clkCtx.beginPath();clkCtx.moveTo(cx,cy);clkCtx.lineTo(h2x,h2y);clkCtx.strokeStyle=`rgba(${S.clockHandColor[0]},${S.clockHandColor[1]},${S.clockHandColor[2]},0.5)`;clkCtx.lineWidth=S.clockHandWidth+0.5;clkCtx.stroke();clockFrameCount++;if(clockFrameCount%S.lineSpawnRate===0&&clockLines.length<S.maxLines){const angle=clockAngle+(Math.random()-0.5)*0.3;clockLines.push({x:h1x,y:h1y,angle:angle,length:0,maxLength:150+Math.random()*400,alpha:S.lineOpacity});const angle2=h2a+(Math.random()-0.5)*0.3;clockLines.push({x:h2x,y:h2y,angle:angle2,length:0,maxLength:100+Math.random()*300,alpha:S.lineOpacity*0.7});}for(let i=clockLines.length-1;i>=0;i--){const ln=clockLines[i];ln.length+=S.lineGrowSpeed;if(ln.length>ln.maxLength){ln.alpha-=0.01;if(ln.alpha<=0){clockLines.splice(i,1);continue;}}const ex=ln.x+Math.cos(ln.angle)*ln.length;const ey=ln.y+Math.sin(ln.angle)*ln.length;clkCtx.beginPath();clkCtx.moveTo(ln.x,ln.y);clkCtx.lineTo(ex,ey);clkCtx.strokeStyle=`rgba(${S.lineColor[0]},${S.lineColor[1]},${S.lineColor[2]},${ln.alpha})`;clkCtx.lineWidth=S.lineWidth;clkCtx.stroke();}clockRAF=requestAnimationFrame(drawClock);}
function startClock(){if(clockRunning)return;setupClockCanvas();clockCanvas.classList.add('visible');clockAngle=0;clockFrameCount=0;clockLines=[];clockRunning=true;drawClock();}
function stopClock(){if(!clockRunning)return;if(clockRAF)cancelAnimationFrame(clockRAF);clockCanvas.classList.remove('visible');clockRunning=false;clockLines=[];}
function triggerSandFlash(){const fx=(46+Math.random()*8).toFixed(2)+'%';const fy=(42+Math.random()*14).toFixed(2)+'%';const rot=(Math.random()*80-40).toFixed(1)+'deg';sandFlash.style.setProperty('--flash-x',fx);sandFlash.style.setProperty('--flash-y',fy);sandFlash.style.setProperty('--flash-rot',rot);sandFlash.classList.remove('flash');void sandFlash.offsetWidth;sandFlash.classList.add('flash');if(sandFlashTimeout)clearTimeout(sandFlashTimeout);sandFlashTimeout=setTimeout(()=>sandFlash.classList.remove('flash'),640);}
function setSandPhase(nextPhase,modeOverride){sandPhase=nextPhase;const style=getSandStyle(nextPhase);sandNumberMode=style.showNumbers;if(style.showClock)startClock();else stopClock();if(sandNumberMode&&sandNumbers.length===0)initSandNumbers();createSandParticles(sandParagraphs[nextPhase],modeOverride||style.entryMode,style);}
function transitionSandPhase(nextPhase,options={}){const{flash=false,delay=480,modeOverride}=options;sandTransitioning=true;sandReady=false;sandCanvas.style.cursor='default';sandContinueBtn.classList.remove('visible');const swap=()=>{sandParticles.forEach(p=>{p.targetAlpha=0;});if(sandSwapTimeout)clearTimeout(sandSwapTimeout);sandSwapTimeout=setTimeout(()=>{setSandPhase(nextPhase,modeOverride);sandTransitioning=false;},delay);};if(flash){triggerSandFlash();setTimeout(swap,150);}else{swap();}}
function sandClickNext(){if(!sandReady||sandTransitioning)return;sandReady=false;sandCanvas.style.cursor='default';sandContinueBtn.classList.remove('visible');if(sandPhase===0){sandTransitioning=true;sandPendingPhase=1;sandParticles.forEach(p=>{p.sucking=true;p.arrived=true;p.falling=false;p.ashing=false;});}else if(sandPhase===1){transitionSandPhase(2,{delay:520});}else if(sandPhase===2){transitionSandPhase(3,{flash:true,delay:560});}else if(sandPhase===3){sandTransitioning=true;sandBurningOut=true;sandPhase=4;if(sandFlashTimeout)clearTimeout(sandFlashTimeout);sandFlash.classList.remove('flash');showSandFeuOverlay();stopClock();sandNumberMode=false;sandParticles.forEach(p=>{p.ashing=true;p.arrived=true;p.falling=false;p.sucking=false;p.vx=(Math.random()-0.5)*S.ashSpreadX;p.vy=(Math.random()-0.5)*S.ashSpreadY-S.ashLift;p.rot=(Math.random()-0.5)*0.4;p.scale=1;p.ashGlyph=Math.random()<0.58?'·':p.char;p.targetAlpha=0;});}}
function handleSandCanvasClick(){if(!sandReady||sandTransitioning||sandBurningOut)return;sandClickNext();}
function handleSandBack(){if(sandTransitioning||sandBurningOut)return;if(sandPhase>0&&sandPhase<4){sandPendingPhase=null;sandReady=false;sandCanvas.style.cursor='default';sandContinueBtn.classList.remove('visible');sandTransitioning=true;setSandPhase(sandPhase-1,'instant');sandTransitioning=false;}else{backToMenu(sandScreen,stopSand);}}
function startSand(){sandPhase=0;sandReady=false;sandTransitioning=false;sandBurningOut=false;sandPendingPhase=null;sandNumberMode=false;sandCanvas.style.cursor='default';sandContinueBtn.classList.remove('visible');sandFlash.classList.remove('flash');hideSandFeuOverlay();if(sandSwapTimeout)clearTimeout(sandSwapTimeout);if(sandWormholeTimeout)clearTimeout(sandWormholeTimeout);if(sandFlashTimeout)clearTimeout(sandFlashTimeout);stopClock();setupSandCanvas();setupSandFxCanvas();initSandNumbers();setSandPhase(0);sandContinueBtn.addEventListener('click',sandClickNext);sandCanvas.addEventListener('click',handleSandCanvasClick);animateSand();}
function stopSand(){if(sandAnimRAF)cancelAnimationFrame(sandAnimRAF);sandContinueBtn.removeEventListener('click',sandClickNext);sandCanvas.removeEventListener('click',handleSandCanvasClick);if(sandSwapTimeout)clearTimeout(sandSwapTimeout);if(sandWormholeTimeout)clearTimeout(sandWormholeTimeout);if(sandFlashTimeout)clearTimeout(sandFlashTimeout);stopClock();sandParticles=[];sandNumbers=[];sandPhase=0;sandReady=false;sandTransitioning=false;sandBurningOut=false;sandPendingPhase=null;sandNumberMode=false;sandCanvas.style.cursor='default';sandContinueBtn.classList.remove('visible');sandFlash.classList.remove('flash');hideSandFeuOverlay();fxCtx.clearRect(0,0,window.innerWidth,window.innerHeight);}
window.addEventListener('resize',()=>{if(!sandScreen.classList.contains('visible'))return;setupSandCanvas();setupSandFxCanvas();if(sandNumberMode)initSandNumbers();if(sandPhase>=0&&sandPhase<=3){setSandPhase(sandPhase,'instant');}});
// ============================================================
//  Circular Ruins — 원형 텍스트 + 마우스 변형
// ============================================================
const ruinsTexts = [
  `He dreamed that it was warm, secret, about the size of a clenched fist, and of a garnet color within the penumbra of a human body as yet without face or sex; during fourteen lucid nights he dreamt of it with meticulous love. Every night he perceived it more clearly. He did not touch it; he only permitted himself to witness it, to observe it, and occasionally to rectify it with a glance. He perceived it and lived it from all angles and distances. On the fourteenth night he lightly touched the pulmonary artery with his index finger, then the whole heart, outside and inside. He was satisfied with the examination. He deliberately did not dream for a night; he took up the heart again, invoked the name of a planet, and undertook the vision of another of the principle organs. Within a year he had come to the skeleton and the eyelids. The innumerable hair was perhaps the most difficult task. He dreamed an entire man-a young man, but who did not sit up or talk, who was unable to open his eyes. Night after night, the man dreamt him asleep.`,
  `That evening, at twilight, he dreamt of the statue. He dreamt it was alive, tremulous: it was not an atrocious bastard of a tiger and a colt, but at the same time these two firey creatures and also a bull, a rose, and a storm. This multiple god revealed to him that his earthly name was Fire, and that in this circular temple (and in others like it) people had once made sacrifices to him and worshiped him, and that he would magically animate the dreamed phantom, in such a way that all creatures, except Fire itself and the dreamer, would believe to be a man of flesh and blood.`,
  `One day, the man emerged from his sleep as if from a viscous desert, looked at the useless afternoon light which he immediately confused with the dawn, and understood that he had not dreamed. All that night and all day long, the intolerable lucidity of insomnia fell upon him. He tried exploring the forest, to lose his strength; among the hemlock he barely succeeded in experiencing several short snatchs of sleep, veined with fleeting, rudimentary visions that were useless. He tried to assemble the student body but scarcely had he articulated a few brief words of exhortation when it became deformed and was then erased. In his almost perpetual vigil, tears of anger burned his old eyes.`
].map((t) => t.replace(/\s+/g, ' ').trim());
const ruinsFinalText = "With relief, with humiliation, with terror, he understood that he also was an illusion, that someone else was dreaming of him.";
const ruinsCanvasEl = document.getElementById('ruinsCanvas');
const ruinsGifOverlay = document.getElementById('ruinsGifOverlay');
const ruinsGif = document.getElementById('ruinsGif');
const rCtx = ruinsCanvasEl.getContext('2d');
let ruinsLetters = [], ruinsRevealIndex = 0, ruinsRAF = null, ruinsTypingRAF = null;
let ruinsDone = false, ruinsMouseX = -9999, ruinsMouseY = -9999;
let ruinsW = 0, ruinsH = 0, ruinsDpr = 1;
let ruinsAnimating = false;
let ruinsCollapseActive = false;
let ruinsFinalVisible = false;
let ruinsFinalAlpha = 0;
let ruinsFinalLines = [];
let ruinsFinalReady = false;
let ruinsGifVisible = false;
const ruinsCharWidthCache = new Map();
const RR = {
  fontSize: 14,             // 글자 크기
  fontUnit: 'pt',
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: '300',
  ringGap: 16,              // 링 사이 간격 (조금 벌려서 렌더량 감소)
  charSpacing: 2,           // 글자 사이 추가 간격
  startRadius: 30,          // 첫 링 반지름
  maxRadiusRatio: 0.42,     // 화면 안쪽에 안전하게 들어오도록 최대 반지름 제한
  centerOffsetX: 0,         // 중앙 X 미세 조정
  centerOffsetY: -6,        // 중앙 Y 미세 조정
  mouseRadius: 120,         // 마우스 영향 반경
  mouseStrength: 60,        // 밀어내는 힘
  mouseSoftness: 2,         // 변형 부드러움 (높을수록 부드러움)
  returnSpeed: 0.06,        // 원래 위치로 돌아가는 속도
  maxGlyphCount: 2200,      // 성능 보호용 최대 글자 수
  charsPerFrame: 10,        // 타이핑: 프레임당 글자 수
  typingDelay: 16,          // 타이핑: 프레임 딜레이 (ms)
  textOpacity: 0.8,
  settleEpsilon: 0.12,      // 정지 판정
  collapseGravity: 0.3,
  collapseSpreadX: 1.9,
  collapseStartVy: 2.4,
  collapseFadeMin: 0.009,
  collapseFadeMax: 0.022,
  collapseSpinMax: 0.08,
  collapseParticleCap: 720,
  collapseFrictionX: 0.992,
  collapseTerminalVy: 18,
  collapseAlphaCutoff: 0.015,
  collapseFloorMargin: 36,
  finalFontSize: 14,
  finalFontUnit: 'pt',
  finalLineHeight: 1.55,
  finalMaxWidthRatio: 0.62,
  finalFadeInSpeed: 0.018,
};
function requestRuinsLoop() {
  if (ruinsAnimating) return;
  ruinsAnimating = true;
  ruinsRAF = requestAnimationFrame(ruinsAnimateLoop);
}
function prepareRuinsFinalTextLayout() {
  rCtx.setTransform(1, 0, 0, 1, 0, 0);
  const maxW = ruinsW * RR.finalMaxWidthRatio;
  const words = ruinsFinalText.split(' ');
  rCtx.font = `${RR.fontWeight} ${RR.finalFontSize}${RR.finalFontUnit} ${RR.fontFamily}`;
  const lines = [];
  let line = '';
  for (let i = 0; i < words.length; i++) {
    const test = line ? `${line} ${words[i]}` : words[i];
    if (rCtx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = words[i];
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  ruinsFinalLines = lines;
}
function isRuinsTextHit(x, y) {
  const fontPx = RR.fontUnit === 'pt' ? RR.fontSize * (96 / 72) : RR.fontSize;
  const hitR = Math.max(18, fontPx * 1.9);
  const hitRSq = hitR * hitR;
  for (let i = 0; i < ruinsLetters.length; i++) {
    const L = ruinsLetters[i];
    if (L.opacity < 0.04) continue;
    const dx = L.x - x;
    const dy = L.y - y;
    if ((dx * dx + dy * dy) <= hitRSq) return true;
  }
  // 글자 사이 빈 공간을 눌러도 반응하도록 원형 텍스트 영역 전체를 히트영역으로 허용
  const cx = ruinsW * 0.5 + RR.centerOffsetX;
  const cy = ruinsH * 0.5 + RR.centerOffsetY;
  const clusterR = Math.min(ruinsW, ruinsH) * RR.maxRadiusRatio + fontPx * 2.4;
  const cdx = x - cx;
  const cdy = y - cy;
  return (cdx * cdx + cdy * cdy) <= (clusterR * clusterR);
}
function hasVisibleRuinsGlyph() {
  for (let i = 0; i < ruinsLetters.length; i++) {
    if (ruinsLetters[i].opacity > 0.02) return true;
  }
  return false;
}
function showRuinsGif() {
  ruinsFinalVisible = false;
  ruinsFinalReady = false;
  ruinsFinalAlpha = 0;
  ruinsFinalLines = [];
  ruinsLetters = [];
  rCtx.setTransform(1, 0, 0, 1, 0, 0);
  rCtx.clearRect(0, 0, ruinsCanvasEl.width, ruinsCanvasEl.height);
  ruinsGifOverlay.classList.add('visible');
  ruinsGifVisible = true;
}
function hideRuinsGif() {
  ruinsGifOverlay.classList.remove('visible');
  ruinsGifVisible = false;
}
function isRuinsFinalTextHit(x, y) {
  if (!ruinsFinalVisible || !ruinsFinalReady || ruinsFinalLines.length === 0) return false;
  rCtx.setTransform(1, 0, 0, 1, 0, 0);
  rCtx.font = `${RR.fontWeight} ${RR.finalFontSize}${RR.finalFontUnit} ${RR.fontFamily}`;
  const fontPx = RR.finalFontUnit === 'pt' ? RR.finalFontSize * (96 / 72) : RR.finalFontSize;
  const lh = fontPx * RR.finalLineHeight;
  const totalH = (ruinsFinalLines.length - 1) * lh;
  const cx = ruinsW * 0.5 + RR.centerOffsetX;
  const startY = ruinsH * 0.5 + RR.centerOffsetY - totalH * 0.5;
  for (let i = 0; i < ruinsFinalLines.length; i++) {
    const line = ruinsFinalLines[i];
    const lineW = rCtx.measureText(line).width;
    const lineY = startY + i * lh;
    const left = cx - lineW * 0.5 - 14;
    const right = cx + lineW * 0.5 + 14;
    const top = lineY - lh * 0.6;
    const bottom = lineY + lh * 0.6;
    if (x >= left && x <= right && y >= top && y <= bottom) return true;
  }
  return false;
}
function triggerRuinsCollapse(e) {
  if (!ruinsScreen.classList.contains('visible') || ruinsCollapseActive || ruinsFinalVisible) return;
  if (!hasVisibleRuinsGlyph()) return;
  if (e) {
    const rect = ruinsCanvasEl.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;
    if (!isRuinsTextHit(lx, ly)) return;
  }
  if (ruinsTypingRAF) {
    clearTimeout(ruinsTypingRAF);
    ruinsTypingRAF = null;
  }
  ruinsDone = true;
  ruinsCollapseActive = true;
  ruinsFinalVisible = true;
  ruinsFinalAlpha = 0;
  ruinsFinalReady = false;
  prepareRuinsFinalTextLayout();
  if (ruinsLetters.length > RR.collapseParticleCap) {
    const sampled = [];
    const step = ruinsLetters.length / RR.collapseParticleCap;
    for (let i = 0; i < RR.collapseParticleCap; i++) {
      sampled.push(ruinsLetters[Math.floor(i * step)]);
    }
    ruinsLetters = sampled;
  }
  ruinsMouseX = -9999;
  ruinsMouseY = -9999;
  ruinsLetters.forEach((L) => {
    L.vx = (Math.random() - 0.5) * RR.collapseSpreadX;
    L.vy = RR.collapseStartVy + Math.random() * RR.collapseStartVy;
    L.rotV = (Math.random() - 0.5) * RR.collapseSpinMax;
    L.fadeV = RR.collapseFadeMin + Math.random() * (RR.collapseFadeMax - RR.collapseFadeMin);
  });
  requestRuinsLoop();
}
function handleRuinsCanvasClick(e) {
  if (!ruinsScreen.classList.contains('visible') || ruinsGifVisible) return;
  const rect = ruinsCanvasEl.getBoundingClientRect();
  const lx = e.clientX - rect.left;
  const ly = e.clientY - rect.top;
  if (!ruinsFinalVisible) {
    triggerRuinsCollapse(e);
    return;
  }
  if (!isRuinsFinalTextHit(lx, ly)) return;
  showRuinsGif();
}
function openOverlapFromRuinsGif(e) {
  e.stopPropagation();
  if (!ruinsGifVisible) return;
  hideRuinsGif();
  ruinsScreen.classList.remove('visible');
  stopRuins();
  setTimeout(() => { overlapScreen.classList.add('visible'); randomizeDoorMotion(); }, SCREEN_SWITCH_DELAY_MS);
}
function drawRuinsFinalText() {
  if (!ruinsFinalVisible || ruinsFinalLines.length === 0 || ruinsFinalAlpha <= 0) return;
  rCtx.setTransform(ruinsDpr, 0, 0, ruinsDpr, 0, 0);
  rCtx.font = `${RR.fontWeight} ${RR.finalFontSize}${RR.finalFontUnit} ${RR.fontFamily}`;
  rCtx.fillStyle = `rgba(232,228,223,${ruinsFinalAlpha})`;
  rCtx.textAlign = 'center';
  rCtx.textBaseline = 'middle';
  const fontPx = RR.finalFontUnit === 'pt' ? RR.finalFontSize * (96 / 72) : RR.finalFontSize;
  const lh = fontPx * RR.finalLineHeight;
  const totalH = (ruinsFinalLines.length - 1) * lh;
  const cx = ruinsW * 0.5 + RR.centerOffsetX;
  const startY = ruinsH * 0.5 + RR.centerOffsetY - totalH * 0.5;
  for (let i = 0; i < ruinsFinalLines.length; i++) {
    rCtx.fillText(ruinsFinalLines[i], cx, startY + i * lh);
  }
}
function setupRuinsCanvas() {
  ruinsW = window.innerWidth;
  ruinsH = window.innerHeight;
  ruinsDpr = window.devicePixelRatio || 1;
  ruinsCanvasEl.width = ruinsW * ruinsDpr;
  ruinsCanvasEl.height = ruinsH * ruinsDpr;
  ruinsCanvasEl.style.width = ruinsW + 'px';
  ruinsCanvasEl.style.height = ruinsH + 'px';
}
function precomputeRuins() {
  rCtx.setTransform(1, 0, 0, 1, 0, 0);
  rCtx.font = `${RR.fontWeight} ${RR.fontSize}${RR.fontUnit} ${RR.fontFamily}`;
  const cx = ruinsW * 0.5 + RR.centerOffsetX;
  const cy = ruinsH * 0.5 + RR.centerOffsetY;
  const maxRadius = Math.min(ruinsW, ruinsH) * RR.maxRadiusRatio;
  ruinsLetters = [];
  ruinsCharWidthCache.clear();
  const allText = ruinsTexts.join('   ●   ');
  const chars = allText.split('');
  let charIdx = 0, ring = 0;
  while (charIdx < chars.length && ruinsLetters.length < RR.maxGlyphCount) {
    const baseR = RR.startRadius + ring * RR.ringGap;
    if (baseR > maxRadius) break;
    const direction = ring % 2 === 0 ? 1 : -1;
    const startAngle = ring * 0.7;
    let angle = startAngle;
    const fullCircle = Math.PI * 2;
    while (angle < startAngle + fullCircle && charIdx < chars.length && ruinsLetters.length < RR.maxGlyphCount) {
      const actualAngle = direction === 1 ? angle : (startAngle + fullCircle - (angle - startAngle));
      const char = chars[charIdx];
      let charW = ruinsCharWidthCache.get(char);
      if (charW === undefined) {
        charW = rCtx.measureText(char).width;
        ruinsCharWidthCache.set(char, charW);
      }
      const step = (charW + RR.charSpacing) / Math.max(baseR, 10);
      const x = cx + baseR * Math.cos(actualAngle);
      const y = cy + baseR * Math.sin(actualAngle);
      if (char !== ' ') {
        ruinsLetters.push({
          char,
          baseX: x,
          baseY: y,
          x,
          y,
          rot: actualAngle + Math.PI / 2,
          opacity: 0,
          targetOpacity: RR.textOpacity,
        });
      }
      angle += step;
      charIdx++;
    }
    ring++;
  }
}
function ruinsTypingLoop() {
  if (ruinsRevealIndex >= ruinsLetters.length) { ruinsDone = true; return; }
  for (let i = 0; i < RR.charsPerFrame; i++) {
    if (ruinsRevealIndex < ruinsLetters.length) {
      ruinsLetters[ruinsRevealIndex].opacity = ruinsLetters[ruinsRevealIndex].targetOpacity;
      ruinsRevealIndex++;
    }
  }
  requestRuinsLoop();
  ruinsTypingRAF = setTimeout(ruinsTypingLoop, RR.typingDelay);
}
ruinsCanvasEl.addEventListener('mousemove', e => {
  const rect = ruinsCanvasEl.getBoundingClientRect();
  ruinsMouseX = e.clientX - rect.left;
  ruinsMouseY = e.clientY - rect.top;
  if (ruinsScreen.classList.contains('visible')) requestRuinsLoop();
});
ruinsCanvasEl.addEventListener('click', handleRuinsCanvasClick);
ruinsCanvasEl.addEventListener('mouseleave', () => {
  ruinsMouseX = -9999;
  ruinsMouseY = -9999;
  if (ruinsScreen.classList.contains('visible')) requestRuinsLoop();
});
ruinsGif.addEventListener('click', openOverlapFromRuinsGif);
function ruinsAnimateLoop() {
  rCtx.setTransform(1, 0, 0, 1, 0, 0);
  rCtx.clearRect(0, 0, ruinsCanvasEl.width, ruinsCanvasEl.height);
  if (ruinsCollapseActive) {
    rCtx.setTransform(ruinsDpr, 0, 0, ruinsDpr, 0, 0);
    rCtx.font = `${RR.fontWeight} ${RR.fontSize}${RR.fontUnit} ${RR.fontFamily}`;
    rCtx.fillStyle = 'rgb(232,228,223)';
    rCtx.textAlign = 'center';
    rCtx.textBaseline = 'middle';
    let aliveCount = 0;
    for (let i = 0; i < ruinsLetters.length; i++) {
      const L = ruinsLetters[i];
      if (L.opacity <= RR.collapseAlphaCutoff) continue;
      L.vy = Math.min(RR.collapseTerminalVy, L.vy + RR.collapseGravity);
      L.vx *= RR.collapseFrictionX;
      L.x += L.vx + (Math.random() - 0.5) * 0.18;
      L.y += L.vy;
      L.opacity = Math.max(0, L.opacity - L.fadeV);
      if (L.y > ruinsH + RR.collapseFloorMargin || L.opacity <= RR.collapseAlphaCutoff) {
        L.opacity = 0;
        continue;
      }
      aliveCount++;
      rCtx.globalAlpha = L.opacity;
      rCtx.fillText(L.char, L.x, L.y);
    }
    rCtx.globalAlpha = 1;
    if (aliveCount === 0) {
      ruinsFinalAlpha = Math.min(1, ruinsFinalAlpha + RR.finalFadeInSpeed);
      drawRuinsFinalText();
      if (ruinsFinalAlpha >= 0.999) ruinsFinalReady = true;
    }
    if (aliveCount === 0 && ruinsFinalAlpha >= 1) {
      ruinsCollapseActive = false;
      ruinsLetters = [];
    }
    if (aliveCount > 0 || ruinsFinalAlpha < 1) {
      ruinsRAF = requestAnimationFrame(ruinsAnimateLoop);
      return;
    }
    ruinsAnimating = false;
    ruinsRAF = null;
    return;
  }
  const mx = ruinsMouseX, my = ruinsMouseY, hasMouse = !ruinsCollapseActive && mx > -1000;
  const radiusSq = RR.mouseRadius * RR.mouseRadius;
  const sigmaSq = Math.pow(RR.mouseRadius / RR.mouseSoftness, 2);
  let hasKinetic = false;
  rCtx.font = `${RR.fontWeight} ${RR.fontSize}${RR.fontUnit} ${RR.fontFamily}`;
  rCtx.fillStyle = `rgba(232,228,223,${RR.textOpacity})`;
  rCtx.textAlign = 'center';
  rCtx.textBaseline = 'middle';
  for (let i = 0; i < ruinsLetters.length; i++) {
    const L = ruinsLetters[i];
    if (L.opacity < 0.01) continue;
    if (hasMouse) {
      const dx = L.baseX - mx, dy = L.baseY - my;
      const distSq = dx * dx + dy * dy;
      if (distSq < radiusSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const falloff = Math.exp(-(distSq) / (2 * sigmaSq));
        const force = (RR.mouseStrength * falloff) / dist;
        const tx = L.baseX + dx * force;
        const ty = L.baseY + dy * force;
        L.x += (tx - L.x) * 0.22;
        L.y += (ty - L.y) * 0.22;
      } else {
        L.x += (L.baseX - L.x) * RR.returnSpeed;
        L.y += (L.baseY - L.y) * RR.returnSpeed;
      }
    } else {
      L.x += (L.baseX - L.x) * RR.returnSpeed;
      L.y += (L.baseY - L.y) * RR.returnSpeed;
    }
    if (Math.abs(L.x - L.baseX) > RR.settleEpsilon || Math.abs(L.y - L.baseY) > RR.settleEpsilon) {
      hasKinetic = true;
    }
    const c = Math.cos(L.rot), s = Math.sin(L.rot);
    rCtx.setTransform(ruinsDpr * c, ruinsDpr * s, -ruinsDpr * s, ruinsDpr * c, ruinsDpr * L.x, ruinsDpr * L.y);
    rCtx.fillText(L.char, 0, 0);
  }
  if (ruinsFinalVisible) {
    drawRuinsFinalText();
  }
  if (!ruinsDone || hasMouse || hasKinetic || (ruinsFinalVisible && ruinsFinalAlpha < 1)) {
    ruinsRAF = requestAnimationFrame(ruinsAnimateLoop);
    return;
  }
  ruinsAnimating = false;
  ruinsRAF = null;
}
function startRuins() {
  ruinsDone = false;
  ruinsRevealIndex = 0;
  ruinsLetters = [];
  ruinsCollapseActive = false;
  ruinsFinalVisible = false;
  ruinsFinalAlpha = 0;
  ruinsFinalReady = false;
  ruinsFinalLines = [];
  ruinsMouseX = -9999;
  ruinsMouseY = -9999;
  hideRuinsGif();
  setupRuinsCanvas();
  precomputeRuins();
  ruinsTypingLoop();
  requestRuinsLoop();
}
function stopRuins() {
  if (ruinsRAF) cancelAnimationFrame(ruinsRAF);
  if (ruinsTypingRAF) clearTimeout(ruinsTypingRAF);
  ruinsRAF = null;
  ruinsTypingRAF = null;
  ruinsAnimating = false;
  ruinsCollapseActive = false;
  ruinsFinalVisible = false;
  ruinsFinalAlpha = 0;
  ruinsFinalReady = false;
  ruinsFinalLines = [];
  hideRuinsGif();
  ruinsLetters = [];
}
function handleRuinsBack() {
  if (ruinsGifVisible) { hideRuinsGif(); return; }
  backToMenu(ruinsScreen,stopRuins);
}
window.addEventListener('resize', () => {
  if (!ruinsScreen.classList.contains('visible')) return;
  setupRuinsCanvas();
  if (ruinsFinalVisible) {
    prepareRuinsFinalTextLayout();
    requestRuinsLoop();
    return;
  }
  precomputeRuins();
  ruinsLetters.forEach((L) => { L.opacity = L.targetOpacity; });
  ruinsRevealIndex = ruinsLetters.length;
  ruinsDone = true;
  requestRuinsLoop();
});
// ============================================================
//  Overlap Door Grid + Mixed Text
// ============================================================
const mixedTextEl=document.getElementById('mixedText');
const mixedStageEl=document.getElementById('mixedStage');
const doorTiles=[...document.querySelectorAll('.door-tile')];
const mixedSourcePassages=[
  `In all fiction, when a man is faced with alternatives he chooses one at the expense of the others. In the almost unfathomable Ts'ui Pen, he chooses-simultaneously-all of them. He thus creates various futures, various times which start others that will in their turn branch out and bifurcate in other times. This is the cause of the contradictions in the novel. Fang, let us say, has a secret. A stranger knocks at his door. Fang makes up his mind to kill him. Naturally there are various possible outcomes. Fang can kill the intruder, the intruder can kill Fang, both can be saved, both can die and so on and so on. In Ts'ui Pen's work, all the possible solutions occur, each one being the point of departure for other bifurcations.`,
  `In a guessing game to which the answer is chess, which word is the only one prohibited? I thought for a moment and then replied: 'The word is chess.' 'Precisely,' said Albert. 'The Garden of Forking Paths is an enormous guessing game, or parable, in which the subject is time. The rules of the game forbid the use of the word itself. To eliminate a word completely, to refer to it by means of inept phrases and obvious paraphrases, is perhaps the best way of drawing attention to it. This, then, is the tortuous method of approach preferred by the oblique Ts'ui Pen in every meandering of his interminable novel.'`,
  `Then I reflected that all things happen, happen to one, precisely now. Century follows century, and things happen only in the present. There are countless men in the air, on land and at sea, and all that really happens happens to me. The almost unbearable memory of Madden's long horseface put an end to these wandering thoughts.`,
  `For a moment I thought that Richard Madden might in some way have divined my desperate intent. At once I realized that this would be impossible. The advice about turning always to the left reminded me that such was the common formula for finding the central courtyard of certain labyrinths. I know something about labyrinths. Not for nothing am I the greatgrandson of Ts'ui Pen. He was Governor of Yunnan and gave up temporal power to write a novel with more characters than there are in the Hung Lou Meng, and to create a maze in which all men would lose themselves. He spent thirteen years on these oddly assorted tasks before he was assassinated by a stranger.`,
  `'In all of them,' I enunciated, with a tremor in my voice. 'I deeply appreciate and am grateful to you for the restoration of Ts'ui Pen's garden.' 'Not in all,' he murmured with a smile. 'Time is forever dividing itself toward innumerable futures and in one of them I am your enemy.' Once again I sensed the pullulation of which I have already spoken. It seemed to me that the dew-damp garden surrounding the house was infinitely saturated with invisible people. All were Albert and myself, secretive, busy and multiform in other dimensions of time.`,
  `The purpose which guided him was not impossible, though supernatural. He wanted to dream a man; he wanted to dream him in minute entirety and impose him on reality. This magic project had exhausted the entire expanse of his mind; if someone had asked him his name or to relate some event of his former life, he would not have been able to give an answer.`,
  `He dreamed that it was warm, secret, about the size of a clenched fist, and of a garnet color within the penumbra of a human body as yet without face or sex; during fourteen lucid nights he dreamt of it with meticulous love. Every night he perceived it more clearly. He did not touch it; he only permitted himself to witness it, to observe it, and occasionally to rectify it with a glance. He perceived it and lived it from all angles and distances. On the fourteenth night he lightly touched the pulmonary artery with his index finger, then the whole heart, outside and inside. He was satisfied with the examination. He deliberately did not dream for a night; he took up the heart again, invoked the name of a planet, and undertook the vision of another of the principle organs. Within a year he had come to the skeleton and the eyelids. The innumerable hair was perhaps the most difficult task. He dreamed an entire man-a young man, but who did not sit up or talk, who was unable to open his eyes. Night after night, the man dreamt him asleep.`,
  `That evening, at twilight, he dreamt of the statue. He dreamt it was alive, tremulous: it was not an atrocious bastard of a tiger and a colt, but at the same time these two firey creatures and also a bull, a rose, and a storm. This multiple god revealed to him that his earthly name was Fire, and that in this circular temple (and in others like it) people had once made sacrifices to him and worshiped him, and that he would magically animate the dreamed phantom, in such a way that all creatures, except Fire itself and the dreamer, would believe to be a man of flesh and blood.`,
  `For what had happened many centuries before was repeating itself. The ruins of the sanctuary of the god of Fire was destroyed by fire. In a dawn without birds, the wizard saw the concentric fire licking the walls. For a moment, he thought of taking refuge in the water, but then he understood that death was coming to crown his old age and absolve him from his labors. He walked toward the sheets of flame. They did not bite his flesh, they caressed him and flooded him without heat or combustion. With relief, with humiliation, with terror, he understood that he also was an illusion, that someone else was dreaming him.`,
  `One day, the man emerged from his sleep as if from a viscous desert, looked at the useless afternoon light which he immediately confused with the dawn, and understood that he had not dreamed. All that night and all day long, the intolerable lucidity of insomnia fell upon him. He tried exploring the forest, to lose his strength; among the hemlock he barely succeeded in experiencing several short snatchs of sleep, veined with fleeting, rudimentary visions that were useless. He tried to assemble the student body but scarcely had he articulated a few brief words of exhortation when it became deformed and was then erased. In his almost perpetual vigil, tears of anger burned his old eyes.`,
  `'The number of pages in this book is no more or less than infinite. None is the first page, none the last. I don't know why they're numbered in this arbitrary way. Perhaps to suggest that the terms of an infinite series admit any number.' Then, as if he were thinking aloud, he said, 'If space is infinite, we may be at any point in space. If time is infinite, we may be at any point in time.'`,
  `I thought of keeping the Book of Sand in the space left on the shelf by the Wiclif, but in the end I decided to hide it behind the volumes of a broken set of The Thousand and One Nights. I went to bed and did not sleep. At three or four in the morning, I turned on the light. I got down the impossible book and leafed through its pages. On one of them I saw engraved a mask. The upper corner of the page carried a number, which I no longer recall, elevated to the ninth power. I showed no one my treasure. To the luck of owning it was added the fear of having it stolen, and then the misgiving that it might not truly be infinite.`,
  `Summer came and went, and I realized that the book was monstrous. What good did it do me to think that I, who looked upon the volume with my eyes, who held it in my hands, was any less monstrous? I felt that the book was a nightmarish object, an obscene thing that affronted and tainted reality itself. I thought of fire, but I feared that the burning of an infinite book might likewise prove infinite and suffocate the planet with smoke.`
].map((p)=>p.replace(/\s+/g,' ').trim());
const mixedThemes={
  forking:[0,1,2,3,4],
  dream:[5,6],
  ruins:[7,8,9],
  sand:[10,11,12],
};
const mixedThemeLinks={
  forking:['forking','dream','sand'],
  dream:['dream','ruins','forking'],
  ruins:['ruins','dream','sand'],
  sand:['sand','forking','ruins'],
};
const mixedThemeSentencePools=Object.fromEntries(Object.entries(mixedThemes).map(([theme,indexes])=>{
  const pool=indexes
    .flatMap((idx)=>mixedSourcePassages[idx].match(/[^.!?]+[.!?]+/g)||[mixedSourcePassages[idx]])
    .map((s)=>s.trim())
    .filter(Boolean);
  return [theme,pool];
}));
const mixedFxPool=['sand','blackhole','redshift','flicker','drift','surge'];
let mixedFxTimeout=null,mixedFxLock=false,mixedHoverTimer=null,mixedCurrentTheme='forking',mixedFirstHoverActive=true,mixedKeywordGateWord=null;
const KEYWORD_GATE_CHANCE=0.3;
function randInt(min,max){return Math.floor(Math.random()*(max-min+1))+min;}
function pickRandomTheme(){const keys=Object.keys(mixedThemes);return keys[randInt(0,keys.length-1)];}
function pickRelatedTheme(theme){
  const candidates=mixedThemeLinks[theme]||Object.keys(mixedThemes);
  return candidates[randInt(0,candidates.length-1)];
}
function normalizeMixedText(raw){
  return raw.replace(/\r/g,'').replace(/[ \t]+/g,' ').replace(/\n[ \t]+/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
}
function renderMixedText(raw,{keywordOnly=false}={}){
  if(!mixedTextEl)return;
  mixedTextEl.classList.toggle('keyword-only',!!keywordOnly);
  const normalized=normalizeMixedText(raw);
  mixedTextEl.textContent=normalized;
}
function takeMixedFragment(sentence){
  const words=sentence.replace(/\s+/g,' ').trim().split(' ');
  if(words.length<9||Math.random()>0.5)return sentence;
  const start=randInt(0,Math.max(0,words.length-8));
  const end=Math.min(words.length,start+randInt(6,24));
  let fragment=words.slice(start,end).join(' ');
  if(!/[.!?]$/.test(fragment))fragment+='...';
  return fragment;
}
function getMixedPool(theme){
  return mixedThemeSentencePools[theme]&&mixedThemeSentencePools[theme].length
    ?mixedThemeSentencePools[theme]
    :Object.values(mixedThemeSentencePools).flat();
}
function buildMixedText(theme=mixedCurrentTheme){
  const sourcePool=getMixedPool(theme);
  const totalSentences=Math.random()<0.52?randInt(10,15):randInt(1,9);
  const fragments=[];
  for(let i=0;i<totalSentences;i++){
    const sentence=sourcePool[randInt(0,sourcePool.length-1)];
    fragments.push(Math.random()<0.68?takeMixedFragment(sentence):sentence);
  }
  const paragraphs=[];
  let cursor=0;
  while(cursor<fragments.length){
    const chunk=Math.min(fragments.length-cursor,randInt(1,5));
    paragraphs.push(fragments.slice(cursor,cursor+chunk).join(' '));
    cursor+=chunk;
  }
  return paragraphs.join('\n\n');
}
function buildMixedBurstText(theme=mixedCurrentTheme){
  const sourcePool=getMixedPool(theme);
  const count=randInt(1,4);
  const parts=[];
  for(let i=0;i<count;i++)parts.push(takeMixedFragment(sourcePool[randInt(0,sourcePool.length-1)]));
  return parts.join(' ');
}
function pickMixedFx(){return mixedFxPool[randInt(0,mixedFxPool.length-1)];}
function clearMixedFxClasses(){if(!mixedTextEl)return;mixedTextEl.classList.remove('fx-out','fx-in','fx-sand','fx-blackhole','fx-redshift','fx-flicker','fx-drift','fx-surge','hover-chaos');}
function stopMixedHoverMode(){if(mixedHoverTimer){clearInterval(mixedHoverTimer);mixedHoverTimer=null;}if(mixedTextEl)mixedTextEl.classList.remove('hover-chaos');if(mixedScreen)mixedScreen.classList.remove('noise-active');}
function pickKeywordGateWord(textBlock){
  const hits = textBlock.match(/\b(time|infinite|dream|fire)\b/gi);
  if(!hits||hits.length===0)return null;
  return hits[randInt(0,hits.length-1)];
}
function swapMixedText(nextText,{keywordOnly=false}={}){
  if(!mixedTextEl){return;}
  if(mixedFxLock){renderMixedText(nextText,{keywordOnly});return;}
  mixedFxLock=true;
  const fx=pickMixedFx();
  clearMixedFxClasses();
  mixedTextEl.classList.add('fx-out',`fx-${fx}`);
  if(mixedFxTimeout)clearTimeout(mixedFxTimeout);
  mixedFxTimeout=setTimeout(()=>{
    renderMixedText(nextText,{keywordOnly});
    clearMixedFxClasses();
    mixedTextEl.classList.add('fx-in',`fx-${fx}`);
    mixedFxTimeout=setTimeout(()=>{clearMixedFxClasses();mixedFxLock=false;},360);
  },300);
}
function showInitialMixedText(){
  if(!mixedTextEl)return;
  mixedKeywordGateWord=null;
  renderMixedText(buildMixedText(mixedCurrentTheme));
  clearMixedFxClasses();
  mixedTextEl.classList.add('fx-in',`fx-${pickMixedFx()}`);
  if(mixedFxTimeout)clearTimeout(mixedFxTimeout);
  mixedFxTimeout=setTimeout(()=>clearMixedFxClasses(),360);
}
function startMixedHoverShuffle(){
  if(!mixedFirstHoverActive||mixedHoverTimer||!mixedTextEl)return;
  mixedTextEl.classList.add('hover-chaos');
  if(mixedScreen)mixedScreen.classList.add('noise-active');
  mixedHoverTimer=setInterval(()=>{renderMixedText(buildMixedBurstText(mixedCurrentTheme));},45);
}
function assignDoorHoverSlots(count=5){
  doorTiles.forEach(tile=>{tile.dataset.hoverChaos='0';});
  const shuffled=[...doorTiles];
  for(let i=shuffled.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    const tmp=shuffled[i];
    shuffled[i]=shuffled[j];
    shuffled[j]=tmp;
  }
  shuffled.slice(0,Math.min(count,shuffled.length)).forEach(tile=>{tile.dataset.hoverChaos='1';});
}
function goNextMixedFromClick(){
  mixedCurrentTheme=pickRelatedTheme(mixedCurrentTheme);
  const nextText=buildMixedText(mixedCurrentTheme);
  const gateWord=pickKeywordGateWord(nextText);
  if(gateWord&&Math.random()<KEYWORD_GATE_CHANCE){
    mixedKeywordGateWord=gateWord;
    swapMixedText(gateWord,{keywordOnly:true});
    return;
  }
  mixedKeywordGateWord=null;
  swapMixedText(nextText);
}
function randomizeDoorMotion(){
  assignDoorHoverSlots(5);
  doorTiles.forEach(tile=>{
    const sign=Math.random()<0.5?-1:1;
    const angle=(randInt(18,58)*sign).toFixed(1);
    const skew=(randInt(1,8)*sign).toFixed(1);
    const dur=(Math.random()*0.38+0.28).toFixed(2);
    tile.style.setProperty('--open-angle',`${angle}deg`);
    tile.style.setProperty('--open-skew',`${skew}deg`);
    tile.style.setProperty('--door-origin',sign<0?'left center':'right center');
    tile.style.setProperty('--open-dur',`${dur}s`);
  });
}
function handleMixedBack(){
  stopMixedHoverMode();
  mixedScreen.classList.remove('visible');
  setTimeout(()=>{overlapScreen.classList.add('visible');randomizeDoorMotion();},SCREEN_SWITCH_DELAY_MS);
}
function openMixedScreenFromDoor(e){
  if(!overlapScreen.classList.contains('visible'))return;
  stopMixedHoverMode();
  const tile = e && e.currentTarget ? e.currentTarget : null;
  const doorIndex=tile?doorTiles.indexOf(tile):-1;
  if(doorIndex===3){openWaveScreenFromDoor();return;}
  if(doorIndex===7){openGlyphScreenFromDoor();return;}
  if(doorIndex===10){openFramesScreenFromDoor();return;}
  mixedCurrentTheme=pickRandomTheme();
  mixedFirstHoverActive=!!tile&&tile.dataset.hoverChaos==='1';
  mixedKeywordGateWord=null;
  overlapScreen.classList.remove('visible');
  setTimeout(()=>{mixedScreen.classList.add('visible');showInitialMixedText();},SCREEN_SWITCH_DELAY_MS);
}
doorTiles.forEach(tile=>tile.addEventListener('click',openMixedScreenFromDoor));
if(mixedTextEl){
  mixedTextEl.addEventListener('click',e=>{
    e.stopPropagation();
    stopMixedHoverMode();
    mixedFirstHoverActive=false;
    if(mixedKeywordGateWord){
      mixedKeywordGateWord=null;
      goNextMixedFromClick();
      return;
    }
    goNextMixedFromClick();
  });
  mixedTextEl.addEventListener('mouseenter',startMixedHoverShuffle);
  mixedTextEl.addEventListener('mouseleave',stopMixedHoverMode);
}
if(mixedStageEl){
  mixedStageEl.addEventListener('click',e=>{if(e.target===mixedStageEl)handleMixedBack();});
}
if(waveScreen){
  waveScreen.addEventListener('click',e=>{if(e.target===waveScreen||e.target===waveCanvas)handleWaveBack();});
}
if(glyphScreen){
  glyphScreen.addEventListener('click',e=>{if(e.target===glyphScreen||e.target===glyphCanvas)handleGlyphBack();});
}
if(framesScreen){
  framesScreen.addEventListener('click',e=>{if(e.target===framesScreen||e.target===framesCanvas)handleFramesBack();});
}
// ============================================================
randomizeDoorMotion();
start();
