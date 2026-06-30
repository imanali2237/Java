public class Player {
    private int health;
    private String name;
    private String weapon;

    public Player(String name) {
        this(100,name,"Sword");
    }

    public Player(int health, String name, String weapon) {
        if(health<=0){
            this.health=1;
        }else if(health>100){
            this.health=100;
        }else{
            this.health = health;
        }
        this.name = name;
        this.weapon = weapon;
    }
    public void loseHealth(int damage){
        health=health-damage;
        if(health<=0){
            health=0;
            System.out.println("Player has been Knocked Out From game");
        }
    }
    public int healthRemaining(){
        return health;
    }
    public void restoreHealth(int extraHealth){
        health=health+extraHealth;
        if(health>100){
            System.out.println("Player Health is full");
            health=100;
        }
    }

    @Override
    public String toString() {
        return "Player{" +
                "health=" + health +
                ", name='" + name + '\'' +
                ", weapon='" + weapon + '\'' +
                '}';
    }
}
