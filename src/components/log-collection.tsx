"use client";

import { Autocomplete, Button, TextField } from "@mui/material";
import {
  AllCommunityModule,
  colorSchemeDark,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { addHours, format, parse } from "date-fns";
import { useMemo, useState } from "react";

const theme = themeAlpine.withPart(colorSchemeDark);
ModuleRegistry.registerModules([AllCommunityModule]);

interface LogCollectionProps {
  entries: Record<string, any>[];
  onRemove?: () => void;
}

const defaultColDef = {
  editable: false,
  minWidth: 150,
  resizable: true,
};

const LogCollection = ({ entries, onRemove }: LogCollectionProps) => {
  const [timeSetting, setTimeSetting] = useState({
    applyTimeConversion: false,
    timeKey: "",
    timeFormatStr: "",
    sourceUTCOffset: "",
  });

  const defaultColDefs = useMemo(() => {
    return Object.keys(entries[0]).map((key) => ({
      field: key,
      filter: "agTextColumnFilter",
      tooltipValueGetter: (params: any) => params.value,
    }));
  }, [entries]);

  const colOptions = useMemo(() => {
    return defaultColDefs.map((c) => ({ field: c.field }));
  }, defaultColDefs);

  const [colDefs, setColDefs] = useState(defaultColDefs);

  const handleColumnFilterChange = (_: any, selectedOptions: Array<any>) => {
    if (selectedOptions.length === 0) {
      setColDefs(defaultColDefs);
      return;
    }
    setColDefs(
      defaultColDefs.filter((c) =>
        selectedOptions.some((o) => o.field === c.field),
      ),
    );
  };

  const formattedColDefs = useMemo(() => {
    if (!timeSetting.applyTimeConversion) {
      return colDefs;
    }
    return colDefs.map((c) => {
      if (c.field === timeSetting.timeKey) {
        return {
          ...c,
          valueFormatter: (params: any) => {
            try {
              const date = parse(
                params.value,
                timeSetting.timeFormatStr,
                new Date(),
              );
              const newDate = addHours(
                date,
                -parseInt(timeSetting.sourceUTCOffset),
              );
              return format(newDate, "yyyy-MM-dd HH:mm:ss.SSS");
            } catch (e) {
              console.error("ERROR PARSING DATE", e);
              return "Error";
            }
          },
        };
      }
      return c;
    });
  }, [timeSetting, colDefs]);

  return (
    <>
      <div className="flex">
        <div className="flex-1">
          <h1 className="mb-4">Reset To UTC+0</h1>
          <div className="flex gap-4">
            <Autocomplete
              className="flex-1"
              value={timeSetting.timeKey}
              onChange={(_, value) =>
                setTimeSetting((c) => ({ ...c, timeKey: value ?? "" }))
              }
              options={colOptions.map((c) => c.field)}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="time key" />
              )}
            />
            <TextField
              className="flex-1"
              label="Time Format"
              value={timeSetting.timeFormatStr}
              onChange={(e) =>
                setTimeSetting((c) => ({ ...c, timeFormatStr: e.target.value }))
              }
            />
            <TextField
              className="flex-1"
              label="Source UTC Offset"
              value={timeSetting.sourceUTCOffset}
              onChange={(e) =>
                setTimeSetting((c) => ({
                  ...c,
                  sourceUTCOffset: e.target.value,
                }))
              }
            />
            <Button
              onClick={() =>
                setTimeSetting((c) => ({ ...c, applyTimeConversion: true }))
              }
            >
              Apply
            </Button>
            <Button
              onClick={() =>
                setTimeSetting({
                  applyTimeConversion: false,
                  timeKey: "",
                  timeFormatStr: "",
                  sourceUTCOffset: "",
                })
              }
            >
              Clear
            </Button>
            {/* <TextField */}
            {/*   className="flex-1" */}
            {/*   label="Final UTC Offset" */}
            {/*   value={finalUTCOffset} */}
            {/*   onChange={(e) => setFinalUTCOffset(e.target.value)} */}
            {/* /> */}
          </div>
          <Autocomplete
            onChange={handleColumnFilterChange}
            multiple
            options={colOptions}
            getOptionLabel={(option) => option.field}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="filter columns"
              />
            )}
          />
        </div>

        <div className="flex-1 flex justify-end">
          <Button onClick={onRemove} color="error" className="ml-auto">
            Remove log
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <AgGridReact
          rowData={entries}
          columnDefs={formattedColDefs}
          gridOptions={{
            enableCellTextSelection: true,
            tooltipShowDelay: 0,
            tooltipInteraction: true,
          }}
          defaultColDef={defaultColDef}
          theme={theme}
        />
      </div>
    </>
  );
};

export default LogCollection;
