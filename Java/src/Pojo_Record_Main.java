public class Pojo_Record_Main {
    public static void main() {
        PojoStudent student=new PojoStudent("iman","IT",20.0);
        System.out.println(student);
        StudentRecord recordStudent=new StudentRecord("iman","IT",20.0);
        System.out.println(recordStudent);
        System.out.println(recordStudent.marks());
        student.setName("hello");
//        you cannot do that recordStudent.setEmail("hello@yopmail.com") because records are immutable and don't have set method
//        reason because all variables defined in Record are final by default, so you cannot modify a variable that is final

    }
}
