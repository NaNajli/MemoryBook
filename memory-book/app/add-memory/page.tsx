"use client";
import { useState } from "react";

export default function AddMemory() {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center">
          Add a New Memory
        </h1>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Capture a special moment to remember
        </p>

        <form className="space-y-6">
          <div>
            <label className="block mb-2 font-medium">
              Memory Title
            </label>

            <input
              type="text"
              placeholder="Example: Our trip to Japan"
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Tell us about this memory..."
              className="w-full border rounded-lg p-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Upload Photo
            </label>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="w-full border rounded-lg p-3"
              
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
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            Save Memory
          </button>
        </form>
      </div>
    </main>
  );
}