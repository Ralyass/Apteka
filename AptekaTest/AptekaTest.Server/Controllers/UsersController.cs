using Microsoft.AspNetCore.Mvc;
using AptekaTest.Server.Models;
using AptekaTest.Server.Services;
using Microsoft.AspNetCore.Authorization;
using BCrypt.Net;
using System.Collections.Generic;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly MyDbContext _context;

        public UsersController(UserService userService, MyDbContext context)
        {
            _userService = userService;
            _context = context;
        }

        [HttpGet]
        public ActionResult<List<Users>> Get()
        {
            return _userService.GetAllUsers();
        }

        [HttpGet("{id}")]
        public ActionResult<Users> Get(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
                return NotFound();
            return user;
        }

        [HttpPost]
        public ActionResult<Users> Post([FromBody] Users user)
        {
            if (!string.IsNullOrEmpty(user.Password))
            {
                user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);
            }
            else
            {
                // Nie pozwól na stworzenie użytkownika bez hasła
                return BadRequest(new { error = "Hasło jest wymagane" });
            }

            var createdUser = _userService.AddUser(user);
            return CreatedAtAction(nameof(Get), new { id = createdUser.ID }, createdUser);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Users user)
        {
            if (id != user.ID) return BadRequest();

            var existingUser = _userService.GetUserById(id);
            if (existingUser == null) return NotFound();

            user.Password = existingUser.Password; // Zachowaj stare hasło

            _userService.UpdateUser(user);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _userService.DeleteUser(id);
            return NoContent();
        }
    }
}
