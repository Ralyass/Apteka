using AptekaTest.Server.Models;
using AptekaTest.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace AptekaTest.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Wszyscy użytkownicy muszą być zalogowani
    public class OrdersController : ControllerBase
    {
        private readonly OrderService _orderService;

        public OrdersController(OrderService orderService)
        {
            _orderService = orderService;
        }

        // POST /api/orders - Tworzenie nowej sprzedaży (paragonu)
        // 🔑 Dostęp ma każdy pracownik (Farmaceuta, Kierownik, Admin)
        [HttpPost]
        [Authorize(Roles = "Admin,Kierownik,Farmaceuta")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            if (request == null || request.CartItems == null || !request.CartItems.Any())
            {
                return BadRequest(new { error = "Koszyk nie może być pusty." });
            }

            try
            {
                var order = await _orderService.CreateOrderAsync(request);
                return Ok(order); // Zwróć nowo stworzony paragon
            }
            catch (Exception ex)
            {
                // Złap błędy z serwisu (np. "Niewystarczająca ilość leku")
                return Conflict(new { error = ex.Message });
            }
        }

        // GET /api/orders - Przeglądanie historii sprzedaży
        // 🔑 Dostęp tylko dla managementu (Kierownik, Admin)
        [HttpGet]
        [Authorize(Roles = "Admin,Kierownik")]
        public async Task<IActionResult> GetOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(orders);
        }
    }
}