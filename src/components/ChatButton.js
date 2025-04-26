import React from "react"; // Added React import

// Chat button component for mobile view
function ChatButton({ onClick, isOpen }) {
  // Combine base class with active class conditionally
  const buttonClasses = `mobile-chat-button ${
    isOpen ? "chat-button-active" : ""
  }`;

  return (
    <button
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className={buttonClasses} // Use combined classes, removed inline style
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        // Removed inline style for SVG
        fill='none'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        {isOpen ? (
          // X icon when chat is open
          <>
            <line x1='18' y1='6' x2='6' y2='18'></line>
            <line x1='6' y1='6' x2='18' y2='18'></line>
          </>
        ) : (
          // Chat icon when chat is closed
          <>
            <path d='M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'></path>
          </>
        )}
      </svg>
    </button>
  );
}

export default ChatButton; // Added default export
