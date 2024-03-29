package edu.whu.security;

import edu.whu.service.UserManager;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import javax.annotation.Resource;
import java.security.Principal;
import java.util.HashSet;
import java.util.Set;

/**
 * @author Hill.Hu
 * @see org.springframework.security.taglibs.velocity.Authz
 */
@SuppressWarnings("unused")
public class SimpleAuthz {
    private static Logger logger = LoggerFactory.getLogger(SimpleAuthz.class);
    public static final String USER_PRINCIPAL = "userPrincipal";


    @Resource
    private UserManager userManager;

    /**
     * Get the username of the user
     *
     * @return the username of the user
     */
    public String getPrincipal() {
        Principal obj = getUserPrincipal();

        if (obj != null) {
            return obj.getName();
        } else {
            return "guest";
        }
    }

    public boolean isAuthenticated() {
        return getUserPrincipal().isAuthenticated() && ! "anonymousUser".equalsIgnoreCase(getPrincipal());
    }

    private Authentication getUserPrincipal() {

        return SecurityContextHolder.getContext().getAuthentication();
    }

    /**
     * Is the user granted all of the supplied roles
     *
     * @return true if user has all of the listed roles, otherwise false
     */
    public boolean allGranted(String roleList) {
        Set<String> userRoles = getUserRoles();
        String[] roles = roleList.split(",");
        for (String role : roles) {
            if (userRoles.contains(role))
                continue;
            return false;
        }
        return true;
    }

    /**
     * Is the user granted any of the supplied roles
     *
     * @return true if user has any of the listed roles, otherwise false
     */
    public boolean anyGranted(String roleList) {
        Set<String> userRoles = getUserRoles();
        String[] roles = roleList.split(",");
        for (String role : roles) {
            if (userRoles.contains(role))
                return true;
        }
        return false;
    }

    /**
     * is the user granted none of the supplied roles
     *
     * @return true only if none of listed roles are granted
     */
    public boolean noneGranted(String roleList) {
        Set<String> userRoles = getUserRoles();
        String[] roles = roleList.split(",");
        for (String role : roles) {
            if (userRoles.contains(role))
                return false;
        }
        return true;

    }


    private Set<String> getUserRoles() {
//        Object obj = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
//        Set<String> roles = new HashSet<String>();
//        if (obj instanceof UserDetails) {
//            Collection<? extends GrantedAuthority> gas = ((UserDetails) obj).getAuthorities();
//            for (GrantedAuthority ga : gas) {
//                roles.add(ga.getAuthority());
//            }
//        }
//        return roles;
        Set<String> roles = new HashSet<String>();


        return roles;
    }


    public boolean isAdmin() {
        String principal = getPrincipal();
        return userManager.isSystemAdmin(principal);
    }

    public void setUserManager(UserManager userManager) {
        this.userManager = userManager;
    }
}
