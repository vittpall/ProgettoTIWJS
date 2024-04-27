package it.Polimi.ProgettoTIWJS.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.ArrayList;
import java.util.List;

import it.Polimi.ProgettoTIWJS.beans.User;

public class UserDAO {
    private final Connection con;

    public UserDAO(Connection connection) {
        this.con = connection;
    }

    public User checkCredentials(String username, String password) throws SQLException {
        
        String query = "SELECT Id, Username, Password FROM User WHERE Username = ? AND Password = ?";

        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, username);
            pstatement.setString(2, password);
            try (ResultSet result = pstatement.executeQuery();) {
                if (!result.isBeforeFirst())
                    return null;
                else {
                    result.next();
                    User user = new User();
                    user.setId(result.getInt("Id"));
                    user.setUsername(result.getString("Username"));
                    user.setPassword(result.getString("Password"));
                    return user;
                }
            }
        }
    }
    
    public int checkUsrn(String username) throws SQLException {
        String query = "SELECT COUNT(*) as users_count FROM `User` WHERE Username = ?";
        int users_count = 0;
        
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, username);
            try (ResultSet result = pstatement.executeQuery();) {
               /* if (!result.isBeforeFirst())
                    return -1;
                else {
                    users_count = result.getInt("users_count");
                    return users_count;
                } */
                if (result.next()) { // Ensure the cursor is moved to the first record
                    users_count = result.getInt("users_count");
                }
                return users_count;
            }
        }
    }

    public void registerUser(User user) throws SQLException {
        String query = "INSERT INTO `User` (Username, Email, Password, Reg_Date) VALUES (?, ?, ?, ?)";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
        	//pstatement.setInt(1, user.getId());
            pstatement.setString(1, user.getUsername());
            pstatement.setString(2, user.getEmail());
            pstatement.setString(3, user.getPassword());
         // Convert java.util.Date to java.sql.Date before setting it.
            java.sql.Date sqlDate = new java.sql.Date(user.getReg_Date().getTime());
            pstatement.setDate(4, sqlDate);
        	
            pstatement.executeUpdate();
        }
    }


    public void updateUser(User user) throws SQLException {
        String query = "UPDATE `User` SET name = ? WHERE id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setString(1, user.getUsername());
            pstatement.setInt(2, user.getId());
            pstatement.executeUpdate();
        }
    }

    public void deleteUser(int userId) throws SQLException {
        String query = "DELETE FROM `User` WHERE id = ?";
        try (PreparedStatement pstatement = con.prepareStatement(query);) {
            pstatement.setInt(1, userId);
            pstatement.executeUpdate();
        }
    }
    
    public List<User> getAllUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        String query = "SELECT * FROM `User`";
        try (PreparedStatement pstatement = con.prepareStatement(query);
             ResultSet result = pstatement.executeQuery();) {
            while (result.next()) {
                User user = new User();
                user.setId(result.getInt("Id"));
                user.setUsername(result.getString("Username"));
                user.setEmail(result.getString("Email"));
                user.setReg_Date(result.getDate("Reg_Date"));
                user.setPassword(result.getString("Password"));
                users.add(user);
            }
        }
        return users;
    }
}
