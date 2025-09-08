"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid, GalleryPresets } from "@/components/gallery-grid";

// Mock images for demonstration
const mockImages = [
  { id: '1', imageUrl: 'https://picsum.photos/400/600?random=1', uploadDate: '2024-01-15', fileName: 'portrait-1.jpg', moodText: 'Feeling grateful for this beautiful day!', moodEmoji: '😊', dayNumber: 1 },
  { id: '2', imageUrl: 'https://picsum.photos/600/400?random=2', uploadDate: '2024-01-16', fileName: 'landscape-1.jpg', moodText: 'Had an amazing adventure today', moodEmoji: '🔥', dayNumber: 2 },
  { id: '3', imageUrl: 'https://picsum.photos/400/400?random=3', uploadDate: '2024-01-17', fileName: 'square-1.jpg', moodText: null, moodEmoji: '❤️', dayNumber: 3 },
  { id: '4', imageUrl: 'https://picsum.photos/500/700?random=4', uploadDate: '2024-01-18', fileName: 'tall-1.jpg', moodText: 'Feeling inspired and motivated', moodEmoji: '💪', dayNumber: 4 },
  { id: '5', imageUrl: 'https://picsum.photos/800/300?random=5', uploadDate: '2024-01-19', fileName: 'wide-1.jpg', moodText: 'Perfect sunset to end the day', moodEmoji: '🌅', dayNumber: 5 },
  { id: '6', imageUrl: 'https://picsum.photos/400/400?random=6', uploadDate: '2024-01-20', fileName: 'square-2.jpg', moodText: null, moodEmoji: '😌', dayNumber: 6 },
  { id: '7', imageUrl: 'https://picsum.photos/600/500?random=7', uploadDate: '2024-01-21', fileName: 'mixed-1.jpg', moodText: 'Celebrating small wins today', moodEmoji: '🎉', dayNumber: 7 },
  { id: '8', imageUrl: 'https://picsum.photos/400/400?random=8', uploadDate: '2024-01-22', fileName: 'square-3.jpg', moodText: 'Feeling peaceful and content', moodEmoji: '🌱', dayNumber: 8 },
];

export function GalleryDemo() {
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof GalleryPresets>('userDashboard');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<'square' | 'video' | 'portrait' | 'landscape'>('square');
  const [showMoodText, setShowMoodText] = useState(true);
  const [showMoodEmoji, setShowMoodEmoji] = useState(true);

  const presetOptions = [
    { key: 'userDashboard', label: 'User Dashboard', description: 'Standard user gallery layout' },
    { key: 'adminUserDetail', label: 'Admin User Detail', description: 'Admin view with fewer columns' },
    { key: 'compact', label: 'Compact', description: 'Many small thumbnails' },
    { key: 'detailed', label: 'Detailed', description: 'Shows filenames and dates' }
  ] as const;

  const aspectRatioOptions = [
    { key: 'square', label: 'Square (1:1)', description: 'Perfect squares' },
    { key: 'video', label: 'Video (16:9)', description: 'Widescreen format' },
    { key: 'portrait', label: 'Portrait (3:4)', description: 'Tall format' },
    { key: 'landscape', label: 'Landscape (4:3)', description: 'Wide format' }
  ] as const;

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Gallery Layout Demo</CardTitle>
          <CardDescription>
            See how the gallery maintains consistent image sizes regardless of original dimensions.
            All images are cropped to fit the same aspect ratio using object-cover.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Preset Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Layout Presets</h3>
              <div className="space-y-2">
                {presetOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={selectedPreset === option.key ? "default" : "outline"}
                    onClick={() => setSelectedPreset(option.key)}
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Aspect Ratio</h3>
              <div className="space-y-2">
                {aspectRatioOptions.map((option) => (
                  <Button
                    key={option.key}
                    variant={selectedAspectRatio === option.key ? "default" : "outline"}
                    onClick={() => setSelectedAspectRatio(option.key)}
                    className="w-full justify-start h-auto p-3"
                  >
                    <div className="text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs opacity-70">{option.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            {/* Display Options */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Display Options</h3>
              <div className="space-y-2">
                <Button
                  variant={showMoodEmoji ? "default" : "outline"}
                  onClick={() => setShowMoodEmoji(!showMoodEmoji)}
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">Show Mood Emojis</div>
                    <div className="text-xs opacity-70">Display emoji badges on images</div>
                  </div>
                </Button>
                <Button
                  variant={showMoodText ? "default" : "outline"}
                  onClick={() => setShowMoodText(!showMoodText)}
                  className="w-full justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium">Show Mood Text</div>
                    <div className="text-xs opacity-70">Display user feelings on hover</div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          {/* Current Settings */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              Preset: {presetOptions.find(p => p.key === selectedPreset)?.label}
            </Badge>
            <Badge variant="secondary">
              Aspect: {aspectRatioOptions.find(a => a.key === selectedAspectRatio)?.label}
            </Badge>
            <Badge variant="secondary">
              Emojis: {showMoodEmoji ? 'On' : 'Off'}
            </Badge>
            <Badge variant="secondary">
              Text: {showMoodText ? 'On' : 'Off'}
            </Badge>
            <Badge variant="secondary">
              Images: {mockImages.length}
            </Badge>
          </div>

          {/* Gallery Demo */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">Gallery Preview</h3>
            <GalleryGrid 
              images={mockImages}
              {...GalleryPresets[selectedPreset]}
              aspectRatio={selectedAspectRatio}
              showMoodText={showMoodText}
              showMoodEmoji={showMoodEmoji}
            />
          </div>

          {/* Explanation */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How it works:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• All images are contained within fixed-size containers</li>
              <li>• <code className="bg-blue-100 px-1 rounded">object-cover</code> crops images to fit the container</li>
              <li>• <code className="bg-blue-100 px-1 rounded">aspect-square</code> ensures consistent 1:1 ratio</li>
              <li>• Images maintain their quality while fitting the layout</li>
              <li>• No more stretched or distorted images in the gallery</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
