"use client";
import { useState } from "react";


export default function AddMemory() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [isTopicSelected, setIsTopicSelected] = useState(false);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [successMessage, setSuccessMessage] = useState("");


  const topics = [
    "Travel",
    "Family",
    "Friends",
    "Work",
    "Hobbies",
    "Birthday",
    "Anniversaries",
    "Graduation",
    "Holiday",
    "Special Person",
  ];

const suggestions: Record<string, string[]> = {
    Travel: [
      "My favorite place from the trip",
      "A memorable travel experience",
      "A funny travel story",
    ],
    Family: [
      "A cherished family moment",
      "A family tradition",
      "A family gathering or reunion",
    ],
    Friends: [
      "A memorable moment with friends",
      "A funny story with friends",
      "A special friendship memory",
    ],
    Work: [
      "A proud work achievement",
      "A memorable work event",
      "A funny work story",
    ],
    Hobbies: [
      "A hobby I enjoy",
      "A memorable hobby experience",
      "A funny hobby story",
    ],
    Birthday: [
      "A memorable birthday celebration",
      "A funny birthday story",
      "A special birthday gift",
    ],
    Anniversaries: [
      "A memorable anniversary celebration",
      "A funny anniversary story",
      "A special anniversary gift",
    ],
    Graduation: [
      "A memorable graduation moment",
      "A funny graduation story",
      "A special graduation gift",
    ],
    Holiday: [
      "A memorable holiday experience",
      "A funny holiday story",
      "A special holiday tradition",
    ],
    "Special Person": [
      "A memorable moment with a special person",
      "A funny story involving a special person",
      "A special gift or gesture for a special person",
    ],
  };


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const imageUrls = Array.from(files).map((file) => 
        URL.createObjectURL(file)
      );

      setImagePreviews((currentImages) => [
        ...currentImages,
        ...imageUrls,
      ]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImagePreviews((currentImage) =>
      currentImage.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/memories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          topic,
          description,
        }),
      });

      const data = await response.json();

      if(!response.ok) {
        throw new Error(data.message || "Failed to save memory");
      }

      console.log("Memory saved successfully:", data);

      setSuccessMessage("Memory saved successfully!");
      setTitle("");
      setTopic("");
      setDescription("");
      setImagePreviews([]);
      setTimeout(() => {
        setSuccessMessage("");
      }, 4000);
    } catch (error) {
      console.error("Error saving memory:", error);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#F3EDE1] flex items-center justify-center px-6 py-12">
    {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-[#65755B] text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <span className="text-xl">✓</span>
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      <div className="w-full max-w-3xl bg-[#FFFDF7] rounded-2xl shadow-md p-10 md:p-12 border border-[#D8CCB8]">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-center text-[#3F4D3A]">
          Add a New Memory
        </h1>

        <p className="text-center text-[#A65D52] mt-3 mb-10 text-lg">
          Capture a special moment to remember
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-3 text-xl font-serif font-semibold text-[#403D35]">
              Memory Title
            </label>

            <input
              type="text"
              placeholder="Example: Our trip to Japan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-[#D8CCB8] rounded-xl p-4 text-base bg-[#FAF7F0] text-[#403D35] focus:outline-none focus:ring-2 focus:ring-[#65755B]"
            />
          </div>

        <div>
          <label className="block mb-3 text-xl font-serif font-semibold text-[#403D35]">
            Topic
          </label>


          <div className="relative">
            <button
              type="button"
              onClick={() => setIsTopicSelected(!isTopicSelected)}
              className="w-full border border-[#D8CCB8] rounded-xl p-4 text-base bg-[#FAF7F0] text-[#403D35] text-left transition duration-200 hover:bg-[#F3EDE1] hover:border-[#A9A08F] focus:outline-none focus:ring-2 focus:ring-[#65755B] cursor-pointer flex items-center justify-between"
            >
              <span className="font-serif text-base text-[#403D35]">
                {topic || "Select a topic"}
              </span>
              
              <span className={`transition-transform duration-200 ${isTopicSelected ? "rotate-180" : ""}`}>
                  ▼

              </span>
            </button>
            {isTopicSelected && (
              <div className="font-serif text-base text-[#403D35] absolute z-10 mt-2 w-full bg-[#FAF7F0] border border-[#D8CCB8] rounded-xl shadow-lg">
                {topics.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setTopic(t);
                      setIsTopicSelected(false);
                    }}
                    className="w-full text-left px-4 py-2 text-base text-[#403D35] hover:bg-[#E0D9C6] transition cursor-pointer"
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {topic && suggestions[topic] && (
            <div className="mt-4">
              <p className="mb-2 font-medium text-[#403D35]">
               💡Need some inspiration?
              </p>

              <div className="flex flex-wrap gap-2">
                {suggestions[topic].map((suggestion)=>(
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => setDescription(suggestion)}
                    className="border border-[#65755B] bg-[#65755B] rounded-lg px-4 py-2 text-sm text-[#FFFDF7] transition-all duration-200 ease-out hover:bg-[#526249] hover:-translate-y-1 hover:shadow-md cursor-pointer"
                    >
                    {suggestion}
                    </button>
                ))}
              </div>
            </div>
          )}
        </div>





          <div>
            <label className="block mb-3 text-xl font-serif font-semibold text-[#403D35]">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell us about this memory..."
              className="w-full border border-[#D8CCB8] rounded-xl p-4 text-base bg-[#FAF7F0] text-[#403D35] focus:outline-none focus:ring-2 focus:ring-[#65755B]"
            />
          </div>

          <div>
            <label className="block mb-3 text-xl font-serif font-semibold text-[#403D35]">
              Upload Photo
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="font-serif w-full border border-[#D8CCB8] rounded-xl p-4 text-base bg-[#FAF7F0] text-[#403D35] focus:outline-none focus:ring-2 focus:ring-[#65755B] cursor-pointer"
            />

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 font-medium">
                  Photo Previews
                </p>

                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Photo Preview ${index + 1}`}
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}            
          </div>

          <button
            type="submit"
            className="w-full bg-[#65755B] text-[#ffffff] py-4 rounded-xl text-lg font-medium hover:bg-[#83a171] transition cursor-pointer"
          >
            Save Memory
          </button>
        </form>
      </div>
    </main>
  );
}