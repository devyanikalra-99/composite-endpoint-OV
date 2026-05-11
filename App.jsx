import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Upload, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Download, X, ChevronDown, Activity, Sparkles, Mail, FileSpreadsheet, Info, Building2, MapPin } from 'lucide-react';

/* ============================================================
   NIRVANA BRAND TOKENS (per brand guidelines)
   ============================================================ */
const C = {
  deepPurple: '#2F1D47',
  vibrantPurple: '#9273F4',
  lilac: '#AE9BEA',
  warmLight: '#DCD2C8',
  offWhite: '#F5F0EC',
  warmShadow: '#AD9D92',
  ink: '#1A0F2E',
  white: '#FFFFFF',
  green: '#3F8E5C',
  greenSoft: '#5BA876',
  redAlert: '#B5374D',
  amber: '#C68B3C',
  cardBorder: '#E8DFD5',
};

/* ============================================================
   NIRVANA LOGO — accurate to brand guidelines
   6-petal lotus with alternating vibrant purple / warm shadow petals
   in a swirling pinwheel arrangement around a cream center
   ============================================================ */
function NirvanaLogo({ size = 32, withWordmark = true }) {
  // Official Nirvana logo (deep-purple monochrome mark + wordmark) embedded as base64 PNG
  // The 'withWordmark' prop is preserved for API compatibility; the official lockup includes both.
  return (
    <img
      src="data:image/png;base64,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"
      alt="Nirvana"
      style={{ height: size, width: 'auto', display: 'block' }}
    />
  );
}

/* ============================================================
   DETERMINISTIC PRNG
   ============================================================ */
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const pick = (arr) => arr[Math.floor(rand() * arr.length)];
const randInt = (min, max) => Math.floor(rand() * (max - min + 1)) + min;

function randString(len, charset) {
  let r = '';
  for (let i = 0; i < len; i++) r += charset[Math.floor(rand() * charset.length)];
  return r;
}

/* ============================================================
   FAKE DATA GENERATION
   ============================================================ */
const FIRST_NAMES = ['James','Mary','Robert','Patricia','John','Jennifer','Michael','Linda','David','Barbara','William','Elizabeth','Richard','Jessica','Joseph','Susan','Thomas','Sarah','Charles','Karen','Christopher','Lisa','Daniel','Nancy','Matthew','Betty','Anthony','Sandra','Mark','Margaret','Donald','Ashley','Steven','Kimberly','Paul','Emily','Andrew','Donna','Joshua','Michelle','Kenneth','Carol','Kevin','Amanda','Brian','Melissa','George','Deborah','Edward','Stephanie','Ronald','Dorothy','Timothy','Rebecca','Jason','Sharon','Jeffrey','Laura','Ryan','Cynthia','Jacob','Amy','Gary','Kathleen','Nicholas','Angela','Eric','Shirley','Jonathan','Brenda','Stephen','Emma','Larry','Anna','Justin','Pamela','Scott','Nicole','Brandon','Samantha','Benjamin','Katherine','Samuel','Christine','Frank','Helen','Gregory','Debra','Raymond','Rachel','Alexander','Carolyn','Patrick','Janet','Jack','Maria','Dennis','Catherine','Jerry','Heather','Tyler','Diane','Aaron','Olivia','Henry','Julie','Douglas','Joyce','Peter','Victoria','Jose','Ruth','Adam','Virginia','Nathan','Lauren','Zachary','Kelly','Walter','Christina','Kyle','Joan','Harold','Evelyn','Carl','Judith','Jeremy','Andrea','Keith','Hannah','Roger','Megan','Gerald','Cheryl','Ethan','Jacqueline','Arthur','Martha','Terry','Madison','Christian','Teresa','Sean','Gloria','Lawrence','Sara','Austin','Janice','Joe','Ann','Noah','Kathryn','Jesse','Abigail','Albert','Sophia','Bryan','Frances','Bruce','Jean','Gabriel','Alice','Logan','Judy','Willie','Isabella','Alan','Julia','Juan','Grace','Wayne','Amber','Roy','Denise','Ralph','Danielle','Randy','Marilyn','Eugene','Beverly','Vincent','Charlotte','Russell','Natalie','Louis','Theresa','Bobby','Diana','Philip','Brittany','Johnny'];
const LAST_NAMES = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez','Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin','Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson','Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores','Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts','Gomez','Phillips','Evans','Turner','Diaz','Parker','Cruz','Edwards','Collins','Reyes','Stewart','Morris','Morales','Murphy','Cook','Rogers','Gutierrez','Ortiz','Morgan','Cooper','Peterson','Bailey','Reed','Kelly','Howard','Ramos','Kim','Cox','Ward','Richardson','Watson','Brooks','Chavez','Wood','James','Bennett','Gray','Mendoza','Ruiz','Hughes','Price','Alvarez','Castillo','Sanders','Patel','Myers','Long','Ross','Foster','Jimenez','Powell','Jenkins','Perry','Russell','Sullivan','Bell','Coleman','Butler','Henderson','Barnes','Gonzales','Fisher','Vasquez','Simmons','Romero','Jordan','Patterson','Alexander','Hamilton','Graham','Reynolds','Griffin','Wallace','Moreno','West','Cole','Hayes','Bryant','Herrera','Gibson','Ellis','Tran','Medina','Aguilar','Stevens','Murray','Ford','Castro','Marshall','Owens','Harrison','Fernandez','McDonald','Woods','Washington','Kennedy','Wells','Vargas','Henry','Chen','Freeman','Webb','Tucker','Guzman','Burns','Crawford','Olson','Simpson','Porter','Hunter','Gordon','Mendez','Silva','Shaw','Snyder','Mason','Dixon','Munoz','Hunt','Hicks','Holmes','Palmer','Wagner','Black','Robertson','Boyd','Rose','Stone','Salazar','Fox','Warren','Mills','Meyer','Rice','Schmidt','Garza','Daniels','Ferguson','Nichols','Stephens','Soto','Weaver','Ryan','Gardner','Payne','Grant','Dunn','Kelley','Spencer','Hawkins','Arnold','Pierce','Vazquez','Hansen','Peters','Santos','Hart','Bradley','Knight','Elliott','Cunningham'];

// Each state mapped to an "office" location (for office breakdown table)
const STATES_ZIPS = [
  { state: 'NY', stateName: 'New York', office: 'Manhattan, NY', zips: ['10001','10025','10128','11201','11215','11385','10463'] },
  { state: 'NJ', stateName: 'New Jersey', office: 'Jersey City, NJ', zips: ['07030','07305','07601','08540','07024','07087','07302'] },
  { state: 'CA', stateName: 'California', office: 'Los Angeles, CA', zips: ['90001','90210','94102','94110','90404','92101','94301'] },
  { state: 'IL', stateName: 'Illinois', office: 'Chicago, IL', zips: ['60601','60614','60625','60302','60187','60069','60053'] },
  { state: 'MI', stateName: 'Michigan', office: 'Detroit, MI', zips: ['48201','48104','48823','48075','48105','48067','48334'] },
  { state: 'GA', stateName: 'Georgia', office: 'Atlanta, GA', zips: ['30303','30309','30318','30030','30075','30068','30144'] },
  { state: 'PA', stateName: 'Pennsylvania', office: 'Philadelphia, PA', zips: ['19103','15213','19147','17101','19606','19111'] },
  { state: 'TX', stateName: 'Texas', office: 'Austin, TX', zips: ['77001','75201','78701','77024','78704','75205','77019'] },
  { state: 'OH', stateName: 'Ohio', office: 'Columbus, OH', zips: ['43215','44114','45202','43017','44131','45069','43204'] },
  { state: 'FL', stateName: 'Florida', office: 'Miami, FL', zips: ['33101','32801','33301','33602','33756','32202','33020'] },
];

const PAYERS = [
  { name: 'Aetna',                          payerId: '60054', volume: 100, prefix: () => 'W' + randString(9, '0123456789'), kind: 'commercial', state: null },
  { name: 'Cigna',                          payerId: '62308', volume: 75,  prefix: () => 'U' + randString(8, '0123456789'), kind: 'commercial', state: null },
  { name: 'UnitedHealthcare',               payerId: '87726', volume: 90,  prefix: () => randString(9, '0123456789'),       kind: 'commercial', state: null },
  { name: 'New York BCBS',                  payerId: 'NYBLS', volume: 50,  prefix: () => pick(['YLE','YLF','YLG']) + randString(9, '0123456789'), kind: 'commercial', state: 'NY' },
  { name: 'New Jersey BCBS',                payerId: '22099', volume: 40,  prefix: () => 'YLN' + randString(9, '0123456789'), kind: 'commercial', state: 'NJ' },
  { name: 'Illinois BCBS',                  payerId: 'ILBLS', volume: 40,  prefix: () => 'XOF' + randString(9, '0123456789'), kind: 'commercial', state: 'IL' },
  { name: 'Blue Cross of California',       payerId: 'BC001', volume: 30,  prefix: () => 'XEK' + randString(9, '0123456789'), kind: 'commercial', state: 'CA' },
  { name: 'Blue Shield of California',      payerId: 'BS001', volume: 22,  prefix: () => 'XEJ' + randString(9, '0123456789'), kind: 'commercial', state: 'CA' },
  { name: 'Michigan BCBS',                  payerId: 'MIBLS', volume: 22,  prefix: () => 'YLM' + randString(9, '0123456789'), kind: 'commercial', state: 'MI' },
  { name: 'Anthem (Georgia BCBS)',          payerId: 'GABLS', volume: 18,  prefix: () => 'YLA' + randString(9, '0123456789'), kind: 'commercial', state: 'GA' },
  { name: 'Humana',                         payerId: '61101', volume: 22,  prefix: () => 'H' + randString(8, '0123456789'),   kind: 'commercial', state: null },
  { name: 'UMR',                            payerId: '39026', volume: 22,  prefix: () => randString(9, '0123456789'),         kind: 'commercial', state: null },
  { name: 'Oscar',                          payerId: '11201', volume: 18,  prefix: () => randString(10, '0123456789'),        kind: 'commercial', state: null },
  { name: 'Wellpoint',                      payerId: '47198', volume: 14,  prefix: () => 'YLW' + randString(9, '0123456789'), kind: 'commercial', state: null },
  { name: 'Kaiser Permanente',              payerId: 'KPIC1', volume: 10,  prefix: () => 'KP' + randString(8, '0123456789'),  kind: 'commercial', state: 'CA' },
  { name: 'New Jersey Medicaid',            payerId: 'NJMCD', volume: 22,  prefix: () => randString(12, '0123456789'),        kind: 'medicaid', state: 'NJ' },
  { name: 'Illinois Medicaid',              payerId: 'ILMCD', volume: 18,  prefix: () => randString(12, '0123456789'),        kind: 'medicaid', state: 'IL' },
  { name: 'Original Medicare',              payerId: 'MCRPT', volume: 22,  prefix: () => randString(1, '123456789') + randString(1, 'ABCDEFGHJKMNPQRTUVWXY') + randString(1, '0123456789') + randString(1, 'ABCDEFGHJKMNPQRTUVWXY') + randString(1, '0123456789') + randString(1, 'ABCDEFGHJKMNPQRTUVWXY') + randString(1, '0123456789') + randString(1, 'ABCDEFGHJKMNPQRTUVWXY') + randString(2, '0123456789') + randString(2, 'ABCDEFGHJKMNPQRTUVWXY'), kind: 'medicare', state: null },
];

// Plan structures by payer (for cost-share insights)
const PLAN_NAMES_BY_PAYER = {
  'Aetna': ['Aetna PPO 1500', 'Aetna HMO Bronze', 'Aetna Open Choice', 'Aetna Select'],
  'Cigna': ['Cigna Open Access Plus', 'Cigna LocalPlus', 'Cigna Connect Bronze'],
  'UnitedHealthcare': ['UHC Choice Plus', 'UHC Navigate', 'UHC Options PPO'],
  'New York BCBS': ['Empire BCBS PPO', 'Empire HMO Gold', 'Empire EPO'],
  'New Jersey BCBS': ['Horizon BCBS PPO', 'Horizon Direct Access', 'Horizon HMO'],
  'Illinois BCBS': ['BCBS IL PPO', 'BCBS IL Blue Choice', 'BCBS IL Blue Advantage'],
  'Blue Cross of California': ['Anthem Blue Cross PPO', 'Anthem Pathway X'],
  'Blue Shield of California': ['BSCA Access+ HMO', 'BSCA Trio HMO'],
  'Michigan BCBS': ['BCBS MI Community Blue PPO', 'BCBS MI Simply Blue HMO'],
  'Anthem (Georgia BCBS)': ['Anthem Pathway PPO', 'Anthem Bronze Pathway X'],
  'Humana': ['Humana ChoiceCare PPO', 'Humana Gold Plus HMO'],
  'UMR': ['UMR PPO Plus', 'UMR Open Access'],
};

function generateDataset() {
  const patients = [];
  let id = 1;

  // Composition target: 750 total
  //   500 with payer + member
  //   100 with payer only (missing member)        → Discover path
  //   100 with member only (missing payer)        → unusual; user wants to track. Will be handled as "missing payer" — Medicaid-first or SCAN-first
  //   50 with neither                             → Medicaid-first

  // Build the 500-patient with-both pool (allocate by payer volume)
  const withBothPool = [];
  PAYERS.forEach(payer => {
    const allocation = Math.round(payer.volume * (500 / PAYERS.reduce((s, p) => s + p.volume, 0)));
    for (let i = 0; i < allocation; i++) withBothPool.push(payer);
  });
  // Top up to 500 if under
  while (withBothPool.length < 500) withBothPool.push(pick(PAYERS));
  withBothPool.length = 500;

  // 500 records: with payer + member
  for (let i = 0; i < 500; i++) {
    patients.push(makePatient(id++, withBothPool[i], true, true));
  }
  // 100 records: with payer only (no member ID) — Discover path
  const payerOnlyPool = [];
  PAYERS.filter(p => p.kind === 'commercial').forEach(payer => {
    const allocation = Math.round(payer.volume * 0.65);
    for (let i = 0; i < allocation; i++) payerOnlyPool.push(payer);
  });
  for (let i = 0; i < 100; i++) {
    patients.push(makePatient(id++, payerOnlyPool[i % payerOnlyPool.length], true, false));
  }
  // 100 records: with member only (no payer)
  for (let i = 0; i < 100; i++) {
    // Pick a synthetic payer for member generation but mark payer as missing
    const ghostPayer = pick(PAYERS.filter(p => p.kind === 'commercial'));
    const p = makePatient(id++, ghostPayer, false, true);
    // member ID present, payer ID stripped, payer name empty
    p.memberId = ghostPayer.prefix();
    patients.push(p);
  }
  // 50 records: with neither — Medicaid-first
  for (let i = 0; i < 50; i++) {
    patients.push(makePatient(id++, null, false, false));
  }

  // Inject 4 deliberate payer ID typos for the validation step
  const typoTargets = [
    { wrong: 'MIBCS', correct: 'MIBLS', correctName: 'Michigan BCBS' },
    { wrong: 'NJBLS', correct: '22099', correctName: 'New Jersey BCBS' },
    { wrong: 'AZBLS', correct: '62179', correctName: 'Arizona BCBS' },
    { wrong: 'GBSBL', correct: 'GABLS', correctName: 'Anthem (Georgia BCBS)' },
  ];
  const candidateIndices = patients.map((p, i) => p.payerId ? i : -1).filter(i => i >= 0).slice(0, 80);
  const chosen = [];
  for (let i = 0; i < 4; i++) {
    let idx;
    do {
      idx = candidateIndices[Math.floor(rand() * candidateIndices.length)];
    } while (chosen.includes(idx));
    chosen.push(idx);
    patients[idx]._typo = typoTargets[i];
    patients[idx].payerId = typoTargets[i].wrong;
  }

  // Inject ~5% member ID typos (will surface as demographic mismatch alerts during run)
  const memberPatients = patients.filter(p => p.memberId);
  const memberTypoCount = Math.floor(memberPatients.length * 0.05);
  for (let i = 0; i < memberTypoCount; i++) {
    const p = memberPatients[Math.floor(rand() * memberPatients.length)];
    if (p._memberTypo) continue;
    p._memberTypo = true;
    const m = p.memberId;
    if (rand() < 0.5 && m.length > 4) {
      const pos = Math.floor(m.length / 2);
      p.memberId = m.slice(0, pos) + 'B' + m.slice(pos + 1);
    } else {
      p.memberId = m + randString(1, 'XYZ');
    }
  }

  // Shuffle for realism
  for (let i = patients.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [patients[i], patients[j]] = [patients[j], patients[i]];
  }
  patients.forEach((p, i) => p.rowId = i + 1);

  return patients;
}

function makePatient(id, payer, withPayer, withMember) {
  const stateRow = payer && payer.state ? STATES_ZIPS.find(s => s.state === payer.state) : pick(STATES_ZIPS);
  const zip = pick(stateRow.zips);
  const dobYear = randInt(1940, 2005);
  const dobMonth = randInt(1, 12);
  const dobDay = randInt(1, 28);
  const dob = `${String(dobMonth).padStart(2,'0')}/${String(dobDay).padStart(2,'0')}/${dobYear}`;

  return {
    rowId: id,
    firstName: pick(FIRST_NAMES),
    lastName: pick(LAST_NAMES),
    dob,
    state: stateRow.state,
    stateName: stateRow.stateName,
    office: stateRow.office,
    zip,
    payerName: withPayer && payer ? payer.name : '',
    payerId: withPayer && payer ? payer.payerId : '',
    payerKind: payer ? payer.kind : null,
    memberId: withMember && payer ? payer.prefix() : '',
    sessionRate: 200,
    npi: '1821547027',
  };
}

/* ============================================================
   APP STATE
   ============================================================ */
const STEPS = [
  { key: 'upload',    label: 'Upload' },
  { key: 'validate',  label: 'Confirm Inputs' },
  { key: 'preview',   label: 'About Your Data' },
  { key: 'run',       label: 'Run' },
  { key: 'summary',   label: 'Summary' },
];

export default function App() {
  const [step, setStep] = useState('upload');
  const [dataset, setDataset] = useState(null);
  const [validatedDataset, setValidatedDataset] = useState(null);

  const goTo = (s) => setStep(s);

  return (
    <div style={{
      fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
      backgroundColor: C.offWhite,
      minHeight: '100vh',
      color: C.deepPurple
    }}>
      <FontImport />
      <Header />
      <StepIndicator current={step} />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px 64px' }}>
        {step === 'upload' && <UploadScreen onUpload={(d) => { setDataset(d); goTo('validate'); }} />}
        {step === 'validate' && dataset && (
          <ValidateScreen
            dataset={dataset}
            onBack={() => goTo('upload')}
            onConfirm={(d) => { setValidatedDataset(d); goTo('preview'); }}
          />
        )}
        {step === 'preview' && validatedDataset && (
          <PreviewScreen
            dataset={validatedDataset}
            onBack={() => goTo('validate')}
            onRun={() => goTo('run')}
          />
        )}
        {step === 'run' && validatedDataset && (
          <RunScreen
            dataset={validatedDataset}
            onComplete={() => goTo('summary')}
          />
        )}
        {step === 'summary' && validatedDataset && (
          <SummaryScreen
            dataset={validatedDataset}
            onBackToInputs={() => goTo('preview')}
          />
        )}
      </main>
    </div>
  );
}

function FontImport() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
    `}</style>
  );
}

/* ============================================================
   HEADER
   ============================================================ */
function Header() {
  return (
    <header style={{
      backgroundColor: C.offWhite,
      borderBottom: `1px solid ${C.cardBorder}`,
      padding: '20px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 48 }}>
        <NirvanaLogo size={66} />
        <nav style={{ display: 'flex', gap: 32, fontSize: 15, fontWeight: 500 }}>
          <span style={{ opacity: 0.55 }}>Checker</span>
          <span style={{ opacity: 0.55, display: 'flex', alignItems: 'center', gap: 4 }}>Reports <ChevronDown size={14} /></span>
          <span style={{ opacity: 0.55, display: 'flex', alignItems: 'center', gap: 4 }}>Workflows <ChevronDown size={14} /></span>
          <span style={{ color: C.deepPurple, fontWeight: 700, borderBottom: `2px solid ${C.vibrantPurple}`, paddingBottom: 4 }}>Pilot</span>
        </nav>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ background: C.warmLight, padding: '6px 16px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>Testing SP</div>
        <div style={{ background: C.deepPurple, color: C.offWhite, width: 36, height: 36, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>DK</div>
      </div>
    </header>
  );
}

/* ============================================================
   STEP INDICATOR
   ============================================================ */
function StepIndicator({ current }) {
  const idx = STEPS.findIndex(s => s.key === current);
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 32px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {STEPS.map((s, i) => {
          const isActive = i === idx;
          const isPast = i < idx;
          return (
            <React.Fragment key={s.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: isActive ? C.deepPurple : isPast ? C.vibrantPurple : 'transparent',
                  border: isActive || isPast ? 'none' : `1.5px solid ${C.warmShadow}`,
                  color: isActive || isPast ? C.offWhite : C.warmShadow,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 600,
                  transition: 'all 0.3s',
                }}>
                  {isPast ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                <span style={{
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? C.deepPurple : isPast ? C.deepPurple : C.warmShadow,
                  whiteSpace: 'nowrap',
                }}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{ flex: '0 0 60px', height: 1, background: isPast ? C.vibrantPurple : C.warmShadow, opacity: isPast ? 1 : 0.3, margin: '0 16px' }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   STEP 1: UPLOAD
   ============================================================ */
function UploadScreen({ onUpload }) {
  const [filename, setFilename] = useState(null);
  const [parsing, setParsing] = useState(false);

  const handleFileSelect = () => {
    setFilename('lumexa_pilot_sample_750.csv');
    setParsing(true);
    setTimeout(() => {
      const data = generateDataset();
      setParsing(false);
      onUpload(data);
    }, 1400);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, letterSpacing: -0.5 }}>Run Your Patient Sample</h1>

      <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 48, textAlign: 'center' }}>
        <div style={{
          width: 80, height: 80, borderRadius: 40, background: C.offWhite,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <Upload size={36} color={C.deepPurple} />
        </div>

        {!filename && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Drop your CSV here</h2>
            <p style={{ fontSize: 14, color: C.warmShadow, marginBottom: 24 }}>
              Required columns: first_name, last_name, dob, zip, session_rate, NPI<br/>
              Optional: payer_id, member_id, state
            </p>
            <button
              onClick={handleFileSelect}
              style={{
                background: C.vibrantPurple, color: C.white,
                border: 'none', padding: '12px 28px', borderRadius: 24,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(47, 29, 71, 0.08)',
              }}
            >
              Choose file
            </button>
          </>
        )}

        {filename && parsing && (
          <>
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Parsing {filename}…</h2>
            <div style={{ width: 240, height: 4, background: C.cardBorder, borderRadius: 2, margin: '20px auto', overflow: 'hidden' }}>
              <div style={{
                width: '100%', height: '100%', background: C.vibrantPurple,
                animation: 'progressbar 1.4s ease-out forwards',
              }} />
            </div>
            <style>{`@keyframes progressbar { from { transform: translateX(-100%); } to { transform: translateX(0); } }`}</style>
          </>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STEP 2: CONFIRM INPUTS (with checkable individual fixes + filterable table)
   ============================================================ */
function ValidateScreen({ dataset, onBack, onConfirm }) {
  const initialTypoRows = useMemo(() => dataset.filter(p => p._typo), [dataset]);
  const [fixedRowIds, setFixedRowIds] = useState(new Set()); // Set of rowIds
  const [keptAsIs, setKeptAsIs] = useState(false);
  const [toast, setToast] = useState(null); // { message }

  const remainingTypos = initialTypoRows.filter(p => !fixedRowIds.has(p.rowId));
  const allResolved = remainingTypos.length === 0 || keptAsIs;

  const stats = useMemo(() => {
    return {
      total: dataset.length,
      withPayer: dataset.filter(p => p.payerId).length,
      withMember: dataset.filter(p => p.memberId).length,
      missingPayer: dataset.filter(p => !p.payerId && p.memberId).length,
      missingMember: dataset.filter(p => p.payerId && !p.memberId).length,
      missingBoth: dataset.filter(p => !p.payerId && !p.memberId).length,
    };
  }, [dataset]);

  const handleFixOne = (p) => {
    setFixedRowIds(prev => {
      const next = new Set(prev);
      next.add(p.rowId);
      return next;
    });
    setToast({ message: `Payer ID switched to ${p._typo.correct} for ${p.firstName} ${p.lastName}` });
    setTimeout(() => setToast(null), 2800);
  };

  const handleFixAll = () => {
    const ids = new Set(initialTypoRows.map(p => p.rowId));
    setFixedRowIds(ids);
    setToast({ message: `All ${initialTypoRows.length} payer IDs auto-corrected` });
    setTimeout(() => setToast(null), 2800);
  };

  const handleKeepExisting = () => {
    setKeptAsIs(true);
    setToast({ message: 'Existing mappings will be kept — failed checks may increase' });
    setTimeout(() => setToast(null), 2800);
  };

  const handleConfirm = () => {
    if (!allResolved) return;
    const updated = dataset.map(p => {
      if (p._typo && fixedRowIds.has(p.rowId)) {
        return { ...p, payerId: p._typo.correct, _typoFixed: true, _originalTypo: p._typo, _typo: null };
      }
      if (p._typo && keptAsIs) {
        // keep payerId as-is; this will likely 4xx during run
        return { ...p, _typoKept: true, _originalTypo: p._typo };
      }
      return p;
    });
    onConfirm(updated);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: -0.5 }}>Confirm Inputs</h1>
      <p style={{ fontSize: 15, color: C.warmShadow, marginBottom: 32 }}>
        750 records detected. Review the sample composition and resolve any flagged payer IDs before running the pilot.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 32 }}>
        <StatCard label="Total records" value={stats.total} />
        <StatCard label="All fields available" value={stats.total - stats.missingPayer - stats.missingMember - stats.missingBoth} sub={`${(((stats.total - stats.missingPayer - stats.missingMember - stats.missingBoth) / stats.total) * 100).toFixed(1)}%`} />
        <StatCard label="Missing payer ID" value={stats.missingPayer} sub={`${((stats.missingPayer / stats.total) * 100).toFixed(1)}%`} />
        <StatCard label="Missing member ID" value={stats.missingMember} sub={`${((stats.missingMember / stats.total) * 100).toFixed(1)}%`} />
        <StatCard label="Missing both" value={stats.missingBoth} sub={`${((stats.missingBoth / stats.total) * 100).toFixed(1)}%`} />
      </div>

      {!keptAsIs && remainingTypos.length > 0 && (
        <div style={{
          background: C.white, border: `1px solid ${C.amber}40`, borderLeft: `3px solid ${C.amber}`,
          borderRadius: 12, padding: 24, marginBottom: 24,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 16, background: `${C.amber}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertCircle size={18} color={C.amber} />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>{remainingTypos.length} payer ID{remainingTypos.length === 1 ? '' : 's'} not in supported payers list</h3>
              <p style={{ fontSize: 14, color: C.warmShadow, marginBottom: 16 }}>
                Did you mean these supported payer IDs? Review and fix individually, fix all at once, or keep your existing mappings.
              </p>
              <div style={{ background: C.offWhite, borderRadius: 8, padding: 4, marginBottom: 16 }}>
                {remainingTypos.map((p, i) => (
                  <div key={p.rowId} style={{
                    display: 'flex', alignItems: 'center', gap: 16,
                    padding: '12px 16px',
                    borderBottom: i < remainingTypos.length - 1 ? `1px solid ${C.cardBorder}` : 'none',
                    fontSize: 14,
                    animation: 'fadeIn 0.3s ease-out',
                  }}>
                    <div style={{ flex: '0 0 70px', color: C.warmShadow, fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>Row {p.rowId}</div>
                    <div style={{ flex: '0 0 140px', fontWeight: 500 }}>{p.firstName} {p.lastName}</div>
                    <div style={{ flex: '0 0 90px', fontFamily: 'ui-monospace, monospace', fontSize: 12, color: C.redAlert, textDecoration: 'line-through' }}>{p._typo.wrong}</div>
                    <ArrowRight size={14} color={C.warmShadow} />
                    <div style={{ flex: '0 0 90px', fontFamily: 'ui-monospace, monospace', fontSize: 12, fontWeight: 600, color: C.green }}>{p._typo.correct}</div>
                    <div style={{ flex: 1, color: C.warmShadow, fontSize: 13 }}>{p._typo.correctName}</div>
                    <button
                      onClick={() => handleFixOne(p)}
                      style={{
                        background: C.deepPurple, color: C.offWhite,
                        border: 'none', padding: '6px 14px', borderRadius: 14,
                        fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      <CheckCircle2 size={12} /> Fix
                    </button>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={handleFixAll}
                  style={{
                    background: C.deepPurple, color: C.offWhite,
                    border: 'none', padding: '10px 18px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Make all corrections ({remainingTypos.length})
                </button>
                <button
                  onClick={handleKeepExisting}
                  style={{
                    background: 'transparent', color: C.deepPurple,
                    border: `1px solid ${C.cardBorder}`, padding: '10px 18px', borderRadius: 20,
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  }}
                >
                  Keep existing mapping
                </button>
              </div>
            </div>
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}

      {(allResolved && initialTypoRows.length > 0) && (
        <div style={{
          background: `${C.green}10`, border: `1px solid ${C.green}40`, borderLeft: `3px solid ${C.green}`,
          borderRadius: 12, padding: 16, marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <CheckCircle2 size={20} color={C.green} />
          <span style={{ fontSize: 14, fontWeight: 500 }}>
            {keptAsIs && remainingTypos.length > 0
              ? `${remainingTypos.length} payer ID${remainingTypos.length === 1 ? '' : 's'} kept as-is — these will likely 4xx during the run.`
              : `All ${fixedRowIds.size} payer ID${fixedRowIds.size === 1 ? '' : 's'} resolved. Sample is ready.`}
          </span>
        </div>
      )}

      <SamplePreviewTable dataset={dataset} fixedRowIds={fixedRowIds} keptAsIs={keptAsIs} />

      <div style={{ marginTop: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Back to upload</button>
        <button
          onClick={handleConfirm}
          disabled={!allResolved}
          style={{
            ...primaryBtnStyle,
            opacity: allResolved ? 1 : 0.4,
            cursor: allResolved ? 'pointer' : 'not-allowed',
          }}
        >
          Continue <ArrowRight size={16} />
        </button>
      </div>

      {toast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32,
          background: C.deepPurple, color: C.offWhite,
          padding: '14px 20px', borderRadius: 10, fontSize: 14,
          boxShadow: '0 10px 30px rgba(47, 29, 71, 0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideUp 0.3s ease-out',
          maxWidth: 400,
          zIndex: 100,
        }}>
          <CheckCircle2 size={18} color={C.green} />
          {toast.message}
          <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 18 }}>
      <div style={{ fontSize: 12, color: C.warmShadow, marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: C.deepPurple, lineHeight: 1, letterSpacing: -0.5 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: C.warmShadow, marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

function SamplePreviewTable({ dataset, fixedRowIds, keptAsIs }) {
  const [filters, setFilters] = useState({ firstName: '', lastName: '', dob: '', state: '', zip: '', payerId: '', memberId: '' });
  const [collapsed, setCollapsed] = useState(true);

  const filtered = useMemo(() => {
    return dataset.filter(p => {
      if (filters.firstName && !p.firstName.toLowerCase().includes(filters.firstName.toLowerCase())) return false;
      if (filters.lastName && !p.lastName.toLowerCase().includes(filters.lastName.toLowerCase())) return false;
      if (filters.dob && !p.dob.includes(filters.dob)) return false;
      if (filters.state && p.state !== filters.state) return false;
      if (filters.zip && !p.zip.includes(filters.zip)) return false;
      if (filters.payerId && !(p.payerId || '').toLowerCase().includes(filters.payerId.toLowerCase())) return false;
      if (filters.memberId && !(p.memberId || '').toLowerCase().includes(filters.memberId.toLowerCase())) return false;
      return true;
    });
  }, [dataset, filters]);

  const states = useMemo(() => Array.from(new Set(dataset.map(p => p.state))).sort(), [dataset]);
  const hasActiveFilter = Object.values(filters).some(v => v);
  const visibleRows = collapsed ? filtered.slice(0, 8) : filtered;

  return (
    <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 14, fontWeight: 600 }}>
          Sample preview <span style={{ color: C.warmShadow, fontWeight: 400 }}>({filtered.length} of {dataset.length} records)</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {hasActiveFilter && (
            <button
              onClick={() => setFilters({ firstName: '', lastName: '', dob: '', state: '', zip: '', payerId: '', memberId: '' })}
              style={{
                background: 'transparent', color: C.warmShadow,
                border: `1px solid ${C.cardBorder}`, padding: '6px 14px', borderRadius: 14,
                fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Clear filters
            </button>
          )}
          <button
            onClick={() => setCollapsed(c => !c)}
            style={{
              background: 'transparent', color: C.deepPurple,
              border: `1px solid ${C.cardBorder}`, padding: '6px 14px', borderRadius: 14,
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {collapsed ? `Show all ${filtered.length}` : 'Collapse'}
          </button>
        </div>
      </div>
      <div style={{ maxHeight: collapsed ? 'none' : 600, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead style={{ position: 'sticky', top: 0, background: C.offWhite, zIndex: 1 }}>
            {/* Column labels */}
            <tr>
              {['Row', 'First name', 'Last name', 'DOB', 'State', 'ZIP', 'Payer ID', 'Member ID', 'Session', 'NPI'].map(h => (
                <th key={h} style={{ padding: '10px 14px 4px', textAlign: 'left', fontWeight: 600, color: C.warmShadow, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
            {/* Inline column filters — Google Sheets style */}
            <tr>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <span style={{ fontSize: 10, color: C.warmShadow }}>—</span>
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.firstName} onChange={e => setFilters(f => ({ ...f, firstName: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.lastName} onChange={e => setFilters(f => ({ ...f, lastName: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.dob} onChange={e => setFilters(f => ({ ...f, dob: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <select value={filters.state} onChange={e => setFilters(f => ({ ...f, state: e.target.value }))} style={inlineFilterStyle}>
                  <option value="">All</option>
                  {states.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.zip} onChange={e => setFilters(f => ({ ...f, zip: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.payerId} onChange={e => setFilters(f => ({ ...f, payerId: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <input placeholder="Filter…" value={filters.memberId} onChange={e => setFilters(f => ({ ...f, memberId: e.target.value }))} style={inlineFilterStyle} />
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <span style={{ fontSize: 10, color: C.warmShadow }}>—</span>
              </th>
              <th style={{ padding: '4px 14px 10px', borderBottom: `1px solid ${C.cardBorder}` }}>
                <span style={{ fontSize: 10, color: C.warmShadow }}>—</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map(p => {
              const wasTypo = p._typo;
              const showFixed = fixedRowIds.has(p.rowId);
              const showKept = wasTypo && keptAsIs && !showFixed;
              return (
                <tr key={p.rowId} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', color: C.warmShadow, fontSize: 12 }}>{p.rowId}</td>
                  <td style={{ padding: '10px 14px' }}>{p.firstName}</td>
                  <td style={{ padding: '10px 14px' }}>{p.lastName}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.dob}</td>
                  <td style={{ padding: '10px 14px' }}>{p.state}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.zip}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12, color: showFixed ? C.green : showKept ? C.redAlert : 'inherit', fontWeight: showFixed || showKept ? 600 : 400 }}>
                    {showFixed && wasTypo ? p._typo.correct : (p.payerId || <span style={{ color: C.warmShadow, fontStyle: 'italic' }}>—</span>)}
                  </td>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>
                    {p.memberId || <span style={{ color: C.warmShadow, fontStyle: 'italic' }}>—</span>}
                  </td>
                  <td style={{ padding: '10px 14px' }}>${p.sessionRate}</td>
                  <td style={{ padding: '10px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.npi}</td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={10} style={{ padding: 32, textAlign: 'center', color: C.warmShadow }}>No records match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const inlineFilterStyle = {
  width: '100%',
  padding: '4px 8px',
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 4,
  background: C.white,
  fontSize: 11,
  color: C.deepPurple,
  outline: 'none',
  fontFamily: 'inherit',
};

const filterInputStyle = {
  flex: 1,
  padding: '6px 10px',
  border: `1px solid ${C.cardBorder}`,
  borderRadius: 6,
  background: C.white,
  fontSize: 12,
  color: C.deepPurple,
  outline: 'none',
  fontFamily: 'inherit',
};

/* ============================================================
   STEP 3: ABOUT YOUR DATA (was Preview Checks)
   ============================================================ */
function PreviewScreen({ dataset, onBack, onRun }) {
  const composition = useMemo(() => {
    // Standard coverage: payer + member
    // Insurance Discovery — member ID discovery: has payer, missing member
    // Insurance Discovery — payer + member ID discovery: missing payer (with or without member)
    const standard = dataset.filter(p => p.payerId && p.memberId).length;
    const memberDiscovery = dataset.filter(p => p.payerId && !p.memberId).length;
    const fullDiscovery = dataset.filter(p => !p.payerId).length;
    return { standard, memberDiscovery, fullDiscovery };
  }, [dataset]);

  const payerCounts = useMemo(() => {
    const counts = {};
    dataset.forEach(p => {
      const key = p.payerName || 'No Payer Listed';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [dataset]);

  const officeCounts = useMemo(() => {
    const counts = {};
    dataset.forEach(p => {
      const key = `${p.office}|${p.stateName}`;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts).map(([key, count]) => {
      const [office, stateName] = key.split('|');
      return { office, stateName, count };
    }).sort((a, b) => b.count - a.count);
  }, [dataset]);

  return (
    <div style={{ marginTop: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8, letterSpacing: -0.5 }}>About Your Data</h1>
      <p style={{ fontSize: 15, color: C.warmShadow, marginBottom: 32 }}>
        Sample composition by check type, payer mix, and provider geography. Final endpoints and credit usage will be reported during the run.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5 }}>Check type distribution</h3>
          <PathBar
            label="Standard Coverage"
            desc="Payer + member ID present"
            count={composition.standard}
            total={dataset.length}
            color={C.deepPurple}
          />
          {/* Insurance Discovery — colored gradient between member-ID-only-missing and payer-missing */}
          <div style={{ marginTop: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
              <div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Requires Insurance Discovery</span>
                <span style={{ fontSize: 12, color: C.warmShadow, marginLeft: 8 }}>missing payer or member ID</span>
              </div>
              <div style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
                {composition.memberDiscovery + composition.fullDiscovery}
                <span style={{ color: C.warmShadow, fontWeight: 400 }}> ({(((composition.memberDiscovery + composition.fullDiscovery) / dataset.length) * 100).toFixed(1)}%)</span>
              </div>
            </div>
            {/* Stacked colored bar with two segments */}
            <div style={{ display: 'flex', height: 10, background: C.offWhite, borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ width: `${(composition.memberDiscovery / dataset.length) * 100}%`, height: '100%', background: C.vibrantPurple }} />
              <div style={{ width: `${(composition.fullDiscovery / dataset.length) * 100}%`, height: '100%', background: C.lilac }} />
            </div>
            <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: C.vibrantPurple, borderRadius: 2 }} />
                <span style={{ color: C.warmShadow }}>Member ID discovery:</span>
                <span style={{ fontWeight: 600 }}>{composition.memberDiscovery}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, background: C.lilac, borderRadius: 2 }} />
                <span style={{ color: C.warmShadow }}>Payer + member ID discovery:</span>
                <span style={{ fontWeight: 600 }}>{composition.fullDiscovery}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 18, fontSize: 12, color: C.warmShadow, lineHeight: 1.5 }}>
            Records may waterfall through multiple endpoints based on response. Final routing and credit usage are reported during the run.
          </div>
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5 }}>Top payers in sample</h3>
          <div style={{ maxHeight: 280, overflowY: 'auto' }}>
            {payerCounts.slice(0, 12).map(([name, count]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', fontSize: 13 }}>
                <div style={{ flex: 1, fontWeight: name === 'No Payer Listed' ? 600 : 400, color: name === 'No Payer Listed' ? C.warmShadow : 'inherit' }}>{name}</div>
                <div style={{ flex: '0 0 180px', height: 6, background: C.offWhite, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min((count / dataset.length) * 100 * 4, 100)}%`, height: '100%', background: name === 'No Payer Listed' ? C.warmShadow : C.vibrantPurple }} />
                </div>
                <div style={{ flex: '0 0 40px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: C.warmShadow }}>{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Office / Geography breakdown */}
      <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Building2 size={16} color={C.deepPurple} />
          <h3 style={{ fontSize: 16, fontWeight: 600 }}>Provider offices & geography</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.offWhite }}>
              {['Office location', 'State', 'Patient volume', '% of sample', 'Distribution'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.warmShadow, borderBottom: `1px solid ${C.cardBorder}`, textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {officeCounts.map(({ office, stateName, count }) => {
              const pct = (count / dataset.length) * 100;
              return (
                <tr key={office} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <td style={{ padding: '11px 16px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={13} color={C.warmShadow} />
                    {office}
                  </td>
                  <td style={{ padding: '11px 16px' }}>{stateName}</td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{count}</td>
                  <td style={{ padding: '11px 16px', fontVariantNumeric: 'tabular-nums', color: C.warmShadow }}>{pct.toFixed(1)}%</td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ width: 200, height: 6, background: C.offWhite, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(pct * 4, 100)}%`, height: '100%', background: C.vibrantPurple }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={onBack} style={backBtnStyle}><ArrowLeft size={16} /> Back</button>
        <button onClick={onRun} style={primaryBtnStyle}>
          Run {dataset.length} Checks <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function PathBar({ label, desc, count, total, color }) {
  const pct = (count / total) * 100;
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
        <div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{label}</span>
          <span style={{ fontSize: 12, color: C.warmShadow, marginLeft: 8 }}>{desc}</span>
        </div>
        <div style={{ fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{count} <span style={{ color: C.warmShadow, fontWeight: 400 }}>({pct.toFixed(1)}%)</span></div>
      </div>
      <div style={{ height: 10, background: C.offWhite, borderRadius: 5, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}

/* ============================================================
   STEP 4: REAL-TIME RUN
   ============================================================ */

// Pre-compute outcomes for the dataset (deterministic, runs once)
// Tuned to hit ~91% recovery rate with more 200 inactives, more 5xx errors, and richer Medicaid/SCAN/Discover usage
function computeOutcomes(dataset) {
  const r2 = mulberry32(101);
  return dataset.map(p => {
    const outcome = { rowId: p.rowId, patient: p, attempts: [], finalStatus: null, finalPlan: null, finalEndpoint: null, alerts: [], latencyMs: 0, credits: 0 };

    // Decide path
    let path = 'standard';
    if (!p.payerId && !p.memberId) path = 'medicaid-first';
    else if (p.payerId && !p.memberId) path = 'discover';
    else if (!p.payerId && p.memberId) path = 'medicaid-first'; // member only, no payer — try discover via SCAN/Medicaid

    const memberTypo = p._memberTypo;
    const payerKept = p._typoKept;     // user kept the wrong payer → will 4xx
    const payerFixed = p._typoFixed;   // user fixed → behaves normally

    let attempts = [];
    let final = { status: 200, plan: 'ACTIVE', endpoint: null };

    // Demographic plausibility — small fraction of all rows have demographic data fix
    const demoFix = !memberTypo && !payerKept && r2() < 0.025;

    if (payerKept) {
      // Bad payer ID — first call fails, then waterfall to SCAN/Medicaid; mostly recoverable
      attempts.push({ endpoint: '/v1/estimate', status: 400, latency: randInt(2000, 3500) });
      const rr = r2();
      if (rr < 0.55) {
        attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4500, 7500) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
        outcome.alerts.push({ type: 'recovered_via_scan', label: 'Recovered via SCAN after invalid payer', payer: 'Unknown→Recovered' });
      } else {
        attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
        final = { status: 400, plan: 'UNKNOWN', endpoint: '/v1/scan' };
      }
    } else if (path === 'standard') {
      const r1 = r2();
      if (memberTypo && r1 < 0.7) {
        attempts.push({ endpoint: '/v1/estimate', status: 422, latency: randInt(2400, 4500) });
        const r3 = r2();
        if (r3 < 0.6) {
          attempts.push({ endpoint: '/v1/discover', status: 200, plan: 'ACTIVE', latency: randInt(3000, 6500) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/discover' };
          outcome.alerts.push({ type: 'demographic_mismatch', label: 'Member ID corrected via Discovery', payer: p.payerName });
        } else {
          attempts.push({ endpoint: '/v1/discover', status: 404, latency: randInt(3000, 5500) });
          attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4500, 8500) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
          outcome.alerts.push({ type: 'recovered_via_scan', label: 'Recovered via SCAN', payer: p.payerName });
        }
      } else if (payerFixed && r1 < 0.92) {
        attempts.push({ endpoint: '/v1/estimate', status: 200, plan: 'ACTIVE', latency: randInt(2800, 5200) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/estimate' };
      } else if (p.payerKind === 'medicare') {
        const r4 = r2();
        if (r4 < 0.72) {
          attempts.push({ endpoint: '/v1/estimate', status: 200, plan: 'ACTIVE', latency: randInt(2500, 5500) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/estimate' };
          if (r2() < 0.32) outcome.alerts.push({ type: 'mco_identified', label: 'Medicare Advantage MCO identified', payer: pick(['Humana Medicare Advantage', 'UnitedHealthcare Medicare Advantage', 'Aetna Medicare']) });
          if (r2() < 0.06) outcome.alerts.push({ type: 'qmb', label: 'Qualified Medicare Beneficiary status', payer: p.payerName });
        } else if (r4 < 0.92) {
          attempts.push({ endpoint: '/v1/estimate', status: 404, latency: randInt(2200, 4200) });
          attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(3500, 6000) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/medicaid' };
          outcome.alerts.push({ type: 'mco_identified', label: 'Original Medicare → Managed Medicaid identified', payer: pick(['Molina Medicare', 'Humana MCO', 'Anthem Medicaid']) });
        } else {
          attempts.push({ endpoint: '/v1/estimate', status: 404, latency: randInt(2200, 4200) });
          attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4200, 7200) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
        }
      } else if (p.payerKind === 'medicaid') {
        const r5 = r2();
        if (r5 < 0.65) {
          attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(2400, 4800) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/medicaid' };
          if (r2() < 0.7) outcome.alerts.push({ type: 'mco_identified', label: 'Medicaid MCO identified', payer: pick(['Molina','UnitedHealthcare Community','Anthem Medicaid','Centene/Ambetter','Aetna Better Health']) });
        } else {
          attempts.push({ endpoint: '/v1/estimate', status: 404, latency: randInt(2200, 4500) });
          attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(3500, 6500) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/medicaid' };
          outcome.alerts.push({ type: 'mco_identified', label: 'Medicaid MCO identified', payer: pick(['Molina','UnitedHealthcare Community','Centene/Ambetter']) });
        }
      } else {
        // Commercial, no typos
        const rr = r2();
        if (rr < 0.025) {
          // 5xx upstream — about 2% commercial flow
          attempts.push({ endpoint: '/v1/estimate', status: pick([500, 502]), latency: randInt(8000, 14000) });
          if (r2() < 0.5) {
            attempts.push({ endpoint: '/v1/estimate', status: 200, plan: 'ACTIVE', latency: randInt(2800, 4800) });
            final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/estimate' };
          } else if (r2() < 0.7) {
            attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4500, 8000) });
            final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
            outcome.alerts.push({ type: 'recovered_via_scan', label: 'Recovered via SCAN after upstream timeout', payer: p.payerName });
          } else {
            // Persistent 5xx
            final = { status: pick([500, 502]), plan: 'UNKNOWN', endpoint: '/v1/estimate' };
          }
        } else if (rr < 0.16) {
          // 200 inactive — increased volume per spec
          attempts.push({ endpoint: '/v1/estimate', status: 200, plan: 'INACTIVE', latency: randInt(3200, 5800) });
          if (r2() < 0.45) {
            attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(3800, 6500) });
            attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4000, 6500) });
            final = { status: 200, plan: 'INACTIVE', endpoint: '/v1/estimate', alternateFound: true };
            outcome.alerts.push({ type: 'inactive_recovered', label: 'Inactive recovered via Medicaid', payer: p.payerName });
          } else {
            attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5800) });
            attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
            final = { status: 200, plan: 'INACTIVE', endpoint: '/v1/estimate' };
            outcome.alerts.push({ type: 'inactive_unrecovered', label: 'Inactive plan, no alternate found', payer: p.payerName });
          }
        } else if (rr < 0.19) {
          // 206 partial
          attempts.push({ endpoint: '/v1/estimate', status: 206, plan: 'UNKNOWN', latency: randInt(3000, 5500) });
          final = { status: 206, plan: 'UNKNOWN', endpoint: '/v1/estimate' };
        } else if (rr < 0.215) {
          // 404 — payer says no policy
          attempts.push({ endpoint: '/v1/estimate', status: 404, latency: randInt(2500, 4500) });
          attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
          final = { status: 404, plan: 'UNKNOWN', endpoint: '/v1/scan' };
        } else {
          attempts.push({ endpoint: '/v1/estimate', status: 200, plan: 'ACTIVE', latency: randInt(2400, 4800) });
          final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/estimate' };
          if (r2() < 0.07) outcome.alerts.push({ type: 'additional_policy', label: 'Additional secondary policy detected', payer: p.payerName });
          if (r2() < 0.04) outcome.alerts.push({ type: 'tpa_identified', label: 'Third party administrator identified', payer: p.payerName });
          if (r2() < 0.05) outcome.alerts.push({ type: 'not_subscriber', label: 'Patient is not the primary policyholder', payer: p.payerName });
          if (demoFix) outcome.alerts.push({ type: 'demographic_fixed', label: 'Demographic data corrected via response', payer: p.payerName });
        }
      }
    } else if (path === 'discover') {
      const rr = r2();
      if (rr < 0.42) {
        attempts.push({ endpoint: '/v1/discover', status: 200, plan: 'ACTIVE', latency: randInt(4000, 7500) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/discover' };
        if (r2() < 0.18) outcome.alerts.push({ type: 'additional_policy', label: 'Additional policy identified via Discovery', payer: p.payerName });
        if (r2() < 0.04) outcome.alerts.push({ type: 'tpa_identified', label: 'TPA identified', payer: p.payerName });
      } else if (rr < 0.72) {
        attempts.push({ endpoint: '/v1/discover', status: 404, latency: randInt(3500, 6500) });
        attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(3500, 6000) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/medicaid' };
        outcome.alerts.push({ type: 'mco_identified', label: 'Medicaid MCO identified via fallback', payer: pick(['Molina','Centene','Anthem Medicaid']) });
      } else if (rr < 0.86) {
        attempts.push({ endpoint: '/v1/discover', status: 404, latency: randInt(3500, 6500) });
        attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5500) });
        attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4500, 7500) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
        outcome.alerts.push({ type: 'recovered_via_scan', label: 'Commercial coverage recovered via SCAN', payer: p.payerName });
      } else if (rr < 0.96) {
        attempts.push({ endpoint: '/v1/discover', status: 404, latency: randInt(3500, 6000) });
        attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5500) });
        attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
        final = { status: 404, plan: 'UNKNOWN', endpoint: '/v1/scan' };
      } else {
        // 5xx
        attempts.push({ endpoint: '/v1/discover', status: pick([500, 502]), latency: randInt(8000, 12000) });
        final = { status: pick([500, 502]), plan: 'UNKNOWN', endpoint: '/v1/discover' };
      }
    } else {
      // medicaid-first (or member-only-no-payer)
      const rr = r2();
      if (rr < 0.5) {
        attempts.push({ endpoint: '/v1/medicaid', status: 200, plan: 'ACTIVE', latency: randInt(3500, 6500) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/medicaid' };
        if (r2() < 0.7) outcome.alerts.push({ type: 'mco_identified', label: 'Medicaid MCO identified', payer: pick(['Molina','UnitedHealthcare Community','Centene/Ambetter','Anthem Medicaid','Aetna Better Health']) });
      } else if (rr < 0.78) {
        attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5800) });
        attempts.push({ endpoint: '/v1/scan', status: 200, plan: 'ACTIVE', latency: randInt(4500, 7800) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/scan' };
        outcome.alerts.push({ type: 'recovered_via_scan', label: 'Commercial coverage recovered via SCAN', payer: 'Unknown→Commercial' });
      } else if (rr < 0.88) {
        attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5800) });
        attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
        attempts.push({ endpoint: '/v1/discover', status: 200, plan: 'ACTIVE', latency: randInt(3500, 6500) });
        final = { status: 200, plan: 'ACTIVE', endpoint: '/v1/discover' };
        outcome.alerts.push({ type: 'recovered_via_discover', label: 'Coverage recovered via Discovery', payer: p.payerName || 'Unknown' });
      } else if (rr < 0.97) {
        attempts.push({ endpoint: '/v1/medicaid', status: 404, latency: randInt(3500, 5800) });
        attempts.push({ endpoint: '/v1/scan', status: 404, latency: randInt(4500, 7500) });
        final = { status: 404, plan: 'UNKNOWN', endpoint: '/v1/scan' };
      } else {
        // 5xx
        attempts.push({ endpoint: '/v1/medicaid', status: pick([500, 502]), latency: randInt(8000, 12000) });
        final = { status: pick([500, 502]), plan: 'UNKNOWN', endpoint: '/v1/medicaid' };
      }
    }

    outcome.attempts = attempts;
    outcome.finalStatus = final.status;
    outcome.finalPlan = final.plan;
    outcome.finalEndpoint = final.endpoint;
    outcome.alternateFound = final.alternateFound || false;
    outcome.latencyMs = attempts.reduce((sum, a) => sum + a.latency, 0);
    outcome.credits = attempts.reduce((sum, a) => sum + ({ '/v1/estimate': 1, '/v1/discover': 2, '/v1/scan': 4, '/v1/medicaid': 1 }[a.endpoint] || 1), 0);

    // Cost-share and plan attribution for active patients
    if (outcome.finalPlan === 'ACTIVE') {
      // Benefit structure — distribution informed by typical real-world commercial mental health plans
      const r6 = r2();
      let benefitStructure;
      if (r6 < 0.30) benefitStructure = 'Copay, no deductible, with OOP Max';
      else if (r6 < 0.55) benefitStructure = 'Coinsurance after deductible, with OOP Max';
      else if (r6 < 0.68) benefitStructure = 'Copay after deductible, with OOP Max';
      else if (r6 < 0.78) benefitStructure = 'Coinsurance, no deductible, with OOP Max';
      else if (r6 < 0.86) benefitStructure = 'Copay and coinsurance after deductible, with OOP Max';
      else if (r6 < 0.92) benefitStructure = 'Fully covered after deductible';
      else if (r6 < 0.96) benefitStructure = 'Fully covered';
      else benefitStructure = 'Unknown';
      outcome.benefitStructure = benefitStructure;

      // Copay — present in copay-bearing structures
      const hasCopay = benefitStructure.toLowerCase().includes('copay');
      if (hasCopay) {
        const copayR = r2();
        // Distribute across realistic visit copay bands
        if (copayR < 0.18) outcome.copayCents = randInt(10, 29) * 100;     // <$30
        else if (copayR < 0.55) outcome.copayCents = randInt(30, 75) * 100; // $31-75
        else if (copayR < 0.85) outcome.copayCents = randInt(76, 125) * 100;// $76-125
        else outcome.copayCents = randInt(126, 175) * 100;                  // $125+
      }

      // Coinsurance — present in coinsurance-bearing structures
      const hasCoinsurance = benefitStructure.toLowerCase().includes('coinsurance');
      if (hasCoinsurance) {
        const coR = r2();
        if (coR < 0.15) outcome.coinsuranceRate = Math.round((r2() * 0.15) * 100) / 100;  // 0-15%
        else if (coR < 0.55) outcome.coinsuranceRate = Math.round((0.15 + r2() * 0.15) * 100) / 100; // 15.1-30%
        else if (coR < 0.80) outcome.coinsuranceRate = Math.round((0.30 + r2() * 0.10) * 100) / 100; // 30.1-40%
        else if (coR < 0.94) outcome.coinsuranceRate = Math.round((0.40 + r2() * 0.10) * 100) / 100; // 40.1-50%
        else outcome.coinsuranceRate = Math.round((0.50 + r2() * 0.20) * 100) / 100;                  // 50%+
      }

      // Member obligation distribution (per-visit cost share)
      const r7 = r2();
      let costShare;
      if (r7 < 0.06) costShare = randInt(0, 30) * 100;       // <$30
      else if (r7 < 0.43) costShare = randInt(31, 75) * 100; // $31-75
      else if (r7 < 0.78) costShare = randInt(76, 125) * 100;// $76-125
      else costShare = randInt(126, 250) * 100;              // $125+
      outcome.memberObligationCents = costShare;

      // Deductible — only meaningful for structures that have one
      const hasDeductible = !benefitStructure.toLowerCase().includes('no deductible') && benefitStructure !== 'Fully covered';
      if (hasDeductible) {
        const dedTotal = pick([1500, 2000, 2500, 3000, 4000, 5000, 7500]) * 100;
        // Halfway through the year: realistic distribution of progress against deductible
        // ~5% have met, ~12% are within 80%, ~30% have meaningful progress, rest are early
        const dedR = r2();
        let dedMet;
        if (dedR < 0.05) dedMet = dedTotal; // met
        else if (dedR < 0.17) dedMet = dedTotal * (0.80 + r2() * 0.18); // 80-98% met
        else if (dedR < 0.47) dedMet = dedTotal * (0.35 + r2() * 0.40); // 35-75% met
        else dedMet = dedTotal * r2() * 0.35; // 0-35%
        outcome.deductibleTotalCents = dedTotal;
        outcome.deductibleMetCents = Math.round(dedMet);
        outcome.deductibleRemainingCents = dedTotal - Math.round(dedMet);
      } else {
        outcome.deductibleTotalCents = 0;
        outcome.deductibleMetCents = 0;
        outcome.deductibleRemainingCents = 0;
      }

      // OOP Max — present in any structure with "OOP Max"
      const hasOOPMax = benefitStructure.toLowerCase().includes('oop max') || benefitStructure === 'Fully covered';
      if (hasOOPMax) {
        const dedBase = outcome.deductibleTotalCents || 1500 * 100;
        const oopTotal = Math.round(dedBase * (2 + r2() * 1.5));
        // Halfway through: ~2% have met OOP, ~8% within 80%, ~22% meaningful progress
        const oopR = r2();
        let oopMet;
        if (oopR < 0.02) oopMet = oopTotal;
        else if (oopR < 0.10) oopMet = oopTotal * (0.80 + r2() * 0.18);
        else if (oopR < 0.32) oopMet = oopTotal * (0.30 + r2() * 0.40);
        else oopMet = oopTotal * r2() * 0.30;
        outcome.oopTotalCents = oopTotal;
        outcome.oopMetCents = Math.round(oopMet);
      } else {
        outcome.oopTotalCents = 0;
        outcome.oopMetCents = 0;
      }

      // Plan name
      if (p.payerName && PLAN_NAMES_BY_PAYER[p.payerName]) {
        outcome.planName = pick(PLAN_NAMES_BY_PAYER[p.payerName]);
      }
    }

    return outcome;
  });
}

function RunScreen({ dataset, onComplete }) {
  const [outcomes] = useState(() => computeOutcomes(dataset));
  const [completed, setCompleted] = useState(0);
  const [alertsFeed, setAlertsFeed] = useState([]);
  const TOTAL_DURATION_MS = 30000;
  const startedRef = useRef(Date.now());

  useEffect(() => {
    let raf;
    const tick = () => {
      const elapsed = Date.now() - startedRef.current;
      const t = Math.min(elapsed / TOTAL_DURATION_MS, 1);
      const eased = 1 - Math.pow(1 - t, 1.4);
      const target = Math.floor(eased * outcomes.length);
      setCompleted(target);

      if (target < outcomes.length) {
        raf = requestAnimationFrame(tick);
      } else {
        setCompleted(outcomes.length);
        setTimeout(onComplete, 600);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const newAlerts = [];
    for (let i = alertsFeed.length; i < completed; i++) {
      if (outcomes[i] && outcomes[i].alerts.length > 0) {
        outcomes[i].alerts.forEach(a => newAlerts.push({ ...a, rowId: outcomes[i].rowId, patientName: `${outcomes[i].patient.firstName} ${outcomes[i].patient.lastName}`, ts: Date.now() }));
      }
    }
    if (newAlerts.length > 0) {
      setAlertsFeed(prev => [...newAlerts.reverse(), ...prev].slice(0, 80));
    }
  }, [completed]);

  const stats = useMemo(() => {
    const done = outcomes.slice(0, completed);
    const statusCodes = { 200: 0, 206: 0, 400: 0, 404: 0, 422: 0, 500: 0, 502: 0 };
    const planStatus = { ACTIVE: 0, INACTIVE: 0, UNKNOWN: 0 };
    const endpointHits = { '/v1/estimate': 0, '/v1/discover': 0, '/v1/scan': 0, '/v1/medicaid': 0 };
    let totalLatency = 0, totalAttempts = 0, credits = 0;

    done.forEach(o => {
      statusCodes[o.finalStatus] = (statusCodes[o.finalStatus] || 0) + 1;
      if (o.finalPlan) planStatus[o.finalPlan] = (planStatus[o.finalPlan] || 0) + 1;
      o.attempts.forEach(a => endpointHits[a.endpoint] = (endpointHits[a.endpoint] || 0) + 1);
      totalLatency += o.latencyMs;
      totalAttempts += o.attempts.length;
      credits += o.credits;
    });

    return {
      statusCodes, planStatus, endpointHits,
      avgLatencyMs: done.length ? totalLatency / done.length : 0,
      avgAttempts: done.length ? totalAttempts / done.length : 0,
      credits, done: done.length,
    };
  }, [completed, outcomes]);

  const pct = (completed / outcomes.length) * 100;

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Running Pilot</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: C.vibrantPurple }}>
          <Activity size={18} className="pulse" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Live</span>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.warmShadow, marginBottom: 24 }}>
        Composite endpoint is running checks across {outcomes.length} patients. Results stream as they complete.
      </p>

      <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: -0.5, fontVariantNumeric: 'tabular-nums' }}>{completed}</span>
            <span style={{ fontSize: 18, color: C.warmShadow, marginLeft: 6 }}>/ {outcomes.length}</span>
            <span style={{ fontSize: 14, color: C.warmShadow, marginLeft: 12 }}>checks complete</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600, color: C.vibrantPurple, fontVariantNumeric: 'tabular-nums' }}>{pct.toFixed(1)}%</div>
        </div>
        <div style={{ height: 8, background: C.offWhite, borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            width: `${pct}%`, height: '100%',
            background: `linear-gradient(90deg, ${C.deepPurple}, ${C.vibrantPurple})`,
            transition: 'width 0.1s linear',
          }} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Performance</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <MiniStat label="Avg latency" value={stats.avgLatencyMs > 0 ? `${(stats.avgLatencyMs / 1000).toFixed(1)}s` : '—'} />
            <MiniStat label="Avg attempts/patient" value={stats.avgAttempts > 0 ? stats.avgAttempts.toFixed(2) : '—'} />
            <MiniStat label="Credits used" value={stats.credits} />
            <MiniStat label="Avg credits/patient" value={stats.done > 0 ? (stats.credits / stats.done).toFixed(2) : '—'} />
          </div>
          <h4 style={{ fontSize: 12, fontWeight: 600, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 12 }}>API Calls Made</h4>
          {Object.entries(stats.endpointHits).map(([endpoint, count]) => {
            const total = Object.values(stats.endpointHits).reduce((s,n)=>s+n, 0) || 1;
            return (
              <div key={endpoint} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6, fontSize: 13 }}>
                <div style={{ flex: '0 0 100px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{endpoint}</div>
                <div style={{ flex: 1, height: 6, background: C.offWhite, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${(count / total) * 100}%`, height: '100%', background: C.vibrantPurple, transition: 'width 0.3s' }} />
                </div>
                <div style={{ flex: '0 0 60px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: C.warmShadow, fontSize: 12 }}>{count}</div>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Status Code Breakdown</h3>
          <StatusGroup label="2xx Success" entries={[
            { code: '200 active', count: stats.planStatus.ACTIVE || 0, color: C.green },
            { code: '200 inactive', count: stats.planStatus.INACTIVE || 0, color: C.lilac },
            { code: '206 partial', count: stats.statusCodes[206] || 0, color: C.warmShadow },
          ]} total={stats.done} />
          <StatusGroup label="4xx Client" entries={[
            { code: '400', count: stats.statusCodes[400] || 0, color: C.amber },
            { code: '404', count: stats.statusCodes[404] || 0, color: C.amber },
            { code: '422', count: stats.statusCodes[422] || 0, color: C.amber },
          ]} total={stats.done} />
          <StatusGroup label="5xx Server" entries={[
            { code: '500', count: stats.statusCodes[500] || 0, color: C.redAlert },
            { code: '502', count: stats.statusCodes[502] || 0, color: C.redAlert },
          ]} total={stats.done} />
        </div>
      </div>

      <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontSize: 13, fontWeight: 600, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5 }}>Live Alerts & Corrections</h3>
        </div>
        <div style={{ height: 240, overflowY: 'auto', background: C.offWhite, borderRadius: 8, padding: 8 }}>
          {alertsFeed.length === 0 && (
            <div style={{ textAlign: 'center', color: C.warmShadow, fontSize: 13, padding: 60 }}>Waiting for alerts…</div>
          )}
          {alertsFeed.map((a, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px',
              background: i === 0 ? `${C.vibrantPurple}10` : 'transparent',
              borderRadius: 6, fontSize: 13,
              animation: i === 0 ? 'fadeInAlert 0.4s ease-out' : 'none',
            }}>
              <div style={{ fontFamily: 'ui-monospace, monospace', fontSize: 11, color: C.warmShadow, flex: '0 0 60px' }}>Row {a.rowId}</div>
              <div style={{ flex: '0 0 160px', fontWeight: 500 }}>{a.patientName}</div>
              <div style={{ flex: 1 }}>{a.label}</div>
              <div style={{ color: C.warmShadow, fontSize: 12 }}>{a.payer}</div>
            </div>
          ))}
        </div>
        <style>{`@keyframes fadeInAlert { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } } .pulse { animation: pulse 1.4s ease-in-out infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: C.warmShadow, marginBottom: 4, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.deepPurple, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.3 }}>{value}</div>
    </div>
  );
}

function StatusGroup({ label, entries, total }) {
  const sum = entries.reduce((s, e) => s + e.count, 0);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6, fontSize: 12 }}>
        <span style={{ color: C.warmShadow, fontWeight: 500 }}>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: C.deepPurple, fontWeight: 600 }}>{sum}</span>
      </div>
      <div style={{ display: 'flex', height: 8, background: C.offWhite, borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
        {entries.map((e, i) => (
          <div key={i} style={{
            width: total ? `${(e.count / total) * 100}%` : '0%',
            background: e.color, transition: 'width 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: C.warmShadow, flexWrap: 'wrap' }}>
        {entries.map((e, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 8, height: 8, background: e.color, borderRadius: 2 }} />
            <span>{e.code}: <span style={{ fontVariantNumeric: 'tabular-nums', color: C.deepPurple, fontWeight: 600 }}>{e.count}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   STEP 5: SUMMARY
   ============================================================ */
function SummaryScreen({ dataset, onBackToInputs }) {
  const outcomes = useMemo(() => computeOutcomes(dataset), [dataset]);
  const [filterPayer, setFilterPayer] = useState('all');
  const [exportToast, setExportToast] = useState(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const insights = useMemo(() => computeInsights(outcomes, dataset), [outcomes, dataset]);

  const filteredOutcomes = useMemo(() => {
    if (filterPayer === 'all') return outcomes;
    return outcomes.filter(o => o.patient.payerName === filterPayer);
  }, [outcomes, filterPayer]);

  const allPayers = useMemo(() => {
    const set = new Set();
    outcomes.forEach(o => { if (o.patient.payerName) set.add(o.patient.payerName); });
    return Array.from(set).sort();
  }, [outcomes]);

  const statusCodeData = useMemo(() => {
    const buckets = {
      '200 Active': 0, '200 Inactive': 0, '206': 0,
      '400': 0, '404': 0, '422': 0,
      '500': 0, '502': 0,
    };
    filteredOutcomes.forEach(o => {
      if (o.finalStatus === 200 && o.finalPlan === 'ACTIVE') buckets['200 Active']++;
      else if (o.finalStatus === 200 && o.finalPlan === 'INACTIVE') buckets['200 Inactive']++;
      else if (o.finalStatus === 206) buckets['206']++;
      else if (o.finalStatus === 400) buckets['400']++;
      else if (o.finalStatus === 404) buckets['404']++;
      else if (o.finalStatus === 422) buckets['422']++;
      else if (o.finalStatus === 500) buckets['500']++;
      else if (o.finalStatus === 502) buckets['502']++;
    });
    return [
      { code: '2xx', '200 Active': buckets['200 Active'], '200 Inactive': buckets['200 Inactive'], '206': buckets['206'] },
      { code: '4xx', '400': buckets['400'], '404': buckets['404'], '422': buckets['422'] },
      { code: '5xx', '500': buckets['500'], '502': buckets['502'] },
    ];
  }, [filteredOutcomes]);

  const payerPerf = useMemo(() => {
    const map = {};
    outcomes.forEach(o => {
      const key = o.patient.payerName || 'No Payer Listed';
      if (!map[key]) map[key] = { name: key, payerId: o.patient.payerId || '—', total: 0, active: 0, inactive: 0, errors4: 0, errors5: 0, recovered: 0 };
      map[key].total++;
      if (o.finalStatus === 200 && o.finalPlan === 'ACTIVE') {
        map[key].active++;
        if (o.attempts.length > 1) map[key].recovered++;
      }
      else if (o.finalStatus === 200 && o.finalPlan === 'INACTIVE') map[key].inactive++;
      else if (o.finalStatus >= 500) map[key].errors5++;
      else if (o.finalStatus >= 400) map[key].errors4++;
    });
    return Object.values(map).sort((a, b) => b.total - a.total);
  }, [outcomes]);

  const handleExportClick = () => setShowExportModal(true);

  return (
    <div style={{ marginTop: 32 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.5 }}>Pilot Summary</h1>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <select
            value={filterPayer}
            onChange={(e) => setFilterPayer(e.target.value)}
            style={{
              border: `1px solid ${C.cardBorder}`, borderRadius: 8,
              padding: '8px 14px', fontSize: 13, background: C.white,
              color: C.deepPurple, cursor: 'pointer', minWidth: 220,
              fontFamily: 'inherit',
            }}
          >
            <option value="all">Filter by payer: All ({outcomes.length})</option>
            {allPayers.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>
      <p style={{ fontSize: 14, color: C.warmShadow, marginBottom: 32 }}>
        {outcomes.length} checks completed · Charts and tables can be filtered by payer · Exports reflect the full sample.
      </p>

      {/* Top-level stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Total checks" value={filteredOutcomes.length} sub={filterPayer === 'all' ? 'Full sample' : `Filtered: ${filterPayer}`} />
        <StatCard
          label="Recovery rate"
          value={`${((filteredOutcomes.filter(o => o.finalStatus === 200 && o.finalPlan === 'ACTIVE').length / filteredOutcomes.length) * 100).toFixed(1)}%`}
          sub="Active coverage / total"
        />
        <StatCard
          label="Avg latency"
          value={`${(filteredOutcomes.reduce((s,o) => s+o.latencyMs, 0) / filteredOutcomes.length / 1000).toFixed(1)}s`}
          sub="across waterfall"
        />
        <StatCard
          label="Total credits"
          value={filteredOutcomes.reduce((s,o) => s + o.credits, 0)}
          sub={`${(filteredOutcomes.reduce((s,o) => s + o.credits, 0) / filteredOutcomes.length).toFixed(2)} avg/check`}
        />
      </div>

      {/* Status code chart */}
      <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Status Code Breakdown</h3>
        <p style={{ fontSize: 13, color: C.warmShadow, marginBottom: 20 }}>2xx success (active stacked over inactive), 4xx and 5xx by code{filterPayer !== 'all' ? ` · Filtered to ${filterPayer}` : ''}</p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={statusCodeData} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.cardBorder} />
            <XAxis dataKey="code" stroke={C.warmShadow} fontSize={13} />
            <YAxis stroke={C.warmShadow} fontSize={12} />
            <Tooltip
              contentStyle={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 8, fontSize: 13 }}
              cursor={{ fill: C.offWhite }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar dataKey="200 Active" stackId="a" fill={C.green} />
            <Bar dataKey="200 Inactive" stackId="a" fill={C.lilac} />
            <Bar dataKey="206" stackId="a" fill={C.warmShadow} />
            <Bar dataKey="400" stackId="a" fill="#D9A05B" />
            <Bar dataKey="404" stackId="a" fill={C.amber} />
            <Bar dataKey="422" stackId="a" fill="#A8702C" />
            <Bar dataKey="500" stackId="a" fill="#8E2D3C" />
            <Bar dataKey="502" stackId="a" fill={C.redAlert} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* KEY INSIGHTS — moved above payer performance */}
      <KeyInsights insights={insights} outcomes={outcomes} />

      {/* Payer performance table */}
      <PayerPerformanceTable payerPerf={payerPerf} totalOutcomes={outcomes.length} />

      {/* Plan & Cost-Share Insights */}
      <PlanAndCostShareSection outcomes={outcomes} />

      {/* Export toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, gap: 16 }}>
        <button onClick={onBackToInputs} style={backBtnStyle}><ArrowLeft size={16} /> Back to About Your Data</button>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleExportClick} style={primaryBtnStyle}>
            <Download size={16} /> Export results
          </button>
        </div>
      </div>

      {showExportModal && (
        <ExportModal
          outcomes={outcomes}
          insights={insights}
          payerPerf={payerPerf}
          onClose={() => setShowExportModal(false)}
          onComplete={(message) => {
            setShowExportModal(false);
            setExportToast(message);
            setTimeout(() => setExportToast(null), 3000);
          }}
        />
      )}

      {exportToast && (
        <div style={{
          position: 'fixed', bottom: 32, right: 32,
          background: C.deepPurple, color: C.offWhite,
          padding: '14px 20px', borderRadius: 10, fontSize: 14,
          boxShadow: '0 10px 30px rgba(47, 29, 71, 0.25)',
          display: 'flex', alignItems: 'center', gap: 10,
          animation: 'slideUp 0.3s ease-out',
          zIndex: 100,
        }}>
          <CheckCircle2 size={18} color={C.green} />
          {exportToast}
          <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   KEY INSIGHTS — split into Recovery vs. Denial Risk + format consistency
   ============================================================ */
function KeyInsights({ insights, outcomes }) {
  const total = outcomes.length;
  const fmt = (count) => `${((count / total) * 100).toFixed(1)}% (${count})`;

  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Sparkles size={18} color={C.vibrantPurple} />
        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Key Insights</h3>
      </div>
      <p style={{ fontSize: 13, color: C.warmShadow, marginBottom: 16 }}>
        What this pilot revealed about the patient population, split into recovery wins and denial risks
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* RECOVERY WINS BLOCK */}
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderLeft: `3px solid ${C.green}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: C.green, borderRadius: 4 }} />
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recovery wins</h4>
          </div>
          <InsightRow
            value={fmt(insights.activeRecoveredCount)}
            title="Overall active coverage recovered"
            detail={`${insights.activeRecoveredCount} of ${total} patients returned an active policy. Includes both first-pass success and recoveries through the waterfall.`}
            color={C.green}
          />
          <InsightRow
            value={fmt(insights.recoveredViaEstimateCount)}
            title="Recovered via Coverage (first-pass)"
            detail="Active coverage confirmed on the initial Coverage check. No fallback needed."
            color={C.green}
          />
          <InsightRow
            value={fmt(insights.recoveredViaDiscoverCount)}
            title="Recovered via Insurance Discovery"
            detail="Active coverage found when member ID was missing or initial Coverage call failed."
            color={C.green}
          />
          <InsightRow
            value={fmt(insights.recoveredViaMedicaidCount)}
            title="Recovered via Medicaid endpoint"
            detail="Active coverage confirmed through state Medicaid or Medicaid MCO routing."
            color={C.green}
          />
          <InsightRow
            value={fmt(insights.recoveredViaScanCount)}
            title="Recovered via SCAN fallback"
            detail="Patients with no member ID or initial endpoint failure were recovered via SCAN. Without the waterfall, these would have been pilot losses."
            color={C.green}
            isLast
          />
        </div>

        {/* DENIAL RISKS BLOCK */}
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderLeft: `3px solid ${C.amber}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: C.amber, borderRadius: 4 }} />
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: 0.5 }}>Denial risks</h4>
          </div>
          <InsightRow
            value={fmt(insights.mcoCount)}
            title="Original Medicaid identified as Managed Medicaid (MCO)"
            detail="Patients submitted as original Medicaid are actually enrolled in a managed Medicaid plan — primarily Molina, UnitedHealthcare Community, and Centene. Billing original Medicaid would result in denials; bill the MCO instead."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.memberMismatchCount)}
            title="Member IDs fixed via Discovery"
            detail="Member IDs were corrected through the Insurance Discovery fallback. Update EHR with corrected IDs to prevent future denials."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.demoFixCount)}
            title="Patient demographics fixed"
            detail="First name, last name, or date-of-birth corrections returned by payer responses. Update EHR to prevent future denials."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.tpaCount)}
            title="TPAs identified"
            detail="Third-party administrators (e.g., UMR, Allied Benefit Systems) identified for what appeared to be direct-payer plans. Bill the TPA, not the underlying carrier."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.notSubscriberCount)}
            title="Patient is not the primary policyholder"
            detail="Relationship to subscriber ≠ self. These benefits are tied to a spouse or parent's plan; subscriber details are returned in the response."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.additionalPolicyCount)}
            title="Additional secondary policies detected"
            detail="Patients have a secondary policy on file. Bill in coordination of benefits to avoid denied claims."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.inactiveUnrecoveredCount)}
            title="Inactive plan, no alternate found"
            detail="Active coverage could not be confirmed through Discovery, Medicaid, or SCAN. Patient follow-up required to confirm current insurance."
            color={C.amber}
          />
          <InsightRow
            value={fmt(insights.no404Count)}
            title="No coverage found"
            detail="Patient follow-up required, or switch to self-pay. Re-verify member ID, demographics, or check uninsured status."
            color={C.redAlert}
          />
          <InsightRow
            value={fmt(insights.errors5Count)}
            title="Upstream payer errors (5xx)"
            detail="Payer-side outages prevented verification. Retry these checks once payer service restored — most are transient."
            color={C.redAlert}
            isLast
          />
        </div>
      </div>
    </div>
  );
}

function InsightRow({ value, title, detail, color, isLast }) {
  return (
    <div style={{ padding: '12px 0', borderBottom: isLast ? 'none' : `1px solid ${C.cardBorder}` }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color,
          fontVariantNumeric: 'tabular-nums', flex: '0 0 110px',
          letterSpacing: -0.3,
        }}>{value}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{title}</div>
          <div style={{ fontSize: 12, color: C.warmShadow, lineHeight: 1.5 }}>{detail}</div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PAYER PERFORMANCE TABLE
   ============================================================ */
function PayerPerformanceTable({ payerPerf, totalOutcomes }) {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const top = payerPerf.slice(0, 12);

  return (
    <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderRadius: 12, marginBottom: 24, overflow: 'visible' }}>
      <div style={{ padding: 24, borderBottom: `1px solid ${C.cardBorder}` }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Payer Performance</h3>
        <p style={{ fontSize: 13, color: C.warmShadow }}>Top {top.length} payers by volume · % shown is share of that payer's volume in the sample</p>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: C.offWhite }}>
              {['Payer', 'Payer ID', 'Volume', '200 Active', '200 Inactive', 'Active recovered', '4xx', '5xx', 'Recall', (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, position: 'relative' }} key="bench">
                  Nirvana benchmark
                  <span
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                    style={{ display: 'inline-flex', cursor: 'help' }}
                  >
                    <Info size={12} />
                  </span>
                  {tooltipOpen && (
                    <span style={{
                      position: 'absolute', top: '120%', right: 0,
                      background: C.deepPurple, color: C.offWhite,
                      padding: '8px 12px', borderRadius: 6, fontSize: 11,
                      width: 220, fontWeight: 400, textTransform: 'none',
                      letterSpacing: 0, zIndex: 10,
                      boxShadow: '0 6px 20px rgba(47,29,71,0.2)',
                      lineHeight: 1.4,
                    }}>
                      Pulled from real-time production data over the last 90 days across all Nirvana customers using this payer.
                    </span>
                  )}
                </span>
              )].map((h, i) => (
                <th key={i} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: C.warmShadow, borderBottom: `1px solid ${C.cardBorder}`, textTransform: 'uppercase', letterSpacing: 0.4, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {top.map(p => {
              const recall = p.total ? (p.active / p.total) * 100 : 0;
              const benchmark = simulateBenchmark(p.name);
              const fmt = (count) => `${((count / p.total) * 100).toFixed(1)}% (${count})`;
              return (
                <tr key={p.name} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{p.name}</td>
                  <td style={{ padding: '12px 14px', fontFamily: 'ui-monospace, monospace', fontSize: 12 }}>{p.payerId}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{p.total}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.green, fontWeight: 600 }}>{fmt(p.active)}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.lilac }}>{fmt(p.inactive)}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.deepPurple }}>{fmt(p.recovered)}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.amber }}>{fmt(p.errors4)}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.redAlert }}>{fmt(p.errors5)}</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}>{recall.toFixed(1)}%</td>
                  <td style={{ padding: '12px 14px', fontVariantNumeric: 'tabular-nums', color: C.warmShadow, fontSize: 12 }}>
                    {benchmark ? `${benchmark.toFixed(1)}%` : 'NA'}
                    {benchmark && (
                      <span style={{ marginLeft: 6, color: recall > benchmark ? C.green : C.amber, fontSize: 11, fontWeight: 600 }}>
                        {recall > benchmark ? '↑' : '↓'} {Math.abs(recall - benchmark).toFixed(1)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================
   PLAN & COST-SHARE INSIGHTS SECTION
   ============================================================ */
function PlanAndCostShareSection({ outcomes }) {
  const stats = useMemo(() => {
    const active = outcomes.filter(o => o.finalPlan === 'ACTIVE');

    // Averages — only over patients where the value is meaningful (non-zero)
    const withDeductible = active.filter(o => o.deductibleTotalCents > 0);
    const withOOP = active.filter(o => o.oopTotalCents > 0);
    const withCopay = active.filter(o => o.copayCents > 0);
    const withCoinsurance = active.filter(o => typeof o.coinsuranceRate === 'number');

    const avgDeductible = withDeductible.length
      ? withDeductible.reduce((s, o) => s + o.deductibleTotalCents, 0) / withDeductible.length
      : 0;
    const avgOOP = withOOP.length
      ? withOOP.reduce((s, o) => s + o.oopTotalCents, 0) / withOOP.length
      : 0;
    const avgCopay = withCopay.length
      ? withCopay.reduce((s, o) => s + o.copayCents, 0) / withCopay.length
      : 0;
    const avgCoinsurance = withCoinsurance.length
      ? withCoinsurance.reduce((s, o) => s + o.coinsuranceRate, 0) / withCoinsurance.length
      : 0;

    // Deductible-met today + projected by EOM
    // We're at month 6 of the year (May/June); project linear spend trajectory to year-end
    const dedMet = withDeductible.filter(o => o.deductibleMetCents >= o.deductibleTotalCents).length;
    // Projection: a patient currently at X% will likely hit deductible by EOM if their pace would put them at 100% by month 12
    // Simple heuristic: if current met% × 2 >= 100, they'll meet it by EOM
    const dedMetByEOM = withDeductible.filter(o => {
      const pct = o.deductibleMetCents / o.deductibleTotalCents;
      return pct < 1 && pct * 2 >= 1;
    }).length;
    const oopMet = withOOP.filter(o => o.oopMetCents >= o.oopTotalCents).length;
    const oopMetByEOM = withOOP.filter(o => {
      const pct = o.oopMetCents / o.oopTotalCents;
      return pct < 1 && pct * 2 >= 1;
    }).length;

    // Copay bands
    const copayBands = { lt30: 0, b31_75: 0, b76_125: 0, gt125: 0 };
    withCopay.forEach(o => {
      const c = o.copayCents / 100;
      if (c < 30) copayBands.lt30++;
      else if (c <= 75) copayBands.b31_75++;
      else if (c <= 125) copayBands.b76_125++;
      else copayBands.gt125++;
    });

    // Coinsurance bands
    const coinBands = { b0_15: 0, b15_30: 0, b30_40: 0, b40_50: 0, b50_plus: 0 };
    withCoinsurance.forEach(o => {
      const r = o.coinsuranceRate;
      if (r <= 0.15) coinBands.b0_15++;
      else if (r <= 0.30) coinBands.b15_30++;
      else if (r <= 0.40) coinBands.b30_40++;
      else if (r <= 0.50) coinBands.b40_50++;
      else coinBands.b50_plus++;
    });

    // Most common plan by payer with deductible, OOP max, benefit structure
    const plansByPayer = {};
    active.forEach(o => {
      if (!o.patient.payerName || !o.planName) return;
      if (!plansByPayer[o.patient.payerName]) plansByPayer[o.patient.payerName] = {};
      if (!plansByPayer[o.patient.payerName][o.planName]) {
        plansByPayer[o.patient.payerName][o.planName] = {
          count: 0,
          dedSum: 0, dedCount: 0,
          oopSum: 0, oopCount: 0,
          structures: {},
        };
      }
      const bucket = plansByPayer[o.patient.payerName][o.planName];
      bucket.count++;
      if (o.deductibleTotalCents > 0) { bucket.dedSum += o.deductibleTotalCents; bucket.dedCount++; }
      if (o.oopTotalCents > 0) { bucket.oopSum += o.oopTotalCents; bucket.oopCount++; }
      if (o.benefitStructure) bucket.structures[o.benefitStructure] = (bucket.structures[o.benefitStructure] || 0) + 1;
    });

    const topPlans = Object.entries(plansByPayer)
      .map(([payer, plans]) => {
        const [planName, data] = Object.entries(plans).sort((a, b) => b[1].count - a[1].count)[0];
        const topStructure = Object.entries(data.structures).sort((a, b) => b[1] - a[1])[0][0];
        return {
          payer,
          plan: planName,
          count: data.count,
          payerTotal: Object.values(plans).reduce((s, p) => s + p.count, 0),
          avgDed: data.dedCount ? data.dedSum / data.dedCount : 0,
          avgOOP: data.oopCount ? data.oopSum / data.oopCount : 0,
          benefitStructure: topStructure,
        };
      })
      .sort((a, b) => b.payerTotal - a.payerTotal)
      .slice(0, 8);

    return {
      activeCount: active.length,
      avgDeductible, avgOOP, avgCopay, avgCoinsurance,
      withDeductibleCount: withDeductible.length,
      withOOPCount: withOOP.length,
      withCopayCount: withCopay.length,
      withCoinsuranceCount: withCoinsurance.length,
      dedMet, dedMetByEOM, oopMet, oopMetByEOM,
      copayBands, coinBands,
      topPlans,
    };
  }, [outcomes]);

  const fmtCurrency = (cents) => `$${Math.round(cents / 100).toLocaleString()}`;
  const fmtPct = (count, total) => `${total ? ((count / total) * 100).toFixed(1) : '0.0'}% (${count})`;

  return (
    <div style={{ marginBottom: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
        Plan & Cost-Share Insights
        <span style={{ background: `${C.lilac}30`, color: C.deepPurple, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 10, marginLeft: 8, textTransform: 'uppercase', letterSpacing: 0.4 }}>Beta</span>
      </h3>
      <p style={{ fontSize: 13, color: C.warmShadow, marginBottom: 16 }}>
        Plan structures and out-of-pocket signals for the {stats.activeCount} patients with confirmed active coverage. Directional indicators only.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* BLOCK 1 — COST-SHARE INSIGHTS */}
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderLeft: `3px solid ${C.vibrantPurple}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: C.vibrantPurple, borderRadius: 4 }} />
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.vibrantPurple, textTransform: 'uppercase', letterSpacing: 0.5 }}>Cost-share insights</h4>
          </div>

          {/* Top stats — 2x2 grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <MiniInsightCard label="Avg deductible" value={fmtCurrency(stats.avgDeductible)} sub={`In-network individual (n=${stats.withDeductibleCount})`} />
            <MiniInsightCard label="Avg OOP max" value={fmtCurrency(stats.avgOOP)} sub={`In-network individual (n=${stats.withOOPCount})`} />
            <MiniInsightCard label="Avg copay" value={fmtCurrency(stats.avgCopay)} sub={`Per visit (n=${stats.withCopayCount} with copay)`} />
            <MiniInsightCard label="Avg coinsurance" value={`${(stats.avgCoinsurance * 100).toFixed(1)}%`} sub={`After deductible (n=${stats.withCoinsuranceCount})`} />
          </div>

          {/* Deductible & OOP progress */}
          <div style={{ background: C.offWhite, borderRadius: 8, padding: 14, marginBottom: 20, fontSize: 12, lineHeight: 1.7 }}>
            <div style={{ marginBottom: 6 }}>
              <strong style={{ color: C.deepPurple }}>{fmtPct(stats.dedMet, stats.withDeductibleCount)}</strong>{' '}
              <span style={{ color: C.warmShadow }}>have met deductible · </span>
              <strong style={{ color: C.deepPurple }}>{fmtPct(stats.dedMetByEOM, stats.withDeductibleCount)}</strong>{' '}
              <span style={{ color: C.warmShadow }}>projected to meet by EOM</span>
            </div>
            <div>
              <strong style={{ color: C.deepPurple }}>{fmtPct(stats.oopMet, stats.withOOPCount)}</strong>{' '}
              <span style={{ color: C.warmShadow }}>have met OOP max · </span>
              <strong style={{ color: C.deepPurple }}>{fmtPct(stats.oopMetByEOM, stats.withOOPCount)}</strong>{' '}
              <span style={{ color: C.warmShadow }}>projected to meet by EOM</span>
            </div>
          </div>

          {/* Copay distribution */}
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <h5 style={{ fontSize: 12, fontWeight: 700, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5 }}>Copay distribution</h5>
              <span style={{ fontSize: 11, color: C.warmShadow }}>{fmtPct(stats.withCopayCount, stats.activeCount)} have a copay</span>
            </div>
            <CostShareBar label="Under $30" desc="High conversion" count={stats.copayBands.lt30} total={stats.withCopayCount} color={C.green} />
            <CostShareBar label="$31 – $75" desc="Med-high conversion" count={stats.copayBands.b31_75} total={stats.withCopayCount} color={C.greenSoft} />
            <CostShareBar label="$76 – $125" desc="Medium conversion" count={stats.copayBands.b76_125} total={stats.withCopayCount} color={C.amber} />
            <CostShareBar label="$125+" desc="Low conversion" count={stats.copayBands.gt125} total={stats.withCopayCount} color={C.redAlert} />
          </div>

          {/* Coinsurance distribution */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
              <h5 style={{ fontSize: 12, fontWeight: 700, color: C.warmShadow, textTransform: 'uppercase', letterSpacing: 0.5 }}>Coinsurance distribution</h5>
              <span style={{ fontSize: 11, color: C.warmShadow }}>{fmtPct(stats.withCoinsuranceCount, stats.activeCount)} have coinsurance</span>
            </div>
            <CostShareBar label="0 – 15%" desc="High conversion" count={stats.coinBands.b0_15} total={stats.withCoinsuranceCount} color={C.green} />
            <CostShareBar label="15.1 – 30%" desc="Med-high conversion" count={stats.coinBands.b15_30} total={stats.withCoinsuranceCount} color={C.greenSoft} />
            <CostShareBar label="30.1 – 40%" desc="Medium conversion" count={stats.coinBands.b30_40} total={stats.withCoinsuranceCount} color={C.amber} />
            <CostShareBar label="40.1 – 50%" desc="Med-low conversion" count={stats.coinBands.b40_50} total={stats.withCoinsuranceCount} color={'#A8702C'} />
            <CostShareBar label="50%+" desc="Low conversion" count={stats.coinBands.b50_plus} total={stats.withCoinsuranceCount} color={C.redAlert} />
          </div>
        </div>

        {/* BLOCK 2 — PLAN INSIGHTS */}
        <div style={{ background: C.white, border: `1px solid ${C.cardBorder}`, borderLeft: `3px solid ${C.deepPurple}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div style={{ width: 8, height: 8, background: C.deepPurple, borderRadius: 4 }} />
            <h4 style={{ fontSize: 13, fontWeight: 700, color: C.deepPurple, textTransform: 'uppercase', letterSpacing: 0.5 }}>Plan insights</h4>
          </div>
          <p style={{ fontSize: 12, color: C.warmShadow, marginBottom: 14 }}>
            Most common plan per payer with average deductible, OOP max, and dominant benefit structure
          </p>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                <th style={planHeadStyle}>Payer</th>
                <th style={planHeadStyle}>Top plan</th>
                <th style={{ ...planHeadStyle, textAlign: 'right' }}>Deductible</th>
                <th style={{ ...planHeadStyle, textAlign: 'right' }}>OOP max</th>
                <th style={{ ...planHeadStyle, textAlign: 'left' }}>Benefit structure</th>
                <th style={{ ...planHeadStyle, textAlign: 'right' }}>Volume</th>
              </tr>
            </thead>
            <tbody>
              {stats.topPlans.map((row, i) => (
                <tr key={i} style={{ borderBottom: i < stats.topPlans.length - 1 ? `1px solid ${C.cardBorder}` : 'none' }}>
                  <td style={{ padding: '10px 4px 10px 0', fontSize: 12, fontWeight: 500 }}>{row.payer}</td>
                  <td style={{ padding: '10px 4px', fontSize: 12, color: C.deepPurple }}>{row.plan}</td>
                  <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(row.avgDed)}</td>
                  <td style={{ padding: '10px 4px', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmtCurrency(row.avgOOP)}</td>
                  <td style={{ padding: '10px 4px', fontSize: 11, color: C.warmShadow, lineHeight: 1.4 }}>{row.benefitStructure}</td>
                  <td style={{ padding: '10px 0 10px 4px', fontSize: 12, textAlign: 'right', fontVariantNumeric: 'tabular-nums', color: C.warmShadow }}>
                    {((row.payerTotal / stats.activeCount) * 100).toFixed(1)}% <span style={{ color: C.deepPurple, fontWeight: 600 }}>({row.payerTotal})</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const planHeadStyle = {
  padding: '8px 4px',
  textAlign: 'left',
  fontSize: 10,
  color: C.warmShadow,
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: 0.4,
};

function MiniInsightCard({ label, value, sub }) {
  return (
    <div style={{ background: C.offWhite, borderRadius: 8, padding: '12px 14px' }}>
      <div style={{ fontSize: 11, color: C.warmShadow, marginBottom: 4, fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 700, color: C.deepPurple, lineHeight: 1, letterSpacing: -0.3, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.warmShadow, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function CostShareBar({ label, desc, count, total, color }) {
  const pct = total ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
        <span>
          <span style={{ fontWeight: 600 }}>{label}</span>
          <span style={{ color: C.warmShadow, marginLeft: 6, fontSize: 11 }}>{desc}</span>
        </span>
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>
          {pct.toFixed(1)}% <span style={{ color: C.warmShadow, fontWeight: 400 }}>({count})</span>
        </span>
      </div>
      <div style={{ height: 6, background: C.offWhite, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color }} />
      </div>
    </div>
  );
}

/* ============================================================
   EXPORT MODAL — preview both CSV parts + email send flow
   ============================================================ */
function ExportModal({ outcomes, insights, payerPerf, onClose, onComplete }) {
  const [step, setStep] = useState('preview'); // preview | sending | sent
  const [email, setEmail] = useState('spencer@meetnirvana.com');
  const [activeTab, setActiveTab] = useState('per_patient');

  const handleSend = () => {
    setStep('sending');
    setTimeout(() => {
      setStep('sent');
      setTimeout(() => onComplete(`Pilot results sent to ${email}`), 1200);
    }, 1500);
  };

  const handleDownload = () => {
    // Build CSV — both parts concatenated
    const csv = buildCSV(outcomes, insights, payerPerf);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'nirvana_pilot_results.csv';
    a.click();
    URL.revokeObjectURL(url);
    onComplete('Per-patient + summary CSV downloaded');
  };

  const total = outcomes.length;
  const perPatientPreview = outcomes.slice(0, 5);
  const summaryRows = buildSummaryRows(outcomes, insights, payerPerf);

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(47, 29, 71, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 32,
      animation: 'fadeBg 0.25s ease-out',
    }}>
      <style>{`@keyframes fadeBg { from { opacity: 0; } to { opacity: 1; } }`}</style>
      <div style={{
        background: C.offWhite, borderRadius: 16, width: '100%', maxWidth: 880,
        maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column',
        boxShadow: '0 30px 80px rgba(47, 29, 71, 0.3)',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.cardBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Export pilot results</h3>
            <p style={{ fontSize: 13, color: C.warmShadow }}>Per-patient outcomes + summary results — single CSV with both sections</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}>
            <X size={20} color={C.warmShadow} />
          </button>
        </div>

        {step === 'preview' && (
          <>
            <div style={{ padding: '16px 24px 0', display: 'flex', gap: 4, borderBottom: `1px solid ${C.cardBorder}`, background: C.white }}>
              <TabButton active={activeTab === 'per_patient'} onClick={() => setActiveTab('per_patient')}>
                Part 1: Per-patient outcomes ({total} rows)
              </TabButton>
              <TabButton active={activeTab === 'summary'} onClick={() => setActiveTab('summary')}>
                Part 2: Summary results
              </TabButton>
            </div>

            <div style={{ padding: 24, overflow: 'auto', flex: 1, background: C.white }}>
              {activeTab === 'per_patient' && (
                <>
                  <p style={{ fontSize: 12, color: C.warmShadow, marginBottom: 12 }}>Preview of first 5 of {total} rows. Full export includes all rows + complete attempts history.</p>
                  <div style={{ overflow: 'auto', border: `1px solid ${C.cardBorder}`, borderRadius: 8 }}>
                    <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: C.offWhite }}>
                          {['row_id', 'first_name', 'last_name', 'dob', 'state', 'payer_id', 'final_status', 'final_plan', 'final_endpoint', 'attempts', 'credits', 'history_log_id'].map(h => (
                            <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontWeight: 600, color: C.warmShadow, fontFamily: 'ui-monospace, monospace', whiteSpace: 'nowrap', borderBottom: `1px solid ${C.cardBorder}` }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {perPatientPreview.map(o => (
                          <tr key={o.rowId} style={{ borderBottom: `1px solid ${C.cardBorder}` }}>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.rowId}</td>
                            <td style={{ padding: '8px 10px' }}>{o.patient.firstName}</td>
                            <td style={{ padding: '8px 10px' }}>{o.patient.lastName}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.patient.dob}</td>
                            <td style={{ padding: '8px 10px' }}>{o.patient.state}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.patient.payerId || '—'}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.finalStatus}</td>
                            <td style={{ padding: '8px 10px', color: o.finalPlan === 'ACTIVE' ? C.green : o.finalPlan === 'INACTIVE' ? C.lilac : C.warmShadow, fontWeight: 600 }}>{o.finalPlan}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.finalEndpoint || '—'}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace', textAlign: 'center' }}>{o.attempts.length}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace' }}>{o.credits}</td>
                            <td style={{ padding: '8px 10px', fontFamily: 'ui-monospace, monospace', color: C.warmShadow }}>hist_{o.rowId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ fontSize: 11, color: C.warmShadow, marginTop: 12, lineHeight: 1.5 }}>
                    Full export columns: row_id, input_first_name, input_last_name, input_dob, input_zip, input_state, input_payer_id, input_member_id,
                    is_duplicate, case_type, final_status_code, final_plan_status, final_endpoint, final_payer_id, final_npi_used,
                    attempts_count, alternate_coverage_found, member_obligation_cents, deductible_remaining_cents, error_code, history_log_id.
                  </p>
                </>
              )}

              {activeTab === 'summary' && (
                <>
                  <p style={{ fontSize: 12, color: C.warmShadow, marginBottom: 12 }}>Summary results matching scoping doc section 3.5 — appended to the same CSV after per-patient rows, separated by section headers.</p>
                  <div style={{ overflow: 'auto', border: `1px solid ${C.cardBorder}`, borderRadius: 8, maxHeight: 360 }}>
                    <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
                      <tbody>
                        {summaryRows.map((row, i) => {
                          const isHeader = row.kind === 'section';
                          return (
                            <tr key={i} style={{ borderBottom: `1px solid ${C.cardBorder}`, background: isHeader ? C.offWhite : 'transparent' }}>
                              {isHeader ? (
                                <td colSpan={3} style={{ padding: '10px 12px', fontWeight: 700, color: C.deepPurple, fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                  {row.label}
                                </td>
                              ) : (
                                <>
                                  <td style={{ padding: '7px 12px', fontFamily: 'ui-monospace, monospace', color: C.warmShadow, width: 220 }}>{row.metric}</td>
                                  <td style={{ padding: '7px 12px', fontFamily: 'ui-monospace, monospace', fontWeight: 600 }}>{row.value}</td>
                                  <td style={{ padding: '7px 12px', fontFamily: 'ui-monospace, monospace', color: C.warmShadow }}>{row.detail || ''}</td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.cardBorder}`, background: C.offWhite }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Mail size={16} color={C.warmShadow} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: '0 0 auto' }}>Email to:</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    flex: 1, padding: '8px 12px', border: `1px solid ${C.cardBorder}`,
                    borderRadius: 6, fontSize: 13, background: C.white,
                    color: C.deepPurple, outline: 'none', fontFamily: 'inherit',
                  }}
                  placeholder="recipient@example.com"
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <button onClick={handleDownload} style={{
                  ...secondaryBtnStyle, padding: '10px 18px', fontSize: 13,
                }}>
                  <FileSpreadsheet size={15} /> Download only
                </button>
                <button onClick={handleSend} style={{
                  ...primaryBtnStyle, padding: '10px 20px', fontSize: 13,
                }}>
                  <Mail size={15} /> Send via email
                </button>
              </div>
            </div>
          </>
        )}

        {step === 'sending' && (
          <div style={{ padding: 60, textAlign: 'center', background: C.white, flex: 1 }}>
            <div className="pulse" style={{ marginBottom: 20 }}>
              <Mail size={48} color={C.vibrantPurple} />
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sending to {email}…</h4>
            <p style={{ fontSize: 13, color: C.warmShadow }}>Generating CSV with per-patient outcomes and summary section</p>
          </div>
        )}

        {step === 'sent' && (
          <div style={{ padding: 60, textAlign: 'center', background: C.white, flex: 1 }}>
            <div style={{ marginBottom: 20 }}>
              <CheckCircle2 size={48} color={C.green} />
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Sent</h4>
            <p style={{ fontSize: 13, color: C.warmShadow }}>{email} should receive the CSV in a few seconds.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '10px 18px',
        background: 'transparent',
        border: 'none',
        borderBottom: active ? `2px solid ${C.vibrantPurple}` : '2px solid transparent',
        color: active ? C.deepPurple : C.warmShadow,
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
        marginBottom: -1,
        fontFamily: 'inherit',
      }}
    >
      {children}
    </button>
  );
}

/* ============================================================
   CSV building helpers
   ============================================================ */
function buildSummaryRows(outcomes, insights, payerPerf) {
  const total = outcomes.length;
  const active = outcomes.filter(o => o.finalPlan === 'ACTIVE').length;
  const inactive = outcomes.filter(o => o.finalPlan === 'INACTIVE').length;
  const codes = {};
  outcomes.forEach(o => { codes[o.finalStatus] = (codes[o.finalStatus] || 0) + 1; });
  const fmt = (count) => `${((count / total) * 100).toFixed(1)}% (${count})`;

  const rows = [];
  rows.push({ kind: 'section', label: '3.5.1  Sample Composition' });
  rows.push({ metric: 'original_sample_size', value: total });
  rows.push({ metric: 'patients_processed', value: total, detail: '100%' });
  rows.push({ metric: 'duplicates_removed', value: 0 });
  rows.push({ metric: 'unsupported_payer_removed', value: 0 });

  rows.push({ kind: 'section', label: '3.5.2  Status Code Breakdown' });
  rows.push({ metric: '200_active', value: fmt(active) });
  rows.push({ metric: '200_inactive', value: fmt(inactive) });
  rows.push({ metric: '206_partial', value: fmt(codes[206] || 0) });
  rows.push({ metric: '400_bad_request', value: fmt(codes[400] || 0) });
  rows.push({ metric: '404_not_found', value: fmt(codes[404] || 0) });
  rows.push({ metric: '422_unprocessable', value: fmt(codes[422] || 0) });
  rows.push({ metric: '500_server_error', value: fmt(codes[500] || 0) });
  rows.push({ metric: '502_bad_gateway', value: fmt(codes[502] || 0) });

  rows.push({ kind: 'section', label: '3.5.3  Payer Performance' });
  payerPerf.slice(0, 10).forEach(p => {
    const recall = p.total ? (p.active / p.total) * 100 : 0;
    rows.push({ metric: p.name, value: `recall ${recall.toFixed(1)}%`, detail: `volume: ${p.total} | active: ${p.active} | inactive: ${p.inactive}` });
  });

  rows.push({ kind: 'section', label: '3.5.4  Denial Risks' });
  rows.push({ metric: 'inactive_no_alternate', value: fmt(insights.inactiveUnrecoveredCount) });
  rows.push({ metric: 'inactive_recovered_alt', value: fmt(insights.inactiveRecoveredCount) });
  rows.push({ metric: 'additional_secondary_policy', value: fmt(insights.additionalPolicyCount) });
  rows.push({ metric: 'patient_not_subscriber', value: fmt(insights.notSubscriberCount) });
  rows.push({ metric: 'no_coverage_found', value: fmt(insights.no404Count) });
  rows.push({ metric: 'member_id_mismatch', value: fmt(insights.memberMismatchCount) });

  rows.push({ kind: 'section', label: '3.5.5  Cost-Share Insights [Beta]' });
  rows.push({ metric: 'cost_share_under_$30', value: '6.4%' });
  rows.push({ metric: 'cost_share_$31_$75', value: '37.0%' });
  rows.push({ metric: 'cost_share_$76_$125', value: '34.7%' });
  rows.push({ metric: 'cost_share_$125+', value: '21.9%' });
  rows.push({ metric: 'pct_met_deductible', value: 'see plan_insights tab' });
  rows.push({ metric: 'pct_met_oop_max', value: 'see plan_insights tab' });

  return rows;
}

function buildCSV(outcomes, insights, payerPerf) {
  // Part 1: per-patient
  const headers1 = ['row_id','first_name','last_name','dob','state','zip','payer_id','member_id','session_rate','npi','case_type','final_status_code','final_plan_status','final_endpoint','final_payer_id','final_npi_used','attempts_count','alternate_coverage_found','member_obligation_cents','deductible_remaining_cents','error_code','history_log_id'];
  const rows1 = outcomes.map(o => [
    o.rowId, o.patient.firstName, o.patient.lastName, o.patient.dob,
    o.patient.state, o.patient.zip, o.patient.payerId, o.patient.memberId,
    o.patient.sessionRate, o.patient.npi,
    !o.patient.payerId && !o.patient.memberId ? 'medicaid_first' : !o.patient.memberId ? 'discover' : 'standard',
    o.finalStatus, o.finalPlan, o.finalEndpoint, o.patient.payerId, o.patient.npi,
    o.attempts.length, o.alternateFound ? 'true' : 'false',
    o.memberObligationCents || '', o.deductibleRemainingCents || '',
    o.finalStatus >= 400 ? `err_${o.finalStatus}` : '',
    `hist_${o.rowId}`,
  ]);

  // Part 2: summary
  const summaryRows = buildSummaryRows(outcomes, insights, payerPerf);

  const part1 = [headers1.join(','), ...rows1.map(r => r.map(c => `"${String(c ?? '').replace(/"/g,'""')}"`).join(','))].join('\n');
  const part2Lines = ['', '', '# === SUMMARY RESULTS — per scoping doc 3.5 ===', ''];
  summaryRows.forEach(row => {
    if (row.kind === 'section') {
      part2Lines.push('');
      part2Lines.push(`# ${row.label}`);
    } else {
      part2Lines.push(`${row.metric},${row.value},${row.detail || ''}`);
    }
  });

  return part1 + '\n' + part2Lines.join('\n');
}

function simulateBenchmark(payerName) {
  const map = {
    'Aetna': 84.2, 'Cigna': 81.5, 'UnitedHealthcare': 86.7,
    'New York BCBS': 78.4, 'New Jersey BCBS': 76.8, 'Illinois BCBS': 82.1,
    'Blue Cross of California': 79.6, 'Blue Shield of California': 81.2,
    'Michigan BCBS': 77.5, 'Anthem (Georgia BCBS)': 80.3,
    'Humana': 83.1, 'UMR': 79.8, 'Oscar': 74.2, 'Wellpoint': 78.6,
    'Kaiser Permanente': 88.4,
    'New Jersey Medicaid': 71.2, 'Illinois Medicaid': 72.8,
    'Original Medicare': 82.5,
  };
  return map[payerName] || null;
}

function computeInsights(outcomes, dataset) {
  const total = outcomes.length;
  const active = outcomes.filter(o => o.finalStatus === 200 && o.finalPlan === 'ACTIVE').length;
  const inactiveRecoveredCount = outcomes.filter(o => o.alerts.some(a => a.type === 'inactive_recovered')).length;
  const inactiveUnrecoveredCount = outcomes.filter(o => o.alerts.some(a => a.type === 'inactive_unrecovered')).length;
  const additionalPolicyCount = outcomes.filter(o => o.alerts.some(a => a.type === 'additional_policy')).length;
  const memberMismatchCount = outcomes.filter(o => o.patient._memberTypo).length;
  const notSubscriberCount = outcomes.filter(o => o.alerts.some(a => a.type === 'not_subscriber')).length;
  const no404Count = outcomes.filter(o => o.finalStatus === 404).length;
  const mcoCount = outcomes.filter(o => o.alerts.some(a => a.type === 'mco_identified')).length;
  const tpaCount = outcomes.filter(o => o.alerts.some(a => a.type === 'tpa_identified')).length;
  const recoveredViaScanCount = outcomes.filter(o => o.finalEndpoint === '/v1/scan' && o.finalPlan === 'ACTIVE').length;
  const recoveredViaDiscoverCount = outcomes.filter(o => o.finalEndpoint === '/v1/discover' && o.finalPlan === 'ACTIVE').length;
  const recoveredViaMedicaidCount = outcomes.filter(o => o.finalEndpoint === '/v1/medicaid' && o.finalPlan === 'ACTIVE').length;
  const recoveredViaEstimateCount = outcomes.filter(o => o.finalEndpoint === '/v1/estimate' && o.finalPlan === 'ACTIVE').length;
  const demoFixCount = outcomes.filter(o => o.alerts.some(a => a.type === 'demographic_fixed' || a.type === 'demographic_mismatch')).length;
  const errors5Count = outcomes.filter(o => o.finalStatus >= 500).length;

  return {
    activeRecoveredCount: active,
    inactiveRecoveredCount, inactiveUnrecoveredCount,
    additionalPolicyCount, memberMismatchCount, notSubscriberCount,
    no404Count, mcoCount, tpaCount,
    recoveredViaScanCount, recoveredViaDiscoverCount, recoveredViaMedicaidCount, recoveredViaEstimateCount,
    demoFixCount, errors5Count,
  };
}

/* ============================================================
   SHARED STYLES
   ============================================================ */
const primaryBtnStyle = {
  background: C.deepPurple, color: C.offWhite,
  border: 'none', padding: '12px 24px', borderRadius: 24,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8,
  boxShadow: '0 1px 2px rgba(47, 29, 71, 0.08)',
  fontFamily: 'inherit',
};

const secondaryBtnStyle = {
  background: C.white, color: C.deepPurple,
  border: `1px solid ${C.cardBorder}`, padding: '11px 20px', borderRadius: 24,
  fontSize: 14, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 8,
  fontFamily: 'inherit',
};

const backBtnStyle = {
  background: 'transparent', color: C.warmShadow,
  border: 'none', padding: '8px 0',
  fontSize: 14, fontWeight: 500, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 6,
  fontFamily: 'inherit',
};
