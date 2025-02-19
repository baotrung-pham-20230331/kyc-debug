import { useMemo } from "react";
import { JsonView, darkStyles } from "react-json-view-lite";

interface LogEntryProps {
  data: Record<string, any>;
  visibleFields: string[];
  timeKey: string;
}

export function LogEntry(props: LogEntryProps) {
  const _visibleFields = useMemo(() => {
    if (props.timeKey) {
      return props.visibleFields.filter((field) => field !== props.timeKey);
    }
    return props.visibleFields;
  }, [props.visibleFields, props.timeKey]);

  const dataWithVisibleFields = useMemo(() => {
    if (_visibleFields?.length === 0) {
      return props.data;
    }

    return Object.fromEntries(
      Object.entries(props.data).filter(([key]) =>
        _visibleFields.includes(key),
      ),
    );
  }, [props.data, _visibleFields]);

  return (
    <li className="flex items-center gap-2 border border-gray-500 break-all h-[50px]">
      {props.timeKey && (
        <div className="p-2 border-r border-gray-500">
          {props.data[props.timeKey]}
        </div>
      )}
      <JsonView data={dataWithVisibleFields} style={darkStyles} />
    </li>
  );
}
