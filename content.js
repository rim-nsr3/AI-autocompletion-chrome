const GROQ_API_KEY = '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';

async function getGroqCompletion(text) {
    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "system",
                    content: "You are an autocomplete assistant. Provide very short, natural word completions. Complete only the current word or add 1-2 relevant next words maximum. No full sentences, no explanations."
                }, {
                    role: "user",
                    content: `Complete this text with just 1-2 words naturally, don't repeat the letter already written down: ${text}. If there is a '.' or '?' or '!', start the sentence with caps only for the first letter.`
                }],
                max_tokens: 20,
                temperature: 0.7,
                stop: ["\n", ".", "!", "?"]
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('API Error Details:', errorData);
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (data.choices && data.choices[0]?.message?.content) {
            return data.choices[0].message.content;
        }
        return null;
    } catch (error) {
        console.error('Groq API error:', error);
        return null;
    }
}

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

    textarea.addEventListener('input', (e) => {
        handleInput(e, ghost);
        updateGhostPosition(textarea, ghost);
    });
    textarea.addEventListener('keydown', (e) => handleKeyDown(e, ghost));
}

function updateGhostPosition(textarea, ghost) {
    const rect = textarea.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(textarea);
    const text = textarea.value;

    const span = document.createElement('span');
    span.style.font = computedStyle.font;
    span.style.fontSize = computedStyle.fontSize;
    span.style.whiteSpace = 'pre';
    span.textContent = text;
    span.style.visibility = 'hidden';
    document.body.appendChild(span);

    const textWidth = span.getBoundingClientRect().width;
    document.body.removeChild(span);

    ghost.style.top = `${rect.top + window.scrollY}px`;
    ghost.style.left = `${rect.left + window.scrollX + textWidth}px`;
    ghost.style.height = `${rect.height}px`;
    ghost.style.padding = computedStyle.padding;
    ghost.style.font = computedStyle.font;
    ghost.style.lineHeight = computedStyle.lineHeight;
}

async function handleInput(event, ghost) {
    console.log('Handling input');
    const textarea = event.target;

    if (textarea.timeout) {
        clearTimeout(textarea.timeout);
    }

    textarea.timeout = setTimeout(async () => {
        const text = textarea.value;
        if (text.length > 5) {
            const completion = await getGroqCompletion(text);
            if (completion) {
                // Only show the new part of the completion
                const nonOverlappingCompletion = completion.replace(text, '').trim();
                ghost.textContent = nonOverlappingCompletion;
                updateGhostPosition(textarea, ghost);
            }
        }
    }, 500);
}

function handleKeyDown(event, ghost) {
    if (event.key === 'Tab' && ghost.textContent) {
        event.preventDefault();
        const textarea = event.target;
        textarea.value = textarea.value + ghost.textContent;
        ghost.textContent = '';
        console.log('Completion accepted:', textarea.value);
    }
}

// Initialize
init();
document.addEventListener('DOMContentLoaded', init);