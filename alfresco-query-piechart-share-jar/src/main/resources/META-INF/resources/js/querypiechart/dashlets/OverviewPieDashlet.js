/**
 * OverviewPieDashlet
 *
 * @module alfresco/dashlet/OverviewPieDashlet
 * @extends alfresco/dashlet/Dashlet
 * @author Ole Lykke Jacobsen
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/dashlets/Dashlet",
   "dojo/_base/lang"],
      function(declare, AlfCore, I18nUtils, Dashlet) {

         var i18nScope = "querypiechart.reports.OverviewPieDashlet";
         return declare([Dashlet], {

            /**
             * The i18n scope to use for this widget.
             *
             * @instance
             */
            i18nScope: "querypiechart.reports.OverviewPieDashlet",

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/OverviewPieDashlet.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/OverviewPieDashlet.properties"}],

            /**
             * The widgets to be processed to generate each item in the rendered view.
             *
             * name: "alfresco/reports/SiteContentReport",
             * name: "js/trap/reports/OverviewReport",
             *
             * @instance
             * @type {object[]}
             * @default null
             */
            widgetsForBody: [
               {
                  name: "querypiechart/reports/OverviewReport",
                  config: {
                     title: ""
                  }
               }
            ]

         });
      });