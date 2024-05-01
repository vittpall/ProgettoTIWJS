package it.Polimi.ProgettoTIWJS.model;


import it.Polimi.ProgettoTIWJS.dao.CommentDAO;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;
import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.Comment;
import it.Polimi.ProgettoTIWJS.beans.Image;


import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
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
import java.util.HashMap;
import java.util.List;

@WebServlet("/GoToAlbumPage")
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
        
        HashMap<Image, List<Comment>> albumCommentHashMap = new HashMap<>();
        CommentDAO commentDao = new CommentDAO(connection);
        List<Comment> comments = null;
        
        
        try {
        	for(Image image: images)
        	{
                comments = commentDao.findCommentsByImage(image.getImage_Id());
                albumCommentHashMap.put(image, comments);
        	}
        } catch (SQLException e)
        {
        	response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        	response.getWriter().println("Internal server error while retrieving album data: "+ e.getMessage());
        }
        
    	Gson gson = new GsonBuilder()
				   .setDateFormat("yyyy MMM dd").create();
		String albumCommentHashMapJson = gson.toJson(albumCommentHashMap);
		
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
