package it.Polimi.ProgettoTIWJS.dao;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import it.Polimi.ProgettoTIWJS.beans.Comment;



public class CommentDAO {
    private final Connection con;

    public CommentDAO(Connection connection) {
        this.con = connection;
    }

    public List<Comment> findCommentsByImage(int imageId) throws SQLException {
        List<Comment> comments = new ArrayList<>();
        String query = "SELECT * FROM `Comment` WHERE Image_Id= ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setInt(1, imageId);
            try (ResultSet result = pstatement.executeQuery();) {
                while (result.next()) {
                    Comment comment = new Comment();
                    comment.setUser_id(result.getInt("id"));
                    comment.setText(result.getString("text"));
                    comment.setPublication_date(result.getTimestamp("Publication_date").toLocalDateTime());
                    comments.add(comment);
                }
            }
        }
        return comments;
    }

    public void addComment(Comment comment) throws SQLException {
        String query = "INSERT INTO `Comment` (Text, Id, Image_Id, Publication_date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, comment.getText());
            pstatement.setInt(2, comment.getUser_id());
            pstatement.setInt(3, comment.getImage_id());
          //  pstatement.setDate(4, (java.sql.Date) comment.getPublication_date());
            pstatement.setTimestamp(4, Timestamp.valueOf(comment.getPublication_date()));
            pstatement.executeUpdate();
        }
    }


    public void deleteAllComment(int imageId) throws SQLException {
        String query = "DELETE FROM `Comment` WHERE Id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setInt(1, imageId);
            pstatement.executeUpdate();
        }
    }

}