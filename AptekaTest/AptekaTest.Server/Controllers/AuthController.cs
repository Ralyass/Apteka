using AptekaTest.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly MyDbContext _dbContext;

        public AuthController(MyDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (req == null || string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
            {
                return BadRequest(new { error = "Nieprawidłowe dane logowania" });
            }

            var user = await _dbContext.Users
                .SingleOrDefaultAsync(u => u.Username == req.Username);

            if (user == null || user.Password != req.Password)
            {
                return Unauthorized(new { error = "Nieprawidłowa nazwa użytkownika lub hasło" });
            }

            // Zwracamy JSON z wiadomością i nazwą użytkownika
            return Ok(new
            {
                message = "Zalogowano pomyślnie!",
                username = user.Username
            });
        }
    }
}
