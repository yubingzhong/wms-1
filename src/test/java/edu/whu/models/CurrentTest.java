package edu.whu.models;

import junit.framework.TestCase;

/**
 * User: hushan
 */
public class CurrentTest extends TestCase {
    Current current=new Current();
    public void test_angel() throws Exception {
        current.setHorizontalStrength(0.4);
        current.setVerticalStrength(0.4);
        assertEquals(45.0,current.getCurrentAngle());
    }
}
