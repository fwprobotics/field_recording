import { ComponentProps, useEffect, useState } from "react";
import {formatDistanceToNow} from "date-fns/formatDistanceToNow";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRun } from "@/use-runs";
// import { Separator } from "@/components/ui/separator";
// import { Mail } from "@/app/examples/mail/data";

// export const runs = [
//     {id:1,
//     timestamp:1722124299655,
//     opMode:"Test",
//     labels:["Test"],
//     path:"/runs/TestSineWaveOpMode_2024-07-27-18-51-40"
//     },
//     {id:2,
//         timestamp:1722124299655,
//         opMode:"Test",
//         labels:["Test"],
//         path:"runs/TestSineWaveOpMode_2024-07-29-19-42-30"
//         }
// ]

export interface Run {
    id: number;
    timestamp: number;
    opMode: string;
    labels: string[];
    path: string;
}

interface RunListProps {
  items: Run[];
}

export function RunList() {
    const [run, setRun] = useRun()
    const [runs, setRuns] = useState<Run[]>([]);

    useEffect(() => {
      fetch("http://localhost:3017/runs").then((res) => res.json()).then((data) => {
        console.log(data);
        setRuns(data.sort((a: Run, b: Run) => b.timestamp - a.timestamp));
    })
    }, [])

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {runs.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              run.selected === item.id && "bg-muted",
            )}
            onClick={() => {
              setRun({
                ...run,
                selected: item.id,
              })
            }}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.opMode}</div>
                  {/* {!item.read && (
                    <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                  )} */}
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    run.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {formatDistanceToNow(new Date(item.timestamp), {
                    addSuffix: true,
                  })}
                </div>
              </div>
              <div className="text-xs font-medium">{new Date(item.timestamp).toLocaleString()}</div>
            </div>
            <div className="line-clamp-2 text-xs text-muted-foreground">
              {/* {item.text.substring(0, 300)} */}
            </div>
            {item.labels.length ? (
              <div className="flex items-center gap-2">
                {item.labels.map((label) => (
                  <Badge key={label} variant={getBadgeVariantFromLabel(label)}>
                    {label}
                  </Badge>
                ))}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}

function getBadgeVariantFromLabel(
  label: string,
): ComponentProps<typeof Badge>["variant"] {
  if (["work"].includes(label.toLowerCase())) {
    return "default";
  }

  if (["personal"].includes(label.toLowerCase())) {
    return "outline";
  }

  return "secondary";
}