public class Worker {
    private String name;
    private String birthdate;
    private String endDate;

    public Worker(String birthdate, String name) {
        this.birthdate = birthdate;
        this.name = name;
    }

    public int getAge(){
        int currentYear=2026;
        int birthYear=Integer.parseInt(birthdate.substring(6));
        return  (currentYear-birthYear);
    }

    public double collectPay(){
        return 0.0;
    }
    public void terminate(String endDate){
        this.endDate=endDate;
    }

    @Override
    public String toString() {
        return "Worker{" +
                "name='" + name + '\'' +
                ", birthdate='" + birthdate + '\'' +
                ", endDate='" + endDate + '\'' +
                '}';
    }
}
