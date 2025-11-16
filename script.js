// Демо-база пользователей (в реальном проекте — API)
const DEMO_USERS = {
  admin: {
    id: 'adm-001',
    name: 'Админ',
    email: 'admin@example.com',
    role: 'admin',
    avatar: 'А',
    createdAt: '2024-03-10'
  },
  user: {
    id: 'usr-128',
    name: 'Анна Петрова',
    email: 'anna@example.com',
    role: 'user',
    avatar: 'А',
    subscription: { plan: 'Про', status: 'active', expiresAt: '2026-02-15' },
    progress: {
      completedModules: 2,
      totalModules: 4,
      completedLessons: 14,
      totalLessons: 28
    },
    lessons: [
      { id: 1, title: 'Регистрация организации', completed: true },
      { id: 2, title: 'Добавление сотрудников', completed: true },
      { id: 3, title: 'Настройка прав доступа', completed: true },
      { id: 4, title: 'Виды ВСД', completed: false },
      { id: 5, title: 'Оформление ВСД на ТН', completed: false },
    ]
  }
};

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
  // Если пришли на cabinet.html без авторизации — редирект на login
  if (window.location.pathname.endsWith('cabinet.html')) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
      window.location.href = 'login.html';
      return;
    }
    renderCabinet(user);
  }

  // Обработка формы входа
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const email = e.target.email.value.trim().toLowerCase();
      const password = e.target.password.value;

      // Простая проверка (логин = пароль для демо)
      if (DEMO_USERS[email] && password === email) {
        const user = DEMO_USERS[email];
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = 'cabinet.html';
      } else {
        alert('Неверный логин или пароль. Попробуйте: admin / admin или user / user');
      }
    });
  }
});

function renderCabinet(user) {
  document.title = `Кабинет — ${user.name} | Меркурий без паники`;

  let content = '';

  if (user.role === 'admin') {
    content = renderAdminPanel(user);
  } else {
    content = renderUserPanel(user);
  }

  document.body.innerHTML = `
    <div class="container">
      <header>
        <div class="logo">
          <div class="mark">М</div>
          <div><strong>Меркурий без паники</strong></div>
        </div>
        <div class="user-info">
          <div class="avatar">${user.avatar}</div>
          <div>
            <div>${user.name}</div>
            <div style="font-size:12px;color:var(--muted)">${user.role === 'admin' ? 'Администратор' : 'Ученик'}</div>
          </div>
          <a href="#" id="logoutBtn" style="margin-left:16px;color:var(--muted);text-decoration:underline;font-size:14px">Выйти</a>
        </div>
      </header>

      ${content}
    </div>
    <link rel="stylesheet" href="cabinet.css">
  `;

  // Обработчик выхода
  document.getElementById('logoutBtn').onclick = e => {
    e.preventDefault();
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
  };
}

function renderUserPanel(user) {
  const progressPercent = Math.round((user.progress.completedLessons / user.progress.totalLessons) * 100);
  return `
    <div class="section">
      <div class="card">
        <h2>Добро пожаловать, ${user.name}!</h2>
        <p>Вы на ${user.progress.completedModules} из ${user.progress.totalModules} модулей.</p>

        <div class="section">
          <div>Прогресс обучения: <strong>${progressPercent}%</strong></div>
          <div class="progress-bar">
            <div class="progress-fill" style="width:${progressPercent}%"></div>
          </div>
        </div>

        <div class="section">
          <h3>Ваша подписка</h3>
          <div style="display:flex;justify-content:space-between;align-items:center">
            <div><strong>${user.subscription.plan}</strong></div>
            <span class="badge ${user.subscription.status}">${user.subscription.status === 'active' ? 'Активна' : 'Истекла'}</span>
          </div>
          <div style="font-size:13px;color:var(--muted);margin-top:4px">
            Действует до ${user.subscription.expiresAt}
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <h2>Доступные модули</h2>
      <div class="card">
        <ul class="module-list">
          <li class="module-item"><strong>Модуль 1</strong> — Регистрация и настройка</li>
          <li class="module-item"><strong>Модуль 2</strong> — Работа с ВСД</li>
          <li class="module-item"><strong>Модуль 3</strong> — Гашение и отмена</li>
          <li class="module-item"><strong>Модуль 4</strong> — Интеграции (1С, ЭДО)</li>
        </ul>
      </div>
    </div>

    <div class="section">
      <h2>Последние уроки</h2>
      <div class="card">
        <ul class="lesson-list">
          ${user.lessons.map(lesson => `
            <li class="lesson-item ${lesson.completed ? 'completed' : ''}">
              ${lesson.title}
            </li>
          `).join('')}
        </ul>
        <a href="#" class="btn" style="display:inline-block;margin-top:16px">Открыть все уроки</a>
      </div>
    </div>

    <div class="section">
      <h2>Полезные материалы</h2>
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <a href="#" class="btn">Скачать чек-листы (PDF)</a>
          <a href="#" class="btn">Шаблоны ВСД (Excel)</a>
          <a href="#" class="btn">Гайд по ошибкам</a>
          <a href="#" class="btn">Telegram-поддержка</a>
        </div>
      </div>
    </div>
  `;
}

function renderAdminPanel(user) {
  const students = [
    { id: 'usr-128', name: 'Анна Петрова', email: 'anna@example.com', plan: 'Про', status: 'active', expires: '2026-02-15', progress: '50%' },
    { id: 'usr-094', name: 'Иван Сидоров', email: 'ivan@example.com', plan: 'Стандарт', status: 'trial', expires: '2025-12-01', progress: '20%' },
    { id: 'usr-211', name: 'ООО «Агрохим»', email: 'info@agrohim.ru', plan: 'Про', status: 'expired', expires: '2025-10-30', progress: '85%' },
  ];

  return `
    <div class="section">
      <div class="card">
        <h2>Панель администратора</h2>
        <p>Всего учеников: <strong>${students.length}</strong></p>
      </div>
    </div>

    <div class="section">
      <h2>Ученики</h2>
      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Имя / Организация</th>
              <th>Email</th>
              <th>Тариф</th>
              <th>Статус</th>
              <th>Прогресс</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(s => `
              <tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.email}</td>
                <td>${s.plan}</td>
                <td><span class="status ${s.status}">${s.status === 'active' ? 'Активен' : s.status === 'trial' ? 'Пробный' : 'Истёк'}</span></td>
                <td>${s.progress}</td>
                <td class="actions">
                  <button class="btn btn-sm">Подробнее</button>
                  <button class="btn btn-sm btn-outline">Продлить</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div class="section">
      <h2>Управление курсом</h2>
      <div class="card">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <button class="btn">Обновить модули</button>
          <button class="btn">Разослать уведомления</button>
          <button class="btn btn-outline">Экспорт данных (CSV)</button>
          <button class="btn btn-outline">Аналитика</button>
        </div>
      </div>
    </div>
  `;
}