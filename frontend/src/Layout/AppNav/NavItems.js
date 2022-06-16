export const MainNav = [
  {
    icon: "pe-7s-home",
    label: "Home",
    to: "#/dashboard/home",
  },

  // {
  //   icon: "pe-7s-rocket",
  //   label: "Crowd Safety Analytics",
  //   content: [
  //     {
  //       label: "Social Distancing",
  //       to: "#/crowd-safety/social-distancing",
  //     },
  //     {
  //       label: "Contact Tracing",
  //       to: "#/crowd-safety/contact-tracing",
  //     },
  //     {
  //       label: "Mask Detection",
  //       to: "#/crowd-safety/mask-detection",
  //     },
  //     // {
  //     //   label: "Crowd-Density",
  //     //   to: "#/crowd-safety/crowd-density",
  //     // },
  //     // {
  //     //   label: "Safety-Reporting",
  //     //   to: "#/crowd-safety/safety-reporting",
  //     // },
  //     // {
  //     //   label: "Risk-Prediction",
  //     //   to: "#/crowd-safety/risk-prediction",
  //     // }
  //   ]
  // },
  // {
  //   icon: "pe-7s-diamond",
  //   label: "Automated Queue",
  //   content: [
  //     {
  //       label: "Queue Length Detection",
  //       to: "#/automated-queue/queue-length-detection",
  //     },
  //     {
  //       label: "Waiting Time Analysis",
  //       to: "#/automated-queue/waiting-time-analysis",
  //     },
  //     // {
  //     //   label: "Dwell Time Analysis",
  //     //   to: "#/automated-queue/dwell-time-analysis",
  //     // },
  //     {
  //       label: "Queue Length Prediction",
  //       to: "#/automated-queue/queue-length-prediction",
  //     },
  //     {
  //       label: "Social Distancing Alert",
  //       to: "#/automated-queue/social-distacing-alert",
  //     },
  //     {
  //       label: "Queue Processing Speed",
  //       to: "#/automated-queue/queue-processing-speed",
  //     },
  //   ]
  // },
  // {
  //   icon: "pe-7s-graph2",
  //   label: "Retail Analytics",
  //   content: [
  //     {
  //       label: "Dwell Time Analysis",
  //       to: "#/retail-analytics/dwell-time-analysis",
  //     },
  //     {
  //       label: "Dwell Zone",
  //       to: "#/retail-analytics/dwell-zone",
  //     },
  //     {
  //       label: "Face Detection",
  //       to: "#/retail-analytics/face-detection",
  //     },
  //     {
  //       label: "Heat Map Analysis",
  //       to: "#/retail-analytics/heatmap-analysis",
  //     },
  //     {
  //       label: "Footfall Analysis",
  //       to: "#/retail-analytics/footfall-analysis",
  //     },
  //     {
  //       label: "Path Tracking",
  //       to: "#/retail-analytics/path-tracking",
  //     }
  //   ]
  // },
];

export const AdminNav = [
  {
    icon: "pe-7s-diamond",
    label: "Dashboard",
    to: "#/admindashboard/adminhome",
  },

  {
    icon: "pe-7s-add-user",
    label: "Add Client",
    to: "#/admindashboard/addclient",
  },
  {
    icon: "pe-7s-hourglass",
    label: "Client Requests",
    to: "#/admindashboard/client-requests",
  },
  {
    icon: "pe-7s-rocket",
    label: "Crowd Safety Analytics",
    content: [
      {
        label: "Social Distancing",
        to: "#/crowd-safety/social-distancing",
      },
      {
        label: "Contact Tracing",
        to: "#/crowd-safety/contact-tracing",
      },
      {
        label: "Mask Detection",
        to: "#/crowd-safety/mask-detection",
      },
      {
        label: "Crowd Density",
        to: "#/crowd-safety/crowd-density",
      },
      {
        label: "Safety Reporting",
        to: "#/crowd-safety/safety-reporting",
      },
      {
        label: "Risk Prediction",
        to: "#/crowd-safety/risk-prediction",
      },
    ],
  },
  {
    icon: "pe-7s-joy",
    label: "Automated Queue",
    content: [
      {
        label: "Queue Length Detection",
        to: "#/automated-queue/queue-length-detection",
      },
      {
        label: "Waiting Time Analysis",
        to: "#/automated-queue/waiting-time-analysis",
      },
      {
        label: "Dwell Time Analysis",
        to: "#/automated-queue/dwell-time-analysis",
      },
      {
        label: "Queue Length Prediction",
        to: "#/automated-queue/queue-length-prediction",
      },
      {
        label: "Social Distacing Alert",
        to: "#/automated-queue/social-distacing-alert",
      },
      {
        label: "Queue Processing Speed",
        to: "#/automated-queue/queue-processing-speed",
      },
    ],
  },
  {
    icon: "pe-7s-graph2",
    label: "Retail Analytics",
    content: [
      {
        label: "Dwell Time Analysis",
        to: "#/retail-analytics/dwell-time-analysis",
      },
      {
        label: "Dwell Zone",
        to: "#/retail-analytics/dwell-zone",
      },
      {
        label: "Face Detection",
        to: "#/retail-analytics/face-detection",
      },
      {
        label: "Heatmap Analysis",
        to: "#/retail-analytics/heatmap-analysis",
      },
      {
        label: "Footfall Analysis",
        to: "#/retail-analytics/footfall-analysis",
      },
      {
        label: "Path Tracking",
        to: "#/retail-analytics/path-tracking",
      },
    ],
  },
];

export const CrowdSafetyNav = [
  // {
  //   icon: "pe-7s-rocket",
  //   label: "Crowd Safety Analytics",
  //   content: [
  {
    icon: "pe-7s-attention",

    label: "Social Distancing",
    to: "#/crowd-safety/social-distancing",
  },
  {
    icon: "pe-7s-rocket",
    label: "Contact Tracing",
    to: "#/crowd-safety/contact-tracing",
  },
  {
    icon: "pe-7s-box2",
    label: "Mask Detection",
    to: "#/crowd-safety/mask-detection",
  },
  // {
  //   label: "Crowd-Density",
  //   to: "#/crowd-safety/crowd-density",
  // },
  // {
  //   label: "Safety-Reporting",
  //   to: "#/crowd-safety/safety-reporting",
  // },
  // {
  //   label: "Risk-Prediction",
  //   to: "#/crowd-safety/risk-prediction",
  // }
  // ]
  // },
];

export const QueueManagement = [
  {
    icon: "pe-7s-arc",
    label: "Queue Length Detection",
    to: "#/automated-queue/queue-length-detection",
  },
  {
    icon: "pe-7s-album",
    label: "Waiting Time Analysis",
    to: "#/automated-queue/waiting-time-analysis",
  },
  {
    icon: "pe-7s-diamond",
    label: "Queue Length Prediction",
    to: "#/automated-queue/queue-length-prediction",
  },
  {
    icon: "pe-7s-diamond",
    label: "Social Distancing Alert",
    to: "#/automated-queue/social-distacing-alert",
  },
  {
    icon: "pe-7s-diamond",
    label: "Queue Processing Speed",
    to: "#/automated-queue/queue-processing-speed",
  },
];

export const RetailAnalytics = [
  {
    icon: "pe-7s-anchor",
    label: "Dwell Time Analysis",
    to: "#/retail-analytics/dwell-time-analysis",
  },
  {
    icon: "pe-7s-graph2",
    label: "Dwell Zone",
    to: "#/retail-analytics/dwell-zone",
  },
  {
    icon: "pe-7s-graph2",
    label: "Face Detection",
    to: "#/retail-analytics/face-detection",
  },
  {
    icon: "pe-7s-display1",
    label: "Heat Map Analysis",
    to: "#/retail-analytics/heatmap-analysis",
  },
  {
    icon: "pe-7s-bell",
    label: "Footfall Analysis",
    to: "#/retail-analytics/footfall-analysis",
  },
  {
    icon: "pe-7s-box1",
    label: "Path Tracking",
    to: "#/retail-analytics/path-tracking",
  },
];

export const ClientSpecialFeatures = [
  {
    icon: "pe-7s-add-user",
    label: "Create User",
    to: "#/features/create-user",
  },
  {
    icon: "pe-7s-target",
    label: "Create Branch",
    to: "#/features/create-branch",
  },
  {
    icon: "pe-7s-user",
    label: "Users",
    to: "#/features/active-user",
  },
  {
    icon: "pe-7s-ribbon",
    label: "Branches",
    to: "#/features/branches",
  },
];

export const ReportsNav = [
  {
    icon: "pe-7s-graph3",
    label: "Reports",
    to: "#/site-reports/reports",
  },
  {
    icon: "pe-7s-graph2",
    label: "General Reports",
    to: "#/site-reports/daily",
  },
  {
    icon: "pe-7s-graph",
    label: "Comparison Reports",
    to: "#/site-reports/weekly",
  },
  // {
  //   icon: "pe-7s-timer",
  //   label: "Daily",
  //   to: "#/dashboard/site-reports/daily",
  // },
  // {
  //   icon: "pe-7s-ribbon",
  //   label: "Branches",
  //   to: "#/settings/all",
  // },
];
