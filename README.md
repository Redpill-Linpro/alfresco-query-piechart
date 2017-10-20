# Alfresco Query Piechart
This module is meant to provide a customizable piechart dashlet solution. It is configured to work as a piechart based on queries and labels of your own choice.  

# Structure
This module consists of a repository module.
# Installation


Add the following dependency to your main pom.xml file
```
<dependency>
	<groupId>org.redpill-linpro.alfresco.query-piechart</groupId>
	<artifactId>alfresco-query-piechart-share-jar</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>
```

Repository dependency:
```  
<dependency>
        <groupId>org.redpill-linpro.alfresco.query-piechart</groupId>
        <artifactId>alfresco-query-piechart-platform-jar</artifactId>
</dependency>
```
# Configuration

You need to create a new webscript for each new pie-dashlet that you want to implement refer to `overview-pie.get.desc.xml`, `overview-pie.get.html.ftl`, `overview-pie.get.js` for example

You will also need to implement a module:
```
<modules>
        <module>
          <id>Add overview Dashlets and widgets</id>
          <auto-deploy>true</auto-deploy>
          <version>${project.version}</version>
          <configurations>
              <config evaluator="string-compare" condition="WebFramework" replace="false">
                  <web-framework>
                      <dojo-pages>
                          <packages>
                              <package name="querypiechart" location="js/querypiechart"/>
                          </packages>
                      </dojo-pages>
                  </web-framework>
              </config>
          </configurations>
        </module>
```


Refer to `OverviewReportService.js`, `OverviewReport.js` and `OverviewPieDashlet.js` and representive propertie file for examples on how  to  customize the dashlet with oppertunities for extending the dropdown-box for multiple Piecharts.


Configure your queries and labels through the alfresco-global.properties files as example below.
```
## Necessary global values to implement
cache.timeout.ms=6000
piechart.properties=piechart.query3,piechart.query4,piechart.query5

## Below are examples of queries with labels, each query requires a lable
piechart.query3=cm:userName:admin
piechart.query3.label=Admin

piechart.query4=cm:userName:abeecher
piechart.query4.label=Alice Beecher

piechart.query5=cm:userName:mjackson
piechart.query5.label=Mike Jackson
```

Remember to always have the same amount of labels as there are queries.
  
 
