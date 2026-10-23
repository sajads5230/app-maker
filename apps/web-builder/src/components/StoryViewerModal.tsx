"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, ChevronRight, ChevronLeft, Pause, Play, ExternalLink, Sparkles } from "lucide-react";

export interface StorySlide {
  id: string;
  imageUrl: string;
  title?: string;
  caption?: string;
  duration?: number; // seconds
  buttonText?: string;
  buttonLink?: string;
}

export interface StoryItem {
  id: string;
  title: string;
  badge?: string;
  imageUrl: string;
  unread?: boolean;
  slides?: StorySlide[];
}

interface StoryViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: StoryItem | null;
  allStories?: StoryItem[];
  onSelectStory?: (story: StoryItem) => void;
}

export function StoryViewerModal({
  isOpen,
  onClose,
  story,
  allStories = [],
  onSelectStory,
}: StoryViewerModalProps) {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<any>(null);

  // Fallback: If story has no slides array, create a rich slide using its title and imageUrl
  const slides: StorySlide[] = (story?.slides && story.slides.length > 0)
    ? story.slides
    : [
        {
          id: `${story?.id || "st"}_slide_1`,
          imageUrl: story?.imageUrl || "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=900&fit=crop",
          title: story?.title || "معرفی محصول جدید",
          caption: `بررسی جدیدترین قابلیت‌ها و جزئیات استوری ${story?.title || ""}. هم‌اکنون می‌توانید این کالا را با تخفیف ویژه تهیه کنید.`,
          duration: 5,
          buttonText: "مشاهده و خرید محصول",
          buttonLink: "/product",
        },
      ];

  const currentSlide = slides[currentSlideIndex] || slides[0];
  const slideDuration = (currentSlide?.duration || 5) * 1000;

  // Reset when story changes
  useEffect(() => {
    setCurrentSlideIndex(0);
    setProgress(0);
    setIsPaused(false);
  }, [story?.id]);

  // Slide Timer
  useEffect(() => {
    if (!isOpen || isPaused || !story) return;

    const intervalTime = 50; // update progress every 50ms
    const step = (intervalTime / slideDuration) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNextSlide();
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, currentSlideIndex, story?.id, slideDuration]);

  if (!isOpen || !story) return null;

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      // Find next story in allStories
      const currentStoryIndex = allStories.findIndex((s) => s.id === story.id);
      if (currentStoryIndex !== -1 && currentStoryIndex < allStories.length - 1 && onSelectStory) {
        onSelectStory(allStories[currentStoryIndex + 1]);
        setCurrentSlideIndex(0);
        setProgress(0);
      } else {
        onClose();
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
      setProgress(0);
    } else {
      // Find prev story in allStories
      const currentStoryIndex = allStories.findIndex((s) => s.id === story.id);
      if (currentStoryIndex > 0 && onSelectStory) {
        onSelectStory(allStories[currentStoryIndex - 1]);
        setCurrentSlideIndex(0);
        setProgress(0);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 select-none">
      {/* Phone Mockup Frame */}
      <div
        className="relative w-full max-w-sm h-full sm:h-[88vh] sm:rounded-3xl overflow-hidden bg-slate-950 flex flex-col shadow-2xl border border-white/10"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars (Segmented by Slides) */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {slides.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden backdrop-blur-xs">
              <div
                className="h-full bg-white transition-all ease-linear"
                style={{
                  width:
                    idx < currentSlideIndex
                      ? "100%"
                      : idx === currentSlideIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header (Sender Avatar, Title, Controls) */}
        <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow-md">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-rose-500 via-amber-500 to-pink-500 shrink-0">
              <img
                src={story.imageUrl}
                alt=""
                className="w-full h-full rounded-full object-cover border border-white/50"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black">{story.title}</span>
                {story.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500 text-white font-bold">
                    {story.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-white/80 block">اسلاید {currentSlideIndex + 1} از {slides.length}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsPaused((prev) => !prev);
              }}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition cursor-pointer"
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slide Media (Background Image) */}
        <div className="relative w-full h-full flex-1 overflow-hidden">
          <img
            src={currentSlide?.imageUrl}
            alt=""
            className="w-full h-full object-cover transition-all duration-300"
          />

          {/* Left/Right Tap Zones for Next/Prev Navigation */}
          <div
            onClick={handlePrevSlide}
            className="absolute inset-y-0 left-0 w-1/3 z-20 cursor-pointer"
            title="اسلاید قبلی"
          />
          <div
            onClick={handleNextSlide}
            className="absolute inset-y-0 right-0 w-1/3 z-20 cursor-pointer"
            title="اسلاید بعدی"
          />

          {/* Dark gradient for readable text at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/50 to-transparent z-10 pointer-events-none" />

          {/* Slide Text Content & Call To Action Button */}
          <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 z-20 space-y-3 text-white">
            {currentSlide?.title && (
              <h3 className="text-base sm:text-lg font-black leading-snug drop-shadow-md">
                {currentSlide.title}
              </h3>
            )}
            {currentSlide?.caption && (
              <p className="text-xs text-white/90 leading-relaxed drop-shadow-sm line-clamp-3">
                {currentSlide.caption}
              </p>
            )}

            {/* CTA Button */}
            {currentSlide?.buttonText && (
              <a
                href={currentSlide.buttonLink || "#"}
                onClick={(e) => {
                  if (!currentSlide.buttonLink || currentSlide.buttonLink === "#") {
                    e.preventDefault();
                    onClose();
                  }
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-900/40 transition-transform active:scale-95"
              >
                <span>{currentSlide.buttonText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
