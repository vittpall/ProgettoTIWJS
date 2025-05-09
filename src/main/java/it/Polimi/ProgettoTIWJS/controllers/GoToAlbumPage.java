package it.Polimi.ProgettoTIWJS.controllers;


import it.Polimi.ProgettoTIWJS.dao.CommentDAO;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;
import it.Polimi.ProgettoTIWJS.dao.UserDAO;
import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.Comment;
import it.Polimi.ProgettoTIWJS.beans.Image;


import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@WebServlet("/GoToAlbumPage")
@MultipartConfig
public class GoToAlbumPage extends HttpServlet {
	
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    
    
    public GoToAlbumPage()
    {
    	super();
    }

    public void init() throws ServletException {
        	connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

    	String AlbumTitle = StringEscapeUtils.escapeJava(request.getParameter("albumTitle"));
    	String AlbumCreator = StringEscapeUtils.escapeJava(request.getParameter("albumCreator"));
    	String NextPage = StringEscapeUtils.escapeJava(request.getParameter("Next"));
    	String PrevPage = StringEscapeUtils.escapeJava(request.getParameter("Prev"));

        ImageDAO imageDao = new ImageDAO(connection);
        List<Image> images;
        int idAlbumCreator;
        
        try { 
            idAlbumCreator = Integer.parseInt(AlbumCreator);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Invalid id format: " + e.getMessage());
            return;
        }

        try { 	
            images = imageDao.findImagesByAlbum(AlbumTitle, idAlbumCreator);
            System.out.println(images.size());
            
            
        } catch (SQLException e) {
        	e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Internal server error while retrieving album data: "+ e.getMessage());
            return;
        }
        
        
        String userCreator;
        UserDAO userDao = new UserDAO(connection);
        List<Map<String, Object>> albumData = new ArrayList<>();
        CommentDAO commentDao = new CommentDAO(connection);
        try {
        	for (Image image : images) {
                Map<String, Object> imageData = new HashMap<>();
                System.out.println(image.getSystem_Path());
                imageData.put("System_Path", image.getSystem_Path());
                imageData.put("Title", image.getTitle());
                imageData.put("Image_Id", image.getImage_Id());
                imageData.put("Description", image.getDescription());
                
                List<Comment> comments = commentDao.findCommentsByImage(image.getImage_Id());
                for(Comment comment: comments)
                {
                	comment.setUsername(userDao.getUsernameById(comment.getUser_id()));
                }
                //userCreator = imageDao.CheckCreator(image.getImage_Id());
                imageData.put("Comments", comments);

                albumData.add(imageData);
            }
        } catch (SQLException e)
        {
        	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        	response.getWriter().println("Internal server error while retrieving album data: "+ e.getMessage());
        }
        

        // Convert the map to JSON
      //  String jsonResponse = new Gson().toJson(albumData);

    	Gson gson = new GsonBuilder()
				   .setDateFormat("yyyy MMM dd").create();
		String albumCommentHashMapJson = gson.toJson(albumData);
		
		response.setContentType("application/json");
		response.setCharacterEncoding("UTF-8");
		response.getWriter().write(albumCommentHashMapJson);
       
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
