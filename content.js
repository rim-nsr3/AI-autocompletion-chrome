function init() {
    // More comprehensive selector
    const inputs = document.querySelectorAll('textarea, input[type="text"], div[contenteditable="true"], [role="textbox"]');
    console.log('Found elements:', inputs.length);
    console.log('Elements:', inputs); // Log the actual elements
  
    inputs.forEach(input => {
      setupTextArea(input);
    });
  }
  
  function setupTextArea(textarea) {
    console.log('Setting up element:', textarea);
    
    const ghost = document.createElement('div');
    ghost.style.cssText = `
      position: absolute;
      pointer-events: none;
      opacity: 0.5;
      color: gray;
      background: transparent;
      z-index: 999999;
      font-family: inherit;
      padding: inherit;
    `;
    
    updateGhostPosition(textarea, ghost);
    document.body.appendChild(ghost);
    
    // Add both input and keydown handlers
    textarea.addEventListener('input', (e) => handleInput(e, ghost));
    textarea.addEventListener('keydown', (e) => handleKeyDown(e, ghost));
  }
  
  function updateGhostPosition(textarea, ghost) {
    const rect = textarea.getBoundingClientRect();
    console.log('Element position:', rect); // Debug position
    ghost.style.top = `${rect.top + window.scrollY}px`;
    ghost.style.left = `${rect.left + window.scrollX}px`;
    ghost.style.width = `${rect.width}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.font = window.getComputedStyle(textarea).font;
  }
  
  function handleInput(event, ghost) {
    console.log('Handling input');
    const textarea = event.target;
    
    // Clear timeout if it exists
    if (textarea.timeout) {
      clearTimeout(textarea.timeout);
    }
  
    // Add a small delay to avoid completing on every keystroke
    textarea.timeout = setTimeout(() => {
      // Simple mock completions based on common phrases
      const text = textarea.value.toLowerCase();
      let completion = '';
  
      if (text.includes('hi my name is')) {
        completion = ' and I am a software engineer';
      } else if (text.includes('i am')) {
        completion = ' excited to share that...';
      } else if (text.includes('thank')) {
        completion = ' you for your time and consideration';
      } else if (text.includes('please')) {
        completion = ' let me know if you have any questions';
      } else if (text.includes('i would')) {
        completion = ' like to discuss this opportunity';
      } else if (text.endsWith('?')) {
        completion = ' I appreciate your response in advance.';
      } else if (text.length > 5) {
        // Default completion if nothing else matches
        completion = '... (I can help you complete this sentence)';
      }
  
      ghost.textContent = textarea.value + completion;
      console.log('Set ghost text to:', ghost.textContent);
    }, 500); // 500ms delay
  }

  function handleKeyDown(event, ghost) {
    if (event.key === 'Tab' && ghost.textContent) {
      // Prevent default tab behavior
      event.preventDefault();
      
      // Set the textarea value to include the completion
      const textarea = event.target;
      textarea.value = ghost.textContent;
      
      // Clear the ghost text
      ghost.textContent = '';
      
      console.log('Completion accepted:', textarea.value);
    }
  }
  
  // Run on multiple events to ensure we catch the elements
  init();
  document.addEventListener('DOMContentLoaded', init);
  window.addEventListener('load', init);
  
  // Also run periodically for dynamically loaded elements
  setInterval(init, 2000);