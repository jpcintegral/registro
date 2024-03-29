/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Person from "@material-ui/icons/Person";
//import LibraryBooks from "@material-ui/icons/LibraryBooks";
import BubbleChart from "@material-ui/icons/BubbleChart";
import LocationOn from "@material-ui/icons/LocationOn";
//import Notifications from "@material-ui/icons/Notifications";
//import Unarchive from "@material-ui/icons/Unarchive";
//import Language from "@material-ui/icons/Language";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import Simpatizantes from "views/Simpatizante/Simpatizantes.js";
import Simpatizante  from "views/Simpatizante/Simpatizante.js";
import TableList from "views/TableList/TableList.js";
import UserSystems from "views/UserSystems/UserSystems.js";
import UserForm from "views/UserSystems/UserForm.js";
//import Typography from "views/Typography/Typography.js";
import Icons from "views/Icons/Icons.js";
import Maps from "views/Maps/Maps.js";
//import NotificationsPage from "views/Notifications/Notifications.js";
//import UpgradeToPro from "views/UpgradeToPro/UpgradeToPro.js";
// core components/views for RTL layout
//import RTLPage from "views/RTLPage/RTLPage.js";

const dashboardRoutes = [
 {
    path: "/dashboard",
    name: "REPORTES",
    rtlName: "لوحة القيادة",
    icon: Dashboard,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/UserSystems",
    name: "Usuarios",
    rtlName: "الرموز",
    icon: "content_paste",
    component: UserSystems,
    layout: "/admin",
  },
  {
    path: "/UserForm/:userId?",
    name: "Usuario",
    rtlName: "الرموز",
    icon: Person,
    component: UserForm,
    layout: "/admin",
  },
  {
    path: "/Simpatizantes",
    name: "Simpatizantes",
    rtlName: "ملف تعريفي للمستخدم",
    icon: "content_paste",
    component: Simpatizantes,
    layout: "/admin",
  },
  {
    path: "/Simpatizante/:userId?",
    name: "Simpatizante",
    rtlName: "ملف تعريفي للمستخدم",
    icon: Person,
    component: Simpatizante,
    layout: "/admin",
  },
  {
    path: "/table",
    name: "LISTA DE REGISTROS",
    rtlName: "قائمة الجدول",
    icon: "content_paste",
    component: TableList,
    layout: "/admin",
  },
    {
    path: "/maps",
    name: "MAPA SIMPATIZANTES",
    rtlName: "خرائط",
    icon: LocationOn,
    component: Maps,
    layout: "/admin",
  },
  {
    path: "/icons",
    name: "ICONOS",
    rtlName: "الرموز",
    icon: BubbleChart,
    component: Icons,
    layout: "/admin",
  },
 /* {
    path: "/notifications",
    name: "Notificaciones",
    rtlName: "إخطارات",
    icon: Notifications,
    component: NotificationsPage,
    layout: "/admin",
  },*/
 ];

export default dashboardRoutes;
