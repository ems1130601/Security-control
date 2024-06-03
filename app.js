document.addEventListener('DOMContentLoaded', function() {
    loadState();
    updateTime();
    setInterval(updateTime, 1000);
    restoreCountdown();
});

function toggleLock(id) {
    var input = document.getElementById(id);
    input.disabled = !input.disabled;
    var button = input.nextElementSibling;
    button.textContent = input.disabled ? '解鎖' : '鎖定';
    saveState();
}

function toggleLockGroup(containerId) {
    var container = document.getElementById(containerId);
    var inputs = container.querySelectorAll('input');
    var allDisabled = Array.from(inputs).every(input => input.disabled);
    inputs.forEach(input => {
        input.disabled = !allDisabled;
    });
    saveState();
}

function saveState() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        localStorage.setItem(input.id, input.value);
        localStorage.setItem(input.id + '-disabled', input.disabled);
    });
}

function loadState() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (localStorage.getItem(input.id)) {
            input.value = localStorage.getItem(input.id);
            input.disabled = (localStorage.getItem(input.id + '-disabled') === 'true');
            if (input.nextElementSibling && input.nextElementSibling.tagName === 'BUTTON') {
                var button = input.nextElementSibling;
                button.textContent = input.disabled ? '解鎖' : '鎖定';
            }
        }
    });
}

function confirmReset() {
    if (confirm('是否重置所有內容？')) {
        resetAll();
    }
}

function resetAll() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.value = '';
        input.disabled = false;
        if (input.nextElementSibling && input.nextElementSibling.tagName === 'BUTTON') {
            var button = input.nextElementSibling;
            button.textContent = '鎖定';
        }
    });
    resetCountdown();
    saveState();
}

function updateTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const now = new Date();
    currentTimeElement.textContent = '現在時間: ' + now.toLocaleString('zh-TW', {
        year: 'numeric', month: 'numeric', day: 'numeric', 
        hour: 'numeric', minute: 'numeric', second: 'numeric'
    });
}

let countdownInterval;
let remainingTime;
const countdownDuration = 20 * 60; // 初始時間為20分鐘（1200秒）

function startCountdown() {
    if (countdownInterval) {
        if (confirm('是否重新開始計時？')) {
            clearInterval(countdownInterval);
            localStorage.removeItem('countdownStart');
            localStorage.setItem('countdownStart', Date.now().toString());
            document.getElementById('countdown').className = '';
            countdownInterval = setInterval(updateCountdown, 1000);
        }
    } else {
        localStorage.setItem('countdownStart', Date.now().toString());
        countdownInterval = setInterval(updateCountdown, 1000);
    }
}

function resetCountdown() {
    clearInterval(countdownInterval);
    remainingTime = countdownDuration;
    localStorage.removeItem('countdownStart');
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = '點擊開始倒數計時';
    countdownElement.className = '';
}

function updateCountdown() {
    const startTime = parseInt(localStorage.getItem('countdownStart'));
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    remainingTime = countdownDuration - elapsed;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    const countdownElement = document.getElementById('countdown');
    countdownElement.textContent = `倒數計時: ${minutes}:${seconds.toString().padStart(2, '0')}`;

    countdownElement.className = '';
    if (remainingTime <= 5 * 60) {
        countdownElement.className = 'danger';
    } else if (remainingTime <= 10 * 60) {
        countdownElement.className = 'warning';
    }

    if (remainingTime <= 0) {
        clearInterval(countdownInterval);
        countdownElement.textContent = '時間到!';
        countdownElement.className = '';
        remainingTime = 0;
    }
}

function restoreCountdown() {
    if (localStorage.getItem('countdownStart')) {
        countdownInterval = setInterval(updateCountdown, 1000);
    }
}
