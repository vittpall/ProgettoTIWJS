package it.Polimi.ProgettoTIWJS.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
//import java.util.Date;
import java.util.List;
import it.Polimi.ProgettoTIWJS.beans.Image;
import it.Polimi.ProgettoTIWJS.beans.User;


public class ImageDAO {
    private final Connection con;

    public ImageDAO(Connection connection) {
        this.con = connection;
    }

    public List<Image> findImagesByAlbum(String albumTitle, int albumCreator) throws SQLException {
        List<Image> images = new ArrayList<>();
        String query = "SELECT i.Image_id, i.Title, i.System_Path, i.Creation_Date, i.Description FROM `Image` i, Contains_Images c WHERE i.Image_id = c.Image_Id AND c.title = ? AND c.User_Id = ? ORDER BY c.Order_Index ASC";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, albumTitle);
            pstatement.setInt(2, albumCreator);
            try (ResultSet result = pstatement.executeQuery();) {
                while (result.next()) {
                    Image image = new Image();
                    image.setImage_Id(result.getInt("Image_id"));
                    image.setTitle(result.getString("Title"));
                    image.setSystem_Path(result.getString("System_Path"));
                    image.setCreation_Date(result.getDate("Creation_Date"));          
                    image.setDescription(result.getString("Description"));
                    images.add(image);
                }
            }
        }
        return images;
    }

    public void addImage(Image image) throws SQLException {
        String query = "INSERT INTO `Image` (Title, Description, System_Path, Creation_Date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, image.getTitle());
            pstatement.setString(2, image.getDescription());
            pstatement.setString(3, image.getSystem_Path()); 
         // Convert java.util.Date to java.sql.Date
            java.sql.Date sqlDate = new java.sql.Date(image.getCreation_Date().getTime());
            pstatement.setDate(4, sqlDate);
            pstatement.executeUpdate();
        }
    }

    /*
    public void updateImage(Image image) throws SQLException {
        String query = "UPDATE `Image` SET Title = ?, path = ? WHERE Image_Id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, image.getTitle());
            pstatement.setString(2, image.getSystem_Path());
            pstatement.setInt(3, image.getImage_Id());
            pstatement.executeUpdate();
        }
    }
    */

    public void deleteImage(int imageId) throws SQLException {
        String query = "DELETE FROM `Image` WHERE Image_id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setInt(1, imageId);
            pstatement.executeUpdate();
        }
    }

	public int RetrieveLastImageId() throws SQLException {
		int images_id = 0;
		String query = "SELECT Image_id FROM `Image` ORDER BY Image_id DESC LIMIT 1";
		try (PreparedStatement pstatement = con.prepareStatement(query);)
		{
			try(ResultSet result = pstatement.executeQuery())
			{
				while(result.next())
				{
					images_id = result.getInt("Image_id");
				}
			}
		}
		return images_id;
	}
	
	public Image findImageById(int imageId) throws SQLException {
        String query = "SELECT * FROM `Image` WHERE Image_id = ?";
        Image image = null;
        try (PreparedStatement pstatement = con.prepareStatement(query)) {
            pstatement.setInt(1, imageId);
            try (ResultSet result = pstatement.executeQuery()) {
                if (result.next()) {
                    image = new Image();
                    image.setImage_Id(result.getInt("Image_id"));
                    image.setTitle(result.getString("Title"));
                    image.setSystem_Path(result.getString("System_Path"));
                    image.setCreation_Date(result.getDate("Creation_Date"));
                    image.setDescription(result.getString("Description"));
                }
            }
        }
        return image;
    }
	
	public int CheckCreator(int imageId) throws SQLException
	{
		String query = "SELECT User_Id FROM Contains_Images as C, Image as I WHERE C.Image_Id = I.Image_id AND C.Image_Id = ?";
		int user_id = 0;
		try(PreparedStatement pstatement = con.prepareStatement(query))
		{
			pstatement.setInt(1, imageId);
			try(ResultSet result = pstatement.executeQuery())
			{
				if(result.next())
				{
					user_id = result.getInt("User_Id");
				}
			}
		}
		return user_id;
				
	}
	
	public List<Image> RetrieveAllImagesByUser(User user) throws SQLException
	{
        List<Image> images = new ArrayList<>();
        String query = "SELECT DISTINCT i.Image_id, i.Title, i.Creation_Date, i.Description, i.System_Path FROM Image i LEFT JOIN Contains_Images c ON i.Image_id = c.Image_Id  WHERE c.User_Id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query)) {
            pstatement.setInt(1, user.getId());
            try (ResultSet result = pstatement.executeQuery()) {
                while (result.next()) {
                    Image image = new Image();
                    image.setImage_Id(result.getInt("Image_id"));
                    image.setTitle(result.getString("Title"));
                    image.setCreation_Date(result.getDate("Creation_Date"));
                    image.setDescription(result.getString("Description"));
                    image.setSystem_Path(result.getString("System_Path"));                 
                    images.add(image);
                }
            }
        }
        return images;
	}
	
	
	public void AddImagesToAlbum(int imageId, int userId, String title) throws SQLException {
        String query = "INSERT INTO Contains_Images (Image_Id, title, User_Id) VALUES (?, ?, ?)";
        try (PreparedStatement pstatement = con.prepareStatement(query)) {
            pstatement.setInt(1, imageId);
            pstatement.setString(2, title);
            pstatement.setInt(3, userId);
            pstatement.executeUpdate();
        }
    }
	
	public void DeleteFromAlbum (int imageId, String title) throws SQLException
	{
		String query = "DELETE FROM Contains_Images WHERE Image_Id = ? AND title = ?";
	     try (PreparedStatement pstatement = con.prepareStatement(query)) {
	            pstatement.setInt(1, imageId);
	            pstatement.setString(2, title);
	            pstatement.executeUpdate();
	     }
	}
	public void saveImageOrder(int userId, String albumTitle, List<Integer> order) throws SQLException {
		System.out.println("Saving order for user: " + userId + " album: " + albumTitle + " with order: " + order); // Log before executing
		String query = "UPDATE Contains_Images SET Order_Index = ? WHERE User_Id = ? AND title = ? AND Image_Id = ?";
	    try (PreparedStatement pstatement = con.prepareStatement(query)) {
	        for (int i = 0; i < order.size(); i++) {
	            pstatement.setInt(1, i);
	            pstatement.setInt(2, userId);
	            pstatement.setString(3, albumTitle);
	            pstatement.setInt(4, order.get(i));
	            int affectedRows = pstatement.executeUpdate();
	            System.out.println("Updated order index for image: " + order.get(i) + " to position: " + i + ", affected rows: " + affectedRows); // Log after executing
	        }
	    }
	}

    
}
