using AptekaTest.Server.Models;
using AptekaTest.Server;

namespace AptekaTest.Server.Services
{
    public class UserService
    {
        private readonly MyDbContext _context;
        public UserService(MyDbContext context)
        {
            _context = context;
        }

        public List<Users> GetAllUsers() => _context.Users.ToList();
        public Users GetUserById(int id) => _context.Users.Find(id);
        public Users AddUser(Users user)
        {

            _context.Users.Add(user);
            _context.SaveChanges();
            return user;
        }
        public void UpdateUser(Users user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }


    }
}
