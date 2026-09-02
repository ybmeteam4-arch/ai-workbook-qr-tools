const questions=[
  {id:"g1-1",grammar:"Grammar 1 · 관계대명사 계속적 용법",prompt:"My aunt, _____ lives in Jeju, is a photographer.",choices:["who","which","where","what"],answer:0,explanation:"사람을 선행사로 하며 쉼표 뒤에서 부가 설명을 하므로 who가 알맞습니다."},
  {id:"g2-1",grammar:"Grammar 2 · too ... to",prompt:"The box is _____ heavy _____ carry by myself.",choices:["too / to","so / that","very / to","enough / to"],answer:0,explanation:"‘너무 ~해서 …할 수 없다’는 too + 형용사 + to + 동사원형으로 나타냅니다."},
  {id:"g1-2",grammar:"Grammar 1 · 관계대명사 계속적 용법",prompt:"Mina bought a camera, _____ was on sale.",choices:["who","which","when","whose"],answer:1,explanation:"사물인 a camera를 부가 설명하는 계속적 용법이므로 which가 알맞습니다."},
  {id:"g2-2",grammar:"Grammar 2 · too ... to",prompt:"The soup is too hot _____ now.",choices:["eat","eating","to eat","ate"],answer:2,explanation:"too ... to 뒤에는 to + 동사원형을 사용하므로 to eat가 알맞습니다."},
  {id:"g1-3",grammar:"Grammar 1 · 관계대명사 계속적 용법",prompt:"Choose the correct sentence.",choices:["Mr. Lee, who teaches science, likes hiking.","Mr. Lee who, teaches science likes hiking.","Mr. Lee, which teaches science, likes hiking.","Mr. Lee, who teach science, likes hiking."],answer:0,explanation:"계속적 용법은 관계절 앞에 쉼표를 쓰며, 사람 선행사 Mr. Lee에는 who를 사용합니다."},
  {id:"g2-3",grammar:"Grammar 2 · too ... to",prompt:"Which sentence means ‘The child was so tired that he could not finish his homework’ ?",choices:["The child was tired enough to finish his homework.","The child was too tired to finish his homework.","The child was very tired finishing his homework.","The child was too tired that he finished his homework."],answer:1,explanation:"too tired to finish는 ‘너무 피곤해서 끝낼 수 없다’는 뜻입니다."}
];

const quiz=document.querySelector("#quiz");
const gradeButton=document.querySelector("#gradeButton");
const resetButton=document.querySelector("#resetButton");
const resultCard=document.querySelector("#resultCard");
const scoreText=document.querySelector("#scoreText");
const scoreMessage=document.querySelector("#scoreMessage");
const resultList=document.querySelector("#resultList");
const retryWrongButton=document.querySelector("#retryWrongButton");
const retryAllButton=document.querySelector("#retryAllButton");
let activeQuestions=[...questions];
let lastWrong=[];

function render(list=activeQuestions){
  activeQuestions=[...list];
  quiz.innerHTML=activeQuestions.map((q,i)=>`<article class="question" data-id="${q.id}"><div class="qTop"><span class="qNo">${i+1}</span><span class="qGrammar">${q.grammar}</span></div><p class="prompt">${q.prompt}</p><div class="choices">${q.choices.map((c,j)=>`<label class="choice"><input type="radio" name="${q.id}" value="${j}"><span>${c}</span></label>`).join("")}</div><p class="feedback"></p></article>`).join("");
  gradeButton.hidden=false;resetButton.hidden=true;resultCard.hidden=true;lastWrong=[];
  gradeButton.disabled=false;
  window.scrollTo({top:0,behavior:"auto"});
}

function grade(){
  let correct=0;lastWrong=[];
  activeQuestions.forEach((q,i)=>{
    const card=quiz.querySelector(`[data-id="${q.id}"]`);
    const checked=card.querySelector("input:checked");
    const selected=checked?Number(checked.value):-1;
    const ok=selected===q.answer;
    if(ok)correct++;else lastWrong.push(q);
    card.classList.add("graded",ok?"correct":"wrong");
    card.querySelectorAll("input").forEach(input=>input.disabled=true);
    const fb=card.querySelector(".feedback");
    fb.innerHTML=`<span class="answer">${ok?"정답입니다.":`정답: ${q.choices[q.answer]}`}</span> ${q.explanation}`;
  });
  scoreText.textContent=`${correct} / ${activeQuestions.length}`;
  const ratio=correct/activeQuestions.length;
  scoreMessage.textContent=ratio===1?"완벽해요! Grammar 1·2의 핵심을 모두 확인했습니다.":ratio>=.67?"좋아요! 틀린 문제만 다시 풀어 핵심을 완성해 보세요.":"핵심 개념을 한 번 더 확인한 뒤 틀린 문제에 재도전해 보세요.";
  resultList.innerHTML=activeQuestions.map((q,i)=>`<div class="resultRow"><b>${i+1}. ${q.grammar.split(" · ")[0]}</b><span class="${lastWrong.some(x=>x.id===q.id)?"no":"ok"}">${lastWrong.some(x=>x.id===q.id)?"오답":"정답"}</span></div>`).join("");
  retryWrongButton.hidden=lastWrong.length===0;
  resultCard.hidden=false;gradeButton.hidden=true;resetButton.hidden=false;
  localStorage.setItem("grammarVideo2LastResult",JSON.stringify({score:correct,total:activeQuestions.length,wrongIds:lastWrong.map(q=>q.id),savedAt:new Date().toISOString()}));
  resultCard.scrollIntoView({behavior:"smooth",block:"start"});
}

function resetAll(){render(questions)}
function retryWrong(){if(lastWrong.length)render(lastWrong)}

gradeButton.addEventListener("click",grade);
resetButton.addEventListener("click",resetAll);
retryAllButton.addEventListener("click",resetAll);
retryWrongButton.addEventListener("click",retryWrong);
render(questions);
