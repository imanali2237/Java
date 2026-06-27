public class Animal {
    private String size;
    private Double weight;
    protected String type;

    public Animal(){}

    public Animal(String size, Double weight, String type) {
        this.size = size;
        this.weight = weight;
        this.type = type;
    }

    @Override
    public String toString() {
        return "Animal{" +
                "size='" + size + '\'' +
                ", weight='" + weight + '\'' +
                ", type='" + type + '\'' +
                '}';
    }

    public void move(String speed){
        System.out.println(type + " "+"moved"+" "+speed);
    }
    public void makeNoice(){
        System.out.println(type+" "+"make noice like  ");
    }
}
