import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Inspector from "../FireWall/Inspector";
import moment from "moment";
import { useTranslation } from "react-i18next";
import i18next from "../i18n";


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  {
    field: "method",
    headerName: i18next.t("method"),
    width: 180,
    valueGetter: (params: GridValueGetterParams) => `${params.row.method}`,
  },
  {
    field: "key",
    headerName: i18next.t("action"),
    width: 180,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.key || params.row.name}`,
  },
  {
    field: "timestamp",
    headerName: i18next.t("timestamp"),
    width: 240,
    valueGetter: (params: GridValueGetterParams) => {
      return moment(params.row.timestamp).format();
    },
  },
  {
    field: "args",
    headerName: i18next.t("params"),
    width: 550,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.args ? JSON.stringify(params.row.args, null, 2) : ""}`,
  },
];

export default function Traffic({ firewall }: { firewall: Inspector }) {
  const [actionLogs, setActionLogs] = useState<any[]>([]);

  useEffect(() => {
    setActionLogs(firewall.getLogs());
    const cbFn = (log: any) => {
      setActionLogs([log, ...actionLogs]);
    };
    firewall.subscribe(cbFn);
    return () => {
        firewall.unsubscribe(cbFn);
    }
  }, [actionLogs]);

  return (
    <div style={{ height: 500, width: "1000px" }}>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "timestamp", sort: "desc" }],
          },
        }}
        rows={actionLogs}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
