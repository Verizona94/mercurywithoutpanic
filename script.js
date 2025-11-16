const DEMO_USERS = {
  user: { name:'Анна', avatar:'А', role:'user', subscription:{plan:'Про', status:'active', expires:'15.02.2026'}, lessons:[{title:'Урок 1', completed:false},{title:'Урок 2', completed:false}] },
  admin: { name:'Админ', avatar:'А', role:'admin', students:[{name:'Анна', plan:'Про', status:'active', progress:'50%'}] }
};

const loginScreen = document.getElementById('login-screen');
const cabinetScreen = document.getElementById('cabinet-screen');
const loginForm = document.getElementById('loginForm');

if(JSON.parse(localStorage.getItem('currentUser'))) showCabinet(JSON.parse(localStorage.getItem('currentUser')));

loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const login = document.getElementById('login').value.toLowerCase();
  const password = document.getElementById('password').value;
  if(DEMO_USERS[login] && login===password){
    const user = DEMO_USERS[login];
    localStorage.setItem('currentUser', JSON.stringify(user));
    showCabinet(user);
  } else { alert('Неверный логин/пароль'); }
});

function showCabinet(user){
  loginScreen.classList.remove('visible');
  cabinetScreen.classList.add('visible');
  if(user.role==='user'){
    cabinetScreen.innerHTML = `<h2>Привет, ${user.name}</h2>
      <p>Уроки:</p>
      <ul>${user.lessons.map(l=>`<li>${l.title} ${l.completed?'✅':''}</li>`).join('')}</ul>
      <button onclick="completeNext()">Пройти следующий урок</button>`;
  } else {
    cabinetScreen.innerHTML = `<h2>Админ панель</h2>
      <p>Ученики: ${user.students.length}</p>`;
  }
}

function completeNext(){
  const user = JSON.parse(localStorage.getItem('currentUser'));
  const next = user.lessons.find(l=>!l.completed);
  if(next){
    next.completed = true;
    localStorage.setItem('currentUser', JSON.stringify(user));
    showCabinet(user);
  } else alert('Все уроки пройдены!');
}
