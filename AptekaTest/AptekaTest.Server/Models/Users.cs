namespace AptekaTest.Server.Models
{
    public class Users
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // Admin, Kierownik, Farmaceuta
    }
}
