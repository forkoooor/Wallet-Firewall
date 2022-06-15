import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import Inspector from "../FireWall/Inspector";
import moment from "moment";
import allRules from "../config/rules.json";
import i18next from "../i18n";

const columns: GridColDef[] = [
  {
    field: "type",
    headerName: i18next.t("type"),
    valueGetter: (params: GridValueGetterParams) =>
      `${i18next.t("rule_type_" + params.row.type)}`,
    width: 80,
  },
  {
    field: "name",
    headerName: i18next.t("name"),
    valueGetter: (params: GridValueGetterParams) => {
      const localeKey = "rule_name_" + params.row.id;
      const translated = i18next.t(localeKey);
      return translated === localeKey ? params.row.name : translated;
    },
    width: 200,
  },
  {
    field: "kind",
    headerName: i18next.t("kind"),
    width: 200,
    valueGetter: (params: GridValueGetterParams) =>
      `${i18next.t("kind_" + params.row.kind)}`,
  },
  {
    field: "values",
    headerName: i18next.t("detail"),
    width: 550,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.values.join(", ")}`,
  },
];

export default function Rules() {
  const [rules, setRules] = useState<any[]>(allRules);
  return (
    <div style={{ height: 500, width: "1000px" }}>
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: "timestamp", sort: "desc" }],
          },
        }}
        rows={rules}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[5]}
      />
    </div>
  );
}
