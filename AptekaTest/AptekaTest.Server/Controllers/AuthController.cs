using AptekaTest.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BCrypt.Net;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using System.Threading.Tasks;

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
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginRequest req)
        {
            if (req == null || string.IsNullOrEmpty(req.Username) || string.IsNullOrEmpty(req.Password))
            {
                return BadRequest(new { error = "Nieprawidłowe dane logowania (puste)" });
            }

            var user = await _dbContext.Users
                .SingleOrDefaultAsync(u => u.Username.ToUpper() == req.Username.ToUpper());

            // 🔑 NOWY KROK 1: Sprawdź, czy użytkownik w ogóle istnieje
            if (user == null)
            {
                return Unauthorized(new { error = $"Użytkownik '{req.Username}' nie został znaleziony." });
            }

            bool isPasswordValid;
            try
            {
                var zm = false;
                var passtest= BCrypt.Net.BCrypt.HashPassword(req.Password);
                if (passtest == user.Password)
                {
                    zm = true;
                }
                // 🔑 NOWY KROK 2: Spróbuj zweryfikować hasło
                // Dodajemy Trim(), aby usunąć przypadkowe spacje z bazy lub formularza
                isPasswordValid = BCrypt.Net.BCrypt.Verify(req.Password, user.Password);
                var ch1 = req.Password.Length;
                var ch2 = user.Password.Length;

            }
            catch (BCrypt.Net.SaltParseException)
            {
                // To się dzieje, jeśli hash w bazie jest niepoprawny
                return StatusCode(500, new { error = $"KRYTYCZNY BŁĄD: Hash hasła dla użytkownika '{user.Username}' w bazie danych jest uszkodzony lub nie jest formatem BCrypt. Zaktualizuj hasło." });
            }
            catch (Exception ex)
            {
                // Inny błąd podczas weryfikacji
                return StatusCode(500, new { error = $"Nieoczekiwany błąd podczas weryfikacji hasła: {ex.Message}" });
            }

            // 🔑 NOWY KROK 3: Sprawdź wynik weryfikacji
            if (!isPasswordValid)
            {
                return Unauthorized(new { error = "Podane hasło jest nieprawidłowe." });
            }

            if (string.IsNullOrEmpty(user.Role))
            {
                return StatusCode(500, new { error = $"Krytyczny błąd: Użytkownik '{user.Username}' nie ma przypisanej roli w bazie danych." });
            }

            // ... (reszta kodu logowania jest taka sama) ...
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role),
                new Claim(ClaimTypes.NameIdentifier, user.ID.ToString())
            };

            var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties
            {
                AllowRefresh = true,
                IsPersistent = true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddDays(30)
            };

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(claimsIdentity),
                authProperties);

            return Ok(new
            {
                message = "Zalogowano pomyślnie!",
                username = user.Username,
                role = user.Role
            });
        }

        // ... (reszta kontrolera bez zmian) ...
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            return Ok(new { message = "Wylogowano pomyślnie!" });
        }

        [HttpGet("checkauth")]
        public IActionResult CheckAuth()
        {
            if (User.Identity != null && User.Identity.IsAuthenticated)
            {
                return Ok(new
                {
                    username = User.FindFirst(ClaimTypes.Name)?.Value,
                    role = User.FindFirst(ClaimTypes.Role)?.Value,
                });
            }
            return Unauthorized(new { error = "Brak autoryzacji" });
        }

    }
}