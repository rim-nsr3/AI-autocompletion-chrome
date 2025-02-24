function init() {
    const inputs = document.querySelectorAll('textarea, input[type="text"], div[contenteditable="true"], [role="textbox"]');
    console.log('Found elements:', inputs.length);
    
    inputs.forEach(input => {
        if (!input.hasAttribute('data-input-id')) {
            const inputId = Math.random().toString(36).substr(2, 9);
            input.setAttribute('data-input-id', inputId);
            setupTextArea(input, inputId);
        }
    });
}

function updateGhostPosition(textarea, ghost) {
    const rect = textarea.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(textarea);
    const text = textarea.value;
    
    // Create a temporary span to measure text width
    const span = document.createElement('span');
    span.style.font = computedStyle.font;
    span.style.fontSize = computedStyle.fontSize;
    span.style.whiteSpace = 'pre';
    span.textContent = text;
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    
    // Calculate position based on text width
    const textWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);
    
    // Position ghost after the text
    ghost.style.top = `${rect.top + window.scrollY}px`;
    ghost.style.left = `${rect.left + window.scrollX + textWidth}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.padding = computedStyle.padding;
    ghost.style.font = computedStyle.font;
    ghost.style.lineHeight = computedStyle.lineHeight;
}

function setupTextArea(textarea, inputId) {
    console.log('Setting up element:', textarea);
    
    const ghost = document.createElement('div');
    ghost.setAttribute('data-ghost', 'true');
    ghost.setAttribute('data-for', inputId);
    ghost.style.cssText = `
        position: absolute;
        pointer-events: none;
        opacity: 0.5;
        color: gray;
        background: transparent;
        z-index: 999999;
        font-family: inherit;
        white-space: pre;
        overflow: hidden;
        padding: inherit;
    `;
    
    updateGhostPosition(textarea, ghost);
    document.body.appendChild(ghost);
    
    // Update ghost position on input
    textarea.addEventListener('input', (e) => {
        handleInput(e, ghost);
        updateGhostPosition(textarea, ghost);
    });
    textarea.addEventListener('keydown', (e) => handleKeyDown(e, ghost));
}

function handleInput(event, ghost) {
    console.log('Handling input');
    const textarea = event.target;
    
    const text = textarea.value.toLowerCase();
    let completion = '';

    if (text.includes('hi my name is')) {
        completion = 'and I am a software engineer';  // Removed the space at start
    } else if (text.includes('i am')) {
        completion = 'excited to share that...';
    } else if (text.includes('thank')) {
        completion = 'you for your time and consideration';
    } else if (text.includes('please')) {
        completion = 'let me know if you have any questions';
    } else if (text.includes('i would')) {
        completion = 'like to discuss this opportunity';
    } else if (text.endsWith('?')) {
        completion = 'I appreciate your response in advance.';
    } else if (text.length > 5) {
        completion = '... (I can help you complete this sentence)';
    }

    // Only show the completion part, not the full text
    ghost.textContent = completion;
    
    // Position the ghost text right after the cursor
    const computedStyle = window.getComputedStyle(textarea);
    ghost.style.lineHeight = computedStyle.lineHeight;
    ghost.style.fontSize = computedStyle.fontSize;
    ghost.style.paddingLeft = computedStyle.paddingLeft;
    ghost.style.fontFamily = computedStyle.fontFamily;
    
    console.log('Set ghost text to:', ghost.textContent);
}

function handleKeyDown(event, ghost) {
    if (event.key === 'Tab' && ghost.textContent) {
        event.preventDefault();
        const textarea = event.target;
        textarea.value = textarea.value + ghost.textContent;  // Append only the completion
        ghost.textContent = '';
        console.log('Completion accepted:', textarea.value);
    }
}

// Initialize
init();
document.addEventListener('DOMContentLoaded', init);