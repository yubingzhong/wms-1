<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<div id="login-form">
<form action="<spring:url value="/j_spring_security_check"/>" method="post"><div style="margin:0;padding:0;display:inline"><input name="authenticity_token" type="hidden" value="2Z/zcS4JR4JFBJXnJYWZvp7W8OwA0SyXWEr0+2mVquc="></div>
<input id="back_url" name="back_url" type="hidden" value="http%3A%2F%2F115.238.91.226%3A60004%2Fredmine">
<table>
<tbody><tr>
    <td align="right"><label for="j_username">登录名:</label></td>
    <td align="left"><input id="j_username" name="j_username" tabindex="1" type="text"></td>
</tr>
<tr>
    <td align="right"><label for="j_password">密码:</label></td>
    <td align="left"><input id="j_password" name="j_password" tabindex="2" type="password"></td>
</tr>

<tr>
    <td></td>
    <td align="left">

        <label for="autologin"><input id="autologin" name="autologin" tabindex="4" type="checkbox" value="1"> 保持登录状态</label>

    </td>
</tr>
<tr>
    <td align="left">

            <a href="<spring:url value="/j_spring_security_check"/>">忘记密码</a>

    </td>
    <td align="right">
        <input type="submit" name="login" value="登录 »" tabindex="5">
    </td>
</tr>
</tbody></table>
<script type="text/javascript">

Form.Element.focus('username');

</script>
</form>
</div>
