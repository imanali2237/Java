public class PolymorphismChallengeCar {
    private String description;
    public PolymorphismChallengeCar(String description){
        this.description=description;
    }
    public void startEngine(){
        System.out.println("Starting the Engine of " +this.getClass().getSimpleName());
        System.out.println("Here is the Description"+ description);
    }
    public void drive(){
        startEngine();
        runEngine();
    }
    protected void runEngine(){
        System.out.println("Running engine of "+this.getClass().getSimpleName() );
    }
}
class GasPoweredCar extends PolymorphismChallengeCar {
    private double avgKmPerLitre;
    private int cylinder;

    public GasPoweredCar(String description, double avgKmPerLitre, int cylinder) {
        super(description);
        this.avgKmPerLitre = avgKmPerLitre;
        this.cylinder = cylinder;
    }

    @Override
    public void drive() {
        super.drive();
        System.out.println("i am driving " + this.getClass().getSimpleName());
        System.out.println("The Car is running using " +" "+cylinder +" and giving average of" + avgKmPerLitre);
    }
}
    class ElectricCar extends PolymorphismChallengeCar{
        private double avgKmPerCharge;
        private int batterySize;
        public ElectricCar(String description, double avgKmPerCharge, int batterySize) {
            super(description);
            this.avgKmPerCharge = avgKmPerCharge;
            this.batterySize = batterySize;
        }

        @Override
        public void drive() {
            super.drive();
            System.out.println("i am driving " + this.getClass().getSimpleName());
            System.out.println("The Car is running on " +" "+batterySize +"batteries and giving an average of " + avgKmPerCharge);
        }

}
class HybridCar extends PolymorphismChallengeCar{
    private double avgKmPerCharge;
    private int batterySize;
    private int cylinders;
    public HybridCar(String description, double avgKmPerCharge, int batterySize,int cylinders) {
        super(description);
        this.avgKmPerCharge = avgKmPerCharge;
        this.batterySize = batterySize;
        this.cylinders=cylinders;
    }

    @Override
    public void drive() {
        super.drive();

        System.out.println("i am driving " + this.getClass().getSimpleName());
        System.out.println("The Car is running using " +" "+cylinders+ "Cylinders" +" and using" + batterySize +"Batteries");
    }

}
