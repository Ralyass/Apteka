using Microsoft.AspNetCore.Mvc;

namespace AptekaTest.Server.Controllers
{
    public class UsersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
