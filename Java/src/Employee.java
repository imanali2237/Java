public class Employee extends Worker {
    private long employeeId;
    private String hireDate;

    public Employee(String name,String birthDate,long employeeId,String hireDate){
        super(birthDate,name);
        this.employeeId=employeeId;
        this.hireDate=hireDate;
    }


}
