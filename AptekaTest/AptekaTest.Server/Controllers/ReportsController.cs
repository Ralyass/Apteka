using Microsoft.AspNetCore.Mvc;

namespace AptekaTest.Server.Controllers
{
    public class ReportsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
