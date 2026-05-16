import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, HelpCircle } from 'lucide-react';
import api from '../../api/api';

const VideoPlayer = ({ videoUrl, lessonId, enrollmentId, onLessonComplete, interactiveQuizzes = [], onQuizTrigger }) => {
  const playerRef = useRef(null);
  const triggeredQuizzes = useRef(new Set());
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [ready, setReady] = useState(false);
  const [progressSent, setProgressSent] = useState(false);

  const handleProgress = async (state) => {
    setPlayed(state.played);
    const currentTime = state.playedSeconds;

    // Check for interactive quizzes
    interactiveQuizzes.forEach(quiz => {
      const qId = quiz._id || quiz.question;
      if (Math.abs(currentTime - quiz.timestamp) < 1 && !triggeredQuizzes.current.has(qId)) {
        setPlaying(false);
        triggeredQuizzes.current.add(qId);
        if (onQuizTrigger) onQuizTrigger(quiz);
      }
    });

    // Mark as complete when 90% watched (only once)
    if (state.played > 0.9 && !progressSent && enrollmentId && lessonId) {
      setProgressSent(true);
      try {
        await api.put(`/enrollments/${enrollmentId}/progress`, {
          lessonId,
          completed: true,
        });
        if (onLessonComplete) {
          onLessonComplete(lessonId);
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setReady(true);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
  };

  const handleSeek = (e) => {
    const seekTo = parseFloat(e.target.value);
    setPlayed(seekTo);
    playerRef.current?.seekTo(seekTo);
  };

  const handleRestart = () => {
    playerRef.current?.seekTo(0);
    setPlayed(0);
    setProgressSent(false);
  };

  const handleFullscreen = () => {
    const player = playerRef.current?.wrapper;
    if (player?.requestFullscreen) {
      player.requestFullscreen();
    } else if (player?.webkitRequestFullscreen) {
      player.webkitRequestFullscreen();
    } else if (player?.msRequestFullscreen) {
      player.msRequestFullscreen();
    }
  };

  const formatTime = (seconds) => {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl">
      {/* Loading Overlay */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* React Player */}
      <div className="relative aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={playing}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          onEnded={() => {
            setPlaying(false);
            if (onLessonComplete) onLessonComplete(lessonId);
          }}
          config={{
            file: {
              attributes: {
                preload: 'metadata',
                controlsList: 'nodownload',
              },
            },
          }}
        />
      </div>

      {/* Custom Controls Overlay */}
      {ready && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
                  played * 100
                }%, rgb(75, 85, 99) ${played * 100}%, rgb(75, 85, 99) 100%)`,
              }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Play/Pause */}
              <button
                onClick={handlePlayPause}
                className="w-9 h-9 flex items-center justify-center bg-primary-600 hover:bg-primary-700 rounded-full transition-colors"
              >
                {playing ? <Pause size={18} className="text-white" /> : <Play size={18} className="text-white" />}
              </button>

              {/* Restart */}
              <button
                onClick={handleRestart}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
              >
                <RotateCcw size={18} className="text-white" />
              </button>

              {/* Volume */}
              <div className="flex items-center space-x-2">
                <button onClick={handleMuteToggle} className="hover:bg-white/20 p-2 rounded">
                  {muted || volume === 0 ? (
                    <VolumeX size={18} className="text-white" />
                  ) : (
                    <Volume2 size={18} className="text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={muted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Time */}
              <div className="text-white text-sm font-medium">
                {formatTime(played * duration)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Settings (placeholder) */}
              <button className="w-9 h-9 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors">
                <Settings size={18} className="text-white" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={handleFullscreen}
                className="w-9 h-9 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
              >
                <Maximize size={18} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Badge */}
      {played > 0.9 && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
          <span>✓ Lesson Complete</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
