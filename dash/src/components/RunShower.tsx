import { useRun } from "@/use-runs";
import ReactPlayer from "react-player";
// import FilePlayer from "react-player/file";
// import { runs } from "./RunList";
import {  useEffect, useState } from "react";
import { Section, VideoProgressBar } from "./ProgressBar";
import { OnProgressProps } from "react-player/base";
import { Run } from "./RunList";
import { ViewSelector } from "./ViewSelector";
import CroppedVidViewer from "./CroppedVidViewer";


export function RunShower() {
    const [run, _] = useRun()
    const [runs, setRuns] = useState<Run[]>([]);
    const [playing, setPlaying] = useState(false);
    const [progress, setProgress] = useState<OnProgressProps | null>(null);
    const [player, setPlayer] = useState<ReactPlayer | null>(null);
    const [telemetry, setTelemetry] = useState<any[]>([]);
    const reserved = ["hex_code", "current_camera", "timestamp", "fieldOverlay"];

    const onRefChange = (player: ReactPlayer) => {
        if (!player) return
        setPlayer(player);
    }

    useEffect(() => {
        if (run.selected && runs.length > 0) {
            console.log(runs[Number(run.selected)].path, run.selected);
            getTelemetry(runs[Number(run.selected)].path).then((data) => {
            setTelemetry( data);

            })
        }
    }, [run.selected, runs])

    useEffect(() => {
        fetch("http://localhost:3017/runs").then((res) => res.json()).then((data) => {
            setRuns(data);
        })
    }, [])
    if (telemetry.length === 0) return <div className=" h-screen flex items-center justify-center">Loading...</div>
    return <div className=" h-screen flex items-center justify-center flex-col">
        <ViewSelector/>
        {run.view === "cropped" ?
        telemetry[0].hasOwnProperty("fieldOverlay") && <CroppedVidViewer path={runs[Number(run.selected)].path} telemetry={telemetry}/> :
        <>
    <ReactPlayer url={runs[Number(run.selected)].path+"/"+run.view+".mp4"} ref={onRefChange} onReady={onRefChange} playing={playing} onProgress={(p) => setProgress(p)}/>
    <VideoProgressBar playerRef={player} sections={getSectionsFromTelemetry(telemetry)} setPlaying={setPlaying} currentProgress={progress}/>
    </>}
    <div className="w-full max-w-lg">
        <h2 className="text-xl mb-2">Telemetry</h2>
        {Object.entries(getTelemetryFromProgress(telemetry, progress)).map(([key, value]) => {
            if (reserved.includes(key)) return null;
            return <p key={key}>{key}: {String(value)}</p>
        })}
    </div>
    </div>
}


function getTelemetry(path: string): Promise<any> {
    return new Promise((resolve, reject) => {
        fetch(path+"/telemetry.json").then((res) => {
            console.log(res);
            res.json().then((data) => {
                resolve(data);
            })
        })
    })
}

function getTelemetryFromProgress(data: any, progress: OnProgressProps | null): any {
    if (!progress || progress.playedSeconds == 0) return data.at(0);
    var start = data[0].timestamp;
    var before = data.filter((d: any) => (d.timestamp-start) < (progress?.playedSeconds || 0)*1000);
    if (before.length === 0) return data[0];
   // console.log(before);
    return before[before.length-1];
}

function getSectionsFromTelemetry(data: any): Section[] {
            var start_time = data[0].timestamp;
            var section_start_time = 0;
            var sections = [];
            var last = data[0];
            for (var i = 0; i < data.length; i++) {
                if (data[i].state !== last.state && data[i].state) {
                    
                    sections.push({start:section_start_time,end:(data[i].timestamp-start_time)/1000,color:last.hex_code});
                    section_start_time = (data[i].timestamp-start_time)/1000;
                }
                last = data[i];
            }
            sections.push({start:section_start_time,end:(data[data.length-1].timestamp-start_time)/1000,color:last.hex_code});
            return sections;
    }
