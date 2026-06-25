public class ConstructorOverloadingChallenge {
    private String name;
    private String email;
    private String creditLimit;

    public ConstructorOverloadingChallenge() {
        this("jonas","jonas@yopmail.com");

    }


    public ConstructorOverloadingChallenge(String name, String email) {
        this(name,email,"786");
    }


    public ConstructorOverloadingChallenge(String name, String email, String creditLimit){
        this.name=name;
        this.email=email;
        this.creditLimit=creditLimit;
    }

    public String getName() {
        return name;
    }

    public String getCreditLimit() {
        return creditLimit;
    }

    public String getEmail() {
        return email;
    }
}
