import { useEffect } from "react";
type CallBack = (args: any) => void;
import Inspector from './FireWall/Inspector'

const firewall = new Inspector();
firewall.init();

import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material";
import Grid from '@mui/material/Grid';
import ButtonBase from "@mui/material/ButtonBase";
import Chip from '@mui/material/Chip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RadarIcon from "@mui/icons-material/Radar";
import IconButton from "@mui/material/IconButton";
import FireWall from './Interface/FireWall';
import {
  createShadowRootForwardedComponent,
} from "./ShadowRoot/Portal";
import { formatAction } from "./FireWall/Tx";
import { reportScam } from "@scamsniffer/detector";

export const ShadowRootDialog: typeof Dialog = createShadowRootForwardedComponent(Dialog) as any;

let approveWaiter: CallBack | null = null;

const WarringDialog = styled(ShadowRootDialog)`
  .MuiPaper-root {
    background-color: #d73a49;
  }
`;

const darkModeTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false);
  const [action, setAction] = React.useState<null | any>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    firewall.listenRequest(async (action: any) => {
        const formatted = formatAction(action, 'zh-CN')
        setAction(formatted);
        setOpen(true);
        const status = await new Promise((resolve) => {
            approveWaiter = resolve;
        })
        approveWaiter = null;
        return status;
    });
  }, []);

  const handleReject = () => {
    setOpen(false);
    approveWaiter && approveWaiter(true);
  };

  const handApprove = () => {
    setOpen(false);
    approveWaiter && approveWaiter(false);
  };

  const handleAppOpen = () => {
    setAppOpen(true);
  }

  const handleAppClose = () => {
    setAppOpen(false)
  }

  const handReport = () => {
    reportScam({
      slug: "unknown",
      name: "unknown",
      externalUrl: null,
      twitterUsername: null,
      matchType: "firewall_report",
      post: {
        links: [window.location.href]
      },
    });
  }

  return (
    <ThemeProvider theme={darkModeTheme}>
      <IconButton
        onClick={handleAppOpen}
        style={{
          color: "black",
          position: "fixed",
          backgroundColor: "white",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 20%)",
          zIndex: "2147483648",
          right: "100px",
          bottom: "100px",
        }}
      >
        <RadarIcon style={{ fontSize: "50px" }} />
      </IconButton>
      <ShadowRootDialog
        open={appOpen}
        onClose={handleAppClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        style={{}}
      >
        <DialogTitle>{t("wallet_firewall")}</DialogTitle>
        <DialogContent>
          <FireWall firewall={firewall} />
        </DialogContent>
        <DialogActions></DialogActions>
      </ShadowRootDialog>
      <WarringDialog
        open={open}
        onClose={handleReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        style={{}}
      >
        <DialogTitle id="alert-dialog-title" style={{ color: "white" }}>
          <Grid container spacing={2} style={{ paddingBottom: "8px" }}>
            <Grid item>{t("warning")}</Grid>
            <Grid
              container
              item
              xs={12}
              sm
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <ButtonBase
                sx={{ width: 144, height: 24 }}
                onClick={() =>
                  window.open("https://scamsniffer.io?utm_source=firewall-logo")
                }
                style={{ marginRight: "-20px", marginTop: "10px" }}
              >
                <img
                  src="https://scamsniffer.io/assets/logo-light.png"
                  height={24}
                />
              </ButtonBase>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <div style={{ padding: "10px" }}>
            {action ? (
              <div style={{ textAlign: "center", color: "#f4f4f4" }}>
                <h2>{action.short}</h2>
                {action.args &&
                  action.args.map((_: any) => {
                    let el = null;
                    if (_.display === "address") {
                      el = (
                        <div>
                          {_.name} <br />
                          <Chip
                            label={action.raw.args[_.field]}
                            onClick={() =>
                              window.open(
                                "https://etherscan.io/address/" +
                                  action.raw.args[_.field]
                              )
                            }
                            style={{ marginTop: "10px" }}
                          />
                        </div>
                      );
                    }
                    if (_.display === "tokenId") {
                      el = (
                        <div>
                          {_.name} <br />
                          <Chip
                            label={action.raw.args[_.field].toString()}
                            style={{ marginTop: "10px" }}
                          />
                        </div>
                      );
                    }
                    return el && <div style={{ marginTop: "10px" }}>{el}</div>;
                  })}
                {action.description && (
                  <p style={{ fontSize: "14px", marginTop: "30px" }}>
                    {action.description}
                  </p>
                )}
              </div>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions style={{ paddingBottom: "15px" }}>
          <Button
            onClick={handReport}
            autoFocus
            style={{ color: "white", marginRight: "10px" }}
          >
            {t("report")}
          </Button>
          <Button
            onClick={handApprove}
            autoFocus
            style={{ color: "white", marginRight: "10px" }}
          >
            {t("approve")}
          </Button>
          <Button
            onClick={handleReject}
            variant="outlined"
            style={{
              color: "white",
              borderColor: "white",
              marginRight: "10px",
            }}
          >
            {t("reject")}
          </Button>
          {/* <Grid container spacing={2} style={{ paddingBottom: "8px" }}>
            <Grid item>
              <ButtonBase sx={{ width: 150, height: 30 }}>
                <img
                  src="https://scamsniffer.io/assets/logo-light.png"
                  height={20}
                />
              </ButtonBase>
            </Grid>
            <Grid
              container
              item
              xs={12}
              sm
              direction="row"
              spacing={1}
              justifyContent="flex-end"
            >
              <Button
                onClick={handApprove}
                autoFocus
                style={{ color: "white", marginRight: "10px" }}
              >
                {t("approve")}
              </Button>
              <Button
                onClick={handleReject}
                variant="outlined"
                style={{
                  color: "white",
                  borderColor: "white",
                  marginRight: "10px",
                }}
              >
                {t("reject")}
              </Button>
            </Grid>
          </Grid> */}
        </DialogActions>
      </WarringDialog>
    </ThemeProvider>
  );
}
