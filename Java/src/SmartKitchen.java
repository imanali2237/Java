public class SmartKitchen  {
    CoffeMaker brewMaster;
    DishWasher dishWasher;
    Refrigerator iceBox;



    public SmartKitchen() {
        brewMaster = new CoffeMaker();
        dishWasher = new DishWasher();
        iceBox = new Refrigerator();
    }
    public void setSmartKitchenWork(boolean coffeWork,boolean dishesWork,boolean refrigatorWork){
        brewMaster.setHasWorkToDo(coffeWork);
        dishWasher.setHasWorkToDo(dishesWork);
        iceBox.setHasWorkToDo(refrigatorWork);
    }
    public void doKitchenWork(){
        brewMaster.brewCoffee();
        dishWasher.doDishes();
        iceBox.orderFood();
    }
}
class CoffeMaker{
    private boolean hasWorkToDo;
    public void setHasWorkToDo(boolean hasWorkToDo){
        this.hasWorkToDo=hasWorkToDo;
    }
    public void brewCoffee(){
        if (hasWorkToDo){
            System.out.println("Brewing Coffee");
            hasWorkToDo=false;

        }
    }
}

class Refrigerator{
    private boolean hasWorkToDo;
    public void setHasWorkToDo(boolean hasWorkToDo){
        this.hasWorkToDo=hasWorkToDo;
    }
    public void orderFood(){
        if (hasWorkToDo){
            System.out.println("ordering Food");
            hasWorkToDo=false;

        }
    }
}
class DishWasher{
    private boolean hasWorkToDo;
    public void setHasWorkToDo(boolean hasWorkToDo){
        this.hasWorkToDo=hasWorkToDo;
    }
    public void doDishes (){
        if (hasWorkToDo){
            System.out.println("Washing Dishes");
            hasWorkToDo=false;

        }
    }
}


