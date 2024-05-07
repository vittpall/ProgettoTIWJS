package it.Polimi.ProgettoTIWJS.model;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringEscapeUtils;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import it.Polimi.ProgettoTIWJS.beans.User;
import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.Comment;

import it.Polimi.ProgettoTIWJS.dao.CommentDAO;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

@WebServlet("/AddComment")
@MultipartConfig
public class AddComment extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    
    public AddComment()
    {
    	super();
    }

    public void init() throws ServletException {
    	connection = ConnectionHandler.getConnection(getServletContext());
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String commentText =StringEscapeUtils.escapeJava( request.getParameter("comment"));
        System.out.println(commentText);
        String albumTitle = StringEscapeUtils.escapeJava(request.getParameter("albumTitle"));
        System.out.println(albumTitle);
        String image_id = StringEscapeUtils.escapeJava(request.getParameter("imageId"));
        System.out.println(image_id);
        
        int imageId;
        try {
            imageId = Integer.parseInt(image_id);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Invalid image ID format: " +e.getMessage());
            return;
        } 

        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("User not logged in");
            return;
        }

        if (commentText == null || commentText.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Comment cannot be empty");
            return;
        }

        CommentDAO commentDao = new CommentDAO(connection);
        try {
            Comment comment = new Comment();
            comment.setText(commentText);
            comment.setImage_id(imageId);
            comment.setUser_id(user.getId());
            comment.setPublication_date(LocalDateTime.now());
          
           
            commentDao.addComment(comment); 
            
            List<Comment> updatedComments = commentDao.findCommentsByImage(imageId);
            // Convert the Comment object to JSON
            Gson gson = new GsonBuilder().setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ").create();
            String jsonComment = gson.toJson(updatedComments);

            // Set the response type and character encoding
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonComment);

            System.out.println("Comment added succesfully");
           // response.sendRedirect(getServletContext().getContextPath() + "/GoToImagePage?Image_id=" + imageId +"&albumTitle=" + albumTitle);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Error while adding comment: " + e.getMessage());
        }
    }
    
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
    	//consider that i cannot retriever userId from the image id
    	ImageDAO imageDao = new ImageDAO(connection);
    	CommentDAO commentsDao = new CommentDAO(connection);
    	String albumTitle = StringEscapeUtils.escapeJava(request.getParameter("albumTitle"));
    	String image_id = StringEscapeUtils.escapeJava(request.getParameter("imageId"));
    	
    	int imageCreator = 0;
    	
    	int imageId;
        
        try {
            imageId = Integer.parseInt(image_id);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Invalid image ID format");
            return;
        }
        
        User user = (User) request.getSession().getAttribute("user");
        System.out.println((User) request.getSession().getAttribute("username"));
        System.out.println((User) request.getSession().getAttribute("user"));
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("User not logged in");
            return;
        }
        
    	try {
			imageCreator = imageDao.CheckCreator(imageId);
		} catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Error adding the comment: " + e.getMessage());
		}
    	
    	
            try {
            	
            	commentsDao.deleteAllComment(imageId);
            	imageDao.deleteImage(imageId);
            	imageDao.DeleteFromAlbum(imageId, albumTitle);
            	
            	System.out.println("Comment succesfully deleted");
            	response.setStatus(HttpServletResponse.SC_OK);
            //	response.sendRedirect(getServletContext().getContextPath() + "/GoToAlbumPage?albumTitle=" + albumTitle + "&albumCreator=" + user.getId());
            } catch (SQLException e) {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().println("Error while deleting comment");
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
}
