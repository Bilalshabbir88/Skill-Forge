import { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Settings, HelpCircle, AlertCircle } from 'lucide-react';
import api from '../../api/api';

const VideoPlayer = ({ videoUrl, lessonId, enrollmentId, onLessonComplete, interactiveQuizzes = [], onQuizTrigger }) => {
  const playerRef = useRef(null);
  const triggeredQuizzes = useRef(new Set());
  const [playing, setPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [seeking, setSeeking] = useState(false);
  const [progressSent, setProgressSent] = useState(false);
  const [error, setError] = useState(null);

  // Auto-play when ready
  const [ready, setReady] = useState(false);

  const handleProgress = async (state) => {
    if (seeking) return;
    setPlayed(state.played);
    const currentTime = state.playedSeconds;

    // Check for interactive quizzes (allow 1s window)
    if (Array.isArray(interactiveQuizzes)) {
      interactiveQuizzes.forEach(quiz => {
        const qId = quiz?._id || quiz?.question;
        if (qId && Math.abs(currentTime - quiz.timestamp) < 1.5 && !triggeredQuizzes.current.has(qId)) {
          setPlaying(false); // Pause video
          triggeredQuizzes.current.add(qId);
          if (onQuizTrigger) onQuizTrigger(quiz);
        }
      });
    }

    // Mark as complete when 90% watched (only once)
    if (state.played > 0.9 && !progressSent && enrollmentId && lessonId) {
      try {
        setProgressSent(true);
        await api.post(`/progress/lesson/${lessonId}/complete`, { enrollmentId });
        if (onLessonComplete) onLessonComplete();
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
  };

  const handleSeekChange = (e) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekMouseUp = (e) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(e.target.value));
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleReady = () => {
    setReady(true);
    setPlaying(true);
  };

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const restartVideo = () => {
    playerRef.current.seekTo(0);
    setPlaying(true);
    triggeredQuizzes.current.clear();
  };

  const handleError = (e) => {
    console.error('Video Player Error:', e);
    setError('Failed to load video. Please check the URL or your connection.');
  };

  return (
    <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl group border-4 border-white/5">
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-gray-900 p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h3 className="text-xl font-bold mb-2">Video Unplayable</h3>
          <p className="text-gray-400 max-w-sm">{error}</p>
        </div>
      ) : (
        <>
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
            onError={handleError}
            config={{
              youtube: { playerVars: { showinfo: 0, rel: 0, modestbranding: 1 } }
            }}
          />

          {/* Custom Overlay Controls */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
            {/* Seek Bar */}
            <input
              type="range"
              min={0}
              max={0.999999}
              step="any"
              value={played}
              onMouseDown={handleSeekMouseDown}
              onChange={handleSeekChange}
              onMouseUp={handleSeekMouseUp}
              className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-primary-500 mb-4"
            />

            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-6">
                <button onClick={handlePlayPause} className="hover:scale-110 transition-transform">
                  {playing ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                </button>
                
                <div className="flex items-center gap-2 group/volume">
                  <button onClick={toggleMute}>
                    {muted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step="any"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-0 group-hover/volume:w-20 transition-all h-1 bg-white/30 rounded-lg appearance-none cursor-pointer accent-white"
                  />
                </div>

                <div className="text-sm font-bold opacity-80 tabular-nums">
                  {Math.floor(played * duration / 60)}:{(Math.floor(played * duration % 60)).toString().padStart(2, '0')} / 
                  {Math.floor(duration / 60)}:{(Math.floor(duration % 60)).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={restartVideo} className="p-2 hover:bg-white/10 rounded-full">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Quiz Active Badge */}
          {interactiveQuizzes.length > 0 && (
            <div className="absolute top-6 left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 scale-0 group-hover:scale-100 transition-transform">
              <HelpCircle className="w-4 h-4 text-primary-400" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">{interactiveQuizzes.length} Knowledge Checks Active</span>
            </div>
          )}
        </>
      )}

      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
