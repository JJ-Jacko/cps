import {
    DURATION,
    clickButton,
    displayCPS,
    displayTime,
} from "./constants";
import type { ProgramStatus } from "./datas";


let timer: number | null = null;
let startTime: number = 0;
let clicks: number = 0;
let timeElapsed: number = 0;
let programStatus: ProgramStatus;

function startTest(): void {
    clicks = 0;
    timeElapsed = 0;
    startTime = Date.now();
    clickButton.textContent = 'Click me';

    timer = window.setInterval((): void => {
        timeElapsed = (Date.now() - startTime) / 1000;
        const remainingTime = DURATION - timeElapsed;
        displayTime.textContent = `Remain time: ${remainingTime.toFixed(1)} s`;

        if (timeElapsed >= DURATION) {
            stopTest();
            programStatus = 'Cooldown';
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

    clickButton.textContent = 'Available after 3.0 s';
    clickButton.disabled = true;

    let countdown: number = 3.0;
    const countdownInterval: number = window.setInterval((): void => {
        countdown -= 0.1;
        clickButton.textContent = `Available after ${countdown.toFixed(1)} s`;

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            clickButton.textContent = 'Click to start';
            clickButton.disabled = false;
            programStatus = 'Ready';
        }
    }, 100);

    const finalCPS = clicks / DURATION;
    displayCPS.textContent = `Final CPS: ${finalCPS.toFixed(2)}`;
    timerDisplayReset();
}

function updateCPS(): void {
    const currentTime: number = Date.now();
    const elapsedTime: number = (currentTime - startTime) / 1000;
    const cps: string = elapsedTime > 0 ? (clicks / elapsedTime).toFixed(2) : '0.00';
    displayCPS.textContent = `CPS: ${cps}`;
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
    ripple.style.pointerEvents = 'none'; // Preventing click interference.

    ripple.addEventListener('transitionend', (): void => {
        ripple.remove();
    });

    clickButton.appendChild(ripple);

    // Makesure the transition takes effect.
    requestAnimationFrame((): void => {
        ripple.style.transform = 'scale(2)';
        ripple.style.opacity = '0';
    });
}

function timerDisplayReset() {
    displayTime.textContent = `Remain time: ${DURATION.toFixed(1)} s`;
}

document.addEventListener('DOMContentLoaded', () => {
    clickButton.textContent = 'Click to start';
    displayCPS.textContent = 'CPS: 0.00';
    timerDisplayReset();
    programStatus = 'Ready';
});

clickButton.addEventListener('click', (event: MouseEvent): void => {
    if (programStatus === 'Ready') {
        programStatus = 'Recording';
        startTest();
    } else if (programStatus === 'Recording') {
        clicks++;
        updateCPS();
        createRipple(event);
    }
});
