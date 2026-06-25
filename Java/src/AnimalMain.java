public class AnimalMain {
    public static void main() {
        Animal animal=new Animal("Huge",20.00,"Generic");
        Dog dog=new Dog("Small",20.00,"Zoro");

//        doAnimalStuff(animal,"fast");
//        doAnimalStuff(dog,"slow");
        Dog yorkie=new Dog("Yorkie",15.0);
        Dog retriever=new Dog(65.0,"Lebrador Retriever","Floppy","Swimmer");
        doAnimalStuff(yorkie,"fast");
        doAnimalStuff(retriever,"slow");

    }

    public static void doAnimalStuff(Animal animal,String speed){
        animal.makeNoice();
        animal.move("slow");
        System.out.println(animal);

    }
}
