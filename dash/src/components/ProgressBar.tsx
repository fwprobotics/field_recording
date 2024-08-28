import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Play, Pause, Square } from "lucide-react";
import ReactPlayer from 'react-player';
import { se } from 'date-fns/locale';
import { set } from 'date-fns';
import { OnProgressProps } from 'react-player/base';

export interface Section {
    start: number;
    end: number;
    color: string;
}

export const VideoProgressBar = ({ playerRef , sections, setPlaying, currentProgress }: { playerRef: ReactPlayer | null, sections: Section[], setPlaying: React.Dispatch<React.SetStateAction<boolean>>, currentProgress:OnProgressProps |null }) => {
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

    useEffect(() => {
        if (playerRef) {
          setDuration(playerRef.getDuration());
          if (!playerRef.getInternalPlayer()?.paused) {
          setProgress(playerRef.getCurrentTime() || 0);
          console.log(playerRef.getCurrentTime());
          }
        }
    }); //we dont talk abt this


//   const intervalRef = useRef<NodeJS.Timeout>(null);

//   useEffect(() => {
//     if (isPlaying) {
//       intervalRef.current = setInterval(() => {
//         setProgress((prevProgress) => {
//           if (prevProgress >= duration) {
//             clearInterval(intervalRef.current);
//             setIsPlaying(false);
//             return duration;
//           }
//           return prevProgress + 1;
//         });
//       }, 1000);
//     } else {
//       clearInterval(intervalRef.current);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [isPlaying, duration]);

useEffect(() => {
    
}
, [progress]);

  const handlePlay = () => {setIsPlaying(true);
    setPlaying(true);
  }
  const handlePause = () => {setIsPlaying(false);
    setPlaying(false);
  }
  const handleStop = () => {
    setIsPlaying(false);
    setPlaying(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-teal-600 bg-teal-200">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-teal-600">
              {Math.round((progress / duration) * 100)}%
            </span>
          </div>
        </div>
        <div className="h-2 overflow-hidden bg-gray-200 rounded relative">
          {sections.map((section, index) => (
            <div
              key={index}
              style={{
                width: `${((section.end - section.start) / duration) * 100}%`,
                left: `${(section.start / duration) * 100}%`,
                backgroundColor: section.color,
              }}
              className={`h-full absolute`}
            />
          ))}
          <div 
            className="h-full bg-white opacity-50 absolute top-0 right-0 transition-all duration-300"
            style={{ width: `${100 - (progress / duration) * 100}%` }}
          />
        </div>
        <Slider
          value={[progress]}
          max={duration}
          step={0.1}
          onPointerDown={() => handlePause()}

          className="mt-2"
          onValueChange={(value) => {setProgress(value[0]);
            playerRef?.seekTo(progress, 'seconds');
  //  setIsSeeking(false);
          }}
        />
        <div className="flex justify-center mt-4 space-x-2">
          <Button onClick={handlePlay} disabled={isPlaying}>
            <Play className="h-4 w-4" />
          </Button>
          <Button onClick={handlePause} disabled={!isPlaying}>
            <Pause className="h-4 w-4" />
          </Button>
          <Button onClick={handleStop}>
            <Square className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

// export default function App() {
//   const sections = [
//     { start: 0, end: 30, color: 'bg-red-500' },
//     { start: 30, end: 60, color: 'bg-yellow-500' },
//     { start: 60, end: 100, color: 'bg-green-500' },
//   ];

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">Video Progress Bar</h1>
//       <VideoProgressBar duration={100} sections={sections} />
//     </div>
//   );
// }