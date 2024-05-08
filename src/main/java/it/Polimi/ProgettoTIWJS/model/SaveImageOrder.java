package it.Polimi.ProgettoTIWJS.model;

import java.io.IOException;
import java.sql.SQLException;
import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.util.List;

import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.User;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;
import javax.servlet.annotation.MultipartConfig;
@WebServlet("/SaveImageOrder")
@MultipartConfig
public class SaveImageOrder extends HttpServlet {
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(new Gson().toJson(new ErrorMessage("User not authenticated")));
            return;
        }

        String albumTitle = request.getParameter("albumTitle");
        System.out.println(albumTitle);
        String orderJson = request.getParameter("order");
        List<Integer> order;
        

        try {
            order = new Gson().fromJson(orderJson, new TypeToken<List<Integer>>(){}.getType());
            System.out.println(order);
            if (order == null) {
                throw new IllegalArgumentException("Order data is null");
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write(new Gson().toJson(new ErrorMessage("Order data format error: " + e.getMessage())));
            return;
        }

        ImageDAO imageDao = new ImageDAO(ConnectionHandler.getConnection(getServletContext()));
        try {
            imageDao.saveImageOrder(user.getId(), albumTitle, order);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write(new Gson().toJson(new SuccessMessage("Order saved successfully")));
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(new Gson().toJson(new ErrorMessage("Failed to save image order: " + e.getMessage())));
        }
    }

    private static class ErrorMessage {
        private String message;

        public ErrorMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }

    private static class SuccessMessage {
        private String message;

        public SuccessMessage(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
