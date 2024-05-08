package it.Polimi.ProgettoTIWJS.beans; 

import java.util.List;

public class ImageOrderData {
    private String albumTitle;
    private List<Integer> order;

    // Constructors
    public ImageOrderData() {
    }

    // Getters and Setters
    public String getAlbumTitle() {
        return albumTitle;
    }

    public void setAlbumTitle(String albumTitle) {
        this.albumTitle = albumTitle;
    }

    public List<Integer> getOrder() {
        return order;
    }

    public void setOrder(List<Integer> order) {
        this.order = order;
    }
}
