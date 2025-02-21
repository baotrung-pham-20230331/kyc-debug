import {
  Autocomplete,
  Button,
  Checkbox,
  Drawer,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Props {
  colOptions: { field: string }[];
  onApplySettings: (settings: any) => void;
}

export default function LogSettings({ colOptions, onApplySettings }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [timeSetting, setTimeSetting] = useState({
    applyTimeConversion: false,
    timeKey: "",
    timeFormatStr: "",
    sourceUTCOffset: "",
  });

  const [filteredCols, setFilteredCols] = useState<Record<string, boolean>>(
    colOptions.reduce(
      (acc, c) => {
        acc[c.field] = true;
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  );

  const onClose = () => {
    setIsOpen(false);
    const settings = {
      timeSetting,
      filteredCols,
    };

    onApplySettings(settings);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Settings</Button>
      <Drawer anchor="right" open={isOpen} onClose={onClose}>
        <Stack className="min-w-[400px] p-4" spacing="32px">
          <Stack spacing="16px">
            <div className="flex justify-between items-center">
              <Typography variant="h6">Time</Typography>
              <FormControlLabel
                label="Enabled"
                control={
                  <Switch
                    checked={timeSetting.applyTimeConversion}
                    onChange={(e) =>
                      setTimeSetting((c) => ({
                        ...c,
                        applyTimeConversion: e.target.checked,
                      }))
                    }
                  />
                }
              />
            </div>
            <Autocomplete
              value={timeSetting.timeKey}
              onClick={() =>
                setTimeSetting((c) => ({ ...c, applyTimeConversion: false }))
              }
              onChange={(_, value) =>
                setTimeSetting((c) => ({ ...c, timeKey: value ?? "" }))
              }
              options={colOptions.map((c) => c.field)}
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="time key" />
              )}
            />
            <TextField
              label="Time Format"
              value={timeSetting.timeFormatStr}
              onFocus={() =>
                setTimeSetting((c) => ({ ...c, applyTimeConversion: false }))
              }
              onChange={(e) =>
                setTimeSetting((c) => ({ ...c, timeFormatStr: e.target.value }))
              }
            />
            <TextField
              label="Source UTC Offset"
              value={timeSetting.sourceUTCOffset}
              onFocus={() =>
                setTimeSetting((c) => ({ ...c, applyTimeConversion: false }))
              }
              onChange={(e) =>
                setTimeSetting((c) => ({
                  ...c,
                  sourceUTCOffset: e.target.value,
                }))
              }
            />
          </Stack>
          <Stack spacing="16px">
            <Typography variant="h6">Filter Columns</Typography>
            <Stack>
              <FormControlLabel
                label="Select All"
                control={
                  <Checkbox
                    checked={Object.values(filteredCols).every((v) => v)}
                    onChange={(e) => {
                      setFilteredCols(
                        Object.keys(filteredCols).reduce(
                          (acc, k) => {
                            acc[k] = e.target.checked;
                            return acc;
                          },
                          {} as Record<string, boolean>,
                        ),
                      );
                    }}
                  />
                }
              />
              {colOptions.map((c) => (
                <FormControlLabel
                  label={c.field}
                  key={c.field}
                  control={
                    <Checkbox
                      key={c.field}
                      checked={filteredCols[c.field]}
                      onChange={(e) => {
                        setFilteredCols((f) => ({
                          ...f,
                          [c.field]: e.target.checked,
                        }));
                      }}
                    />
                  }
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Drawer>
    </>
  );
}
