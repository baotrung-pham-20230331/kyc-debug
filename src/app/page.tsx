"use client";

import { ChangeEvent, useState } from "react";
import papa from "papaparse";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import LogCollection from "@/components/log-collection";

export interface ILogCollection {
  name: string;
  entries: any[];
}

export default function Home() {
  const [logCollection, setLogCollection] = useState<ILogCollection[]>([]);
  const [isFileEditorOpen, setIsFileEditorOpen] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [fileName, setFileName] = useState("");

  const onUploadLog = (event: ChangeEvent<any>) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new FileReader();
      setFileName(file.name);
      fileReader.onload = (e: any) => setEditContent(e.target.result);
      fileReader.readAsText(file);
      setIsFileEditorOpen(true);
    }
  };

  const handleConfirmContent = () => {
    setIsFileEditorOpen(false);
    papa.parse(editContent, {
      header: true,
      complete: (result) => {
        setLogCollection((current) => [
          ...current,
          {
            name: fileName,
            entries: result.data,
          },
        ]);

        setEditContent("");
        setFileName("");
      },
    });
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="p-2">
        <label>Upload log file: </label>
        <input
          type="file"
          onChange={onUploadLog}
          onClick={(e: any) => (e.target.value = null)}
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
      <Dialog
        open={isFileEditorOpen}
        onClose={handleConfirmContent}
        fullWidth
        maxWidth="xl"
      >
        <DialogTitle>Preview and Edit</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={10}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmContent} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
