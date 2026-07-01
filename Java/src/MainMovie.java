public class MainMovie {
//    Polymorphism in action here

    public static void main() {
        //    Although variable type is Movie
//        But on run-time JVM knows that okay this object belongs to class Adventure so that calls the Function of that class        Movie movie=new Adventure("Equalizer");
        Movie movie=new Adventure("Equalizer");
        movie.watchMovie();
    }
}
