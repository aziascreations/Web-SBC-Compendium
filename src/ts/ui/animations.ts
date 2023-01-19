import {AppScreen} from "./screens/base";

const animationStepCount = 10;

function getBezierBlend(progress: number): number {
    //return (3.0 - 2.0 * progress) * progress * progress;
    return (3 * progress ** 2) - (2 * progress ** 3);
}

export function fadeOut(element: HTMLElement, time: number = 200): Promise<void> {
    element.style.opacity = "1.0";
    element.hidden = false;
    
    return new Promise((resolve) => {
        const delay = time / animationStepCount;
        
        let i = 0;
        
        const intervalId = setInterval(() => {
            element.style.opacity = String(1 - getBezierBlend(i / animationStepCount));
            i++;
            
            if (i === animationStepCount) {
                element.style.opacity = "0.0";
                element.hidden = true;
                clearInterval(intervalId);
                resolve();
            }
        }, delay);
    });
}

export function fadeIn(element: HTMLElement, time: number = 200): Promise<void> {
    element.style.opacity = "0.0";
    element.hidden = false;
    
    return new Promise((resolve) => {
        const delay = time / animationStepCount;
        
        let i = 0;
        
        const intervalId = setInterval(() => {
            element.style.opacity = String(getBezierBlend(i / animationStepCount));
            i++;
            
            if (i === animationStepCount) {
                element.style.opacity = "1.0";
                clearInterval(intervalId);
                resolve();
            }
        }, delay);
    });
}