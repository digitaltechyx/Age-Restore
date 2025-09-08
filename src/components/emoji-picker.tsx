"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Smile, Heart, Star, Sun, ThumbsUp, Zap, Sparkles, Rainbow } from "lucide-react";

// Categorized emojis for mood expression
const emojiCategories = {
  happy: {
    name: "Happy",
    icon: Smile,
    emojis: ["😊", "😄", "😃", "😁", "🤗", "😆", "😍", "🥰", "😘", "🤩", "😎", "🥳"]
  },
  love: {
    name: "Love",
    icon: Heart,
    emojis: ["❤️", "💕", "💖", "💗", "💝", "💘", "💞", "💓", "💟", "🧡", "💛", "💚"]
  },
  energy: {
    name: "Energy",
    icon: Zap,
    emojis: ["🔥", "⚡", "💪", "🚀", "⭐", "🌟", "✨", "💫", "🌈", "☀️", "🌞", "🌻"]
  },
  calm: {
    name: "Calm",
    icon: Sun,
    emojis: ["😌", "😇", "🙏", "🕊️", "🌸", "🌺", "🌿", "🍃", "🌊", "🌙", "⭐", "🌌"]
  },
  celebration: {
    name: "Celebration",
    icon: Sparkles,
    emojis: ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "👑", "💎", "🎯", "🎪", "🎨", "🎭"]
  },
  nature: {
    name: "Nature",
    icon: Rainbow,
    emojis: ["🌱", "🌳", "🌲", "🌵", "🌾", "🌷", "🌹", "🌻", "🌼", "🦋", "🐝", "🦋"]
  }
};

interface EmojiPickerProps {
  selectedEmoji: string | null;
  onEmojiSelect: (emoji: string | null) => void;
  className?: string;
}

export function EmojiPicker({ selectedEmoji, onEmojiSelect, className = "" }: EmojiPickerProps) {
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof emojiCategories>("happy");

  const handleEmojiClick = (emoji: string) => {
    if (selectedEmoji === emoji) {
      // If clicking the same emoji, deselect it
      onEmojiSelect(null);
    } else {
      onEmojiSelect(emoji);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-headline flex items-center gap-2">
          <span>How do you feel today?</span>
          {selectedEmoji && (
            <Badge variant="secondary" className="text-lg">
              {selectedEmoji}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Category Selection */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(emojiCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key as keyof typeof emojiCategories)}
                className="flex items-center gap-2"
              >
                <IconComponent className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Emoji Grid */}
        <div className="grid grid-cols-6 gap-2">
          {emojiCategories[selectedCategory].emojis.map((emoji, index) => (
            <Button
              key={index}
              variant={selectedEmoji === emoji ? "default" : "ghost"}
              size="sm"
              onClick={() => handleEmojiClick(emoji)}
              className="h-12 w-12 text-2xl hover:scale-110 transition-transform"
            >
              {emoji}
            </Button>
          ))}
        </div>

        {/* Clear Selection */}
        {selectedEmoji && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEmojiSelect(null)}
              className="text-muted-foreground"
            >
              Clear Selection
            </Button>
          </div>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground">
          <p>Select an emoji that best represents your mood today</p>
          <p className="text-xs mt-1">Click the same emoji again to deselect</p>
        </div>
      </CardContent>
    </Card>
  );
}

// Quick emoji picker for compact use
export function QuickEmojiPicker({ selectedEmoji, onEmojiSelect }: EmojiPickerProps) {
  const quickEmojis = ["😊", "❤️", "🔥", "😌", "🎉", "🌱", "😄", "💪", "🙏", "⭐"];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Quick Mood Selection:</label>
      <div className="flex flex-wrap gap-2">
        {quickEmojis.map((emoji, index) => (
          <Button
            key={index}
            variant={selectedEmoji === emoji ? "default" : "outline"}
            size="sm"
            onClick={() => onEmojiSelect(selectedEmoji === emoji ? null : emoji)}
            className="h-10 w-10 text-lg hover:scale-110 transition-transform"
          >
            {emoji}
          </Button>
        ))}
        {selectedEmoji && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEmojiSelect(null)}
            className="h-10 text-muted-foreground"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
}
