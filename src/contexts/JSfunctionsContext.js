'use client'

// Define the functions
export function categoriesElementsFunction() {
    document.querySelectorAll('.tw-categories').forEach(categoriesElement => {
        //custom animation attributes can be added here

        categoriesElement.querySelectorAll('.tw-categories__expander').forEach(expander => {
            let content = expander.querySelector('.tw-categories__expander-content');
            const header = expander.querySelector('.tw-categories__expander-header');
            
            // Clean up existing event listeners if they exist
            if (expander._headerClickHandler && header) {
                header.removeEventListener('click', expander._headerClickHandler);
            }
            if (expander._keydownHandler) {
                expander.removeEventListener('keydown', expander._keydownHandler);
            }
            
            // Define event handlers as named functions
            const headerClickHandler = (event) => {
                if (event.target.classList.contains('tw-categories__expander-checkbox')) {
                    return;
                }
                if (expander.classList.toggle('tw-categories__expander--open')) {
                    content.style.height = content.scrollHeight + 'px';
                } else {
                    content.style.height = '0px';
                }
            };
            
            const keydownHandler = (event) => {
                if (event.key === 'Enter' && event.target === expander) {
                    expander.click();
                }
            };
            
            // Store references to handlers for cleanup on next call
            expander._headerClickHandler = headerClickHandler;
            expander._keydownHandler = keydownHandler;
            
            // Add event listeners
            header.addEventListener('click', headerClickHandler);
            expander.addEventListener('keydown', keydownHandler);
        });
    });
}

if (typeof window !== 'undefined') {
    Object.assign(window, {
        categoriesElementsFunction
    });
}