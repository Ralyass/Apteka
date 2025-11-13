using Microsoft.AspNetCore.Mvc;
using AptekaTest.Server.Models;
using AptekaTest.Server.Services;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;

        public UsersController(UserService userService)
        {
            _userService = userService;
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
            var createdUser = _userService.AddUser(user);
            return CreatedAtAction(nameof(Get), new { id = createdUser.ID }, createdUser);
        }

        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] Users user)
        {
            if (id != user.ID) return BadRequest();

            var existingUser = _userService.GetUserById(id);
            if (existingUser == null) return NotFound();

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
