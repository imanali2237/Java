public class InheritanceTestMain {
    public static void main() {
        HourlyEmployee hourlyEmployee=new HourlyEmployee("Iman","11/11/1985",20,"04-04-2023",20.0);
      doAllTheThings(hourlyEmployee);
      System.out.println(hourlyEmployee);

    }
    private static    void doAllTheThings (Worker worker){
        worker.collectPay();
        worker.getAge();
        worker.toString();
    }

    @Override
    public String toString() {
        return super.toString();
    }
}

