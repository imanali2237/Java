import java.util.Scanner;

public class ReadingInputFromTerminal {
   public static void main() {

       int currentYear=2026;
      System.out.println(calculateAgeUsingScanner(currentYear)) ;


    }
    public static  String calculateAgeFromConsole (int currentYear){
       String name=System.console().readLine("What is Your Name?");
       System.out.println("Hey " +name + "Thanks For Taking this course");
        String birthYear=System.console().readLine("What is Your BirthYear? ");
        int age=currentYear-Integer.parseInt(birthYear);
       return "So You are "+ age+" Years old";

    }
    public static  String calculateAgeUsingScanner (int currentYear){
       boolean validAge=false;
        Scanner scanner=new Scanner(System.in);
       String birthYear="";
        System.out.println("What is Your Name?");
        String name=scanner.nextLine();
        System.out.println("Hey" +name + "Thanks For Taking this course");
       while(!validAge){
           try {
               System.out.println("What is Your BirthYear?");
               birthYear=scanner.nextLine();
               if((Integer.parseInt(birthYear)>1906)&&(Integer.parseInt(birthYear)<=currentYear)){
                   validAge=true;
               }


           }catch (NumberFormatException e){
               System.out.println("Invalid Numbers");
           }

       }

        int age=currentYear-Integer.parseInt(birthYear);
        return "So You are "+ age+"Years old";

    }
}
