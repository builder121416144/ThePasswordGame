// ================== SETUP ==================
const input = document.getElementById("password");
const rulesList = document.getElementById("rules");

const months = ["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
const sponsors = ["pepsi","starbucks","shell"];
const romanMap = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
const elements = {
  H:1, He:2, Li:3, Be:4, B:5, C:6, N:7, O:8, F:9, Ne:10,
  Na:11, Mg:12, Al:13, Si:14, P:15, S:16, Cl:17, Ar:18,
  K:19, Ca:20, Fe:26, Cu:29, Zn:30, Ag:47, Au:79, Pb:82
};

// ================== VALORI SEGRETI (MA MOSTRATI NELLE REGOLE) ==================
const captcha = Math.random().toString(36).substring(2, 7);
const secretColor = "#" + Math.floor(Math.random()*16777215).toString(16).padStart(6,"0");
const paulFood = Math.floor(Math.random()*5)+3;

const cityData = {
  city: "Ulan-Ude",
  country: "Russia"
};

const englishWord = { en: "ineffable", it: "ineffabile" };

const moonRule = { word: "luna piena", emoji: "🌕" };

const forbiddenLetters = ["x","q"];

const timeRule = {
  text: "it's half past ten",
  value: "10:30"
};

// ================== FUNZIONI UTILI ==================
function romanValue(str) {
  let total = 0;
  for (let c of str) total += romanMap[c] || 0;
  return total;
}

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let i=2;i<=Math.sqrt(n);i++) if (n%i===0) return false;
  return true;
}

// ================== REGOLE ==================
const rules = [
  { text:"Almeno 5 caratteri.", check:p=>p.length>=5 },
  { text:"Deve includere un numero.", check:p=>/\d/.test(p) },
  { text:"Deve includere una maiuscola.", check:p=>/[A-Z]/.test(p) },
  { text:"Deve includere un carattere speciale.", check:p=>/[^A-Za-z0-9]/.test(p) },
  { text:"La somma delle cifre deve essere 25.", check:p=>(p.match(/\d/g)||[]).reduce((a,b)=>a+Number(b),0)===25 },
  { text:"Inserisci un mese dell’anno.", check:p=>new RegExp(months.join("|"),"i").test(p) },
  { text:"Inserisci un numero romano.", check:p=>/[IVXLCDM]+/.test(p) },
  { text:"Inserisci uno sponsor: Pepsi, Starbucks o Shell.", check:p=>new RegExp(sponsors.join("|"),"i").test(p) },
  { text:"I numeri romani devono moltiplicarsi per 35.", check:p=>{
      const romans = p.match(/[IVXLCDM]+/g);
      if(!romans) return false;
      return romans.reduce((a,b)=>a*romanValue(b),1)===35;
    }},
  { text:`Inserisci il CAPTCHA: ${captcha}`, check:p=>p.includes(captcha) },
  { text:`Inserisci la traduzione italiana di "${englishWord.en}".`, check:p=>p.toLowerCase().includes(englishWord.it) },
  { text:"Inserisci un simbolo chimico di due lettere.", check:p=>Object.keys(elements).some(e=>e.length===2 && p.includes(e)) },
  { text:`Inserisci la fase lunare ${moonRule.word} come emoji ${moonRule.emoji}.`, check:p=>p.includes(moonRule.emoji) },
  { text:`Inserisci il paese della città ${cityData.city}.`, check:p=>p.toLowerCase().includes(cityData.country.toLowerCase()) },
  { text:"Inserisci un anno bisestile.", check:p=>{
      const ys = p.match(/\d{4}/g)||[];
      return ys.some(y=>isLeapYear(Number(y)));
    }},
  { text:"🥚 Inserisci l’uovo di Paul.", check:p=>p.includes("🥚") },
  { text:"Gli elementi chimici devono sommare 200.", check:p=>{
      let sum=0;
      Object.entries(elements).forEach(([e,v])=>{
        const m=p.match(new RegExp(e,"g"));
        if(m) sum+=v*m.length;
      });
      return sum===200;
    }},
  { text:"🔥 Inserisci 💧 per spegnere il fuoco.", check:p=>p.includes("💧") },
  { text:"🏋️‍♂️ Rendi la password più sicura.", check:p=>p.length>=12 && /[A-Z]/.test(p) && /\d/.test(p) && /[^A-Za-z0-9]/.test(p) },
  { text:"Inserisci: sono amato / sono degno / sono abbastanza.", check:p=>/(sono amato|sono degno|sono abbastanza)/i.test(p) },
  { text:`🐛 Dai a Paul ${paulFood} insetti.`, check:p=>(p.match(/🐛/g)||[]).length>=paulFood },
  { text:`🩸 Sacrificio: non usare le lettere ${forbiddenLetters.join(", ")}.`, check:p=>!forbiddenLetters.some(l=>p.toLowerCase().includes(l)) },
  { text:`Inserisci il colore ${secretColor}.`, check:p=>p.includes(secretColor) },
  { text:"Inserisci la lunghezza della password (escludendo queste cifre).", check:p=>{
      const nums=p.match(/\d+/g)||[];
      return nums.some(n=>{
        const cleaned=p.replace(n,"");
        return cleaned.length===Number(n);
      });
    }},
  { text:"La lunghezza deve essere un numero primo.", check:p=>isPrime(p.length) },
  { text:`Inserisci l’ora ${timeRule.text} come ${timeRule.value}.`, check:p=>p.includes(timeRule.value) }
];

// ================== RENDER ==================
function render(pw){
  rulesList.innerHTML="";
  let passedAll=true;

  for(let r of rules){
    const li=document.createElement("li");
    li.textContent=r.text;
    if(r.check(pw)){
      li.style.color="green";
    } else {
      li.style.color="red";
      passedAll=false;
      rulesList.appendChild(li);
      break;
    }
    rulesList.appendChild(li);
  }

  if(passedAll){
    const win=document.createElement("li");
    win.textContent="🎉 Hai vinto.";
    win.style.color="gold";
    rulesList.appendChild(win);
  }
}

input.addEventListener("input",e=>render(e.target.value));
render("");
