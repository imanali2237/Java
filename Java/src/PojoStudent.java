public class PojoStudent {
    private  String name;
    private String className;
    private  Double marks;

    public PojoStudent(String name, String className, Double marks) {
        this.name = name;
        this.className = className;
        this.marks = marks;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Double getMarks() {
        return marks;
    }

    public void setMarks(Double marks) {
        this.marks = marks;
    }

    @Override
    public String toString() {
        return "PojoStudent{" +
                "name='" + name + '\'' +
                ", className='" + className + '\'' +
                ", marks=" + marks +
                '}';
    }
}
