package edu.whu.service;

import com.google.common.collect.Lists;
import edu.whu.excetption.RegisterException;
import edu.whu.models.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.Assert;

import javax.annotation.Resource;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * author: Hill.Hu
 */
public class UserManager implements UserDetailsService {
    private static Logger logger = LoggerFactory.getLogger(UserManager.class);
    @Resource
    private JdbcTemplate jdbcTemplate;


    public static final String COLLECTION_NAME_USER = "system_user";
    public static final String LIST_SEPARATOR = ",";

    /**
     * admin user ,separated by comma ,
     */
    private String systemAdmins="admin";

    private String systemAdminInitPassword = "123456";


    public void init() {
        try {
            jdbcTemplate.execute("CREATE TABLE users\n" +
                    "(\n" +
                    "  username  character varying(50),\n" +
                    "  password  character varying(50),\n" +
                    "  enabled boolean \n" +
                    " ) ");
            jdbcTemplate.execute("CREATE TABLE authorities\n" +
                    "(\n" +
                    "  username character varying(50),\n" +
                    "  authority character varying(50)\n" +
                    ")");
        } catch (DataAccessException e) {
            logger.debug("table has ready for use: {}",e.getCause().getMessage());
        }
        for (String username : loadAdmins()) {
            User user = loadUserByUsername(username);
            if (user == null) {
                logger.info("create a  system user [{}] ", username);
                user = new User(username, systemAdminInitPassword, true);
                try {
                    registerUser(user);
                } catch (RegisterException e) {
                    logger.error("init system user err", e);
                }
            }
        }
    }


    public List<User> listUsers() {
        List<User> users = jdbcTemplate.query("select username,password,enabled from users ", new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet resultSet, int i) throws SQLException {
                User user = new User();
                user.setUsername(resultSet.getString(1));
                user.setPassword(resultSet.getString(2));
                user.setEnabled(resultSet.getBoolean(3));

                return user;
            }
        });
        return users;
    }

    public void registerUser(User user) throws RegisterException {
        Assert.hasLength(user.getUsername(), "username can't  be empty");
        Assert.hasLength(user.getPassword(), "password can't  be empty");
        if (loadUserByUsername(user.getUsername()) != null) {
            throw new RegisterException("err.username_has_exist");
        }
        logger.info("register a user = {} ", user);
        saveUser(user);

    }

    public void removeUser(String username) {
        logger.info("remove user by username ={}", username);
        User user = new User();
        user.setUsername(username);

    }


    public User loadUserByUsername(String username) throws UsernameNotFoundException {
        logger.debug("try load user by username={}", username);

        List<User> users = jdbcTemplate.query("select username,password,enabled from users where username=? " , new Object[]{username}, new RowMapper<User>() {
            @Override
            public User mapRow(ResultSet resultSet, int i) throws SQLException {
                User user = new User();
                user.setUsername(resultSet.getString(1));
                user.setPassword(resultSet.getString(2));
                user.setEnabled(true);

                return user;
            }
        });
        if (users.isEmpty())
            return null;
        User user = users.get(0);
        logger.debug("load user success {}",user);
        return user;
    }


    public boolean isSystemAdmin(String username) {
        return loadAdmins().contains(username);
    }

    /**
     * monitor user by system administrator
     *
     * @param user
     */

    public void monitorUser(User user) {
        Assert.isTrue(!isSystemAdmin(user.getUsername()),
                "system user can't be monitor, please do that by change system properties config ,username=" + user.getUsername());
        User dbUser = loadUserByUsername(user.getUsername());
        Assert.notNull(dbUser);
        if (dbUser.isEnabled() != user.isEnabled()) {
            logger.info("change user enabled  {}", user);
            dbUser.setEnabled(user.isEnabled());
            saveUser(dbUser);

        }
    }

    private void saveUser(User user) {
        Assert.hasLength(user.getUsername(), "username can't  be empty");
        Assert.hasLength(user.getPassword(), "password can't  be empty");

        int count = jdbcTemplate.update("update users set password=? , enabled=?  where username=? ", user.getPassword(), user.isEnabled(), user.getUsername());
        if (count == 0) {
            jdbcTemplate.update("insert into users (username,password,enabled) values (?  ,? ,?)", user.getUsername(), user.getPassword(), user.isEnabled());
        }
    }


    public List<String> loadAdmins() {
        return Lists.newArrayList(systemAdmins.split(LIST_SEPARATOR));
    }


    public void setSystemAdmins(String systemAdmins) {
        this.systemAdmins = systemAdmins;
    }

    public void setSystemAdminInitPassword(String systemAdminInitPassword) {
        this.systemAdminInitPassword = systemAdminInitPassword;
    }

    public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
}
