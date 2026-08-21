const DURATION: number = 10; // 测试时长（秒）

const clickButton = document.getElementById('clickButton') as HTMLButtonElement;
const timerDisplay = document.getElementById('timer') as HTMLParagraphElement;
const cpsDisplay = document.getElementById('cps') as HTMLParagraphElement;

let timer: number | null = null;
let startTime: number = 0;
let clicks: number = 0;
let timeElapsed: number = 0;


clickButton.addEventListener('click', (event: MouseEvent): void => {
    if (clickButton.textContent === '开始测试') {
        startTest();
    } else {
        clicks++;
        updateCPS();
        createRipple(event);
    }
});


function startTest(): void {
    clicks = 0;
    timeElapsed = 0;
    startTime = Date.now();
    cpsDisplay.textContent = 'CPS：0.00';
    timerDisplay.textContent = '时间：10.0 秒';
    clickButton.textContent = '点击我';

    timer = window.setInterval((): void => {
        timeElapsed = (Date.now() - startTime) / 1000;
        const remainingTime = DURATION - timeElapsed;
        timerDisplay.textContent = `时间：${remainingTime.toFixed(1)} 秒`;

        if (timeElapsed >= DURATION) {
            stopTest();
        } else {
            updateCPS();
        }
    }, 100);
}


function stopTest(): void {
    if (timer !== null) {
        clearInterval(timer);
        timer = null;
    }

    clickButton.textContent = '3.0 秒后可用';
    clickButton.disabled = true;

    let countdown: number = 3.0;
    const countdownInterval: number = window.setInterval((): void => {
        countdown -= 0.1;
        clickButton.textContent = `${countdown.toFixed(1)} 秒后可用`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            clickButton.textContent = '开始测试';
            clickButton.disabled = false;
        }
    }, 100);

    const finalCPS = clicks / DURATION;
    cpsDisplay.textContent = `最终 CPS：${finalCPS.toFixed(2)}`;
    timerDisplay.textContent = '时间：0.0 秒';
}


function updateCPS(): void {
    const currentTime: number = Date.now();
    const elapsedTime: number = (currentTime - startTime) / 1000;
    const cps: string = elapsedTime > 0 ? (clicks / elapsedTime).toFixed(2) : '0.00';
    cpsDisplay.textContent = `CPS：${cps}`;
}


function createRipple(event: MouseEvent): void {
    const buttonRect: DOMRect = clickButton.getBoundingClientRect();
    const x: number = event.clientX - buttonRect.left;
    const y: number = event.clientY - buttonRect.top;

    const ripple = document.createElement('div');
    ripple.style.position = 'absolute';
    ripple.style.left = `${x - 50}px`;
    ripple.style.top = `${y - 50}px`;
    ripple.style.width = '100px';
    ripple.style.height = '100px';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'scale(0)';
    ripple.style.opacity = '1';
    ripple.style.transition = 'transform 0.5s, opacity 0.5s';
    ripple.style.pointerEvents = 'none'; // 防止干扰点击

    ripple.addEventListener('transitionend', (): void => {
        ripple.remove();
    });

    clickButton.appendChild(ripple);

    // 使用 requestAnimationFrame 确保过渡生效
    requestAnimationFrame((): void => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
    });
}
