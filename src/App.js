import { createChat } from "@n8n/chat"; // Restore import
import "@n8n/chat/style.css"; // Restore import
import { useEffect, useRef, useState } from "react";
import "./App.css";
import UniversityCard from "./components/UniversityCard"; // Import UniversityCard
import ChatButton from "./components/ChatButton"; // Restore import

import universities from "./data/universities.json";

function App() {
  const chatRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm); // State for debounced search term
  const [filteredUniversities, setFilteredUniversities] =
    useState(universities);
  // Initialize with null to avoid hydration mismatch
  const [isMobile, setIsMobile] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // Restore state
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

  // Debounced resize handler
  useEffect(() => {
    let resizeTimeout;
    const debouncedCheckIfMobile = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        checkIfMobile();
      }, 300); // 300ms delay
    };

    window.addEventListener("resize", debouncedCheckIfMobile);

    // Cleanup function to remove listener and clear timeout
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedCheckIfMobile);
    };
  }, []); // Empty dependency array ensures this runs only on mount and unmount

  // Toggle chat visibility on mobile
  const toggleChat = () => {
    // Restore function
    // Simply toggle the state to show/hide the chat container
    setIsChatOpen(!isChatOpen);
  };

  // Restore useEffect for createChat
  useEffect(() => {
    // Only create chat if isMobile is not null (after initial mount)
    if (chatRef.current && isMobile !== null) {
      // Unmount previous instance if it exists
      if (chatInstance.current) {
        chatInstance.current.unmount();
      }

      // Use the last known working webhook URL
      const chat = createChat({
        webhookUrl:
          "https://ianyian.app.n8n.cloud/webhook/a0d63d1d-babd-4513-95ee-c8c82130118f/chat",
        target: chatRef.current,
        theme: "light",
        mode: "fullscreen", // Always use fullscreen mode
        initialOpen: true, // Always open initially
        showLauncher: false, // We'll use our custom launcher
        showWelcomeScreen: false, // Explicitly set to false
        defaultMessages: {
          systemMessage:
            "You are Andy, a helpful assistant for university information.",
          // welcomeMessage: "My name is Andy. How can I assist you today?", // Keep welcome message commented out
        },
        customStyles: {
          // No custom styles needed here if showWelcomeScreen works
        },
        initialMessages: [], // Keep this, might still be relevant
      });

      chatInstance.current = chat;

      // Set initial chat open state based on mobile status
      setIsChatOpen(!isMobile);

      return () => {
        // Ensure chat.unmount is called if chat exists
        if (chatInstance.current) {
          chatInstance.current.unmount();
        }
      };
    }
    // Add chatInstance to dependency array? No, likely causes loop. Keep isMobile.
  }, [isMobile]);

  // Debounce search term effect
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    // Cleanup function to clear the timeout if searchTerm changes before delay finishes
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]); // Re-run effect only when searchTerm changes

  // Filter universities based on the debounced search term
  useEffect(() => {
    const filtered = universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        uni.location
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()) ||
        uni.popularCourses.some((course) =>
          course.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        )
    );
    setFilteredUniversities(filtered);
  }, [debouncedSearchTerm]); // Re-run effect only when debouncedSearchTerm changes

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
            // Restore dynamic class
            isMobile && !isChatOpen ? "chat-hidden" : ""
          }`}
          ref={chatRef}
          id='chat-embed-target' // Keep ID for now, though likely not needed by createChat
        ></div>
        {/* Only show the button on mobile */}
        {isMobile && (
          <ChatButton onClick={toggleChat} isOpen={isChatOpen} />
        )}{" "}
        {/* Restore button */}
      </main>
    </div>
  );
}

export default App;
