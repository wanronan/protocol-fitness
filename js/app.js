(() => {
  const workouts = {
    segunda: { label:'SEGUNDA • QUADRÍCEPS', name:'Perna Quadríceps', focus:'Quadríceps, panturrilha e abdutora', cover:'assets/covers/quadriceps.webp', exercises:[
      ['Leg Press 45°','10×10 + afundo entre séries'],['Hack Machine','10×10 + afundo entre séries'],['Cadeira Extensora','10×10 + afundo entre séries'],['Panturrilha em pé','5×15-20'],['Abdutora','4×20'] ]},
    terca: { label:'TERÇA • PUSH SUPERIOR', name:'Push', focus:'Peito, ombros e tríceps', cover:'assets/covers/push.webp', exercises:[
      ['Supino reto','4×6-8'],['Supino inclinado','4×8-10'],['Crucifixo máquina','3×12-15'],['Desenvolvimento máquina','4×8-10'],['Elevação lateral','4×12-15'],['Tríceps corda','4×12'] ]},
    quarta: { label:'QUARTA • POSTERIORES', name:'Pernas Posterior', focus:'Posterior, glúteos e panturrilha', cover:'assets/covers/posterior.webp', exercises:[
      ['Stiff','10×10 + afundo entre séries'],['Mesa Flexora','10×10 + afundo entre séries'],['Cadeira Flexora','10×10 + afundo entre séries'],['Panturrilha sentada','5×20'],['Glúteo máquina','4×15'] ]},
    quinta: { label:'QUINTA • PULL SUPERIOR', name:'Pull', focus:'Costas, bíceps e ombro posterior', cover:'assets/covers/pull.webp', exercises:[
      ['Barra fixa / puxada','4 séries'],['Remada articulada','4×8-10'],['Puxada neutra','4×10-12'],['Remada baixa','3×12'],['Rosca direta','4×10'],['Rosca martelo','3×12'],['Face pull','3×15'] ]},
    sexta: { label:'SEXTA • PERNAS MISTAS', name:'Pernas Completo', focus:'Quadríceps, posterior, glúteos e panturrilha', cover:'assets/covers/pernas.webp', exercises:[
      ['Leg Press','10×10 + afundo entre séries'],['Stiff','10×10 + afundo entre séries'],['Cadeira Extensora','5×15'],['Mesa Flexora','5×15'],['Panturrilhas','5×20'],['Adutora','4×20'],['Abdutora','4×20'] ]}
  };

  const meals = [
    ['06:30','Café da manhã','4 ovos + 150 g cuscuz + café sem açúcar'],
    ['10:00','Lanche da manhã','1 maçã + 1 scoop whey'],
    ['13:00','Almoço','200 g carne/frango + arroz + salada'],
    ['16:30','Pré-treino','1 banana + 150 g mandioca + café'],
    ['Pós','Pós-treino','1 scoop whey + 5 g creatina'],
    ['20:00','Jantar','200 g carne/frango + arroz ou mandioca'],
    ['22:00','Ceia','150 g abacate ou 3 ovos']
  ];

  const $ = sel => document.querySelector(sel);
  const $$ = sel => [...document.querySelectorAll(sel)];
  const parseStoredNumber = key => {
    const value = localStorage.getItem(key);
    return value ? Number(String(value).replace(',','.')) : null;
  };
  const formatPt = value => Number(value).toLocaleString('pt-BR',{minimumFractionDigits: value % 1 ? 1 : 0, maximumFractionDigits:1});

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(()=>toast.classList.remove('show'),2200);
  }

  function openTab(id, updateHash=true) {
    $$('.tab-panel').forEach(panel=>panel.classList.toggle('active',panel.id===id));
    $$('.nav-item').forEach(btn=>btn.classList.toggle('active',btn.dataset.tabTarget===id));
    if(updateHash) history.replaceState(null,'',`#${id}`);
    window.scrollTo({top:0,behavior:'smooth'});
  }

  $$('[data-tab-target]').forEach(el=>el.addEventListener('click',event=>{
    event.preventDefault();
    openTab(el.dataset.tabTarget);
  }));

  function loadMeasurements() {
    const peso = parseStoredNumber('pesoAtual') ?? 102.7;
    const cintura = parseStoredNumber('cinturaAtual') ?? 100;
    $('#pesoAtual').textContent = `${formatPt(peso)} kg`;
    $('#cinturaAtual').textContent = `${formatPt(cintura)} cm`;
    const start=102.7,target=98;
    const progress=Math.max(0,Math.min(100,((start-peso)/(start-target))*100));
    $('#pesoProgress').style.width=`${Math.max(8,progress)}%`;
  }

  function getHistory() {
    try { return JSON.parse(localStorage.getItem('medidasHistorico')||'[]'); } catch { return []; }
  }
  function saveHistory(item) {
    const history=getHistory();
    history.unshift(item);
    localStorage.setItem('medidasHistorico',JSON.stringify(history.slice(0,30)));
  }

  $('#quickForm').addEventListener('submit',event=>{
    event.preventDefault();
    const p=$('#pesoInput').value;
    const c=$('#cinturaInput').value;
    if(!p && !c) return showToast('Preencha peso ou cintura.');
    if(p) localStorage.setItem('pesoAtual',p);
    if(c) localStorage.setItem('cinturaAtual',c);
    saveHistory({date:new Date().toISOString(),peso:p||null,cintura:c||null});
    loadMeasurements();
    renderHistory();
    event.target.reset();
    showToast('Atualização salva.');
  });

  function renderWorkout() {
    const day=$('#diaSelect').value;
    const workout=workouts[day];
    $('#workoutCoverImage').src=workout.cover;
    $('#workoutCoverImage').alt=workout.name;
    $('#workoutDayLabel').textContent=workout.label;
    $('#workoutName').textContent=workout.name;
    $('#workoutFocus').textContent=workout.focus;
    $('#nextWorkoutText').textContent=`${workout.name}: ${workout.exercises.length} exercícios.`;
    $('#listaTreino').innerHTML=workout.exercises.map((ex,i)=>{
      const done=localStorage.getItem(`treino_${day}_${i}`)==='1';
      const weight=localStorage.getItem(`carga_${day}_${i}`)||'';
      return `<article class="exercise-card ${done?'done':''}">
        <div><h3>${ex[0]}</h3><p>${ex[1]}</p></div>
        <label class="weight-input"><input type="number" min="0" step="0.5" inputmode="decimal" value="${weight}" placeholder="Carga em kg" data-weight="${i}" aria-label="Carga de ${ex[0]}"><span>kg</span></label>
        <button class="done-toggle ${done?'done':''}" data-done="${i}" aria-label="Marcar ${ex[0]} como concluído">${done?'✓':''}</button>
      </article>`;
    }).join('');
    updateWorkoutProgress();
  }

  function updateWorkoutProgress() {
    const day=$('#diaSelect').value;
    const total=workouts[day].exercises.length;
    const done=workouts[day].exercises.filter((_,i)=>localStorage.getItem(`treino_${day}_${i}`)==='1').length;
    const percent=Math.round(done/total*100);
    $('#workoutProgressText').textContent=`${done} de ${total} exercícios`;
    $('#workoutProgressPercent').textContent=`${percent}%`;
    $('#workoutProgressBar').style.width=`${percent}%`;
  }

  $('#diaSelect').addEventListener('change',()=>{
    localStorage.setItem('ultimoDiaTreino',$('#diaSelect').value);
    renderWorkout();
  });
  $('#listaTreino').addEventListener('change',event=>{
    const input=event.target.closest('[data-weight]');
    if(!input) return;
    localStorage.setItem(`carga_${$('#diaSelect').value}_${input.dataset.weight}`,input.value);
  });
  $('#listaTreino').addEventListener('click',event=>{
    const btn=event.target.closest('[data-done]');
    if(!btn) return;
    const day=$('#diaSelect').value,key=`treino_${day}_${btn.dataset.done}`;
    const next=localStorage.getItem(key)!=='1';
    localStorage.setItem(key,next?'1':'0');
    btn.classList.toggle('done',next); btn.textContent=next?'✓':'';
    btn.closest('.exercise-card').classList.toggle('done',next);
    updateWorkoutProgress();
  });

  function renderDiet() {
    $('#listaDieta').innerHTML=meals.map((meal,i)=>{
      const done=localStorage.getItem(`dieta_${i}`)==='1';
      return `<article class="meal-card">
        <div class="meal-time">${meal[0]}</div>
        <div><h3>${meal[1]}</h3><p>${meal[2]}</p></div>
        <button class="done-toggle ${done?'done':''}" data-meal="${i}" aria-label="Marcar ${meal[1]} como concluída">${done?'✓':''}</button>
      </article>`;
    }).join('');
    updateDietProgress();
  }
  function updateDietProgress() {
    const done=meals.filter((_,i)=>localStorage.getItem(`dieta_${i}`)==='1').length;
    const percent=Math.round(done/meals.length*100);
    $('#dietProgressText').textContent=`${done} de ${meals.length} refeições`;
    $('#dietProgressPercent').textContent=`${percent}%`;
    $('#dietProgressBar').style.width=`${percent}%`;
  }
  $('#listaDieta').addEventListener('click',event=>{
    const btn=event.target.closest('[data-meal]');
    if(!btn) return;
    const key=`dieta_${btn.dataset.meal}`,next=localStorage.getItem(key)!=='1';
    localStorage.setItem(key,next?'1':'0');
    btn.classList.toggle('done',next); btn.textContent=next?'✓':'';
    updateDietProgress();
  });

  function renderHistory() {
    const history=getHistory();
    $('#historyList').innerHTML=history.length?history.map(item=>{
      const date=new Intl.DateTimeFormat('pt-BR',{dateStyle:'medium',timeStyle:'short'}).format(new Date(item.date));
      const values=[item.peso?`${String(item.peso).replace('.',',')} kg`:null,item.cintura?`${String(item.cintura).replace('.',',')} cm`:null].filter(Boolean).join(' • ');
      return `<div class="history-item"><div><strong>Atualização</strong><p>${date}</p></div><div class="history-values">${values}</div></div>`;
    }).join(''):'<div class="empty-state">Salve uma atualização para iniciar o histórico.</div>';
  }
  $('#clearHistory').addEventListener('click',()=>{
    if(!confirm('Limpar o histórico de medidas?')) return;
    localStorage.removeItem('medidasHistorico'); renderHistory(); showToast('Histórico limpo.');
  });

  function getPhotos(){ try{return JSON.parse(localStorage.getItem('progressPhotos')||'[]')}catch{return[]} }
  function renderPhotos(){
    const photos=getPhotos();
    $('#photoGrid').innerHTML=photos.map((photo,i)=>`<div class="photo-item"><img src="${photo.data}" alt="Foto de evolução"><button data-remove-photo="${i}" aria-label="Remover foto">×</button></div>`).join('');
  }
  function resizeImage(file,maxSize=760,quality=.72){
    return new Promise((resolve,reject)=>{
      const reader=new FileReader();
      reader.onerror=reject;
      reader.onload=()=>{
        const img=new Image(); img.onerror=reject;
        img.onload=()=>{
          const scale=Math.min(1,maxSize/Math.max(img.width,img.height));
          const canvas=document.createElement('canvas'); canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
          canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);
          resolve(canvas.toDataURL('image/jpeg',quality));
        };
        img.src=reader.result;
      };
      reader.readAsDataURL(file);
    });
  }
  $('#photoInput').addEventListener('change',async event=>{
    const photos=getPhotos();
    for(const file of [...event.target.files].slice(0,4)){
      try{ photos.unshift({date:new Date().toISOString(),data:await resizeImage(file)}); }
      catch{}
    }
    try{ localStorage.setItem('progressPhotos',JSON.stringify(photos.slice(0,8))); showToast('Fotos adicionadas.'); }
    catch{ showToast('O navegador ficou sem espaço para fotos.'); }
    renderPhotos(); event.target.value='';
  });
  $('#photoGrid').addEventListener('click',event=>{
    const btn=event.target.closest('[data-remove-photo]'); if(!btn)return;
    const photos=getPhotos(); photos.splice(Number(btn.dataset.removePhoto),1); localStorage.setItem('progressPhotos',JSON.stringify(photos)); renderPhotos();
  });

  $('#todayLabel').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'short'}).format(new Date()).replace('.','');
  const savedDay=localStorage.getItem('ultimoDiaTreino');
  if(savedDay&&workouts[savedDay]) $('#diaSelect').value=savedDay;
  const initialHash=location.hash.slice(1);
  openTab(['dashboard','treino','dieta','progresso'].includes(initialHash)?initialHash:'dashboard',false);
  loadMeasurements(); renderWorkout(); renderDiet(); renderHistory(); renderPhotos();

  let installPrompt;
  window.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;$('#installButton').hidden=false;});
  $('#installButton').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('#installButton').hidden=true;});
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
})();