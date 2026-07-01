public class Movie {
    private String title;

    public Movie(String title) {
        this.title = title;
    }
    public void watchMovie(){
        System.out.println(title+" "+"is type of "+ " "+this.getClass().getSimpleName());
    }
}
class Adventure extends Movie{
    public Adventure(String title) {
        super(title);
    }

    @Override
    public void watchMovie() {
        super.watchMovie();
        System.out.println("Heavy Scenes \n Action");
    }
}
class Comedy extends Movie{
    public Comedy(String title) {
        super(title);
    }

    @Override
    public void watchMovie() {
        super.watchMovie();
        System.out.println("Funny Scenes \n Funny ho rha hai");
    }
}