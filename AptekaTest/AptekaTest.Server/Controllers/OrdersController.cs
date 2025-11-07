using Microsoft.AspNetCore.Mvc;

namespace AptekaTest.Server.Controllers
{
    public class OrdersController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
