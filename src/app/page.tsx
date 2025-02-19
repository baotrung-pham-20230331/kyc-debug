"use client";

import { useState } from "react";
import papa from "papaparse";
import LogCollection from "@/components/log-collection";

export interface ILogCollection {
  name: string;
  entries: any[];
}

export default function Home() {
  const [logCollection, setLogCollection] = useState<ILogCollection[]>([]);

  const onUploadLog = (event) => {
    console.log(event.target.files);
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      papa.parse(file, {
        header: true,
        complete: (result) => {
          setLogCollection((current) => [
            ...current,
            {
              name: file.name,
              entries: result.data,
            },
          ]);
        },
      });
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2">
        <label>Upload log file: </label>
        <input
          type="file"
          onChange={onUploadLog}
          onClick={(e) => (e.target.value = null)}
        />
      </div>
      <div className="flex-1 flex px-2 gap-2 items-stretch">
        {logCollection.map((log, index) => (
          <div key={log.name + index} className="flex-1 flex flex-col">
            <LogCollection
              entries={log.entries}
              onRemove={() => {
                setLogCollection((current) => {
                  const newCollection = [...current];
                  newCollection.splice(index, 1);
                  return newCollection;
                });
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
