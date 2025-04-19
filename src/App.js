import { createChat } from "@n8n/chat";
import "@n8n/chat/style.css";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const sampleUniversities = [
  {
    name: "University of Malaya",
    location: "Kuala Lumpur",
    popularCourses: ["Medicine", "Engineering", "Law"],
    tuitionRange: "RM 20,000 - RM 40,000",
    ranking: "Top 1 in Malaysia",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/University_of_Malaya_logo.svg/1200px-University_of_Malaya_logo.svg.png",
  },
  {
    name: "Universiti Putra Malaysia",
    location: "Serdang",
    popularCourses: ["Agriculture", "Computer Science", "Business"],
    tuitionRange: "RM 15,000 - RM 35,000",
    ranking: "Top 3 in Malaysia",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Universiti_Putra_Malaysia_logo.svg/1200px-Universiti_Putra_Malaysia_logo.svg.png",
  },
  {
    name: "Universiti Teknologi Malaysia",
    location: "Skudai",
    popularCourses: ["Engineering", "Architecture", "Science"],
    tuitionRange: "RM 18,000 - RM 38,000",
    ranking: "Top 2 in Malaysia",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Universiti_Teknologi_Malaysia_logo.svg/1200px-Universiti_Teknologi_Malaysia_logo.svg.png",
  },
  {
    name: "Taylor's University",
    location: "Subang Jaya",
    popularCourses: ["Business", "Hospitality", "Design"],
    tuitionRange: "RM 25,000 - RM 50,000",
    ranking: "Top Private University",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/Taylor%27s_University_logo.svg/1200px-Taylor%27s_University_logo.svg.png",
  },
  {
    name: "Monash University Malaysia",
    location: "Bandar Sunway",
    popularCourses: ["Medicine", "Engineering", "Business"],
    tuitionRange: "RM 30,000 - RM 55,000",
    ranking: "International Branch Campus",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3a/Monash_University_logo.svg/1200px-Monash_University_logo.svg.png",
  },
];

function UniversityCard({ university }) {
  return (
    <div className='university-card'>
      <img
        src={university.imageUrl}
        alt={university.name}
        className='university-logo'
      />
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

function App() {
  const chatRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUniversities, setFilteredUniversities] =
    useState(sampleUniversities);

  useEffect(() => {
    if (chatRef.current) {
      const chat = createChat({
        webhookUrl:
          "https://ianyian.app.n8n.cloud/webhook/99021e28-caeb-440d-880f-d600c8e37bed/chat",
        target: chatRef.current,
        theme: "light",
      });
      return () => {
        chat.unmount();
      };
    }
  }, []);

  useEffect(() => {
    const filtered = sampleUniversities.filter(
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
        <aside className='chat-sidebar' ref={chatRef}></aside>
      </main>
    </div>
  );
}

export default App;
