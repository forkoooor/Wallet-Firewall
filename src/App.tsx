import { useEffect } from "react";
type CallBack = (args: any) => void;
import Inspector from "./FireWall/Inspector";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { styled } from "@mui/material";
import Grid from '@mui/material/Grid';

import CheckIcon from "@mui/icons-material/Check";
import ButtonBase from "@mui/material/ButtonBase";
import Chip from '@mui/material/Chip';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import RadarIcon from "@mui/icons-material/Radar";
import IconButton from "@mui/material/IconButton";
import FireWall from './Interface/FireWall';
import {
  createShadowRootForwardedComponent,
  createShadowRootForwardedPopperComponent,
} from "./ShadowRoot/Portal";
import { formatAction } from "./FireWall/Tx";
import { reportScam } from "@scamsniffer/detector";
import { checkTransaction, checkPage } from './shared/api';
import CircularProgress from "@mui/material/CircularProgress";
import Divider from '@mui/material/Divider';
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Typography,
  FormControlLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import SendIcon from "@mui/icons-material/Send";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const CustomIndexTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  zIndex: 2147483088,
});

export const ShadowRootDialog: typeof Dialog = createShadowRootForwardedComponent(Dialog) as any;
export const ShadowRootTooltip: typeof Tooltip =
  createShadowRootForwardedPopperComponent(CustomIndexTooltip) as any;

let approveWaiter: CallBack | null = null;

const WarringDialog = styled(ShadowRootDialog)`
  z-index: 2147483000;
  .MuiPaper-root {
    background-color: black;
  }
`;

const darkModeTheme = createTheme({
  palette: {
    mode: "dark",
  },
  components: {
    
  }
});

import {
  DOMProxy,
  LiveSelector,
  MutationObserverWatcher,
} from "@holoflows/kit";


// function watchPage() {
//   const bodyEl = new LiveSelector().querySelectorAll<HTMLDivElement>("body");
//   new MutationObserverWatcher(bodyEl)
//     .useForeach((node, key, metadata) => {
//       console.log("node", node, key, metadata);
//       return {
//         onNodeMutation: () => {
//           console.log("onNodeMutation");
//         },
//         onRemove: () => {
//           console.log("onRemove");
//         },
//         onTargetChanged: () => {
//           console.log("onChange");
//         },
//       };
//     })

//     .startWatch({
//       subtree: true,
//       childList: true,
//       attributes: true,
//       attributeOldValue: true
//     });
// }

// watchPage();

function dumpWindowCheck() {
    var names = [];
    var functions = [
      "setImmediate",
      "clearImmediate",
      "Web3",
      "parcelRequirea886",
      "onerror",
      "onpopstate",
      "onunhandledrejection",
      "__nr_require",
      "$",
      "axios",
      "jQuery",
      "Popper",
      "Emitter",
    ];
    for (var key in window) {
      const value = window[key];
      if (value instanceof Function) {
        try {
          const funcCode = value.toString();
          if (functions.indexOf(key) > -1) continue;
          if (funcCode.indexOf("native") > -1) continue;
          names.push({
            key,
            code: funcCode.slice(0, 100),
          });
        } catch (e) {}
      }
    }

    return {
      keys: names
    };
}


function getPageEnv() {

  const windowKeys = dumpWindowCheck();

  return {
    host: window.location.host,
    url: window.location.href,
    windowKeys: windowKeys
  };
}

export default function AlertDialog({ firewall }: { firewall: Inspector }) {
  const [open, setOpen] = React.useState(false);
  const [appOpen, setAppOpen] = React.useState(false);
  const [action, setAction] = React.useState<null | any>(null);
  const { t, i18n } = useTranslation();
  const [checking, setCheckIng] = React.useState(false);
  const [warningInfo, setWarningInfo] = React.useState<string | null>(null);
  const [checkListResult, setCheckResults] = React.useState<any[]>([]);
  const [pageCheckResult, setPageCheckResult] = React.useState<any>(null);
  const pageHost = window.location.host;

  useEffect(
    () => {
      let timer1 = setInterval(async () => {
        const result = await checkPage();
        if (result.length) {
          setPageCheckResult(result[0]);
          if (timer1) clearInterval(timer1);
        }
      }, 5 * 1000);
      // this will clear Timeout
      // when component unmount like in willComponentUnmount
      // and show will not change to true
      return () => {
        if (timer1) clearInterval(timer1);
      };
    },
    // useEffect will run only one time with empty []
    // if you pass a value to array,
    // like this - [data]
    // than clearTimeout will run every time
    // this value changes (useEffect re-run)
    []
  );

  useEffect(() => {
    firewall.listenRequest(async (action: any) => {
        const pageEnv = getPageEnv();
        // console.log("action", action, pageEnv);
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

  useEffect(() => {
    if (!action) return;
    const doCheck = async () => {
      setCheckIng(true)
      const pageEnv = getPageEnv();
      setCheckResults([]);
      setWarningInfo(null);
      const checkResults = await checkTransaction(action.raw, pageEnv);
      const hasIssues = checkResults.filter(
        (_) => _ && _.status != 0 && _.shareText
      );
      if (hasIssues.length) {
        const issues = hasIssues.map(_ => _.shareText).join("\n- ")
        setWarningInfo(
          `#PotentialScamAlert found ${pageEnv.host.replace(
            new RegExp("\\.", "g"),
            "[.]"
          )} via @realScamSniffer, Security issues found: \n- ${issues}`
        );
        try {
          reportScam({
            slug: "unknown",
            name: "unknown",
            externalUrl: null,
            twitterUsername: null,
            matchType: "firewall_report",
            post: {
              links: [window.location.href],
            },
          });
        } catch(e) {}
      }
      setCheckResults(checkResults);
      setCheckIng(false);
    };
    doCheck();
    return () => {
    };
  }, [action])

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

  const handlePageAlertAppClose = () => {
    setPageCheckResult(null)
  };

  const shareToMedia = () => {
    if (!warningInfo) return;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      warningInfo
    )}`;

    window.open(url);
  }

   const shareToMediaPage = () => {
     const pageEnv = getPageEnv();
     const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
       `#PotentialScamAlert found ${pageEnv.host.replace(
         new RegExp("\\.", "g"),
         "[.]"
       )} via @realScamSniffer, Security issues found: \n- Fake Secret Recovery Phrase Detected`
     )}`;

     window.open(url);
   };


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
      {/* <IconButton
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
      </IconButton> */}
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
        open={pageCheckResult !== null}
        onClose={handlePageAlertAppClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        style={{}}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ color: "white", textAlign: "center" }}
        >
          <ButtonBase
            sx={{ width: 200, height: 45 }}
            onClick={() =>
              window.open("https://scamsniffer.io?utm_source=firewall-logo")
            }
            style={{ marginRight: "-20px", marginTop: "0px" }}
          >
            <img
              src="https://scamsniffer.io/assets/logo-light.png"
              height={32}
            />
          </ButtonBase>
        </DialogTitle>
        <DialogContent style={{ padding: "0" }} dividers>
          <div style={{ width: "450px" }}>
            {
              <div style={{ textAlign: "center", color: "#f4f4f4" }}>
                <div style={{ padding: "10px 0 18px 0" }}>
                  <div style={{ paddingTop: "7px" }}>
                    <WarningAmberIcon
                      style={{ fontSize: "45px", color: "#ec2e2e" }}
                    />
                  </div>
                  <div style={{ fontSize: "18px", margin: "7px 0" }}>
                    Security Check
                    <a
                      href="https://docs.scamsniffer.io/browser-extension/security-check"
                      target="_blank"
                      style={{
                        color: "white",
                      }}
                    >
                      <HelpOutlineIcon
                        style={{
                          verticalAlign: "-3px",
                          fontSize: "18px",
                          marginLeft: "8px",
                        }}
                      />
                    </a>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {pageHost}
                  </div>
                </div>
                {pageCheckResult ? <Divider variant="middle" /> : null}
                {pageCheckResult && (
                  <List>
                    <ListItem>
                      <ListItemIcon>
                        <WarningAmberIcon
                          style={{
                            fontSize: "20px",
                            color: "#ec2e2e",
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={pageCheckResult.title}
                        secondary={pageCheckResult.message}
                      />
                    </ListItem>
                  </List>
                )}
              </div>
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            item
            xs={12}
            sm
            direction="row"
            spacing={1}
            style={{ padding: "20px 0 15px 0" }}
            justifyContent="center"
          >
            <Button
              onClick={handleAppClose}
              variant="outlined"
              startIcon={<CancelIcon />}
              style={{
                marginRight: "20px",
              }}
            >
              {t("reject")}
            </Button>
            {
              <ShadowRootTooltip
                arrow
                title="Warning others to avoid potential scams"
                placement="top-start"
              >
                <Button
                  endIcon={<SendIcon />}
                  onClick={shareToMediaPage}
                  style={{
                    marginLeft: "20px",
                  }}
                >
                  Share
                </Button>
              </ShadowRootTooltip>
            }
          </Grid>
        </DialogActions>
      </WarringDialog>

      <WarringDialog
        open={open}
        onClose={handleReject}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{ color: "white", textAlign: "center" }}
        >
          <ButtonBase
            sx={{ width: 200, height: 45 }}
            onClick={() =>
              window.open("https://scamsniffer.io?utm_source=firewall-logo")
            }
            style={{ marginRight: "-20px", marginTop: "0px" }}
          >
            <img
              src="https://scamsniffer.io/assets/logo-light.png"
              height={32}
            />
          </ButtonBase>
        </DialogTitle>
        <DialogContent style={{ padding: "0" }} dividers>
          <div style={{ width: "450px" }}>
            {action ? (
              <div style={{ textAlign: "center", color: "#f4f4f4" }}>
                <div style={{ padding: "10px 0 18px 0" }}>
                  <div style={{ paddingTop: "7px" }}>
                    {checking ? (
                      <CircularProgress />
                    ) : checkListResult.filter((_) => _.status === 1).length ? (
                      <WarningAmberIcon
                        style={{ fontSize: "45px", color: "#ec2e2e" }}
                      />
                    ) : checkListResult.filter((_) => _.status === 2).length ? (
                      <WarningAmberIcon
                        style={{ fontSize: "45px", color: "yellow" }}
                      />
                    ) : (
                      <CheckIcon
                        style={{ fontSize: "45px", color: "#0eed0e" }}
                      />
                    )}
                  </div>
                  <div style={{ fontSize: "18px", margin: "7px 0" }}>
                    Security Check
                    <a
                      href="https://docs.scamsniffer.io/browser-extension/security-check"
                      target="_blank"
                      style={{
                        color: "white",
                      }}
                    >
                      <HelpOutlineIcon
                        style={{
                          verticalAlign: "-3px",
                          fontSize: "18px",
                          marginLeft: "8px",
                        }}
                      />
                    </a>
                  </div>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    {pageHost}
                  </div>
                </div>
                {checkListResult.length ? <Divider variant="middle" /> : null}
                <List>
                  {checkListResult.map((result: any, index: any) => {
                    return (
                      <ListItem key={index}>
                        <ListItemIcon>
                          {result.status ? (
                            <WarningAmberIcon
                              style={{
                                fontSize: "20px",
                                color:
                                  result.status === 2 ? "yellow" : "#ec2e2e",
                              }}
                            />
                          ) : (
                            <CheckIcon
                              style={{ fontSize: "20px", color: "#0eed0e" }}
                            />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={result.name}
                          secondary={result.message}
                        />
                      </ListItem>
                    );
                  })}
                </List>
                {/* <h2>{action.short}</h2>
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
                )} */}
              </div>
            ) : null}
          </div>
        </DialogContent>
        <DialogActions>
          {/* <Button
            onClick={handReport}
            autoFocus
            style={{ color: "white", marginRight: "10px" }}
          >
            {t("report")}
          </Button> */}
          <Grid
            container
            item
            xs={12}
            sm
            direction="row"
            spacing={1}
            style={{ padding: "20px 0 15px 0" }}
            justifyContent="center"
          >
            <Button
              onClick={handleReject}
              variant="outlined"
              startIcon={<CancelIcon />}
              style={{
                marginRight: "20px",
              }}
            >
              {t("reject")}
            </Button>
            <Button
              onClick={handApprove}
              endIcon={<ArrowForwardIcon />}
              variant="contained"
            >
              {t("approve")}
            </Button>
            {warningInfo ? (
              <ShadowRootTooltip
                arrow
                title="Warning others to avoid potential scams"
                placement="top-start"
              >
                <Button
                  endIcon={<SendIcon />}
                  onClick={shareToMedia}
                  style={{
                    marginLeft: "20px",
                  }}
                >
                  Share
                </Button>
              </ShadowRootTooltip>
            ) : null}
          </Grid>

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
