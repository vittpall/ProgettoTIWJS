package it.Polimi.ProgettoTIWJS.controllers;



import it.Polimi.ProgettoTIWJS.dao.AlbumDAO;
import it.Polimi.ProgettoTIWJS.dao.ImageDAO;
import it.Polimi.ProgettoTIWJS.Utils.ConnectionHandler;
import it.Polimi.ProgettoTIWJS.beans.Album;
import it.Polimi.ProgettoTIWJS.beans.Image;
import it.Polimi.ProgettoTIWJS.beans.User;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.UnavailableException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Date;

@WebServlet("/CreateAlbum")
@MultipartConfig
public class CreateAlbum extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Connection connection = null;
    private String folderPath = "";
    private String folderPathToCopyFrom = "";

    public void init() throws ServletException {
    
    		connection = ConnectionHandler.getConnection(getServletContext());
    		ServletContext context = getServletContext();

            // Ensure the directory path is properly initialized and accessible
           folderPath = context.getRealPath("/images/");
           folderPathToCopyFrom = getServletContext().getInitParameter("outputpath");

            File imagesDir = new File(folderPath);
            if (!imagesDir.exists()) {
                imagesDir.mkdirs();
            }
     
      
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        String[] selectedImages = request.getParameterValues("selectedImages");
        
        User user = (User) request.getSession().getAttribute("user");
        if (user == null) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().println("User not logged in");
            return;
        }

        String title = request.getParameter("title");
        if (title == null || title.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().println("Album title cannot be empty");
            return;
        }
        

        Album album = new Album();
        album.setTitle(title);
        album.setUser_id(user.getId());
        album.setUsername(user.getUsername());
        album.setCreation_Date(new Date());
        AlbumDAO albumDao = new AlbumDAO(connection);
        
        try {
            albumDao.createAlbum(album);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().println("Error while creating album: " + e.getMessage());
            return;
        }
        
        if(selectedImages != null)
        {
            int[] Images_Id = new int[selectedImages.length];
            try {
    	        	int i;
    		        for(i = 0; i < Images_Id.length; i++)
    		        {
    					Images_Id[i] = Integer.parseInt(selectedImages[i]);
    					System.out.println(Images_Id[i]);
    		        }
    		        
              	
    		        ImageDAO imageDao = new ImageDAO(connection);
                	for(i = 0; i < selectedImages.length; i++)
                	{
                		Image ImageToAdd = imageDao.findImageById(Images_Id[i]);
                		imageDao.AddImagesToAlbum(ImageToAdd.getImage_Id(), user.getId(), title);
                	}
                	
            }
            catch (NumberFormatException e)
            {
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                response.getWriter().println("An error occurs while parsing the selected images vector" + e.getMessage());
                return;
            }
            
	        catch (SQLException e) {
	            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
	            response.getWriter().println("Error while creating album: " + e.getMessage());
	            return;
	        }
	       
        }

        handleImageUpload(request, response, user, title);

    }

    private void handleImageUpload(HttpServletRequest request, HttpServletResponse response, User user, String title)
            throws ServletException, IOException {
        Part filePart = request.getPart("file"); // Assume the file input name is "file"
        if (filePart != null && filePart.getSize() > 0) {
            String fileName = Paths.get(filePart.getSubmittedFileName()).getFileName().toString();
            String uniqueFileName = System.currentTimeMillis() + "_" + fileName;
            String outputPath = folderPath + uniqueFileName;
            String outputPathBackup = folderPathToCopyFrom + uniqueFileName;
            File file = new File(outputPath);
            File fileBackup = new File(outputPathBackup);
            String description = request.getParameter("description");
            try (InputStream input = filePart.getInputStream()) {
     //       	Files.createDirectories(Paths.get(outputPath).getParent()); // Ensure parent directories exist
                Files.copy(input, file.toPath(), StandardCopyOption.REPLACE_EXISTING);
                storeImageDetails(fileName, "/images/" + uniqueFileName, title, user.getId(),description);
            } catch (IOException e) {
                throw new ServletException("Error while saving file: " + e.getMessage(), e);
            }
            
            try (InputStream input = filePart.getInputStream()) {
     //       	Files.createDirectories(Paths.get(outputPath).getParent()); // Ensure parent directories exists   
                Files.copy(input, fileBackup.toPath(), StandardCopyOption.REPLACE_EXISTING);
            } catch (IOException e) {
                throw new ServletException("Error while saving file: " + e.getMessage(), e);
            }
            
        }
    }

    private void storeImageDetails(String fileName, String path, String title, int userId, String description)
            throws ServletException {
        ImageDAO imageDao = new ImageDAO(connection);
        Image image = new Image();
        image.setCreation_Date(new Date());
        image.setTitle(fileName);
        image.setDescription(description);
        image.setSystem_Path(path);

        try {
            imageDao.addImage(image);
            int imageId = imageDao.RetrieveLastImageId();
            imageDao.AddImagesToAlbum(imageId, userId, title);
        } catch (SQLException e) {
            throw new ServletException("Error while storing image details or linking image to album: " + e.getMessage(), e);
        }
    }

    public void destroy() {
        try {
            if (connection != null) {
                connection.close();
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    
    /*
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
    */
}
