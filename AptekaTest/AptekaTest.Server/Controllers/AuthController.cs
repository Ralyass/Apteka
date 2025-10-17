using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace AptekaTest.Server.Controllers;
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
        var user = await _dbContext.Users.SingleOrDefaultAsync(u => u.Username == req.Username);
        if(user == null)
        {
            return Unauthorized(new { error = "Nieprawidłowa nazwa użytkownika lub hasło" });
        }
    }
}
