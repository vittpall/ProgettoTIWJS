package it.Polimi.ProgettoTIWJS.model;

import javax.servlet.annotation.WebServlet;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
        		ServletContext context = getServletContext();
                // Ensure the directory path is properly initialized and accessible
                String folderPath = context.getRealPath("/images/");
                String folderPathToCopyFrom = getServletContext().getInitParameter("outputpath");
      
                 File imagesDir = new File(folderPath);
                 if (!imagesDir.exists()) {
                     imagesDir.mkdirs();
                 }
                 
                 Path sourceDir = Paths.get(folderPathToCopyFrom);
                 Path targetDir = Paths.get(folderPath);
                 
                 CopyFileToDeployedFolder(sourceDir, targetDir);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        HttpSession session = request.getSession();
        User user = (User) session.getAttribute("user");

        String loginpath = getServletContext().getContextPath() + "/index.html";

        // Check for session validity
        if (session.isNew() || user == null) {
            response.sendRedirect(loginpath);
            return;
        }

        UserDAO userDao = new UserDAO(connection);
        ImageDAO imageDao = new ImageDAO(connection);
        AlbumDAO albumDao = new AlbumDAO(connection);

        try {
            List<User> userList = userDao.getAllUsers(); // Retrieve all users
            List<Image> imagesUser = imageDao.RetrieveAllImagesByUser(user); // Images for the logged-in user
            List<Album> userAlbum = albumDao.findAlbumsByUser(user.getUsername()); // Albums for the logged-in user
            Map<String, List<Album>> otherUserAlbum = new HashMap<>(); // Albums from other users

            // Populate albums for other users
            for (User u : userList) {
                if (!u.getUsername().equals(user.getUsername())) {
                    List<Album> albums = albumDao.findAlbumsByUser(u.getUsername());
                    otherUserAlbum.put(u.getUsername(), albums);
                }
            }

      
            Gson gson = new GsonBuilder()
                           .setDateFormat("yyyy MMM dd").create();
            Map<String, Object> responseData = new HashMap<>();
            responseData.put("userAlbumJson", userAlbum);
            responseData.put("imageUserJson", imagesUser);
            responseData.put("otherUserAlbumJson", otherUserAlbum);

            String jsonResponse = gson.toJson(responseData);
            
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonResponse);

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Unable to retrieve albums: " + e.getMessage());
        }
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
    
    private void CopyFileToDeployedFolder(Path sourceDir, Path targetDir)
    {
        try {
            // Create the target directory if it doesn't exist
            Files.createDirectories(targetDir);

            // Copy all files from the source directory to the target directory
            Files.walk(sourceDir)
                 .filter(Files::isRegularFile)
                 .forEach(source -> {
                     Path target = targetDir.resolve(sourceDir.relativize(source));
                     try {
                         Files.copy(source, target, StandardCopyOption.REPLACE_EXISTING);
                     } catch (IOException e) {
                         System.err.println("Failed to copy " + source + " to " + target + ": " + e);
                     }
                 });

            System.out.println("All files copied successfully!");
        } catch (IOException e) {
            System.err.println("Failed to copy files: " + e);
        }
    }
}