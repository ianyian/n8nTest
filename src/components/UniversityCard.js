import React, { useState } from "react"; // Added React import

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

export default UniversityCard; // Added default export
