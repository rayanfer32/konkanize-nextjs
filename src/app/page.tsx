"use client";

import { useState, useRef } from "react";
import { Popover } from "./components/Popover";
import { Card } from "./components/Card";
import { Textarea } from "./components/Textarea";

export default function AppUI() {
  const [lyrics, setLyrics] = useState("");
  const [translation, setTranslation] = useState("");
  const [hoveredWord, setHoveredWord] = useState("");
  const [wordTranslation, setWordTranslation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<any>(null);

  // Debounce the translation request to avoid too many API calls
  const handleWordHover = async (word: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (!word.trim() || word === hoveredWord) return;

    timeoutRef.current = setTimeout(async () => {
      setHoveredWord(word);
      setIsLoading(true);

      try {
        const response = await translateWord(word);
        setWordTranslation(response);
      } catch (error) {
        console.log("Failed to translate word");
        setWordTranslation(null);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  };

  // This function would call your translation API
  const translateWord = async (word: string): Promise<any> => {
    //TODO : create a type for the response
    // Replace this with your own translation API
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ word }),
    });
    return await response.json();
  };

  const renderPart = (heading, words) => {
    return (
      <div className="">
        <p className="text-lg font-semibold text-gray-800 mb-1">{heading}</p>
        <ul className="list-disc list-inside space-y-2">
          {words.map((word: string, index: number) => (
            <li key={index} className="text-gray-700 text-sm">
              {word}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTranslation = (translation: any | null) => {
    if (Object.keys(translation).length != 0) {
      return (
        <div className="flex flex-col gap-2">
          {Object.keys(translation).map((key) =>
            renderPart(key, translation[key])
          )}
        </div>
      );
    }
    return <p className="mb-1 text-gray-600">Defination not found!</p>;
  };

  const renderLyricsWithHover = () => {
    if (!lyrics) return null;

    return lyrics.split("\n").map((line, lineIndex) => (
      <div key={`line-${lineIndex}`} className="mb-2">
        {line
          .split(/\s+/)
          .filter((word) => word.length > 0)
          .map((word, wordIndex) => (
            <Popover
              key={`word-${lineIndex}-${wordIndex}`}
              trigger={
                <span
                  className="inline-block hover:bg-yellow-100 px-2 py-0.5 rounded cursor-pointer"
                  onMouseEnter={() => handleWordHover(word)}
                >
                  {word}
                </span>
              }
              content={
                isLoading && hoveredWord === word ? (
                  <div className="text-center">Loading...</div>
                ) : (
                  renderTranslation(wordTranslation)
                )
              }
              isOpen={hoveredWord === word}
            />
          ))
          .reduce((prev, curr, i) => {
            return i === 0 ? [curr] : [...prev, " ", curr];
          }, [] as any)}
      </div>
    ));
  };

  return (
    <>
      <h3 className="font-bold text-3xl text-center mt-5 text-blue-500 shadow-sm p-4">
        Konkanize
      </h3>
      <div className="p-8 mt-4 grid grid-cols-1 md:grid-cols-3 gap-6 dark">
        <Card className="p-4 text-gray-900 border-gray-200">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Original Lyrics</h2>
          </div>

          <Textarea
            placeholder="Enter lyrics in English here..."
            className="min-h-[640px] mb-4 text-gray-800 border-gray-200  placeholder:text-gray-400"
            value={lyrics}
            onChange={(e: any) => setLyrics(e.target.value)}
          />
        </Card>

        <Card className="p-4 text-gray-900 border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Word Lookup</h2>
          <div className="min-h-[640px] border border-gray-200 rounded-md p-4 max-h-[400px] overflow-auto text-gray-800">
            {renderLyricsWithHover()}
          </div>
        </Card>

        <Card className="p-4 text-gray-900 border-gray-200">
          <h2 className="text-xl font-semibold mb-3">Your Translation</h2>
          <Textarea
            placeholder="Write your translation here..."
            className="min-h-[640px] text-gray-800 border-gray-200 bg-white placeholder:text-gray-400"
            value={translation}
            onChange={(e: any) => setTranslation(e.target.value)}
            spellCheck={false}
          />
        </Card>
      </div>
    </>
  );
}
