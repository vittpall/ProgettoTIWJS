package it.Polimi.ProgettoTIWJS.beans;

import java.util.Date;

public class Image {
    //primary key
    private Integer Image_Id;
    private String Title;
    private Date Creation_Date;
    private String Description;
    private String System_Path;
    
    public Integer getImage_Id() {
        return Image_Id;
    }

    public Date getCreation_Date() {
        return Creation_Date;
    }

    public String getDescription() {
        return Description;
    }

    public String getSystem_Path() {
        return System_Path;
    }

    public String getTitle() {
        return Title;
    }

    public void setCreation_Date(Date creation_Date) {
        Creation_Date = creation_Date;
    }

    public void setImage_Id(Integer image_Id) {
        Image_Id = image_Id;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public void setSystem_Path(String system_Path) {
        System_Path = system_Path;
    }

    public void setTitle(String title) {
        Title = title;
    }
}
