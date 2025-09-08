"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmojiPicker } from "@/components/emoji-picker";
import { GalleryGrid, GalleryPresets } from "@/components/gallery-grid";

export function EmojiDemo() {
  const [selectedEmoji, setSelectedEmoji] = useState<string | null>(null);
  const [emojiHistory, setEmojiHistory] = useState<string[]>([]);

  const handleEmojiSelect = (emoji: string | null) => {
    setSelectedEmoji(emoji);
    if (emoji) {
      setEmojiHistory(prev => [emoji, ...prev.slice(0, 7)]); // Keep last 8 emojis
    }
  };

  const clearHistory = () => {
    setEmojiHistory([]);
    setSelectedEmoji(null);
  };

  // Mock images with emojis for demo
  const mockImages = [
    { id: '1', imageUrl: 'https://picsum.photos/400/400?random=1', uploadDate: '2024-01-15', moodEmoji: '😊', moodText: 'Feeling happy today!', dayNumber: 1 },
    { id: '2', imageUrl: 'https://picsum.photos/400/400?random=2', uploadDate: '2024-01-16', moodEmoji: '🔥', moodText: 'Full of energy!', dayNumber: 2 },
    { id: '3', imageUrl: 'https://picsum.photos/400/400?random=3', uploadDate: '2024-01-17', moodEmoji: '❤️', moodText: 'Feeling loved', dayNumber: 3 },
    { id: '4', imageUrl: 'https://picsum.photos/400/400?random=4', uploadDate: '2024-01-18', moodEmoji: '💪', moodText: 'Strong and motivated', dayNumber: 4 },
    { id: '5', imageUrl: 'https://picsum.photos/400/400?random=5', uploadDate: '2024-01-19', moodEmoji: '🎉', moodText: 'Celebrating!', dayNumber: 5 },
    { id: '6', imageUrl: 'https://picsum.photos/400/400?random=6', uploadDate: '2024-01-20', moodEmoji: '😌', moodText: 'Peaceful and calm', dayNumber: 6 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Emoji Mood Selection Demo</CardTitle>
          <CardDescription>
            Users can now select emojis to express their mood when uploading photos. 
            Emojis appear as badges on gallery images for quick visual mood recognition.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Emoji Picker Demo */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Try the Emoji Picker:</h3>
            <EmojiPicker
              selectedEmoji={selectedEmoji}
              onEmojiSelect={handleEmojiSelect}
            />
            
            {/* Selected Emoji Display */}
            {selectedEmoji && (
              <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-4xl">{selectedEmoji}</div>
                <div>
                  <p className="font-medium text-green-800">Selected Mood Emoji</p>
                  <p className="text-sm text-green-600">This emoji will appear on your photo in the gallery</p>
                </div>
              </div>
            )}
          </div>

          {/* Emoji History */}
          {emojiHistory.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Recent Selections</h3>
                <Button variant="outline" size="sm" onClick={clearHistory}>
                  Clear History
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {emojiHistory.map((emoji, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEmoji(emoji)}
                    className="h-12 w-12 text-2xl hover:scale-110 transition-transform"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Gallery Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gallery Preview with Emojis</h3>
            <div className="border rounded-lg p-4 bg-gray-50">
              <GalleryGrid 
                images={mockImages}
                {...GalleryPresets.userDashboard}
                showMoodEmoji={true}
                showMoodText={true}
              />
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-3">✨ Emoji Features:</h4>
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">6 Categories</Badge>
                  <span>Happy, Love, Energy, Calm, Celebration, Nature</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">72 Emojis</Badge>
                  <span>Wide selection of mood expressions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Visual Badge</Badge>
                  <span>Emojis appear as badges on gallery images</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Quick Access</Badge>
                  <span>Easy one-click mood selection</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">Optional</Badge>
                  <span>Users can skip emoji selection if desired</span>
                </li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-800 mb-3">🎯 Benefits:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Instant visual mood recognition</li>
                <li>• No language barriers - universal emoji language</li>
                <li>• Quick and easy mood expression</li>
                <li>• Makes gallery more colorful and engaging</li>
                <li>• Complements text descriptions perfectly</li>
                <li>• Works great on mobile devices</li>
                <li>• Creates emotional connection at a glance</li>
              </ul>
            </div>
          </div>

          {/* Usage Instructions */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-medium text-purple-800 mb-3">📱 How to Use:</h4>
            <ol className="text-sm text-purple-700 space-y-2">
              <li><strong>1. Select Category:</strong> Choose from Happy, Love, Energy, Calm, Celebration, or Nature</li>
              <li><strong>2. Pick Emoji:</strong> Click on any emoji that represents your mood</li>
              <li><strong>3. Optional Text:</strong> Add additional thoughts if you want more detail</li>
              <li><strong>4. Upload Photo:</strong> Your emoji will be saved with your photo</li>
              <li><strong>5. View Gallery:</strong> See your emoji badge on the photo in your gallery</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
