/**
 * OverviewReport gives an overivew of content item and item part statuses
 *
 * @module alfresco/reports/OverviewReport
 * @extends module:alfresco/reports/Report
 * @author Ole Lykke Jacobsen
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/reports/Report",
   "dojo/_base/lang"],
      function(declare, AlfCore, I18nUtils, Report, lang) {
	     var selectedWorkflow = "default";
	     
         var i18nScope = "querypiechart.reports.OverviewReport";

         return declare([Report], {

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/OverviewReport.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/OverviewReport.properties"}],
            
            /**
             * An array of the CSS files to use with this widget.
             *
             * @instance cssRequirements {Array}
             * @type {object[]}
             * @default [{cssFile:"./css/OverviewReport.css"}]
             */
            cssRequirements: [{cssFile:"./css/OverviewReport.css"}],

            /**
             * The CSS class (or a space separated list of classes) to include in the DOM node.
             *
             * @instance
             * @type {string}
             * @default "alfresco-reports-OverviewReport"
             */
            baseClass: "alfresco-reports-OverviewReport",

            /**
             * The widgets to be processed to generate each item in the rendered view.
             *
             * @instance
             * @type {object[]}
             * @default null
             */
            widgets: [
               {
                  name: "alfresco/layout/VerticalWidgets",
                  config: {
                     additionalCssClasses: "bottom-border",
                     widgets: [
                         {
                            name: "alfresco/forms/Form",
                            config: {
                               displayButtons: false,
                               validFormValuesPublishTopic: "SHOW_WORKFLOWS_BY_TYPE",
                               validFormValuesPublishOnInit: false,
                               widgets: [
                                  {
                                     name: "alfresco/forms/controls/DojoSelect",
                                     config: {
                                        name: "selectedWorkflow",
                                        value: selectedWorkflow,
                                        label: "",
                                        description: I18nUtils.msg(i18nScope, "selectedWorkflow"),
                                        optionsConfig: {
                                           fixed: [
                                              {
                                                 label: I18nUtils.msg(i18nScope, "PiechartStatus"),
                                                 value: "default"
                                              }
                                           ]
                                        }
                                     }
                                  }
                               
                               ]
                            }
                         }
                      ]
                    }
                   },
                   {
                      name: "alfresco/charts/ccc/ChartsView",
                      config: {
                    	 dataRequestTopic: "VGRMA_OVERVIEW_REPORT",
                    	 dataRequestPayload: {
                            site: Alfresco.constants.SITE, 
                            selectedWorkflow: selectedWorkflow
                         },
                         subscriptionTopic: "SHOW_WORKFLOWS_BY_TYPE",
                         widgets: [
                            {
                               name: "alfresco/charts/ccc/PieChart",
                               config: {
                                  readers: [
                                     { names: 'category', indexes: 0 },
                                     { names: 'value', indexes: 2 }
                                  ],
                                  explodedSliceRadius: null,
                                  selectable: false,
                                  hoverable:  true,
                                  extensionPoints: {
                                     slice_innerRadiusEx: '55%',
                                     slice_strokeStyle: 'white'
                                  }
                               }
                            }
                         ]
                      }
                   }
                   ]
                });
             });