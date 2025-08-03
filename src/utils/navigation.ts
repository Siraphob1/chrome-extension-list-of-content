export const scrollToElement = async (elementId: string) => {
  try {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.scripting) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

      if (tab.id) {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          func: (id: string) => {
            const element = document.getElementById(id);
            if (element) {
              // Remove any existing highlights
              const existingHighlights = document.querySelectorAll('.content-lister-highlight');
              for (const el of existingHighlights) {
                el.classList.remove('content-lister-highlight');
                (el as HTMLElement).style.removeProperty('background-color');
                (el as HTMLElement).style.removeProperty('box-shadow');
                (el as HTMLElement).style.removeProperty('border-radius');
                (el as HTMLElement).style.removeProperty('transition');
              }

              // Scroll to the element
              element.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });

              // Add highlight with animation
              element.classList.add('content-lister-highlight');
              element.style.backgroundColor = '#ffeb3b';
              element.style.borderRadius = '8px';
              element.style.transition = 'all 0.3s ease';

              // Remove highlight after 1 second
              setTimeout(() => {
                element.style.transition = 'all 1s ease';
                element.style.backgroundColor = '';
                element.style.boxShadow = '';
                element.style.borderRadius = '';

                setTimeout(() => {
                  element.classList.remove('content-lister-highlight');
                  element.style.removeProperty('transition');
                }, 1000);
              }, 1000);
            }
          },
          args: [elementId]
        });
      }
    }
  } catch (error) {
    console.error('Error scrolling to element:', error);
  }
};
