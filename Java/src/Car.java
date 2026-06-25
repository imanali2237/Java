public class Car {
    private String model;

    public void setDoors(int doors) {
        this.doors = doors;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setBrandName(String brandName) {
        this.brandName = brandName;
    }

    private int doors;

    public String getBrandName() {
        return brandName;
    }

    public String getModel() {
        return model;
    }

    public int getDoors() {
        return doors;
    }

    private String brandName;

    public void describe (){
        System.out.println("Doors: "+doors +" " + "Model" +model +" "+ "BrandName "+ brandName );
    }
}
