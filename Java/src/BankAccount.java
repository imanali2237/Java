//    Constructor Chaining, Calling One constructor from another Constructor
public class BankAccount {
    private int accountNumber;
    private Double accountBalance;
    private String customerName;
    private String email;
    private String phoneNumber;


    public BankAccount(){
        this(112,40.0,"default","default_mail","default_phone");

    }

    public BankAccount(int accountNumber, String customerName) {
        this(accountNumber,40.0,customerName,"default@gmail.com","default_Phone");
    }

    public BankAccount(int accountNumber, Double accountBalance, String customerName, String email, String phoneNumber){
        this.accountNumber=accountNumber;
        this.accountBalance=accountBalance;
        this.customerName=customerName;
        this.email=email;
        this.phoneNumber=phoneNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public Double getAccountBalance() {
        return accountBalance;
    }

    public int getAccountNumber() {
        return accountNumber;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setAccountNumber(int accountNumber) {
        this.accountNumber = accountNumber;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public void setAccountBalance(Double accountBalance) {
        this.accountBalance = accountBalance;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public void getAccountInformation() {
        System.out.println("AccountNumber:" + " " + " " +accountNumber + "Balance:" + " " + accountBalance  +" " + "Name:" + " " + customerName + " "  + "Email:" + " " + email + " " + "PhoneNumber:" +" " + phoneNumber);
    }

    public void deposit(Double amount) {
        if (amount <= 0) {
            return;
        } else {
            accountBalance += amount;
        }


    }

    public void withdraw(Double amount) {
        if (accountBalance == 0) {
            return;
        } else {
            accountBalance -= amount;
        }
    }
}
