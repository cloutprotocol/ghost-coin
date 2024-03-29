import React from 'react';

function BackToTopButton() {
    const applyFilterToContent = (filterValue: string) => {
        // Select all sections you wish to apply the blur effect to
        document.querySelectorAll('canvas').forEach((element) => {
            (element as HTMLElement).style.filter = filterValue;
        });
    };

    const scrollToTop = () => {
        applyFilterToContent('blur(3px)'); // Apply blur filter at the start of scrolling
    
        let start: number | null = null;
        const duration = 2500; // Control the speed of the scroll here
        const startPosition = window.pageYOffset || document.documentElement.scrollTop;
    
        const easeInOutQuad = (time: number, start: number, distance: number, duration: number) => {
            time /= duration / 2;
            if (time < 1) return (distance / 2) * time * time + start;
            time--;
            return (-distance / 2) * (time * (time - 2) - 1) + start;
        };
    
        const scroll = (currentTime: number) => {
            if (start === null) start = currentTime;
            const timeElapsed = currentTime - start;
            const distance = -startPosition;
            const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        
            window.scrollTo(0, run);
        
            if (timeElapsed < duration) {
                window.requestAnimationFrame(scroll);
            } else {
                // Direct removal of the blur effect after the animation has presumably ended
                applyFilterToContent('none');
            }
        };
        
    
        window.requestAnimationFrame(scroll);
    };
    

    return (
        <button onClick={scrollToTop} className="topbutton">
            <h3>↑ BACK TO TOP ↑</h3>
        </button>
    );
}

export default BackToTopButton;
