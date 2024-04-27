package it.Polimi.ProgettoTIWJS.beans;

import java.util.Date;
//import java.time.LocalDateTime;

public class User {
    
	private int Id;
    private String Username;
    private String Email;
    private String Password;
    private Date Reg_Date;

    public String getUsername() {
        return Username;
    }

    public String getEmail() {
        return Email;
    }

    public Date getReg_Date() {
        return Reg_Date;
    }

    public String getPassword() {
        return Password;
    }
    
    public int getId()
    {
    	return Id;
    }

    public void setEmail(String email) {
        Email = email;
    }

    public void setPassword(String password) {
        Password = password;
    }

    public void setReg_Date(Date currentDateTime) {
        Reg_Date = currentDateTime;
    }

    public void setUsername(String username) {
        Username = username;
    }
    
    public void setId(int Id)
    {
    	this.Id = Id;
    }

}
