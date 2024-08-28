import { useRef, useEffect, useState, ChangeEventHandler } from 'react';
import Field from '@/lib/Field';
import { Pause, Plane, Play } from 'lucide-react';

interface TelemetryItem {
  fieldOverlay: {
    ops: any[]; // Update with the actual type of ops
  };
}

const CroppedVidViewer = ({path, telemetry} : {path:string, telemetry:TelemetryItem[]}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video !== null && canvas !== null) {
    const ctx = canvas.getContext('2d');
    const field = new Field(canvas);
      //  console.log(telemetry);
    var overlay = telemetry.reduce(
        (acc, { fieldOverlay }) =>
          fieldOverlay.ops.length === 0 ? acc : fieldOverlay,
        { },
      );
  //    console.log(overlay);
      field.setOverlay(overlay);
      

    const playVideo = () => {
        if (!ctx || video == null) return;
      if (video.paused || video.ended) return;

      // Draw the video frame on the canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      field.renderField(0, 0, 400, 400)
      setProgress((video.currentTime / video.duration) * 100);
      
      // Schedule the next frame
      requestAnimationFrame(playVideo);
    };

    video.addEventListener('play', playVideo);

    return () => {
      video.removeEventListener('play', playVideo);
    };
}
  }, []);
  const togglePlay = () => {
    const video = videoRef.current;
    if (video === null) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleProgressChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const video = videoRef.current;
    if (video === null) return;
    const newTime = (Number(e.target.value) / 100) * video.duration;
    video.currentTime = newTime;
    setProgress(Number(e.target.value));
  };

  return (
    <div className="video-canvas-container">
      <video
        ref={videoRef}
        className="hidden"
        src={path+"/cropped.mp4"}
        controls
      />
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="border border-gray-300"
        onClick={() => {
            const video = videoRef.current;
            console.log(video);
            if (video !== null) {
                if (video.paused) {
                video.play();
                } else {
                video.pause();
                }
            }}
        }
      />
      <div className="controls mt-2 flex items-center">
        <button
          onClick={togglePlay}
          className="bg-blue-500 text-white p-2 rounded-full mr-2"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleProgressChange}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default CroppedVidViewer;