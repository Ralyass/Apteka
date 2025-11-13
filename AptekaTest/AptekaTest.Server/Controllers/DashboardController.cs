using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AptekaTest.Server.Models;
using System.Formats.Asn1;
using AptekaTest.Server.Services;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : Controller
    {
        private readonly MyDbContext _dbContext;
        private readonly AlertService _alertService;

        public DashboardController(MyDbContext dbContext, AlertService alertService)
        {
            _dbContext = dbContext;
            _alertService = alertService;
        }


        [HttpGet("stats")]

        public async Task<IActionResult> GetStats()
        {
            Console.WriteLine($"📡 Connection string: {_dbContext.Database.GetConnectionString()}");
            Console.WriteLine($"📁 Database name: {_dbContext.Database.GetDbConnection().Database}");

            var totalUsers = await _dbContext.Users.CountAsync();
            var totalMedicines = await _dbContext.Medicines.CountAsync();
            var totalOrders = await _dbContext.Orders.CountAsync();
            var totalSales = await _dbContext.Sales.SumAsync(s => (decimal?)s.Total) ?? 0;

            return Ok(new
            {
                totalUsers,
                totalMedicines,
                totalOrders,
                totalSales
            });
        }

        [HttpGet("alerts")]
        public async Task<IActionResult> GetAlerts()
        {
            var alerts = await _alertService.GetAlertsAsync();
            return Ok(alerts);
        }
    }
}
