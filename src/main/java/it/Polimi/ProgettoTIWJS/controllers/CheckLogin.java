package it.Polimi.ProgettoTIWJS.controllers;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

import it.Polimi.ProgettoTIWJS.beans.User;
import it.Polimi.ProgettoTIWJS.dao.UserDAO;
import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;

@WebServlet("/CheckLogin")
@MultipartConfig
public class CheckLogin extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public void init() throws ServletException {

        	connection = ConnectionHandler.getConnection(getServletContext());

    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String usrn = null;
        String pwd = null;
		usrn = StringEscapeUtils.escapeJava(request.getParameter("username"));
		pwd = StringEscapeUtils.escapeJava(request.getParameter("password"));
        HttpSession session = request.getSession(); 

        if (usrn == null || pwd == null || usrn.isEmpty() || pwd.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Did you insert something?");
            return;
        }

        UserDAO userDao = new UserDAO(connection);
        User user = null;
        try {
            user = userDao.checkCredentials(usrn, pwd);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Internal server error, retry later");
            return;
        }
        
        if (user == null) {
    		response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
			response.getWriter().println("Incorrect credentials");
        } else {
            session.setAttribute("user", user); 
          
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().println(user.getId()); 
            System.out.println("current user" + user.getUsername());
            response.setStatus(HttpServletResponse.SC_OK);
        }
    }

    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException sqle) {
        	sqle.printStackTrace();
        }
    }
}