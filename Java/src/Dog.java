public class Dog extends Animal {
    private String earShape;
    private String tailShape;
    public Dog(String size,Double weight,String type){
        super(size,weight,type);
    }


    public Dog( Double weight, String type, String earShape, String tailShape) {
        super( weight<15?"small":(weight<35?"medium":"large"), weight, type);
        this.earShape = earShape;
        this.tailShape = tailShape;
    }
    public Dog(String type,double weight){
        this(weight,type,"Perky","Curled");
    }

    @Override
    public String toString() {
        return "Dog{" +
                "earShape='" + earShape + '\'' +
                ", tailShape='" + tailShape + '\'' +
                "} " + super.toString();
    }
    @Override
    public void move(String speed){
        super.move(speed);
        System.out.println("Dogs walk, run and wag their tail");

    }
}
