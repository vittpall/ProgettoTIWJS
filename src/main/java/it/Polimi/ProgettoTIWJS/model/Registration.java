package it.Polimi.ProgettoTIWJS.model;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.thymeleaf.TemplateEngine;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ServletContextTemplateResolver;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
//import java.time.LocalDateTime;
//import java.sql.Date;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.User;
import it.Polimi.ProgettoTIWJS.dao.UserDAO;


@WebServlet("/Register")
@MultipartConfig
public class Registration extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;

    public void init() throws ServletException {
        connection = ConnectionHandler.getConnection(getServletContext());
    }
    
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
        
        String usrn = request.getParameter("username");
        String email = request.getParameter("email");
        String pwd1 = request.getParameter("password");
        String pwd2 = request.getParameter("confirmPassword");
        Gson gson = new GsonBuilder()
                .setDateFormat("yyyy MMM dd").create();
		Map<String, Object> responseData = new HashMap<>();

		//json string to pass 
		String wrongEmail = null;
		String pswNotMatch = null;
		String usernameAlreadyTaken = null;
		
		 
        boolean testpwd = true;
        boolean testemail = true;
        
        Date currentDateTime = new Date();
        User new_user = new User();
     //   String path = "/registration.html"; // Note the leading slash if it is in the root
        

        boolean errorDetected = false;
      
        //check if pass and rep pass are equals
        testpwd = pwd1.equals(pwd2);

        if (!testpwd) {
        	/*
            new_user.setEmail(email);
            new_user.setPassword(pwd1);
            new_user.setUsername(usrn);
            request.getSession().setAttribute("user", new_user);
            */
        	pswNotMatch = "The password aren't equals";

            errorDetected = true;
        }

        
        testemail = CheckEmail(email);
        //check email syntax
        
        if (!testemail) {
        	/*
            new_user.setEmail(email);
            new_user.setPassword(pwd1);
            new_user.setUsername(usrn);
            request.getSession().setAttribute("user", new_user);
            */
        	wrongEmail = "wrong email format";
        	
            errorDetected = true;
        }
        

        UserDAO userDao = new UserDAO(connection);
        try {

        	if (userDao.checkUsrn(usrn) > 0) {
                errorDetected = true;
                usernameAlreadyTaken = "Username already taken, choose another one";
                	
            }

        } catch (SQLException e) {
        	//500
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Internal server error, retry later");
            e.printStackTrace();
            return;
        }

        if (!errorDetected) {
            try {
            	//200
                new_user.setEmail(email);
                new_user.setPassword(pwd1);
                new_user.setUsername(usrn);
                new_user.setReg_Date(currentDateTime);
                userDao.registerUser(new_user);
      //          path = "/index.html"; // Redirect to login page after successful registration
      
                responseData.put("wrongEmailJson", "correct");
                responseData.put("pswNotMatchJson", "correct");
                responseData.put("usernameAlreadyTakenJson", "correct");
                
                String jsonResponse = gson.toJson(responseData);
        		response.setContentType("application/json");
        		response.setCharacterEncoding("UTF-8");
        		response.getWriter().write(jsonResponse);
                response.setStatus(HttpServletResponse.SC_OK);
        //        response.getWriter().println("Registration successful");
                
                return;
            } catch (SQLException e) {
            	//400
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                return;
               
            }
            
        }
        else
        {
        	
            responseData.put("wrongEmailJson", wrongEmail);
            responseData.put("pswNotMatchJson", pswNotMatch);
            responseData.put("usernameAlreadyTakenJson", usernameAlreadyTaken);
            
            String jsonResponse = gson.toJson(responseData);
    		response.setContentType("application/json");
    		response.setCharacterEncoding("UTF-8");
    		response.getWriter().write(jsonResponse);
    		response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            return;
        }
    

     
       

    }
    

    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException sqle) {
        }
    }
    
    private boolean CheckEmail(String email) {
        //Regular expression for basic email validation
        //i suppose that emails which contain '.' or '-' are acceptable
        String pattern = "^[\\w.-]+@[a-zA-Z\\d.-]+\\.[a-zA-Z]{2,}$";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(email);
        return matcher.matches();
    }
}