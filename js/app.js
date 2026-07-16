(() => {
  const workouts = {
    segunda: { short:'SEG', label:'SEGUNDA • QUADRÍCEPS', name:'Perna Quadríceps', focus:'Quadríceps, panturrilha e abdutora', cover:'assets/covers/quadriceps.webp', exercises:[
      {name:'Leg Press 45°', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:120},
      {name:'Hack Machine', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:120},
      {name:'Cadeira Extensora', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:90},
      {name:'Panturrilha em pé', prescription:'5×15-20', sets:5, min:15, max:20, rest:75},
      {name:'Abdutora', prescription:'4×20', sets:4, min:20, max:20, rest:75}]},
    terca: { short:'TER', label:'TERÇA • PUSH SUPERIOR', name:'Push', focus:'Peito, ombros e tríceps', cover:'assets/covers/push.webp', exercises:[
      {name:'Supino reto', prescription:'4×6-8', sets:4, min:6, max:8, rest:150},
      {name:'Supino inclinado', prescription:'4×8-10', sets:4, min:8, max:10, rest:120},
      {name:'Crucifixo máquina', prescription:'3×12-15', sets:3, min:12, max:15, rest:75},
      {name:'Desenvolvimento máquina', prescription:'4×8-10', sets:4, min:8, max:10, rest:120},
      {name:'Elevação lateral', prescription:'4×12-15', sets:4, min:12, max:15, rest:75},
      {name:'Tríceps corda', prescription:'4×12', sets:4, min:12, max:12, rest:75}]},
    quarta: { short:'QUA', label:'QUARTA • POSTERIORES', name:'Pernas Posterior', focus:'Posterior, glúteos e panturrilha', cover:'assets/covers/posterior.webp', exercises:[
      {name:'Stiff', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:120},
      {name:'Mesa Flexora', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:90},
      {name:'Cadeira Flexora', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:90},
      {name:'Panturrilha sentada', prescription:'5×20', sets:5, min:20, max:20, rest:75},
      {name:'Glúteo máquina', prescription:'4×15', sets:4, min:15, max:15, rest:75}]},
    quinta: { short:'QUI', label:'QUINTA • PULL SUPERIOR', name:'Pull', focus:'Costas, bíceps e ombro posterior', cover:'assets/covers/pull.webp', exercises:[
      {name:'Barra fixa / puxada', prescription:'4 séries', sets:4, min:8, max:12, rest:120},
      {name:'Remada articulada', prescription:'4×8-10', sets:4, min:8, max:10, rest:120},
      {name:'Puxada neutra', prescription:'4×10-12', sets:4, min:10, max:12, rest:120},
      {name:'Remada baixa', prescription:'3×12', sets:3, min:12, max:12, rest:90},
      {name:'Rosca direta', prescription:'4×10', sets:4, min:10, max:10, rest:90},
      {name:'Rosca martelo', prescription:'3×12', sets:3, min:12, max:12, rest:75},
      {name:'Face pull', prescription:'3×15', sets:3, min:15, max:15, rest:75}]},
    sexta: { short:'SEX', label:'SEXTA • PERNAS MISTAS', name:'Pernas Completo', focus:'Quadríceps, posterior, glúteos e panturrilha', cover:'assets/covers/pernas.webp', exercises:[
      {name:'Leg Press', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:120},
      {name:'Stiff', prescription:'10×10 + afundo entre séries', sets:10, min:10, max:10, rest:120},
      {name:'Cadeira Extensora', prescription:'5×15', sets:5, min:15, max:15, rest:75},
      {name:'Mesa Flexora', prescription:'5×15', sets:5, min:15, max:15, rest:90},
      {name:'Panturrilhas', prescription:'5×20', sets:5, min:20, max:20, rest:75},
      {name:'Adutora', prescription:'4×20', sets:4, min:20, max:20, rest:75},
      {name:'Abdutora', prescription:'4×20', sets:4, min:20, max:20, rest:75}]}
  };

  const meals = [
    {time:'06:30',name:'Café da manhã',foods:'4 ovos + 150 g cuscuz + café sem açúcar',kcal:470},
    {time:'10:00',name:'Lanche da manhã',foods:'1 maçã + 1 scoop whey',kcal:200},
    {time:'13:00',name:'Almoço',foods:'200 g carne/frango + arroz + salada',kcal:650},
    {time:'16:30',name:'Pré-treino',foods:'1 banana + 150 g mandioca + café',kcal:300},
    {time:'Pós',name:'Pós-treino',foods:'1 scoop whey + 5 g creatina',kcal:130},
    {time:'20:00',name:'Jantar',foods:'200 g carne/frango + arroz ou mandioca',kcal:620},
    {time:'22:00',name:'Ceia',foods:'150 g abacate ou 3 ovos',kcal:230}
  ];

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const dayOrder = ['segunda','terca','quarta','quinta','sexta'];
  const storageKey = 'wpWorkoutDataV2';
  const profileKey = 'wpProfileV3';
  const measurementsKey = 'wpMeasurementsV3';
  const dietKey = 'wpDietV3';
  let selectedDay = getAutomaticDay().day;
  let workoutStartedAt = null;

  function localDateKey(date=new Date()) { return [date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('-'); }
  function getAutomaticDay() {
    const idx = new Date().getDay();
    if (idx >= 1 && idx <= 5) return {day:dayOrder[idx-1], isRest:false};
    return {day:'segunda', isRest:true};
  }
  function getWorkoutStore() { try { return JSON.parse(localStorage.getItem(storageKey)||'{"sessions":{},"history":[]}'); } catch { return {sessions:{},history:[]}; } }
  function saveWorkoutStore(store) { localStorage.setItem(storageKey,JSON.stringify(store)); }
  function currentSession(day=selectedDay) {
    const store=getWorkoutStore(), key=`${localDateKey()}_${day}`;
    store.sessions[key] ||= {date:localDateKey(),day,startedAt:null,exercises:{}};
    saveWorkoutStore(store); return store.sessions[key];
  }
  function updateCurrentSession(mutator,day=selectedDay) {
    const store=getWorkoutStore(), key=`${localDateKey()}_${day}`;
    store.sessions[key] ||= {date:localDateKey(),day,startedAt:null,exercises:{}};
    mutator(store.sessions[key],store); saveWorkoutStore(store); return store.sessions[key];
  }
  function previousExercise(day,index) {
    const history=getWorkoutStore().history||[];
    for (const session of history) if (session.day===day && session.exercises?.[index]) return session.exercises[index];
    const legacy=localStorage.getItem(`carga_${day}_${index}`);
    return legacy ? {sets:{1:{weight:Number(legacy),reps:null,rir:null,done:true}}} : null;
  }
  function maxWeight(exerciseLog) { return Math.max(0,...Object.values(exerciseLog?.sets||{}).map(s=>Number(s.weight)||0)); }
  function formatPt(value) { return Number(value).toLocaleString('pt-BR',{minimumFractionDigits:Number(value)%1?1:0,maximumFractionDigits:1}); }
  function showToast(message) { const toast=$('#toast'); toast.textContent=message; toast.classList.add('show'); clearTimeout(showToast.timer); showToast.timer=setTimeout(()=>toast.classList.remove('show'),2200); }

  function openTab(id,updateHash=true) {
    $$('.tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id===id));
    $$('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.tabTarget===id));
    if(updateHash) history.replaceState(null,'',`#${id}`);
    if(id==='treino') renderWorkout();
    if(id==='dieta') renderDiet();
    if(id==='progresso') renderEvolution();
    window.scrollTo({top:0,behavior:'smooth'});
  }
  $$('[data-tab-target]').forEach(el=>el.addEventListener('click',event=>{event.preventDefault();openTab(el.dataset.tabTarget);}));

  const parseStoredNumber = key => { const value=localStorage.getItem(key); return value!==null&&value!==''?Number(String(value).replace(',','.')):null; };
  const defaultProfile={goals:{weight:98,waist:99,bodyFat:null,calories:2600},baseline:{weight:102.7,waist:100,abdomen:null,bodyFat:null,visceral:13,chest:null,shoulders:null,armRight:45.4,armLeft:45,thighRight:68.5,thighLeft:68.6,calfRight:null,calfLeft:null}};
  function numericOrNull(value){if(value===undefined||value===null||value==='')return null;const n=Number(String(value).replace(',','.'));return Number.isFinite(n)?n:null;}
  function getProfile(){try{const s=JSON.parse(localStorage.getItem(profileKey)||'null');return s?{goals:{...defaultProfile.goals,...(s.goals||{})},baseline:{...defaultProfile.baseline,...(s.baseline||{})}}:JSON.parse(JSON.stringify(defaultProfile));}catch{return JSON.parse(JSON.stringify(defaultProfile));}}
  function saveProfile(p){localStorage.setItem(profileKey,JSON.stringify(p));}
  function getMeasurements(){try{const a=JSON.parse(localStorage.getItem(measurementsKey)||'[]');return Array.isArray(a)?a.sort((x,y)=>new Date(y.date)-new Date(x.date)):[];}catch{return[]}}
  function setMeasurements(a){localStorage.setItem(measurementsKey,JSON.stringify(a.filter(x=>x&&x.date).sort((x,y)=>new Date(y.date)-new Date(x.date)).slice(0,120)));}
  function initializeUserData(){const p=getProfile();saveProfile(p);if(!localStorage.getItem(measurementsKey)){const r=[];let legacy=[];try{legacy=JSON.parse(localStorage.getItem('medidasHistorico')||'[]')}catch{}legacy.forEach(i=>r.push({date:i.date||new Date().toISOString(),weight:numericOrNull(i.peso),waist:numericOrNull(i.cintura),source:'legacy'}));r.push({date:new Date(Date.now()-86400000).toISOString(),...p.baseline,source:'baseline'});const w=parseStoredNumber('pesoAtual'),c=parseStoredNumber('cinturaAtual');if(w!==null||c!==null)r.push({date:new Date().toISOString(),...p.baseline,weight:w??p.baseline.weight,waist:c??p.baseline.waist,source:'current'});setMeasurements(r);}if(!localStorage.getItem(dietKey)){const old={};meals.forEach((_,i)=>{if(localStorage.getItem(`dieta_${i}`)==='1')old[i]={done:true};});const s={mealCalories:{},days:{}};if(Object.keys(old).length)s.days[localDateKey()]={meals:old,updatedAt:new Date().toISOString()};localStorage.setItem(dietKey,JSON.stringify(s));}}
  function latestMeasurement(){return getMeasurements()[0]||getProfile().baseline} function previousMeasurement(){return getMeasurements()[1]||null} function initialMeasurement(){const r=getMeasurements();return r[r.length-1]||getProfile().baseline}
  function signedDelta(a,b,u='',d=1){a=numericOrNull(a);b=numericOrNull(b);if(a===null||b===null)return{text:'Sem comparação',value:null};const v=a-b;return{text:`${v>0?'+':''}${v.toFixed(d).replace('.',',')} ${u}`.trim(),value:v};}
  function trendClass(v,lower=true){if(v===null||v===0)return'neutral';return(lower?v<0:v>0)?'good':'warning';}
  function formatValue(v,u='',f='Não informado'){v=numericOrNull(v);return v===null?f:`${formatPt(v)}${u?` ${u}`:''}`;}
  function saveMeasurement(input){const l=latestMeasurement(),r={...l,...Object.fromEntries(Object.entries(input).filter(([,v])=>v!==null&&v!=='')),date:input.date||new Date().toISOString(),source:input.source||'manual'};const a=getMeasurements().filter(x=>!(x.source==='quick'&&x.date?.slice(0,10)===r.date.slice(0,10)));a.unshift(r);setMeasurements(a);if(r.weight!=null)localStorage.setItem('pesoAtual',String(r.weight));if(r.waist!=null)localStorage.setItem('cinturaAtual',String(r.waist));loadMeasurements();renderHistory();renderEvolution();}
  function loadMeasurements(){const p=getProfile(),l=latestMeasurement(),pr=previousMeasurement(),ini=initialMeasurement(),w=l.weight??p.baseline.weight,c=l.waist??p.baseline.waist,bf=l.bodyFat,v=l.visceral??p.baseline.visceral;$('#pesoAtual').textContent=formatValue(w,'kg');$('#cinturaAtual').textContent=formatValue(c,'cm');$('#bodyFatCurrent').textContent=formatValue(bf,'%');$('#visceralCurrent').textContent=`Visceral: ${v??'não informado'}`;const goal=numericOrNull(p.goals.weight),iw=numericOrNull(ini.weight),prog=goal!==null&&iw!==null&&w!==null&&iw!==goal?Math.max(0,Math.min(100,((iw-w)/(iw-goal))*100)):0;$('#pesoProgress').style.width=`${Math.max(5,prog)}%`;$('#pesoMetaLabel').textContent=goal!==null?`Meta: ${formatPt(goal)} kg`:'Meta não definida';$('#cinturaMetaLabel').textContent=p.goals.waist!==null?`Meta: ${formatPt(p.goals.waist)} cm`:'Meta não definida';$('#heroTargetWeight').textContent=goal!==null?formatPt(goal):'—';const wd=signedDelta(w,pr?.weight,'kg'),cd=signedDelta(c,pr?.waist,'cm'),fd=signedDelta(bf,pr?.bodyFat,'p.p.');[['#pesoTrend',wd,true],['#cinturaTrend',cd,true],['#homeWeightDelta',wd,true],['#homeWaistDelta',cd,true],['#homeFatDelta',fd,true]].forEach(([s,d,low])=>{$(s).textContent=d.text;$(s).className=trendClass(d.value,low);});const dt=l.date?new Date(l.date):null;$('#lastMeasurementDate').textContent=dt&&!Number.isNaN(dt.getTime())?new Intl.DateTimeFormat('pt-BR',{day:'2-digit',month:'short',year:'numeric'}).format(dt).replace('.',''):'Sem registro';$('#goalWeightHome').textContent=p.goals.weight!==null?`${formatPt(p.goals.weight)} kg`:'Definir';$('#goalWaistHome').textContent=p.goals.waist!==null?`${formatPt(p.goals.waist)} cm`:'Definir';$('#goalFatHome').textContent=p.goals.bodyFat!==null?`${formatPt(p.goals.bodyFat)}%`:'Definir';$('#goalCaloriesHome').textContent=p.goals.calories!==null?`${formatPt(p.goals.calories)} kcal`:'Definir';updateDietProgress();}
  $('#quickForm').addEventListener('submit',e=>{e.preventDefault();const r={date:new Date().toISOString(),weight:numericOrNull($('#pesoInput').value),waist:numericOrNull($('#cinturaInput').value),bodyFat:numericOrNull($('#bodyFatInput').value),visceral:numericOrNull($('#visceralInput').value),source:'quick'};if(!Object.values(r).some(v=>typeof v==='number'))return showToast('Preencha pelo menos um indicador.');saveMeasurement(r);e.target.reset();showToast('Indicadores atualizados.');});


  function sessionStats(day=selectedDay) {
    const workout=workouts[day],session=currentSession(day); let total=0,done=0,volume=0;
    workout.exercises.forEach((exercise,index)=>{ total+=exercise.sets; Object.values(session.exercises?.[index]?.sets||{}).forEach(set=>{if(set.done){done++;volume+=(Number(set.weight)||0)*(Number(set.reps)||0);}}); });
    return {total,done,percent:total?Math.round(done/total*100):0,volume};
  }

  function renderTodayCard() {
    const auto=getAutomaticDay(),day=auto.day,workout=workouts[day],stats=sessionStats(day);
    $('#todayWorkoutImage').src=workout.cover; $('#todayWorkoutImage').alt=workout.name;
    $('#todayWorkoutDay').textContent=auto.isRest?'PRÓXIMA SESSÃO • SEGUNDA':workout.label;
    $('#todayWorkoutName').textContent=auto.isRest?'Recuperação hoje':workout.name;
    $('#todayWorkoutFocus').textContent=auto.isRest?`Próximo treino: ${workout.name} • ${workout.focus}`:workout.focus;
    $('#todayWorkoutBadge').textContent=auto.isRest?'DIA DE DESCANSO':'TREINO DO DIA';
    $('#todayWorkoutProgress').textContent=`${stats.percent}%`;
    $('#todayWorkoutMeta').innerHTML=`<span>${workout.exercises.length} exercícios</span><span>${stats.total} séries</span><span>RIR 1–2</span>`;
    $('#todayWorkoutStart').innerHTML=`${stats.done?'Continuar':'Iniciar'} treino <b>→</b>`;
    $('#todayWorkoutStart').onclick=()=>{selectedDay=day;openTab('treino');};
  }

  function renderDayTabs() {
    const auto=getAutomaticDay();
    $('#dayTabs').innerHTML=dayOrder.map(day=>`<button class="day-tab ${day===selectedDay?'active':''} ${!auto.isRest&&day===auto.day?'today':''}" data-day="${day}"><span>${workouts[day].short}</span><small>${workouts[day].name.replace('Perna ','').replace('Pernas ','')}</small></button>`).join('');
  }

  function renderWorkout() {
    const workout=workouts[selectedDay],session=currentSession();
    if(!session.startedAt) updateCurrentSession(s=>{s.startedAt=new Date().toISOString();});
    workoutStartedAt=new Date(currentSession().startedAt).getTime();
    $('#workoutCoverImage').src=workout.cover; $('#workoutCoverImage').alt=workout.name; $('#workoutDayLabel').textContent=workout.label; $('#workoutName').textContent=workout.name; $('#workoutFocus').textContent=workout.focus;
    const auto=getAutomaticDay(); $('#autoDayChip').textContent=!auto.isRest&&selectedDay===auto.day?'TREINO DE HOJE':'OUTRO DIA'; $('#autoDayChip').classList.toggle('manual',selectedDay!==auto.day||auto.isRest);
    renderDayTabs();
    $('#listaTreino').innerHTML=workout.exercises.map((ex,index)=>renderExerciseCard(ex,index,session)).join('');
    updateWorkoutProgress();
  }

  function renderExerciseCard(ex,index,session) {
    const log=session.exercises?.[index]||{sets:{}},previous=previousExercise(selectedDay,index),last=maxWeight(previous),doneSets=Object.values(log.sets||{}).filter(s=>s.done).length;
    const suggestion=last?`${formatPt(last)} kg anterior`:'Primeiro registro';
    const setRows=Array.from({length:ex.sets},(_,i)=>{const n=i+1,set=log.sets?.[n]||{};return `<div class="set-row ${set.done?'done':''}" data-set-row="${index}-${n}">
      <span class="set-number">S${n}</span>
      <label><input type="number" min="0" step="0.5" inputmode="decimal" placeholder="kg" value="${set.weight??(n===1&&last?last:'')}" data-set-field="weight" data-exercise="${index}" data-set="${n}"><small>kg</small></label>
      <label class="reps-field"><input type="number" min="0" step="1" inputmode="numeric" placeholder="reps" value="${set.reps??ex.min}" data-set-field="reps" data-exercise="${index}" data-set="${n}"><small>meta ${ex.min===ex.max?ex.max:`${ex.min}–${ex.max}`}</small></label>
      <select aria-label="RIR da série ${n}" data-set-field="rir" data-exercise="${index}" data-set="${n}"><option value="">RIR</option>${[0,1,2,3,4].map(v=>`<option value="${v}" ${String(set.rir)===String(v)?'selected':''}>${v}</option>`).join('')}</select>
      <button class="set-done ${set.done?'done':''}" data-complete-set="${index}" data-set="${n}">${set.done?'✓':'○'}</button>
    </div>`;}).join('');
    return `<details class="advanced-exercise ${doneSets===ex.sets?'complete':''}" ${index===0?'open':''}>
      <summary><div class="exercise-number">${String(index+1).padStart(2,'0')}</div><div class="exercise-main"><h3>${ex.name}</h3><p>${ex.prescription}</p><div class="exercise-last"><span>${suggestion}</span><b>${doneSets}/${ex.sets} séries</b></div></div><span class="expand-icon">⌄</span></summary>
      <div class="exercise-tools">
        <div class="exercise-progression" id="progression-${index}">${buildExerciseSuggestion(ex,index,log,previous)}</div>
        <button type="button" class="exercise-timer-button" data-start-timer="${index}" aria-label="Iniciar descanso de ${ex.rest} segundos">
          <span>⏱</span> Descanso ${String(Math.floor(ex.rest/60)).padStart(2,'0')}:${String(ex.rest%60).padStart(2,'0')}
        </button>
      </div>
      <div class="sets-head"><span>Série</span><span>Carga</span><span>Reps</span><span>RIR</span><span>Feito</span></div>
      <div class="sets-list">${setRows}</div>
      <button class="copy-load" data-copy-load="${index}">Copiar carga da 1ª série</button>
    </details>`;
  }

  function buildExerciseSuggestion(ex,index,log,previous) {
    const currentSets=Object.values(log.sets||{}).filter(s=>s.done),last=maxWeight(previous);
    if(!last) return '<span>Meta:</span> encontre uma carga segura e mantenha RIR 1–2.';
    if(currentSets.length===ex.sets && currentSets.every(s=>(Number(s.reps)||0)>=ex.max) && currentSets.every(s=>s.rir!==''&&Number(s.rir)>=1)) return `<span>Próxima sessão:</span> tente ${formatPt(last+2.5)} kg com execução limpa.`;
    return `<span>Referência:</span> última carga máxima de ${formatPt(last)} kg.`;
  }

  function saveSetField(input) {
    const ex=Number(input.dataset.exercise),setNo=Number(input.dataset.set),field=input.dataset.setField;
    updateCurrentSession(session=>{session.exercises[ex]||={sets:{}};session.exercises[ex].sets[setNo]||={};session.exercises[ex].sets[setNo][field]=input.value===''?'':Number(input.value);});
  }

  $('#dayTabs').addEventListener('click',event=>{const btn=event.target.closest('[data-day]');if(!btn)return;selectedDay=btn.dataset.day;renderWorkout();});
  $('#listaTreino').addEventListener('change',event=>{const input=event.target.closest('[data-set-field]');if(!input)return;saveSetField(input);updateWorkoutProgress();});
  $('#listaTreino').addEventListener('click',event=>{
    const timerButton=event.target.closest('[data-start-timer]');
    if(timerButton){
      const exIndex=Number(timerButton.dataset.startTimer),exercise=workouts[selectedDay].exercises[exIndex];
      openTimer(exercise.rest,exercise.name);
      return;
    }
    const copy=event.target.closest('[data-copy-load]'); if(copy){const exIndex=Number(copy.dataset.copyLoad),card=copy.closest('.advanced-exercise'),first=card.querySelector('[data-set="1"][data-set-field="weight"]'),value=first.value;if(!value)return showToast('Informe a carga da 1ª série.');card.querySelectorAll('[data-set-field="weight"]').forEach(input=>{input.value=value;saveSetField(input);});showToast('Carga copiada.');return;}
    const btn=event.target.closest('[data-complete-set]'); if(!btn)return;
    const exIndex=Number(btn.dataset.completeSet),setNo=Number(btn.dataset.set),row=btn.closest('.set-row'),weight=row.querySelector('[data-set-field="weight"]'),reps=row.querySelector('[data-set-field="reps"]'),rir=row.querySelector('[data-set-field="rir"]');
    if(!reps.value)return showToast('Informe as repetições realizadas.');
    const current=currentSession().exercises?.[exIndex]?.sets?.[setNo]||{},done=!current.done;
    updateCurrentSession(session=>{session.exercises[exIndex]||={sets:{}};session.exercises[exIndex].sets[setNo]={weight:weight.value===''?'':Number(weight.value),reps:Number(reps.value),rir:rir.value===''?'':Number(rir.value),done};});
    btn.classList.toggle('done',done);btn.textContent=done?'✓':'○';row.classList.toggle('done',done);updateWorkoutProgress();
    if(done)openTimer(workouts[selectedDay].exercises[exIndex].rest,workouts[selectedDay].exercises[exIndex].name);
  });

  function updateWorkoutProgress() {
    const stats=sessionStats(); $('#workoutProgressText').textContent=`${stats.done} de ${stats.total} séries`;$('#workoutProgressPercent').textContent=`${stats.percent}%`;$('#workoutProgressBar').style.width=`${stats.percent}%`; renderTodayCard();
  }

  let timerSeconds=90,timerRunning=false,timerInterval=null;
  function drawTimer(){ $('#timerValue').textContent=`${String(Math.floor(timerSeconds/60)).padStart(2,'0')}:${String(timerSeconds%60).padStart(2,'0')}`; }
  function openTimer(seconds,context){timerSeconds=seconds||90;timerRunning=true;$('#timerContext').textContent=`Próxima série: ${context}.`;$('#restTimer').classList.add('open');$('#restTimer').setAttribute('aria-hidden','false');$('#timerToggle').textContent='Pausar';drawTimer();clearInterval(timerInterval);timerInterval=setInterval(()=>{if(!timerRunning)return;timerSeconds=Math.max(0,timerSeconds-1);drawTimer();if(timerSeconds===0){timerRunning=false;clearInterval(timerInterval);$('#timerToggle').textContent='Concluído';if(navigator.vibrate)navigator.vibrate([180,80,180]);}},1000);}
  function closeTimer(){timerRunning=false;clearInterval(timerInterval);$('#restTimer').classList.remove('open');$('#restTimer').setAttribute('aria-hidden','true');}
  $('#timerToggle').addEventListener('click',()=>{if(timerSeconds===0)return closeTimer();timerRunning=!timerRunning;$('#timerToggle').textContent=timerRunning?'Pausar':'Continuar';});
  $$('[data-timer-adjust]').forEach(btn=>btn.addEventListener('click',()=>{timerSeconds=Math.max(0,timerSeconds+Number(btn.dataset.timerAdjust));drawTimer();}));
  $('#timerSkip').addEventListener('click',closeTimer);$('#restTimer').addEventListener('click',e=>{if(e.target===$('#restTimer'))closeTimer();});

  function calculateSummary() {
    const workout=workouts[selectedDay],session=currentSession(),stats=sessionStats(),duration=Math.max(1,Math.round((Date.now()-(workoutStartedAt||Date.now()))/60000)); let prs=0,progressions=0;
    workout.exercises.forEach((ex,index)=>{const log=session.exercises?.[index],previous=previousExercise(selectedDay,index),currentMax=maxWeight(log),prevMax=maxWeight(previous);if(currentMax>prevMax&&prevMax>0)prs++;const sets=Object.values(log?.sets||{}).filter(s=>s.done);if(sets.length===ex.sets&&sets.every(s=>(Number(s.reps)||0)>=ex.max))progressions++;});
    return {...stats,duration,prs,progressions};
  }
  $('#finishWorkout').addEventListener('click',()=>{const s=calculateSummary();$('#sessionMetrics').innerHTML=`<div><strong>${s.duration}</strong><span>minutos</span></div><div><strong>${s.done}</strong><span>séries</span></div><div><strong>${formatPt(s.volume)}</strong><span>kg volume</span></div>`;$('#sessionHighlights').innerHTML=`<p>🏆 ${s.prs} recorde(s) de carga</p><p>↗ ${s.progressions} exercício(s) pronto(s) para progressão</p><p>✓ ${s.percent}% do treino concluído</p>`;$('#sessionModal').classList.add('open');$('#sessionModal').setAttribute('aria-hidden','false');});
  $('#closeSessionModal').addEventListener('click',()=>$('#sessionModal').classList.remove('open'));
  $('#saveSessionButton').addEventListener('click',()=>{const store=getWorkoutStore(),key=`${localDateKey()}_${selectedDay}`,session=store.sessions[key];if(!session)return;session.finishedAt=new Date().toISOString();session.summary=calculateSummary();store.history=store.history||[];store.history=store.history.filter(item=>item.key!==key);store.history.unshift({...JSON.parse(JSON.stringify(session)),key});store.history=store.history.slice(0,40);saveWorkoutStore(store);$('#sessionModal').classList.remove('open');renderWorkoutHistory();showToast('Treino salvo no histórico.');openTab('progresso');});

  function renderWorkoutHistory(){const history=getWorkoutStore().history||[];$('#workoutHistoryList').innerHTML=history.length?history.slice(0,10).map(item=>`<div class="history-item"><div><strong>${workouts[item.day]?.name||'Treino'}</strong><p>${new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.finishedAt||item.startedAt))}</p></div><div class="history-values">${item.summary?.percent||0}% • ${item.summary?.duration||0} min<br>${formatPt(item.summary?.volume||0)} kg</div></div>`).join(''):'<div class="empty-state">Finalize um treino para iniciar o histórico.</div>';}

  function getDietStore(){try{const s=JSON.parse(localStorage.getItem(dietKey)||'{}');return{mealCalories:s.mealCalories||{},days:s.days||{}};}catch{return{mealCalories:{},days:{}}}}
  function saveDietStore(s){Object.keys(s.days||{}).sort().reverse().slice(90).forEach(k=>delete s.days[k]);localStorage.setItem(dietKey,JSON.stringify(s));}
  function currentDietDay(s=getDietStore()){const k=localDateKey();s.days[k]||={meals:{},updatedAt:new Date().toISOString()};return{store:s,key:k,day:s.days[k]};}
  function mealCalories(i,s=getDietStore()){return numericOrNull(s.mealCalories?.[i])??meals[i].kcal;}
  function dietSummary(k=localDateKey()){const s=getDietStore(),p=getProfile(),d=s.days[k]||{meals:{}};let done=0,consumed=0;meals.forEach((m,i)=>{if(d.meals?.[i]?.done){done++;consumed+=numericOrNull(d.meals[i].kcal)??mealCalories(i,s);}});const target=numericOrNull(p.goals.calories);return{done,consumed,target,adherence:Math.round(done/meals.length*100),caloriePercent:target?Math.round(consumed/target*100):0};}
  function dietAverage(n=7){const s=getDietStore(),t=new Date();let total=0,count=0;for(let i=0;i<n;i++){const d=new Date(t);d.setDate(t.getDate()-i);const k=localDateKey(d);if(!s.days[k])continue;total+=dietSummary(k).adherence;count++;}return count?Math.round(total/count):0;}
  function renderDiet(){const{store,day}=currentDietDay();$('#dietDateLabel').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date()).replace('.','');$('#listaDieta').innerHTML=meals.map((m,i)=>{const item=day.meals?.[i]||{},k=numericOrNull(item.kcal)??mealCalories(i,store);return`<article class="meal-card ${item.done?'done':''}"><div class="meal-time">${m.time}</div><div class="meal-copy"><h3>${m.name}</h3><p>${m.foods}</p><label class="meal-kcal"><input type="number" min="0" step="10" inputmode="numeric" value="${k}" data-meal-kcal="${i}"><span>kcal estimadas</span></label></div><button class="done-toggle ${item.done?'done':''}" data-meal="${i}">${item.done?'✓':''}</button></article>`;}).join('');$('#calorieGoalInput').value=getProfile().goals.calories??'';updateDietProgress();renderDietWeek();}
  function updateDietProgress(){if(!$('#dietProgressText'))return;const s=dietSummary();$('#dietProgressText').textContent=`${s.done} de ${meals.length} refeições`;$('#dietProgressPercent').textContent=`${s.adherence}%`;$('#dietProgressBar').style.width=`${s.adherence}%`;$('#dietCaloriesConsumed').textContent=`${formatPt(s.consumed)} kcal`;$('#dietCaloriesTarget').textContent=s.target?`Meta: ${formatPt(s.target)} kcal`:'Meta não definida';$('#dietCaloriesBar').style.width=`${Math.min(100,s.caloriePercent)}%`;$('#dietCaloriesRemaining').textContent=s.target?(s.consumed<=s.target?`Restam ${formatPt(s.target-s.consumed)} kcal hoje.`:`${formatPt(s.consumed-s.target)} kcal acima da meta.`):'Defina sua meta calórica diária.';$('#calorieCurrent').textContent=`${formatPt(s.consumed)} kcal`;$('#calorieMetaLabel').textContent=s.target?`Meta: ${formatPt(s.target)} kcal`:'Meta: configurar';$('#calorieProgress').style.width=`${Math.max(4,Math.min(100,s.caloriePercent))}%`;$('#calorieRemaining').textContent=s.target?(s.consumed<=s.target?`${formatPt(s.target-s.consumed)} kcal restantes`:`${formatPt(s.consumed-s.target)} kcal acima`):'Aguardando configuração';$('#homeDietAdherence').textContent=`${dietAverage(7)}%`;$('#dietWeekAverage').textContent=`${dietAverage(7)}%`;}
  function renderDietWeek(){const labels=['D','S','T','Q','Q','S','S'],t=new Date(),a=[];for(let o=6;o>=0;o--){const d=new Date(t);d.setDate(t.getDate()-o);const k=localDateKey(d),s=dietSummary(k);a.push({l:labels[d.getDay()],p:s.adherence,k});}$('#dietWeekBars').innerHTML=a.map(x=>`<div title="${x.k}: ${x.p}%"><i style="height:${Math.max(4,x.p)}%"></i><span>${x.l}</span><small>${x.p}%</small></div>`).join('');}
  $('#listaDieta').addEventListener('click',e=>{const b=e.target.closest('[data-meal]');if(!b)return;const i=Number(b.dataset.meal),{store,day}=currentDietDay();day.meals[i]||={};day.meals[i].done=!day.meals[i].done;day.meals[i].kcal=numericOrNull(day.meals[i].kcal)??mealCalories(i,store);day.updatedAt=new Date().toISOString();saveDietStore(store);renderDiet();showToast(day.meals[i].done?'Refeição registrada.':'Refeição desmarcada.');});
  $('#listaDieta').addEventListener('change',e=>{const input=e.target.closest('[data-meal-kcal]');if(!input)return;const i=Number(input.dataset.mealKcal),{store,day}=currentDietDay(),v=numericOrNull(input.value)??0;store.mealCalories[i]=v;day.meals[i]||={};day.meals[i].kcal=v;saveDietStore(store);updateDietProgress();renderDietWeek();});
  $('#calorieGoalForm').addEventListener('submit',e=>{e.preventDefault();const v=numericOrNull($('#calorieGoalInput').value);if(v===null||v<500)return showToast('Informe uma meta válida.');const p=getProfile();p.goals.calories=v;saveProfile(p);loadMeasurements();renderDiet();renderGoals();showToast('Meta calórica atualizada.');});


  function renderHistory(){const a=getMeasurements();$('#historyList').innerHTML=a.length?a.map((x,i)=>{const d=new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium'}).format(new Date(x.date)),v=[numericOrNull(x.weight)!==null?`${formatPt(x.weight)} kg`:null,numericOrNull(x.waist)!==null?`Cintura ${formatPt(x.waist)} cm`:null,numericOrNull(x.bodyFat)!==null?`Gordura ${formatPt(x.bodyFat)}%`:null,numericOrNull(x.visceral)!==null?`Visceral ${formatPt(x.visceral)}`:null].filter(Boolean);return`<div class="history-item measurement-history-item"><div><strong>${i===0?'Avaliação mais recente':'Avaliação'}</strong><p>${d}${x.notes?` • ${x.notes}`:''}</p></div><div class="history-values">${v.join('<br>')}</div></div>`;}).join(''):'<div class="empty-state">Registre sua primeira avaliação.</div>';}
  function renderEvolution(){const r=getMeasurements(),l=latestMeasurement(),p=previousMeasurement();$('#measurementCount').textContent=`${r.length} registro${r.length===1?'':'s'}`;$('#measurementDate').value=localDateKey();[[ '#evolutionWeight','#evolutionWeightDelta',l.weight,p?.weight,'kg'],['#evolutionWaist','#evolutionWaistDelta',l.waist,p?.waist,'cm'],['#evolutionFat','#evolutionFatDelta',l.bodyFat,p?.bodyFat,'%'],['#evolutionVisceral','#evolutionVisceralDelta',l.visceral,p?.visceral,'']].forEach(([vs,ds,c,b,u])=>{$(vs).textContent=formatValue(c,u);const d=signedDelta(c,b,u==='%'?'p.p.':u);$(ds).textContent=d.text;$(ds).className=trendClass(d.value,true);});renderWeightChart();renderGoals();renderHistory();}
  function renderWeightChart(){const p=getMeasurements().filter(x=>numericOrNull(x.weight)!==null).slice(0,12).reverse();if(p.length<2){$('#weightChart').innerHTML='<div class="empty-state">Registre pelo menos dois pesos para gerar o gráfico.</div>';return;}const v=p.map(x=>Number(x.weight)),min=Math.min(...v),max=Math.max(...v),range=Math.max(1,max-min),w=720,h=230,px=42,py=28,c=v.map((n,i)=>({x:px+(i/(v.length-1))*(w-px*2),y:py+((max-n)/range)*(h-py*2),value:n})),line=c.map(q=>`${q.x},${q.y}`).join(' '),area=`${px},${h-py} ${line} ${w-px},${h-py}`;$('#weightChart').innerHTML=`<svg viewBox="0 0 ${w} ${h}"><defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#52c5ff" stop-opacity=".35"/><stop offset="1" stop-color="#52c5ff" stop-opacity="0"/></linearGradient></defs><polyline points="${area}" fill="url(#weightFill)"/><polyline points="${line}" fill="none" stroke="#52c5ff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${c.map(q=>`<circle cx="${q.x}" cy="${q.y}" r="6" fill="#071522" stroke="#8edbff" stroke-width="3"><title>${formatPt(q.value)} kg</title></circle>`).join('')}<text x="${c.at(-1).x-8}" y="${c.at(-1).y-12}" fill="#dff4ff" font-size="13" font-weight="800" text-anchor="end">${formatPt(c.at(-1).value)} kg</text></svg>`;}
  function renderGoals(){const p=getProfile();$('#goalWeightInput').value=p.goals.weight??'';$('#goalWaistInput').value=p.goals.waist??'';$('#goalFatInput').value=p.goals.bodyFat??'';$('#goalCaloriesInput').value=p.goals.calories??'';}
  $('#measurementForm').addEventListener('submit',e=>{e.preventDefault();const f=new FormData(e.target),r={source:'full'};for(const[k,v]of f.entries())r[k]=k==='date'||k==='notes'?v:numericOrNull(v);if(!Object.entries(r).some(([k,v])=>!['date','notes','source'].includes(k)&&typeof v==='number'))return showToast('Preencha pelo menos uma medida.');r.date=new Date(`${r.date||localDateKey()}T12:00:00`).toISOString();saveMeasurement(r);e.target.reset();$('#measurementDate').value=localDateKey();showToast('Avaliação salva.');});
  $('#goalsForm').addEventListener('submit',e=>{e.preventDefault();const p=getProfile();p.goals={weight:numericOrNull($('#goalWeightInput').value),waist:numericOrNull($('#goalWaistInput').value),bodyFat:numericOrNull($('#goalFatInput').value),calories:numericOrNull($('#goalCaloriesInput').value)};saveProfile(p);loadMeasurements();renderGoals();renderDiet();showToast('Metas atualizadas.');});
  $('#clearHistory').addEventListener('click',()=>{if(!confirm('Limpar todo o histórico de medidas?'))return;localStorage.removeItem(measurementsKey);initializeUserData();loadMeasurements();renderEvolution();showToast('Histórico reiniciado.');});

  function getPhotos(){try{return JSON.parse(localStorage.getItem('progressPhotos')||'[]')}catch{return[]}}
  function renderPhotos(){const photos=getPhotos();$('#photoGrid').innerHTML=photos.map((photo,i)=>`<div class="photo-item"><img src="${photo.data}" alt="Foto de evolução"><button data-remove-photo="${i}">×</button></div>`).join('');}
  function resizeImage(file,maxSize=760,quality=.72){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onerror=reject;reader.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const scale=Math.min(1,maxSize/Math.max(img.width,img.height)),canvas=document.createElement('canvas');canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',quality));};img.src=reader.result;};reader.readAsDataURL(file);});}
  $('#photoInput').addEventListener('change',async event=>{const photos=getPhotos();for(const file of [...event.target.files].slice(0,4)){try{photos.unshift({date:new Date().toISOString(),data:await resizeImage(file)});}catch{}}try{localStorage.setItem('progressPhotos',JSON.stringify(photos.slice(0,8)));showToast('Fotos adicionadas.');}catch{showToast('O navegador ficou sem espaço para fotos.');}renderPhotos();event.target.value='';});
  $('#photoGrid').addEventListener('click',event=>{const btn=event.target.closest('[data-remove-photo]');if(!btn)return;const photos=getPhotos();photos.splice(Number(btn.dataset.removePhoto),1);localStorage.setItem('progressPhotos',JSON.stringify(photos));renderPhotos();});

  initializeUserData();
  $('#todayLabel').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date()).replace('.','');
  const initialHash=location.hash.slice(1);openTab(['dashboard','treino','dieta','progresso'].includes(initialHash)?initialHash:'dashboard',false);
  loadMeasurements();renderTodayCard();renderWorkout();renderDiet();renderEvolution();renderWorkoutHistory();renderPhotos();
  let installPrompt;window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installButton').hidden=false;});$('#installButton').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installButton').hidden=true;});if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data?.type !== 'APP_UPDATED') return;
    const reloadKey = `wpReloaded-${event.data.version}`;
    if (sessionStorage.getItem(reloadKey)) return;
    sessionStorage.setItem(reloadKey, '1');
    window.location.reload();
  });

  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('./sw.js?v=20260716-4', {
        updateViaCache: 'none'
      });
      await registration.update();
    } catch (error) {
      console.warn('Falha ao atualizar o aplicativo offline:', error);
    }
  });
}
})();