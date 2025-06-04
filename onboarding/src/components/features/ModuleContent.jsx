import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import ThreeDModuleViewer from './ThreeDModuleViewer';

const ModuleContent = ({ content }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (e) => {
    setProgress(parseInt(e.target.value));
  };

  if (content.type === '3d') {
    return (
      <div className="aspect-video relative">
        <ThreeDModuleViewer isPlaying={isPlaying} />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <button 
              onClick={togglePlay}
              className="hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (content.type === 'video') {
    return (
      <div className="aspect-video relative bg-black">
        <video
          src={content.url}
          className="w-full h-full"
          controls={false}
          muted={isMuted}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => {/* Handle skip back */}}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <SkipBack size={20} />
              </button>
              <button 
                onClick={togglePlay}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
              <button 
                onClick={() => {/* Handle skip forward */}}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                <SkipForward size={20} />
              </button>
            </div>
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={handleProgressChange}
                className="w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleMute}
                className="hover:bg-white/20 p-2 rounded-full transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="prose dark:prose-invert max-w-none">
      {content.html && (
        <div dangerouslySetInnerHTML={{ __html: content.html }} />
      )}
    </div>
  );
};

export default ModuleContent;