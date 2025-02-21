"use client";

import { Autocomplete, Button, TextField } from "@mui/material";
import {
  AllCommunityModule,
  ColDef,
  colorSchemeDark,
  ModuleRegistry,
  themeAlpine,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { addHours, format, parse } from "date-fns";
import { useMemo, useState } from "react";
import LogSettings from "./log-settings";

const theme = themeAlpine.withPart(colorSchemeDark);
ModuleRegistry.registerModules([AllCommunityModule]);

interface LogCollectionProps {
  entries: Record<string, any>[];
  onRemove: () => void;
}

const LogCollection = ({ entries, onRemove }: LogCollectionProps) => {
  const [timeSetting, setTimeSetting] = useState({
    applyTimeConversion: false,
    timeKey: "",
    timeFormatStr: "",
    sourceUTCOffset: "",
  });

  const defaultColDef: ColDef = useMemo(() => {
    return {
      editable: false,
      minWidth: 150,
      resizable: true,
    };
  }, []);

  // const [selectedRow, setSelectedRow] = useState([]);
  const [key, setKey] = useState(0);

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

  const [filteredCols, setFilteredCols] = useState<string[]>(
    colOptions.map((c) => c.field),
  );

  const finalColDefs = useMemo(() => {
    const filteredColDefs = defaultColDefs.filter((c) =>
      filteredCols.includes(c.field),
    );

    if (!timeSetting.applyTimeConversion) {
      return filteredColDefs;
    }

    return filteredColDefs.map((c) => {
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
  }, [timeSetting, defaultColDefs, filteredCols]);

  const onApplySettings = (settings) => {
    setTimeSetting(settings.timeSetting);
    setFilteredCols(
      Object.keys(settings.filteredCols).filter(
        (k) => settings.filteredCols[k],
      ),
    );
  };

  return (
    <>
      <div className="flex">
        <LogSettings
          key={entries.length + key}
          colOptions={colOptions}
          onApplySettings={onApplySettings}
        />
        <div className="flex-1 flex justify-between">
          <Button
            onClick={() => setKey((k) => k + 1)}
            color="error"
            className="ml-auto"
          >
            reset
          </Button>
          <Button onClick={onRemove} color="error" className="ml-auto">
            remove log
          </Button>
        </div>
      </div>
      <div className="flex-1">
        <AgGridReact
          key={entries.length + key}
          rowData={entries}
          columnDefs={finalColDefs}
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
