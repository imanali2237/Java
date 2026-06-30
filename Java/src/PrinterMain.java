public class PrinterMain {
    public static void main() {
        Printer printer=new Printer(50,true);
        System.out.println("initial page count= " + printer.getPagesPrinted());
        int pagesPrinted= printer.printPages(5);
        System.out.printf("Current Job Pages: %d Printer Total: %d %n",pagesPrinted,printer.getPagesPrinted());
    }
}
