import React from 'react';

function BackToTopButton() {
    // Custom smooth scroll function
    const scrollToTop = () => {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      
      if (c > 0) {
        // Ease-in-out function. Adjust the constants for different easing effects.
        const easeInOutQuad = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        // Duration of the scroll animation in milliseconds
        const duration = 2500; 
        let start: number | null = null;
  
        // The step function will be called every time a frame is ready
        const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            const easeVal = easeInOutQuad(percent);

            window.scrollTo(0, c - c * easeVal);

            if (progress < duration) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
      }
    };
  
    return (
      <button onClick={scrollToTop}className='topbutton'>
       <h3> ↑ BACK TO TOP ↑ </h3>
      </button>
    );
  }
  
  // Add the existing buttonStyle here
  

export default BackToTopButton;