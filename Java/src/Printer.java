public class Printer {
    private int tonerLevel;
    private int pagesPrinted;
    private boolean duplex;

    public Printer( int tonerLevel, boolean duplex) {
        this.pagesPrinted = 0;
        this.tonerLevel = (tonerLevel<0||tonerLevel>100)?-1:tonerLevel;
        this.duplex = duplex;
    }

    public int getPagesPrinted() {
        return pagesPrinted;
    }

    public int addToner(int tonerAmount){
        tonerLevel=tonerLevel+tonerAmount;
        if(tonerLevel<0||tonerLevel>100){
            return -1;
        }
        return tonerLevel;

    }
    public int printPages(int pages){
        int jobPages=(duplex)?(pages/2)+(pages%2):pages;
        pagesPrinted=pagesPrinted+jobPages;
        return  jobPages;

    }
}
