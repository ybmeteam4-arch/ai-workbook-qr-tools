const questions=[
  {id:"q1",type:"빈칸 완성",prompt:"My uncle, _____ lives in Busan, is an architect.",choices:["who","which","that","what"],answer:0,explanation:"사람인 My uncle에 부가 정보를 덧붙이므로 who가 알맞아요. 계속적 용법에서는 that을 쓰지 않아요."},
  {id:"q2",type:"빈칸 완성",prompt:"The library, _____ has a curved roof, opened last year.",choices:["who","which","that","where"],answer:1,explanation:"사물인 The library를 설명하며, 쉼표 뒤의 관계절이 부가 정보를 덧붙이므로 which가 알맞아요."},
  {id:"q3",type:"바른 문장 고르기",prompt:"관계대명사의 계속적 용법을 바르게 사용한 문장을 고르세요.",choices:["Jina, who loves design, joined the art club.","Jina who, loves design joined the art club.","Jina, that loves design, joined the art club.","Jina, which loves design, joined the art club."],answer:0,explanation:"사람인 Jina 뒤에 쉼표를 쓰고 who로 부가 설명을 연결한 문장이 바른 문장이에요."},
  {id:"q4",type:"의미 이해",prompt:"계속적 용법의 관계절은 앞의 사람이나 사물에 어떤 정보를 더하나요?",choices:["꼭 필요한 제한 정보","부가적인 설명","시간의 순서","조건과 결과"],answer:1,explanation:"계속적 용법의 관계절은 문장의 핵심 대상을 제한하지 않고 부가적인 설명을 덧붙여요."},
  {id:"q5",type:"문장 연결",prompt:"두 문장을 관계대명사의 계속적 용법으로 바르게 연결한 문장을 고르세요. The museum is near the river. It has a curved roof.",choices:["The museum, which is near the river, has a curved roof.","The museum that is near the river, has a curved roof.","The museum, who is near the river, has a curved roof.","The museum which, is near the river has a curved roof."],answer:0,explanation:"사물인 The museum에는 which를 쓰고, 부가 설명인 which is near the river의 앞뒤를 쉼표로 구분해요."}
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

function render(list=questions){
  activeQuestions=[...list];
  quiz.innerHTML=activeQuestions.map((q,i)=>`<article class="question" data-id="${q.id}"><div class="qTop"><span class="qNo">${i+1}</span><span class="qType">${q.type}</span></div><p class="prompt">${q.prompt}</p><div class="choices">${q.choices.map((choice,j)=>`<label class="choice"><input type="radio" name="${q.id}" value="${j}"><span>${choice}</span></label>`).join("")}</div><p class="feedback"></p></article>`).join("");
  gradeButton.hidden=false;
  resetButton.hidden=true;
  resultCard.hidden=true;
  lastWrong=[];
}

function grade(){
  let correct=0;
  lastWrong=[];
  activeQuestions.forEach(q=>{
    const card=quiz.querySelector(`[data-id="${q.id}"]`);
    const checked=card.querySelector("input:checked");
    const selected=checked?Number(checked.value):-1;
    const ok=selected===q.answer;
    if(ok) correct++; else lastWrong.push(q);
    card.classList.add("graded",ok?"correct":"wrong");
    card.querySelectorAll("input").forEach(input=>input.disabled=true);
    card.querySelector(".feedback").innerHTML=`<span class="answer">${ok?"정답이에요.":`정답: ${q.choices[q.answer]}`}</span> ${q.explanation}`;
  });
  scoreText.textContent=`${correct} / ${activeQuestions.length}`;
  const ratio=correct/activeQuestions.length;
  scoreMessage.textContent=ratio===1?"완벽해요! 관계대명사의 계속적 용법을 정확히 이해했어요.":ratio>=.6?"좋아요! 틀린 문제만 다시 풀어 핵심을 완성해 보세요.":"핵심 개념을 한 번 더 확인한 뒤 틀린 문제에 재도전해 보세요.";
  resultList.innerHTML=activeQuestions.map((q,i)=>{const wrong=lastWrong.some(item=>item.id===q.id);return `<div class="resultRow"><b>${i+1}. ${q.type}</b><span class="${wrong?"no":"ok"}">${wrong?"오답":"정답"}</span></div>`}).join("");
  retryWrongButton.hidden=lastWrong.length===0;
  resultCard.hidden=false;
  gradeButton.hidden=true;
  resetButton.hidden=false;
  localStorage.setItem("grammarVideo1LastResult",JSON.stringify({score:correct,total:activeQuestions.length,wrongIds:lastWrong.map(q=>q.id),savedAt:new Date().toISOString()}));
  resultCard.scrollIntoView({behavior:"smooth",block:"start"});
}

function resetAll(){render(questions);window.scrollTo({top:document.querySelector(".quizCard").offsetTop-12,behavior:"smooth"})}
function retryWrong(){if(lastWrong.length){const targets=[...lastWrong];render(targets);document.querySelector(".quizCard").scrollIntoView({behavior:"smooth",block:"start"})}}

gradeButton.addEventListener("click",grade);
resetButton.addEventListener("click",resetAll);
retryAllButton.addEventListener("click",resetAll);
retryWrongButton.addEventListener("click",retryWrong);
render();
