model.jsonModel = {
   rootNodeId: args.htmlid,
   pubSubScope: instance.object.id,
   services: [
      {
         name: "querypiechart/services/OverviewReportService"
      }
   ], widgets: [
      {
         id: "DASHLET",
         name: "querypiechart/dashlets/OverviewPieDashlet"
      }
   ]
};
