using System.Collections.Generic;

namespace AptekaTest.Server.Models
{
    // Ten plik definiuje, jak React będzie wysyłać "koszyk" do serwera

    public class CreateOrderRequest
    {
        // Lista produktów w koszyku
        public List<CartItemDto> CartItems { get; set; }
    }

    public class CartItemDto
    {
        public int MedicineId { get; set; }
        public int Quantity { get; set; }
    }
}