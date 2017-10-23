package org.redpilllinpro.alfresco.querypiechart;

import org.alfresco.service.cmr.site.SiteInfo;
import org.junit.FixMethodOrder;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.redpill.alfresco.test.AbstractComponentIT;

/**
 *
 * @author Marcus Svartmark - Redpill Linpro AB
 */
@FixMethodOrder(MethodSorters.JVM)
public class BootstrapComponentIT extends AbstractComponentIT {

  @Test
  public void testNothing() {
    SiteInfo createSite = createSite();
    
    deleteSite(createSite);
  }
}
