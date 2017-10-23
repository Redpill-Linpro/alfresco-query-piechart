/**
 * @module alfresco/services/SiteService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Ole Lykke Jacobsen
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/CoreXhr",
   "alfresco/core/NotificationUtils",
   "alfresco/core/ObjectTypeUtils",
   "dojo/request/xhr",
   "dojo/json",
   "dojo/_base/lang",
   "service/constants/Default",
   "alfresco/core/I18nUtils"],
      function(declare, AlfCore, AlfXhr, NotificationUtils, ObjectTypeUtils, xhr, JSON, lang, AlfConstants, I18nUtils) {
	        var i18nScope = "querypiechart.reports.OverviewReportService";
	
	        return declare([AlfCore, AlfXhr, NotificationUtils], {

            OVERVIEW_REPORT: "OVERVIEW_REPORT",
            
            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {Array}
             */
            i18nRequirements: [{i18nFile: "./i18n/OverviewReportService.properties"}],

            /**
             * Sets up the subscriptions for the ReportService
             *
             * @instance
             * @param {array} args The constructor arguments.
             */
            constructor: function alfresco_services_OverviewReportService__constructor(args) {
               lang.mixin(this, args);
               this.alfSubscribe("OVERVIEW_REPORT", lang.hitch(this, this.getOverviewReport));
            },

            /**
             *
             * @instance
             * @param {object} payload The details of the request
             */
            getOverviewReport: function alfresco_services_ReportService__getOverviewReport(payload) {
               var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : "OVERVIEW_REPORT";
               var url = AlfConstants.PROXY_URI + "querydata";
               var selectedWorkflow;
               if (payload.selectedWorkflow)
               {
                  selectedWorkflow = payload.selectedWorkflow;
            	  console.log("getOverviewReport, selectedWorkflow: " + selectedWorkflow);
               }

               var data = {
            		   dashletType: "overview",
                   site: Alfresco.constants.SITE,
            		   labels: [],
            		   queries: []
               };

               switch (selectedWorkflow) {
               case 'users':
                   data.queries.push({query: I18nUtils.msg(i18nScope, "overview.dashlet.piechart.query.properties.s1.value")});
                   break;
               }

               var config = {
                  alfTopic: alfTopic,
                  url: url,
                  data: data,
                  method: "POST",
                  successCallback: this.publishOverviewReport,
                  callbackScope: this
               };
               this.serviceXhr(config);
            },

            publishOverviewReport: function alfresco_services_ReportService__publishOverviewReport(response, requestConfig) {
               this.alfPublish(requestConfig.alfTopic + "_SUCCESS", {
                  requestConfig: requestConfig,
                  response: {
                     data: response,
                     dataDescriptor: {
                        crosstabMode: false,
                        seriesInRows: false
                     }
                  }
               });
            }
         });
      });
