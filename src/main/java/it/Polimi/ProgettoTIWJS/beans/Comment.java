package it.Polimi.ProgettoTIWJS.beans;

import java.time.LocalDateTime;

public class Comment {

    private Integer Image_id;
    private Integer Id;
    private LocalDateTime Publication_date;
    private String Text;
    
    public void setText(String Text)
    {
    	this.Text = Text;
    }

    public void setUser_id(Integer Id) {
        this.Id = Id;
    }
    
    public void setImage_id(Integer image_id) {
        this.Image_id = image_id;
    }

    public void setPublication_date(LocalDateTime localDateTime) {
        this.Publication_date = localDateTime;
    }

    public String getText()
    {
    	return Text;
    }
    
    public LocalDateTime getPublication_date() {
        return Publication_date;
    }

    public Integer getImage_id() {
        return Image_id;
    }

    public Integer getUser_id() {
        return Id;
    }


}

