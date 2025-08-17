const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

function toNumber(v){ const n = Number(v); return Number.isFinite(n) ? n : NaN; }
function fmt(n){ return (Math.round(n * 1e5) / 1e5).toFixed(5); }
function toRad(v, unit){
  if(unit === 'grau') return v * Math.PI / 180;
  if(unit === 'grado') return v * Math.PI / 200;
  return v;
}

const FIGURAS = [
  { id:'triangulo', label:'Triângulo', tag:'4 modos', methods:[
    { id:'base-altura', label:'Base e altura', fields:[
      {id:'base', label:'Base', type:'number'},
      {id:'altura', label:'Altura', type:'number'},
    ], calc:(v)=> 0.5 * v.base * v.altura },
    { id:'tres-lados', label:'Três lados (Heron)', fields:[
      {id:'a', label:'Lado 1', type:'number'},
      {id:'b', label:'Lado 2', type:'number'},
      {id:'c', label:'Lado 3', type:'number'},
    ], calc:(v)=>{
      const {a,b,c} = v;
      if(!(a+b>c && a+c>b && b+c>a)) throw new Error('Lados inválidos: não satisfazem desigualdade do triângulo.');
      const s = (a+b+c)/2;
      return Math.sqrt(s*(s-a)*(s-b)*(s-c));
    }},
    { id:'dois-lados-angulo', label:'Dois lados e ângulo', fields:[
      {id:'lado1', label:'Lado 1', type:'number'},
      {id:'lado2', label:'Lado 2', type:'number'},
      {id:'ang', label:'Ângulo', type:'number'},
      {id:'u', label:'Unidade', type:'select', options:[{v:'grau',t:'Grau'},{v:'rad',t:'Radiano'},{v:'grado',t:'Grado'}]},
    ], calc:(v)=> 0.5 * v.lado1 * v.lado2 * Math.sin(toRad(v.ang, v.u)) },
    { id:'equilatero', label:'Equilátero (lado)', fields:[
      {id:'lado', label:'Lado', type:'number'},
    ], calc:(v)=> (v.lado*v.lado*Math.sqrt(3))/4 },
  ]},
  { id:'quadrilatero', label:'Quadrilátero', tag:'5 modos', methods:[
    { id:'quadrado', label:'Quadrado (lado)', fields:[{id:'lado', label:'Lado', type:'number'}], calc:(v)=> v.lado*v.lado },
    { id:'retangulo', label:'Retângulo (base/altura)', fields:[{id:'base', label:'Base', type:'number'},{id:'altura', label:'Altura', type:'number'}], calc:(v)=> v.base*v.altura },
    { id:'losango', label:'Losango (diagonais)', fields:[{id:'d1', label:'Diagonal 1', type:'number'},{id:'d2', label:'Diagonal 2', type:'number'}], calc:(v)=> (v.d1*v.d2)/2 },
    { id:'trapezio', label:'Trapézio (bases/altura)', fields:[{id:'b1', label:'Base 1', type:'number'},{id:'b2', label:'Base 2', type:'number'},{id:'h', label:'Altura', type:'number'}], calc:(v)=> ((v.b1+v.b2)*v.h)/2 },
    { id:'paralelogramo', label:'Paralelogramo (base/altura)', fields:[{id:'base', label:'Base', type:'number'},{id:'altura', label:'Altura', type:'number'}], calc:(v)=> v.base*v.altura },
  ]},
  { id:'pentagono', label:'Pentágono', tag:'regular', methods:[
    { id:'regular', label:'Regular (lado)', fields:[{id:'lado', label:'Lado', type:'number'}], calc:(v)=> (5*v.lado*v.lado)/(4*Math.tan(Math.PI/5)) },
  ]},
  { id:'hexagono', label:'Hexágono', tag:'regular', methods:[
    { id:'regular', label:'Regular (lado)', fields:[{id:'lado', label:'Lado', type:'number'}], calc:(v)=> (3*(v.lado*v.lado)*Math.sqrt(3))/2 },
  ]},
  { id:'circunferencia', label:'Circunferência', tag:'3 modos', methods:[
    { id:'area', label:'Área do círculo (raio)', fields:[{id:'r', label:'Raio', type:'number'}], calc:(v)=> Math.PI*v.r*v.r },
    { id:'setor', label:'Setor circular', fields:[
      {id:'r', label:'Raio', type:'number'},
      {id:'ang', label:'Ângulo', type:'number'},
      {id:'u', label:'Unidade', type:'select', options:[{v:'grau',t:'Grau'},{v:'rad',t:'Radiano'},{v:'grado',t:'Grado'}]}
    ], calc:(v)=> 0.5 * (toRad(v.ang, v.u)) * v.r * v.r },
    { id:'anular', label:'Círculo anular (R, r)', fields:[
      {id:'R', label:'Raio maior (R)', type:'number'},
      {id:'r', label:'Raio menor (r)', type:'number'}
    ], calc:(v)=> { if(v.R<=v.r) throw new Error('O raio maior deve ser maior que o menor.'); return Math.PI*(v.R*v.R - v.r*v.r); } },
  ]},
];

const figNav = $('#figNav');
const methodSel = $('#method');
const inputs = $('#inputs');
const resBox = $('#result');
const resHint = resBox.querySelector('.hint');
const resValue = resBox.querySelector('.value');
const historyList = $('#historyList');

let currentFigure, currentMethod;

function renderFigures(){
  figNav.innerHTML = '';
  FIGURAS.forEach((f,i)=>{
    const btn=document.createElement('button');
    btn.innerHTML=`<span>${f.label}</span><span class="tag">${f.tag||''}</span>`;
    btn.dataset.id=f.id;
    if(i===0) btn.classList.add('active');
    btn.addEventListener('click',()=>setFigure(f.id));
    figNav.appendChild(btn);
  });
}

function setFigure(id){
  currentFigure=FIGURAS.find(f=>f.id===id)||FIGURAS[0];
  $$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.id===currentFigure.id));
  renderMethods();
  setMethod(currentFigure.methods[0].id);
}

function renderMethods(){
  methodSel.innerHTML=currentFigure.methods.map(m=>`<option value="${m.id}">${m.label}</option>`).join('');
}

function setMethod(id){
  currentMethod=currentFigure.methods.find(m=>m.id===id)||currentFigure.methods[0];
  inputs.innerHTML='';
  (currentMethod.fields||[]).forEach(f=>{
    const wrap=document.createElement('div');
    wrap.className='section';
    const fid=`f_${f.id}`;
    wrap.innerHTML=`<label for="${fid}">${f.label}</label>`+
      (f.type==='select'
        ? `<select id="${fid}">${f.options.map(o=>`<option value="${o.v}">${o.t}</option>`).join('')}</select>`
        : `<input id="${fid}" type="number" step="any" />`);
    inputs.appendChild(wrap);
  });
  resBox.classList.remove('ok','err');
  resHint.textContent='Preencha os campos e clique em Calcular.';
  resValue.textContent='';
}

function readValues(){
  const vals={};
  for(const f of currentMethod.fields||[]){
    const el=document.getElementById(`f_${f.id}`);
    if(f.type==='select') vals[f.id]=el.value; else vals[f.id]=toNumber(el.value);
  }
  return vals;
}

function calculate(){
  try{
    const vals=readValues();
    const area=currentMethod.calc(vals);
    resBox.classList.remove('err');resBox.classList.add('ok');
    resHint.textContent=`${currentFigure.label} • ${currentMethod.label}`;
    resValue.textContent=`Área = ${fmt(area)}`;
    addHistory(`${currentFigure.label} (${currentMethod.label}) → ${fmt(area)}`);
  }catch(err){
    resBox.classList.remove('ok');resBox.classList.add('err');
    resHint.textContent='Erro:';resValue.textContent=err.message;
  }
}

function clearAll(){
  $$('#inputs input').forEach(i=>i.value='');
  resBox.classList.remove('ok','err');
  resHint.textContent='Campos limpos.';resValue.textContent='';
}

function addHistory(text){
  const li=document.createElement('li');
  li.textContent=text;
  historyList.prepend(li);
  if(historyList.children.length>20) historyList.removeChild(historyList.lastChild);
}

methodSel.addEventListener('change',e=>setMethod(e.target.value));
$('#btnCalc').addEventListener('click',calculate);
$('#btnClear').addEventListener('click',clearAll);

renderFigures();
setFigure(FIGURAS[0].id);

// Menu hambúrguer no mobile
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');

if (menuToggle && sidebar) {
  menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });
}
// Atalho: pressionar Enter executa o cálculo
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // evita submit ou comportamento padrão
    calculate();
  }
});
function setFigure(id){
  currentFigure=FIGURAS.find(f=>f.id===id)||FIGURAS[0];
  $$('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.id===currentFigure.id));
  renderMethods();
  setMethod(currentFigure.methods[0].id);

  // 🔽 Fecha o menu no celular depois de escolher uma figura
  if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
    sidebar.classList.remove('open');
  }
}

