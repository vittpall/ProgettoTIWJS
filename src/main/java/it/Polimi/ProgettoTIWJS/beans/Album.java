package it.Polimi.ProgettoTIWJS.beans;

import java.util.Date;

public class Album {

	private String Username; 
    private int User_id;
    private String Title;

    private Date Creation_Date;

    public void setCreation_Date(Date creation_Date) {
        Creation_Date = creation_Date;
    }

    public void setTitle(String title) {
        Title = title;
    }

    public void setUser_id(int user_id) {
        User_id = user_id;
    }
    
    public void setUsername(String Username)
    {
    	this.Username = Username;
    } 

    public int getUser_id() {
        return User_id;
    }

    public Date getCreation_Date() {
        return Creation_Date;
    }

    public String getTitle() {
        return Title;
    }
    public String getUsername() {
    	return Username;
    }
}
