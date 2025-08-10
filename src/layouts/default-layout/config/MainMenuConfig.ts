export interface MenuItem {
  heading?: string;
  sectionTitle?: string;
  route?: string;
  pages?: Array<MenuItem>;
  keenthemesIcon?: string;
  bootstrapIcon?: string;
  sub?: Array<MenuItem>;
}
const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "الصفحة الرئيسية",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-app-indicator",
      },
      // {
      //   heading: "ExternalUser",
      //   route: "/ExternalUser-list",
      //   keenthemesIcon: "element-11",
      //   bootstrapIcon: "bi-app-indicator",
      // },

      {
        heading: "قائمة المرضى",
        route: "/patients-list",
        keenthemesIcon: "virus",
        bootstrapIcon: "bi-app-indicator",
      },
      {
        heading: "جلساتي",
        route: "/specialistSessions-list",
        keenthemesIcon: "calendar",
        bootstrapIcon: "bi-app-indicator",
      },
    ],
  },
];

export default MainMenuConfig;
