package it.Polimi.ProgettoTIWJS.model;

import javax.servlet.annotation.WebServlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.Album;
import it.Polimi.ProgettoTIWJS.beans.Image;
import it.Polimi.ProgettoTIWJS.beans.User;

import it.Polimi.ProgettoTIWJS.dao.AlbumDAO;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;
import it.Polimi.ProgettoTIWJS.dao.UserDAO;

@WebServlet("/GoToHomePage")
public class GoToHomePage extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    
    public GoToHomePage()
    {
    	super();
    }
    

    public void init() throws ServletException {
        		connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	
    	HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");
        List<User> UserList;
        
        String loginpath = getServletContext().getContextPath() + "/index.html";
        
		if (session.isNew() || session.getAttribute("user") == null) {
			response.sendRedirect(loginpath);
			return;
		}
        if (user == null) {
            response.sendRedirect(loginpath);
            return;
        }
        
        UserDAO userDao = new UserDAO(connection);
        ImageDAO imageDao = new ImageDAO(connection);
        AlbumDAO albumDao = new AlbumDAO(connection);
        List<Image> imagesUser = new ArrayList<>();
        List<Album> UserAlbum = new ArrayList<>();

        Map<User, List<Album>> OtherUserAlbum = new HashMap<>();
        
        try {
        	
        	UserList = userDao.getAllUsers();
            imagesUser = imageDao.RetrieveAllImagesByUser(user);
            UserAlbum = albumDao.findAlbumsByUser(user.getUsername());
            //TODO verify the order of the user inside the userlist, to solve that annoying problem related to refreshing the page
            for (User u : UserList) {
                if (!u.getUsername().equals(user.getUsername())) {
                    List<Album> albums = albumDao.findAlbumsByUser(u.getUsername());
                    OtherUserAlbum.put(u, albums);
                  //  System.out.println("User: " + u.getUsername() + " Albums: " + albums.size()); // Debug statement
                }
            }
        } catch (SQLException e) {
        		
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Unable to retrieve albums"+ e.getMessage());
            return;
        }	
        
    	Gson gson = new GsonBuilder()
				   .setDateFormat("yyyy MMM dd").create();
		String userAlbumJson = gson.toJson(UserAlbum);
		String imageUserJson = gson.toJson(imagesUser);
		String otherUserAlbumJson = gson.toJson(OtherUserAlbum);
		
		
		//pass the json to js
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(userAlbumJson);
		response.getWriter().write(imageUserJson);
		response.getWriter().write(otherUserAlbumJson);
        
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		doGet(request, response);
	}
    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException sqle) {
        }
    }
}