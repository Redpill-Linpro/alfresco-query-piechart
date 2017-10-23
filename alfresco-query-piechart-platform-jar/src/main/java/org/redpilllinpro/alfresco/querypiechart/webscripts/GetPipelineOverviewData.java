package org.redpilllinpro.alfresco.querypiechart.webscripts;

import java.io.IOException;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.alfresco.service.cmr.repository.NodeRef;
import org.alfresco.service.cmr.repository.StoreRef;
import org.alfresco.service.cmr.search.ResultSet;
import org.alfresco.service.cmr.search.SearchParameters;
import org.alfresco.service.cmr.search.SearchService;
import org.alfresco.util.ExpiringValueCache;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.extensions.webscripts.Cache;
import org.springframework.extensions.webscripts.DeclarativeWebScript;
import org.springframework.extensions.webscripts.Status;
import org.springframework.extensions.webscripts.WebScriptException;
import org.springframework.extensions.webscripts.WebScriptRequest;
import java.util.Properties;

public class GetPipelineOverviewData extends DeclarativeWebScript {

  private static final Logger LOG = Logger.getLogger(GetPipelineOverviewData.class);

  private SearchService searchService;
  private Long cacheTimeoutInMS = 120000L;
  private Properties globalProperties;

  public static enum dashletTypes {
    querydata
  }

  public void setSearchService(SearchService searchService) {
    this.searchService = searchService;
  }


  public void setCacheTimeoutInMS(Long cacheTimeoutInMS) {
    this.cacheTimeoutInMS = cacheTimeoutInMS;
  }


  public void setGlobalProperties(Properties globalProperties) {
    this.globalProperties = globalProperties;
  }

  private ExpiringValueCache<Map<String, Integer>> cachedSavedSearches = new ExpiringValueCache<Map<String, Integer>>(cacheTimeoutInMS);

  @Override
  protected Map<String, Object> executeImpl(WebScriptRequest req, Status status, Cache cache) {
    Map<String, Object> model = new HashMap<>();

    JSONArray queriesProperty = null;

    List<Map<String, Serializable>> stats;
       String dashletType;
       String site;
    try {
      JSONObject json = new JSONObject(new JSONTokener(req.getContent().getContent()));
      dashletType = json.getString("dashletType");
      if (json.has("site")) {
        site = json.getString("site");
      }
      queriesProperty = json.getJSONArray("queries");
      if (queriesProperty == null || queriesProperty.length() == 0) {
        throw new WebScriptException(Status.STATUS_INTERNAL_SERVER_ERROR, "Should include one or more queries");
      }

      List<String> props = new ArrayList<>();
      for (int i = 0; i < queriesProperty.length(); i++) {
        String query = queriesProperty.getJSONObject(i).getString("query");
        String propsString = (String) globalProperties.get(query);
        props.addAll(Arrays.asList(propsString.split("\\s*,\\s*")));
      }
      List<String> queries = new ArrayList<>();
      List<String> labels = new ArrayList<>();
      for (String prop : props) {
        queries.add((String) globalProperties.get(prop));
        String label = (String) globalProperties.get(prop + ".label");
        labels.add(label);
      }

      if (labels.size() != queries.size()) {
        throw new WebScriptException(Status.STATUS_INTERNAL_SERVER_ERROR, "Labels and queries should be of the same amount");
      }

      stats = generateStats(labels, queries);

    } catch (JSONException e) {
      throw new WebScriptException(Status.STATUS_INTERNAL_SERVER_ERROR, "Could not generate a result", e);
    } catch (IOException e) {
      throw new WebScriptException(Status.STATUS_INTERNAL_SERVER_ERROR, "Could not read parameter", e);
    }
    model.put("stats", stats);
    model.put("result", generateResult());
    model.put("numberFound", 1);
    model.put("resultSize", stats.size());
    return model;
  }

  private List<Map<String, Serializable>> generateStats(List<String> labels, List<String> queries) throws JSONException {
    List<Map<String, Serializable>> stats = new ArrayList<>();
    //s1..sn
    for (int i = 0; i < queries.size(); i++) {
      String label = labels.get(i);
      String query = queries.get(i);
      stats.add(createItem(label, getFolders(query)));
    }
    return stats;
  }

  private int getFolders(String query) {
    int count = 0;

    if (null == cachedSavedSearches.get()) {
      cachedSavedSearches.put(new HashMap<>(1));
      LOG.debug("------>>> Cache was not initialized");
    }

    if (cachedSavedSearches.get().containsKey(query)) {
      //LOG.debug("------>>> Found entry in saved search cache");
      return cachedSavedSearches.get().get(query);
    }

    SearchParameters params = new SearchParameters();
    StoreRef storeRef = new StoreRef(StoreRef.PROTOCOL_WORKSPACE, "SpacesStore");
    params.setLanguage(SearchService.LANGUAGE_FTS_ALFRESCO);
    params.addStore(storeRef);
    params.setQuery(query);
    ResultSet results = null;
    try {
      results = searchService.query(params);
      List<NodeRef> nodeRefs = results.getNodeRefs();
      count = results.length();
      if (LOG.isDebugEnabled()) {
        LOG.debug("------>>> Found: " + count + " (" + nodeRefs.size() + ")" + " for query: " + query);
      }
    } finally {
      if (results != null) {
        results.close();
      }
    }

    cachedSavedSearches.get().put(query, count);

    return count;
  }

  private Map<String, Serializable> createItem(String name, int value) {
    Map<String, Serializable> item = new HashMap<>();
    item.put("name", name);
    item.put("sum", value);
    item.put("count", value);
    item.put("min", value);
    item.put("max", value);
    item.put("mean", value);

    return item;
  }

  private Map<String, Serializable> generateResult() {
    Map<String, Serializable> result = new HashMap<>();
    result.put("numberFound", 10);
    result.put("sum", 15);
    result.put("count", 20);
    result.put("min", 25);
    result.put("max", 30);
    result.put("mean", 35);

    return result;
  }
}
