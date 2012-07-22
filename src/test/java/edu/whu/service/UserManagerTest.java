package edu.whu.service;

import com.google.common.collect.Lists;
import edu.whu.models.User;
import org.junit.Before;
import org.junit.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.GrantedAuthorityImpl;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.AbstractTransactionalJUnit4SpringContextTests;

import javax.annotation.Resource;
import java.util.Collection;

import static junit.framework.Assert.assertNotNull;
import static junit.framework.Assert.assertTrue;

/**
 * author: Hill.Hu
 */
@ContextConfiguration(locations = {"classpath:spring/datasource.xml"})
public class UserManagerTest extends AbstractTransactionalJUnit4SpringContextTests {

    @Resource
    private UserManager userManager;
    private User user;

    @Before
    public void setUp() throws Exception {

        userManager.init();
        GrantedAuthority auth = new GrantedAuthorityImpl("admin");
        Collection<? extends GrantedAuthority> auths = Lists.newArrayList(auth);
        user = new User("hill", "123", true, true, true, true, auths);
    }

    @Test
    public void test_create() throws Exception {
        userManager.registerUser(user);

        User user1 = userManager.loadUserByUsername(user.getUsername());
        assertTrue(user1.isEnabled());
    }
}
