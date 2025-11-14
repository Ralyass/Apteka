using AptekaTest.Server.Models;
using AptekaTest.Server.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;
using BCrypt.Net;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // Cały ten kontroler jest chroniony i dostępny tylko dla Admina
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
        }

        // GET /api/users
        [HttpGet]
        public ActionResult<List<Users>> Get()
        {
            // Teraz, gdy UserService jest zarejestrowany w Program.cs, to zadziała
            return _userService.GetAllUsers();
        }

        // GET /api/users/5
        [HttpGet("{id}")]
        public ActionResult<Users> Get(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
                return NotFound();
            return user;
        }

        // POST /api/users
        [HttpPost]
        public ActionResult<Users> Post([FromBody] Users user)
        {
            // Logika hashowania przed zapisem
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            else
            {
                return BadRequest(new { error = "Hasło jest wymagane" });
            }

            var createdUser = _userService.AddUser(user);
            return CreatedAtAction(nameof(Get), new { id = createdUser.ID }, createdUser);
        }

        // PUT /api/users/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Users user)
        {
            if (id != user.ID)
                return BadRequest(new { error = "ID w URL i w ciele żądania się nie zgadzają" });

            var existingUser = _userService.GetUserById(id);
            if (existingUser == null)
                return NotFound(new { error = "Użytkownik o tym ID nie istnieje" });

            // Aktualizujemy tylko te pola, które przyszły z formularza
            existingUser.Username = user.Username;
            existingUser.Role = user.Role;

            // Sprawdź, czy admin podał NOWE hasło w formularzu
            if (!string.IsNullOrEmpty(user.Password))
            {
                // Jeśli tak, zahashuj je i zaktualizuj
                existingUser.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            // Jeśli pole 'password' było puste, nic nie robimy
            // (existingUser.Password zachowuje swój stary hash)

            _userService.UpdateUser(existingUser); // Zapisz zaktualizowany obiekt
            return NoContent(); // Sukces
        }

        // DELETE /api/users/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
                return NotFound();

            _userService.DeleteUser(id);
            return NoContent();
        }
    }
}