import Inspector from "../FireWall/Inspector";
import Traffic from "./Traffic";
import Rule from "./Rule";


import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";

export default function FireWall({ firewall }: { firewall: Inspector }) {
  const [tab, setValue] = React.useState("1");

  const { t, i18n } = useTranslation();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tab} onChange={handleChange}>
          <Tab label={t("traffic")} value="1" />
          <Tab label={t("rules")} value="2" />
        </Tabs>
      </Box>
      <Box style={{ marginTop: "30px" }}>
        {tab === "1" && <Traffic firewall={firewall} />}
        {tab === "2" && <Rule />}
      </Box>
    </Box>
  );
}
