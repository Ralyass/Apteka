using Microsoft.AspNetCore.Mvc;

namespace AptekaTest.Server.Controllers
{
    public class MedicinesController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
