let clicks = 0;
let timer;
let timeElapsed = 0;
const duration = 10; // 测试时长（秒）
let startTime;

const clickButton = document.getElementById('clickButton');
const timerDisplay = document.getElementById('timer');
const cpsDisplay = document.getElementById('cps');

clickButton.addEventListener('click', (event) => {
    if (clickButton.textContent === '开始测试') {
        startTest();
    } else {
        clicks++;
        updateCPS();
        createRipple(event);
    }
});

function startTest() {
    clicks = 0;
    timeElapsed = 0;
    startTime = Date.now();
    cpsDisplay.textContent = `CPS：0.00`;
    timerDisplay.textContent = `时间：10.0 秒`;
    clickButton.textContent = '点击我';

    timer = setInterval(() => {
        timeElapsed = (Date.now() - startTime) / 1000; // 计算已过时间
        timerDisplay.textContent = `时间：${(duration - timeElapsed).toFixed(1)} 秒`;
        if (timeElapsed >= duration) {
            stopTest();
        } else {
            updateCPS();
        }
    }, 100);
}

function stopTest() {
    clearInterval(timer);
    clickButton.textContent = '3.0 秒后可用';
    clickButton.disabled = true;
    let countdown = 3.0;
    const countdownInterval = setInterval(() => {
        countdown -= 0.1;
        clickButton.textContent = `${countdown.toFixed(1)} 秒后可用`;
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            clickButton.textContent = '开始测试';
            clickButton.disabled = false;
        }
    }, 100);
    cpsDisplay.textContent = `最终 CPS：${(clicks / duration).toFixed(2)}`;
    timerDisplay.textContent = `时间：0.0 秒`;
}

function updateCPS() {
    const currentTime = Date.now();
    const elapsedTime = (currentTime - startTime) / 1000; // 计算已过时间
    const cps = elapsedTime > 0 ? (clicks / elapsedTime).toFixed(2) : '0.00';
    cpsDisplay.textContent = `CPS：${cps}`;
}

function createRipple(event) {
    const buttonRect = clickButton.getBoundingClientRect();
    const x = event.clientX - buttonRect.left;
    const y = event.clientY - buttonRect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x - 50}px`; // 以点击位置为中心
    ripple.style.top = `${y - 50}px`; // 以点击位置为中心
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';
    ripple.style.transition = 'transform 0.5s, opacity 0.5s';

    ripple.addEventListener('transitionend', () => {
        ripple.remove();
    });

    clickButton.appendChild(ripple);

    setTimeout(() => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
    }, 0);
}