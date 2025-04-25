import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import { useEffect, useRef, useState } from "react";
import "./App.css";

import universities from "./data/universities.json";

function UniversityCard({ university }) {
  const [imageError, setImageError] = useState(false);

  // Function to handle image load errors
  const handleImageError = () => {
    setImageError(true);
  };

  // Extract first letters of university name for fallback display
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className='university-card'>
      {!imageError ? (
        <img
          src={`${process.env.PUBLIC_URL}/${university.imageUrl}`}
          alt={university.name}
          className='university-logo'
          onError={handleImageError}
        />
      ) : (
        <div className='university-logo-fallback'>
          {getInitials(university.name)}
        </div>
      )}
      <h3>{university.name}</h3>
      <p>
        <strong>Location:</strong> {university.location}
      </p>
      <p>
        <strong>Popular Courses:</strong> {university.popularCourses.join(", ")}
      </p>
      <p>
        <strong>Tuition Range:</strong> {university.tuitionRange}
      </p>
      <p>
        <strong>Ranking:</strong> {university.ranking}
      </p>
    </div>
  );
}

// Chat button component for mobile view
function ChatButton({ onClick, isOpen }) {
  // Inline styles to ensure visibility
  const buttonStyle = {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "65px",
    height: "65px",
    borderRadius: "50%",
    backgroundColor: isOpen ? "#e53e3e" : "#4299e1",
    color: "white",
    border: "none",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    cursor: "pointer",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const svgStyle = {
    width: "30px",
    height: "30px",
    strokeWidth: 2.5,
  };

  return (
    <button
      style={buttonStyle}
      onClick={onClick}
      aria-label={isOpen ? "Close chat" : "Open chat"}
      className='mobile-chat-button' // Just for identification
    >
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        style={svgStyle}
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

function App() {
  const chatRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUniversities, setFilteredUniversities] =
    useState(universities);
  // Initialize with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatInstance = useRef(null);

  // Function to check if device is mobile
  const checkIfMobile = () => {
    // Check for a URL parameter to force mobile mode for testing
    const urlParams = new URLSearchParams(window.location.search);
    const forceMobile = urlParams.get("mobile") === "true";

    // Set mobile mode if screen width is small or if forced via URL parameter
    setIsMobile(forceMobile || window.innerWidth <= 768);
  };

  // Initialize isMobile state after component mount
  useEffect(() => {
    checkIfMobile();
  }, []);

  // Listen for window resize events
  useEffect(() => {
    window.addEventListener("resize", checkIfMobile);
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Toggle chat visibility on mobile
  const toggleChat = () => {
    // Simply toggle the state to show/hide the chat container
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    // Only create chat if isMobile is not null (after initial mount)
    if (chatRef.current && isMobile !== null) {
      // Unmount previous instance if it exists
      if (chatInstance.current) {
        chatInstance.current.unmount();
      }

      const chat = createChat({
        webhookUrl:
          "https://ianyian.app.n8n.cloud/webhook/3e707cbc-b9c2-44f2-9554-735352b7badc/chat",
        target: chatRef.current,
        theme: "light",
        mode: "fullscreen", // Always use fullscreen mode
        initialOpen: true, // Always open initially
        showLauncher: false, // We'll use our custom launcher
        defaultMessages: {
          systemMessage:
            "You are Andy, a helpful assistant for university information.",
          welcomeMessage: "My name is Andy. How can I assist you today?",
        },
        customStyles: {
          chatHeader: {
            title: "Andy - University Assistant",
          },
        },
      });

      chatInstance.current = chat;

      // Set initial chat open state based on mobile status
      setIsChatOpen(!isMobile);

      return () => {
        chat.unmount();
      };
    }
  }, [isMobile]);

  useEffect(() => {
    const filtered = universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uni.popularCourses.some((course) =>
          course.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredUniversities(filtered);
  }, [searchTerm]);

  return (
    <div className='App'>
      <header className='header'>
        <h1>Learning Agent - Find Your University in Malaysia</h1>
      </header>
      <main className='main-content'>
        <section className='search-section'>
          <input
            type='text'
            placeholder='Search by university, location or course...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='search-input'
          />
          <div className='university-list'>
            {filteredUniversities.length > 0 ? (
              filteredUniversities.map((uni) => (
                <UniversityCard key={uni.name} university={uni} />
              ))
            ) : (
              <p>No universities found matching your search.</p>
            )}
          </div>
        </section>
        <div
          className={`chat-container ${
            isMobile && !isChatOpen ? "chat-hidden" : ""
          }`}
          ref={chatRef}
        ></div>
        {/* Only show the button on mobile */}
        {isMobile && <ChatButton onClick={toggleChat} isOpen={isChatOpen} />}
      </main>
    </div>
  );
}

export default App;
