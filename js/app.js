// ===== APP.JS =====

const App = {
  init() {
    this.initSidebar();
    this.initDate();
    this.initAvatar();
    this.updateStreak();
  },

  initSidebar() {
    const sidebar = document.getElementById('sidebar1');
    const collapseBtn = document.getElementById('sidebar-collapse');
    if (!sidebar || !collapseBtn) return;

    const isCollapsed = localStorage.getItem('ling_sidebar_collapsed') === 'true';
    if (isCollapsed) sidebar.classList.add('collapsed');

    collapseBtn.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
      localStorage.setItem('ling_sidebar_collapsed', sidebar.classList.contains('collapsed'));
      collapseBtn.innerHTML = sidebar.classList.contains('collapsed') ? '›' : '‹';
    });

    if (isCollapsed) collapseBtn.innerHTML = '›';
  },

  initDate() {
    const el = document.getElementById('current-date');
    if (!el) return;
    const now = new Date();
    const days = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
    el.textContent = `${now.getFullYear()}年${now.getMonth()+1}月${now.getDate()}日 ${days[now.getDay()]}`;
  },

  initAvatar() {
    const profile = Storage.load('ling_profile') || {};
    const avatarEls = document.querySelectorAll('.profile-avatar-img');
    avatarEls.forEach(el => {
      if (profile.avatar) {
        el.style.backgroundImage = `url(${profile.avatar})`;
        el.style.backgroundSize = 'cover';
        el.textContent = '';
      }
    });
    const nameEls = document.querySelectorAll('.profile-name');
    nameEls.forEach(el => { el.textContent = profile.name || '翎庭'; });
  },

  updateStreak() {
    const journal = Storage.load('ling_journal') || [];
    const streakEl = document.getElementById('streak-count');
    if (!streakEl) return;

    let streak = 0;
    const today = new Date().toDateString();
    const sorted = journal.sort((a, b) => new Date(b.date) - new Date(a.date));

    for (let i = 0; i < sorted.length; i++) {
      const d = new Date(sorted[i].date);
      const expected = new Date();
      expected.setDate(expected.getDate() - i);
      if (d.toDateString() === expected.toDateString()) streak++;
      else break;
    }

    streakEl.textContent = streak || 0;
  }
};

// ===== STORAGE.JS =====
const Storage = {
  save(key, data) {
    try { localStorage.setItem(key, JSON.stringify(data)); } catch(e) { console.warn('Storage save failed', e); }
  },
  load(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch(e) { return null; }
  },
  remove(key) {
    localStorage.removeItem(key);
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
