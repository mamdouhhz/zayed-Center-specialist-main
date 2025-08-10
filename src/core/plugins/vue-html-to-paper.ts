// src/plugins/vue-html-to-paper.js
import { createApp } from "vue";
import VueHtmlToPaper from "vue-html-to-paper";

const options = {
  name: "_blank",
  specs: ["fullscreen=yes", "titlebar=yes", "scrollbars=yes"],
  styles: [
    "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
    "https://unpkg.com/kidlat-css/css/kidlat.css",
    ,
  ],
  timeout: 1000,
  autoClose: true,
  windowTitle: "Vue Html To Paper - Vue mixin for html elements printing.",
};

export default {
  install(app) {
    app.use(VueHtmlToPaper, options);
  },
};
